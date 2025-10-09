import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles, { CARD_W } from "./styles";
import colors from "../../../theme/colors";
import api from "../../../services/api";

const CategoryCard = ({ item, onPress }) => {
  const bg = item.colorHex || colors.surface;
  const fg = item.textColorHex;

  return (
    <TouchableOpacity
      style={[
        styles.catCard,
        { backgroundColor: bg, borderColor: "transparent", width: CARD_W },
      ]}
      activeOpacity={0.9}
      onPress={onPress}
    >
      {item.emoji ? (
        <Text style={[styles.catEmoji, { color: fg }]}>{item.emoji}</Text>
      ) : item.image ? (
        <Image source={{ uri: item.image }} style={styles.catImage} />
      ) : (
        <Text style={[styles.catEmoji, { color: fg }]}>🍽️</Text>
      )}
      <Text numberOfLines={1} style={[styles.catLabel, { color: fg }]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
};

const ExploreScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");
  const [loadingCats, setLoadingCats] = useState(true);
  const [catsError, setCatsError] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setCatsError(null);
        setLoadingCats(true);
        const { data } = await api.get("/category");
        if (!mounted) return;

        const cats = Array.isArray(data)
          ? data.map((c) => ({
              id: c.id,
              name: c.name,
              image: c.imageUrl ?? null,
              emoji: c.emoji ?? null,
              colorHex: c.colorHex ?? null,
              textColorHex: c.textColorHex ?? null,
            }))
          : [];
        setCategories(cats);
      } catch (e) {
        if (!mounted) return;
        setCatsError("Não foi possível carregar as categorias.");
      } finally {
        if (mounted) setLoadingCats(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const goToSearch = () => {
    const q = searchText.trim();
    Keyboard.dismiss();
    navigation.navigate("Search", q ? { q } : undefined);
  };

  const dataForGrid = useMemo(() => categories.slice(0, 18), [categories]);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={18}
            color={colors.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar restaurantes, bares, etc."
            placeholderTextColor={colors.textSecondary}
            value={searchText}
            onChangeText={setSearchText}
            returnKeyType="search"
            onSubmitEditing={goToSearch}
            onFocus={() => navigation.navigate("Search")}
          />
        </View>
      </View>

      <View style={styles.gridContainer}>
        {loadingCats ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : catsError ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{catsError}</Text>
            <TouchableOpacity
              onPress={() => {
                setCatsError(null);
                setLoadingCats(true);
                (async () => {
                  try {
                    const { data } = await api.get("/category");
                    const cats = Array.isArray(data)
                      ? data.map((c) => ({
                          id: c.id,
                          name: c.name,
                          image: c.imageUrl ?? null,
                          emoji: c.emoji ?? null,
                          colorHex: c.colorHex ?? null,
                          textColorHex: c.textColorHex ?? null,
                        }))
                      : [];
                    setCategories(cats);
                  } catch {
                    setCatsError("Não foi possível carregar as categorias.");
                  } finally {
                    setLoadingCats(false);
                  }
                })();
              }}
            >
              <Text style={styles.retryText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={dataForGrid}
            keyExtractor={(item) => String(item.id)}
            numColumns={2}
            columnWrapperStyle={styles.gridRow}
            contentContainerStyle={styles.gridContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <CategoryCard
                item={item}
                onPress={() =>
                  navigation.navigate("Category", {
                    categoryId: item.id,
                    categoryName: item.name,
                  })
                }
              />
            )}
            ListFooterComponent={<View style={{ height: 24 }} />}
          />
        )}
      </View>
    </View>
  );
};

export default ExploreScreen;
