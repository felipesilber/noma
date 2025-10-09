import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import styles from "./styles";

const LoginScreen = ({ navigation }) => {
  const handleCreateAccount = () => navigation.navigate("Register");
  const handleLogin = () => navigation.navigate("Signin");

  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.contentContainer}>
        <Image
          source={require("../../../../assets/images/noma-logo.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />

        <TouchableOpacity
          style={styles.createAccountButton}
          onPress={handleCreateAccount}
          activeOpacity={0.85}
        >
          <Text style={styles.createAccountButtonText}>Criar conta</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          activeOpacity={0.85}
        >
          <Text style={styles.loginButtonText}>Já tenho conta</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
