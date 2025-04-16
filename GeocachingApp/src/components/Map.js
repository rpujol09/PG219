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
        html, body {
          height: 100%;
          width: 100%;
          margin: 0;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        #map-container {
          width: 70%;
          aspect-ratio: 1;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 0 10px rgba(0,0,0,0.2);
        }
        #map {
          width: 100%;
          aspect-ratio: 1;
          margin: 0;
          padding: 0;
        }
      </style>
    </head>
    <body>
      <div id="map-container">
      <div id="map"></div>
      </div>
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