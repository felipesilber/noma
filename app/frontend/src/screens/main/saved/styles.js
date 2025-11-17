import { StyleSheet, Dimensions } from "react-native";
import colors from "../../../theme/colors";
const { width } = Dimensions.get("window");
const PADDING = 16;
const GAP = 16;
const CARD_WIDTH = (width - PADDING * 2 - GAP) / 2;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: 15,
    },
    header: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: PADDING,
        paddingBottom: 8,
        position: "relative",
    },
    headerTitle: {
        fontSize: 18,
        color: colors.textPrimary,
    },
    headerRightIcon: {
        position: "absolute",
        right: PADDING,
    },
    listContent: {
        paddingHorizontal: PADDING,
        paddingBottom: 24,
    },
    listTitle: {
        fontSize: 18,
        color: colors.textPrimary,
        marginBottom: 12,
        paddingTop: 16,
    },
    cardContainer: {
        width: CARD_WIDTH,
        marginBottom: GAP,
    },
    cardImage: {
        width: "100%",
        aspectRatio: 1,
        borderRadius: 12,
        backgroundColor: "#E0E0E0",
    },
    cardName: {
        fontSize: 16,
        color: colors.textPrimary,
        marginTop: 8,
    },
    removeButton: {
        position: "absolute",
        top: 8,
        right: 8,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        borderRadius: 16,
        width: 32,
        height: 32,
        justifyContent: "center",
        alignItems: "center",
    },
    messageContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    messageText: {
        fontSize: 18,
        color: colors.textPrimary,
        textAlign: "center",
        marginTop: 16,
    },
    messageSubtext: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: "center",
        marginTop: 8,
    },
    retryButton: {
        marginTop: 20,
        backgroundColor: colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    retryButtonText: {
        color: colors.textPrimary,
    },
});
export default styles;
