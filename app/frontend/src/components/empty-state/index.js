import React from "react";
import { View, Text, Image, ActivityIndicator, TouchableOpacity, } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";
import colors from "../../theme/colors";
const EmptyState = ({ variant = "empty", title = "", subtitle = "", iconName, iconSize = 56, illustrationSource, primaryAction, secondaryAction, loading = false, fullScreen = true, testID = "empty-state", children, compact = false, containerStyle, }) => {
    const defaultIcons = {
        empty: "search-outline",
        error: "alert-circle-outline",
        offline: "cloud-offline-outline",
        custom: "information-circle-outline",
    };
    const resolvedIcon = iconName || defaultIcons[variant] || defaultIcons.custom;
    const tintByVariant = {
        empty: colors.textSecondary,
        error: colors.error,
        offline: colors.warning || "#FBC02D",
        custom: colors.primary,
    };
    const tint = tintByVariant[variant];
    const Container = ({ children: inner }) => (<View style={[
            styles.container,
            fullScreen ? styles.fullScreen : styles.inline,
            containerStyle,
        ]} testID={testID} accessible accessibilityRole="summary">
      {inner}
    </View>);
    return (<Container>
      <View style={styles.content}>
        {illustrationSource ? (<Image source={illustrationSource} style={[styles.illustration, compact && styles.illustrationCompact]} resizeMode="contain"/>) : (<Ionicons name={resolvedIcon} size={compact ? 28 : iconSize} color={tint}/>)}

        {!!title && (<Text style={[styles.title, compact && styles.titleCompact]}>
            {title}
          </Text>)}
        {!!subtitle && (<Text style={[styles.subtitle, compact && styles.subtitleCompact]}>
            {subtitle}
          </Text>)}

        {children}

        <View style={styles.actionsRow}>
          {primaryAction?.label && (<TouchableOpacity onPress={primaryAction.onPress} activeOpacity={0.85} style={[
                styles.primaryBtn,
                (primaryAction.disabled || loading) && styles.btnDisabled,
            ]} disabled={primaryAction.disabled || loading} accessibilityRole="button" accessibilityLabel={primaryAction.label}>
              {loading ? (<ActivityIndicator size="small" color={colors.surface}/>) : (<Text style={styles.primaryBtnText}>{primaryAction.label}</Text>)}
            </TouchableOpacity>)}

          {secondaryAction?.label && (<TouchableOpacity onPress={secondaryAction.onPress} activeOpacity={0.85} style={[
                styles.secondaryBtn,
                secondaryAction.disabled && styles.btnDisabled,
            ]} disabled={secondaryAction.disabled} accessibilityRole="button" accessibilityLabel={secondaryAction.label}>
              <Text style={styles.secondaryBtnText}>
                {secondaryAction.label}
              </Text>
            </TouchableOpacity>)}
        </View>
      </View>
    </Container>);
};
export default EmptyState;
