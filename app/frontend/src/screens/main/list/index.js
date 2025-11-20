import React, { useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, RefreshControl, } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import styles from "./styles";
import colors from "../../../theme/colors";
import moment from "moment";
import "moment/locale/pt-br";
import api from "../../../services/api";
const PlaceItem = ({ item, index, isRanking, onPress }) => {
    const place = item.place;
    const rating = 4.5;
    const distance = 0.8;
    return (<TouchableOpacity style={styles.placeItemContainer} onPress={onPress}>
      {isRanking && (<View style={styles.placeRankBadge}>
          <Text style={styles.placeRankText}>{index + 1}</Text>
        </View>)}
      <Image source={{ uri: place.imageUrl }} style={styles.placeItemImage}/>
      <View style={styles.placeItemInfo}>
        <Text style={styles.placeItemName}>{place.name}</Text>
        <Text style={styles.placeItemDetails}>{`${rating.toFixed(1)} · ${distance.toFixed(1)} km`}</Text>
      </View>
    </TouchableOpacity>);
};
const ListDetailScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { listId, listName } = route.params || {};
    const [listData, setListData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const fetchListDetails = useCallback(async () => {
        if (!listId) {
            setError("ID da lista não fornecido.");
            setLoading(false);
            return;
        }
        try {
            if (!refreshing) {
                setLoading(true);
            }
            setError(null);
            const response = await api.get(`/lists/${listId}`);
            setListData(response.data);
        }
        catch (e) {
            console.error("Erro ao buscar detalhes da lista:", e);
            setError("Não foi possível carregar os detalhes da lista.");
        }
        finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [listId, refreshing]);
    useEffect(() => {
        navigation.setOptions({ title: listName || "Lista" });
        fetchListDetails();
    }, [listId, listName, fetchListDetails]);
    if (loading) {
        return (<View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary}/>
      </View>);
    }
    if (error || !listData) {
        return (<View style={styles.loadingContainer}>
        <Text style={{ color: colors.textSecondary }}>
          {error || "Lista não encontrada."}
        </Text>
      </View>);
    }
    const updatedAt = moment(listData.updatedAt).locale("pt-br").fromNow();
    const placeCount = listData.items?.length || 0;
    return (<ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => {
                setRefreshing(true);
                fetchListDetails();
            }} tintColor={colors.textSecondary}/> }>
      <View style={styles.headerContainer}>
        <Image source={{ uri: listData.imageUrl }} style={styles.listImage}/>
        <Text style={styles.listName}>{listData.name}</Text>
        <Text style={styles.listMetadata}>{`${placeCount} lugares · Criada por ${listData.creatorName || "você"}`}</Text>
        <Text style={styles.listMetadata}>{`Atualizada ${updatedAt}`}</Text>
      </View>

      <Text style={styles.sectionTitle}>Lugares</Text>
      <View style={styles.placesListContainer}>
        {listData.items.map((item, index) => (<PlaceItem key={item.placeId} item={item} index={index} isRanking={listData.isRanking} onPress={() => navigation.navigate("PlaceDetail", { placeId: item.placeId })}/>))}
      </View>
    </ScrollView>);
};
export default ListDetailScreen;
