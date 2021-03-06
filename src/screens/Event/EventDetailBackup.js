import React, { useState, useEffect, useRef } from "react";
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
} from "react-native";

import { CustomImage } from "../../component";
import { dateFormatBetween } from "../../component/src/dateformatter";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import LinearGradient from "react-native-linear-gradient";
import { rupiah } from "../../component/src/Rupiah";
import { ScrollView, FlatList } from "react-native-gesture-handler";
import Modal from "react-native-modal";
import Liked from "../../graphQL/Mutation/Event/likedEvent";
import UnLiked from "../../graphQL/Mutation/unliked";
import Sidebar from "../../component/src/Sidebar";
import {
  IconMaps,
  calendar_blue,
  schedule_blue,
  close,
  warning,
  banned,
  default_image,
} from "../../assets/png";
import {
  LikeRed,
  LikeEmpty,
  OptionsVertWhite,
  Sharegreen,
  Arrowbackwhite,
  Mapsborder,
  Arrowbackios,
} from "../../assets/svg";
import { useTranslation } from "react-i18next";
import { Text, Button, shareAction, FunImageBackground } from "../../component";
import { StackActions } from "@react-navigation/native";
import DetailEvent from "../../graphQL/Query/Event/DetailEvent";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { RNToasty } from "react-native-toasty";

export default function EventDetail(props) {
  let [showside, setshowside] = useState(false);
  const yOffset = useRef(new Animated.Value(0)).current;
  const headerOpacity = yOffset.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });
  const HeaderComponent = {
    headerShown: true,
    // title: "List Event",
    headerTransparent: true,
    headerTintColor: "white",
    headerTitle: props.route.params.name,
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      fontFamily: "Lato-Bold",
      fontSize: 16,
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
        }}
      >
        {Platform.OS == "ios" ? (
          <Arrowbackios height={15} width={15}></Arrowbackios>
        ) : (
          <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
        )}
      </Button>
    ),
    headerRight: () => (
      <Button
        text={""}
        size="medium"
        type="circle"
        variant="transparent"
        onPress={() => setshowside(true)}
        style={{
          height: 55,
        }}
      >
        <OptionsVertWhite height={20} width={20} />
      </Button>
    ),
  };

  const { t, i18n } = useTranslation();
  let [dataevent, setDataEvent] = useState({});
  let token = props.route.params.token;
  let event_id = props.route.params.event_id
    ? props.route.params.event_id
    : dataevent.id;

  const [selected, setSelected] = useState(new Map());
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const [modalVisible, setModalVisible] = useState(false);
  let [dataTiket, setDataTiket] = useState(
    props.route.params.data ? props.route.params.data.ticket : []
  );
  let [Masking, setMasking] = useState(false);

  const [GetDetailEvent, { data, loading, error }] = useLazyQuery(DetailEvent, {
    fetchPolicy: "network-only",
    variables: {
      event_id: event_id,
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : null,
      },
    },
    onCompleted: () => {
      setDataEvent(data.event_detail);
    },
  });

  useEffect(() => {
    if (!props.route.params.data) {
      GetDetailEvent();
    } else {
      setDataEvent(props.route.params.data);
    }
    props.navigation.setOptions(HeaderComponent);
  }, []);

  const addToPlan = () => {
    if (token && token !== "" && token !== null) {
      props.route.params && props.route.params.iditinerary
        ? props.navigation.dispatch(
            StackActions.replace("ItineraryStack", {
              screen: "ItineraryChooseday",
              params: {
                Iditinerary: props.route.params.iditinerary,
                Kiriman: event_id,
                token: token,
                Position: "Event",
                datadayaktif: props.route.params.datadayaktif,
              },
            })
          )
        : props.navigation.navigate("ItineraryStack", {
            screen: "ItineraryPlaning",
            params: {
              idkiriman: event_id,
              Position: "Event",
            },
          });
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

          {dataTiket.length > 0 ? (
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
        Authorization: token ? `Bearer ${token}` : null,
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
        Authorization: token ? `Bearer ${token}` : null,
      },
    },
  });

  const _liked = async (id) => {
    if (token && token !== "" && token !== null) {
      var tempData = { ...dataevent };
      tempData.liked = true;
      setDataEvent(tempData);
      try {
        let response = await mutationliked({
          variables: {
            event_id: id,
          },
        });
        if (loadingLike) {
          Alert.alert("Loading!!");
        }
        if (errorLike) {
          throw new Error("Error Input");
        }

        if (response.data) {
          if (
            response.data.setEvent_wishlist.code === 200 ||
            response.data.setEvent_wishlist.code === "200"
          ) {
            var tempData = { ...dataevent };
            tempData.liked = true;
            setDataEvent(tempData);
          } else {
            throw new Error(response.data.setEvent_wishlist.message);
          }
        }
      } catch (error) {
        var tempData = { ...dataevent };
        tempData.liked = false;
        setDataEvent(tempData);
        Alert.alert("" + error);
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
      props.navigation.navigate("AuthStack", {
        screen: "LoginScreen",
      });
      RNToasty.Show({
        title: t("pleaselogin"),
        position: "bottom",
      });
    }
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    props.navigation.setOptions({
      headerBackground: () => (
        <Animated.View
          style={{
            backgroundColor: "#209FAE",
            ...StyleSheet.absoluteFillObject,
            opacity: headerOpacity,
          }}
        />
      ),
      headerTransparent: true,
    });
  }, [headerOpacity, props.navigation]);

  const handlerepeat = (date) => {
    let dates = date.split("-");
    return t("setiap") + " " + monthNames[parseFloat(dates[0]) - 1];
  };

  if (loading) {
    return (
      <SkeletonPlaceholder speed={1000}>
        <View
          style={{
            width: screenWidth,
            height: screenWidth,
          }}
        />
      </SkeletonPlaceholder>
    );
  }

  console.log("data", dataevent);
  return (
    <View
      style={{
        flex: 1,
        zIndex: -1,
      }}
    >
      <View
        style={{
          flex: 2,
          flexDirection: "row",
          height: 130,
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
          style={{ height: Dimensions.get("window").height * 0.43 }}
          imageStyle={{ resizeMode: "cover" }}
        />
        <View
          style={{
            backgroundColor: "#FFF",
          }}
        >
          <View
            style={{
              paddingTop: 15,
              paddingHorizontal: 20,
              paddingBottom: 10,
              backgroundColor: "#FFF",
              marginBottom: 10,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                width: "78%",
                flexDirection: "column",
                paddingBottom: 15,
              }}
            >
              <Text
                size="title"
                type="bold"
                style={{
                  width: "95%",
                  marginBottom: 16,
                }}
              >
                {dataevent?.name}
              </Text>
              <View style={[styles.eventtype]}>
                <Text
                  size="description"
                  style={{
                    textAlign: "center",
                  }}
                >
                  {dataevent?.category?.name}
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignContent: "flex-start",
                width: "22%",
              }}
            >
              <View
                style={{
                  alignSelf: "flex-start",
                }}
              >
                {dataevent.liked === false ? (
                  <Button
                    size="small"
                    type="circle"
                    color="tertiary"
                    style={
                      {
                        // zIndex: 9999,
                      }
                    }
                    onPress={() => _liked(dataevent.id)}
                  >
                    <LikeEmpty height={18} width={18} />
                  </Button>
                ) : (
                  <Button
                    size="small"
                    type="circle"
                    color="tertiary"
                    style={
                      {
                        // zIndex: 9999,
                      }
                    }
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
                }}
              >
                <Button
                  onPress={() =>
                    shareAction({
                      from: "event",
                      target: dataevent.id,
                    })
                  }
                  type="circle"
                  size="small"
                  // color='tertiary'
                  variant="transparent"
                  style={{}}
                >
                  <Sharegreen height={20} width={20} />
                </Button>
                <Text size="small" style={{}}>
                  {t("share")}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              width: Dimensions.get("screen").width,
              paddingHorizontal: 20,
              paddingBottom: 10,
            }}
          >
            <Text
              size="readable"
              style={{
                textAlign: "left",
                lineHeight: 20,
              }}
            >
              {dataevent?.description}
            </Text>
          </View>
          <View
            style={{
              borderBottomColor: "#D1D1D1",
              borderBottomWidth: 0.5,
            }}
          />
          <View
            style={{
              paddingHorizontal: 20,
              paddingVertical: 20,
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                paddingBottom: 10,
              }}
            >
              <CustomImage
                customStyle={{
                  width: 19,
                  height: 19,
                  marginTop: 2,
                  marginRight: 8,
                }}
                customImageStyle={{
                  width: 19,
                  height: 19,
                  resizeMode: "contain",
                }}
                source={calendar_blue}
              />
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
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <CustomImage
                customStyle={{
                  width: 19,
                  height: 19,
                  marginTop: 2,
                  marginRight: 8,
                }}
                customImageStyle={{
                  width: 19,
                  height: 19,
                  resizeMode: "contain",
                }}
                source={schedule_blue}
              />
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
          <View
            style={{
              borderBottomColor: "#D1D1D1",
              borderBottomWidth: 0.5,
            }}
          />
          <View
            style={{
              paddingHorizontal: 20,
              paddingVertical: 20,
              flex: 1,
              flexDirection: "column",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                paddingBottom: 14,
              }}
            >
              <Text
                size="label"
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
                flexDirection: "row",
                paddingBottom: 5,
              }}
            >
              {dataevent && dataevent.vendor ? (
                <View
                  style={{
                    flexDirection: "row",
                    paddingBottom: 5,
                  }}
                >
                  <View
                    style={{
                      width: Dimensions.get("screen").width * 0.7,
                    }}
                  >
                    <Text
                      size="readable"
                      type="regular"
                      style={{
                        lineHeight: 20,
                      }}
                    >
                      {dataevent.vendor.name}
                    </Text>
                  </View>
                  <View>
                    <CustomImage
                      customStyle={{
                        height: 45,
                        marginHorizontal: 3,
                      }}
                      customImageStyle={{ resizeMode: "contain" }}
                      source={
                        dataevent.vendor.cover
                          ? { uri: dataevent.vendor.cover }
                          : default_image
                      }
                    />
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
          <View
            style={{
              borderBottomColor: "#D1D1D1",
              borderBottomWidth: 0.5,
            }}
          />
          <View
            style={{
              borderBottomColor: "#D1D1D1",
              borderBottomWidth: 0.5,
            }}
          />
          <View
            style={{
              paddingHorizontal: 20,
              flex: 3,
              flexDirection: "column",
            }}
          >
            <View
              style={{
                paddingVertical: 20,
                flexDirection: "row",
                paddingBottom: 7,
              }}
            >
              <Text
                size="label"
                type="bold"
                style={{
                  paddingRight: 5,
                  lineHeight: 20,
                }}
              >
                {t("address")}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                paddingBottom: 90,
              }}
            >
              <View
                style={{
                  width: Dimensions.get("screen").width * 0.7,
                }}
              >
                <Text
                  size="description"
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
                  <Mapsborder height={80} width={80} />
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Animated.ScrollView>
      <View
        style={{
          flex: 2,
          position: "absolute",
          bottom: 0,
          justifyContent: "space-evenly",

          backgroundColor: "#ffffff",
          width: screenWidth,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          paddingVertical: 15,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 20,
          }}
        >
          <Button
            text="Add To Plan"
            size="medium"
            color="primary"
            type="box"
            onPress={() => addToPlan()}
            style={{
              width: (Dimensions.get("screen").width - 40) * 1,
            }}
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
