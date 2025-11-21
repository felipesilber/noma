import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, TouchableOpacity, ActivityIndicator, FlatList, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";
import BackButton from "../../../../components/BackButton";
import colors from "../../../../theme/colors";
import AppText from "../../../../components/text";
import api from "../../../../services/api";
import FollowButton from "../../../../components/follow/FollowButton";
import { followUser, unfollowUser } from "../../../../services/follow";
import ErrorView from "../../../../components/ErrorView";
const UserRow = ({ user, onToggleFollow, onPress }) => {
    const avatar = user.avatarUrl ||
        "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/20.jpg";
    return (<View style={styles.row}>
      <TouchableOpacity style={styles.left} onPress={onPress}>
        <Image source={{ uri: avatar }} style={styles.avatar}/>
        <View>
          <AppText weight="bold" style={styles.username}>{user.username}</AppText>
        </View>
      </TouchableOpacity>
      <FollowButton initialIsFollowing={user.isFollowing} onToggle={(next, revert) => onToggleFollow(user.id, next, revert)}/>
    </View>);
};
const ConnectionsScreen = ({ route, navigation }) => {
    const { userId: passedUserId, username: passedUsername, initialTab = "followers" } = route.params || {};
    const [activeTab, setActiveTab] = useState(initialTab);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);
    const [targetId, setTargetId] = useState(passedUserId ?? null);
    const [headerUsername, setHeaderUsername] = useState(passedUsername || "");
    const ensureTargetAndHeader = useCallback(async () => {
        if (targetId && headerUsername)
            return { id: targetId };
        try {
            if (targetId && !headerUsername) {
                const { data } = await api.get(`/profile/${targetId}`);
                setHeaderUsername(`${data.username || "usuario"}`);
                return { id: targetId };
            }
            if (!targetId) {
                const { data } = await api.get("/profile/me");
                setTargetId(data.id);
                if (!headerUsername)
                    setHeaderUsername(`@${data.username || "usuario"}`);
                return { id: data.id };
            }
        }
        catch (e) {
            console.error(e);
            throw e;
        }
    }, [targetId, headerUsername]);
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const ensured = await ensureTargetAndHeader();
            const endpoint = activeTab === "followers"
                ? `/users/${ensured.id}/followers`
                : `/users/${ensured.id}/following`;
            const { data } = await api.get(endpoint, { params: { limit: 50 } });
            setData(data.data || data);
        }
        catch (e) {
            console.error(e);
            setError("Não foi possível carregar a lista.");
        }
        finally {
            setLoading(false);
        }
    }, [activeTab, ensureTargetAndHeader]);
    useEffect(() => {
        fetchData();
    }, [fetchData]);
    const onToggleFollow = async (target, next, revert) => {
        try {
            if (next)
                await followUser(target);
            else
                await unfollowUser(target);
        }
        catch (e) {
            console.error(e);
            if (revert)
                revert();
        }
    };
    return (<SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.headerBar}>
        <BackButton onPress={() => navigation.goBack()} style={styles.headerBack} />
        <AppText weight="bold" style={styles.headerTitle}>{headerUsername || ""}</AppText>
      </View>

      <View style={styles.tabsRow}>
        <TouchableOpacity onPress={() => setActiveTab("followers")} style={styles.tabButton}>
          <AppText weight="bold" style={[styles.tabLabel, activeTab === "followers" && styles.tabLabelActive]}>Seguidores</AppText>
          {activeTab === "followers" ? <View style={styles.tabIndicator}/> : null}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab("following")} style={styles.tabButton}>
          <AppText weight="bold" style={[styles.tabLabel, activeTab === "following" && styles.tabLabelActive]}>Seguindo</AppText>
          {activeTab === "following" ? <View style={styles.tabIndicator}/> : null}
        </TouchableOpacity>
      </View>

      {loading ? (<View style={styles.centered}><ActivityIndicator color={colors.primary}/></View>) : error ? (<View style={styles.centered}><ErrorView message={error} onRetry={fetchData} /></View>) : (<FlatList data={data} keyExtractor={(item) => String(item.id)} renderItem={({ item }) => (<UserRow user={item} onToggleFollow={onToggleFollow} onPress={() => navigation.navigate("UserProfile", { userId: item.id })}/>)} contentContainerStyle={{ paddingBottom: 24 }}/>)}
    </SafeAreaView>);
};
export default ConnectionsScreen;
