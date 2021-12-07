import { createTheme } from "@mui/material/styles";
import { grey, blueGrey, red, green,yellow } from "@mui/material/colors";

export const theme = createTheme({
  palette: {
    primary: {
      // Purple and green play nicely together.
      main: blueGrey[500],
    },
    secondary: {
      // This is green.A700 as hex.
      main: grey[700],
    },
    error: {
      // This is green.A700 as hex.
      main: grey[700],
    },
    warning: {
      // This is green.A700 as hex.
      main: yellow[200],
    },
    danger: {
      // This is green.A700 as hex.
      main: red[200],
    },
    info: {
      // This is green.A700 as hex.
      main: grey[700],
    },
    success: {
      // This is green.A700 as hex.
      main: green[400],
    },
  },
});
