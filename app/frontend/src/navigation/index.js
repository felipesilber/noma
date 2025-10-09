import React from "react";
import { Platform, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import colors from "../theme/colors";
import AppTheme from "../theme/theme";

import LoginScreen from "../screens/auth/login";
import RegisterScreen from "../screens/auth/register";
import SigninScreen from "../screens/auth/signin";

import HomeScreen from "../screens/main/home";
import ProfileScreen from "../screens/main/profile";
import SavedScreen from "../screens/main/saved";
import PlaceDetailScreen from "../screens/main/place-detail";

import ExploreScreen from "../screens/main/explore";
import CategoryScreen from "../screens/main/explore/category";
import SearchScreen from "../screens/main/explore/search";

import AddReviewSearchScreen from "../screens/main/add-review/search";
import AddReviewFormScreen from "../screens/main/add-review/review";

const AuthStack = createNativeStackNavigator();
const MainTab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();
const AddReviewStack = createNativeStackNavigator();
const ExploreStack = createNativeStackNavigator();

const slideStackOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: colors.background },
  gestureEnabled: true,
  fullScreenGestureEnabled: true,
  animation: "slide_from_right",
  animationTypeForReplace: "push",
};

const commonStackOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: colors.background },
};

const AddReviewModalFlow = () => (
  <AddReviewStack.Navigator screenOptions={slideStackOptions}>
    <AddReviewStack.Screen
      name="AddReviewSearch"
      component={AddReviewSearchScreen}
    />
    <AddReviewStack.Screen
      name="AddReviewForm"
      component={AddReviewFormScreen}
    />
  </AddReviewStack.Navigator>
);

const ExploreFlow = () => (
  <ExploreStack.Navigator
    screenOptions={slideStackOptions}
    initialRouteName="ExploreHome"
  >
    <ExploreStack.Screen
      name="ExploreHome"
      component={ExploreScreen}
      options={{ headerShown: false }}
    />
    <ExploreStack.Screen
      name="Category"
      component={CategoryScreen}
      options={{ headerShown: false, title: "", headerShadowVisible: false }}
    />
    <ExploreStack.Screen
      name="Search"
      component={SearchScreen}
      options={{
        headerShown: true,
        title: "Buscar",
        headerShadowVisible: false,
      }}
    />
  </ExploreStack.Navigator>
);

const MainTabs = () => (
  <MainTab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarShowLabel: false,
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: "#888",
      tabBarStyle: {
        position: "absolute",
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.divider,
        height: 80,
        paddingBottom: 10,
      },
    }}
  >
    <MainTab.Screen
      name="Noma"
      component={HomeScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="home-outline" size={size} color={color} />
        ),
      }}
    />

    <MainTab.Screen
      name="ExploreTab"
      component={ExploreFlow}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="search-outline" size={size} color={color} />
        ),
      }}
    />

    <MainTab.Screen
      name="AddDummyTab"
      component={() => null}
      options={{
        tabBarButton: (props) => (
          <TouchableOpacity {...props} style={{ top: -20 }}>
            <Ionicons name="add-circle" size={70} color={colors.primary} />
          </TouchableOpacity>
        ),
      }}
      listeners={({ navigation }) => ({
        tabPress: (e) => {
          e.preventDefault();
          navigation.navigate("AddReviewFlow");
        },
      })}
    />

    <MainTab.Screen
      name="SavedTab"
      component={SavedScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="bookmark-outline" size={size} color={color} />
        ),
      }}
    />
    <MainTab.Screen
      name="ProfileTab"
      component={ProfileScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="person-outline" size={size} color={color} />
        ),
      }}
    />
  </MainTab.Navigator>
);

const AuthStackScreens = () => (
  <AuthStack.Navigator
    screenOptions={{
      ...slideStackOptions,
      headerShown: true,
      headerStyle: { backgroundColor: colors.surface },
      headerTintColor: colors.textPrimary,
    }}
  >
    <AuthStack.Screen
      name="Login"
      component={LoginScreen}
      options={{ headerShown: false }}
    />
    <AuthStack.Screen
      name="Register"
      component={RegisterScreen}
      options={{ title: "Cadastro" }}
    />
    <AuthStack.Screen
      name="Signin"
      component={SigninScreen}
      options={{ title: "Entrar" }}
    />
  </AuthStack.Navigator>
);

const AppNavigator = () => (
  <NavigationContainer theme={AppTheme}>
    <RootStack.Navigator
      initialRouteName="Auth"
      screenOptions={slideStackOptions}
    >
      <RootStack.Screen
        name="Auth"
        component={AuthStackScreens}
        options={{ headerShown: false }}
      />
      <RootStack.Screen name="Main" component={MainTabs} />
      <RootStack.Screen
        name="PlaceDetail"
        component={PlaceDetailScreen}
        options={{ animation: "slide_from_right" }}
      />
      <RootStack.Screen
        name="AddReviewFlow"
        component={AddReviewModalFlow}
        options={{
          presentation: "modal",
          animation:
            Platform.OS === "ios" ? "slide_from_bottom" : "slide_from_bottom",
        }}
      />
    </RootStack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
