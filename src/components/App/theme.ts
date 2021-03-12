export const defaultBackground = '#0c0c0c'; // grayish
export const defaultBackgroundLight = '#1a1817'; // light grayish
export const primaryTextColor = '#f2f2f2'; // whiteish

export const theme = {
  typography: {
    fontFamily: '"ApercuProMedium", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  palette: {
    type: 'dark',
    text: {
      primary: primaryTextColor,
      secondary: '#979797',
    },
    background: {
      default: defaultBackground,
      paper: defaultBackgroundLight,
    },
    primary: {
      main: '#f15a24', // orange
      contrastText: '#0c0c0c',
    },
    secondary: {
      main: '#f2f2f2', // whiteish
    },
  },
};
