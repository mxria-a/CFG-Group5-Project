import { Autocomplete, TextField, Box } from "@mui/material";

const OPTIONS = ["Burger", "Pizza", "Sushi", "Chicken", "Waffle", "Burrito", "Noodles"];

function GetItem({ item, setItem }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        paddingTop: "40px",
      }}
    >
      <Autocomplete
        options={OPTIONS}
        value={item || ""}
        onChange={(_, newItem) => setItem(newItem || "")}
        sx={{
          width: 350,
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#ffffff",        
            borderRadius: "14px",            
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)", 
            "& fieldset": {
              borderColor: "#ffd1b3",         
            },
            "&:hover fieldset": {
              borderColor: "#ff6b35",          
            },
            "&.Mui-focused fieldset": {
              borderColor: "#ff6b35",          
            },
          },
          "& .MuiAutocomplete-endAdornment": {
            color: "#ff6b35",                
          },
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="What are you craving?"
            sx={{
              "& .MuiInputLabel-root": { color: "#111111ff" }, 
              "& .MuiOutlinedInput-input": {
                color: "#333",                              
              },
            }}
          />
        )}
      />
    </Box>
  );
}

export default GetItem;
