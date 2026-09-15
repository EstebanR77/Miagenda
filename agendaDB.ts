import * as SQLite from 'expo-sqlite';

export type Contacto = {
  id: number;
  nombre: string;
  telefono: string;
};

let db: SQLite.SQLiteDatabase | null = null;

async function obtenerBD() {
  if (!db) {
    db = await SQLite.openDatabaseAsync('agenda.db');
  }
  return db;
}

export async function iniciarBD(): Promise<void> {
  const database = await obtenerBD();

  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS contactos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      telefono TEXT NOT NULL
    );
  `);
}

export async function obtenerContactos(): Promise<Contacto[]> {
  const database = await obtenerBD();
  return await database.getAllAsync<Contacto>(
    'SELECT * FROM contactos ORDER BY id DESC'
  );
}

export async function crearContacto(nombre: string, telefono: string): Promise<void> {
  const database = await obtenerBD();
  await database.runAsync(
    'INSERT INTO contactos (nombre, telefono) VALUES (?, ?)',
    nombre,
    telefono
  );
}

export async function actualizarContacto(
  id: number,
  nombre: string,
  telefono: string
): Promise<void> {
  const database = await obtenerBD();
  await database.runAsync(
    'UPDATE contactos SET nombre = ?, telefono = ? WHERE id = ?',
    nombre,
    telefono,
    id
  );
}

export async function eliminarContacto(id: number): Promise<void> {
  const database = await obtenerBD();
  await database.runAsync('DELETE FROM contactos WHERE id = ?', id);
}
