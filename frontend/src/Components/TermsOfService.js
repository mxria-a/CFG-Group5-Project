import React from "react";
import { Container, Typography, Box } from "@mui/material";

const TermsOfService = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ color: "#0073ce", fontWeight: "bold" }}>
        Terms of Service
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Last updated: {new Date().toLocaleDateString()}
      </Typography>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", mt: 3 }}>
          1. Introduction
        </Typography>
        <Typography paragraph>
          Welcome to Pickier! By accessing our website, you agree to be bound by these Terms of Service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", mt: 3 }}>
          2. Use License
        </Typography>
        <Typography paragraph>
          Permission is granted to temporarily download one copy of the materials (information or software) on Pickier's website for personal, non-commercial transitory viewing only. Under this license, you may not:
        </Typography>
        <ul>
            <li><Typography variant="body1">Modify or copy the materials;</Typography></li>
            <li><Typography variant="body1">Use the materials for any commercial purpose;</Typography></li>
            <li><Typography variant="body1">Attempt to reverse engineer any software contained on the website;</Typography></li>
        </ul>

        <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", mt: 3 }}>
          3. Disclaimer
        </Typography>
        <Typography paragraph>
          The materials on Pickier's website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", mt: 3 }}>
          4. Contact Us
        </Typography>
        <Typography paragraph>
          If you have any questions about these Terms, please contact us at support@group5project.com.
        </Typography>
      </Box>
    </Container>
  );
};

export default TermsOfService;