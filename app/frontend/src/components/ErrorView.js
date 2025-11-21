import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import AppText from "./text";
import colors from "../theme/colors";

const ErrorView = ({ message, onRetry }) => {
  return (
    <View style={styles.container}>
      <AppText style={styles.text}>{message || "Ocorreu um erro."}</AppText>
      {onRetry && (
        <TouchableOpacity style={styles.button} onPress={onRetry}>
          <AppText weight="bold" style={styles.buttonText}>
            Tentar Novamente
          </AppText>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    color: "#FFF",
    textAlign: "center",
    marginBottom: 16,
    fontSize: 18,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: colors.textPrimary,
    fontSize: 16,
  },
});

export default ErrorView;

