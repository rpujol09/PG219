import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';

const Auth = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  //alterner entre connexion et inscription
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false); // Gérer la visibilité du mot de passe

  const login = async () => {
    //url en fonction de connexion ou inscription
    const url = isLogin ? 'http://192.168.57.59:3000/login' : 'http://192.168.57.59:3000/register';
    // les utilisiateurs doivent remplir tous les champs
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    try {
      const response = await axios.post(url , { email, password });
      if (response.status === 200) {
        //Alert.alert(isLogin ? 'Connexion réussie ' : 'Inscription réussie');

        
        //si l'utilisateur se connecte, on lui renvoie le token
        if (isLogin) {
          Alert.alert('Connexion réussie');
          onLogin(response.data.token, email);
        } else {
          Alert.alert('Inscription réussie', 'Vous pouvez maintenant vous connecter');
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
        secureTextEntry= {!showPassword} // Afficher ou masquer le mot de passe
      />
      <Button
        title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        onPress={() => setShowPassword(!showPassword)} // Changer la visibilité du mot de passe
      />


      
      <Button title={isLogin ? "Se connecter" :"S'inscrire"} onPress={login} />
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