import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import styles from "./styles";
import colors from "../../../theme/colors";
import { auth } from "../../../firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export const SigninScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [show, setShow] = useState(false);

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const isValidEmail = /\S+@\S+\.\S+/.test(email);
  const isValidSenha = senha.length >= 6;
  const canSubmit = isValidEmail && isValidSenha && !loading;

  async function handleLogin() {
    if (!canSubmit || loading) return;
    setLoading(true);
    setErro(null);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), senha);
      navigation.replace("Main");
    } catch (e) {
      const code = e?.code || "";
      if (code.includes("invalid-email")) setErro("E-mail inválido.");
      else if (code.includes("user-disabled"))
        setErro("Esta conta foi desativada.");
      else if (code.includes("user-not-found"))
        setErro("Usuário não encontrado.");
      else if (code.includes("wrong-password")) setErro("Senha incorreta.");
      else if (code.includes("too-many-requests"))
        setErro("Muitas tentativas. Tente novamente em instantes.");
      else if (code.includes("network-request-failed"))
        setErro("Falha de rede. Verifique sua conexão.");
      else setErro("Não foi possível entrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.progressWrap} />

      <View style={styles.content}>
        <Text style={styles.title}>Entrar</Text>

        <TextInput
          placeholder="E-mail"
          placeholderTextColor={colors.textSecondary}
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          value={email}
          onChangeText={setEmail}
          editable={!loading}
          style={styles.input}
        />
        {!isValidEmail && email.length > 0 ? (
          <Text style={styles.error}>Informe um e-mail válido.</Text>
        ) : null}

        <View style={{ position: "relative" }}>
          <TextInput
            placeholder="Senha"
            placeholderTextColor={colors.textSecondary}
            secureTextEntry={!show}
            textContentType="password"
            value={senha}
            onChangeText={setSenha}
            editable={!loading}
            style={[styles.input, { paddingRight: 64 }]}
          />
          <Pressable
            onPress={() => setShow((s) => !s)}
            style={styles.toggle}
            hitSlop={8}
            disabled={loading}
          >
            <Text style={styles.toggleText}>
              {show ? "Ocultar" : "Mostrar"}
            </Text>
          </Pressable>
        </View>
        {!isValidSenha && senha.length > 0 ? (
          <Text style={styles.error}>Mínimo de 6 caracteres.</Text>
        ) : null}

        {erro ? (
          <Text style={[styles.error, { marginTop: 8 }]}>{erro}</Text>
        ) : null}

        <View style={styles.actions}>
          <Pressable
            disabled={!canSubmit}
            onPress={handleLogin}
            style={[styles.primaryBtn, { opacity: canSubmit ? 1 : 0.5 }]}
          >
            {loading ? (
              <ActivityIndicator color={colors.surface} />
            ) : (
              <Text style={styles.primaryText}>Entrar</Text>
            )}
          </Pressable>
        </View>

        <Pressable onPress={() => navigation?.navigate?.("SignupSteps")}>
          <Text style={styles.link}>Não tem conta? Criar conta</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SigninScreen;
