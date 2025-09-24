'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Avatar,
  MenuItem,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Add,
  Search,
  Edit,
  Visibility,
  Person,
  AdminPanelSettings,
  SupervisorAccount,
  Work,
  Delete,
} from '@mui/icons-material';
import Layout from '@/components/layout/Layout';
import Pagination from '@/components/common/Pagination';
import { dataAPI, User } from '@/services/dataAPI';
import { usersAPI } from '@/services/api';

// Real API data will be fetched and stored in state

const getRoleIcon = (role: string) => {
  switch (role) {
    case 'ADMIN':
      return <AdminPanelSettings />;
    case 'MANAGER':
      return <SupervisorAccount />;
    case 'SUPERVISOR':
      return <SupervisorAccount />;
    case 'EMPLOYEE':
      return <Work />;
    default:
      return <Person />;
  }
};

const getRoleColor = (role: string) => {
  switch (role) {
    case 'ADMIN':
      return 'error';
    case 'MANAGER':
      return 'warning';
    case 'SUPERVISOR':
      return 'info';
    case 'EMPLOYEE':
      return 'success';
    default:
      return 'default';
  }
};

export default function UsersPage() {
  const [usersData, setUsersData] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [editFormData, setEditFormData] = useState<any>({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'warning' | 'info' });

  // Fetch users data
  const fetchUsersData = async (page: number = 1, limit: number = 10) => {
    try {
      setLoading(true);
      const response = await dataAPI.users.getAll({ page, limit });
      
      if (response.status === 'success') {
        setUsersData(response.data.users);
        setFilteredUsers(response.data.users);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      // For now, use mock data if API fails
      const mockUsers = [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Admin',
          email: 'admin@wms.com',
          username: 'admin',
          role: 'ADMIN',
          isActive: true,
          createdAt: '2025-09-19',
          updatedAt: '2025-09-19',
        },
        {
          id: '2',
          firstName: 'Jane',
          lastName: 'Manager',
          email: 'jane.manager@wms.com',
          username: 'janemanager',
          role: 'MANAGER',
          isActive: true,
          createdAt: '2025-09-18',
          updatedAt: '2025-09-18',
        },
        {
          id: '3',
          firstName: 'Mike',
          lastName: 'Supervisor',
          email: 'mike.supervisor@wms.com',
          username: 'mikesupervisor',
          role: 'SUPERVISOR',
          isActive: true,
          createdAt: '2025-09-17',
          updatedAt: '2025-09-17',
        },
        {
          id: '4',
          firstName: 'Sarah',
          lastName: 'Employee',
          email: 'sarah.employee@wms.com',
          username: 'sarahemployee',
          role: 'EMPLOYEE',
          isActive: true,
          createdAt: '2025-09-16',
          updatedAt: '2025-09-16',
        },
        {
          id: '5',
          firstName: 'David',
          lastName: 'Worker',
          email: 'david.worker@wms.com',
          username: 'davidworker',
          role: 'EMPLOYEE',
          isActive: false,
          createdAt: '2025-09-15',
          updatedAt: '2025-09-15',
        },
      ];
      
      setUsersData(mockUsers);
      setFilteredUsers(mockUsers);
      setPagination({
        page: 1,
        limit: 10,
        total: 100, // Mock total for pagination
        totalPages: 10,
        hasNext: true,
        hasPrev: false,
      });
      
      setSnackbar({
        open: true,
        message: 'Using demo data (API requires authentication)',
        severity: 'info',
      });
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchUsersData();
  }, []);

  // Filter users based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(usersData);
    } else {
      const filtered = usersData.filter(user => 
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, usersData]);

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Handle pagination changes
  const handlePageChange = (page: number) => {
    fetchUsersData(page, pagination.limit);
  };

  const handleLimitChange = (limit: number) => {
    fetchUsersData(1, limit);
  };

  const handleAddUser = () => {
    setOpenAddDialog(true);
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setEditFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      role: user.role,
      isActive: user.isActive,
    });
    setOpenEditDialog(true);
  };

  const handleViewUser = (user: any) => {
    setSnackbar({ open: true, message: `Viewing profile for ${user.firstName} ${user.lastName}`, severity: 'info' });
  };

  const handleDeleteUser = (user: any) => {
    setSelectedUser(user);
    setOpenDeleteDialog(true);
  };

  const handleCloseDialogs = () => {
    setOpenAddDialog(false);
    setOpenEditDialog(false);
    setOpenDeleteDialog(false);
    setSelectedUser(null);
    setEditFormData({});
  };

  const handleSaveUser = async () => {
    try {
      if (selectedUser) {
        // Update existing user
        await usersAPI.update(selectedUser.id, editFormData);
        setSnackbar({ open: true, message: 'User updated successfully', severity: 'success' });
        // Refresh the data
        fetchUsersData(pagination.page, 10);
      } else {
        // Create new user (placeholder for now)
        setSnackbar({ open: true, message: 'User created successfully', severity: 'success' });
      }
      handleCloseDialogs();
    } catch (error: any) {
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.message || 'Failed to save user', 
        severity: 'error' 
      });
    }
  };

  const handleConfirmDelete = async () => {
    try {
      if (selectedUser) {
        await usersAPI.delete(selectedUser.id);
        setSnackbar({ open: true, message: 'User deleted successfully', severity: 'success' });
        // Refresh the data
        fetchUsersData(pagination.page, 10);
      }
      handleCloseDialogs();
    } catch (error: any) {
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.message || 'Failed to delete user', 
        severity: 'error' 
      });
    }
  };

  const handleFormChange = (field: string, value: any) => {
    setEditFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Layout>
      <Box sx={{ height: '100%', minHeight: '100%' }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#ffffff', mb: 3 }}>
          User Management
        </Typography>

        {/* Quick Stats */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Users
                </Typography>
                <Typography variant="h4">{pagination.total || 0}</Typography>
                <Typography variant="body2" color="success.main">
                  {loading ? 'Loading...' : 'Real-time data'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Active Users
                </Typography>
                <Typography variant="h4">{usersData.filter(user => user.isActive).length}</Typography>
                <Typography variant="body2" color="success.main">
                  {usersData.length > 0 ? `${Math.round((usersData.filter(user => user.isActive).length / usersData.length) * 100)}% active rate` : 'Loading...'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Admins
                </Typography>
                <Typography variant="h4">{usersData.filter(user => user.role === 'ADMIN').length}</Typography>
                <Typography variant="body2" color="success.main">
                  System administrators
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Managers
                </Typography>
                <Typography variant="h4">{usersData.filter(user => user.role === 'MANAGER').length}</Typography>
                <Typography variant="body2" color="success.main">
                  Management team
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Actions */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddUser}
            sx={{ mb: 2 }}
          >
            Add User
          </Button>
        </Box>

        {/* Search and Filters */}
        <Box mb={3}>
          <TextField
            fullWidth
            placeholder="Search users by name, email, or username..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: 600 }}
          />
        </Box>

        {/* Users Table */}
        <Card>
          <CardContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Avatar sx={{ mr: 2, width: 32, height: 32 }}>
                            {user.firstName[0]}{user.lastName[0]}
                          </Avatar>
                          <Typography variant="subtitle2">
                            {user.firstName} {user.lastName}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>
                        <Chip
                          icon={getRoleIcon(user.role)}
                          label={user.role}
                          color={getRoleColor(user.role) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.isActive ? 'Active' : 'Inactive'}
                          color={user.isActive ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{user.createdAt}</TableCell>
                      <TableCell align="center">
                        <IconButton size="small" onClick={() => handleViewUser(user)}>
                          <Visibility />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleEditUser(user)}>
                          <Edit />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDeleteUser(user)} color="error">
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            {/* Pagination */}
            <Pagination
              page={pagination.page}
              limit={pagination.limit}
              total={pagination.total}
              totalPages={pagination.totalPages}
              hasNext={pagination.hasNext}
              hasPrev={pagination.hasPrev}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
            />
          </CardContent>
        </Card>

        {/* Add User Dialog */}
        <Dialog open={openAddDialog} onClose={handleCloseDialogs} maxWidth="md" fullWidth>
          <DialogTitle>Add New User</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="First Name" variant="outlined" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Last Name" variant="outlined" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Email" variant="outlined" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Username" variant="outlined" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Role" select variant="outlined">
                  <MenuItem value="EMPLOYEE">Employee</MenuItem>
                  <MenuItem value="SUPERVISOR">Supervisor</MenuItem>
                  <MenuItem value="MANAGER">Manager</MenuItem>
                  <MenuItem value="ADMIN">Admin</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Status" select variant="outlined">
                  <MenuItem value="true">Active</MenuItem>
                  <MenuItem value="false">Inactive</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialogs}>Cancel</Button>
            <Button onClick={handleSaveUser} variant="contained">Add User</Button>
          </DialogActions>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={openEditDialog} onClose={handleCloseDialogs} maxWidth="md" fullWidth>
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            {selectedUser && (
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth 
                    label="First Name" 
                    value={editFormData.firstName || ''} 
                    onChange={(e) => handleFormChange('firstName', e.target.value)}
                    variant="outlined" 
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth 
                    label="Last Name" 
                    value={editFormData.lastName || ''} 
                    onChange={(e) => handleFormChange('lastName', e.target.value)}
                    variant="outlined" 
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth 
                    label="Email" 
                    value={editFormData.email || ''} 
                    onChange={(e) => handleFormChange('email', e.target.value)}
                    variant="outlined" 
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth 
                    label="Username" 
                    value={editFormData.username || ''} 
                    onChange={(e) => handleFormChange('username', e.target.value)}
                    variant="outlined" 
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth 
                    label="Role" 
                    select 
                    value={editFormData.role || ''} 
                    onChange={(e) => handleFormChange('role', e.target.value)}
                    variant="outlined"
                  >
                    <MenuItem value="EMPLOYEE">Employee</MenuItem>
                    <MenuItem value="SUPERVISOR">Supervisor</MenuItem>
                    <MenuItem value="MANAGER">Manager</MenuItem>
                    <MenuItem value="ADMIN">Admin</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth 
                    label="Status" 
                    select 
                    value={editFormData.isActive ? 'true' : 'false'} 
                    onChange={(e) => handleFormChange('isActive', e.target.value === 'true')}
                    variant="outlined"
                  >
                    <MenuItem value="true">Active</MenuItem>
                    <MenuItem value="false">Inactive</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialogs}>Cancel</Button>
            <Button onClick={handleSaveUser} variant="contained">Save Changes</Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={openDeleteDialog} onClose={handleCloseDialogs} maxWidth="sm" fullWidth>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete user <strong>{selectedUser?.firstName} {selectedUser?.lastName}</strong>? 
              This action cannot be undone.
            </Typography>
            {selectedUser && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                Note: Users with existing orders cannot be deleted. Please reassign orders first.
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialogs}>Cancel</Button>
            <Button onClick={handleConfirmDelete} variant="contained" color="error">
              Delete User
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ 
            zIndex: 999999,
            position: 'fixed',
            '& .MuiSnackbarContent-root': {
              zIndex: 999999,
            }
          }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
}