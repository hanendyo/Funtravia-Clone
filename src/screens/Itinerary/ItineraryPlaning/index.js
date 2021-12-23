import React, { useState, useEffect } from "react";
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
  Platform,
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

const arrayShadow = {
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: Platform.OS == "ios" ? 0.22 : 2,
  shadowRadius: Platform.OS == "ios" ? 2.22 : 1.0,
  elevation: Platform.OS == "ios" ? 3 : 3,
};

export default function listItinPlaning(props) {
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
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
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
  };

  const token = useSelector((data) => data.token);
  let idkiriman = props.route.params.idkiriman;
  let [datas, setDatas] = useState();

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

  const RenderBuddy = ({ databuddy }) => {
    return (
      <View
        style={{
          flexDirection: "row",
        }}
      >
        {databuddy.map((value, i) => {
          if (i < 3) {
            return (
              <View key={i}>
                <Image
                  source={
                    value.user && value.user.picture
                      ? { uri: value.user.picture }
                      : default_image
                  }
                  style={{
                    resizeMode: "cover",
                    height: 30,
                    width: 30,
                    borderRadius: 15,
                    marginLeft: -10,
                  }}
                />
              </View>
            );
          }
        })}

        {databuddy.length > 1 ? (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              size="small"
              type={"regular"}
              style={{
                color: "white",
              }}
            >
              {"    "}
              {t("with")}{" "}
              {databuddy[1].user && databuddy[1].user.first_name
                ? databuddy[1].user.first_name
                : ""}
              {databuddy.length > 2
                ? " + " + (databuddy.length - 2) + " Others"
                : " "}
            </Text>
          </View>
        ) : null}
      </View>
    );
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
        <Text
          size="description"
          type={"regular"}
          style={
            {
              // color: "white",
            }
          }
        >
          {Difference_In_Days + 1} {t("days")}
          {", "}
        </Text>
        <Text
          size="description"
          type={"regular"}
          style={
            {
              // color: "white",
            }
          }
        >
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
    <View style={{ flex: 1, justifyContent: "flex-end" }}>
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
        />
      ) : null}

      <View
        style={{
          height: 60,
          width: Dimensions.get("window").width,
          backgroundColor: "white",
          paddingVertical: 10,
          borderTopWidth: 1,
          borderColor: "#F0F0F0",
          shadowColor: "#F0F0F0",
          shadowOffset: { width: 2, height: 2 },
          shadowOpacity: 1,
          shadowRadius: 2,
          elevation: 3,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button
          color={"secondary"}
          onPress={() =>
            props.navigation.push("ItineraryStack", {
              screen: "Trip",
            })
          }
          style={{
            width: Dimensions.get("window").width - 60,
          }}
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
