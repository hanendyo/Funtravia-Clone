import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Dimensions,
  ImageBackground,
  Alert,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Arrowbackwhite,
  Comment,
  LikeRed,
  LikeEmpty,
  OptionsVertBlack,
  ShareBlack,
  More,
  LikeBlack,
  CommentBlack,
} from "../../assets/svg";
import Modal from "react-native-modal";

import Image from "react-native-auto-scale-image";
import { FlatList } from "react-native-gesture-handler";
import { useMutation } from "@apollo/react-hooks";
import { Button, Text } from "../../component";
import { Truncate } from "../../component";
import AutoHeightImage from "react-native-auto-height-image";
import { useTranslation } from "react-i18next";
import likepost from "../../graphQL/Mutation/Post/likepost";
import unlikepost from "../../graphQL/Mutation/Post/unlikepost";
import { default_image } from "../../assets/png";
import { CustomImage } from "../../component";
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
  let [modalmenu, setModalmenu] = useState(false);
  let [modalmenuother, setModalmenuother] = useState(false);
  let [modalhapus, setModalhapus] = useState(false);
  let [users, setuser] = useState(null);
  let [selectedOption, SetOption] = useState({});

  const loadasync = async () => {
    let user = await AsyncStorage.getItem("setting");
    user = JSON.parse(user);
    setuser(user.user);
  };
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

  const _deletepost = async (datas) => {
    setModalhapus(false);
    setModalmenu(false);

    if (token || token !== "") {
      try {
        let response = await Mutationdeletepost({
          variables: {
            post_id: datas.id,
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
            // Refresh();
            var tempData = [...data];
            var index = tempData.findIndex((k) => k["id"] === datas.id);
            if (index > -1) {
              tempData.splice(index, 1);
            }
            setdata(tempData);
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

  const viewcomment = (data) => {
    data.user = datauser;
    props.navigation.navigate("CommentPost", {
      data: data,
      token: token,
    });
    // console.log(id_post);
  };
  function Item({ selected, dataRender }) {
    return (
      <View
        style={{
          width: Dimensions.get("window").width - 20,
          backgroundColor: "#FFFFFF",
          flex: 1,
          marginHorizontal: 10,
          marginVertical: 7,
          borderRadius: 20,
          borderBottomWidth: 1,
          borderBottomColor: "#EEEEEE",
          paddingBottom: 25,
        }}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            marginVertical: 15,
            paddingHorizontal: 10,
            justifyContent: "space-between",
            // alignContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <CustomImage
              isTouchable
              onPress={() => {
                datauser.id !== users?.id
                  ? props.navigation.push("ProfileStack", {
                      screen: "otherprofile",
                      params: {
                        idUser: datauser.id,
                      },
                    })
                  : props.navigation.push("ProfileStack", {
                      screen: "ProfileTab",
                    });
              }}
              customStyle={{
                height: 40,
                width: 40,
                borderRadius: 15,
                alignSelf: "center",
                // marginLeft: 15,
              }}
              customImageStyle={{ resizeMode: "cover", borderRadius: 50 }}
              source={{ uri: datauser.picture }}
            />
            <View
              style={{
                justifyContent: "center",
                marginHorizontal: 10,
              }}
            >
              <Text
                onPress={() => {
                  datauser.id !== users?.id
                    ? props.navigation.push("ProfileStack", {
                        screen: "otherprofile",
                        params: {
                          idUser: datauser.id,
                        },
                      })
                    : props.navigation.push("ProfileStack", {
                        screen: "ProfileTab",
                      });
                }}
                style={{
                  fontFamily: "Lato-Bold",
                  fontSize: 14,
                  // marginTop: 7,
                }}
              >
                {datauser.first_name}{" "}
                {datauser.first_name ? datauser.last_name : null}
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
                  {duration(dataRender.created_at)}
                </Text>
                {dataRender.location_name ? (
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
                {dataRender.location_name ? (
                  <Text
                    style={{
                      fontFamily: "Lato-Regular",
                      fontSize: 10,
                      // marginTop: 7,
                    }}
                  >
                    <Truncate text={dataRender.location_name} length={40} />
                  </Text>
                ) : null}
              </View>
            </View>
          </View>
          <Pressable
            onPress={() => OptionOpen(dataRender)}
            style={{
              // position: "absolute",
              // right: 15,
              // top: 2,
              alignSelf: "center",
            }}
          >
            <More height={20} width={20} />
          </Pressable>
        </View>
        <View
          style={{
            marginHorizontal: 10,
            alignContent: "center",
            justifyContent: "center",
            alignItems: "center",
            width: Dimensions.get("window").width - 40,
            minHeight: Dimensions.get("window").width - 155,
            borderWidth: 0.5,
            borderColor: "#EEEEEE",
            borderRadius: 15,
          }}
        >
          {dataRender && dataRender.assets && dataRender.assets[0].filepath ? (
            <Image
              style={{
                width: Dimensions.get("window").width - 40,
                borderRadius: 15,
                alignSelf: "center",
              }}
              uri={dataRender.assets[0].filepath}
            />
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
              {dataRender.liked ? (
                <Button
                  onPress={() => _unliked(dataRender.id)}
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
                    {dataRender.response_count}
                  </Text>
                </Button>
              ) : (
                <Button
                  onPress={() => _liked(dataRender.id)}
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
                    {dataRender.response_count}
                  </Text>
                </Button>
              )}

              <Button
                onPress={() => viewcomment(dataRender)}
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
                <Text type="black" size="label" style={{ marginHorizontal: 7 }}>
                  {dataRender.comment_count}
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
							{datauser.first_name} {''}{' '}
							{datauser.first_name ? datauser.last_name : null}
						</Text> */}
            {dataRender.caption ? (
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
                  {datauser.first_name}{" "}
                  {datauser.first_name ? datauser.last_name : null}{" "}
                </Text>
                {dataRender.caption}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    );
  }
  const [selected, setSelected] = useState(new Map());
  const OptionOpen = (data) => {
    data.user = datauser;
    SetOption(data);
    if (datauser.id == users?.id) {
      setModalmenu(true);
    } else {
      setModalmenuother(true);
    }
  };

  return (
    <View>
      <FlatList
        style={
          {
            // flex: 1,
            // backgroundColor: "white",
          }
        }
        data={data}
        initialScrollIndex={index}
        // focusable
        initialNumToRender={index}
        renderItem={({ item }) => (
          <Item dataRender={item} selected={selected} />
        )}
      />
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
          <Pressable
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
          </Pressable>
          <Pressable
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
          </Pressable>
          <Pressable
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
          </Pressable>
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
          <Pressable
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
          </Pressable>
          <Pressable
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
          </Pressable>
          <Pressable
            style={{
              paddingVertical: 10,
            }}
            onPress={() => {}}
          >
            <Text size="description" type="regular" style={{}}>
              {t("copyLink")}
            </Text>
          </Pressable>
          <Pressable
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
          </Pressable>
          <Pressable
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
          </Pressable>
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
    </View>
  );
}
