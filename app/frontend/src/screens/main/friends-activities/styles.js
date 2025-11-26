import { StyleSheet } from "react-native";
import colors from "../../../theme/colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerBar: {
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  headerBack: {
    position: "absolute",
    left: 12,
    top: 14,
  },
  headerTitle: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    backgroundColor: colors.divider,
  },
  texts: {
    flex: 1,
  },
  username: {
    color: colors.textPrimary,
    marginBottom: 2,
  },
  actionText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  timestamp: {
    marginTop: 4,
    fontSize: 12,
    color: colors.textSecondary,
  },
  placeImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: colors.divider,
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyContainer: {
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 16,
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
  },
});


