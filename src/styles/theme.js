import { createTheme } from "@mui/material/styles";
import { grey, blueGrey, red, green, yellow } from "@mui/material/colors";

export const theme = createTheme({
  palette: {
    type: "dark",
  },
  textField: {
    display: "block",
  },
  multilineColor: {
    color: "red",
  },
});
