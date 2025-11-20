import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator, FlatList, RefreshControl, } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./styles";
import colors from "../../../../theme/colors";
import api from "../../../../services/api";
import ErrorView from "../../../../components/ErrorView";
const mockMayKnow = [
    {
        id: "m1",
        name: "Lucas Oliveira",
        avatar: "https://randomuser.me/api/portraits/men/50.jpg",
        details: "2 amigos em comum",
        isFollowing: false,
    },
    {
        id: "m2",
        name: "Isabela Souza",
        avatar: "https://randomuser.me/api/portraits/women/51.jpg",
        details: "1 amigo em comum",
        isFollowing: false,
    },
    {
        id: "m3",
        name: "Gabriel Costa",
        avatar: "https://randomuser.me/api/portraits/men/52.jpg",
        details: "3 amigos em comum",
        isFollowing: false,
    },
];
const FollowButton = ({ initialIsFollowing, onPress }) => {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const handlePress = () => {
        const newState = !isFollowing;
        setIsFollowing(newState);
        if (onPress) {
            onPress(newState);
        }
    };
    return (<TouchableOpacity style={[styles.followButton, isFollowing && styles.followingButton]} onPress={handlePress}>
      <Text style={[
            styles.followButtonText,
            isFollowing && styles.followingButtonText,
        ]}>
        {isFollowing ? "Seguindo" : "Seguir"}
      </Text>
    </TouchableOpacity>);
};
const UserCard = ({ user, onFollowToggle, onPress }) => (<View style={styles.userCard}>
    <TouchableOpacity style={styles.userCardInfo} activeOpacity={0.8} onPress={onPress ? () => onPress(user) : undefined}>
      <Image source={{ uri: user.avatar }} style={styles.avatar}/>
      <View>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userDetails}>{user.details}</Text>
      </View>
    </TouchableOpacity>
    <FollowButton initialIsFollowing={user.isFollowing} onPress={(newState) => onFollowToggle(user.id, newState)}/>
  </View>);
const Section = ({ title, children, isLoading }) => (<View style={styles.sectionContainer}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <TouchableOpacity>
        <Text style={styles.seeAllText}>Ver Mais</Text>
      </TouchableOpacity>
    </View>
    {isLoading ? (<ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 20 }}/>) : (children)}
  </View>);
const ExplorePeopleScreen = ({ navigation }) => {
    const tabBarHeight = useBottomTabBarHeight();
    const PADDING_BOTTOM = tabBarHeight + 45;
    const [searchText, setSearchText] = useState("");
    const [popularUsers, setPopularUsers] = useState([]);
    const [loadingPopular, setLoadingPopular] = useState(true);
    const [activeUsers, setActiveUsers] = useState([]);
    const [loadingActive, setLoadingActive] = useState(true);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState(null);
    const debRef = useRef(null);
    const handleOpenProfile = useCallback((targetUser) => {
        const profileId = Number(targetUser?.id);
        if (!profileId || Number.isNaN(profileId)) {
            return;
        }
        navigation.navigate("UserProfile", {
            userId: profileId,
            username: targetUser?.name,
        });
    }, [navigation]);
    const fetchInitialData = useCallback(async () => {
        try {
            setLoadingPopular(true);
            setLoadingActive(true);
            const [suggestionsRes, activeRes] = await Promise.all([
                api.get("/user/suggestions", { params: { limit: 3 } }),
                api.get("/user/active", { params: { limit: 3 } }),
            ]);
            console.log(activeRes);
            const mappedPopular = suggestionsRes.data.map((u) => ({
                id: u.id,
                name: u.username,
                avatar: u.avatarUrl || "https://i.imgur.com/83Qt5J7.png",
                details: u.details,
                isFollowing: u.isFollowing,
            }));
            setPopularUsers(mappedPopular);
            const mappedActive = activeRes.data.map((u) => ({
                id: u.id,
                name: u.username,
                avatar: u.avatarUrl || "https://i.imgur.com/83Qt5J7.png",
                details: u.details,
                isFollowing: u.isFollowing,
            }));
            setActiveUsers(mappedActive);
        }
        catch (e) {
            console.error("Erro ao buscar dados de exploração:", e);
        }
        finally {
            setLoadingPopular(false);
            setLoadingActive(false);
        }
    }, []);
    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);
    const fetchUsers = async (query) => {
        try {
            setSearchError(null);
            setIsSearching(true);
            const { data } = await api.get("/users/search", {
                params: { q: query, limit: 20 },
            });
            const mappedResults = data.map((user) => ({
                id: user.id,
                name: user.username,
                avatar: user.avatarUrl || "https://i.imgur.com/83Qt5J7.png",
                details: `Nível ${user.level}`,
                isFollowing: user.isFollowing,
            }));
            setSearchResults(mappedResults);
        }
        catch (e) {
            console.error("Erro ao buscar usuários:", e);
            setSearchError("Não foi possível realizar a busca.");
        }
        finally {
            setIsSearching(false);
        }
    };
    useEffect(() => {
        if (debRef.current)
            clearTimeout(debRef.current);
        const term = searchText.trim();
        if (term.length < 2) {
            setSearchResults([]);
            setSearchError(null);
            setIsSearching(false);
            return;
        }
        debRef.current = setTimeout(() => {
            fetchUsers(term);
        }, 400);
        return () => clearTimeout(debRef.current);
    }, [searchText]);
    const handleFollowToggle = async (targetId, newFollowState) => {
        try {
            if (newFollowState) {
                await api.put(`/users/${targetId}/follow`);
            }
            else {
                await api.delete(`/users/${targetId}/follow`);
            }
        }
        catch (err) {
            console.error("Erro ao atualizar status de 'seguir':", err);
        }
    };
    const renderContent = () => {
        if (searchText.length < 2) {
            return (<>
          <Section title="Pessoas Populares" isLoading={loadingPopular}>
            {popularUsers.map((user) => (<UserCard key={user.id} user={user} onFollowToggle={handleFollowToggle} onPress={handleOpenProfile}/>))}
          </Section>
          <Section title="Pessoas Ativas" isLoading={loadingActive}>
            {activeUsers.map((user) => (<UserCard key={user.id} user={user} onFollowToggle={handleFollowToggle} onPress={handleOpenProfile}/>))}
          </Section>
          <Section title="Pessoas que Você Talvez Conheça" isLoading={false}>
            {mockMayKnow.map((user) => (<UserCard key={user.id} user={user} onFollowToggle={handleFollowToggle} onPress={handleOpenProfile}/>))}
          </Section>
        </>);
        }
        if (isSearching) {
            return (<ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }}/>);
        }
        if (searchError) {
            return <ErrorView message={searchError} />;
        }
        if (searchResults.length === 0) {
            return (<Text style={styles.errorText}>
          Nenhum usuário encontrado para "{searchText}".
        </Text>);
        }
        return (<FlatList data={searchResults} keyExtractor={(item) => item.id.toString()} renderItem={({ item }) => (<UserCard user={item} onFollowToggle={handleFollowToggle} onPress={handleOpenProfile}/>)}/>);
    };
    return (<SafeAreaView edges={["top"]} style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: PADDING_BOTTOM }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" refreshControl={<RefreshControl refreshing={loadingPopular || loadingActive || isSearching} onRefresh={() => {
                if (searchText.trim().length >= 2) {
                    setIsSearching(true);
                    fetchUsers(searchText.trim()).finally(() => setIsSearching(false));
                }
                else {
                    fetchInitialData();
                }
            }} tintColor={colors.textSecondary}/>}>
      <View style={styles.searchBarContainer}>
        <Ionicons name="search-outline" size={20} color={colors.textSecondary} style={styles.searchIcon}/>
        <TextInput style={styles.searchInput} placeholder="Buscar por nome de usuário" placeholderTextColor={colors.textSecondary} value={searchText} onChangeText={setSearchText} autoFocus={false}/>
      </View>
      {renderContent()}
      </ScrollView>
    </SafeAreaView>);
};
export default ExplorePeopleScreen;
