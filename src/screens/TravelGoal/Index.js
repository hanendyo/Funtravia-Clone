import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TextInput,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, CustomImage, Text, Truncate } from "../../component";
import { default_image } from "../../assets/png";
import { useLazyQuery } from "@apollo/client";
import { Loading } from "../../component";
import { useTranslation } from "react-i18next";
import { Arrowbackwhite } from "../../assets/svg";
import { Image } from "react-native";
import { ImageBackground } from "react-native";
import { ScrollView } from "react-native";
import { FlatList } from "react-native";
import Ripple from "react-native-material-ripple";
import TravelTops from "../../graphQL/Query/TravelGoal/TravelTop";
import TravelPopulars from "../../graphQL/Query/TravelGoal/TravelPopular";
import TravelNews from "../../graphQL/Query/TravelGoal/TravelNew";

export default function TravelGoal(props) {
  const HeaderComponent = {
    headerShown: true,
    title: "Travel Goal",
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: "Travel Goal",
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      fontFamily: "Lato-Bold",
      fontSize: 14,
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
        <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
      </Button>
    ),
  };
  const { t, i18n } = useTranslation();

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
        // Authorization: `Bearer ${token}`,
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
        // Authorization: `Bearer ${token}`,
      },
    },
    onCompleted: () => {
      setdataPopular(dataPopulars.travelgoal_populer);
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
        // Authorization: `Bearer ${token}`,
      },
    },
    onCompleted: () => {
      setdataNew(dataNews.travelgoal_newer);
    },
  });

  console.log(loadingNew);
  console.log(dataNews);
  console.log(errorNew);

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
        // backgroundColor: "#fff",
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
          <ImageBackground
            source={
              dataTop?.travelgoal_first?.firstimg
                ? { uri: dataTop?.travelgoal_first?.firstimg }
                : null
            }
            style={{
              shadowOpacity: 0.5,
              shadowColor: "#d3d3d3",
              elevation: 3,
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
                padding: 10,
                justifyContent: "flex-end",
                alignContent: "flex-start",
                alignItems: "flex-start",
                backgroundColor: "rgba(0,0,0,0.2)",
                borderRadius: 5,
                justifyContent: "space-between",
              }}
              onPress={() => {
                props.navigation.push("TravelGoalDetail");
              }}
            >
              <View
                style={{
                  backgroundColor: "#E2ECF8",
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                  borderRadius: 20,
                  marginVertical: 10,
                  // borderWidth: 1,
                }}
              >
                <Text size="small" style={{ color: "#209fae" }}>
                  {dataTop?.travelgoal_first?.category?.name}
                </Text>
              </View>
              <View>
                <Text type={"bold"} size="label" style={{ color: "white" }}>
                  {dataTop?.travelgoal_first?.title}
                </Text>
                <Text
                  size="description"
                  numberOfLines={1}
                  style={{ color: "white" }}
                >
                  {dataTop?.travelgoal_first?.firsttxt}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  {dataTop?.travelgoal_first?.created_at ? (
                    <Text type="light" size="small" style={{ color: "white" }}>
                      {getdate(dataTop?.travelgoal_first?.created_at)}
                    </Text>
                  ) : null}
                  {/* <View
                style={{
                  width: 5,
                  height: 5,
                  marginTop: 3,
                  backgroundColor: "white",
                  borderRadius: 5,
                }}
              ></View> */}
                  {/* <Text type="light" size="small" style={{ color: "white" }}>
                12 min read{" "}
              </Text> */}
                </View>
              </View>
            </Ripple>
          </ImageBackground>
        ) : null}
        {/* Popular */}
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
        {dataPopular.map((item, index) => {
          return (
            <Ripple
              onPress={() => {
                props.navigation.push("TravelGoalDetail");
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
                source={
                  item?.firstimg ? { uri: item?.firstimg } : default_image
                }
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
                  <Text size="small">{item?.category?.name}</Text>
                  <Text size="small">{getdate(item?.created_at)}</Text>
                </View>
                <Text size="label" type="bold">
                  {item?.title}
                </Text>
                {item?.firsttxt ? (
                  <Text size="description" numberOfLines={2}>
                    {item?.firsttxt}
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
              {t("NewArticle")}
            </Text>
          </View>
          <Text style={{ color: "#209fae" }}>{t("Seemore")}</Text>
        </View>
      </View>
      <FlatList
        contentContainerStyle={{
          paddingStart: 20,
          paddingEnd: 10,
          paddingBottom: 20,
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
              props.navigation.push("TravelGoalDetail");
            }}
            style={{
              marginRight: 10,
              shadowOpacity: 0.5,
              shadowColor: "#d3d3d3",
              elevation: 3,
              backgroundColor: "#fff",
              width: (Dimensions.get("screen").width - 60) / 3,
              borderRadius: 5,
            }}
          >
            <Image
              source={item?.firstimg ? { uri: item?.firstimg } : default_image}
              style={{
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
                width: (Dimensions.get("screen").width - 60) / 3,
                height: (Dimensions.get("screen").width - 60) / 3,
              }}
            ></Image>
            <View
              style={{
                width: "100%",
                padding: 10,
              }}
            >
              <Text type="regular" size="small">
                {item?.category?.name}
              </Text>
              <Text type="bold" size="label" numberOfLines={1}>
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
