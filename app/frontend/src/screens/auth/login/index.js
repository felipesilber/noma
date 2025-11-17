import React, { useState } from "react";
import { View, TouchableOpacity, SafeAreaView, ImageBackground, TextInput, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase/firebase";
import styles from "./styles";
import colors from "../../../theme/colors";
import AppText from "../../../components/text";
const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const handleCreateAccount = () => navigation.navigate("Register");
    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Erro", "Por favor, preencha o e-mail e a senha.");
            return;
        }
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email.trim(), password);
            navigation.replace("Main");
        }
        catch (e) {
            console.error("Erro no login:", e);
            Alert.alert("Erro de Login", "E-mail ou senha inválidos. Tente novamente.");
        }
        finally {
            setLoading(false);
        }
    };
    return (<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ImageBackground source={require("../../../../assets/images/login-background.png")} resizeMode="cover" style={styles.background} blurRadius={0}>
        <View style={styles.overlay}/>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.contentContainer}>
            <View style={styles.header}>
              <AppText weight="bold" style={styles.logo}>
                Noma
              </AppText>
            </View>

            <View style={styles.formContainer}>
              <TouchableOpacity style={styles.socialButton}>
                <View style={styles.googleIconContainer}>
                  <Ionicons name="logo-google" size={20} color="#FFF"/>
                </View>
                <AppText weight="medium" style={styles.socialButtonText}>
                  Continuar com Google
                </AppText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <View style={styles.facebookIconContainer}>
                  <Ionicons name="logo-facebook" size={14} color="#FFF"/>
                </View>
                <AppText weight="medium" style={styles.socialButtonText}>
                  Continuar com Facebook
                </AppText>
              </TouchableOpacity>

              <AppText style={styles.separator}>ou</AppText>

              <TextInput style={styles.input} placeholder="Seu e-mail" placeholderTextColor="rgba(255, 255, 255, 0.7)" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" selectionColor={colors.primary}/>
              <TextInput style={styles.input} placeholder="Sua senha" placeholderTextColor="rgba(255, 255, 255, 0.7)" value={password} onChangeText={setPassword} secureTextEntry selectionColor={colors.primary}/>

              <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
                {loading ? (<ActivityIndicator color={colors.textPrimary}/>) : (<AppText weight="bold" style={styles.loginButtonText}>
                    Entrar
                  </AppText>)}
              </TouchableOpacity>

              <View style={styles.footer}>
                <TouchableOpacity onPress={handleCreateAccount}>
                  <AppText style={styles.footerText}>
                    Ainda não tem conta?{" "}
                    <AppText weight="bold" style={styles.footerLink}>
                      Cadastre-se
                    </AppText>
                  </AppText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </KeyboardAvoidingView>);
};
export default LoginScreen;
