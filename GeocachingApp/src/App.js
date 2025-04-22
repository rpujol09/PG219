import React, { useEffect, useState } from 'react';
import { View, Button, Alert, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import Auth from './components/Auth';
import Map from './components/Map';
import Form from './components/Form';
import MyGeocaches from './components/MyGeocaches';
import FloatingButtons from './components/FloatingButtons';
import BottomBar from './components/BottomBar';
import Profile from './components/Profile';
import axios from 'axios';
import { ScrollView } from 'react-native';
import { SERVER_IP } from './config'; // depuis src/


const App = () => {
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState('');
  const [geocaches, setGeocaches] = useState([]);
  const [myGeocaches, setMyGeocaches] = useState([]);
  const [activeScreen, setActiveScreen] = useState('map');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showMyGeocaches, setShowMyGeocaches] = useState(false);



  const fetchGeocaches = async () => {
    try {
      const response = await axios.get(`${SERVER_IP}/geocaches`, {
        headers: { Authorization: token },
      });

      setGeocaches(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'Impossible de récupérer les géocaches');
    }
  };

  const fetchMyGeocaches = async() => {
    try {
      const response = await axios.get(`${SERVER_IP}/mygeocaches`, {
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

  useEffect(() => {
    if (token) {
      fetchGeocaches();
      fetchMyGeocaches();
    }
  }, [token]);

  return (
    <View style={styles.container}>
      {token ? (
        <>
          {/* Afficher la carte */}
          <Map geocaches={geocaches} myGeocaches={myGeocaches}
          onMarkAsFound={async (id) => {
            try {
              await axios.post(`${SERVER_IP}/geocaches/${id}/found`, {}, {
                headers: { Authorization: token }
              });
              // Recharge les données après le changement
              await fetchGeocaches();
              await fetchMyGeocaches();
            } catch (err) {
              console.error("Erreur lors du marquage :", err);
              Alert.alert("Erreur", "Impossible de marquer le géocache comme trouvé");
            }
          }}
          />

          {/* Afficher bouton flottants*/}
          <FloatingButtons onAddGeocache={() => setShowAddForm(true)} onNearby={fetchGeocaches} />
          <BottomBar 
            onNavigate={(screen) => {
              if (screen === 'profile') {
                setShowProfile(true); // Ouvrir le modal du profil
              } else if (screen === 'myGeocaches') {
                setShowMyGeocaches(true);
              }            
              else {
                setActiveScreen(screen);
              }
            }} 
            onLogout={logout} 
          />
          {/* Afficher mes géocaches ou map */}
          <Modal
            visible={showMyGeocaches}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowMyGeocaches(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <MyGeocaches
                  token={token}
                  onNavigate={() => setShowMyGeocaches(false)} // Fermer le modal
                />
              </View>
            </View>
          </Modal>

          
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
                    fetchMyGeocaches();
                    setShowAddForm(false);
                  }}
                />
              </View>
            </View>
          </Modal>

            {/* Afficher le Profil */}
          <Modal
            visible={showProfile}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowProfile(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Profile 
                  token={token} 
                  onNavigate={() => setShowProfile(false)} // Fermer le modal
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