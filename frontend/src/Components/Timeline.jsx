
import { Stepper, Step, StepLabel, Box } from "@mui/material";
import FastfoodIcon from "@mui/icons-material/Fastfood";

const steps = [
  { label: "Choose your dish", icon: <FastfoodIcon /> },
  { label: "Compare", icon: <FastfoodIcon /> },
  { label: "Add to cart", icon: <FastfoodIcon /> },
  { label: "Confirm order", icon: <FastfoodIcon /> },
  { label: "Enjoy your meal", icon: <FastfoodIcon /> },
];

function OrderTimeline({ activeStep = 0 }) {
  return (
    <Box sx={{ width: "100%", mt: 4 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel StepIconComponent={() => step.icon}>
              {step.label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}

export default OrderTimeline;
