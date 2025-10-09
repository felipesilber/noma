import { StyleSheet, Dimensions } from "react-native";
import colors from "../../../../theme/colors";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  hero: {
    paddingBottom: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  backBtn: {
    padding: 8,
    borderRadius: 20,
  },
  searchBtn: {
    padding: 8,
    borderRadius: 20,
  },
  heroCenter: {
    alignItems: "center",
    marginTop: 8,
  },
  heroEmoji: {
    fontSize: 44,
  },
  heroTitle: {
    marginTop: 4,
    fontSize: 22,
    fontWeight: "800",
  },

  tabsRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 12,
    marginTop: 14,
  },
  tabBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
  },
  tabText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.2,
  },

  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 12,
    paddingBottom: 28,
  },
  placeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.divider,
    padding: 10,
    marginBottom: 12,
  },
  placeImage: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: colors.border,
    marginRight: 10,
  },
  placeInfo: {
    flex: 1,
  },
  placeTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  ratingText: {
    marginLeft: 6,
    fontSize: 12,
    color: colors.textSecondary,
  },
  priceBadge: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  tagsText: {
    marginLeft: 6,
    fontSize: 12,
    color: colors.textSecondary,
    maxWidth: width * 0.5,
  },

  loadingBox: { paddingTop: 24, alignItems: "center" },
  errorBox: { paddingTop: 24, alignItems: "center" },
  errorText: { color: colors.error, marginBottom: 8 },
  retryText: { color: colors.primary, fontWeight: "800" },
  emptyBox: { padding: 24, alignItems: "center" },
  emptyText: { color: colors.textSecondary },

  fab: {
    position: "absolute",
    right: 16,
    bottom: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
  },
});
