import React, { useState, useContext } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add } from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';
import { AuthContext } from '../context/AuthContext';

const UserManagement = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([
    { id: 1, username: 'admin', email: 'admin@decimetrix.com', role: 'admin' },
    { id: 2, username: 'operator', email: 'operator@decimetrix.com', role: 'operator' },
    { id: 3, username: 'user1', email: 'user1@decimetrix.com', role: 'operator' },
    { id: 4, username: 'user2', email: 'user2@decimetrix.com', role: 'operator' },
  ]);

  const handleAddUser = () => {
    const newUser = {
      id: users.length + 1,
      username: `user${users.length + 1}`,
      email: `user${users.length + 1}@decimetrix.com`,
      role: 'operator'
    };
    setUsers([...users, newUser]);
  };

  // Remove the old handleEditUser implementation
  const handleDeleteUser = (userToDelete) => {
    const filteredUsers = users.filter(user => user.id !== userToDelete.id);
    setUsers(filteredUsers);
  };

  const canModifyUser = (username) => {
    return username !== 'admin' && username !== 'operator';
  };

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    username: '',
    email: '',
    role: ''
  });

  // Keep this new implementation of handleEditUser
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditFormData({
      username: user.username,
      email: user.email,
      role: user.role
    });
    setOpenEditDialog(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditSubmit = () => {
    const updatedUsers = users.map(user => 
      user.id === selectedUser.id 
        ? { ...user, ...editFormData }
        : user
    );
    setUsers(updatedUsers);
    setOpenEditDialog(false);
    setSelectedUser(null);
  };

  return (
    <MainLayout>
      <Box sx={{ 
        mb: 4, 
        display: 'flex', 
        flexDirection: 'column',
        gap: 2
      }}>
        <Typography variant="h4">
          Gestión de Usuarios
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          backgroundColor: '#f5f5f5',
          padding: 2,
          borderRadius: 1
        }}>
          <Typography variant="body1" color="textSecondary">
            Manage system users and their roles
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<Add />}
            onClick={handleAddUser}
            sx={{
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#1565c0'
              }
            }}
          >
            Add User
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ 
        overflowX: 'auto',
        '& .MuiTable-root': {
          minWidth: { xs: 650, sm: 750 }
        }
      }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  {canModifyUser(user.username) ? (
                    <>
                      <IconButton size="small" onClick={() => handleEditUser(user)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteUser(user)}>
                        <DeleteIcon />
                      </IconButton>
                    </>
                  ) : (
                    <Tooltip title="Los usuarios admin y operator no pueden ser modificados">
                      <span>
                        <IconButton size="small" disabled>
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" disabled>
                          <DeleteIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Diálogo para editar usuario */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Usuario</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={editFormData.username}
              onChange={handleEditFormChange}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={editFormData.email}
              onChange={handleEditFormChange}
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={editFormData.role}
                onChange={handleEditFormChange}
                label="Role"
                disabled={user?.role !== 'admin'}
              >
                <MenuItem value="operator">Operator</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancelar</Button>
          <Button onClick={handleEditSubmit} variant="contained" color="primary">
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default UserManagement;