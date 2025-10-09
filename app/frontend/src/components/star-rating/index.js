import React, { memo } from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";
import colors from "../../theme/colors";

const PRESETS = {
  star: { active: "star", inactive: "star-outline", color: "#FFD700" },
  overall: {
    active: "ribbon",
    inactive: "ribbon-outline",
    color: colors.primary || "#FFB300",
  },
  food: {
    active: "fast-food",
    inactive: "fast-food-outline",
    color: "#FF6A00",
  },
  service: { active: "people", inactive: "people-outline", color: "#4F46E5" },
  ambience: { active: "leaf", inactive: "leaf-outline", color: "#10B981" },
  price: { active: "cash", inactive: "cash-outline", color: "#059669" },
};

const StarRating = ({
  initialRating = 0,
  maxStars = 5,
  onRatingChange,
  preset = "star",
  iconActive,
  iconInactive,
  size = 30,
  colorActive,
  colorInactive = "#888",
  gap = 6,
  disabled = false,
  testID,
}) => {
  const cfg = PRESETS[preset] || PRESETS.star;
  const activeName = iconActive || cfg.active;
  const inactiveName = iconInactive || cfg.inactive;
  const activeColor = colorActive || cfg.color;

  return (
    <View style={[styles.starContainer, { gap }]}>
      {Array.from({ length: maxStars }, (_, i) => {
        const idx = i + 1;
        const selected = idx <= initialRating;
        const name = selected ? activeName : inactiveName;
        const color = selected ? activeColor : colorInactive;

        return (
          <TouchableOpacity
            key={idx}
            onPress={() => !disabled && onRatingChange && onRatingChange(idx)}
            disabled={disabled}
            style={styles.starButton}
            accessibilityRole="button"
            accessibilityLabel={`Avaliar ${idx} de ${maxStars}`}
            testID={testID ? `${testID}-${idx}` : undefined}
            activeOpacity={0.7}
          >
            <Ionicons name={name} size={size} color={color} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default memo(StarRating);
