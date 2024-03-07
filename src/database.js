import { readFile, writeFile } from 'node:fs/promises';
import { URL } from 'node:url';

const databaseFile = new URL('../db.json', import.meta.url);

export class Database {
  #database = {};

  constructor() {
    readFile(databaseFile, 'utf8')
      .then((data) => {
        this.#database = JSON.parse(data);
      })
      .catch(() => {
        this.#database = {};
      });
  }

  #persistData() {
    writeFile(databaseFile, JSON.stringify(this.#database, null, 2));
  }

  #returnDataIndex(table, id) {
    return this.#database[table].findIndex((row) => row.id === id);
  }

  select(table, search) {
    let database = this.#database[table] ?? [];

    if (!Object.keys(search).length) return database;

    return (database = database.filter((row) => {
      return Object.entries(search).some(([key, value]) => {
        const wordsSearch = value.toLowerCase().split(' ');

        return wordsSearch.every((word) =>
          row[key].toLowerCase().includes(word)
        );
      });
    }));
  }

  selectById(table, id) {
    const rowIndex = this.#returnDataIndex(table, id);

    if (rowIndex > -1) {
      return this.#database[table][rowIndex];
    }
  }

  create(table, value) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(value);
    } else {
      this.#database[table] = [value];
    }

    this.#persistData();
  }

  update(table, id, value) {
    const rowIndex = this.#returnDataIndex(table, id);

    if (rowIndex > -1) {
      const data = this.#database[table][rowIndex];
      this.#database[table][rowIndex] = { id, ...data, ...value };
      this.#persistData();
    }
  }

  delete(table, id) {
    const rowIndex = this.#returnDataIndex(table, id);

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1);

      this.#persistData();
    }
  }
}
