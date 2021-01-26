import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  Alert,
  RefreshControl,
  TouchableOpacity,
  Image,
  ScrollView,
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { default_image, Akunsaya } from "../../assets/png";
import { Sharegreen, Arrowbackwhite, OptionsVertWhite } from "../../assets/svg";
import { Tab, Tabs, ScrollableTab } from "native-base";
import MyTrip from "./MyTrip";
import Review from "./Review";
import Post from "./Post";
import { useLazyQuery } from "@apollo/react-hooks";
import Account from "../../graphQL/Query/Home/Account";
import { useTranslation } from "react-i18next";
import { Button, Loading, Text } from "../../component";
import User_Post from "../../graphQL/Query/Profile/post";
import Itinerary from "../../graphQL/Query/Profile/itinerary";
import Reviews from "../../graphQL/Query/Profile/review";
import { Sidebar } from "../../component";

export default function MyProfile(props) {
  const HeaderComponent = {
    title: "",
    headerTransparent: true,
    headerTintColor: "white",
    headerTitle: "",
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
    // headerLeftContainerStyle: {
    //   background: "#FFF",

    //   marginLeft: 10,
    // },
    // headerLeft: () => (
    //   <Button
    //     text={""}
    //     size="medium"
    //     type="circle"
    //     variant="transparent"
    //     onPress={() => props.navigation.goBack()}
    //     style={{
    //       backgroundColor: "rgba(0,0,0,0.3)",
    //     }}
    //   >
    //     <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
    //   </Button>
    // ),
    headerRight: () => (
      <Button
        text={""}
        size="medium"
        type="circle"
        variant="transparent"
        onPress={() => setshowside(true)}
        style={{
          // backgroundColor: "rgba(0,0,0,0.3)",
          marginRight: 10,
        }}
      >
        <OptionsVertWhite height={15} width={15}></OptionsVertWhite>
      </Button>
    ),

    // tabBarBadge: 9,
  };

  const { t, i18n } = useTranslation();
  const [refreshing, setRefreshing] = useState(false);
  let [token, setToken] = useState("");
  let [showside, setshowside] = useState(false);

  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    if (tkn !== null) {
      setToken(tkn);
      LoadUserProfile();
      LoadPost();
      LoadTrip();
      LoadReview();

      props.navigation.setParams({
        setside: () => setshowside(true),
      });
    }
  };

  const [LoadUserProfile, { data, loading, error, refetch }] = useLazyQuery(
    Account,
    {
      fetchPolicy: "network-only",

      context: {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    }
  );

  const [
    LoadPost,
    { data: datapost, loading: loadingpost, error: errorpost },
  ] = useLazyQuery(User_Post, {
    fetchPolicy: "network-only",

    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const [
    LoadReview,
    { data: datareview, loading: loadingreview, error: errorreview },
  ] = useLazyQuery(Reviews, {
    fetchPolicy: "network-only",

    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const [
    LoadTrip,
    { data: datatrip, loading: loadingtrip, error: errortrip },
  ] = useLazyQuery(Itinerary, {
    fetchPolicy: "network-only",

    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  let initfirstname =
    data && data.user_profile.first_name ? data.user_profile.first_name : "";
  let initlastname =
    data && data.user_profile.last_name ? data.user_profile.last_name : "";
  let initusername =
    data && data.user_profile.username ? data.user_profile.username : "";
  let initbio = data && data.user_profile.bio ? data.user_profile.bio : "-";
  let count_points =
    data && data.user_profile.point ? data.user_profile.point : 0;
  let userid = data ? data.user_profile.id : null;
  let image_profile =
    data && data.user_profile.picture
      ? { uri: data.user_profile.picture }
      : default_image;

  function wait(timeout) {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  }

  const onRefresh = () => {
    setRefreshing(true);
    loadAsync();
    wait(1000).then(() => setRefreshing(false));
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      onRefresh();
    });
    return unsubscribe;
  }, [props.navigation]);

  let [scrollY, setscrollY] = useState(new Animated.Value(0));
  let HEADER_MAX_HEIGHT = 200;
  let HEADER_MIN_HEIGHT = 55;
  let HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.5, 0],
    extrapolate: "clamp",
  });
  const imageTranslate = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -50],
    extrapolate: "clamp",
  });
  const positionImage = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT - 30, 7],
    extrapolate: "clamp",
  });

  const borderImage = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [3, 1],
    extrapolate: "clamp",
  });

  const positionLeftImage = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [20, 50],
    extrapolate: "clamp",
  });
  const heightImage = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [100, 40],
    extrapolate: "clamp",
  });

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  const opacityto1 = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const opacityfrom1 = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  return (
    <>
      <ScrollView
        style={{
          marginTop: 50,
          backgroundColor: "white",
        }}
        contentContainerStyle={{}}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[5]}
        nestedScrollEnabled
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={Animated.event([
          {
            nativeEvent: { contentOffset: { y: scrollY } },
          },
        ])}
      >
        <Loading show={loading} />

        <View
          style={{
            height: 150,
          }}
        ></View>
        {data && data.user_profile ? (
          <View
            style={{
              width: Dimensions.get("screen").width,
              justifyContent: "space-between",
              flexDirection: "row",
              // position: 'absolute',
              marginTop: -30,
              paddingHorizontal: 20,
              alignItems: "center",
            }}
          >
            <View
              style={{
                // shadowOpacity: 0.5,
                // shadowColor: "#d3d3d3",
                // elevation: 4,
                // alignSelf: "center",
                // borderColor: "white",
                // borderRadius: 60,
                // borderWidth: 3,
                // backgroundColor: "#B8E0E5",
                height: 101,
                width: 101,

                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* <Image
                source={image_profile}
                style={{
                  borderRadius: 60,
                  resizeMode: "cover",
                  height: "100%",
                  width: "100%",
                }}
              /> */}
            </View>
            {data && data.user_profile ? (
              <Button
                style={{
                  marginTop: 20,
                  width: "65%",
                  borderColor: "#464646",
                }}
                onPress={() =>
                  props.navigation.push("profilesetting", {
                    token: token,
                    data: data.user_profile,
                  })
                }
                size="small"
                color="black"
                variant="bordered"
                text={t("editprofile")}
              ></Button>
            ) : null}
          </View>
        ) : null}
        {data && data.user_profile ? (
          <View
            style={{
              flexDirection: "row",
              width: Dimensions.get("screen").width,
              justifyContent: "space-between",
              paddingHorizontal: 20,
              alignItems: "center",
              alignContent: "center",
              marginTop: 5,
            }}
          >
            <Animated.View style={{ width: "50%", opacity: opacityfrom1 }}>
              <Text type="bold" size="label" style={{ marginRight: 10 }}>
                {`${initfirstname} ` + `${initlastname}`}
              </Text>
              <Text
                type="regular"
                size="description"
              >{`@${initusername} `}</Text>
            </Animated.View>

            <View
              style={{
                width: "50%",
                flexDirection: "row",
                justifyContent: "space-evenly",
                alignItems: "baseline",
              }}
            >
              <TouchableOpacity
                style={{
                  alignItems: "center",
                  alignContent: "center",
                }}
                onPress={() => props.navigation.push("FollowerPage")}
              >
                <Text type="black" size="label">
                  {`${data ? data.user_profile.count_follower : 0} `}
                </Text>
                <Text type="regular" size="description">
                  {t("followers")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  alignItems: "center",
                  alignContent: "center",
                }}
                onPress={() => props.navigation.push("FollowingPage")}
              >
                <Text type="black" size="label">
                  {`${data ? data.user_profile.count_following : 0} `}
                </Text>
                <Text type="regular" size="description">
                  {t("following")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
        {data && data.user_profile ? (
          <View
            style={{
              paddingVertical: 15,
              width: Dimensions.get("screen").width,
              paddingHorizontal: 20,
            }}
          >
            <Text
              type="regular"
              size="description"
              style={{ textAlign: "justify" }}
            >
              {initbio ? initbio : "-"}
            </Text>
          </View>
        ) : null}
        {data && data.user_profile ? (
          <View
            style={{
              borderTopWidth: 0.5,
              borderTopColor: "#D1D1D1",
              justifyContent: "center",
              width: Dimensions.get("window").width,
            }}
          >
            <Tabs
              style={{ backgroundColor: "white" }}
              //Start of native-base library use
              renderTabBar={() => (
                <ScrollableTab
                  style={{
                    backgroundColor: "transparent",
                  }}
                  tabStyle={{ backgroundColor: "white" }}
                  tabsContainerStyle={{ backgroundColor: "white" }}
                  underlineStyle={{
                    borderColor: "#209FAE",
                    backgroundColor: "#209FAE",
                  }}
                />
              )}
            >
              <Tab
                heading={t("posts")}
                tabStyle={{ backgroundColor: "transparent" }}
                activeTabStyle={{ backgroundColor: "transparent" }}
                textStyle={{ fontFamily: "Lato-Bold", color: "#6C6C6C" }}
                activeTextStyle={{ fontFamily: "Lato-Bold", color: "#209FAE" }}
              >
                {datapost && data ? (
                  <Post
                    props={props}
                    token={token}
                    data={datapost.user_post}
                    datauser={data.user_profile}
                  />
                ) : null}
              </Tab>
              <Tab
                heading={t("reviews")}
                tabStyle={{ backgroundColor: "transparent" }}
                activeTabStyle={{ backgroundColor: "transparent" }}
                textStyle={{ fontFamily: "Lato-Bold", color: "#6C6C6C" }}
                activeTextStyle={{ fontFamily: "Lato-Bold", color: "#209FAE" }}
              >
                {datareview ? (
                  <Review
                    props={props}
                    token={token}
                    data={datareview.user_review}
                  />
                ) : null}
              </Tab>
              <Tab
                heading={t("MyTrip")}
                tabStyle={{ backgroundColor: "transparent" }}
                activeTabStyle={{ backgroundColor: "transparent" }}
                textStyle={{ fontFamily: "Lato-Bold", color: "#6C6C6C" }}
                activeTextStyle={{ fontFamily: "Lato-Bold", color: "#209FAE" }}
              >
                {datatrip ? (
                  <MyTrip
                    props={props}
                    token={token}
                    data={datatrip.user_trip}
                    position={"profile"}
                  />
                ) : null}
              </Tab>
            </Tabs>
          </View>
        ) : null}

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
              >
                <TouchableOpacity
                  onPress={() => Alert.alert("coming soon")}
                  style={{
                    marginVertical: 5,
                    flexDirection: "row",
                    width: "100%",
                    paddingVertical: 2,
                    alignItems: "center",
                  }}
                >
                  <Sharegreen height={15} width={15} />

                  <Text
                    size="label"
                    type="regular"
                    style={{
                      marginLeft: 10,
                    }}
                  >
                    {t("share")}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          }}
          setClose={(e) => setshowside(false)}
        />
      </ScrollView>
      <Animated.View
        style={{
          height: headerHeight,
          width: Dimensions.get("screen").width,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: "#209fae",
          overflow: "hidden",
        }}
      >
        {data && data.user_profile ? (
          <Animated.View
            style={{
              position: "absolute",
              left: 110,
              top: 15,
              opacity: opacityto1,
            }}
          >
            <Text type="bold" size="label" style={{ color: "white" }}>
              {`${initfirstname} ` + `${initlastname}`}
            </Text>
          </Animated.View>
        ) : null}
        <Animated.Image
          style={{
            // position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            width: null,
            height: HEADER_MAX_HEIGHT + 55,
            resizeMode: "cover",
            opacity: imageOpacity,
            transform: [{ translateY: imageTranslate }],
          }}
          source={Akunsaya}
        />
      </Animated.View>
      {data && data.user_profile ? (
        <Animated.View
          style={{
            width: Dimensions.get("screen").width,
            justifyContent: "space-between",
            flexDirection: "row",
            position: "absolute",
            top: positionImage,
            left: positionLeftImage,
            // marginTop: -30,
            // paddingHorizontal: 20,
            alignItems: "center",
          }}
        >
          <Animated.View
            style={{
              shadowOpacity: 0.5,
              shadowColor: "#d3d3d3",
              elevation: 4,
              alignSelf: "center",
              borderColor: "white",
              borderRadius: 60,
              borderWidth: borderImage,
              backgroundColor: "#B8E0E5",
              height: heightImage,
              width: heightImage,

              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={image_profile}
              style={{
                borderRadius: 60,
                resizeMode: "cover",
                height: "100%",
                width: "100%",
              }}
            />
          </Animated.View>
        </Animated.View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  main: {},
  tabView: {},
});
