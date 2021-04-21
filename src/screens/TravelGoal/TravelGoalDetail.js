import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TextInput,
  SafeAreaView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, CustomImage, Text, Truncate } from "../../component";
import { default_image } from "../../assets/png";
import { useLazyQuery } from "@apollo/react-hooks";
import { Loading } from "../../component";
import { useTranslation } from "react-i18next";
import { Arrowbackwhite, SharePutih } from "../../assets/svg";
import { Image } from "react-native";
import { ImageBackground } from "react-native";
import { ScrollView } from "react-native";
import { FlatList } from "react-native";
import Ripple from "react-native-material-ripple";
import LinearGradient from "react-native-linear-gradient";
import Traveldetails from "../../graphQL/Query/TravelGoal/Traveldetail";
import Travelrelateds from "../../graphQL/Query/TravelGoal/TravelRelated";

export default function TravelGoalDetail(props) {
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
  let [datadetail, setdatadetail] = useState({});
  let [datarelated, setdatarelated] = useState([]);

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
      <ImageBackground
        source={
          datadetail?.firstimg ? { uri: datadetail?.firstimg } : default_image
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
            Alert.alert("coming soon");
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
          size="label"
          style={{
            marginBottom: 10,
          }}
        >
          {datadetail?.title}
        </Text>
        {datadetail?.firsttxt ? (
          <Text
            size="description"
            numberOfLines={2}
            style={{ textAlign: "justify" }}
          >
            {datadetail?.firsttxt}
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
            <Text type="light" size="small" style={{ fontStyle: "italic" }}>
              {getdate(datadetail?.created_at)}
            </Text>
          ) : null}
        </View>
        {/* <Text size="small" type="light" style={{ fontStyle: "italic" }}>
          12 min read
        </Text> */}
      </View>

      {/* detail */}
      {datadetail?.content?.map((item, index) => {
        return (
          <View
            style={{ paddingHorizontal: 20, width: "100%", marginBottom: 20 }}
          >
            {item?.title ? (
              <Text size="label" type="bold" style={{}}>
                {item?.title ? index + 1 + ". " + item?.title : null}
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
            ) : null}
            {/* <View
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
            </View> */}
            {item.text ? (
              <Text style={{ textAlign: "justify" }}>{item.text}</Text>
            ) : null}
          </View>
        );
      })}

      {/* more related */}
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
                source={item.firstimg ? { uri: item.firstimg } : default_image}
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
                  <Text size="small">{getdate(item.created_at)}</Text>
                </View>
                <Text size="desription" type="bold">
                  {item.title}
                </Text>
                <Text
                  numberOfLines={2}
                  size="small"
                  style={{
                    textAlign: "justify",
                  }}
                >
                  {item.firsttxt}
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
              text="Explore More"
              style={{
                width: Dimensions.get("screen").width / 2.5,
                alignSelf: "center",
                flexDirection: "row",
              }}
            ></Button>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
