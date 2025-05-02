import React, { createContext, useState, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });

  // Función para añadir una notificación
  const addNotification = (message, severity = 'info', showToast = true) => {
    const newNotification = {
      id: Date.now(),
      message,
      time: new Date(),
      severity
    };
    
    setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
    
    // Si showToast es true, mostrar también como toast
    if (showToast) {
      setToast({
        open: true,
        message,
        severity
      });
    }
  };

  // Función para cerrar el toast
  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setToast({ ...toast, open: false });
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification }}>
      {children}
      <Snackbar 
        open={toast.open} 
        autoHideDuration={4000} 
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseToast} 
          severity={toast.severity} 
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};