import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../theme/colors";

const Avatar = ({ avatarUrl, size = 56, style }) => {
  const avatarSize = size;
  const iconSize = avatarSize * 0.6;

  if (avatarUrl) {
    return (
      <Image
        source={{ uri: avatarUrl }}
        style={[
          styles.avatar,
          {
            width: avatarSize,
            height: avatarSize,
            borderRadius: avatarSize / 2,
          },
          style,
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.avatarPlaceholder,
        {
          width: avatarSize,
          height: avatarSize,
          borderRadius: avatarSize / 2,
          backgroundColor: colors.divider,
        },
        style,
      ]}
    >
      <Ionicons
        name="person"
        size={iconSize}
        color={colors.textSecondary}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    resizeMode: "cover",
  },
  avatarPlaceholder: {
    backgroundColor: colors.divider,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Avatar;

