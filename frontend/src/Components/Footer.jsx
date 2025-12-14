import React from "react";
import { Box, Container, Grid, Typography, Link as MuiLink } from "@mui/material";
import { Link as RouterLink } from "react-router-dom"; 
import { Facebook, Instagram, Twitter } from "@mui/icons-material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#0073ce",
        color: "white",
        py: 6,
        mt: "auto",
        borderTop: "4px solid #ff9800",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          
          {/* Brand Info */}
          <Grid item xs={12} sm={4}> 
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: "#ff9800" }}>
              Pickier
            </Typography>
            <Typography variant="body2" sx={{ color: "#ffffffff" }}>
              Find the best burgers, pizzas, and more near you. Compare prices and
              calories instantly.
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              Quick Links
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              
              {/* MuiLink with component={RouterLink} for internal navigation */}
              <MuiLink component={RouterLink} to="/" color="inherit" underline="hover">
                Home
              </MuiLink>

              <MuiLink component={RouterLink} to="/basket" color="inherit" underline="hover">
                Basket
              </MuiLink>

              
              <MuiLink component={RouterLink} to="/about-us" color="inherit" underline="hover">
                About Us
              </MuiLink>

              <MuiLink href="#" color="inherit" underline="hover">Terms of Service</MuiLink>
              <MuiLink href="#" color="inherit" underline="hover">Privacy Policy</MuiLink>
            </Box>
          </Grid>

          {/* Column 3: Contact & Social */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              Contact Us
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: "#ffffffff" }}>
              123 Group 5 Project Street, London, UK
              <br />
              support@group5project.com
            </Typography>
            
            {/* Social Icons */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <MuiLink href="#" color="inherit"><Facebook /></MuiLink>
              <MuiLink href="#" color="inherit"><Instagram /></MuiLink>
              <MuiLink href="#" color="inherit"><Twitter /></MuiLink>
            </Box>
          </Grid>
        </Grid>

        {/* Copyright Bar */}
        <Box sx={{ textAlign: "center", mt: 4, pt: 2, borderTop: "1px solid #333" }}>
          <Typography variant="body2" sx={{ color: "#ffffffff" }}>
            &copy; {new Date().getFullYear()} Group 5 Project. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;