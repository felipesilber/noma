import { StyleSheet } from "react-native";
import colors from "../../../theme/colors";
const PADDING = 16;
export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background || "#FFFFFF",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.background || "#FFFFFF",
    },
    headerContainer: {
        paddingHorizontal: PADDING,
        paddingTop: 20,
        paddingBottom: 24,
        alignItems: "flex-start",
    },
    listImage: {
        width: 100,
        height: 100,
        borderRadius: 12,
        marginBottom: 16,
        backgroundColor: colors.divider,
        overflow: "hidden",
    },
    listImageRow: {
        flex: 1,
        flexDirection: "row",
    },
    listImageCol: {
        flex: 1,
        flexDirection: "column",
    },
    listImageTile: {
        flex: 1,
        borderRadius: 0,
        resizeMode: "cover",
    },
    listName: {
        fontSize: 24,
        fontWeight: "bold",
        color: colors.textPrimary,
        marginBottom: 6,
    },
    listMetadata: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: colors.textPrimary,
        paddingHorizontal: PADDING,
        marginBottom: 8,
    },
    placesListContainer: {
        paddingHorizontal: PADDING,
    },
    placeItemContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.divider,
    },
    placeRankBadge: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: colors.primary,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 8,
    },
    placeRankText: {
        color: colors.textPrimary,
        fontWeight: "bold",
        fontSize: 14,
    },
    placeItemImage: {
        width: 56,
        height: 56,
        borderRadius: 8,
        marginRight: 12,
        backgroundColor: colors.divider,
    },
    placeItemInfo: {
        flex: 1,
    },
    placeItemName: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.textPrimary,
        marginBottom: 4,
    },
    placeItemDetails: {
        fontSize: 14,
        color: colors.textSecondary,
    },
});
