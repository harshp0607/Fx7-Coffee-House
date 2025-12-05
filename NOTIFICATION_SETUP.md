# Web Push Notifications Setup Guide

Your web notifications are now integrated! Follow these steps to complete the setup before deploying to Vercel.

## 🔧 What's Been Done

1. ✅ Updated Firebase config to include Cloud Messaging
2. ✅ Created service worker for background notifications
3. ✅ Created notification utility functions
4. ✅ Integrated notifications into order flow (triggers when order marked ready)
5. ✅ Created NotificationPrompt component

## 📋 Required Steps to Complete Setup

### Step 1: Get Your VAPID Key from Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **fx7-coffee-house**
3. Click the gear icon ⚙️ > **Project settings**
4. Go to the **Cloud Messaging** tab
5. Scroll to **Web Push certificates**
6. Click **Generate key pair** (if you don't have one)
7. Copy the **Key pair** value

### Step 2: Add VAPID Key to Your Code

Open `src/utils/notifications.js` and replace `YOUR_VAPID_KEY_HERE` with your actual VAPID key:

```javascript
const token = await getToken(messaging, {
  vapidKey: 'YOUR_ACTUAL_VAPID_KEY', // Replace this
  serviceWorkerRegistration: registration
});
```

### Step 3: Add NotificationPrompt to Your App

Add the NotificationPrompt component to your main customer-facing page. For example, in `src/pages/Frame.jsx`:

```javascript
import NotificationPrompt from '../components/NotificationPrompt';

function Frame() {
  return (
    <div>
      {/* Your existing content */}

      {/* Add this at the end */}
      <NotificationPrompt />
    </div>
  );
}
```

### Step 4: Update Vercel Configuration

Create or update `vercel.json` in your project root:

```json
{
  "rewrites": [
    {
      "source": "/firebase-messaging-sw.js",
      "destination": "/firebase-messaging-sw.js"
    }
  ],
  "headers": [
    {
      "source": "/firebase-messaging-sw.js",
      "headers": [
        {
          "key": "Service-Worker-Allowed",
          "value": "/"
        },
        {
          "key": "Content-Type",
          "value": "application/javascript"
        }
      ]
    }
  ]
}
```

## 🔔 How It Works

### Client-Side Notifications (Current Implementation)

When you mark an order as ready in your admin panel:
1. The `markOrderAsReady()` function is called
2. A browser notification is shown using the Notification API
3. The notification includes the customer name and order details

### For Production: Server-Side Notifications (Recommended)

For a production app, you should send notifications from your backend:

1. **Store FCM tokens**: When users enable notifications, save their FCM token to Firestore
2. **Send from backend**: Use Firebase Admin SDK to send notifications to specific tokens
3. **Trigger on order update**: When order status changes, send push notification

Example backend code (Node.js):
```javascript
const admin = require('firebase-admin');

// When order is marked ready
const sendOrderReadyNotification = async (fcmToken, orderInfo) => {
  const message = {
    notification: {
      title: 'Order Ready! ☕',
      body: `Your order is ready for pickup!`
    },
    token: fcmToken
  };

  await admin.messaging().send(message);
};
```

## 🧪 Testing Notifications

1. Run your app locally: `npm start`
2. When the notification prompt appears, click "Enable Notifications"
3. Check browser console for the FCM token
4. Go to your admin panel and mark an order as ready
5. You should see a notification appear!

## 🚀 Deploying to Vercel

1. Make sure you've completed Steps 1-4 above
2. Commit your changes:
   ```bash
   git add .
   git commit -m "Add web push notifications"
   git push
   ```
3. Deploy to Vercel (if connected to GitHub, it will auto-deploy)

## 🐛 Troubleshooting

**Notifications not showing?**
- Check that you've allowed notifications in browser settings
- Open browser console and look for errors
- Verify the service worker is registered (Chrome DevTools > Application > Service Workers)
- Make sure VAPID key is correctly set

**Service worker not loading?**
- Check that `firebase-messaging-sw.js` is in the `public` folder
- Verify Vercel configuration is correct
- Check browser console for service worker errors

**Permission denied?**
- Users need to manually allow notifications in browser settings
- On Chrome: Click the lock icon in address bar > Site settings > Notifications

## 📱 Browser Support

Web push notifications work on:
- ✅ Chrome/Edge (Desktop & Android)
- ✅ Firefox (Desktop & Android)
- ✅ Safari (Desktop & iOS 16.4+)
- ❌ Older iOS versions (< 16.4)

## 🔐 Security Notes

- Never commit your VAPID key to public repositories
- Consider using environment variables for sensitive keys
- FCM tokens should be stored securely in your database

## 📚 Additional Resources

- [Firebase Cloud Messaging Docs](https://firebase.google.com/docs/cloud-messaging/js/client)
- [Web Push Notifications Guide](https://web.dev/push-notifications-overview/)
- [Notification API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Notification)
