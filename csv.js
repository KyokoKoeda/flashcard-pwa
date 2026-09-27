"use strict";

const CsvImporter = (() => {
  function createFormatError(message, rowNumber) {
    const location = rowNumber ? `${rowNumber}行目: ` : "";
    return new Error(`${location}${message}`);
  }

  function parseCsv(text) {
    const rows = [];
    let row = [];
    let field = "";
    let inQuotes = false;
    let quoteClosed = false;
    let rowNumber = 1;
    let endedWithLineBreak = false;

    for (let index = 0; index < text.length; index += 1) {
      const character = text[index];

      if (inQuotes) {
        if (character === '"') {
          if (text[index + 1] === '"') {
            field += '"';
            index += 1;
          } else {
            inQuotes = false;
            quoteClosed = true;
          }
        } else {
          field += character;
          if (character === "\n") rowNumber += 1;
        }
        endedWithLineBreak = false;
        continue;
      }

      if (quoteClosed && character !== "," && character !== "\r" && character !== "\n") {
        throw createFormatError("閉じ引用符の後に不正な文字があります", rowNumber);
      }

      if (character === '"') {
        if (field.length > 0) throw createFormatError("引用符はフィールドの先頭で使用してください", rowNumber);
        inQuotes = true;
        endedWithLineBreak = false;
        continue;
      }

      if (character === ",") {
        row.push(field);
        field = "";
        quoteClosed = false;
        endedWithLineBreak = false;
        continue;
      }

      if (character === "\r" || character === "\n") {
        if (character === "\r" && text[index + 1] === "\n") index += 1;
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
        quoteClosed = false;
        rowNumber += 1;
        endedWithLineBreak = true;
        continue;
      }

      field += character;
      endedWithLineBreak = false;
    }

    if (inQuotes) throw createFormatError("引用符が閉じられていません", rowNumber);
    if (!endedWithLineBreak && (field.length > 0 || row.length > 0)) {
      row.push(field);
      rows.push(row);
    }
    return rows;
  }

  function parseCardCsv(text) {
    const rows = parseCsv(text);
    if (rows.length === 0) throw createFormatError("CSVが空です");

    const header = [...rows[0]];
    header[0] = header[0]?.replace(/^\uFEFF/, "");
    if (header.length !== 2 || header[0] !== "question" || header[1] !== "answer") {
      throw createFormatError("ヘッダーは question,answer にしてください", 1);
    }

    const cards = [];
    rows.slice(1).forEach((columns, index) => {
      const rowNumber = index + 2;
      if (columns.length === 1 && columns[0].trim() === "") return;
      if (columns.length !== 2) throw createFormatError("列数は2列にしてください", rowNumber);
      const question = columns[0].trim();
      const answer = columns[1].trim();
      if (!question || !answer) throw createFormatError("questionとanswerは空にできません", rowNumber);
      cards.push({ question, answer });
    });

    if (cards.length === 0) throw createFormatError("インポートできるカードがありません");
    return cards;
  }

  return { parseCsv, parseCardCsv };
})();

globalThis.CsvImporter = CsvImporter;
