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
  Pressable,
} from "react-native";
import { useQuery, useMutation } from "@apollo/react-hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  bg_movielocation,
  laskar_pelangi,
  hit_n_run,
  serigala_terakhir,
  night_bus,
  gundala,
  headshot,
  wiro_sableng,
  the_raid_2,
  merantau,
  the_raid,
} from "../../../assets/png";
import {
  Kosong,
  Select,
  LocationBlack,
  SharePutih,
  Star,
  LikeEmptynew,
  LikeRed,
  PinHijau,
} from "../../../assets/svg";
import { Button, Text, Truncate } from "../../../component";
import { useTranslation } from "react-i18next";
import Account from "../../../graphQL/Query/Home/Account";
import User_Post from "../../../graphQL/Query/Profile/post";
import Reviews from "../../../graphQL/Query/Profile/review";
import Itinerary from "../../../graphQL/Query/Profile/itinerary";
import { TabBar, TabView } from "react-native-tab-view";
import Listdestination from "../../../graphQL/Query/Destination/ListDestinationV2";
import Liked from "../../../graphQL/Mutation/Destination/Liked";
import UnLiked from "../../../graphQL/Mutation/unliked";
import Ripple from "react-native-material-ripple";

const AnimatedIndicator = Animated.createAnimatedComponent(ActivityIndicator);
const { width, height } = Dimensions.get("screen");
const TabBarHeight = 50;
const HeaderHeight = width - 70;
const SafeStatusBar = Platform.select({
  ios: 44,
  android: StatusBar.currentHeight,
});
const tab2ItemSize = (width - 40) / 3;
const PullToRefreshDist = 150;

const data_film = [
  {
    id: "1",
    judul: "The Raid",
    sinopsis:
      "In the 1970s, a group of 10 students struggles with poverty and develop hopes for the future in Gantong Village on the farming and tin mining island of Belitung off the east coast of Sumatra.",
    cover: the_raid,
  },
  {
    id: "2",
    judul: "Merantau",
    sinopsis:
      "In the 1970s, a group of 10 students struggles with poverty and develop hopes for the future in Gantong Village on the farming and tin mining island of Belitung off the east coast of Sumatra.",
    cover: merantau,
  },
  {
    id: "3",
    judul: "The Raid 2",
    sinopsis:
      "In the 1970s, a group of 10 students struggles with poverty and develop hopes for the future in Gantong Village on the farming and tin mining island of Belitung off the east coast of Sumatra.",
    cover: the_raid_2,
  },
  {
    id: "4",
    judul: "Wiro Sableng",
    sinopsis:
      "In the 1970s, a group of 10 students struggles with poverty and develop hopes for the future in Gantong Village on the farming and tin mining island of Belitung off the east coast of Sumatra.",
    cover: wiro_sableng,
  },
  {
    id: "5",
    judul: "Headshot",
    sinopsis:
      "In the 1970s, a group of 10 students struggles with poverty and develop hopes for the future in Gantong Village on the farming and tin mining island of Belitung off the east coast of Sumatra.",
    cover: headshot,
  },
  {
    id: "6",
    judul: "Gundala",
    sinopsis:
      "In the 1970s, a group of 10 students struggles with poverty and develop hopes for the future in Gantong Village on the farming and tin mining island of Belitung off the east coast of Sumatra.",
    cover: gundala,
  },
  {
    id: "7",
    judul: "Night Bus",
    sinopsis:
      "In the 1970s, a group of 10 students struggles with poverty and develop hopes for the future in Gantong Village on the farming and tin mining island of Belitung off the east coast of Sumatra.",
    cover: night_bus,
  },
  {
    id: "8",
    judul: "Serigala Terakhir",
    sinopsis:
      "In the 1970s, a group of 10 students struggles with poverty and develop hopes for the future in Gantong Village on the farming and tin mining island of Belitung off the east coast of Sumatra.",
    cover: serigala_terakhir,
  },
  {
    id: "9",
    judul: "Hit & Run",
    sinopsis:
      "In the 1970s, a group of 10 students struggles with poverty and develop hopes for the future in Gantong Village on the farming and tin mining island of Belitung off the east coast of Sumatra.",
    cover: hit_n_run,
  },
];

export default function Detail_movie({ navigation, route }) {
  let [token, setToken] = useState(route.params.token);
  let data_movie = route.params.data;
  let [canScroll, setCanScroll] = useState(true);
  const { t } = useTranslation();
  const HeaderComponent = {
    headerShown: true,
    transparent: false,
    tabBarVisble: false,
    tabBarLabel: "Unesco",
    headerTintColor: "white",
    headerTitle: data_movie.judul,
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
  const { data, loading, error, refetch } = useQuery(Listdestination, {
    variables: {
      keyword: null,
      type: null,
      cities: null,
      countries: null,
      goodfor: null,
      facilities: null,
      rating: null,
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  let destinationList_v2 = [];
  if (data && data.destinationList_v2) {
    destinationList_v2 = data.destinationList_v2;
  }

  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    await setToken(tkn);
    await refetch();
  };
  console.log("tkn", token);

  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // console.log("test");
    // loadAsync();
    navigation.setOptions(HeaderComponent);
  }, []);

  const [
    mutationliked,
    { loading: loadingLike, data: dataLike, error: errorLike },
  ] = useMutation(Liked, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const [
    mutationUnliked,
    { loading: loadingUnLike, data: dataUnLike, error: errorUnLike },
  ] = useMutation(UnLiked, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const _liked = async (id, index) => {
    if (token || token !== "") {
      destinationList_v2[index].liked = true;
      try {
        let response = await mutationliked({
          variables: {
            destination_id: id,
          },
        });
        console.log(response);
        if (loadingLike) {
          Alert.alert("Loading!!");
        }
        if (errorLike) {
          throw new Error("Error Input");
        }

        if (response.data) {
          if (
            response.data.setDestination_wishlist.code === 200 ||
            response.data.setDestination_wishlist.code === "200"
          ) {
            refetch();
          } else {
            throw new Error(response.data.setDestination_wishlist.message);
          }
        }
      } catch (error) {
        refetch();
        Alert.alert("" + error);
      }
    } else {
      Alert.alert("Please Login");
    }
  };

  const _unliked = async (id, index) => {
    if (token || token !== "") {
      destinationList_v2[index].liked = false;
      try {
        let response = await mutationUnliked({
          variables: {
            id: id,
            type: "destination",
          },
        });
        if (loadingUnLike) {
          Alert.alert("Loading!!");
        }
        if (errorUnLike) {
          throw new Error("Error Input");
        }

        if (response.data) {
          if (
            response.data.unset_wishlist.code === 200 ||
            response.data.unset_wishlist.code === "200"
          ) {
            refetch();
          } else {
            throw new Error(response.data.unset_wishlist.message);
          }
        }
      } catch (error) {
        Alert.alert("" + error);
      }
    } else {
      refetch();
      Alert.alert("Please Login");
    }
  };

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
            height: HeaderHeight,
          }}
        >
          <ImageBackground
            source={data_movie.cover}
            style={{
              width: width,
              height: HeaderHeight,
              justifyContent: "center",
              padding: 20,
              alignItems: "center",
            }}
            resizeMode="cover"
            blurRadius={3}
          >
            <Image
              source={data_movie.cover}
              style={{ width: HeaderHeight - 160, height: HeaderHeight - 80 }}
              resizeMode="cover"
            />
          </ImageBackground>
        </View>
        <View
          style={{
            alignItems: "center",
          }}
        >
          <Ripple
            onPress={() => {
              refetch();
            }}
            style={{
              height: 44,
              borderRadius: 20,
              // borderWidth: 1,
              borderColor: "grey",
              paddingVertical: 20,
              paddingHorizontal: 45,
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              backgroundColor: "#D75995",
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
            <SharePutih height={15} width={15} />
            <Text
              type="bold"
              style={{
                color: "white",
                marginLeft: 10,
              }}
            >
              {t("share")}
            </Text>
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
            <Text size="title" type="bold" style={{ marginBottom: 10 }}>
              {data_movie.judul}
            </Text>
            <Text
              size="description"
              style={{
                textAlign: "justify",
              }}
            >
              {data_movie.sinopsis}
            </Text>
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
            Shooting Location
          </Text>
        </View>
        {token ? (
          <FlatList
            data={destinationList_v2}
            renderItem={({ item, index }) => (
              <Pressable
                onPress={() => {
                  navigation.navigate("detailStack", {
                    id: item.id,
                    name: item.name,
                  });
                }}
                style={{
                  width: "100%",
                  padding: 10,
                  backgroundColor: "#FFFFFF",
                  marginBottom: 10,
                  borderRadius: 10,
                  flexDirection: "row",
                }}
              >
                <Image
                  source={{ uri: item.images.image }}
                  style={{ width: "40%", height: 145, borderRadius: 10 }}
                  resizeMode="cover"
                />
                <View
                  style={{
                    paddingLeft: 10,
                    paddingVertical: 5,
                    width: "60%",
                    justifyContent: "space-between",
                  }}
                >
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 5,
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: "#F4F4F4",
                          borderRadius: 4,
                          paddingHorizontal: 8,
                          paddingVertical: 3,
                          flexDirection: "row",
                        }}
                      >
                        <Star width={15} height={15} />
                        <Text style={{ paddingLeft: 5 }} type="bold">
                          {item.rating}
                        </Text>
                      </View>
                      {item.liked === false ? (
                        <Button
                          onPress={() => _liked(item.id, index)}
                          type="circle"
                          style={{
                            width: 25,
                            borderRadius: 19,
                            height: 25,
                            justifyContent: "center",
                            alignContent: "center",
                            alignItems: "center",
                            backgroundColor: "#EEEEEE",
                            zIndex: 999,
                          }}
                        >
                          <LikeEmptynew width={15} height={15} />
                        </Button>
                      ) : (
                        <Button
                          onPress={() => _unliked(item.id, index)}
                          type="circle"
                          style={{
                            width: 25,
                            borderRadius: 17.5,
                            height: 25,
                            justifyContent: "center",
                            alignContent: "center",
                            alignItems: "center",
                            backgroundColor: "#EEEEEE",
                            zIndex: 999,
                          }}
                        >
                          <LikeRed width={15} height={15} />
                        </Button>
                      )}
                    </View>
                    <Text size="label" type="bold" style={{ marginBottom: 5 }}>
                      {item.name}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        alignContent: "center",
                        justifyContent: "flex-start",
                      }}
                    >
                      <PinHijau width={15} height={15} />
                      <Text
                        type="regular"
                        size="description"
                        style={{ color: "#464646", marginLeft: 5 }}
                      >
                        {item.cities.name && item.countries.name
                          ? `${item.cities.name}`
                          : ""}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      marginTop: 10,
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    {item.greatfor && item.greatfor.length ? (
                      <View
                        style={{
                          justifyContent: "flex-start",
                          alignContent: "flex-start",
                        }}
                      >
                        <Text
                          size="description"
                          type="bold"
                          style={{
                            color: "#464646",
                          }}
                        >
                          {t("greatFor")}:
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-evenly",
                            alignContent: "space-between",
                            alignItems: "stretch",
                            alignSelf: "flex-start",
                          }}
                        >
                          {item.greatfor.map((item, index) => {
                            return (
                              <FunIcon
                                icon={item.icon}
                                fill="#464646"
                                height={42}
                                width={42}
                                style={{}}
                              />
                            );
                          })}
                        </View>
                      </View>
                    ) : (
                      <View
                        style={{
                          justifyContent: "flex-start",
                          alignContent: "flex-start",
                        }}
                      ></View>
                    )}
                    <Button
                      size="small"
                      text={t("addToPlan")}
                      color="primary"
                      onPress={() => {
                        navigation.navigate("ItineraryStack", {
                          screen: "ItineraryPlaning",
                          params: {
                            idkiriman: item.id,
                            Position: "destination",
                          },
                        });
                      }}
                    />
                  </View>
                </View>
              </Pressable>
            )}
            
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
              // borderWidth: 1,
              paddingVertical: 10,
            }}
          />
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {},
  header: {},
});
