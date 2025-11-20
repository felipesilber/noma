import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, Modal, } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import styles from "./styles";
import colors from "../../../../theme/colors";
import moment from "moment";
import "moment/locale/pt-br";
import { showErrorNotification, showSuccessNotification, } from "../../../../utils/notifications";
import api from "../../../../services/api";

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
    const { placeId, placeName = "Bar do Zé", placeImage = "https://picsum.photos/id/163/800/600", } = route.params || {};
    const [overallRating, setOverallRating] = useState(0);
    const [foodRating, setFoodRating] = useState(0);
    const [serviceRating, setServiceRating] = useState(0);
    const [ambianceRating, setAmbianceRating] = useState(0);
    const [pricePaid, setPricePaid] = useState("");
    const [numberOfPeople, setNumberOfPeople] = useState("");
    const [reviewText, setReviewText] = useState("");
    const [currentDate, setCurrentDate] = useState("");
    const [visitDate, setVisitDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const isFormValid = (() => {
        const price = Number(pricePaid);
        const people = Number(numberOfPeople);
        return (overallRating > 0 &&
            foodRating > 0 &&
            serviceRating > 0 &&
            ambianceRating > 0 &&
            !!reviewText?.trim?.() &&
            Number.isFinite(price) &&
            price > 0 &&
            Number.isInteger(people) &&
            people > 0 &&
            visitDate instanceof Date);
    })();
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
        setCurrentDate(moment(visitDate).format("DD [de] MMMM [de] YYYY"));
    }, [visitDate]);
    const openDatePicker = () => setShowDatePicker(true);
    const onChangeDate = (event, selectedDate) => {
        // Android fires its own modal; close on selection or dismissal
        if (Platform.OS === "android") {
            if (event.type === "set" && selectedDate) {
                setVisitDate(selectedDate);
            }
            setShowDatePicker(false);
            return;
        }
        // iOS updates live; keep modal open until user confirma
        if (selectedDate) {
            setVisitDate(selectedDate);
        }
    };
    const handlePublish = async () => {
        if (!isFormValid) {
            showErrorNotification("Atenção", "Preencha todos os campos obrigatórios.", {
                position: "bottom",
            });
            return;
        }
        setSubmitting(true);
        try {
            await api.post("/reviews", {
                placeId: Number(placeId),
                generalRating: overallRating,
                foodRating,
                serviceRating,
                environmentRating: ambianceRating,
                pricePaid: Number(pricePaid),
                numberOfPeople: Number(numberOfPeople),
                comment: reviewText,
            });
            showSuccessNotification("Avaliação publicada", "Sua experiência foi registrada.", {
                position: "bottom",
            });
            navigation.goBack();
        } catch (error) {
            console.error("Erro ao publicar review:", error);
            showErrorNotification("Erro", "Não foi possível publicar sua avaliação. Tente novamente.", {
                position: "bottom",
            });
        } finally {
            setSubmitting(false);
        }
    };
    const renderWebDatePicker = () => {
        if (!showDatePicker)
            return null;
        const days = [];
        const today = new Date();
        for (let i = 0; i < 180; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            days.push({
                label: moment(d).format("DD [de] MMMM [de] YYYY"),
                date: d,
            });
        }
        return (<Modal visible transparent animationType="fade" onRequestClose={() => setShowDatePicker(false)}>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", padding: 24 }}>
          <View style={{ backgroundColor: "#1b1f27", borderRadius: 12, maxHeight: "80%" }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#2a2f3a" }}>
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>Escolher data</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                <Ionicons name="close-outline" size={22} color="#fff"/>
              </TouchableOpacity>
            </View>
            <ScrollView style={{ paddingHorizontal: 12, paddingVertical: 8 }}>
              {days.map((opt, idx) => (<TouchableOpacity key={idx} style={{ paddingVertical: 12, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: "#2a2f3a" }} onPress={() => {
                        setVisitDate(opt.date);
                        setShowDatePicker(false);
                    }}>
                  <Text style={{ color: "#fff", fontSize: 16 }}>{opt.label}</Text>
                </TouchableOpacity>))}
            </ScrollView>
          </View>
        </View>
      </Modal>);
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
            <TextInput style={styles.inputField} placeholder="Preço Pago" placeholderTextColor="#C8C8C8" keyboardType="decimal-pad" value={pricePaid} onChangeText={setPricePaid}/>
            <TextInput style={styles.inputField} placeholder="Nº de Pessoas" placeholderTextColor="#C8C8C8" keyboardType="numeric" value={numberOfPeople} onChangeText={setNumberOfPeople}/>
          </View>

          <TouchableOpacity style={styles.dateInputContainer} onPress={openDatePicker} activeOpacity={0.8}>
            <Text style={styles.dateText}>{currentDate}</Text>
            <Ionicons name="calendar-outline" size={24} color={colors.textSecondary}/>
          </TouchableOpacity>
          {Platform.OS === "ios" ? (<Modal visible={showDatePicker} transparent animationType="fade" onRequestClose={() => setShowDatePicker(false)}>
              <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }}>
                <View style={{ backgroundColor: "#1b1f27", paddingTop: 12, paddingBottom: 8, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 16, marginBottom: 8 }}>
                    <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                      <Text style={{ color: colors.textSecondary, fontSize: 16 }}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                      <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>Concluir</Text>
                    </TouchableOpacity>
                  </View>
                  <DateTimePicker value={visitDate} mode="date" display="spinner" onChange={onChangeDate} maximumDate={new Date()} themeVariant="dark" textColor="#FFFFFF"/>
                </View>
              </View>
            </Modal>) : Platform.OS === "web" ? (renderWebDatePicker()) : (showDatePicker && (<DateTimePicker value={visitDate} mode="date" display="default" onChange={onChangeDate} maximumDate={new Date()}/>))} 

          <TextInput style={styles.experienceInput} placeholder="Sua Experiência" placeholderTextColor="#C8C8C8" multiline textAlignVertical="top" value={reviewText} onChangeText={setReviewText}/>
        </View>
      </ScrollView>

      <View style={styles.publishButtonContainer}>
        <TouchableOpacity style={[
            styles.publishButton,
            (submitting || !isFormValid) && styles.publishButtonDisabled,
        ]} onPress={handlePublish} disabled={submitting || !isFormValid}>
          {submitting ? (<ActivityIndicator color={colors.background}/>) : (<Text style={styles.publishButtonText}>Publicar</Text>)}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>);
};
export default AddReviewFormScreen;
