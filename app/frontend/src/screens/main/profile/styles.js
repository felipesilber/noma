import { StyleSheet } from "react-native";
import colors from "../../../theme/colors";
const PADDING = 16;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
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
    headerIcon: {
        position: "absolute",
        right: PADDING,
    },
    headerLeftIcon: {
        position: "absolute",
        left: PADDING,
    },
    settingsBackdrop: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
    },
    settingsMenu: {
        position: "absolute",
        top: 56,
        right: PADDING,
        backgroundColor: colors.surface,
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 8,
        borderWidth: 1,
        borderColor: "#2d3444",
        zIndex: 20,
    },
    settingsMenuItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    settingsMenuIcon: {
        marginRight: 4,
    },
    settingsMenuText: {
        fontSize: 14,
        color: colors.textPrimary,
    },
    profileInfoContainer: {
        alignItems: "center",
        padding: PADDING,
        gap: 4,
    },
    avatar: {
        width: 128,
        height: 128,
        borderRadius: 64,
        marginBottom: 12,
    },
    name: {
        fontSize: 22,
        color: "#fff",
    },
    handle: {
        fontSize: 16,
        color: colors.textSecondary,
    },
    joinDate: {
        fontSize: 16,
        color: colors.textSecondary,
    },
    followButton: {
        marginTop: 16,
        paddingVertical: 10,
        paddingHorizontal: 32,
        borderRadius: 24,
        backgroundColor: colors.primary,
        alignItems: "center",
    },
    followingButton: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: "#3b4354",
    },
    followButtonText: {
        fontSize: 16,
        color: colors.textPrimary,
    },
    followingButtonText: {
        color: colors.textPrimary,
    },
    followButtonDisabled: {
        opacity: 0.7,
    },
    statsRow: {
        flexDirection: "row",
        gap: 12,
        paddingHorizontal: PADDING,
        paddingVertical: 6,
    },
    statBox: {
        flex: 1,
        alignItems: "center",
        gap: 8,
        borderWidth: 1,
        borderColor: "#3b4354",
        borderRadius: 8,
        padding: 12,
    },
    statBoxValue: {
        fontSize: 24,
        color: "#fff",
    },
    statBoxLabel: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    sectionContainer: {
        paddingTop: 24,
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
        color: "#fff",
    },
    sectionActionButton: {
        padding: 4,
    },
    xpContent: {
        paddingHorizontal: PADDING,
        gap: 4,
    },
    xpLevelText: {
        fontSize: 16,
        color: "#fff",
    },
    xpBarBackground: {
        height: 8,
        backgroundColor: "#3b4354",
        borderRadius: 4,
        overflow: "hidden",
    },
    xpBarFill: {
        height: "100%",
        backgroundColor: "#fff",
        borderRadius: 4,
    },
    xpCountText: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    dashboardStatsPanel: {
        paddingHorizontal: PADDING,
        gap: 12,
    },
    dashboardStatCard: {
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#2d3444",
        paddingVertical: 16,
        paddingHorizontal: 18,
        gap: 6,
    },
    dashboardStatLabel: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    dashboardStatValue: {
        fontSize: 22,
        color: colors.textPrimary,
    },
    horizontalList: {
        paddingHorizontal: PADDING,
    },
    verticalList: {
        paddingHorizontal: PADDING,
    },
    placeCard: {
        width: 160,
        gap: 8,
        marginRight: 12,
    },
    placeCardImage: {
        width: "100%",
        aspectRatio: 1,
        borderRadius: 8,
        backgroundColor: "#D9D9D9",
    },
    placeCardTitle: {
        fontSize: 16,
        color: "#fff",
    },
    userListCard: {
        width: "100%",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#3b4354",
        backgroundColor: colors.surface,
        marginBottom: 8,
    },
    userListCardContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
    },
    userListCardTitle: {
        fontSize: 16,
        color: "#fff",
        flexShrink: 1,
    },
    userListCardIcon: {
        marginLeft: 4,
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
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
    emptyStateCard: {
        width: 300,
        backgroundColor: colors.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#3b4354",
        borderStyle: "dashed",
        padding: 20,
        alignItems: "center",
        marginHorizontal: PADDING,
    },
    emptyStateTitle: {
        fontSize: 16,
        color: colors.textPrimary,
        textAlign: "center",
    },
    emptyStateDescription: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: "center",
        marginTop: 8,
    },
    emptyStateButton: {
        backgroundColor: colors.tagBackground,
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 16,
        marginTop: 16,
    },
    emptyStateButtonText: {
        fontSize: 14,
        color: colors.textPrimary,
    },
});
export default styles;
