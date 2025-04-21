import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { SERVER_IP } from '../config'; 

const Auth = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  //alterner entre connexion et inscription
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false); // Gérer la visibilité du mot de passe

  const login = async () => {
    //url en fonction de connexion ou inscription
    const url = isLogin ? `${SERVER_IP}/login` : `${SERVER_IP}/register`;
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
    <View style={styles.container}>
      <Text style={styles.title}>Geocaching App</Text>
      <Text style={styles.title}>{isLogin ? 'Connexion' : 'Inscription'}</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword} // Basculer entre affichage et masquage
        />
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Text style={styles.toggleButtonText}>
            {showPassword ? '👁️' : '🙈'}
          </Text>
        </TouchableOpacity>
      </View>

      <Button title={isLogin ? "Se connecter" : "S'inscrire"} onPress={login} />
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
  passwordContainer: {
    flexDirection: 'row', // Disposition en ligne
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  passwordInput: {
    flex: 1, // Prend tout l'espace disponible
    padding: 10,
  },
  toggleButton: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleButtonText: {
    fontSize: 16,
    color: '#007bff',
  },
});

export default Auth;