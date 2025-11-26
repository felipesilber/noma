import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./styles";
import BackButton from "../../../components/BackButton";
import colors from "../../../theme/colors";
import AppText from "../../../components/text";
import api from "../../../services/api";
import Avatar from "../../../components/avatar";
import ErrorView from "../../../components/ErrorView";

const formatDateTime = (timestamp) => {
  if (!timestamp) return "";
  try {
    return new Date(timestamp).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return "";
  }
};

const ActivityRow = ({ item, onPress }) => {
  const user = item.user || {};

  return (
    <TouchableOpacity
      style={styles.row}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={styles.left}>
        <Avatar
          avatarUrl={user.avatarUrl}
          size={styles.avatar?.width || 48}
          style={styles.avatar}
        />
        <View style={styles.texts}>
          <AppText weight="bold" style={styles.username}>
            {user.username || "Usuário"}
          </AppText>
          <AppText style={styles.actionText} numberOfLines={2}>
            {item.actionText}
          </AppText>
          {item.timestamp ? (
            <AppText style={styles.timestamp}>
              {formatDateTime(item.timestamp)}
            </AppText>
          ) : null}
        </View>
      </View>

      {item.place?.imageUrl ? (
        <Image
          source={{ uri: item.place.imageUrl }}
          style={styles.placeImage}
        />
      ) : null}
    </TouchableOpacity>
  );
};

const FriendsActivitiesScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [activities, setActivities] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadActivities = useCallback(
    async (pageToLoad = 1, options = { refreshing: false }) => {
      const isRefreshing = options.refreshing;

      if (pageToLoad > 1 && (loading || loadingMore || !hasMore)) {
        return;
      }

      if (isRefreshing) {
        setRefreshing(true);
      } else if (pageToLoad === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      try {
        const { data } = await api.get("/feed/friends-activities", {
          params: { page: pageToLoad, limit: 20 },
        });

        const items = data?.data || [];
        const pagination = data?.pagination || {};

        if (pageToLoad === 1) {
          setActivities(items);
        } else {
          setActivities((prev) => [...prev, ...items]);
        }

        const totalPages = pagination.totalPages || 1;
        setHasMore(pageToLoad < totalPages);
        setPage(pageToLoad);
        setError(null);
      } catch (e) {
        console.error("Erro ao buscar atividades dos amigos:", e);
        setError("Não foi possível carregar as atividades dos amigos.");
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [loading, loadingMore, hasMore]
  );

  useEffect(() => {
    loadActivities(1);
  }, [loadActivities]);

  const onRefresh = () => {
    loadActivities(1, { refreshing: true });
  };

  const loadMore = () => {
    if (hasMore && !loadingMore && !loading) {
      loadActivities(page + 1);
    }
  };

  const renderContent = () => {
    if (loading && !refreshing) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.primary} />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centered}>
          <ErrorView message={error} onRetry={() => loadActivities(1)} />
        </View>
      );
    }

    return (
      <FlatList
        data={activities}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <ActivityRow
            item={item}
            onPress={() => {
              if (item.place?.id) {
                navigation.navigate("PlaceDetail", { placeId: item.place.id });
              } else {
                navigation.navigate("UserProfile", {
                  userId: item.user?.id,
                });
              }
            }}
          />
        )}
        contentContainerStyle={
          activities.length === 0
            ? styles.emptyContent
            : { paddingHorizontal: 16, paddingBottom: 24 }
        }
        ListEmptyComponent={
          !loading && !error ? (
            <View style={styles.emptyContainer}>
              <AppText weight="bold" style={styles.emptyTitle}>
                Nenhuma atividade de amigos ainda
              </AppText>
              <AppText style={styles.emptySubtitle}>
                Conecte-se com amigos para ver o que eles estão fazendo.
              </AppText>
            </View>
          ) : null
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.2}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.textSecondary}
          />
        }
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator
              style={{ marginVertical: 16 }}
              color={colors.primary}
            />
          ) : null
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.headerBar}>
        <BackButton
          onPress={() => navigation.goBack()}
          style={styles.headerBack}
        />
        <AppText weight="bold" style={styles.headerTitle}>
          Atividade dos amigos
        </AppText>
      </View>

      {renderContent()}
    </SafeAreaView>
  );
};

export default FriendsActivitiesScreen;


