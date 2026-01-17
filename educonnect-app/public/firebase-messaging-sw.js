// public/firebase-messaging-sw.js - PRODUCTION VERSION
// This file MUST be in the public folder at the root

importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyCyRnk60Muh93DtWVbrmO3jn8WsVKZDSas",
  authDomain: "educonnect-821e7.firebaseapp.com",
  projectId: "educonnect-821e7",
  storageBucket: "educonnect-821e7.firebasestorage.app",
  messagingSenderId: "1004307512502",
  appId: "1:1004307512502:web:ff5eaae9f3a01eb5ff3a17",
});

const messaging = firebase.messaging();

console.log('[SW] Firebase Messaging Service Worker loaded');

// Handle background messages (when app is closed or in background)
messaging.onBackgroundMessage(function(payload) {
  console.log('[SW] Background message received:', payload);
  
  const notificationTitle = payload.notification?.title || 'EduConnect';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new notification',
    icon: payload.notification?.icon || 'https://hult.onrender.com/icons/icon-192x192.png',
    badge: 'https://hult.onrender.com/icons/icon-192x192.png',
    tag: payload.data?.type || 'default',
    requireInteraction: payload.data?.type === 'call', // Call notifications stay visible
    vibrate: payload.data?.type === 'call' ? [200, 100, 200] : undefined,
    data: payload.data || {},
    actions: payload.data?.type === 'call' ? [
      {
        action: 'answer',
        title: '📞 Answer'
      },
      {
        action: 'decline',
        title: '❌ Decline'
      }
    ] : [
      {
        action: 'open',
        title: 'Open'
      }
    ]
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', function(event) {
  console.log('[SW] Notification clicked:', event);
  
  event.notification.close();
  
  const action = event.action;
  const data = event.notification.data || {};
  
  // Determine URL based on notification type and action
  let urlToOpen = 'https://hult.onrender.com/'; // Your production URL
  
  if (action === 'answer' && data.type === 'call') {
    // Open video call page
    urlToOpen = `https://hult.onrender.com/video-call?meetingId=${data.meeting_id}`;
  } else if (action === 'decline') {
    // Just close notification, don't open anything
    return;
  } else if (data.url) {
    // Use custom URL from notification data
    urlToOpen = data.url.startsWith('http') 
      ? data.url 
      : `https://hult.onrender.com${data.url}`;
  } else if (data.type === 'message') {
    urlToOpen = `https://hult.onrender.com/messages/${data.conversation_id}`;
  } else if (data.type === 'call') {
    urlToOpen = `https://hult.onrender.com/video-call?meetingId=${data.meeting_id}`;
  }
  
  console.log('[SW] Opening URL:', urlToOpen);
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(function(clientList) {
        // Check if there's already a window open
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          
          // If same origin, focus existing window and navigate
          if (client.url.startsWith('https://hult.onrender.com') && 'focus' in client) {
            client.focus();
            
            // Navigate to the target URL
            if (client.navigate) {
              return client.navigate(urlToOpen);
            }
            
            return client;
          }
        }
        
        // Open new window if none exists
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Handle push events (alternative to onBackgroundMessage)
self.addEventListener('push', function(event) {
  console.log('[SW] Push event received:', event);
  
  if (event.data) {
    try {
      const data = event.data.json();
      console.log('[SW] Push data:', data);
      
      const notification = data.notification || {};
      const title = notification.title || 'EduConnect';
      
      const options = {
        body: notification.body || 'New notification',
        icon: notification.icon || 'https://hult.onrender.com/icons/icon-192x192.png',
        badge: 'https://hult.onrender.com/icons/icon-192x192.png',
        tag: data.data?.type || 'default',
        requireInteraction: data.data?.type === 'call',
        vibrate: data.data?.type === 'call' ? [200, 100, 200] : undefined,
        data: data.data || {}
      };
      
      event.waitUntil(
        self.registration.showNotification(title, options)
      );
    } catch (error) {
      console.error('[SW] Error parsing push data:', error);
    }
  }
});

// Log when service worker is installed
self.addEventListener('install', function(event) {
  console.log('[SW] Service Worker installing...');
  self.skipWaiting(); // Activate immediately
});

// Log when service worker is activated
self.addEventListener('activate', function(event) {
  console.log('[SW] Service Worker activating...');
  event.waitUntil(clients.claim()); // Take control of all clients
});

console.log('[SW] Service Worker script loaded successfully');