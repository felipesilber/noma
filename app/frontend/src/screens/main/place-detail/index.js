import React, { useEffect, useMemo, useState, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, Linking, ActivityIndicator, StyleSheet, Platform, RefreshControl, } from "react-native";
import * as Clipboard from "expo-clipboard";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";
import colors from "../../../theme/colors";
import api from "../../../services/api";
import moment from "moment";
import "moment/locale/pt-br";
import AppText from "../../../components/text";
import { showErrorNotification, showSuccessNotification } from "../../../utils/notifications";
import RatingsSummary from "./components/RatingsSummary";
function formatRating(v) {
    return typeof v === "number" && !Number.isNaN(v) ? String(v.toFixed(1)) : "-";
}
const RatingBar = ({ rating }) => {
    const percentage = rating ? (rating / 5) * 100 : 0;
    return (<View style={styles.ratingBarBackground}>
      <View style={[styles.ratingBarFill, { width: `${percentage}%` }]}/>
    </View>);
};
const ReviewCard = ({ review }) => {
    const timeAgo = moment(review.createdAt).locale("pt-br").fromNow();
    const userName = review.user?.name || "Usuário";
    const avatarUrl = review.user?.avatarUrl ||
        "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/20.jpg";
    return (<View style={styles.reviewCardContainer}>
      <Image source={{ uri: avatarUrl }} style={styles.reviewAvatar}/>
      <View style={styles.reviewContent}>
        <View style={styles.reviewHeader}>
          <View>
            <AppText weight="bold" style={styles.reviewUserName}>
              {userName}
            </AppText>
            <AppText style={styles.reviewTimeAgo}>{timeAgo}</AppText>
          </View>
          <View style={styles.reviewRating}>
            <Ionicons name="star" size={16} color={colors.star} style={{ marginRight: 4 }}/>
            <AppText weight="bold" style={styles.reviewRatingValue}>
              {formatRating(review.rating)}
            </AppText>
          </View>
        </View>
        <AppText style={styles.reviewText}>{review.text}</AppText>
      </View>
    </View>);
};
const MapPlaceholder = ({ onPressDirections }) => (<View style={styles.mapPlaceholderContainer}>
    <Image source={{ uri: "https://via.placeholder.com/400x200.png?text=Mapa+Aqui" }} style={styles.mapPlaceholderImage}/>
    <TouchableOpacity style={styles.mapDirectionsButton} onPress={onPressDirections}>
      <Ionicons name="navigate" size={20} color={colors.surface}/>
    </TouchableOpacity>
  </View>);
const OpeningHoursSection = ({ hours }) => (<View style={styles.hoursContainer}>
    {hours.map((item, index) => (<View key={index} style={styles.hourRow}>
        {index === 0 && (<Ionicons name="time-outline" size={18} color={colors.textSecondary} style={styles.hourIcon}/>)}
        <AppText style={[styles.hourDay, index !== 0 && { marginLeft: 28 }]}>
          {item.day}
        </AppText>
        <AppText style={[
            styles.hourTime,
            item.day === "Domingo" && styles.hourTimeHighlight,
        ]}>
          {item.hours}
        </AppText>
      </View>))}
  </View>);
const TagsSection = ({ tags }) => (<View style={styles.tagsContainer}>
    {tags.map((tag, index) => {
        const tagText = tag.startsWith("#") ? tag : `#${tag}`;
        return (<View key={index} style={styles.tag}>
          <AppText style={styles.tagText}>{tagText}</AppText>
        </View>);
    })}
  </View>);
const PlaceDetailScreen = ({ route, navigation }) => {
    const { placeId } = route.params || {};
    const [place, setPlace] = useState(null);
    const [ratingsData, setRatingsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [isSaved, setIsSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const headerImage = useMemo(() => {
        return place?.imageUrls?.[0] || "https://picsum.photos/id/163/600/400";
    }, [place]);
    const fetchData = useCallback(async () => {
        if (!placeId) {
            setError("ID do local não informado.");
            setLoading(false);
            return;
        }
        if (!refreshing) {
            setLoading(true);
        }
        setError(null);
        try {
            const [detailsResponse, ratingsResponse, savedResponse] = await Promise.all([
                api.get(`/places/${placeId}`),
                api.get(`/places/${placeId}/ratings`),
                api.get(`/saved-places/${placeId}`).catch(() => ({ data: { saved: false } })),
            ]);
            console.log(detailsResponse.data);
            setPlace(detailsResponse.data);
            setRatingsData(ratingsResponse.data);
            const savedStatus = savedResponse?.data?.saved ?? detailsResponse.data.isSaved;
            setIsSaved(savedStatus);
        }
        catch (e) {
            console.error("Failed to load place data:", e);
            setError("Não foi possível carregar os dados do lugar.");
            setPlace(null);
            setRatingsData(null);
        }
        finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [placeId, refreshing]);
    useEffect(() => {
        fetchData();
    }, [fetchData]);
    const toggleSaved = async () => {
        if (saving)
            return;
        setSaving(true);
        try {
            if (isSaved) {
                await api.delete(`/saved-places/${placeId}`);
                setIsSaved(false);
                showSuccessNotification("Removido dos salvos", undefined, {
                    position: "bottom",
                });
            }
            else {
                await api.put(`/saved-places/${placeId}`);
                setIsSaved(true);
                showSuccessNotification("Salvo", "Lugar adicionado aos salvos.", {
                    position: "bottom",
                });
            }
        }
        catch (e) {
            console.error("Erro ao alternar salvo:", e);
            showErrorNotification("Erro", "Não foi possível atualizar os salvos.", { position: "bottom" });
        }
        finally {
            setSaving(false);
        }
    };
    const goToAddReview = () => {
        if (!place)
            return;
        navigation.navigate("AddReviewFlow", {
            screen: "AddReviewForm",
            params: {
                placeId,
                placeName: place.name,
                placeImage: headerImage,
            },
        });
    };
    const handleCopyAddress = async () => {
    };
    const handleGetDirections = () => {
    };
    if (loading) {
        return (<View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary}/>
      </View>);
    }
    if (error || !place || !ratingsData) {
        return (<View style={styles.centered}>
        <AppText style={styles.errorText}>
          {error || "Ocorreu um erro."}
        </AppText>
        <TouchableOpacity onPress={fetchData} style={styles.retryButton}>
          <AppText weight="bold" style={styles.retryButtonText}>
            Tentar Novamente
          </AppText>
        </TouchableOpacity>
      </View>);
    }
    const { overall, totalReviews, food, service, ambiance, friendsRating } = ratingsData;
    return (<View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.topBarButton} onPress={() => navigation.goBack()} activeOpacity={0.85}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary}/>
        </TouchableOpacity>
        <View style={styles.topBarRight}>
          <TouchableOpacity style={styles.topBarButton} onPress={toggleSaved} disabled={saving} activeOpacity={0.85}>
            <Ionicons name={isSaved ? "bookmark" : "bookmark-outline"} size={22} color={colors.textPrimary}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.topBarButton} onPress={() => { }} activeOpacity={0.85}>
            <Ionicons name="share-outline" size={22} color={colors.textPrimary}/>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => {
                setRefreshing(true);
                fetchData();
            }} tintColor={colors.textSecondary}/> }>
        <Image source={{ uri: headerImage }} style={styles.headerImage}/>

        <View style={styles.contentContainer}>
          <View style={styles.nameStatusRow}>
            <AppText weight="bold" style={styles.placeName}>
              {place.name}
            </AppText>
            {place.status && (<View style={[
                styles.statusBadge,
                place.status === "Aberto"
                    ? styles.statusBadgeOpen
                    : styles.statusBadgeClosed,
            ]}>
                <Ionicons name="time-outline" size={12} color={place.status === "Aberto"
                ? colors.successDark
                : colors.errorDark} style={{ marginRight: 4 }}/>
                <AppText weight="bold" style={[
                styles.statusBadgeText,
                place.status === "Aberto"
                    ? styles.statusBadgeTextOpen
                    : styles.statusBadgeTextClosed,
            ]}>
                  {place.status}
                </AppText>
              </View>)}
          </View>
          <AppText style={styles.placeCategory}>{place.category}</AppText>
          {place.priceInfo && (<View style={styles.infoRow}>
              <Ionicons name="cash-outline" size={18} color={colors.textSecondary} style={styles.infoIcon}/>
              <AppText style={styles.infoText}>{place.priceInfo}</AppText>
            </View>)}
          {place.address && (<View style={styles.infoRow}>
              <Ionicons name="location-outline" size={18} color={colors.textSecondary} style={styles.infoIcon}/>
              <AppText style={styles.infoTextAddress} numberOfLines={2}>
                {place.address}
              </AppText>
              {place.distanceInKm != null && (<View style={styles.distanceContainer}>
                  <Ionicons name="walk-outline" size={16} color={colors.primary} style={{ marginRight: 2 }}/>
                  <AppText weight="bold" style={styles.distanceText}>
                    {place.distanceInKm.toFixed(1)} km
                  </AppText>
                </View>)}
            </View>)}

          <RatingsSummary ratings={ratingsData}/>

          <TouchableOpacity style={styles.evaluateButton} onPress={goToAddReview}>
            <Ionicons name="chatbubble-ellipses-outline" size={20} color={colors.surface} style={{ marginRight: 8 }}/>
            <AppText weight="bold" style={styles.evaluateButtonText}>
              Avaliar
            </AppText>
          </TouchableOpacity>

          <View style={styles.reviewsSectionContainer}>
            <AppText weight="bold" style={styles.sectionTitle}>
              Avaliações ({totalReviews || place.reviews?.length || 0})
            </AppText>
            {place.reviews && place.reviews.length > 0 ? (<>
                {place.reviews.map((review, index) => (<ReviewCard key={index} review={review}/>))}
                {totalReviews > place.reviews.length && (<TouchableOpacity style={styles.seeAllReviewsButton} onPress={() => navigation.navigate("PlaceAllReviews", { placeId })}>
                    <AppText weight="bold" style={styles.seeAllReviewsButtonText}>
                      Ver todos as avaliações
                    </AppText>
                  </TouchableOpacity>)}
              </>) : (<AppText style={styles.emptyReviewsText}>
                Ainda não há avaliações para este lugar.
              </AppText>)}
          </View>

          <AppText weight="bold" style={styles.sectionTitle}>
            Localização
          </AppText>
          <MapPlaceholder onPressDirections={handleGetDirections}/>

          <AppText weight="bold" style={styles.sectionTitle}>
            Horário de Funcionamento
          </AppText>
          {place.openingHours && place.openingHours.length > 0 ? (<OpeningHoursSection hours={place.openingHours}/>) : (<AppText style={styles.emptyInfoText}>
              Horário de funcionamento não disponível.
            </AppText>)}

          <AppText weight="bold" style={styles.sectionTitle}>
            Tags
          </AppText>
          {place.tags && place.tags.length > 0 ? (<TagsSection tags={place.tags}/>) : (<AppText style={styles.emptyInfoText}>
              Nenhuma tag disponível.
            </AppText>)}

          <View style={{ height: 40 }}/>
        </View>
      </ScrollView>
    </View>);
};
export default PlaceDetailScreen;