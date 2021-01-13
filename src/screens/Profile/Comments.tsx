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
import CommentList from "../../../graphQL/Query/Feed/CommentList";
import { NavigationEvents } from "react-navigation";
import commentpost from "../../../graphQL/Mutation/Post/commentpost";
import { Arrowbackwhite } from "../../../const/Svg";
export default function Comments(props) {
  let [statusText, setStatusText] = useState("");
  let [selected, setSelected] = useState(new Map());
  let [datauser] = useState(props.navigation.getParam("datauser"));
  let [dataPost, setDataPost] = useState(props.navigation.getParam("data"));
  let [token, setToken] = useState(props.navigation.getParam("token"));
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

    setuser(user.user);
  };

  useEffect(() => {
    loadasync();
  }, []);

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
    console.log(dataComment);
    return (
      <View
        style={{
          // width: Dimensions.get('window').width,
          backgroundColor: "#FFFFFF",
          // flex: 1,
          // borderBottomWidth: 1,
          // borderBottomColor: '#EEEEEE',
          marginHorizontal: 15,
          marginVertical: 10,
        }}
      >
        <NavigationEvents onDidFocus={() => loadasync()} />

        <View
          style={{
            width: "100%",
            flexDirection: "row",
            // marginVertical: 10,
            alignContent: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              dataComment.user.id !== users.id
                ? props.navigation.push("otherprofile", {
                    idUser: dataComment.user.id,
                  })
                : props.navigation.push("ProfileTab");
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
                  // marginTop: 7,
                }}
              >
                {dataComment.user?.first_name} {dataComment.user?.last_name}
              </Text>
              <Text
                allowFontScaling={false}
                style={{
                  fontFamily: "Lato-Regular",
                  fontSize: 10,
                  // marginTop: 7,
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
            // marginLeft: 45,
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
      }}
    >
      <NavigationEvents onDidFocus={() => GetCommentList()} />
      <View
        style={{
          // width: Dimensions.get('window').width,
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
              ? props.navigation.push("otherprofile", {
                  idUser: datauser.id,
                })
              : props.navigation.push("ProfileTab");
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
          {/* <TouchableOpacity
						style={{
							position: 'absolute',
							right: 0,
							alignSelf: 'center',
						}}>
						<OptionsVertBlack height={20} width={20} />
					</TouchableOpacity> */}
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
      {/* {console.log(data)} */}

      {/* <View> */}
      <FlatList
        ref={slider}
        data={data ? data.comment : null}
        renderItem={({ item }) => {
          return <Item dataComment={item} />;
        }}
        keyExtractor={(item) => item.id}
        extraData={selected}
      />
      {/* <View
					style={{
						flex: 1,
						flexDirection: 'row',
						height: 60,
						width: Dimensions.get('screen').width,
					}}
				/> */}
      {/* </View> */}
      <View
        style={{
          flexDirection: "row",
          // marginTop: 25,
          backgroundColor: "#F0F0F0",
          // height: 100,
          width: Dimensions.get("screen").width,
          // position: 'absolute',
          // bottom: 0,
          alignItems: "center",
          // justifyContent: 'space-around',
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
            // borderBottomColor: '#f0f0f0f0',
            // borderWidth: 1,
            marginLeft: 20,
          }}
          onChangeText={(text) => setStatusText(text)}
          value={statusText}
        />
        {/* {console.log(dataPost)}
				{console.log(dataPost.id)} */}
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

Comments.navigationOptions = ({ navigation }) => ({
  headerTitle: "Comments",
  headerMode: "screen",
  headerStyle: {
    backgroundColor: "#209FAE",
    elevation: 0,
    borderBottomWidth: 0,
    fontSize: 50,
    // justifyContent: 'center',
    // flex:1,
    // zIndex: 30,
  },
  headerTitleStyle: {
    fontFamily: "Lato-Regular",
    fontSize: 14,
    color: "white",
    alignSelf: "center",
  },
  headerLeft: (
    <TouchableOpacity
      style={{
        height: 40,
        width: 40,
        // borderWidth:1,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        // backgroundColor:'white'
      }}
      onPress={() => navigation.goBack()}
    >
      <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
    </TouchableOpacity>
  ),
  headerLeftContainerStyle: {
    // paddingLeft: 20,
  },
  headerRight: (
    <View style={{ flexDirection: "row" }}>
      {/* <TouchableOpacity
				style={{ marginRight: 20 }}
				onPress={() => Alert.alert('Coming soon')}>
				<OptionsVertWhite height={20} width={20} />
			</TouchableOpacity> */}
    </View>
  ),
  headerRightStyle: {
    paddingRight: 20,
  },
});

const styles = StyleSheet.create({
  main: {
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: 'grey',
  },
  captionFont: { fontSize: 12 },
});
