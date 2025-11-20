import { StyleSheet } from "react-native";
import colors from "../../theme/colors";
const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
    },
    modalCard: {
        width: "100%",
        maxWidth: 360,
        backgroundColor: colors.surface,
        borderRadius: 12,
        paddingVertical: 20,
        paddingHorizontal: 16,
        alignItems: "center",
    },
    title: { color: colors.textPrimary, fontSize: 18, marginBottom: 4, textAlign: "center" },
    message: { color: colors.textSecondary, fontSize: 14, textAlign: "center", marginBottom: 16 },
    button: {
        backgroundColor: colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 8,
        alignSelf: "center",
    },
    buttonText: { color: colors.surface, fontSize: 14 },
});
export default styles;


