import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';

const MyGeocaches = ({ token, onNavigate}) => {
  const [myGeocaches, setMyGeocaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGeocache, setSelectedGeocache] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  
  // Récupérer les géocaches créées par l'utilisateur
  const fetchMyGeocaches = async () => {
    try {
      const response = await axios.get('http://10.0.2.2:3000/mygeocaches', {
        headers: { Authorization: token },
      });
      console.log("Geocaches récupérés :", response.data); // Vérification si le geocache à un  _id
      setMyGeocaches(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'Impossible de récupérer vos géocaches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyGeocaches();
  }, [token]);

  // Fonction pour ouvrir le formulaire de modification d'une géocache
  const handleEditGeocache = (geocache) => {
    setSelectedGeocache(geocache);
    setShowEditForm(true);
  };

  // fonction pour envoyer les  modifications de géocache
  const handleUpdateChanges = async () => {
    try {
      const response = await axios.patch(
        `http://10.0.2.2:3000/geocaches/${selectedGeocache._id}`,
        selectedGeocache,
        { headers: { Authorization: token } }
      );
      Alert.alert('Succès', 'Géocache mise à jour avec succès');
      setShowEditForm(false);
      fetchMyGeocaches(); // Rafraîchir la liste des géocaches
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'Impossible de mettre à jour la géocache');
    }
  };


  //fonction de suppression de géocache
  const handleDeleteGeocache = async (id) => {
    try {
      await axios.delete(`http://10.0.2.2:3000/geocaches/${id}`, {
        headers: { Authorization: token },
      });
      Alert.alert('Succès', 'Géocache supprimée avec succès');
      fetchMyGeocaches(); // Rafraîchir la liste
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'Impossible de supprimer la géocache');
    }
  };

  // Composant pour afficher chaque cache
  const renderGeocache = ({ item }) => (
    <View style={styles.cacheItem}>
      <Text style={styles.name}>{item.name}</Text>
      <Text>📍 {item.latitude}, {item.longitude}</Text>
      {item.description ? <Text>📝 {item.description}</Text> : null}

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => handleEditGeocache(item)}
      >
        <Text style={styles.editButtonText}>✏️ Modifier</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteGeocache(item._id)}
      >
        <Text style={styles.deleteButtonText}>🗑️ Supprimer</Text>
      </TouchableOpacity>
    </View>
  );


  // Composant d'afficahage du formulaire de modification
  const renderEditForm = () => (
    <View style={styles.modalContainer}>
      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.modalTitle}>Modifier la géocache</Text>
        <TextInput
          style={styles.input}
          value={selectedGeocache?.name}
          onChangeText={(text) => setSelectedGeocache({ ...selectedGeocache, name: text })}
          placeholder="Nom"
        />
        <TextInput
          style={styles.input}
          value={selectedGeocache?.description}
          onChangeText={(text) => setSelectedGeocache({ ...selectedGeocache, description: text })}
          placeholder="Description"
        />
        <TextInput
          style={styles.input}
          value={selectedGeocache?.latitude?.toString()}
          onChangeText={(text) => setSelectedGeocache({ ...selectedGeocache, latitude: parseFloat(text) })}
          placeholder="Latitude"
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          value={selectedGeocache?.longitude?.toString()}
          onChangeText={(text) => setSelectedGeocache({ ...selectedGeocache, longitude: parseFloat(text) })}
          placeholder="Longitude"
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleUpdateChanges}>
          <Text style={styles.saveButtonText}>Enregistrer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={() => setShowEditForm(false)}>
          <Text style={styles.cancelButtonText}>Annuler</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }
  
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Mes géocaches 🗂️</Text>
  
      <FlatList
        data={myGeocaches}
        keyExtractor={(item) => item._id || item.id?.toString()}
        renderItem={renderGeocache}
        contentContainerStyle={myGeocaches.length === 0 && styles.emptyListContainer}
        ListEmptyComponent={<Text style={styles.empty}>Vous n'avez pas encore créé de géocache.</Text>}
        style={styles.list}
      />
  
      <View style={styles.footer}>
        <TouchableOpacity style={styles.closeButton} onPress={onNavigate}>
          <Text style={styles.closeButtonText}>Fermer</Text>
        </TouchableOpacity>
      </View>
  
      {/* Formulaire superposé */}
      {showEditForm && renderEditForm()}
    </View>
  );
};  

const styles = StyleSheet.create({
  
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 10,
    zIndex: 10,
    elevation: 10, // pour Android
  },


  
  

  container: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    flex: 1,
  },
  
  form: {
    flexGrow: 1,
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  

  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 80, // Ajoute un espace pour éviter que le bouton chevauche la liste
  },
  cacheItem: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
    color: '#888',
  },
  closeButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default MyGeocaches;
