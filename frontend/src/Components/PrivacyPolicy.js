import React from "react";
import { Container, Typography, Box } from "@mui/material";

const PrivacyPolicy = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ color: "#0073ce", fontWeight: "bold" }}>
        Privacy Policy
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Last updated: {new Date().toLocaleDateString()}
      </Typography>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", mt: 3 }}>
          1. Information We Collect
        </Typography>
        <Typography paragraph>
          At Pickier, one of our main priorities is the privacy of our visitors. We collect several different types of information for various purposes to provide and improve our Service to you:
        </Typography>
        <ul>
            <li><Typography variant="body1"><strong>Personal Data:</strong> Email address, name, phone number (when ordering).</Typography></li>
            <li><Typography variant="body1"><strong>Usage Data:</strong> IP address, browser type, and pages visited.</Typography></li>
        </ul>

        <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", mt: 3 }}>
          2. How We Use Your Information
        </Typography>
        <Typography paragraph>
          We use the collected data to provide and maintain the Service, notify you about changes, provide customer support, and monitor usage.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", mt: 3 }}>
          3. Cookies
        </Typography>
        <Typography paragraph>
          We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. You can instruct your browser to refuse all cookies.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", mt: 3 }}>
          4. Contact Us
        </Typography>
        <Typography paragraph>
          If you have any questions about this Privacy Policy, please contact us at support@group5project.com.
        </Typography>
      </Box>
    </Container>
  );
};

export default PrivacyPolicy;