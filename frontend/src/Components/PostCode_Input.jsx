import Box from "@mui/material/Box";
import { TextField } from "@mui/material";

function Postcode_Input({ setPostcode }) {
  return (
    <Box
      component="form"
      sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}
      noValidate
      autoComplete="off"
    >
      <div>
        <TextField
          required
          id="outlined-required"
          label="Required"
          defaultValue="Insert Postcode"
          //update parent state
          onChange={(e) => setPostcode(e.target.value)}
        />
      </div>
    </Box>
  );
}

export default Postcode_Input;
