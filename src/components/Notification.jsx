import React, { useState, useEffect } from 'react';
import { Alert, Snackbar } from '@mui/material';

const Notification = ({ notifications }) => {
  const [open, setOpen] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);

  useEffect(() => {
    if (notifications && notifications.length > 0) {
      setCurrentNotification(notifications[0]);
      setOpen(true);
      console.log('Mostrando notificación:', notifications[0]);
    }
  }, [notifications]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleExited = () => {
    setCurrentNotification(null);
  };

  if (!currentNotification) return null;

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={handleClose}
      TransitionProps={{ onExited: handleExited }}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      className="notification-item"
    >
      <Alert 
        onClose={handleClose} 
        severity={currentNotification.type || "info"} 
        sx={{ width: '100%' }}
      >
        {currentNotification.message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;