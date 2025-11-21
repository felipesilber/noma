import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, TouchableOpacity, ActivityIndicator, FlatList, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";
import RatingsSummary from "../components/RatingsSummary";
import colors from "../../../../theme/colors";
import AppText from "../../../../components/text";
import api from "../../../../services/api";
import BackButton from "../../../../components/BackButton";
import moment from "moment";
import "moment/locale/pt-br";
const ReviewItem = ({ review }) => {
    const timeAgo = useMemo(() => moment(review.createdAt).locale("pt-br").fromNow(), [review.createdAt]);
    const name = review.user?.username || "Usuário";
    const avatar = review.user?.avatarUrl ||
        "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/20.jpg";
    return (<View style={styles.reviewRow}>
      <Image source={{ uri: avatar }} style={styles.avatarImage}/>
      <View style={styles.reviewCol}>
        <View style={styles.reviewHeader}>
          <AppText weight="bold" style={styles.userName}>{name}</AppText>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={14} color={colors.star}/>
            <AppText weight="bold" style={styles.ratingText}>{review.generalRating?.toFixed?.(1) || String(review.generalRating)}</AppText>
          </View>
        </View>
        <AppText style={styles.timeAgo}>{timeAgo}</AppText>
        {review.comment ? (<AppText style={styles.comment}>{review.comment}</AppText>) : null}
      </View>
    </View>);
};
const TabButton = ({ label, active, onPress }) => (<TouchableOpacity onPress={onPress} style={styles.tabButton}>
    <AppText weight="bold" style={[styles.tabLabel, active && styles.tabLabelActive]}>
      {label}
    </AppText>
    {active ? <View style={styles.tabIndicator}/> : null}
  </TouchableOpacity>);
const AllReviewsScreen = ({ route, navigation }) => {
    const { placeId } = route.params || {};
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [ratings, setRatings] = useState(null);
    const [scope, setScope] = useState("all");
    const [counts, setCounts] = useState({ all: 0, friends: 0 });
    const [page, setPage] = useState(1);
    const [data, setData] = useState([]);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const loadHeader = useCallback(async () => {
        const { data } = await api.get(`/places/${placeId}/ratings`);
        setRatings(data);
    }, [placeId]);
    const loadPage = useCallback(async (nextPage = 1, selectedScope = scope) => {
        const limit = 20;
        const { data } = await api.get(`/reviews/by-place/${placeId}/list`, {
            params: { page: nextPage, limit, scope: selectedScope },
        });
        if (nextPage === 1) {
            setData(data.data);
        }
        else {
            setData((prev) => [...prev, ...data.data]);
        }
        setCounts(data.counts || { all: 0, friends: 0 });
        const total = selectedScope === "friends" ? data.counts?.friends || 0 : data.counts?.all || 0;
        setHasMore(nextPage * limit < total);
        setPage(nextPage);
    }, [placeId, scope]);
    const refreshAll = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            await Promise.all([loadHeader(), loadPage(1)]);
        }
        catch (e) {
            console.error(e);
            setError("Não foi possível carregar as avaliações.");
        }
        finally {
            setLoading(false);
        }
    }, [loadHeader, loadPage]);
    useEffect(() => {
        refreshAll();
    }, [refreshAll]);
    const handleChangeScope = async (newScope) => {
        if (newScope === scope)
            return;
        setScope(newScope);
        try {
            setLoading(true);
            await loadPage(1, newScope);
        }
        catch (e) {
            console.error(e);
            setError("Erro ao carregar avaliações.");
        }
        finally {
            setLoading(false);
        }
    };
    const handleLoadMore = async () => {
        if (isLoadingMore || !hasMore)
            return;
        setIsLoadingMore(true);
        try {
            await loadPage(page + 1);
        }
        finally {
            setIsLoadingMore(false);
        }
    };
    return (<View style={styles.container}>
      <View style={styles.headerBar}>
        <BackButton onPress={() => navigation.goBack()} style={styles.headerBack} />
        <AppText weight="bold" style={styles.headerTitle}>Todas as Avaliações</AppText>
      </View>

      {loading ? (<View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary}/>
        </View>) : error ? (<View style={styles.centered}>
          <AppText>{error}</AppText>
        </View>) : (<>
          {ratings && <RatingsSummary ratings={ratings}/>}

          <View style={styles.tabsRow}>
            <TabButton label={`Geral (${counts.all || 0})`} active={scope === "all"} onPress={() => handleChangeScope("all")}/>
            <TabButton label={`Amigos (${counts.friends || 0})`} active={scope === "friends"} onPress={() => handleChangeScope("friends")}/>
          </View>

          <FlatList data={data} keyExtractor={(item) => String(item.id)} renderItem={({ item }) => <ReviewItem review={item}/>} onEndReachedThreshold={0.3} onEndReached={handleLoadMore} ListFooterComponent={isLoadingMore ? (<View style={{ paddingVertical: 16 }}>
                <ActivityIndicator color={colors.primary}/>
              </View>) : null} contentContainerStyle={{ paddingBottom: 24 }}/>
        </>)}
    </View>);
};
export default AllReviewsScreen;
