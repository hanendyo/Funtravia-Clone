import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  TextInput,
  Pressable,
  Keyboard,
  AsyncStorage,
} from "react-native";
import { Text } from "native-base";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import CommentList from "../../graphQL/Query/Feed/CommentList";
import commentpost from "../../graphQL/Mutation/Post/commentpost";
import { Arrowbackwhite } from "../../assets/svg";
import { Button } from "../../component";
import { useTranslation } from "react-i18next";
export default function Comments(props) {
  const HeaderComponent = {
    headerTransparent: false,
    title: () => <Text style={{ color: "white" }}>{t("Comments")}</Text>,
    headerTintColor: "white",
    headerTitle: () => <Text style={{ color: "white" }}>{t("Comments")}</Text>,
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
  const { t } = useTranslation();

  let [statusText, setStatusText] = useState("");
  let [selected, setSelected] = useState(new Map());
  let [datauser] = useState(props.route.params.datauser);
  let [dataPost, setDataPost] = useState(props.route.params.data);
  let [token, setToken] = useState(props.route.params.token);
  let slider = useRef();
  let [users, setuser] = useState(null);

  const [
    MutationComment,
    { loading: loadingLike, data: dataLike, error: errorLike },
  ] = useMutation(commentpost, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const loadasync = async () => {
    let user = await AsyncStorage.getItem("setting");
    user = JSON.parse(user);

    await setuser(user.user);
    await GetCommentList();
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      loadasync();
    });
    return unsubscribe;
  }, [props.navigation]);
  const comment = async (id, text) => {
    // console.log(id);
    // console.log(text);
    Keyboard.dismiss();
    if ((token || token !== "") && text !== "") {
      try {
        let response = await MutationComment({
          variables: {
            post_id: id,
            text: text,
          },
        });
        if (loadingLike) {
          Alert.alert("Loading!!");
        }
        if (errorLike) {
          throw new Error("Error Input");
        }
        if (response.data) {
          if (
            response.data.comment_post.code === 200 ||
            response.data.comment_post.code === "200"
          ) {
            setStatusText("");

            GetCommentList();
            scroll_to();
          } else {
            throw new Error(response.data.comment_post.message);
          }

          // Alert.alert('Succes');
        }
      } catch (error) {
        // console.log(error);
        Alert.alert("" + error);
      }
    } else {
      Alert.alert("Please Login");
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

  let [liked, setLiked] = useState(false);

  const likeToggle = (value) => {
    if (value == true) {
      console.log("liked: ");
    } else {
      console.log("unliked: ");
    }
  };

  const duration = (datetime) => {
    // datetime = datetime.replace(' ', 'T');
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

  const Item = ({ dataComment }) => {
    return (
      <View
        style={{
          backgroundColor: "#FFFFFF",

          marginHorizontal: 15,
          marginVertical: 10,
        }}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignContent: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              dataComment.user.id !== users.id
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
              flexDirection: "row",
            }}
          >
            <Image
              style={{
                height: 35,
                width: 35,
                borderRadius: 17.5,
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
                allowFontScaling={false}
                style={{
                  fontFamily: "Lato-Bold",
                  fontSize: 14,
                }}
              >
                {dataComment.user?.first_name} {dataComment.user?.last_name}
              </Text>
              <Text
                allowFontScaling={false}
                style={{
                  fontFamily: "Lato-Regular",
                  fontSize: 10,
                }}
              >
                {duration(dataComment.created_at)}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: "100%",
            marginVertical: 5,
          }}
        >
          <Text
            allowFontScaling={false}
            style={{
              textAlign: "left",
              fontFamily: "Lato-Regular",
              fontSize: 14,
              color: "#616161",
            }}
          >
            {dataComment.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <View
        style={{
          backgroundColor: "#FFFFFF",
          // flex: 1,
          borderBottomWidth: 1,
          borderBottomColor: "#EEEEEE",
          marginHorizontal: 15,
          marginTop: 15,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            datauser.id !== users.id
              ? props.navigation.push("ProfileStack", {
                  screen: "otherprofile",
                  params: {
                    idUser: datauser.id,
                  },
                })
              : props.navigation.push("ProfileStack", { screen: "ProfileTab" });
          }}
          style={{
            width: "100%",
            flexDirection: "row",
            marginVertical: 10,
            alignContent: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <Image
              style={{
                height: 35,
                width: 35,

                alignSelf: "center",
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
                allowFontScaling={false}
                style={{
                  fontFamily: "Lato-Bold",
                  fontSize: 14,
                  // marginTop: 7,
                }}
              >
                {datauser.first_name} {""}{" "}
                {datauser.first_name ? datauser.last_name : null}
              </Text>
              <Text
                allowFontScaling={false}
                style={{
                  fontFamily: "Lato-Regular",
                  fontSize: 10,
                  // marginTop: 7,
                }}
              >
                {duration(dataPost.created_at)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <View
          style={{
            width: "100%",
            marginVertical: 15,
          }}
        >
          <Text
            allowFontScaling={false}
            style={{
              textAlign: "left",
              fontFamily: "Lato-Regular",
              fontSize: 14,
              color: "#616161",
            }}
          >
            {dataPost.caption}
          </Text>
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

      <View
        style={{
          flexDirection: "row",
          backgroundColor: "#F0F0F0",
          width: Dimensions.get("screen").width,

          alignItems: "center",
        }}
      >
        <TextInput
          allowFontScaling={false}
          multiline
          placeholder={
            "Comment as " +
            (users && users.first_name ? users.first_name : "") +
            "..."
          }
          maxLength={255}
          style={{
            height: 60,
            width: (Dimensions.get("screen").width * 80) / 100,

            marginLeft: 20,
          }}
          onChangeText={(text) => setStatusText(text)}
          value={statusText}
        />

        <Pressable
          onPress={() => comment(dataPost.id, statusText)}
          style={{
            flex: 1,
            height: 60,
            alignItems: "center",
            justifyContent: "center",
            paddingRight: 10,
          }}
        >
          <Text
            allowFontScaling={false}
            style={{
              alignSelf: "center",
              fontFamily: "Lato-Bold",
              fontSize: 15,
              color: "#209fae",
            }}
          >
            Post
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
