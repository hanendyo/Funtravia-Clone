import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Animated,
  PanResponder,
  Platform,
  StatusBar,
  ActivityIndicator,
  Linking,
  Image,
  Pressable,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Modal as ModalRN,
  TextInput,
  ViewBase,
} from "react-native";
import {
  Arrowbackwhite,
  Star,
  LikeEmpty,
  ShareBlack,
  Love,
  UnescoIcon,
  MovieIcon,
  PinHijau,
  Clock,
  WebsiteHitam,
  Globe,
  Xhitam,
  TeleponHitam,
  InstagramHitam,
  Xgray,
  Mapsborder,
  BlockDestination,
  Arrowbackios,
} from "../../../assets/svg";
import { TabBar, TabView, SceneMap } from "react-native-tab-view";
import Modal from "react-native-modal";
import Ripple from "react-native-material-ripple";
import {
  Text,
  Button,
  StatusBar as Satbar,
  shareAction,
  FunImage,
  FunIcon,
  CopyLink,
  Truncate,
  FunImageBackground,
} from "../../../component";
import DestinationById from "../../../graphQL/Query/Destination/DestinationById";
import ListDesAnother from "../../../graphQL/Query/Destination/ListDesAnother";
import { useMutation, useLazyQuery } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Generals from "./Generals";
import Reviews from "./Reviews";
import { StackActions } from "@react-navigation/native";
import Liked from "../../../graphQL/Mutation/Destination/Liked";
import unLiked from "../../../graphQL/Mutation/Destination/UnLiked";
import BottomButton from "./BottomButton";
import ActivityModal from "./ActivityModal";
import FacilityModal from "./FacilityModal";
import ServiceModal from "./ServiceModal";
import DeviceInfo from "react-native-device-info";
import IndexSkeleton from "./IndexSkeleton";
import { RNToasty } from "react-native-toasty";
import { useTranslation } from "react-i18next";
import ImageSlide from "../../../component/src/ImageSlide";
import { default_image, search_button } from "../../../assets/png";
import normalize from "react-native-normalize";
import ImageBackground from "../../../component/src/FunImageBackground";

const Index = (props) => {
  const { t, i18n } = useTranslation();
  const [token, setToken] = useState(props.route.params.token);
  let [dataDestination, setDataDestination] = useState();

  console.log("dataDestination", dataDestination);

  const [fetchData, { data, loading, error }] = useLazyQuery(DestinationById, {
    variables: { id: props.route.params.id },
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    onCompleted: () => {
      let tab = [{ key: "general", title: "General" }];
      tab.push({ key: "review", title: "Review" });

      dataDestination?.article_header.map((item, index) => {
        tab.push({
          key: item.title,
          title: item.title,
          data: item.content,
        });
      });
      setRoutes(tab);
      setDataDestination(data?.destinationById);
    },
  });

  let [anotherDes, setAnotherDes] = useState([]);

  const [
    fetchDataAnotherDes,
    {
      data: dataDesAnother,
      loading: loadingDesAnother,
      error: errorDesAnother,
    },
  ] = useLazyQuery(ListDesAnother, {
    variables: { id: props.route.params.id },
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    onCompleted: () => {
      setAnotherDes(dataDesAnother.destination_another_place);
    },
  });

  let [setting, setSetting] = useState();

  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    await setToken(tkn);
    await fetchData();
    await fetchDataAnotherDes();

    let setsetting = await AsyncStorage.getItem("setting");
    await setSetting(JSON.parse(setsetting));
  };

  useEffect(() => {
    // props.navigation.setOptions(HeaderComponent);
    loadAsync();
    const unsubscribe = props.navigation.addListener("focus", () => {});
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
  ] = useMutation(unLiked, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const [
    mutationlikedAnother,
    {
      loading: loadingLikeAnother,
      data: dataLikeAnother,
      error: errorLikeAnother,
    },
  ] = useMutation(Liked, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const [
    mutationUnlikedAnother,
    {
      loading: loadingUnLikeAnother,
      data: dataUnLikeAnother,
      error: errorUnLikeAnother,
    },
  ] = useMutation(unLiked, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const _likedAnother = async (id) => {
    if (token && token !== "" && token !== null) {
      // var tempData = { ...dataAnother };
      // var index = tempData.another_place.findIndex((k) => k["id"] === id);
      // tempData.another_place[index].liked = true;
      // setDataAnother(tempData);
      try {
        let response = await mutationlikedAnother({
          variables: {
            destination_id: id,
            qty: 1,
          },
        });
        if (loadingLike) {
          alert("Loading!!");
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
            // var tempData = { ...dataAnother };
            // var index = tempData.another_place.findIndex((k) => k["id"] === id);
            // tempData.another_place[index].liked = true;
            // setDataAnother(tempData);
          } else {
            throw new Error(response.data.setDestination_wishlist.message);
          }
        }
      } catch (error) {
        // var tempData = { ...dataAnother };
        // var index = tempData.another_place.findIndex((k) => k["id"] === id);
        // tempData.another_place[index].liked = false;
        // setDataAnother(tempData);
        fetchDataAnotherDes();
        // alert("" + error);
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

  const _unlikedAnother = async (id) => {
    if (token && token !== "" && token !== null) {
      // var tempData = { ...dataAnother };
      // var index = tempData.another_place.findIndex((k) => k["id"] === id);
      // tempData.another_place[index].liked = false;
      // setDataAnother(tempData);
      try {
        let response = await mutationUnlikedAnother({
          variables: {
            destination_id: id,
          },
        });
        if (loadingUnLike) {
          alert("Loading!!");
        }
        if (errorUnLike) {
          throw new Error("Error Input");
        }
        if (response.data) {
          fetchDataAnotherDes();
          if (
            response.data.unset_wishlist_destinasi.code === 200 ||
            response.data.unset_wishlist_destinasi.code === "200"
          ) {
            // var tempData = { ...dataAnother };
            // var index = tempData.another_place.findIndex((k) => k["id"] === id);
            // tempData.another_place[index].liked = false;
            // setDataAnother(tempData);
          } else {
            throw new Error(response.data.unset_wishlist_destinasi.message);
          }
        }
      } catch (error) {
        fetchDataAnotherDes();
        // var tempData = { ...dataAnother };
        // var index = tempData.another_place.findIndex((k) => k["id"] === id);
        // tempData.another_place[index].liked = true;
        // setDataAnother(tempData);
        // alert("" + error);
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

  const _liked = async (id) => {
    if (token && token !== "" && token !== null) {
      var tempData = { ...dataDestination };
      tempData.liked = true;
      setDataDestination(tempData);
      try {
        let response = await mutationliked({
          variables: {
            destination_id: id,
            qty: 1,
          },
        });
        if (loadingLike) {
          alert("Loading!!");
        }
        if (errorLike) {
          throw new Error("Error Input");
        }
        if (response.data) {
          if (
            response.data.setDestination_wishlist.code === 200 ||
            response.data.setDestination_wishlist.code === "200"
          ) {
            var tempData = { ...dataDestination };
            tempData.liked = true;
            setDataDestination(tempData);
          } else {
            throw new Error(response.data.setDestination_wishlist.message);
          }
        }
      } catch (error) {
        var tempData = { ...dataDestination };
        tempData.liked = false;
        setDataDestination(tempData);
        alert("" + error);
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

  const _unliked = async (id) => {
    if (token && token !== "" && token !== null) {
      var tempData = { ...dataDestination };
      tempData.liked = false;
      setDataDestination(tempData);
      try {
        let response = await mutationUnliked({
          variables: {
            destination_id: id,
          },
        });
        if (loadingUnLike) {
          alert("Loading!!");
        }
        if (errorUnLike) {
          throw new Error("Error Input");
        }
        if (response.data) {
          if (
            response.data.unset_wishlist_destinasi.code === 200 ||
            response.data.unset_wishlist_destinasi.code === "200"
          ) {
            var tempData = { ...dataDestination };
            tempData.liked = false;
            setDataDestination(tempData);
          } else {
            throw new Error(response.data.unset_wishlist_destinasi.message);
          }
        }
      } catch (error) {
        var tempData = { ...dataDestination };
        tempData.liked = false;
        setDataDestination(tempData);
        alert("" + error);
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
                  Kiriman: dataDestination?.id,
                  token: token,
                  Position: "destination",
                  datadayaktif: props.route.params.datadayaktif,
                },
              })
            )
          : props.navigation.navigate("ItineraryStack", {
              screen: "ItineraryPlaning",
              params: {
                idkiriman: dataDestination?.id,
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

  //! RENDER GENERAL
  const renderGeneral = () => {
    return (
      <View>
        <ImageSlide
          index={indeks}
          show={modalss}
          dataImage={gambar}
          setClose={() => setModalss(false)}
        />
        {dataDestination?.description ? (
          <View
            style={{
              // minHeight: 30,
              marginTop: 15,
              width: Dimensions.get("screen").width,
              paddingHorizontal: 20,
            }}
          >
            <Text
              size="readable"
              type="regular"
              style={{
                lineHeight: 20,
                textAlign: "left",
              }}
              numberOfLines={lines}
              onTextLayout={layoutText}
            >
              {dataDestination?.description}
            </Text>
            {more && (
              <Text
                size="readable"
                type="regular"
                onPress={() => {
                  setMore(false);
                  setLines(0);
                }}
                style={{ color: "#209FAE" }}
              >
                {t("readMore")}
              </Text>
            )}
            {!more && (
              <Text
                size="readable"
                type="regular"
                onPress={() => {
                  setMore(true);
                  setLines(3);
                }}
                style={{ color: "#209FAE" }}
              >
                {t("readless")}
              </Text>
            )}
          </View>
        ) : null}

        {/* View GreatFor */}
        {dataDestination && dataDestination.greatfor.length > 0 ? (
          <View
            style={{
              width: Dimensions.get("screen").width,
              paddingHorizontal: 15,
              marginTop: 15,
            }}
          >
            <View
              style={{
                marginTop: 10,
                borderRadius: 10,
                minHeight: 60,
                justifyContent: "center",
                padding: 10,
                backgroundColor: "#FFF",
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 5,
                },
                shadowOpacity: 0.1,
                shadowRadius: 6.27,

                elevation: 6,
              }}
            >
              <Text size="label" type="bold" style={{ textAlign: "center" }}>
                {t("GreatFor")}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  // borderWidth: 1,
                }}
              >
                {dataDestination &&
                  dataDestination.greatfor.map((item, index) => {
                    return (
                      <View
                        key={"desk" + index}
                        style={{
                          // marginTop: 10,
                          width: (width - 50) / 4,
                          justifyContent: "center",
                          alignItems: "center",
                          // borderWidth: 1,
                        }}
                      >
                        <View
                          style={{
                            height: 60,
                            width: 60,
                            borderRadius: 30,
                            // backgroundColor: "#F6F6F6",
                            justifyContent: "center",
                            alignItems: "center",
                            // borderWidth: 1,
                          }}
                        >
                          <FunIcon icon={item?.icon} height={50} width={50} />
                        </View>
                        <Text
                          size="description"
                          type="regular"
                          style={{ marginTop: -5 }}
                        >
                          {item?.name}
                        </Text>
                      </View>
                    );
                  })}
              </View>
            </View>
          </View>
        ) : null}

        {/* View Facilites */}

        {dataDestination && dataDestination.core_facilities.length > 0 ? (
          <View
            style={{
              width: Dimensions.get("screen").width,
              paddingHorizontal: 15,
              marginTop:
                dataDestination && dataDestination.greatfor.length > 0 ? 0 : 15,
            }}
          >
            <View
              style={{
                marginTop: 10,
                borderRadius: 10,
                minHeight: 50,
                justifyContent: "center",
                padding: 10,
                backgroundColor: "#FFF",
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 5,
                },
                shadowOpacity: 0.1,
                shadowRadius: 6.27,

                elevation: 6,
              }}
            >
              <Text size="label" type="bold" style={{ textAlign: "center" }}>
                {t("PublicFacility")}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                }}
              >
                {dataDestination &&
                  dataDestination.core_facilities.map((item, index) => (
                    <View
                      key={"fac" + index}
                      style={{
                        // marginTop: 10,
                        width: (width - 50) / 4,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          height: 60,
                          width: 60,
                          borderRadius: 30,
                          // backgroundColor: "#F6F6F6",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FunIcon icon={item?.icon} height={50} width={50} />
                      </View>
                      <Text
                        // size="small"
                        type="light"
                        style={{ marginTop: -5 }}
                      >
                        {item?.name}
                      </Text>
                    </View>
                  ))}
              </View>
            </View>
          </View>
        ) : null}

        {/* Moview */}
        {dataDestination && dataDestination.movie_location.length > 0 ? (
          <>
            <View
              style={{
                width: Dimensions.get("screen").width,
                paddingHorizontal: 20,
                marginTop: 20,
                // borderWidth: 1,
              }}
            >
              <Text size="title" type="bold">
                {t("MovieLocation")}
              </Text>
              <Text
                size="description"
                type="regular"
                style={{ marginBottom: 3 }}
              >
                {t("WhereSubDestination")}
              </Text>
            </View>
            <ScrollView
              contentContainerStyle={{
                // width: Dimensions.get("screen").width,
                paddingLeft: 15,
                paddingRight: 10,
                // paddingBottom: 20,
                marginTop: 5,
              }}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              {dataDestination &&
                dataDestination.movie_location.map((item, index) => (
                  <Pressable
                    onPress={() => {
                      props.navigation.push("TravelIdeaStack", {
                        screen: "Detail_movie",
                        params: {
                          movie_id: item.id,
                          token: token,
                        },
                      });
                    }}
                    key={"mov" + index}
                    style={{
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: "#F3F3F3",
                      // height: 150,
                      marginBottom: 10,
                      flexDirection: "row",
                      // width: Dimensions.get("screen").width * 0.9,
                      width: Dimensions.get("screen").width * 0.9,
                      // padding: 10,
                      backgroundColor: "#FFF",
                      shadowColor: "#000",
                      shadowOffset: {
                        width: 0,
                        height: 5,
                      },
                      shadowOpacity: 0.1,
                      shadowRadius: 6.27,
                      elevation: 6,
                      marginRight: 5,
                    }}
                  >
                    <FunImage
                      source={
                        item?.cover ? { uri: item?.cover } : default_image
                      }
                      style={{
                        height: 150,
                        width: 120,
                        borderTopLeftRadius: 10,
                        borderBottomLeftRadius: 10,
                      }}
                    />
                    <View
                      style={{
                        flex: 1,
                        height: "100%",
                        marginHorizontal: 10,
                        paddingVertical: 5,
                      }}
                    >
                      <Text size="label" type="bold">
                        {item?.title}
                      </Text>
                      <Text
                        size="description"
                        type="regular"
                        style={{
                          lineHeight: 18,
                          textAlign: "left",
                          marginTop: 5,
                        }}
                        numberOfLines={6}
                      >
                        {item?.description}
                        {item?.description}
                      </Text>
                    </View>
                  </Pressable>
                ))}
            </ScrollView>
          </>
        ) : null}

        {/* Photo */}
        {dataDestination && dataDestination.images ? (
          <View
            style={{
              width: Dimensions.get("screen").width,
              paddingHorizontal: 15,
              marginTop: 5,
            }}
          >
            <View style={{ marginHorizontal: 5 }}>
              <Text size="title" type="bold">
                {t("photo")}
              </Text>
              <Text
                size="description"
                type="regular"
                style={{ marginBottom: 3 }}
              >
                {t("SubDestinationPhoto")}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                marginTop: 5,
                width: "100%",
                height: 80,
              }}
            >
              {dataDestination
                ? dataDestination.images.map((item, index) => {
                    if (index < 3) {
                      return (
                        <Pressable
                          key={index + "2"}
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          onPress={() =>
                            ImagesSlider(index, dataDestination.images)
                          }
                        >
                          <FunImage
                            key={index + "1"}
                            source={
                              item?.image ? { uri: item?.image } : default_image
                            }
                            style={{
                              // // width: Dimensions.get("screen").width * 0.15,
                              // width: Dimensions.get("screen").width * 0.22,
                              width: (Dimensions.get("screen").width - 40) / 4,
                              height: "100%",
                              marginLeft: 2,
                            }}
                          />
                        </Pressable>
                      );
                    } else if (
                      index === 3 &&
                      dataDestination.images.length > 4
                    ) {
                      return (
                        <Pressable
                          key={index + "2"}
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          onPress={() =>
                            ImagesSlider(index, dataDestination.images)
                          }
                        >
                          <FunImage
                            key={index}
                            source={
                              item?.image ? { uri: item?.image } : default_image
                            }
                            style={{
                              opacity: 0.9,
                              // width: Dimensions.get("screen").width * 0.22,
                              width: (Dimensions.get("screen").width - 40) / 4,
                              height: "100%",
                              opacity: 0.32,
                              marginLeft: 2,
                              backgroundColor: "#000",
                            }}
                          />
                          <Text
                            size="title"
                            type="regular"
                            style={{
                              position: "absolute",
                              right: 40,
                              alignSelf: "center",
                              color: "#FFF",
                              top: 30,
                            }}
                          >
                            {"+" + (dataDestination.images.length - 4)}
                          </Text>
                        </Pressable>
                      );
                    } else if (index === 3) {
                      return (
                        <FunImage
                          key={index + "3"}
                          source={
                            item?.image ? { uri: item?.image } : default_image
                          }
                          style={{
                            // width: Dimensions.get("screen").width * 0.22,
                            width: (Dimensions.get("screen").width - 40) / 4,
                            height: "100%",
                            marginLeft: 2,
                          }}
                        />
                      );
                    } else {
                      null;
                    }
                  })
                : null}
            </View>
          </View>
        ) : null}
        {/* Another Place */}
        <View
          style={{
            width: Dimensions.get("screen").width,
            paddingHorizontal: 15,
            marginTop: 15,
            marginBottom: 50,
          }}
        >
          <View style={{ marginHorizontal: 5 }}>
            {anotherDes?.length > 0 ? (
              <>
                <Text size="title" type="bold">
                  {t("NearbyPlace")}
                </Text>
                <Text
                  size="description"
                  type="regular"
                  style={{ marginBottom: 3 }}
                >
                  {t("gooddestinationtrip")}
                </Text>
              </>
            ) : null}
          </View>
          {anotherDes &&
            anotherDes?.map((item, index) =>
              dataDestination.id !== item.id ? (
                <Pressable
                  onPress={() =>
                    props.navigation.push("DestinationUnescoDetail", {
                      id: item.id,
                      name: item.name,
                      token: token,
                    })
                  }
                  key={"nir" + index}
                  style={{
                    borderWidth: 1,
                    borderColor: "#F3F3F3",
                    borderRadius: 10,
                    // height: 190,
                    height: Dimensions.get("screen").height / 4.7,
                    // padding: 10,
                    marginTop: 5,
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
                      source={
                        item?.images?.image
                          ? { uri: item?.images?.image }
                          : default_image
                      }
                      style={{
                        // width: 160,
                        width: Dimensions.get("screen").width / 2.7,
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
                      {item.liked === true ? (
                        <Pressable
                          onPress={() => _unlikedAnother(item.id)}
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
                          onPress={() => _likedAnother(item.id)}
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
                      {item?.rating != 0 ? (
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
                      ) : null}
                    </View>
                  </View>

                  {/* Keterangan */}
                  {/* rating */}
                  <View
                    style={{
                      flex: 1,
                      paddingHorizontal: 8,
                      paddingVertical: 7,
                      // height: 170,
                      justifyContent: "space-between",
                    }}
                  >
                    <View>
                      {/* Title */}
                      <View
                        style={{
                          flexDirection: "row",
                          paddingHorizontal: 3,
                          marginBottom: 5,
                          // alignItems: "center",
                        }}
                      >
                        <BlockDestination
                          height={16}
                          width={16}
                          style={{ marginTop: 5 }}
                        />
                        <Text
                          size="label"
                          type="bold"
                          numberOfLines={2}
                          style={{
                            marginLeft: 5,
                            flexWrap: "wrap",
                            width: "90%",
                            marginTop: 2,
                          }}
                        >
                          {item.name}
                        </Text>
                      </View>

                      {/* Maps */}
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
                          {item.cities.name}
                        </Text>
                      </View>
                    </View>
                    {/* Great for */}
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
                          // borderWidth: 1,
                          paddingHorizontal: 7,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                          }}
                        >
                          {data?.destinationById?.movie_location?.length > 0 ? (
                            <UnescoIcon
                              height={28}
                              width={28}
                              style={{ marginRight: 5 }}
                            />
                          ) : null}
                          {data?.destinationById?.type?.name
                            .toLowerCase()
                            .substr(0, 6) == "unesco" ? (
                            <MovieIcon height={28} width={28} />
                          ) : null}
                        </View>
                        <View
                          style={{
                            marginBottom: item.greatfor.length > 0 ? 0 : 7,
                          }}
                        >
                          {item.greatfor.length > 0 ? (
                            <Text
                              size="description"
                              type="bold"
                              // style={{ marginLeft: 5 }}
                            >
                              {t("GreatFor") + " :"}
                            </Text>
                          ) : null}
                          <View
                            style={{
                              flexDirection: "row",
                              marginLeft: -5,
                            }}
                          >
                            {item.greatfor.length > 0
                              ? item.greatfor.map((item, index) => {
                                  return index < 3 ? (
                                    <FunIcon
                                      key={"grat" + index}
                                      icon={item.icon}
                                      fill="#464646"
                                      height={37}
                                      width={37}
                                    />
                                  ) : null;
                                })
                              : null}
                          </View>
                        </View>
                      </View>

                      <View
                        style={{
                          justifyContent: "flex-end",
                          width: 65,
                          paddingBottom: 5,
                          paddingRight: 5,
                          // height: 30,
                        }}
                      >
                        <Button
                          onPress={() => addToPlan(item)}
                          size="small"
                          text={"Add"}
                          style={{ height: 25 }}
                        />
                      </View>
                    </View>

                    {/* <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        height: 50,
                        marginTop: 10,
                        alignItems: "flex-end",
                        borderWidth: 1,
                      }}
                    >
                      {data?.destinationById?.movie_location?.length > 0 ||
                      data?.destinationById?.type?.name
                        .toLowerCase()
                        .substr(0, 6) == "unesco" ? (
                        <View>
                          <Text>test</Text>
                        </View>
                      ) : null}
                      <View style={{ borderWidth: 1 }}>
                        <Text size="description" type="bold">
                          Great for :
                        </Text>
                        <View style={{ flexDirection: "row" }}>
                          {item.greatfor.length > 0 ? (
                            item.greatfor.map((item, index) => {
                              return index < 3 ? (
                                <FunIcon
                                  key={"grat" + index}
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
                        onPress={() => addToPlan(item)}
                        size="small"
                        text={"Add"}
                        // style={{ marginTop: 15 }}
                      />
                    </View> */}
                  </View>
                </Pressable>
              ) : null
            )}
        </View>
      </View>
    );
  };
  //! END RENDER GENERAL

  //! RENDER REVIEW
  const renderReview = ({ item, props }) => {
    return <Reviews id={item?.id} props={props} />;
  };
  //! END RENDER REVIEW

  //! RENDER ARTICLE
  const renderArticle = (e, dataA) => {
    let render = [];
    render = dataA;

    return (
      <View
        style={{
          paddingHorizontal: 15,
          paddingVertical: 10,
        }}
      >
        {render && render.length
          ? render.map((i, index) => {
              if (!i) {
                <View key={"content" + index} style={{ alignItems: "center" }}>
                  <Text
                    type="regular"
                    size="title"
                    style={{
                      textAlign: "justify",
                      color: "#464646",
                    }}
                  >
                    {t("noArticle")}
                  </Text>
                </View>;
              } else {
                return (
                  <View key={"artikel" + index}>
                    {i.type === "image" ? (
                      <View>
                        <View style={{ marginHorizontal: 5, marginBottom: 5 }}>
                          {i.title ? (
                            <Text
                              size="title"
                              type="bold"
                              style={{ textAlign: "left" }}
                            >
                              {i.title}
                            </Text>
                          ) : null}
                        </View>
                        <View
                          style={{
                            alignItems: "center",
                            marginBottom: 5,
                          }}
                        >
                          <FunImage
                            source={
                              i?.image ? { uri: i?.image } : default_image
                            }
                            resizeMode={"cover"}
                            style={{
                              borderWidth: 0.4,
                              borderColor: "#d3d3d3",

                              height: Dimensions.get("screen").width * 0.4,
                              width: "100%",
                            }}
                          />
                        </View>
                        <View style={{ marginHorizontal: 5, marginBottom: 15 }}>
                          <Text
                            size="description"
                            type="light"
                            style={{
                              textAlign: "left",
                              color: "#616161",
                            }}
                          >
                            {i.text ? i.text : ""}
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <View style={{ marginHorizontal: 5 }}>
                        {i.title ? (
                          <Text
                            size="title"
                            type="bold"
                            style={{
                              marginBottom: 5,
                              color: "#464646",
                            }}
                          >
                            {i.title}
                          </Text>
                        ) : null}
                        <Text
                          size="title"
                          type="regular"
                          style={{
                            marginBottom: 15,
                            lineHeight: 22,
                            textAlign: "left",
                            color: "#464646",
                          }}
                        >
                          {i.text ? i.text : ""}
                        </Text>
                      </View>
                    )}
                  </View>
                );
              }
            })
          : null}
      </View>
    );
  };
  //! END RENDER ARTICLE

  //! RENDER TAB

  const [canScroll, setCanScroll] = useState(true);
  const _tabIndex = useRef(0);
  const [tabIndex, setIndex] = useState(0);
  let scrollRef = useRef();
  const [routes, setRoutes] = useState(Array(1).fill(0));
  let { width, height } = Dimensions.get("screen");
  const scrollY = useRef(new Animated.Value(0)).current;
  const listRefArr = useRef([]);
  let Notch = DeviceInfo.hasNotch();
  let TabBarHeight = Platform.select({
    ios: Notch ? 40 : 40,
    android: 40,
  });
  const HeaderHeight = Platform.select({
    ios: 457 + tambahan + tambahan1 + tambahan2 - unesco,
    android: 440 + tambahan + tambahan1 + tambahan2 - unesco,
  });
  let SafeStatusBar = Platform.select({
    ios: Notch ? 48 : 20,
    android: StatusBar.currentHeight,
  });
  let [indeks, setIndeks] = useState(0);
  let [modalss, setModalss] = useState(false);
  let [gambar, setGambar] = useState([]);
  let [more, setMore] = useState(false);
  let [lines, setLines] = useState(3);
  const layoutText = (e) => {
    setMore(e.nativeEvent.lines.length > 3 && lines !== 0);
  };

  console.log("routes", routes);
  // const headerScrollY = useRef(new Animated.Value(0)).current;

  const renderTabView = () => {
    return (
      <TabView
        onSwipeStart={() => setCanScroll(true)}
        onSwipeEnd={() => setCanScroll(true)}
        onIndexChange={setIndex}
        navigationState={{ index: tabIndex, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        initialLayout={{
          height: 1000,
          width: width,
        }}
      />
    );
  };

  const renderScene = ({ route }) => {
    console.log("route", route);
    const focused = route.key === routes[tabIndex].key;
    let numCols;
    let data;
    let renderItem;
    let tempdataa = [];
    tempdataa.push(dataDestination);
    switch (route.key) {
      case "general":
        numCols = 1;
        data = tempdataa;
        renderItem = (e) => renderGeneral(e);
        break;
      case "review":
        numCols = 1;
        data = tempdataa;
        renderItem = (e) => renderReview(e);
        break;
      default:
        data = tempdataa;
        renderItem = (e) => renderArticle(e, route.data);
        break;
    }

    return (
      <FlatList
        scrollToOverflowEnabled={true}
        numColumns={numCols}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        data={data}
        renderItem={({ item, index }) => renderItem({ props, item, index })}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  };

  const renderTabBar = (props) => {
    // const y = scrollY.interpolate({
    //   inputRange: [0, HeaderHeight],
    //   outputRange: [HeaderHeight, 55],
    //   extrapolateRight: "clamp",
    // });
    return (
      <Animated.View
        style={{
          // top: 0,
          zIndex: 1,
          // position: "absolute",
          // transform: [{ translateY: y }],
          width: "100%",
        }}
      >
        <FlatList
          key={"listtabbar"}
          ref={scrollRef}
          data={props.navigationState.routes}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{
            backgroundColor: "white",
            // borderBottomWidth: 1,
            // borderColor: "#d1d1d1",
          }}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => {
                _tabIndex.current = index;
                setIndex(index);
                scrollRef.current?.scrollToIndex({
                  // y: 0,
                  // x: 100,
                  index: index,
                  animated: true,
                });
              }}
            >
              <View
                style={{
                  // borderWidth: 1,
                  borderBottomWidth: index == tabIndex ? 2 : 1,
                  // borderBottomColor: index == tabIndex ? "#209fae" : "#FFFFFF",
                  borderBottomColor: index == tabIndex ? "#209fae" : "#d1d1d1",
                  alignContent: "center",
                  paddingHorizontal: 15,
                  width:
                    props.navigationState.routes.length <= 2
                      ? Dimensions.get("screen").width * 0.5
                      : props.navigationState.routes.length > 2
                      ? Dimensions.get("screen").width * 0.333
                      : null,
                  height: TabBarHeight,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={[
                    index == tabIndex ? styles.labelActive : styles.label,
                    {
                      opacity: index == tabIndex ? 1 : 0.7,
                      // height: "100%",
                      borderBottomWidth: 0,
                      borderBottomColor:
                        index == tabIndex &&
                        props.navigationState.routes.length > 1
                          ? "#FFFFFF"
                          : "#209fae",
                      // height: 35,
                      // paddingTop: 2,
                      // paddingLeft:
                      //   props.navigationState.routes.length < 2 ? 15 : null,
                      textTransform: "capitalize",
                      marginBottom: index == tabIndex ? 5 : 0,
                    },
                  ]}
                  size="h3"
                  type={index == tabIndex ? "bold" : "regular"}
                >
                  <Truncate
                    length="15"
                    text={item && item.key ? item.key : "-"}
                  />
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </Animated.View>
    );
  };

  //! END RENDER TAB

  let [unesco, setUnesco] = useState(0);
  let [tambahan, setTambahan] = useState(0);
  let [tambahan1, setTambahan1] = useState(0);
  let [tambahan2, setTambahan2] = useState(0);
  const [modalTime, setModalTime] = useState(false);
  const [modalSosial, setModalSosial] = useState(false);
  const [sharemodal, SetShareModal] = useState(false);

  const scrolls = useRef(new Animated.Value(0)).current;
  const HEADER_MAX_HEIGHT = normalize(240);
  const HEADER_MIN_HEIGHT = normalize(50);
  const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

  const headerOpacity = scrolls.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE - 10],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  let imageTranslateY = scrolls.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 100],
    extrapolate: "clamp",
  });

  const imageOpacity = scrolls.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.2, 0],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      <Satbar backgroundColor="#14646E" />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: "#fff" }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrolls } } }],
          { useNativeDriver: true }
        )}
        stickyHeaderIndices={[1]}
      >
        <Animated.View
          style={{
            backgroundColor: "#209fae",
            // marginBottom: -40,
            transform: [{ translateY: imageTranslateY }],
            // overflow: "hidden",
            opacity: imageOpacity,
          }}
        >
          <Animated.Image
            style={{
              width: Dimensions.get("screen").width,
              height: 200,
            }}
            source={
              dataDestination ? { uri: dataDestination?.cover } : default_image
            }
          ></Animated.Image>

          {/* title */}
          <View
            style={{
              paddingTop: 10,
              paddingHorizontal: 18,
              width: Dimensions.get("screen").width,
              // height: 70,
              flexDirection: "row",
              justifyContent: "space-between",
              backgroundColor: "#FFF",
            }}
          >
            <View
              style={{
                width: Dimensions.get("screen").width * 0.7,
                justifyContent: "space-around",
              }}
            >
              <View style={{ width: "95%" }}>
                <Text size="header" type="black" numberOfLines={1}>
                  {dataDestination?.name}
                </Text>
              </View>
              <View style={{ flexDirection: "row", marginTop: 5 }}>
                <View
                  style={{
                    borderRadius: 3,
                    backgroundColor: "#F4F4F4",
                    // padding: 3,
                    marginRight: 10,
                    height: 25,
                    justifyContent: "center",
                  }}
                >
                  <Text
                    size="description"
                    type="bold"
                    style={{ marginHorizontal: 10, marginBottom: 3 }}
                  >
                    {dataDestination?.type?.name}
                  </Text>
                </View>
                <View
                  style={{
                    borderRadius: 3,
                    backgroundColor: "#F4F4F4",
                    // padding: 3,
                    flexDirection: "row",
                    marginRight: 10,
                    alignItems: "center",
                    height: 25,
                  }}
                >
                  <Star height={15} width={15} style={{ marginLeft: 10 }} />
                  <Text
                    size="description"
                    type="bold"
                    style={{ marginLeft: 5, marginRight: 10 }}
                  >
                    {dataDestination?.rating.substr(0, 3)}
                  </Text>
                </View>
                <View
                  style={{
                    borderRadius: 2,
                    height: 25,
                    justifyContent: "center",
                  }}
                >
                  <Text
                    size="description"
                    type="regular"
                    style={{ color: "#209FAE" }}
                  >
                    {dataDestination?.count_review} {t("reviews")}
                  </Text>
                </View>
              </View>
            </View>

            {/* Button like and share */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {dataDestination?.liked === true ? (
                <Pressable
                  style={{
                    backgroundColor: "#F6F6F6",
                    marginRight: 2,
                    height: 34,
                    width: 34,
                    borderRadius: 17,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 5,
                  }}
                  onPress={() => _unliked(dataDestination?.id)}
                >
                  <Love height={20} width={20} />
                </Pressable>
              ) : (
                <Pressable
                  onPress={() =>
                    shareAction({
                      from: "destination",
                      target: dataDestination?.id,
                    })
                  }
                  style={{
                    backgroundColor: "#F6F6F6",
                    marginRight: 2,
                    height: 34,
                    width: 34,
                    borderRadius: 17,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 5,
                  }}
                  onPress={() => _liked(dataDestination?.id)}
                >
                  <LikeEmpty height={20} width={20} />
                </Pressable>
              )}
              <TouchableOpacity
                onPress={() => SetShareModal(true)}
                // onPress={() => console.log("shrae")}
                style={{
                  backgroundColor: "#F6F6F6",
                  marginRight: 2,
                  height: 34,
                  width: 34,
                  borderRadius: 17,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ShareBlack height={20} width={20} />
              </TouchableOpacity>
            </View>
            {/*End Button like and share */}
          </View>

          {/* Type */}
          {dataDestination?.movie_location?.length > 0 ||
          dataDestination?.type?.name.toLowerCase().substr(0, 6) == "unesco" ? (
            <View
              style={{
                width: Dimensions.get("screen").width,
                paddingHorizontal: 18,
                height: 45,
                paddingVertical: 7,
                flexDirection: "row",
                backgroundColor: "#FFF",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 5,
                  marginRight: 5,
                  backgroundColor: "#DAF0F2",
                  paddingVertical: 8,
                  paddingHorizontal: 15,
                }}
              >
                <UnescoIcon height={27} width={27} style={{ marginRight: 5 }} />
                <Text size="description" type="regular">
                  UNESCO
                </Text>
              </View>
              {dataDestination?.movie_location?.length > 0 ? (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 5,
                    backgroundColor: "#DAF0F2",
                    paddingVertical: 8,
                    paddingHorizontal: 15,
                  }}
                >
                  <MovieIcon
                    height={30}
                    width={30}
                    style={{ marginRight: 5 }}
                  />
                  <Text size="description" type="regular">
                    Movie Location
                  </Text>
                </View>
              ) : null}
            </View>
          ) : (
            <View
              onLayout={() => setUnesco(40)}
              style={{
                width: Dimensions.get("screen").width,
                paddingHorizontal: 15,
                // height: 0,
                paddingVertical: 5,
                flexDirection: "row",
                backgroundColor: "#FFF",
                bottom: 0,
              }}
            ></View>
          )}

          {/* View address */}

          <View
            // onLayout={(event) => {
            //   let heights = event.nativeEvent.layout.height;
            //   setLayoutsAddress(heights);
            // }}
            style={{
              width: Dimensions.get("screen").width,
              paddingHorizontal: 18,
              backgroundColor: "#FFF",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderTopWidth: 1,
                borderTopColor: "#f6f6f6",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  width: Dimensions.get("screen").width * 0.7,
                  marginVertical: 8,
                }}
              >
                <PinHijau
                  height={20}
                  width={20}
                  style={{ marginRight: 10, alignSelf: "center" }}
                />
                <Text
                  onTextLayout={(x) => {
                    let line = x.nativeEvent.lines.length;
                    let lines = line - 1;
                    setTambahan(lines * 20);
                  }}
                  size="label"
                  type="regular"
                  style={{ lineHeight: 18 }}
                  numberOfLines={2}
                >
                  {dataDestination?.address ? dataDestination?.address : "-"}
                </Text>
              </View>
              {dataDestination?.address ? (
                <Ripple
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => {
                    Linking.openURL(
                      Platform.OS == "ios"
                        ? "maps://app?daddr=" +
                            dataDestination?.latitude +
                            "+" +
                            dataDestination?.longitude
                        : "google.navigation:q=" +
                            dataDestination?.latitude +
                            "+" +
                            dataDestination?.longitude
                    );
                  }}
                >
                  <Mapsborder height="25" width="25" />
                </Ripple>
              ) : null}
            </View>
          </View>
          {/* End View Address */}

          {/* View Time */}

          <View
            // onLayout={(event) => {
            //   let heights = event.nativeEvent.layout.height;
            //   setLayoutsOpen(heights);
            // }}
            style={{
              width: Dimensions.get("screen").width,
              paddingHorizontal: 18,
              backgroundColor: "#FFF",
              bottom: 0,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderTopWidth: 1,
                borderTopColor: "#f6f6f6",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  marginVertical: 8,
                  width: Dimensions.get("screen").width * 0.7,
                }}
              >
                <Clock
                  height={20}
                  width={20}
                  style={{ marginRight: 10, aligmSelf: "center" }}
                />
                <Text
                  size="label"
                  type="regular"
                  style={{ lineHeight: 18 }}
                  numberOfLines={2}
                  onTextLayout={(x) => {
                    let line = x.nativeEvent.lines.length;
                    let lines = line - 1;
                    setTambahan1(lines * 20);
                  }}
                >
                  {dataDestination?.openat ? dataDestination?.openat : "-"}
                </Text>
              </View>
              {dataDestination?.openat ? (
                <Ripple
                  onPress={() => setModalTime(true)}
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    size="description"
                    type="regular"
                    style={{
                      color: "#209FAE",
                      marginVertical: 8,
                      marginLeft: 10,
                    }}
                  >
                    {t("more")}
                  </Text>
                </Ripple>
              ) : null}
            </View>
          </View>

          {/* End View Time */}

          {/* View Website */}

          <View
            // onLayout={(event) => {
            //   let heights = event.nativeEvent.layout.height;
            //   setLayoutsWeb(heights);
            // }}
            style={{
              width: Dimensions.get("screen").width,
              paddingHorizontal: 18,
              backgroundColor: "#FFF",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderTopColor: "#f6f6f6",
                borderBottomColor: "#f6f6f6",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  width: Dimensions.get("screen").width * 0.7,
                  marginVertical: 8,
                }}
              >
                <Globe
                  height={20}
                  width={20}
                  style={{ marginRight: 10, alignSelf: "center" }}
                />
                <Text
                  size="label"
                  type="regular"
                  numberOfLines={2}
                  style={{ lineHeight: 18 }}
                  onTextLayout={(x) => {
                    let line = x.nativeEvent.lines.length;
                    let lines = line - 1;
                    setTambahan2(lines * 20);
                  }}
                >
                  {dataDestination?.website ? dataDestination?.website : "-"}
                </Text>
              </View>
              {dataDestination?.website ? (
                <Ripple
                  onPress={() => setModalSosial(true)}
                  style={{
                    // minHeight: 40,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    size="description"
                    type="regular"
                    style={{
                      color: "#209FAE",
                      marginVertical: 8,
                      marginLeft: 10,
                    }}
                  >
                    {t("more")}
                  </Text>
                </Ripple>
              ) : null}
            </View>
          </View>

          {/*End View Website */}
        </Animated.View>

        {/* BATAS TAB */}

        <View
          style={{
            width: Dimensions.get("screen").width,
            // borderWidth: 1,
            // marginTop: maxHeights,
          }}
        >
          <Animated.View
            style={{
              opacity: headerOpacity,
              height: 40,
              width: Dimensions.get("screen").width,
              backgroundColor: "#209fae",
            }}
          ></Animated.View>
        </View>
        {/* TAB VIEW */}
        {renderTabView()}

        {/* END TAB VIEW */}
      </Animated.ScrollView>

      {/* Modal Time */}
      <ModalRN
        useNativeDriver={true}
        visible={modalTime}
        onRequestClose={() => setModalTime(false)}
        transparent={true}
        animationType="fade"
      >
        <Pressable
          onPress={() => setModalTime(false)}
          style={{
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
            justifyContent: "center",
            opacity: 0.7,
            backgroundColor: "#000",
            position: "absolute",
          }}
        />
        <View
          style={{
            width: Dimensions.get("screen").width - 120,
            marginHorizontal: 60,
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
              borderRadius: 5,
              width: Dimensions.get("screen").width - 120,
            }}
          >
            <View
              style={{
                backgroundColor: "#f6f6f6",
                alignItems: "center",
                borderBottomColor: "#d1d1d1",
                borderBottomWidth: 1,
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
              }}
            >
              <Text
                size="title"
                type="bold"
                style={{ marginTop: 12, marginBottom: 15 }}
              >
                {t("OperationTime")}
              </Text>
            </View>
            <Pressable
              onPress={() => setModalTime(false)}
              style={{
                position: "absolute",
                right: 0,
                width: 55,
                justifyContent: "center",
                alignItems: "center",
                height: 50,
              }}
            >
              <Xgray width={15} height={15} />
            </Pressable>
            <View style={{ marginHorizontal: 20 }}>
              {dataDestination && dataDestination?.openat ? (
                <Text
                  size="label"
                  type="reguler"
                  style={{ marginBottom: 18, marginTop: 15 }}
                >
                  {dataDestination?.openat}
                </Text>
              ) : (
                <Text>-</Text>
              )}
            </View>
          </View>
        </View>
      </ModalRN>
      {/* End Modal Time */}

      {/* End Modal Website */}

      <ModalRN
        useNativeDriver={true}
        visible={modalSosial}
        onRequestClose={() => setModalSosial(false)}
        transparent={true}
        animationType="fade"
      >
        <Pressable
          onPress={() => setModalSosial(false)}
          style={{
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
            justifyContent: "center",
            opacity: 0.7,
            backgroundColor: "#000",
            position: "absolute",
          }}
        />
        <View
          style={{
            width: Dimensions.get("screen").width - 120,
            marginHorizontal: 60,
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
              borderRadius: 5,
              width: Dimensions.get("screen").width - 120,
            }}
          >
            <View
              style={{
                backgroundColor: "#f6f6f6",
                alignItems: "center",
                borderBottomColor: "#d1d1d1",
                borderBottomWidth: 1,
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
              }}
            >
              <Text
                size="title"
                type="bold"
                style={{ marginTop: 12, marginBottom: 15 }}
              >
                {t("information")}
              </Text>
            </View>
            <Pressable
              onPress={() => setModalSosial(false)}
              style={{
                position: "absolute",
                right: 0,
                width: 55,
                justifyContent: "center",
                alignItems: "center",
                height: 50,
              }}
            >
              <Xgray width={15} height={15} />
            </Pressable>
            <Pressable
              onPress={() => Linking.openURL(`tel:${dataDestination?.phone1}`)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderBottomColor: "#d1d1d1",
                borderBottomWidth: 1,
                paddingHorizontal: 20,
              }}
            >
              <TeleponHitam
                height={15}
                width={15}
                style={{ marginBottom: 18, marginTop: 15 }}
              />
              {dataDestination && dataDestination?.phone1 ? (
                <Text
                  size="label"
                  type="reguler"
                  style={{ marginLeft: 10, marginBottom: 18, marginTop: 15 }}
                >
                  {dataDestination?.phone1}
                </Text>
              ) : (
                <Text style={{ marginLeft: 10 }}>-</Text>
              )}
            </Pressable>
            <Pressable
              onPress={async () => {
                const supported = await Linking.canOpenURL(
                  dataDestination?.website
                );
                if (supported) {
                  await Linking.openURL(`${dataDestination?.website}`);
                } else {
                  RNToasty.Show({
                    title: `Don't know how to open this URL: ${url}`,
                    position: "bottom",
                  });
                }
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderBottomColor: "#d1d1d1",
                paddingHorizontal: 20,
                borderBottomWidth: 1,
              }}
            >
              <WebsiteHitam
                height={15}
                width={15}
                style={{ marginBottom: 18, marginTop: 15 }}
              />
              {dataDestination && dataDestination?.website ? (
                <Text
                  size="label"
                  type="reguler"
                  style={{ marginLeft: 10, marginBottom: 18, marginTop: 15 }}
                >
                  {dataDestination?.website}
                </Text>
              ) : (
                <Text style={{ marginLeft: 10 }}>-</Text>
              )}
            </Pressable>
            <Pressable
              onPress={async () => {
                const supported = await Linking.canOpenURL(
                  dataDestination?.instagram
                );
                if (supported) {
                  await Linking.openURL(`${dataDestination?.instagram}`);
                } else {
                  RNToasty.Show({
                    title: `Don't know how to open this URL: ${dataDestination?.instagram}`,
                    position: "bottom",
                  });
                }
              }}
              style={{
                flexDirection: "row",
                paddingHorizontal: 20,
                alignItems: "center",
              }}
            >
              <InstagramHitam
                height={15}
                width={15}
                style={{ marginBottom: 18, marginTop: 15 }}
              />
              {data && dataDestination && dataDestination?.instagram ? (
                <Text
                  size="label"
                  type="reguler"
                  style={{ marginLeft: 10, marginBottom: 18, marginTop: 15 }}
                >
                  {dataDestination?.instagram}
                </Text>
              ) : (
                <Text style={{ marginLeft: 10 }}>-</Text>
              )}
            </Pressable>
          </View>
        </View>
      </ModalRN>
      {/* End Modal Website */}

      {/* Modal Share */}
      <ModalRN
        useNativeDriver={true}
        visible={sharemodal}
        onRequestClose={() => SetShareModal(false)}
        transparent={true}
        animationType="fade"
      >
        <Pressable
          onPress={() => SetShareModal(false)}
          style={{
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
            justifyContent: "center",
            opacity: 0.8,
            borderWidth: 1,
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
            alignContent: "center",
            borderRadius: 5,
            marginTop: Dimensions.get("screen").height / 3,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              width: Dimensions.get("screen").width - 100,
              // paddingVertical: 10,
              // paddingHorizontal: 20,
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              borderRadius: 5,
            }}
          >
            <Pressable
              onPress={() => SetShareModal(false)}
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                height: 60,
                width: 60,
                alignContent: "center",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Xgray width={15} height={15} />
            </Pressable>
            <View
              style={{
                paddingHorizontal: 20,
                width: "100%",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                backgroundColor: "#f6f6f6",
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
                borderBottomColor: "#d1d1d1",
                borderBottomWidth: 1,
              }}
            >
              <Text
                type="bold"
                size="title"
                style={{
                  marginBottom: 15,
                  marginTop: 12,
                }}
              >
                {t("share")}
              </Text>
              <Pressable
                onPress={() => SetShareModal(false)}
                style={{
                  position: "absolute",
                  right: 0,
                  width: 55,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 50,
                }}
              >
                <Xgray width={15} height={15} />
              </Pressable>
            </View>
            <TouchableOpacity
              style={{
                // paddingVertical: 10,
                paddingHorizontal: 20,
                borderBottomWidth: 1,
                borderBottomColor: "#d1d1d1",
                width: "100%",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                SetShareModal(false);
                props.navigation.navigate("SendDestination", {
                  destination: dataDestination,
                });
              }}
            >
              <Text
                size="label"
                type="regular"
                style={{
                  marginTop: 15,
                  marginBottom: 18,
                }}
              >
                {t("send_to")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                // paddingVertical: 10,
                paddingHorizontal: 20,
                borderBottomWidth: 1,
                borderBottomColor: "#d1d1d1",
                width: "100%",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                shareAction({
                  from: "destination",
                  target: dataDestination.id,
                });
                SetShareModal(false);
              }}
            >
              <Text
                size="label"
                type="regular"
                style={{
                  marginTop: 12,
                  marginBottom: 15,
                }}
              >
                {t("shareTo")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                paddingHorizontal: 20,
                width: "100%",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                CopyLink({
                  from: "destination",
                  target: dataDestination.id,
                });
                SetShareModal(false);
              }}
            >
              <Text
                size="label"
                type="regular"
                style={{
                  marginTop: 15,
                  marginBottom: 18,
                }}
              >
                {t("copyLink")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ModalRN>

      {/* Modal Share */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "#fff",
  },
  // header: {
  //   height: HeaderHeight,
  //   width: "100%",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   position: "absolute",
  //   backgroundColor: "#FFA088",
  // },
  //   label: { fontSize: 14, color: "#222" },
  indicator: { backgroundColor: "#209FAE" },
  label: { fontSize: 16, color: "#464646", fontFamily: "Lato-Regular" },
  labelActive: { fontSize: 16, color: "#209FAE", fontFamily: "Lato-Bold" },
});

export default Index;
