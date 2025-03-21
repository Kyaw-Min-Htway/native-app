import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

const OrderHistoryScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
    socket.on('orderUpdate', (updatedOrder) => {
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
    });
    return () => socket.off('orderUpdate');
  }, []);

  const fetchOrders = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await api.get('/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order History</Text>
      <FlatList
        data={orders}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>Order #{item._id} - ${item.total} - {item.status}</Text>
            <Text>{new Date(item.createdAt).toLocaleDateString()}</Text>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('DeliveryTracking', { orderId: item._id })}
            >
              Track Delivery
            </Button>
          </View>
        )}
        keyExtractor={item => item._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, marginBottom: 16 },
  item: { padding: 8, borderBottomWidth: 1, marginBottom: 8 },
});

export default OrderHistoryScreen;