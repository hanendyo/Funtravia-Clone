import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TextInput,
  SafeAreaView,
  StatusBar,
} from "react-native";
import {
  Button,
  CustomImage,
  Text,
  Truncate,
  FunImageBackground,
} from "../../component";
import { default_image } from "../../assets/png";
import { useLazyQuery } from "@apollo/client";
import { Loading } from "../../component";
import { useTranslation } from "react-i18next";
import { Arrowbackios, Arrowbackwhite } from "../../assets/svg";
import { Image } from "react-native";
import { ImageBackground } from "react-native";
import { ScrollView } from "react-native";
import { FlatList } from "react-native";
import Ripple from "react-native-material-ripple";
import TravelTops from "../../graphQL/Query/TravelGoal/TravelTop";
import TravelPopulars from "../../graphQL/Query/TravelGoal/TravelPopular";
import TravelNews from "../../graphQL/Query/TravelGoal/TravelNew";
import { TouchableOpacity } from "react-native-gesture-handler";
import LinearGradient from "react-native-linear-gradient";
import normalize from "react-native-normalize";

export default function TravelGoal(props) {
  const { t, i18n } = useTranslation();
  const HeaderComponent = {
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: (
      <Text size="header" type="bold" style={{ color: "#fff" }}>
        {t("travelgoals")}
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
      position: "absolute",
      zIndex: 999,
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

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    TravelTop();
    TravelPopular();
    TravelNew();
  }, []);

  let [dataTop, setdataTop] = useState({});

  const [
    TravelTop,
    { loading: loadingTop, data: dataTops, error: errorTop },
  ] = useLazyQuery(TravelTops, {
    fetchPolicy: "network-only",
    // variables: {
    //   keyword: texts !== null ? texts : "",
    // },
    context: {
      headers: {
        "Content-Type": "application/json",
      },
    },
    onCompleted: () => {
      setdataTop(dataTops);
    },
  });

  let [dataPopular, setdataPopular] = useState([]);

  const [
    TravelPopular,
    { loading: loadingPopular, data: dataPopulars, error: errorPopular },
  ] = useLazyQuery(TravelPopulars, {
    fetchPolicy: "network-only",
    // variables: {
    //   keyword: texts !== null ? texts : "",
    // },
    context: {
      headers: {
        "Content-Type": "application/json",
      },
    },
    onCompleted: () => {
      setdataPopular(dataPopulars?.travelgoal_populer);
    },
  });

  let [dataNew, setdataNew] = useState([]);

  const [
    TravelNew,
    { loading: loadingNew, data: dataNews, error: errorNew },
  ] = useLazyQuery(TravelNews, {
    fetchPolicy: "network-only",
    // variables: {
    //   keyword: texts !== null ? texts : "",
    // },
    context: {
      headers: {
        "Content-Type": "application/json",
      },
    },
    onCompleted: () => {
      setdataNew(dataNews?.travelgoal_newer);
    },
  });

  const getdate = (date) => {
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

  return (
    <ScrollView
      contentContainerStyle={{
        backgroundColor: "#f6f6f6",
      }}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      style={{
        flex: 1,
        backgroundColor: "#f6f6f6",
        // padding: 20,
      }}
    >
      <View
        style={{
          padding: 20,
          // flex: 1,
        }}
      >
        {dataTop?.travelgoal_first ? (
          <FunImageBackground
            source={
              dataTop?.travelgoal_first?.cover
                ? { uri: dataTop?.travelgoal_first?.cover }
                : null
            }
            style={{
              height: Dimensions.get("screen").width * 0.35,
              width: "100%",
              borderRadius: 5,
              backgroundColor: "#fff",
            }}
            imageStyle={{
              height: Dimensions.get("screen").width * 0.35,
              width: "100%",
              borderRadius: 5,
            }}
          >
            <Ripple
              style={{
                height: "100%",
                width: "100%",
                justifyContent: "space-between",
                borderRadius: 5,
              }}
              onPress={() => {
                props.navigation.push("TravelGoalDetail", {
                  article_id: dataTop?.travelgoal_first?.id,
                });
              }}
            >
              <View
                style={{
                  backgroundColor: "#E2ECF8",
                  marginTop: 10,
                  marginLeft: 10,
                  borderRadius: 10,
                  alignSelf: "flex-start",
                }}
              >
                <Text
                  size="small"
                  style={{
                    color: "#209fae",
                    marginTop: 2,
                    marginBottom: 3,
                    marginHorizontal: 10,
                  }}
                >
                  {dataTop?.travelgoal_first?.category?.name}
                </Text>
              </View>
              <LinearGradient
                colors={["rgba(0, 0, 0, 0.5)", "rgba(0, 0, 0, 0)"]}
                start={{ x: 0, y: 1 }}
                end={{ x: 0, y: 0 }}
                style={{
                  height: "50%",
                  width: "100%",
                  alignItems: "flex-start",
                  alignContent: "flex-start",
                  justifyContent: "flex-end",
                  borderRadius: 5,
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                }}
              >
                <View>
                  <Text type="bold" size="title" style={{ color: "white" }}>
                    {dataTop?.travelgoal_first?.title}
                  </Text>
                  <Text
                    size="description"
                    numberOfLines={1}
                    style={{ color: "white" }}
                  >
                    {dataTop?.travelgoal_first?.description}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {dataTop?.travelgoal_first?.created_at ? (
                      <Text
                        type="light"
                        size="description"
                        style={{ color: "white" }}
                      >
                        {getdate(dataTop?.travelgoal_first?.created_at)}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </LinearGradient>
            </Ripple>
          </FunImageBackground>
        ) : null}
        {/* Popular */}
        {dataPopular.length > 0 ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              alignContent: "center",
              justifyContent: "space-between",
              marginVertical: 10,
              marginTop: 20,
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
                {t("PopularArticle")}
              </Text>
            </View>
            <View></View>
          </View>
        ) : null}
        {dataPopular.map((item, index) => {
          return (
            <Ripple
              key={index}
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
                source={item?.cover ? { uri: item?.cover } : default_image}
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
                  // borderWidth: 1,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  <Text size="small" type="light">
                    {item?.category?.name}
                  </Text>
                  <Text size="small" type="light">
                    {getdate(item?.created_at)}
                  </Text>
                </View>
                <Text size="label" type="bold" style={{ marginTop: 3 }}>
                  {item?.title}
                </Text>
                {item?.description ? (
                  <Text
                    size="description"
                    type="light"
                    numberOfLines={2}
                    style={{
                      textAlign: "left",
                      marginTop: 3,
                      lineHeight: normalize(14),
                    }}
                  >
                    {item?.description}
                  </Text>
                ) : null}
                {/* <Text size="small" type="light" style={{ fontStyle: "italic" }}>
                  12 min read
                </Text> */}
              </View>
            </Ripple>
          );
        })}

        {/* New */}
        {dataNew.length > 0 ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              alignContent: "center",
              justifyContent: "space-between",
              marginVertical: 0,
              marginTop: 20,
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
                {t("NewArticle")}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                props.navigation.push("TravelGoalList");
              }}
            >
              <Text
                style={{ color: "#209fae" }}
                size="description"
                type="regular"
              >
                {t("Seemore")}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
      <FlatList
        contentContainerStyle={{
          paddingStart: 20,
          paddingEnd: 10,
          paddingBottom: 15,
        }}
        horizontal
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={{}}
        data={dataNew}
        renderItem={({ item }) => (
          <Ripple
            onPress={() => {
              props.navigation.push("TravelGoalDetail", {
                article_id: item.id,
              });
            }}
            style={{
              marginRight: 10,
              shadowOpacity: 0.5,
              shadowColor: "#d3d3d3",
              elevation: 3,
              backgroundColor: "#fff",
              width: (Dimensions.get("screen").width - 80) / 2,
              borderRadius: 5,
            }}
          >
            <Image
              source={item?.cover ? { uri: item?.cover } : default_image}
              style={{
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
                width: (Dimensions.get("screen").width - 80) / 2,
                height: (Dimensions.get("screen").height - 180) / 6,
              }}
            ></Image>
            <View
              style={{
                width: "100%",
                padding: 10,
              }}
            >
              <Text type="light" size="small" style={{ marginBottom: 2 }}>
                {item?.category?.name}
              </Text>
              <Text
                type="bold"
                size="label"
                numberOfLines={1}
                style={{ marginBottom: 3 }}
              >
                {item?.title}
              </Text>
              {/* <Text
                type="light"
                size="small"
                style={{
                  fontStyle: "italic",
                }}
              >
                12 min read
              </Text> */}
              <Text type="light" size="small">
                {getdate(item.created_at)}
              </Text>
            </View>
          </Ripple>
        )}
        // numColumns={2}
        keyExtractor={(item) => item.id}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
