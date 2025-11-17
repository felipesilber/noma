import React, { useState, useCallback } from "react";
import { View, ScrollView, TouchableOpacity, ActivityIndicator, Image, FlatList, Alert, } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";
import colors from "../../../theme/colors";
import api from "../../../services/api";
import AppText from "../../../components/text";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase/firebase";
import { showErrorNotification } from "../../../utils/notifications";
const StatBox = ({ value, label, onPress }) => (<TouchableOpacity style={styles.statBox} onPress={onPress} activeOpacity={0.8}>
    <AppText weight="bold" style={styles.statBoxValue}>
      {value}
    </AppText>
    <AppText style={styles.statBoxLabel}>{label}</AppText>
  </TouchableOpacity>);
const PlaceCarouselCard = ({ item, onPress }) => (<TouchableOpacity style={styles.placeCard} onPress={onPress}>
    <Image source={{ uri: item.image }} style={styles.placeCardImage}/>
    <AppText style={styles.placeCardTitle} numberOfLines={2}>
      {item.name}
    </AppText>
  </TouchableOpacity>);
const EmptyStateCard = ({ title, description, buttonText, onPress }) => (<View style={styles.emptyStateCard}>
    <AppText weight="bold" style={styles.emptyStateTitle}>
      {title}
    </AppText>
    <AppText style={styles.emptyStateDescription}>{description}</AppText>
    {buttonText && onPress ? (<TouchableOpacity style={styles.emptyStateButton} onPress={onPress}>
        <AppText weight="bold" style={styles.emptyStateButtonText}>
          {buttonText}
        </AppText>
      </TouchableOpacity>) : null}
  </View>);
const DashboardStatCard = ({ label, value }) => (<View style={styles.dashboardStatCard}>
    <AppText style={styles.dashboardStatLabel}>{label}</AppText>
    <AppText weight="bold" style={styles.dashboardStatValue}>
      {value}
    </AppText>
  </View>);
const Section = ({ title, children, actionIcon, onPressAction }) => (<View style={styles.sectionContainer}>
    <View style={styles.sectionHeader}>
      <AppText weight="bold" style={styles.sectionTitle}>
        {title}
      </AppText>
      {actionIcon && onPressAction && (<TouchableOpacity style={styles.sectionActionButton} onPress={onPressAction}>
          <Ionicons name={actionIcon} size={22} color={colors.textPrimary}/>
        </TouchableOpacity>)}
    </View>
    {children}
  </View>);
const ProfileScreen = ({ navigation, route }) => {
    const tabBarHeight = useBottomTabBarHeight();
    const PADDING_BOTTOM = tabBarHeight + 25;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [loggingOut, setLoggingOut] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [isFollowingProfile, setIsFollowingProfile] = useState(false);
    const [updatingFollow, setUpdatingFollow] = useState(false);
    const viewedUserId = route?.params?.userId ?? null;
    const isOwnProfile = !viewedUserId;
    const fetchProfile = useCallback(async () => {
        try {
            setLoading(true);
            const endpoint = viewedUserId
                ? `profile/${viewedUserId}`
                : "profile/me";
            const response = await api.get(endpoint);
            setProfileData(response.data);
            setIsFollowingProfile(Boolean(response.data?.isFollowing));
            setError(null);
            setShowSettings(false);
        }
        catch (err) {
            console.error("Erro ao buscar perfil:", err);
            setError("Não foi possível carregar o perfil.");
        }
        finally {
            setLoading(false);
        }
    }, [viewedUserId]);
    useFocusEffect(useCallback(() => {
        fetchProfile();
    }, [fetchProfile]));
    const handleToggleFollow = async () => {
        if (isOwnProfile || !viewedUserId || updatingFollow) {
            return;
        }
        const nextState = !isFollowingProfile;
        setUpdatingFollow(true);
        try {
            if (nextState) {
                await api.put(`/users/${viewedUserId}/follow`);
            }
            else {
                await api.delete(`/users/${viewedUserId}/follow`);
            }
            setIsFollowingProfile(nextState);
            setProfileData((previous) => {
                if (!previous)
                    return previous;
                const delta = nextState ? 1 : -1;
                const followersCount = Math.max(0, (previous.stats?.followersCount || 0) + delta);
                return {
                    ...previous,
                    isFollowing: nextState,
                    stats: previous.stats
                        ? {
                            ...previous.stats,
                            followersCount,
                        }
                        : previous.stats,
                };
            });
        }
        catch (err) {
            console.error("Erro ao atualizar status de seguir:", err);
            showErrorNotification("Erro ao seguir", "Não foi possível atualizar o status. Tente novamente.", { position: "bottom" });
        }
        finally {
            setUpdatingFollow(false);
        }
    };
    const navigateToAuth = () => {
        const rootNavigation = navigation.getParent?.()?.getParent?.() ?? navigation.getParent?.() ?? navigation;
        rootNavigation.reset({
            index: 0,
            routes: [{ name: "Auth" }],
        });
    };
    const handleLogout = async () => {
        if (!isOwnProfile || loggingOut)
            return;
        setLoggingOut(true);
        setShowSettings(false);
        try {
            await signOut(auth);
            navigateToAuth();
        }
        catch (logoutError) {
            console.error("Erro ao sair:", logoutError);
            Alert.alert("Erro ao sair", "Não foi possível sair da conta. Tente novamente.");
        }
        finally {
            setLoggingOut(false);
        }
    };
    const toggleSettings = () => {
        if (!isOwnProfile || loggingOut)
            return;
        setShowSettings((current) => !current);
    };
    if (loading) {
        return (<View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary}/>
      </View>);
    }
    if (error || !profileData) {
        return (<View style={styles.centered}>
        <AppText>{error || "Ocorreu um erro ao carregar os dados."}</AppText>
        <TouchableOpacity onPress={fetchProfile} style={styles.retryButton}>
          <AppText weight="bold" style={styles.retryButtonText}>
            Tentar Novamente
          </AppText>
        </TouchableOpacity>
      </View>);
    }
    const { username, avatarUrl, joinDate, stats, nomaStatus, carousels } = profileData;
    const headerTitle = isOwnProfile ? "Perfil" : username || "Perfil";
    const dashboardStats = profileData.dashboardStats || {};
    const favoriteCuisineValue = dashboardStats.favoriteCuisine && dashboardStats.favoriteCuisine !== "N/A"
        ? dashboardStats.favoriteCuisine
        : "—";
    const mostFrequentRatingValue = dashboardStats.mostFrequentRating || 0;
    const mostFrequentRatingLabel = mostFrequentRatingValue > 0
        ? `${mostFrequentRatingValue} ${mostFrequentRatingValue === 1 ? "estrela" : "estrelas"}`
        : "Sem avaliações";
    const avgReviewsPerWeekValue = Number(dashboardStats.avgReviewsPerWeek || 0);
    const avgReviewsPerWeekLabel = avgReviewsPerWeekValue > 0
        ? avgReviewsPerWeekValue % 1 === 0
            ? String(avgReviewsPerWeekValue)
            : avgReviewsPerWeekValue.toFixed(1)
        : "0";
    const favoritePlaces = carousels?.favoritePlaces || [];
    const userLists = carousels?.userLists || [];
    return (<View style={styles.container}>
      <View style={styles.header}>
        {!isOwnProfile && (<TouchableOpacity style={styles.headerLeftIcon} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary}/>
          </TouchableOpacity>)}
        <AppText weight="bold" style={styles.headerTitle}>
          {headerTitle}
        </AppText>
        {isOwnProfile && (<TouchableOpacity style={styles.headerIcon} onPress={toggleSettings} disabled={loggingOut}>
            <Ionicons name="settings-outline" size={24} color={colors.textPrimary}/>
          </TouchableOpacity>)}
      </View>

      {isOwnProfile && showSettings && (<>
          <TouchableOpacity style={styles.settingsBackdrop} onPress={() => setShowSettings(false)}/>
          <View style={styles.settingsMenu}>
            <TouchableOpacity style={styles.settingsMenuItem} onPress={handleLogout} disabled={loggingOut}>
              {loggingOut ? (<ActivityIndicator size="small" color={colors.primary}/>) : (<Ionicons name="log-out-outline" size={20} color={colors.textPrimary} style={styles.settingsMenuIcon}/>)}
              <AppText style={styles.settingsMenuText}>
                {loggingOut ? "Saindo..." : "Sair"}
              </AppText>
            </TouchableOpacity>
          </View>
        </>)}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: PADDING_BOTTOM }}>
        <View style={styles.profileInfoContainer}>
          <TouchableOpacity>
            <Image source={{
            uri: avatarUrl ||
                "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/20.jpg",
        }} style={styles.avatar}/>
          </TouchableOpacity>
          <AppText weight="bold" style={styles.name}>
            {username}
          </AppText>
          <AppText style={styles.handle}>@{username}</AppText>
          <AppText style={styles.joinDate}>{joinDate}</AppText>
          {!isOwnProfile && (<TouchableOpacity style={[
                styles.followButton,
                isFollowingProfile && styles.followingButton,
                updatingFollow && styles.followButtonDisabled,
            ]} onPress={handleToggleFollow} disabled={updatingFollow} activeOpacity={0.8}>
              {updatingFollow ? (<ActivityIndicator size="small" color={isFollowingProfile ? colors.textPrimary : colors.background}/>) : (<AppText weight="bold" style={[
                    styles.followButtonText,
                    isFollowingProfile && styles.followingButtonText,
                ]}>
                  {isFollowingProfile ? "Seguindo" : "Seguir"}
                </AppText>)}
            </TouchableOpacity>)}
        </View>

        <View style={styles.statsRow}>
          <StatBox value={stats?.followersCount} label="Seguidores" onPress={() => navigation.navigate("UserConnections", {
            userId: viewedUserId ?? profileData?.id,
            username: `${username}`,
            initialTab: "followers",
        })}/>
          <StatBox value={stats?.followingCount} label="Seguindo" onPress={() => navigation.navigate("UserConnections", {
            userId: viewedUserId ?? profileData?.id,
            username: `${username}`,
            initialTab: "following",
        })}/>
        </View>
        <View style={styles.statsRow}>
          <StatBox value={stats?.visitedPlacesCount} label="Lugares visitados"/>
          <StatBox value={stats?.wishlistCount} label="Lugares que quero ir"/>
        </View>

        <Section title="Noma">
          <View style={styles.xpContent}>
            <AppText style={styles.xpLevelText}>
              Nível {nomaStatus?.level}
            </AppText>
            <View style={styles.xpBarBackground}>
              <View style={[
            styles.xpBarFill,
            {
                width: nomaStatus?.nextLevelXp > 0
                    ? `${(nomaStatus?.currentXp / nomaStatus.nextLevelXp) *
                        100}%`
                    : "0%",
            },
        ]}/>
            </View>
            <AppText style={styles.xpCountText}>
              {nomaStatus?.currentXp}/{nomaStatus?.nextLevelXp} XP
            </AppText>
          </View>
        </Section>

        <Section title="Painel de Estatísticas">
          <View style={styles.dashboardStatsPanel}>
            <DashboardStatCard label="Tipo de Lugar Favorito" value={favoriteCuisineValue}/>
            <DashboardStatCard label="Nota Mais Frequente" value={mostFrequentRatingLabel}/>
            <DashboardStatCard label="Média de Avaliações por Semana" value={avgReviewsPerWeekLabel}/>
          </View>
        </Section>

        <Section title="Lugares Favoritos" actionIcon={isOwnProfile && favoritePlaces.length > 0 ? "create-outline" : null} onPressAction={isOwnProfile
            ? () => navigation.navigate("EditFavoritesScreen")
            : null}>
          <FlatList data={favoritePlaces} renderItem={({ item }) => (<PlaceCarouselCard item={{ ...item, image: item.imageUrl }} onPress={() => navigation.navigate("PlaceDetail", { placeId: item.id })}/>)} ListEmptyComponent={<EmptyStateCard title="Nenhum lugar favorito ainda" description="Adicione seus restaurantes e bares preferidos para acessá-los rapidamente." buttonText={isOwnProfile ? "Adicionar Favorito" : null} onPress={isOwnProfile
                ? () => navigation.navigate("AddFavoriteFlow")
                : undefined}/>} keyExtractor={(item) => String(item.id)} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}/>
        </Section>

        <Section title="Visitados recentemente">
          <FlatList data={carousels?.recentlyVisitedPlaces} renderItem={({ item }) => (<PlaceCarouselCard item={{ ...item, image: item.imageUrl }} onPress={() => navigation.navigate("PlaceDetail", { placeId: item.id })}/>)} ListEmptyComponent={<EmptyStateCard title="Nenhuma visita registrada" description="Registre suas visitas aos restaurantes e bares para acompanhar seus últimos locais." buttonText={isOwnProfile ? "Registrar Visita" : null} onPress={isOwnProfile
                ? () => navigation.navigate("AddReviewFlow")
                : undefined}/>} keyExtractor={(item) => String(item.id)} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}/>
        </Section>

        <Section title="Listas" actionIcon={isOwnProfile && userLists.length > 0 ? "create-outline" : null} onPressAction={isOwnProfile
            ? () => navigation.navigate("EditListsScreen")
            : null}>
          <FlatList data={userLists} renderItem={({ item }) => (<PlaceCarouselCard item={{ ...item, image: item.imageUrl }} onPress={() => navigation.navigate("ListDetail", {
                listId: item.id,
                listName: item.name,
            })}/>)} ListEmptyComponent={<EmptyStateCard title="Nenhuma lista criada" description="Crie listas personalizadas de restaurantes e bares para organizar seus lugares favoritos." buttonText={isOwnProfile ? "Criar Nova Lista" : null} onPress={isOwnProfile
                ? () => navigation.navigate("CreateListFlow")
                : undefined}/>} keyExtractor={(item) => String(item.id)} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}/>
        </Section>

        <View style={{ height: 40 }}/>
      </ScrollView>
    </View>);
};
export default ProfileScreen;
