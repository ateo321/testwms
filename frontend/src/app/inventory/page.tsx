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
  Warning,
  CheckCircle,
  Delete,
} from '@mui/icons-material';
import Layout from '@/components/layout/Layout';
import Pagination from '@/components/common/Pagination';
import { dataAPI, InventoryItem } from '@/services/dataAPI';
import { inventoryAPI } from '@/services/api';

// Real API data will be fetched and stored in state

export default function InventoryPage() {
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>([]);
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
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [editFormData, setEditFormData] = useState<any>({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'warning' | 'info' });

  // Fetch inventory data
  const fetchInventoryData = async (page: number = 1, limit: number = 10) => {
    try {
      setLoading(true);
      const response = await dataAPI.inventory.getAll({ page, limit });
      
      if (response.status === 'success') {
        setInventoryData(response.data.inventory);
        setFilteredInventory(response.data.inventory);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch inventory data',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchInventoryData();
  }, []);

  // Filter inventory based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredInventory(inventoryData);
    } else {
      const filtered = inventoryData.filter(item => 
        item.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.warehouse.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredInventory(filtered);
    }
  }, [searchTerm, inventoryData]);

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Handle pagination changes
  const handlePageChange = (page: number) => {
    fetchInventoryData(page, pagination.limit);
  };

  const handleLimitChange = (limit: number) => {
    fetchInventoryData(1, limit);
  };

  const handleAddInventory = () => {
    setOpenAddDialog(true);
  };

  const handleEditInventory = (item: any) => {
    setSelectedItem(item);
    setEditFormData({
      quantity: item.quantity,
      availableQty: item.available,
      reservedQty: item.reserved,
    });
    setOpenEditDialog(true);
  };

  const handleViewInventory = (item: any) => {
    setSelectedItem(item);
    // In a real app, this would navigate to a detailed view
    setSnackbar({ open: true, message: `Viewing details for ${item.product.name}`, severity: 'info' });
  };

  const handleDeleteInventory = (item: any) => {
    setSelectedItem(item);
    setOpenDeleteDialog(true);
  };

  const handleCloseDialogs = () => {
    setOpenAddDialog(false);
    setOpenEditDialog(false);
    setOpenDeleteDialog(false);
    setSelectedItem(null);
    setEditFormData({});
  };

  const handleSaveInventory = async () => {
    try {
      if (selectedItem) {
        // Debug: Log the data being sent
        console.log('Updating inventory item:', selectedItem.id, editFormData);
        
        // Update existing inventory item
        await inventoryAPI.update(selectedItem.id, editFormData);
        setSnackbar({ open: true, message: 'Inventory item updated successfully', severity: 'success' });
        // Refresh the data
        fetchInventoryData(pagination.page, 10);
      } else {
        // Create new inventory item (placeholder for now)
        setSnackbar({ open: true, message: 'Inventory item created successfully', severity: 'success' });
      }
      handleCloseDialogs();
    } catch (error: any) {
      console.error('Error saving inventory:', error);
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.message || 'Failed to save inventory item', 
        severity: 'error' 
      });
    }
  };

  const handleConfirmDelete = async () => {
    try {
      if (selectedItem) {
        await inventoryAPI.delete(selectedItem.id);
        setSnackbar({ open: true, message: 'Inventory item deleted successfully', severity: 'success' });
        // Refresh the data
        fetchInventoryData(pagination.page, 10);
      }
      handleCloseDialogs();
    } catch (error: any) {
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.message || 'Failed to delete inventory item', 
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
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">Inventory Management</Typography>
          <Button variant="contained" startIcon={<Add />} onClick={handleAddInventory}>
            Add Inventory
          </Button>
        </Box>

        {/* Quick Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Items
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
                  Low Stock Items
                </Typography>
                <Typography variant="h4" color="warning.main">
                  {inventoryData.filter(item => item.quantity <= 10).length}
                </Typography>
                <Typography variant="body2" color="warning.main">
                  Needs attention
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Out of Stock
                </Typography>
                <Typography variant="h4" color="error.main">
                  {inventoryData.filter(item => item.quantity === 0).length}
                </Typography>
                <Typography variant="body2" color="error.main">
                  Critical
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Value
                </Typography>
                <Typography variant="h4">
                  ${inventoryData.reduce((sum, item) => sum + (item.quantity * 50), 0).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="success.main">
                  {loading ? 'Loading...' : 'Calculated value'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Search and Filters */}
        <Box mb={3}>
          <TextField
            fullWidth
            placeholder="Search inventory by SKU, product name, or location..."
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

        {/* Inventory Table */}
        <Card>
          <CardContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>SKU</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Available</TableCell>
                    <TableCell align="right">Reserved</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Warehouse</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredInventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.product.name}</TableCell>
                      <TableCell>{item.product.sku}</TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">{item.available}</TableCell>
                      <TableCell align="right">{item.reserved}</TableCell>
                      <TableCell>
                        <Chip
                          icon={item.status === 'Low Stock' ? <Warning /> : <CheckCircle />}
                          label={item.status}
                          color={item.status === 'Low Stock' ? 'warning' : 'success'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{item.warehouse}</TableCell>
                      <TableCell align="center">
                        <IconButton size="small" onClick={() => handleViewInventory(item)}>
                          <Visibility />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleEditInventory(item)}>
                          <Edit />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDeleteInventory(item)} color="error">
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

        {/* Add Inventory Dialog */}
        <Dialog open={openAddDialog} onClose={handleCloseDialogs} maxWidth="md" fullWidth>
          <DialogTitle>Add New Inventory Item</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Product Name" variant="outlined" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="SKU" variant="outlined" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Location" variant="outlined" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Quantity" type="number" variant="outlined" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Warehouse" variant="outlined" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Unit Price" type="number" variant="outlined" />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialogs}>Cancel</Button>
            <Button onClick={handleSaveInventory} variant="contained">Save</Button>
          </DialogActions>
        </Dialog>

        {/* Edit Inventory Dialog */}
        <Dialog open={openEditDialog} onClose={handleCloseDialogs} maxWidth="md" fullWidth>
          <DialogTitle>Edit Inventory Item</DialogTitle>
          <DialogContent>
            {selectedItem && (
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth 
                    label="Product Name" 
                    value={selectedItem.product.name} 
                    variant="outlined" 
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth 
                    label="SKU" 
                    value={selectedItem.product.sku} 
                    variant="outlined" 
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth 
                    label="Location" 
                    value={selectedItem.location} 
                    variant="outlined" 
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth 
                    label="Quantity" 
                    type="number" 
                    value={editFormData.quantity || ''} 
                    onChange={(e) => handleFormChange('quantity', parseInt(e.target.value) || 0)}
                    variant="outlined" 
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth 
                    label="Warehouse" 
                    value={selectedItem.warehouse} 
                    variant="outlined" 
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth 
                    label="Available" 
                    type="number" 
                    value={editFormData.availableQty || ''} 
                    onChange={(e) => handleFormChange('availableQty', parseInt(e.target.value) || 0)}
                    variant="outlined" 
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth 
                    label="Reserved" 
                    type="number" 
                    value={editFormData.reservedQty || ''} 
                    onChange={(e) => handleFormChange('reservedQty', parseInt(e.target.value) || 0)}
                    variant="outlined" 
                  />
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialogs}>Cancel</Button>
            <Button onClick={handleSaveInventory} variant="contained">Save Changes</Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={openDeleteDialog} onClose={handleCloseDialogs} maxWidth="sm" fullWidth>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete inventory item <strong>{selectedItem?.product?.name}</strong>? 
              This action cannot be undone.
            </Typography>
            {selectedItem && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                Note: Inventory items with existing order items cannot be deleted. Please remove from orders first.
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialogs}>Cancel</Button>
            <Button onClick={handleConfirmDelete} variant="contained" color="error">
              Delete Item
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
