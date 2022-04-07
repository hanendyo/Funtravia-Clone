import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  View,
  Pressable,
  Modal,
  TouchableOpacity,
  BackHandler,
  SafeAreaView,
} from "react-native";
import { useMutation, useLazyQuery } from "@apollo/client";
import DeviceInfo from "react-native-device-info";
const deviceId = DeviceInfo.getModel();
import { default_image } from "../../../assets/png";
import {
  ShareBlack,
  Arrowbackios,
  Arrowbackwhite,
  Xgray,
} from "../../../assets/svg";
import {
  Text,
  shareAction,
  CopyLink,
  StatusBar as Satbar,
  ModalLogin,
  CardDestination,
  FunImage,
} from "../../../component";
import { useTranslation } from "react-i18next";
import MovieLocationByIDQuery from "../../../graphQL/Query/TravelIdeas/MovieLocationByID";
import ListDestinationByMovie from "../../../graphQL/Query/TravelIdeas/ListDestinationByMovie";
import Liked from "../../../graphQL/Mutation/Destination/Liked";
import UnLiked from "../../../graphQL/Mutation/unliked";
import { RNToasty } from "react-native-toasty";
import normalize from "react-native-normalize";
import { useSelector } from "react-redux";

const AnimatedIndicator = Animated.createAnimatedComponent(ActivityIndicator);
const { width, height } = Dimensions.get("screen");
const TabBarHeight = 50;
const HeaderHeight = width - 70;
const Notch = DeviceInfo.hasNotch();

export default function Detail_movie(props) {
  const NotchAndro = StatusBar.currentHeight > 24;
  const { t } = useTranslation();
  let tokenApps = useSelector((data) => data.token);
  let movie_id = props.route.params?.movie_id;
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
          Authorization: tokenApps,
        },
      },
      onCompleted: () => {
        setlistdestinasi_bymovie(data?.listdestinasi_bymovie);
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
        Authorization: tokenApps,
      },
    },
    onCompleted: () => {
      setMoviebyid(datamovie?.movie_detail);
    },
  });

  const loadAsync = async () => {
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
        Authorization: tokenApps,
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
        Authorization: tokenApps,
      },
    },
  });

  const _liked = async (id, index) => {
    if (tokenApps) {
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
    if (tokenApps) {
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
    if (tokenApps) {
      if (kiriman) {
        props?.route?.params && props?.route?.params?.iditinerary
          ? props.navigation.dispatch(
              StackActions.replace("ItineraryStack", {
                screen: "ItineraryChooseday",
                params: {
                  Iditinerary: props?.route?.params?.iditinerary,
                  Kiriman: kiriman.id,
                  token: tokenApps,
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
                  token: tokenApps,
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
    outputRange: [0, -HEADER_SCROLL_DISTANCE + 5],
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
    outputRange: [0, 0, 0],
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

  const backOpacitySecond = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE - 100, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0, 1],
    extrapolate: "clamp",
  });

  const titleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE - 10, HEADER_SCROLL_DISTANCE + 10],
    outputRange: [0, 0, 1],
    extrapolate: "clamp",
  });

  let indeks = useRef();

  if (loadingmovie)
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          height: Dimensions.get("screen").height,
        }}
      >
        <ActivityIndicator color="#029fae" size="large" />
      </View>
    );

  return (
    <>
      <Satbar backgroundColor="#14646E" />
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#FFF",
        }}
      >
        <ModalLogin
          modalLogin={modalLogin}
          setModalLogin={() => setModalLogin(false)}
          props={props}
        />

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
              <Text
                size="title"
                type="bold"
                style={{ marginBottom: 5, flex: 1 }}
              >
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
                  tokenApps ? setModalShare(true) : setModalLogin(true);
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
                lineHeight: 21,
              }}
            >
              {movie_byid?.description}
            </Text>
          </View>
          {movie_byid?.movie_destination?.map((item, index) => {
            indeks = index;
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
                <FunImage
                  source={
                    item && item.image
                      ? { uri: item.image }
                      : { uri: item.list_destination.images[0].image }
                  }
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
          {listdestinasi_bymovie && listdestinasi_bymovie.length > 0 ? (
            <CardDestination
              data={listdestinasi_bymovie}
              props={props}
              setData={(e) => setlistdestinasi_bymovie(e)}
              token={tokenApps}
              dataFrom={"movie"}
              dataFromId={movie_byid?.id}
            />
          ) : null}
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
                <Text
                  size="label"
                  type="regular"
                  style={{ marginVertical: 15 }}
                >
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
                <Text
                  size="label"
                  type="regular"
                  style={{ marginVertical: 15 }}
                >
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
                    success: t("successCopyLink"),
                    failed: t("failedCopyLink"),
                  });
                }}
              >
                <Text
                  size="label"
                  type="regular"
                  style={{ marginVertical: 15 }}
                >
                  {t("copyLink")}
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Image Background */}

        <Animated.View
          pointerEvents="none"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            backgroundColor: "#14646e",
            overflow: "hidden",
            height:
              Platform.OS == "ios"
                ? HEADER_MAX_HEIGHT - 10
                : HEADER_MAX_HEIGHT - 5,
            transform: [{ translateY: headerTranslateY }],
            zIndex: 1,
            top: 0,
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
            height: Platform.OS === "ios" ? normalize(45) : normalize(50),
            flex: 1,
            alignItems: "flex-start",
            justifyContent: "center",
            position: "absolute",
            left: 0,
            right: -10,
            bottom: 0,
            zIndex: 999,
            paddingLeft: 60,
            backgroundColor: "#209FAE",
            opacity: titleOpacity,
            top: Platform.OS === "ios" ? 1 : 0,
          }}
        >
          <Text
            size="title"
            style={{
              color: "#fff",

              // marginBottom:
              //   Platform.OS == "android" ? (NotchAndro ? 5 : 0) : Notch ? 0 : 5,
            }}
            type="bold"
            numberOfLines={1}
          >
            {movie_byid?.title}
          </Text>
        </Animated.View>

        {/*End Title Header */}

        {/* Back Arrow One */}
        {/* before scroll */}

        <Animated.View
          style={{
            transform: [{ translateY: titleTranslateY }],
            height: 100,
            width: 100,
            position: "absolute",
            zIndex: 999,
            top: 0,
            left: 2,
            opacity: backOpacity,
          }}
        >
          <Pressable
            onPress={() => {
              props.navigation.goBack();
            }}
            style={{
              marginTop: Platform.OS == "ios" ? 7 : 10,
              marginLeft: 15,
              backgroundColor: "rgba(0,0,0, 0.5)",
              borderRadius: 35,
              height: 35,
              width: 35,
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
        {/* after scroll */}

        <Animated.View
          style={{
            transform: [{ translateY: titleTranslateY }],
            flexDirection: "row",
            height: Platform.OS === "ios" ? normalize(45) : normalize(50),
            flex: 1,
            alignItems: "center",
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
            backgroundColor: "#209FAE",
            opacity: titleOpacity,
            top: 0,
          }}
        >
          <Pressable
            onPress={() => props.navigation.goBack()}
            style={{
              marginTop: Platform.OS == "ios" ? 0 : 3,
              marginLeft: Platform.OS == "ios" ? 14 : 10,
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
          <Text
            size="title"
            style={{
              color: "#fff",
              marginLeft: Platform.OS === "ios" ? 5 : 10,
            }}
            type="bold"
            numberOfLines={1}
          >
            {movie_byid?.title}
          </Text>
        </Animated.View>

        {/* End Back Arrow Two */}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {},
  header: {},
});
