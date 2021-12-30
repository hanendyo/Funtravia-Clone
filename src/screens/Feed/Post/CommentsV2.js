import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Alert,
  TextInput,
  Pressable,
  Keyboard,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
  KeyboardAvoidingView,
  BackHandler,
  Platform,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Modal from "react-native-modal";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import CommentList from "../../../graphQL/Query/Feed/CommentList";
import commentpost from "../../../graphQL/Mutation/Post/commentpost";
import {
  Text,
  Button,
  shareAction,
  FunImage,
  CopyLink,
  PagenotFound,
  ModalLogin,
} from "../../../component";
import {
  LikeRed,
  Send_to,
  More,
  LikeBlack,
  CommentBlack,
  Arrowbackwhite,
  Xgray,
  Arrowbackios,
} from "../../../assets/svg";
import { Bg_soon } from "../../../assets/svg";
import { gql } from "apollo-boost";
import ReadMore from "react-native-read-more-text";
import RenderAlbum from "../RenderAlbumItinerary";
import RenderSinglePhoto from "../RenderSinglePhoto";
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
import UnfollowMut from "../../../graphQL/Mutation/Profile/UnfollowMut";
import FollowingQuery from "../../../graphQL/Query/Profile/Following";
import FollowMut from "../../../graphQL/Mutation/Profile/FollowMut";
import { useIsFocused } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import FeedByID from "../../../graphQL/Query/Feed/FeedByID";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { RNToasty } from "react-native-toasty";
import DeviceInfo from "react-native-device-info";
import likepost from "../../../graphQL/Mutation/Post/likepost";
import unlikepost from "../../../graphQL/Mutation/Post/unlikepost";
import normalize from "react-native-normalize";
import Ripple from "react-native-material-ripple";
import ViewMoreText from "react-native-view-more-text";
import RemoveAlbum from "../../../graphQL/Mutation/Album/RemoveAlbum";
import { useSelector } from "react-redux";

export default function Comments(props) {
  const Notch = DeviceInfo.hasNotch();
  const tokenApps = useSelector((data) => data.token);
  const { t, i18n } = useTranslation();
  const [dataPost, setDataPost] = useState(null);
  const [dataComment, setDataComment] = useState();
  const [setting, setSetting] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [modalMenu, setModalMenu] = useState(false);
  const [modalMenuOther, setModalMenuOther] = useState(false);
  const [modalHapus, setModalHapus] = useState(false);
  const [datasFollow, setDatasFollow] = useState();
  const [modalLogin, setModalLogin] = useState(false);
  const [soon, setSoon] = useState(false);

  let [selectedOption, SetOption] = useState({});
  let slider = useRef();
  let isFocused = useIsFocused(true);
  let [muted, setMuted] = useState(true);
  let [indeks, setIndeks] = useState(0);
  let [selected, setSelected] = useState(new Map());
  let [statusText, setStatusText] = useState("");
  let [idComment, setIdComment] = useState("");
  let [idPost, setIdPost] = useState("");
  const [play, setPlay] = useState();

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
            index: 1,
            datadayaktif: data.day,
          },
        })
      : setModalLogin(true);
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

  const onViewRef = React.useRef(({ viewableItems, changed }) => {
    if (viewableItems) {
      setPlay(viewableItems[0]?.key);
    }
  });

  const viewConfigRef = React.useRef({
    viewAreaCoveragePercentThreshold: 50,
  });

  const HeaderComponent = {
    headerShown: true,
    transparent: false,
    headerTintColor: "white",
    headerTitle: (
      <Text type="bold" size="header" style={{ color: "#fff" }}>
        {t("comments")}
      </Text>
    ),
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
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
          marginLeft: 5,
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

  const loadAsync = async () => {
    if (!props.route.params.data) {
      await GetPost();
    }
    await GetCommentList();
    await LoadFollowing();
    await scroll_to_index();
    let setsetting = await AsyncStorage.getItem("setting");
    setSetting(JSON.parse(setsetting));
  };

  // const backAction = () => {
  //   props.navigation.goBack();
  //   return true;
  // };

  // useEffect(() => {
  //   BackHandler.addEventListener("hardwareBackPress", backAction);
  //   return () =>
  //     BackHandler.removeEventListener("hardwareBackPress", backAction);
  // }, [backAction]);

  // useEffect(() => {
  //   props.navigation.addListener("blur", () => {
  //     BackHandler.removeEventListener("hardwareBackPress", backAction);
  //   });
  // }, [backAction]);

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    if (props?.route?.params?.data) {
      setDataPost({ ...props?.route?.params?.data });
      setIdPost(props?.route?.params?.data?.id);
    } else {
      setIdComment(props?.route?.params?.comment_id);
      setIdPost(props?.route?.params?.post_id);
    }
    const unsubscribe = props.navigation.addListener("focus", async () => {
      loadAsync();
      // Refresh();
    });
    // viewcomment;
    return unsubscribe;
  }, []);

  const [
    GetCommentList,
    {
      data: queryDataComment,
      loading: queryLoadingComment,
      error: queryErrorComment,
    },
  ] = useLazyQuery(CommentList, {
    fetchPolicy: "network-only",
    variables: { post_id: idPost },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenApps,
      },
    },
    onCompleted: async () => {
      setDataComment(queryDataComment?.comment);
      let temps = { ...queryDataComment };
      let index = temps.comment.findIndex((k) => k["id"] === idComment);
      await setIndeks(index);
      await scroll_to_index(index);
    },
  });

  const [
    GetPost,
    { data: queryDataPost, loading: queryLoadingPost, error: queryErrorPost },
  ] = useLazyQuery(FeedByID, {
    fetchPolicy: "network-only",
    variables: { post_id: idPost },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenApps,
      },
    },
    onCompleted: async () => {
      setDataPost(queryDataPost?.feed_post_byid);
    },
  });

  const [
    LoadFollowing,
    { data: dataFollow, loading: loadingFollow, error: errorFollow },
  ] = useLazyQuery(FollowingQuery, {
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenApps,
      },
    },
    onCompleted: async () => {
      setDatasFollow(dataFollow.user_following);
    },
  });

  const scroll_to = () => {
    if (slider?.current) {
      setTimeout(() => {
        slider?.current?.scrollToEnd();
      }, 1000);
    }
  };

  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  const scroll_to_index = (indeks) => {
    if (indeks >= 0) {
      if (slider != null && slider.current) {
        setTimeout(() => {
          if (slider != null && slider.current) {
            slider.current.scrollToIndex({ index: indeks });
          }
        }, 1000);
      } else {
        setIndeks(0);
      }
    }
  };

  const duration = (datetime) => {
    // datetime = datetime.replace(" ", "T");
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

  const OptionOpen = (data) => {
    let tempData = { ...data };
    tempData.index = props?.route?.params.indeks;
    SetOption(tempData);
    if (dataPost?.user?.id == setting?.user?.id) {
      setModalMenu(true);
    } else {
      setModalMenuOther(true);
    }
  };

  const ReadMorehendle = (handlePress) => {
    return (
      <Text
        onPress={handlePress}
        type="bold"
        style={{
          color: "#209fae",
          marginTop: 5,
        }}
      >
        {t("readMore")}
      </Text>
    );
  };

  const ReadLesshendle = (handlePress) => {
    return <View />;
  };

  const Item = ({ dataComment }) => {
    return (
      <View
        style={{
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#EEEEEE",
          paddingHorizontal: 15,
          paddingVertical: 10,
          // borderRadius: 20,
          bottom: 3,
        }}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignContent: "center",
          }}
        >
          <Pressable
            onPress={() => {
              tokenApps
                ? dataComment?.user?.id !== setting?.user?.id
                  ? props.navigation.push("ProfileStack", {
                      screen: "otherprofile",
                      params: {
                        idUser: dataComment?.user?.id,
                      },
                    })
                  : props.navigation.push("ProfileStack", {
                      screen: "ProfileTab",
                      params: { token: tokenApps },
                    })
                : setModalLogin(true);
            }}
            style={{
              flexDirection: "row",
            }}
          >
            <FunImage
              size="xs"
              isTouchable
              style={{
                height: 35,
                width: 35,
                borderRadius: 20,
                alignSelf: "center",
                resizeMode: "cover",
              }}
              source={{ uri: dataComment?.user?.picture }}
            />
            <View
              style={{
                justifyContent: "center",
                marginHorizontal: 10,
              }}
            >
              <Text size="label" type="bold">
                {dataComment?.user?.first_name} {dataComment?.user?.last_name}
              </Text>
              {dataComment?.is_send == false ? (
                <Text size={"small"} type="regular">
                  Loading...
                </Text>
              ) : (
                <Text size={"small"} type="regular">
                  {duration(dataComment?.created_at)}
                </Text>
              )}
            </View>
          </Pressable>
        </View>
        <View
          style={{
            width: "85%",
            marginVertical: 5,
            marginLeft: 45,
          }}
        >
          <Text
            style={{
              textAlign: "left",
            }}
          >
            {dataComment?.text}
          </Text>
        </View>
      </View>
    );
  };

  const Refresh = React.useCallback(() => {
    setRefreshing(true);
    GetPost();
    wait(1000).then(() => {
      setRefreshing(false);
    });
  }, []);

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
    setModalHapus(false);
    setModalMenu(false);

    if (tokenApps) {
      try {
        let response = await Mutationdeletepost({
          variables: {
            post_id: dataPost.id,
          },
        });

        if (response.data) {
          if (response.data.delete_post.code == 200) {
            // props.navigation.goBack();
            props.navigation.navigate("BottomStack", {
              screen: "FeedBottomScreen",
              params: {
                screen: "FeedScreen",
                params: {
                  isItinerary: true,
                  // caption: caption,
                  // latitude: latitude,
                  // longitude: longitude,
                  // location_name: location_name,
                  // albums_id: albums_id,
                  // itinerary_id: itinerary_id,
                  // day_id: day_id,
                  // oriented: oriented,
                  // assets: assets,
                },
              },
            });
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
      RNToasty.Show({
        title: "Please Login",
        position: "bottom",
      });
    }
  };

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

  const _liked = async (id) => {
    if (!tokenApps) {
      setModalLogin(true);
    } else {
      let tmpData = { ...dataPost };
      tmpData.liked = true;
      tmpData.response_count = tmpData.response_count + 1;
      setDataPost(tmpData);
      if (!props.route.params._liked) {
        try {
          let response = await MutationLike({
            variables: {
              post_id: id,
            },
          });
          if (response.data) {
            if (
              response.data.like_post.code === 200 ||
              response.data.like_post.code === "200"
            ) {
            } else {
              throw new Error(response.data.delete_post.message);
            }
          }
        } catch (error) {
          let tmpData = { ...dataPost };

          tmpData.liked = false;
          tmpData.response_count = tmpData.response_count - 1;
          setDataPost(tmpData);
        }
      } else {
        props.route.params._liked(dataPost?.id, props.route.params.indeks);
      }
    }
  };

  const _unliked = async (id) => {
    if (!tokenApps) {
      setModalLogin(true);
    } else {
      let tmpData = { ...dataPost };
      tmpData.liked = false;
      tmpData.response_count = tmpData.response_count - 1;
      setDataPost(tmpData);
      if (!props.route.params._unliked) {
        try {
          let response = await MutationunLike({
            variables: {
              post_id: id,
            },
          });

          if (response.data) {
            if (
              response.data.unlike_post.code === 200 ||
              response.data.unlike_post.code === "200"
            ) {
            } else {
              throw new Error(response.data.unlike_post.message);
            }
          }
        } catch (error) {
          tmpData.liked = true;
          tmpData.response_count = tmpData.response_count + 1;
          setDataPost(tmpData);
        }
      } else {
        props.route.params._unliked(dataPost?.id, props.route.params.indeks);
      }
    }
  };

  const create_UUID = () => {
    var dt = new Date().getTime();
    var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(
      c
    ) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uuid;
  };

  const [
    MutationComment,
    { loading: loadingcmnt, data: datacmnt, error: errorcmnt },
  ] = useMutation(commentpost, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenApps,
      },
    },
  });

  const comment = async (id, text) => {
    if (tokenApps) {
      if (text !== "") {
        let gen_uuid = create_UUID();
        let tempData = [...dataComment];
        let pushcomment = {
          created_at: "",
          id: gen_uuid,
          text: text,
          updated_at: "",
          user: {
            id: setting?.user?.id,
            first_name: setting?.user?.first_name,
            last_name: setting?.user?.last_name,
            picture: setting?.user?.picture,
            username: setting?.user?.username,
          },
          is_send: false,
        };
        tempData.push(pushcomment);
        await setDataComment(tempData);
        let idx = tempData.length - 1;
        Keyboard.dismiss();
        setStatusText("");
        try {
          let response = await MutationComment({
            variables: {
              post_id: id,
              text: text,
            },
          });

          if (response.data) {
            if (response.data.comment_post.code === 200) {
              const tempData = [...dataComment];
              const tempDataPost = { ...dataPost };
              dataPost.comment_count = dataPost.comment_count + 1;
              tempData[idx] = response.data.comment_post.data;
              tempData[idx].is_send = true;
              setDataComment(tempData);
              scroll_to();
              try {
                if (props?.route?.params && props?.route?.params?.countKoment) {
                  props?.route?.params?.countKoment(tempDataPost.id);
                }
              } catch (err) {
                console.warn(err);
              }
            } else {
              console.warn(response.data.comment_post.message);
            }
          }
        } catch (error) {
          console.log(
            "🚀 ~ file: CommentsV2.js ~ line 708 ~ comment ~ error",
            error
          );
          tempData.splice(idx, 1);
          setDataComment(tempData);
          RNToasty.Show({
            title: t("failedCommentTPost"),
            position: "bottom",
          });
        }
      } else {
        RNToasty.Show({
          title: t("messagesEmpty"),
          position: "bottom",
        });
      }
    } else {
      setModalLogin(true);
    }
  };

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

  const _unfollow = async (id, status) => {
    setModalMenuOther(false);

    if (tokenApps) {
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
        RNToasty.Show({
          title: "Gagal unfollow",
          position: "bottom",
        });
      }
    } else {
      RNToasty.Show({
        title: "Please Login",
        position: "bottom",
      });
    }
  };

  const _follow = async (id, status) => {
    setModalMenuOther(false);
    if (tokenApps) {
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
        RNToasty.Show({
          title: "Gagal follow",
          position: "bottom",
        });
      }
    } else {
      RNToasty.Show({
        title: "Please Login",
        position: "bottom",
      });
    }
  };

  const [
    MutationRemoveAlbum,
    { loading: loadingALbum, data: dataAlbum, error: errorAlbum },
  ] = useMutation(RemoveAlbum, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenApps,
      },
    },
  });

  const removeTagAlbum = async (post_id, album_id) => {
    try {
      let response = await MutationRemoveAlbum({
        variables: {
          album_id: album_id,
          post_id: post_id,
        },
      });
      if (response.data.remove_albums_post.code == 200) {
        setModalMenu(false);
        GetPost();
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

  if (queryLoadingPost) {
    return (
      <SkeletonPlaceholder
        speed={1000}
        // backgroundColor="#FFFFFF"
        // highlightColor="#D1D1D1"
      >
        <SkeletonPlaceholder.Item
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          marginVertical={10}
          marginHorizontal={15}
        >
          <SkeletonPlaceholder.Item flexDirection="row">
            <SkeletonPlaceholder.Item
              width={40}
              height={40}
              borderRadius={20}
            />
            <SkeletonPlaceholder.Item marginLeft={20}>
              <SkeletonPlaceholder.Item
                width={120}
                height={15}
                borderRadius={4}
              />
              <SkeletonPlaceholder.Item
                marginTop={6}
                width={80}
                height={15}
                borderRadius={4}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
          <SkeletonPlaceholder.Item width={30} height={15} borderRadius={4} />
        </SkeletonPlaceholder.Item>
        <SkeletonPlaceholder.Item
          marginHorizontal={15}
          alignContent="center"
          justifyContent="center"
          width={Dimensions.get("window").width - 30}
          minHeight={Dimensions.get("window").width - 155}
          borderRadius={15}
        ></SkeletonPlaceholder.Item>
        <SkeletonPlaceholder.Item
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          marginVertical={10}
          marginHorizontal={15}
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
          <SkeletonPlaceholder.Item width={50} height={25} borderRadius={20} />
        </SkeletonPlaceholder.Item>
        <SkeletonPlaceholder.Item marginLeft={20}>
          <SkeletonPlaceholder.Item
            width={Dimensions.get("window").width - 30}
            height={15}
            borderRadius={4}
          />
          <SkeletonPlaceholder.Item
            width={Dimensions.get("window").width - 30}
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
      </SkeletonPlaceholder>
    );
  }

  if (queryErrorPost) {
    return <PagenotFound props={props} />;
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F6F6F6",
        justifyContent: "space-between",
      }}
    >
      <ModalLogin
        modalLogin={modalLogin}
        setModalLogin={() => setModalLogin(false)}
        props={props}
      />
      <Modal
        useNativeDriver={true}
        visible={soon}
        onRequestClose={() => setSoon(false)}
        transparent={true}
        animationType="fade"
      >
        <Pressable
          style={{
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
            justifyContent: "center",
            opacity: 0.7,
            backgroundColor: "#000",
            position: "absolute",
            alignSelf: "center",
          }}
        ></Pressable>
        <View
          style={{
            width: Dimensions.get("screen").width - 100,
            height: Dimensions.get("screen").width - 180,
            marginHorizontal: 50,
            backgroundColor: "#FFF",
            zIndex: 15,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            alignSelf: "center",
            marginTop: Dimensions.get("screen").height / 10,
            borderRadius: 5,
          }}
        >
          <View
            style={{
              padding: 20,
              paddingHorizontal: 20,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 10,
            }}
          >
            <Image
              source={Bg_soon}
              style={{
                height: Dimensions.get("screen").width - 180,
                width: Dimensions.get("screen").width - 110,
                borderRadius: 10,
                position: "absolute",
              }}
            />
            <Text type="bold" size="h5">
              {t("comingSoon")}!
            </Text>
            <Text type="regular" size="label" style={{ marginTop: 5 }}>
              {t("soonUpdate")}.
            </Text>
            <Button
              text={"OK"}
              style={{
                marginTop: 20,
                width: Dimensions.get("screen").width / 5,
              }}
              type="box"
              onPress={() => setSoon(false)}
            ></Button>
          </View>
        </View>
      </Modal>
      <Modal
        useNativeDriver={true}
        visible={modalMenu}
        onRequestClose={() => setModalMenu(false)}
        transparent={true}
        animationType="fade"
      >
        <Pressable
          onPress={() => setModalMenu(false)}
          style={{
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
            justifyContent: "center",
            opacity: 0.7,
            backgroundColor: "#000",
            position: "absolute",
            alignSelf: "center",
          }}
        ></Pressable>
        <View
          style={{
            width: Dimensions.get("screen").width - 100,
            marginHorizontal: 50,
            // backgroundColor: "#FFF",
            zIndex: 15,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            alignSelf: "center",
            marginTop: Dimensions.get("screen").height / 10,
            borderRadius: 5,
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
                borderBottomColor: "#d1d1d1",
                alignItems: "center",
                backgroundColor: "#f6f6f6",
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
              }}
            >
              <Text style={{ marginVertical: 15 }} type="bold" size="title">
                {t("option")}
              </Text>
            </View>
            <Pressable
              onPress={() => setModalMenu(false)}
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
                borderBottomWidth: 1,
                borderBottomColor: "#d1d1d1",
              }}
              onPress={() => {
                setModalMenu(false);
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
                borderBottomColor: "#d1d1d1",
              }}
              onPress={() => {
                setModalMenu(false);
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
            <TouchableOpacity
              style={{
                alignItems: "center",
                borderBottomWidth: 1,
                borderBottomColor: "#d1d1d1",
              }}
              onPress={() => {
                setModalMenu(false),
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
            {selectedOption?.album ? (
              <TouchableOpacity
                style={{
                  alignItems: "center",
                  borderBottomWidth: 1,
                  borderColor: "#d1d1d1",
                }}
                onPress={() =>
                  removeTagAlbum(dataPost?.id, dataPost?.album?.id)
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
                  setModalMenu(false),
                    tokenApps
                      ? props.navigation.push("FeedStack", {
                          screen: "CreateListAlbum",
                          params: {
                            user_id: setting?.user_id,
                            token: tokenApps,
                            file: "",
                            type: "",
                            location: "",
                            isAlbum: true,
                            post_id: selectedOption?.id,
                            from: "comment",
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
                setModalHapus(true);
                setModalMenu(false);
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
        visible={modalMenuOther}
        onRequestClose={() => setModalMenuOther(false)}
        transparent={true}
        animationType="fade"
      >
        <Pressable
          onPress={() => setModalMenuOther(false)}
          style={{
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
            justifyContent: "center",
            opacity: 0.7,
            backgroundColor: "#000",
            position: "absolute",
            alignSelf: "center",
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
            alignSelf: "center",
            borderRadius: 5,
            marginTop: Dimensions.get("screen").height / 10,
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
                borderBottomColor: "#d1d1d1",
                alignItems: "center",
                backgroundColor: "#f6f6f6",
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
              }}
            >
              <Text style={{ marginVertical: 15 }} size="title" type="bold">
                {t("option")}
              </Text>
            </View>
            <Pressable
              onPress={() => setModalMenuOther(false)}
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
                borderBottomWidth: 1,
                borderBottomColor: "#d1d1d1",
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
                borderBottomWidth: 1,
                borderBottomColor: "#d1d1d1",
              }}
              onPress={() => {
                setModalMenuOther(false);
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
                }}
                onPress={() => _follow(selectedOption.user.id)}
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

      <Modal
        useNativeDriver={true}
        visible={modalHapus}
        onRequestClose={() => setModalHapus(false)}
        transparent={true}
        animationType="fade"
      >
        <Pressable
          onPress={() => setModalHapus(false)}
          style={{
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
            justifyContent: "center",
            opacity: 0.7,
            backgroundColor: "#000",
            position: "absolute",
            alignSelf: "center",
          }}
        />
        <View
          style={{
            width: Dimensions.get("screen").width - 140,
            marginHorizontal: 50,
            backgroundColor: "#FFF",
            zIndex: 15,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            alignContent: "center",
            borderRadius: 5,
            marginTop: Dimensions.get("screen").height / 20,
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
                  setModalHapus(false);
                  setModalMenu(true);
                }}
                style={{ marginVertical: 5 }}
                variant="transparent"
                text={t("discard")}
              ></Button>
            </View>
          </View>
        </View>
      </Modal>

      <FlatList
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
        onScrollToIndexFailed={() => scroll_to_index(indeks)}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
        ref={slider}
        data={dataComment}
        renderItem={({ item }) => {
          return <Item dataComment={item} />;
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => Refresh()} />
        }
        keyExtractor={(item) => item.id}
        extraData={selected}
        contentContainerStyle={{
          backgroundColor: "#FFFFFF",
          marginHorizontal: 10,
          marginTop: 10,
          borderTopStartRadius: 15,
          borderTopEndRadius: 15,
          minHeight: Dimensions.get("window").height - 70,
        }}
        ListHeaderComponent={
          dataPost == null && queryLoadingPost ? (
            <ActivityIndicator animating={true} size="large" color="#209fae" />
          ) : (
            <>
              <View
                style={{
                  width: Dimensions.get("window").width - 40,
                  flexDirection: "row",
                  marginVertical: 10,
                  paddingHorizontal: 15,
                  alignContent: "center",
                }}
              >
                <Pressable
                  onPress={() => {
                    tokenApps
                      ? dataPost?.user?.id !== setting?.user?.id
                        ? props.navigation.push("ProfileStack", {
                            screen: "otherprofile",
                            params: {
                              idUser: dataPost?.user?.id,
                            },
                          })
                        : props.navigation.push("ProfileStack", {
                            screen: "ProfileTab",
                            // params: { idUser: dataPost?.user?.id },
                          })
                      : setModalLogin(true);
                  }}
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <FunImage
                    size="xs"
                    isTouchable
                    style={{
                      height: 40,
                      width: 40,
                      borderRadius: 18,
                      alignSelf: "center",
                      resizeMode: "cover",
                    }}
                    source={{
                      uri: dataPost?.user?.picture,
                    }}
                  />
                  <View
                    style={{
                      justifyContent: "center",
                      marginHorizontal: 10,
                      maxWidth: "80%",
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      type={"bold"}
                      size="title"
                      style={{}}
                    >
                      {dataPost?.user?.first_name}{" "}
                      {dataPost?.user?.first_name
                        ? dataPost?.user?.last_name
                        : ""}
                    </Text>
                    <Text size={"small"} style={{}}>
                      {/* {duration(dataPost?.created_at)} */}
                      {props?.route?.params?.time
                        ? props?.route?.params?.time
                        : duration(dataPost?.created_at)}
                    </Text>
                  </View>
                </Pressable>
                <TouchableOpacity
                  onPress={() => {
                    tokenApps ? OptionOpen(dataPost) : setModalLogin(true);
                  }}
                  style={{
                    position: "absolute",
                    right: 0,
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
                  width: Dimensions.get("window").width - 40,
                  minHeight: Dimensions.get("window").width - 155,
                  borderColor: "#EEEEEE",
                  borderRadius: 15,
                }}
              >
                {dataPost ? (
                  dataPost?.is_single === false ? (
                    <RenderAlbum
                      data={dataPost}
                      props={props}
                      play={play}
                      muted={muted}
                      setMuted={(e) => setMuted(e)}
                      isFocused={isFocused}
                      isComment={true}
                      index
                      token={tokenApps}
                      setModalLogin={(e) => setModalLogin(e)}
                    />
                  ) : (
                    <RenderSinglePhoto
                      data={dataPost}
                      props={props}
                      play={play}
                      muted={muted}
                      setMuted={(e) => setMuted(e)}
                      isFocused={isFocused}
                      isComment={true}
                      token={tokenApps}
                      setModalLogin={(e) => setModalLogin(e)}
                    />
                  )
                ) : null}
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
                    paddingLeft: 10,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      width: "50%",
                      alignSelf: "flex-start",
                      alignContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {dataPost?.liked ? (
                      <Button
                        onPress={() => {
                          _unliked(dataPost?.id);
                        }}
                        type="icon"
                        position="left"
                        size="small"
                        style={{
                          paddingHorizontal: 10,
                          marginRight: 15,
                          borderRadius: 16,
                          backgroundColor: "#F2DAE5",
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
                          {dataPost?.response_count}
                        </Text>
                      </Button>
                    ) : (
                      <Button
                        // onPress={() => _liked(dataPost?.id)}
                        onPress={() => {
                          _liked(dataPost?.id);
                        }}
                        type="icon"
                        position="left"
                        size="small"
                        color="tertiary"
                        style={{
                          paddingHorizontal: 10,
                          marginRight: 15,
                          borderRadius: 16,
                        }}
                      >
                        <LikeBlack height={15} width={15} />
                        <Text
                          type="black"
                          size="label"
                          style={{
                            marginHorizontal: 7,
                          }}
                        >
                          {dataPost?.response_count}
                        </Text>
                      </Button>
                    )}

                    <Button
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
                        style={{
                          marginHorizontal: 7,
                        }}
                      >
                        {dataPost?.comment_count}
                      </Text>
                    </Button>
                  </View>

                  <Button
                    onPress={() =>
                      // props.navigation.push("FeedStack", {
                      //   screen: "SendPost",
                      //   params: {
                      //     post: dataPost,
                      //   },
                      // })
                      tokenApps
                        ? props.navigation.navigate("ChatStack", {
                            screen: "SendToChat",
                            params: {
                              dataSend: {
                                id: dataPost?.id,
                                assets: dataPost?.assets,
                                caption: dataPost?.caption,
                                user: dataPost?.user,
                                media_orientation: dataPost?.media_orientation,
                              },
                              title: "Post",
                              tag_type: "tag_post",
                            },
                          })
                        : setModalLogin(true)
                    }
                    type="icon"
                    variant="transparent"
                    // position="left"
                    size="small"
                  >
                    <Send_to height={17} width={17} />
                  </Button>
                </View>
                <View
                  style={{
                    width: "100%",
                    padding: 10,
                    flexDirection: "row",
                  }}
                >
                  {/* {dataPost?.itinerary == false ? (
                    <View>
                      {dataPost?.itinerary !== null ? (
                        <Pressable
                          onPress={() => goToItinerary(dataPost)}
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
                            {dataPost?.itinerary?.name}
                          </Text>
                        </Pressable>
                      ) : null}
                      {dataPost?.caption ? (
                        <ReadMore
                          numberOfLines={3}
                          renderTruncatedFooter={ReadMorehendle}
                          renderRevealedFooter={ReadLesshendle}
                        >
                          <Text
                            size="label"
                            style={{
                              textAlign: "left",
                              lineHeight: 20,
                            }}
                          >
                            {dataPost?.caption}
                          </Text>
                        </ReadMore>
                      ) : null}
                    </View>
                  ) : dataPost?.caption ? (
                    <ReadMore
                      numberOfLines={3}
                      renderTruncatedFooter={ReadMorehendle}
                      renderRevealedFooter={ReadLesshendle}
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
                          {dataPost?.user?.first_name}{" "}
                          {dataPost?.user?.first_name
                            ? dataPost?.user?.last_name
                            : null}{" "}
                        </Text>
                        {dataPost?.caption}
                      </Text>
                    </ReadMore>
                  ) : null} */}
                  {dataPost?.album && dataPost?.album?.itinerary !== null ? (
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
                          onPress={() => goToItinerary(dataPost)}
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            flexWrap: "wrap",
                            alignItems: "center",
                          }}
                        >
                          <Text size="label" type="bold" style>
                            {dataPost?.album?.itinerary?.name}
                          </Text>
                          <Ripple
                            onPress={() => goToItinerary(dataPost)}
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
                      {dataPost?.caption ? (
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
                            {dataPost?.caption}
                          </Text>
                        </ViewMoreText>
                      ) : null}
                    </View>
                  ) : dataPost?.caption ? (
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
                            {dataPost?.user?.first_name}{" "}
                            {dataPost?.user?.first_name
                              ? dataPost?.user?.last_name
                              : null}{" "}
                          </Text>
                          {dataPost?.caption}
                        </Text>
                      </ViewMoreText>
                    </View>
                  ) : null}
                </View>
              </View>
            </>
          )
        }
      />

      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Notch ? 90 : 65}
        style={{
          width: Dimensions.get("window").width,

          paddingHorizontal: 10,
        }}
      >
        <View
          style={{
            backgroundColor: "#ffffff",
            borderBottomRightRadius: 15,
            borderBottomLeftRadius: 15,
            paddingVertical: 10,
            marginBottom: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              marginHorizontal: 10,
              borderRadius: 50,
              backgroundColor: "#F6F6F6",
              alignItems: "center",
              alignContent: "center",
            }}
          >
            {!statusText ? (
              <View
                style={{
                  justifyContent: "center",
                  height: "100%",
                  width: "80%",
                  position: "absolute",
                  paddingLeft: 20,
                }}
              >
                <Text
                  size="label"
                  type="regular"
                  numberOfLines={1}
                  style={{ color: "#d1d1d1" }}
                >
                  {`${t("commentAs")} ${setting?.user?.first_name} ${
                    setting?.user?.last_name ? setting?.user?.last_name : ""
                  }`}
                </Text>
              </View>
            ) : null}
            <TextInput
              allowFontScaling={false}
              multiline
              maxLength={1000}
              style={{
                width: Dimensions.get("screen").width - 150,
                // textAlignVertical: "top",
                fontSize: normalize(16),
                marginLeft: Platform.OS == "ios" ? 20 : 15,
                fontFamily: "Lato-Regular",
                maxHeight: 100,
                marginBottom: Platform.OS == "ios" ? 5 : 0,
              }}
              onChangeText={(text) => setStatusText(text)}
              onSubmitEditing={(text) => setStatusText(text)}
              value={statusText}
            />
            <Pressable
              onPress={() =>
                comment(
                  props?.route?.params?.data ? dataPost?.id : idPost,
                  statusText
                )
              }
              style={{
                flex: 1,
                height: 50,
                alignItems: "center",
                justifyContent: "center",
                marginLeft: Platform.OS == "ios" ? 20 : 15,
              }}
            >
              <Text
                allowFontScaling={false}
                size="label"
                type="bold"
                style={{
                  alignSelf: "center",
                  color: "#209fae",
                }}
              >
                {t("Send")}
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: 'grey',
  },
  captionFont: { fontSize: 12 },
});
