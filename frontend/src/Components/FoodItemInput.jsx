import { Autocomplete, TextField, Box } from "@mui/material";

const OPTIONS = ["Burger", "Pizza", "Sushi", "Chicken", "Waffles", "Burrito", "Noodles"];

function GetItem({ item, setItem }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Autocomplete
        options={OPTIONS}
        
        // controlled input
        value={item || ""}

        onChange={(_, newItem) => setItem(newItem || "")}

        sx={{ width: 300, backgroundColor: "white" }}
        renderInput={(params) => (
          <TextField {...params} label="What are you craving?" />
        )}
      />
    </Box>
  );
}

export default GetItem;
