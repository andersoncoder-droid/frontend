// RecentNotifications.jsx
// Shows a list of recent notifications from NotificationContext.
// Displays icon and time for each notification.

import React, { useContext } from "react";
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Box,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";
import { NotificationContext } from "../context/NotificationContext";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const getIcon = (severity) => {
  switch (severity) {
    case "success":
      return <CheckCircleIcon color="success" />;
    case "warning":
      return <WarningIcon color="warning" />;
    case "error":
      return <ErrorIcon color="error" />;
    case "info":
    default:
      return <InfoIcon color="info" />;
  }
};

const formatTime = (time) => {
  return format(new Date(time), "dd/MM/yyyy HH:mm", { locale: es });
};

const RecentNotifications = () => {
  const { notifications } = useContext(NotificationContext);

  return (
    <Box>
      {notifications.length === 0 ? (
        <Typography color="textSecondary">
          No hay notificaciones recientes
        </Typography>
      ) : (
        <List>
          {notifications.map((notification, index) => (
            <React.Fragment key={notification.id}>
              <ListItem alignItems="flex-start">
                <ListItemIcon>{getIcon(notification.severity)}</ListItemIcon>
                <ListItemText
                  primary={notification.message}
                  secondary={formatTime(notification.time)}
                />
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
};

export default RecentNotifications;
