import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Alert,
  RefreshControl,
  // Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Image from 'react-native-auto-scale-image';
import Modal from "react-native-modal";
import { CustomImage } from "../../component";
import {
  Comment,
  LikeRed,
  LikeEmpty,
  OptionsVertBlack,
  ShareBlack,
  More,
  LikeBlack,
  CommentBlack

} from "../../assets/svg";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import AutoHeightImage from "react-native-auto-height-image";
import likepost from "../../graphQL/Mutation/Post/likepost";
import unlikepost from "../../graphQL/Mutation/Post/unlikepost";
import { Text, Button } from "../../component";
import { Truncate } from "../../component";
import { useTranslation } from "react-i18next";
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

export default function FeedList({
  props,
  dataRender,
  Refresh,
  refreshing,
  token,
}) {
  let [datafeed, SetDataFeed] = useState(dataRender);
  let [selectedOption, SetOption] = useState({});
  let [modalmenu, setModalmenu] = useState(false);
  let [modalmenuother, setModalmenuother] = useState(false);
  let [modalhapus, setModalhapus] = useState(false);
  let [setting, setSetting] = useState();
  console.log(setting?.user?.id);
  const { t, i18n } = useTranslation();
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

  const _liked = async (id) => {
    // console.log(id);
    // SetDataFeed(tempData);
    if (token) {
      var tempData = [...datafeed];
      var index = tempData.findIndex((k) => k["id"] === id);
      tempData[index].liked = true;
      tempData[index].response_count = tempData[index].response_count + 1;
      try {
        let response = await MutationLike({
          variables: {
            post_id: id,
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
            response.data.like_post.code === 200 ||
            response.data.like_post.code === "200"
          ) {
            // _Refresh();
            var tempData = [...datafeed];
            var index = tempData.findIndex((k) => k["id"] === id);
            tempData[index].liked = true;
            tempData[index].response_count = response.data.like_post.count_like;
            // SetDataFeed(tempData);
          } else {
            var tempData = [...datafeed];
            var index = tempData.findIndex((k) => k["id"] === id);
            tempData[index].liked = false;
            tempData[index].response_count = tempData[index].response_count - 1;
            // SetDataFeed(tempData);
            throw new Error(response.data.like_post.message);
          }

          // Alert.alert('Succes');
        }
      } catch (error) {
        var tempData = [...datafeed];
        var index = tempData.findIndex((k) => k["id"] === id);
        tempData[index].liked = false;
        tempData[index].response_count = tempData[index].response_count - 1;
        // SetDataFeed(tempData);
        console.log(error);
        // Alert.alert("" + error);
      }
    } else {
      Alert.alert("Please Login");
    }
  };

  const _unliked = async (id) => {
    var tempData = [...datafeed];
    var index = tempData.findIndex((k) => k["id"] === id);
    tempData[index].liked = false;
    tempData[index].response_count = tempData[index].response_count - 1;
    SetDataFeed(tempData);
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

        if (response.data) {
          if (
            response.data.unlike_post.code === 200 ||
            response.data.unlike_post.code === "200"
          ) {
            // _Refresh();
            var tempData = [...datafeed];
            var index = tempData.findIndex((k) => k["id"] === id);
            tempData[index].liked = false;
            tempData[index].response_count =
              response.data.unlike_post.count_like;
            SetDataFeed(tempData);
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
      SetDataFeed(tempData);
      Alert.alert("Please Login");
    }
  };

  

  const image_scaling = async (image) =>{
    // console.log(data);
    let screen_widht = Dimensions.get("screen").width - 50;
    let screen_height = Dimensions.get("screen").width - 50;
    await Image.getSize(image, (width, height) => {
        screen_height = height * (screen_widht / width);
    });
    return screen_height;

  }
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
        if (loadingunLike) {
          Alert.alert("Loading!!");
        }
        if (errorunLike) {
          throw new Error("Error Input");
        }

        // console.log(response);
        if (response.data) {
          if (
            response.data.delete_post.code === 200 ||
            response.data.delete_post.code === "200"
          ) {
            Refresh();
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

  const loadAsync = async () => {
    // await GetDataSetting();
    // if (datas && datas.setting_data) {
    // 	await AsyncStorage.setItem('setting', JSON.stringify(datas.setting_data));
    // }

    let setsetting = await AsyncStorage.getItem("setting");
    setSetting(JSON.parse(setsetting));
  };

  useEffect(() => {
    loadAsync();
  }, []);

  let [liked, setLiked] = useState(false);

  const createPost = () => {
    props.navigation.push("Post");
  };

  const viewcomment = (data) => {
    props.navigation.navigate("CommentPost", {
      data: data,
      token: token,
    });
    // console.log(id_post);
  };

  const [selected, setSelected] = useState(new Map());

  const OptionOpen = (data) => {
    SetOption(data);
    if (data.user.ismyfeed == true) {
      setModalmenu(true);
    } else {
      setModalmenuother(true);
    }
  };

  function Item({ selected, dataRender }) {
    return (
      <View
        style={{
          width: Dimensions.get("window").width - 20,
          backgroundColor: "#FFFFFF",
          flex: 1,
          marginHorizontal: 10,
          marginVertical:7,
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
            // justifyContent: 'space-evenly',
            alignContent: "center",
          }}
        >
          <CustomImage
            isTouchable
            onPress={() => {
              dataRender.user.id !== setting?.user?.id
                ? props.navigation.push("otherprofile", {
                    idUser: dataRender.user.id,
                  })
                : props.navigation.push("ProfileTab");
            }}
            customStyle={{
              height: 40,
              width: 40,
              borderRadius: 15,
              alignSelf: "center",
              marginLeft: 15,
            }}
            customImageStyle={{ resizeMode: "cover", borderRadius: 50 }}
            source={{ uri: dataRender.user.picture }}
          />
          <View
            style={{
              justifyContent: "center",
              marginHorizontal: 10,
            }}
          >
            <Text
              onPress={() => {
                dataRender.user.id !== setting?.user?.id
                  ? props.navigation.push("otherprofile", {
                      idUser: dataRender.user.id,
                    })
                  : props.navigation.push("ProfileTab");
              }}
              style={{
                fontFamily: "Lato-Bold",
                fontSize: 14,
                // marginTop: 7,
              }}
            >
              {dataRender.user.first_name}{" "}
              {dataRender.user.first_name ? dataRender.user.last_name : null}
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
          <TouchableOpacity
            onPress={() => OptionOpen(dataRender)}
            style={{
              position: "absolute",
              right: 15,
              top: 2,
              alignSelf: "center",
            }}
          >
            <More height={20} width={20} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginHorizontal: 10,
            alignContent: 'center',
            justifyContent: 'center',
            alignItems:'center',
            width : Dimensions.get("window").width - 40,
            borderRadius: 15,
          }}>
          {dataRender && dataRender.assets && dataRender.assets[0].filepath ?
            <Image
              style={{
                width: Dimensions.get("window").width -40,
                borderRadius: 15,
                alignSelf: "center",
              }}
              uri= {dataRender.assets[0].filepath }
          />
          :null
          }
          {/* <AutoHeightImage
            width={Dimensions.get("window").width -40}
            source={{ uri: dataRender.assets[0]?.filepath }}
          /> */}
        </View>

        <View
          style={{
            width: "100%",
            backgroundColor: "white",
            marginTop: 17,
          }}>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "white",
              justifyContent: "space-between",
              paddingHorizontal: 10,
            }}>
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
                    borderRadius:16,
                    backgroundColor: '#F2DAE5'
                    // minidth: 70,
                    // right: 10,
                  }}
                >
                  <LikeRed height={15} width={15} />
                  <Text type='black' size='label'  style={{ marginHorizontal: 5, color: '#BE3737' }}>
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
                    borderRadius:16,
                    // right: 10,
                  }}
                >
                  <LikeBlack height={15} width={15} />
                  <Text type='black' size='label' style={{ marginHorizontal: 7 }}>
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
                <Text type='black' size='label'  style={{ marginHorizontal: 7 }}>
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
							{dataRender.user.first_name} {''}{' '}
							{dataRender.user.first_name ? dataRender.user.last_name : null}
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
                  {dataRender.user.first_name}{" "}
                  {dataRender.user.first_name
                    ? dataRender.user.last_name
                    : null}{" "}
                </Text>
                {dataRender.caption}
              </Text>
            ) : null}
          </View>
        </View>
      
      </View>
    );
  }

  return (
    <View>
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
      
      <FlatList
        data={datafeed}
        renderItem={({ item }) => (
          <Item dataRender={item} selected={selected} />
        )}
        style={{
          paddingVertical: 7,
        }}
        keyExtractor={(item) => item.id_post}
        extraData={liked}
        refreshing={refreshing}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => Refresh()} />
        }
      />
    </View>
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
