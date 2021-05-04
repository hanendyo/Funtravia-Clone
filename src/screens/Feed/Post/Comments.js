import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  ScrollView,
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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Modal from "react-native-modal";
import { useTranslation } from "react-i18next";
import Image from "react-native-auto-scale-image";
import { useLazyQuery, useQuery, useMutation } from "@apollo/react-hooks";
import CommentList from "../../../graphQL/Query/Feed/CommentList";
// import { NavigationEvents, SafeAreaView } from "react-navigation";
import commentpost from "../../../graphQL/Mutation/Post/commentpost";
import {
  Text,
  Button,
  FloatingInput,
  Peringatan,
  CustomImage,
  Loading,
  shareAction,
  FunImage,
  CopyLink,
} from "../../../component";
import { Toast, Root } from "native-base";
import {
  LikeRed,
  ShareBlack,
  More,
  LikeBlack,
  CommentBlack,
} from "../../../assets/svg";
import likepost from "../../../graphQL/Mutation/Post/likepost";
import unlikepost from "../../../graphQL/Mutation/Post/unlikepost";
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
let { width, height } = Dimensions.get("screen");
import { useIsFocused } from "@react-navigation/native";
import { head } from "lodash";

export default function Comments(props) {
  const HeaderComponent = {
    headerShown: true,
    transparent: false,
    headerTintColor: "white",
    headerTitle: "Comment",
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      fontFamily: "Lato-Bold",
      // fontSize: 14,
      color: "white",
    },
    // headerLeftContainerStyle: {
    // 	background: "#FFF",
    // },
    // headerRight: () => (
    // 	<View style={{ flexDirection: "row" }}>
    // 		<TouchableOpacity
    // 			style={{ marginRight: 20 }}
    // 			onPress={() => Alert.alert("Coming soon")}
    // 		>
    // 			<SearchWhite height={20} width={20} />
    // 		</TouchableOpacity>
    // 	</View>
    // ),
  };
  const [loadings, setLoading] = useState(false);
  const { t, i18n } = useTranslation();
  let [statusText, setStatusText] = useState("");
  let [selected, setSelected] = useState(new Map());
  let dataPost = React.useRef({ ...props.route.params.data });
  let [postid, setPostid] = useState(props.route.params?.data.id);
  let [token, setToken] = useState(props.route.params.token);
  let slider = useRef();
  let [setting, setSetting] = useState();
  let [modalmenu, setModalmenu] = useState(false);
  let [modalmenuother, setModalmenuother] = useState(false);
  let [modalhapus, setModalhapus] = useState(false);
  let [selectedOption, SetOption] = useState({});
  let [data_comment, SetDatacommnet] = useState([]);
  const isFocused = useIsFocused();
  let [muted, setMuted] = useState(true);

  const onSelect = useCallback(
    (id) => {
      let newSelected = new Map(selected);
      newSelected.set(id, !selected.get(id));
      setLiked(!liked);
      likeToggle(liked);
      setSelected(newSelected);
    },
    [selected]
  );

  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    setToken(tkn);

    let setsetting = await AsyncStorage.getItem("setting");
    setSetting(JSON.parse(setsetting));
  };

  const [
    MutationComment,
    { loading: loadingcmnt, data: datacmnt, error: errorcmnt },
  ] = useMutation(commentpost, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

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

  const [refreshing, setRefreshing] = useState(false);
  const Refresh = React.useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => {
      setRefreshing(false);
    });
  }, []);

  const _deletepost = async (data) => {
    console.log("data", data.current.id);
    setModalhapus(false);
    setModalmenu(false);
    if (token || token !== "") {
      try {
        let response = await Mutationdeletepost({
          variables: {
            post_id: data.current.id,
          },
        });
        // if (loadingdelete) {
        //   Alert.alert("Loading!!");
        // }
        // if (errordelete) {
        //   throw new Error("Error Input");
        // }
        if (response.data) {
          if (
            response.data.delete_post.code === 200 ||
            response.data.delete_post.code === "200"
          ) {
            props.navigation.goBack();
            // Refresh();
            // var tempData = [...datafeed];
            // var index = tempData.findIndex((k) => k['id'] === id);
            // tempData[index].liked = false;
            // tempData[index].response_count =
            // 	response.data.delete_post.count_like;
            // SetDataFeed(tempData);
          } else {
            throw new Error(response.data.delete_post.message);
          }

          // Alert.alert('Succes');
        }
      } catch (error) {
        // Alert.alert("" + error);
        Toast.show({
          text: "Failed to delete this post",
          position: "bottom",
          buttonText: "Ok",
          duration: 3000,
        });
      }
    } else {
      // tempData[index].liked = true;
      // tempData[index].response_count = tempData[index].response_count + 1;
      // SetDataFeed(tempData);
      // Alert.alert("Please Login");
      Toast.show({
        text: "Please Login",
        position: "bottom",
        buttonText: "Ok",
        duration: 3000,
      });
    }
  };

  const _liked = async (id) => {
    // SetDataFeed(tempData);
    if (token) {
      dataPost.current.liked = true;
      dataPost.current.response_count = dataPost.current.response_count + 1;
      try {
        let response = await MutationLike({
          variables: {
            post_id: id,
          },
        });
        // if (loadingLike) {
        //   Alert.alert("Loading!!");
        // }
        // if (errorLike) {
        //   throw new Error("Error Input");
        // }

        if (response.data) {
          if (
            response.data.like_post.code === 200 ||
            response.data.like_post.code === "200"
          ) {
            dataPost.current.liked = true;
          } else {
            dataPost.current.liked = false;
          }

          // Alert.alert('Succes');
        }
      } catch (error) {
        dataPost.current.liked = false;
        dataPost.current.response_count = dataPost.current.response_count - 1;
        Toast.show({
          text: "Failed to like this post",
          position: "bottom",
          buttonText: "Ok",
          duration: 3000,
        });
      }
    } else {
      Toast.show({
        text: "Please Login",
        position: "bottom",
        buttonText: "Ok",
        duration: 3000,
      });
      // Alert.alert("Please Login");
    }
  };

  const _unliked = async (id) => {
    if (token || token !== "") {
      dataPost.current.liked = false;
      dataPost.current.response_count = dataPost.current.response_count - 1;
      try {
        let response = await MutationunLike({
          variables: {
            post_id: id,
          },
        });
        // if (loadingunLike) {
        //   Alert.alert("Loading!!");
        // }
        // if (errorunLike) {
        //   throw new Error("Error Input");
        // }

        if (response.data) {
          if (
            response.data.unlike_post.code === 200 ||
            response.data.unlike_post.code === "200"
          ) {
            dataPost.current.liked = false;
          } else {
            dataPost.current.liked = true;
            throw new Error(response.data.unlike_post.message);
          }

          // Alert.alert('Succes');
        }
      } catch (error) {
        dataPost.current.liked = true;
        dataPost.current.response_count = dataPost.current.response_count + 1;
        Toast.show({
          text: "Failed to unlike this post",
          position: "bottom",
          buttonText: "Ok",
          duration: 3000,
        });
        // Alert.alert("" + error);
      }
    } else {
      dataPost.current.liked = false;
      // Alert.alert("Please Login");
      Toast.show({
        text: "Please Login",
        position: "bottom",
        buttonText: "Ok",
        duration: 3000,
      });
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

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      // GetFeed();
      GetCommentList();
      // refetch();
      loadAsync();
    });
    return unsubscribe;
  }, []);

  const comment = async (id, text) => {
    if (token || token !== "") {
      if (text !== "") {
        let gen_uuid = create_UUID();
        let tempData = [...data_comment];
        let pushcomment = {
          created_at: "",
          id: gen_uuid,
          text: text,
          updated_at: "",
          user: {
            id: setting?.user.id,
            first_name: setting?.user.first_name,
            last_name: setting?.user.last_name,
            picture: setting?.user.picture,
            username: setting?.user.username,
          },
          is_send: false,
        };
        tempData.push(pushcomment);
        await SetDatacommnet(tempData);
        await scroll_to();
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
          if (errorcmnt) {
            throw new Error("Error Input");
          }
          if (response.data) {
            if (
              response.data.comment_post.code === 200 ||
              response.data.comment_post.code === "200"
            ) {
              // setLoading(false);
              dataPost.current.comment_count =
                dataPost.current.comment_count + 1;
              tempData[idx] = response.data.comment_post.data;
              tempData[idx].is_send = true;
              // slider.current.scrollToEnd();
              SetDatacommnet(tempData);
              Refresh();
            } else {
              throw new Error(response.data.comment_post.message);
            }

            // Alert.alert('Succes');
          }
        } catch (error) {
          tempData.splice(idx, 1);
          SetDatacommnet(tempData);
          Toast.show({
            text: "Failed to comment this post",
            position: "bottom",
            buttonText: "Ok",
            duration: 3000,
          });
        }
      } else {
        Toast.show({
          text: "Please Insert a Text",
          position: "bottom",
          buttonText: "Ok",
          duration: 3000,
        });
      }
    } else {
      // Alert.alert("Please Insert a Text");
      Toast.show({
        text: "Please Login",
        position: "bottom",
        buttonText: "Ok",
        duration: 3000,
      });
    }
  };

  const scroll_to = () => {
    slider.current.scrollToEnd();
  };

  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  const [GetCommentList, { data, loading, error, refetch }] = useLazyQuery(
    CommentList,
    {
      fetchPolicy: "network-only",
      variables: { post_id: dataPost.current.id },
      context: {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
      onCompleted: (data) => {
        SetDatacommnet(data.comment);
      },
    }
  );

  let [liked, setLiked] = useState(false);

  const likeToggle = (value) => {
    if (value == true) {
      console.log("liked: ");
    } else {
      console.log("unliked: ");
    }
  };

  const duration = (datetime) => {
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
    SetOption(data);
    if (dataPost.current.user.id == setting?.user?.id) {
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

  const Item = ({ dataComment }) => {
    return (
      <View
        style={{
          // width: Dimensions.get('window').width,
          backgroundColor: "#FFFFFF",
          // flex: 1,
          borderTopWidth: 1,
          borderTopColor: "#EEEEEE",
          paddingHorizontal: 15,
          paddingVertical: 10,
          borderRadius: 20,
        }}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            // marginVertical: 10,
            alignContent: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <FunImage
              isTouchable
              onPress={() => {
                dataComment.user.id !== setting?.user?.id
                  ? props.navigation.push("ProfileStack", {
                      screen: "otherprofile",
                      params: {
                        idUser: dataComment.user.id,
                      },
                    })
                  : props.navigation.push("ProfileStack", {
                      screen: "ProfileTab",
                    });
              }}
              style={{
                height: 35,
                width: 35,
                borderRadius: 18,
                alignSelf: "center",
                resizeMode: "cover",
              }}
              source={{ uri: dataComment.user?.picture }}
            />
            <View
              style={{
                justifyContent: "center",
                marginHorizontal: 10,
              }}
            >
              <Text
                onPress={() => {
                  dataComment.user.id !== setting?.user?.id
                    ? props.navigation.push("ProfileStack", {
                        screen: "otherprofile",
                        params: {
                          idUser: dataComment.user.id,
                        },
                      })
                    : props.navigation.push("ProfileStack", {
                        screen: "ProfileTab",
                      });
                }}
                allowFontScaling={false}
                style={{
                  fontFamily: "Lato-Bold",
                  fontSize: 14,
                  // marginTop: 7,
                }}
              >
                {dataComment.user?.first_name} {dataComment.user?.last_name}
              </Text>
              {dataComment.is_send == false ? (
                <Text
                  size={"small"}
                  style={{
                    fontFamily: "Lato-Regular",
                    // fontSize: 10,
                    // marginTop: 7,
                  }}
                >
                  Loading...
                </Text>
              ) : (
                <Text
                  size={"small"}
                  style={{
                    fontFamily: "Lato-Regular",
                    // fontSize: 10,
                    // marginTop: 7,
                  }}
                >
                  {duration(dataComment.created_at)}
                </Text>
              )}
            </View>
          </View>
        </View>
        <View
          style={{
            width: "100%",
            marginVertical: 5,
            marginLeft: 45,
          }}
        >
          <Text
            style={{
              textAlign: "left",
            }}
          >
            {dataComment.text}
          </Text>
        </View>
      </View>
    );
  };

  const goToItinerary = (data) => {
    props.navigation.push("ItineraryStack", {
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
    });
  };

  const [datasFollow, setDatasFollow] = useState();

  const [
    LoadFollowing,
    { data: dataFollow, loading: loading_following, error: eror_following },
  ] = useLazyQuery(FollowingQuery, {
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

  return (
    <SafeAreaView
      style={{
        backgroundColor: "#F6F6F6",

        // flex: 1,
      }}
    >
      <Modal
        onBackdropPress={() => {
          setModalmenu(false);
        }}
        onRequestClose={() => setModalmenu(false)}
        onDismiss={() => setModalmenu(false)}
        animationIn="fadeIn"
        animationOut="fadeOut"
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
              shareAction({
                from: "feed",
                target: dataPost.current.id,
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
                target: dataPost.current.id,
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
                props.navigation.push("EditPost", {
                  datapost: selectedOption.current,
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
              setModalmenu(false), setModalhapus(true);
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
          <TouchableOpacity
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
          </TouchableOpacity>
          <TouchableOpacity
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
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              paddingVertical: 10,
            }}
            onPress={() => {
              setModalmenuother(false);
              CopyLink({
                from: "feed",
                target: dataPost.current.id,
              });
            }}
          >
            <Text size="description" type="regular" style={{}}>
              {t("copyLink")}
            </Text>
          </TouchableOpacity>
          {datasFollow &&
          dataPost &&
          dataPost.current.user &&
          datasFollow.findIndex((k) => k["id"] == dataPost?.current.user?.id) ==
            -1 ? (
            <TouchableOpacity
              style={{
                paddingVertical: 10,
              }}
              onPress={() => _follow(dataPost.current.user.id)}
              // onPress={() => {
              //   if (!pressed) {
              //     setPressed(true);
              //     _follow(dataPost.current.user.id);
              //   }
              // }}
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
              // onPress={() => {
              //   if (!pressed) {
              //     setPressed(true);
              //     _unfollow(dataPost.current.user.id);
              //   }
              // }}
              onPress={() => _unfollow(dataPost?.current.user?.id)}
            >
              <Text size="description" type="regular" style={{}}>
                {t("unfollow")}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
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
          </TouchableOpacity>
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

      <ScrollView
        ref={slider}
        contentContainerStyle={{
          paddingBottom: 10,
        }}
        showsVerticalScrollIndicator={false}
        style={
          {
            // flex: 1,
            // marginBottom: 10,
            // backgroundColor: "#FFF",
            // height: Dimensions.get('window').height - 100,
          }
        }
      >
        <Loading show={loadings} />
        <View
          style={{
            width: Dimensions.get("window").width - 20,
            backgroundColor: "#FFFFFF",
            // flex: 1,
            // borderBottomWidth: 1,
            borderBottomColor: "#EEEEEE",
            marginHorizontal: 10,
            marginTop: 10,
            // marginBottom: 5,
            paddingBottom: 60,

            // borderWidth:1,
            borderRadius: 15,
            // paddingBottom: 20,
            minHeight: Dimensions.get("window").height - 70,
            // shadowColor: "#464646",
            // shadowOffset: { width: 0, height: 0 },
            // shadowRadius: 0.5,
            // shadowOpacity: 0.5,
            // elevation: 1,
          }}
        >
          <View
            style={{
              // width: "100%",
              width: Dimensions.get("window").width - 40,
              flexDirection: "row",
              marginVertical: 10,
              paddingHorizontal: 10,
              alignContent: "center",
            }}
          >
            <Pressable
              onPress={() => {
                dataPost.current.user.id !== setting?.user?.id
                  ? props.navigation.push("ProfileStack", {
                      screen: "otherprofile",
                      params: {
                        idUser: dataPost.current.user.id,
                      },
                    })
                  : props.navigation.push("ProfileStack", {
                      screen: "ProfileTab",
                    });
              }}
              style={{
                flexDirection: "row",
              }}
            >
              <FunImage
                isTouchable
                onPress={() => {
                  dataPost.current.user.id !== setting?.user?.id
                    ? props.navigation.push("ProfileStack", {
                        screen: "otherprofile",
                        params: {
                          idUser: dataPost.current.user.id,
                        },
                      })
                    : props.navigation.push("ProfileStack", {
                        screen: "ProfileTab",
                      });
                }}
                style={{
                  height: 35,
                  width: 35,
                  borderRadius: 18,
                  alignSelf: "center",
                  resizeMode: "cover",
                }}
                source={{ uri: dataPost.current.user.picture }}
              />
              <View
                style={{
                  justifyContent: "center",
                  marginHorizontal: 10,
                }}
              >
                <Text
                  onPress={() => {
                    dataPost.current.user.id !== setting?.user?.id
                      ? props.navigation.push("ProfileStack", {
                          screen: "otherprofile",
                          params: {
                            idUser: dataPost.current.user.id,
                          },
                        })
                      : props.navigation.push("ProfileStack", {
                          screen: "ProfileTab",
                        });
                  }}
                  type={"bold"}
                  style={{}}
                >
                  {dataPost.current.user.first_name}{" "}
                  {dataPost.current.user.first_name
                    ? dataPost.current.user.last_name
                    : null}
                </Text>
                <Text size={"small"} style={{}}>
                  {duration(dataPost.current.created_at)}
                </Text>
              </View>
            </Pressable>
            <TouchableOpacity
              onPress={() => {
                OptionOpen(dataPost);
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
              // alignItems: "center",
              width: Dimensions.get("window").width - 40,
              // height: Dimensions.get("window").width - 40,
              minHeight: Dimensions.get("window").width - 155,
              // borderWidth: 0.5,
              borderColor: "#EEEEEE",
              borderRadius: 15,
            }}
          >
            {dataPost.current.is_single == false &&
            dataPost.current.itinerary !== null ? (
              <RenderAlbum data={dataPost.current} props={props} />
            ) : (
              <RenderSinglePhoto
                data={dataPost.current}
                props={props}
                play={postid}
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
                {dataPost.current.liked ? (
                  <Button
                    onPress={() => _unliked(dataPost.current.id)}
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
                      {dataPost.current.response_count}
                    </Text>
                  </Button>
                ) : (
                  <Button
                    onPress={() => _liked(dataPost.current.id)}
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
                      {dataPost.current.response_count}
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
                    style={{ marginHorizontal: 7 }}
                  >
                    {dataPost.current.comment_count}
                  </Text>
                </Button>
              </View>

              <Button
                type="icon"
                variant="transparent"
                position="left"
                size="small"
                onPress={() =>
                  shareAction({
                    from: "feed",
                    target: dataPost.current.id,
                  })
                }
                style={{
                  // right: 10,
                  paddingHorizontal: 2,
                }}
              >
                <ShareBlack height={17} width={17} />
                <Text size="small" style={{ marginLeft: 3 }}>
                  {t("share")}
                </Text>
              </Button>
            </View>
            <View
              style={{
                width: "100%",
                padding: 10,
                flexDirection: "row",
                borderRadius: 20,
                // borderWidth:1,
              }}
            >
              {/* <Text
                style={{
                  textAlign: 'left',
                  fontFamily: "Lato-Bold",
                  fontSize: 14,
                  color: '#616161',
                  marginRight: 5,
                }}>
                {dataPost.current.user.first_name} {''}{' '}
                {dataPost.current.user.first_name ? dataPost.current.user.last_name : null}
              </Text> */}
              {dataPost.current.is_single == false &&
              dataPost.current.itinerary !== null ? (
                <View>
                  <Pressable
                    onPress={() => goToItinerary(dataPost.current)}
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
                      {dataPost.current.itinerary.name}
                    </Text>
                  </Pressable>
                  {dataPost.current.caption ? (
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
                        {dataPost.current.caption}
                      </Text>
                    </ReadMore>
                  ) : null}
                </View>
              ) : dataPost.current.caption ? (
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
                        flexShrink: 1,
                      }}
                    >
                      {dataPost.current.user.first_name}{" "}
                      {dataPost.current.user.first_name
                        ? dataPost.current.user.last_name
                        : null}{" "}
                    </Text>
                    {dataPost.current.caption}
                  </Text>
                </ReadMore>
              ) : null}
            </View>
          </View>

          <FlatList
            scrollEnabled={false}
            data={data_comment}
            renderItem={({ item }) => (
              <View
                style={{
                  // width: Dimensions.get('window').width,
                  backgroundColor: "#FFFFFF",
                  // flex: 1,
                  borderTopWidth: 1,
                  borderTopColor: "#EEEEEE",
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  borderRadius: 20,
                }}
              >
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    // marginVertical: 10,
                    alignContent: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                    }}
                  >
                    <FunImage
                      isTouchable
                      onPress={() => {
                        item.user.id !== setting?.user?.id
                          ? props.navigation.push("ProfileStack", {
                              screen: "otherprofile",
                              params: {
                                idUser: item.user.id,
                              },
                            })
                          : props.navigation.push("ProfileStack", {
                              screen: "ProfileTab",
                            });
                      }}
                      style={{
                        height: 35,
                        width: 35,
                        borderRadius: 18,
                        alignSelf: "center",
                        resizeMode: "cover",
                      }}
                      source={{ uri: item.user?.picture }}
                    />
                    <View
                      style={{
                        justifyContent: "center",
                        marginHorizontal: 10,
                      }}
                    >
                      <Text
                        onPress={() => {
                          item.user.id !== setting?.user?.id
                            ? props.navigation.push("ProfileStack", {
                                screen: "otherprofile",
                                params: {
                                  idUser: item.user.id,
                                },
                              })
                            : props.navigation.push("ProfileStack", {
                                screen: "ProfileTab",
                              });
                        }}
                        allowFontScaling={false}
                        style={{
                          fontFamily: "Lato-Bold",
                          fontSize: 14,
                          // marginTop: 7,
                        }}
                      >
                        {item.user?.first_name} {item.user?.last_name}
                      </Text>
                      {item.is_send == false ? (
                        <Text
                          size={"small"}
                          style={{
                            fontFamily: "Lato-Regular",
                            // fontSize: 10,
                            // marginTop: 7,
                          }}
                        >
                          Loading...
                        </Text>
                      ) : (
                        <Text
                          size={"small"}
                          style={{
                            fontFamily: "Lato-Regular",
                            // fontSize: 10,
                            // marginTop: 7,
                          }}
                        >
                          {duration(item.created_at)}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    width: "100%",
                    marginVertical: 5,
                    marginLeft: 45,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "left",
                    }}
                  >
                    {item.text}
                  </Text>
                </View>
              </View>
            )}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => Refresh()}
              />
            }
            ListFooterComponent={
              loading ? (
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
                    animating={loading}
                    size="large"
                    color="#209fae"
                  />
                </View>
              ) : null
            }
            keyExtractor={(item) => item.id}
            extraData={selected}
            contentContainerStyle={
              {
                // minHeight: Dimensions.get("window").height / 2,
              }
            }
          />
        </View>
      </ScrollView>
      <View
        style={{
          position: "absolute",
          bottom: 0,
          paddingBottom: 10,
          width: Dimensions.get("window").width,
          backgroundColor: "#F6F6F6",
          // borderWidth: 1,
          // marginHorizontal: 10,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            // borderRadius: 2,
            backgroundColor: "#FFFFFF",
            borderBottomRightRadius: 15,
            borderBottomLeftRadius: 15,
            marginHorizontal: 18,
            // marginBottom: 10,
            paddingVertical: 10,
            width: Dimensions.get("screen").width - 20,

            // borderWidth: 1,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              // marginVertical: 10,
              marginHorizontal: 10,
              borderRadius: 50,
              backgroundColor: "#F6F6F6",
              // height: 100,
              width: Dimensions.get("screen").width - 50,
              // position: 'absolute',
              // bottom: 0,
              // borderWidth:1,
              alignItems: "center",
              // justifyContent: 'space-around',
            }}
          >
            <TextInput
              allowFontScaling={false}
              multiline
              placeholder={
                "Comment as " +
                setting?.user?.first_name +
                " " +
                setting?.user?.last_name +
                "..."
              }
              maxLength={1000}
              style={{
                height: 50,
                width: Dimensions.get("screen").width - 130,
                // borderBottomColor: '#f0f0f0f0',
                // borderWidth: 1,
                marginLeft: 20,
              }}
              onChangeText={(text) => setStatusText(text)}
              value={statusText}
            />
            <Pressable
              onPress={() => comment(dataPost.current.id, statusText)}
              style={{
                flex: 1,
                // borderWidth: 1,
                height: 50,
                // alignSelf: 'center',
                alignItems: "center",
                justifyContent: "center",
                paddingRight: 10,
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
                Post
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
      <Root />
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
