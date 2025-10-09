import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";
import colors from "../../../../theme/colors.js";
import api from "../../../../services/api.js";

const tabs = [
  { key: "popular", label: "Populares" },
  { key: "nearby", label: "Perto" },
  { key: "rating", label: "Melhor avaliados" },
  { key: "promo", label: "Promoções" },
];

const PRICE_SYMBOL = {
  ONE: "$",
  TWO: "$$",
  THREE: "$$$",
  FOUR: "$$$$",
};

const StarRating = ({ value = 0 }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const diff = value - i + 1;
    let name = "star-outline";
    if (diff >= 1) name = "star";
    else if (diff >= 0.5) name = "star-half";
    stars.push(
      <Ionicons key={i} name={name} size={16} style={{ marginRight: 2 }} />
    );
  }
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>{stars}</View>
  );
};

const PlaceCard = ({ item, onPress, accentColor }) => {
  const price = PRICE_SYMBOL[item.priceLevel] || "";
  return (
    <TouchableOpacity
      style={styles.placeCard}
      activeOpacity={0.9}
      onPress={onPress}
    >
      <Image
        source={{
          uri: item.imageUrl || "https://picsum.photos/id/163/600/400",
        }}
        style={styles.placeImage}
      />
      <View style={styles.placeInfo}>
        <Text style={styles.placeTitle} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={styles.row}>
          <StarRating value={item.avgRating || item.ratingAvg || 0} />
          <Text style={styles.ratingText}>
            {(item.avgRating ?? item.ratingAvg ?? 0).toFixed(1)}
          </Text>
        </View>
        <View style={styles.row}>
          {!!price && <Text style={styles.priceBadge}>{price}</Text>}
          {!!item.tags?.length && (
            <Text style={styles.tagsText} numberOfLines={1}>
              • {item.tags.slice(0, 2).join(" • ")}
            </Text>
          )}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
    </TouchableOpacity>
  );
};

const CategoryScreen = ({ route, navigation }) => {
  const { categoryId } = route.params;
  const [category, setCategory] = useState(null);
  const [loadingCategory, setLoadingCategory] = useState(true);

  const [activeTab, setActiveTab] = useState("popular");
  const [places, setPlaces] = useState([]);
  const [loadingPlaces, setLoadingPlaces] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingCategory(true);
        const { data } = await api.get(`/category/${categoryId}`);
        if (!mounted) return;
        setCategory({
          id: data.id,
          name: data.name,
          emoji: data.emoji ?? null,
          colorHex: data.colorHex ?? colors.primary,
          textColorHex: data.textColorHex ?? "#FFFFFF",
        });
        navigation.setOptions({ headerShown: false });
      } catch (e) {
        if (!mounted) return;
      } finally {
        if (mounted) setLoadingCategory(false);
      }
    })();
    return () => (mounted = false);
  }, [categoryId, navigation]);

  const fetchPlaces = useCallback(
    async (tabKey = "popular") => {
      setLoadingPlaces(true);
      setError(null);
      try {
        const { data } = await api.get("/place", {
          params: {
            categoryId,
            sort:
              tabKey === "rating"
                ? "rating"
                : tabKey === "nearby"
                ? "distance"
                : "popular",
            promo: tabKey === "promo" ? true : undefined,
          },
        });

        const normalized = Array.isArray(data)
          ? data.map((p) => ({
              id: p.id,
              name: p.name,
              imageUrl: p.imageUrl ?? null,
              priceLevel: p.priceLevel,
              tags:
                p.tags?.map((t) => (typeof t === "string" ? t : t.name)) || [],
              avgRating: p.avgRating ?? p.ratingAvg ?? 0,
            }))
          : [];

        if (tabKey === "rating") {
          normalized.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
        }

        setPlaces(normalized);
      } catch (e) {
        setError("Não foi possível carregar os lugares.");
      } finally {
        setLoadingPlaces(false);
      }
    },
    [categoryId]
  );

  useEffect(() => {
    fetchPlaces(activeTab);
  }, [activeTab, fetchPlaces]);

  const accentBg = category?.colorHex || colors.primary;
  const accentFg = category?.textColorHex || "#FFFFFF";

  const renderHeader = useMemo(() => {
    return (
      <View style={[styles.hero, { backgroundColor: accentBg }]}>
        <SafeAreaView>
          <View style={styles.heroTop}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backBtn}
            >
              <Ionicons name="chevron-back" size={22} color={accentFg} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("Search")}
              style={styles.searchBtn}
            >
              <Ionicons name="search" size={18} color={accentFg} />
            </TouchableOpacity>
          </View>
          <View style={styles.heroCenter}>
            <Text style={[styles.heroEmoji, { color: accentFg }]}>
              {category?.emoji || "🍽️"}
            </Text>
            <Text
              style={[styles.heroTitle, { color: accentFg }]}
              numberOfLines={1}
            >
              {category?.name || ""}
            </Text>
          </View>
          <View style={styles.tabsRow}>
            {tabs.map((t) => {
              const active = activeTab === t.key;
              return (
                <TouchableOpacity
                  key={t.key}
                  onPress={() => setActiveTab(t.key)}
                  style={[
                    styles.tabBtn,
                    active && { backgroundColor: accentFg },
                  ]}
                >
                  <Text
                    style={[
                      styles.tabText,
                      active ? { color: accentBg } : { color: accentFg },
                    ]}
                  >
                    {t.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </SafeAreaView>
      </View>
    );
  }, [accentBg, accentFg, category, navigation, activeTab]);

  return (
    <View style={styles.container}>
      {loadingCategory ? (
        <View
          style={[
            styles.hero,
            { backgroundColor: colors.surface, justifyContent: "center" },
          ]}
        >
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        renderHeader
      )}

      <View style={styles.listContainer}>
        {loadingPlaces ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => fetchPlaces(activeTab)}>
              <Text style={styles.retryText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={places}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <PlaceCard
                item={item}
                accentColor={accentBg}
                onPress={() =>
                  navigation.navigate("PlaceDetail", { placeId: item.id })
                }
              />
            )}
            ListEmptyComponent={
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>Nenhum lugar encontrado.</Text>
              </View>
            }
          />
        )}
      </View>

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: accentBg }]}
        activeOpacity={0.9}
        onPress={() => navigation.navigate("Filters", { categoryId })}
      >
        <Ionicons name="options" size={20} color={accentFg} />
      </TouchableOpacity>
    </View>
  );
};

export default CategoryScreen;
