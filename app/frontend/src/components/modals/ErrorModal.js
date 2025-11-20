import React from "react";
import { Modal, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../theme/colors";
import AppText from "../text";
import styles from "./styles";
const ErrorModal = ({ visible, title = "Erro", message, onClose }) => {
    return (<Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          <Ionicons name="alert-circle" size={36} color={colors.error} style={{ marginBottom: 8 }}/>
          <AppText weight="bold" style={styles.title}>{title}</AppText>
          <AppText style={styles.message}>{message}</AppText>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <AppText weight="bold" style={styles.buttonText}>Ok</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>);
};
export default ErrorModal;


