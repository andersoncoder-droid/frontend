// Utilidades para iconos y colores de activos
export const getAssetIcon = (type) => {
  switch(type) {
    case 'well':
      return '/assets/icons/well-icon.png'; // Icono local de pozo
    case 'motor':
      return '/assets/icons/motor-icon.png'; // Icono local de motor
    case 'transformer':
      return '/assets/icons/transformer-icon.png'; // Icono local de transformador
    default:
      return '/assets/icons/well-icon.png'; // Icono por defecto
  }
};

export const getAssetColor = (type) => {
  switch (type) {
    case 'well':
      return '#00c853'; // verde para pozos
    case 'motor':
      return '#1a73e8'; // azul para motores
    case 'transformer':
      return '#ffc107'; // amarillo para transformadores
    default:
      return '#e53935'; // rojo para otros
  }
};

// Función para obtener el color de fondo del icono según el modo
export const getIconBackground = (type, isDarkMode) => {
  // En modo oscuro, usamos colores más brillantes para mejor contraste
  if (isDarkMode) {
    switch (type) {
      case 'well':
        return '#00e676'; // verde más brillante
      case 'motor':
        return '#2979ff'; // azul más brillante
      case 'transformer':
        return '#ffab00'; // amarillo más brillante
      default:
        return '#ff5252'; // rojo más brillante
    }
  } else {
    // En modo claro, usamos los colores normales
    return getAssetColor(type);
  }
};