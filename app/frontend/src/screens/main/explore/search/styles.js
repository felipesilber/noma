import { StyleSheet, Dimensions } from "react-native";
import colors from "../../../../theme/colors";
const { width } = Dimensions.get("window");
const PADDING = 16;
export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background || "#FFF",
    },
    mainTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: colors.textPrimary || "#111",
        paddingHorizontal: PADDING,
        marginTop: 20,
        marginBottom: 24,
    },
    cardContainer: {
        backgroundColor: colors.surface || "#FFF",
        borderRadius: 12,
        marginHorizontal: PADDING,
        marginBottom: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 4,
        overflow: "hidden",
    },
    cardImage: {
        width: "100%",
        height: 180,
    },
    cardContent: {
        padding: PADDING,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: colors.textPrimary || "#111",
        marginBottom: 6,
    },
    cardSubtitle: {
        fontSize: 14,
        color: colors.textSecondary || "#666",
        lineHeight: 20,
    },
});
