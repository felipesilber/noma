import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList, Image, SafeAreaView, TextInput, } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";
import colors from "../../../../../theme/colors.js";
import api from "../../../../../services/api";
import ErrorView from "../../../../../components/ErrorView";
const tabs = [
    { key: "popular", label: "Populares" },
    { key: "nearby", label: "Perto" },
    { key: "friends", label: "Amigos" },
];
const tabLabelMap = { popular: "Populares", nearby: "Perto", friends: "Amigos" };
const PlaceCard = ({ item, onPress }) => {
    const distance = Number(item.distanceInKm ?? 0);
    const distanceStr = isNaN(distance) ? "0.0" : distance.toFixed(1);
    const rating = typeof item.avgRating === "number"
        ? item.avgRating.toFixed(1)
        : String(item.avgRating ?? "-");
    return (<TouchableOpacity style={styles.placeCard} activeOpacity={0.8} onPress={onPress}>
      <View style={styles.placeInfo}>
        <Text style={styles.placeTitle}>{item.name}</Text>
        <View style={styles.ratingRow}>
          <Text style={styles.placeDetails}>{rating}</Text>
          <Ionicons name="star" size={14} color={colors.textSecondary} style={styles.starIcon}/>
          <Text style={styles.placeDetails}>
            {`∙ ${distanceStr} km${item.priceRange ? ` • ${item.priceRange}` : ""}`}
          </Text>
        </View>
      </View>
      <Image source={{ uri: item.imageUrl }} style={styles.placeImage}/>
    </TouchableOpacity>);
};
const CategoryScreen = ({ route, navigation }) => {
    const { categoryName = "Hamburguerias", categoryId } = route.params;
    const [activeTab, setActiveTab] = useState("popular");
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: categoryName,
            headerTitleAlign: "center",
            headerLeft: () => (<TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 16 }}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary}/>
        </TouchableOpacity>),
            headerRight: () => (<TouchableOpacity onPress={() => { }} style={{ marginRight: 16 }}>
          <Ionicons name="filter" size={24} color={colors.textPrimary}/>
        </TouchableOpacity>),
            headerStyle: {
                backgroundColor: colors.background,
                elevation: 0,
                shadowOpacity: 0,
            },
        });
    }, [navigation, categoryName]);
    const fetchPlaces = useCallback(async (tabKey) => {
        if (!refreshing) {
            setLoading(true);
        }
        setError(null);
        try {
            let resp;
            const baseParams = categoryId
                ? { categoryId }
                : { category: categoryName };
            if (tabKey === "friends") {
                resp = await api.get("/places/by-category/friends", {
                    params: { ...baseParams, limit: 30 },
                });
            }
            else {
                console.log({ ...baseParams, sort: tabKey, limit: 30 });
                resp = await api.get("/places", {
                    params: { ...baseParams, sort: tabKey, limit: 30 },
                });
            }
            const normalized = (resp.data?.data || resp.data || []).map((p) => ({
                id: p.id,
                name: p.name,
                imageUrl: p.imageUrl,
                avgRating: p.avgRating ?? 0,
                distanceInKm: p.distanceInKm ?? 0,
                priceRange: p.priceRange ?? null,
            }));
            setPlaces(normalized);
        }
        catch (e) {
            setError("Não foi possível carregar os lugares.");
        }
        finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [refreshing]);
    useEffect(() => {
        fetchPlaces(activeTab);
    }, [activeTab, fetchPlaces]);
    const renderContent = () => {
        if (loading) {
            return (<ActivityIndicator style={{ marginTop: 40 }} size="large" color={colors.primary}/>);
        }
        if (error) {
            return <ErrorView message={error} onRetry={() => fetchPlaces(activeTab)} />;
        }
        return (<FlatList data={places} keyExtractor={(item) => String(item.id)} renderItem={({ item }) => (<PlaceCard item={item} onPress={() => navigation.navigate("PlaceDetail", { placeId: item.id })}/>)} refreshing={refreshing} onRefresh={() => {
                setRefreshing(true);
                fetchPlaces(activeTab);
            }} ListHeaderComponent={<Text style={styles.listTitle}>
            {tabLabelMap[activeTab] || "Resultados"}
          </Text>} contentContainerStyle={styles.listContent}/>);
    };
    return (<SafeAreaView style={styles.container}>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.textSecondary}/>
        <TextInput placeholder="Buscar restaurante" placeholderTextColor={colors.textSecondary} style={styles.searchInput}/>
      </View>

      
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (<TouchableOpacity key={tab.key} onPress={() => setActiveTab(tab.key)} style={styles.tab}>
              <Text style={[
                    styles.tabText,
                    isActive ? styles.activeTabText : styles.inactiveTabText,
                ]}>
                {tab.label}
              </Text>
              {isActive && <View style={styles.activeTabIndicator}/>}
            </TouchableOpacity>);
        })}
      </View>

      {renderContent()}
    </SafeAreaView>);
};
export default CategoryScreen;
