# Quick Start - Enable Notifications in 3 Steps

## ⚡ Before You Deploy to Vercel

### Step 1: Get Your VAPID Key (2 minutes)

1. Go to https://console.firebase.google.com/project/fx7-coffee-house/settings/cloudmessaging
2. Scroll to **Web Push certificates**
3. Click **Generate key pair** if you don't see one
4. Copy the key

### Step 2: Update the Code (1 minute)

Open [src/utils/notifications.js](src/utils/notifications.js) and find line 27:

```javascript
vapidKey: 'YOUR_VAPID_KEY_HERE', // Replace with your actual VAPID key
```

Replace `YOUR_VAPID_KEY_HERE` with the key you copied.

### Step 3: Add Notification Prompt to Your App (1 minute)

Choose where you want to show the notification permission prompt. For example, in your customer order page:

**Option A:** Add to main customer page (`src/pages/Frame.jsx` or wherever customers place orders):

```javascript
import NotificationPrompt from '../components/NotificationPrompt';

// At the end of your return statement:
return (
  <div>
    {/* Your existing content */}
    <NotificationPrompt />
  </div>
);
```

**Option B:** Add to your App.jsx to show on all pages:

```javascript
import NotificationPrompt from './components/NotificationPrompt';

// Inside your OrderProvider:
return (
  <OrderProvider>
    <Routes>
      {/* Your routes */}
    </Routes>
    <NotificationPrompt />
  </OrderProvider>
);
```

## 🚀 That's It!

Now you can deploy to Vercel. When you mark an order as ready, customers will get a notification!

## 🧪 Test Locally First

```bash
npm start
```

1. Open the app
2. Click "Enable Notifications" when prompted
3. Mark an order as ready (in admin view)
4. You should see a notification!

---

For detailed documentation, see [NOTIFICATION_SETUP.md](NOTIFICATION_SETUP.md)
