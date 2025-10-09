import { DefaultTheme } from "@react-navigation/native";
import colors from "./colors";

const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.surface,
    text: colors.textPrimary,
    border: colors.divider,
    primary: colors.primary,
    notification: colors.error,
  },
};

export default AppTheme;
