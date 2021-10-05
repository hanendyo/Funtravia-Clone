import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TextInput,
  SafeAreaView,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Button,
  CopyLink,
  CustomImage,
  FunImage,
  shareAction,
  Text,
  Truncate,
  // StatusBar,
} from "../../component";
import { default_image } from "../../assets/png";
import { useLazyQuery } from "@apollo/react-hooks";
import { Loading } from "../../component";
import { useTranslation } from "react-i18next";
import {
  Arrowbackios,
  Arrowbackwhite,
  SharePutih,
  Xgray,
} from "../../assets/svg";
import { Image } from "react-native";
import { ImageBackground } from "react-native";
import { ScrollView } from "react-native";
import { FlatList } from "react-native";
import Ripple from "react-native-material-ripple";
import LinearGradient from "react-native-linear-gradient";
import Traveldetails from "../../graphQL/Query/TravelGoal/Traveldetail";
import Travelrelateds from "../../graphQL/Query/TravelGoal/TravelRelated";
import normalize from "react-native-normalize";

export default function TravelGoalDetail(props) {
  const { t, i18n } = useTranslation();
  let [datadetail, setdatadetail] = useState({});
  let [modalShare, setModalShare] = useState(false);
  let [datarelated, setdatarelated] = useState([]);
  const HeaderComponent = {
    headerShown: true,
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: (
      <Text size="header" type="bold" style={{ color: "#fff" }}>
        {t("travelgoals")}
      </Text>
    ),
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
        // Authorization: `Bearer ${token}`,
      },
    },
    onCompleted: () => {
      setdatadetail(datadetails.detail_travelgoal);
    },
  });

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    Traveldetail();
    // console.log(props.route?.params?.article_id);
  }, []);

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
        // Authorization: `Bearer ${token}`,
      },
    },
    onCompleted: () => {
      // console.log(datarelateds);
      setdatarelated(datarelateds.related_travelgoal);
    },
  });

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    Traveldetail();
    Travelrelated();
    // console.log(props.route?.params?.article_id);
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
                props.navigation.navigate("SendTravelGoals", {
                  params: { dataGoal: datadetail },
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
      {/* <StatusBar backgroundColor="#14646E" barStyle="light-content" /> */}
      <ImageBackground
        source={datadetail?.cover ? { uri: datadetail?.cover } : default_image}
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
          height: 50,
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
          onPress={() => {
            setModalShare(true);
          }}
        >
          <SharePutih height={20} width={20} />
          <Text style={{ color: "#fff", marginLeft: 10 }}>Share</Text>
        </Button>
      </View>
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
            backgroundColor: "#E2ECF8",
            paddingHorizontal: 10,
            paddingVertical: 3,
            borderRadius: 20,
            marginVertical: 10,
          }}
        >
          <Text size="small" style={{ color: "#209fae" }}>
            {datadetail?.category?.name}
          </Text>
        </View>
        <Text
          type={"bold"}
          size="title"
          style={{
            marginBottom: 5,
          }}
        >
          {datadetail?.title}
        </Text>
        {datadetail?.description ? (
          <Text
            size="readable"
            // numberOfLines={2}
            type="regular"
            style={{
              textAlign: "left",
              lineHeight: normalize(20),
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
          {/* <Text type="light" size="small" style={{}}>
            Source :{" "}
          </Text> */}
          {datadetail?.created_at ? (
            <Text type="light" size="small">
              {getdate(datadetail?.created_at)}
            </Text>
          ) : null}
        </View>
        {/* <Text size="small" type="light" style={{ fontStyle: "italic" }}>
          12 min read
        </Text> */}
      </View>

      {/* detail */}
      {datadetail?.content?.map((i, index) => {
        return (
          <View style={{ paddingHorizontal: 15, width: "100%" }}>
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
                    marginBottom: 15,
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
                  size="title"
                  type="regular"
                  style={{
                    lineHeight: 22,
                    textAlign: "left",
                    color: "#464646",
                    marginBottom: 15,

                    paddingHorizontal: 5,
                  }}
                >
                  {i.text ? i.text : ""}
                </Text>
              </View>
            )}

            {/* {item?.title ? (
              <Text size="label" type="bold" style={{}}>
                {item?.title ? item?.title : null}
              </Text>
            ) : null}
            {item?.image ? (
              <Image
                source={item?.image ? { uri: item?.image } : default_image}
                style={{
                  width: "100%",
                  height: Dimensions.get("screen").width / 2,
                  borderRadius: 5,
                  marginVertical: 10,
                }}
              ></Image>
            ) : null} */}

            {/* <ViewArticle
              style={{
                flexDirection: "row",
                alignContent: "center",
                alignItems: "center",
                marginBottom: 5,
              }}
            >
              <Text type="light" size="small" style={{}}>
                Source :{" "}
              </Text>

              <Text type="light" size="small" style={{ fontStyle: "italic" }}>
                {getdate(item.)}
              </Text>
            </ViewArticle> */}
            {/* {item.text ? (
              <Text size="readable" style={{ textAlign: "justify" }}>
                {item.text}
              </Text>
            ) : null} */}
          </View>
        );
      })}

      {/* more related */}
      {datarelated.length > 0 ? (
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
            <View></View>
          </View>

          {datarelated?.map((item, index) => {
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
                  {/* <Text size="small" type="light" style={{ fontStyle: "italic" }}>
                  12 min read
                </Text> */}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
