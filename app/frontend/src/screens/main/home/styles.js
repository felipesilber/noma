import { StyleSheet, Dimensions } from "react-native";
import colors from "../../../theme/colors";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  listContent: { paddingBottom: 24 },

  logoRow: {
    alignItems: "center",
    paddingTop: 10,
  },
  logo: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.primary,
  },
  locationRow: {
    alignItems: "flex-start",
    paddingHorizontal: 16,
    marginTop: 8,
  },

  /* locChip/locText permanecem iguais */
  locChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.divider,
    gap: 6,
    maxWidth: width * 0.9,
  },
  locText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "700",
    maxWidth: width * 0.55,
  },

  logo: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.primary,
  },
  locChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.divider,
    maxWidth: width * 0.5,
    gap: 6,
  },
  locText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "700",
    maxWidth: width * 0.35,
  },

  searchBar: {
    marginTop: 12,
    marginHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 18,
    height: 44,
    borderWidth: 1,
    borderColor: colors.divider,
    paddingHorizontal: 12,
  },
  searchPlaceholder: {
    color: colors.textSecondary,
    fontSize: 16,
  },

  sectionSpacing: { marginTop: 12 },

  catsRow: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  catChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 18,
    marginRight: 8,
  },
  catChipEmoji: { fontSize: 15, marginRight: 6 },
  catChipText: { fontSize: 13 },

  catChipGhost: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 18,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: "transparent",
  },
  catChipGhostText: {
    color: colors.primary,
    fontWeight: "800",
    marginRight: 4,
  },

  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    marginTop: 8,
    justifyContent: "space-between",
  },
  modeRow: { flexDirection: "row", gap: 8 },
  modeChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
  },
  modeChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  modeText: {
    fontSize: 13,
    color: colors.textPrimary,
  },
  modeTextActive: {
    color: "#fff",
  },
  actionsRow: { flexDirection: "row", gap: 8 },
  smallBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  smallBtnText: { fontSize: 13, color: colors.textPrimary },

  placeCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
    marginTop: 12,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.divider,
    padding: 10,
  },
  placeImg: {
    width: 68,
    height: 68,
    borderRadius: 12,
    backgroundColor: colors.border,
    marginRight: 10,
  },
  placeInfo: { flex: 1 },
  placeTitle: { fontSize: 16, fontWeight: "900", color: colors.textPrimary },
  row: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  rateText: { marginLeft: 6, fontSize: 12, color: colors.textSecondary },
  priceText: { fontSize: 12, color: colors.textSecondary, fontWeight: "700" },
  tagsText: {
    fontSize: 12,
    color: colors.textSecondary,
    maxWidth: width * 0.5,
  },

  loadingBox: { paddingTop: 24, alignItems: "center" },
  errorBox: { paddingTop: 24, alignItems: "center" },
  errorText: { color: colors.error, marginBottom: 8 },
  retryText: { color: colors.primary, fontWeight: "800" },
  emptyBox: { paddingTop: 24, alignItems: "center" },
  emptyText: { color: colors.textSecondary },

  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  modalSheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: colors.textPrimary,
    marginBottom: 8,
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  modalItemText: { fontSize: 14, color: colors.textPrimary },
  modalItemActive: { color: colors.primary, fontWeight: "900" },
});
