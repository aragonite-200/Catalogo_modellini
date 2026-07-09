import { type SQLiteDatabase } from 'expo-sqlite';

export async function initializeDatabase(db: SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS modellini (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      marca TEXT NOT NULL,
      modello TEXT NOT NULL,
      produttore TEXT NOT NULL,
      versione TEXT NULL,
      prezzo REAL NULL,
      scala TEXT NOT NULL,
      foto_path TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}