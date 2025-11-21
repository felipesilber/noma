import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, SafeAreaView, ActivityIndicator, } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";
import colors from "../../../../theme/colors";
import api from "../../../../services/api";
import ErrorView from "../../../../components/ErrorView";
import BackButton from "../../../../components/BackButton";
const AddReviewSearchScreen = ({ navigation }) => {
    const [searchText, setSearchText] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState(null);
    const debounceRef = useRef(null);
    useEffect(() => {
        if (debounceRef.current)
            clearTimeout(debounceRef.current);
        const q = searchText?.trim() || "";
        if (q.length < 2) {
            setResults([]);
            setErro(null);
            return;
        }
        debounceRef.current = setTimeout(() => {
            fetchPlaces(q);
        }, 300);
        return () => clearTimeout(debounceRef.current);
    }, [searchText]);
    async function fetchPlaces(q) {
        try {
            setLoading(true);
            setErro(null);
            const response = await api.get("places/search", {
                params: { q, limit: 10 },
            });
            const result = response.data;
            setResults(Array.isArray(result) ? result : []);
        }
        catch (e) {
            setErro("Não foi possível buscar os estabelecimentos.");
        }
        finally {
            setLoading(false);
        }
    }
    const SearchResultCard = ({ item }) => (<TouchableOpacity style={styles.searchResultCard} onPress={() => navigation.navigate("AddReviewForm", {
            placeId: item.id,
            placeName: item.name,
            placeImage: item.imageUrl,
        })} activeOpacity={0.85}>
      <Image source={{
            uri: item.imageUrl ||
                "https://via.placeholder.com/100/D9D9D9/000000?text=Foto",
        }} style={styles.searchResultImage}/>
      <View style={styles.searchResultInfo}>
        <Text style={styles.searchResultName}>{item.name}</Text>
        {!!item.address && (<Text style={styles.searchResultAddress}>{item.address}</Text>)}
      </View>
    </TouchableOpacity>);
    return (<SafeAreaView style={styles.container}>
      <BackButton onPress={() => navigation.goBack()} style={styles.closeButton} />

      <View style={styles.searchBarContainer}>
        <Ionicons name="search" size={18} color={colors.textSecondary} style={styles.searchIcon}/>
        <TextInput style={styles.searchInput} placeholder="Busque por um estabelecimento..." placeholderTextColor={colors.textSecondary} value={searchText} onChangeText={setSearchText} autoFocus/>
      </View>

      <View style={styles.mainContent}>
        {loading ? (<ActivityIndicator color={colors.primary}/>) : erro ? (<ErrorView message={erro} onRetry={() => fetchPlaces(searchText)} />) : results.length > 0 ? (results.map((p) => <SearchResultCard key={p.id} item={p}/>)) : searchText.trim().length >= 2 ? (<Text style={styles.noResultsText}>
            Nenhum estabelecimento encontrado para “{searchText}”.
          </Text>) : (<Text style={styles.noResultsText}>
            Comece digitando (mínimo 2 caracteres)…
          </Text>)}
      </View>
    </SafeAreaView>);
};
export default AddReviewSearchScreen;
