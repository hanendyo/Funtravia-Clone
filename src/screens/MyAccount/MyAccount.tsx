import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  Alert,
  Pressable,
  Image,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import {
  Akunsaya,
  default_image,
  setting_icon,
  BelPutih,
} from "../../assets/png";
import Ripple from "react-native-material-ripple";

import { gql } from "apollo-boost";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";

import Profile from "./Profile";
import FunProfile from "./FunProfile";
import {
  Arrowbackwhite,
  Bottom,
  OptionsVertWhite,
  Sampul,
  Next,
  Help,
} from "../../assets/svg";
import Logout from "../../graphQL/Mutation/Login/Logout";
// import Loading from "../../component/index";
// import {
//   NavigationEvents,
//   StackActions,
//   NavigationActions,
// } from "react-navigation";
import Count_Notification from "../../component/Count_Notification";
import { useTranslation } from "react-i18next";
import { Button, Text } from "../../component";
import Account from "../../graphQL/Query/Home/Account";
import CountNotif from "../../graphQL/Query/Notification/CountNotif";
import LinearGradient from "react-native-linear-gradient";

const { width, height } = Dimensions.get("screen");

export default function MyAccount(props) {
  const { t, i18n } = useTranslation();
  // console.log(i18n.language);
  let [token, setToken] = useState("");
  let [count, setCount] = useState(1);

  const HeaderComponent = {
    headerTransparent: true,
    headerTitle: "Akun Saya",
    headerMode: "screen",
    headerStyle: {
      zIndex: 20,
      // backgroundColor: '#209FAE',
      elevation: 0,
      borderBottomWidth: 0,
      fontSize: 50,
      // justifyContent: 'center',
      // flex:1,
    },
    headerTitleStyle: {
      fontFamily: "lato-reg",
      fontSize: 14,
      color: "white",
      alignSelf: "center",
    },

    headerLeftContainerStyle: {
      marginLeft: 10,
    },

    headerRight: (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
        }}
      >
        <Image
          style={{
            width: 25,
            height: 25,
            marginHorizontal: 10,
          }}
          imageStyle={{
            width: 25,
            height: 25,
            resizeMode: "contain",
          }}
          isTouchable={true}
          onPress={() => props.navigation.navigate("settings")}
          source={setting_icon}
        />
        <Pressable
          onPress={() => props.navigation.navigate("Inbox")}
          style={{
            // flexDirection: 'row',
            marginHorizontal: 10,
          }}
        >
          <Image
            style={{
              width: 25,
              height: 25,
            }}
            imageStyle={{
              width: 25,
              height: 25,
              resizeMode: "contain",
            }}
            source={BelPutih}
          />

          {/* {props.route.params.count_notif &&
          props.route.params.count_notif > 0 ? (
            <View
              style={{
                position: "absolute",
                top: 1,
                right: 0,
                backgroundColor: "#D75995",
                borderColor: "#209FAE",
                borderWidth: 1,
                paddingHorizontal: 1,
                minWidth: 15,
                height: 15,
                borderRadius: 8,
                // alignItems: 'center',

                // alignSelf: 'center',
              }}
            >
              <Text
                style={{
                  fontFamily: "lato-bold",
                  fontSize: 9,
                  color: "white",
                  alignSelf: "center",
                }}
              >
                {props.route.params.count_notif}
              </Text>
            </View>
          ) : null} */}
        </Pressable>
      </View>
    ),
    headerRightStyle: {},
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
  }, []);

  const [mutationlogout, { loading, data, error }] = useMutation(Logout, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    setToken(tkn);
    if (tkn === null) {
      Alert.alert("Silahkan Login terlebih dahulu");
      props.navigation.navigate("Home");
    }
  };
  const [
    LoadUserProfile,
    { data: datauser, loading: loadinguser, error: erroruser },
  ] = useLazyQuery(Account, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const [
    NotifCount,
    { data: datanotif, loading: loadingnotif, error: errornotif },
  ] = useLazyQuery(CountNotif, {
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  // console.log(datanotif);
  // let no = 1;
  const getcount = (e) => {
    console.log(e);
    if (count < 2) {
      props.navigation.setParams({ count_notif: e });
      setCount(count + 1);
    }
  };
  useEffect(() => {
    loadAsync();
    LoadUserProfile();
    NotifCount();
    // setParams();
  }, []);
  const arrayShadow = {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: Platform.OS == "ios" ? 0.22 : 2,
    shadowRadius: Platform.OS == "ios" ? 2.22 : 1.0,
    elevation: Platform.OS == "ios" ? 3 : 1.5,
  };

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          height: 130,
          position: "absolute",
          top: 0,
          justifyContent: "space-between",
          width: width,
          zIndex: 10,
        }}
      >
        <LinearGradient
          colors={["rgba(34, 34, 34, 1)", "rgba(34, 34, 34, 0)"]}
          start={{ x: 1, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            height: 130,
            width: width,
          }}
        ></LinearGradient>
      </View>
      <ScrollView style={{ backgroundColor: "#F6F6F7" }}>
        {/* <NavigationEvents onDidFocus={() => setCount(0)} /> */}
        {/* {datanotif && datanotif.count_notif
					? setCount(datanotif.count_notif.count)
				: null} */}
        <Count_Notification
          props={props}
          token={token}
          setCont={(e) => (e > 0 ? getcount(e) : null)}
        />
        <View
          style={{
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <ImageBackground
            source={Akunsaya}
            imageStyle={{
              width: width,
              height: 250,
              resizeMode: "cover",
            }}
            style={{
              width: width,
              height: 250,
            }}
          ></ImageBackground>
          <View
            style={{
              zIndex: 999,
              shadowOpacity: 0.5,
              shadowColor: "#d3d3d3",
              elevation: 4,
              alignSelf: "center",
              borderColor: "white",
              borderRadius: 60,
              borderWidth: 3,
              backgroundColor: "#B8E0E5",
              height: 120,
              width: 120,
              marginTop: -60,
              marginBottom: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={
                datauser && datauser.user_profile.picture
                  ? { uri: datauser.user_profile.picture }
                  : default_image
              }
              style={{
                borderRadius: 60,
                resizeMode: "cover",
                height: "100%",
                width: "100%",
              }}
            />
          </View>
          <Text type="bold" size="label">
            {datauser && datauser.user_profile.first_name
              ? datauser.user_profile.first_name
              : null}{" "}
            {datauser && datauser.user_profile.last_name
              ? datauser.user_profile.last_name
              : null}
          </Text>
          <Text>
            @
            {datauser && datauser.user_profile.username
              ? datauser.user_profile.username
              : null}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: "#FFFFFF",
            margin: 10,
            padding: 20,
            borderRadius: 10,
            shadowColor: "gray",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: arrayShadow.shadowOpacity,
            shadowRadius: arrayShadow.shadowRadius,
            elevation: arrayShadow.elevation,
          }}
        >
          <Text type="bold" size="label" style={{ marginBottom: 10 }}>
            {t("accountInformation")}
          </Text>
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              paddingVertical: 10,
              borderBottomWidth: 0.5,
              borderBottomColor: "#d3d3d3",
            }}
          >
            <Text>{t("fullName")}</Text>
            <Text>
              {datauser && datauser.user_profile.first_name
                ? datauser.user_profile.first_name
                : null}{" "}
              {datauser && datauser.user_profile.last_name
                ? datauser.user_profile.last_name
                : null}
            </Text>
          </View>
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              paddingVertical: 10,
              borderBottomWidth: 0.5,
              borderBottomColor: "#d3d3d3",
            }}
          >
            <Text>{t("emailAddress")}</Text>
            <Text>
              {datauser && datauser.user_profile.email
                ? datauser.user_profile.email
                : null}
            </Text>
          </View>
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              paddingVertical: 10,
              borderBottomWidth: 0.5,
              borderBottomColor: "#d3d3d3",
            }}
          >
            <Text>{t("phoneNumber")}</Text>
            <Text>
              {datauser && datauser.user_profile.phone
                ? datauser.user_profile.phone
                : "No Set"}
            </Text>
          </View>
        </View>
        <View
          style={{
            backgroundColor: "#FFFFFF",
            margin: 10,
            padding: 20,
            borderRadius: 10,
            shadowColor: "gray",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: arrayShadow.shadowOpacity,
            shadowRadius: arrayShadow.shadowRadius,
            elevation: arrayShadow.elevation,
          }}
        >
          <Text type="bold" size="label" style={{ marginBottom: 10 }}>
            {t("favourites")}
          </Text>
          <Ripple
            onPress={() => props.navigation.navigate("Wishlist")}
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              paddingVertical: 10,
              borderBottomWidth: 0.5,
              borderBottomColor: "#d3d3d3",
            }}
          >
            <Text>{t("wishlist")}</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text type="bold" style={{ marginRight: 10 }}>
                {datauser && datauser.user_profile.count_wishlist
                  ? datauser.user_profile.count_wishlist
                  : 0}
                {" Wishlist"}
              </Text>
              <Next width={15} height={15} />
            </View>
          </Ripple>
          <Ripple
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              paddingVertical: 10,
              borderBottomWidth: 0.5,
              borderBottomColor: "#d3d3d3",
            }}
          >
            <Text>{t("itenerariFavorit")}</Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text type="bold" style={{ marginRight: 10 }}>
                {datauser && datauser.user_profile.count_itinerary_favorit
                  ? datauser.user_profile.count_itinerary_favorit
                  : 0}
                {" Itinerary"}
              </Text>
              <Next width={15} height={15} />
            </View>
          </Ripple>
        </View>
        <View style={{ flexDirection: "row", margin: 10 }}>
          <Help />
          <Text type="bold" style={{ marginLeft: 5 }}>
            Help
          </Text>
        </View>
        <View
          style={{
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Button
            variant="bordered"
            color="secondary"
            text={t("logout")}
            // onPress={() => props.navigation.navigate('Login')}
            onPress={async () => {
              // await AsyncStorage.setItem('access_token', '');
              // props.navigation.navigate('splash');
              let pushTkn = await AsyncStorage.getItem("token");
              try {
                let response = await mutationlogout({
                  variables: { token: pushTkn },
                });
                if (loading) {
                  Alert.alert("Loading!!");
                }
                if (error) {
                  throw new Error("Error Input");
                }

                // console.log(response);
                if (response) {
                  await AsyncStorage.setItem("access_token", "");
                  // await AsyncStorage.clear();
                  props.navigation.navigate("SplashScreen");
                }
              } catch (error) {
                Alert.alert("" + error);
                await AsyncStorage.setItem("access_token", "");
                props.navigation.navigate("SplashScreen");
              }
            }}
            // text='Search'
            style={{
              width: Dimensions.get("window").width - 20,
              marginVertical: 10,
            }}
          ></Button>
        </View>
        {/* <View style={{ height: 1000, backgroundColor: 'red' }}></View> */}
      </ScrollView>
    </View>
  );
}
