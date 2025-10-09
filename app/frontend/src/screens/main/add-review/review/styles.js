import { StyleSheet } from "react-native";
import colors from "../../../../theme/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

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
  topBarSaveButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: colors.primary,
    minWidth: 84,
    alignItems: "center",
    justifyContent: "center",
  },
  topBarSaveDisabled: {
    opacity: 0.7,
  },
  topBarSaveText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: "700",
  },

  scrollViewContent: {
    paddingBottom: 80,
  },
  headerImage: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
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
    marginBottom: 16,
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginRight: 8,
  },
  detailValue: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: "700",
  },

  ratingSection: {
    marginBottom: 18,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 8,
  },

  priceInput: {
    color: colors.textPrimary,
    backgroundColor: colors.surface,
    borderColor: colors.divider,
    borderWidth: 1,
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 14,
    marginTop: 8,
  },

  reviewInput: {
    height: 150,
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.textPrimary,
    fontSize: 16,
    marginTop: 6,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.divider,
  },
});

export default styles;
