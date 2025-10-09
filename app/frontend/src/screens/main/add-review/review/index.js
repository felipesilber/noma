import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";
import colors from "../../../../theme/colors";
import StarRating from "../../../../components/star-rating";
import moment from "moment";
import "moment/locale/pt-br";
import api from "../../../../services/api";
import { showMessage } from "react-native-flash-message";

const AddReviewFormScreen = ({ route, navigation }) => {
  const { placeId, placeName, placeImage } = route.params;

  const [overallRating, setOverallRating] = useState(0);
  const [foodRating, setFoodRating] = useState(0);
  const [serviceRating, setServiceRating] = useState(0);
  const [ambianceRating, setAmbianceRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [price, setPrice] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    moment.updateLocale("pt-br", {
      months:
        "janeiro_fevereiro_março_abril_maio_junho_julho_agosto_setembro_outubro_novembro_dezembro".split(
          "_"
        ),
    });
    const today = moment().locale("pt-br");
    const formattedDate = today.calendar(null, {
      sameDay: "[Hoje], DD [de] MMMM [de] YYYY",
      nextDay: "[Amanhã], DD [de] MMMM [de] YYYY",
      nextWeek: "dddd, DD [de] MMMM [de] YYYY",
      lastDay: "[Ontem], DD [de] MMMM [de] YYYY",
      lastWeek: "[Última] dddd, DD [de] MMMM [de] YYYY",
      sameElse: "DD [de] MMMM [de] YYYY",
    });
    setCurrentDate(formattedDate);
  }, []);

  const validate = () => {
    const anyZero = [
      overallRating,
      foodRating,
      serviceRating,
      ambianceRating,
    ].some((r) => r === 0);
    if (anyZero) {
      Alert.alert(
        "Erro",
        "Por favor, avalie todas as categorias com estrelas."
      );
      return false;
    }
    if (reviewText.trim().length < 10) {
      Alert.alert("Erro", "Sua crítica deve ter no mínimo 10 caracteres.");
      return false;
    }
    return true;
  };

  const parsePrice = (s) => {
    if (!s) return 0;
    const normalized = s
      .replace(/\s/g, "")
      .replace(/\./g, "")
      .replace(",", ".");
    const n = Number(normalized);
    return Number.isFinite(n) ? n : NaN;
  };

  const handleSaveReview = async () => {
    if (!validate()) return;

    const priceNumber = parsePrice(price);
    if (price && !Number.isFinite(priceNumber)) {
      Alert.alert("Erro", "Preço inválido. Use o formato 54,90.");
      return;
    }

    try {
      setSubmitting(true);
      const body = {
        placeId,
        generalRating: overallRating,
        foodRating: foodRating,
        serviceRating: serviceRating,
        environmentRating: ambianceRating,
        price: priceNumber,
        comment: reviewText.trim(),
      };
      await api.post("/review/create", body);
      showMessage({
        message: "Review criada com sucesso!",
        type: "success",
        icon: "success",
        duration: 2500,
      });
      navigation.goBack();
    } catch (e) {
      showMessage({
        message: "Erro ao salvar",
        description: "Tente novamente mais tarde",
        type: "danger",
        icon: "danger",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const headerImage = placeImage || "https://picsum.photos/id/163/600/400";

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.topBarButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
        >
          <Ionicons name="arrow-back" size={22} color={colors.surface} />
        </TouchableOpacity>

        <View style={styles.topBarRight}>
          <TouchableOpacity
            onPress={submitting ? undefined : handleSaveReview}
            style={[
              styles.topBarSaveButton,
              submitting && styles.topBarSaveDisabled,
            ]}
            disabled={submitting}
            activeOpacity={0.85}
          >
            {submitting ? (
              <ActivityIndicator color={colors.surface} />
            ) : (
              <Text style={styles.topBarSaveText}>Salvar</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Image source={{ uri: headerImage }} style={styles.headerImage} />

        <View style={styles.contentContainer}>
          <Text style={styles.placeName}>{placeName}</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Data</Text>
            <Text style={styles.detailValue}>{currentDate}</Text>
          </View>

          <View style={styles.ratingSection}>
            <Text style={styles.ratingLabel}>Nota</Text>
            <StarRating
              preset="overall"
              initialRating={overallRating}
              onRatingChange={setOverallRating}
              size={28}
              colorActive={colors.primary}
            />
          </View>

          <View style={styles.ratingSection}>
            <Text style={styles.ratingLabel}>Comida</Text>
            <StarRating
              preset="food"
              initialRating={foodRating}
              onRatingChange={setFoodRating}
              size={28}
              colorActive={colors.primary}
            />
          </View>

          <View style={styles.ratingSection}>
            <Text style={styles.ratingLabel}>Serviço</Text>
            <StarRating
              preset="service"
              initialRating={serviceRating}
              onRatingChange={setServiceRating}
              size={28}
              colorActive={colors.primary}
            />
          </View>

          <View style={styles.ratingSection}>
            <Text style={styles.ratingLabel}>Ambiente</Text>
            <StarRating
              preset="ambience"
              initialRating={ambianceRating}
              onRatingChange={setAmbianceRating}
              size={28}
              colorActive={colors.primary}
            />
          </View>

          <View style={styles.ratingSection}>
            <Text style={styles.ratingLabel}>Preço (R$)</Text>
            <TextInput
              style={styles.priceInput}
              placeholder="ex: 54,90"
              placeholderTextColor={colors.textSecondary}
              keyboardType="decimal-pad"
              value={price}
              onChangeText={setPrice}
              editable={!submitting}
            />
          </View>

          <TextInput
            style={styles.reviewInput}
            placeholder="Adicione uma crítica..."
            placeholderTextColor={colors.textSecondary}
            multiline
            textAlignVertical="top"
            value={reviewText}
            onChangeText={setReviewText}
            editable={!submitting}
          />

          <View style={{ height: 24 }} />
        </View>
      </ScrollView>
    </View>
  );
};

export default AddReviewFormScreen;
