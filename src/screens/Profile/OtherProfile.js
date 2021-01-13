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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { default_image, Akunsaya } from "../../assets/png";
import { Sharegreen, Arrowbackwhite, OptionsVertWhite } from "../../assets/svg";
import { Tab, Tabs, ScrollableTab } from "native-base";
import MyTrip from "./MyTrip";
import Review from "./Review";
import Post from "./Post";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import Account from "../../graphQL/Query/Profile/Other";
import { Button, Text } from "../../component";
import User_Post from "../../graphQL/Query/Profile/otherpost";
import Itinerary from "../../graphQL/Query/Profile/otheritinerary";
import Reviews from "../../graphQL/Query/Profile/otherreview";
import { useTranslation } from "react-i18next";
import { Sidebar } from "../../component";
import { Loading } from "../../component";
import FollowMut from "../../graphQL/Mutation/Profile/FollowMut";
import UnfollowMut from "../../graphQL/Mutation/Profile/UnfollowMut";

export default function OtherProfile(props) {
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
      fontFamily: "Lato-Regular",
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
          backgroundColor: "rgba(0,0,0,0.3)",
        }}
      >
        <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
      </Button>
    ),
    headerRight: () => (
      <Button
        text={""}
        size="medium"
        type="circle"
        variant="transparent"
        onPress={() => setshowside(true)}
        style={{
          backgroundColor: "rgba(0,0,0,0.3)",
          marginRight: 10,
        }}
      >
        <OptionsVertWhite height={20} width={20}></OptionsVertWhite>
      </Button>
    ),
    // tabBarBadge: 9,
  };

  const { t, i18n } = useTranslation();
  const [refreshing, setRefreshing] = useState(false);
  const idUser = props.route.params.idUser;
  let [token, setToken] = useState("");
  let [showside, setshowside] = useState(false);
  let [idku, setidku] = useState("");
  let [loadings, setLoading] = useState(false);

  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    let user = JSON.parse(await AsyncStorage.getItem("user"));
    // console.log(tkn);
    if (tkn !== null) {
      setToken(tkn);
      LoadUserProfile();
      LoadPost();
      LoadTrip();
      LoadReview();
      props.navigation.setParams({
        setside: () => setshowside(true),
      });
      setidku(user.id);
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
      variables: {
        id: idUser,
      },
    }
  );

  const [
    LoadPost,
    { data: datapost, loading: loadingpost, error: errorpost },
  ] = useLazyQuery(User_Post, {
    fetchPolicy: "network-only",
    variables: {
      id: idUser,
    },
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
    variables: {
      id: idUser,
    },
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
    variables: {
      id: idUser,
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  let initfirstname =
    data && data.user_profilebyid.first_name
      ? data.user_profilebyid.first_name
      : "";
  let initlastname =
    data && data.user_profilebyid.last_name
      ? data.user_profilebyid.last_name
      : "";
  let initusername =
    data && data.user_profilebyid.username
      ? data.user_profilebyid.username
      : "";
  let initbio =
    data && data.user_profilebyid.bio ? data.user_profilebyid.bio : "-";
  let count_points =
    data && data.user_profilebyid.point ? data.user_profilebyid.point : 0;
  let userid = data ? data.user_profilebyid.id : null;
  let image_profile =
    data && data.user_profilebyid.picture
      ? { uri: data.user_profilebyid.picture }
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

  const _handlemessage = async (id, tokens) => {
    try {
      let response = await fetch(
        "https://scf.funtravia.com/api/personal/chat?receiver_id=" + id,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + tokens,
            "Content-Type": "application/json",
          },
          // body: formBodys,
        }
      );

      let responseJson = await response.json();

      if (responseJson) {
        if (responseJson.sender_id === idku) {
          props.navigation.push("RoomChat", {
            room_id: responseJson.id,
            receiver: responseJson.receiver.id,
            name:
              responseJson.receiver.first_name +
              " " +
              (responseJson.receiver.last_name
                ? responseJson.receiver.last_name
                : ""),
            picture: responseJson.receiver.picture,
          });
        } else {
          props.navigation.push("RoomChat", {
            room_id: responseJson.id,
            receiver: responseJson.sender.id,
            name:
              responseJson.sender.first_name +
              " " +
              (responseJson.sender.last_name
                ? responseJson.sender.last_name
                : ""),
            picture: responseJson.sender.picture,
          });
        }
      }
    } catch (error) {
      console.error(error);
      // setLoading(false);
    }
  };

  const [
    FollowMutation,
    { loading: loadFollowMut, data: dataFollowMut, error: errorFollowMut },
  ] = useMutation(FollowMut, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const [
    UnfollowMutation,
    { loading: loadUnfolMut, data: dataUnfolMut, error: errorUnfolMut },
  ] = useMutation(UnfollowMut, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const _unfollow = async (id) => {
    setLoading(true);
    if (token || token !== "") {
      try {
        let response = await UnfollowMutation({
          variables: {
            id: id,
          },
        });

        if (errorUnfolMut) {
          throw new Error("Error Input");
        }

        if (response.data) {
          if (
            response.data.unfollow_user.code === 200 ||
            response.data.unfollow_user.code === "200"
          ) {
            loadAsync();
          } else {
            throw new Error(response.data.unfollow_user.message);
          }
        }
        setLoading(false);
      } catch (error) {
        Alert.alert("" + error);
        setLoading(false);
      }
    } else {
      Alert.alert("Please Login");
      setLoading(false);
    }
  };

  const _follow = async (id) => {
    setLoading(true);

    if (token || token !== "") {
      try {
        let response = await FollowMutation({
          variables: {
            id: id,
          },
        });

        if (errorFollowMut) {
          throw new Error("Error Input");
        }

        if (response.data) {
          if (
            response.data.follow_user.code === 200 ||
            response.data.follow_user.code === "200"
          ) {
            loadAsync();
          } else {
            throw new Error(response.data.follow_user.message);
          }
        }
        setLoading(false);
      } catch (error) {
        Alert.alert("" + error);
        setLoading(false);
      }
    } else {
      Alert.alert("Please Login");
      setLoading(false);
    }
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      onRefresh();
    });
    return unsubscribe;
  }, [props.navigation]);

  return (
    <ScrollView
      contentContainerStyle={{}}
      showsVerticalScrollIndicator={false}
      stickyHeaderIndices={[4]}
      nestedScrollEnabled
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* <NavigationEvents onDidFocus={() => onRefresh()} /> */}
      <ImageBackground
        source={Akunsaya}
        imageStyle={{
          width: Dimensions.get("screen").width,
          height: 200,
          resizeMode: "cover",
        }}
        style={{
          width: Dimensions.get("screen").width,
          height: 200,
        }}
      ></ImageBackground>
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
            shadowOpacity: 0.5,
            shadowColor: "#d3d3d3",
            elevation: 4,
            alignSelf: "center",
            borderColor: "white",
            borderRadius: 60,
            borderWidth: 3,
            backgroundColor: "#B8E0E5",
            height: 101,
            width: 101,

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
        </View>

        <View
          style={{
            marginTop: 20,
            width: "65%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignContent: "center",
            alignItems: "center",
            // borderWidth: 1,
          }}
        >
          {data &&
          data.user_profilebyid &&
          data.user_profilebyid.status_following === true ? (
            <Button
              style={{
                width: "49%",
              }}
              size="small"
              color={"primary"}
              variant={"bordered"}
              text={t("unfollow")}
              onPress={() => _unfollow(data.user_profilebyid.id)}
            />
          ) : (
            <Button
              style={{
                width: "49%",
              }}
              size="small"
              color={"secondary"}
              variant={"normal"}
              text={t("follow")}
              onPress={() => {
                _follow(data.user_profilebyid.id);
              }}
            />
          )}
          {data && data.user_profilebyid.id ? (
            <Button
              onPress={() => _handlemessage(data.user_profilebyid.id, token)}
              style={{
                width: "49%",
              }}
              size="small"
              color="black"
              variant="bordered"
              text={t("Message")}
            />
          ) : null}
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          width: Dimensions.get("screen").width,
          justifyContent: "space-between",
          paddingHorizontal: 20,
          alignItems: "center",
          alignContent: "center",
          marginTop: 5,
          // borderWidth: 1,
        }}
      >
        {/* <Pressable style={styles.pointButtonView}>
					<PointIcon2 height={17} width={17} />
					<Text type='bold' size='label' style={{}}>
						{count_points} {t('point')}
					</Text>
					<PointGo height={10} width={10} style={{ marginRight: 5 }} />
				</Pressable> */}
        <View style={{ width: "50%" }}>
          <Text type="bold" size="label" style={{ marginRight: 10 }}>
            {`${initfirstname} ` + `${initlastname}`}
          </Text>
          <Text type="regular" size="description">{`@${initusername} `}</Text>
        </View>

        {/* <View style={styles.calendarView}>
					<CalendarIcon height='100%' width='20%'></CalendarIcon>
					<Text type='regular' size='small' style={{}}>
						{t('Joined')}{' '}
						{data && data.user_profilebyid.joined ? data.user_profilebyid.joined : '-'}
					</Text>
				</View> */}

        <View
          style={{
            width: "50%",
            // marginTop: 10,
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "baseline",
            // width: Dimensions.get('window').width,
          }}
        >
          <TouchableOpacity
            style={{
              alignItems: "center",
              alignContent: "center",
            }}
            onPress={() =>
              props.navigation.push("otherFollower", {
                idUser: idUser,
              })
            }
          >
            <Text type="black" size="label">
              {`${data ? data.user_profilebyid.count_follower : 0} `}
            </Text>
            <Text
              type="regular"
              size="description"
              // style={{ color: '#B0B0B0' }}
            >
              {t("followers")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              alignItems: "center",
              alignContent: "center",
            }}
            onPress={() =>
              props.navigation.push("otherFollowing", {
                idUser: idUser,
              })
            }
          >
            <Text type="black" size="label">
              {`${data ? data.user_profilebyid.count_following : 0} `}
            </Text>
            <Text
              type="regular"
              size="description"
              // style={{ color: '#B0B0B0' }}
            >
              {t("following")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          marginTop: 15,
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

      <View style={styles.tabView}>
        <Tabs
          style={{ backgroundColor: "white" }}
          //Start of native-base library use
          renderTabBar={() => (
            <ScrollableTab
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
                data={datapost.user_postbyid}
                datauser={data.user_profilebyid}
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
                data={datareview.user_reviewbyid}
              />
            ) : null}
          </Tab>
          <Tab
            heading={t("trip")}
            tabStyle={{ backgroundColor: "transparent" }}
            activeTabStyle={{ backgroundColor: "transparent" }}
            textStyle={{ fontFamily: "Lato-Bold", color: "#6C6C6C" }}
            activeTextStyle={{ fontFamily: "Lato-Bold", color: "#209FAE" }}
          >
            {datatrip ? (
              <MyTrip
                props={props}
                token={token}
                data={datatrip.user_tripbyid}
                position={"other"}
              />
            ) : null}
          </Tab>
        </Tabs>
      </View>
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
      <Loading show={loadings} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  main: {
    justifyContent: "center",
  },
  tabView: {
    marginTop: 15,
    // flex: 1,
    backgroundColor: "white",
    borderTopWidth: 0.5,
    borderTopColor: "#D1D1D1",
    justifyContent: "center",
    width: Dimensions.get("window").width,
  },
});
