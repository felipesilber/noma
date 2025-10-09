import { StyleSheet } from "react-native";
import colors from "../../../theme/colors";

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    backgroundColor: colors.surface,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.textPrimary,
  },

  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 80,
  },

  placeCard: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.divider,
  },
  placeImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 14,
  },
  placeInfo: { flex: 1 },
  placeName: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  placeAddress: { fontSize: 13, color: colors.textSecondary },
  removeButton: { marginLeft: 10, padding: 6, borderRadius: 8 },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 80,
  },
  loadingText: { color: colors.textSecondary, marginTop: 10, fontSize: 16 },

  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingBottom: 80,
  },
  errorText: {
    fontSize: 15,
    color: colors.error,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 16,
  },
  retryButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.surface,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },

  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingBottom: 80,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
    marginTop: 16,
    textAlign: "center",
  },
  emptyStateSubText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: "center",
    marginBottom: 24,
  },
  exploreButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.surface,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
});

export default styles;
