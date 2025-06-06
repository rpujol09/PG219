import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import { SERVER_IP } from '../config';

const Comments = ({token, onNavigate}) => {
    const [text, setText] = useState('');
    const [comments, setComments] = useState([]);

    // Récupération des commentaires
    const fetchComments = async () => {
        try {
            const response = await axios.get(`${SERVER_IP}/comments`, {
                headers: { Authorization: token },
            });
            setComments(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    // Envoi d'un commentaire
    const handleSend = async () => {
        if (text.trim() === '') return;

        try {
            const res = await axios.post(
                `${SERVER_IP}/comments`,
                { text },
                { headers: { Authorization: token } }
            );
            setComments([res.data, ...comments]);
            setText('');
        } catch (error) {
            console.error("Erreur envoi commentaire :",error);
        }
    };

    //
    useEffect(() => {
        fetchComments();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>💬 Commentaires</Text>
            <FlatList
                style={styles.list}
                data={comments}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.comment}>
                        <Text style={styles.author}>{item.author?.email || 'Anonyme'}</Text>
                        <Text>{item.text}</Text>
                        <Text style={styles.date}>{new Date(item.createdAt).toLocaleString()}</Text>
                    </View>
                )}
                contentContainerStyle={comments.length === 0 
                    ? { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 100 }
                    : { paddingBottom: 100 }}
                ListEmptyComponent={<Text style={styles.empty}>Aucun commentaire pour le moment.</Text>}
            />
            <View style={styles.footer}>
            <TextInput
                style={styles.input}
                placeholder="Écrire un commentaire..."
                value={text}
                onChangeText={setText}
            />
            <Button title="Envoyer" onPress={handleSend}  disabled={text.trim() === ''}/>
            <Button title="Fermer" onPress={onNavigate} color="#007AFF" style={{ marginTop: 10 }} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {maxHeight: '85%',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 10,padding: 20 },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
    comment: { marginBottom: 15, padding: 10, backgroundColor: '#f0f0f0', borderRadius: 8 },
    author: { fontWeight: 'bold' },
    date: { fontSize: 12, color: 'gray' },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8, marginBottom: 10 },
    list: {marginBottom: 20,},
    empty: {
        fontStyle: 'italic',
        textAlign: 'center',
        color: '#999',
        marginTop: 20,
      },

      footer: {
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        paddingTop: 10,
        paddingBottom: 0,
        backgroundColor: '#fff',
      },
      
  });
  
  export default Comments;