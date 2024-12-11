import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const Footer = () => {
  return (
    <Box component="footer" sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
      <Typography variant="body2" color="textSecondary" align="center">
        © 2024 All rights reserved. made by 나  종  춘
      </Typography>
    </Box>
  );
};

export default Footer; 