import { Autocomplete, TextField, Box } from "@mui/material";

const OPTIONS = [
  "Burger",
  "Pizza",
  "Sushi",
  "Chicken",
  "Waffle",
  "Burrito",
  "Noodles",
];

function GetItem({ item, setItem }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Autocomplete
        options={OPTIONS}
        value={item || ""}
        onChange={(_, newItem) => setItem(newItem || "")}
        sx={{
          width: "100%",
          "& .MuiOutlinedInput-root": {
            backgroundColor: "var(--cloud)",
            borderRadius: "14px",
            "& fieldset": {
              borderColor: "var(--espresso)",
              borderWidth: "2px",
            },
            "&:hover fieldset": { borderColor: "var(--chili)" },
            "&.Mui-focused fieldset": { borderColor: "var(--chili)" },
          },
          "& .MuiAutocomplete-endAdornment": { color: "var(--chili)" },
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="What are you craving?"
            sx={{
              "& .MuiInputLabel-root": { color: "var(--espresso-soft)" },
              "& .MuiOutlinedInput-input": { color: "var(--espresso)" },
            }}
          />
        )}
      />
    </Box>
  );
}

export default GetItem;
