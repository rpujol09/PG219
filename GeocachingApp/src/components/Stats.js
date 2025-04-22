import React, { useEffect, useState } from 'react';
import { ScrollView,View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { SERVER_IP } from '../config';

const Stats = ({ token, onNavigate }) => {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Récupérer les statistiques
    const fetchStats = async () => {
        try {
            const response = await axios.get(`${SERVER_IP}/stats`, {
                headers: { Authorization: token },
            });
            setStats(response.data);
        } catch (error) {
            console.error(error);
            Alert.alert('Erreur', 'Impossible de récupérer les statistiques');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [token]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    // Affichage des statistiques
    const renderStats = () => {
        if (!stats || Object.keys(stats).length === 0) {
            return <Text style={styles.empty}>Aucune statistique disponible.</Text>;
        }
        return (
            <View style={styles.statsContainer}>
                <Text style={styles.title}> 📊 Statistiques</Text>
                <Text style={styles.statItem}>Nombre de géocaches trouvées : {stats.found}</Text>
                <Text style={styles.statItem}>Nombre de géocaches créées : {stats.created}</Text>
            </View>
        );
    };
    
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 80  }}>
                {renderStats()}
            
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.closeButton} onPress={onNavigate}>
                        <Text style={styles.closeButtonText}>Fermer</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
      },
      statsContainer: {
        marginBottom: 30,
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
      },
      statItem: {
        fontSize: 18,
        marginVertical: 5,
        textAlign: 'center',
      },
      closeButton: {
        backgroundColor: '#007bff',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignSelf: 'center',
        marginTop: 20,
      },
      closeButtonText: {
        color: '#fff',
        fontSize: 16,
      },
      loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
   
    

});
export default Stats;