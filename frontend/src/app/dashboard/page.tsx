'use client';

import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  IconButton,
} from '@mui/material';
import {
  Inventory,
  LocalShipping,
  Warehouse,
  TrendingUp,
  Warning,
  CheckCircle,
} from '@mui/icons-material';
import Layout from '@/components/layout/Layout';

// Mock data for dashboard
const dashboardStats = [
  {
    title: 'Total Products',
    value: '1,234',
    icon: <Inventory />,
    color: '#1976d2',
    change: '+12%',
  },
  {
    title: 'Active Orders',
    value: '89',
    icon: <LocalShipping />,
    color: '#388e3c',
    change: '+5%',
  },
  {
    title: 'Warehouses',
    value: '5',
    icon: <Warehouse />,
    color: '#f57c00',
    change: '0%',
  },
  {
    title: 'Low Stock Items',
    value: '23',
    icon: <Warning />,
    color: '#d32f2f',
    change: '-8%',
  },
];

const recentActivities = [
  {
    id: 1,
    action: 'Order #WMS-001234 shipped',
    timestamp: '2 minutes ago',
    status: 'success',
  },
  {
    id: 2,
    action: 'Low stock alert: Product SKU-789',
    timestamp: '15 minutes ago',
    status: 'warning',
  },
  {
    id: 3,
    action: 'New inventory received: 500 items',
    timestamp: '1 hour ago',
    status: 'info',
  },
  {
    id: 4,
    action: 'Order #WMS-001233 completed',
    timestamp: '2 hours ago',
    status: 'success',
  },
];

export default function DashboardPage() {
  return (
    <Layout>
      <Box sx={{ height: '100%', minHeight: '100%' }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        
        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {dashboardStats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography color="textSecondary" gutterBottom variant="body2">
                        {stat.title}
                      </Typography>
                      <Typography variant="h4" component="div">
                        {stat.value}
                      </Typography>
                      <Typography
                        variant="body2"
                        color={stat.change.startsWith('+') ? 'success.main' : 'error.main'}
                      >
                        {stat.change} from last month
                      </Typography>
                    </Box>
                    <IconButton
                      sx={{
                        backgroundColor: stat.color,
                        color: 'white',
                        '&:hover': {
                          backgroundColor: stat.color,
                          opacity: 0.8,
                        },
                      }}
                    >
                      {stat.icon}
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {/* Recent Activities */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Activities
                </Typography>
                <Box>
                  {recentActivities.map((activity) => (
                    <Box
                      key={activity.id}
                      display="flex"
                      alignItems="center"
                      py={1}
                      borderBottom="1px solid #eee"
                    >
                      <IconButton
                        size="small"
                        sx={{
                          mr: 2,
                          color:
                            activity.status === 'success'
                              ? 'success.main'
                              : activity.status === 'warning'
                              ? 'warning.main'
                              : 'info.main',
                        }}
                      >
                        {activity.status === 'success' ? (
                          <CheckCircle />
                        ) : activity.status === 'warning' ? (
                          <Warning />
                        ) : (
                          <TrendingUp />
                        )}
                      </IconButton>
                      <Box flexGrow={1}>
                        <Typography variant="body2">{activity.action}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {activity.timestamp}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Paper
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      <LocalShipping sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                      <Typography variant="body2">Create Order</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      <Inventory sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                      <Typography variant="body2">Add Inventory</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      <Warehouse sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                      <Typography variant="body2">Manage Warehouses</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      <TrendingUp sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                      <Typography variant="body2">View Reports</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}

