import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TextInput,
  FlatList,
  TouchableHighlight,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Image,
  Modal,
  Pressable,
  BackHandler,
  Platform,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CardItinerary, CustomImage, ModalLogin } from "../../../component";
import { default_image, imgPrivate } from "../../../assets/png";
import { useLazyQuery } from "@apollo/react-hooks";
import listitinerary from "../../../graphQL/Query/Itinerary/listitinerary";
import { dateFormats } from "../../../component/src/dateformatter";
import { useTranslation } from "react-i18next";
import { Text, Button, Truncate } from "../../../component";
import {
  Arrowbackios,
  Arrowbackwhite,
  Calendargrey,
  PinHijau,
  TravelAlbumdis,
  TravelStoriesdis,
  User,
  Xgray,
} from "../../../assets/svg";
import Ripple from "react-native-material-ripple";
import { StackActions } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import DeviceInfo from "react-native-device-info";

const arrayShadow = {
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: Platform.OS == "ios" ? 0.22 : 2,
  shadowRadius: Platform.OS == "ios" ? 2.22 : 1.0,
  elevation: Platform.OS == "ios" ? 3 : 3,
};

export default function listItinPlaning(props) {
  const Notch = DeviceInfo.hasNotch();
  const { t, i18n } = useTranslation();
  let [modalLogin, setModalLogin] = useState(false);
  const HeaderComponent = {
    headerShown: true,
    title: "",
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: (
      <Text size="header" style={{ color: "#fff" }}>
        {t("youTrip")}
      </Text>
    ),
    headerMode: "screen",
    headerStyle: {
      backgroundColor: Platform.OS == "ios" ? "#14646e" : "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      backgroundColor: Platform.OS == "ios" ? "#209fae" : null,
      width: Platform.OS == "ios" ? Dimensions.get("screen").width : null,
      height: Platform.OS == "ios" ? 45 : null,
      textAlign: Platform.OS == "ios" ? "center" : null,
      paddingTop: Platform.OS == "ios" ? 8 : null,
      paddingBottom: Platform.OS == "ios" ? 15 : null,
    },
    headerLeftContainerStyle: {
      background: "#FFF",
      // position: "absolute",
      zIndex: 999,
      marginLeft: 10,
    },
    headerLeft: () => (
      <Button
        text={""}
        size="medium"
        type="circle"
        variant="transparent"
        onPress={() => _handleBack()}
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
  };

  const dataFromPicker = {
    search: [
      "SearchPg",
      {
        token: props.route.params.token,
      },
    ],
    eventdetail: [
      "eventdetail",
      {
        event_id: props.route.params.idkiriman,
        token: props.route.params.token,
      },
    ],
    detail_destination: [
      "DestinationUnescoDetail",
      {
        id: props.route.params.idkiriman,
        token: props.route.params.token,
      },
    ],
    wishlist: ["Wishlist", {}],
    destination_list: [
      "DestinationList",
      {
        token: props.route.params.token,
        idcity: props.route.params.idkiriman,
      },
    ],
    itinerary: [
      "itindetail",
      {
        country: props.route.params.IdItinerary,
        index: 0,
        Kiriman: props.route.params.idkiriman,
        token: props.route.params.token,
        Position: props.route.params.Position,
        onbackhandler: "chooseDay",
      },
    ],
    movie: [
      "Detail_movie",
      {
        movie_id: props.route.params.movieId,
      },
    ],
  };

  const _handleBack = () => {
    props.route.params.onbackhandler === "chooseDay"
      ? props.navigation.navigate(
          dataFromPicker[props.route.params.data_from][0],
          dataFromPicker[props.route.params.data_from][1]
        )
      : props.navigation.goBack();
  };

  useEffect(() => {
    props.navigation.addListener("focus", () => {
      BackHandler.addEventListener("hardwareBackPress", hardwareBack);
    });

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", hardwareBack);
    };
  }, [props.navigation, hardwareBack]);

  const token = useSelector((data) => data.token);
  let idkiriman = props.route.params.idkiriman;
  let [datas, setDatas] = useState();

  const hardwareBack = useCallback(() => {
    _handleBack();
    return true;
  }, []);

  const [
    GetListitinaktif,
    { data: datalistaktif, loading: loadinglistaktif, error: errorlistaktif },
  ] = useLazyQuery(listitinerary, {
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
    onCompleted: () => {
      setDatas(datalistaktif?.itinerary_list_draf);
    },
  });

  const getdate = (start, end) => {
    start = start.split(" ");
    end = end.split(" ");

    return dateFormats(start[0]) + " - " + dateFormats(end[0]);
  };

  const getDN = (start, end) => {
    var x = start;
    var y = end,
      start = start.split(" ");
    end = end.split(" ");
    var date1 = new Date(start[0]);
    var date2 = new Date(end[0]);
    var Difference_In_Time = date2.getTime() - date1.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    return (
      <View style={{ flexDirection: "row" }}>
        <Text size="description" type={"regular"}>
          {Difference_In_Days + 1} {t("days")}
          {", "}
        </Text>
        <Text size="description" type={"regular"}>
          {Difference_In_Days} {t("nights")}
        </Text>
      </View>
    );
  };

  const RenderActive = ({ data }) => {
    return (
      <View
        style={{
          height: 150,
          marginTop: 10,
          borderRadius: 5,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: arrayShadow.shadowOpacity,
          shadowRadius: arrayShadow.shadowRadius,
          elevation: arrayShadow.elevation,
          justifyContent: "space-between",
          backgroundColor: "#FFFFFF",
          overflow: "hidden",
        }}
      >
        <Ripple
          onPress={() => goChooseDay(data)}
          style={{
            backgroundColor: "#FFFFFF",
            height: "75%",
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
            flexDirection: "row",
            shadowOpacity: arrayShadow.shadowOpacity,
            shadowRadius: arrayShadow.shadowRadius,
            elevation: arrayShadow.elevation,
          }}
        >
          <ImageBackground
            source={data && data.cover ? { uri: data.cover } : default_image}
            style={{
              height: "100%",
              width: "35%",
              borderTopLeftRadius: 5,
            }}
            imageStyle={{
              borderTopLeftRadius: 5,
              borderWidth: 0.2,
              borderColor: "#d3d3d3",
              height: "100%",
              width: "100%",
            }}
          >
            <Ripple
              style={{
                width: "100%",
                height: "100%",
                padding: 10,
              }}
              onPress={() => goChooseDay(data)}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={
                    data.user_created
                      ? { uri: data.user_created.picture }
                      : default_image
                  }
                  style={{
                    zIndex: 2,
                    backgroundColor: "#ffff",
                    borderRadius: 15,
                    width: 30,
                    height: 30,
                    borderWidth: 1,
                    borderColor: "#ffff",
                  }}
                ></Image>
                <View
                  style={{
                    position: "relative",
                    marginLeft: -5,
                    zIndex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    paddingVertical: 3,
                    paddingHorizontal: 10,
                    borderRadius: 3,
                    overflow: "hidden",
                  }}
                >
                  <Text
                    size="small"
                    type={"regular"}
                    style={{
                      color: "white",
                    }}
                  >
                    {data.user_created
                      ? data.user_created.first_name
                      : "User_Funtravia"}
                  </Text>
                </View>
              </View>
            </Ripple>
          </ImageBackground>

          <View
            style={{
              width: "65%",
              height: "100%",
              paddingHorizontal: 10,
              backgroundColor: "#FFFFFF",
              paddingVertical: 10,
              overflow: "hidden",
              justifyContent: "space-between",
            }}
          >
            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  aligndatas: "center",
                }}
              >
                <View
                  style={{
                    backgroundColor: "#DAF0F2",
                    borderWidth: 1,
                    borderRadius: 3,
                    borderColor: "#209FAE",
                    paddingHorizontal: 5,
                  }}
                >
                  <Text
                    type="bold"
                    size="description"
                    style={{ color: "#209FAE" }}
                  >
                    {data?.categori?.name
                      ? data?.categori?.name
                      : "No Category"}
                  </Text>
                </View>
                <View>
                  {data.isprivate == true ? (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        paddingVertical: 3,
                        paddingHorizontal: 10,
                        borderRadius: 3,
                        overflow: "hidden",
                      }}
                    >
                      <Image
                        source={imgPrivate}
                        style={{
                          height: 10,
                          width: 10,
                          marginRight: 5,
                        }}
                      />
                      <Text
                        size="small"
                        type={"regular"}
                        style={{
                          color: "white",
                        }}
                      >
                        {t("private")}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
              <Text size="label" type="black" style={{ marginTop: 5 }}>
                <Truncate text={data.name} length={40} />
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 5,
                }}
              >
                <PinHijau width={15} height={15} />
                <Text style={{ marginLeft: 5 }} size="small" type="regular">
                  {data?.country?.name}
                </Text>
                <Text>,</Text>
                <Text size="small" type="regular" style={{ marginLeft: 3 }}>
                  {data?.city?.name}
                </Text>
              </View>
            </View>
            <View
              style={{
                // borderWidth: 1,
                width: "100%",
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginLeft: 3,
                }}
              >
                <Calendargrey
                  width={10}
                  height={10}
                  style={{ marginRight: 5 }}
                />
                {data.start_date && data.end_date
                  ? getDN(data.start_date, data.end_date)
                  : null}
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginLeft: 15,
                }}
              >
                <User width={10} height={10} style={{ marginRight: 5 }} />
                <Text size="small" type="regular">
                  {(data && data.buddy.length ? data.buddy.length : null) + " "}
                  {t("person")}
                </Text>
              </View>
            </View>
          </View>
        </Ripple>
        <View
          style={{
            paddingVertical: 3,
            height: "25%",
            flexDirection: "row",
            backgroundColor: "#FFFFFF",
            borderBottomLeftRadius: 5,
            borderBottomRightRadius: 5,
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              width: "50%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              borderRightWidth: 1,
              borderColor: "#d3d3d3",
              paddingVertical: 5,
            }}
          >
            <TravelAlbumdis height={15} width={15} style={{ marginRight: 5 }} />
            <Text size="small" type="bold" style={{ color: "#d3d3d3" }}>
              Travel Album
            </Text>
          </View>
          <View
            style={{
              width: "50%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TravelStoriesdis
              height={15}
              width={15}
              style={{ marginRight: 5 }}
            />
            <Text size="small" type="bold" style={{ color: "#d3d3d3" }}>
              Travel Stories
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const goChooseDay = (data) => {
    if (!token || token === null) {
      // props.navigation.navigate("HomeScreen");
      setModalLogin(true);
    } else {
      props.navigation.dispatch(
        StackActions.replace("ItineraryStack", {
          screen: "ItineraryChooseday",
          params: {
            itintitle: data.name,
            Iditinerary: data.id,
            dateitin: getdate(data.start_date, data.end_date),
            token: token,
            Kiriman: idkiriman,
            data_from: props.route.params.data_from,
            Position: props.route.params.Position,
            sebelum: true,
          },
        })
      );
    }
  };

  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  const [refreshing, setRefreshing] = React.useState(false);

  const _Refresh = React.useCallback(() => {
    setRefreshing(true);
    GetListitinaktif();
    wait(1000).then(() => {
      setRefreshing(false);
    });
  }, []);

  const loadAsync = async () => {
    await _Refresh();
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      loadAsync();
    });
    return unsubscribe;
  }, [props.navigation]);

  return (
    <View style={{ flex: 1, justifyContent: "space-between" }}>
      <ModalLogin
        props={props}
        modalLogin={modalLogin}
        setModalLogin={setModalLogin}
      />
      {datas && datas.length > 0 ? (
        <CardItinerary
          data={datas}
          props={props}
          token={token}
          //  setting={setting}
          setData={(e) => setDatas(e)}
          dataFrom={props.route.params.data_from}
          dataFromId={props.route.params.data_from_id}
          searchInput={props.route.params.searchInput}
        />
      ) : (
        <View style={{ marginTop: 15 }}>
          <ActivityIndicator size="small" color="#209FAE" />
        </View>
      )}

      <View
        style={{
          position: "absolute",
          bottom: 0,
          height: Platform.OS === "ios" ? (Notch ? 75 : 60) : 60,
          backgroundColor: "#FFF",
          width: Dimensions.get("screen").width,
          paddingHorizontal: 15,
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
        <Button
          color={"secondary"}
          onPress={() =>
            props.navigation.push("ItineraryStack", {
              screen: "Trip",
            })
          }
          style={{ height: "100%", width: "100%" }}
          text={t("createYourPlan")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ImageView: {
    // width: (110),
    // height: (110),
    marginRight: 5,
    borderRadius: 10,
    backgroundColor: "rgba(0, 0, 0, 0)",
    // opacity: 0.4,
    // elevation: 1,
  },
  Image: {
    resizeMode: "cover",
    borderRadius: 10,
  },
});
