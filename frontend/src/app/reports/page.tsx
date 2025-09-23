'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Assessment,
  Download,
  TrendingUp,
  TrendingDown,
  Inventory,
  LocalShipping,
  AttachMoney,
  Schedule,
  Refresh,
  Warning,
  CheckCircle,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Layout from '@/components/layout/Layout';
import { reportsAPI } from '@/services/api';

export default function ReportsPage() {
  const [period, setPeriod] = useState('30');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [metrics, setMetrics] = useState<any>(null);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [warehousePerformance, setWarehousePerformance] = useState<any[]>([]);
  const [orderStatus, setOrderStatus] = useState<any[]>([]);
  const [inventoryLevels, setInventoryLevels] = useState<any[]>([]);

  const fetchReportsData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [metricsData, topProductsData, warehouseData, orderStatusData, inventoryData] = await Promise.all([
        reportsAPI.getMetrics(period),
        reportsAPI.getTopProducts(period, 5),
        reportsAPI.getWarehousePerformance(period),
        reportsAPI.getOrderStatus(period),
        reportsAPI.getInventoryLevels()
      ]);

      setMetrics(metricsData);
      setTopProducts(topProductsData);
      setWarehousePerformance(warehouseData);
      setOrderStatus(orderStatusData);
      setInventoryLevels(inventoryData);
    } catch (err: any) {
      console.error('Error fetching reports:', err);
      setError('Failed to load reports data. Please try again.');
      // Set fallback data
      setMetrics({
        totalOrders: 25,
        revenue: 15750.50,
        inventoryValue: 45000,
        avgOrderTime: 2.3,
        orderGrowth: 12.5,
        revenueGrowth: 8.2,
        inventoryGrowth: 5.0,
        avgOrderTimeGrowth: 0.2
      });
      setTopProducts([
        { productName: 'Wireless Bluetooth Headphones', unitsSold: 15, revenue: 1199.25 },
        { productName: 'Smartphone Case', unitsSold: 12, revenue: 599.88 },
        { productName: 'USB-C Cable', unitsSold: 8, revenue: 159.92 },
        { productName: 'Wireless Charger', unitsSold: 6, revenue: 359.94 },
        { productName: 'Bluetooth Speaker', unitsSold: 4, revenue: 399.96 }
      ]);
      setWarehousePerformance([
        { warehouseName: 'Main Distribution Center', totalOrders: 15, avgOrderTime: 2.1, efficiency: 95 },
        { warehouseName: 'East Coast Warehouse', totalOrders: 7, avgOrderTime: 2.5, efficiency: 88 },
        { warehouseName: 'South Regional Hub', totalOrders: 3, avgOrderTime: 2.8, efficiency: 82 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportsData();
  }, [period]);

  const handlePeriodChange = (event: any) => {
    setPeriod(event.target.value);
  };

  const handleRefresh = () => {
    fetchReportsData();
  };

  const handleExport = () => {
    if (!metrics) {
      alert('No data available to export. Please wait for data to load.');
      return;
    }

    // Create comprehensive report data
    const reportData = {
      period: period,
      generatedAt: new Date().toISOString(),
      metrics: metrics,
      topProducts: topProducts,
      warehousePerformance: warehousePerformance,
      orderStatus: orderStatus,
      inventoryLevels: inventoryLevels.filter(item => item.isLowStock || item.isOverstock),
    };

    // Generate and download CSV report
    generateCSVReport(reportData);
  };

  const generateCSVReport = (data: any) => {
    const csvContent = [
      // Header
      ['WMS Reports Export'],
      ['Generated:', new Date().toLocaleString()],
      ['Period:', `${data.period} days`],
      [''],
      ['KEY METRICS'],
      ['Metric', 'Value', 'Growth %'],
      ['Total Orders', data.metrics.totalOrders, data.metrics.orderGrowth],
      ['Revenue', `$${data.metrics.revenue.toFixed(2)}`, data.metrics.revenueGrowth],
      ['Inventory Value', `$${data.metrics.inventoryValue.toFixed(2)}`, data.metrics.inventoryGrowth],
      ['Avg Order Time', `${data.metrics.avgOrderTime} hrs`, data.metrics.avgOrderTimeGrowth],
      [''],
      ['TOP SELLING PRODUCTS'],
      ['Product Name', 'Units Sold', 'Revenue'],
      ...data.topProducts.map((product: any) => [
        product.productName,
        product.unitsSold,
        `$${product.revenue.toFixed(2)}`
      ]),
      [''],
      ['WAREHOUSE PERFORMANCE'],
      ['Warehouse Name', 'Total Orders', 'Avg Order Time (hrs)', 'Efficiency %'],
      ...data.warehousePerformance.map((warehouse: any) => [
        warehouse.warehouseName,
        warehouse.totalOrders,
        warehouse.avgOrderTime,
        warehouse.efficiency
      ]),
      [''],
      ['ORDER STATUS DISTRIBUTION'],
      ['Status', 'Count', 'Percentage'],
      ...data.orderStatus.map((status: any) => [
        status.status,
        status.count,
        `${status.percentage}%`
      ]),
      [''],
      ['INVENTORY ALERTS'],
      ['Product Name', 'Current Stock', 'Status', 'Value'],
      ...data.inventoryLevels.map((item: any) => [
        item.productName,
        item.quantity,
        item.isLowStock ? 'Low Stock' : 'Overstock',
        `$${(item.quantity * (item.product?.unitPrice || 0)).toFixed(2)}`
      ])
    ];

    // Convert to CSV string
    const csvString = csvContent.map((row: any[]) => 
      row.map((cell: any) => `"${cell}"`).join(',')
    ).join('\n');

    // Create and download file
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `WMS_Reports_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success message
    alert('Report exported successfully as CSV!');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? 
      <TrendingUp sx={{ color: '#10b981', fontSize: 20 }} /> : 
      <TrendingDown sx={{ color: '#ef4444', fontSize: 20 }} />;
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? '#10b981' : '#ef4444';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SHIPPED':
      case 'DELIVERED':
        return '#10b981'; // Bright green
      case 'PENDING':
        return '#3b82f6'; // Bright blue
      case 'PROCESSING':
      case 'PICKING':
      case 'PACKING':
        return '#f59e0b'; // Bright orange
      default:
        return '#6b7280'; // Gray
    }
  };

  if (loading) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ height: '100%', minHeight: '100%' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">Reports & Analytics</Typography>
          <Box display="flex" gap={2}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>Time Period</InputLabel>
              <Select 
                value={period} 
                label="Time Period" 
                onChange={handlePeriodChange}
                sx={{
                  color: '#ffffff',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(99, 102, 241, 0.8)',
                  },
                  '& .MuiSelect-icon': {
                    color: '#ffffff',
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: 2,
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    },
                  },
                }}
              >
                <MenuItem value="7">Last 7 days</MenuItem>
                <MenuItem value="30">Last 30 days</MenuItem>
                <MenuItem value="90">Last 90 days</MenuItem>
                <MenuItem value="365">Last year</MenuItem>
              </Select>
            </FormControl>
            <Tooltip title="Refresh Data">
              <IconButton 
                onClick={handleRefresh} 
                sx={{
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  '&:hover': {
                    backgroundColor: 'rgba(99, 102, 241, 0.2)',
                    border: '1px solid rgba(99, 102, 241, 0.5)',
                  },
                }}
              >
                <Refresh sx={{ color: '#6366f1' }} />
              </IconButton>
            </Tooltip>
            <Button 
              variant="contained" 
              startIcon={<Download />} 
              onClick={handleExport}
              sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5b5bd6 0%, #7c3aed 100%)',
                },
              }}
            >
              Export CSV
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Key Metrics */}
        {metrics && (
          <Grid container spacing={3} sx={{ mb: 4, position: 'relative', zIndex: 1 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Total Orders
                      </Typography>
                      <Typography variant="h4">{metrics.totalOrders}</Typography>
                      <Box display="flex" alignItems="center" mt={1}>
                        {getGrowthIcon(metrics.orderGrowth)}
                        <Typography variant="body2" sx={{ color: getGrowthColor(metrics.orderGrowth), ml: 0.5 }}>
                          {metrics.orderGrowth >= 0 ? '+' : ''}{metrics.orderGrowth}% from last period
                        </Typography>
                      </Box>
                    </Box>
                    <Assessment sx={{ fontSize: 40, color: '#6366f1' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Revenue
                      </Typography>
                      <Typography variant="h4">{formatCurrency(metrics.revenue)}</Typography>
                      <Box display="flex" alignItems="center" mt={1}>
                        {getGrowthIcon(metrics.revenueGrowth)}
                        <Typography variant="body2" sx={{ color: getGrowthColor(metrics.revenueGrowth), ml: 0.5 }}>
                          {metrics.revenueGrowth >= 0 ? '+' : ''}{metrics.revenueGrowth}% from last period
                        </Typography>
                      </Box>
                    </Box>
                    <AttachMoney sx={{ fontSize: 40, color: '#10b981' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Inventory Value
                      </Typography>
                      <Typography variant="h4">{formatCurrency(metrics.inventoryValue)}</Typography>
                      <Box display="flex" alignItems="center" mt={1}>
                        {getGrowthIcon(metrics.inventoryGrowth)}
                        <Typography variant="body2" sx={{ color: getGrowthColor(metrics.inventoryGrowth), ml: 0.5 }}>
                          {metrics.inventoryGrowth >= 0 ? '+' : ''}{metrics.inventoryGrowth}% from last period
                        </Typography>
                      </Box>
                    </Box>
                    <Inventory sx={{ fontSize: 40, color: '#3b82f6' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Avg. Order Time
                      </Typography>
                      <Typography variant="h4">{metrics.avgOrderTime} hrs</Typography>
                      <Box display="flex" alignItems="center" mt={1}>
                        {getGrowthIcon(-metrics.avgOrderTimeGrowth)}
                        <Typography variant="body2" sx={{ color: getGrowthColor(-metrics.avgOrderTimeGrowth), ml: 0.5 }}>
                          {metrics.avgOrderTimeGrowth >= 0 ? '+' : ''}{metrics.avgOrderTimeGrowth} hrs from last period
                        </Typography>
                      </Box>
                    </Box>
                    <Schedule sx={{ fontSize: 40, color: '#f59e0b' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Charts and Visualizations */}
        {metrics && (
          <Grid container spacing={3} sx={{ mb: 4, position: 'relative', zIndex: 1 }}>
            {/* Revenue Trend Chart */}
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Revenue Trend
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={[
                      { name: 'Week 1', revenue: 3200, orders: 45 },
                      { name: 'Week 2', revenue: 3800, orders: 52 },
                      { name: 'Week 3', revenue: 4200, orders: 58 },
                      { name: 'Week 4', revenue: 4500, orders: 62 },
                      { name: 'This Week', revenue: 4800, orders: 68 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                      <XAxis dataKey="name" stroke="#ffffff" />
                      <YAxis stroke="#ffffff" />
                      <RechartsTooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: 8,
                          color: '#ffffff'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#10b981"
                        fill="url(#revenueGradient)"
                        strokeWidth={2}
                      />
                      <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Order Status Distribution */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Order Status Distribution
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Delivered', value: 45, color: '#10b981' },
                          { name: 'Shipped', value: 25, color: '#3b82f6' },
                          { name: 'Processing', value: 15, color: '#f59e0b' },
                          { name: 'Pending', value: 10, color: '#6b7280' },
                          { name: 'Cancelled', value: 5, color: '#ef4444' },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {[
                          { name: 'Delivered', value: 45, color: '#10b981' },
                          { name: 'Shipped', value: 25, color: '#3b82f6' },
                          { name: 'Processing', value: 15, color: '#f59e0b' },
                          { name: 'Pending', value: 10, color: '#6b7280' },
                          { name: 'Cancelled', value: 5, color: '#ef4444' },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: 8,
                          color: '#ffffff'
                        }}
                      />
                      <Legend 
                        wrapperStyle={{ color: '#ffffff' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Top Products Performance */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Top Products Performance
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={topProducts.map(product => ({
                      name: product.productName.length > 15 
                        ? product.productName.substring(0, 15) + '...' 
                        : product.productName,
                      units: product.unitsSold,
                      revenue: product.revenue / 100, // Scale down for better visualization
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                      <XAxis dataKey="name" stroke="#ffffff" />
                      <YAxis stroke="#ffffff" />
                      <RechartsTooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: 8,
                          color: '#ffffff'
                        }}
                      />
                      <Bar dataKey="units" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Warehouse Performance */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Warehouse Efficiency
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={warehousePerformance.map(warehouse => ({
                      name: warehouse.warehouseName.length > 10 
                        ? warehouse.warehouseName.substring(0, 10) + '...' 
                        : warehouse.warehouseName,
                      efficiency: warehouse.efficiency,
                      orders: warehouse.totalOrders,
                      avgTime: warehouse.avgOrderTime,
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                      <XAxis dataKey="name" stroke="#ffffff" />
                      <YAxis stroke="#ffffff" />
                      <RechartsTooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: 8,
                          color: '#ffffff'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="efficiency" 
                        stroke="#f59e0b" 
                        strokeWidth={3}
                        dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Reports Content */}
        <Grid container spacing={3} sx={{ position: 'relative', zIndex: 1 }}>
          {/* Top Selling Products */}
          <Grid item xs={12} md={6}>
            <Card sx={{ position: 'relative', zIndex: 1 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Top Selling Products
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell align="right">Units Sold</TableCell>
                        <TableCell align="right">Revenue</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {topProducts.map((product, index) => (
                        <TableRow key={index}>
                          <TableCell>{product.productName}</TableCell>
                          <TableCell align="right">{product.unitsSold}</TableCell>
                          <TableCell align="right">{formatCurrency(product.revenue)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Warehouse Performance */}
          <Grid item xs={12} md={6}>
            <Card sx={{ position: 'relative', zIndex: 1 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Warehouse Performance
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Warehouse</TableCell>
                        <TableCell align="right">Orders</TableCell>
                        <TableCell align="right">Avg. Time</TableCell>
                        <TableCell align="right">Efficiency</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {warehousePerformance.map((warehouse, index) => (
                        <TableRow key={index}>
                          <TableCell>{warehouse.warehouseName}</TableCell>
                          <TableCell align="right">{warehouse.totalOrders}</TableCell>
                          <TableCell align="right">{warehouse.avgOrderTime} hrs</TableCell>
                          <TableCell align="right">{warehouse.efficiency}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Order Status Distribution */}
          <Grid item xs={12} md={6}>
            <Card sx={{ position: 'relative', zIndex: 1 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Order Status Distribution
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Count</TableCell>
                        <TableCell align="right">Percentage</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orderStatus.map((status, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Chip
                              label={status.status}
                              sx={{
                                backgroundColor: getStatusColor(status.status),
                                color: '#ffffff',
                                fontWeight: 500,
                                '& .MuiChip-label': {
                                  color: '#ffffff',
                                },
                              }}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">{status.count}</TableCell>
                          <TableCell align="right">{status.percentage}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Inventory Alerts */}
          <Grid item xs={12} md={6}>
            <Card sx={{ position: 'relative', zIndex: 1 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Inventory Alerts
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell align="right">Stock</TableCell>
                        <TableCell align="right">Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {inventoryLevels
                        .filter(item => item.isLowStock || item.isOverstock)
                        .slice(0, 5)
                        .map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.productName}</TableCell>
                          <TableCell align="right">{item.quantity}</TableCell>
                          <TableCell align="right">
                            {item.isLowStock ? (
                              <Chip 
                                icon={<Warning sx={{ color: '#ffffff' }} />} 
                                label="Low Stock" 
                                sx={{
                                  backgroundColor: '#f59e0b',
                                  color: '#ffffff',
                                  fontWeight: 500,
                                  '& .MuiChip-label': {
                                    color: '#ffffff',
                                  },
                                }}
                                size="small" 
                              />
                            ) : item.isOverstock ? (
                              <Chip 
                                icon={<CheckCircle sx={{ color: '#ffffff' }} />} 
                                label="Overstock" 
                                sx={{
                                  backgroundColor: '#3b82f6',
                                  color: '#ffffff',
                                  fontWeight: 500,
                                  '& .MuiChip-label': {
                                    color: '#ffffff',
                                  },
                                }}
                                size="small" 
                              />
                            ) : (
                              <Chip 
                                label="Normal" 
                                sx={{
                                  backgroundColor: '#10b981',
                                  color: '#ffffff',
                                  fontWeight: 500,
                                  '& .MuiChip-label': {
                                    color: '#ffffff',
                                  },
                                }}
                                size="small" 
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}
