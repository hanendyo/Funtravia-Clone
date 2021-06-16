import React, { useState, useEffect, useRef } from "react";
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
    KeyboardAvoidingView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Modal from "react-native-modal";
import { useTranslation } from "react-i18next";
// import Image from "react-native-auto-scale-image";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import { useQuery } from "@apollo/client";
import CommentList from "../../../graphQL/Query/Feed/CommentList";
import FeedByID from "../../../graphQL/Query/Feed/FeedByID";
import commentpost from "../../../graphQL/Mutation/Post/commentpost";
import {
    Text,
    Button,
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
import { useIsFocused } from "@react-navigation/native";
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
export default function Comments(props) {
    const { t, i18n } = useTranslation();
    const isFocused = useIsFocused();
    let [play, setPlay] = useState(props.route.params?.post_id);
    let [muted, setMuted] = useState(true);
    let { width, height } = Dimensions.get("screen");

    const HeaderComponent = {
        headerShown: true,
        transparent: false,
        headerTintColor: "white",
        headerTitle: t("comments"),
        headerMode: "screen",
        headerStyle: {
            backgroundColor: "#209FAE",
            elevation: 0,
            borderBottomWidth: 0,
        },
        headerTitleStyle: {
            fontFamily: "Lato-Bold",
            color: "white",
        },
    };
    const [loadings, setLoading] = useState(false);
    let [statusText, setStatusText] = useState("");
    let [selected, setSelected] = useState(new Map());
    let [postid, setPostid] = useState(props.route.params?.post_id);
    let [comments, setCommentIds] = useState(props.route.params?.comment_id);
    let [token, setToken] = useState(props.route.params.token);
    let slider = useRef();
    let [setting, setSetting] = useState();
    let [modalmenu, setModalmenu] = useState(false);
    let [modalmenuother, setModalmenuother] = useState(false);
    let [modalhapus, setModalhapus] = useState(false);
    let [selectedOption, SetOption] = useState({});
    let [data_comment, SetDatacommnet] = useState([]);
    let [dataPost, SetDataPost] = useState(null);
    console.log(dataPost);

    const { data: datafeed, loading: loadingfeed, error: errorfeed } = useQuery(
        FeedByID,
        {
            fetchPolicy: "network-only",
            // variables: { post_id: postid },
            variables: { post_id: postid },
            context: {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            },
            onCompleted: () => {
                SetDataPost(datafeed.feed_post_byid);
            },
        }
    );

    const loadAsync = async () => {
        let tkn = await AsyncStorage.getItem("access_token");
        await setToken(tkn);

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
                    if (
                        response.data.delete_post.code === 200 ||
                        response.data.delete_post.code === "200"
                    ) {
                        props.navigation.goBack();
                    } else {
                        throw new Error(response.data.delete_post.message);
                    }
                }
            } catch (error) {
                Toast.show({
                    text: "Failed to delete this post",
                    position: "bottom",
                    buttonText: "Ok",
                    duration: 3000,
                });
                // Alert.alert("" + error);
            }
        } else {
            Toast.show({
                text: "Please Login",
                position: "bottom",
                buttonText: "Ok",
                duration: 3000,
            });
        }
    };

    const _liked = async (id) => {
        if (token) {
            let tmpData = { ...dataPost };

            tmpData.liked = true;
            tmpData.response_count = tmpData.response_count + 1;
            SetDataPost(tmpData);
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
                tmpData.liked = false;
                tmpData.response_count = tmpData.response_count - 1;
                SetDataPost(tmpData);
            }
        } else {
            Toast.show({
                text: "Please Login",
                position: "bottom",
                buttonText: "Ok",
                duration: 3000,
            });
        }
    };

    const _unliked = async (id) => {
        if (token || token !== "") {
            let tmpData = { ...dataPost };
            tmpData.liked = false;
            tmpData.response_count = tmpData.response_count - 1;
            SetDataPost(tmpData);
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
                SetDataPost(tmpData);
                Toast.show({
                    text: "Failed to unlike this post",
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
        }
    };

    const create_UUID = () => {
        var dt = new Date().getTime();
        var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
            /[xy]/g,
            function(c) {
                var r = (dt + Math.random() * 16) % 16 | 0;
                dt = Math.floor(dt / 16);
                return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
            }
        );
        return uuid;
    };

    const comment = async (id, text) => {
        if (text !== "") {
            if (token || token !== "") {
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
                            let tmpDataPost = { ...dataPost };
                            tmpDataPost.liked = false;
                            tmpDataPost.comment_count =
                                tmpDataPost.comment_count - 1;
                            SetDataPost(tmpDataPost);
                            tempData[idx] = response.data.comment_post.data;
                            tempData[idx].is_send = true;
                            SetDatacommnet(tempData);
                            Refresh();
                        } else {
                            throw new Error(response.data.comment_post.message);
                        }
                    }
                } catch (error) {
                    tempData.splice(idx, 1);
                    SetDatacommnet(tempData);
                    // Toast.show({
                    //   text: "Failed to comment this post",
                    //   position: "bottom",
                    //   buttonText: "Ok",
                    //   duration: 3000,
                    // });
                    RNToasty.Show({
                        title: "Failed to comment this post",
                        position: "bottom",
                    });
                    // Alert.alert("" + error);
                }
            } else {
                // Toast.show({
                //   text: "Please Login",
                //   position: "bottom",
                //   buttonText: "Ok",
                //   duration: 3000,
                // });
                RNToasty.Show({
                    title: "Please Login!",
                    position: "bottom",
                });
            }
        } else {
            RNToasty.Show({
                title: t("messagesEmpty"),
                position: "bottom",
            });
            // Toast.show({
            //   text: "Please Insert a Text",
            //   position: "bottom",
            //   buttonText: "Ok",
            //   duration: 3000,
            // });
            // Alert.alert("Please Insert a Text");
        }
    };

    const scroll_to = () => {
        slider.current.scrollToEnd();
        // slider.current.scrollToIndex({ index: 0 });
    };

    const scroll_to_index = (indeks) => {
        if (indeks >= 0) {
            // slider.current.scrollToEnd();
            console.log(slider);
            console.log("slider");
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

    const wait = (timeout) => {
        return new Promise((resolve) => {
            setTimeout(resolve, timeout);
        });
    };

    let [indeks, setIndeks] = useState(0);

    const [GetCommentList, { data, loading, error, refetch }] = useLazyQuery(
        CommentList,
        {
            fetchPolicy: "network-only",
            variables: { post_id: postid },
            context: {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            },
            onCompleted: async (data) => {
                await SetDatacommnet(data.comment);
                let temps = { ...data };
                let index = temps.comment.findIndex(
                    (k) => k["id"] === comments
                );
                await setIndeks(index);
                await scroll_to_index(index);
                // await slider.current.scrollToIndex({ index: index, animated: true });
            },
        }
    );

    const getItemLayout = (data, index) => ({
        length: indeks,
        offset: indeks,
        indeks,
    });

    useEffect(() => {
        loadAsync();
        props.navigation.setOptions(HeaderComponent);
        const unsubscribe = props.navigation.addListener("focus", async () => {
            await GetCommentList();

            await scroll_to_index();
        });
        return unsubscribe;
    }, []);

    let [liked, setLiked] = useState(false);

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
        if (dataPost.user.id == setting?.user?.id) {
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
                    backgroundColor: "#FFFFFF",
                    borderTopWidth: 1,
                    borderTopColor: "#EEEEEE",
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                    borderRadius: 20,
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
                                        ? props.navigation.push(
                                              "ProfileStack",
                                              {
                                                  screen: "otherprofile",
                                                  params: {
                                                      idUser:
                                                          dataComment.user.id,
                                                  },
                                              }
                                          )
                                        : props.navigation.push(
                                              "ProfileStack",
                                              {
                                                  screen: "ProfileTab",
                                              }
                                          );
                                }}
                                allowFontScaling={false}
                                style={{
                                    fontFamily: "Lato-Bold",
                                    fontSize: 14,
                                }}
                            >
                                {dataComment.user?.first_name}{" "}
                                {dataComment.user?.last_name}
                            </Text>
                            {dataComment.is_send == false ? (
                                <Text
                                    size={"small"}
                                    style={{
                                        fontFamily: "Lato-Regular",
                                    }}
                                >
                                    Loading...
                                </Text>
                            ) : (
                                <Text
                                    size={"small"}
                                    style={{
                                        fontFamily: "Lato-Regular",
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

    if (loadingfeed) {
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
                    <SkeletonPlaceholder.Item
                        width={30}
                        height={15}
                        borderRadius={4}
                    />
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
                    <SkeletonPlaceholder.Item
                        width={50}
                        height={25}
                        borderRadius={20}
                    />
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

    return (
        <KeyboardAvoidingView
            // behavior={Platform.OS == "ios" ? "padding" : "height"}
            style={{
                flex: 1,
                backgroundColor: "#F6F6F6",
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
                        onPress={() => {
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

            {/* <ScrollView
        ref={slider}
        contentContainerStyle={{
          paddingBottom: 30,
        }}
        showsVerticalScrollIndicator={false}
      > */}
            <Loading show={loadings} />

            <View
                style={{
                    width: Dimensions.get("window").width - 20,
                    backgroundColor: "#FFFFFF",
                    borderBottomColor: "#EEEEEE",
                    marginHorizontal: 10,
                    marginTop: 10,
                    paddingBottom: 60,
                    borderRadius: 15,
                    minHeight: Dimensions.get("window").height - 70,
                }}
            >
                {/* {data_comment.length > 0 ? ( */}
                <FlatList
                    // initialScrollIndex={indeks ? indeks : nu}
                    onScrollToIndexFailed={() => scroll_to_index(indeks)}
                    keyboardShouldPersistTaps="always"
                    showsVerticalScrollIndicator={false}
                    ref={slider}
                    data={data_comment}
                    renderItem={({ item }) => {
                        return <Item dataComment={item} />;
                    }}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => Refresh()}
                        />
                    }
                    keyExtractor={(item) => item.id}
                    extraData={selected}
                    contentContainerStyle={{}}
                    ListHeaderComponent={
                        dataPost == null ? (
                            <ActivityIndicator
                                animating={true}
                                size="large"
                                color="#209fae"
                            />
                        ) : (
                            <>
                                <View
                                    style={{
                                        width:
                                            Dimensions.get("window").width - 40,
                                        flexDirection: "row",
                                        marginVertical: 10,
                                        paddingHorizontal: 10,
                                        alignContent: "center",
                                    }}
                                >
                                    <Pressable
                                        onPress={() => {
                                            dataPost?.user?.id !==
                                            setting?.user?.id
                                                ? props.navigation.push(
                                                      "ProfileStack",
                                                      {
                                                          screen:
                                                              "otherprofile",
                                                          params: {
                                                              idUser:
                                                                  dataPost?.user
                                                                      ?.id,
                                                          },
                                                      }
                                                  )
                                                : props.navigation.push(
                                                      "ProfileStack",
                                                      {
                                                          screen: "ProfileTab",
                                                      }
                                                  );
                                        }}
                                        style={{
                                            flexDirection: "row",
                                        }}
                                    >
                                        <FunImage
                                            isTouchable
                                            onPress={() => {
                                                dataPost?.user?.id !==
                                                setting?.user?.id
                                                    ? props.navigation.push(
                                                          "ProfileStack",
                                                          {
                                                              screen:
                                                                  "otherprofile",
                                                              params: {
                                                                  idUser:
                                                                      dataPost
                                                                          ?.user
                                                                          ?.id,
                                                              },
                                                          }
                                                      )
                                                    : props.navigation.push(
                                                          "ProfileStack",
                                                          {
                                                              screen:
                                                                  "ProfileTab",
                                                          }
                                                      );
                                            }}
                                            style={{
                                                height: 35,
                                                width: 35,
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
                                            }}
                                        >
                                            <Text
                                                onPress={() => {
                                                    dataPost.user.id !==
                                                    setting?.user?.id
                                                        ? props.navigation.push(
                                                              "ProfileStack",
                                                              {
                                                                  screen:
                                                                      "otherprofile",
                                                                  params: {
                                                                      idUser:
                                                                          dataPost
                                                                              .user
                                                                              .id,
                                                                  },
                                                              }
                                                          )
                                                        : props.navigation.push(
                                                              "ProfileStack",
                                                              {
                                                                  screen:
                                                                      "ProfileTab",
                                                              }
                                                          );
                                                }}
                                                type={"bold"}
                                                style={{}}
                                            >
                                                {dataPost?.user?.first_name}{" "}
                                                {dataPost?.user?.first_name
                                                    ? dataPost?.user?.last_name
                                                    : null}
                                            </Text>
                                            <Text size={"small"} style={{}}>
                                                {duration(dataPost?.created_at)}
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
                                        width:
                                            Dimensions.get("window").width - 40,
                                        minHeight:
                                            Dimensions.get("window").width -
                                            155,
                                        borderColor: "#EEEEEE",
                                        borderRadius: 15,
                                    }}
                                >
                                    {dataPost.is_single === false ? (
                                        <RenderAlbum
                                            data={dataPost}
                                            props={props}
                                            play={play}
                                            muted={muted}
                                            setMuted={(e) => setMuted(e)}
                                            isFocused={isFocused}
                                        />
                                    ) : (
                                        <RenderSinglePhoto
                                            data={dataPost}
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
                                            }}
                                        >
                                            {dataPost.liked ? (
                                                <Button
                                                    onPress={() =>
                                                        _unliked(dataPost.id)
                                                    }
                                                    type="icon"
                                                    position="left"
                                                    size="small"
                                                    style={{
                                                        paddingHorizontal: 10,
                                                        marginRight: 15,
                                                        borderRadius: 16,
                                                        backgroundColor:
                                                            "#F2DAE5",
                                                    }}
                                                >
                                                    <LikeRed
                                                        height={15}
                                                        width={15}
                                                    />
                                                    <Text
                                                        type="black"
                                                        size="label"
                                                        style={{
                                                            marginHorizontal: 5,
                                                            color: "#BE3737",
                                                        }}
                                                    >
                                                        {
                                                            dataPost?.response_count
                                                        }
                                                    </Text>
                                                </Button>
                                            ) : (
                                                <Button
                                                    onPress={() =>
                                                        _liked(dataPost.id)
                                                    }
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
                                                    <LikeBlack
                                                        height={15}
                                                        width={15}
                                                    />
                                                    <Text
                                                        type="black"
                                                        size="label"
                                                        style={{
                                                            marginHorizontal: 7,
                                                        }}
                                                    >
                                                        {
                                                            dataPost?.response_count
                                                        }
                                                    </Text>
                                                </Button>
                                            )}

                                            <Button
                                                // onPress={() => console.log("dataPost")}
                                                type="icon"
                                                variant="transparent"
                                                position="left"
                                                size="small"
                                                style={{
                                                    paddingHorizontal: 2,
                                                }}
                                            >
                                                <CommentBlack
                                                    height={15}
                                                    width={15}
                                                />
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
                                                shareAction({
                                                    from: "feed",
                                                    target: postid,
                                                })
                                            }
                                            type="icon"
                                            variant="transparent"
                                            position="left"
                                            size="small"
                                        >
                                            <ShareBlack
                                                height={17}
                                                width={17}
                                            />
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
                                            borderRadius: 20,
                                        }}
                                    >
                                        {dataPost.is_single == false &&
                                        dataPost.itinerary !== null ? (
                                            <View>
                                                <Pressable
                                                    onPress={() =>
                                                        goToItinerary(dataPost)
                                                    }
                                                    style={{
                                                        flexDirection: "row",
                                                        marginBottom: 10,
                                                    }}
                                                >
                                                    <View
                                                        style={{
                                                            backgroundColor:
                                                                "#209fae",
                                                            height: 23,
                                                            width: 7,
                                                            borderRadius: 4,
                                                            marginRight: 10,
                                                            marginLeft: 2,
                                                        }}
                                                    />
                                                    <Text
                                                        type="bold"
                                                        size="title"
                                                    >
                                                        {
                                                            dataPost.itinerary
                                                                .name
                                                        }
                                                    </Text>
                                                </Pressable>
                                                {dataPost.caption ? (
                                                    <ReadMore
                                                        numberOfLines={3}
                                                        renderTruncatedFooter={
                                                            ReadMorehendle
                                                        }
                                                        renderRevealedFooter={
                                                            ReadLesshendle
                                                        }
                                                    >
                                                        <Text
                                                            size="label"
                                                            style={{
                                                                textAlign:
                                                                    "left",
                                                                lineHeight: 20,
                                                            }}
                                                        >
                                                            {dataPost.caption}
                                                        </Text>
                                                    </ReadMore>
                                                ) : null}
                                            </View>
                                        ) : dataPost.caption ? (
                                            <ReadMore
                                                numberOfLines={3}
                                                renderTruncatedFooter={
                                                    ReadMorehendle
                                                }
                                                renderRevealedFooter={
                                                    ReadLesshendle
                                                }
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
                                                        {
                                                            dataPost.user
                                                                .first_name
                                                        }{" "}
                                                        {dataPost.user
                                                            .first_name
                                                            ? dataPost.user
                                                                  .last_name
                                                            : null}{" "}
                                                    </Text>
                                                    {dataPost.caption}
                                                </Text>
                                            </ReadMore>
                                        ) : null}
                                    </View>
                                </View>
                            </>
                        )
                    }
                />
                {/* ) : null} */}
            </View>
            {/* </ScrollView> */}
            <View
                style={{
                    position: "absolute",
                    bottom: 0,
                    paddingBottom: 10,
                    width: Dimensions.get("window").width,
                    backgroundColor: "#F6F6F6",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <View
                    style={{
                        backgroundColor: "#FFFFFF",
                        borderBottomRightRadius: 15,
                        borderBottomLeftRadius: 15,
                        marginHorizontal: 18,
                        paddingVertical: 10,
                        width: Dimensions.get("screen").width - 20,
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            marginHorizontal: 10,
                            borderRadius: 50,
                            backgroundColor: "#F6F6F6",
                            width: Dimensions.get("screen").width - 50,
                            alignItems: "center",
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
                                marginLeft: 20,
                                fontFamily: "Lato-Regular",
                            }}
                            onChangeText={(text) => setStatusText(text)}
                            value={statusText}
                        />
                        <Pressable
                            onPress={() => comment(dataPost.id, statusText)}
                            style={{
                                flex: 1,
                                height: 50,
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
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    main: {
        justifyContent: "center",
        alignItems: "center",
    },
    captionFont: { fontSize: 12 },
});
