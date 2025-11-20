import React, { useState } from "react";
import { View, TouchableOpacity, SafeAreaView, ImageBackground, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, Keyboard, TouchableWithoutFeedback } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase/firebase";
import styles from "./styles";
import colors from "../../../theme/colors";
import AppText from "../../../components/text";
import ErrorModal from "../../../components/modals/ErrorModal";
const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const handleCreateAccount = () => navigation.navigate("Register");
    const handleLogin = async () => {
        if (!email || !password) {
            setErrorMsg("Por favor, preencha o e-mail e a senha.");
            return;
        }
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email.trim(), password);
            navigation.replace("Main");
        }
        catch (e) {
            console.error("Erro no login:", e);
            const code = e?.code || "";
            if (code.includes("invalid-email"))
                setErrorMsg("E-mail inválido.");
            else if (code.includes("user-disabled"))
                setErrorMsg("Esta conta foi desativada.");
            else if (code.includes("user-not-found"))
                setErrorMsg("Usuário não encontrado.");
            else if (code.includes("wrong-password"))
                setErrorMsg("Senha incorreta.");
            else if (code.includes("too-many-requests"))
                setErrorMsg("Muitas tentativas. Tente novamente em instantes.");
            else if (code.includes("network-request-failed"))
                setErrorMsg("Falha de rede. Verifique sua conexão.");
            else
                setErrorMsg("E-mail ou senha inválidos. Tente novamente.");
        }
        finally {
            setLoading(false);
        }
    };
    return (<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ImageBackground source={require("../../../../assets/images/login-background.png")} resizeMode="cover" style={styles.background} blurRadius={0}>
        <View style={styles.overlay} pointerEvents="none"/>
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
      <ErrorModal visible={!!errorMsg} message={errorMsg || ""} onClose={() => setErrorMsg(null)}/>
    </KeyboardAvoidingView>
    </TouchableWithoutFeedback>);
};
export default LoginScreen;
