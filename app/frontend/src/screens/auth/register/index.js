import React, { useState, useCallback, useEffect } from "react";
import { View, TextInput, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator, TouchableOpacity, ScrollView, } from "react-native";
import styles from "./styles";
import colors from "../../../theme/colors";
import { auth } from "../../../firebase/firebase";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile, } from "firebase/auth";
import api from "../../../services/api";
import { Ionicons } from "@expo/vector-icons";
import AppText from "../../../components/text";
import * as SplashScreen from "expo-splash-screen";
const RegisterScreen = ({ navigation }) => {
    const [step, setStep] = useState(0);
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmSenha, setConfirmSenha] = useState("");
    const [showSenha, setShowSenha] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState(null);
    const onLayoutRootView = useCallback(async () => {
        await SplashScreen.hideAsync();
    }, []);
    const isValidEmail = /\S+@\S+\.\S+/.test(email);
    const isValidSenha = senha.length >= 8;
    const isConfirmOk = confirmSenha === senha && isValidSenha;
    const isUsernameOk = username.trim().length > 2;
    const canContinue = (step === 0 && isValidEmail) ||
        (step === 1 && isUsernameOk) ||
        (step === 2 && isValidSenha) ||
        (step === 3 && isConfirmOk);
    const titles = [
        "Qual é o seu e-mail?",
        "Crie um nome de usuário",
        "Crie uma senha segura",
        "Confirme sua senha",
    ];
    const subtitles = [
        "Você usará este e-mail para fazer login.",
        "Escolha um nome de usuário único para sua conta.",
        "Mínimo de 8 caracteres, uma letra maiúscula e um número.",
        "Para sua segurança, digite sua senha novamente.",
    ];
    function next() {
        if (!canContinue || loading)
            return;
        if (step < 3)
            setStep(step + 1);
        else
            handleConfirm();
    }
    function back() {
        if (loading)
            return;
        if (step > 0)
            setStep(step - 1);
        else
            navigation?.goBack?.();
    }
    async function handleConfirm() {
        try {
            setLoading(true);
            setErro(null);
            const cred = await createUserWithEmailAndPassword(auth, email.trim(), senha);
            await updateProfile(cred.user, { displayName: username.trim() });
            await cred.user.getIdToken(true);
            try {
                await api.patch("/user/me/username", { username: username.trim() });
            }
            catch (e) {
                setErro("Não foi possível salvar o username (talvez já esteja em uso).");
                return;
            }
            await sendEmailVerification(cred.user).catch(console.warn);
            navigation?.replace?.("Main");
        }
        catch (e) {
            const code = e?.code || "";
            if (code.includes("email-already-in-use"))
                setErro("E-mail já em uso.");
            else if (code.includes("invalid-email"))
                setErro("E-mail inválido.");
            else
                setErro("Não foi possível criar a conta. Tente novamente.");
        }
        finally {
            setLoading(false);
        }
    }
    return (<KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"} onLayout={onLayoutRootView}>
      <View style={styles.header}>
        <TouchableOpacity onPress={back} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary}/>
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        <AppText style={styles.progressStepText}>Etapa {step + 1} de 4</AppText>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${(step + 1) * 25}%` }]}/>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <AppText weight="bold" style={styles.title}>
          {titles[step]}
        </AppText>
        <AppText style={styles.subtitle}>{subtitles[step]}</AppText>

        {step === 0 && (<>
            <AppText style={styles.label}>E-mail</AppText>
            <View style={styles.inputContainer}>
              <TextInput placeholder="Digite seu e-mail" placeholderTextColor={colors.textSecondary} autoCapitalize="none" keyboardType="email-address" textContentType="emailAddress" value={email} onChangeText={setEmail} style={styles.input} editable={!loading}/>
            </View>
            {!isValidEmail && email.length > 0 ? (<AppText style={styles.error}>Informe um e-mail válido.</AppText>) : null}
          </>)}

        {step === 1 && (<>
            <AppText style={styles.label}>Nome de usuário</AppText>
            <View style={styles.inputContainer}>
              <Ionicons name="at" size={20} color={colors.textSecondary} style={styles.inputIcon}/>
              <TextInput placeholder="Digite seu nome de usuário" placeholderTextColor={colors.textSecondary} autoCapitalize="none" value={username} onChangeText={setUsername} style={styles.inputWithIcon} editable={!loading}/>
            </View>
            {!isUsernameOk && username.length > 0 ? (<AppText style={styles.error}>
                O nome de usuário deve ter pelo menos 3 caracteres.
              </AppText>) : null}
          </>)}

        {step === 2 && (<>
            <AppText style={styles.label}>Senha</AppText>
            <View style={styles.inputContainer}>
              <TextInput placeholder="Senha" placeholderTextColor={colors.textSecondary} secureTextEntry={!showSenha} textContentType="password" value={senha} onChangeText={setSenha} style={styles.input} editable={!loading}/>
              <TouchableOpacity onPress={() => setShowSenha((s) => !s)} style={styles.toggleIcon}>
                <Ionicons name={showSenha ? "eye-off-outline" : "eye-outline"} size={24} color={colors.textSecondary}/>
              </TouchableOpacity>
            </View>
            {!isValidSenha && senha.length > 0 ? (<AppText style={styles.error}>
                A senha precisa ter pelo menos 8 caracteres.
              </AppText>) : null}
          </>)}

        {step === 3 && (<>
            <AppText style={styles.label}>Confirmar Senha</AppText>
            <View style={styles.inputContainer}>
              <TextInput placeholder="Confirme sua Senha" placeholderTextColor={colors.textSecondary} secureTextEntry={!showConfirm} textContentType="password" value={confirmSenha} onChangeText={setConfirmSenha} style={styles.input} editable={!loading}/>
              <TouchableOpacity onPress={() => setShowConfirm((s) => !s)} style={styles.toggleIcon}>
                <Ionicons name={showConfirm ? "eye-off-outline" : "eye-outline"} size={24} color={colors.textSecondary}/>
              </TouchableOpacity>
            </View>
            {confirmSenha.length > 0 && !isConfirmOk ? (<AppText style={styles.error}>As senhas não coincidem.</AppText>) : null}
          </>)}

        {erro ? (<AppText style={[styles.error, { marginTop: 8 }]}>{erro}</AppText>) : null}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable onPress={back} style={styles.secondaryBtn} hitSlop={8} disabled={loading}>
          <AppText weight="bold" style={styles.secondaryText}>
            Voltar
          </AppText>
        </Pressable>

        <Pressable disabled={!canContinue || loading} onPress={next} style={[
            styles.primaryBtn,
            { opacity: !canContinue || loading ? 0.6 : 1 },
        ]}>
          {loading ? (<ActivityIndicator color={colors.surface}/>) : (<AppText weight="bold" style={styles.primaryText}>
              {step < 3 ? "Continuar" : "Finalizar Cadastro"}
            </AppText>)}
        </Pressable>
      </View>
    </KeyboardAvoidingView>);
};
export default RegisterScreen;
