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
  actualizarContacto,
  Contacto,
  crearContacto,
  eliminarContacto,
  iniciarBD,
  obtenerContactos,
} from '../../agendaDB';

export default function SQLiteScreen() {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [contactos, setContactos] = useState<Contacto[]>([]);
  const [idEditando, setIdEditando] = useState<number | null>(null);

  const cargarContactos = async () => {
    setContactos(await obtenerContactos());
  };

  useEffect(() => {
    const preparar = async () => {
      await iniciarBD();
      await cargarContactos();
    };

    preparar();
  }, []);

  const guardar = async () => {
    const nombreLimpio = nombre.trim();
    const telefonoLimpio = telefono.trim();

    if (!nombreLimpio || !telefonoLimpio) {
      Alert.alert('Aviso', 'Completa nombre y teléfono.');
      return;
    }

    if (idEditando !== null) {
      await actualizarContacto(idEditando, nombreLimpio, telefonoLimpio);
    } else {
      await crearContacto(nombreLimpio, telefonoLimpio);
    }

    setNombre('');
    setTelefono('');
    setIdEditando(null);
    await cargarContactos();
  };

  const editar = (contacto: Contacto) => {
    setNombre(contacto.nombre);
    setTelefono(contacto.telefono);
    setIdEditando(contacto.id);
  };

  const borrar = async (id: number) => {
    await eliminarContacto(id);

    if (idEditando === id) {
      setNombre('');
      setTelefono('');
      setIdEditando(null);
    }

    await cargarContactos();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>CRUD con SQLite</Text>
      <Text style={styles.subtitulo}>Contactos almacenados en una base de datos local</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />

      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        value={telefono}
        onChangeText={setTelefono}
        keyboardType="phone-pad"
      />

      <Pressable style={styles.botonPrincipal} onPress={guardar}>
        <Text style={styles.textoBoton}>
          {idEditando !== null ? 'Actualizar contacto' : 'Agregar contacto'}
        </Text>
      </Pressable>

      {idEditando !== null && (
        <Pressable
          style={styles.botonCancelar}
          onPress={() => {
            setNombre('');
            setTelefono('');
            setIdEditando(null);
          }}>
          <Text>Cancelar edición</Text>
        </Pressable>
      )}

      <FlatList
        data={contactos}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.vacio}>No hay contactos registrados.</Text>}
        renderItem={({ item }) => (
          <View style={styles.tarjeta}>
            <Text style={styles.nombre}>{item.nombre}</Text>
            <Text>{item.telefono}</Text>
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
    backgroundColor: '#198754',
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
    marginBottom: 3,
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
