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
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import api from "../../../services/api";

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

  const isValidEmail = /\S+@\S+\.\S+/.test(email);
  const isValidSenha = senha.length >= 6;
  const isConfirmOk = confirmSenha === senha && isValidSenha;
  const isUsernameOk = username.trim().length > 0;

  const canContinue =
    (step === 0 && isValidEmail) ||
    (step === 1 && isUsernameOk) ||
    (step === 2 && isValidSenha) ||
    (step === 3 && isConfirmOk);

  const titles = [
    "Qual é seu e-mail?",
    "Escolha um username",
    "Crie uma senha",
    "Confirme sua senha",
  ];

  function next() {
    if (!canContinue || loading) return;
    if (step < 3) setStep(step + 1);
    else handleConfirm();
  }

  function back() {
    if (loading) return;
    if (step > 0) setStep(step - 1);
    else navigation?.goBack?.();
  }

  async function handleConfirm() {
    try {
      setLoading(true);
      setErro(null);

      const cred = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        senha
      );

      try {
        await updateProfile(cred.user, { username: username });
      } catch {}
      try {
        await cred.user.getIdToken(true);
      } catch {}

      try {
        await api.patch("/user/me/username", { username: username.trim() });
      } catch (e) {
        setErro(
          "Não foi possível salvar o username (talvez já esteja em uso)."
        );
        return;
      }

      try {
        await sendEmailVerification(cred.user);
      } catch {}

      navigation?.replace?.("Main");
    } catch (e) {
      const code = e?.code || "";
      if (code.includes("email-already-in-use")) setErro("E-mail já em uso.");
      else if (code.includes("invalid-email")) setErro("E-mail inválido.");
      else setErro("Não foi possível criar a conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.progressWrap}>
        <View
          style={[styles.progressDot, step >= 0 && styles.progressActive]}
        />
        <View
          style={[styles.progressBar, step >= 1 && styles.progressActive]}
        />
        <View
          style={[styles.progressDot, step >= 1 && styles.progressActive]}
        />
        <View
          style={[styles.progressBar, step >= 2 && styles.progressActive]}
        />
        <View
          style={[styles.progressDot, step >= 2 && styles.progressActive]}
        />
        <View
          style={[styles.progressBar, step >= 3 && styles.progressActive]}
        />
        <View
          style={[styles.progressDot, step >= 3 && styles.progressActive]}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{titles[step]}</Text>

        {step === 0 && (
          <>
            <TextInput
              placeholder="E-mail"
              placeholderTextColor={colors.textSecondary}
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              editable={!loading}
            />
            {!isValidEmail && email.length > 0 ? (
              <Text style={styles.error}>Informe um e-mail válido.</Text>
            ) : null}
          </>
        )}

        {step === 1 && (
          <>
            <TextInput
              placeholder="Seu username"
              placeholderTextColor={colors.textSecondary}
              autoCapitalize="none"
              value={username}
              onChangeText={setUsername}
              style={styles.input}
              editable={!loading}
            />
            {!isUsernameOk && username.length === 0 ? (
              <Text style={styles.error}>Informe um username.</Text>
            ) : null}
          </>
        )}

        {step === 2 && (
          <>
            <View style={{ position: "relative" }}>
              <TextInput
                placeholder="Senha (mín. 6 caracteres)"
                placeholderTextColor={colors.textSecondary}
                secureTextEntry={!showSenha}
                textContentType="password"
                value={senha}
                onChangeText={setSenha}
                style={[styles.input, { paddingRight: 64 }]}
                editable={!loading}
              />
              <Pressable
                onPress={() => setShowSenha((s) => !s)}
                style={styles.toggle}
                hitSlop={8}
                disabled={loading}
              >
                <Text style={styles.toggleText}>
                  {showSenha ? "Ocultar" : "Mostrar"}
                </Text>
              </Pressable>
            </View>
            {!isValidSenha && senha.length > 0 ? (
              <Text style={styles.error}>
                A senha precisa ter pelo menos 6 caracteres.
              </Text>
            ) : null}
          </>
        )}

        {step === 3 && (
          <>
            <View style={{ position: "relative" }}>
              <TextInput
                placeholder="Confirmar senha"
                placeholderTextColor={colors.textSecondary}
                secureTextEntry={!showConfirm}
                textContentType="password"
                value={confirmSenha}
                onChangeText={setConfirmSenha}
                style={[styles.input, { paddingRight: 64 }]}
                editable={!loading}
              />
              <Pressable
                onPress={() => setShowConfirm((s) => !s)}
                style={styles.toggle}
                hitSlop={8}
                disabled={loading}
              >
                <Text style={styles.toggleText}>
                  {showConfirm ? "Ocultar" : "Mostrar"}
                </Text>
              </Pressable>
            </View>
            {confirmSenha.length > 0 && !isConfirmOk ? (
              <Text style={styles.error}>As senhas não coincidem.</Text>
            ) : null}
          </>
        )}

        {erro ? (
          <Text style={[styles.error, { marginTop: 8 }]}>{erro}</Text>
        ) : null}

        <View style={styles.actions}>
          <Pressable
            onPress={back}
            style={styles.secondaryBtn}
            hitSlop={8}
            disabled={loading}
          >
            <Text style={styles.secondaryText}>Voltar</Text>
          </Pressable>

          <Pressable
            disabled={!canContinue || loading}
            onPress={next}
            style={[
              styles.primaryBtn,
              { opacity: !canContinue || loading ? 0.5 : 1 },
            ]}
          >
            {loading ? (
              <ActivityIndicator color={colors.surface} />
            ) : (
              <Text style={styles.primaryText}>
                {step < 3 ? "Continuar" : "Confirmar"}
              </Text>
            )}
          </Pressable>
        </View>

        <Text style={styles.legal}>
          Ao continuar, você concorda com os Termos e a Política de Privacidade.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
