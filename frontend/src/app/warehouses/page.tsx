'use client';

import React, { useState } from 'react';
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
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Add,
  Edit,
  Visibility,
  LocationOn,
  Inventory,
  LocalShipping,
  Delete,
} from '@mui/icons-material';
import Layout from '@/components/layout/Layout';

// Mock warehouses data
const warehousesData = [
  {
    id: '1',
    name: 'Main Distribution Center',
    address: '123 Industrial Blvd, Los Angeles, CA 90210',
    status: 'Active',
    zones: 6,
    inventoryItems: 1247,
    activeOrders: 45,
  },
  {
    id: '2',
    name: 'East Coast Warehouse',
    address: '456 Commerce Ave, New York, NY 10001',
    status: 'Active',
    zones: 5,
    inventoryItems: 892,
    activeOrders: 23,
  },
  {
    id: '3',
    name: 'South Regional Hub',
    address: '789 Logistics Dr, Atlanta, GA 30301',
    status: 'Active',
    zones: 4,
    inventoryItems: 634,
    activeOrders: 18,
  },
];

export default function WarehousesPage() {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<any>(null);
  const [editFormData, setEditFormData] = useState<any>({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'warning' | 'info' });

  const handleAddWarehouse = () => {
    setOpenAddDialog(true);
  };

  const handleEditWarehouse = (warehouse: any) => {
    setSelectedWarehouse(warehouse);
    setEditFormData({
      name: warehouse.name,
      address: warehouse.address,
      zones: warehouse.zones,
      status: warehouse.status,
    });
    setOpenEditDialog(true);
  };

  const handleViewWarehouse = (warehouse: any) => {
    setSnackbar({ open: true, message: `Viewing details for ${warehouse.name}`, severity: 'info' });
  };

  const handleDeleteWarehouse = (warehouse: any) => {
    setSelectedWarehouse(warehouse);
    setOpenDeleteDialog(true);
  };

  const handleCloseDialogs = () => {
    setOpenAddDialog(false);
    setOpenEditDialog(false);
    setOpenDeleteDialog(false);
    setSelectedWarehouse(null);
    setEditFormData({});
  };

  const handleSaveWarehouse = () => {
    // For now, just show success message since we're using mock data
    setSnackbar({ open: true, message: 'Warehouse saved successfully', severity: 'success' });
    handleCloseDialogs();
  };

  const handleConfirmDelete = () => {
    // For now, just show success message since we're using mock data
    setSnackbar({ open: true, message: `Deleted warehouse ${selectedWarehouse?.name}`, severity: 'success' });
    handleCloseDialogs();
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
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">Warehouse Management</Typography>
          <Button variant="contained" startIcon={<Add />} onClick={handleAddWarehouse}>
            Add Warehouse
          </Button>
        </Box>

        {/* Quick Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Warehouses
                </Typography>
                <Typography variant="h4">3</Typography>
                <Typography variant="body2" color="success.main">
                  All operational
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Zones
                </Typography>
                <Typography variant="h4">15</Typography>
                <Typography variant="body2" color="success.main">
                  Optimized layout
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Storage Locations
                </Typography>
                <Typography variant="h4">2,773</Typography>
                <Typography variant="body2" color="success.main">
                  +5% capacity
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Active Orders
                </Typography>
                <Typography variant="h4">86</Typography>
                <Typography variant="body2" color="success.main">
                  Processing smoothly
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Warehouses Table */}
        <Card>
          <CardContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Warehouse</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Zones</TableCell>
                    <TableCell align="center">Inventory Items</TableCell>
                    <TableCell align="center">Active Orders</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {warehousesData.map((warehouse) => (
                    <TableRow key={warehouse.id}>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <LocationOn sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="subtitle2">
                            {warehouse.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{warehouse.address}</TableCell>
                      <TableCell>
                        <Chip
                          label={warehouse.status}
                          color="success"
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box display="flex" alignItems="center" justifyContent="center">
                          <Typography variant="body2" sx={{ mr: 1 }}>
                            {warehouse.zones}
                          </Typography>
                          <Inventory color="action" />
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Box display="flex" alignItems="center" justifyContent="center">
                          <Typography variant="body2" sx={{ mr: 1 }}>
                            {warehouse.inventoryItems.toLocaleString()}
                          </Typography>
                          <Inventory color="action" />
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Box display="flex" alignItems="center" justifyContent="center">
                          <Typography variant="body2" sx={{ mr: 1 }}>
                            {warehouse.activeOrders}
                          </Typography>
                          <LocalShipping color="action" />
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton size="small" onClick={() => handleViewWarehouse(warehouse)}>
                          <Visibility />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleEditWarehouse(warehouse)}>
                          <Edit />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDeleteWarehouse(warehouse)} color="error">
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Add Warehouse Dialog */}
        <Dialog open={openAddDialog} onClose={handleCloseDialogs} maxWidth="md" fullWidth>
          <DialogTitle>Add New Warehouse</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField fullWidth label="Warehouse Name" variant="outlined" />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Address" multiline rows={2} variant="outlined" />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="City" variant="outlined" />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="State" variant="outlined" />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="ZIP Code" variant="outlined" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Country" defaultValue="US" variant="outlined" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Status" select defaultValue="Active" variant="outlined">
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialogs}>Cancel</Button>
            <Button onClick={handleSaveWarehouse} variant="contained">Add Warehouse</Button>
          </DialogActions>
        </Dialog>

        {/* Edit Warehouse Dialog */}
        <Dialog open={openEditDialog} onClose={handleCloseDialogs} maxWidth="md" fullWidth>
          <DialogTitle>Edit Warehouse</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField 
                  fullWidth 
                  label="Warehouse Name" 
                  value={editFormData.name || ''} 
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  variant="outlined" 
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  fullWidth 
                  label="Address" 
                  multiline 
                  rows={2} 
                  value={editFormData.address || ''} 
                  onChange={(e) => handleFormChange('address', e.target.value)}
                  variant="outlined" 
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth 
                  label="Zones" 
                  type="number" 
                  value={editFormData.zones || ''} 
                  onChange={(e) => handleFormChange('zones', parseInt(e.target.value) || 0)}
                  variant="outlined" 
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth 
                  label="Status" 
                  select 
                  value={editFormData.status || ''} 
                  onChange={(e) => handleFormChange('status', e.target.value)}
                  variant="outlined"
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialogs}>Cancel</Button>
            <Button onClick={handleSaveWarehouse} variant="contained">Save Changes</Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={openDeleteDialog} onClose={handleCloseDialogs}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Alert severity="warning">
              Are you sure you want to delete the warehouse "{selectedWarehouse?.name}"? This action cannot be undone.
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialogs}>Cancel</Button>
            <Button onClick={handleConfirmDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ zIndex: 9999 }}
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
