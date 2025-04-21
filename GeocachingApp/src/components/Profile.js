import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import { launchImageLibrary } from 'react-native-image-picker';
import { SERVER_IP } from '../config'; 


const Profile = ({ token, onNavigate }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${SERVER_IP}/profile`, {
          headers: { Authorization: token },
        });
        setProfile(response.data);
      } catch (error) {
        console.error(error);
        Alert.alert('Erreur', 'Impossible de récupérer le profil');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleSelectProfilePicture = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('Sélection annulée');
      } else if (response.errorMessage) {
        console.error("Erreur lors de la sélection de l'image :", response.errorMessage);
      } else {
        const uri = response.assets[0].uri;
        setProfilePicture(uri);
      }
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Impossible de charger le profil.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.modalBackground}>
      <View style={styles.container}>
        <Text style={styles.title}>👤 Mon Profil</Text>

        <TouchableOpacity onPress={handleSelectProfilePicture} style={styles.pictureContainer}>
          <Image
            source={profilePicture ? { uri: profilePicture } : require('../default-profile.png')}
            style={styles.profilePicture}
          />
          <View style={styles.cameraIcon}>
            <Text style={{ fontSize: 16 }}>📷</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.changePictureText}>Changer la photo de profil</Text>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Email :</Text>
          <Text style={styles.value}>{profile.email}</Text>
        </View>

   

        <TouchableOpacity style={styles.button} onPress={onNavigate}>
          <Text style={styles.buttonText}>Fermer le profil</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#eef2f5',
  },
  container: {
    width: '90%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  pictureContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#007bff',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 5,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  changePictureText: {
    color: '#007bff',
    fontSize: 16,
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    width: '100%',
    padding: 15,
    marginBottom: 15,
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  value: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});

export default Profile;
