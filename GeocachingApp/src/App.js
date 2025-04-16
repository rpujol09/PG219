import React, { useState } from 'react';
import { View, Button, Alert, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import Auth from './components/Auth';
import Map from './components/Map';
import axios from 'axios';

const App = () => {
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState('');
  const [geocaches, setGeocaches] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);

  const fetchGeocaches = async () => {
    try {
      const response = await axios.get('http://192.168.57.59:3000/geocaches', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGeocaches(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'Impossible de récupérer les géocaches');
    }
  };

  const logout = () => {
    setToken(null);
    setEmail('');
    setMenuVisible(false);
  };

  return (
    <View style={{ flex: 1 }}>
      {token ? (
        <>
          { /* Bouton pour ouvrir le menu */ }
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setMenuVisible(true)}
          >
            <Text style={styles.menuButtonText}>{email}</Text>
          </TouchableOpacity>
          { /* Menu de navigation */ }
          <Modal
            visible={menuVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setMenuVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.menu}>
                <Text style={styles.menuTitle}>Menu utilisateur</Text>
                <Button title="Géocaches créées" onPress={() => Alert.alert('Vos géocaches')} />
                <Button title="Statistiques" onPress={() => Alert.alert('Vos statistiques')} />
                <Button title="Déconnexion" onPress={logout} />
                <Button title="Fermer" onPress={() => setMenuVisible(false)} />
              </View>
            </View>
          </Modal>

          
          <Map geocaches={geocaches} />
          <Button title="Afficher les géocaches" onPress={fetchGeocaches} />
          <Button title="Se déconnecter" onPress={() => setToken(null)} />
        </>
      ) : (
        <Auth onLogin={(token, email) => {
          setToken(token);
          setEmail(email);
        }} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  menuButton: {
    position: 'absolute',
    top: 40,
    right: 10,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    zIndex: 10,
  },
  menuButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menu: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default App;