import React, { useEffect, useCallback, useState } from "react";
import { StatusBar, Platform, View, StyleSheet, Text } from "react-native";
import AppNavigator from "./navigation";
import FlashMessage from "react-native-flash-message";
import colors from "./theme/colors";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

const App = () => {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync({
          "Nunito-Regular": require("../assets/fonts/Nunito-Regular.ttf"),
          "Nunito-Bold": require("../assets/fonts/Nunito-Bold.ttf"),
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  if (Text.defaultProps == null) Text.defaultProps = {};
  Text.defaultProps.style = { fontFamily: "Nunito-Regular" };

  return (
    <View style={styles.root} onLayout={onLayoutRootView}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <AppNavigator />
      <FlashMessage
        position="top"
        statusBarHeight={
          Platform.OS === "ios" ? 44 : StatusBar.currentHeight || 0
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

export default App;
