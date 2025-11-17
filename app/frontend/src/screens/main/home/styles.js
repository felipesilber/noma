import { StyleSheet, Dimensions } from "react-native";
import colors from "../../../theme/colors";
const { width } = Dimensions.get("window");
export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: 8,
    },
    header: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingBottom: 12,
        position: "relative",
        backgroundColor: colors.background,
    },
    headerTitle: {
        fontSize: 18,
        color: colors.textPrimary,
    },
    sectionContainer: {
        marginBottom: 24,
    },
    searchIcon: {
        position: "absolute",
        right: 16,
    },
    sectionTitle: {
        fontSize: 20,
        color: colors.textPrimary,
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    destaqueCardContainer: {
        width: width * 0.6,
        marginRight: 16,
    },
    destaqueImage: {
        width: "100%",
        height: 220,
        borderRadius: 12,
        backgroundColor: colors.divider,
    },
    destaqueTitle: {
        fontSize: 16,
        marginTop: 8,
        color: colors.textPrimary,
    },
    destaqueSubtitle: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    cardRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    cardInfo: {
        flex: 1,
        marginRight: 16,
    },
    recomendadoTag: {
        color: colors.primary,
        fontSize: 12,
        marginBottom: 4,
        textTransform: "uppercase",
    },
    cardTitle: {
        fontSize: 16,
        color: colors.textPrimary,
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    cardImageSmall: {
        width: 110,
        height: 80,
        borderRadius: 8,
        backgroundColor: colors.divider,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 16,
        backgroundColor: colors.divider,
    },
    amigoText: {
        fontSize: 14,
        color: colors.textPrimary,
        lineHeight: 20,
    },
    connectCard: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    connectImage: {
        width: "100%",
        height: 150,
        borderRadius: 8,
        marginBottom: 16,
        backgroundColor: colors.divider,
    },
    connectTitle: {
        fontSize: 18,
        color: colors.textPrimary,
        textAlign: "center",
    },
    connectSubtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: "center",
        marginTop: 8,
    },
    connectButton: {
        backgroundColor: colors.connectButtonBg,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
        marginTop: 20,
    },
    connectButtonText: {
        fontSize: 16,
        color: colors.connectButtonText,
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: colors.background,
    },
    errorText: {
        textAlign: "center",
        color: colors.textSecondary,
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
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
    },
    starIcon: {
        marginHorizontal: 4,
    },
});
