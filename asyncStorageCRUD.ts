import AsyncStorage from '@react-native-async-storage/async-storage';

export type Tarea = {
  id: string;
  titulo: string;
};

const CLAVE_TAREAS = 'tareas';

export async function obtenerTareas(): Promise<Tarea[]> {
  const datos = await AsyncStorage.getItem(CLAVE_TAREAS);
  return datos ? JSON.parse(datos) : [];
}

export async function crearTarea(titulo: string): Promise<void> {
  const tareas = await obtenerTareas();
  const nuevaTarea: Tarea = {
    id: Date.now().toString(),
    titulo,
  };

  await AsyncStorage.setItem(
    CLAVE_TAREAS,
    JSON.stringify([...tareas, nuevaTarea])
  );
}

export async function actualizarTarea(id: string, titulo: string): Promise<void> {
  const tareas = await obtenerTareas();
  const actualizadas = tareas.map((tarea) =>
    tarea.id === id ? { ...tarea, titulo } : tarea
  );

  await AsyncStorage.setItem(CLAVE_TAREAS, JSON.stringify(actualizadas));
}

export async function eliminarTarea(id: string): Promise<void> {
  const tareas = await obtenerTareas();
  const restantes = tareas.filter((tarea) => tarea.id !== id);

  await AsyncStorage.setItem(CLAVE_TAREAS, JSON.stringify(restantes));
}
