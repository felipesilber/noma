import React, { useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, FlatList, Image, Keyboard, } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";
import colors from "../../../../../theme/colors";
import api from "../../../../../services/api";
const CategoryCard = ({ item, onPress }) => {
    return (<TouchableOpacity style={styles.categoryCardContainer} activeOpacity={0.9} onPress={onPress}>
      <Image source={{ uri: item.image }} style={styles.categoryCardImage}/>
      <Text numberOfLines={1} style={styles.categoryCardLabel}>
        {item.name}
      </Text>
    </TouchableOpacity>);
};
const ExploreScreen = ({ navigation }) => {
    const [searchText, setSearchText] = useState("");
    const [loadingCats, setLoadingCats] = useState(true);
    const [catsError, setCatsError] = useState(null);
    const [categories, setCategories] = useState([]);
    const fetchCategories = async () => {
        try {
            setLoadingCats(true);
            setCatsError(null);
            const response = await api.get("/category");
            const mappedCategories = response.data.map((category) => ({
                id: category.id,
                name: category.name,
                image: category.imageUrl,
            }));
            setCategories(mappedCategories);
        }
        catch (err) {
            console.error("Erro ao buscar categorias:", err);
            setCatsError("Não foi possível carregar as categorias.");
        }
        finally {
            setLoadingCats(false);
        }
    };
    useEffect(() => {
        fetchCategories();
    }, []);
    const goToSearch = () => {
        const q = searchText.trim();
        Keyboard.dismiss();
    };
    return (<View style={styles.container}>
      

      
      <View style={styles.searchBarWrapper}>
        <Ionicons name="search" size={18} color={colors.textSecondary} style={styles.searchIcon}/>
        <TextInput style={styles.searchInput} placeholder="Restaurante ou prato" placeholderTextColor={colors.textSecondary} value={searchText} onChangeText={setSearchText} returnKeyType="search" onSubmitEditing={goToSearch}/>
      </View>

      
      <Text style={styles.exploreCategoriesTitle}>Explorar por categoria</Text>

      <View style={styles.gridContainer}>
        {loadingCats ? (<View style={styles.loadingBox}>
            <ActivityIndicator color={colors.primary}/>
          </View>) : catsError ? (<View style={styles.errorBox}>
            <Text style={styles.errorText}>{catsError}</Text>
            <TouchableOpacity onPress={fetchCategories}>
              <Text style={styles.retryText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>) : (<FlatList data={categories} keyExtractor={(item) => String(item.id)} numColumns={2} columnWrapperStyle={styles.gridRow} contentContainerStyle={styles.gridContent} showsVerticalScrollIndicator={false} renderItem={({ item }) => (<CategoryCard item={item} onPress={() => navigation.navigate("Category", {
                    categoryId: item.id,
                    categoryName: item.name,
                })}/>)} ListFooterComponent={<View style={{ height: 24 }}/>}/>)}
      </View>
    </View>);
};
export default ExploreScreen;
