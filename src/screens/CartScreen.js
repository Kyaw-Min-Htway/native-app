import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { useStripe } from '@stripe/stripe-react-native';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

const CartScreen = ({ navigation }) => {
  const cartItems = useSelector(state => state.cart.items);
  const dispatch = useDispatch();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handlePayment = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await api.post('/payment/create-payment-intent', { amount: total * 100 }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { clientSecret } = response.data;

      await initPaymentSheet({ paymentIntentClientSecret: clientSecret });
      const { error } = await presentPaymentSheet();

      if (!error) {
        const orderResponse = await api.post('/orders', { items: cartItems }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        dispatch({ type: 'CLEAR_CART' });
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Order Placed!',
            body: `Your order #${orderResponse.data._id} has been successfully placed.`,
          },
          trigger: null, // Immediate
        });
        navigation.navigate('OrderHistory');
      } else {
        alert('Payment failed: ' + error.message);
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Payment error');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>
      <FlatList
        data={cartItems}
        renderItem={({ item }) => (
          <View style={styles.item}>
            {item.image && <Image source={{ uri: `http://localhost:3000${item.image}` }} style={styles.image} />}
            <Text>{item.name} - ${item.price}</Text>
            <Button onPress={() => dispatch({ type: 'REMOVE_FROM_CART', payload: item.id })}>
              Remove
            </Button>
          </View>
        )}
        keyExtractor={item => item.id}
      />
      <Text style={styles.total}>Total: ${total}</Text>
      <Button mode="contained" onPress={handlePayment} disabled={!cartItems.length} style={styles.button}>
        Pay Now
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, marginBottom: 16 },
  item: { flexDirection: 'row', alignItems: 'center', padding: 8, borderBottomWidth: 1 },
  image: { width: 50, height: 50, marginRight: 8 },
  total: { fontSize: 18, marginVertical: 16 },
  button: { marginTop: 8 },
});

export default CartScreen;