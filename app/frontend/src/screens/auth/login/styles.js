import { StyleSheet, Dimensions } from "react-native";
import colors from "../../../theme/colors";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  logoImage: {
    width: 400,
    height: 300,
  },
  createAccountButton: {
    width: "100%",
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  createAccountButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontFamily: "Nunito-Regular",
  },
  loginButton: {
    width: "100%",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.divider,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  loginButtonText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontFamily: "Nunito-Regular",
  },
});

export default styles;
