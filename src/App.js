import React from 'react';
import Grid from '@mui/material/Grid';
import Header from './components/Header';
import Footer from './components/Footer';

const App = () => {
  return (
    <div>
      <Header />
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid item xs={12} md={6}>
          {/* Left Column Components */}
        </Grid>
        <Grid item xs={12} md={6}>
          {/* Right Column Components */}
        </Grid>
      </Grid>
      <Footer />
    </div>
  );
};

export default App;
