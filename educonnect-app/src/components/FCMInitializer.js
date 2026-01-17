// src/components/FCMInitializer.js
import { useEffect } from 'react';
import { initializeFCM } from '../firebaseConfig';

/**
 * Component to initialize FCM when user logs in
 * Add this to your App.js or main component
 */
export const FCMInitializer = ({ onNotification }) => {
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // Only initialize FCM if user is logged in
    if (token) {
      console.log('🔔 User is logged in, initializing FCM...');
      
      initializeFCM((payload) => {
        console.log('📨 Foreground notification received:', payload);
        
        // Custom handling for different notification types
        if (payload.data?.type === 'call') {
          console.log('📞 Incoming call notification');
          // Handle call notification
        } else if (payload.data?.type === 'message') {
          console.log('💬 New message notification');
          // Handle message notification
        }
        
        // Call parent callback if provided
        if (onNotification) {
          onNotification(payload);
        }
      });
    } else {
      console.log('⚠️ User not logged in, skipping FCM initialization');
    }
  }, [onNotification]);
  
  return null; // This component doesn't render anything
};

export default FCMInitializer;