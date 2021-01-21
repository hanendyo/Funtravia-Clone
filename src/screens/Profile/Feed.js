import React, { useState, useCallback, useEffect } from "react";
import { View, Dimensions, Image, ImageBackground, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Arrowbackwhite,
  LikeRed,
  LikeEmpty,
  ShareBlack,
  Comment,
} from "../../assets/svg";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { useMutation } from "@apollo/react-hooks";
import { Button, Text } from "../../component";
import { Truncate } from "../../component";
import AutoHeightImage from "react-native-auto-height-image";
import { useTranslation } from "react-i18next";
import likepost from "../../graphQL/Mutation/Post/likepost";
import unlikepost from "../../graphQL/Mutation/Post/unlikepost";
import { default_image } from "../../assets/png";

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
  let [data, setdata] = useState(props.route.params.data);
  let index = props.route.params.index;

  let [users, setuser] = useState(null);

  const loadasync = async () => {
    let user = await AsyncStorage.getItem("setting");
    user = JSON.parse(user);
    setuser(user.user);
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    if (props.route.params && props.route.params.data) {
    } else {
      console.log("data");
    }

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

  const _liked = async (id) => {
    // console.log(id);
    if (token || token !== "") {
      var tempData = [...data];
      var index = tempData.findIndex((k) => k["id"] === id);
      tempData[index].liked = true;
      tempData[index].response_count = tempData[index].response_count + 1;
      setdata(tempData);
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
            var tempData = [...data];
            var index = tempData.findIndex((k) => k["id"] === id);
            tempData[index].liked = true;
            tempData[index].response_count = response.data.like_post.count_like;
            setdata(tempData);
          } else {
            var tempData = [...data];
            var index = tempData.findIndex((k) => k["id"] === id);
            tempData[index].liked = false;
            tempData[index].response_count = tempData[index].response_count - 1;
            setdata(tempData);
            throw new Error(response.data.like_post.message);
          }

          // Alert.alert('Succes');
        }
      } catch (error) {
        var tempData = [...data];
        var index = tempData.findIndex((k) => k["id"] === id);
        tempData[index].liked = false;
        tempData[index].response_count = tempData[index].response_count - 1;
        setdata(tempData);
        // console.log(error);
        Alert.alert("" + error);
      }
    } else {
      Alert.alert("Please Login");
    }
  };

  const _unliked = async (id) => {
    var tempData = [...data];
    var index = tempData.findIndex((k) => k["id"] === id);
    tempData[index].liked = false;
    tempData[index].response_count = tempData[index].response_count - 1;
    setdata(tempData);
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
            var tempData = [...data];
            var index = tempData.findIndex((k) => k["id"] === id);
            tempData[index].liked = false;
            tempData[index].response_count =
              response.data.unlike_post.count_like;
            setdata(tempData);
          } else {
            throw new Error(response.data.unlike_post.message);
          }

          // Alert.alert('Succes');
        }
      } catch (error) {
        Alert.alert("" + error);
      }
    } else {
      tempData[index].liked = true;
      tempData[index].response_count = tempData[index].response_count + 1;
      setdata(tempData);
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

  const viewcomment = (datas) => {
    props.navigation.push("Comments", {
      datauser: datauser,
      data: datas,
      token: token,
    });
    // console.log(id_post);
  };

  return (
    <FlatList
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
      data={data}
      initialScrollIndex={index}
      // focusable
      initialNumToRender={index}
      renderItem={({ item, index }) => (
        <View
          style={{
            // width: Dimensions.get('window').width,
            backgroundColor: "#FFFFFF",
            flex: 1,
            borderBottomWidth: 1,
            borderBottomColor: "#EEEEEE",
            paddingBottom: 20,
          }}
        >
          {/* {console.log(item)} */}

          <View
            style={{
              width: "100%",
              flexDirection: "row",
              marginVertical: 15,
              justifyContent: "space-between",
              alignContent: "center",
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
              style={{ flexDirection: "row" }}
            >
              <Image
                style={{
                  height: 35,
                  width: 35,
                  borderRadius: 17.5,
                  alignSelf: "center",
                  marginLeft: 15,
                  resizeMode: "cover",
                }}
                source={
                  datauser && datauser.picture !== (null || undefined)
                    ? { uri: datauser.picture }
                    : {
                        uri:
                          "https://i.ytimg.com/vi/_u_bdjPsj5U/maxresdefault.jpg",
                      }
                }
              />
              <View
                style={{
                  justifyContent: "center",
                  marginHorizontal: 10,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Lato-Bold",
                    fontSize: 14,
                    // marginTop: 7,
                  }}
                >
                  {datauser &&
                  (datauser.first_name || datauser.username) !==
                    (null || undefined)
                    ? datauser.first_name || datauser.username
                    : "John"}{" "}
                  {datauser &&
                  datauser.first_name !== (null || undefined) &&
                  datauser.first_name
                    ? datauser.last_name
                    : ""}
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
                      style={{
                        fontFamily: "Lato-Regular",
                        fontSize: 10,
                        // marginTop: 7,
                      }}
                    >
                      <Truncate text={item.location_name} length={40} />
                    </Text>
                  ) : null}
                </View>
              </View>
            </TouchableOpacity>
            {/* <TouchableOpacity
							style={{
								// position: 'absolute',
								right: 15,
								alignSelf: 'center',
							}}>
							<OptionsVertBlack height={20} width={20} />
						</TouchableOpacity> */}
          </View>
          <AutoHeightImage
            width={Dimensions.get("window").width}
            source={{ uri: item.assets[0]?.filepath }}
          />

          <View
            style={{
              width: "100%",
              backgroundColor: "white",
              padding: 10,
            }}
          >
            <View
              style={{
                width: "100%",
                flexDirection: "row",
              }}
            >
              {item.caption ? (
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
                    {datauser &&
                    (datauser.first_name || datauser.username) !==
                      (null || undefined)
                      ? datauser.first_name || datauser.username
                      : "John"}{" "}
                    {datauser && datauser.first_name !== (null || undefined)
                      ? datauser.last_name
                      : " "}{" "}
                  </Text>
                  {item.caption}
                </Text>
              ) : null}
            </View>
            <View
              style={{
                flexDirection: "row",
                backgroundColor: "white",
                justifyContent: "space-between",
                // paddingHorizontal: 10,
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
                    onPress={() => _unliked(item.id)}
                    type="icon"
                    variant="transparent"
                    position="left"
                    size="small"
                    style={{
                      paddingHorizontal: 2,
                      marginRight: 10,

                      // right: 10,
                    }}
                  >
                    <LikeRed height={20} width={20} />
                    <Text style={{ marginHorizontal: 3 }}>
                      {item.response_count}
                    </Text>
                  </Button>
                ) : (
                  <Button
                    onPress={() => _liked(item.id)}
                    type="icon"
                    variant="transparent"
                    position="left"
                    size="small"
                    style={{
                      paddingHorizontal: 2,
                      marginRight: 10,
                      // right: 10,
                    }}
                  >
                    <LikeEmpty height={20} width={20} />
                    <Text style={{ marginHorizontal: 3 }}>
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
                  <Comment height={20} width={20} />
                  <Text style={{ marginHorizontal: 3 }}>
                    {item.comment_count}
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
                <ShareBlack height={20} width={20} />
                <Text size="small" style={{ marginLeft: 3 }}>
                  {t("share")}
                </Text>
              </Button>
            </View>
          </View>
        </View>
      )}
    />
  );
}
