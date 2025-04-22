import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Button, TextField, Box, Typography } from "@mui/material";
import axios from "axios";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState("");

  //Users List
  const fetchUsers = async () => {
    const res = await axios.get("/api/users");
    setUsers(res.data);
  };

  //New User Registration
  const registerUser = async () => {
    await axios.post("/api/users", { email, role: "operario" });
    fetchUsers();
    setEmail(""); //Update List
  };

  //Delete User
  const deleteUser = async (id) => {
    await axios.delete(`/api/users/${id}`);
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  //Table Columns
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Nombre", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "createdAt", headerName: "Creado el", flex: 1 },
    {
      field: "action",
      headerName: "Acciones",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="error"
          onClick={() => deleteUser(params.row.id)}
        >
          Eliminar
        </Button>
      ),
    },
    {
      field: "role",
      headerName: "Rol",
      flex: 1,
      renderCell: (params) => {
        return params.row.role === "admin" ? "Administrador" : "Operario";
      },
    },
  ];

  return (
    <Box sx={{ p: 3, height: 600 }}>
      <Typography variant="h4" gutterBottom>
        Gestión de Operarios
      </Typography>
      //Registration Form
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Email del operario"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mr: 2 }}
        />
        <Button variant="contained" onClick={registerUser}>
          Registrar Operario
        </Button>
      </Box>
      //Operator List
      <DataGrid
        rows={users}
        columns={columns}
        components={{ Toolbar: GridToolbar }}
      />
    </Box>
  );
};

export default AdminPanel;
