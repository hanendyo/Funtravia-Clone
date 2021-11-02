import React, { useState, useEffect, forwardRef } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Alert,
  RefreshControl,
  ActivityIndicator,
  Image as ImageRN,
  Pressable,
  SafeAreaView,
  Modal,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  LikeRed,
  Send_to,
  More,
  LikeBlack,
  CommentBlack,
  Xgray,
  AcceptNotif,
  Errorr,
} from "../../assets/svg";
import { gql } from "apollo-boost";
import { useMutation, useQuery, useLazyQuery } from "@apollo/react-hooks";
import likepost from "../../graphQL/Mutation/Post/likepost";
import unlikepost from "../../graphQL/Mutation/Post/unlikepost";
import { Text, Button, shareAction, CopyLink, FunImage } from "../../component";
import { Truncate } from "../../component";
import { useTranslation } from "react-i18next";
import FeedPageing from "../../graphQL/Query/Feed/FeedPageing";
import FeedListCursorBased from "../../graphQL/Query/Feed/FeedListCursorBased";
import ReadMore from "react-native-read-more-text";
import ViewMoreText from "react-native-view-more-text";
import { useScrollToTop } from "@react-navigation/native";
import { NetworkStatus } from "@apollo/client";
import RenderAlbum from "./RenderAlbumItinerary";
import RenderSinglePhoto from "./RenderSinglePhoto";
import { useIsFocused } from "@react-navigation/native";
import UnfollowMut from "../../graphQL/Mutation/Profile/UnfollowMut";
import FollowingQuery from "../../graphQL/Query/Profile/Following";
import FollowMut from "../../graphQL/Mutation/Profile/FollowMut";
import Ripple from "react-native-material-ripple";
import { RNToasty } from "react-native-toasty";
import * as Progress from "react-native-progress";
import ProgressBar from "react-native-progress/Bar";
import moment from "moment";
import ShowMoreText from "react-show-more-text";

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

const PostMut = gql`
  mutation(
    $assets: [Upload]!
    $caption: String
    $latitude: String
    $longitude: String
    $location_name: String
    $albums_id: ID
    $itinerary_id: ID
    $day_id: ID
    $oriented: String
  ) {
    create_post(
      input: {
        assets: $assets
        caption: $caption
        latitude: $latitude
        longitude: $longitude
        location_name: $location_name
        albums_id: $albums_id
        itinerary_id: $itinerary_id
        day_id: $day_id
        oriented: $oriented
      }
    ) {
      id
      response_time
      message
      code
    }
  }
`;

export default function FeedList({ props, token }) {
  const { t, i18n } = useTranslation();
  const ref = React.useRef(null);
  const [modalLogin, setModalLogin] = useState(false);
  const isFocused = useIsFocused();
  const [dataFeed, setDataFeed] = useState([]);

  let [selectedOption, SetOption] = useState({});
  let [modalmenu, setModalmenu] = useState(false);
  let [modalmenuother, setModalmenuother] = useState(false);
  let [modalhapus, setModalhapus] = useState(false);
  let [modalConfUnFollow, setmodalConfUnFollow] = useState(false);
  let [setting, setSetting] = useState();
  let [activelike, setactivelike] = useState(true);

  const [loaded, setLoaded] = useState(false);

  let { width, height } = Dimensions.get("screen");
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

  const [
    MutationCreate,
    {
      loading: loadingMutationPost,
      data: dataMutationPost,
      error: errorMutationPost,
    },
  ] = useMutation(PostMut, {
    context: {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const SubmitData = async () => {
    setLoaded(true);
    setCount(0);

    setTimeout(() => {
      if (ref) {
        ref?.current.scrollToIndex({ animated: true, index: 0 });
      }
    }, 1000);
    try {
      let response = await MutationCreate({
        variables: {
          caption: props?.route?.params?.caption,
          latitude: props?.route?.params?.latitude,
          longitude: props?.route?.params?.longitude,
          location_name: props?.route?.params?.location_name,
          albums_id: props?.route?.params?.albums_id,
          itinerary_id: props?.route?.params?.itinerary_id,
          day_id: props?.route?.params?.day_id,
          oriented: props?.route?.params?.oriented,
          assets: props?.route?.params?.assets,
        },
      });

      // if (errorMutationPost) {
      //   RNToasty({
      //     duration: 1,
      //     title: t("failPost"),
      //     position: "bottom",
      //   });
      // }

      if (response.data) {
        if (response.data.create_post.code === 200) {
          await refetch();
          setTimeout(() => {
            if (ref) {
              ref?.current.scrollToIndex({ animated: true, index: 0 });
            }
          });
          setTimeout(() => {
            setLoaded(false);
          }, 4000);
        } else {
          setLoaded(false);
          throw new Error(response.data.create_post.message);
        }
      } else {
        setLoaded(false);
        setUploadFailed(true);
        throw new Error("Error Input");
      }
    } catch (err) {
      setLoaded(false);
      setUploadFailed(true);
      // RNToasty.Show({
      //   duration: 1,
      //   title: t("failPost"),
      //   position: "bottom",
      // });
    }
  };

  const [count, setCount] = useState(0);
  const countLeft =
    props?.route?.params?.assets?.length === undefined
      ? 10
      : props?.route?.params?.assets?.length;
  const timePercentage = count / countLeft;

  const _liked = async (id, index) => {
    let tempData = [...dataFeed];
    index = tempData.findIndex((k) => k["node"]["id"] === id);

    if (index !== -1) {
      if (activelike) {
        if (token && token !== "" && token !== null) {
          setactivelike(false);
          let tempData = [...dataFeed];
          let tempData_all = { ...tempData[index] };
          let tempDatas = { ...tempData[index].node };
          tempDatas.liked = true;
          tempDatas.response_count = tempDatas.response_count + 1;
          tempData_all.node = tempDatas;

          tempData.splice(index, 1, tempData_all);
          setDataFeed(tempData);
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
            let tempData = [...dataFeed];
            let tempData_all = { ...tempData[index] };
            let tempDatas = { ...tempData[index].node };
            tempDatas.liked = false;
            tempDatas.response_count = tempDatas.response_count - 1;
            tempData_all.node = tempDatas;

            tempData.splice(index, 1, tempData_all);
            setDataFeed(tempData);
          }
        } else {
          setModalLogin(true);
        }
      }
    }
  };

  const _unliked = async (id, index) => {
    let tempData = [...dataFeed];
    if (index !== -1) {
      if (activelike) {
        if (token && token !== "" && token !== null) {
          setactivelike(false);
          let tempData = [...dataFeed];
          let tempData_all = { ...tempData[index] };
          let tempDatas = { ...tempData[index].node };
          tempDatas.liked = false;
          tempDatas.response_count = tempDatas.response_count - 1;
          tempData_all.node = tempDatas;

          tempData.splice(index, 1, tempData_all);
          setDataFeed(tempData);
          try {
            let response = await MutationunLike({
              variables: {
                post_id: id,
              },
            });
            // if (loadingunLike) {
            //   Alert.alert("Loading!!");
            // }
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
            let tempData = [...dataFeed];
            let tempData_all = { ...tempData[index] };
            let tempDatas = { ...tempData[index].node };
            tempDatas.liked = true;
            tempDatas.response_count = tempDatas.response_count + 1;
            tempData_all.node = tempDatas;

            tempData.splice(index, 1, tempData_all);
            setDataFeed(tempData);
          }
        } else {
          setModalLogin(true);
        }
      }
    }
  };

  const [uploadFailed, setUploadFailed] = useState(false);
  const {
    loading: loadingPost,
    data: dataPost,
    error: errorPost,
    fetchMore,
    refetch,
    networkStatus,
  } = useQuery(FeedListCursorBased, {
    variables: {
      first: 5,
      after: "",
    },
    // pollInterval: 1000,
    context: {
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${tkn}`,
        Authorization: `Bearer ${props.route.params.token}`,
      },
    },
    options: {
      fetchPolicy: "network-only",
      errorPolicy: "ignore",
    },
    // pollInterval: 5500,
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      setDataFeed(dataPost.post_cursor_based.edges);
    },
  });

  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", () => {
      refetch();
    });
    return unsubscribe;
  }, [props.navigation]);

  const [refreshing, setRefreshing] = useState(false);
  const refresstatus = networkStatus === NetworkStatus.refetch;
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
    if (!fetchMoreResult) return prev;
    const { pageInfo } = fetchMoreResult.post_cursor_based;
    const edges = [
      ...prev.post_cursor_based.edges,
      ...fetchMoreResult.post_cursor_based.edges,
    ];
    const feedback = Object.assign({}, prev, {
      post_cursor_based: {
        __typename: prev.post_cursor_based.__typename,
        pageInfo,
        edges,
      },
    });

    return feedback;
  };
  const handleOnEndReached = () => {
    if (status == 0) {
      if (dataPost.post_cursor_based?.pageInfo.hasNextPage && !loadingPost) {
        return fetchMore({
          updateQuery: onUpdate,
          variables: {
            first: 5,
            after: dataPost.post_cursor_based.pageInfo.endCursor,
          },
        });
      }
    } else {
      setModalLogin(true);
    }
  };

  const _deletepost = async (data) => {
    setModalhapus(false);
    setModalmenu(false);

    if (token && token !== "" && token !== null) {
      try {
        let response = await Mutationdeletepost({
          variables: {
            post_id: data.id,
          },
        });

        if (response.data) {
          if (response.data.delete_post.code === 200) {
            refetch();
            const tempdata = [...dataFeed];
            tempdata.splice(data.index, 1);
            setDataFeed(tempdata);
          } else {
            throw new Error(response.data.delete_post.message);
          }
        }
      } catch (error) {
        RNToasty.Show({
          title: "Failed to delete this post",
          position: "bottom",
        });
      }
    } else {
      setModalLogin(true);
    }
  };

  const duration = (datetime) => {
    datetime = datetime.replace(" ", "T");
    var date1 = new Date(datetime).getTime();
    // var date2 = new Date().getTime();

    var date2 = moment().format();

    date2 = new Date(date2.slice(0, 19)).getTime();

    var msec = date2 - date1;
    var mins = Math.floor(msec / 60000);
    var hrs = Math.floor(mins / 60);
    var days = Math.floor(hrs / 24);
    var yrs = Math.floor(days / 365);
    mins = mins % 60;
    hrs = hrs % 24;
    if (yrs > 0) {
      return yrs + " " + t("yearsAgo");
    } else if (days > 0) {
      return days + " " + t("daysAgo");
    } else if (hrs > 0) {
      return hrs + " " + t("hoursAgo");
    } else if (mins > 0) {
      return mins + " " + t("minutesAgo");
    } else {
      return t("justNow");
    }
  };

  const loadAsync = async () => {
    let setsetting = await AsyncStorage.getItem("setting");
    let tkn = await AsyncStorage.getItem("access_token");
    setSetting(JSON.parse(setsetting));
    await LoadFollowing();
  };

  useEffect(() => {
    count < countLeft && setTimeout(() => setCount(count + 1), 1000);
    refetch();
    loadAsync();
    if (props.route.params) {
      if (props.route.params.isItinerary === true) {
        console.log("itinerary");
        Refresh();
      }

      if (props.route.params.isPost === true) {
        console.log("submit");
        SubmitData();
        props.route.params.isPost = false;
      }

      if (props.route.params.isComment === true) {
        // Refresh();
        console.log("comment");
        if (ref) {
          // ref?.current.scrollToIndex({ animated: true, index: 0 });
          props.route.params.isComment = false;
        }
      }
      if (props.route.params.isTag === true) {
        console.log("tag");
        setRefreshing(true);
        setTimeout(() => {
          refetch();
          // if (ref) {
          // ref?.current.scrollToIndex({ animated: true, index: 0 });
          // }
          setRefreshing(false);
        }, 800);
      }
    }
    const unsubscribe = props.navigation.addListener("focus", () => {});
    return unsubscribe;
  }, [props.route.params?.isPost, count]);

  const createPost = () => {
    if (token && token !== null && token !== "") {
      props.navigation.navigate("FeedStack", {
        screen: "Post",
      });
      const uploading = true;
    } else {
      setModalLogin(true);
    }
  };

  const countKoment = (id) => {
    const tempd = [...dataFeed];
    const index = tempd.findIndex((k) => k["node"]["id"] === id);
    tempd[index].node.comment_count = tempd[index].node.comment_count + 1;
  };

  const viewcomment = (data, index, time) => {
    if (token) {
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
          _deletepost: (e) => _deletepost(e),
        },
      });
    } else {
      setModalLogin(true);
    }
  };

  const OptionOpen = (data, index, setting) => {
    const tempdata = { ...data };
    tempdata.index = index;
    SetOption(tempdata);

    if (data.user.id == setting?.user?.id) {
      setModalmenu(true);
    } else {
      setModalmenuother(true);
    }
  };

  const renderViewMore = (onPress) => {
    console.log("onpress", onPress);
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

  const goToItinerary = (data) => {
    token
      ? props.navigation.push("ItineraryStack", {
          screen: "itindetail",
          params: {
            itintitle: data.itinerary.name,
            country: data.itinerary.id,
            dateitin: "",
            token: token,
            status: "",
            index: 1,
            datadayaktif: data.day,
          },
        })
      : setModalLogin(true);
  };

  let [play, setPlay] = useState(null);
  let [muted, setMuted] = useState(true);
  const onViewRef = React.useRef(({ viewableItems, changed }) => {
    if (viewableItems) {
      setPlay(viewableItems[0]?.key);
    }
  });

  const viewConfigRef = React.useRef({
    viewAreaCoveragePercentThreshold: 50,
  });

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

    if (token) {
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
            Refresh();
          } else {
            throw new Error(response.data.unfollow_user.message);
          }
        }
      } catch (error) {
        Alert.alert("" + error);
      }
    } else {
      setModalLogin(true);
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
    if (token) {
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
            Refresh();
          } else {
            throw new Error(response.data.follow_user.message);
          }
        }
      } catch (error) {
        Alert.alert("" + error);
      }
    } else {
      setModalLogin(true);
    }
  };

  let status = 0;

  if (dataFeed?.length > 11) {
    if (!token || token == undefined) {
      status = 1;
    } else {
      status = 0;
    }
  }

  useEffect(() => {
    if (status == 1) {
      setModalLogin(true);
    } else {
      setModalLogin(false);
    }
  }, [status]);

  return (
    <SafeAreaView>
      {/* {test()} */}
      <View
      // style={{
      //   zIndex: modalmenu || modalmenuother || modalhapus === true ? 1 : -2,
      //   opacity: 0.6,
      //   position: "absolute",
      //   width: Dimensions.get("screen").width,
      //   height: Dimensions.get("screen").height,
      //   backgroundColor:
      //     modalmenu || modalmenuother || modalhapus === true ? "#000" : null,
      // }}
      >
        {/* Start Modal Konfirmasi Unfollow */}
        <Modal
          useNativeDriver={true}
          visible={modalConfUnFollow}
          onRequestClose={() => setmodalConfUnFollow(false)}
          transparent={true}
          animationType="fade"
        >
          <Pressable
            onPress={() => setmodalConfUnFollow(false)}
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
                  {t("unfollow")}
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
                {`${t("descUnfollow")} ${selectedOption?.user?.first_name} ${
                  selectedOption?.user?.last_name
                } ?`}
              </Text>
              <View style={{ marginTop: 20, marginHorizontal: 10 }}>
                <Button
                  onPress={async () => {
                    await _unfollow(selectedOption.user.id);
                    await setmodalConfUnFollow(false);
                  }}
                  color="secondary"
                  text={t("unfollow")}
                ></Button>
                <Button
                  onPress={() => {
                    // setModalmenuother(false);
                    setmodalConfUnFollow(false);
                  }}
                  style={{ marginVertical: 5 }}
                  variant="transparent"
                  text={t("discard")}
                ></Button>
              </View>
            </View>
          </View>
        </Modal>
        {/* End Modal Konfirmasi Unfollow */}
        <Modal
          useNativeDriver={true}
          visible={modalLogin}
          onRequestClose={() => true}
          transparent={true}
          animationType="fade"
        >
          <Pressable
            onPress={() => setModalLogin(false)}
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
              width: Dimensions.get("screen").width - 120,
              marginHorizontal: 60,
              backgroundColor: "#FFF",
              zIndex: 15,
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              marginTop: Dimensions.get("screen").height / 4,
              borderRadius: 5,
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                width: Dimensions.get("screen").width - 120,
                borderRadius: 5,
              }}
            >
              <View
                style={{
                  backgroundColor: "#f6f6f6",
                  borderRadius: 5,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    marginTop: 12,
                    marginBottom: 15,
                  }}
                  size="title"
                  type="bold"
                >
                  {t("LoginFirst")}
                </Text>
                <Pressable
                  onPress={() => setModalLogin(false)}
                  style={{
                    height: 50,
                    width: 55,
                    position: "absolute",
                    right: 0,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Xgray width={15} height={15} />
                </Pressable>
              </View>
              <View
                style={{
                  alignItems: "center",
                  marginHorizontal: 30,
                  marginBottom: 15,
                  marginTop: 12,
                }}
              >
                <Text style={{ marginBottom: 5 }} size="title" type="bold">
                  {t("nextLogin")}
                </Text>
                <Text
                  style={{ textAlign: "center", lineHeight: 18 }}
                  size="label"
                  type="regular"
                >
                  {t("textLogin")}
                </Text>
              </View>
              <View style={{ marginHorizontal: 30, marginBottom: 30 }}>
                <Button
                  style={{ marginBottom: 5 }}
                  onPress={() => {
                    setModalLogin(false);
                    props.navigation.push("AuthStack", {
                      screen: "LoginScreen",
                    });
                  }}
                  type="icon"
                  text={t("signin")}
                ></Button>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    marginVertical: 5,
                  }}
                >
                  <View
                    style={{
                      width: 50,
                      borderBottomWidth: 1,
                      borderBottomColor: "#d1d1d1",
                      marginHorizontal: 10,
                    }}
                  ></View>
                  <Text style={{ alignSelf: "flex-end", marginVertical: 10 }}>
                    {t("or")}
                  </Text>
                  <View
                    style={{
                      width: 50,
                      borderBottomWidth: 1,
                      borderBottomColor: "#d1d1d1",
                      marginHorizontal: 10,
                    }}
                  ></View>
                </View>
                <View style={{ alignItems: "center" }}>
                  <Text
                    size="label"
                    type="bold"
                    style={{ color: "#209FAE" }}
                    onPress={() => {
                      setModalLogin(false);
                      props.navigation.push("AuthStack", {
                        screen: "RegisterScreen",
                      });
                    }}
                  >
                    {t("createAkunLogin")}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal Menu user */}

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
                  // height: 50,
                  justifyContent: "center",
                }}
              >
                <Text size="title" type="bold" style={{ marginVertical: 15 }}>
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
                  // height: 50,
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
                <Text
                  size="label"
                  type="regular"
                  style={{ marginVertical: 15 }}
                >
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
                <Text
                  size="label"
                  type="regular"
                  style={{ marginVertical: 15 }}
                >
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
                <Text
                  size="label"
                  type="regular"
                  style={{ marginVertical: 15 }}
                >
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
                            token: props.route.params.token,
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
                <Text
                  size="label"
                  type="regular"
                  style={{ marginVertical: 15 }}
                >
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

        {/* Modal Menu Another */}

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
              marginTop: Dimensions.get("screen").height / 3,
              borderRadius: 5,
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
                <Text
                  size="label"
                  type="regular"
                  style={{ marginVertical: 15 }}
                >
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
                <Text
                  size="label"
                  type="regular"
                  style={{ marginVertical: 15 }}
                >
                  {t("copyLink")}
                </Text>
              </TouchableOpacity>
              {datasFollow &&
              selectedOption &&
              selectedOption.user &&
              datasFollow.findIndex(
                (k) => k["id"] == selectedOption?.user?.id
              ) == -1 ? (
                <TouchableOpacity
                  style={{
                    alignItems: "center",
                    borderBottomColor: "#d1d1d1",
                    borderBottomWidth: 1,
                  }}
                  // onPress={() => _follow(selectedOption.user.id)}
                  onPress={() => {
                    setModalmenuother(false);
                    setmodalConfUnFollow(true);
                  }}
                >
                  <Text
                    size="label"
                    type="regular"
                    style={{ marginTop: 15, marginBottom: 18 }}
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
                  // onPress={() => _unfollow(selectedOption.user.id)}
                  onPress={() => {
                    setModalmenuother(false);
                    setmodalConfUnFollow(true);
                  }}
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
                  text={t("delete_posting")}
                ></Button>
                <Button
                  onPress={() => {
                    setModalhapus(false);
                    setModalmenu(true);
                  }}
                  style={{ marginVertical: 5 }}
                  variant="transparent"
                  text={t("discard")}
                ></Button>
              </View>
            </View>
          </View>
        </Modal>
      </View>

      {loaded ? (
        <View
          style={{
            backgroundColor: "#FFF",
            width: Dimensions.get("screen").width - 20,
            marginHorizontal: 10,
            borderRadius: 5,
            marginTop: 10,
            paddingHorizontal: 15,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {loadingMutationPost ? (
            <>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    position: "absolute",
                    left: 10,
                    width: 40,
                    height: 40,
                    borderRadius: 40,
                    backgroundColor: "#DAF0F2",
                  }}
                />
                <Progress.Circle
                  size={60}
                  color={"#209fae"}
                  progress={timePercentage}
                  indeterminateAnimationDuration={500}
                  borderWidth={6}
                  thickness={5}
                  borderColor={"#DAF0F2"}
                  direction="clockwise"
                  showsText={true}
                  textStyle={{
                    fontSize: 14,
                    fontFamily: "Lato-Regular",
                    fontWeight: "bold",
                  }}
                  strokeCap={"square"}
                  style={{ marginVertical: 10 }}
                />
                <View style={{ marginLeft: 10 }}>
                  <Text type={"bold"} size={"label"}>
                    Uploading photo
                  </Text>
                  <Text>
                    {count}/{countLeft} photos
                  </Text>
                </View>
              </View>
              <View
                style={{
                  backgroundColor: "#F6F6F6",
                  width: 22,
                  height: 22,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 20,
                  borderColor: "#E9E9E9",
                  borderWidth: 1,
                }}
              >
                <Xgray width={12} height={12} />
              </View>
              {uploadFailed ? (
                <>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Errorr
                      height="40"
                      width="40"
                      style={{ marginVertical: 20 }}
                    />
                    <Text
                      style={{ marginLeft: 15 }}
                      size="label"
                      type="regular"
                    >
                      {t("uploadFailed")}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                      onPress={() => createPost()}
                      style={{
                        backgroundColor: "#209FAE",
                        padding: 7,
                        borderRadius: 5,
                      }}
                    >
                      <Text
                        style={{ color: "#FFF" }}
                        size="label"
                        type="regular"
                      >
                        {t("reupload")}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setUploadFailed(false)}
                      style={{
                        backgroundColor: "#d1d1d1",
                        padding: 7,
                        borderRadius: 5,
                        marginLeft: 10,
                      }}
                    >
                      <Text
                        style={{ color: "#FFF" }}
                        size="label"
                        type="regular"
                      >
                        {t("cancel")}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : null}
            </>
          ) : (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <AcceptNotif
                height="40"
                width="40"
                style={{ marginVertical: 20 }}
              />
              <Text style={{ marginLeft: 15 }} size="label" type="regular">
                {t("uploaded")}
              </Text>
            </View>
          )}
        </View>
      ) : null}

      <FlatList
        ref={ref}
        data={dataFeed}
        onViewableItemsChanged={onViewRef?.current}
        viewabilityConfig={viewConfigRef?.current}
        renderItem={({ item, index }) => (
          <View
            style={{
              width: Dimensions.get("window").width - 20,
              backgroundColor: "#FFFFFF",
              marginHorizontal: 10,
              marginTop: Platform.OS === "ios" ? 0 : -5,
              // marginVertical: 5,
              marginBottom: 15,
              borderRadius: 20,
              borderBottomWidth: 1,
              borderBottomColor: "#EEEEEE",
            }}
            key={item.id}
          >
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                marginVertical: 15,
                // justifyContent: 'space-evenly',
                alignContent: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  flex: 1,
                  overflow: "hidden",
                }}
              >
                <FunImage
                  size="xs"
                  isTouchable
                  style={{
                    height: 40,
                    width: 40,
                    borderRadius: 20,
                    alignSelf: "center",
                    marginLeft: 15,
                  }}
                  onPress={() => {
                    item.node.user.id !== setting?.user?.id
                      ? props.navigation.push("ProfileStack", {
                          screen: "otherprofile",
                          params: {
                            idUser: item.node.user.id,
                          },
                        })
                      : props.navigation.push("ProfileStack", {
                          screen: "ProfileTab",
                          params: {
                            token: token,
                          },
                        });
                  }}
                  source={{ uri: item.node.user.picture }}
                />
                <View
                  style={{
                    justifyContent: "center",
                    marginHorizontal: 10,
                  }}
                >
                  <Text
                    onPress={() => {
                      item.node.user.id !== setting?.user?.id
                        ? props.navigation.push("ProfileStack", {
                            screen: "otherprofile",
                            params: {
                              idUser: item.node.user.id,
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
                    type="bold"
                    style={{
                      flexWrap: "wrap",
                      // marginTop: 7,
                    }}
                  >
                    {item.node.user.first_name}{" "}
                    {item.node.user.first_name
                      ? item.node.user.last_name
                      : null}
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
                      {duration(item.node.created_at)}
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
                        }}
                      >
                        <Truncate text={item.node.location_name} length={40} />
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => OptionOpen(item.node, index, setting)}
                style={{
                  width: 50,
                  alignItems: "center",
                  justifyContent: "center",
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
                // height:  Dimensions.get("window").width - 40,
                // minHeight: Dimensions.get("window").width - 155,
                // borderWidth: 0.5,
                borderColor: "#EEEEEE",
                borderRadius: 15,
              }}
            >
              {item.node.is_single == false ? (
                <RenderAlbum
                  data={item.node}
                  props={props}
                  play={play}
                  muted={muted}
                  isFocused={isFocused}
                  setMuted={(e) => setMuted(e)}
                  token={token}
                  setModalLogin={(e) => setModalLogin(e)}
                />
              ) : (
                <RenderSinglePhoto
                  data={item.node}
                  props={props}
                  play={play}
                  muted={muted}
                  setMuted={(e) => setMuted(e)}
                  isFocused={isFocused}
                  token={token}
                />
              )}
            </View>

            <View
              style={{
                width: "100%",
                backgroundColor: "white",
                marginTop: 17,
                borderRadius: 20,
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
                        duration(item.node.created_at)
                      )
                    }
                    type="icon"
                    variant="transparent"
                    position="left"
                    size="small"
                    style={{
                      paddingHorizontal: 2,
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
                    // props.navigation.push("FeedStack", {
                    //   screen: "SendPost",
                    //   params: {
                    //     post: item.node,
                    //   },
                    // })
                    props.navigation.navigate("ChatStack", {
                      screen: "SendToChat",
                      params: {
                        dataSend: {
                          id: item.node?.id,
                          assets: item.node?.assets,
                          caption: item.node?.caption,
                          user: item.node?.user,
                          media_orientation: item.node?.media_orientation,
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
              >
                {item.node.itinerary !== null ? (
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
                          {item.node.itinerary.name}
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
                            Trip
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
        style={{
          paddingVertical: 7,
        }}
        contentContainerStyle={{ flexGrow: 1 }}
        // initialNumToRender={7}
        keyExtractor={(item, index) => {
          item.cursor + toString(index);
        }}
        // extraData={liked}
        refreshing={refreshing}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => Refresh()} />
        }
        ListFooterComponent={
          loadingPost ? (
            <View
              style={{
                // position: 'absolute',
                // bottom:0,
                width: width,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 30,
              }}
            >
              <ActivityIndicator
                animating={loadingPost}
                size="large"
                color="#209fae"
              />
            </View>
          ) : null
        }
        initialNumToRender={10}
        onEndReachedThreshold={1}
        onEndReached={handleOnEndReached}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  main: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "grey",
  },
  fab: {
    position: "absolute",
    bottom: 5,
    right: 10,
  },
});
