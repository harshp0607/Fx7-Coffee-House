import { useState, useEffect } from 'react';
import { requestNotificationPermission, setupForegroundMessageListener } from '../utils/notifications';

const NotificationPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState('default'); // 'default', 'granted', 'denied'

  useEffect(() => {
    // Check current notification permission status
    if ('Notification' in window) {
      setNotificationStatus(Notification.permission);

      // Show prompt if permission is default (not yet asked)
      if (Notification.permission === 'default') {
        setShowPrompt(true);
      }

      // Setup foreground message listener if permission granted
      if (Notification.permission === 'granted') {
        const unsubscribe = setupForegroundMessageListener((payload) => {
          console.log('Received foreground message:', payload);
        });
        return unsubscribe;
      }
    }
  }, []);

  const handleEnableNotifications = async () => {
    const token = await requestNotificationPermission();

    if (token) {
      setNotificationStatus('granted');
      setShowPrompt(false);

      // Setup foreground message listener
      setupForegroundMessageListener((payload) => {
        console.log('Received foreground message:', payload);
      });

      // TODO: Send this token to your backend to store it
      // You'll use this token to send push notifications from your server
      console.log('Save this FCM token to your backend:', token);
    } else {
      setNotificationStatus(Notification.permission);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (!showPrompt || notificationStatus !== 'default') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm border border-gray-200 z-50">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <svg
            className="w-6 h-6 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">
            Stay Updated!
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Get notified when your order is ready for pickup.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleEnableNotifications}
              className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              Enable Notifications
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors"
            >
              Later
            </button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default NotificationPrompt;
