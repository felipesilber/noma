import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";
import colors from "../../../../theme/colors";
import api from "../../../../services/api";
import PlaceSearchResultCard from "../../../../components/place/PlaceSearchResultCard";

const ExploreSearchScreen = ({ navigation }) => {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [results, setResults] = useState([]);
  const debRef = useRef(null);

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

  const fetchResults = async (term) => {
    try {
      setErr(null);
      setLoading(true);
      const { data } = await api.get("/places/search", {
        params: { q: term, limit: 20 },
      });
      setResults(data);
    } catch (e) {
      setErr("Não foi possível buscar.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlace = (place) => {
    navigation.navigate("PlaceDetail", { placeId: place.id });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={18}
            color={colors.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar restaurante..."
            placeholderTextColor={colors.textSecondary}
            value={q}
            onChangeText={setQ}
            returnKeyType="search"
            autoFocus={true}
          />
          {!!q && (
            <TouchableOpacity onPress={() => setQ("")}>
              <Ionicons
                name="close-circle"
                size={18}
                color={colors.textSecondary}
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
          <Text style={styles.hintText}>{err}</Text>
        </View>
      ) : q.trim().length < 2 ? (
        <View style={styles.centerBox}>
          <Text style={styles.hintText}>Digite pelo menos 2 caracteres…</Text>
        </View>
      ) : results.length === 0 ? (
        <View style={styles.centerBox}>
          <Text style={styles.hintText}>Nenhum lugar encontrado.</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(it) => String(it.id)}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <PlaceSearchResultCard
              item={item}
              onPress={() => handleSelectPlace(item)}
            />
          )}
        />
      )}
    </View>
  );
};

export default ExploreSearchScreen;
