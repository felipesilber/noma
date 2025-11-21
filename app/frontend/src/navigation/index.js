import React from "react";
import { Platform, TouchableOpacity, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "../theme/colors";
import AppTheme from "../theme/theme";
import LoginScreen from "../screens/auth/login";
import RegisterScreen from "../screens/auth/register";
import SigninScreen from "../screens/auth/signin";
import HomeScreen from "../screens/main/home";
import ProfileScreen from "../screens/main/profile";
import UserPlacesScreen from "../screens/main/profile/user-places";
import SavedScreen from "../screens/main/saved";
import PlaceDetailScreen from "../screens/main/place-detail";
import AllReviewsScreen from "../screens/main/place-detail/all-reviews";
import ListDetailScreen from "../screens/main/list";
import ExploreLandingScreen from "../screens/main/explore/choose-type";
import ExploreCategoryScreen from "../screens/main/explore/category/search";
import CategoryScreen from "../screens/main/explore/category/one-category";
import ExplorePeopleScreen from "../screens/main/explore/people";
import SearchScreen from "../screens/main/explore/search";
import AddReviewSearchScreen from "../screens/main/add-review/search";
import AddReviewFormScreen from "../screens/main/add-review/review";
import CreateListScreen from "../screens/main/list/create-list";
import AddPlaceToListScreen from "../screens/main/list/create-list/add-place";
import AddFavoriteScreen from "../screens/main/profile/add-favorite";
import EditFavoritesScreen from "../screens/main/profile/edit-favorites";
import EditListsScreen from "../screens/main/profile/edit-lists";
import ConnectionsScreen from "../screens/main/profile/connections";
import BackButton from "../components/BackButton";
const AuthStack = createNativeStackNavigator();
const MainTab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();
const AddReviewStack = createNativeStackNavigator();
const ExploreStack = createNativeStackNavigator();
const ListStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();
const slideStackOptions = {
    headerShown: false,
    contentStyle: { backgroundColor: colors.background },
    gestureEnabled: true,
    fullScreenGestureEnabled: true,
    animation: "slide_from_right",
    animationTypeForReplace: "push",
};
const AddReviewModalFlow = () => (<AddReviewStack.Navigator screenOptions={slideStackOptions}>
    <AddReviewStack.Screen name="AddReviewSearch" component={AddReviewSearchScreen}/>
    <AddReviewStack.Screen name="AddReviewForm" component={AddReviewFormScreen}/>
  </AddReviewStack.Navigator>);
const CreateListFlow = () => (<ListStack.Navigator screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.textPrimary,
        headerTitleAlign: "center",
        headerShadowVisible: false,
    }}>
    <ListStack.Screen name="CreateListForm" component={CreateListScreen}/>
    <ListStack.Screen name="AddPlaceSearch" component={AddPlaceToListScreen} options={{ headerShown: false, animation: "slide_from_right" }}/>
  </ListStack.Navigator>);
const HomeFlow = () => (<HomeStack.Navigator screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.textPrimary,
        headerTitleAlign: "center",
        headerShadowVisible: false,
        animation: "slide_from_right",
    }}>
    <HomeStack.Screen name="HomeMain" component={HomeScreen} options={{ headerShown: false }}/>
    <HomeStack.Screen name="PlaceDetail" component={PlaceDetailScreen} options={{ headerShown: false }}/>
    <HomeStack.Screen name="PlaceAllReviews" component={AllReviewsScreen} options={{ headerShown: false }}/>
    <HomeStack.Screen name="UserConnections" component={ConnectionsScreen} options={{ headerShown: false }}/>
  </HomeStack.Navigator>);
const ProfileFlow = () => (<ProfileStack.Navigator screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.textPrimary,
        headerTitleAlign: "center",
        headerShadowVisible: false,
        animation: "slide_from_right",
    }}>
    <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} options={{ headerShown: false }}/>
    <ProfileStack.Screen name="PlaceDetail" component={PlaceDetailScreen} options={{ headerShown: false }}/>
    <ProfileStack.Screen name="PlaceAllReviews" component={AllReviewsScreen} options={{ headerShown: false }}/>
    <ProfileStack.Screen name="UserConnections" component={ConnectionsScreen} options={{ headerShown: false }}/>
  </ProfileStack.Navigator>);
const ExploreFlow = () => (<ExploreStack.Navigator initialRouteName="ExploreLanding" screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.textPrimary,
        headerTitleAlign: "center",
        headerShadowVisible: false,
        headerBackTitleVisible: false,
        headerTitleStyle: {
            fontSize: 18,
            fontWeight: "bold",
        },
        animation: "slide_from_right",
    }}>
    <ExploreStack.Screen name="ExploreLanding" component={ExploreLandingScreen} options={{
        headerShown: false,
    }}/>
    <ExploreStack.Screen name="ExploreCategories" component={ExploreCategoryScreen} options={{ title: "Explorar Lugares", headerBackTitleVisible: false }}/>
    <ExploreStack.Screen name="ExplorePeople" component={ExplorePeopleScreen} options={({ navigation }) => ({
        title: "Explorar Pessoas",
        headerLeft: () => (<BackButton onPress={() => navigation.canGoBack()
                ? navigation.goBack()
                : navigation.navigate("ExploreLanding")}/>),
    })}/>
    <ExploreStack.Screen name="PlaceDetail" component={PlaceDetailScreen} options={{ headerShown: false }}/>
    <ExploreStack.Screen name="PlaceAllReviews" component={AllReviewsScreen} options={{ headerShown: false }}/>
    <ExploreStack.Screen name="UserConnections" component={ConnectionsScreen} options={{ headerShown: false }}/>
    <ExploreStack.Screen name="UserProfile" component={ProfileScreen} options={{ headerShown: false }}/>
    <ExploreStack.Screen name="Category" component={CategoryScreen} options={({ route }) => ({
        title: route.params?.categoryName || "Categoria",
    })}/>
    <ExploreStack.Screen name="Search" component={SearchScreen} options={{ title: "Buscar" }}/>
  </ExploreStack.Navigator>);
const MainTabs = () => {
    const insets = useSafeAreaInsets();
    const baseTabHeight = 44;
    const extra = Math.max(insets.bottom, 0);
    const computedHeight = baseTabHeight + extra;
    const halfExtra = Math.round(extra / 2);
    return (<MainTab.Navigator screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: "#fff",
            tabBarInactiveTintColor: "#9ca6ba",
            tabBarHideOnKeyboard: true,
            tabBarStyle: {
                position: "absolute",
                bottom: 16,
                left: 16,
                right: 16,
                backgroundColor: "#1b1f27",
                borderRadius: 20,
                height: computedHeight,
                paddingTop: 4 + halfExtra,
                paddingBottom: 4 + halfExtra,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 5,
                elevation: 5,
                borderTopWidth: 0,
            },
            tabBarItemStyle: {
                paddingVertical: 0,
                alignItems: "center",
                justifyContent: "center",
            },
            tabBarIconStyle: {
                marginTop: 0,
            },
            tabBarLabelStyle: {
                fontSize: 12,
                lineHeight: 14,
                marginTop: 2,
            },
        }}>
    <MainTab.Screen name="Home" component={HomeFlow} options={{
        tabBarLabel: "Home",
        tabBarIcon: ({ focused, color }) => (<View style={{ width: 28, height: 24, alignItems: "center", justifyContent: "center" }}>
            <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color}/>
          </View>),
    }}/>
    <MainTab.Screen name="Explore" component={ExploreFlow} options={{
        tabBarLabel: "Buscar",
        tabBarIcon: ({ focused, color }) => (<View style={{ width: 28, height: 24, alignItems: "center", justifyContent: "center" }}>
            <Ionicons name={focused ? "search" : "search-outline"} size={24} color={color}/>
          </View>),
    }}/>
    <MainTab.Screen name="CheckIn" component={() => null} options={{
        tabBarLabel: "Check-in",
        tabBarIcon: ({ color }) => (<View style={{ width: 28, height: 24, alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="add-outline" size={26} color={color}/>
          </View>),
    }} listeners={({ navigation }) => ({
        tabPress: (e) => {
            e.preventDefault();
            navigation.navigate("AddReviewFlow");
        },
    })}/>
    <MainTab.Screen name="Saved" component={SavedScreen} options={{
        tabBarLabel: "Salvos",
        tabBarIcon: ({ focused, color }) => (<View style={{ width: 28, height: 24, alignItems: "center", justifyContent: "center" }}>
            <Ionicons name={focused ? "bookmark" : "bookmark-outline"} size={24} color={color}/>
          </View>),
    }}/>
    <MainTab.Screen name="Profile" component={ProfileFlow} options={{
        tabBarLabel: "Perfil",
        tabBarIcon: ({ focused, color }) => (<View style={{ width: 28, height: 24, alignItems: "center", justifyContent: "center" }}>
            <Ionicons name={focused ? "person" : "person-outline"} size={24} color={color}/>
          </View>),
    }}/>
    </MainTab.Navigator>);
};
const AuthStackScreens = () => (<AuthStack.Navigator screenOptions={{
        ...slideStackOptions,
        headerShown: true,
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.textPrimary,
    }}>
    <AuthStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
    <AuthStack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }}/>
    <AuthStack.Screen name="Signin" component={SigninScreen} options={{ title: "Entrar" }}/>
  </AuthStack.Navigator>);
const AppNavigator = () => (<NavigationContainer theme={AppTheme}>
    <RootStack.Navigator initialRouteName="Auth" screenOptions={slideStackOptions}>
      <RootStack.Screen name="Auth" component={AuthStackScreens} options={{ headerShown: false }}/>
      <RootStack.Screen name="Main" component={MainTabs}/>
      <RootStack.Screen
        name="PlaceDetail"
        component={PlaceDetailScreen}
        options={{ headerShown: false }}
      />
      <RootStack.Screen name="PlaceAllReviews" component={AllReviewsScreen} options={{ headerShown: false }}/>
      <RootStack.Screen
        name="ListDetail"
        component={ListDetailScreen}
        options={({ route, navigation }) => ({
          headerShown: true,
          title: route.params?.listName || "Lista",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.textPrimary,
          headerTitleAlign: "center",
          headerBackTitleVisible: false,
          headerLeft: () => (
            <BackButton onPress={() => navigation.goBack()} />
          ),
        })}
      />
      <RootStack.Screen name="AddReviewFlow" component={AddReviewModalFlow} options={{
        presentation: "modal",
        headerShown: false,
    }}/>
      <RootStack.Screen name="CreateListFlow" component={CreateListFlow} options={{
        presentation: "modal",
        headerShown: false,
    }}/>
      <RootStack.Screen name="AddFavoriteFlow" component={AddFavoriteScreen} options={{
        presentation: "modal",
        headerShown: false,
    }}/>
      <RootStack.Screen name="EditFavoritesScreen" component={EditFavoritesScreen} options={{
        presentation: "modal",
        headerShown: false,
    }}/>
      <RootStack.Screen name="EditListsScreen" component={EditListsScreen} options={{
        presentation: "modal",
        headerShown: false,
      }}/>
      <RootStack.Screen name="UserConnections" component={ConnectionsScreen} options={{ headerShown: false }}/>
      <RootStack.Screen name="UserPlaces" component={UserPlacesScreen} options={{ headerShown: false }}/>
    </RootStack.Navigator>
  </NavigationContainer>);
export default AppNavigator;
