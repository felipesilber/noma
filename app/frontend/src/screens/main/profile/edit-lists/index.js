import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, FlatList, Image, ActivityIndicator, Alert, StyleSheet, Platform, } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../../theme/colors";
import api from "../../../../services/api";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { showErrorNotification } from "../../../../utils/notifications";
const ListItemCard = ({ item, onEdit, onRemove }) => {
    const placeCount = item._count?.items || 0;
    return (<View style={styles.cardContainer}>
      <TouchableOpacity style={styles.cardInfo} onPress={onEdit}>
        <Image source={{ uri: item.imageUrl }} style={styles.cardImage}/>
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardAddress}>
            {placeCount} {placeCount === 1 ? "lugar" : "lugares"}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
        <Ionicons name="trash-outline" size={24} color={colors.error}/>
      </TouchableOpacity>
    </View>);
};
const EditListsScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [lists, setLists] = useState([]);
    const isFocused = useIsFocused();
    const fetchLists = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get("/lists");
            setLists(response.data);
        }
        catch (err) {
            showErrorNotification("Erro", "Não foi possível carregar suas listas.", { position: "bottom" });
        }
        finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        if (isFocused) {
            fetchLists();
        }
    }, [isFocused, fetchLists]);
    const handleRemove = async (listId) => {
        Alert.alert("Remover Lista", "Tem certeza que deseja remover esta lista? Esta ação não pode ser desfeita.", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Remover",
                style: "destructive",
                onPress: async () => {
                    try {
                        setLists((prev) => prev.filter((item) => item.id !== listId));
                        await api.delete(`/lists/${listId}`);
                    }
                    catch (err) {
                        showErrorNotification("Erro", "Não foi possível remover a lista.", { position: "bottom" });
                        fetchLists();
                    }
                },
            },
        ]);
    };
    const handleEdit = (list) => {
        navigation.navigate("CreateListFlow", {
            screen: "CreateListForm",
            params: { listToEdit: list },
        });
    };
    return (<View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Ionicons name="close-outline" size={28} color={colors.textPrimary}/>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Listas</Text>
        <TouchableOpacity onPress={() => navigation.navigate("CreateListFlow")} style={styles.headerButton}>
          <Ionicons name="add-outline" size={28} color={colors.textPrimary}/>
        </TouchableOpacity>
      </View>

      {loading ? (<ActivityIndicator style={{ marginTop: 20 }} size="large" color={colors.primary}/>) : (<FlatList data={lists} keyExtractor={(item) => String(item.id)} renderItem={({ item }) => (<ListItemCard item={item} onRemove={() => handleRemove(item.id)} onEdit={() => handleEdit(item)}/>)} ListEmptyComponent={() => (<View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Você ainda não criou nenhuma lista.
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
    cardImage: {
        width: 48,
        height: 48,
        borderRadius: 6,
        marginRight: 12,
        backgroundColor: colors.divider,
    },
    cardTextContainer: { flex: 1, marginRight: 12 },
    cardTitle: { fontSize: 16, fontWeight: "600", color: colors.textPrimary },
    cardAddress: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
    removeButton: { padding: 8 },
});
export default EditListsScreen;
