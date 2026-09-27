"use strict";

const FlashcardDB = (() => {
  const DATABASE_NAME = "flashcard-pwa";
  const DATABASE_VERSION = 2;
  const CARD_STORE = "cards";
  const CATEGORY_STORE = "categories";
  const VALID_STATUSES = ["unlearned", "review", "memorized"];

  let databasePromise;

  function requestToPromise(request) {
    return new Promise((resolve, reject) => {
      request.addEventListener("success", () => resolve(request.result));
      request.addEventListener("error", () => reject(request.error));
    });
  }

  function transactionToPromise(transaction) {
    return new Promise((resolve, reject) => {
      transaction.addEventListener("complete", resolve);
      transaction.addEventListener("abort", () => reject(transaction.error));
      transaction.addEventListener("error", () => reject(transaction.error));
    });
  }

  function openDatabase() {
    if (databasePromise) return databasePromise;

    databasePromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

      request.addEventListener("upgradeneeded", () => {
        const database = request.result;
        let cardStore;
        if (!database.objectStoreNames.contains(CARD_STORE)) {
          cardStore = database.createObjectStore(CARD_STORE, { keyPath: "id", autoIncrement: true });
          cardStore.createIndex("category", "category", { unique: false });
          cardStore.createIndex("status", "status", { unique: false });
          cardStore.createIndex("category_status", ["category", "status"], { unique: false });
        } else {
          cardStore = request.transaction.objectStore(CARD_STORE);
        }

        if (!database.objectStoreNames.contains(CATEGORY_STORE)) {
          const categoryStore = database.createObjectStore(CATEGORY_STORE, { keyPath: "name" });
          cardStore.openCursor().addEventListener("success", (event) => {
            const cursor = event.target.result;
            if (!cursor) return;
            categoryStore.put({ name: cursor.value.category });
            cursor.continue();
          });
        }
      });

      request.addEventListener("success", () => resolve(request.result));
      request.addEventListener("error", () => {
        databasePromise = undefined;
        reject(request.error);
      });
    });

    return databasePromise;
  }

  function validateStatus(status) {
    if (!VALID_STATUSES.includes(status)) {
      throw new Error(`不正なstatusです: ${status}`);
    }
  }

  function normalizeCard(card) {
    const question = card.question?.trim();
    const answer = card.answer?.trim();
    const category = card.category?.trim();
    const status = card.status ?? "unlearned";
    validateStatus(status);
    if (!question || !answer || !category) {
      throw new Error("question、answer、categoryは必須です");
    }
    return { question, answer, category, status };
  }

  async function addCard(card) {
    const database = await openDatabase();
    const normalizedCard = normalizeCard(card);
    const transaction = database.transaction([CARD_STORE, CATEGORY_STORE], "readwrite");
    transaction.objectStore(CATEGORY_STORE).put({ name: normalizedCard.category });
    const request = transaction.objectStore(CARD_STORE).add(normalizedCard);
    const id = await requestToPromise(request);
    await transactionToPromise(transaction);
    return { id, ...normalizedCard };
  }

  async function addCards(cardList) {
    const normalizedCards = cardList.map(normalizeCard);
    const database = await openDatabase();
    const transaction = database.transaction([CARD_STORE, CATEGORY_STORE], "readwrite");
    const store = transaction.objectStore(CARD_STORE);
    const categoryStore = transaction.objectStore(CATEGORY_STORE);
    normalizedCards.forEach((card) => {
      categoryStore.put({ name: card.category });
      store.add(card);
    });
    await transactionToPromise(transaction);
    return normalizedCards.length;
  }

  async function getAllCards() {
    const database = await openDatabase();
    const transaction = database.transaction(CARD_STORE, "readonly");
    return requestToPromise(transaction.objectStore(CARD_STORE).getAll());
  }

  async function getCardsByCategory(category) {
    const database = await openDatabase();
    const transaction = database.transaction(CARD_STORE, "readonly");
    return requestToPromise(transaction.objectStore(CARD_STORE).index("category").getAll(category));
  }

  async function getCardsByStatus(status) {
    validateStatus(status);
    const database = await openDatabase();
    const transaction = database.transaction(CARD_STORE, "readonly");
    return requestToPromise(transaction.objectStore(CARD_STORE).index("status").getAll(status));
  }

  async function getCardsByCategoryAndStatus(category, status) {
    validateStatus(status);
    const database = await openDatabase();
    const transaction = database.transaction(CARD_STORE, "readonly");
    const index = transaction.objectStore(CARD_STORE).index("category_status");
    return requestToPromise(index.getAll([category, status]));
  }

  async function updateCardStatus(id, status) {
    validateStatus(status);
    const database = await openDatabase();
    const transaction = database.transaction(CARD_STORE, "readwrite");
    const store = transaction.objectStore(CARD_STORE);
    const card = await requestToPromise(store.get(id));
    if (!card) throw new Error(`カードが見つかりません: ${id}`);
    card.status = status;
    store.put(card);
    await transactionToPromise(transaction);
    return card;
  }

  async function updateCard(id, changes) {
    const database = await openDatabase();
    const transaction = database.transaction(CARD_STORE, "readwrite");
    const store = transaction.objectStore(CARD_STORE);
    const currentCard = await requestToPromise(store.get(id));
    if (!currentCard) throw new Error(`カードが見つかりません: ${id}`);
    const updatedCard = { id, ...normalizeCard({ ...currentCard, ...changes }) };
    store.put(updatedCard);
    await transactionToPromise(transaction);
    return updatedCard;
  }

  async function deleteCard(id) {
    const database = await openDatabase();
    const transaction = database.transaction(CARD_STORE, "readwrite");
    const store = transaction.objectStore(CARD_STORE);
    const existingCard = await requestToPromise(store.get(id));
    if (!existingCard) throw new Error(`カードが見つかりません: ${id}`);
    store.delete(id);
    await transactionToPromise(transaction);
    return existingCard;
  }

  async function getCategoryCounts() {
    const allCards = await getAllCards();
    return allCards.reduce((counts, card) => {
      counts[card.category] = (counts[card.category] ?? 0) + 1;
      return counts;
    }, {});
  }

  async function getStatusCounts() {
    const database = await openDatabase();
    const transaction = database.transaction(CARD_STORE, "readonly");
    const index = transaction.objectStore(CARD_STORE).index("status");
    const entries = await Promise.all(VALID_STATUSES.map(async (status) => [status, await requestToPromise(index.count(status))]));
    return Object.fromEntries(entries);
  }

  function normalizeCategoryName(name) {
    const normalizedName = name?.trim();
    if (!normalizedName) throw new Error("カテゴリ名を入力してください");
    return normalizedName;
  }

  async function getAllCategories() {
    const database = await openDatabase();
    const transaction = database.transaction(CATEGORY_STORE, "readonly");
    const categories = await requestToPromise(transaction.objectStore(CATEGORY_STORE).getAll());
    return categories.map((category) => category.name).sort((left, right) => left.localeCompare(right, "ja"));
  }

  async function createCategory(name) {
    const normalizedName = normalizeCategoryName(name);
    const database = await openDatabase();
    const transaction = database.transaction(CATEGORY_STORE, "readwrite");
    transaction.objectStore(CATEGORY_STORE).add({ name: normalizedName });
    await transactionToPromise(transaction);
    return normalizedName;
  }

  async function renameCategory(currentName, nextName) {
    const normalizedCurrentName = normalizeCategoryName(currentName);
    const normalizedNextName = normalizeCategoryName(nextName);
    if (normalizedCurrentName === normalizedNextName) return normalizedNextName;

    const database = await openDatabase();
    const transaction = database.transaction([CATEGORY_STORE, CARD_STORE], "readwrite");
    const categoryStore = transaction.objectStore(CATEGORY_STORE);
    const cardIndex = transaction.objectStore(CARD_STORE).index("category");
    categoryStore.add({ name: normalizedNextName });
    categoryStore.delete(normalizedCurrentName);
    cardIndex.openCursor(normalizedCurrentName).addEventListener("success", (event) => {
      const cursor = event.target.result;
      if (!cursor) return;
      cursor.update({ ...cursor.value, category: normalizedNextName });
      cursor.continue();
    });
    await transactionToPromise(transaction);
    return normalizedNextName;
  }

  async function deleteCategory(name) {
    const normalizedName = normalizeCategoryName(name);
    const database = await openDatabase();
    const transaction = database.transaction([CATEGORY_STORE, CARD_STORE], "readwrite");
    transaction.objectStore(CATEGORY_STORE).delete(normalizedName);
    transaction.objectStore(CARD_STORE).index("category").openCursor(normalizedName).addEventListener("success", (event) => {
      const cursor = event.target.result;
      if (!cursor) return;
      cursor.delete();
      cursor.continue();
    });
    await transactionToPromise(transaction);
  }

  return {
    DATABASE_NAME,
    CARD_STORE,
    CATEGORY_STORE,
    VALID_STATUSES,
    addCard,
    addCards,
    getAllCards,
    getCardsByCategory,
    getCardsByStatus,
    getCardsByCategoryAndStatus,
    updateCardStatus,
    updateCard,
    deleteCard,
    getCategoryCounts,
    getStatusCounts,
    getAllCategories,
    createCategory,
    renameCategory,
    deleteCategory
  };
})();

window.FlashcardDB = FlashcardDB;
