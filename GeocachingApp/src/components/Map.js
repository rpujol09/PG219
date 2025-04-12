import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

const Map = ({ geocaches }) => {
  // Générer les marqueurs Leaflet à partir des géocaches
  const markers = geocaches
    .map(
      (geocache) =>
        `L.marker([${geocache.latitude}, ${geocache.longitude}]).addTo(map).bindPopup("${geocache.name}: ${geocache.description}");`
    )
    .join('');

  // HTML et JavaScript pour afficher la carte Leaflet
  const leafletHTML = `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Carte Leaflet</title>
      <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
      <style>
        #map {
          height: 100%;
          width: 100%;
          margin: 0;
          padding: 0;
        }
        body {
          margin: 0;
          padding: 0;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
      <script>
        // Initialisation de la carte
        var map = L.map('map').setView([48.8566, 2.3522], 13); // Coordonnées par défaut (Paris)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Ajout des marqueurs
        ${markers}
      </script>
    </body>
  </html>
`;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: leafletHTML }}
        style={styles.map}
      />
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
});

export default Map;