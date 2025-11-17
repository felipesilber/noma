import React from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import styles from "./styles";
import colors from "../../../../theme/colors";
const ExploreCard = ({ imageSource, title, subtitle, onPress }) => (<TouchableOpacity style={styles.cardContainer} onPress={onPress} activeOpacity={0.8}>
    <Image source={imageSource} style={styles.cardImage} resizeMode="cover"/>
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSubtitle}>{subtitle}</Text>
    </View>
  </TouchableOpacity>);
const ExploreLandingScreen = ({ navigation }) => {
    const tabBarHeight = useBottomTabBarHeight();
    const PADDING_BOTTOM = tabBarHeight + 25 + 20;
    const handleExplorePlaces = () => {
        navigation.navigate("ExploreCategories");
    };
    const handleExplorePeople = () => {
        console.log("Navigate to Explore People");
        alert("Tela 'Explorar Pessoas' ainda não implementada.");
    };
    return (<ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: PADDING_BOTTOM }} showsVerticalScrollIndicator={false}>
      <Text style={styles.mainTitle}>O que você quer explorar?</Text>

      <ExploreCard imageSource={require("../../../../../assets/images/explore-places.png")} title="Explorar Lugares" subtitle="Descubra novos restaurantes, bares e cafés perto de você." onPress={handleExplorePlaces}/>

      <ExploreCard imageSource={require("../../../../../assets/images/explore-people.png")} title="Explorar Pessoas" subtitle="Conecte-se com outros entusiastas de comida e bebida." onPress={handleExplorePeople}/>
    </ScrollView>);
};
export default ExploreLandingScreen;
