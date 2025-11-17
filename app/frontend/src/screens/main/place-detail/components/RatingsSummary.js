import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppText from "../../../../components/text";
import colors from "../../../../theme/colors";
import styles from "../styles";
const RatingBar = ({ rating }) => {
    const percentage = rating ? (rating / 5) * 100 : 0;
    return (<View style={styles.ratingBarBackground}>
      <View style={[styles.ratingBarFill, { width: `${percentage}%` }]}/>
    </View>);
};
const formatRating = (v) => typeof v === "number" && !Number.isNaN(v) ? String(v.toFixed(1)) : "-";
const RatingsSummary = ({ ratings }) => {
    if (!ratings)
        return null;
    const { overall, totalReviews, food, service, ambiance, friendsRating } = ratings;
    return (<View style={styles.ratingsWrapper}>
      <View style={styles.ratingsContainer}>
      <View style={styles.topRatingsRow}>
        {friendsRating !== null && friendsRating !== undefined && (<View style={styles.topRatingItem}>
            <AppText style={styles.topRatingLabel}>Nota de Amigos</AppText>
            <View style={styles.topRatingValueRow}>
              <Ionicons name="star" size={18} color={colors.star} style={{ marginRight: 4 }}/>
              <AppText weight="bold" style={styles.topRatingValue}>
                {formatRating(friendsRating)}
              </AppText>
            </View>
          </View>)}
        <View style={styles.topRatingItem}>
          <AppText style={styles.topRatingLabel}>Classificação Geral</AppText>
          <View style={styles.topRatingValueRow}>
            <Ionicons name="star" size={18} color={colors.star} style={{ marginRight: 4 }}/>
            <AppText weight="bold" style={styles.topRatingValue}>
              {formatRating(overall)}
            </AppText>
            <AppText style={styles.topRatingCount}>({totalReviews})</AppText>
          </View>
        </View>
      </View>
      <View style={styles.ratingDivider}/>
      <View style={styles.detailedRatings}>
        <View style={styles.detailedRatingRow}>
          <AppText style={styles.detailedRatingLabel}>Comida</AppText>
          <AppText weight="bold" style={styles.detailedRatingValue}>
            {formatRating(food)}
          </AppText>
          <RatingBar rating={food}/>
        </View>
        <View style={styles.detailedRatingRow}>
          <AppText style={styles.detailedRatingLabel}>Serviço</AppText>
          <AppText weight="bold" style={styles.detailedRatingValue}>
            {formatRating(service)}
          </AppText>
          <RatingBar rating={service}/>
        </View>
        <View style={styles.detailedRatingRow}>
          <AppText style={styles.detailedRatingLabel}>Ambiente</AppText>
          <AppText weight="bold" style={styles.detailedRatingValue}>
            {formatRating(ambiance)}
          </AppText>
          <RatingBar rating={ambiance}/>
        </View>
      </View>
      </View>
    </View>);
};
export default RatingsSummary;
