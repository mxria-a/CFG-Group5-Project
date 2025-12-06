import { Autocomplete, TextField, Box } from "@mui/material";

const OPTIONS = ["Burger", "Pizza", "Sushi", "Chicken"];

function GetItem({ setItem }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center", 
        alignItems: "center", 
      }}
    >
      <Autocomplete
        // The static list
        options={OPTIONS}
        
        // update state when a valid option is selected/clicked
        onChange={(_, newItem) => setItem(newItem || "")}
        
        

        sx={{ width: 300, backgroundColor: 'white' }}
        renderInput={(params) => <TextField {...params} label="What are you craving?" />}
      />
    </Box>
  );
}

export default GetItem;