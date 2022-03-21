import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  Alert,
  RefreshControl,
  FlatList,
  Pressable,
  Platform,
  BackHandler,
  StatusBar,
  SafeAreaView,
} from "react-native";
import {
  Sharegreen,
  Arrowbackwhite,
  Arrowbackios,
  Xgray,
} from "../../assets/svg";
import { useLazyQuery, useMutation } from "@apollo/client";
import { Item, Input, Label } from "native-base";
import { Button, Text, FunVideo } from "../../component";
import { useTranslation } from "react-i18next";
import { default_image } from "../../assets/png";
import { PlayVideo, OptionsVertWhite } from "../../assets/svg";
import Modal from "react-native-modal";
import album from "../../graphQL/Query/Profile/albumdetailpost";
import RenameAlbumTitle from "../../graphQL/Mutation/Album/RenameAlbumTitle";
import ImageSlide from "../../component/src/ImageSlide/sliderPost";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import Delete from "../../component/src/AlertModal/Delete";
import DeleteAlbumAll from "../../graphQL/Mutation/Album/DeleteAlbumAll";
import { useSelector } from "react-redux";
const { width, height } = Dimensions.get("screen");

export default function albumdetail(props) {
  const { t, i18n } = useTranslation();
  const settingApps = useSelector((data) => data.setting);
  const userID = settingApps?.user_id;
  const [user, setUser] = useState(props?.route?.params?.user);

  // const HeaderComponent = {
  //   headerTransparent: false,
  //   headerTintColor: "white",
  //   headerTitle: (
  //     <Text size="header" type="bold" style={{ color: "#fff" }}>
  //       Album {props?.route?.params?.judul}
  //     </Text>
  //   ),
  //   headerMode: "screen",
  //   headerStyle: {
  //     backgroundColor: "#209FAE",
  //     elevation: 0,
  //     borderBottomWidth: 0,
  //   },
  //   headerLeftContainerStyle: {
  //     background: "#FFF",

  //     marginLeft: 10,
  //   },
  //   headerLeft: () => (
  //     <Button
  //       text={""}
  //       size="medium"
  //       type="circle"
  //       variant="transparent"
  //       onPress={() => props.navigation.goBack()}
  //       style={{
  //         height: 55,
  //       }}
  //     >
  //       {Platform.OS == "ios" ? (
  //         <Arrowbackios height={15} width={15}></Arrowbackios>
  //       ) : (
  //         <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
  //       )}
  //     </Button>
  //   ),

  //   headerRight: () =>
  //     user && user === userID ? (
  //       <TouchableOpacity
  //         style={{
  //           marginRight: 15,
  //           width: 20,
  //           height: 20,
  //           justifyContent: "center",
  //           alignItems: "center",
  //         }}
  //         onPress={() => setmodalOptions(true)}
  //       >
  //         <OptionsVertWhite height={15} width={15} />
  //       </TouchableOpacity>
  //     ) : null,
  // };
  const HeaderComponent = {
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: (
      <Text size="header" type="bold" style={{ color: "#fff" }}>
        Album {props?.route?.params?.judul}
      </Text>
    ),
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
      paddingBottom: Platform.OS == "ios" ? 15 : null,
    },
    headerLeftContainerStyle: {
      background: "#FFF",
      position: "absolute",
      zIndex: 999,
      marginLeft: 10,
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
        {Platform.OS == "ios" ? (
          <Arrowbackios height={15} width={15}></Arrowbackios>
        ) : (
          <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
        )}
      </Button>
    ),

    headerRight: () =>
      user && user === userID ? (
        <TouchableOpacity
          style={{
            paddingRight: 25,
            width: 20,
            height: 20,
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            zIndex: 999,
          }}
          onPress={() => setmodalOptions(true)}
        >
          <OptionsVertWhite height={15} width={15} />
        </TouchableOpacity>
      ) : null,
  };

  const backAction = () => {
    props.navigation.goBack();
    return true;
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    BackHandler.addEventListener("hardwareBackPress", backAction);
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, [backAction]);

  useEffect(() => {
    props.navigation.addListener("blur", () => {
      BackHandler.removeEventListener("hardwareBackPress", backAction);
    });
  }, [backAction]);

  let token = props.route.params.token;
  const albumId = props.route.params.id;
  const [judul, setJudul] = useState(props.route.params.judul);
  let [modals, setmodal] = useState(false);
  let [dataalbums, setdata] = useState(null);
  const [modalOptions, setmodalOptions] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDeleteAlbum, setModalDeleteAlbum] = useState(false);

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

  const [
    mutationDeleteAlbum,
    { loading: loadingDelete, data: dataDelete, error: errorDelete },
  ] = useMutation(DeleteAlbumAll, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
  });

  const deleteAlbum = async () => {
    try {
      let response = await mutationDeleteAlbum({
        variables: {
          album_id: props.route.params.id,
        },
      });

      if (response?.data) {
        if (response.data.delete_album_all?.code !== 200) {
          throw new Error(response.data.detele_album_all?.message);
        } else {
          setModalDeleteAlbum(false);
          props.navigation.navigate("ProfileStack", {
            screen: "ProfileTab",
            params: {
              token: props.route.params.token,
              deleted_album_id: props.route.params.id,
            },
          });
        }
      }
    } catch (error) {
      setModalDeleteAlbum(false);
      console.log(error);
    }
  };

  const [
    getdataalbum,
    { data: dataalbum, loading: loadingalbum, error: erroralbum, refetch },
  ] = useLazyQuery(album, {
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
    variables: {
      id: props?.route?.params?.id,
      // type: props?.route?.params?.type,
    },
    onCompleted: () => {
      setdata(dataalbum?.all_albums_post_v2);
    },
  });

  const [
    mutationRenameAlbum,
    {
      loading: loadingRenameAlbum,
      data: dataRenameAlbum,
      error: errorRenameAlbum,
    },
  ] = useMutation(RenameAlbumTitle, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
  });

  const renameAlbum = async () => {
    try {
      let response = await mutationRenameAlbum({
        variables: {
          album_id: props.route.params.id,
          title: judul,
        },
      });
      if (response.data) {
        if (response.data.rename_album_itinerary.code !== 200) {
          throw new Error(response.data.rename_album_itinerary.message);
        } else {
          props.navigation.navigate("ProfileStack", {
            screen: "ProfileTab",
            params: { token: props.route.params.token },
          });
        }
      }
    } catch (error) {
      console.log(error);
      setModalEdit(false);
    }
  };

  function wait(timeout) {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  }

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    getdataalbum();
    wait(1000).then(() => setRefreshing(false));
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      getdataalbum();
    });
    return unsubscribe;
  }, [props.navigation]);

  let [index, setIndex] = useState(0);
  let [dataImage, setImage] = useState([]);
  let [modalss, setModalss] = useState(false);

  const setdataimage = async (data, id) => {
    let inde = data.findIndex((k) => k["id"] === id);
    setIndex(inde);
    var tempdatas = [];
    var x = 0;

    for (var i in data) {
      let wid = 0;
      let hig = 0;
      if (data[i].type !== "video") {
        Image.getSize(data[i].filepath, (width, height) => {
          wid = width;
          hig = height;
        });
      } else {
        wid = 500;
        hig = 500;
      }
      // Image.getSize(data[i].filepath, (width, height) => {
      //   wid = width;
      //   hig = height;
      // });
      tempdatas.push({
        key: i,
        id: data[i].post_id,
        selected: i === inde ? true : false,
        url: data[i].filepath ? data[i].filepath : "",
        width: wid,
        height: hig,
        props: {
          source: data[i].filepath ? data[i].filepath : "",
          type: data[i]?.type,
        },
        by: data[i]?.photoby?.first_name,
      });
      x++;
    }
    await setImage(tempdatas);
    await setModalss(true);
  };

  if (loadingalbum) {
    <SkeletonPlaceholder>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 2.5,
        }}
      >
        <View
          style={{
            width: ((width - 45) / 3) * 2,
            height: ((width - 45) / 3) * 2,
            margin: 2.5,
          }}
        >
          <View
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 5,
            }}
          />
        </View>
        <View>
          <View
            style={{
              width: (width - 50) / 3,
              height: (width - 50) / 3,
              margin: 2.5,
            }}
          >
            <View
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 5,
              }}
            />
          </View>
          <View
            onPress={() => setdataimage(dataalbums, item[2].id)}
            style={{
              width: (width - 50) / 3,
              height: (width - 50) / 3,
              margin: 2.5,
            }}
          >
            <View
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 5,
              }}
            />
          </View>
        </View>
      </View>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 2.5,
        }}
      >
        <View>
          <View
            style={{
              width: (width - 50) / 3,
              height: (width - 50) / 3,
              margin: 2.5,
            }}
          >
            <View
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 5,
              }}
            />
          </View>
          <View
            onPress={() => setdataimage(dataalbums, item[2].id)}
            style={{
              width: (width - 50) / 3,
              height: (width - 50) / 3,
              margin: 2.5,
            }}
          >
            <View
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 5,
              }}
            />
          </View>
        </View>
        <View
          style={{
            width: ((width - 45) / 3) * 2,
            height: ((width - 45) / 3) * 2,
            margin: 2.5,
          }}
        >
          <View
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 5,
            }}
          />
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: (width - 50) / 3,
            height: (width - 50) / 3,
            margin: 2.5,
          }}
        >
          <View
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 5,
            }}
          />
        </View>
        <View
          onPress={() => setdataimage(dataalbums, item[2].id)}
          style={{
            width: (width - 50) / 3,
            height: (width - 50) / 3,
            margin: 2.5,
          }}
        >
          <View
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 5,
            }}
          />
        </View>
        <View
          onPress={() => setdataimage(dataalbums, item[2].id)}
          style={{
            width: (width - 50) / 3,
            height: (width - 50) / 3,
            margin: 2.5,
          }}
        >
          <View
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 5,
            }}
          />
        </View>
      </View>
    </SkeletonPlaceholder>;
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <Modal
        onBackdropPress={() => {
          setmodal(false);
        }}
        onRequestClose={() => setmodal(false)}
        onDismiss={() => setmodal(false)}
        animationIn="fadeIn"
        animationOut="fadeOut"
        isVisible={modals}
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
          <TouchableOpacity
            style={{
              paddingVertical: 10,
            }}
            onPress={() => pickcamera()}
          >
            <Text size="description" type="regular" style={{}}>
              {t("OpenCamera")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              paddingVertical: 10,
            }}
            onPress={() => pickGallery()}
          >
            <Text size="description" type="regular" style={{}}>
              {t("OpenGallery")}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
      {dataalbums && dataalbums.length > 0 ? (
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ padding: 15 }}
          nestedScrollEnabled
          data={spreadData(dataalbums)}
          renderItem={({ item, index }) => {
            if (item.length > 2) {
              if (item[3].grid == 1) {
                return (
                  <View
                    style={{
                      width: "100%",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      paddingHorizontal: 2.5,
                    }}
                    key={index + 1}
                  >
                    <Pressable
                      onPress={() => setdataimage(dataalbums, item[0].id)}
                      style={{
                        width: ((width - 45) / 3) * 2,
                        height: ((width - 45) / 3) * 2,
                        margin: 2.5,
                      }}
                    >
                      {item[0].type === "video" ? (
                        <>
                          <FunVideo
                            poster={item[0].filepath.replace(
                              "output.m3u8",
                              "thumbnail.png"
                            )}
                            posterResizeMode={"cover"}
                            paused={true}
                            // key={"posted" + index + item.id}
                            source={{
                              uri: item[0].filepath,
                            }}
                            muted={true}
                            // defaultSource={default_image}
                            resizeMode="cover"
                            style={{
                              borderRadius: 5,

                              // resizeMode: "cover",
                              width: "100%",
                              height: "100%",
                              backgroundColor: "#fff",
                            }}
                          />
                          <View
                            style={{
                              // flexDirection: "row",
                              position: "absolute",
                              width: "100%",
                              height: "100%",
                              backgroundColor: "rgba(0,0,0,0.4)",
                              justifyContent: "flex-end",
                              borderRadius: 5,

                              // top: 5,
                              // left: "35%",
                            }}
                          >
                            <PlayVideo
                              width={15}
                              height={15}
                              style={{ margin: 10 }}
                            />
                          </View>
                        </>
                      ) : (
                        <Image
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: 5,
                          }}
                          source={
                            item[0].filepath
                              ? { uri: item[0].filepath }
                              : default_image
                          }
                        />
                      )}
                    </Pressable>
                    <View>
                      <Pressable
                        onPress={() => setdataimage(dataalbums, item[1].id)}
                        style={{
                          width: (width - 50) / 3,
                          height: (width - 50) / 3,
                          margin: 2.5,
                        }}
                      >
                        {item[1].type === "video" ? (
                          <>
                            <FunVideo
                              poster={item[1].filepath.replace(
                                "output.m3u8",
                                "thumbnail.png"
                              )}
                              posterResizeMode={"cover"}
                              paused={true}
                              // key={"posted" + index + item.id}
                              source={{
                                uri: item[1].filepath,
                              }}
                              muted={true}
                              // defaultSource={default_image}
                              resizeMode="cover"
                              style={{
                                borderRadius: 5,

                                // resizeMode: "cover",
                                width: "100%",
                                height: "100%",
                                backgroundColor: "#fff",
                              }}
                            />
                            <View
                              style={{
                                // flexDirection: "row",
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                backgroundColor: "rgba(0,0,0,0.4)",
                                justifyContent: "flex-end",
                                borderRadius: 5,

                                // top: 5,
                                // left: "35%",
                              }}
                            >
                              <PlayVideo
                                width={15}
                                height={15}
                                style={{ margin: 10 }}
                              />
                            </View>
                          </>
                        ) : (
                          <Image
                            style={{
                              width: "100%",
                              height: "100%",
                              borderRadius: 5,
                            }}
                            source={
                              item[1].filepath
                                ? { uri: item[1].filepath }
                                : default_image
                            }
                          />
                        )}
                      </Pressable>
                      <Pressable
                        onPress={() => setdataimage(dataalbums, item[2].id)}
                        style={{
                          width: (width - 50) / 3,
                          height: (width - 50) / 3,
                          margin: 2.5,
                        }}
                      >
                        {item[2].type === "video" ? (
                          <>
                            <FunVideo
                              poster={item[2].filepath.replace(
                                "output.m3u8",
                                "thumbnail.png"
                              )}
                              posterResizeMode={"cover"}
                              paused={true}
                              // key={"posted" + index + item.id}
                              source={{
                                uri: item[2].filepath,
                              }}
                              muted={true}
                              // defaultSource={default_image}
                              resizeMode="cover"
                              style={{
                                borderRadius: 5,

                                // resizeMode: "cover",
                                width: "100%",
                                height: "100%",
                                backgroundColor: "#fff",
                              }}
                            />
                            <View
                              style={{
                                // flexDirection: "row",
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                backgroundColor: "rgba(0,0,0,0.4)",
                                justifyContent: "flex-end",
                                borderRadius: 5,

                                // top: 5,
                                // left: "35%",
                              }}
                            >
                              <PlayVideo
                                width={15}
                                height={15}
                                style={{ margin: 10 }}
                              />
                            </View>
                          </>
                        ) : (
                          <Image
                            style={{
                              width: "100%",
                              height: "100%",
                              borderRadius: 5,
                            }}
                            source={
                              item[2].filepath
                                ? { uri: item[2].filepath }
                                : default_image
                            }
                          />
                        )}
                      </Pressable>
                    </View>
                  </View>
                );
              } else if (item[3].grid == 2) {
                return (
                  <View
                    style={{
                      width: "100%",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      paddingHorizontal: 2.5,
                    }}
                    key={index + 2}
                  >
                    <View>
                      <Pressable
                        onPress={() => setdataimage(dataalbums, item[0].id)}
                        style={{
                          width: (width - 50) / 3,
                          height: (width - 50) / 3,
                          margin: 2.5,
                        }}
                      >
                        {item[0].type === "video" ? (
                          <>
                            <FunVideo
                              poster={item[0].filepath.replace(
                                "output.m3u8",
                                "thumbnail.png"
                              )}
                              posterResizeMode={"cover"}
                              paused={true}
                              // key={"posted" + index + item.id}
                              source={{
                                uri: item[0].filepath,
                              }}
                              muted={true}
                              // defaultSource={default_image}
                              resizeMode="cover"
                              style={{
                                borderRadius: 5,

                                // resizeMode: "cover",
                                width: "100%",
                                height: "100%",
                                backgroundColor: "#fff",
                              }}
                            />
                            <View
                              style={{
                                // flexDirection: "row",
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                backgroundColor: "rgba(0,0,0,0.4)",
                                justifyContent: "flex-end",
                                borderRadius: 5,

                                // top: 5,
                                // left: "35%",
                              }}
                            >
                              <PlayVideo
                                width={15}
                                height={15}
                                style={{ margin: 10 }}
                              />
                            </View>
                          </>
                        ) : (
                          <Image
                            style={{
                              width: "100%",
                              height: "100%",
                              borderRadius: 5,
                            }}
                            source={
                              item[0].filepath
                                ? { uri: item[0].filepath }
                                : default_image
                            }
                          />
                        )}
                      </Pressable>
                      <Pressable
                        onPress={() => setdataimage(dataalbums, item[1].id)}
                        style={{
                          width: (width - 50) / 3,
                          height: (width - 50) / 3,
                          margin: 2.5,
                        }}
                      >
                        {item[1].type === "video" ? (
                          <>
                            <FunVideo
                              poster={item[1].filepath.replace(
                                "output.m3u8",
                                "thumbnail.png"
                              )}
                              posterResizeMode={"cover"}
                              paused={true}
                              // key={"posted" + index + item.id}
                              source={{
                                uri: item[1].filepath,
                              }}
                              muted={true}
                              // defaultSource={default_image}
                              resizeMode="cover"
                              style={{
                                borderRadius: 5,

                                // resizeMode: "cover",
                                width: "100%",
                                height: "100%",
                                backgroundColor: "#fff",
                              }}
                            />
                            <View
                              style={{
                                // flexDirection: "row",
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                backgroundColor: "rgba(0,0,0,0.4)",
                                justifyContent: "flex-end",
                                borderRadius: 5,

                                // top: 5,
                                // left: "35%",
                              }}
                            >
                              <PlayVideo
                                width={15}
                                height={15}
                                style={{ margin: 10 }}
                              />
                            </View>
                          </>
                        ) : (
                          <Image
                            style={{
                              width: "100%",
                              height: "100%",
                              borderRadius: 5,
                            }}
                            source={
                              item[1].filepath
                                ? { uri: item[1].filepath }
                                : default_image
                            }
                          />
                        )}
                      </Pressable>
                    </View>
                    <Pressable
                      onPress={() => setdataimage(dataalbums, item[2].id)}
                      style={{
                        width: ((width - 45) / 3) * 2,
                        height: ((width - 45) / 3) * 2,
                        margin: 2.5,
                      }}
                    >
                      {item[2].type === "video" ? (
                        <>
                          <FunVideo
                            poster={item[2].filepath.replace(
                              "output.m3u8",
                              "thumbnail.png"
                            )}
                            posterResizeMode={"cover"}
                            paused={true}
                            // key={"posted" + index + item.id}
                            source={{
                              uri: item[2].filepath,
                            }}
                            muted={true}
                            // defaultSource={default_image}
                            resizeMode="cover"
                            style={{
                              borderRadius: 5,

                              // resizeMode: "cover",
                              width: "100%",
                              height: "100%",
                              backgroundColor: "#fff",
                            }}
                          />
                          <View
                            style={{
                              // flexDirection: "row",
                              position: "absolute",
                              width: "100%",
                              height: "100%",
                              backgroundColor: "rgba(0,0,0,0.4)",
                              justifyContent: "flex-end",
                              borderRadius: 5,

                              // top: 5,
                              // left: "35%",
                            }}
                          >
                            <PlayVideo
                              width={15}
                              height={15}
                              style={{ margin: 10 }}
                            />
                          </View>
                        </>
                      ) : (
                        <Image
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: 5,
                          }}
                          source={
                            item[2].filepath
                              ? { uri: item[2].filepath }
                              : default_image
                          }
                        />
                      )}
                    </Pressable>
                  </View>
                );
              } else {
                return (
                  <View
                    style={{
                      width: "100%",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      paddingHorizontal: 2.5,
                    }}
                    key={index + 3}
                  >
                    {item.map((data, index) => {
                      if (index < 3) {
                        return (
                          <Pressable
                            onPress={() => setdataimage(dataalbums, data.id)}
                            style={{
                              width: (width - 50) / 3,
                              height: (width - 50) / 3,
                              margin: 2.5,
                            }}
                          >
                            {data.type === "video" ? (
                              <>
                                <FunVideo
                                  poster={data.filepath.replace(
                                    "output.m3u8",
                                    "thumbnail.png"
                                  )}
                                  posterResizeMode={"cover"}
                                  paused={true}
                                  // key={"posted" + index + item.id}
                                  source={{
                                    uri: data.filepath,
                                  }}
                                  muted={true}
                                  // defaultSource={default_image}
                                  resizeMode="cover"
                                  style={{
                                    borderRadius: 5,

                                    // resizeMode: "cover",
                                    width: "100%",
                                    height: "100%",
                                    backgroundColor: "#fff",
                                  }}
                                />
                                <View
                                  style={{
                                    // flexDirection: "row",
                                    position: "absolute",
                                    width: "100%",
                                    height: "100%",
                                    backgroundColor: "rgba(0,0,0,0.4)",
                                    justifyContent: "flex-end",
                                    borderRadius: 5,

                                    // top: 5,
                                    // left: "35%",
                                  }}
                                >
                                  <PlayVideo
                                    width={15}
                                    height={15}
                                    style={{ margin: 10 }}
                                  />
                                </View>
                              </>
                            ) : (
                              <Image
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  borderRadius: 5,
                                }}
                                source={
                                  data.filepath
                                    ? { uri: data.filepath }
                                    : default_image
                                }
                              />
                            )}
                          </Pressable>
                        );
                      } else {
                        null;
                      }
                    })}
                  </View>
                );
              }
            } else {
              return (
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    paddingHorizontal: 2.5,
                  }}
                >
                  {item.map((data, index) => {
                    return (
                      <Pressable
                        onPress={() => setdataimage(dataalbums, data.id)}
                        style={{
                          width: (width - 50) / 3,
                          height: (width - 50) / 3,
                          margin: 2.5,
                        }}
                        key={index}
                      >
                        {data.type === "video" ? (
                          <>
                            <FunVideo
                              poster={data.filepath.replace(
                                "output.m3u8",
                                "thumbnail.png"
                              )}
                              posterResizeMode={"cover"}
                              paused={true}
                              // key={"posted" + index + item.id}
                              source={{
                                uri: data.filepath,
                              }}
                              muted={true}
                              // defaultSource={default_image}
                              resizeMode="cover"
                              style={{
                                borderRadius: 5,

                                // resizeMode: "cover",
                                width: "100%",
                                height: "100%",
                                backgroundColor: "#fff",
                              }}
                            />
                            <View
                              style={{
                                // flexDirection: "row",
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                backgroundColor: "rgba(0,0,0,0.4)",
                                justifyContent: "flex-end",
                                borderRadius: 5,

                                // top: 5,
                                // left: "35%",
                              }}
                            >
                              <PlayVideo
                                width={15}
                                height={15}
                                style={{ margin: 10 }}
                              />
                            </View>
                          </>
                        ) : (
                          <Image
                            style={{
                              width: "100%",
                              height: "100%",
                              borderRadius: 5,
                            }}
                            source={
                              data.filepath
                                ? { uri: data.filepath }
                                : default_image
                            }
                          />
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              );
            }
          }}
          keyExtractor={(item) => item.id}
        />
      ) : loadingalbum ? (
        <SkeletonPlaceholder>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 2.5,
            }}
          >
            <View
              style={{
                width: ((width - 45) / 3) * 2,
                height: ((width - 45) / 3) * 2,
                margin: 2.5,
              }}
            >
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 5,
                }}
              />
            </View>
            <View>
              <View
                style={{
                  width: (width - 50) / 3,
                  height: (width - 50) / 3,
                  margin: 2.5,
                }}
              >
                <View
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 5,
                  }}
                />
              </View>
              <View
                onPress={() => setdataimage(dataalbums, item[2].id)}
                style={{
                  width: (width - 50) / 3,
                  height: (width - 50) / 3,
                  margin: 2.5,
                }}
              >
                <View
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 5,
                  }}
                />
              </View>
            </View>
          </View>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 2.5,
            }}
          >
            <View>
              <View
                style={{
                  width: (width - 50) / 3,
                  height: (width - 50) / 3,
                  margin: 2.5,
                }}
              >
                <View
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 5,
                  }}
                />
              </View>
              <View
                onPress={() => setdataimage(dataalbums, item[2].id)}
                style={{
                  width: (width - 50) / 3,
                  height: (width - 50) / 3,
                  margin: 2.5,
                }}
              >
                <View
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 5,
                  }}
                />
              </View>
            </View>
            <View
              style={{
                width: ((width - 45) / 3) * 2,
                height: ((width - 45) / 3) * 2,
                margin: 2.5,
              }}
            >
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 5,
                }}
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: (width - 50) / 3,
                height: (width - 50) / 3,
                margin: 2.5,
              }}
            >
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 5,
                }}
              />
            </View>
            <View
              onPress={() => setdataimage(dataalbums, item[2].id)}
              style={{
                width: (width - 50) / 3,
                height: (width - 50) / 3,
                margin: 2.5,
              }}
            >
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 5,
                }}
              />
            </View>
            <View
              onPress={() => setdataimage(dataalbums, item[2].id)}
              style={{
                width: (width - 50) / 3,
                height: (width - 50) / 3,
                margin: 2.5,
              }}
            >
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 5,
                }}
              />
            </View>
          </View>
        </SkeletonPlaceholder>
      ) : (
        <View style={{ alignItems: "center", marginTop: 20 }}>
          <Text size="title" type="bold">
            {t("noData")}
          </Text>
        </View>
      )}

      <ImageSlide
        index={index}
        name="Funtravia Images"
        location={judul}
        show={modalss}
        dataImage={dataImage}
        props={props}
        token={token}
        setClose={() => setModalss(!modalss)}
      />

      <Modal
        // useNativeDriver={true}
        animationType="fade"
        visible={modalOptions}
        onBackdropPress={() => setmodalOptions(false)}
        onRequestClose={() => setmodalOptions(false)}
        transparent={true}
      >
        <Pressable
          onPress={() => setmodalOptions(false)}
          style={{
            width: Dimensions.get("screen").width + 25,
            height: Dimensions.get("screen").height,
            justifyContent: "center",
            opacity: 0.7,
            backgroundColor: "#000",
            position: "absolute",
            left: -21,
          }}
        />
        <View
          style={{
            width: Dimensions.get("screen").width - 140,
            // marginHorizontal: 70,
            alignSelf: "center",
            backgroundColor: "#FFF",
            zIndex: 15,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            alignContent: "center",
            borderRadius: 5,
            marginTop: Dimensions.get("screen").height / 10,
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              width: Dimensions.get("screen").width - 100,
              borderRadius: 5,
            }}
          >
            <View
              style={{
                borderBottomWidth: 1,
                borderColor: "#d1d1d1",
                backgroundColor: "#f6f6f6",
                alignItems: "center",
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
              }}
            >
              <Text style={{ marginVertical: 15 }} size="title" type="bold">
                {t("option")}
              </Text>
            </View>
            <Pressable
              onPress={() => setmodalOptions(false)}
              style={{
                position: "absolute",
                right: 0,
                width: 55,
                justifyContent: "center",
                alignItems: "center",
                height: 55,
              }}
            >
              <Xgray width={15} height={15} />
            </Pressable>
            <TouchableOpacity
              style={{
                alignItems: "center",
                borderBottomColor: "#d1d1d1",
                borderBottomWidth: 1,
              }}
              onPress={() => {
                setmodalOptions(false);
                setModalEdit(true);
              }}
            >
              <Text size="label" type="regular" style={{ marginVertical: 15 }}>
                {`${t("edit")} ${t("title")}`}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                alignItems: "center",
                borderBottomColor: "#d1d1d1",
                borderBottomWidth: 1,
              }}
              onPress={() => {
                setmodalOptions(false);
                setModalDeleteAlbum(true);
              }}
            >
              <Text size="label" type="regular" style={{ marginVertical: 15 }}>
                {t("delete")} Album
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        onBackdropPress={() => {
          setModalEdit(false);
        }}
        onRequestClose={() => setModalEdit(false)}
        onDismiss={() => setModalEdit(false)}
        animationIn="fadeIn"
        animationOut="fadeOut"
        isVisible={modalEdit}
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
            borderRadius: 5,
            padding: 20,
          }}
        >
          <Item
            floatingLabel
            style={{
              marginVertical: 10,
            }}
          >
            <Label
              style={{
                fontFamily: "Lato-Regular",
                fontSize: 14,
              }}
            >
              {t("title")}
            </Label>
            <Input
              //   editable={false}
              style={{
                fontFamily: "Lato-Regular",
                fontSize: 16,
              }}
              maxLength={15}
              autoCorrect={false}
              value={judul}
              keyboardType="default"
              onChangeText={(text) => setJudul(text)}
            />
          </Item>
          <Button
            onPress={() => {
              setModalEdit(false);
              renameAlbum();
            }}
            color="primary"
            text={t("save")}
          ></Button>
        </View>
      </Modal>

      <Delete
        modals={modalDeleteAlbum}
        setModals={() => setModalDeleteAlbum()}
        message={`${t("deleteAlbumWith")} ${judul}?`}
        messageHeader={t("deleteAlbum")}
        onDelete={() => {
          deleteAlbum();
        }}
      />
    </SafeAreaView>
  );
}
