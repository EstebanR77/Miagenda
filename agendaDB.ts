import * as SQLite from 'expo-sqlite';

export type Contacto = {
  id: number;
  nombre: string;
  telefono: string;
};

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

async function obtenerBD() {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync('agenda.db');
    const db = await dbPromise;

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS contactos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        telefono TEXT NOT NULL
      );
    `);
  }

  return dbPromise;
}

export async function agregarContacto(nombre: string, telefono: string) {
  const db = await obtenerBD();
  await db.runAsync(
    'INSERT INTO contactos (nombre, telefono) VALUES (?, ?)',
    nombre,
    telefono
  );
}

export async function obtenerContactos(): Promise<Contacto[]> {
  const db = await obtenerBD();
  return db.getAllAsync<Contacto>('SELECT * FROM contactos ORDER BY id DESC');
}

export async function eliminarContacto(id: number) {
  const db = await obtenerBD();
  await db.runAsync('DELETE FROM contactos WHERE id = ?', id);
}
