import React from "react";
import { TouchableOpacity, View, Image, Text, StyleSheet } from "react-native";
import colors from "../../theme/colors";

const PlaceSearchResultCard = ({ item, onPress }) => {
  const imageUri =
    item.image ||
    item.imageUrl ||
    "https://via.placeholder.com/100/D9D9D9/000000?text=Foto";

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <Image source={{ uri: imageUri }} style={styles.cardImage} />
      <View style={styles.cardInfo}>
        <Text numberOfLines={1} style={styles.cardTitle}>
          {item.name}
        </Text>
        {!!item.address && (
          <Text numberOfLines={1} style={styles.cardAddress}>
            {item.address}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cardImage: {
    width: 48,
    height: 48,
    borderRadius: 6,
    marginRight: 12,
    backgroundColor: colors.divider,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  cardAddress: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
});

export default PlaceSearchResultCard;


