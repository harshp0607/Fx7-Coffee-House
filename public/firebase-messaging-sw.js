// Firebase Cloud Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/12.6.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.6.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyDlZ82Ud3DWqPBgyhEr8bLCbSZM2r8GCYk",
  authDomain: "fx7-coffee-house.firebaseapp.com",
  projectId: "fx7-coffee-house",
  storageBucket: "fx7-coffee-house.firebasestorage.app",
  messagingSenderId: "368367390628",
  appId: "1:368367390628:web:510b880a65285cbe87bb31",
  measurementId: "G-ZLP2DGJ24R"
});

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification?.title || 'FX7 Coffee House';
  const notificationOptions = {
    body: payload.notification?.body || 'Your order is ready!',
    icon: '/fx7Logo.PNG',
    badge: '/fx7Logo.PNG',
    tag: 'order-ready',
    requireInteraction: true,
    vibrate: [200, 100, 200]
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});
