import React, { useState, useEffect } from "react";
import { View, SafeAreaView, FlatList, Dimensions } from "react-native";
import { Text, Button } from "../../component";
import { Arrowbackios, Arrowbackwhite } from "../../assets/svg";
import { useTranslation } from "react-i18next";
import ListFotoAlbum from "../../graphQL/Query/Feed/ListFotoAlbum";
import { useLazyQuery } from "@apollo/client";
import RenderGridAlbum from "./RenderGridAlbum";
import AddAlbumFeed from "../../graphQL/Mutation/Post/AddAlbumFeed";
import { useMutation } from "@apollo/client";
import { RNToasty } from "react-native-toasty";
import { CommonActions } from "@react-navigation/native";
import { useSelector } from "react-redux";

export default function ListFotoAlbums(props) {
  const from = props.route.params?.from;
  const { t } = useTranslation();
  const tokenApps = useSelector((data) => data.token);
  let setting = useSelector((data) => data.setting);
  const [show, setShow] = useState(true);
  // const from = props.route.params.from;
  const HeaderComponent = {
    headerShown: true,
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: "",
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      fontFamily: "Lato-Bold",
      fontSize: 16,
      color: "white",
    },
    headerLeftContainerStyle: {
      background: "#FFF",

      marginLeft: 10,
    },
    headerLeft: () => (
      <View style={{ flexDirection: "row" }}>
        <Button
          text={""}
          size="medium"
          type="circle"
          variant="transparent"
          onPress={() => {
            show === true
              ? props.navigation.goBack()
              : props.navigation.navigate("BottomStack", {
                  screen: "FeedBottomScreen",
                  params: {
                    screen: "FeedScreen",
                    params: {
                      isPost: "",
                      caption: "",
                      latitude: "",
                      longitude: "",
                      location_name: "",
                      albums_id: "",
                      itinerary_id: "",
                      day_id: "",
                      oriented: "",
                      assets: "",
                    },
                  },
                });
          }}
        >
          {Platform.OS == "ios" ? (
            <Arrowbackios height={15} width={15}></Arrowbackios>
          ) : (
            <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
          )}
        </Button>
        <View style={{ marginLeft: 5 }}>
          <Text size="label" type="bold" style={{ color: "#FFF" }}>
            {t("tagTo")}
          </Text>
          <Text size="description" type="regular" style={{ color: "#FFF" }}>
            {t("Select") + " Album"}
          </Text>
        </View>
      </View>
    ),
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    QueryFotoAlbum();
  }, []);

  const [
    QueryFotoAlbum,
    { data: dataFotoAlbum, loading: loadingFotoAlbum, error: errorFotoAlbum },
  ] = useLazyQuery(ListFotoAlbum, {
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenApps,
      },
    },
    variables: { album_id: props.route.params.id_album },
  });

  const [
    MutationAddAlbumFeed,
    { loading: loadingMutation, data: dataMutation, error: errorMutation },
  ] = useMutation(AddAlbumFeed, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenApps,
      },
    },
  });

  const SubmitAdd = async () => {
    console.log("submit album");
    try {
      let response = await MutationAddAlbumFeed({
        variables: {
          album_id: props.route.params.id_album,
          post_id: props.route.params.post_id,
        },
      });
      if (response.data) {
        if (
          response &&
          response.data &&
          response.data.link_post_to_album.code === 200
        ) {
          await QueryFotoAlbum();
          await setShow(false);
          await RNToasty.Show({
            title: "Berhasil memindahkan Foto",
            position: "bottom",
            duration: 1,
          });
          setTimeout(() => {
            if (from == "funFeed") {
              props.navigation.navigate("FeedScreen", {
                token: tokenApps,
                updateDataPost: response.data.link_post_to_album.data,
                caption: props.route.params.data_post.caption,
                response_count: props.route.params.data_post.response_count,
                comment_count: props.route.params.data_post.comment_count,
                liked: props.route.params.data_post.liked,
                from: "funFeedAlbum",
                test: "test",
              });
            } else if (from == "funFeedComment") {
              props.navigation.dispatch(
                CommonActions.navigate({
                  name: "FeedStack",
                  params: {
                    screen: "CommentPost",
                    params: {
                      updateDataPost: response.data.link_post_to_album.data,
                      from: "funFeedCommentAlbum",
                    },
                  },
                })
              );
            } else if (from == "feedProfil") {
              props.navigation.dispatch(
                CommonActions.navigate({
                  name: "ProfileStack",
                  params: {
                    screen: "myfeed",
                    params: {
                      datauser: setting?.user,
                      updateDataPost: response.data.link_post_to_album.data,
                      caption: props.route.params.data_post.caption,
                      response_count:
                        props.route.params.data_post.response_count,
                      comment_count: props.route.params.data_post.comment_count,
                      liked: props.route.params.data_post.liked,
                      from: "feedProfilAlbum",
                    },
                  },
                })
              );
            } else if (from == "feedProfilComment") {
              props.navigation.dispatch(
                CommonActions.navigate({
                  name: "FeedStack",
                  params: {
                    screen: "CommentPost",
                    params: {
                      datauser: setting?.user,
                      updateDataPost: response.data.link_post_to_album.data,
                      data_post: props.route.params.data_post,
                      // caption: props.route.params.data_post.caption,
                      // response_count:
                      //   props.route.params.data_post.response_count,
                      // comment_count: props.route.params.data_post.comment_count,
                      // liked: props.route.params.data_post.liked,
                      from: "feedProfilCommentAlbum",
                    },
                  },
                })
              );
            } else if (from == "notificationComment") {
              props.navigation.dispatch(
                CommonActions.navigate({
                  name: "FeedStack",
                  params: {
                    screen: "CommentPost",
                    params: {
                      updateDataPost: response.data.link_post_to_album.data,
                      from: "notificationCommentAlbum",
                    },
                  },
                })
              );
            } else {
              console.log("comment");
              props.navigation.dispatch(
                CommonActions.reset({
                  routes: [
                    // { name: "CommentPost", key: props.route.params.key },
                    {
                      name: "CommentPost",
                      params: {
                        post_id: response.data.link_post_to_album.data.id,
                        data: response.data.link_post_to_album.data,
                        token: tokenApps,
                      },
                    },
                  ],
                  index: 4,
                })
              );
              // props.navigation.reset({
              //   index: 0,
              //   routes: [
              //     { name: "CommentPost" },
              //     {
              //       name: "CommentPost",
              //       params: {
              //         post_id: response.data.link_post_to_album.data.id,
              //         data: response.data.link_post_to_album.data,
              //         token: token,
              //       },
              //     },
              //   ],
              // });

              // props.navigation.push("FeedStack", {
              //   screen: "CommentPost",
              //   params: {
              //     post_id: response.data.link_post_to_album.data.id,
              //     data: response.data.link_post_to_album.data,
              //   },
              // });
            }
          }, 1000);
        } else {
          console.log("gagal");
        }
      }
    } catch (e) {
      RNToasty.Show({
        title: t("failedCreateAlbum"),
        position: "bottom",
        duration: 1,
      });
    }
  };

  const spreadData = (data) => {
    let tmpData = [];
    let count = 1;
    let tmpArray = [];
    let grid = 1;
    for (let val of data) {
      if (count < 3) {
        tmpArray.push(val);
        count++;
      } else {
        tmpArray.push(val);
        tmpArray.push({ grid: grid });
        grid++;
        if (grid == 4) {
          grid = 1;
        }
        tmpData.push(tmpArray);
        count = 1;
        tmpArray = [];
      }
    }
    if (tmpArray.length) {
      tmpData.push(tmpArray);
    }
    return tmpData;
  };

  let lis_foto = [];
  if (dataFotoAlbum && dataFotoAlbum.detail_media_album) {
    lis_foto = spreadData(dataFotoAlbum.detail_media_album);
  }

  const [tinggi, setTinggi] = useState(0);

  return (
    <SafeAreaView style={{ flex: 1, paddingBottom: tinggi }}>
      <FlatList
        data={lis_foto}
        renderItem={({ item, index }) => (
          <RenderGridAlbum item={item} index={index} props={props} />
        )}
        style={{
          marginHorizontal: 10,
        }}
        keyExtractor={(item) => item[0].id}
        showsVerticalScrollIndicator={false}
      />
      {show ? (
        <View
          onLayout={(event) => {
            const heig = event?.nativeEvent?.layout;
            setTinggi(heig.height);
          }}
          style={{
            position: "absolute",
            width: Dimensions.get("screen").width,
            // height: 100,
            backgroundColor: "#FFF",
            borderTopWidth: 1,
            borderColor: "#d1d1d1",
            paddingHorizontal: 15,
            bottom: 0,
          }}
        >
          <Button
            onPress={() => SubmitAdd()}
            text="Tag to this album"
            style={{ marginVertical: 20 }}
            size="large"
          ></Button>
        </View>
      ) : null}
    </SafeAreaView>
  );
}
