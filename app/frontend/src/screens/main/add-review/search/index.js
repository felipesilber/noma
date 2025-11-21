import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator, ScrollView, } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";
import colors from "../../../../theme/colors";
import api from "../../../../services/api";
import ErrorView from "../../../../components/ErrorView";
import BackButton from "../../../../components/BackButton";
import PlaceSearchResultCard from "../../../../components/place/PlaceSearchResultCard";
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
    return (<SafeAreaView style={styles.container}>
      <BackButton onPress={() => navigation.goBack()} style={styles.closeButton} />

      <View style={styles.searchBarContainer}>
        <Ionicons name="search" size={18} color={colors.textSecondary} style={styles.searchIcon}/>
        <TextInput style={styles.searchInput} placeholder="Busque por um estabelecimento..." placeholderTextColor={colors.textSecondary} value={searchText} onChangeText={setSearchText} autoFocus/>
      </View>

      <View style={styles.mainContent}>
        {loading ? (<ActivityIndicator color={colors.primary}/>) : erro ? (<ErrorView message={erro} onRetry={() => fetchPlaces(searchText)} />) : results.length > 0 ? (<ScrollView>
              {results.map((p) => (<PlaceSearchResultCard key={p.id} item={p} onPress={() => navigation.navigate("AddReviewForm", {
                    placeId: p.id,
                    placeName: p.name,
                    placeImage: p.image || p.imageUrl,
                })}/>))}
            </ScrollView>) : searchText.trim().length >= 2 ? (<Text style={styles.noResultsText}>
            Nenhum estabelecimento encontrado para “{searchText}”.
          </Text>) : (<Text style={styles.noResultsText}>
            Comece digitando (mínimo 2 caracteres)…
          </Text>)}
      </View>
    </SafeAreaView>);
};
export default AddReviewSearchScreen;
