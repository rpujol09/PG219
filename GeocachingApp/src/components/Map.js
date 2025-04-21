import React, {useEffect, useState} from 'react';
import { StyleSheet, View, Alert, PermissionsAndroid,Platform,ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import Geolocation from '@react-native-community/geolocation';

const Map = ({ geocaches }) => {
  const [userLocation, setUserLocation] = useState(null);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Permission de localisation requise',
          message: 'Cette application a besoin de votre localisation pour afficher les géocaches.',
          buttonNeutral: 'Demander plus tard',
          buttonNegative: 'Annuler',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true; // iOS gère les permissions différemment
  };

  // Obtenir la position de l'utilisateur
  useEffect(() => {
    const getLocation = async () => {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        Alert.alert('Erreur', 'Permission de localisation non accordée.');
        return;
      }

      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        },
        (error) => {
          Alert.alert('Erreur', 'Impossible d\'obtenir la position de l\'utilisateur');
          console.error(error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    };

    getLocation();
  }
  , []);

  // Générer les marqueurs Leaflet à partir des géocaches
  const markers = geocaches
    .map(
      (geocache) =>
        `L.marker([${geocache.latitude}, ${geocache.longitude}]).addTo(map).bindPopup("${geocache.name}: ${geocache.description}");`
    )
    .join('');

  // HTML et JavaScript pour afficher la carte Leaflet
  const leafletHTML = userLocation
    ? `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Carte Leaflet</title>
      <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
      <style>
        html, body, #map {
          height: 100%;
          width: 100%;
          margin: 0;
          padding: 0;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
      <script>
        // Initialisation de la carte centrée sur la position de l'utilisateur
        var map = L.map('map').setView([${userLocation.latitude}, ${userLocation.longitude}], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Ajout des marqueurs
        ${markers}
         // Ajouter un marqueur pour la position de l'utilisateur
        L.marker([${userLocation.latitude}, ${userLocation.longitude}]).addTo(map).bindPopup("Vous êtes ici.");
      </script>
    </body>
  </html>
`:`
  <!DOCTYPE html>
  <html>
    <head>
      <title>Carte Leaflet</title>
      <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
      <style>
        html, body, #map {
          height: 100%;
          width: 100%;
          margin: 0;
          padding: 0;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
      <script>
        // Position par défaut (Paris)
        var map = L.map('map').setView([48.8566, 2.3522], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);
      </script>
    </body>
  </html>
  `; // Paris est la position par défaut
return (
  <View style={styles.container}>
    {leafletHTML ? (
      <WebView
        originWhitelist={['*']}
        source={{ html: leafletHTML }}
        style={styles.map}
      />
    ) : (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    )}
  </View>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Map;