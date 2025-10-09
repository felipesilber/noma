import { StyleSheet } from "react-native";
import colors from "../../theme/colors";

export default StyleSheet.create({
  container: {
    width: "100%",
    alignSelf: "stretch",
  },
  fullScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  inline: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  content: {
    alignItems: "center",
    gap: 12,
    maxWidth: 420,
    width: "100%",
  },
  illustration: {
    width: 160,
    height: 120,
    marginBottom: 8,
    opacity: 0.95,
  },
  illustrationCompact: {
    width: 60,
    height: 60,
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary || "#111",
    textAlign: "center",
  },
  titleCompact: {
    fontSize: 14,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted || "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
  subtitleCompact: {
    fontSize: 12,
    lineHeight: 16,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
    justifyContent: "center",
  },
  primaryBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: colors.primary || "#5B8DEF",
    borderRadius: 10,
    minWidth: 120,
    alignItems: "center",
  },
  primaryBtnText: {
    color: colors.onPrimary || "#FFF",
    fontWeight: "700",
    fontSize: 14,
  },
  secondaryBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: colors.surfaceVariant || "#EFEFF5",
    borderRadius: 10,
    minWidth: 120,
    alignItems: "center",
  },
  secondaryBtnText: {
    color: colors.textPrimary || "#111",
    fontWeight: "700",
    fontSize: 14,
  },
  btnDisabled: {
    opacity: 0.6,
  },
});
