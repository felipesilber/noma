import { StyleSheet } from "react-native";
import colors from "../../../../theme/colors";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  searchContainer: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
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
  searchInput: { flex: 1, color: colors.textPrimary, fontSize: 16 },

  centerBox: { flex: 1, alignItems: "center", justifyContent: "center" },
  errorText: { color: colors.error },
  hintText: { color: colors.textSecondary },

  gridContent: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8 },
  gridRow: { justifyContent: "space-between", marginBottom: 12 },

  card: {
    width: 170,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.divider,
    overflow: "hidden",
    marginBottom: 12,
  },
  cardImage: { width: "100%", height: 110, backgroundColor: colors.border },
  cardTitle: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "center",
    paddingHorizontal: 6,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 8,
    marginTop: 2,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: "600",
  },
});

export default styles;
