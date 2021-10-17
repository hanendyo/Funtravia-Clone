import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Dimensions,
  Alert,
  Pressable,
  Modal,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Arrowbackwhite,
  LikeRed,
  Send_to,
  More,
  LikeBlack,
  CommentBlack,
  TravelAlbum,
  Xgray,
  Arrowbackios,
} from "../../assets/svg";
// import Modal from "react-native-modal";
import { useIsFocused } from "@react-navigation/native";
import { FlatList } from "react-native-gesture-handler";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";

import {
  Button,
  CopyLink,
  Text,
  CustomImage,
  shareAction,
} from "../../component";
import { Truncate } from "../../component";
import { useTranslation } from "react-i18next";
import likepost from "../../graphQL/Mutation/Post/likepost";
import unlikepost from "../../graphQL/Mutation/Post/unlikepost";
import { gql } from "apollo-boost";
import { TouchableOpacity } from "react-native";
import RenderAlbum from "../Feed/RenderAlbumItinerary";
import RenderSinglePhoto from "../Feed/RenderSinglePhoto";
import ReadMore from "react-native-read-more-text";
import { useScrollToTop } from "@react-navigation/native";
import { RefreshControl } from "react-native";
import User_Post from "../../graphQL/Query/Profile/post";
import UnfollowMut from "../../graphQL/Mutation/Profile/UnfollowMut";
import FollowingQuery from "../../graphQL/Query/Profile/Following";
import FollowMut from "../../graphQL/Mutation/Profile/FollowMut";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { RNToasty } from "react-native-toasty";

const deletepost = gql`
  mutation($post_id: ID!) {
    delete_post(post_id: $post_id) {
      id
      response_time
      message
      code
    }
  }
`;
export default function myfeed(props) {
  const HeaderComponent = {
    headerTransparent: false,
    // title: () => <Text style={{ color: "white" }}>{t("posts")}</Text>,
    headerTintColor: "white",
    headerTitle: () => (
      <Text size="header" type="bold" style={{ color: "white" }}>
        {t("posts")}
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
      fontSize: 14,
      color: "white",
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
    headerLeftContainerStyle: {
      paddingLeft: 10,
    },
    headerRight: () => <View style={{ flexDirection: "row" }}></View>,
    headerRightStyle: {},
  };

  const { t, i18n } = useTranslation();
  const isFocused = useIsFocused();
  const ref = React.useRef(null);
  let [token, setToken] = useState(props?.route?.params?.token);
  let [datauser] = useState(props.route.params.datauser);
  let index = props.route.params.index;
  let [modalmenu, setModalmenu] = useState(false);
  let [modalmenuother, setModalmenuother] = useState(false);
  let [modalhapus, setModalhapus] = useState(false);
  let [users, setuser] = useState(null);
  let [selectedOption, SetOption] = useState({});
  let [play, setPlay] = useState(null);
  let [muted, setMuted] = useState(true);
  let { width, height } = Dimensions.get("screen");
  let [activelike, setactivelike] = useState(true);
  let [setting, setSetting] = useState();
  let [datas, setDatas] = useState(null);

  const loadAsync = async () => {
    await LoadFollowing();
  };

  const {
    data: datapost,
    loading: loadingpost,
    error: errorpost,
    fetchMore,
    refetch,
  } = useQuery(User_Post, {
    fetchPolicy: "network-only",
    variables: {
      user_id: datauser.id,
      limit: 50,
      offset: 0,
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    onCompleted: () => setDatas(datapost?.user_post_paging?.datas),
  });
  let indeks = 0;

  useScrollToTop(ref);
  const onViewRef = React.useRef(({ viewableItems, changed }) => {
    if (viewableItems) {
      setPlay(viewableItems[0]?.key);
    }
  });

  const viewConfigRef = React.useRef({
    viewAreaCoveragePercentThreshold: 50,
  });

  const loadasync = async () => {
    let setsetting = await AsyncStorage.getItem("setting");
    setSetting(JSON.parse(setsetting));
    let tkn = await AsyncStorage.getItem("access_token");
    setToken(tkn);
    let user = await AsyncStorage.getItem("setting");
    user = JSON.parse(user);
    await setuser(user.user);
    await LoadFollowing();
  };

  const [
    Mutationdeletepost,
    { loading: loadingdelete, data: datadelete, error: errordelete },
  ] = useMutation(deletepost, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const _deletepost = async (data) => {
    setModalhapus(false);
    setModalmenu(false);

    if (token || token !== "") {
      try {
        let response = await Mutationdeletepost({
          variables: {
            post_id: data.id,
          },
        });

        if (response.data) {
          if (response.data.delete_post.code === 200) {
            const tempdata = [...datas];
            const index = tempdata.findIndex((k) => k["id"] === data.id);
            const tempdatas = tempdata[index];
            tempdata.splice(index, 1);
            setDatas(tempdata);
          } else {
            throw new Error(response.data.delete_post.message);
          }
        }
      } catch (error) {
        Alert.alert("" + error);
      }
    } else {
      Alert.alert("Please Login");
    }
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    loadasync();
  }, []);

  const [
    MutationLike,
    { loading: loadingLike, data: dataLike, error: errorLike },
  ] = useMutation(likepost, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const [
    MutationunLike,
    { loading: loadingunLike, data: dataunLike, error: errorunLike },
  ] = useMutation(unlikepost, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const _liked = async (id, index) => {
    let tempData = [...datas];
    index = tempData.findIndex((k) => k["id"] === id);
    if (index !== -1) {
      if (activelike) {
        if (token && token !== "" && token !== null) {
          setactivelike(false);
          let tempData = [...datas];
          let tempDatas = { ...tempData[index] };
          tempDatas.liked = true;
          tempDatas.response_count = tempDatas.response_count + 1;
          tempData.splice(index, 1, tempDatas);
          setDatas(tempData);
          try {
            let response = await MutationLike({
              variables: {
                post_id: id,
              },
            });

            if (errorLike) {
              throw new Error("Error");
            }
            if (response.data) {
              if (response.data.like_post.code == 200) {
                setactivelike(true);
              } else {
                throw new Error(response.data.like_post.message);
              }
            }
          } catch (error) {
            setactivelike(true);
            let tempData = [...datas];
            let tempDatas = { ...tempData[index] };
            tempDatas.liked = false;
            tempDatas.response_count = tempDatas.response_count - 1;
            tempData.splice(index, 1, tempDatas);
            setDatas(tempData);
          }
        } else {
          props.navigation.navigate("AuthStack", {
            screen: "LoginScreen",
          });
          RNToasty.Show({
            title: t("pleaselogin"),
            position: "bottom",
          });
        }
      }
    }
  };

  const _unliked = async (id, index) => {
    let tempData = [...datas];
    index = tempData.findIndex((k) => k["id"] === id);
    if (index !== -1) {
      if (activelike) {
        if (token && token !== "" && token !== null) {
          setactivelike(false);
          let tempData = [...datas];
          let tempDatas = { ...tempData[index] };
          tempDatas.liked = false;
          tempDatas.response_count = tempDatas.response_count - 1;
          tempData.splice(index, 1, tempDatas);
          setDatas(tempData);
          try {
            let response = await MutationunLike({
              variables: {
                post_id: id,
              },
            });

            if (errorunLike) {
              throw new Error("Error");
            }

            if (response.data) {
              if (response.data.unlike_post.code == 200) {
                setactivelike(true);
              } else {
                throw new Error(response.data.unlike_post.message);
              }

              // Alert.alert('Succes');
            }
          } catch (error) {
            setactivelike(true);
            let tempData = [...datas];
            let tempDatas = { ...tempData[index] };
            tempDatas.liked = true;
            tempDatas.response_count = tempDatas.response_count + 1;
            tempData.splice(index, 1, tempDatas);
            setDatas(tempData);
          }
        } else {
          props.navigation.navigate("AuthStack", {
            screen: "LoginScreen",
          });
          RNToasty.Show({
            title: t("pleaselogin"),
            position: "bottom",
          });
        }
      }
    }
  };

  const duration = (datetime) => {
    datetime = datetime.replace(" ", "T");
    var date1 = new Date(datetime).getTime();
    var date2 = new Date().getTime();

    var msec = date2 - date1;
    var mins = Math.floor(msec / 60000);
    var hrs = Math.floor(mins / 60);
    var days = Math.floor(hrs / 24);
    var yrs = Math.floor(days / 365);
    mins = mins % 60;
    hrs = hrs % 24;
    if (yrs > 0) {
      return yrs + " " + t("yearsAgo");
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

  const countKoment = (id) => {
    const tempd = [...datas];
    const index = tempd.findIndex((k) => k["id"] === id);
    tempd[index].comment_count = tempd[index].comment_count + 1;
  };

  const viewcomment = (data, index, time) => {
    props.navigation.navigate("FeedStack", {
      screen: "CommentPost",
      params: {
        data: data,
        token: token,
        ref: ref,
        _liked: (e) => _liked(e),
        _unliked: (e) => _unliked(e),
        indeks: index,
        countKoment: (e) => countKoment(e),
        time: time,
      },
    });
  };

  const OptionOpen = (data) => {
    // data.user = { ...datauser };
    SetOption(data);
    if (datauser.id == users?.id) {
      setModalmenu(true);
    } else {
      setModalmenuother(true);
    }
  };

  const ReadMorehendle = (handlePress) => {
    return (
      <Text
        onPress={handlePress}
        type="normal"
        style={{
          color: "#209fae",
          marginTop: 5,
        }}
      >
        Read More
      </Text>
    );
  };

  const ReadLesshendle = (handlePress) => {
    return <View />;
  };

  const [refreshing, setRefreshing] = useState(false);
  const Refresh = React.useCallback(() => {
    setRefreshing(true);
    refetch();
    wait(1000).then(() => {
      setRefreshing(false);
    });
  }, []);
  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  const onUpdate = (prev, { fetchMoreResult }) => {
    if (
      prev.user_post_paging.datas.length <
      fetchMoreResult.user_post_paging.page_info.offset
    ) {
      if (!fetchMoreResult) return prev;
      const { page_info } = fetchMoreResult.user_post_paging;
      const datas = [
        ...prev.user_post_paging.datas,
        ...fetchMoreResult.user_post_paging.datas,
      ];

      return Object.assign({}, prev, {
        user_post_paging: {
          __typename: prev.user_post_paging.__typename,
          page_info,
          datas,
        },
      });
    }
  };

  const handleOnEndReached = () => {
    if (datapost?.user_post_paging?.page_info?.hasNextPage) {
      return fetchMore({
        variables: {
          limit: 50,
          offset: datapost?.user_post_paging?.page_info?.offset,
        },
        updateQuery: onUpdate,
      });
    }
  };

  const [datasFollow, setDatasFollow] = useState();

  const [LoadFollowing, { data: dataFollow, loading, error }] = useLazyQuery(
    FollowingQuery,
    {
      fetchPolicy: "network-only",
      context: {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
      onCompleted: () => {
        setDatasFollow(dataFollow.user_following);
      },
    }
  );

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

  const _unfollow = async (id, status) => {
    setModalmenuother(false);

    if (token || token !== "") {
      try {
        let response = await UnfollowMutation({
          variables: {
            id: id,
          },
        });
        if (loadUnfolMut) {
          Alert.alert("Loading!!");
        }
        if (errorUnfolMut) {
          throw new Error("Error Input");
        }

        if (response.data) {
          if (
            response.data.unfollow_user.code === 200 ||
            response.data.unfollow_user.code === "200"
          ) {
            LoadFollowing();
          } else {
            throw new Error(response.data.unfollow_user.message);
          }
        }
      } catch (error) {
        Alert.alert("" + error);
      }
    } else {
      // Alert.alert("Please Login");
      Toast.show({
        text: "Please Login",
        position: "bottom",
        buttonText: "Ok",
        duration: 3000,
      });
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

  const _follow = async (id, status) => {
    setModalmenuother(false);
    if (token || token !== "") {
      try {
        let response = await FollowMutation({
          variables: {
            id: id,
          },
        });
        if (loadFollowMut) {
          Alert.alert("Loading!!");
        }
        if (errorFollowMut) {
          throw new Error("Error Input");
        }
        if (response.data) {
          if (
            response.data.follow_user.code === 200 ||
            response.data.follow_user.code === "200"
          ) {
            LoadFollowing();
          } else {
            throw new Error(response.data.follow_user.message);
          }
        }
      } catch (error) {
        Alert.alert("" + error);
      }
    } else {
      // Alert.alert("Please Login");
      Toast.show({
        text: "Please Login",
        position: "bottom",
        buttonText: "Ok",
        duration: 3000,
      });
    }
  };

  if (loadingpost) {
    return (
      <SkeletonPlaceholder
        speed={1000}
        // highlightColor="d1d1d1"
        // backgroundColor="red"
      >
        <View
          style={{
            padding: 10,
            marginHorizontal: 15,
            marginVertical: 5,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: "#f6f6f6",
            paddingBottom: 20,
          }}
        >
          <View
            style={{
              // height: 200,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <SkeletonPlaceholder.Item
                width={40}
                height={40}
                borderRadius={20}
              />
              <View
                style={{
                  marginLeft: 20,
                }}
              >
                <SkeletonPlaceholder.Item
                  width={120}
                  height={15}
                  borderRadius={5}
                />
                <SkeletonPlaceholder.Item
                  marginTop={6}
                  width={80}
                  height={15}
                  borderRadius={5}
                />
              </View>
            </View>
            <SkeletonPlaceholder.Item width={30} height={15} borderRadius={5} />
          </View>

          <SkeletonPlaceholder.Item
            marginVertical={15}
            height={Dimensions.get("window").width - 50}
            borderRadius={15}
          ></SkeletonPlaceholder.Item>

          <SkeletonPlaceholder.Item
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            marginVertical={10}
            // marginHorizontal={15}
          >
            <SkeletonPlaceholder.Item flexDirection="row">
              <SkeletonPlaceholder.Item
                width={50}
                height={25}
                borderRadius={20}
              />
              <SkeletonPlaceholder.Item
                width={50}
                height={25}
                borderRadius={20}
                marginLeft={20}
              />
            </SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item
              width={50}
              height={25}
              borderRadius={20}
            />
          </SkeletonPlaceholder.Item>
          <SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item
              // width={Dimensions.get("window").width - 30}
              height={15}
              borderRadius={4}
            />
            <SkeletonPlaceholder.Item
              // width={Dimensions.get("window").width - 30}
              height={15}
              borderRadius={4}
              marginTop={6}
            />
            <SkeletonPlaceholder.Item
              marginTop={6}
              width={80}
              height={15}
              borderRadius={4}
            />
          </SkeletonPlaceholder.Item>
        </View>
      </SkeletonPlaceholder>
    );
  }

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <FlatList
        ref={ref}
        data={datas}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
        style={
          {
            // paddingVertical: 7,
          }
        }
        // initialNumToRender={7}
        keyExtractor={(item) => item.id}
        // extraData={liked}
        refreshing={refreshing}
        showsVerticalScrollIndicator={false}
        initialScrollIndex={indeks}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => Refresh()} />
        }
        // ListFooterComponent={
        //   //   loadingPost ? (
        //   <View
        //     style={{
        //       // position: 'absolute',
        //       // bottom:0,
        //       width: width,
        //       justifyContent: "center",
        //       alignItems: "center",
        //       marginBottom: 30,
        //     }}
        //   >
        //     <ActivityIndicator animating={true} size="large" color="#209fae" />
        //   </View>
        //   //   ) : null
        // }
        // initialNumToRender={1}
        onEndReachedThreshold={1}
        onEndReached={handleOnEndReached}
        onEndThreshold={3000}
        renderItem={({ item, index }) => (
          <View
            style={{
              width: Dimensions.get("window").width - 20,
              backgroundColor: "#FFFFFF",
              // flex: 1,
              marginHorizontal: 10,
              marginVertical: 5,
              marginTop: 15,
              borderRadius: 20,
              borderBottomWidth: 1,
              borderBottomColor: "#EEEEEE",
              paddingBottom: 12,
            }}
          >
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                marginVertical: 15,
                // justifyContent: 'space-evenly',
                alignContent: "center",
              }}
            >
              <CustomImage
                isTouchable
                onPress={() => {
                  datauser.id !== users?.id
                    ? props.navigation.push("ProfileStack", {
                        screen: "otherprofile",
                        params: {
                          idUser: datauser.id,
                        },
                      })
                    : props.navigation.push("ProfileStack", {
                        screen: "ProfileTab",
                        params: {
                          token: token,
                        },
                      });
                }}
                customStyle={{
                  height: 40,
                  width: 40,
                  borderRadius: 15,
                  alignSelf: "center",
                  marginLeft: 15,
                }}
                customImageStyle={{
                  resizeMode: "cover",
                  borderRadius: 50,
                }}
                source={{ uri: datauser.picture }}
              />
              <View
                style={{
                  justifyContent: "center",
                  marginHorizontal: 10,
                }}
              >
                <Text
                  onPress={() => {
                    datauser.id !== users?.id
                      ? props.navigation.push("ProfileStack", {
                          screen: "otherprofile",
                          params: {
                            idUser: datauser.id,
                          },
                        })
                      : props.navigation.push("ProfileStack", {
                          screen: "ProfileTab",
                          params: {
                            token: token,
                          },
                        });
                  }}
                  size="title"
                  style={{}}
                >
                  {datauser.first_name}{" "}
                  {datauser.first_name ? datauser.last_name : null}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text
                    size="small"
                    style={{
                      fontFamily: "Lato-Regular",
                      // marginTop: 7,
                    }}
                  >
                    {duration(item.created_at)}
                  </Text>
                  {item.location_name ? (
                    <View
                      style={{
                        marginHorizontal: 5,
                        backgroundColor: "black",
                        height: 4,
                        width: 4,
                        borderRadius: 2,
                      }}
                    ></View>
                  ) : null}
                  {item.location_name ? (
                    <Text
                      size="small"
                      style={{
                        fontFamily: "Lato-Regular",
                        // marginTop: 7,
                      }}
                    >
                      <Truncate text={item.location_name} length={40} />
                    </Text>
                  ) : null}
                </View>
              </View>
              <TouchableOpacity
                onPress={() => OptionOpen(item)}
                style={{
                  position: "absolute",
                  right: 15,
                  top: 2,
                  alignSelf: "center",
                }}
              >
                <More height={20} width={20} />
              </TouchableOpacity>
            </View>
            <View
              style={{
                marginHorizontal: 10,
                alignContent: "center",
                justifyContent: "center",
                // alignItems: "center",
                width: Dimensions.get("window").width - 40,
                // height: Dimensions.get("window").width - 40,
                // minHeight: Dimensions.get("window").width - 155,
                // borderWidth: 0.5,
                borderColor: "#EEEEEE",
                borderRadius: 15,
              }}
            >
              {item.is_single == false && item.itinerary !== null ? (
                <RenderAlbum data={item} props={props} />
              ) : (
                <RenderSinglePhoto
                  data={item}
                  props={props}
                  play={play}
                  muted={muted}
                  setMuted={(e) => setMuted(e)}
                  isFocused={isFocused}
                />
              )}
            </View>

            <View
              style={{
                width: "100%",
                backgroundColor: "white",
                marginTop: 17,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: "white",
                  justifyContent: "space-between",
                  paddingHorizontal: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    width: "50%",
                    alignSelf: "flex-start",
                    alignContent: "space-between",
                    alignItems: "center",
                    // justifyContent: 'space-evenly',
                  }}
                >
                  {item.liked ? (
                    <Button
                      onPress={() => _unliked(item.id, index)}
                      type="icon"
                      // variant="transparent"
                      position="left"
                      size="small"
                      style={{
                        paddingHorizontal: 10,
                        marginRight: 15,
                        borderRadius: 16,
                        backgroundColor: "#F2DAE5",
                        // minidth: 70,
                        // right: 10,
                      }}
                    >
                      <LikeRed height={15} width={15} />
                      <Text
                        type="black"
                        size="label"
                        style={{
                          marginHorizontal: 5,
                          color: "#BE3737",
                        }}
                      >
                        {item.response_count}
                      </Text>
                    </Button>
                  ) : (
                    <Button
                      onPress={() => _liked(item.id, index)}
                      type="icon"
                      position="left"
                      size="small"
                      color="tertiary"
                      style={{
                        paddingHorizontal: 10,
                        marginRight: 15,
                        borderRadius: 16,
                        // right: 10,
                      }}
                    >
                      <LikeBlack height={15} width={15} />
                      <Text
                        type="black"
                        size="label"
                        style={{ marginHorizontal: 7 }}
                      >
                        {item.response_count}
                      </Text>
                    </Button>
                  )}

                  <Button
                    onPress={() =>
                      viewcomment(item, index, duration(item.created_at))
                    }
                    type="icon"
                    variant="transparent"
                    position="left"
                    size="small"
                    style={{
                      paddingHorizontal: 2,

                      // right: 10,
                    }}
                  >
                    <CommentBlack height={15} width={15} />
                    <Text
                      type="black"
                      size="label"
                      style={{ marginHorizontal: 7 }}
                    >
                      {item.comment_count}
                    </Text>
                  </Button>
                </View>

                <Button
                  onPress={() =>
                    props.navigation.push("FeedStack", {
                      screen: "SendPost",
                      params: {
                        post: item,
                      },
                    })
                  }
                  type="icon"
                  variant="transparent"
                  position="left"
                  size="small"
                  style={{
                    right: 10,
                    paddingHorizontal: 2,
                  }}
                >
                  <Send_to height={17} width={17} />
                  <Text size="description" style={{ marginLeft: 3 }}>
                    {t("send_to")}
                  </Text>
                </Button>
              </View>
              <View
                style={{
                  width: "100%",
                  padding: 10,
                  flexDirection: "row",
                }}
                More
              >
                {item.is_single == false && item.itinerary !== null ? (
                  <View>
                    <Pressable
                      onPress={() => goToItinerary(item)}
                      style={{
                        flexDirection: "row",
                        marginBottom: 10,
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: "#209fae",
                          height: 23,
                          width: 7,
                          borderRadius: 4,
                          marginRight: 10,
                          marginLeft: 2,
                        }}
                      />
                      <Text type="bold" size="title">
                        {item.itinerary.name}
                      </Text>
                    </Pressable>
                    {item.caption ? (
                      <ReadMore
                        numberOfLines={3}
                        renderTruncatedFooter={ReadMorehendle}
                        renderRevealedFooter={ReadLesshendle}
                        // onReady={this._handleTextReady}
                      >
                        <Text
                          size="label"
                          style={{
                            textAlign: "left",
                            lineHeight: 20,
                          }}
                        >
                          {item.caption}
                        </Text>
                      </ReadMore>
                    ) : null}
                  </View>
                ) : item.caption ? (
                  <ReadMore
                    numberOfLines={3}
                    renderTruncatedFooter={ReadMorehendle}
                    renderRevealedFooter={ReadLesshendle}
                    // onReady={this._handleTextReady}
                  >
                    <Text
                      size="label"
                      style={{
                        textAlign: "left",
                        lineHeight: 20,
                      }}
                    >
                      <Text
                        type="bold"
                        size="label"
                        style={{
                          marginRight: 5,
                        }}
                      >
                        {datauser.first_name}{" "}
                        {datauser.first_name ? datauser.last_name : null}{" "}
                      </Text>
                      {item.caption}
                    </Text>
                  </ReadMore>
                ) : null}
              </View>
            </View>
          </View>

          // <Item item={item} selected={selected} index={index} />
        )}
      />

      <Modal
        useNativeDriver={true}
        visible={modalmenu}
        onRequestClose={() => setModalmenu(false)}
        transparent={true}
        animationType="fade"
      >
        <Pressable
          onPress={() => setModalmenu(false)}
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
                height: 50,
                justifyContent: "center",
              }}
            >
              <Text size="title" type="bold">
                {t("option")}
              </Text>
            </View>
            <Pressable
              onPress={() => setModalmenu(false)}
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
            <TouchableOpacity
              style={{
                alignItems: "center",
                borderBottomWidth: 1,
                height: 50,
                borderColor: "#d1d1d1",
              }}
              onPress={() => {
                setModalmenu(false);
                shareAction({
                  from: "feed",
                  target: selectedOption.id,
                });
              }}
            >
              <Text size="label" type="regular" style={{ marginVertical: 15 }}>
                {t("shareTo")}...
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                alignItems: "center",
                borderBottomWidth: 1,
                height: 50,
                borderColor: "#d1d1d1",
              }}
              onPress={() => {
                setModalmenu(false);
                CopyLink({
                  from: "feed",
                  target: selectedOption.id,
                });
              }}
            >
              <Text size="label" type="regular" style={{ marginVertical: 15 }}>
                {t("copyLink")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                alignItems: "center",
                borderBottomWidth: 1,
                borderColor: "#d1d1d1",
              }}
              onPress={() => {
                setModalmenu(false),
                  props.navigation.push("FeedStack", {
                    screen: "EditPost",
                    params: {
                      datapost: selectedOption,
                      time: duration(selectedOption?.created_at),
                    },
                  });
              }}
            >
              <Text size="label" type="regular" style={{ marginVertical: 15 }}>
                {t("edit")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                alignItems: "center",
                borderBottomWidth: 1,
                borderColor: "#d1d1d1",
              }}
              onPress={() => {
                setModalmenu(false),
                  token
                    ? props.navigation.push("FeedStack", {
                        screen: "CreateListAlbum",
                        params: {
                          user_id: setting?.user_id,
                          token: isPunctuatorToken,
                          file: "",
                          type: "",
                          location: "",
                          isAlbum: true,
                          post_id: selectedOption?.id,
                        },
                      })
                    : setModalLogin(true);
              }}
            >
              <Text size="label" type="regular" style={{ marginVertical: 15 }}>
                {t("TagAlbum")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                alignItems: "center",
              }}
              onPress={() => {
                setModalhapus(true);
                setModalmenu(false);
              }}
            >
              <Text
                size="label"
                type="regular"
                style={{
                  color: "#d75995",
                  marginTop: 15,
                  marginBottom: 18,
                }}
              >
                {t("delete")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        useNativeDriver={true}
        visible={modalmenuother}
        onRequestClose={() => setModalmenuother(false)}
        transparent={true}
        animationType="fade"
      >
        <Pressable
          onPress={() => setModalmenuother(false)}
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
            alignContent: "center",
            borderRadius: 5,
            marginTop: Dimensions.get("screen").height / 3,
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              width: Dimensions.get("screen").width - 100,
              // paddingHorizontal: 20,
              borderRadius: 5,
            }}
          >
            <View
              style={{
                borderBottomWidth: 1,
                borderColor: "#d1d1d1",
                backgroundColor: "#f6f6f6",
                alignItems: "center",
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
              }}
            >
              <Text style={{ marginVertical: 15 }} size="title" type="bold">
                {t("option")}
              </Text>
            </View>
            <Pressable
              onPress={() => setModalmenuother(false)}
              style={{
                position: "absolute",
                right: 0,
                width: 55,
                justifyContent: "center",
                alignItems: "center",
                height: 55,
              }}
            >
              <Xgray width={15} height={15} />
            </Pressable>
            <TouchableOpacity
              style={{
                alignItems: "center",
                borderBottomColor: "#d1d1d1",
                borderBottomWidth: 1,
              }}
              onPress={() =>
                shareAction({
                  from: "feed",
                  target: selectedOption.id,
                })
              }
            >
              <Text size="label" type="regular" style={{ marginVertical: 15 }}>
                {t("shareTo")}...
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                alignItems: "center",
                borderBottomColor: "#d1d1d1",
                borderBottomWidth: 1,
              }}
              onPress={() => {
                setModalmenuother(false);
                CopyLink({
                  from: "feed",
                  target: selectedOption.id,
                });
              }}
            >
              <Text size="label" type="regular" style={{ marginVertical: 15 }}>
                {t("copyLink")}
              </Text>
            </TouchableOpacity>
            {datasFollow &&
            selectedOption &&
            selectedOption.user &&
            datasFollow.findIndex((k) => k["id"] == selectedOption?.user?.id) ==
              -1 ? (
              <TouchableOpacity
                style={{
                  alignItems: "center",
                  borderBottomColor: "#d1d1d1",
                  borderBottomWidth: 1,
                }}
                onPress={() => _follow(selectedOption.user.id)}
              >
                <Text
                  size="label"
                  type="regular"
                  style={{ marginTop: 15, marginBottom: 20 }}
                >
                  {t("follow")}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{
                  alignItems: "center",
                  borderBottomRightRadius: 5,
                  borderBottomLeftRadius: 5,
                }}
                onPress={() => _unfollow(selectedOption.user.id)}
              >
                <Text
                  size="label"
                  type="regular"
                  style={{ marginTop: 15, marginBottom: 18 }}
                >
                  {t("unfollow")}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>

      {/* Modal Hapus */}
      <Modal
        useNativeDriver={true}
        visible={modalhapus}
        onRequestClose={() => setModalhapus(false)}
        transparent={true}
        animationType="fade"
      >
        <Pressable
          onPress={() => setModalhapus(false)}
          style={{
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
            justifyContent: "center",
            opacity: 0.7,
            backgroundColor: "#000",
            position: "absolute",
          }}
        />
        <View
          style={{
            width: Dimensions.get("screen").width - 140,
            marginHorizontal: 70,
            backgroundColor: "#FFF",
            zIndex: 15,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            alignContent: "center",
            borderRadius: 5,
            marginTop: Dimensions.get("screen").height / 3,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              width: Dimensions.get("screen").width - 140,
              justifyContent: "center",
              borderRadius: 5,
            }}
          >
            <View
              style={{
                alignItems: "center",
                borderBottomColor: "#d1d1d1",
                borderBottomWidth: 1,
                borderTopRightRadius: 5,
                borderTopLeftRadius: 5,
                backgroundColor: "#f6f6f6",
              }}
            >
              <Text style={{ marginVertical: 15 }} size="title" type="bold">
                {t("delete_posting")}
              </Text>
            </View>
            <Text
              style={{
                alignSelf: "center",
                textAlign: "center",
                marginTop: 20,
                marginHorizontal: 10,
              }}
              size="label"
              type="regular"
            >
              {t("alertHapusPost")}
            </Text>
            <View style={{ marginTop: 20, marginHorizontal: 10 }}>
              <Button
                onPress={() => {
                  _deletepost(selectedOption);
                }}
                color="secondary"
                text={t("delete")}
              ></Button>
              <Button
                onPress={() => {
                  setModalhapus(false);
                  setModalmenu(true);
                }}
                style={{ marginTop: 5, marginBottom: 8 }}
                variant="transparent"
                text={t("cancel")}
              ></Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
