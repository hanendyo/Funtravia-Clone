import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  View,
  Dimensions,
  Alert,
  Pressable,
  Modal,
  Platform,
  BackHandler,
  ActivityIndicator,
  StatusBar,
  SafeAreaView,
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
import RemoveAlbums from "../../graphQL/Mutation/Album/RemoveAlbum";
import { useSelector } from "react-redux";
import PostCursorBased from "../../graphQL/Query/Profile/postCursorBased";
import Ripple from "react-native-material-ripple";
import ViewMoreText from "react-native-view-more-text";

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
  const from = props?.route?.params?.from;
  const { t, i18n } = useTranslation();
  const tokenApps = useSelector((data) => data.token);
  const setting = useSelector((data) => data.setting);
  let [indekScrollto, setIndeksScrollto] = useState(0);
  const HeaderComponent = {
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: (
      <Text size="header" type="bold" style={{ color: "white" }}>
        {t("posts")}
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

  const backAction = () => {
    props.navigation.goBack();
    return true;
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    BackHandler.addEventListener("hardwareBackPress", backAction);
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, [backAction]);

  useEffect(() => {
    props.navigation.addListener("blur", () => {
      BackHandler.removeEventListener("hardwareBackPress", backAction);
    });
  }, [backAction]);

  const isFocused = useIsFocused();
  const ref = useRef(null);
  let datauser = props?.route?.params?.datauser;
  let index = props?.route?.params?.index;
  let [modalmenu, setModalmenu] = useState(false);
  let [modalmenuother, setModalmenuother] = useState(false);
  let [modalhapus, setModalhapus] = useState(false);
  let [users, setuser] = useState(setting.user);
  let [selectedOption, SetOption] = useState({});
  let [play, setPlay] = useState(null);
  let [muted, setMuted] = useState(true);
  let [activelike, setactivelike] = useState(true);
  // let [setting, setSetting] = useState();
  let [datas, setDatas] = useState(
    props?.route?.params?.data_post
      ? props?.route?.params?.data_post
      : props?.route?.params?.dataPost
  );
  let [showLoading, setShowLoading] = useState(false);

  const Scroll_to = async (index) => {
    index = index ? index : indekScrollto;
    setTimeout(() => {
      if (ref && ref?.current) {
        ref?.current?.scrollToIndex({
          animation: false,
          index: index,
        });
      }
    }, 200);
  };
  // refetch feed
  const {
    loading: loadingFeed,
    data: dataFeed,
    error: errorFeed,
    fetchMore,
    refetch: refetchFeed,
    networkStatus: networkStatusFeed,
  } = useQuery(PostCursorBased, {
    variables: {
      user_id: datauser?.id,
      first: indekScrollto ? indekScrollto + 1 : 20,
      after: "",
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenApps,
      },
    },
    options: {
      fetchPolicy: "network-only",
      errorPolicy: "ignore",
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      if (dataFeed) {
        setDatas(dataFeed?.user_post_cursor_based?.edges);
      }
    },
  });

  const onViewRef = React.useRef(({ viewableItems, changed }) => {
    if (viewableItems) {
      setPlay(viewableItems[0]?.key);
    }
  });

  const viewConfigRef = React.useRef({
    viewAreaCoveragePercentThreshold: 50,
  });

  const [
    AlbumMutation,
    { loading: loadAlbum, data: dataAlbum, error: errorAlbum },
  ] = useMutation(RemoveAlbums, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenApps,
      },
    },
  });

  const loadasync = () => {
    LoadFollowing();
    // refetchFeed();
  };

  const [
    Mutationdeletepost,
    { loading: loadingdelete, data: datadelete, error: errordelete },
  ] = useMutation(deletepost, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenApps,
      },
    },
  });

  const _deletepost = async (data) => {
    setModalhapus(false);
    setModalmenu(false);

    if (tokenApps) {
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
        RNToasty.Show({
          title: t("somethingwrong"),
          position: "bottom",
        });
        // Alert.alert("" + error);
      }
    } else {
      console.warn("Please Login");
    }
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    loadasync();
    if (props.route.params) {
      if (props?.route?.params?.updateDataPost) {
        let tempdata = [...datas];
        if (tempdata) {
          let indeks = tempdata.findIndex(
            (k) => k.node["id"] == props?.route?.params?.updateDataPost.id
          );
          let tempdataIndeks = { ...tempdata[indeks] };
          let tempdatas = { ...tempdata[indeks].node };
          tempdatas = props?.route?.params?.updateDataPost;
          tempdatas.comment_count = props?.route?.params?.comment_count;
          tempdatas.response_count = props?.route?.params?.response_count;
          tempdatas.liked = props?.route?.params?.liked;
          tempdataIndeks.node = tempdatas;
          tempdata.splice(indeks, 1, tempdataIndeks);
          setDatas(tempdata);
          setIndeksScrollto(indeks);
          Scroll_to(indeks);
        }
      }
      if (props?.route?.params?.isProfil) {
        let tempdata = props?.route?.params?.data_post
          ? [...props?.route?.params?.data_post]
          : [...props?.route?.params?.dataPost];
        if (tempdata) {
          let indeks = tempdata.findIndex(
            (k) => k.node["id"] == props?.route?.params?.post_id
          );
          if (indeks) {
            setIndeksScrollto(indeks);
            Scroll_to(indeks);
            props.route.params.isProfil = false;
          }
        }
      }
      if (play == props?.route?.params?.post_id) {
        setShowLoading(true);
      }
    }
    const unsubscribe = props.navigation.addListener("focus", () => {
      // refetch();
      loadasync();
    });
    return unsubscribe;
  }, [
    props?.route?.params?.updateDataPost,
    props?.route?.params?.isProfil,
    props?.route?.params?.post_id,
    props?.route?.params?.dataPost,
    props?.route?.params?.data_post,
    play,
    props.navigation,
    props.route.params,
  ]);

  // after edit post
  useEffect(() => {
    if (props.route.params) {
      if (props?.route?.params?.post_id) {
        let tempdata = [...datas];
        if (tempdata) {
          let indeks = tempdata.findIndex(
            (k) => k.node["id"] == props?.route?.params?.post_id
          );
          let tempdataIndeks = { ...tempdata[indeks] };
          let tempdatas = { ...tempdata[indeks].node };

          if (from == "feedProfilEdit") {
            tempdatas.caption = props?.route?.params?.caption;
            tempdatas.response_count =
              props?.route?.params?.data_post?.response_count;
            tempdatas.comment_count =
              props?.route?.params?.data_post?.comment_count;
            tempdatas.liked = props?.route?.params?.data_post?.liked;
          } else if (from == "feedProfilCommentEdit") {
            tempdatas.caption = props?.route?.params?.caption;
            tempdatas.response_count =
              props?.route?.params?.data_post?.response_count;
            tempdatas.comment_count =
              props?.route?.params?.data_post?.comment_count;
            tempdatas.liked = props?.route?.params?.data_post?.liked;
          } else if (from == "feedProfilAlbum") {
            tempdatas.caption = props?.route?.params?.caption;
            tempdatas.response_count = props?.route?.params?.response_count;
            tempdatas.comment_count = props?.route?.params?.comment_count;
            tempdatas.liked = props?.route?.params?.liked;
            tempdatas.album = props?.route?.params?.updateDataPost.album;
            tempdatas.assets = props?.route?.params?.updateDataPost.assets;
          } else if (from == "feedProfilCommentAlbum") {
            tempdatas.caption = props?.route?.params?.data_post?.caption;
            tempdatas.response_count =
              props?.route?.params?.data_post?.response_count;
            tempdatas.comment_count =
              props?.route?.params?.data_post?.comment_count;
            tempdatas.liked = props?.route?.params?.data_post?.liked;
            tempdatas.album = props?.route?.params?.updateDataPost.album;
            tempdatas.assets = props?.route?.params?.updateDataPost.assets;
          }

          tempdataIndeks.node = tempdatas;
          tempdata.splice(indeks, 1, tempdataIndeks);
          setDatas(tempdata);
          setIndeksScrollto(indeks);
          Scroll_to(indeks);
        }
      }
      // if (play == props?.route?.params?.post_id) {
      //   setShowLoading(true);
      // }
    }
  }, [props.route.params]);

  const [
    MutationLike,
    { loading: loadingLike, data: dataLike, error: errorLike },
  ] = useMutation(likepost, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenApps,
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
        Authorization: tokenApps,
      },
    },
  });

  const _liked = async (id, index) => {
    let tempData = [...datas];
    index = tempData.findIndex((k) => k.node["id"] === id);
    if (index != -1) {
      if (activelike) {
        if (tokenApps) {
          setactivelike(false);
          let tempData = [...datas];
          let tempDataAll = { ...tempData[index] };
          let tempDatas = { ...tempData[index].node };
          tempDatas.liked = true;
          tempDatas.response_count = tempDatas.response_count + 1;
          tempDataAll.node = tempDatas;
          tempData.splice(index, 1, tempDataAll);
          setDatas(tempData);
          try {
            let response = await MutationLike({
              variables: {
                post_id: id,
              },
            });

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
            let tempDataAll = { ...tempData[index] };
            let tempDatas = { ...tempData[index].node };
            tempDatas.liked = false;
            tempDatas.response_count = tempDatas.response_count - 1;
            tempDataAll.node = tempDatas;
            tempData.splice(index, 1, tempDataAll);
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
    index = tempData.findIndex((k) => k.node["id"] === id);
    if (index !== -1) {
      if (activelike) {
        if (tokenApps) {
          setactivelike(false);
          let tempData = [...datas];
          let tempDataAll = { ...tempData[index] };
          let tempDatas = { ...tempData[index].node };
          tempDatas.liked = false;
          tempDatas.response_count = tempDatas.response_count - 1;
          tempDataAll.node = tempDatas;
          tempData.splice(index, 1, tempDataAll);
          setDatas(tempData);
          try {
            let response = await MutationunLike({
              variables: {
                post_id: id,
              },
            });

            if (response.data) {
              if (response.data.unlike_post.code == 200) {
                setactivelike(true);
              } else {
                console.warn(response.data.unlike_post.message);
              }
            }
          } catch (error) {
            setactivelike(true);
            let tempData = [...datas];
            let tempDataAll = { ...tempData[index] };
            let tempDatas = { ...tempData[index].node };
            tempDatas.liked = true;
            tempDatas.response_count = tempDatas.response_count + 1;
            tempDataAll.node = tempDatas;
            tempData.splice(index, 1, tempDataAll);
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
    const index = tempd.findIndex((k) => k.node["id"] === id);
    tempd[index].node.comment_count = tempd[index].node.comment_count + 1;
  };

  const viewcomment = (data, index, time) => {
    props.navigation.navigate("FeedStack", {
      screen: "CommentPost",
      params: {
        from: "feedProfil",
        data: data,
        token: tokenApps,
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
    if (datauser?.id == users?.id) {
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

  const renderViewMore = (onPress) => {
    return (
      <Text
        size="description"
        type="bold"
        onPress={onPress}
        style={{
          color: "#209fae",
          marginTop: 2,
          marginBottom: 5,
        }}
      >
        {t("readMoreCaption")}
      </Text>
    );
  };

  const renderViewLess = (onPress) => {
    return <Text></Text>;
  };

  const [refreshing, setRefreshing] = useState(false);
  const Refresh = React.useCallback(() => {
    setRefreshing(true);
    refetchFeed();
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
    if (!fetchMoreResult) return prev;
    const { pageInfo } = fetchMoreResult?.user_post_cursor_based;
    const edges = [
      ...prev?.user_post_cursor_based?.edges,
      ...fetchMoreResult?.user_post_cursor_based?.edges,
    ];
    const feedback = Object.assign({}, prev, {
      user_post_cursor_based: {
        __typename: prev?.user_post_cursor_based?.__typename,
        pageInfo,
        edges,
      },
    });
    return feedback;
  };
  const handleOnEndReached = () => {
    if (
      dataFeed?.user_post_cursor_based?.pageInfo?.hasNextPage &&
      !loadingFeed
    ) {
      return fetchMore({
        updateQuery: onUpdate,
        variables: {
          first: indekScrollto ? indekScrollto + 1 : 20,
          after: dataFeed?.user_post_cursor_based?.pageInfo?.endCursor,
        },
      });
    }
  };

  const [datasFollow, setDatasFollow] = useState();

  const [
    LoadFollowing,
    { data: dataFollow, loading, error, refetch: refetchFollowing },
  ] = useLazyQuery(FollowingQuery, {
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenApps,
      },
    },
    onCompleted: () => {
      setDatasFollow(dataFollow?.user_following);
    },
  });

  const [
    UnfollowMutation,
    { loading: loadUnfolMut, data: dataUnfolMut, error: errorUnfolMut },
  ] = useMutation(UnfollowMut, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenApps,
      },
    },
  });

  const _unfollow = async (id, status) => {
    setModalmenuother(false);

    if (tokenApps) {
      try {
        let response = await UnfollowMutation({
          variables: {
            id: id,
          },
        });
        if (response.data) {
          if (
            response.data.unfollow_user.code === 200 ||
            response.data.unfollow_user.code === "200"
          ) {
            LoadFollowing();
          } else {
            console.warn(response.data.unfollow_user.message);
          }
        }
      } catch (error) {
        console.warn(error);
      }
    } else {
      console.warn("please login");
    }
  };

  const [
    FollowMutation,
    { loading: loadFollowMut, data: dataFollowMut, error: errorFollowMut },
  ] = useMutation(FollowMut, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenApps,
      },
    },
  });

  const _follow = async (id, status) => {
    setModalmenuother(false);
    if (tokenApps) {
      try {
        let response = await FollowMutation({
          variables: {
            id: id,
          },
        });

        if (response.data) {
          if (
            response.data.follow_user.code === 200 ||
            response.data.follow_user.code === "200"
          ) {
            LoadFollowing();
          } else {
            console.warn(response.data.follow_user.message);
          }
        }
      } catch (error) {
        console.warn(error);
      }
    } else {
      console.warn("please login");
    }
  };

  // if (loadingpost) {
  //   return (
  //     <SkeletonPlaceholder
  //       speed={1000}
  //     >
  //       <View
  //         style={{
  //           padding: 10,
  //           marginHorizontal: 15,
  //           marginVertical: 5,
  //           borderRadius: 20,
  //           borderWidth: 1,
  //           borderColor: "#f6f6f6",
  //           paddingBottom: 20,
  //         }}
  //       >
  //         <View
  //           style={{
  //             // height: 200,
  //             flexDirection: "row",
  //             justifyContent: "space-between",
  //           }}
  //         >
  //           <View
  //             style={{
  //               flexDirection: "row",
  //             }}
  //           >
  //             <SkeletonPlaceholder.Item
  //               width={40}
  //               height={40}
  //               borderRadius={20}
  //             />
  //             <View
  //               style={{
  //                 marginLeft: 20,
  //               }}
  //             >
  //               <SkeletonPlaceholder.Item
  //                 width={120}
  //                 height={15}
  //                 borderRadius={5}
  //               />
  //               <SkeletonPlaceholder.Item
  //                 marginTop={6}
  //                 width={80}
  //                 height={15}
  //                 borderRadius={5}
  //               />
  //             </View>
  //           </View>
  //           <SkeletonPlaceholder.Item width={30} height={15} borderRadius={5} />
  //         </View>

  //         <SkeletonPlaceholder.Item
  //           marginVertical={15}
  //           height={Dimensions.get("window").width - 50}
  //           borderRadius={15}
  //         ></SkeletonPlaceholder.Item>

  //         <SkeletonPlaceholder.Item
  //           flexDirection="row"
  //           justifyContent="space-between"
  //           alignItems="center"
  //           marginVertical={10}
  //           // marginHorizontal={15}
  //         >
  //           <SkeletonPlaceholder.Item flexDirection="row">
  //             <SkeletonPlaceholder.Item
  //               width={50}
  //               height={25}
  //               borderRadius={20}
  //             />
  //             <SkeletonPlaceholder.Item
  //               width={50}
  //               height={25}
  //               borderRadius={20}
  //               marginLeft={20}
  //             />
  //           </SkeletonPlaceholder.Item>
  //           <SkeletonPlaceholder.Item
  //             width={50}
  //             height={25}
  //             borderRadius={20}
  //           />
  //         </SkeletonPlaceholder.Item>
  //         <SkeletonPlaceholder.Item>
  //           <SkeletonPlaceholder.Item
  //             // width={Dimensions.get("window").width - 30}
  //             height={15}
  //             borderRadius={4}
  //           />
  //           <SkeletonPlaceholder.Item
  //             // width={Dimensions.get("window").width - 30}
  //             height={15}
  //             borderRadius={4}
  //             marginTop={6}
  //           />
  //           <SkeletonPlaceholder.Item
  //             marginTop={6}
  //             width={80}
  //             height={15}
  //             borderRadius={4}
  //           />
  //         </SkeletonPlaceholder.Item>
  //       </View>
  //     </SkeletonPlaceholder>
  //   );
  // }

  const scrollToIndexFailed = (error) => {
    const offset = error.averageItemLength * error.index;
    ref.current.scrollToOffset({ offset });
    setTimeout(
      () =>
        ref?.current?.scrollToIndex({
          index: error.index,
        }),
      500
    );
  };

  const goToItinerary = (data) => {
    tokenApps
      ? props.navigation.push("ItineraryStack", {
          screen: "itindetail",
          params: {
            itintitle: data.album.itinerary.name,
            country: data.album.itinerary.id,
            dateitin: "",
            token: tokenApps,
            status: "",
            index: 0,
            datadayaktif: data.day,
          },
        })
      : setModalLogin(true);
  };

  const removeTagAlbum = async (post_id, album_id) => {
    try {
      let response = await AlbumMutation({
        variables: {
          album_id: album_id,
          post_id: post_id,
        },
      });
      if (response.data.remove_albums_post.code == 200) {
        let tempdata = [...datas];
        let indeks = tempdata.findIndex((k) => k.node["id"] == post_id);
        let tempdataIndex = { ...tempdata[indeks] };
        let tempDatas = { ...tempdata[indeks].node };
        tempDatas.album = null;
        tempdataIndex.node = tempDatas;
        tempdata.splice(indeks, 1, tempdataIndex);
        await setDatas(tempdata);
        await setModalmenu(false);
      } else {
        RNToasty({
          title: t("failRemoveTagAlbum"),
          position: "bottom",
        });
      }
    } catch (error) {
      RNToasty({
        title: t("failRemoveTagAlbum"),
        position: "bottom",
      });
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      {!showLoading ? (
        <View
          style={{
            position: "absolute",
            backgroundColor: "#fff",
            height: Dimensions.get("screen").height,
            width: Dimensions.get("screen").width,
            zIndex: 1,
            // opacity: 0.7,
            paddingTop: 20,
          }}
        >
          <ActivityIndicator size="large" color="#209fae" />
        </View>
      ) : null}
      <FlatList
        pinchGestureEnabled={false}
        ref={ref}
        data={datas}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
        keyExtractor={(item) => item?.node?.id}
        // refreshing={refreshing}
        showsVerticalScrollIndicator={false}
        scrollToIndex={indekScrollto}
        onScrollToIndexFailed={(e) => {
          scrollToIndexFailed(e);
        }}
        // refreshControl={
        //   <RefreshControl refreshing={refreshing} onRefresh={() => Refresh()} />
        // }
        initialNumToRender={indekScrollto ? indekScrollto + 1 : 20}
        onEndReachedThreshold={1}
        onEndReached={handleOnEndReached}
        renderItem={({ item, index }) => (
          <View
            style={{
              width: Dimensions.get("window").width - 20,
              backgroundColor: "#FFFFFF",
              // flex: 1,
              marginHorizontal: 10,
              // marginVertical: 5,
              marginTop: 10,
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
                  datauser?.id !== users?.id
                    ? props.navigation.push("ProfileStack", {
                        screen: "otherprofile",
                        params: {
                          idUser: datauser?.id,
                        },
                      })
                    : props.navigation.push("ProfileStack", {
                        screen: "ProfileTab",
                        params: {
                          token: tokenApps,
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
                source={{ uri: datauser?.picture }}
              />
              <View
                style={{
                  justifyContent: "center",
                  marginHorizontal: 10,
                  flex: 1,
                }}
              >
                <Text
                  onPress={() => {
                    datauser?.id !== users?.id
                      ? props.navigation.push("ProfileStack", {
                          screen: "otherprofile",
                          params: {
                            idUser: datauser?.id,
                          },
                        })
                      : props.navigation.push("ProfileStack", {
                          screen: "ProfileTab",
                          params: {
                            token: tokenApps,
                          },
                        });
                  }}
                  size="title"
                  style={{
                    maxWidth: "86%",
                  }}
                  numberOfLines={1}
                >
                  {datauser?.first_name}{" "}
                  {datauser?.first_name ? datauser?.last_name : null}
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
                    {duration(item?.node?.created_at)}
                  </Text>
                  {item.node.location_name ? (
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
                  {item.node.location_name ? (
                    <Text
                      size="small"
                      style={{
                        fontFamily: "Lato-Regular",
                        // marginTop: 7,
                        maxWidth: "55%",
                      }}
                      numberOfLines={1}
                    >
                      {/* <Truncate text={item.node.location_name} length={40} /> */}
                      {item.node.location_name}
                    </Text>
                  ) : null}
                </View>
              </View>
              <TouchableOpacity
                onPress={() => OptionOpen(item.node)}
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
              {item.node.is_single == false ? (
                <RenderAlbum
                  itinerary_id={item?.node?.album?.itinerary?.id}
                  has_itinerary={item?.node?.album?.itinerary ? true : false}
                  data={item.node}
                  props={props}
                  play={play}
                  muted={muted}
                  isFocused={isFocused}
                  setMuted={(e) => setMuted(e)}
                  token={tokenApps}
                  setModalLogin={(e) => setModalLogin(e)}
                />
              ) : (
                <RenderSinglePhoto
                  itinerary_id={item?.node?.album?.itinerary?.id}
                  has_itinerary={item?.node?.album?.itinerary ? true : false}
                  data={item.node}
                  props={props}
                  play={play}
                  muted={muted}
                  setMuted={(e) => setMuted(e)}
                  isFocused={isFocused}
                  token={tokenApps}
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
                  {item.node.liked ? (
                    <Button
                      onPress={() => _unliked(item.node.id, index)}
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
                        {item.node.response_count}
                      </Text>
                    </Button>
                  ) : (
                    <Button
                      onPress={() => _liked(item.node.id, index)}
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
                        {item.node.response_count}
                      </Text>
                    </Button>
                  )}

                  <Button
                    onPress={() =>
                      viewcomment(
                        item.node,
                        index,
                        duration(item?.node?.created_at)
                      )
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
                      {item.node.comment_count}
                    </Text>
                  </Button>
                </View>

                <Button
                  onPress={() =>
                    props.navigation.navigate("ChatStack", {
                      screen: "SendToChat",
                      params: {
                        dataSend: {
                          id: item.node?.id,
                          assets: item.node?.assets,
                          caption: item.node?.caption,
                          user: item.node?.user,
                          media_orientation: item.node?.media_orientation,
                          responseCount: item.node?.response_count,
                          commentCount: item.node?.comment_count,
                        },
                        title: "Post",
                        tag_type: "tag_post",
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
                </Button>
              </View>
              {/* album */}
              <View
                style={{
                  width: "100%",
                  padding: 10,
                  flexDirection: "row",
                }}
              >
                {item?.node?.album && item?.node?.album?.itinerary !== null ? (
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        marginBottom: 10,
                        width: Dimensions.get("screen").width - 40,
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: "#209fae",
                          // height: 23,
                          width: 7,
                          borderRadius: 4,
                          marginRight: 10,
                          marginLeft: 2,
                        }}
                      />
                      <Pressable
                        onPress={() => goToItinerary(item.node)}
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          flexWrap: "wrap",
                          alignItems: "center",
                        }}
                      >
                        <Text size="label" type="bold" style>
                          {item.node.album.itinerary.name}
                        </Text>
                        <Ripple
                          onPress={() => goToItinerary(item.node)}
                          style={{
                            borderRadius: 10,
                            borderWidth: 1,
                            borderColor: "#209FAE",
                            marginLeft: 5,
                          }}
                        >
                          <Text
                            size="small"
                            type="regular"
                            style={{
                              marginHorizontal: 10,
                              marginVertical: 3,
                            }}
                          >
                            {t("trip")}
                          </Text>
                        </Ripple>
                      </Pressable>
                    </View>
                    {item.node.caption ? (
                      <ViewMoreText
                        numberOfLines={3}
                        renderViewMore={renderViewMore}
                        renderViewLess={renderViewLess}
                        // textStyle={{ color: "#209fae" }}
                      >
                        <Text
                          size="label"
                          style={{
                            textAlign: "left",
                            lineHeight: 20,
                          }}
                        >
                          {item.node.caption}
                        </Text>
                      </ViewMoreText>
                    ) : null}
                  </View>
                ) : item.node?.caption ? (
                  <View
                    style={
                      {
                        // marginBottom: 8,
                      }
                    }
                  >
                    <ViewMoreText
                      numberOfLines={3}
                      renderViewMore={renderViewMore}
                      renderViewLess={renderViewLess}
                    >
                      <Text
                        size="label"
                        style={{
                          textAlign: "left",
                          lineHeight: 20,
                          marginBottom: 10,
                        }}
                      >
                        <Text
                          type="bold"
                          size="label"
                          style={{
                            marginRight: 5,
                          }}
                        >
                          {item.node.user.first_name}{" "}
                          {item.node.user.first_name
                            ? item.node.user.last_name
                            : null}{" "}
                        </Text>
                        {item.node?.caption}
                      </Text>
                    </ViewMoreText>
                  </View>
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
                      from: "feedProfil",
                    },
                  });
              }}
            >
              <Text size="label" type="regular" style={{ marginVertical: 15 }}>
                {t("edit")}
              </Text>
            </TouchableOpacity>
            {selectedOption?.album ? (
              <TouchableOpacity
                style={{
                  alignItems: "center",
                  borderBottomWidth: 1,
                  borderColor: "#d1d1d1",
                }}
                onPress={() =>
                  removeTagAlbum(selectedOption?.id, selectedOption?.album?.id)
                }
              >
                <Text
                  size="label"
                  type="regular"
                  style={{ marginVertical: 15 }}
                >
                  {t("removeTagAlbum")}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{
                  alignItems: "center",
                  borderBottomWidth: 1,
                  borderColor: "#d1d1d1",
                }}
                onPress={() => {
                  setModalmenu(false),
                    tokenApps
                      ? props.navigation.navigate("FeedStack", {
                          screen: "CreateListAlbum",
                          params: {
                            user_id: setting?.user_id,
                            token: tokenApps,
                            file: "",
                            type: "",
                            location: "",
                            isAlbum: true,
                            post_id: selectedOption?.id,
                            from: "feedProfil",
                            data_post: selectedOption,
                          },
                        })
                      : setModalLogin(true);
                }}
              >
                <Text
                  size="label"
                  type="regular"
                  style={{ marginVertical: 15 }}
                >
                  {t("TagAlbum")}
                </Text>
              </TouchableOpacity>
            )}
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
                  success: t("successCopyLink"),
                  failed: t("failedCopyLink"),
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
    </SafeAreaView>
  );
}
