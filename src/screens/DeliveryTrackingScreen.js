import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';
import io from 'socket.io-client';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const socket = io('http://localhost:3000');

const DeliveryTrackingScreen = ({ route }) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetchOrder();
    socket.on('orderUpdate', (updatedOrder) => {
      if (updatedOrder._id === orderId) {
        setOrder(updatedOrder);
      }
    });
    return () => socket.off('orderUpdate');
  }, []);

  const fetchOrder = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await api.get(`/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delivery Tracking</Text>
      {order ? (
        <>
          <Text>Order #{order._id}</Text>
          <Text>Status: {order.status}</Text>
          <Text>Total: ${order.total}</Text>
          <Text>Estimated Delivery: {order.estimatedDelivery || 'Calculating...'}</Text>
          <Text>Delivery Location: {order.deliveryLocation}</Text>
          {order.deliveryCoordinates && (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: order.deliveryCoordinates.lat,
                longitude: order.deliveryCoordinates.lng,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              <Marker
                coordinate={{
                  latitude: order.deliveryCoordinates.lat,
                  longitude: order.deliveryCoordinates.lng,
                }}
                title="Delivery Location"
              />
            </MapView>
          )}
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, marginBottom: 16 },
  map: { width: '100%', height: 300, marginTop: 16 },
});

export default DeliveryTrackingScreen;