import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  Alert,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { share_biru, default_image } from "../../../const/Png";

import { gql } from "apollo-boost";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { List, ListItem, Left, Right, Body } from "native-base";
import Account from "../../graphQL/Query/Home/Account";
import CountNotif from "../../../graphQL/Query/Notification/CountNotif";
// import {
//   NavigationEvents,
//   StackActions,
//   NavigationActions,
// } from "react-navigation";
export default function Profile({ props, token, setCont }) {
  // let [token, setToken] = useState('');
  // const loadAsync = async () => {
  // 	let tkn = await AsyncStorage.getItem('access_token');

  // 	if (tkn !== null) {
  // 		setToken(tkn);
  // 	} else {
  // 		setToken('');
  // 		Alert.alert('Silahkan Login terlebih dahulu');
  // 		props.navigation.navigate('Home');
  // 	}

  // 	// setToken(tkn);
  // 	LoadUserProfile();
  // };
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

  useEffect(() => {
    LoadUserProfile();
    // loadAsync();
  }, []);
  // console.log(
  // 	datanotif && datanotif.count_notif
  // 		? datanotif.count_notif.count
  // 		: 'data count gk ada',
  // );
  datanotif && datanotif.count_notif
    ? setCont(datanotif.count_notif.count)
    : null;
  const [LoadUserProfile, { data, loading, error }] = useLazyQuery(Account, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  if (loading) {
    console.log("is" + loading);
  }
  if (error) {
    console.log("error" + error);
  }
  if (data) {
    // console.log(data);
  }

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      {/* <NavigationEvents onDidFocus={() => NotifCount()} /> */}
      <View
        style={{
          width: Dimensions.get("window").width - 10,
          flex: 1,
          flexDirection: "row",
          paddingVertical: 10,
        }}
      >
        {token !== "" ? (
          <TouchableOpacity
            style={{
              width: (Dimensions.get("window").width - 20) / 3,
            }}
            onPress={() => props.navigation.navigate("ProfileTab")}
          >
            <Image
              style={{
                borderRadius: 40,
                width: 80,
                height: 80,
                marginHorizontal: 10,
                backgroundColor: "#209FAE",
              }}
              imageStyle={{
                borderRadius: 40,
                width: 80,
                height: 80,
                resizeMode: "cover",
              }}
              // isTouchable={true}
              // onPress={() => props.navigation.navigate('Home')}
              source={
                data && data.user_profile.picture
                  ? { uri: data.user_profile.picture }
                  : default_image
              }
            />
          </TouchableOpacity>
        ) : (
          <View
            style={{
              width: (Dimensions.get("window").width - 20) / 3,
            }}
            // onPress={()=>props.navigation.navigate('Profile')}
          >
            <Image
              style={{
                borderRadius: 40,
                width: 80,
                height: 80,
                marginHorizontal: 10,
                backgroundColor: "#209FAE",
              }}
              imageStyle={{
                borderRadius: 40,
                width: 80,
                height: 80,
                resizeMode: "cover",
              }}
              // isTouchable={true}
              // onPress={() => props.navigation.navigate('Home')}
              source={default_image}
            />
          </View>
        )}
        <View
          style={{
            width: Dimensions.get("window").width / 3,
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "lato-bold",
              fontSize: 16,
            }}
          >
            {/* {token ? (data ? data.user_profile.picture : null) : null} */}
            {token !== ""
              ? data && data.user_profile.first_name
                ? data.user_profile.first_name
                : "User Funtravia"
              : "User Funtravia"}
          </Text>
          <Text>
            {token !== ""
              ? data
                ? "@" + data.user_profile.username
                : "User_Funtravia"
              : "User_Funtravia"}
          </Text>
        </View>
        <View
          style={{
            width: Dimensions.get("window").width * 0.25,
            alignItems: "flex-end",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => Alert.alert("coming soon")}
            style={{
              height: 30,
              width: 30,
              borderRadius: 15,
              backgroundColor: "#e4e8f5",
              alignItems: "center",
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <Image
              style={{
                width: 20,
                height: 20,
              }}
              imageStyle={{
                width: 20,
                height: 20,
                resizeMode: "cover",
              }}
              // isTouchable={true}
              // onPress={() => props.navigation.navigate('Home')}
              source={share_biru}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          width: Dimensions.get("window").width - 20,
          flex: 1,
          flexDirection: "row",
          // paddingHorizontal: (10),
          paddingBottom: 10,
        }}
      >
        <View
          style={{
            width: (Dimensions.get("window").width - 20) / 4,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "lato-bold",
              fontSize: 16,
            }}
          >
            {token !== ""
              ? data && data.user_profile.count_review
                ? data.user_profile.count_review
                : 0
              : 0}
          </Text>
          <Text
            style={{
              fontFamily: "lato-reg",
              // fontSize: (10),
              color: "#a7a7a7",
            }}
          >
            Review
          </Text>
        </View>

        <View
          style={{
            width: (Dimensions.get("window").width - 20) / 4,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "lato-bold",
              fontSize: 16,
            }}
          >
            {token !== ""
              ? data && data.user_profile.count_post
                ? data.user_profile.count_post
                : 0
              : 0}
          </Text>
          <Text
            style={{
              fontFamily: "lato-reg",
              // fontSize: (10),
              color: "#a7a7a7",
            }}
          >
            Post
          </Text>
        </View>

        <View
          style={{
            width: (Dimensions.get("window").width - 20) / 4,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "lato-bold",
              fontSize: 16,
            }}
          >
            {token !== ""
              ? data && data.user_profile.count_following
                ? data.user_profile.count_following
                : 0
              : 0}
          </Text>
          <Text
            style={{
              fontFamily: "lato-reg",
              // fontSize: (10),
              color: "#a7a7a7",
            }}
          >
            Following
          </Text>
        </View>

        <View
          style={{
            width: (Dimensions.get("window").width - 20) / 4,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "lato-bold",
              fontSize: 16,
            }}
          >
            {token !== ""
              ? data && data.user_profile.count_follower
                ? data.user_profile.count_follower
                : 0
              : 0}
          </Text>
          <Text
            style={{
              fontFamily: "lato-reg",
              // fontSize: (10),
              color: "#a7a7a7",
            }}
          >
            Followers
          </Text>
        </View>

        <View
          style={{
            width: (Dimensions.get("window").width - 20) / 4,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "lato-bold",
              fontSize: 16,
            }}
          >
            {token !== ""
              ? data && data.user_profile.count_following
                ? data.user_profile.count_following
                : 0
              : 0}
          </Text>
          <Text
            style={{
              fontFamily: "lato-reg",
              // fontSize: (10),
              color: "#a7a7a7",
            }}
          >
            Following
          </Text>
        </View>
      </View>
    </View>
  );
}
