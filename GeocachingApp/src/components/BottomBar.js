import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';

const BottomBar = ({ onNavigate, onLogout }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => onNavigate('myGeocaches')}>
        <Text style={styles.button}>🧭{"\n"} Mes Géocaches</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onNavigate('stats')}>
        <Text style={styles.button}>📊{"\n"}Stats</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onNavigate('tuto')}>
        <Text style={styles.button}>💬{"\n"}Commentaires</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onNavigate('profile')}>
        <Text style={styles.button}>👤{"\n"}Profil</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onLogout}>
        <Text style={styles.button}>🚪{"\n"}Quitter</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#0056b3',
  },
  button: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default BottomBar;
