import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import styles from "./styles";
import colors from "../../../../../theme/colors";
import api from "../../../../../services/api";
import ErrorView from "../../../../../components/ErrorView";
const CategoryCard = ({ item, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.categoryCardContainer}
      activeOpacity={0.9}
      onPress={onPress}
    >
      <Image source={{ uri: item.image }} style={styles.categoryCardImage} />
      <Text numberOfLines={1} style={styles.categoryCardLabel}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
};
const ExploreScreen = ({ navigation }) => {
  const tabBarHeight = useBottomTabBarHeight();
  const GRID_BOTTOM = tabBarHeight + 24;
  const [loadingCats, setLoadingCats] = useState(true);
  const [catsError, setCatsError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const fetchCategories = async () => {
    try {
      if (!refreshing) {
        setLoadingCats(true);
      }
      setCatsError(null);
      const response = await api.get("/category");
      const mappedCategories = response.data.map((category) => ({
        id: category.id,
        name: category.name,
        image: category.imageUrl,
      }));
      setCategories(mappedCategories);
    } catch (err) {
      console.error("Erro ao buscar categorias:", err);
      setCatsError("Não foi possível carregar as categorias.");
    } finally {
      setLoadingCats(false);
      setRefreshing(false);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);
  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <TouchableOpacity
        style={styles.searchBarWrapper}
        activeOpacity={0.9}
        onPress={() => navigation.navigate("Search")}
      >
        <Ionicons
          name="search"
          size={18}
          color={colors.textSecondary}
          style={styles.searchIcon}
        />
        <Text style={styles.searchInput} numberOfLines={1}>
          Restaurante ou prato
        </Text>
      </TouchableOpacity>

      <Text style={styles.exploreCategoriesTitle}>Explorar por categoria</Text>

      <View style={styles.gridContainer}>
        {loadingCats ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : catsError ? (
          <ErrorView message={catsError} onRetry={fetchCategories} />
        ) : (
          <FlatList
            data={categories}
            keyExtractor={(item) => String(item.id)}
            numColumns={2}
            columnWrapperStyle={styles.gridRow}
            contentContainerStyle={[styles.gridContent, { paddingBottom: GRID_BOTTOM }]}
            showsVerticalScrollIndicator={false}
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchCategories();
            }}
            renderItem={({ item }) => (
              <CategoryCard
                item={item}
                onPress={() =>
                  navigation.navigate("Category", {
                    categoryId: item.id,
                    categoryName: item.name,
                  })
                }
              />
            )}
            ListFooterComponent={<View style={{ height: 24 }} />}
          />
        )}
      </View>
    </SafeAreaView>
  );
};
export default ExploreScreen;
