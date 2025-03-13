import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const RestaurantCard = ({ restaurant, navigation }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Menu', { restaurantId: restaurant._id })}
    >
      <Text style={styles.name}>{restaurant.name}</Text>
      <Text>{restaurant.cuisine}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { padding: 16, backgroundColor: '#fff', marginBottom: 8, borderRadius: 8 },
  name: { fontSize: 18, fontWeight: 'bold' },
});

export default RestaurantCard;