import { StyleSheet, Dimensions } from "react-native";
import colors from "../../../theme/colors";

const { width: SCREEN_W } = Dimensions.get("window");
export const H_PADDING = 16;
export const COL_GAP = 12;
export const CARD_W = Math.floor((SCREEN_W - H_PADDING * 2 - COL_GAP) / 2);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 16,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 24,
    height: 48,
    borderWidth: 1,
    borderColor: colors.divider,
    paddingHorizontal: 12,
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 16,
  },
  gridContainer: { flex: 1 },
  gridContent: {
    paddingHorizontal: H_PADDING,
    paddingTop: 8,
    paddingBottom: 8,
  },
  gridRow: {
    justifyContent: "space-between",
    marginBottom: COL_GAP,
  },
  catCard: {
    height: 120,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.divider,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  catImage: {
    width: 48,
    height: 48,
    borderRadius: 12,
    marginBottom: 6,
    backgroundColor: colors.border,
  },
  catEmoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  catLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "center",
  },
  loadingBox: { paddingTop: 24, alignItems: "center" },
  errorBox: { paddingTop: 24, alignItems: "center" },
  errorText: { color: colors.error, marginBottom: 8 },
  retryText: { color: colors.primary, fontWeight: "800" },
});

export default styles;
