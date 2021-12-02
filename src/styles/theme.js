import { createTheme } from '@mui/material/styles';
import { grey, blueGrey } from '@mui/material/colors';

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
        main: grey[700],
      },
      info: {
        // This is green.A700 as hex.
        main: grey[700],
      },
      success: {
        // This is green.A700 as hex.
        main: grey[700],
      },
    },
  });