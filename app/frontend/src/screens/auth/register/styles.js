import { StyleSheet } from "react-native";
import colors from "../../../theme/colors";

export default StyleSheet.create({
  container: { flex: 1 },

  progressWrap: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.divider,
  },
  progressBar: {
    flex: 1,
    height: 2,
    marginHorizontal: 8,
    backgroundColor: colors.divider,
  },
  progressActive: {
    backgroundColor: colors.primary,
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 16,
  },

  input: {
    color: colors.textPrimary,
    backgroundColor: colors.surface,
    borderColor: colors.divider,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 52,
    marginBottom: 12,
  },

  toggle: {
    position: "absolute",
    right: 12,
    top: 10,
    height: 32,
    justifyContent: "center",
  },
  toggleText: { color: colors.textSecondary, fontSize: 14 },

  error: { color: colors.error, marginTop: 4, marginBottom: 6 },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    gap: 12,
  },

  secondaryBtn: {
    height: 52,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.divider,
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
    backgroundColor: colors.surface,
  },
  secondaryText: { color: colors.textSecondary, fontWeight: "600" },

  primaryBtn: {
    height: 52,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
  },
  primaryText: { color: colors.surface, fontWeight: "700" },

  legal: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: "center",
    marginTop: 18,
  },
});
