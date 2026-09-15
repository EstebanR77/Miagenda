import AsyncStorage from '@react-native-async-storage/async-storage';

const CLAVE_MODO = 'modoApp';

export async function guardarModo(modo: 'claro' | 'oscuro') {
  await AsyncStorage.setItem(CLAVE_MODO, modo);
}

export async function obtenerModo(): Promise<'claro' | 'oscuro'> {
  const modo = await AsyncStorage.getItem(CLAVE_MODO);
  return modo === 'oscuro' ? 'oscuro' : 'claro';
}
