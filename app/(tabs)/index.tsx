import { useEffect, useState } from 'react';
import {
  Button,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { guardarModo, obtenerModo } from '../../localStorage';
import {
  agregarContacto,
  Contacto,
  eliminarContacto,
  obtenerContactos,
} from '../../agendaDB';

export default function HomeScreen() {
  const [modo, setModo] = useState<'claro' | 'oscuro'>('claro');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [contactos, setContactos] = useState<Contacto[]>([]);

  const cargarContactos = async () => {
    const datos = await obtenerContactos();
    setContactos(datos);
  };

  useEffect(() => {
    const cargarDatos = async () => {
      setModo(await obtenerModo());
      await cargarContactos();
    };

    cargarDatos();
  }, []);

  const cambiarModo = async () => {
    const nuevoModo = modo === 'claro' ? 'oscuro' : 'claro';
    await guardarModo(nuevoModo);
    setModo(nuevoModo);
  };

  const guardarContacto = async () => {
    if (!nombre.trim() || !telefono.trim()) return;

    await agregarContacto(nombre.trim(), telefono.trim());
    setNombre('');
    setTelefono('');
    await cargarContactos();
  };

  const borrarContacto = async (id: number) => {
    await eliminarContacto(id);
    await cargarContactos();
  };

  const oscuro = modo === 'oscuro';

  return (
    <SafeAreaView style={[styles.container, oscuro && styles.containerOscuro]}>
      <Text style={[styles.titulo, oscuro && styles.textoOscuro]}>Mi Agenda</Text>

      <View style={styles.seccion}>
        <Text style={[styles.subtitulo, oscuro && styles.textoOscuro]}>
          AsyncStorage
        </Text>
        <Text style={[styles.texto, oscuro && styles.textoOscuro]}>
          Modo guardado: {modo}
        </Text>
        <Button title="Cambiar modo" onPress={cambiarModo} />
      </View>

      <View style={styles.seccion}>
        <Text style={[styles.subtitulo, oscuro && styles.textoOscuro]}>
          Contactos con SQLite
        </Text>

        <TextInput
          style={[styles.input, oscuro && styles.inputOscuro]}
          placeholder="Nombre"
          placeholderTextColor={oscuro ? '#bbbbbb' : '#777777'}
          value={nombre}
          onChangeText={setNombre}
        />

        <TextInput
          style={[styles.input, oscuro && styles.inputOscuro]}
          placeholder="Teléfono"
          placeholderTextColor={oscuro ? '#bbbbbb' : '#777777'}
          keyboardType="phone-pad"
          value={telefono}
          onChangeText={setTelefono}
        />

        <Button title="Guardar contacto" onPress={guardarContacto} />
      </View>

      <FlatList
        data={contactos}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={[styles.texto, oscuro && styles.textoOscuro]}>
            No hay contactos guardados.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.contacto}>
            <View style={styles.datosContacto}>
              <Text style={[styles.nombre, oscuro && styles.textoOscuro]}>
                {item.nombre}
              </Text>
              <Text style={[styles.texto, oscuro && styles.textoOscuro]}>
                {item.telefono}
              </Text>
            </View>
            <Button title="Eliminar" onPress={() => borrarContacto(item.id)} />
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
    backgroundColor: '#ffffff',
  },
  containerOscuro: {
    backgroundColor: '#1c1c1c',
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  texto: {
    fontSize: 16,
    marginBottom: 10,
  },
  textoOscuro: {
    color: '#ffffff',
  },
  seccion: {
    marginBottom: 25,
  },
  input: {
    borderWidth: 1,
    borderColor: '#999999',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    color: '#000000',
  },
  inputOscuro: {
    borderColor: '#dddddd',
    color: '#ffffff',
  },
  contacto: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  datosContacto: {
    flex: 1,
  },
  nombre: {
    fontSize: 17,
    fontWeight: 'bold',
  },
});
