import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import { SERVER_IP } from '../config';

const Comments = ({token, onNavigate}) => {
    const [text, setText] = useState('');
    const [comments, setComments] = useState([]);

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

    useEffect(() => {
        fetchComments();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>💬 Commentaires</Text>
            <FlatList
                data={comments}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.comment}>
                        <Text style={styles.author}>{item.author?.email || 'Anonyme'}</Text>
                        <Text>{item.text}</Text>
                        <Text style={styles.date}>{new Date(item.createdAt).toLocaleString()}</Text>
                    </View>
                )}
            />
            <TextInput
                style={styles.input}
                placeholder="Écrire un commentaire..."
                value={text}
                onChangeText={setText}
            />
            <Button title="Envoyer" onPress={handleSend}  disabled={text.trim() === ''}/>
            <Button title="Fermer" onPress={onNavigate} color="#888" style={{ marginTop: 10 }} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20 },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
    comment: { marginBottom: 15, padding: 10, backgroundColor: '#f0f0f0', borderRadius: 8 },
    author: { fontWeight: 'bold' },
    date: { fontSize: 12, color: 'gray' },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8, marginBottom: 10 }
  });
  
  export default Comments;