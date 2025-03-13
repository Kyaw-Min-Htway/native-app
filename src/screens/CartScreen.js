import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartScreen = ({ navigation }) => {
  const cartItems = useSelector(state => state.cart.items); // Redux ကနေ cart items ယူတယ်
  const dispatch = useDispatch();
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handlePlaceOrder = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await api.post(
        '/orders',
        { items: cartItems },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch({ type: 'CLEAR_CART' }); // Order တင်ပြီးရင် cart ကို ရှင်းတယ်
      navigation.navigate('OrderHistory');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>
      <FlatList
        data={cartItems}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.name} - ${item.price}</Text>
            <Button
              onPress={() => dispatch({ type: 'REMOVE_FROM_CART', payload: item.id })}
            >
              Remove
            </Button>
          </View>
        )}
        keyExtractor={item => item.id}
      />
      <Text style={styles.total}>Total: ${total}</Text>
      <Button
        mode="contained"
        onPress={handlePlaceOrder}
        disabled={!cartItems.length}
        style={styles.button}
      >
        Place Order
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, marginBottom: 16 },
  item: { flexDirection: 'row', justifyContent: 'space-between', padding: 8, borderBottomWidth: 1 },
  total: { fontSize: 18, marginVertical: 16 },
  button: { marginTop: 8 },
});

export default CartScreen;