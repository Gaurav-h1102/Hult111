// src/components/FCMDebugPanel.js
import React, { useState, useEffect } from 'react';
import { Bell, Send, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { sendTestNotification, initializeFCM } from '../firebaseConfig';

/**
 * FCM Debug Panel - Add this to your dashboard to test notifications
 */
export const FCMDebugPanel = () => {
  const [status, setStatus] = useState({
    permission: 'unknown',
    token: null,
    registered: false,
    swActive: false,
    browserSupport: true
  });
  const [logs, setLogs] = useState([]);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { message, type, timestamp }]);
    console.log(`[FCM DEBUG] ${message}`);
  };

  const checkStatus = async () => {
    addLog('Checking FCM status...', 'info');
    
    try {
      // Check browser support
      const hasNotifications = 'Notification' in window;
      const hasServiceWorker = 'serviceWorker' in navigator;
      
      if (!hasNotifications || !hasServiceWorker) {
        setStatus(prev => ({ ...prev, browserSupport: false }));
        addLog('Browser does not support notifications or service workers', 'error');
        return;
      }
      
      // Check permission
      const permission = Notification.permission;
      addLog(`Notification permission: ${permission}`, permission === 'granted' ? 'success' : 'warning');
      
      // Check service worker
      const registrations = await navigator.serviceWorker.getRegistrations();
      const swActive = registrations.length > 0 && registrations[0].active !== null;
      addLog(`Service worker active: ${swActive}`, swActive ? 'success' : 'warning');
      
      // Check if token exists
      const token = localStorage.getItem('fcm_token');
      addLog(`FCM token stored: ${token ? 'Yes' : 'No'}`, token ? 'success' : 'warning');
      
      setStatus({
        permission,
        token: token ? token.substring(0, 20) + '...' : null,
        registered: !!token,
        swActive,
        browserSupport: true
      });
      
    } catch (error) {
      addLog(`Error checking status: ${error.message}`, 'error');
    }
  };

  const handleInitialize = async () => {
    addLog('Initializing FCM...', 'info');
    
    try {
      const success = await initializeFCM((payload) => {
        addLog(`Notification received: ${payload.notification?.title}`, 'success');
      });
      
      if (success) {
        addLog('FCM initialized successfully!', 'success');
        await checkStatus();
      } else {
        addLog('FCM initialization failed', 'error');
      }
    } catch (error) {
      addLog(`Initialization error: ${error.message}`, 'error');
    }
  };

  const handleSendTest = async () => {
    addLog('Sending test notification...', 'info');
    
    try {
      const success = await sendTestNotification();
      
      if (success) {
        addLog('Test notification sent! Check if you received it.', 'success');
      } else {
        addLog('Failed to send test notification', 'error');
      }
    } catch (error) {
      addLog(`Test error: ${error.message}`, 'error');
    }
  };

  const handleRequestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      addLog(`Permission result: ${permission}`, permission === 'granted' ? 'success' : 'warning');
      await checkStatus();
    } catch (error) {
      addLog(`Permission error: ${error.message}`, 'error');
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const getStatusIcon = (condition) => {
    if (condition) {
      return <CheckCircle className="text-green-500" size={20} />;
    } else {
      return <XCircle className="text-red-500" size={20} />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="text-blue-600" size={24} />
        <h2 className="text-2xl font-bold">FCM Debug Panel</h2>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">Browser Support</span>
            {getStatusIcon(status.browserSupport)}
          </div>
          <p className="text-sm text-gray-600">
            {status.browserSupport ? 'Supported ✓' : 'Not Supported ✗'}
          </p>
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">Permission</span>
            {getStatusIcon(status.permission === 'granted')}
          </div>
          <p className="text-sm text-gray-600">
            {status.permission}
          </p>
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">Service Worker</span>
            {getStatusIcon(status.swActive)}
          </div>
          <p className="text-sm text-gray-600">
            {status.swActive ? 'Active ✓' : 'Not Active ✗'}
          </p>
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">FCM Token</span>
            {getStatusIcon(status.registered)}
          </div>
          <p className="text-sm text-gray-600 truncate">
            {status.token || 'Not registered'}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={handleRequestPermission}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Request Permission
        </button>
        
        <button
          onClick={handleInitialize}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Initialize FCM
        </button>
        
        <button
          onClick={handleSendTest}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
        >
          <Send size={16} />
          Send Test Notification
        </button>
        
        <button
          onClick={checkStatus}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
        >
          Refresh Status
        </button>
      </div>

      {/* Logs */}
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-2">Debug Logs</h3>
        <div className="max-h-64 overflow-y-auto space-y-1">
          {logs.length === 0 ? (
            <p className="text-gray-500 text-sm">No logs yet...</p>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <span className="text-gray-500">{log.timestamp}</span>
                {log.type === 'success' && <CheckCircle size={16} className="text-green-500 mt-0.5" />}
                {log.type === 'error' && <XCircle size={16} className="text-red-500 mt-0.5" />}
                {log.type === 'warning' && <AlertCircle size={16} className="text-yellow-500 mt-0.5" />}
                <span className={
                  log.type === 'success' ? 'text-green-700' :
                  log.type === 'error' ? 'text-red-700' :
                  log.type === 'warning' ? 'text-yellow-700' :
                  'text-gray-700'
                }>
                  {log.message}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold mb-2">Troubleshooting Steps:</h4>
        <ol className="text-sm space-y-1 list-decimal list-inside">
          <li>Click "Request Permission" - browser should show permission popup</li>
          <li>Allow notifications when prompted</li>
          <li>Click "Initialize FCM" - should register service worker and get token</li>
          <li>Click "Send Test Notification" - you should receive a notification</li>
          <li>If it doesn't work, check browser console for errors</li>
        </ol>
      </div>
    </div>
  );
};

export default FCMDebugPanel;