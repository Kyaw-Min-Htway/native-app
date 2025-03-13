import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const RestaurantCard = ({ restaurant, navigation }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Menu', { restaurantId: restaurant._id })}
    >
      {restaurant.image && (
        <Image source={{ uri: `http://localhost:3000${restaurant.image}` }} style={styles.image} />
      )}
      <Text style={styles.name}>{restaurant.name}</Text>
      <Text>{restaurant.cuisine}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { padding: 16, backgroundColor: '#fff', marginBottom: 8, borderRadius: 8 },
  name: { fontSize: 18, fontWeight: 'bold' },
  image: { width: 100, height: 100, marginBottom: 8 },
});

export default RestaurantCard;