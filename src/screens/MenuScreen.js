import React, { useEffect, useState } from 'react';
import { View, FlatList, Image, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import api from '../services/api';

const MenuScreen = ({ route, navigation }) => {
  const { restaurantId } = route.params;
  const [menu, setMenu] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await api.get(`/restaurants/${restaurantId}`);
      setMenu(response.data.menu);
    } catch (error) {
      console.error('Error fetching menu:', error);
    }
  };

  const addToCart = (item) => {
    dispatch({ type: 'ADD_TO_CART', payload: { ...item, id: `${restaurantId}-${item.name}` } });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={menu}
        renderItem={({ item }) => (
          <View style={styles.item}>
            {item.image && (
              <Image
                source={{ uri: `http://localhost:3000${item.image}` }}
                style={styles.image}
              />
            )}
            <Text>{item.name} - ${item.price}</Text>
            <Button mode="contained" onPress={() => addToCart(item)}>
              Add to Cart
            </Button>
          </View>
        )}
        keyExtractor={item => item.name}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  item: { flexDirection: 'row', alignItems: 'center', padding: 8, borderBottomWidth: 1 },
  image: { width: 50, height: 50, marginRight: 8 },
});

export default MenuScreen;