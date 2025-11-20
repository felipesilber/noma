import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, ScrollView, Image, ActivityIndicator, StyleSheet, RefreshControl, } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./styles";
import colors from "../../../theme/colors";
import api from "../../../services/api";
import AppText from "../../../components/text";
import ErrorView from "../../../components/ErrorView";
const promocoes = [
    {
        id: "pro1",
        titulo: "Happy Hour no Bar da Esquina",
        descricao: "50% de desconto em bebidas selecionadas",
        imagem: "https://images.unsplash.com/photo-1543007820-e2da40649637?q=80&w=1887&auto=format&fit=crop",
    },
    {
        id: "pro2",
        titulo: "Noite de Jazz no Bistrô Charmoso",
        descricao: "Música ao vivo a partir das 20h",
        imagem: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop",
    },
];
const Section = ({ title, children }) => (<View style={styles.sectionContainer}>
    <AppText weight="bold" style={styles.sectionTitle}>
      {title}
    </AppText>
    {children}
  </View>);
const DestaqueCard = ({ item, onPress }) => (<TouchableOpacity style={styles.destaqueCardContainer} onPress={onPress}>
    <Image source={{ uri: item.imagem }} style={styles.destaqueImage}/>
    <AppText weight="bold" style={styles.destaqueTitle}>
      {item.nome}
    </AppText>
    <View style={styles.ratingContainer}>
      <AppText style={styles.destaqueSubtitle}>{item.avaliacao}</AppText>
      <Ionicons name="star" size={14} color={colors.textSecondary} style={styles.starIcon}/>
      <AppText style={styles.destaqueSubtitle}>∙ {item.categoria}</AppText>
    </View>
  </TouchableOpacity>);
const RecomendadoCard = ({ item, onPress }) => (<TouchableOpacity style={styles.cardRow} onPress={onPress}>
    <View style={styles.cardInfo}>
      {item.tag && (<AppText weight="bold" style={styles.recomendadoTag}>
          {item.tag}
        </AppText>)}
      <AppText weight="bold" style={styles.cardTitle}>
        {item.nome}
      </AppText>
      <View style={styles.ratingContainer}>
        <AppText style={styles.cardSubtitle}>{item.avaliacao}</AppText>
        <Ionicons name="star" size={14} color={colors.textSecondary} style={styles.starIcon}/>
        <AppText style={styles.cardSubtitle}>∙ {item.categoria}</AppText>
      </View>
    </View>
    <Image source={{ uri: item.imagem }} style={styles.cardImageSmall}/>
  </TouchableOpacity>);
const AmigoActivityCard = ({ item }) => (<TouchableOpacity style={styles.cardRow}>
    <Image source={{ uri: item.avatar }} style={styles.avatar}/>
    <View style={styles.cardInfo}>
      <AppText style={styles.amigoText} numberOfLines={2}>
        {item.actionText}
      </AppText>
    </View>
  </TouchableOpacity>);
const ConnectFriendsCard = ({ onPress }) => (<View style={styles.connectCard}>
    <Image source={require("../../../../assets/images/empty-friends-activity.png")} style={styles.connectImage}/>
    <AppText weight="bold" style={styles.connectTitle}>
      Conecte-se com amigos para ver suas atividades!
    </AppText>
    <AppText style={styles.connectSubtitle}>
      Descubra onde seus amigos estão comendo e bebendo.
    </AppText>
    <TouchableOpacity style={styles.connectButton} onPress={onPress}>
      <AppText weight="bold" style={styles.connectButtonText}>
        Procurar Amigos
      </AppText>
    </TouchableOpacity>
  </View>);
const PromocaoCard = ({ item }) => (<TouchableOpacity style={styles.cardRow}>
    <View style={styles.cardInfo}>
      <AppText weight="bold" style={styles.cardTitle}>
        {item.titulo}
      </AppText>
      <AppText style={styles.cardSubtitle}>{item.descricao}</AppText>
    </View>
    <Image source={{ uri: item.imagem }} style={styles.cardImageSmall}/>
  </TouchableOpacity>);
const HomeScreen = ({ navigation }) => {
    const tabBarHeight = useBottomTabBarHeight();
    const PADDING_BOTTOM = tabBarHeight + 25;
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [feedData, setFeedData] = useState(null);
    const fetchHomeFeed = async () => {
        try {
            if (!refreshing) {
                setLoading(true);
            }
            const response = await api.get("/feed/home");
            setFeedData(response.data);
            setError(null);
        }
        catch (err) {
            console.error("Erro ao buscar feed:", err);
            setError("Não foi possível carregar o feed. Tente novamente.");
        }
        finally {
            setLoading(false);
            setRefreshing(false);
        }
    };
    useEffect(() => {
        fetchHomeFeed();
    }, []);
    if (loading) {
        return (<View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary}/>
      </View>);
    }
    if (error) {
        return <View style={styles.centered}><ErrorView message={error} onRetry={fetchHomeFeed} /></View>;
    }
    return (<SafeAreaView edges={["top"]} style={styles.container}>
      <View style={styles.header}>
        <AppText weight="bold" style={styles.headerTitle}>
          Início
        </AppText>
        <TouchableOpacity style={styles.searchIcon} onPress={() => navigation.navigate("Explore", { screen: "ExploreLanding" })}>
          <Ionicons name="search" size={24} color={colors.textPrimary}/>
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => {
                setRefreshing(true);
                fetchHomeFeed();
            }} tintColor={colors.textSecondary}/> } contentContainerStyle={{
            paddingBottom: PADDING_BOTTOM,
        }}>
        {feedData?.featuredPlaces?.length > 0 && (<Section title="Destaques">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
              {feedData.featuredPlaces.map((item) => (<DestaqueCard key={item.id} item={{
                    id: item.id,
                    nome: item.name,
                    imagem: item.imageUrl,
                    avaliacao: item.avgRating,
                    categoria: item.category,
                }} onPress={() => navigation.navigate("PlaceDetail", { placeId: item.id })}/>))}
            </ScrollView>
          </Section>)}
        {feedData?.recommendedPlaces?.length > 0 && (<Section title="Recomendados para você">
            <View style={{ paddingHorizontal: 16 }}>
              {feedData.recommendedPlaces.map((item) => (<RecomendadoCard key={item.id} item={{
                    id: item.id,
                    nome: item.name,
                    imagem: item.imageUrl,
                    avaliacao: item.avgRating,
                    categoria: item.category,
                    tag: item.tag,
                }} onPress={() => navigation.navigate("PlaceDetail", { placeId: item.id })}/>))}
            </View>
          </Section>)}

        <Section title="Atividade dos seus amigos">
          <View style={{ paddingHorizontal: 16 }}>
            {feedData?.friendActivityPreview?.length > 0 ? (feedData.friendActivityPreview.map((item, index) => (<AmigoActivityCard key={index} item={{
                avatar: item.user.avatarUrl,
                actionText: item.actionText,
            }}/>))) : (<ConnectFriendsCard onPress={() => navigation.navigate("Explore", { screen: "ExplorePeople" })}/>)}
          </View>
        </Section>

        {promocoes.length > 0 && (<Section title="Promoções e Eventos">
            <View style={{ paddingHorizontal: 16, paddingBottom: 32 }}>
              {promocoes.map((item) => (<PromocaoCard key={item.id} item={{
                    id: item.id,
                    titulo: item.titulo,
                    descricao: item.descricao,
                    imagem: item.imagem,
                }}/>))}
            </View>
          </Section>)}
      </ScrollView>
    </SafeAreaView>);
};
export default HomeScreen;
