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
import DeviceInfo from "react-native-device-info";
const deviceId = DeviceInfo.getModel();
import { default_image } from "../../../assets/png";
import {
  ShareBlack,
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
  StatusBar as Satbar,
  ModalLogin,
} from "../../../component";
import { useTranslation } from "react-i18next";
import MovieLocationByIDQuery from "../../../graphQL/Query/TravelIdeas/MovieLocationByID";
import ListDestinationByMovie from "../../../graphQL/Query/TravelIdeas/ListDestinationByMovie";
import Liked from "../../../graphQL/Mutation/Destination/Liked";
import UnLiked from "../../../graphQL/Mutation/unliked";
import Ripple from "react-native-material-ripple";
import { RNToasty } from "react-native-toasty";
import normalize from "react-native-normalize";

const AnimatedIndicator = Animated.createAnimatedComponent(ActivityIndicator);
const { width, height } = Dimensions.get("screen");
const TabBarHeight = 50;
const HeaderHeight = width - 70;
const Notch = DeviceInfo.hasNotch();
const SafeStatusBar = Platform.select({
  ios: Notch ? 48 : 20,
  android: StatusBar.currentHeight,
});

export default function Detail_movie(props) {
  const { t } = useTranslation();
  let [token, setToken] = useState(props.route.params.token);
  let movie_id = props?.route?.params?.movie_id;
  let [modalShare, setModalShare] = useState(false);
  let [modalLogin, setModalLogin] = useState(false);
  let [movie_byid, setMoviebyid] = useState({});

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

  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", () => {
      loadAsync();
    });
    return unsubscribe;
  }, [props.navigation]);

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

  const HEADER_MAX_HEIGHT = normalize(240);
  const HEADER_MIN_HEIGHT = normalize(50);
  const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

  let [scrollY] = useState(new Animated.Value(0));

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -HEADER_SCROLL_DISTANCE],
    extrapolate: "clamp",
  });
  const shareTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE, HEADER_SCROLL_DISTANCE + 5],
    outputRange: [0, -HEADER_SCROLL_DISTANCE, -HEADER_SCROLL_DISTANCE - 100],
    extrapolate: "clamp",
  });

  const titleScale = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 1, 1.2],
    extrapolate: "clamp",
  });
  const titleTranslateX = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 20, 45],
    extrapolate: "clamp",
  });
  const titleTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0, -8],
    extrapolate: "clamp",
  });

  let imageTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 100],
    extrapolate: "clamp",
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 1, 0],
    extrapolate: "clamp",
  });
  const backOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });
  const titleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE - 10, HEADER_SCROLL_DISTANCE + 10],
    outputRange: [0, 0, 1],
    extrapolate: "clamp",
  });

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
      <ModalLogin
        modalLogin={modalLogin}
        setModalLogin={() => setModalLogin(false)}
        props={props}
      />
      <Satbar backgroundColor="#14646E" />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: HEADER_MAX_HEIGHT + normalize(20),
          backgroundColor: "#fff",
          paddingBottom: 20,
        }}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        <View
          style={{
            justifyContent: "flex-start",
            paddingHorizontal: 20,
            marginBottom: 15,
          }}
        >
          <View
            style={{
              width: "100%",
              marginBottom: 5,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text size="title" type="bold" style={{ marginBottom: 5, flex: 1 }}>
              {movie_byid?.title}
            </Text>
            <TouchableOpacity
              type="circle"
              color="secondary"
              style={{
                alignSelf: "flex-end",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                backgroundColor: "#F6F6F6",
                height: 30,
                width: 30,
                borderRadius: 30,
              }}
              onPress={() => {
                token ? setModalShare(true) : setModalLogin(true);
              }}
            >
              <ShareBlack height={20} width={20} />
            </TouchableOpacity>
          </View>
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
                style={{
                  marginHorizontal: 20,
                  lineHeight: 22,
                  marginBottom: 15,
                }}
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
                    {/* {item.list_destination.liked === true ? (
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
                  )} */}
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
      </Animated.ScrollView>
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
                // props.navigation.navigate("TravelIdeaStack", {
                //   screen: "SendMovie",
                //   params: { movie: movie_byid },
                // });
                props.navigation.navigate("ChatStack", {
                  screen: "SendToChat",
                  params: {
                    dataSend: {
                      id: movie_byid?.id,
                      cover: movie_byid?.cover,
                      name: movie_byid?.title,
                      description: movie_byid?.description,
                    },
                    title: t("MovieLocation"),
                    tag_type: "tag_movie",
                  },
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

      {/* Button Share */}
      {/*       
      <Animated.View
        style={{
          width: "100%",
          height: 50,
          justifyContent: "center",
          alignContent: "center",
          position: "absolute",
          zIndex: 2,
          position: "absolute",
          marginTop:
            Platform.OS == "ios"
              ? Notch
                ? HEADER_MAX_HEIGHT + normalize(50)
                : HEADER_MAX_HEIGHT + normalize(30)
              : deviceId == "LYA-L29"
              ? HEADER_MAX_HEIGHT + normalize(30)
              : HEADER_MAX_HEIGHT + normalize(30),
          opacity: backOpacity,
          transform: [{ translateY: shareTranslateY }],
        }}
      >
        <TouchableOpacity
          type="circle"
          color="secondary"
          style={{
            position: "absolute",
            right: 20,
            zIndex: 20,
            alignSelf: "flex-end",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            backgroundColor: "#F6F6F6",
            height: 30,
            width: 30,
            borderRadius: 17,
          }}
          onPress={() => {
            token ? setModalShare(true) : setModalLogin(true);
          }}
        >
          <ShareBlack height={20} width={20} />
        </TouchableOpacity>
      </Animated.View> */}

      {/* End Button Share */}

      {/* Image Background */}

      <Animated.View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          backgroundColor: "#209fae",
          overflow: "hidden",
          height: HEADER_MAX_HEIGHT,
          transform: [{ translateY: headerTranslateY }],
          zIndex: 1,
          top: SafeStatusBar,
        }}
      >
        <Animated.Image
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            width: null,
            height: HEADER_MAX_HEIGHT,
            resizeMode: "cover",
            opacity: imageOpacity,
            transform: [{ translateY: imageTranslateY }],
            zIndex: 1,
          }}
          source={
            movie_byid?.cover ? { uri: movie_byid?.cover } : default_image
          }
        />
      </Animated.View>

      {/*End Image Background */}

      {/* Title Header */}

      <Animated.View
        style={{
          transform: [{ translateY: titleTranslateY }],
          height: 50,
          flex: 1,
          alignItems: "flex-start",
          justifyContent: "center",
          position: "absolute",
          left: 60,
          right: 20,
          zIndex: 999,
          opacity: titleOpacity,
          top: SafeStatusBar + 8,
        }}
      >
        <Text
          size="title"
          style={{
            color: "#fff",
          }}
          numberOfLines={1}
        >
          {movie_byid?.title}
        </Text>
      </Animated.View>

      {/*End Title Header */}

      {/* Back Arrow One */}

      <Animated.View
        style={{
          transform: [{ translateY: titleTranslateY }],
          height: 100,
          width: 100,
          position: "absolute",
          zIndex: 999,
          top: SafeStatusBar,
          opacity: backOpacity,
        }}
      >
        <Pressable
          onPress={() => props.navigation.goBack()}
          style={{
            marginTop: 15,
            marginLeft: 15,
            backgroundColor: "rgba(0,0,0, 0.5)",
            borderRadius: 40,
            height: 40,
            width: 40,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {Platform.OS == "ios" ? (
            <Arrowbackios height={15} width={15}></Arrowbackios>
          ) : (
            <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
          )}
        </Pressable>
      </Animated.View>

      {/* End Back Arrow One */}

      {/* Back Arrow Two */}

      <Animated.View
        style={{
          transform: [{ translateY: titleTranslateY }],
          height: 100,
          width: 100,
          position: "absolute",
          zIndex: 999,
          top: SafeStatusBar,
        }}
      >
        <Pressable
          onPress={() => props.navigation.goBack()}
          style={{
            marginTop: 15,
            marginLeft: 15,
            borderRadius: 40,
            height: 40,
            width: 40,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {Platform.OS == "ios" ? (
            <Arrowbackios height={15} width={15}></Arrowbackios>
          ) : (
            <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
          )}
        </Pressable>
      </Animated.View>

      {/* End Back Arrow Two */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  header: {},
});
