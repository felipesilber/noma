import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Linking,
  ActivityIndicator,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";
import colors from "../../../theme/colors";
import api from "../../../services/api";

function formatRating(v) {
  return typeof v === "number" && !Number.isNaN(v) ? String(v) : "-";
}
function toSymbolPrice(level) {
  if (!level) return undefined;
  if (["ONE", "TWO", "THREE", "FOUR"].includes(level)) {
    const map = { ONE: "$", TWO: "$$", THREE: "$$$", FOUR: "$$$$" };
    return map[level];
  }
  return level;
}
function hoursBadgeText(oh) {
  if (!oh) return "-";
  return oh.status === "Aberto" ? "Aberto" : "Fechado";
}

const PlaceDetailScreen = ({ route, navigation }) => {
  const { placeId, friendIds } = route.params || {};
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullHours, setShowFullHours] = useState(false);

  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const headerImage = useMemo(() => {
    return (
      place?.image ||
      place?.imageUrl ||
      place?.photos?.[0]?.url ||
      "https://picsum.photos/id/163/600/400"
    );
  }, [place]);

  const priceLevelSymbols = useMemo(
    () => toSymbolPrice(place?.priceLevel),
    [place?.priceLevel]
  );

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        if (!placeId) {
          setLoading(false);
          Alert.alert("Erro", "ID do local não informado.");
          return;
        }
        const resp = await api.get(`/place/${placeId}`, {
          params: friendIds?.length
            ? { friendIds: friendIds.join(",") }
            : undefined,
        });
        let data = resp.data;
        if (Array.isArray(data?.tags)) {
          data = {
            ...data,
            tags: data.tags
              .map((t) => (typeof t === "string" ? t : t?.name))
              .filter(Boolean),
          };
        }
        if (alive) setPlace(data);
      } catch {
        Alert.alert("Erro", "Não foi possível carregar o lugar.");
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => {
      alive = false;
    };
  }, [placeId, Array.isArray(friendIds) ? friendIds.join(",") : friendIds]);

  useEffect(() => {
    let alive = true;
    async function checkSaved() {
      try {
        if (!placeId) return;
        const { data } = await api.get(`/saved-places/${placeId}`);
        if (alive) setIsSaved(!!data?.saved);
      } catch {}
    }
    checkSaved();
    return () => {
      alive = false;
    };
  }, [placeId]);

  const toggleSaved = async () => {
    if (!placeId || saving) return;
    const next = !isSaved;
    setIsSaved(next);
    setSaving(true);
    try {
      if (next) await api.put(`/saved-places/${placeId}`);
      else await api.delete(`/saved-places/${placeId}`);
    } catch {
      setIsSaved(!next);
      Alert.alert("Erro", "Não foi possível atualizar seus salvos.");
    } finally {
      setSaving(false);
    }
  };

  const goToAddReview = () => {
    navigation.navigate("AddReviewFlow", {
      screen: "AddReviewForm",
      params: {
        placeId,
        placeName: place?.name || "",
        placeImage: place?.imageUrl || "",
      },
    });
  };

  const handleCopyAddress = async () => {
    if (place?.address) {
      await Clipboard.setStringAsync(place.address);
      Alert.alert("Copiado!", "Endereço copiado para a área de transferência.");
    }
  };
  const handleCall = () => {
    if (place?.phone) Linking.openURL(`tel:${place.phone}`);
    else Alert.alert("Erro", "Número de telefone não disponível.");
  };
  const handleGetDirections = () => {
    if (place?.latitude && place?.longitude) {
      const url = `https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`;
      Linking.openURL(url);
      return;
    }
    if (place?.address) {
      const encoded = encodeURIComponent(place.address);
      Linking.openURL(
        `https://www.google.com/maps/search/?api=1&query=${encoded}`
      );
    } else {
      Alert.alert("Rotas", "Localização não disponível.");
    }
  };
  const handleOpenWebsite = () => {
    if (place?.siteUrl) Linking.openURL(place.siteUrl);
    else Alert.alert("Erro", "Site não disponível.");
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!place) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={{ color: colors.textSecondary }}>
          Local não encontrado.
        </Text>
      </View>
    );
  }

  const reviewCountText =
    typeof place?.reviewCount === "number" ? `${place.reviewCount}` : "-";

  const precoMedio = place?.priceRange
    ? place.priceRange
    : priceLevelSymbols
    ? priceLevelSymbols
    : "-";

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.topBarButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
        >
          <Ionicons name="arrow-back" size={22} color={colors.surface} />
        </TouchableOpacity>

        <View style={styles.topBarRight}>
          <TouchableOpacity
            style={styles.topBarButton}
            onPress={toggleSaved}
            disabled={saving}
            activeOpacity={0.85}
          >
            <Ionicons
              name={isSaved ? "bookmark" : "bookmark-outline"}
              size={22}
              color={colors.surface}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.topBarButton}
            onPress={goToAddReview}
            activeOpacity={0.85}
          >
            <Ionicons name="add" size={24} color={colors.surface} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Image source={{ uri: headerImage }} style={styles.headerImage} />

        <View style={styles.contentContainer}>
          <Text style={styles.placeName}>{place.name}</Text>
          {!!place.category && (
            <Text style={styles.placeCategory}>{place.category}</Text>
          )}

          {!!place.address && (
            <View style={styles.addressContainer}>
              <Text style={styles.placeAddress}>{place.address}</Text>
              <TouchableOpacity onPress={handleCopyAddress}>
                <Ionicons
                  name="copy-outline"
                  size={20}
                  color={colors.textSecondary}
                  style={styles.copyIcon}
                />
              </TouchableOpacity>
            </View>
          )}

          {/* Botões: largura total, gap ~8, raio menor */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={[styles.actionButtonWide, { marginRight: 8 }]}
              onPress={handleCall}
            >
              <Ionicons
                name="call-outline"
                size={16}
                color={colors.surface}
                style={{ marginRight: 6 }}
              />
              <Text style={styles.actionButtonText}>Ligar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButtonWide, { marginRight: 8 }]}
              onPress={handleGetDirections}
            >
              <Ionicons
                name="navigate-outline"
                size={16}
                color={colors.surface}
                style={{ marginRight: 6 }}
              />
              <Text style={styles.actionButtonText}>Como chegar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButtonWide}
              onPress={handleOpenWebsite}
            >
              <Ionicons
                name="globe-outline"
                size={16}
                color={colors.surface}
                style={{ marginRight: 6 }}
              />
              <Text style={styles.actionButtonText}>Site</Text>
            </TouchableOpacity>
          </View>

          {/* Linha com 4 infos: Horário | Público | Amigos | Preço */}
          <View style={styles.infoRowUnified}>
            {/* Horário */}
            <View style={styles.infoItemUnified}>
              <Ionicons
                name="time-outline"
                size={16}
                color={
                  place?.openingHours?.status === "Aberto"
                    ? colors.success
                    : colors.textSecondary
                }
                style={styles.infoIconUnified}
              />
              <View style={styles.infoTextGroup}>
                <Text style={styles.infoLabelUnified}>Horário</Text>
                <Text
                  style={[
                    styles.infoValueUnified,
                    place?.openingHours?.status === "Aberto"
                      ? styles.infoOpen
                      : styles.infoClosed,
                  ]}
                >
                  {hoursBadgeText(place?.openingHours)}
                </Text>
              </View>
            </View>

            <View style={styles.infoDividerUnified} />

            {/* Público */}
            <View style={styles.infoItemUnified}>
              <Ionicons
                name="star"
                size={16}
                color={colors.textSecondary}
                style={styles.infoIconUnified}
              />
              <View style={styles.infoTextGroup}>
                <Text style={styles.infoLabelUnified}>Público</Text>
                <Text style={styles.infoValueUnified}>
                  {formatRating(place?.avgRating)}
                </Text>
              </View>
            </View>

            <View style={styles.infoDividerUnified} />

            {/* Amigos */}
            <View style={styles.infoItemUnified}>
              <Ionicons
                name="people-outline"
                size={16}
                color={colors.textSecondary}
                style={styles.infoIconUnified}
              />
              <View style={styles.infoTextGroup}>
                <Text style={styles.infoLabelUnified}>Amigos</Text>
                <Text style={styles.infoValueUnified}>
                  {formatRating(place?.friendsRating)}
                </Text>
              </View>
            </View>

            <View style={styles.infoDividerUnified} />

            {/* Preço */}
            <View style={styles.infoItemUnified}>
              <Ionicons
                name="cash-outline"
                size={16}
                color={colors.textSecondary}
                style={styles.infoIconUnified}
              />
              <View style={styles.infoTextGroup}>
                <Text style={styles.infoLabelUnified}>Preço</Text>
                <Text style={styles.infoValueUnified}>
                  {place?.priceRange || priceLevelSymbols || "-"}
                </Text>
              </View>
            </View>
          </View>

          {/* Classificações (sem bordas/divisórias, com estrela ao lado) */}
          <Text style={styles.sectionTitle}>
            Classificações{" "}
            <Text style={styles.sectionSubtitle}>
              ({reviewCountText} avaliações)
            </Text>
          </Text>

          <View style={styles.ratingsListPlain}>
            <View style={styles.ratingRowPlain}>
              <Text style={styles.ratingRowLabel}>Geral</Text>
              <View style={styles.ratingValueWithIcon}>
                <Ionicons name="star" size={16} color={colors.textSecondary} />
                <Text style={styles.ratingRowValue}>
                  {formatRating(place?.avgRating)}
                </Text>
              </View>
            </View>
            <View style={styles.ratingRowPlain}>
              <Text style={styles.ratingRowLabel}>Comida</Text>
              <View style={styles.ratingValueWithIcon}>
                <Ionicons name="star" size={16} color={colors.textSecondary} />
                <Text style={styles.ratingRowValue}>
                  {formatRating(place?.avgFood)}
                </Text>
              </View>
            </View>
            <View style={styles.ratingRowPlain}>
              <Text style={styles.ratingRowLabel}>Serviço</Text>
              <View style={styles.ratingValueWithIcon}>
                <Ionicons name="star" size={16} color={colors.textSecondary} />
                <Text style={styles.ratingRowValue}>
                  {formatRating(place?.avgService)}
                </Text>
              </View>
            </View>
            <View style={styles.ratingRowPlain}>
              <Text style={styles.ratingRowLabel}>Ambiente</Text>
              <View style={styles.ratingValueWithIcon}>
                <Ionicons name="star" size={16} color={colors.textSecondary} />
                <Text style={styles.ratingRowValue}>
                  {formatRating(place?.avgEnvironment)}
                </Text>
              </View>
            </View>
          </View>

          {!!place.visitedByFriends?.length && (
            <>
              <Text style={styles.sectionTitle}>Visitado por</Text>
              <View style={styles.visitedByContainer}>
                {place.visitedByFriends.map((f) => (
                  <Image
                    key={f.id}
                    source={{ uri: f.avatar }}
                    style={styles.friendAvatar}
                  />
                ))}
              </View>
            </>
          )}

          {!!place.openingHours && (
            <>
              <Text style={styles.sectionTitle}>Horário de funcionamento</Text>
              <TouchableOpacity
                style={styles.hoursSummaryContainer}
                onPress={() => setShowFullHours(!showFullHours)}
              >
                {!!place.openingHours.status && (
                  <Text
                    style={[
                      styles.hoursStatus,
                      place.openingHours.status === "Aberto"
                        ? styles.statusOpen
                        : styles.statusClosed,
                    ]}
                  >
                    {place.openingHours.status}
                  </Text>
                )}
                <Ionicons
                  name={
                    showFullHours
                      ? "chevron-up-outline"
                      : "chevron-down-outline"
                  }
                  size={20}
                  color={colors.textSecondary}
                  style={styles.hoursToggleIcon}
                />
              </TouchableOpacity>

              {showFullHours && !!place.openingHours.details?.length && (
                <View style={styles.fullHoursContainer}>
                  {place.openingHours.details.map((d, idx) => (
                    <Text key={idx} style={styles.fullHoursText}>
                      {d}
                    </Text>
                  ))}
                </View>
              )}
            </>
          )}

          {/* Tags no fim */}
          {!!place.tags?.length && (
            <>
              <Text style={styles.sectionTitle}>Tags</Text>
              <View style={styles.tagsContainer}>
                {place.tags.map((tag, i) => (
                  <View key={`${tag}-${i}`} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          <Text style={styles.sectionTitle}>Localização</Text>
          <View style={styles.grayMapPlaceholder}>
            <Text style={styles.noMapText}>Mapa será exibido aqui</Text>
          </View>

          <View style={{ height: 50 }} />
        </View>
      </ScrollView>
    </View>
  );
};

export default PlaceDetailScreen;
