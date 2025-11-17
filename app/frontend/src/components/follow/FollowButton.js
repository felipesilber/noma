import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import colors from "../../theme/colors";
const FollowButton = ({ initialIsFollowing, onToggle }) => {
    const [isFollowing, setIsFollowing] = useState(Boolean(initialIsFollowing));
    const handlePress = async () => {
        const next = !isFollowing;
        setIsFollowing(next);
        if (onToggle)
            onToggle(next, () => setIsFollowing(!next));
    };
    return (<TouchableOpacity style={[styles.followButton, isFollowing && styles.followingButton]} onPress={handlePress} activeOpacity={0.8}>
      <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>
        {isFollowing ? "Seguindo" : "Seguir"}
      </Text>
    </TouchableOpacity>);
};
const styles = StyleSheet.create({
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
});
export default FollowButton;
