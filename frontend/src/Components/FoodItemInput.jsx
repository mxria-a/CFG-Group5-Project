import { Autocomplete, TextField, Box } from "@mui/material";
import { useState } from "react";

const items = ["Burger", "Pizza", "Sushi"];

function GetItem({ setItem }) {
  const [value, setValue] = useState("");
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center", // center horizontally
        alignItems: "center", // center vertically
      }}
    >
      <Autocomplete
        options={items}
        onChange={(_, newItem) => setItem(newItem || "")}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Item" />}
      />
    </Box>
  );
}

export default GetItem;
