import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Image,
  Dimensions,
  Alert,
  TouchableOpacity,
  Linking,
  Pressable,
  Animated,
  Platform,
  StatusBar,
  Modal as ModalRN,
  ActivityIndicator,
  BackHandler,
  NativeModules,
} from "react-native";
import {
  CustomImage,
  Truncate,
  StatusBar as Satbar,
  CopyLink,
  ModalLogin,
} from "../../component";
import { dateFormatBetween } from "../../component/src/dateformatter";
import { useMutation, useLazyQuery, useQuery } from "@apollo/react-hooks";
import LinearGradient from "react-native-linear-gradient";
import { rupiah } from "../../component/src/Rupiah";
import { ScrollView, FlatList } from "react-native-gesture-handler";
import Modal from "react-native-modal";
import Liked from "../../graphQL/Mutation/Event/likedEvent";
import UnLiked from "../../graphQL/Mutation/unliked";
import Sidebar from "../../component/src/Sidebar";
import { close, warning, banned, default_image } from "../../assets/png";
import {
  LikeRed,
  LikeEmpty,
  Sharegreen,
  Arrowbackwhite,
  Mapsborder,
  Arrowbackios,
  Kalenderhijau,
  Jamhijau,
  Xgray,
} from "../../assets/svg";
import { useTranslation } from "react-i18next";
import { Text, Button, shareAction, FunImageBackground } from "../../component";
import { StackActions } from "@react-navigation/native";
import DetailEvent from "../../graphQL/Query/Event/DetailEvent";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { RNToasty } from "react-native-toasty";
import DeviceInfo from "react-native-device-info";
import { useSelector } from "react-redux";

export default function EventDetail(props) {
  let Notch = DeviceInfo.hasNotch();
  let deviceId = DeviceInfo.getModel();
  let SafeStatusBar = Platform.select({
    ios: Notch ? 48 : 20,
    android: NativeModules.StatusBarManager.HEIGHT,
  });
  const [modalLogin, setModalLogin] = useState(false);
  const { t, i18n } = useTranslation();
  const tokenApps = useSelector((data) => data.token);
  let [showside, setshowside] = useState(false);
  let [modalShare, setModalShare] = useState(false);
  const yOffset = useRef(new Animated.Value(0)).current;
  const headerOpacity = yOffset.interpolate({
    inputRange:
      Platform.OS == "ios"
        ? Notch
          ? deviceId === "iPhone 12 Pro"
            ? [100, 170] // [0, 120]
            : [100, 170] //[0, 80]
          : [100, 170] //[0, 80]
        : [130, 220], //[0, 120],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const headerOpacityCurrent = yOffset.interpolate({
    inputRange:
      Platform.OS == "ios"
        ? Notch
          ? deviceId === "iPhone 12 Pro"
            ? [0, 100] //[0, 120]
            : [0, 60] //[0, 80]
          : [0, 60]
        : [0, 100],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const HeaderComponent = {
    headerShown: true,
    // title: "List Event",
    headerTransparent: true,
    headerTintColor: "white",
    headerTitle: "",
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
    headerLeftContainerStyle: {
      background: "#FFF",
      marginLeft: 10,
    },
    headerLeft: () => (
      <Button
        text={""}
        size="medium"
        type="circle"
        variant="transparent"
        onPress={() => props.navigation.goBack()}
        style={{
          height: 55,
          marginTop:
            Platform.OS == "ios"
              ? Notch
                ? deviceId === "iPhone 12 Pro"
                  ? 32 //10
                  : 30 //8
                : 25
              : 8, //4
        }}
      >
        <Animated.View
          style={{
            height: 35,
            width: 35,
            // top: SafeStatusBar,
            opacity: headerOpacityCurrent,
            marginLeft: 17,
            borderRadius: 30,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {Platform.OS == "ios" ? (
            <Arrowbackios height={15} width={15}></Arrowbackios>
          ) : (
            <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
          )}
        </Animated.View>
      </Button>
    ),
  };

  let [dataevent, setDataEvent] = useState({});
  let event_id = props?.route?.params?.event_id
    ? props?.route?.params?.event_id
    : dataevent.id;

  const [selected, setSelected] = useState(new Map());
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const [modalVisible, setModalVisible] = useState(false);
  let [dataTiket, setDataTiket] = useState(
    props.route.params.data ? props.route.params.data.ticket : []
  );
  let [Masking, setMasking] = useState(false);

  const { data, loading, error, refetch } = useQuery(DetailEvent, {
    fetchPolicy: "network-only",
    variables: {
      event_id: event_id,
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenApps,
      },
    },
    onCompleted: () => {
      setDataEvent(data?.event_detail);
    },
  });

  useEffect(() => {
    if (!props.route.params.data) {
      refetch();
    } else {
      setDataEvent(props.route.params.data);
    }
    props.navigation.setOptions(HeaderComponent);
  }, []);

  useEffect(() => {
    props.navigation.addListener("focus", () => {
      BackHandler.addEventListener("hardwareBackPress", hardwareBack);
    });

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", hardwareBack);
    };
  }, [props.navigation, hardwareBack]);

  const hardwareBack = useCallback(() => {
    props.navigation.goBack();
    return true;
  }, []);

  const addToPlan = () => {
    if (tokenApps) {
      props.route.params && props.route.params.iditinerary
        ? props.navigation.dispatch(
            StackActions.replace("ItineraryStack", {
              screen: "ItineraryChooseday",
              params: {
                Iditinerary: props.route.params.iditinerary,
                Kiriman: event_id,
                token: tokenApps,
                Position: props.route.params.from ?? "Event",
                datadayaktif: props.route.params.datadayaktif,
                data_dest: props.route.params,
              },
            })
          )
        : props.navigation.navigate("ItineraryStack", {
            screen: "ItineraryPlaning",
            params: {
              idkiriman: event_id,
              Position: "Event",
              data_from: props.route.params?.data_from ?? "eventdetail",
              searchInput: props.route.params?.search_input,
            },
          });
    } else {
      setModalLogin(true);
    }
  };

  const toggleModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(!modalVisible);
  };
  let maintain;
  const buyticket = (id) => {
    maintain = true;
    if (maintain == true) {
      Alert.alert("Transaksi", "Comingsoon..!!");
    } else {
      props.navigation.navigate("", {
        id: id,
      });
    }
  };

  const TiketModal = () => {
    return (
      <Modal
        onRequestClose={() => {
          setModalVisible(false);
        }}
        isVisible={modalVisible}
        testID={"modal"}
        onSwipeComplete={toggleModal}
        style={{
          justifyContent: "flex-end",
          margin: 0,
        }}
      >
        <View
          style={{
            paddingVertical: 5,
            flexDirection: "column",
            height: Dimensions.get("screen").height * 0.7,
            width: Dimensions.get("screen").width,
            backgroundColor: "white",
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
          }}
        >
          <View
            style={{
              // height: 40,
              flexDirection: "row",
              width: Dimensions.get("screen").width,
              justifyContent: "space-between",
              alignContent: "center",
              alignItems: "center",
              paddingBottom: 10,
              paddingHorizontal: 20,
              borderBottomColor: "#D1D1D1",
              borderBottomWidth: 0.5,
              // borderWidth: 1,
            }}
          >
            <Text
              size="title"
              type="bold"
              style={{
                width: Dimensions.get("screen").width * 0.75,
              }}
            >
              {/* {dataevent.name} */}
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: "white",
                height: 40,
                width: 40,
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center",
              }}
              onPress={() => {
                closeModal();
              }}
            >
              <Image
                style={{
                  resizeMode: "contain",
                  height: 15,
                  width: 15,
                }}
                source={close}
              />
            </TouchableOpacity>
          </View>

          {dataTiket?.length > 0 ? (
            <FlatList
              contentContainerStyle={{}}
              horizontal={false}
              data={dataTiket}
              renderItem={({ item, index }) => (
                <View>
                  {/* =======================detailtiket================== */}
                  <View
                    style={{
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                      flexDirection: "column",
                      borderBottomColor: "#D1D1D1",
                      borderBottomWidth: 0.5,
                    }}
                  >
                    <Text
                      size="label"
                      type="bold"
                      style={{
                        paddingBottom: 10,
                      }}
                    >
                      {item.name}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        paddingRight: 25,
                        alignContent: "flex-start",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "column",
                          paddingRight: 25,
                          paddingBottom: 10,
                        }}
                      >
                        {item.description ? (
                          <View
                            style={{
                              flexDirection: "row",
                              paddingRight: 40,
                              paddingBottom: 10,
                              alignContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <CustomImage
                              customStyle={{
                                width: 19,
                                height: 19,
                                marginTop: 2,
                                marginRight: 10,
                              }}
                              customImageStyle={{
                                width: 19,
                                height: 19,
                                resizeMode: "contain",
                              }}
                              source={warning}
                            />
                            <Text
                              size="description"
                              style={{
                                paddingRight: 5,
                              }}
                            >
                              {item.description}
                            </Text>
                          </View>
                        ) : null}

                        <View
                          style={{
                            flexDirection: "row",
                            alignContent: "center",
                            alignItems: "center",
                            paddingRight: 40,
                            width: Dimensions.get("window").width * 0.5 - 20,
                          }}
                        >
                          <CustomImage
                            customStyle={{
                              width: 19,
                              height: 19,
                              marginTop: 2,
                              marginRight: 10,
                            }}
                            customImageStyle={{
                              width: 19,
                              height: 19,
                              resizeMode: "contain",
                            }}
                            source={banned}
                          />
                          {item.status ? (
                            <Text
                              size="description"
                              style={{
                                paddingRight: 5,
                              }}
                            >
                              {/* {item.status} */}
                            </Text>
                          ) : (
                            <Text
                              style={{
                                fontFamily: "Lato-Regular",
                                color: "#6C6C6C",
                                fontSize: 14,
                                paddingRight: 5,
                              }}
                            >
                              {" "}
                              Non-refunable
                            </Text>
                          )}
                        </View>
                      </View>
                      {item.rules ? (
                        <View
                          style={{
                            flexDirection: "row",
                            paddingRight: 40,
                          }}
                        >
                          <CustomImage
                            customStyle={{
                              width: 19,
                              height: 19,
                              marginTop: 2,
                              marginRight: 10,
                            }}
                            customImageStyle={{
                              width: 19,
                              height: 19,
                              resizeMode: "contain",
                            }}
                            source={warning}
                          />
                          <Text
                            style={{
                              fontFamily: "Lato-Regular",
                              color: "#6C6C6C",
                              fontSize: 14,
                              paddingRight: 5,
                            }}
                          >
                            {/* {item.rules} */}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: screenWidth - 40,
                        alignItems: "center",
                        alignContent: "center",
                      }}
                    >
                      <Text
                        size="title"
                        type="bold"
                        style={{
                          color: "#209FAE",
                        }}
                      >
                        IDR {rupiah(item.price)}
                      </Text>
                      <Button
                        onPress={() => buyticket(item.id)}
                        text={t("buyTicket")}
                      />
                    </View>
                  </View>
                </View>
              )}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              extraData={selected}
            ></FlatList>
          ) : (
            <View
              style={{
                padding: 20,
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Lato-Bold",
                  fontSize: 16,
                }}
              >
                {t("Tiket tidak tersedia")}
              </Text>
            </View>
          )}
        </View>
      </Modal>
    );
  };

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

  const _liked = async (id) => {
    if (tokenApps) {
      var tempData = { ...dataevent };
      tempData.liked = true;
      setDataEvent(tempData);
      try {
        let response = await mutationliked({
          variables: {
            event_id: id,
          },
        });

        if (response.data) {
          if (
            response.data.setEvent_wishlist.code === 200 ||
            response.data.setEvent_wishlist.code === "200"
          ) {
            var tempData = { ...dataevent };
            tempData.liked = true;
            setDataEvent(tempData);
          } else {
            RNToasty.Show({
              title: t("FailedLikeEvents"),
              position: "bottom",
            });
          }
        }
      } catch (error) {
        RNToasty.Show({
          title: t("FailedLikeEvents"),
          position: "bottom",
        });
        var tempData = { ...dataevent };
        tempData.liked = false;
        setDataEvent(tempData);
      }
    } else {
      setModalLogin(true);
    }
  };

  const _unliked = async (id) => {
    if (tokenApps) {
      var tempData = { ...dataevent };
      tempData.liked = false;
      setDataEvent(tempData);
      try {
        let response = await mutationUnliked({
          variables: {
            id: id,
            type: "event",
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
            var tempData = { ...dataevent };
            tempData.liked = false;
            setDataEvent(tempData);
          } else {
            throw new Error(response.data.unset_wishlist.message);
          }
        }
      } catch (error) {
        var tempData = { ...dataevent };
        tempData.liked = false;
        setDataEvent(tempData);
        Alert.alert("" + error);
      }
    } else {
      setModalLogin(true);
    }
  };

  const monthNames = [
    t("January"),
    t("February"),
    t("March"),
    t("April"),
    t("May"),
    t("June"),
    t("July"),
    t("August"),
    t("September"),
    t("October"),
    t("November"),
    t("December"),
  ];

  let [widthName, setWidthName] = useState(0);

  useEffect(() => {
    props.navigation.setOptions({
      headerBackground: () => (
        <>
          {Platform.OS == "ios" ? (
            <Satbar backgroundColor="#14646E" barStyle="light-content" />
          ) : null}
          <Animated.View
            style={{
              backgroundColor: "#209fae",
              position: "absolute",
              left: 0,

              right: 0,
              // height: Platform.OS == "ios" ? 100 : 80,
              height: Platform.select({
                ios: Notch ? 55 : 55,
                android: deviceId == "CPH2127" ? 100 : 85,
              }),
              flexDirection: "row",
              top: Platform.OS == "ios" ? (Notch ? 48 : 20) : 0,
              bottom: 0,
              opacity: headerOpacity,
              width: Dimensions.get("screen").width,
            }}
          >
            <Button
              text={""}
              size="medium"
              type="circle"
              variant="transparent"
              onPress={() => props.navigation.goBack()}
              style={{
                height: 50,
                marginLeft: 10,
              }}
            >
              <Animated.View
                style={{
                  height: 35,
                  width: 35,
                  top:
                    Platform.OS == "ios"
                      ? Notch
                        ? 2
                        : 2
                      : deviceId == "CPH2127"
                      ? SafeStatusBar + 2
                      : deviceId == "Mi A2"
                      ? SafeStatusBar + 4
                      : SafeStatusBar + 3,
                  borderRadius: 30,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {Platform.OS == "ios" ? (
                  <Arrowbackios height={15} width={15}></Arrowbackios>
                ) : (
                  <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
                )}
              </Animated.View>
            </Button>
            <View
              style={{
                flex: 1,
              }}
            >
              <Text
                numberOfLines={1}
                onTextLayout={(e) => {
                  setWidthName(e.nativeEvent?.lines[0]?.width);
                }}
                size="header"
                style={{
                  color: "#fff",
                  marginRight: 25,
                  marginLeft:
                    Platform.OS == "ios" ? (widthName > 290 ? 0 : -20) : 10,
                  top:
                    Platform.OS == "ios"
                      ? 13
                      : deviceId == "CPH2127"
                      ? SafeStatusBar + 14
                      : deviceId == "Mi A2"
                      ? SafeStatusBar + 14
                      : SafeStatusBar + 16,
                  fontFamily: "Lato-Bold",
                  textAlign: Platform.OS == "ios" ? "center" : "left",
                }}
              >
                {dataevent?.name}
              </Text>
            </View>
          </Animated.View>
        </>
      ),
      headerTransparent: true,
    });
  }, [headerOpacity, props.navigation]);

  const handlerepeat = (date) => {
    if (date != undefined) {
      let dates = date;
      let dateSplit = dates.split("-");
      return t("setiap") + " " + monthNames[parseFloat(dateSplit[0]) - 1];
    }
  };

  if (loading) {
    return (
      <View style={{ alignItems: "center", marginTop: 50 }}>
        <ActivityIndicator size="large" color="#209fae" />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        zIndex: -1,
        width: Dimensions.get("screen").width,
      }}
    >
      <ModalLogin
        modalLogin={modalLogin}
        setModalLogin={() => setModalLogin(false)}
        props={props}
      />
      <ModalRN
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
            marginTop: Dimensions.get("screen").height / 3,
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
                borderColor: "#d1d1d1",
              }}
              onPress={() => {
                setModalShare(false);
                // props.navigation.navigate("SendEvent", {
                //   dataEvent: dataevent,
                // });
                props.navigation.navigate("ChatStack", {
                  screen: "SendToChat",
                  params: {
                    dataSend: {
                      id: dataevent?.id,
                      cover: dataevent?.cover,
                      name: dataevent?.name,
                      description: dataevent?.description,
                      startDate: dataevent.start_date,
                      endDate: dataevent.end_date,
                    },
                    title: t("event"),
                    tag_type: "tag_event",
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
                  from: "event",
                  target: dataevent.id,
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
                  from: "event",
                  target: dataevent.id,
                  success: t("successCopyLink"),
                  failed: t("failedCopyLink"),
                });
              }}
            >
              <Text size="label" type="regular" style={{ marginVertical: 15 }}>
                {t("copyLink")}
              </Text>
            </Pressable>
          </View>
        </View>
      </ModalRN>
      <Satbar backgroundColor="#14646E" barStyle="light-content" />
      <View
        style={{
          flex: 2,
          flexDirection: "row",
          height: 130,
          // borderWidth: 1,
          position: "absolute",
          top: 0,
          justifyContent: "space-between",
          width: screenWidth,
          zIndex: 1,
        }}
      >
        <LinearGradient
          colors={["rgba(34, 34, 34, 1)", "rgba(34, 34, 34, 0)"]}
          start={{ x: 1, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            height: 60,
            width: screenWidth,
          }}
        ></LinearGradient>
      </View>
      {Masking == true ? (
        <View
          style={{
            position: "absolute",
            width: screenWidth,
            height: screenHeight,
            backgroundColor: "rgba(12, 12, 12, 0.75)",
            zIndex: 30,
          }}
        ></View>
      ) : null}
      <Animated.ScrollView
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  y: yOffset,
                },
              },
            },
          ],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        style={styles.main}
      >
        <FunImageBackground
          source={
            dataevent?.cover
              ? { uri: dataevent.cover }
              : dataevent?.images?.length > 0
              ? { uri: dataevent.images[0].image }
              : default_image
          }
          style={{ height: Dimensions.get("window").height * 0.3 }}
          imageStyle={{ resizeMode: "cover" }}
        />
        <View
          style={{
            backgroundColor: "#FFF",
          }}
        >
          <View
            style={{
              paddingVertical: 15,
              paddingHorizontal: 20,
              backgroundColor: "#FFF",
              width: Dimensions.get("screen").width,
              borderBottomWidth: 1,
              borderBottomColor: "#d1d1d1",

              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                width: "80%",
                flexDirection: "column",
              }}
            >
              {/* <View
                style={{
                  backgroundColor: "#f6f6f6",
                  // width: 150,
                  marginBottom: 10,
                  borderRadius: 30,
                }}
              > */}
              <Text
                size="description"
                style={{
                  alignSelf: "flex-start",
                  textAlign: "center",
                  color: "#209fae",
                  paddingHorizontal: 10,
                  // paddingVertical: 5,
                  paddingBottom: 8,
                  paddingTop: 5,
                  borderRadius: 20,
                  backgroundColor: "#f6f6f6",
                }}
              >
                {dataevent?.category?.name}
              </Text>
              {/* </View> */}
              <View
                style={{
                  width: "95%",
                }}
              >
                <Text size="header" type="bold">
                  {dataevent?.name}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                alignContent: "flex-end",
                width: "20%",
              }}
            >
              <View
                style={{
                  alignSelf: "flex-start",
                }}
              >
                {dataevent?.liked === false ? (
                  <Button
                    size="small"
                    type="circle"
                    style={{
                      backgroundColor: "#f6f6f6",
                    }}
                    onPress={() => _liked(dataevent.id)}
                  >
                    <LikeEmpty height={18} width={18} />
                  </Button>
                ) : (
                  <Button
                    size="small"
                    type="circle"
                    style={{
                      backgroundColor: "#f6f6f6",
                    }}
                    onPress={() => _unliked(dataevent.id)}
                  >
                    <LikeRed height={18} width={18} />
                  </Button>
                )}
                <View></View>
              </View>
              <View
                style={{
                  alignItems: "center",
                  marginLeft: 10,
                }}
              >
                <Button
                  onPress={() => {
                    tokenApps ? setModalShare(true) : setModalLogin(true);
                  }}
                  type="circle"
                  size="small"
                  style={{
                    backgroundColor: "#f6f6f6",
                  }}
                >
                  <Sharegreen height={20} width={20} />
                </Button>
              </View>
            </View>
          </View>
          {/* description */}
          <View
            style={{
              width: Dimensions.get("screen").width,
              paddingVertical: 15,
              paddingHorizontal: 20,
            }}
          >
            <View
              style={{
                paddingBottom: 5,
              }}
            >
              <Text
                size="title"
                type="bold"
                style={{
                  textAlign: "left",
                  lineHeight: 20,
                }}
              >
                {t("AboutEvent")}
              </Text>
            </View>
            <Text
              size="readable"
              type="regular"
              style={{
                textAlign: "left",
                lineHeight: 20,
              }}
            >
              {dataevent?.description}
            </Text>
          </View>
          {/* event date */}
          <View
            style={{
              paddingHorizontal: 20,
              paddingBottom: 15,
              flex: 1,

              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                marginBottom: 10,
              }}
            >
              <View>
                <View
                  style={{
                    backgroundColor: "#F6F6F6",
                    padding: 6,
                    marginRight: 10,
                    justifyContent: "flex-start",
                    borderRadius: 15,
                  }}
                >
                  <Kalenderhijau width={18} height={18} />
                </View>
              </View>

              <View
                style={{
                  justifyContent: "center",
                }}
              >
                <Text
                  size="readable"
                  type="bold"
                  style={{
                    paddingRight: 5,
                    lineHeight: 20,
                  }}
                >
                  {t("eventDate")} :
                </Text>

                {dataevent?.is_repeat === true ? (
                  <Text
                    size="readable"
                    type="regular"
                    style={{
                      paddingRight: 10,
                      lineHeight: 20,
                    }}
                  >
                    {handlerepeat(dataevent?.start_date, dataevent?.end_date)}
                  </Text>
                ) : (
                  <Text
                    size="readble"
                    type="regular"
                    style={{
                      paddingRight: 10,
                      lineHeight: 20,
                    }}
                  >
                    {dateFormatBetween(
                      dataevent?.start_date,
                      dataevent?.end_date
                    )}
                  </Text>
                )}
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <View>
                <View
                  style={{
                    backgroundColor: "#F6F6F6",
                    padding: 6,
                    marginRight: 10,
                    justifyContent: "flex-start",
                    borderRadius: 15,
                  }}
                >
                  <Jamhijau width={18} height={18} />
                </View>
              </View>
              <View
                style={{
                  justifyContent: "center",
                }}
              >
                <Text
                  size="readable"
                  type="bold"
                  style={{
                    paddingRight: 5,
                    lineHeight: 20,
                  }}
                >
                  {t("gatesOpen")} :
                </Text>
                <Text
                  size="readable"
                  type="regular"
                  style={{
                    paddingRight: 10,
                    lineHeight: 20,
                  }}
                >
                  {dataevent?.open}
                </Text>
              </View>
            </View>
          </View>
          {/* Penyelenggara event */}
          <View
            style={{
              paddingTop: 10,
              paddingBottom: 15,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: 20,
                paddingBottom: 10,
              }}
            >
              <Text
                size="title"
                type="bold"
                style={{
                  paddingRight: 5,
                }}
              >
                {t("organizedBy")}
              </Text>
            </View>

            <View
              style={{
                paddingHorizontal: 15,
                // borderWidth: 1,
                marginHorizontal: 15,
                borderColor: "#f6f6f6",
                borderWidth: 0.5,
                paddingVertical: 15,
                borderRadius: 10,
                flex: 1,
                flexDirection: "column",
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
              {dataevent && dataevent?.vendor ? (
                <View
                  style={{
                    flexDirection: "row",
                    paddingBottom: 5,
                  }}
                >
                  <Image
                    resizeMode="cover"
                    style={{ width: 70, height: 70, borderRadius: 4 }}
                    source={
                      dataevent
                        ? {
                            uri: dataevent?.vendor.cover,
                          }
                        : default_image
                    }
                  />
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      flex: 1,
                    }}
                  >
                    <Text
                      size="readable"
                      type="regular"
                      numberOfLines={2}
                      style={{
                        lineHeight: 20,
                      }}
                    >
                      {dataevent?.vendor?.name}
                    </Text>
                  </View>
                </View>
              ) : (
                <Text
                  style={{
                    fontFamily: "Lato-Regular",
                    color: "#6C6C6C",
                    fontSize: 14,
                    paddingRight: 10,
                  }}
                >
                  -
                </Text>
              )}
            </View>
          </View>

          {/* address */}
          <View
            style={{
              marginTop: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: 20,
                paddingBottom: 10,
              }}
            >
              <Text
                size="title"
                type="bold"
                style={{
                  paddingRight: 5,
                  lineHeight: 20,
                }}
              >
                {t("venueAddress")}
              </Text>
            </View>
            <View
              style={{
                paddingHorizontal: 15,
                marginHorizontal: 15,
                borderColor: "#f6f6f6",
                borderWidth: 0.5,
                paddingVertical: 15,
                borderRadius: 10,
                flex: 1,
                flexDirection: "column",
                backgroundColor: "#FFF",
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.22,
                shadowRadius: 2.22,
                elevation: 3,
                marginBottom: 100,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <View
                  style={{
                    width: "75%",
                  }}
                >
                  <Text
                    size="label"
                    style={{
                      paddingRight: 5,
                    }}
                  >
                    {dataevent?.address}
                  </Text>
                </View>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "flex-end",

                    width: "25%",
                  }}
                >
                  <Pressable
                    onPress={() => {
                      Linking.openURL(
                        Platform.OS == "ios"
                          ? "maps://app?daddr=" +
                              dataevent?.latitude +
                              "+" +
                              dataevent?.longitude
                          : "google.navigation:q=" +
                              dataevent?.latitude +
                              "+" +
                              dataevent?.longitude
                      );
                    }}
                  >
                    <Mapsborder height={70} width={70} />
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Animated.ScrollView>
      <View
        style={{
          height: Platform.OS === "ios" ? (Notch ? 75 : 60) : 60,
          backgroundColor: "#FFF",
          width: Dimensions.get("screen").width,
          paddingHorizontal: 20,
          shadowOffset: { width: 1, height: 1 },
          shadowOpacity: Platform.OS == "ios" ? 0.22 : 2,
          shadowRadius: Platform.OS == "ios" ? 2.22 : 1.0,
          elevation: Platform.OS == "ios" ? 3 : 3.5,
          flexDirection: "row",
          borderTopWidth: 1,
          borderColor: "#F1F1F1",
          justifyContent: "space-between",
          paddingTop: 10,
          paddingBottom: Platform.OS === "ios" ? (Notch ? 20 : 10) : 10,
        }}
      >
        <View style={{ height: "100%", width: "100%", alignSelf: "center" }}>
          <Button
            text={t("addToPlan")}
            size="medium"
            color="primary"
            type="box"
            onPress={() => addToPlan()}
          />
        </View>

        <TiketModal />
      </View>
      <Sidebar
        props={props}
        show={showside}
        Data={() => {
          return (
            <View
              style={{
                padding: 10,
                width: "100%",
                justifyContent: "flex-start",
              }}
            ></View>
          );
        }}
        setClose={(e) => setshowside(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    width: Dimensions.get("window").width,
  },
  dayButton: {
    height: 15,
    width: 35,
    backgroundColor: "#209FAE",
  },
  dayButtonFont: { fontSize: 12, fontFamily: "lato-reg" },

  eventtype: {
    position: "absolute",
    height: 23,
    paddingHorizontal: 10,
    minWidth: 70,
    bottom: 0,
    borderRadius: 11,
    justifyContent: "center",
    backgroundColor: "rgba(226, 236, 248, 0.85)",
  },
});
