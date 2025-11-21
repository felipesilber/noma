import { StyleSheet, Dimensions } from "react-native";
import colors from "../../../../../theme/colors";
const { width } = Dimensions.get("window");
export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    searchContainer: {
        backgroundColor: colors.surface,
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 12,
        paddingHorizontal: 12,
        marginHorizontal: 16,
        marginTop: 8,
        marginBottom: 16,
        height: 48,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
        color: colors.textPrimary,
    },
    tabsContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.divider,
        marginBottom: 8,
    },
    tab: {
        paddingBottom: 12,
        alignItems: "center",
    },
    tabText: {
        fontSize: 16,
        fontWeight: "600",
    },
    activeTabText: {
        color: colors.textPrimary,
    },
    inactiveTabText: {
        color: colors.textSecondary,
    },
    activeTabIndicator: {
        position: "absolute",
        bottom: 0,
        height: 3,
        width: "100%",
        backgroundColor: colors.textPrimary,
        borderRadius: 2,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    listTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: colors.textPrimary,
        marginVertical: 16,
    },
    placeCard: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    placeInfo: {
        flex: 1,
        marginRight: 16,
    },
    placeTitle: {
        fontSize: 17,
        fontWeight: "bold",
        color: colors.textPrimary,
        marginBottom: 4,
    },
    placeDetails: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    ratingRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    starIcon: {
        marginHorizontal: 4,
    },
    friendsRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
    },
    friendsIcon: {
        marginRight: 4,
    },
    friendsText: {
        fontSize: 12,
        color: colors.primary,
    },
    placeImage: {
        width: 80,
        height: 80,
        borderRadius: 12,
        backgroundColor: colors.divider,
    },
    errorText: {
        textAlign: "center",
        marginTop: 40,
        color: colors.error,
    },
});
