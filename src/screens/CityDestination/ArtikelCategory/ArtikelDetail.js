import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, CustomImage, Text, Truncate } from "../../../component";
import { default_image } from "../../../assets/png";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import { Loading } from "../../../component";
import { useTranslation } from "react-i18next";
import { Arrowbackios, Arrowbackwhite, SharePutih } from "../../../assets/svg";
import { Image } from "react-native";
import { ImageBackground } from "react-native";
import { ScrollView } from "react-native";
import { FlatList } from "react-native";
import Ripple from "react-native-material-ripple";
import LinearGradient from "react-native-linear-gradient";
import ArtikelList from "../../../graphQL/Query/Countries/Articlelist";
import ArticleById from "../../../graphQL/Query/Countries/ArticleById";

export default function ArticelDetail(props) {
  const { t, i18n } = useTranslation();

  const HeaderComponent = {
    headerShown: true,
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: props.route.params.title,
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

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
  }, []);

  let data = [{}, {}, {}];

  const {
    data: dataList,
    loading: loadingList,
    fetchMore,
    refetch,
    networkStatus,
  } = useQuery(ArtikelList, {
    variables: {
      category_id: props.route.params.category_id,
      country_id: props.route.params.country_id,
      limit: 4,
      offset: 0,
      keyword: "",
    },
    context: {
      headers: {
        "Content-Type": "application/json",
      },
    },
    notifyOnNetworkStatusChange: true,
  });

  let list = [];
  if (dataList && "datas" in dataList.list_articel_country_category) {
    for (var i of dataList.list_articel_country_category.datas) {
      if (i.id !== props.route.params.id) {
        list.push(i);
      }
    }
  }

  const {
    data: dataDetail,
    loading: loadingDetail,
    fetchMore: fetchMoreDetail,
    refetch: refetchDetail,
    networkStatus: networkStatusDetail,
  } = useQuery(ArticleById, {
    variables: {
      article_id: props.route.params.id,
    },
    context: {
      headers: {
        "Content-Type": "application/json",
      },
    },
    notifyOnNetworkStatusChange: true,
  });

  const duration = (datetime) => {
    var date1 = new Date(datetime).getTime();
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

  if (loadingList) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          alignContent: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator animating={true} color="#209fae" size="large" />
      </View>
    );
  }

  if (loadingDetail) {
    return null;
  }

  if (dataDetail.article_byid) {
    return (
      <ScrollView
        contentContainerStyle={{
          backgroundColor: "#f6f6f6",
        }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={{
          flex: 1,
        }}
      >
        <ImageBackground
          source={
            dataDetail.article_byid.firstimg
              ? { uri: dataDetail?.article_byid?.firstimg }
              : default_image
          }
          style={{
            width: "100%",
            height: Dimensions.get("screen").height * 0.3,
            justifyContent: "flex-end",
          }}
          imageStyle={{
            width: "100%",
            height: Dimensions.get("screen").height * 0.3,
          }}
        ></ImageBackground>

        <View
          style={{
            width: "100%",
            height: 30,
            alignContent: "center",
            alignContent: "center",
          }}
        >
          <Button
            type="circle"
            color="secondary"
            style={{
              position: "absolute",
              top: -20,
              width: Dimensions.get("screen").width / 2.5,
              zIndex: 20,
              alignSelf: "center",
              flexDirection: "row",
            }}
            onPress={() => Alert.alert("coming soon!")}
          >
            <SharePutih height={20} width={20} />
            <Text style={{ color: "#fff", marginLeft: 10 }}>{t("share")}</Text>
          </Button>
        </View>

        <View
          // colors={["rgba(0, 0, 0, 0.7)", "rgba(0, 0, 0, 0)"]}
          // start={{ x: 0, y: 1 }}
          // end={{ x: 0, y: 0 }}
          style={{
            // height: "50%",
            width: "100%",
            marginTop: -40,
            padding: 20,
            justifyContent: "flex-end",
            alignContent: "flex-start",
            alignItems: "flex-start",
            // backgroundColor: "rgba(0,0,0,0.2)",
            // borderRadius: 5,
            // paddingBottom: 40,
          }}
          onPress={() => {
            props.navigation.navigate("ArticelDetail");
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
              {dataDetail.article_byid.category.name}
            </Text>
          </View>
          <Text type={"bold"} size="label">
            {dataDetail.article_byid.title}
          </Text>

          <Text
            size="description"
            numberOfLines={2}
            style={{
              textAlign: "justify",
            }}
          >
            {dataDetail.article_byid.firsttxt}
          </Text>
          {/* <View
              style={{
                flexDirection: "row",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <Text type="light" size="small" style={{ color: "white" }}>
                Source :{" "}
              </Text>

              <Text
                type="light"
                size="small"
                style={{ color: "white", fontStyle: "italic" }}
              >
                http://id.pinterest.com/
              </Text>
            </View> */}
          <Text size="small" type="light" style={{ fontStyle: "italic" }}>
            {duration(dataDetail.article_byid.date)}
          </Text>
        </View>

        {/* detail */}
        {dataDetail.article_byid.content.map((item, index) => {
          // console.log(item);
          return (
            <View
              key={"content" + index}
              style={{
                paddingHorizontal: 20,
                width: "100%",
                marginBottom: 20,
              }}
            >
              {item.title !== null ? (
                <Text size="label" type="bold" style={{}}>
                  {item.title}
                </Text>
              ) : null}
              {item.image && item.image !== null ? (
                <Image
                  source={item.image ? { uri: item.image } : default_image}
                  style={{
                    width: "100%",
                    height: Dimensions.get("screen").width / 2,
                    borderRadius: 5,
                    marginTop: 10,
                  }}
                ></Image>
              ) : null}
              {/* <View
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                  marginBottom: 5,
                }}
              > */}
              {/* <Text type="light" size="small" style={{}}>
                  Source :{" "}
                </Text>

                <Text type="light" size="small" style={{ fontStyle: "italic" }}>
                  http://id.pinterest.com/
                </Text> */}
              {/* </View> */}
              {item.text !== null && item.text !== "" ? (
                <Text style={{ textAlign: "justify" }}>{item.text}</Text>
              ) : null}
            </View>
          );
        })}

        {/* more related */}
        {list.length > 0 ? (
          <View style={{ paddingHorizontal: 20 }}>
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
                  {t("More Related Articles")}
                </Text>
              </View>
            </View>
            <FlatList
              data={list}
              renderItem={({ item, index }) => (
                <Ripple
                  key={"more" + item.id}
                  onPress={() => {
                    props.navigation.push("ArticelDetail", {
                      id: item.id,
                      category_id: props.route.params.category_id,
                      country_id: props.route.params.country_id,
                      title: item.title,
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
                      item.firstimg !== null
                        ? { uri: item.firstimg }
                        : default_image
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
                      <Text size="small">
                        {" "}
                        #{item?.countries?.name
                          .toLowerCase()
                          .replace(/ /g, "")}{" "}
                        #{item?.category?.name.toLowerCase().replace(/ /g, "")}
                      </Text>
                      <Text size="small">{duration(item.date)}</Text>
                    </View>
                    <Text size="small" type="bold">
                      <Truncate
                        text={item.title ? item.title : ""}
                        length={40}
                      />
                    </Text>
                    <Text size="small">
                      <Truncate
                        text={item.firsttxt ? item.firsttxt : ""}
                        length={60}
                      />
                    </Text>
                    {/* <Text size="small" type="light" style={{ fontStyle: "italic" }}>
					  12 min read
					</Text> */}
                  </View>
                </Ripple>
              )}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          </View>
        ) : null}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({});
