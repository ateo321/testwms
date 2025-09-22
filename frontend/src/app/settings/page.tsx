'use client';

import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Switch,
  FormControlLabel,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import {
  Save,
  Delete,
  Add,
  Edit,
  Notifications,
  Security,
  Storage,
  Palette,
} from '@mui/icons-material';
import Layout from '@/components/layout/Layout';

export default function SettingsPage() {
  return (
    <Layout>
      <Box>
        <Typography variant="h4" gutterBottom>
          System Settings
        </Typography>

        <Grid container spacing={3}>
          {/* General Settings */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  General Settings
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Company Name"
                      defaultValue="Warehouse Management System"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="System Timezone"
                      defaultValue="UTC-8 (Pacific Standard Time)"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Default Currency"
                      defaultValue="USD ($)"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Enable automatic backups"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Enable audit logging"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Notification Settings */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Notification Settings
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Email notifications"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Low stock alerts"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={<Switch />}
                      label="Order status updates"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="System maintenance alerts"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Notification Email"
                      defaultValue="admin@wms.com"
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Security Settings */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Security Settings
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Require strong passwords"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={<Switch />}
                      label="Two-factor authentication"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Session timeout (30 minutes)"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Password expiry (days)"
                      defaultValue="90"
                      variant="outlined"
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      startIcon={<Security />}
                      fullWidth
                    >
                      Change Admin Password
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Data Management */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Data Management
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Database Backup"
                      secondary="Last backup: 2025-09-19 10:30 AM"
                    />
                    <ListItemSecondaryAction>
                      <Button size="small" variant="outlined">
                        Backup Now
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Data Export"
                      secondary="Export all data to CSV/Excel"
                    />
                    <ListItemSecondaryAction>
                      <Button size="small" variant="outlined">
                        Export
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Clear Cache"
                      secondary="Clear system cache and temporary files"
                    />
                    <ListItemSecondaryAction>
                      <Button size="small" variant="outlined" color="warning">
                        Clear
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
                <Divider sx={{ my: 2 }} />
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Delete />}
                  fullWidth
                >
                  Reset System (Danger Zone)
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* System Info */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  System Information
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="body2" color="textSecondary">
                      System Version
                    </Typography>
                    <Typography variant="h6">WMS v1.0.0</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="body2" color="textSecondary">
                      Database
                    </Typography>
                    <Typography variant="h6">PostgreSQL 14.5</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="body2" color="textSecondary">
                      Last Update
                    </Typography>
                    <Typography variant="h6">2025-09-19</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="body2" color="textSecondary">
                      License
                    </Typography>
                    <Typography variant="h6">Active</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Save Button */}
        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button variant="contained" startIcon={<Save />} size="large">
            Save Settings
          </Button>
        </Box>
      </Box>
    </Layout>
  );
}
