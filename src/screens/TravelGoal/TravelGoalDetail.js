import React, { useState, useEffect } from "react";
import {
  View,
  Dimensions,
  Modal,
  Pressable,
  Animated,
  Platform,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import {
  Button,
  CopyLink,
  FunImage,
  shareAction,
  Text,
  ModalLogin,
  StatusBar as Satbar,
} from "../../component";
import { default_image } from "../../assets/png";
import { useLazyQuery } from "@apollo/react-hooks";
import { useTranslation } from "react-i18next";
import {
  Arrowbackios,
  Arrowbackwhite,
  ShareBlack,
  Xgray,
} from "../../assets/svg";
import { Image } from "react-native";
import Ripple from "react-native-material-ripple";
import Traveldetails from "../../graphQL/Query/TravelGoal/Traveldetail";
import Travelrelateds from "../../graphQL/Query/TravelGoal/TravelRelated";
import normalize from "react-native-normalize";
import DeviceInfo from "react-native-device-info";
const Notch = DeviceInfo.hasNotch();
const SafeStatusBar = Platform.select({
  ios: Notch ? 48 : 20,
  // android: StatusBar.currentHeight,
  android: normalize(28),
  // android: normalize(38),
});
const deviceId = DeviceInfo.getModel();
import { useSelector } from "react-redux";

export default function TravelGoalDetail(props) {
  const { t, i18n } = useTranslation();
  let tokenApps = useSelector((data) => data.token);
  let [datadetail, setdatadetail] = useState({});
  let [modalShare, setModalShare] = useState(false);
  let [datarelated, setdatarelated] = useState([]);
  let [modalLogin, setModalLogin] = useState(false);

  // const HeaderComponent = {
  //   headerShown: true,
  //   headerTransparent: false,
  //   headerTintColor: "white",
  //   headerTitle: (
  //     <Text size="header" type="bold" style={{ color: "#fff" }}>
  //       {t("travelgoals")}
  //     </Text>
  //   ),
  //   headerMode: "screen",
  //   headerStyle: {
  //     backgroundColor: "#209FAE",
  //     elevation: 0,
  //     borderBottomWidth: 0,
  //   },
  //   headerTitleStyle: {
  //     fontFamily: "Lato-Bold",
  //     fontSize: 18,
  //     color: "white",
  //   },
  //   headerLeftContainerStyle: {
  //     background: "#FFF",

  //     marginLeft: 10,
  //   },
  //   headerLeft: () => (
  //     <Button
  //       text={""}
  //       size="medium"
  //       type="circle"
  //       variant="transparent"
  //       onPress={() => props.navigation.goBack()}
  //       style={{
  //         height: 55,
  //       }}
  //     >
  //       {Platform.OS == "ios" ? (
  //         <Arrowbackios height={15} width={15}></Arrowbackios>
  //       ) : (
  //         <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
  //       )}
  //     </Button>
  //   ),
  // };

  const [
    Traveldetail,
    { loading: loadingdetail, data: datadetails, error: errordetail },
  ] = useLazyQuery(Traveldetails, {
    fetchPolicy: "network-only",
    variables: {
      article_id: props.route?.params?.article_id,
    },
    context: {
      headers: {
        "Content-Type": "application/json",
      },
    },
    onCompleted: () => {
      setdatadetail(datadetails?.detail_travelgoal);
    },
  });

  const [
    Travelrelated,
    { loading: loadingrelated, data: datarelateds, error: errorrelated },
  ] = useLazyQuery(Travelrelateds, {
    fetchPolicy: "network-only",
    variables: {
      article_id: props.route?.params?.article_id,
    },
    context: {
      headers: {
        "Content-Type": "application/json",
      },
    },
    onCompleted: () => {
      setdatarelated(datarelateds?.related_travelgoal);
    },
  });

  useEffect(() => {
    Traveldetail();
    Travelrelated();
  }, []);

  const getdate = (date) => {
    if (!date) {
      return null;
    }
    date = date.replace(" ", "T");
    var date1 = new Date(date).getTime();
    var date2 = new Date().getTime();
    var msec = date2 - date1;
    var mins = Math.floor(msec / 60000);
    var hrs = Math.floor(mins / 60);
    var days = Math.floor(hrs / 24);
    var month = Math.floor(days / 30);
    var yrs = Math.floor(days / 365);
    mins = mins % 60;
    hrs = hrs % 24;
    if (yrs > 0) {
      return yrs + " " + t("yearsAgo");
    }
    if (month > 0) {
      return month + " " + t("monthAgo");
    }
    if (days > 0) {
      return days + " " + t("daysAgo");
    }
    if (hrs > 0) {
      return hrs + " " + t("hoursAgo");
    }
    if (mins > 0) {
      return mins + " " + t("minutesAgo");
    } else {
      return t("justNow");
    }
  };

  const HEADER_MAX_HEIGHT = normalize(240);
  const HEADER_MIN_HEIGHT = normalize(40);
  const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

  let [scrollY] = useState(new Animated.Value(0));

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -HEADER_SCROLL_DISTANCE + 10],
    extrapolate: "clamp",
  });
  const shareTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE, HEADER_SCROLL_DISTANCE + 5],
    outputRange: [0, -HEADER_SCROLL_DISTANCE, -HEADER_SCROLL_DISTANCE - 100],
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
    <View style={{ flex: 1, backgroundColor: "#FFF" }}>
      <Satbar backgroundColor="#14646E" />
      <View
        style={{
          height: 10,
          width: Dimensions.get("screen").width,
          backgroundColor: "#14646e",
        }}
      ></View>
      <ModalLogin
        modalLogin={modalLogin}
        setModalLogin={() => setModalLogin(false)}
        props={props}
      />
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
                borderColor: "#d1d1d1",
              }}
              onPress={() => {
                setModalShare(false);
                // props.navigation.navigate("SendTravelGoals", {
                //   params: { dataGoal: datadetail },
                // });
                props.navigation.navigate("ChatStack", {
                  screen: "SendToChat",
                  params: {
                    dataSend: {
                      id: datadetail?.id,
                      cover: datadetail?.cover,
                      name: datadetail?.title,
                      description: datadetail?.firsttxt.length
                        ? datadetail?.firsttxt
                        : datadetail?.description,
                    },
                    title: t("travelgoals"),
                    tag_type: "tag_travel_goal",
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
                  from: "travelgoal",
                  target: datadetail?.id,
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
                  from: "travelgoal",
                  target: datadetail?.id,
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
      </Modal>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          // paddingTop: HEADER_MAX_HEIGHT + 60,
          paddingTop: HEADER_MAX_HEIGHT + normalize(50),
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
            width: "100%",
            marginTop: -40,
            paddingHorizontal: 20,
            justifyContent: "flex-end",
            alignContent: "flex-start",
            alignItems: "flex-start",
            marginBottom: 20,
          }}
          onPress={() => {
            props.navigation.navigate("TravelGoalDetail");
          }}
        >
          <View
            style={{
              flexDirection: "row",
              width: Dimensions.get("screen").width - 40,
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <View
              style={{
                backgroundColor: "#E2ECF8",
                borderRadius: 20,
              }}
            >
              <Text
                size="small"
                style={{
                  color: "#209fae",
                  marginBottom: 3,
                  marginTop: 2,
                  marginHorizontal: 10,
                }}
              >
                {datadetail?.category?.name}
              </Text>
            </View>
            <TouchableOpacity
              type="circle"
              color="secondary"
              style={{
                backgroundColor: "#F6F6F6",
                height: 30,
                width: 30,
                borderRadius: 17,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                tokenApps ? setModalShare(true) : setModalLogin(true);
              }}
            >
              <ShareBlack height={20} width={20} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: Dimensions.get("screen").width - 70,
            }}
          >
            <Text
              type={"bold"}
              size="title"
              style={{
                marginBottom: 5,
              }}
            >
              {datadetail?.title}
            </Text>
          </View>
          {datadetail?.description ? (
            <Text
              size="readable"
              type="regular"
              style={{
                lineHeight: 22,
                textAlign: "left",
                marginBottom: 5,
              }}
            >
              {datadetail?.description}
            </Text>
          ) : null}
          <View
            style={{
              flexDirection: "row",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            {datadetail?.created_at ? (
              <Text type="light" size="small">
                {getdate(datadetail?.created_at)}
              </Text>
            ) : null}
          </View>
        </View>
        {/* detail */}
        {datadetail?.content?.map((i, index) => {
          return (
            <View
              style={{ paddingHorizontal: 15, width: "100%" }}
              key={`image ${index}`}
            >
              {i.type === "image" ? (
                <View>
                  {i.title ? (
                    <Text
                      size="title"
                      type="bold"
                      style={{
                        marginBottom: 5,
                        paddingHorizontal: 5,
                      }}
                    >
                      {i.title}
                    </Text>
                  ) : null}

                  <View
                    style={{
                      alignItems: "center",
                    }}
                  >
                    <FunImage
                      source={i.image ? { uri: i.image } : default_image}
                      resizeMode={"cover"}
                      style={{
                        borderWidth: 0.4,
                        borderColor: "#d3d3d3",
                        height: Dimensions.get("screen").width * 0.4,
                        width: "100%",
                      }}
                    />
                  </View>
                  <Text
                    size="description"
                    type="light"
                    style={{
                      textAlign: "left",
                      marginTop: 5,
                      marginBottom: 10,
                      color: "#616161",
                      paddingHorizontal: 5,
                    }}
                  >
                    {i.text ? i.text : ""}
                  </Text>
                </View>
              ) : (
                <View>
                  {i.title ? (
                    <Text
                      size="title"
                      type="bold"
                      style={{
                        marginBottom: 5,
                        paddingHorizontal: 5,
                        color: "#464646",
                      }}
                    >
                      {i.title}
                    </Text>
                  ) : null}
                  <Text
                    size="readable"
                    type="regular"
                    style={{
                      lineHeight: 22,
                      textAlign: "left",
                      marginBottom: 5,
                    }}
                  >
                    {i.text ? i.text : ""}
                  </Text>
                </View>
              )}
            </View>
          );
        })}

        {/* more related */}
        {datarelated.length > 0 ? (
          <View style={{ paddingHorizontal: 20, marginBottom: 30 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                alignContent: "center",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  alignContent: "center",
                }}
              >
                <View
                  style={{
                    height: 20,
                    marginRight: 5,
                    width: 7,
                    backgroundColor: "#209fae",
                    borderRadius: 5,
                  }}
                ></View>
                <Text type="bold" size="title">
                  {t("morearticle")}
                </Text>
              </View>
              <View></View>
            </View>

            {datarelated?.map((item, index) => {
              return (
                <Ripple
                  key={`description ${index}`}
                  onPress={() => {
                    props.navigation.push("TravelGoalDetail", {
                      article_id: item.id,
                    });
                  }}
                  style={{
                    shadowOpacity: 0.5,
                    shadowColor: "#d3d3d3",
                    elevation: 3,
                    flexDirection: "row",
                    width: "100%",
                    backgroundColor: "#fff",
                    borderRadius: 5,
                    justifyContent: "flex-start",
                    padding: 10,
                    marginVertical: 5,
                  }}
                >
                  <Image
                    source={item.cover ? { uri: item.cover } : default_image}
                    style={{
                      height: (Dimensions.get("screen").width - 60) * 0.25,
                      width: (Dimensions.get("screen").width - 60) * 0.25,
                      borderRadius: 5,
                    }}
                  ></Image>
                  <View
                    style={{
                      paddingLeft: 10,
                      width: (Dimensions.get("screen").width - 60) * 0.75,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        width: "100%",
                        justifyContent: "space-between",
                        marginBottom: 3,
                      }}
                    >
                      <Text
                        size="small"
                        style={{ color: "#209fae" }}
                        type="regular"
                      >
                        {item?.category?.name}
                      </Text>
                      <Text size="small" type="regular">
                        {getdate(item.created_at)}
                      </Text>
                    </View>
                    <Text
                      size="desription"
                      type="bold"
                      numberOfLines={1}
                      style={{ marginBottom: 2 }}
                    >
                      {item.title}
                    </Text>
                    <Text
                      numberOfLines={2}
                      size="description"
                      type="light"
                      style={{
                        textAlign: "left",
                        lineHeight: normalize(16),
                      }}
                    >
                      {item.description}
                    </Text>
                  </View>
                </Ripple>
              );
            })}

            {datarelated.length < 5 ? null : (
              <View
                style={{
                  width: "100%",
                  paddingVertical: 10,
                  alignContent: "center",
                  alignContent: "center",
                }}
              >
                <Button
                  type="box"
                  color="primary"
                  variant="bordered"
                  text={t("exploreMore")}
                  style={{
                    width: Dimensions.get("screen").width / 2.5,
                    alignSelf: "center",
                    flexDirection: "row",
                  }}
                  onPress={() => {
                    props.navigation.push("TravelGoalList");
                  }}
                ></Button>
              </View>
            )}
          </View>
        ) : null}
      </Animated.ScrollView>

      {/* Image Background */}

      <Animated.View
        pointerEvents="none"
        style={{
          position: "absolute",
          // top: 0,
          left: 0,
          right: 0,
          backgroundColor: "#209FAE",
          overflow: "hidden",
          height:
            Platform.OS === "ios" ? HEADER_MAX_HEIGHT : HEADER_MAX_HEIGHT + 10,
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
            height:
              Platform.OS === "ios"
                ? HEADER_MAX_HEIGHT
                : HEADER_MAX_HEIGHT + 10,
            resizeMode: "cover",
            opacity: imageOpacity,
            transform: [{ translateY: imageTranslateY }],
            zIndex: 1,
          }}
          source={
            datadetail?.cover ? { uri: datadetail?.cover } : default_image
          }
        />
      </Animated.View>

      {/*End Image Background */}

      {/* Title Header */}

      <Animated.View
        style={{
          transform: [{ translateY: titleTranslateY }],
          height: Platform.OS === "ios" ? normalize(53) : normalize(55),
          flex: 1,
          alignItems: "flex-start",
          justifyContent: "center",
          position: "absolute",
          left: 60,
          bottom: 0,
          right: 20,
          zIndex: 999,
          opacity: titleOpacity,
          top: Platform.OS === "ios" ? SafeStatusBar : SafeStatusBar + 15,
        }}
      >
        <Text
          size="title"
          type="bold"
          style={{
            color: "#fff",
          }}
          numberOfLines={1}
        >
          {datadetail.title}
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
          top: SafeStatusBar - 13,
          opacity: backOpacity,
        }}
      >
        <Pressable
          onPress={() => props.navigation.goBack()}
          style={{
            marginTop: Platform.OS === "ios" ? 15 : 30,
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
          transform: [{ translateY: backOpacity }],
          height: 100,
          width: 100,
          position: "absolute",
          zIndex: 999,
          top: SafeStatusBar - 13,
        }}
      >
        <Pressable
          onPress={() => props.navigation.goBack()}
          style={{
            marginTop: Platform.OS === "ios" ? 15 : 30,
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
