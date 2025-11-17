import { StyleSheet } from "react-native";
import colors from "../../../../theme/colors";
export default StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    headerBar: { height: 56, alignItems: "center", justifyContent: "center" },
    headerBack: { position: "absolute", left: 12, top: 14 },
    headerTitle: { fontSize: 16, color: colors.textPrimary },
    tabsRow: {
        flexDirection: "row",
        paddingHorizontal: 16,
        marginTop: 8,
        marginBottom: 8,
    },
    tabButton: { marginRight: 24 },
    tabLabel: { color: colors.textSecondary },
    tabLabelActive: { color: colors.primary },
    tabIndicator: { height: 2, backgroundColor: colors.primary, borderRadius: 1, marginTop: 6 },
    centered: { flex: 1, alignItems: "center", justifyContent: "center" },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    left: { flexDirection: "row", alignItems: "center" },
    avatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12, backgroundColor: colors.divider },
    username: { color: colors.textPrimary },
});
