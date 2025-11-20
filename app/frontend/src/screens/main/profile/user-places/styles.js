import { StyleSheet } from "react-native";
import colors from "../../../../theme/colors";
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    headerBar: {
        height: 56,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
    },
    headerBack: { padding: 8, marginRight: 8 },
    headerTitle: { fontSize: 18, color: colors.textPrimary },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.divider,
    },
    thumb: { width: 72, height: 48, borderRadius: 8, marginRight: 12, backgroundColor: colors.divider },
    rowContent: { flex: 1 },
    title: { color: colors.textPrimary, fontSize: 16 },
});
export default styles;


