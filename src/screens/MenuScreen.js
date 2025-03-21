import React, { useEffect, useState } from 'react';
import { View, FlatList, Image, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import api from '../services/api';

const MenuScreen = ({ route, navigation }) => {
  const { restaurantId } = route.params;
  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchRestaurant();
    fetchReviews();
  }, []);

  const fetchRestaurant = async () => {
    try {
      const response = await api.get(`/restaurants/${restaurantId}`);
      setRestaurant(response.data);
    } catch (error) {
      console.error('Error fetching restaurant:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/reviews/restaurant/${restaurantId}`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const addToCart = (item) => {
    dispatch({ type: 'ADD_TO_CART', payload: { ...item, id: `${restaurantId}-${item.name}` } });
  };

  return (
    <View style={styles.container}>
      {restaurant && (
        <>
          <Text style={styles.title}>{restaurant.name} ({restaurant.averageRating}/5)</Text>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('Review', { restaurantId })}
            style={styles.button}
          >
            Write a Review
          </Button>
          <FlatList
            data={restaurant.menu}
            renderItem={({ item }) => (
              <View style={styles.item}>
                {item.image && (
                  <Image source={{ uri: `http://localhost:3000${item.image}` }} style={styles.image} />
                )}
                <Text>{item.name} - ${item.price}</Text>
                <Button mode="contained" onPress={() => addToCart(item)}>
                  Add to Cart
                </Button>
              </View>
            )}
            keyExtractor={item => item.name}
          />
          <Text style={styles.subtitle}>Reviews</Text>
          <FlatList
            data={reviews}
            renderItem={({ item }) => (
              <View style={styles.review}>
                <Text>{item.userId.name}: {item.rating}/5 - {item.comment}</Text>
              </View>
            )}
            keyExtractor={item => item._id}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, marginBottom: 16 },
  subtitle: { fontSize: 18, marginTop: 16, marginBottom: 8 },
  item: { flexDirection: 'row', alignItems: 'center', padding: 8, borderBottomWidth: 1 },
  image: { width: 50, height: 50, marginRight: 8 },
  button: { marginBottom: 16 },
  review: { padding: 8, borderBottomWidth: 1 },
});

export default MenuScreen;