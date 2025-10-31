export const colors = {
  primary: {
    dark: '#030287',
    main: '#5B6BFF',
    light: '#A9C7FF',
    lightest: '#DFEAFFE5',
    black: '#070529',
    white: '#FFFFFF',
    gray: '#F6F6F7'
  },
  secondary: {
    main: '#F7B500',
    light: '#8DF8E7',
    yellow: '#FFEFA9',
  },
  neutral: {
    gray: '#A0A0A0',
  },
  error: {
    main: '#F70000',
  },
  gradient: {
    blue: '#A9C7FF',
    cyan: '#8DF8E7',
    cyanLight: '#A9FFEA66',
  },
} as const;

export type ThemeColors = typeof colors;
