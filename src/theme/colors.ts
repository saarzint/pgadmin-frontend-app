export const colors = {
  primary: {
    dark: '#030287',
    main: '#5B6BFF',
    light: '#A9C7FF',
    black: '#070529',
    white: '#FFFFFF',
  },
  secondary: {
    main: '#F7B500',
    light: '#8DF8E7',
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
  },
} as const;

export type ThemeColors = typeof colors;
