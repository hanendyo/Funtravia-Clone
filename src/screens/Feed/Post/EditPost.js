import React, { useState, useEffect } from "react";
import {
  View,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  Text,
  Loading,
  Truncate,
  StatusBar,
  FunImage,
  ModalLogin,
} from "../../../component";
import { CheckWhite, Arrowbackwhite, Arrowbackios } from "../../../assets/svg";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import Account from "../../../graphQL/Query/Home/Account";
import LocationSelector from "./LocationSelector";
import { useSelector } from "react-redux";
import { ScrollView } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";
import { StackActions } from "@react-navigation/routers";
import RenderSinglePhoto from "../RenderSinglePhoto";
import RenderAlbum from "../RenderAlbumItinerary";
import { useIsFocused } from "@react-navigation/native";
import { CommonActions } from "@react-navigation/native";
import DeviceInfo from "react-native-device-info";

const PostEdit = gql`
  mutation($post_id: ID!, $caption: String) {
    edit_post(post_id: $post_id, caption: $caption) {
      id
      response_time
      message
      code
    }
  }
`;

export default function EditPost(props) {
  const Notch = DeviceInfo.hasNotch();
  const from = props.route.params.from;
  const { t, i18n } = useTranslation();
  const [modalLogin, setModalLogin] = useState(false);
  const tokenApps = useSelector((data) => data.token);
  const HeaderComponent = {
    headerShown: true,
    transparent: false,
    headerTintColor: "white",
    headerTitle: "",
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
      paddingBottom: Platform.OS == "ios" ? 15 : 1,
    },
    headerLeftContainerStyle: {
      background: "#FFF",
      position: "absolute",
      zIndex: 999,
      marginLeft: 10,
    },
    headerLeft: () => (
      <TouchableOpacity
        text={""}
        size="medium"
        type="circle"
        variant="transparent"
        onPress={() => {
          props.navigation.goBack();
        }}
        style={{
          width: 90,
          marginLeft: 10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          {Platform.OS == "ios" ? (
            <Arrowbackios height={15} width={15}></Arrowbackios>
          ) : (
            <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
          )}
          <Text
            type="bold"
            size="title"
            style={{ color: "#fff", marginLeft: 15 }}
          >
            {t("edit")}
          </Text>
        </View>
      </TouchableOpacity>
    ),
    headerRight: () => (
      <TouchableOpacity
        onPress={() => {
          SubmitData(statusText);
        }}
        style={{
          marginRight: 25,
          flexDirection: "row",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          allowFontScaling={false}
          type="bold"
          size="title"
          style={{ color: "#fff", marginHorizontal: 10, marginVertical: 10 }}
        >
          {t("save")}
        </Text>
        <CheckWhite width={20} height={20} />
      </TouchableOpacity>
    ),
  };
  let [modellocation, setModellocation] = useState(false);
  let [Location, setLocation] = useState({
    address: "Add Location",
    latitude: "",
    longitude: "",
  });
  let [loadingok, setLoading] = useState(false);
  const chosenPicture = props.route.params.file;
  const [dataPost, setDatapost] = useState(props.route.params.datapost);
  let [statusText, setStatusText] = useState(dataPost?.caption);
  const isFocused = useIsFocused();
  let [muted, setMuted] = useState(true);

  const [MutationEdit, { loading, data, error }] = useMutation(PostEdit, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenApps,
      },
    },
  });

  const [
    LoadUserProfile,
    {
      data: dataprofile,
      loading: loadingprofile,
      error: errorprofile,
      refetch,
    },
  ] = useLazyQuery(Account, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenApps,
      },
    },
  });

  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  const _setStatusText = (data) => {
    setStatusText(data);
    props.navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            SubmitData(data);
          }}
          style={{
            marginRight: 25,
            flexDirection: "row",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            allowFontScaling={false}
            type="bold"
            size="title"
            style={{ color: "#fff", marginHorizontal: 10, marginVertical: 10 }}
          >
            {t("save")}
          </Text>
          <CheckWhite width={20} height={20} />
        </TouchableOpacity>
      ),
    });
    wait(1000).then(() => {
      props.navigation.setParams({
        SubmitData: SubmitData,
        text: data,
      });
    });
    // props.navigation.getParam('setText');
  };
  const _setLocation = (data) => {
    props.navigation.setParams({
      SubmitData: SubmitData,
      text: statusText,
      location: data,
    });
    setLocation(data);

    wait(1000).then(() => {
      props.navigation.setParams({
        SubmitData: SubmitData,
        text: statusText,
        location: data,
      });
    });
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

  const SubmitData = async (statusText) => {
    setLoading(true);
    let caption = statusText ? statusText : "-";
    try {
      let response = await MutationEdit({
        variables: {
          post_id: dataPost.id,
          caption: caption,
        },
      });
      if (response.data) {
        if (response.data.edit_post.code === 200) {
          setLoading(false);
          if (from == "funFeed") {
            props.navigation.navigate("FeedScreen", {
              post_id: dataPost.id,
              caption: caption,
              data_post: dataPost,
              from: "funFeedEdit",
            });
          } else if (from == "funFeedComment") {
            props.navigation.navigate({
              name: "FeedStack",
              params: {
                screen: "CommentPost",
                params: {
                  post_id: dataPost.id,
                  caption: caption,
                  data_post: dataPost,
                  from: "funFeedCommentEdit",
                },
              },
            });
          } else if (from == "feedProfil") {
            props.navigation.navigate({
              name: "ProfileStack",
              params: {
                screen: "myfeed",
                params: {
                  post_id: dataPost.id,
                  caption: caption,
                  data_post: dataPost,
                  from: "feedProfilEdit",
                },
              },
            });
          } else if (from == "feedProfilComment") {
            props.navigation.navigate({
              name: "FeedStack",
              params: {
                screen: "CommentPost",
                params: {
                  post_id: dataPost.id,
                  caption: caption,
                  data_post: dataPost,
                  from: "feedProfilCommentEdit",
                },
              },
            });
          } else if (from == "notificationComment") {
            props.navigation.navigate({
              name: "FeedStack",
              params: {
                screen: "CommentPost",
                params: {
                  post_id: dataPost.id,
                  edit_fromNotifComment_caption: caption,
                  edit_fromNotifComment_response_count:
                    props.route.params.datapost.response_count,
                  edit_fromNotifComment_comment_count:
                    props.route.params.datapost.comment_count,
                  edit_fromNotifComment_liked:
                    props.route.params.datapost.liked,
                  from: "notificationCommentEdit",
                },
              },
            });
          } else {
            props.navigation.goBack();
          }
        } else {
          setLoading(false);
          throw new Error(response.data.edit_post.message);
        }
      } else {
        throw new Error("Error Input");
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("" + error);
    }
  };
  // const submit = () => {
  // 	SubmitData();
  // 	// props.navigation.getParam('SubmitData');
  // };

  const loadAsync = async () => {
    LoadUserProfile();
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    loadAsync();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : null}
      style={{ flex: 1, backgroundColor: "#F6F6F6" }}
    >
      <ModalLogin
        modalLogin={modalLogin}
        setModalLogin={() => setModalLogin(false)}
        props={props}
      />
      <ScrollView style={{ flex: 1 }}>
        <View
          showsVerticalScrollIndicator={false}
          style={{
            backgroundColor: "white",
            marginHorizontal: 10,
            marginTop: 10,
            paddingTop: -80,
            // marginBottom: Platform.OS == "ios" ? 100 : null,
            borderTopStartRadius: 15,
            borderTopEndRadius: 15,
            borderBottomStartRadius: 15,
            borderBottomEndRadius: 15,
            height:
              Platform.OS == "ios"
                ? Notch
                  ? Dimensions.get("window").height / 1.2
                  : Dimensions.get("window").height
                : Dimensions.get("window").height / 1.2,
          }}
        >
          <Loading show={loadingok} />
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View
              style={
                {
                  // flex: 1,
                  // justifyContent: 'flex-start',
                }
              }
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
                <FunImage
                  isTouchable
                  onPress={null}
                  style={{
                    height: 35,
                    width: 35,
                    borderRadius: 35,
                    alignSelf: "center",
                    marginLeft: 15,
                    resizeMode: "cover",
                  }}
                  source={{ uri: dataPost?.user?.picture }}
                />
                <View
                  style={{
                    justifyContent: "center",
                    marginHorizontal: 10,
                    maxWidth: "80%",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Lato-Bold",
                      fontSize: 14,
                      // marginTop: 7,
                    }}
                    numberOfLines={1}
                  >
                    {dataPost && dataPost.user
                      ? dataPost.user.first_name
                      : null}{" "}
                    {dataPost.user.last_name ? dataPost.user.last_name : null}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Lato-Regular",
                        fontSize: 10,
                        // marginTop: 7,
                      }}
                    >
                      {/* {duration(dataPost.created_at)} */}
                      {props?.route?.params?.time}
                    </Text>
                    {dataPost && dataPost.location_name ? (
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
                    {dataPost && dataPost.location_name ? (
                      <Text
                        style={{
                          fontFamily: "Lato-Regular",
                          fontSize: 10,
                          // marginTop: 7,
                        }}
                      >
                        <Truncate text={dataPost.location_name} length={40} />
                      </Text>
                    ) : null}
                  </View>
                </View>
                {/* <TouchableOpacity
                style={{
                  position: "absolute",
                  right: 15,
                  alignSelf: "center",
                }}
              >
                <OptionsVertBlack height={20} width={20} />
              </TouchableOpacity> */}
              </View>
              <View
                style={{
                  width: Dimensions.get("screen").width - 20,
                  paddingHorizontal: 20,
                }}
              >
                {dataPost.is_single === false ? (
                  <RenderAlbum
                    data={dataPost}
                    props={props}
                    play={dataPost.id}
                    muted={muted}
                    setMuted={(e) => setMuted(e)}
                    isFocused={isFocused}
                    token={tokenApps}
                    setModalLogin={(e) => setModalLogin(e)}
                  />
                ) : (
                  <RenderSinglePhoto
                    data={dataPost}
                    props={props}
                    play={dataPost.id}
                    muted={muted}
                    setMuted={(e) => setMuted(e)}
                    isFocused={isFocused}
                    token={tokenApps}
                    setModalLogin={(e) => setModalLogin(e)}
                  />
                )}
              </View>

              {/* <AutoHeightImage
              width={Dimensions.get("window").width}
              source={
                dataPost && dataPost.assets[0].filepath
                  ? { uri: dataPost.assets[0].filepath }
                  : default_image
              }
            /> */}
              {/* </View> */}

              <View
                style={{
                  flexDirection: "row",
                  marginTop: 40,
                  backgroundColor: "#ffffff",
                  borderBottomColor: "#209FAE",
                  // borderWidth: 1,
                  borderBottomWidth: 1,
                  marginHorizontal: 15,
                  // height: Dimensions.get('screen').height / 3,
                }}
              >
                <TextInput
                  autoCorrect={false}
                  multiline
                  placeholder={"Write a caption.."}
                  maxLength={255}
                  style={{
                    paddingVertical: 10,
                    width: (Dimensions.get("screen").width * 80) / 100,
                    // borderBottomColor: '#f0f0f0f0',
                    // borderBottomWidth: 1,
                  }}
                  onChangeText={(text) => _setStatusText(text)}
                  value={statusText}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </ScrollView>

      <LocationSelector
        modals={modellocation}
        setModellocation={(e) => setModellocation(e)}
        masukan={(e) => _setLocation(e)}
      />
    </KeyboardAvoidingView>
  );
}
