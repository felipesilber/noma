import { StyleSheet } from "react-native";
import colors from "../../../../theme/colors";
const PADDING = 16;
export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background || "#FFFFFF",
    },
    searchBarContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.surface || "#F0F0F0",
        borderRadius: 10,
        margin: PADDING,
        paddingHorizontal: 12,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 44,
        fontSize: 16,
        color: colors.textPrimary,
    },
    sectionContainer: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: PADDING,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: colors.textPrimary,
    },
    seeAllText: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.textSecondary,
    },
    userCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: PADDING,
        paddingVertical: 8,
    },
    userCardInfo: {
        flexDirection: "row",
        alignItems: "center",
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
        backgroundColor: colors.divider,
    },
    userName: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.textPrimary,
    },
    userDetails: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 2,
    },
    followButton: {
        backgroundColor: colors.background || "#F0F0F0",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    followingButton: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.divider,
    },
    followButtonText: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.textPrimary,
    },
    followingButtonText: {
        color: colors.textSecondary,
    },
    errorText: {
        textAlign: "center",
        color: colors.textSecondary,
        fontSize: 16,
        marginTop: 40,
        paddingHorizontal: PADDING,
    },
});
