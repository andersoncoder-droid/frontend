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
} from "@mui/icons-material";
import { NotificationContext } from "../context/NotificationContext";
// Importaciones específicas de date-fns
import formatDate from "date-fns/format";
import { es } from "date-fns/locale";

const RecentNotifications = () => {
  // Usar desestructuración con valor por defecto para evitar undefined
  const { notifications = [] } = useContext(NotificationContext) || {};

  // Verificar si notifications existe y tiene elementos
  const hasNotifications = notifications && notifications.length > 0;

  // Función para obtener el icono según la severidad
  const getIcon = (severity) => {
    switch (severity) {
      case "success":
        return <CheckCircleIcon color="success" />;
      case "warning":
        return <WarningIcon color="warning" />;
      case "error":
        return <WarningIcon color="error" />;
      case "info":
      default:
        return <InfoIcon color="info" />;
    }
  };

  // Función para formatear la fecha
  const formatTime = (date) => {
    if (!date) return "";
    try {
      return formatDate(new Date(date), "h:mm a", { locale: es });
    } catch (error) {
      console.error("Error al formatear fecha:", error);
      return "";
    }
  };

  return (
    <Paper sx={{ p: 2, height: "100%" }}>
      <Typography variant="h6" gutterBottom>
        Notificaciones Recientes
      </Typography>

      {hasNotifications ? (
        <List>
          {notifications.map((notification) => (
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
      ) : (
        <Box sx={{ py: 2, textAlign: "center" }}>
          <Typography color="textSecondary">
            No hay notificaciones recientes
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default RecentNotifications;
