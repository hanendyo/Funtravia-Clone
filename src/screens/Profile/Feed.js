import React, { useState, useCallback, useEffect } from "react";
import { View, Dimensions, Alert, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Arrowbackwhite,
  LikeRed,
  ShareBlack,
  More,
  LikeBlack,
  CommentBlack,
} from "../../assets/svg";
import Modal from "react-native-modal";
import { useIsFocused } from "@react-navigation/native";
import { FlatList } from "react-native-gesture-handler";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";

import { Button, CopyLink, Text } from "../../component";
import { Truncate } from "../../component";
import { useTranslation } from "react-i18next";
import likepost from "../../graphQL/Mutation/Post/likepost";
import unlikepost from "../../graphQL/Mutation/Post/unlikepost";
import { CustomImage, shareAction } from "../../component";
import { gql } from "apollo-boost";
import { TouchableOpacity } from "react-native";
import RenderAlbum from "../Feed/RenderAlbumItinerary";
import RenderSinglePhoto from "../Feed/RenderSinglePhoto";
import ReadMore from "react-native-read-more-text";
import { useScrollToTop } from "@react-navigation/native";
import { RefreshControl } from "react-native";
import { ActivityIndicator } from "react-native";
import User_Post from "../../graphQL/Query/Profile/post";
import UnfollowMut from "../../graphQL/Mutation/Profile/UnfollowMut";
import FollowingQuery from "../../graphQL/Query/Profile/Following";
import FollowMut from "../../graphQL/Mutation/Profile/FollowMut";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

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
    title: () => <Text style={{ color: "white" }}>{t("posts")}</Text>,
    headerTintColor: "white",
    headerTitle: () => <Text style={{ color: "white" }}>{t("posts")}</Text>,
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
        <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
      </Button>
    ),
    headerLeftContainerStyle: {
      paddingLeft: 10,
    },
    headerRight: () => <View style={{ flexDirection: "row" }}></View>,
    headerRightStyle: {},
  };

  const { t, i18n } = useTranslation();
  let token = props.route.params.token;
  let [datauser] = useState(props.route.params.datauser);
  let data = [];
  let index = props.route.params.index;
  let [modalmenu, setModalmenu] = useState(false);
  let [modalmenuother, setModalmenuother] = useState(false);
  let [modalhapus, setModalhapus] = useState(false);
  let [users, setuser] = useState(null);
  let [selectedOption, SetOption] = useState({});
  let [play, setPlay] = useState(null);
  let [muted, setMuted] = useState(true);
  const isFocused = useIsFocused();
  const ref = React.useRef(null);
  let { width, height } = Dimensions.get("screen");

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
  });
  let indeks = 0;

  {
    datapost?.user_post_paging?.datas
      ? ((data = datapost?.user_post_paging?.datas),
        props?.route?.params?.post_id
          ? (indeks = datapost?.user_post_paging?.datas.findIndex(
              (k) => k.id === props?.route?.params?.post_id
            ))
          : null)
      : null;
  }

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

  const _deletepost = async (datas) => {
    setModalhapus(false);
    setModalmenu(false);

    if (token || token !== "") {
      try {
        let response = await Mutationdeletepost({
          variables: {
            post_id: datas.id,
          },
        });

        if (response.data) {
          if (
            response.data.delete_post.code === 200 ||
            response.data.delete_post.code === "200"
          ) {
            var index = data.findIndex((k) => k["id"] === datas.id);
            if (index > -1) {
              data.splice(index, 1);
            }
            // setdata(tempData);
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

  const _liked = async (id, index, item) => {
    // let tempDatas = [...data];
    let items = { ...item };
    let indexs = data.findIndex((k) => k["id"] === id);
    items.liked = true;
    items.response_count = items.response_count + 1;
    data.splice(indexs, 1, items);

    // console.log(id);
    if (token || token !== "") {
      try {
        let response = await MutationLike({
          variables: {
            post_id: id,
          },
        });
        // console.log(response);
        if (loadingLike) {
          Alert.alert("Loading!!");
        }
        if (errorLike) {
          throw new Error("Error Input");
        }
        if (response.data) {
          if (
            response.data.like_post.code === 200 ||
            response.data.like_post.code === "200"
          ) {
            // _Refresh();
          } else {
            throw new Error(response.data.like_post.message);
          }

          // Alert.alert('Succes');
        }
      } catch (error) {
        items.liked = false;
        items.response_count = items.response_count + 1;
        data.splice(indexs, 1, items);
        // console.log(error);
        Alert.alert("" + error);
      }
    } else {
      Alert.alert("Please Login");
    }
  };

  const _unliked = async (id, index, item) => {
    let items = { ...item };
    let indexs = data.findIndex((k) => k["id"] === id);
    items.liked = false;
    items.response_count = items.response_count + 1;
    data.splice(indexs, 1, items);
    if (token || token !== "") {
      try {
        let response = await MutationunLike({
          variables: {
            post_id: id,
          },
        });
        if (loadingunLike) {
          Alert.alert("Loading!!");
        }
        if (errorunLike) {
          throw new Error("Error Input");
        }

        // console.log(response);
        if (response.data) {
          if (
            response.data.unlike_post.code === 200 ||
            response.data.unlike_post.code === "200"
          ) {
            // _Refresh();
          } else {
            throw new Error(response.data.unlike_post.message);
          }

          // Alert.alert('Succes');
        }
      } catch (error) {
        Alert.alert("" + error);
      }
    } else {
      let items = { ...item };
      let indexs = data.findIndex((k) => k["id"] === id);
      items.liked = true;
      items.response_count = items.response_count + 1;
      data.splice(indexs, 1, items);
      Alert.alert("Please Login");
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

  const viewcomment = (data) => {
    props.navigation.push("FeedStack", {
      screen: "CommentPost",
      params: {
        post_id: data.id,
        //   comment_id: data.comment_feed.id,
      },
    });
  };

  const [selected, setSelected] = useState(new Map());

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
        type="bold"
        style={{
          color: "#209fae",
        }}
      >
        Read More
      </Text>
    );
  };

  const ReadLesshendle = (handlePress) => {
    return (
      <Text
        onPress={handlePress}
        type="bold"
        style={{
          color: "#209fae",
        }}
      >
        Read Less
      </Text>
    );
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
    // console.log(
    //   "masuk",
    //   prev.user_post_paging.datas.length,
    //   fetchMoreResult.user_post_paging.page_info.offset
    // );
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
    // console.log("test");
    // console.log(datapost?.user_post_paging?.page_info?.hasNextPage);
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
        data={data}
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
              borderRadius: 20,
              borderBottomWidth: 1,
              borderBottomColor: "#EEEEEE",
              paddingBottom: 25,
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
                  size="description"
                  style={{
                    fontFamily: "Lato-Bold",
                    // marginTop: 7,
                  }}
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
                minHeight: Dimensions.get("window").width - 155,
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
                      onPress={() => _unliked(item.id, index, item)}
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
                      onPress={() => _liked(item.id, index, item)}
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
                    onPress={() => viewcomment(item)}
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
                    shareAction({
                      from: "feed",
                      target: item.id,
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
                  <ShareBlack height={17} width={17} />
                  {/* <Text size="small" style={{ marginLeft: 3 }}>
                                    {t("share")}
                                </Text> */}
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
        onBackdropPress={() => {
          setModalmenu(false);
        }}
        onRequestClose={() => setModalmenu(false)}
        // onDismiss={() => setModalmenu(false)}
        animationIn="fadeInDown"
        animationOut="fadeInDown"
        isVisible={modalmenu}
        style={{
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
          alignContent: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            width: Dimensions.get("screen").width - 80,
            padding: 20,
          }}
        >
          <TouchableOpacity
            style={{
              paddingVertical: 10,
            }}
            onPress={() => {
              setModalmenu(false);
              shareAction({
                from: "feed",
                target: selectedOption.id,
              });
            }}
          >
            <Text size="description" type="regular" style={{}}>
              {t("shareTo")}...
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              paddingVertical: 10,
            }}
            onPress={() => {
              setModalmenu(false);
              CopyLink({
                from: "feed",
                target: selectedOption.id,
              });
            }}
          >
            <Text size="description" type="regular" style={{}}>
              {t("copyLink")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              paddingVertical: 10,
            }}
            onPress={() => {
              setModalmenu(false),
                props.navigation.push("FeedStack", {
                  screen: "EditPost",
                  params: {
                    datapost: selectedOption,
                  },
                });
            }}
          >
            <Text size="description" type="regular" style={{}}>
              {t("edit")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              paddingVertical: 10,
            }}
            onPress={() => {
              setModalhapus(true);
            }}
          >
            <Text
              size="description"
              type="regular"
              style={{ color: "#d75995" }}
            >
              {t("delete")}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        onBackdropPress={() => {
          setModalmenuother(false);
        }}
        onRequestClose={() => setModalmenuother(false)}
        onDismiss={() => setModalmenuother(false)}
        animationIn="fadeIn"
        animationOut="fadeOut"
        isVisible={modalmenuother}
        style={{
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
          alignContent: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            width: Dimensions.get("screen").width - 80,
            padding: 20,
          }}
        >
          {/* <TouchableOpacity
        style={{
          paddingVertical: 10,
        }}
        onPress={() => {
          setModalmenuother(false);
        }}
      >
        <Text
          size="description"
          type="regular"
          style={{ color: "#d75995" }}
        >
          {t("reportThisPost")}
        </Text>
      </TouchableOpacity> */}
          {/* <TouchableOpacity
        style={{
          paddingVertical: 10,
        }}
        onPress={() => {
          setModalmenuother(false);
        }}
      >
        <Text size="description" type="regular" style={{}}>
          {t("blockUser")}
        </Text>
      </TouchableOpacity> */}
          <TouchableOpacity
            style={{
              paddingVertical: 10,
            }}
            onPress={() =>
              shareAction({
                from: "feed",
                target: selectedOption.id,
              })
            }
          >
            <Text size="description" type="regular" style={{}}>
              {t("shareTo")}...
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              paddingVertical: 10,
            }}
            onPress={() => {
              setModalmenuother(false);
              CopyLink({
                from: "feed",
                target: selectedOption.id,
              });
            }}
          >
            <Text size="description" type="regular" style={{}}>
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
                paddingVertical: 10,
              }}
              onPress={() => _follow(selectedOption.user.id)}
            >
              <Text size="description" type="regular" style={{}}>
                {t("follow")}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{
                paddingVertical: 10,
              }}
              onPress={() => _unfollow(selectedOption.user.id)}
            >
              <Text size="description" type="regular" style={{}}>
                {t("unfollow")}
              </Text>
            </TouchableOpacity>
          )}
          {/* <TouchableOpacity
            style={{
              paddingVertical: 10,
            }}
            onPress={() => {
              setModalmenuother(false);
            }}
          >
            <Text size="description" type="regular" style={{}}>
              {t("hidePost")}
            </Text>
          </TouchableOpacity> */}
        </View>
      </Modal>

      <Modal
        onBackdropPress={() => {
          setModalhapus(false);
        }}
        onRequestClose={() => setModalhapus(false)}
        onDismiss={() => setModalhapus(false)}
        animationIn="fadeIn"
        animationOut="fadeOut"
        isVisible={modalhapus}
        style={{
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
          alignContent: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            width: Dimensions.get("screen").width - 60,
            padding: 20,
          }}
        >
          <Text>{t("alertHapusPost")}</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingVertical: 20,
              paddingHorizontal: 40,
            }}
          >
            <Button
              onPress={() => {
                _deletepost(selectedOption);
              }}
              color="primary"
              text={t("delete")}
            ></Button>
            <Button
              onPress={() => {
                setModalhapus(false);
              }}
              color="secondary"
              variant="bordered"
              text={t("cancel")}
            ></Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}
