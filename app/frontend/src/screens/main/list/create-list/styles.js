import { StyleSheet } from "react-native";
import colors from "../../../../theme/colors";
const PADDING = 16;
export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background || "#FFFFFF",
    },
    scrollViewContent: {
        paddingBottom: 40,
    },
    formContainer: {
        padding: PADDING,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.textPrimary,
        marginBottom: 8,
        marginTop: 16,
    },
    input: {
        backgroundColor: colors.surface || "#F0F0F0",
        borderRadius: 10,
        paddingHorizontal: 15,
        height: 50,
        fontSize: 16,
        color: colors.textPrimary,
    },
    inputDescription: {
        backgroundColor: colors.surface || "#F0F0F0",
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 12,
        height: 120,
        fontSize: 16,
        color: colors.textPrimary,
        textAlignVertical: "top",
    },
    rankingRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: colors.background || "#F0F0F0",
        borderRadius: 10,
        padding: 16,
        marginTop: 24,
    },
    rankingInfo: {
        flexDirection: "row",
        alignItems: "center",
    },
    rankingIcon: {
        marginRight: 12,
    },
    rankingText: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.textPrimary,
    },
    rankingSubtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 8,
        paddingHorizontal: 4,
    },
    searchBarContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.surface || "#F0F0F0",
        borderRadius: 10,
        paddingHorizontal: 12,
        height: 44,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInputPlaceholder: {
        flex: 1,
        fontSize: 16,
        color: colors.textSecondary,
    },
    emptyStateContainer: {
        borderStyle: "dashed",
        borderWidth: 2,
        borderColor: colors.divider,
        borderRadius: 12,
        padding: 24,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 16,
        minHeight: 150,
        backgroundColor: colors.surface,
    },
    emptyStateIcon: {
        marginBottom: 12,
    },
    emptyStateText: {
        color: colors.textSecondary,
        fontSize: 14,
        textAlign: "center",
    },
    headerSaveButton: {
        marginRight: PADDING,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    headerSaveButtonText: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: "bold",
    },
    addedPlacesList: {
        marginTop: 16,
    },
    addedPlaceCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.background || "#F0F0F0",
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
    },
    dragHandle: {
        paddingRight: 10,
    },
    addedPlaceImage: {
        width: 48,
        height: 48,
        borderRadius: 6,
        marginRight: 12,
    },
    addedPlaceInfo: {
        flex: 1,
        marginRight: 12,
    },
    addedPlaceName: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.textPrimary,
    },
    addedPlaceAddress: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 2,
    },
});
