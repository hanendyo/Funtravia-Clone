import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  Platform,
  StatusBar,
  StyleSheet,
  View,
  ScrollView,
  Pressable,
  Modal,
  TouchableOpacity,
} from "react-native";
import { useMutation, useLazyQuery } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { default_image } from "../../../assets/png";
import {
  SharePutih,
  Star,
  PinHijau,
  Love,
  LikeEmpty,
  Arrowbackios,
  Arrowbackwhite,
  BlockDestination,
  MovieIcon,
  UnescoIcon,
  Xgray,
} from "../../../assets/svg";
import {
  Button,
  FunIcon,
  Text,
  FunImage,
  shareAction,
  CopyLink,
} from "../../../component";
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

export default function Detail_movie(props) {
  let [token, setToken] = useState(props.route.params.token);
  let movie_id = props?.route?.params?.movie_id;
  let [modalShare, setModalShare] = useState(false);
  let [movie_byid, setMoviebyid] = useState({});
  const { t } = useTranslation();
  const HeaderComponent = {
    headerShown: true,
    transparent: false,
    tabBarVisble: false,
    tabBarLabel: "Unesco",
    headerTintColor: "white",
    headerTitle: movie_byid?.title,
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      fontFamily: "Lato-Bold",
      fontSize: 18,
      color: "white",
    },
    headerLeft: () => (
      <Button
        text={""}
        size="medium"
        type="circle"
        variant="transparent"
        onPress={() => props.navigation.goBack()}
        style={{
          marginLeft: 10,
          height: 55,
        }}
      >
        {Platform.OS == "ios" ? (
          <Arrowbackios height={15} width={15}></Arrowbackios>
        ) : (
          <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
        )}
      </Button>
    ),
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

  const [
    refetchmovie,
    { data: datamovie, loading: loadingmovie, error: errormovie },
  ] = useLazyQuery(MovieLocationByIDQuery, {
    variables: {
      // movie_id: movie_id,
      movie_id: props.route.params.movie_id,
    },
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    onCompleted: () => {
      setMoviebyid(datamovie?.movie_detail);
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
    // refetchmovie();
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

  const [loadAdd, setLoadAdd] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoadAdd(false);
    }, 2000);
  });

  const addToPlan = (kiriman) => {
    if (token && token !== null && token !== "") {
      if (kiriman) {
        props?.route?.params && props?.route?.params?.iditinerary
          ? props.navigation.dispatch(
              StackActions.replace("ItineraryStack", {
                screen: "ItineraryChooseday",
                params: {
                  Iditinerary: props?.route?.params?.iditinerary,
                  Kiriman: kiriman.id,
                  token: token,
                  Position: "destination",
                  datadayaktif: props.route.params.datadayaktif,
                },
              })
            )
          : props.navigation.navigate("ItineraryStack", {
              screen: "ItineraryPlaning",
              params: {
                idkiriman: kiriman.id,
                Position: "destination",
              },
            });
      } else {
        props?.route?.params && props?.route?.params?.iditinerary
          ? props.navigation.dispatch(
              StackActions.replace("ItineraryStack", {
                screen: "ItineraryChooseday",
                params: {
                  Iditinerary: props?.route?.params?.iditinerary,
                  Kiriman: data?.destinationById.id,
                  token: token,
                  Position: "destination",
                  datadayaktif: props.route.params.datadayaktif,
                },
              })
            )
          : props.navigation.navigate("ItineraryStack", {
              screen: "ItineraryPlaning",
              params: {
                idkiriman: kiriman.id,
                Position: "destination",
              },
            });
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

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
      <Modal
        useNativeDriver={true}
        visible={modalShare}
        onRequestClose={() => setModalShare(false)}
        transparent={true}
        animationType="fade"
      >
        <Pressable
          onPress={() => setModalShare(false)}
          style={{
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
            justifyContent: "center",
            opacity: 0.7,
            backgroundColor: "#000",
            position: "absolute",
          }}
        ></Pressable>
        <View
          style={{
            width: Dimensions.get("screen").width - 100,
            marginHorizontal: 50,
            backgroundColor: "#FFF",
            zIndex: 15,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            borderRadius: 5,
            marginTop: Dimensions.get("screen").height / 4,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              width: Dimensions.get("screen").width - 100,
              // paddingHorizontal: 20,
              borderRadius: 5,
            }}
          >
            <View
              style={{
                borderBottomWidth: 1,
                borderColor: "#d1d1d1",
                alignItems: "center",
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
                backgroundColor: "#f6f6f6",
                justifyContent: "center",
              }}
            >
              <Text size="title" type="bold" style={{ marginVertical: 15 }}>
                {t("option")}
              </Text>
            </View>
            <Pressable
              onPress={() => setModalShare(false)}
              style={{
                position: "absolute",
                right: 0,
                width: 55,
                justifyContent: "center",
                alignItems: "center",
                height: 60,
              }}
            >
              <Xgray width={15} height={15} />
            </Pressable>
            <Pressable
              style={{
                alignItems: "center",
                borderBottomWidth: 1,
                // height: 50,
                borderColor: "#d1d1d1",
              }}
              onPress={() => {
                setModalShare(false);
                props.navigation.navigate("TravelIdeaStack", {
                  screen: "SendMovie",
                  params: { movie: movie_byid },
                });
              }}
            >
              <Text size="label" type="regular" style={{ marginVertical: 15 }}>
                {t("Send")}...
              </Text>
            </Pressable>
            <Pressable
              style={{
                alignItems: "center",
                borderBottomWidth: 1,
                // height: 50,
                borderColor: "#d1d1d1",
              }}
              onPress={() => {
                setModalShare(false);
                shareAction({
                  from: "movie",
                  target: movie_byid?.id,
                });
              }}
            >
              <Text size="label" type="regular" style={{ marginVertical: 15 }}>
                {t("shareTo")}...
              </Text>
            </Pressable>
            <Pressable
              style={{
                alignItems: "center",
                borderBottomWidth: 1,
                height: 50,
                borderColor: "#d1d1d1",
              }}
              onPress={() => {
                setModalShare(false);
                CopyLink({
                  from: "movie",
                  target: movie_byid?.id,
                });
              }}
            >
              <Text size="label" type="regular" style={{ marginVertical: 15 }}>
                {t("copyLink")}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          width: width,
          height: HeaderHeight - HeaderHeight / 2,
        }}
      >
        <ImageBackground
          source={
            movie_byid?.cover ? { uri: movie_byid?.cover } : default_image
          }
          style={{
            width: width,
            height: HeaderHeight - HeaderHeight / 2,
            justifyContent: "center",
            padding: 20,
            alignItems: "center",
          }}
          resizeMode="cover"
          // blurRadius={3}
        ></ImageBackground>
      </View>
      <View
        style={{
          alignItems: "center",
        }}
      >
        <Ripple
          onPress={() => {
            setModalShare(true);
          }}
          style={{
            height: 44,
            borderRadius: 20,
            borderColor: "grey",
            paddingVertical: 0,
            paddingHorizontal: 30,
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
          <SharePutih height={20} width={20} />
          <Text
            type="bold"
            size="label"
            style={{
              color: "white",
              marginLeft: 10,
              paddingVertical: 0,
            }}
          >
            {t("share")}
          </Text>
        </Ripple>
      </View>
      {loadingmovie && loadAdd ? (
        <View
          style={{
            height: Dimensions.get("screen").height,
            width: Dimensions.get("screen").width - 30,
            // justifyContent: "center",
            marginTop: 150,
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color="#209fae" />
        </View>
      ) : null}
      <View
        style={{
          justifyContent: "flex-start",
          paddingHorizontal: 20,
          marginBottom: 15,
        }}
      >
        <View
          style={{
            // borderWidth: 1,
            marginTop: 10,
          }}
        >
          <Text size="title" type="bold" style={{ marginBottom: 5 }}>
            {movie_byid?.title}
          </Text>
          <Text
            type="regular"
            size="label"
            style={{
              textAlign: "left",
              lineHeight: 20,
            }}
          >
            {movie_byid?.description}
          </Text>
        </View>
      </View>
      {movie_byid?.movie_destination?.map((item, index) => {
        return (
          <View
            key={index}
            style={{
              width: Dimensions.get("screen").width,
              // marginBottom: 15,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                marginHorizontal: 20,
              }}
            >
              <Text size="label" type="bold" style={{ marginBottom: 5 }}>
                {t("location") + " " + (index + 1)} :
              </Text>
              <Text
                size="label"
                type="bold"
                // style={{ marginHorizontal: 20, marginBottom: 5 }}
              >
                {" " + item.list_destination.name}
              </Text>
            </View>
            <Image
              source={item ? { uri: item.image } : default_image}
              style={{
                height: 150,
                width: Dimensions.get("screen").width - 30,
                marginHorizontal: 15,
                borderRadius: 5,
                marginBottom: 5,
              }}
            />
            <Text
              style={{ marginHorizontal: 20, marginBottom: 10 }}
              size="description"
              type="light"
            >
              {item.description_image}
            </Text>
            <Text
              style={{ marginHorizontal: 20, lineHeight: 22, marginBottom: 15 }}
              size="label"
              type="regular"
            >
              {item.description}
            </Text>
          </View>
        );
      })}
      {loadingmovie ? null : (
        <View
          style={{
            backgroundColor: "#f6f6f6",
            justifyContent: "center",
            paddingHorizontal: 15,
            marginBottom: 15,
          }}
        >
          <Text
            style={{ textAlign: "center", marginBottom: 10, marginTop: 30 }}
            size="label"
            type="bold"
          >
            {t("batasText1")} {movie_byid?.title} {t("batasText2")}
          </Text>
          <Text
            style={{ textAlign: "center", marginBottom: 30 }}
            size="label"
            type="regular"
          >
            {t("letsText")}
          </Text>
        </View>
      )}
      {movie_byid?.movie_destination?.map((item, index) => {
        return (
          <View
            key={index}
            style={{
              width: Dimensions.get("screen").width,
              marginBottom: 15,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                marginHorizontal: 20,
                alignItems: "center",
                marginBottom: 15,
              }}
            >
              <BlockDestination
                height={20}
                width={20}
                style={{ marginLeft: -5 }}
              />
              <Text size="label" type="bold" style={{}}>
                {t("location") + " " + (index + 1)} :
              </Text>
            </View>
            <Pressable
              onPress={() => {
                props.navigation.push("DestinationUnescoDetail", {
                  id: item.list_destination.id,
                  name: item.list_destination.name,
                  token: token,
                });
              }}
              style={{
                borderWidth: 1,
                borderColor: "#F3F3F3",
                borderRadius: 10,
                height: 190,
                width: Dimensions.get("screen").width - 30,
                marginHorizontal: 15,
                flexDirection: "row",
                backgroundColor: "#FFF",
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.22,
                shadowRadius: 2.22,
                elevation: 3,
              }}
            >
              <View style={{ justifyContent: "center" }}>
                <FunImage
                  source={item ? { uri: item.image } : default_image}
                  style={{
                    width: 160,
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
                    width: "87%",
                    zIndex: 2,
                    // borderWidth: 3,
                    borderColor: "#209fae",
                  }}
                >
                  {item.list_destination.liked === true ? (
                    <Pressable
                      // onPress={() => _unlikedAnother(item.id)}
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
                      // onPress={() => _likedAnother(item.id)}
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
                  {item?.list_destination?.rating > 0 ? (
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
                        {item.list_destination.rating.substr(0, 3)}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
              <View
                style={{
                  flex: 1,
                  paddingHorizontal: 8,
                  paddingVertical: 7,
                  justifyContent: "space-between",
                }}
              >
                <View style={{ borderWidth: 0 }}>
                  {/* Title */}
                  <View
                    style={{
                      flexDirection: "row",
                      paddingHorizontal: 3,
                    }}
                  >
                    <BlockDestination
                      height={16}
                      width={16}
                      style={{ marginTop: 5 }}
                    />
                    <Text
                      size="title"
                      type="bold"
                      numberOfLines={2}
                      style={{
                        marginLeft: 5,
                        marginBottom: 5,
                        flexWrap: "wrap",
                        width: "90%",
                      }}
                    >
                      {item.list_destination.name}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginLeft: 5,
                    }}
                  >
                    <PinHijau height={15} width={15} />
                    <Text
                      size="description"
                      type="regular"
                      style={{ marginLeft: 5 }}
                      numberOfLines={1}
                    >
                      {item.list_destination.cities.name}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    marginTop: 5,
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "flex-end",
                      paddingHorizontal: 7,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                      }}
                    >
                      {item.list_destination?.movie_location?.length > 0 ? (
                        <MovieIcon
                          height={33}
                          width={33}
                          style={{ marginRight: 5 }}
                        />
                      ) : null}
                      {item.list_destination.type?.name
                        .toLowerCase()
                        .substr(0, 6) == "unesco" ? (
                        <UnescoIcon height={33} width={33} />
                      ) : null}
                    </View>
                    <View
                      style={{
                        marginBottom:
                          item.list_destination.greatfor.length > 0 ? 0 : 7,
                      }}
                    >
                      {item.list_destination.greatfor.length > 0 ? (
                        <Text size="label" type="bold">
                          {t("GreatFor") + " :"}
                        </Text>
                      ) : null}
                      <View
                        style={{
                          flexDirection: "row",
                          marginLeft: -5,
                        }}
                      >
                        {item.list_destination.greatfor.length > 0
                          ? item.list_destination.greatfor.map(
                              (item, index) => {
                                return index < 3 ? (
                                  <FunIcon
                                    key={"grat" + index}
                                    icon={item.icon}
                                    fill="#464646"
                                    height={40}
                                    width={40}
                                  />
                                ) : null;
                              }
                            )
                          : null}
                      </View>
                    </View>
                  </View>

                  <View
                    style={{
                      justifyContent: "flex-end",
                      width: 70,
                      paddingBottom: 5,
                      paddingRight: 5,
                    }}
                  >
                    <Button
                      onPress={() => addToPlan(item.list_destination)}
                      size="small"
                      text={"Add"}
                      // style={{ marginTop: 15 }}
                    />
                  </View>
                </View>
              </View>
            </Pressable>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {},
  header: {},
});
