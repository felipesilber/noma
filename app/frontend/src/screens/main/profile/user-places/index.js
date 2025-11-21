import React, { useEffect, useState, useCallback } from "react";
import { View, FlatList, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../../../../theme/colors";
import AppText from "../../../../components/text";
import api from "../../../../services/api";
import styles from "./styles";
import BackButton from "../../../../components/BackButton";
import ErrorView from "../../../../components/ErrorView";

const PlaceRow = ({ place, onPress }) => {
    return (<TouchableOpacity style={styles.row} onPress={onPress}>
      <Image source={{ uri: place.imageUrl || "https://via.placeholder.com/120x80" }} style={styles.thumb}/>
      <View style={styles.rowContent}>
        <AppText weight="bold" style={styles.title} numberOfLines={1}>{place.name}</AppText>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textSecondary}/>
    </TouchableOpacity>);
};
const UserPlacesScreen = ({ route, navigation }) => {
    const { userId, username, listType } = route.params || {};
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);
    const title = listType === "visited"
        ? `Visitados por ${username}`
        : `Wishlist de ${username}`;
    const endpoint = listType === "visited"
        ? `profile/${userId}/visited-places`
        : `profile/${userId}/wishlist`;
    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await api.get(endpoint);
            setData(res.data || []);
        }
        catch (e) {
            console.error("Erro ao carregar lugares:", e);
            setError("Não foi possível carregar os lugares.");
        }
        finally {
            setLoading(false);
        }
    }, [endpoint]);
    useEffect(() => {
        fetchData();
    }, [fetchData]);
    return (<SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.headerBar}>
        <BackButton onPress={() => navigation.goBack()} style={styles.headerBack} />
        <AppText weight="bold" style={styles.headerTitle}>{title}</AppText>
      </View>

      {loading ? (<View style={styles.centered}><ActivityIndicator color={colors.primary}/></View>) : error ? (<ErrorView message={error} onRetry={fetchData} />) : (<FlatList data={data} keyExtractor={(item) => String(item.id)} renderItem={({ item }) => (<PlaceRow place={item} onPress={() => navigation.navigate("PlaceDetail", { placeId: item.id })}/>)} contentContainerStyle={{ paddingVertical: 12 }}/>)} 
    </SafeAreaView>);
};
export default UserPlacesScreen;


