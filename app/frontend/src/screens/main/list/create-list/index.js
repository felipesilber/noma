import React, { useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView, TextInput, Switch, TouchableOpacity, ActivityIndicator, Image, StyleSheet, } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DraggableFlatList from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import styles from "./styles";
import colors from "../../../../theme/colors";
import api from "../../../../services/api";
import { useRoute } from "@react-navigation/native";
import { showErrorNotification, showSuccessNotification, } from "../../../../utils/notifications";
const AddedPlaceCard = ({ place, onRemove, onDrag, isRanking }) => (<View style={styles.addedPlaceCard}>
    {isRanking && (<TouchableOpacity onLongPress={onDrag} style={styles.dragHandle}>
        <Ionicons name="list-outline" size={24} color={colors.textSecondary}/>
      </TouchableOpacity>)}
    <Image source={{ uri: place.image }} style={styles.addedPlaceImage}/>
    <View style={styles.addedPlaceInfo}>
      <Text style={styles.addedPlaceName}>{place.name}</Text>
      <Text style={styles.addedPlaceAddress}>{place.address}</Text>
    </View>
    <TouchableOpacity onPress={onRemove}>
      <Ionicons name="trash-outline" size={24} color={colors.error}/>
    </TouchableOpacity>
  </View>);
const CreateListScreen = ({ navigation }) => {
    const route = useRoute();
    const [listName, setListName] = useState("");
    const [description, setDescription] = useState("");
    const [isRanking, setIsRanking] = useState(false);
    const [addedPlaces, setAddedPlaces] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    useEffect(() => {
        if (route.params?.newPlace) {
            setAddedPlaces((currentPlaces) => {
                const isAlreadyAdded = currentPlaces.some((p) => p.id === route.params.newPlace.id);
                if (isAlreadyAdded) {
                    showErrorNotification("Atenção", "Este lugar já foi adicionado.");
                    return currentPlaces;
                }
                return [...currentPlaces, route.params.newPlace];
            });
            navigation.setParams({ newPlace: null });
        }
    }, [route.params?.newPlace]);
    const handleRemovePlace = (placeId) => {
        setAddedPlaces((currentPlaces) => currentPlaces.filter((p) => p.id !== placeId));
    };
    const handleSave = useCallback(async () => {
        if (!listName.trim()) {
            showErrorNotification("Erro", "O nome da lista é obrigatório.");
            return;
        }
        setIsSaving(true);
        try {
            const placeIds = addedPlaces.map((p) => p.id);
            const newList = {
                name: listName,
                description: description || null,
                imageUrl: "https://picsum.photos/id/102/600/400",
                placeIds: placeIds,
                isRanking,
            };
            await api.post("/lists", newList);
            showSuccessNotification("Lista criada", "Sua lista foi salva com sucesso.");
            setIsSaving(false);
            navigation.getParent().goBack();
        }
        catch (err) {
            setIsSaving(false);
            console.error("Erro ao salvar lista:", err);
            showErrorNotification("Erro", "Não foi possível salvar a lista.");
        }
    }, [listName, description, addedPlaces, navigation]);
    useEffect(() => {
        navigation.setOptions({
            headerTitle: "Criar Nova Lista",
            headerLeft: () => (<TouchableOpacity onPress={() => navigation.getParent().goBack()} style={{ marginLeft: 16 }}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary}/>
        </TouchableOpacity>),
            headerRight: () => (<TouchableOpacity onPress={handleSave} disabled={isSaving} style={styles.headerSaveButton}>
          {isSaving ? (<ActivityIndicator size="small" color={colors.primary}/>) : (<Text style={styles.headerSaveButtonText}>Salvar</Text>)}
        </TouchableOpacity>),
        });
    }, [navigation, handleSave, isSaving]);
    return (<GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollViewContent} keyboardShouldPersistTaps="handled">
        <View style={styles.formContainer}>
          <Text style={styles.label}>Nome da Lista</Text>
          <TextInput style={styles.input} placeholder="Melhores Cafés de São Paulo" placeholderTextColor={colors.textSecondary} value={listName} onChangeText={setListName}/>

          <Text style={styles.label}>Adicione uma descrição</Text>
          <TextInput style={styles.inputDescription} placeholder="Minha seleção pessoal dos lugares mais aconchegantes..." placeholderTextColor={colors.textSecondary} value={description} onChangeText={setDescription} multiline/>

          <View style={styles.rankingRow}>
            <View style={styles.rankingInfo}>
              <Ionicons name="list-outline" size={24} color={colors.textSecondary} style={styles.rankingIcon}/>
              <Text style={styles.rankingText}>É um ranking?</Text>
            </View>
            <Switch trackColor={{ false: colors.divider, true: colors.primary }} thumbColor={colors.surface} ios_backgroundColor={colors.divider} onValueChange={setIsRanking} value={isRanking}/>
          </View>
          <Text style={styles.rankingSubtitle}>
            Ative para ordenar os estabelecimentos.
          </Text>

          <Text style={styles.label}>Adicionar Estabelecimentos</Text>
          <TouchableOpacity style={styles.searchBarContainer} onPress={() => navigation.navigate("AddPlaceSearch")}>
            <Ionicons name="search-outline" size={20} color={colors.textSecondary} style={styles.searchIcon}/>
            <Text style={styles.searchInputPlaceholder}>
              Busque por nome ou endereço
            </Text>
          </TouchableOpacity>

          {addedPlaces.length === 0 ? (<View style={styles.emptyStateContainer}>
              <Ionicons name="storefront-outline" size={40} color={colors.textSecondary} style={styles.emptyStateIcon}/>
              <Text style={styles.emptyStateText}>
                Nenhum lugar adicionado.
              </Text>
              <Text style={styles.emptyStateText}>
                Use a busca acima para começar.
              </Text>
            </View>) : (<DraggableFlatList data={addedPlaces} onDragEnd={({ data }) => setAddedPlaces(data)} keyExtractor={(item) => item.id.toString()} scrollEnabled={false} containerStyle={styles.addedPlacesList} renderItem={({ item, drag, isActive }) => (<AddedPlaceCard place={item} onRemove={() => handleRemovePlace(item.id)} onDrag={drag} isRanking={isRanking}/>)}/>)}
        </View>
      </ScrollView>
    </GestureHandlerRootView>);
};
export default CreateListScreen;
