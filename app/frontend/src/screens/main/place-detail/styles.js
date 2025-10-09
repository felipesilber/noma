import { StyleSheet, Dimensions } from "react-native";
import colors from "../../../theme/colors";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { justifyContent: "center", alignItems: "center" },

  scrollViewContent: { paddingBottom: 80 },

  headerImage: { width: "100%", height: 250, resizeMode: "cover" },

  contentContainer: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingHorizontal: 20,
    paddingTop: 20,
    borderWidth: 1,
    borderColor: colors.divider,
  },

  placeName: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: 6,
  },
  placeCategory: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 14,
  },

  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  placeAddress: { fontSize: 14, color: colors.textPrimary, marginRight: 8 },
  copyIcon: { opacity: 0.8 },

  /* Botões full width, gap ~8, raio menor */
  actionButtonsContainer: {
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  actionButtonWide: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  actionButtonText: { color: colors.surface, fontWeight: "700", fontSize: 14 },

  /* Faixa compacta SEM borda */
  infoRowCompact: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoItemCompact: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoIconCompact: { marginRight: 6 },
  infoValueCompact: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  infoSpacer: { flex: 1 },

  infoOpen: { color: colors.success },
  infoClosed: { color: colors.error },

  infoRowUnified: {
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 8,
    marginBottom: 16,
    backgroundColor: colors.surface,
  },

  infoItemUnified: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  infoDividerUnified: {
    width: 1,
    backgroundColor: colors.divider,
    opacity: 0.8,
    marginVertical: 4,
  },

  infoIconUnified: {
    marginBottom: 4,
  },

  infoTextGroup: {
    alignItems: "center",
  },

  infoLabelUnified: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.textSecondary,
    marginBottom: 2,
  },

  infoValueUnified: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.textPrimary,
  },

  infoOpen: { color: colors.success },
  infoClosed: { color: colors.error },

  /* Linha “Preço médio” */
  inlineRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  inlineRowLabel: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  inlineRowValue: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: "800",
  },

  /* Classificações sem borda/divisórias */
  ratingsListPlain: {
    marginBottom: 8,
  },
  ratingRowPlain: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  ratingRowLabel: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: "600",
    flex: 1,
  },
  ratingValueWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  ratingRowValue: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.textPrimary,
    marginLeft: 6,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "600",
  },

  /* Título de seção padrão */
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: 10,
    marginTop: 12,
  },

  /* Visitado por */
  visitedByContainer: { flexDirection: "row", marginBottom: 10 },
  friendAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.divider,
  },

  /* Horários detalhados — resumo mostra só Aberto/Fechado */
  hoursSummaryContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  hoursStatus: { fontSize: 16, fontWeight: "800", marginRight: 8 },
  statusOpen: { color: colors.success },
  statusClosed: { color: colors.error },
  hoursToggleIcon: { marginLeft: "auto" },

  fullHoursContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  fullHoursText: { color: colors.textPrimary, fontSize: 13, marginBottom: 4 },

  /* Tags no fim */
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  tag: {
    backgroundColor: colors.surface,
    borderRadius: 15,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  tagText: { color: colors.textSecondary, fontSize: 12, fontWeight: "700" },

  /* Mapa */
  grayMapPlaceholder: {
    width: width - 40,
    height: 200,
    backgroundColor: "#D9D9D9",
    borderRadius: 12,
    marginBottom: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.divider,
  },
  noMapText: { color: colors.textSecondary, textAlign: "center", fontSize: 14 },

  /* Top bar */
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 44,
    height: 68,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 20,
    backgroundColor: "transparent",
  },
  topBarRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  topBarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default styles;
