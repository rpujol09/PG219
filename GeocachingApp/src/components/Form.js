import React, { useState } from 'react';
import Geolocation from '@react-native-community/geolocation';
import { PermissionsAndroid, Platform, View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { SERVER_IP } from '../config'; 

const Form = ({token, onGeocacheAdded}) => {
    const [name, setName] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [description, setDescription] = useState('');
    const [loadingLocation, setLoadingLocation] = useState(false);

    const handleAddGeocache = async () => {
        // Validation des champs obligatoires
        if (!name || !latitude || !longitude) {
            Alert.alert("Champs obligatoires", "Merci de remplir au moins le nom, la latitude et la longitude.");
            return;
        }

        // Validation des coordonnées
        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);
    
        if (isNaN(lat) || isNaN(lng)) {
            Alert.alert("Coordonnées invalides", "La latitude et la longitude doivent être des nombres valides.");
            return;
        }
        try {
            // On vérifie s'il existe déjà un geocache aux mêmes coordonnées
            const allGeocaches = await axios.get(`${SERVER_IP}/geocaches`, {
                headers: {
                    Authorization: token
                }
            });

            const duplicate = allGeocaches.data.find(
                (geo) =>
                Number(geo.latitude) === lat && 
                Number(geo.longitude) === lng
            );
            if (duplicate) {
                Alert.alert("Erreur", "Un géocache existe déjà à ces coordonnées.");
                return;
            }

            // Création de l'objet géocache
            const newGeocache = {
                name,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                description
            };

            // Envoie du token dans l'entête HTTP pour s'autentifier
            await axios.post(`${SERVER_IP}/geocaches`, newGeocache, {
                headers: {
                    Authorization: token
                }
            });

            // Appeler la fonction de rappel pour mettre à jour la liste des géocaches
            onGeocacheAdded(newGeocache);
            Alert.alert('Succès', 'Géocache ajoutée avec succès');

            // Remettre le formulaire à zéros
            setName('');
            setLatitude('');
            setLongitude('');
            setDescription('');
        }
        catch (error) {
            console.error(error);
            Alert.alert('Erreur', "Impossible d'ajouter le géocache");
        }
    };

    // Fonction pour demander la permission d'accéder à la localisation
    const requestLocationPermission = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Permission de localisation',
                    message: "Cette application a besoin d'accéder à votre localisation.",
                    buttonNeutral: 'Plus tard',
                    buttonNegative: 'Annuler',
                    buttonPositive: 'OK',
                },
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED ;
        }
        return true; // Sur iOS, la permission est demandée automatiquement
    };

    // Fonction pour obtenir la position actuelle de l'utilisateur
    const getCurrentLocation = async () => {
        try {
            const hasLocationPermission = await requestLocationPermission();
            if (!hasLocationPermission) {
                Alert.alert('Permission refusée', "Vous devez autoriser l'accès à la localisation");
                return;
            }

            // Utilisation de Geolocation pour obtenir la position actuelle
            setLoadingLocation(true);
            Geolocation.getCurrentPosition(
                (position) => {
                    setLatitude(position.coords.latitude.toString());
                    setLongitude(position.coords.longitude.toString());
                    setLoadingLocation(false);
                },
                (error) => {
                    console.error(error);
                    Alert.alert('Erreur', "Impossible de récupérer votre localisation");
                    setLoadingLocation(false);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        }
        // Gestion des erreurs
        catch (error) {
            console.error(error);
            Alert.alert('Erreur', "Impossible d'obtenir la localisation");
        }
        finally {
            setLoadingLocation(false);
        }
    };


    // Affichage du formulaire
    return (
        <View style={styles.form}>
            <Text style={styles.title}> Ajouter une géocache 🧭</Text>
            <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Nom du géocache"
                style={styles.input}
            />

            <TextInput
                value={latitude}
                onChangeText={setLatitude}
                placeholder="Latitude"
                keyboardType="numeric"
                style={styles.input}
            />

            <TextInput
                value={longitude}
                onChangeText={setLongitude}
                placeholder="Longitude"
                keyboardType="numeric"
                style={styles.input}
            />

            <TouchableOpacity onPress={getCurrentLocation} style={styles.locationButton}>
                {loadingLocation ? (
                    <ActivityIndicator color="#0000ff" />
                ) : (
                    <Text style={styles.locationText}>📍Obtenir ma position actuelle</Text>
                )}
            </TouchableOpacity>
   
            <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Description"
                multiline
                style={styles.input}
            />
            <Button title="Ajouter Géocache" onPress={handleAddGeocache} />
        </View>
    );
};

// Style du formulaire

const styles = StyleSheet.create({
    form: {
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 10,
        padding: 10,
        borderRadius: 6,
    },
    locationButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 6,
        alignItems: 'center',
        marginBottom: 10,
    },
    locationText: {
        color: 'white',
        fontWeight: '600',
    },
  });
  
  export default Form;