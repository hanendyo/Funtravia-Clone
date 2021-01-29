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
} from "../../../component";

import {
  Comment,
  LikeRed,
  LikeEmpty,
  PostButton,
  OptionsVertBlack,
  ShareBlack,
  Kosong,
  Arrowbackwhite,
  OptionsVertWhite,
  More,
  LikeBlack,
  CommentBlack,
} from "../../../assets/svg";
import likepost from "../../../graphQL/Mutation/Post/likepost";
import unlikepost from "../../../graphQL/Mutation/Post/unlikepost";
import { gql } from "apollo-boost";

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
  let [dataPost, setDataPost] = useState(props.route.params?.data);
  let [postid, setPostid] = useState(props.route.params?.post_id);
  let [token, setToken] = useState(props.route.params.token);
  let slider = useRef();
  let [setting, setSetting] = useState();
  let [modalmenu, setModalmenu] = useState(false);
  let [modalmenuother, setModalmenuother] = useState(false);
  let [modalhapus, setModalhapus] = useState(false);
  let [selectedOption, SetOption] = useState({});

  // console.log(setting);
  // console.log(props.route.params.data);
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

    // await GetDataSetting();
    // if (datas && datas.setting_data) {
    // 	await AsyncStorage.setItem('setting', JSON.stringify(datas.setting_data));
    // }

    let setsetting = await AsyncStorage.getItem("setting");
    setSetting(JSON.parse(setsetting));
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      GetFeed();
      GetCommentList();
      loadAsync();
    });
    return unsubscribe;
  }, []);

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

  const _deletepost = async (data) => {
    setModalhapus(false);
    setModalmenu(false);
    // var tempData = [...datafeed];
    // var index = tempData.findIndex((k) => k['id'] === id);

    // SetDataFeed(tempData);
    if (token || token !== "") {
      try {
        let response = await Mutationdeletepost({
          variables: {
            post_id: data.id,
          },
        });
        // if (loadingdelete) {
        //   Alert.alert("Loading!!");
        // }
        // if (errordelete) {
        //   throw new Error("Error Input");
        // }

        // console.log(response);
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
        Alert.alert("" + error);
      }
    } else {
      // tempData[index].liked = true;
      // tempData[index].response_count = tempData[index].response_count + 1;
      // SetDataFeed(tempData);
      Alert.alert("Please Login");
    }
  };

  const _liked = async (id) => {
    // console.log(id);
    // SetDataFeed(tempData);
    if (token) {
      dataPost.liked = true;
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
            dataPost.liked = true;
          } else {
            dataPost.liked = false;
          }

          // Alert.alert('Succes');
        }
      } catch (error) {
        dataPost.liked = false;
        console.log(error);
        // Alert.alert("" + error);
      }
    } else {
      Alert.alert("Please Login");
    }
  };

  const _unliked = async (id) => {
    if (token || token !== "") {
      dataPost.liked = false;
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
            dataPost.liked = false;
          } else {
            dataPost.liked = true;
            throw new Error(response.data.unlike_post.message);
          }

          // Alert.alert('Succes');
        }
      } catch (error) {
        Alert.alert("" + error);
      }
    } else {
      dataPost.liked = false;
      Alert.alert("Please Login");
    }
  };

  const comment = async (id, text) => {
    Keyboard.dismiss();
    if ((token || token !== "") && text !== "") {
      setLoading(true);
      try {
        let response = await MutationComment({
          variables: {
            post_id: id,
            text: text,
          },
        });
        if (loadingcmnt) {
          Alert.alert("Loading!!");
        }
        if (errorcmnt) {
          throw new Error("Error Input");
        }
        if (response.data) {
          if (
            response.data.comment_post.code === 200 ||
            response.data.comment_post.code === "200"
          ) {
            setLoading(false);

            setStatusText("");
            dataPost.comment_count = dataPost.comment_count + 1;
            GetCommentList();
            scroll_to();
          } else {
            setLoading(false);
            throw new Error(response.data.comment_post.message);
          }

          // Alert.alert('Succes');
        }
      } catch (error) {
        setLoading(false);
        // console.log(error);
        Alert.alert("" + error);
      }
    } else {
      Alert.alert("Please Insert a Text");
    }
  };



  const scroll_to = () => {
    // GetCommentList();
    if (loading == true) {
      // console.log(loading);
      scroll_to();
    }
    if (loading == false) {
      // console.log(loading);
      wait(1000).then(() => {
        slider.current.scrollToEnd();
      });
    }
  };

  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  // console.log(props.navigation.getParam('post_id'));
  const [GetCommentList, { data, loading, error }] = useLazyQuery(CommentList, {
    fetchPolicy: "network-only",
    variables: { post_id: dataPost.id },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  // console.log(loading);

  if (data) {
    // console.log(data.comment[0].text);
  }

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
      return yrs + " tahun yang lalu";
    }
    if (days > 0) {
      return days + " hari yang lalu";
    }
    if (hrs > 0) {
      return hrs + " jam yang lalu";
    }
    if (mins > 0) {
      return mins + " menit yang lalu";
    } else {
      return "baru saja";
    }
    return days + " Days, " + hrs + " Hours, " + mins + " Minutes";
  };

  // const likeChange = () => {
  // 	onSelect('selected'), setLiked(!liked);
  // 	likeToggle(liked);
  // };
  const OptionOpen = (data) => {
    SetOption(data);
    if (dataPost.user.id == setting?.user?.id) {
      setModalmenu(true);
    } else {
      setModalmenuother(true);
    }
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
            <Image
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
            </View>
          </View>
        </View>
        <View
          style={{
            width: "100%",
            marginVertical: 5,
            // marginLeft: 45,
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

  return (
    <SafeAreaView
      style={{
        flex: 1,

      }}>
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
							console.log(data);
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
							setModalmenu(false),
								props.navigation.push("EditPost", {
									datapost: selectedOption,
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
						onPress={() => {}}
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
							setModalmenuother(false);
						}}
					>
						<Text size="description" type="regular" style={{}}>
							{t("unfollow")}
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
        contentContainerStyle={
          {
            // paddingBottom :100,
          }
        }
        style={{
          flex: 1,

          // backgroundColor: "#FFF",
          // height: Dimensions.get('window').height - 100,
        }}
      >
        <Loading show={loadings} />
        <View
          style={{
            width: Dimensions.get("window").width - 20,
            backgroundColor: "#FFFFFF",
            // flex: 1,
            borderBottomWidth: 1,
            borderBottomColor: "#EEEEEE",
            marginHorizontal: 10,
            marginVertical: 10,
            // borderWidth:1,
            borderRadius: 20,
            paddingBottom: 20,
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
                dataPost.user.id !== setting?.user?.id
                  ? props.navigation.push("ProfileStack", {
                      screen: "otherprofile",
                      params: {
                        idUser: dataPost.user.id,
                      },
                    })
                  : props.navigation.push("ProfileStack", {
                      screen: "ProfileTab",
                    });
              }}
              u
              style={{
                flexDirection: "row",
              }}
            >
              <Image
                isTouchable
                onPress={() => {
                  dataPost.user.id !== setting?.user?.id
                    ? props.navigation.push("ProfileStack", {
                        screen: "otherprofile",
                        params: {
                          idUser: dataPost.user.id,
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
                source={{ uri: dataPost.user.picture }}
              />
              <View
                style={{
                  justifyContent: "center",
                  marginHorizontal: 10,
                }}
              >
                <Text
                  onPress={() => {
                    dataPost.user.id !== setting?.user?.id
                      ? props.navigation.push("ProfileStack", {
                          screen: "otherprofile",
                          params: {
                            idUser: dataPost.user.id,
                          },
                        })
                      : props.navigation.push("ProfileStack", {
                          screen: "ProfileTab",
                        });
                  }}
                  type={"bold"}
                  style={{}}
                >
                  {dataPost.user.first_name}{" "}
                  {dataPost.user.first_name ? dataPost.user.last_name : null}
                </Text>
                <Text size={"small"} style={{}}>
                  {duration(dataPost.created_at)}
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
              alignItems: "center",
              width: Dimensions.get("window").width - 40,
              borderRadius: 15,
            }}
          >
            {dataPost && dataPost.assets && dataPost.assets[0].filepath ? (
              <Image
                style={{
                  width: Dimensions.get("window").width - 40,
                  borderRadius: 15,
                  alignSelf: "center",
                }}
                uri={dataPost.assets[0].filepath}
              />
            ) : null}
            {/* <AutoHeightImage
              width={Dimensions.get("window").width -40}
              source={{ uri: dataPost.assets[0]?.filepath }}
            /> */}
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
                {dataPost.liked ? (
                  <Button
                    onPress={() => _unliked(dataPost.id)}
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
                      style={{ marginHorizontal: 5, color: "#BE3737" }}
                    >
                      {dataPost.response_count}
                    </Text>
                  </Button>
                ) : (
                  <Button
                    onPress={() => _liked(dataPost.id)}
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
                      {dataPost.response_count}
                    </Text>
                  </Button>
                )}

                <Button
                  onPress={() => console.log("dataPost")}
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
                    {dataPost.comment_count}
                  </Text>
                </Button>
              </View>

              <Button
                type="icon"
                variant="transparent"
                position="left"
                size="small"
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
                {dataPost.user.first_name} {''}{' '}
                {dataPost.user.first_name ? dataPost.user.last_name : null}
              </Text> */}
              {dataPost.caption ? (
                <Text
                  style={{
                    textAlign: "left",
                    fontFamily: "Lato-Regular",
                    fontSize: 14,
                    lineHeight: 20,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Lato-Bold",
                      marginRight: 5,
                    }}
                  >
                    {dataPost.user.first_name}{" "}
                    {dataPost.user.first_name ? dataPost.user.last_name : null}{" "}
                  </Text>
                  {dataPost.caption}
                </Text>
              ) : null}
            </View>
          </View>

          <FlatList
            ref={slider}
            data={data ? data.comment : null}
            renderItem={({ item }) => {
              return <Item dataComment={item} />;
            }}
            keyExtractor={(item) => item.id}
            extraData={selected}
          />
        </View>
      </ScrollView>
      <View
        style={{
          flexDirection: "row",
          marginVertical: 5,
          marginHorizontal: 10,
          // position: 'absolute',
          // bottom: 0,
          borderRadius: 50,
          backgroundColor: "#ffffff",
          // height: 100,
          width: Dimensions.get("screen").width - 20,
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
          maxLength={255}
          style={{
            height: 60,
            width: Dimensions.get("screen").width - 120,
            // borderBottomColor: '#f0f0f0f0',
            // borderWidth: 1,
            marginLeft: 20,
          }}
          onChangeText={(text) => setStatusText(text)}
          value={statusText}
        />
        <Pressable
          onPress={() => comment(dataPost.id, statusText)}
          style={{
            flex: 1,
            // borderWidth: 1,
            height: 60,
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
