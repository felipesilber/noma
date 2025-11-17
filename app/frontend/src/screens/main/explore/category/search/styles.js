import { StyleSheet, Dimensions } from "react-native";
import colors from "../../../../../theme/colors";
const { width: SCREEN_W } = Dimensions.get("window");
const PADDING_HORIZONTAL = 20;
const GAP = 16;
const CARD_WIDTH = (SCREEN_W - (PADDING_HORIZONTAL * 2 + GAP)) / 2;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background || "#F8F8F8",
        paddingTop: 15,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: PADDING_HORIZONTAL,
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: colors.textPrimary || "#111",
    },
    searchBarWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.surface || "#FFF",
        borderRadius: 12,
        height: 50,
        marginHorizontal: PADDING_HORIZONTAL,
        marginBottom: 24,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: colors.divider || "#E0E0E0",
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: colors.textPrimary || "#111",
    },
    exploreCategoriesTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: colors.textPrimary || "#111",
        paddingHorizontal: PADDING_HORIZONTAL,
        marginBottom: 16,
    },
    gridContainer: {
        flex: 1,
    },
    gridContent: {
        paddingHorizontal: PADDING_HORIZONTAL,
        paddingBottom: 24,
    },
    gridRow: {
        justifyContent: "space-between",
        marginBottom: GAP,
    },
    categoryCardContainer: {
        width: CARD_WIDTH,
        backgroundColor: colors.surface || "#FFF",
        borderRadius: 12,
        overflow: "hidden",
    },
    categoryCardImage: {
        width: "100%",
        height: 120,
        backgroundColor: colors.border || "#E0E0E0",
    },
    categoryCardLabel: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.textPrimary || "#111",
        padding: 12,
    },
    loadingBox: { paddingTop: 24, alignItems: "center" },
    errorBox: { paddingTop: 24, alignItems: "center" },
    errorText: { color: colors.error || "red", marginBottom: 8 },
    retryText: { color: colors.primary || "blue", fontWeight: "bold" },
});
export default styles;
