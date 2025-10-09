import React, { useEffect, useRef, useState } from "react";
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
import styles from "./styles";
import colors from "../../../../theme/colors";
import api from "../../../../services/api";

const ResultCard = ({ item, onPress }) => (
  <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onPress}>
    <Image
      source={{ uri: item.image || "https://picsum.photos/seed/noma/300/200" }}
      style={styles.cardImage}
    />
    <Text numberOfLines={1} style={styles.cardTitle}>
      {item.name}
    </Text>
    {typeof item.avgRating === "number" && (
      <View style={styles.ratingRow}>
        <Ionicons name="star" size={12} color={colors.primary} />
        <Text style={styles.ratingText}>{item.avgRating.toFixed(1)}</Text>
      </View>
    )}
  </TouchableOpacity>
);

const SearchScreen = ({ route, navigation }) => {
  const initialQ = route.params?.q ?? "";
  const [q, setQ] = useState(initialQ);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [results, setResults] = useState([]);

  const debRef = useRef(null);

  useEffect(() => {
    navigation.setOptions({
      title: "Buscar",
      headerShadowVisible: false,
    });
  }, [navigation]);

  useEffect(() => {
    if (debRef.current) clearTimeout(debRef.current);

    const term = q.trim();
    if (term.length < 2) {
      setResults([]);
      setErr(null);
      return;
    }

    debRef.current = setTimeout(() => {
      fetchResults(term);
    }, 300);

    return () => clearTimeout(debRef.current);
  }, [q]);

  async function fetchResults(term) {
    try {
      setErr(null);
      setLoading(true);
      const { data } = await api.get("/place/search-filter", {
        params: { q: term, limit: 30 },
      });
      const payload = Array.isArray(data) ? data : data?.data || [];
      setResults(payload);
    } catch (e) {
      setErr("Não foi possível buscar estabelecimentos.");
    } finally {
      setLoading(false);
    }
  }

  const onSubmit = () => {
    const term = q.trim();
    if (term.length >= 2) {
      Keyboard.dismiss();
      fetchResults(term);
    }
  };

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
            value={q}
            onChangeText={setQ}
            returnKeyType="search"
            onSubmitEditing={onSubmit}
            autoFocus={true}
          />
          {!!q && (
            <TouchableOpacity onPress={() => setQ("")}>
              <Ionicons
                name="close-circle"
                size={18}
                color={colors.textMuted}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : err ? (
        <View style={styles.centerBox}>
          <Text style={styles.errorText}>{err}</Text>
        </View>
      ) : q.trim().length < 2 ? (
        <View style={styles.centerBox}>
          <Text style={styles.hintText}>Digite pelo menos 2 caracteres…</Text>
        </View>
      ) : results.length === 0 ? (
        <View style={styles.centerBox}>
          <Text style={styles.hintText}>
            Nenhum estabelecimento encontrado.
          </Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(it) => String(it.id)}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.gridContent}
          renderItem={({ item }) => (
            <ResultCard
              item={item}
              onPress={() =>
                navigation.navigate("PlaceDetail", { placeId: item.id })
              }
            />
          )}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View style={{ height: 24 }} />}
        />
      )}
    </View>
  );
};

export default SearchScreen;
