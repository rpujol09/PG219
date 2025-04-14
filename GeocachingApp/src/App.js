import React, { useState } from 'react';
import { View, Button, Alert } from 'react-native';
import Auth from './components/Auth';
import Map from './components/Map';
import axios from 'axios';

const App = () => {
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState('');
  const [geocaches, setGeocaches] = useState([]);
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

  return (
    <View style={{ flex: 1 }}>
      {token ? (
        <>
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

export default App;