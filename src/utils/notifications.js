import { messaging, getToken, onMessage } from '../firebase';

// Request notification permission and get FCM token
export const requestNotificationPermission = async () => {
  try {
    // Check if browser supports notifications
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return null;
    }

    // Request permission
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      console.log('Notification permission granted.');

      // Register service worker
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      console.log('Service Worker registered:', registration);

      // Get FCM token
      // IMPORTANT: You need to get your VAPID key from Firebase Console
      // Go to Project Settings > Cloud Messaging > Web Push certificates
      // Generate a new key pair if you don't have one
      const token = await getToken(messaging, {
        vapidKey: 'BG-9LdD5r5lfptmIr6R9xUiEW8P2EkxUq0KBYhkIZimDigppeP_241sP7STCu7I-BEuZRC40BbHmUXdGgRScWhI', // Replace with your actual VAPID key
        serviceWorkerRegistration: registration
      });

      if (token) {
        console.log('FCM Token:', token);
        // Store this token in your database associated with the user
        // You'll use this to send notifications from your backend
        return token;
      } else {
        console.log('No registration token available.');
        return null;
      }
    } else if (permission === 'denied') {
      console.log('Notification permission denied');
      return null;
    }
  } catch (error) {
    console.error('Error getting notification permission:', error);
    return null;
  }
};

// Listen for foreground messages
export const setupForegroundMessageListener = (callback) => {
  return onMessage(messaging, (payload) => {
    console.log('Foreground message received:', payload);

    // Show notification even when app is in foreground
    const notificationTitle = payload.notification?.title || 'FX7 Coffee House';
    const notificationOptions = {
      body: payload.notification?.body || 'Your order is ready!',
      icon: '/fx7Logo.PNG',
      badge: '/fx7Logo.PNG',
      tag: 'order-ready',
      requireInteraction: true,
      vibrate: [200, 100, 200]
    };

    if (Notification.permission === 'granted') {
      new Notification(notificationTitle, notificationOptions);
    }

    // Call custom callback if provided
    if (callback) {
      callback(payload);
    }
  });
};

// Send notification for order ready (client-side)
// Note: In production, you should send notifications from your backend
// This is a client-side only notification using the browser's Notification API
export const showOrderReadyNotification = (orderInfo) => {
  if (Notification.permission === 'granted') {
    const title = 'Order Ready! ☕';
    const options = {
      body: `Order for ${orderInfo.userInfo?.name || 'customer'} is ready for pickup!`,
      icon: '/fx7Logo.PNG',
      badge: '/fx7Logo.PNG',
      tag: 'order-ready',
      requireInteraction: true,
      vibrate: [200, 100, 200],
      data: {
        orderId: orderInfo.id,
        timestamp: new Date().getTime()
      }
    };

    const notification = new Notification(title, options);

    notification.onclick = (event) => {
      event.preventDefault();
      window.focus();
      notification.close();
    };

    return notification;
  } else {
    console.log('Notification permission not granted');
    return null;
  }
};
