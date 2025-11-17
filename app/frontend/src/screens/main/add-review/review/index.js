import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";
import colors from "../../../../theme/colors";
import moment from "moment";
import "moment/locale/pt-br";
import { showErrorNotification, showSuccessNotification, } from "../../../../utils/notifications";
const IconRating = ({ rating, onRatingChange, type = "star" }) => {
    const getIconName = (index) => {
        const isSelected = index <= rating;
        if (type === "star")
            return isSelected ? "star" : "star-outline";
        if (type === "food")
            return isSelected ? "cafe" : "cafe-outline";
        if (type === "service")
            return isSelected ? "person" : "person-outline";
        if (type === "ambiance")
            return isSelected ? "wine" : "wine-outline";
        return "help-circle-outline";
    };
    return (<View style={styles.iconRatingContainer}>
      {[1, 2, 3, 4, 5].map((i) => (<TouchableOpacity key={i} onPress={() => onRatingChange(i)}>
          <Ionicons name={getIconName(i)} size={30} color={i <= rating ? colors.textPrimary : "#D1C4C4"}/>
        </TouchableOpacity>))}
    </View>);
};
const AddReviewFormScreen = ({ route, navigation }) => {
    const { placeName = "Bar do Zé", placeImage = "https://picsum.photos/id/163/800/600", } = route.params || {};
    const [overallRating, setOverallRating] = useState(0);
    const [foodRating, setFoodRating] = useState(0);
    const [serviceRating, setServiceRating] = useState(0);
    const [ambianceRating, setAmbianceRating] = useState(0);
    const [pricePaid, setPricePaid] = useState("");
    const [numberOfPeople, setNumberOfPeople] = useState("");
    const [reviewText, setReviewText] = useState("");
    const [currentDate, setCurrentDate] = useState("");
    const [submitting, setSubmitting] = useState(false);
    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: "Avaliação",
            headerTitleAlign: "center",
            headerLeft: () => (<TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 16 }}>
          <Ionicons name="close-outline" size={26} color={colors.textPrimary}/>
        </TouchableOpacity>),
            headerStyle: {
                backgroundColor: colors.background,
                elevation: 0,
                shadowOpacity: 0,
            },
            headerTintColor: colors.textPrimary,
        });
    }, [navigation]);
    useEffect(() => {
        moment.locale("pt-br");
        const today = moment();
        setCurrentDate(today.format("DD [de] MMMM [de] YYYY"));
    }, []);
    const handlePublish = () => {
        if (overallRating === 0) {
            showErrorNotification("Atenção", "Dê uma nota geral para o lugar.", {
                position: "bottom",
            });
            return;
        }
        setSubmitting(true);
        setTimeout(() => {
            showSuccessNotification("Avaliação publicada", "Sua experiência foi registrada.", {
                position: "bottom",
            });
            setSubmitting(false);
            navigation.goBack();
        }, 1500);
    };
    return (<KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: placeImage }} style={styles.placeImage}/>
          <View style={styles.placeNameOverlay}>
            <Text style={styles.placeName}>{placeName}</Text>
          </View>
        </View>

        <View style={styles.contentCard}>
          <View style={styles.ratingGroup}>
            <Text style={styles.ratingLabel}>Nota Geral</Text>
            <IconRating rating={overallRating} onRatingChange={setOverallRating} type="star"/>
          </View>
          <View style={styles.ratingGroup}>
            <Text style={styles.ratingLabel}>Comida</Text>
            <IconRating rating={foodRating} onRatingChange={setFoodRating} type="food"/>
          </View>
          <View style={styles.ratingGroup}>
            <Text style={styles.ratingLabel}>Serviço</Text>
            <IconRating rating={serviceRating} onRatingChange={setServiceRating} type="service"/>
          </View>
          <View style={styles.ratingGroup}>
            <Text style={styles.ratingLabel}>Ambiente</Text>
            <IconRating rating={ambianceRating} onRatingChange={setAmbianceRating} type="ambiance"/>
          </View>

          <View style={styles.inputRow}>
            <TextInput style={styles.inputField} placeholder="Preço Pago" placeholderTextColor="#C8C8C8" keyboardType="decimal-pad"/>
            <TextInput style={styles.inputField} placeholder="Nº de Pessoas" placeholderTextColor="#C8C8C8" keyboardType="numeric"/>
          </View>

          <View style={styles.dateInputContainer}>
            <Text style={styles.dateText}>{currentDate}</Text>
            <Ionicons name="calendar-outline" size={24} color={colors.textSecondary}/>
          </View>

          <TextInput style={styles.experienceInput} placeholder="Sua Experiência" placeholderTextColor="#C8C8C8" multiline textAlignVertical="top"/>
        </View>
      </ScrollView>

      <View style={styles.publishButtonContainer}>
        <TouchableOpacity style={[
            styles.publishButton,
            submitting && styles.publishButtonDisabled,
        ]} onPress={handlePublish} disabled={submitting}>
          {submitting ? (<ActivityIndicator color={colors.background}/>) : (<Text style={styles.publishButtonText}>Publicar</Text>)}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>);
};
export default AddReviewFormScreen;
