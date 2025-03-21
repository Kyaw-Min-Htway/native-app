import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ReviewScreen = ({ route, navigation }) => {
  const { restaurantId } = route.params;
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');

  const submitReview = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await api.post('/reviews', { restaurantId, rating: parseInt(rating), comment }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Review submitted');
      navigation.goBack();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Write a Review</Text>
      <TextInput
        label="Rating (1-5)"
        value={rating}
        onChangeText={setRating}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        label="Comment"
        value={comment}
        onChangeText={setComment}
        multiline
        style={styles.input}
      />
      <Button mode="contained" onPress={submitReview} style={styles.button}>
        Submit Review
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, marginBottom: 16 },
  input: { marginBottom: 16 },
  button: { marginTop: 8 },
});

export default ReviewScreen;