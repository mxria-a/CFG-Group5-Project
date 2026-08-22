import Box from "@mui/material/Box";
import { TextField } from "@mui/material";

function PostCodeInput({ setPostcode }) {
  return (
    <Box component="form" sx={{ width: "100%" }} noValidate autoComplete="off">
      <div>
        <TextField
          required
          id="outlined-required"
          label="Postcode"
          //update parent state
          onChange={(e) => setPostcode(e.target.value)}
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "var(--cloud)",
              borderRadius: "14px",
              "& fieldset": { borderColor: "var(--espresso)", borderWidth: "2px" },
              "&:hover fieldset": { borderColor: "var(--chili)" },
              "&.Mui-focused fieldset": { borderColor: "var(--chili)" },
            },
          }}
        />
      </div>
    </Box>
  );
}
export default PostCodeInput;