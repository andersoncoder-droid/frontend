// assetIcons.js
// Utility functions for asset icons and colors based on asset type and theme mode.
// Used for map markers and UI elements.

// Utilidades para iconos y colores de activos
// getAssetIcon: Returns icon path for asset type.
export const getAssetIcon = (type) => {
  switch (type) {
    case "well":
      return "/assets/icons/well-icon.png"; // Icono local de pozo
    case "motor":
      return "/assets/icons/motor-icon.png"; // Icono local de motor
    case "transformer":
      return "/assets/icons/transformer-icon.png"; // Icono local de transformador
    default:
      return "/assets/icons/well-icon.png"; // Icono por defecto
  }
};

// getAssetColor: Returns color for asset type.
export const getAssetColor = (type) => {
  switch (type) {
    case "well":
      return "#00c853"; // verde para pozos
    case "motor":
      return "#1a73e8"; // azul para motores
    case "transformer":
      return "#ffc107"; // amarillo para transformadores
    default:
      return "#e53935"; // rojo para otros
  }
};

// Función para obtener el color de fondo del icono según el modo
// getIconBackground: Returns background color for icon based on theme mode.
export const getIconBackground = (type, isDarkMode) => {
  // En modo oscuro, usamos colores más brillantes para mejor contraste
  if (isDarkMode) {
    switch (type) {
      case "well":
        return "#00e676"; // verde más brillante
      case "motor":
        return "#2979ff"; // azul más brillante
      case "transformer":
        return "#ffab00"; // amarillo más brillante
      default:
        return "#ff5252"; // rojo más brillante
    }
  } else {
    // En modo claro, usamos los colores normales
    return getAssetColor(type);
  }
};
