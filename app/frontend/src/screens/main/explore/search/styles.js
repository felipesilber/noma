import { StyleSheet, Platform } from "react-native";
import colors from "../../../../theme/colors";

const PADDING = 16;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: PADDING,
    paddingTop: Platform.OS === "ios" ? 8 : 4,
    paddingBottom: 8,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    marginLeft: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
  },
  centerBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  hintText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  listContent: {
    padding: PADDING,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cardImage: {
    width: 48,
    height: 48,
    borderRadius: 6,
    marginRight: 12,
    backgroundColor: colors.divider,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  cardAddress: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
