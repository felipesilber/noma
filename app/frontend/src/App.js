import React, { useEffect, useCallback, useState } from "react";
import { StatusBar, Platform, View, StyleSheet, Text, TouchableWithoutFeedback, Keyboard } from "react-native";
import AppNavigator from "./navigation";
import FlashMessage from "react-native-flash-message";
import colors from "./theme/colors";
import * as Font from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
SplashScreen.preventAutoHideAsync();
const App = () => {
    const [appIsReady, setAppIsReady] = useState(false);
    useEffect(() => {
        async function prepare() {
            try {
                await Font.loadAsync({
                    "Jakarta-Regular": require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
                    "Jakarta-Bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
                });
            }
            catch (e) {
                console.warn(e);
            }
            finally {
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
    return (<GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        {Platform.OS === "web" ? (<View style={styles.root} onLayout={onLayoutRootView}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background}/>
            <AppNavigator />
            <View pointerEvents="none">
              <FlashMessage position="top" statusBarHeight={Platform.OS === "ios" ? 44 : StatusBar.currentHeight || 0}/>
            </View>
          </View>) : (<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.root} onLayout={onLayoutRootView}>
              <StatusBar barStyle="light-content" backgroundColor={colors.background}/>
              <AppNavigator />
              <FlashMessage position="top" statusBarHeight={Platform.OS === "ios" ? 44 : StatusBar.currentHeight || 0}/>
            </View>
          </TouchableWithoutFeedback>)}
      </SafeAreaProvider>
    </GestureHandlerRootView>);
};
const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: colors.background,
    },
});
export default App;
