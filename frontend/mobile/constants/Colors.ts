/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    color: '#00272B',
    tint: tintColorLight,
    backgroundColor: '#C9ADA7',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    color: '#C9ADA7',
    background: '#C9ADA7',
    backgroundColor: '#00272B',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },

  light_text: {
    color: '#00272B',
  },
  dark_text: {
    color: '#C9ADA7',
  },

  dark_box: {
    backgroundColor: '#351E29',
  },
  light_box: {
    backgroundColor: '#2176AE',
  },

  dark_border: {
    borderColor: '#C9ADA7',
  },
  light_border: {
    borderColor: '#00272B',
  }
};
