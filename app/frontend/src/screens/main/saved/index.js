import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";
import colors from "../../../theme/colors";
import api from "../../../services/api";

const SavedScreen = ({ navigation }) => {
  const [savedPlaces, setSavedPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSavedPlaces = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/saved-places");
      setSavedPlaces(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(
        "Erro ao buscar lugares salvos:",
        err?.response?.data || err?.message
      );
      setError(
        "Não foi possível carregar os lugares salvos. Verifique sua conexão ou tente novamente."
      );
      Alert.alert("Erro", "Não foi possível carregar os lugares salvos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsub = navigation.addListener("focus", fetchSavedPlaces);
    return unsub;
  }, [navigation, fetchSavedPlaces]);

  const handleRemovePlace = async (placeId) => {
    try {
      setSavedPlaces((curr) => curr.filter((p) => p.id !== placeId));
      await api.delete(`/saved-places/${placeId}`);
    } catch (err) {
      console.error(
        "Erro ao remover lugar:",
        err?.response?.data || err?.message
      );
      Alert.alert("Erro", "Não foi possível remover o lugar.");
      fetchSavedPlaces();
    }
  };

  const renderSavedPlaceItem = ({ item }) => (
    <TouchableOpacity
      style={styles.placeCard}
      activeOpacity={0.85}
      onPress={() => navigation.navigate("PlaceDetail", { placeId: item.id })}
    >
      <Image
        source={{
          uri:
            item.image ||
            "https://via.placeholder.com/150/D9D9D9/000000?text=Sem+Foto",
        }}
        style={styles.placeImage}
      />
      <View style={styles.placeInfo}>
        <Text style={styles.placeName}>{item.name || "Nome Indisponível"}</Text>
        <Text style={styles.placeAddress}>
          {item.address || "Endereço Indisponível"}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => handleRemovePlace(item.id)}
        style={styles.removeButton}
      >
        <Ionicons name="bookmark" size={22} color={colors.primary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meus Salvos</Text>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Carregando lugares...</Text>
        </View>
      )}

      {error && !loading && (
        <View style={styles.errorContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={46}
            color={colors.error}
          />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetchSavedPlaces} activeOpacity={0.85}>
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading && !error && savedPlaces.length > 0 ? (
        <FlatList
          data={savedPlaces}
          renderItem={renderSavedPlaceItem}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        !loading &&
        !error && (
          <View style={styles.emptyStateContainer}>
            <Ionicons
              name="bookmark-outline"
              size={80}
              color={colors.textSecondary}
            />
            <Text style={styles.emptyStateText}>Nenhum lugar salvo ainda.</Text>
            <Text style={styles.emptyStateSubText}>
              Comece a explorar e adicione seus lugares favoritos!
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("ExploreTab")}
              activeOpacity={0.85}
            >
              <Text style={styles.exploreButtonText}>Explorar Agora</Text>
            </TouchableOpacity>
          </View>
        )
      )}
    </View>
  );
};

export default SavedScreen;
