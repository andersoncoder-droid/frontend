import React, { useState, useEffect, useContext } from "react";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Box,
  Typography,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { AssetsContext } from "../context/AssetsContext";

const AddAssetForm = ({ onAssetAdded, initialData }) => {
  const { addAsset, updateAsset } = useContext(AssetsContext);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));

  const [formData, setFormData] = useState({
    name: "",
    type: "well",
    latitude: "",
    longitude: "",
    comments: "",
  });
  // Cargar datos iniciales si estamos editando
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        type: initialData.type || "well",
        latitude: initialData.latitude || "",
        longitude: initialData.longitude || "",
        comments: initialData.comments || "",
      });
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (initialData) {
        // Si tenemos initialData, estamos editando
        await updateAsset({
          ...formData,
          id: initialData.id,
        });
      } else {
        // Si no hay initialData, estamos creando
        await addAsset(formData);
      }
      onAssetAdded();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add onCancel handler
  const onCancel = () => {
    if (onAssetAdded) {
      onAssetAdded();
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        mt: 2,
        "& .MuiTextField-root": {
          mb: 2,
          width: "100%",
        },
        "& .MuiFormControl-root": {
          mb: 2,
          width: "100%",
        },
      }}
    >
      <TextField
        required
        label="Nombre del Activo"
        name="name"
        value={formData.name}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
      />

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Tipo de Activo</InputLabel>
        <Select
          required
          name="type"
          value={formData.type}
          onChange={handleChange}
          label="Tipo de Activo"
        >
          <MenuItem value="well">Pozo</MenuItem>
          <MenuItem value="motor">Motor</MenuItem>
          <MenuItem value="transformer">Transformador</MenuItem>
        </Select>
      </FormControl>

      <TextField
        required
        label="Latitud"
        name="latitude"
        type="number"
        value={formData.latitude}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
        inputProps={{
          step: "0.0001",
        }}
      />

      <TextField
        required
        label="Longitud"
        name="longitude"
        type="number"
        value={formData.longitude}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
        inputProps={{
          step: "0.0001",
        }}
      />

      <TextField
        label="Comentarios"
        name="comments"
        value={formData.comments}
        onChange={handleChange}
        multiline
        rows={4}
        fullWidth
        sx={{ mb: 3 }}
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
          mt: 3,
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Button
          variant="outlined"
          onClick={onCancel}
          fullWidth={matches}
          sx={{
            minWidth: { xs: "100%", sm: "120px" },
            mb: { xs: 1, sm: 0 },
          }}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="contained"
          fullWidth={matches}
          sx={{
            minWidth: { xs: "100%", sm: "120px" },
          }}
        >
          {initialData ? "Guardar" : "Añadir"}
        </Button>
      </Box>
    </Box>
  );
};

export default AddAssetForm;
