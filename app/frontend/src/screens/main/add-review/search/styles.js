import { StyleSheet } from "react-native";
import colors from "../../../../theme/colors";
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 8,
        backgroundColor: colors.background,
    },
    closeButton: {
        position: "absolute",
        top: 12,
        left: 16,
        zIndex: 1,
        padding: 6,
        borderRadius: 10,
    },
    searchBarContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.surface,
        borderRadius: 25,
        marginHorizontal: 20,
        paddingHorizontal: 12,
        height: 48,
        marginBottom: 8,
        marginTop: 48,
        borderWidth: 1,
        borderColor: colors.divider,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        color: colors.textPrimary,
        fontSize: 16,
    },
    mainContent: {
        flex: 1,
        paddingHorizontal: 20,
    },
    searchResultCard: {
        flexDirection: "row",
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 10,
        marginBottom: 10,
        alignItems: "center",
        borderWidth: 1,
        borderColor: colors.divider,
    },
    searchResultImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 10,
    },
    searchResultInfo: { flex: 1 },
    searchResultName: {
        fontSize: 16,
        fontWeight: "800",
        color: colors.textPrimary,
    },
    searchResultAddress: {
        fontSize: 13,
        color: colors.textSecondary,
        marginTop: 2,
    },
    errorText: {
        color: colors.error,
        textAlign: "left",
        marginTop: 8,
        fontSize: 14,
    },
    noResultsText: {
        color: colors.textSecondary,
        textAlign: "left",
        marginTop: 8,
        fontSize: 14,
    },
});
export default styles;
