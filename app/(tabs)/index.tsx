import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  actualizarTarea,
  crearTarea,
  eliminarTarea,
  obtenerTareas,
  Tarea,
} from '../../asyncStorageCRUD';

export default function AsyncStorageScreen() {
  const [titulo, setTitulo] = useState('');
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [idEditando, setIdEditando] = useState<string | null>(null);

  const cargarTareas = async () => {
    setTareas(await obtenerTareas());
  };

  useEffect(() => {
    cargarTareas();
  }, []);

  const guardar = async () => {
    const texto = titulo.trim();

    if (!texto) {
      Alert.alert('Aviso', 'Escribe una tarea.');
      return;
    }

    if (idEditando) {
      await actualizarTarea(idEditando, texto);
    } else {
      await crearTarea(texto);
    }

    setTitulo('');
    setIdEditando(null);
    await cargarTareas();
  };

  const editar = (tarea: Tarea) => {
    setTitulo(tarea.titulo);
    setIdEditando(tarea.id);
  };

  const borrar = async (id: string) => {
    await eliminarTarea(id);

    if (idEditando === id) {
      setTitulo('');
      setIdEditando(null);
    }

    await cargarTareas();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>CRUD con AsyncStorage</Text>
      <Text style={styles.subtitulo}>Lista de tareas guardada en el dispositivo</Text>

      <TextInput
        style={styles.input}
        placeholder="Escribe una tarea"
        value={titulo}
        onChangeText={setTitulo}
      />

      <Pressable style={styles.botonPrincipal} onPress={guardar}>
        <Text style={styles.textoBoton}>
          {idEditando ? 'Actualizar tarea' : 'Agregar tarea'}
        </Text>
      </Pressable>

      {idEditando && (
        <Pressable
          style={styles.botonCancelar}
          onPress={() => {
            setTitulo('');
            setIdEditando(null);
          }}>
          <Text>Cancelar edición</Text>
        </Pressable>
      )}

      <FlatList
        data={tareas}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.vacio}>No hay tareas registradas.</Text>}
        renderItem={({ item }) => (
          <View style={styles.tarjeta}>
            <Text style={styles.nombre}>{item.titulo}</Text>
            <View style={styles.acciones}>
              <Pressable style={styles.botonEditar} onPress={() => editar(item)}>
                <Text>Editar</Text>
              </Pressable>
              <Pressable style={styles.botonEliminar} onPress={() => borrar(item.id)}>
                <Text style={styles.textoEliminar}>Eliminar</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 26,
    fontWeight: '700',
    marginTop: 12,
  },
  subtitulo: {
    marginTop: 4,
    marginBottom: 20,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  botonPrincipal: {
    backgroundColor: '#1f6feb',
    borderRadius: 8,
    padding: 13,
    alignItems: 'center',
  },
  textoBoton: {
    color: '#fff',
    fontWeight: '700',
  },
  botonCancelar: {
    padding: 12,
    alignItems: 'center',
  },
  vacio: {
    marginTop: 25,
    textAlign: 'center',
    color: '#777',
  },
  tarjeta: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 14,
    marginTop: 12,
  },
  nombre: {
    fontSize: 17,
    fontWeight: '600',
  },
  acciones: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  botonEditar: {
    backgroundColor: '#e9ecef',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  botonEliminar: {
    backgroundColor: '#dc3545',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  textoEliminar: {
    color: '#fff',
  },
});
