import React from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import styles from "./styles";
import colors from "../../../../theme/colors";
import AppText from "../../../../components/text";
const ExploreCard = ({ imageSource, title, subtitle, onPress }) => (<TouchableOpacity style={styles.cardContainer} onPress={onPress} activeOpacity={0.8}>
    <Image source={imageSource} style={styles.cardImage} resizeMode="cover"/>
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSubtitle}>{subtitle}</Text>
    </View>
  </TouchableOpacity>);
const ExploreLandingScreen = ({ navigation }) => {
    const tabBarHeight = useBottomTabBarHeight();
    const PADDING_BOTTOM = tabBarHeight + 45;
    const handleExplorePlaces = () => {
        navigation.navigate("ExploreCategories");
    };
    const handleExplorePeople = () => {
        navigation.navigate("ExplorePeople");
    };
    return (<View style={styles.container}>
      <View style={styles.header}>
        <AppText weight="bold" style={styles.headerTitle}>
          Explorar
        </AppText>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: PADDING_BOTTOM }} showsVerticalScrollIndicator={false}>
        <Text style={styles.mainTitle}>O que você quer explorar?</Text>

      <ExploreCard imageSource={require("../../../../../assets/images/explore-places.png")} title="Explorar Lugares" subtitle="Descubra novos restaurantes, bares e cafés perto de você." onPress={handleExplorePlaces}/>

      <ExploreCard imageSource={require("../../../../../assets/images/explore-people.png")} title="Explorar Pessoas" subtitle="Conecte-se com outros entusiastas de comida e bebida." onPress={handleExplorePeople}/>
      </ScrollView>
    </View>);
};
export default ExploreLandingScreen;
