import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Image,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase/firebase";
import { Ionicons } from "@expo/vector-icons";
import { CommonActions } from "@react-navigation/native";
import styles from "./styles";
import colors from "../../../theme/colors";
import api from "../../../services/api";

const FavoriteCard = ({ item, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.favCard}
      activeOpacity={0.85}
      onPress={onPress}
    >
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.favImage} />
      ) : (
        <View style={[styles.favImage, styles.favImagePlaceholder]} />
      )}
      <Text numberOfLines={1} style={styles.favTitle}>
        {item.name || "Favorito"}
      </Text>
    </TouchableOpacity>
  );
};

const FavoriteAddCard = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={styles.favAddCard}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <Ionicons name="add" size={28} color={colors.primary} />
    </TouchableOpacity>
  );
};

const VisitedCard = ({ item, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.visitedCard}
      activeOpacity={0.85}
      onPress={onPress}
    >
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.visitedImage} />
      ) : (
        <View style={[styles.visitedImage, styles.visitedPlaceholder]} />
      )}
      <Text numberOfLines={1} style={styles.visitedTitle}>
        {item.title || "Estabelecimento"}
      </Text>
    </TouchableOpacity>
  );
};

const ProfileScreen = ({ navigation }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const [username, setUsername] = useState("—");
  const [level, setLevel] = useState(1);
  const [visitsCount, setVisitsCount] = useState(0);
  const [recentlyVisited, setRecentlyVisited] = useState([]);
  const [lists, setLists] = useState([]);

  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const [favorites, setFavorites] = useState([]);

  const [avatarUrl, setAvatarUrl] = useState(null);
  const [avatarSheetOpen, setAvatarSheetOpen] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const toggleMenu = () => setMenuOpen((v) => !v);
  const closeMenu = () => setMenuOpen(false);

  const doSignOut = useCallback(async () => {
    try {
      await signOut(auth);
    } finally {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            { name: "Auth", state: { index: 0, routes: [{ name: "Login" }] } },
          ],
        })
      );
    }
  }, [navigation]);

  const fetchProfile = useCallback(async () => {
    try {
      setError(null);
      const resp = await api.get("/profile/me");
      const p = resp.data;

      setUsername(p?.username || auth.currentUser?.email?.split("@")[0] || "—");
      setLevel(p?.level ?? 1);
      setVisitsCount(p?.visitsCount ?? 0);

      setFollowersCount(p?.followersCount ?? 0);
      setFollowingCount(p?.followingCount ?? 0);
      setWishlistCount(p?.savedPlacesCount ?? 0);

      const last = Array.isArray(p?.lastVisited)
        ? p.lastVisited.map((it) => ({
            id: String(it.placeId),
            title: it.name,
            imageUrl: it.imageUrl,
          }))
        : [];
      setRecentlyVisited(last);

      const L = Array.isArray(p?.lists)
        ? p.lists.map((l) => ({ id: String(l.id), name: l.name }))
        : [];
      setLists(L);

      const favs = Array.isArray(p?.favoritePlaces)
        ? p.favoritePlaces.map((f) => ({
            id: String(f.placeId ?? f.id),
            name: f.name,
            image: f.imageUrl || f.photoUrl || null,
          }))
        : [];
      setFavorites(favs.slice(0, 4));

      setAvatarUrl(p?.avatarUrl || null);
    } catch (e) {
      if (e?.response?.status === 401) {
        await doSignOut();
        return;
      }
      setError("Não foi possível carregar seu perfil. Tente novamente.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [doSignOut]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProfile();
  }, [fetchProfile]);

  async function handleSignOut() {
    if (signingOut) return;
    try {
      setSigningOut(true);
      await doSignOut();
    } finally {
      setSigningOut(false);
      setMenuOpen(false);
    }
  }

  async function ensureMediaPermission() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão necessária",
        "Preciso de acesso à sua galeria para selecionar a foto."
      );
      return false;
    }
    return true;
  }
  async function ensureCameraPermission() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão necessária",
        "Preciso de acesso à câmera para tirar a foto."
      );
      return false;
    }
    return true;
  }
  async function pickFromGallery() {
    const ok = await ensureMediaPermission();
    if (!ok) return;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });
    if (!res.canceled && res.assets?.[0]?.uri) {
      await uploadAvatar(res.assets[0].uri);
    }
  }
  async function takePhoto() {
    const ok = await ensureCameraPermission();
    if (!ok) return;
    const res = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });
    if (!res.canceled && res.assets?.[0]?.uri) {
      await uploadAvatar(res.assets[0].uri);
    }
  }
  async function uploadAvatar(uri) {
    try {
      setUploadingAvatar(true);
      setAvatarUrl(uri);

      const filename = uri.split("/").pop() || "avatar.jpg";
      const match = /\.(\w+)$/.exec(filename || "");
      const ext = (match && match[1] && match[1].toLowerCase()) || "jpg";
      const type = `image/${ext === "jpg" ? "jpeg" : ext}`;

      const form = new FormData();
      form.append("avatar", { uri, name: filename, type });

      const resp = await api.post("/profile/avatar", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const newUrl = (resp && resp.data && resp.data.avatarUrl) || uri;
      setAvatarUrl(newUrl);
    } catch (e) {
      Alert.alert("Erro", "Não foi possível atualizar sua foto.");
      await fetchProfile();
    } finally {
      setUploadingAvatar(false);
      setAvatarSheetOpen(false);
    }
  }

  const favoriteSlots = useMemo(() => {
    const base = favorites.slice(0, 4);
    if (base.length < 4) {
      return [...base, { id: "add", __type: "add" }];
    }
    return base;
  }, [favorites]);

  const handleAddFavorite = () => {
    navigation.navigate("Explore");
  };

  return (
    <View style={styles.container}>
      <View className="header" style={styles.header}>
        <Text style={styles.username}>{username}</Text>
        <TouchableOpacity onPress={toggleMenu}>
          <Ionicons name="menu" size={28} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {menuOpen && (
        <>
          <TouchableOpacity
            style={styles.menuOverlay}
            activeOpacity={1}
            onPress={closeMenu}
          />
          <View style={styles.menuCard}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleSignOut}
              disabled={signingOut}
            >
              {signingOut ? (
                <ActivityIndicator color={colors.primary} />
              ) : (
                <>
                  <Ionicons
                    name="log-out-outline"
                    size={18}
                    color={colors.textPrimary}
                    style={styles.menuItemIcon}
                  />
                  <Text style={styles.menuItemText}>Sair</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}

      {loading ? (
        <View
          style={[styles.loadingContainer, styles.loadingContainerPaddingTop]}
        >
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Carregando perfil…</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
        >
          <View style={styles.profileInfoContainer}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => !uploadingAvatar && setAvatarSheetOpen(true)}
              disabled={uploadingAvatar}
            >
              {avatarUrl ? (
                <Image
                  source={{ uri: avatarUrl }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.profileImage} />
              )}
            </TouchableOpacity>

            <View style={styles.followInfo}>
              <Text style={styles.followCount}>{followersCount}</Text>
              <Text style={styles.followLabel}>Seguidores</Text>
            </View>
            <View style={styles.followInfo}>
              <Text style={styles.followCount}>{followingCount}</Text>
              <Text style={styles.followLabel}>Seguindo</Text>
            </View>
          </View>

          <Text style={styles.bioText}>
            Metido a crítico dos lugares mais badalados de SP
          </Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Visitados</Text>
              <Text style={styles.statValue}>{visitsCount}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Deseja ir</Text>
              <Text style={styles.statValue}>{wishlistCount}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Nível Noma</Text>
              <Text style={styles.statValue}>{level}</Text>
            </View>
          </View>

          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Favoritos</Text>
            </View>

            <FlatList
              data={favoriteSlots}
              keyExtractor={(item, idx) => String(item.id ?? idx)}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalListContent}
              renderItem={({ item }) =>
                item.__type === "add" ? (
                  <FavoriteAddCard onPress={handleAddFavorite} />
                ) : (
                  <FavoriteCard
                    item={item}
                    onPress={() =>
                      navigation.navigate("PlaceDetail", {
                        placeId: item.id,
                      })
                    }
                  />
                )
              }
              ListEmptyComponent={
                <FavoriteAddCard onPress={handleAddFavorite} />
              }
            />
          </View>

          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Visitados recentemente</Text>
              {!!recentlyVisited.length && (
                <TouchableOpacity onPress={() => {}}>
                  <Text style={styles.seeAllText}>Ver todos</Text>
                </TouchableOpacity>
              )}
            </View>
            <FlatList
              data={recentlyVisited}
              renderItem={({ item }) => (
                <VisitedCard
                  item={item}
                  onPress={() =>
                    navigation.navigate("PlaceDetail", { placeId: item.id })
                  }
                />
              )}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalListContent}
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  Você ainda não visitou nenhum lugar.
                </Text>
              }
            />
          </View>

          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Listas</Text>
              {!!lists.length && (
                <TouchableOpacity onPress={() => {}}>
                  <Text style={styles.seeAllText}>Ver todas</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.listsContainer}>
              {lists.length ? (
                lists.map((list) => (
                  <TouchableOpacity key={list.id} style={styles.listItem}>
                    <Text style={styles.listItemText}>{list.name}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.emptyText}>
                  Você ainda não criou listas.
                </Text>
              )}
            </View>
          </View>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
        </ScrollView>
      )}

      <Modal
        visible={avatarSheetOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setAvatarSheetOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setAvatarSheetOpen(false)}>
          <View style={styles.sheetOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.sheetCard}>
                <TouchableOpacity
                  onPress={takePhoto}
                  style={styles.sheetButton}
                  disabled={uploadingAvatar}
                >
                  {uploadingAvatar ? (
                    <ActivityIndicator color={colors.primary} />
                  ) : (
                    <Text style={styles.sheetButtonText}>Tirar foto</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={pickFromGallery}
                  style={styles.sheetButton}
                  disabled={uploadingAvatar}
                >
                  {uploadingAvatar ? (
                    <ActivityIndicator color={colors.primary} />
                  ) : (
                    <Text style={styles.sheetButtonText}>
                      Escolher da galeria
                    </Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setAvatarSheetOpen(false)}
                  style={styles.sheetButtonPrimary}
                  disabled={uploadingAvatar}
                >
                  <Text style={styles.sheetButtonPrimaryText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default ProfileScreen;
