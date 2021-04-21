import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Button, CustomImage, Text, Truncate } from "../../component";
import { default_image } from "../../assets/png";
import { useLazyQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { Arrowbackwhite } from "../../assets/svg";
import { Image } from "react-native";
import { ScrollView } from "react-native";
import Ripple from "react-native-material-ripple";
import TravelLists from "../../graphQL/Query/TravelGoal/TravelList";

export default function TravelGoalList(props) {
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
    TravelList();
  }, []);

  let [dataList, setdataList] = useState([]);
  let [dataListx, setdataListx] = useState({});

  const [
    TravelList,
    { loading: loadingList, data: dataLists, error: errorList },
  ] = useLazyQuery(TravelLists, {
    fetchPolicy: "network-only",
    variables: {
      limit: 5,
      offset: 1,
      category_id: "",
      keyword: "",
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}`,
      },
    },
    onCompleted: () => {
      setdataListx(dataLists);
      console.log(dataLists);
    },
  });
  console.log(loadingList);
  console.log(dataLists);
  console.log(errorList);

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
        {dataList?.length > 0 ? (
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
        {dataList?.map((item, index) => {
          return (
            <Ripple
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
                  <Text
                    size="description"
                    numberOfLines={2}
                    style={{
                      textAlign: "justify",
                    }}
                  >
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
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
