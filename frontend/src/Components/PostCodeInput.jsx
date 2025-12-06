import Box from "@mui/material/Box";
import { TextField } from "@mui/material";

function PostCodeInput({ setPostcode }) {
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
          label="Postcode"
          //update parent state
          onChange={(e) => setPostcode(e.target.value)}
        />
      </div>
    </Box>
  );
}

export default PostCodeInput;
