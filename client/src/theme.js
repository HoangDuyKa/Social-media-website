// color design tokens export
export const colorTokens = {
  grey: {
    0: "#FFFFFF",
    10: "#F6F6F6",
    50: "#F0F0F0",
    100: "#E0E0E0",
    200: "#C2C2C2",
    300: "#A3A3A3",
    400: "#858585",
    500: "#666666",
    600: "#4D4D4D",
    700: "#333333",
    800: "#1A1A1A",
    900: "#0A0A0A",
    1000: "#000000",
  },
  primary: {
    50: "#E6FBFF",
    100: "#CCF7FE",
    200: "#99EEFD",
    300: "#66E6FC",
    400: "#33DDFB",
    500: "#00D5FA",
    // 500: "#0162C4",
    550: "#0162C4",
    600: "#00A0BC",
    700: "#006B7D",
    800: "#00353F",
    900: "#001519",
  },
};

// mui theme settings
export const themeSettings = (setMode) => {
  return {
    palette: {
      mode: setMode,
      ...(setMode === "dark"
        ? {
            // palette values for dark mode
            primary: {
              dark: colorTokens.primary[200],
              main: colorTokens.primary[500],
              mess: colorTokens.primary[550],
              light: colorTokens.primary[800],
            },
            neutral: {
              dark: colorTokens.grey[100],
              main: colorTokens.grey[200],
              mediumMain: colorTokens.grey[300],
              medium: colorTokens.grey[400],
              light: colorTokens.grey[700],
            },
            background: {
              default: colorTokens.grey[900],
              alt: colorTokens.grey[800],
            },
            // text: colorTokens.grey[1000],
          }
        : {
            // palette values for light mode
            primary: {
              dark: colorTokens.primary[700],
              main: colorTokens.primary[500],
              mess: colorTokens.primary[550],
              light: colorTokens.primary[200],
            },
            neutral: {
              dark: colorTokens.grey[700],
              main: colorTokens.grey[500],
              mediumMain: colorTokens.grey[400],
              medium: colorTokens.grey[300],
              light: colorTokens.grey[50],
            },
            background: {
              default: colorTokens.grey[10],
              alt: colorTokens.grey[0],
            },
            // text: colorTokens.grey[0],
          }),
    },
    typography: {
      fontFamily: ["Rubik", "sans-serif"].join(","),
      fontSize: 14,
      h1: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 40,
        fontWeight: 700,
      },
      h2: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 32,
        fontWeight: 700,
      },
      h3: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 24,
        fontWeight: 700,
      },
      h4: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 20,
        fontWeight: 700,
      },
      h5: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 18,
        fontWeight: 700,
      },
      h6: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 16,
        fontWeight: 700,
      },
      subtitle1: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontWeight: 400,
        fontSize: 16,
      },
      subtitle2: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 16,
        fontWeight: 500,
      },
      // body1: {
      //   lineHeight: 1.5,
      //   fontSize: 16,
      // },
      body2: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 16,
        fontWeight: 400,
      },
      caption: {
        fontSize: 14,
        fontWeight: 400,
      },
      // overline: {
      //   fontWeight: 700,
      //   lineHeight: 1.5,
      //   fontSize: 12,
      //   textTransform: "uppercase",
      // },
      // button: {
      //   fontWeight: 700,
      //   lineHeight: 24 / 14,
      //   fontSize: 14,
      //   textTransform: "capitalize",
      // },
      // article: {
      //   fontWeight: 700,
      // },
    },
  };
};
