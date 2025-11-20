import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, FlatList, Image, ActivityIndicator, Alert, StyleSheet, Platform, } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../../theme/colors";
import api from "../../../../services/api";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { showErrorNotification } from "../../../../utils/notifications";
const FavoriteItemCard = ({ item, onRemove }) => {
    const navigation = useNavigation();
    const place = item.place;
    return (<View style={styles.cardContainer}>
      <TouchableOpacity style={styles.cardInfo} onPress={() => navigation.navigate("PlaceDetail", { placeId: item.id })}>
        <Image source={{ uri: item.imageUrl }} style={styles.cardImage}/>
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardAddress} numberOfLines={1}>
            {item.address}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
        <Ionicons name="trash-outline" size={24} color={colors.error}/>
      </TouchableOpacity>
    </View>);
};
const EditFavoritesScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState([]);
    const isFocused = useIsFocused();
    const fetchFavorites = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get("/favorite-places");
            setFavorites(response.data);
        }
        catch (err) {
            showErrorNotification("Erro", "Não foi possível carregar seus favoritos.", { position: "bottom" });
        }
        finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        if (isFocused) {
            fetchFavorites();
        }
    }, [isFocused, fetchFavorites]);
    const handleRemove = async (placeId) => {
        try {
            setFavorites((prev) => prev.filter((item) => item.id !== placeId));
            await api.delete(`/favorite-places/${placeId}`);
        }
        catch (err) {
            showErrorNotification("Erro", "Não foi possível remover o favorito.", { position: "bottom" });
            fetchFavorites();
        }
    };
    return (<View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Ionicons name="close-outline" size={28} color={colors.textPrimary}/>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Favoritos</Text>
        <TouchableOpacity onPress={() => navigation.navigate("AddFavoriteFlow")} style={styles.headerButton}>
          <Ionicons name="add-outline" size={28} color={colors.textPrimary}/>
        </TouchableOpacity>
      </View>

      {loading ? (<ActivityIndicator style={{ marginTop: 20 }} size="large" color={colors.primary}/>) : (<FlatList data={favorites} keyExtractor={(item) => String(item.id)} renderItem={({ item }) => (<FavoriteItemCard item={item} onRemove={() => handleRemove(item.id)}/>)} ListEmptyComponent={() => (<View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Você ainda não adicionou favoritos.
              </Text>
            </View>)} contentContainerStyle={{ padding: 16 }}/>)}
    </View>);
};
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: Platform.OS === "ios" ? 50 : 20,
        paddingBottom: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.divider,
    },
    headerTitle: { fontSize: 18, fontWeight: "600", color: colors.textPrimary },
    headerButton: { padding: 4 },
    emptyContainer: { alignItems: "center", marginTop: 40 },
    emptyText: { fontSize: 16, color: colors.textSecondary },
    cardContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.surface,
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    cardInfo: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    cardImage: { width: 48, height: 48, borderRadius: 6, marginRight: 12 },
    cardTextContainer: { flex: 1, marginRight: 12 },
    cardTitle: { fontSize: 16, fontWeight: "600", color: colors.textPrimary },
    cardAddress: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
    removeButton: { padding: 8 },
});
export default EditFavoritesScreen;
