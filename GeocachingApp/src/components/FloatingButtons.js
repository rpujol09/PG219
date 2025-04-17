import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';

const FloatingButtons = ({ onAddGeocache, onNearby }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onNearby}>
        <Text style={styles.icon}>👁️</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onAddGeocache}>
        <Text style={styles.icon}>➕</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 40,
    right: 20,
    flexDirection: 'column',
    gap: 12,
  },
  button: {
    backgroundColor: '#007bff',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  icon: {
    fontSize: 22,
    color: '#fff',
  },
});

export default FloatingButtons;
