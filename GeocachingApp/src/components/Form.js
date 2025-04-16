import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';

const Form = ({token, onGeocacheAdded}) => {
    const [name, setName] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [description, setDescription] = useState('');

    const handleAddGeocache = async () => {
        // Validation des champs obligatoires
        if (!name || !latitude || !longitude) {
            Alert.alert("Champs obligatoires", "Merci de remplir au moins le nom, la latitude et la longitude.");
            return;
        }
        try {
            const newGeocache = {
                name,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                description
            };

            // Envoie du token dans l'entête HTTP pour s'autentifier
            await axios.post('http://10.0.2.2:3000/geocaches', newGeocache, {
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
            Alert.alert('Erreur', 'Impossible d\'ajouter le géocache');
        }
    };

    // Affichage du formulaire
    return (
        <View style={styles.form}>
            <Text> Nom :</Text>
            <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Nom du géocache"
                style={styles.input}
            />
            <Text> Latitude :</Text>
            <TextInput
                value={latitude}
                onChangeText={setLatitude}
                placeholder="Latitude"
                keyboardType="numeric"
                style={styles.input}
            />
            <Text> Longitude :</Text>
            <TextInput
                value={longitude}
                onChangeText={setLongitude}
                placeholder="Longitude"
                keyboardType="numeric"
                style={styles.input}
            />
            <Text> Description :</Text>
            <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Description"
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
    },
    input: {
      borderWidth: 1,
      marginBottom: 10,
      padding: 5,
    },
  });
  
  export default Form;