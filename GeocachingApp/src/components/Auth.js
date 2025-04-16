import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';

const Auth = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  //alterner entre connexion et inscription
  const [isLogin, setIsLogin] = useState(true);

  const login = async () => {
    //url en fonction de connexion ou inscription
    const url = isLogin ? 'http://10.0.2.2:3000/login' : 'http://10.0.2.2:3000/register';
    // les utilisiateurs doivent remplir tous les champs
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    try {
      const response = await axios.post(url , { email, password });
      if (response.status === 200) {
        Alert.alert(isLogin ? 'Connexion réussie' : 'Inscription réussie');
        //si l'utilisateur se connecte, on lui renvoie le token
        if (isLogin) {
          onLogin(response.data.token, email);
        }
      }
    } catch (error) {
      console.error(error);
       // Gestion des erreurs spécifiques
      if (error.response) {
        // Erreur côté serveur (exemple : 401 Unauthorized)
        Alert.alert('Erreur', error.response.data.message || `Erreur ${error.response.status}`);
      } else if (error.request) {
        // Pas de réponse du serveur
        Alert.alert('Erreur', 'Aucune réponse du serveur. Vérifiez votre connexion.');
      } else {
        // Erreur lors de la configuration de la requête
        Alert.alert('Erreur', 'Une erreur est survenue lors de la requête.');
      }

    }
  };

  return (
    //contenue de la page d'authentification (Inscription ou Connexion)
    <View style={styles.container}>
      <Text style={styles.title}>Geocaching App</Text>    

      <Text style={styles.title}>{isLogin ? 'Connexion' : 'Inscription'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title={isLogin ? "Se connecter" :"S'inscire"} onPress={login} />
      <Button 
        title={isLogin ? "Pas encore de compte ? Inscrivez-vous" : "Déjà un compte ? Connectez-vous"}
        onPress={() => setIsLogin(!isLogin)}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default Auth;