import React, { useState } from 'react';
import { View, Button, Alert, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import Auth from './components/Auth';
import Map from './components/Map';
import Form from './components/Form';
import MyGeocaches from './components/MyGeocaches';
import FloatingButtons from './components/FloatingButtons';
import BottomBar from './components/BottomBar';
import axios from 'axios';
import { ScrollView } from 'react-native';

const App = () => {
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState('');
  const [geocaches, setGeocaches] = useState([]);
  const [myGeocaches, setMyGeocaches] = useState([]);
  const [activeScreen, setActiveScreen] = useState('map');
  const [showAddForm, setShowAddForm] = useState(false);


  const fetchGeocaches = async () => {
    try {
      const response = await axios.get('http://10.0.2.2:3000/geocaches', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setGeocaches(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'Impossible de récupérer les géocaches');
    }
  };

  const fetchMyGeocaches = async() => {
    try {
      const response = await axios.get("http://10.0.2.2:3000/my-geocaches", {
        headers: { Authorization: token },
      });
      setMyGeocaches(response.data);
    } 
    catch (error) {
      console.error("Erreur axios :", error.response?.data || error.message);
      Alert.alert("Erreur", "Impossible de récupérer vos géocaches");
    }
  };

  const logout = () => {
    setToken(null);
    setEmail('');
  };

  return (
    <View style={styles.container}>
      {token ? (
        <>
          <Map geocaches={geocaches} />
          <FloatingButtons onAddGeocache={() => setShowAddForm(true)} onNearby={fetchGeocaches} />
          <BottomBar 
            onNavigate={setActiveScreen} 
            onLogout={logout} 
          />
          {activeScreen === 'myGeocaches' && (
            <MyGeocaches token={token} />
          )}

          {/* Afficher la carte ou le formulaire en fonction de l'écran actif */}
          <Modal
            visible={showAddForm}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowAddForm(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Form 
                  token={token} 
                  onGeocacheAdded={() => {
                    fetchGeocaches();
                    setShowAddForm(false);
                  }}
                />
              </View>
            </View>
          </Modal>
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
  container: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
});

export default App;