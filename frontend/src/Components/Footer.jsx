import React from "react";
import { Box, Container, Grid, Typography, Link as MuiLink } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "@mui/icons-material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "var(--chili)",
        color: "var(--cloud)",
        py: 5,
        mt: "auto",
        borderTop: "5px solid var(--espresso)",
        borderRadius: "16px 16px 0 0",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand Info */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom sx={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, color: "var(--mustard)" }}>
              Pickier
            </Typography>
            <Typography variant="body2" sx={{ color: "#ffffff", opacity: 0.9 }}>
              Find the best burgers, pizzas, and more near you. Compare prices and
              calories instantly.
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom sx={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, color: "var(--mustard)" }}>
              Quick Links
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <MuiLink component={RouterLink} to="/" color="inherit" underline="hover">
                Home
              </MuiLink>
              <MuiLink component={RouterLink} to="/basket" color="inherit" underline="hover">
                Basket
              </MuiLink>
              <MuiLink component={RouterLink} to="/about-us" color="inherit" underline="hover">
                About Us
              </MuiLink>
              <MuiLink component={RouterLink} to="/terms" color="inherit" underline="hover">
                Terms of Service
              </MuiLink>
              <MuiLink component={RouterLink} to="/privacy" color="inherit" underline="hover">
                Privacy Policy
              </MuiLink>
            </Box>
          </Grid>

          {/* Column 3: Contact & Social */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom sx={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, color: "var(--mustard)" }}>
              Contact Us
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: "#ffffff", opacity: 0.9 }}>
              123 Group 5 Project Street, London, UK
              <br />
              support@group5project.com
            </Typography>

            {/* Social Icons */}
            <Box sx={{ display: "flex", gap: 1.5 }}>
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <Box
                  key={i}
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: "var(--mustard)",
                    border: "2px solid var(--espresso)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MuiLink href="#" sx={{ color: "var(--espresso)", display: "flex" }}>
                    <Icon fontSize="small" />
                  </MuiLink>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* Copyright Bar */}
        <Box sx={{ textAlign: "center", mt: 4, pt: 2, borderTop: "1px solid rgba(255,255,255,0.25)" }}>
          <Typography variant="body2" sx={{ color: "#ffffff", opacity: 0.85 }}>
            &copy; {new Date().getFullYear()} Group 5 Project. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;