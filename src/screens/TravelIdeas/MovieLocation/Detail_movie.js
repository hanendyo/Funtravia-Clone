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
import { useMutation, useLazyQuery, useQuery } from "@apollo/client";
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
  default_image,
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
  Love,
  LikeEmpty,
} from "../../../assets/svg";
import { Button, FunIcon, Text, FunImage } from "../../../component";
import { useTranslation } from "react-i18next";
import MovieLocationByIDQuery from "../../../graphQL/Query/TravelIdeas/MovieLocationByID";
import ListDestinationByMovie from "../../../graphQL/Query/TravelIdeas/ListDestinationByMovie";
import Liked from "../../../graphQL/Mutation/Destination/Liked";
import UnLiked from "../../../graphQL/Mutation/unliked";
import Ripple from "react-native-material-ripple";
import { RNToasty } from "react-native-toasty";

const AnimatedIndicator = Animated.createAnimatedComponent(ActivityIndicator);
const { width, height } = Dimensions.get("screen");
const TabBarHeight = 50;
const HeaderHeight = width - 70;
const SafeStatusBar = Platform.select({
  ios: 44,
  android: StatusBar.currentHeight,
});

export default function Detail_movie(props, { navigation, route }) {
  console.log("props", props);
  let [token, setToken] = useState(props.route.params.token);
  let movie_id = props.route.params.movie_id;
  let [canScroll, setCanScroll] = useState(true);
  let [movie_byid, setMoviebyid] = useState({});
  const { t } = useTranslation();
  const HeaderComponent = {
    headerShown: true,
    transparent: false,
    tabBarVisble: false,
    tabBarLabel: "Unesco",
    headerTintColor: "white",
    headerTitle: movie_byid.title,
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

  let [listdestinasi_bymovie, setlistdestinasi_bymovie] = useState([]);
  const [fetchDataAnotherDes, { data, loading, error }] = useLazyQuery(
    ListDestinationByMovie,
    {
      variables: {
        movie_id: movie_id,
      },
      fetchPolicy: "network-only",
      context: {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
      onCompleted: () => {
        setlistdestinasi_bymovie(data.listdestinasi_bymovie);
      },
    }
  );
  // console.log("des", listdestinasi_bymovie);

  const [
    refetchmovie,
    { data: datamovie, loading: loadingmovie, error: errormovie },
  ] = useLazyQuery(MovieLocationByIDQuery, {
    variables: {
      movie_id: movie_id,
    },
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    onCompleted: () => {
      setMoviebyid(datamovie.movie_byid);
    },
  });

  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    await setToken(tkn);
    await refetchmovie();
    await fetchDataAnotherDes();
  };

  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      loadAsync();
    });
    return unsubscribe;
  }, [props.navigation, HeaderComponent]);

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
    console.log("masuklike");
    if (token && token !== "" && token !== null) {
      try {
        let response = await mutationliked({
          variables: {
            destination_id: id,
          },
        });
        if (loadingLike) {
          Alert.alert("Loading!!");
        }
        if (errorLike) {
          throw new Error("Error Input");
        }

        if (response.data) {
          fetchDataAnotherDes();
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
        fetchDataAnotherDes();
      }
    } else {
      props.navigation.navigate("AuthStack", {
        screen: "LoginScreen",
      });
      RNToasty.Show({
        title: t("pleaselogin"),
        position: "bottom",
      });
    }
  };

  const _unliked = async (id, index) => {
    if (token && token !== "" && token !== null) {
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
          fetchDataAnotherDes();
          if (
            response.data.unset_wishlist.code === 200 ||
            response.data.unset_wishlist.code === "200"
          ) {
          } else {
            throw new Error(response.data.unset_wishlist.message);
          }
        }
      } catch (error) {
        fetchDataAnotherDes();
      }
    } else {
      refetch();
      props.navigation.navigate("AuthStack", {
        screen: "LoginScreen",
      });
      RNToasty.Show({
        title: t("pleaselogin"),
        position: "bottom",
      });
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
            source={
              movie_byid.cover ? { uri: movie_byid.cover } : default_image
            }
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
            <View
              style={{
                width: HeaderHeight - 160,
                height: HeaderHeight - 80,
                // borderWidth: 1,
                borderRadius: 10,
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
              <Image
                source={
                  movie_byid.cover ? { uri: movie_byid.cover } : default_image
                }
                style={{
                  width: HeaderHeight - 160,
                  height: HeaderHeight - 80,
                  borderRadius: 10,
                }}
                resizeMode="cover"
              />
            </View>
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
              {movie_byid.title}
            </Text>
            <Text
              size="description"
              style={{
                textAlign: "justify",
              }}
            >
              {movie_byid.description}
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
        {/* {token ? ( */}
        <FlatList
          data={listdestinasi_bymovie}
          horizontal={false}
          renderItem={({ item, index }) => (
            <Pressable
              onPress={() => {
                props?.route?.params && props?.route?.params?.iditinerary
                  ? props.navigation.push("DestinationUnescoDetail", {
                      id: item.id,
                      name: item.name,
                      token: token,
                      iditinerary: props.route.params.iditinerary,
                      datadayaktif: props.route.params.datadayaktif,
                    })
                  : props.navigation.push("DestinationUnescoDetail", {
                      id: item.id,
                      name: item.name,
                      token: token,
                    });
              }}
              key={index}
              style={{
                borderWidth: 1,
                borderColor: "#F3F3F3",
                borderRadius: 10,
                height: 170,
                // padding: 10,
                marginTop: 10,
                width: "100%",
                flexDirection: "row",
                backgroundColor: "#FFF",
                shadowColor: "#FFF",
                shadowOffset: {
                  width: 0,
                  height: 5,
                },
                shadowOpacity: 0.1,
                shadowRadius: 6.27,

                elevation: 6,
              }}
            >
              <View style={{ justifyContent: "center" }}>
                {/* Image */}
                <FunImage
                  source={{ uri: item.images.image }}
                  style={{
                    width: 150,
                    height: "100%",
                    borderBottomLeftRadius: 10,
                    borderTopLeftRadius: 10,
                  }}
                />
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    position: "absolute",
                    top: 10,
                    right: 10,
                    left: 10,
                    width: 130,
                    zIndex: 2,
                  }}
                >
                  {item.liked === true ? (
                    <Pressable
                      onPress={() => _unliked(item.id)}
                      style={{
                        backgroundColor: "#F3F3F3",
                        height: 30,
                        width: 30,
                        borderRadius: 17,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Love height={15} width={15} />
                    </Pressable>
                  ) : (
                    <Pressable
                      onPress={() => _liked(item.id)}
                      style={{
                        backgroundColor: "#F3F3F3",
                        height: 30,
                        width: 30,
                        borderRadius: 17,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <LikeEmpty height={15} width={15} />
                    </Pressable>
                  )}
                  <View
                    style={{
                      flexDirection: "row",
                      backgroundColor: "#F3F3F3",
                      borderRadius: 3,
                      justifyContent: "center",
                      alignItems: "center",
                      paddingHorizontal: 5,
                      height: 25,
                    }}
                  >
                    <Star height={15} width={15} />
                    <Text size="description" type="bold">
                      {item.rating.substr(0, 3)}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Keterangan */}
              {/* rating */}
              <View
                style={{
                  flex: 1,
                  padding: 10,
                  height: 170,
                  justifyContent: "space-between",
                }}
              >
                <View>
                  {/* Title */}
                  <Text
                    size="label"
                    type="bold"
                    style={{ marginTop: 2 }}
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>

                  {/* Maps */}
                  <View
                    style={{
                      flexDirection: "row",
                      marginTop: 5,
                      alignItems: "center",
                    }}
                  >
                    <PinHijau height={15} width={15} />
                    <Text
                      size="description"
                      type="regular"
                      style={{ marginLeft: 5 }}
                      numberOfLines={1}
                    >
                      {item.cities.name}
                    </Text>
                  </View>
                </View>
                {/* Great for */}

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    height: 50,
                    marginTop: 10,
                    alignItems: "flex-end",
                  }}
                >
                  <View>
                    <Text size="description" type="bold">
                      Great for :
                    </Text>
                    <View style={{ flexDirection: "row" }}>
                      {item.greatfor.length > 0 ? (
                        item.greatfor.map((item, index) => {
                          return index < 3 ? (
                            <FunIcon
                              key={index}
                              icon={item.icon}
                              fill="#464646"
                              height={35}
                              width={35}
                            />
                          ) : null;
                        })
                      ) : (
                        <Text>-</Text>
                      )}
                    </View>
                  </View>
                  <Button
                    onPress={() => {
                      props.route.params && props.route.params.iditinerary
                        ? props.navigation.dispatch(
                            StackActions.replace("ItineraryStack", {
                              screen: "ItineraryChooseday",
                              params: {
                                Iditinerary: props.route.params.iditinerary,
                                Kiriman: item.id,
                                token: token,
                                Position: "destination",
                                datadayaktif: props.route.params.datadayaktif,
                              },
                            })
                          )
                        : props.navigation.push("ItineraryStack", {
                            screen: "ItineraryPlaning",
                            params: {
                              idkiriman: item.id,
                              Position: "destination",
                            },
                          });
                    }}
                    size="small"
                    text={"Add"}
                    // style={{ marginTop: 15 }}
                  />
                </View>
              </View>
            </Pressable>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {},
  header: {},
});
