import React, { useState, useCallback, useEffect, useRef } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  SafeAreaView,
  FlatList,
  View,
  Image,
  StatusBar,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useQuery } from "@apollo/react-hooks";
import { Akunsaya } from "../../../assets/png";
import { Button, Text } from "../../../component";
import { useTranslation } from "react-i18next";
import Account from "../../../graphQL/Query/Home/Account";
import { Tab, Tabs, ScrollableTab } from "native-base";
import MyTrip from "../MyTrip";
import Review from "../Review";
import Post from "../Post";

const TabStack = createMaterialTopTabNavigator();
export default function MyProfile({ navigation }) {
  const { t } = useTranslation();
  let [token, setToken] = useState(null);
  let SV = useRef();
  const HeaderComponent = {
    title: null,
    headerTransparent: true,
    headerTintColor: "white",
    headerTitleStyle: {
      fontFamily: "Lato-Bold",
      fontSize: 14,
      color: "white",
    },
  };

  const loadAsync = async () => {
    let accessToken = await AsyncStorage.getItem("access_token");
    if (accessToken !== null) {
      setToken(accessToken);
    }
  };

  useEffect(() => {
    navigation.setOptions(HeaderComponent);
    loadAsync();
  }, []);

  const { width, height } = Dimensions.get("screen");
  const { data, loading, error } = useQuery(Account, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : null,
      },
    },
  });

  if (loading) {
    console.log("loading");
  }

  if (error) {
    console.log("error");
  }

  if (data) {
    let rData = data.user_profile;
    return (
      <View style={{ flex: 1, backgroundColor: "#FFF" }}>
        <StatusBar barStyle="light-content" />
        <ScrollView
          nestedScrollEnabled
          // stickyHeaderIndices={[2]}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={1}
        >
          <View>
            <Image
              source={Akunsaya}
              style={{ width: width, height: height / 3.5 }}
            />
          </View>
          <View>
            <View>
              <Image
                source={{ uri: rData.picture }}
                style={{
                  position: "absolute",
                  top: -50,
                  left: 25,
                  width: width / 4,
                  height: width / 4,
                  borderRadius: width / 8,
                  borderWidth: 2,
                  borderColor: "#FFF",
                }}
              />
              <Button
                text={t("editprofile")}
                onPress={() =>
                  navigation.push("profilesetting", {
                    token: token,
                    data: data.user_profile,
                  })
                }
                variant="bordered"
                size="small"
                color="black"
                style={{
                  width: width / 2,
                  borderColor: "#464646",
                  alignSelf: "flex-end",
                  margin: 15,
                }}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  width: width / 2,
                  paddingLeft: 25,
                }}
              >
                <Text size="label" type="bold">
                  {rData.first_name +
                    (rData.last_name ? " " + rData.last_name : null)}
                </Text>
                <Text size="label">{"@" + rData.username}</Text>
              </View>
              <View style={{ flexDirection: "row", width: width / 2 }}>
                <TouchableOpacity
                  style={{
                    alignItems: "center",
                    width: width / 4,
                  }}
                  onPress={() =>
                    navigation.push("ProfileStack", {
                      screen: "FollowerPage",
                    })
                  }
                >
                  <Text type="black" size="label">
                    {`${rData.count_follower ? rData.count_follower : 0} `}
                  </Text>
                  <Text type="regular" size="description">
                    {t("followers")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    alignItems: "center",
                    width: width / 4,
                  }}
                  onPress={() =>
                    navigation.push("ProfileStack", {
                      screen: "FollowerPage",
                    })
                  }
                >
                  <Text type="black" size="label">
                    {`${rData.count_following ? rData.count_following : 0} `}
                  </Text>
                  <Text type="regular" size="description">
                    {t("following")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {rData.bio ? (
              <View style={{ paddingHorizontal: 25, paddingTop: 20 }}>
                <Text size="description" style={{ textAlign: "justify" }}>
                  {rData.bio}
                </Text>
              </View>
            ) : null}
          </View>
          <View style={{ paddingTop: 10 }}>
            <TabStack.Navigator initialRouteName="PostProfile">
              <TabStack.Screen
                name="PostProfile"
                component={Post}
                options={{ tabBarLabel: "Post" }}
              />
              <TabStack.Screen
                name="ReviewProfile"
                component={Review}
                options={{ tabBarLabel: "Review" }}
              />
              <TabStack.Screen
                name="MyTripProfile"
                component={MyTrip}
                options={{ tabBarLabel: "My Trip" }}
              />
            </TabStack.Navigator>
          </View>
        </ScrollView>
      </View>
    );
  }
}
