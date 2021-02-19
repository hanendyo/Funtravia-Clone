import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  PanResponder,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  FlatList,
} from "react-native";
import { useQuery } from "@apollo/react-hooks";
import {
  Akunsaya,
  default_image,
  unesco,
  tropical_rainforest,
  badak_jawa,
  lorenz,
  comodo,
  sangiran,
  prambanan,
  ombilin,
  cultural_lanscape,
  borobudur,
  bg_movielocation,
  laskar_pelangi,
} from "../../../assets/png";
import { Kosong, Select, LocationBlack } from "../../../assets/svg";
import { Button, Text, Truncate } from "../../../component";
import { useTranslation } from "react-i18next";
import Account from "../../../graphQL/Query/Home/Account";
import User_Post from "../../../graphQL/Query/Profile/post";
import Reviews from "../../../graphQL/Query/Profile/review";
import Itinerary from "../../../graphQL/Query/Profile/itinerary";
import { TabBar, TabView } from "react-native-tab-view";
import Ripple from "react-native-material-ripple";

const AnimatedIndicator = Animated.createAnimatedComponent(ActivityIndicator);
const { width, height } = Dimensions.get("screen");
const TabBarHeight = 50;
const HeaderHeight = width - 100;
const SafeStatusBar = Platform.select({
  ios: 44,
  android: StatusBar.currentHeight,
});
const tab2ItemSize = (width - 40) / 3;
const PullToRefreshDist = 150;

const data_film = [
  {
    id: "1",
    judul: "Borobudur Temple Compounds",
    sinopsis:
      "In the 1970s, a group of 10 students struggles with poverty and develop hopes for the future in Gantong Village on the farming and tin mining island of Belitung off the east coast of Sumatra.",
    cover: borobudur,
  },
  {
    id: "2",
    judul: "Borobudur Temple Compounds",
    sinopsis:
      "In the 1970s, a group of 10 students struggles with poverty and develop hopes for the future in Gantong Village on the farming and tin mining island of Belitung off the east coast of Sumatra.",
    cover: borobudur,
  },
  {
    id: "3",
    judul: "Borobudur Temple Compounds",
    sinopsis:
      "In the 1970s, a group of 10 students struggles with poverty and develop hopes for the future in Gantong Village on the farming and tin mining island of Belitung off the east coast of Sumatra.",
    cover: borobudur,
  },
  {
    id: "4",
    judul: "Borobudur Temple Compounds",
    sinopsis:
      "In the 1970s, a group of 10 students struggles with poverty and develop hopes for the future in Gantong Village on the farming and tin mining island of Belitung off the east coast of Sumatra.",
    cover: borobudur,
  },
  {
    id: "5",
    judul: "Borobudur Temple Compounds",
    sinopsis:
      "In the 1970s, a group of 10 students struggles with poverty and develop hopes for the future in Gantong Village on the farming and tin mining island of Belitung off the east coast of Sumatra.",
    cover: borobudur,
  },
  {
    id: "6",
    judul: "Borobudur Temple Compounds",
    sinopsis:
      "In the 1970s, a group of 10 students struggles with poverty and develop hopes for the future in Gantong Village on the farming and tin mining island of Belitung off the east coast of Sumatra.",
    cover: borobudur,
  },
  {
    id: "7",
    judul: "Borobudur Temple Compounds",
    sinopsis:
      "In the 1970s, a group of 10 students struggles with poverty and develop hopes for the future in Gantong Village on the farming and tin mining island of Belitung off the east coast of Sumatra.",
    cover: borobudur,
  },
  {
    id: "8",
    judul: "Borobudur Temple Compounds",
    sinopsis:
      "In the 1970s, a group of 10 students struggles with poverty and develop hopes for the future in Gantong Village on the farming and tin mining island of Belitung off the east coast of Sumatra.",
    cover: borobudur,
  },
  {
    id: "9",
    judul: "Borobudur Temple Compounds",
    sinopsis:
      "In the 1970s, a group of 10 students struggles with poverty and develop hopes for the future in Gantong Village on the farming and tin mining island of Belitung off the east coast of Sumatra.",
    cover: borobudur,
  },
];

export default function MovieLocation({ navigation, route }) {
  let [token, setToken] = useState(route.params.token);
  let [canScroll, setCanScroll] = useState(true);
  const { t } = useTranslation();
  const HeaderComponent = {
    headerShown: true,
    transparent: false,
    tabBarVisble: false,
    tabBarLabel: "Unesco",
    headerTintColor: "white",
    headerTitle: "UNESCO World Heritage",
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      fontFamily: "Lato-Bold",
      fontSize: 14,
      color: "white",
    },
  };
  /**
   * stats
   */
  /**
   * ref
   */
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    navigation.setOptions(HeaderComponent);
  }, [route]);

  return (
    <ScrollView
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          backgroundColor: "#FFFFFF",
          paddingBottom: 15,
          shadowColor: "#DFDFDF",
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.25,
          shadowRadius: 2.84,
          elevation: 3,
        }}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: width,
            height: HeaderHeight - 100,
          }}
        >
          <ImageBackground
            source={bg_movielocation}
            style={{
              width: width,
              height: HeaderHeight - 100,
              justifyContent: "center",
              padding: 20,
            }}
            resizeMode="cover"
          >
            <Text size="label" style={{ marginBottom: 20 }}>
              Get inspired #movielocation
            </Text>
            <Text size="h5" type="black">
              Movie Location
            </Text>
            <Text size="label">Explore Indonesia Movie Location</Text>
          </ImageBackground>
        </View>
        <View
          style={{
            alignItems: "center",
          }}
        >
          <Ripple
            style={{
              height: 44,
              borderRadius: 20,
              // borderWidth: 1,
              borderColor: "grey",
              paddingVertical: 20,
              paddingHorizontal: 30,
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              backgroundColor: "#FFFFFF",
              shadowColor: "#DFDFDF",
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.25,
              shadowRadius: 2.84,
              elevation: 3,
              flexDirection: "row",
              marginTop: -22,
            }}
          >
            <Text
              size="label"
              type="bold"
              style={{
                color: "",
                marginRight: 10,
              }}
            >
              Indonesia
            </Text>
            <Select height={10} width={10} />
          </Ripple>
        </View>
        <View
          style={{
            justifyContent: "flex-start",
            // paddingHorizontal: 20,
            paddingHorizontal: 20,
          }}
        >
          <View
            style={{
              marginVertical: 20,
            }}
          >
            <Text
              size="description"
              style={{
                textAlign: "justify",
              }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vitae
              ultrices consectetur arcu augue sit morbi ut. Maecenas semper
              porta sit a risus aliquam.
            </Text>
          </View>
          <Text size="title" type="black">
            Top Movie Location
          </Text>
          <View
            style={{
              flexDirection: "row",
              marginVertical: 15,
              width: width - 40,
            }}
          >
            <View style={{ width: "30%", height: 140 }}>
              <Image
                source={laskar_pelangi}
                style={{ width: "100%", height: 140, borderRadius: 10 }}
                resizeMode="cover"
              />
            </View>
            <View
              style={{
                paddingLeft: 15,
                marginVertical: 5,
                justifyContent: "space-between",
                width: "70%",
              }}
            >
              <View>
                <Text
                  size="title"
                  type="bold"
                  style={{
                    marginBottom: 5,
                  }}
                >
                  Laskar Pelangi
                </Text>
                <Text
                  style={{
                    // textAlign: "justify",
                    width: "100%",
                  }}
                >
                  In the 1970s, a group of 10 students struggles with poverty
                  and develop hopes for the future...
                </Text>
              </View>
              <View
                style={{
                  alignItems: "flex-start",
                }}
              >
                <View
                  style={{
                    backgroundColor: "#DAF0F2",
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 5,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <LocationBlack width={15} height={15} />
                  <Text type="bold" style={{ marginLeft: 5 }}>
                    7 Locations
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View
        style={{
          padding: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{
              height: 20,
              width: 6,
              borderRadius: 3,
              backgroundColor: "#209fae",
              marginRight: 10,
            }}
          />
          <Text size="title" type="bold">
            Recommendation
          </Text>
        </View>
        <FlatList
          data={data_film}
          renderItem={({ item, index }) => (
            <View
              style={{
                width: "33%",
              }}
            >
              <Image
                source={laskar_pelangi}
                style={{ width: "95%", height: 140 }}
                resizeMode="cover"
              />
              <Text>{item.judul}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={{
            // borderWidth: 1,
            paddingVertical: 10,
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {},
  header: {},
});
