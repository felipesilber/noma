import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, FlatList, Image, } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";
import colors from "../../../../../theme/colors";
import api from "../../../../../services/api";
const PlaceResultCard = ({ item, onPress }) => (<TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onPress}>
    <Image source={{ uri: item.image }} style={styles.cardImage}/>
    <View style={styles.cardInfo}>
      <Text numberOfLines={1} style={styles.cardTitle}>
        {item.name}
      </Text>
      <Text numberOfLines={1} style={styles.cardAddress}>
        {item.address}
      </Text>
    </View>
  </TouchableOpacity>);
const AddPlaceToListScreen = ({ navigation }) => {
    const [q, setQ] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(null);
    const [results, setResults] = useState([]);
    const debRef = useRef(null);
    useEffect(() => {
        if (debRef.current)
            clearTimeout(debRef.current);
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
        }
        catch (e) {
            setErr("Não foi possível buscar.");
        }
        finally {
            setLoading(false);
        }
    };
    const handleSelectPlace = (place) => {
        navigation.navigate("CreateListForm", { newPlace: place });
    };
    return (<View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary}/>
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={colors.textSecondary} style={styles.searchIcon}/>
          <TextInput style={styles.searchInput} placeholder="Buscar restaurantes..." placeholderTextColor={colors.textSecondary} value={q} onChangeText={setQ} returnKeyType="search" autoFocus={true}/>
          {!!q && (<TouchableOpacity onPress={() => setQ("")}>
              <Ionicons name="close-circle" size={18} color={colors.textSecondary}/>
            </TouchableOpacity>)}
        </View>
      </View>

      {loading ? (<View style={styles.centerBox}>
          <ActivityIndicator color={colors.primary}/>
        </View>) : err ? (<View style={styles.centerBox}>
          <Text style={styles.hintText}>{err}</Text>
        </View>) : q.trim().length < 2 ? (<View style={styles.centerBox}>
          <Text style={styles.hintText}>Digite pelo menos 2 caracteres…</Text>
        </View>) : results.length === 0 ? (<View style={styles.centerBox}>
          <Text style={styles.hintText}>Nenhum lugar encontrado.</Text>
        </View>) : (<FlatList data={results} keyExtractor={(it) => String(it.id)} contentContainerStyle={styles.listContent} renderItem={({ item }) => (<PlaceResultCard item={item} onPress={() => handleSelectPlace(item)}/>)}/>)}
    </View>);
};
export default AddPlaceToListScreen;
