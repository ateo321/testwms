'use client';

import React from 'react';
import {
  Box,
  IconButton,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  FirstPage,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage,
} from '@mui/icons-material';

interface PaginationProps {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export default function Pagination({
  page,
  limit,
  total,
  totalPages,
  hasNext,
  hasPrev,
  onPageChange,
  onLimitChange,
}: PaginationProps) {
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  const handleFirstPage = () => {
    if (hasPrev) {
      onPageChange(1);
    }
  };

  const handlePrevPage = () => {
    if (hasPrev) {
      onPageChange(page - 1);
    }
  };

  const handleNextPage = () => {
    if (hasNext) {
      onPageChange(page + 1);
    }
  };

  const handleLastPage = () => {
    if (hasNext) {
      onPageChange(totalPages);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 2,
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Showing {startItem} to {endItem} of {total} entries
        </Typography>
        
        <FormControl size="small" sx={{ minWidth: 80 }}>
          <InputLabel>Rows</InputLabel>
          <Select
            value={limit}
            label="Rows"
            onChange={(e) => onLimitChange(Number(e.target.value))}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton
          onClick={handleFirstPage}
          disabled={!hasPrev}
          size="small"
          aria-label="first page"
          sx={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#ffffff',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.2)',
            },
            '&:disabled': {
              background: 'rgba(255, 255, 255, 0.05)',
              color: 'rgba(255, 255, 255, 0.3)',
            },
          }}
        >
          <FirstPage />
        </IconButton>
        
        <IconButton
          onClick={handlePrevPage}
          disabled={!hasPrev}
          size="small"
          aria-label="previous page"
          sx={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#ffffff',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.2)',
            },
            '&:disabled': {
              background: 'rgba(255, 255, 255, 0.05)',
              color: 'rgba(255, 255, 255, 0.3)',
            },
          }}
        >
          <KeyboardArrowLeft />
        </IconButton>

        <Typography variant="body2" sx={{ mx: 2, color: '#ffffff' }}>
          Page {page} of {totalPages}
        </Typography>

        <IconButton
          onClick={handleNextPage}
          disabled={!hasNext}
          size="small"
          aria-label="next page"
          sx={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#ffffff',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.2)',
            },
            '&:disabled': {
              background: 'rgba(255, 255, 255, 0.05)',
              color: 'rgba(255, 255, 255, 0.3)',
            },
          }}
        >
          <KeyboardArrowRight />
        </IconButton>
        
        <IconButton
          onClick={handleLastPage}
          disabled={!hasNext}
          size="small"
          aria-label="last page"
          sx={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#ffffff',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.2)',
            },
            '&:disabled': {
              background: 'rgba(255, 255, 255, 0.05)',
              color: 'rgba(255, 255, 255, 0.3)',
            },
          }}
        >
          <LastPage />
        </IconButton>
      </Box>
    </Box>
  );
}
