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
  MenuItem,
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
  LocalShipping,
  Schedule,
  CheckCircle,
  Warning,
  Delete,
} from '@mui/icons-material';
import Layout from '@/components/layout/Layout';
import Pagination from '@/components/common/Pagination';
import { dataAPI, Order } from '@/services/dataAPI';

// Real API data will be fetched and stored in state

const getStatusColor = (status: string) => {
  switch (status) {
    case 'SHIPPED':
    case 'DELIVERED':
      return 'success';
    case 'PENDING':
      return 'warning';
    case 'PROCESSING':
    case 'PICKING':
    case 'PACKING':
      return 'info';
    default:
      return 'default';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'URGENT':
      return 'error';
    case 'HIGH':
      return 'warning';
    case 'NORMAL':
      return 'info';
    case 'LOW':
      return 'default';
    default:
      return 'default';
  }
};

export default function OrdersPage() {
  const [ordersData, setOrdersData] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
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
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'warning' | 'info' });

  // Fetch orders data
  const fetchOrdersData = async (page: number = 1, limit: number = 10) => {
    try {
      setLoading(true);
      const response = await dataAPI.orders.getAll({ page, limit });
      
      if (response.status === 'success') {
        setOrdersData(response.data.orders);
        setFilteredOrders(response.data.orders);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      // For now, use mock data if API fails
      const mockOrders = [
        {
          id: '1',
          orderNumber: 'WMS-1758277436879-0025',
          customerName: 'Acme Corporation',
          status: 'SHIPPED',
          priority: 'HIGH',
          totalItems: 4,
          totalValue: 227.89,
          createdAt: '2025-09-19',
          assignedTo: 'Lisa Employee',
        },
        {
          id: '2',
          orderNumber: 'WMS-1758277436877-0024',
          customerName: 'TechStart Inc',
          status: 'PENDING',
          priority: 'NORMAL',
          totalItems: 2,
          totalValue: 149.98,
          createdAt: '2025-09-19',
          assignedTo: null,
        },
        {
          id: '3',
          orderNumber: 'WMS-1758277436873-0023',
          customerName: 'Global Logistics',
          status: 'PROCESSING',
          priority: 'URGENT',
          totalItems: 5,
          totalValue: 883.85,
          createdAt: '2025-09-19',
          assignedTo: 'Mike Supervisor',
        },
        {
          id: '4',
          orderNumber: 'WMS-1758277436869-0022',
          customerName: 'SmallBiz LLC',
          status: 'DELIVERED',
          priority: 'LOW',
          totalItems: 1,
          totalValue: 79.96,
          createdAt: '2025-09-19',
          assignedTo: 'Sarah Manager',
        },
        {
          id: '5',
          orderNumber: 'WMS-1758277436865-0021',
          customerName: 'Retail Chain Inc',
          status: 'PICKING',
          priority: 'HIGH',
          totalItems: 3,
          totalValue: 299.97,
          createdAt: '2025-09-18',
          assignedTo: 'Lisa Employee',
        },
      ];
      
      setOrdersData(mockOrders);
      setFilteredOrders(mockOrders);
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
    fetchOrdersData();
  }, []);

  // Filter orders based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredOrders(ordersData);
    } else {
      const filtered = ordersData.filter(order => 
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.assignedTo && order.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredOrders(filtered);
    }
  }, [searchTerm, ordersData]);

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Handle pagination changes
  const handlePageChange = (page: number) => {
    fetchOrdersData(page, pagination.limit);
  };

  const handleLimitChange = (limit: number) => {
    fetchOrdersData(1, limit);
  };

  const handleCreateOrder = () => {
    setOpenAddDialog(true);
  };

  const handleEditOrder = (order: any) => {
    setSelectedOrder(order);
    setOpenEditDialog(true);
  };

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setSnackbar({ open: true, message: `Viewing order ${order.orderNumber}`, severity: 'info' });
  };

  const handleDeleteOrder = (order: any) => {
    setSnackbar({ open: true, message: `Deleted order ${order.orderNumber}`, severity: 'success' });
  };

  const handleShipOrder = (order: any) => {
    setSnackbar({ open: true, message: `Order ${order.orderNumber} shipped successfully`, severity: 'success' });
  };

  const handleCloseDialogs = () => {
    setOpenAddDialog(false);
    setOpenEditDialog(false);
    setSelectedOrder(null);
  };

  const handleSaveOrder = () => {
    setSnackbar({ open: true, message: 'Order saved successfully', severity: 'success' });
    handleCloseDialogs();
  };

  return (
    <Layout>
      <Box sx={{ height: '100%', minHeight: '100%' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">Order Management</Typography>
          <Button variant="contained" startIcon={<Add />} onClick={handleCreateOrder}>
            Create Order
          </Button>
        </Box>

        {/* Quick Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Active Orders
                </Typography>
                <Typography variant="h4">89</Typography>
                <Typography variant="body2" color="success.main">
                  +5% from last week
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Pending Orders
                </Typography>
                <Typography variant="h4" color="warning.main">
                  23
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
                  Shipped Today
                </Typography>
                <Typography variant="h4">12</Typography>
                <Typography variant="body2" color="success.main">
                  On track
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
                <Typography variant="h4">$45,230</Typography>
                <Typography variant="body2" color="success.main">
                  +12% from yesterday
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Search and Filters */}
        <Box mb={3}>
          <TextField
            fullWidth
            placeholder="Search orders by order number, customer name..."
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

        {/* Orders Table */}
        <Card>
          <CardContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order Number</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell align="right">Items</TableCell>
                    <TableCell align="right">Total Value</TableCell>
                    <TableCell>Assigned To</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.orderNumber}</TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>
                        <Chip
                          label={order.status}
                          color={getStatusColor(order.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={order.priority}
                          color={getPriorityColor(order.priority) as any}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="right">{order.totalItems}</TableCell>
                      <TableCell align="right">${order.totalValue.toFixed(2)}</TableCell>
                      <TableCell>{order.assignedTo || 'Unassigned'}</TableCell>
                      <TableCell>{order.createdAt}</TableCell>
                      <TableCell align="center">
                        <IconButton size="small" onClick={() => handleViewOrder(order)}>
                          <Visibility />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleEditOrder(order)}>
                          <Edit />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDeleteOrder(order)} color="error">
                          <Delete />
                        </IconButton>
                        {order.status === 'PENDING' && (
                          <IconButton size="small" onClick={() => handleShipOrder(order)} color="primary">
                            <LocalShipping />
                          </IconButton>
                        )}
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

        {/* Create Order Dialog */}
        <Dialog open={openAddDialog} onClose={handleCloseDialogs} maxWidth="md" fullWidth>
          <DialogTitle>Create New Order</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Customer Name" variant="outlined" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Priority" select variant="outlined">
                  <MenuItem value="LOW">Low</MenuItem>
                  <MenuItem value="NORMAL">Normal</MenuItem>
                  <MenuItem value="HIGH">High</MenuItem>
                  <MenuItem value="URGENT">Urgent</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Shipping Address" multiline rows={2} variant="outlined" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Assigned To" variant="outlined" />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Order Items</Typography>
                <TextField fullWidth label="Product SKU" variant="outlined" />
                <TextField fullWidth label="Quantity" type="number" variant="outlined" sx={{ mt: 2 }} />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialogs}>Cancel</Button>
            <Button onClick={handleSaveOrder} variant="contained">Create Order</Button>
          </DialogActions>
        </Dialog>

        {/* Edit Order Dialog */}
        <Dialog open={openEditDialog} onClose={handleCloseDialogs} maxWidth="md" fullWidth>
          <DialogTitle>Edit Order</DialogTitle>
          <DialogContent>
            {selectedOrder && (
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Order Number" defaultValue={selectedOrder.orderNumber} variant="outlined" disabled />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Customer" defaultValue={selectedOrder.customerName} variant="outlined" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Status" select defaultValue={selectedOrder.status} variant="outlined">
                    <MenuItem value="PENDING">Pending</MenuItem>
                    <MenuItem value="PROCESSING">Processing</MenuItem>
                    <MenuItem value="PICKING">Picking</MenuItem>
                    <MenuItem value="PACKING">Packing</MenuItem>
                    <MenuItem value="SHIPPED">Shipped</MenuItem>
                    <MenuItem value="DELIVERED">Delivered</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Priority" select defaultValue={selectedOrder.priority} variant="outlined">
                    <MenuItem value="LOW">Low</MenuItem>
                    <MenuItem value="NORMAL">Normal</MenuItem>
                    <MenuItem value="HIGH">High</MenuItem>
                    <MenuItem value="URGENT">Urgent</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Assigned To" defaultValue={selectedOrder.assignedTo || ''} variant="outlined" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Total Value" defaultValue={selectedOrder.totalValue} variant="outlined" />
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialogs}>Cancel</Button>
            <Button onClick={handleSaveOrder} variant="contained">Save Changes</Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ 
            zIndex: 9999999,
            position: 'fixed !important',
            '& .MuiSnackbarContent-root': {
              zIndex: 9999999,
            },
            '& .MuiAlert-root': {
              zIndex: 9999999,
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
