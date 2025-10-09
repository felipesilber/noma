import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  Modal,
  Pressable,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";
import colors from "../../../theme/colors";
import api from "../../../services/api";

const getAutoText = (hex) => {
  if (!hex || !hex.startsWith("#") || (hex.length !== 7 && hex.length !== 9)) {
    return "#111";
  }
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const L = (v) => {
    const x = v / 255;
    return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  };
  const Y = 0.2126 * L(r) + 0.7152 * L(g) + 0.0722 * L(b);
  return Y > 0.57 ? "#000000" : "#FFFFFF";
};

const PRICE_SYMBOL = { ONE: "$", TWO: "$$", THREE: "$$$", FOUR: "$$$$" };

const StarRow = ({ value = 0 }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const diff = value - i + 1;
    let name = "star-outline";
    if (diff >= 1) name = "star";
    else if (diff >= 0.5) name = "star-half";
    stars.push(
      <Ionicons
        key={i}
        name={name}
        size={14}
        color={colors.textPrimary}
        style={{ marginRight: 1 }}
      />
    );
  }
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>{stars}</View>
  );
};

const CategoryChip = ({ item, onPress }) => {
  const bg = item.colorHex || colors.surface;
  const fg = item.textColorHex || getAutoText(item.colorHex);
  return (
    <TouchableOpacity
      style={[styles.catChip, { backgroundColor: bg }]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Text style={[styles.catChipEmoji, { color: fg }]}>
        {item.emoji || "🍽️"}
      </Text>
      <Text style={[styles.catChipText, { color: fg }]} numberOfLines={1}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
};

const PlaceCard = ({ item, onPress }) => {
  const price = PRICE_SYMBOL[item.priceLevel] || "";
  return (
    <TouchableOpacity
      style={styles.placeCard}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Image
        source={{
          uri: item.imageUrl || "https://picsum.photos/id/163/600/400",
        }}
        style={styles.placeImg}
      />
      <View style={styles.placeInfo}>
        <Text style={styles.placeTitle} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={styles.row}>
          <StarRow value={item.avgRating || 0} />
          <Text style={styles.rateText}>
            {(item.avgRating || 0).toFixed(1)}
          </Text>
        </View>
        <View style={styles.row}>
          {!!price && <Text style={styles.priceText}>{price}</Text>}
          {!!item.tags?.length && (
            <Text style={styles.tagsText} numberOfLines={1}>
              {" "}
              • {item.tags.slice(0, 2).join(" • ")}
            </Text>
          )}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
    </TouchableOpacity>
  );
};

const sortOptions = [
  { key: "popular", label: "Padrão (popular)" },
  { key: "rating", label: "Melhor avaliação" },
  { key: "price_low", label: "Preço: $ → $$$$" },
  { key: "price_high", label: "Preço: $$$$ → $" },
  { key: "distance", label: "Distância" },
];

const HomeScreen = ({ navigation }) => {
  const [district, setDistrict] = useState("Pinheiros");

  const [catsLoading, setCatsLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const [mode, setMode] = useState("popular");
  const [sort, setSort] = useState("popular");
  const [sortModal, setSortModal] = useState(false);

  const [placesLoading, setPlacesLoading] = useState(true);
  const [places, setPlaces] = useState([]);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setCatsLoading(true);
        const { data } = await api.get("/category");
        if (!mounted) return;
        const cats = Array.isArray(data)
          ? data.slice(0, 12).map((c) => ({
              id: c.id,
              name: c.name,
              emoji: c.emoji ?? null,
              colorHex: c.colorHex ?? null,
              textColorHex: c.textColorHex ?? null,
            }))
          : [];
        setCategories(cats);
      } catch (e) {
      } finally {
        if (mounted) setCatsLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  const loadPlaces = useCallback(async () => {
    setPlacesLoading(true);
    setErr(null);
    try {
      const { data } = await api.get("/place", {
        params: {
          sort: sort,
          mode: mode === "nearby" ? "distance" : "popular",
          limit: 30,
        },
      });
      const arr = Array.isArray(data)
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

      if (sort === "rating") arr.sort((a, b) => b.avgRating - a.avgRating);
      if (sort === "price_low")
        arr.sort((a, b) =>
          (a.priceLevel || "").localeCompare(b.priceLevel || "")
        );
      if (sort === "price_high")
        arr.sort((a, b) =>
          (b.priceLevel || "").localeCompare(a.priceLevel || "")
        );

      setPlaces(arr);
    } catch (e) {
      setErr("Não foi possível carregar os lugares.");
    } finally {
      setPlacesLoading(false);
    }
  }, [mode, sort]);

  useEffect(() => {
    if (mode === "nearby" && sort === "popular") setSort("distance");
    loadPlaces();
  }, [mode, sort, loadPlaces]);

  const openSearch = () => navigation.navigate("Search");
  const openFilters = () => navigation.navigate("Filters", { origin: "home" });

  const Header = useMemo(
    () => (
      <View>
        <View style={styles.logoRow}>
          <Text style={styles.logo}>noma</Text>
        </View>

        <View style={styles.locationRow}>
          <TouchableOpacity style={styles.locChip} activeOpacity={0.9}>
            <Ionicons
              name="location-outline"
              size={14}
              color={colors.primary}
            />
            <Text style={styles.locText} numberOfLines={1}>
              {district}
            </Text>
            <Ionicons
              name="chevron-down"
              size={14}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={openSearch}
          activeOpacity={0.9}
          style={styles.searchBar}
        >
          <Ionicons
            name="search"
            size={18}
            color={colors.textSecondary}
            style={{ marginRight: 8 }}
          />
          <Text style={styles.searchPlaceholder}>Onde vamos hoje?</Text>
        </TouchableOpacity>

        <View style={styles.sectionSpacing}>
          {catsLoading ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.catsRow}
            >
              {categories.map((c) => (
                <CategoryChip
                  key={c.id}
                  item={c}
                  onPress={() =>
                    navigation.navigate("Category", {
                      categoryId: c.id,
                      categoryName: c.name,
                    })
                  }
                />
              ))}
              <TouchableOpacity
                style={styles.catChipGhost}
                onPress={() => navigation.navigate("ExploreHome")}
              >
                <Text style={styles.catChipGhostText}>Ver todas</Text>
                <Ionicons
                  name="chevron-forward"
                  size={14}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>

        <View style={styles.controlsRow}>
          <View style={styles.modeRow}>
            <TouchableOpacity
              style={[
                styles.modeChip,
                mode === "popular" && styles.modeChipActive,
              ]}
              onPress={() => setMode("popular")}
            >
              <Text
                style={[
                  styles.modeText,
                  mode === "popular" && styles.modeTextActive,
                ]}
              >
                Populares
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modeChip,
                mode === "nearby" && styles.modeChipActive,
              ]}
              onPress={() => setMode("nearby")}
            >
              <Text
                style={[
                  styles.modeText,
                  mode === "nearby" && styles.modeTextActive,
                ]}
              >
                Perto
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.smallBtn}
              onPress={() => setSortModal(true)}
            >
              <Ionicons
                name="swap-vertical"
                size={16}
                color={colors.textPrimary}
              />
              <Text style={styles.smallBtnText}>Ordenar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.smallBtn} onPress={openFilters}>
              <Ionicons name="options" size={16} color={colors.textPrimary} />
              <Text style={styles.smallBtnText}>Filtro</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    ),
    [catsLoading, categories, district, mode, navigation]
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={places}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={Header}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <PlaceCard
            item={item}
            onPress={() =>
              navigation.navigate("PlaceDetail", { placeId: item.id })
            }
          />
        )}
        ListEmptyComponent={
          placesLoading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : err ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{err}</Text>
              <TouchableOpacity onPress={loadPlaces}>
                <Text style={styles.retryText}>Tentar novamente</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>Nada por aqui ainda.</Text>
            </View>
          )
        }
        onRefresh={loadPlaces}
        refreshing={placesLoading}
      />

      <Modal
        visible={sortModal}
        transparent
        animationType="fade"
        onRequestClose={() => setSortModal(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setSortModal(false)}
        >
          <View />
        </Pressable>
        <View style={styles.modalSheet}>
          <Text style={styles.modalTitle}>Ordenar por</Text>
          {sortOptions.map((opt) => (
            <TouchableOpacity
              key={opt.key}
              style={styles.modalItem}
              onPress={() => {
                setSort(opt.key);
                setSortModal(false);
              }}
            >
              <Text
                style={[
                  styles.modalItemText,
                  sort === opt.key && styles.modalItemActive,
                ]}
              >
                {opt.label}
              </Text>
              {sort === opt.key && (
                <Ionicons name="checkmark" size={18} color={colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;
