"use strict";

const dummyCards = [
  { category: "英単語", question: "apple", answer: "りんご", status: "unlearned" },
  { category: "英単語", question: "library", answer: "図書館", status: "unlearned" },
  { category: "英単語", question: "beautiful", answer: "美しい", status: "unlearned" },
  { category: "英単語", question: "necessary", answer: "必要な", status: "unlearned" },
  { category: "英単語", question: "environment", answer: "環境", status: "unlearned" },
  { category: "英単語", question: "improve", answer: "改善する", status: "unlearned" },
  { category: "英単語", question: "knowledge", answer: "知識", status: "review" },
  { category: "英単語", question: "remember", answer: "覚えている", status: "review" },
  { category: "英単語", question: "challenge", answer: "挑戦", status: "review" },
  { category: "英単語", question: "continue", answer: "続ける", status: "review" },
  { category: "英単語", question: "simple", answer: "簡単な", status: "memorized" },
  { category: "英単語", question: "future", answer: "未来", status: "memorized" },
  { category: "日本史", question: "鎌倉幕府を開いた人物", answer: "源頼朝", status: "unlearned" },
  { category: "日本史", question: "江戸幕府の初代将軍", answer: "徳川家康", status: "unlearned" },
  { category: "日本史", question: "大政奉還が行われた年", answer: "1867年", status: "unlearned" },
  { category: "日本史", question: "平安京に遷都した人物", answer: "桓武天皇", status: "unlearned" },
  { category: "日本史", question: "室町幕府を開いた人物", answer: "足利尊氏", status: "unlearned" },
  { category: "日本史", question: "本能寺の変が起きた年", answer: "1582年", status: "unlearned" },
  { category: "日本史", question: "廃藩置県が行われた年", answer: "1871年", status: "review" },
  { category: "日本史", question: "日清戦争が始まった年", answer: "1894年", status: "review" },
  { category: "日本史", question: "聖徳太子が定めた制度", answer: "冠位十二階", status: "review" },
  { category: "日本史", question: "関ヶ原の戦いが起きた年", answer: "1600年", status: "review" },
  { category: "日本史", question: "最初の元号", answer: "大化", status: "memorized" },
  { category: "日本史", question: "鎖国を終わらせた条約", answer: "日米和親条約", status: "memorized" },
  { category: "科学", question: "水の化学式", answer: "H₂O", status: "unlearned" },
  { category: "科学", question: "地球に最も近い恒星", answer: "太陽", status: "unlearned" },
  { category: "科学", question: "植物が光で養分を作る働き", answer: "光合成", status: "unlearned" },
  { category: "科学", question: "人の体で最も大きい臓器", answer: "皮膚", status: "unlearned" },
  { category: "科学", question: "空気中で最も多い気体", answer: "窒素", status: "unlearned" },
  { category: "科学", question: "物体を地球に引く力", answer: "重力", status: "unlearned" },
  { category: "科学", question: "光が1秒間に進む距離", answer: "約30万km", status: "review" },
  { category: "科学", question: "酸素の元素記号", answer: "O", status: "review" },
  { category: "科学", question: "地球の唯一の天然衛星", answer: "月", status: "review" },
  { category: "科学", question: "音が伝わらない空間", answer: "真空", status: "review" },
  { category: "科学", question: "金の元素記号", answer: "Au", status: "memorized" },
  { category: "科学", question: "標準気圧で水が沸騰する温度", answer: "100℃", status: "memorized" }
];

let cards = [];
let categories = [];
let selectedCategory = "";
let editedCategoryName = null;
let isCategoryEditMode = false;
let isReversed = false;
let studyCards = [];
let currentCardIndex = 0;
let studyResults = [];
let toastTimer;

const elements = {
  screens: document.querySelectorAll(".screen"),
  homeScreen: document.querySelector("#home-screen"),
  categoryScreen: document.querySelector("#category-screen"),
  studyScreen: document.querySelector("#study-screen"),
  summaryScreen: document.querySelector("#summary-screen"),
  resultListScreen: document.querySelector("#result-list-screen"),
  categoryList: document.querySelector("#category-list"),
  toggleCategoryEditButton: document.querySelector("#toggle-category-edit-button"),
  categoryEditIcon: document.querySelector("#category-edit-icon"),
  showCategoryFormButton: document.querySelector("#show-category-form-button"),
  categoryForm: document.querySelector("#category-form"),
  categoryFormLabel: document.querySelector("#category-form-label"),
  categoryNameInput: document.querySelector("#category-name-input"),
  cancelCategoryFormButton: document.querySelector("#cancel-category-form-button"),
  emptyCategoryMessage: document.querySelector("#empty-category-message"),
  totalCount: document.querySelector("#total-count"),
  categoryTitle: document.querySelector("#category-title"),
  categoryCardCount: document.querySelector("#category-card-count"),
  directionToggle: document.querySelector("#direction-toggle"),
  directionLabel: document.querySelector("#direction-label"),
  directionDescription: document.querySelector("#direction-description"),
  newCount: document.querySelector("#new-count"),
  reviewCount: document.querySelector("#category-review-count"),
  randomCount: document.querySelector("#random-count"),
  startNewButton: document.querySelector("#start-new-button"),
  startReviewButton: document.querySelector("#start-review-button"),
  startRandomButton: document.querySelector("#start-random-button"),
  quitStudyButton: document.querySelector("#quit-study-button"),
  studyCategory: document.querySelector("#study-category"),
  studyProgress: document.querySelector("#study-progress"),
  progressBar: document.querySelector("#progress-bar"),
  questionSideLabel: document.querySelector("#question-side-label"),
  answerSideLabel: document.querySelector("#answer-side-label"),
  studyTitle: document.querySelector("#study-title"),
  showAnswerButton: document.querySelector("#show-answer-button"),
  answerArea: document.querySelector("#answer-area"),
  answerText: document.querySelector("#answer-text"),
  editCardButton: document.querySelector("#edit-card-button"),
  editCardForm: document.querySelector("#edit-card-form"),
  editFrontInput: document.querySelector("#edit-front-input"),
  editBackInput: document.querySelector("#edit-back-input"),
  cancelEditButton: document.querySelector("#cancel-edit-button"),
  deleteCardButton: document.querySelector("#delete-card-button"),
  needsReviewButton: document.querySelector("#needs-review-button"),
  memorizedButton: document.querySelector("#memorized-button"),
  resultChart: document.querySelector("#result-chart"),
  resultSummary: document.querySelector("#result-summary"),
  resultListTitle: document.querySelector("#result-list-title"),
  resultList: document.querySelector("#result-list"),
  showResultListButton: document.querySelector("#show-result-list-button"),
  backToCategoryButton: document.querySelector("#back-to-category-button"),
  retryButton: document.querySelector("#retry-button"),
  seedButton: document.querySelector("#seed-button"),
  backupButton: document.querySelector("#backup-button"),
  categoryImportButton: document.querySelector("#category-import-button"),
  categoryCsvInput: document.querySelector("#category-csv-input"),
  toast: document.querySelector("#toast")
};

function getCategoryCards(categoryName) {
  return cards.filter((card) => card.category === categoryName);
}

function createCategoryButton(categoryName) {
  const row = document.createElement("div");
  const button = document.createElement("button");
  const name = document.createElement("span");
  const meta = document.createElement("span");
  const count = document.createElement("span");
  const arrow = document.createElement("span");
  const actions = document.createElement("div");
  const editButton = document.createElement("button");
  const deleteButton = document.createElement("button");
  row.className = "category-row";
  button.className = "category-card";
  button.type = "button";
  name.className = "category-card__name";
  name.textContent = categoryName;
  meta.className = "category-card__meta";
  count.textContent = `${getCategoryCards(categoryName).length}件`;
  arrow.className = "category-card__arrow";
  arrow.textContent = "›";
  meta.append(count, arrow);
  button.append(name, meta);
  button.addEventListener("click", () => openCategory(categoryName));
  actions.className = "category-manage-actions";
  actions.hidden = !isCategoryEditMode;
  editButton.className = "category-icon-button";
  editButton.type = "button";
  editButton.textContent = "編集";
  editButton.setAttribute("aria-label", `${categoryName}の名前を編集`);
  editButton.addEventListener("click", () => openCategoryForm(categoryName));
  deleteButton.className = "category-icon-button category-icon-button--danger";
  deleteButton.type = "button";
  deleteButton.textContent = "削除";
  deleteButton.setAttribute("aria-label", `${categoryName}を削除`);
  deleteButton.addEventListener("click", () => deleteCategory(categoryName));
  actions.append(editButton, deleteButton);
  row.append(button, actions);
  return row;
}

function renderHome() {
  elements.categoryList.replaceChildren(...categories.map(createCategoryButton));
  elements.emptyCategoryMessage.hidden = categories.length > 0;
  elements.totalCount.textContent = `全${cards.length}件`;
  elements.seedButton.disabled = cards.length > 0;
  elements.seedButton.textContent = cards.length > 0 ? "ダミーカード登録済み" : "ダミーカード登録";
  renderCategoryEditMode();
}

function renderCategoryEditMode() {
  elements.toggleCategoryEditButton.setAttribute("aria-pressed", String(isCategoryEditMode));
  elements.toggleCategoryEditButton.setAttribute("aria-label", isCategoryEditMode ? "カテゴリ編集を完了" : "カテゴリを編集");
  elements.categoryEditIcon.textContent = isCategoryEditMode ? "✓" : "✎";
  elements.showCategoryFormButton.hidden = !isCategoryEditMode || !elements.categoryForm.hidden;
  document.querySelectorAll(".category-manage-actions").forEach((actions) => {
    actions.hidden = !isCategoryEditMode;
  });
}

function toggleCategoryEditMode() {
  isCategoryEditMode = !isCategoryEditMode;
  if (!isCategoryEditMode && !elements.categoryForm.hidden) closeCategoryForm();
  renderCategoryEditMode();
}

function openCategoryForm(categoryName = null) {
  editedCategoryName = categoryName;
  elements.categoryFormLabel.textContent = categoryName ? "新しいカテゴリ名" : "カテゴリ名";
  elements.categoryNameInput.value = categoryName ?? "";
  elements.categoryForm.hidden = false;
  elements.showCategoryFormButton.hidden = true;
  elements.categoryNameInput.focus();
}

function closeCategoryForm() {
  editedCategoryName = null;
  elements.categoryForm.reset();
  elements.categoryForm.hidden = true;
  elements.showCategoryFormButton.hidden = !isCategoryEditMode;
}

async function saveCategory(event) {
  event.preventDefault();
  const categoryName = elements.categoryNameInput.value.trim();
  if (!categoryName) return;

  try {
    if (editedCategoryName) {
      await FlashcardDB.renameCategory(editedCategoryName, categoryName);
      showToast(`カテゴリ名を「${categoryName}」に変更しました`);
    } else {
      await FlashcardDB.createCategory(categoryName);
      showToast(`「${categoryName}」を作成しました`);
    }
    closeCategoryForm();
    await reloadCards();
  } catch (error) {
    if (error?.name === "ConstraintError") {
      showToast("同じ名前のカテゴリが既にあります");
      return;
    }
    showDataError("カテゴリを保存できませんでした", error);
  }
}

async function deleteCategory(categoryName) {
  const cardCount = getCategoryCards(categoryName).length;
  const detail = cardCount > 0 ? `\nカテゴリ内のカード${cardCount}件も削除されます。` : "";
  if (!window.confirm(`「${categoryName}」を削除しますか？${detail}\nこの操作は取り消せません。`)) return;

  try {
    await FlashcardDB.deleteCategory(categoryName);
    if (editedCategoryName === categoryName) closeCategoryForm();
    await reloadCards();
    showToast(`「${categoryName}」を削除しました`);
  } catch (error) {
    showDataError("カテゴリを削除できませんでした", error);
  }
}

function openCategory(categoryName) {
  selectedCategory = categoryName;
  renderCategoryScreen();
  showScreen(elements.categoryScreen);
}

function renderCategoryScreen() {
  const categoryCards = getCategoryCards(selectedCategory);
  const unlearnedCount = categoryCards.filter((card) => card.status === "unlearned").length;
  const reviewCount = categoryCards.filter((card) => card.status === "review").length;
  elements.categoryTitle.textContent = selectedCategory;
  elements.categoryCardCount.textContent = `登録カード ${categoryCards.length}件`;
  elements.newCount.textContent = `${unlearnedCount}件`;
  elements.reviewCount.textContent = `${reviewCount}件`;
  elements.randomCount.textContent = `${categoryCards.length}件`;
  elements.startNewButton.disabled = unlearnedCount === 0;
  elements.startReviewButton.disabled = reviewCount === 0;
  elements.startRandomButton.disabled = categoryCards.length === 0;
  elements.directionToggle.setAttribute("aria-checked", String(isReversed));
  elements.directionLabel.textContent = isReversed ? "裏 → 表" : "表 → 裏";
  elements.directionDescription.textContent = isReversed ? "裏面を問題として出題します" : "表面を問題として出題します";
}

function shuffle(items) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }
  return shuffled;
}

function selectCardsForMode(mode) {
  const categoryCards = getCategoryCards(selectedCategory);
  let candidates = categoryCards;
  if (mode === "unlearned") candidates = categoryCards.filter((card) => card.status === "unlearned");
  if (mode === "review") candidates = categoryCards.filter((card) => card.status === "review");
  return shuffle(candidates).slice(0, 10);
}

function startStudy(mode) {
  studyCards = selectCardsForMode(mode);
  beginStudyRun();
}

function beginStudyRun() {
  currentCardIndex = 0;
  studyResults = [];
  showScreen(elements.studyScreen);
  renderCurrentCard();
}

function renderCurrentCard() {
  const card = studyCards[currentCardIndex];
  const currentNumber = currentCardIndex + 1;
  elements.studyCategory.textContent = selectedCategory;
  elements.studyProgress.textContent = `${currentNumber} / ${studyCards.length}`;
  elements.progressBar.style.width = `${(currentNumber / studyCards.length) * 100}%`;
  elements.questionSideLabel.textContent = isReversed ? "裏面" : "表面";
  elements.answerSideLabel.textContent = isReversed ? "表面" : "裏面";
  elements.studyTitle.textContent = isReversed ? card.answer : card.question;
  elements.answerText.textContent = isReversed ? card.question : card.answer;
  resetAnswerArea();
}

function showAnswer() {
  elements.showAnswerButton.hidden = true;
  elements.answerArea.hidden = false;
  elements.editCardButton.focus();
}

function resetAnswerArea() {
  elements.showAnswerButton.hidden = false;
  elements.answerArea.hidden = true;
  elements.editCardForm.hidden = true;
  elements.editCardButton.hidden = false;
}

function openCardEditor() {
  const card = studyCards[currentCardIndex];
  elements.editFrontInput.value = card.question;
  elements.editBackInput.value = card.answer;
  elements.editCardButton.hidden = true;
  elements.editCardForm.hidden = false;
  elements.editFrontInput.focus();
}

function closeCardEditor() {
  elements.editCardForm.hidden = true;
  elements.editCardButton.hidden = false;
  elements.editCardButton.focus();
}

async function saveCardEdit(event) {
  event.preventDefault();
  const question = elements.editFrontInput.value.trim();
  const answer = elements.editBackInput.value.trim();
  if (!question || !answer) return;

  try {
    const card = studyCards[currentCardIndex];
    const updatedCard = await FlashcardDB.updateCard(card.id, { question, answer });
    Object.assign(card, updatedCard);
    const cachedCard = cards.find((item) => item.id === card.id);
    if (cachedCard) Object.assign(cachedCard, updatedCard);
    elements.studyTitle.textContent = isReversed ? card.answer : card.question;
    elements.answerText.textContent = isReversed ? card.question : card.answer;
    closeCardEditor();
    showToast("カードを保存しました");
  } catch (error) {
    showDataError("カードを保存できませんでした", error);
  }
}

async function deleteCurrentCard() {
  const card = studyCards[currentCardIndex];
  const shouldDelete = window.confirm(`「${card.question}」を削除しますか？\nこの操作は取り消せません。`);
  if (!shouldDelete) return;

  elements.deleteCardButton.disabled = true;
  try {
    await FlashcardDB.deleteCard(card.id);
    cards = cards.filter((item) => item.id !== card.id);
    studyCards.splice(currentCardIndex, 1);

    if (studyCards.length === 0) {
      renderCategoryScreen();
      showScreen(elements.categoryScreen);
      showToast("カードを削除しました。出題できるカードがありません");
      return;
    }

    if (currentCardIndex >= studyCards.length) currentCardIndex = studyCards.length - 1;
    renderCurrentCard();
    showToast("カードを削除しました");
  } catch (error) {
    showDataError("カードを削除できませんでした", error);
  } finally {
    elements.deleteCardButton.disabled = false;
  }
}

async function recordResult(result) {
  setStudyActionsDisabled(true);
  try {
    const card = studyCards[currentCardIndex];
    const updatedCard = await FlashcardDB.updateCardStatus(card.id, result);
    Object.assign(card, updatedCard);
    const cachedCard = cards.find((item) => item.id === card.id);
    if (cachedCard) Object.assign(cachedCard, updatedCard);
    studyResults.push({ card, result });
    if (currentCardIndex < studyCards.length - 1) {
      currentCardIndex += 1;
      renderCurrentCard();
      elements.showAnswerButton.focus();
      return;
    }
    renderSummary();
    showScreen(elements.summaryScreen);
  } catch (error) {
    showDataError("学習結果を保存できませんでした", error);
  } finally {
    setStudyActionsDisabled(false);
  }
}

function setStudyActionsDisabled(disabled) {
  elements.needsReviewButton.disabled = disabled;
  elements.memorizedButton.disabled = disabled;
}

function renderSummary() {
  const memorizedCount = studyResults.filter((item) => item.result === "memorized").length;
  const reviewCount = studyResults.length - memorizedCount;
  const memorizedAngle = studyResults.length === 0 ? 0 : (memorizedCount / studyResults.length) * 360;
  elements.resultChart.style.setProperty("--memorized-angle", `${memorizedAngle}deg`);
  elements.resultChart.querySelector("strong").textContent = studyResults.length;
  elements.resultChart.setAttribute("aria-label", `暗記済み${memorizedCount}件、復習要${reviewCount}件`);
  elements.resultSummary.textContent = `暗記済み${memorizedCount}件 / 復習要${reviewCount}件`;
}

function createResultItem(card, result) {
  const item = document.createElement("li");
  const question = document.createElement("span");
  const mark = document.createElement("span");
  const isMemorized = result === "memorized";
  item.className = "result-item";
  question.className = "result-item__front";
  question.textContent = card.question;
  mark.className = `result-mark ${isMemorized ? "result-mark--success" : "result-mark--review"}`;
  mark.setAttribute("aria-label", isMemorized ? "暗記済み" : "復習要");
  mark.textContent = isMemorized ? "○" : "×";
  item.append(question, mark);
  return item;
}

function renderResultList() {
  elements.resultListTitle.textContent = `今回の${studyResults.length}問`;
  elements.resultList.replaceChildren(...studyResults.map(({ card, result }) => createResultItem(card, result)));
}

function retrySameCards() {
  beginStudyRun();
}

function toggleDirection() {
  isReversed = !isReversed;
  renderCategoryScreen();
}

function showScreen(targetScreen) {
  elements.screens.forEach((screen) => { screen.hidden = screen !== targetScreen; });
  window.scrollTo({ top: 0, behavior: "auto" });
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.hidden = false;
  toastTimer = window.setTimeout(() => { elements.toast.hidden = true; }, 2600);
}

function showDataError(message, error) {
  console.error(message, error);
  showToast(`${message}。ページを再読み込みしてお試しください`);
}

async function reloadCards() {
  [cards, categories] = await Promise.all([
    FlashcardDB.getAllCards(),
    FlashcardDB.getAllCategories()
  ]);
  renderHome();
}

async function seedDummyCards() {
  elements.seedButton.disabled = true;
  try {
    const existingCards = await FlashcardDB.getAllCards();
    if (existingCards.length > 0) {
      showToast("カードが登録済みのため追加しませんでした");
      return;
    }
    await FlashcardDB.addCards(dummyCards);
    await reloadCards();
    showToast(`${dummyCards.length}件のダミーカードを登録しました`);
  } catch (error) {
    elements.seedButton.disabled = false;
    showDataError("ダミーカードを登録できませんでした", error);
  }
}

async function readUtf8File(file) {
  const buffer = await file.arrayBuffer();
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(buffer);
  } catch {
    throw new Error("UTF-8形式のCSVを選択してください");
  }
}

async function importCategoryCsv(file) {
  elements.categoryImportButton.disabled = true;
  try {
    const csvText = await readUtf8File(file);
    const parsedCards = CsvImporter.parseCardCsv(csvText);
    const cardsToAdd = parsedCards.map((card) => ({
      ...card,
      category: selectedCategory,
      status: "unlearned"
    }));
    await FlashcardDB.addCards(cardsToAdd);
    await reloadCards();
    renderCategoryScreen();
    showToast(`${selectedCategory}に${cardsToAdd.length}件インポートしました`);
  } catch (error) {
    console.error("CSVインポートに失敗しました", error);
    showToast(error.message || "CSVをインポートできませんでした");
  } finally {
    elements.categoryImportButton.disabled = false;
    elements.categoryCsvInput.value = "";
  }
}

function escapeCsvField(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function createBackupCsv(cardList) {
  const header = ["question", "answer", "category", "status"];
  const rows = cardList.map((card) => [card.question, card.answer, card.category, card.status]);
  return [header, ...rows]
    .map((row) => row.map(escapeCsvField).join(","))
    .join("\r\n");
}

function createBackupFileName() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `flashcard-backup-${year}${month}${day}.csv`;
}

async function exportBackupCsv() {
  elements.backupButton.disabled = true;
  try {
    const allCards = await FlashcardDB.getAllCards();
    if (allCards.length === 0) {
      showToast("出力できるカードがありません");
      return;
    }

    const csv = `\uFEFF${createBackupCsv(allCards)}`;
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = createBackupFileName();
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast(`${allCards.length}件のバックアップを出力しました`);
  } catch (error) {
    showDataError("バックアップを出力できませんでした", error);
  } finally {
    elements.backupButton.disabled = false;
  }
}

async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  try {
    await navigator.serviceWorker.register("./sw.js");
  } catch (error) {
    console.error("オフライン機能を準備できませんでした", error);
  }
}

function addEventListeners() {
  elements.toggleCategoryEditButton.addEventListener("click", toggleCategoryEditMode);
  elements.showCategoryFormButton.addEventListener("click", () => openCategoryForm());
  elements.cancelCategoryFormButton.addEventListener("click", closeCategoryForm);
  elements.categoryForm.addEventListener("submit", saveCategory);
  document.querySelectorAll(".js-home-button").forEach((button) => {
    button.addEventListener("click", async () => {
      try {
        await reloadCards();
        showScreen(elements.homeScreen);
      } catch (error) {
        showDataError("カードを読み込めませんでした", error);
      }
    });
  });
  elements.directionToggle.addEventListener("click", toggleDirection);
  elements.startNewButton.addEventListener("click", () => startStudy("unlearned"));
  elements.startReviewButton.addEventListener("click", () => startStudy("review"));
  elements.startRandomButton.addEventListener("click", () => startStudy("random"));
  elements.quitStudyButton.addEventListener("click", () => {
    renderCategoryScreen();
    showScreen(elements.categoryScreen);
  });
  elements.showAnswerButton.addEventListener("click", showAnswer);
  elements.editCardButton.addEventListener("click", openCardEditor);
  elements.cancelEditButton.addEventListener("click", closeCardEditor);
  elements.editCardForm.addEventListener("submit", saveCardEdit);
  elements.deleteCardButton.addEventListener("click", deleteCurrentCard);
  elements.needsReviewButton.addEventListener("click", () => recordResult("review"));
  elements.memorizedButton.addEventListener("click", () => recordResult("memorized"));
  elements.showResultListButton.addEventListener("click", () => {
    renderResultList();
    showScreen(elements.resultListScreen);
  });
  elements.backToCategoryButton.addEventListener("click", async () => {
    try {
      await reloadCards();
      renderCategoryScreen();
      showScreen(elements.categoryScreen);
    } catch (error) {
      showDataError("カードを読み込めませんでした", error);
    }
  });
  elements.retryButton.addEventListener("click", retrySameCards);
  elements.seedButton.addEventListener("click", seedDummyCards);
  elements.backupButton.addEventListener("click", exportBackupCsv);
  elements.categoryImportButton.addEventListener("click", () => elements.categoryCsvInput.click());
  elements.categoryCsvInput.addEventListener("change", () => {
    const [file] = elements.categoryCsvInput.files;
    if (file) importCategoryCsv(file);
  });
}

async function initializeApp() {
  addEventListeners();
  registerServiceWorker();
  try {
    await reloadCards();
  } catch (error) {
    showDataError("カードを読み込めませんでした", error);
  }
}

initializeApp();
