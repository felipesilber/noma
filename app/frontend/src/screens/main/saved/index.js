import React, { useState, useEffect, useCallback } from "react";
import { View, TouchableOpacity, FlatList, Image, ActivityIndicator, StyleSheet, Alert, } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";
import colors from "../../../theme/colors";
import api from "../../../services/api";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import AppText from "../../../components/text";
const SavedPlaceCard = ({ item, onPress, onRemove }) => (<View style={styles.cardContainer}>
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      <Image source={{
        uri: item.image ||
            "https://via.placeholder.com/200/D9D9D9/000000?text=Sem+Foto",
    }} style={styles.cardImage}/>
    </TouchableOpacity>

    <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
      <Ionicons name="bookmark" size={18} color="#fff"/>
    </TouchableOpacity>

    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      <AppText style={styles.cardName}>
        {item.name || "Nome Indisponível"}
      </AppText>
    </TouchableOpacity>
  </View>);
const SavedScreen = ({ navigation }) => {
    const tabBarHeight = useBottomTabBarHeight();
    const PADDING_BOTTOM = tabBarHeight + 25;
    const [savedPlaces, setSavedPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchSavedPlaces = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get("/saved-places");
            const mappedPlaces = response.data.map((place) => ({
                id: place.id,
                name: place.name,
                image: place.image,
            }));
            setSavedPlaces(mappedPlaces);
        }
        catch (err) {
            console.error("Erro ao buscar lugares salvos:", err);
            setError("Não foi possível carregar seus lugares salvos.");
        }
        finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            fetchSavedPlaces();
        });
        return unsubscribe;
    }, [navigation, fetchSavedPlaces]);
    const handleRemovePlace = async (placeId) => {
        try {
            setSavedPlaces((prevPlaces) => prevPlaces.filter((place) => place.id !== placeId));
            await api.delete(`/saved-places/${placeId}`);
        }
        catch (err) {
            console.error("Erro ao remover lugar salvo:", err);
            Alert.alert("Erro", "Não foi possível remover o item. Tente novamente.");
            fetchSavedPlaces();
        }
    };
    const renderContent = () => {
        if (loading) {
            return (<View style={styles.messageContainer}>
          <ActivityIndicator size="large" color={colors.primary}/>
        </View>);
        }
        if (error) {
            return (<View style={styles.messageContainer}>
          <AppText style={styles.messageText}>{error}</AppText>
          <TouchableOpacity onPress={fetchSavedPlaces} style={styles.retryButton}>
            <AppText weight="bold" style={styles.retryButtonText}>
              Tentar Novamente
            </AppText>
          </TouchableOpacity>
        </View>);
        }
        if (savedPlaces.length === 0) {
            return (<View style={styles.messageContainer}>
          <Ionicons name="bookmark-outline" size={60} color={colors.textSecondary}/>
          <AppText weight="bold" style={styles.messageText}>
            Você ainda não salvou nenhum lugar.
          </AppText>
          <AppText style={styles.messageSubtext}>
            Clique no ícone de salvar nos lugares que você gostar!
          </AppText>
        </View>);
        }
        return (<FlatList data={savedPlaces} renderItem={({ item }) => (<SavedPlaceCard item={item} onPress={() => navigation.navigate("PlaceDetail", { placeId: item.id })} onRemove={() => handleRemovePlace(item.id)}/>)} keyExtractor={(item) => String(item.id)} numColumns={2} showsVerticalScrollIndicator={false} contentContainerStyle={[
                styles.listContent,
                { paddingBottom: PADDING_BOTTOM },
            ]} columnWrapperStyle={{ justifyContent: "space-between" }} ListHeaderComponent={<AppText weight="bold" style={styles.listTitle}>
            Todos os salvos
          </AppText>}/>);
    };
    return (<View style={styles.container}>
      <View style={styles.header}>
        <AppText weight="bold" style={styles.headerTitle}>
          Salvos
        </AppText>
        <TouchableOpacity style={styles.headerRightIcon}>
          <Ionicons name="filter" size={24} color={"#fff"}/>
        </TouchableOpacity>
      </View>
      {renderContent()}
    </View>);
};
export default SavedScreen;
