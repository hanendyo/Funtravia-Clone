import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  FlatList,
  Platform,
  ActivityIndicator,
  ImageBackground,
  Pressable,
  BackHandler,
} from "react-native";
import {
  Arrowbackblack,
  Arrowbackwhite,
  Comboboxup,
  Comboboxdown,
  SizeOri,
  SizeStrace,
  CameraBlue,
  Check,
} from "../../../assets/svg";
import { Text, Button, StatusBar, FunImage } from "../../../component";
import CameraRoll from "@react-native-community/cameraroll";
import Modal from "react-native-modal";
import { Loading } from "../../../component";
import { request, check, PERMISSIONS } from "react-native-permissions";
import ImagePicker from "react-native-image-crop-picker";
import Video from "react-native-video";
import { RNToasty } from "react-native-toasty";
import { useTranslation } from "react-i18next";

const { width } = Dimensions.get("screen");
export default function Post(props) {
  const { t, i18n } = useTranslation();
  const [imageRoll, setImageRoll] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ratio, setRatio] = useState({
    width: 1,
    height: 1,
    index: 0,
    label: "S",
  });
  const [refreshing, setRefreshing] = useState(false);
  const [allAlbums, setAllalbum] = useState([]);
  const [page_info, setPageInfo] = useState({});
  const [loadimg, setLoadimg] = useState(false);
  const [checklistVideo, setChecklistVideo] = useState([]);

  let slider = useRef(null);
  let videoView = useRef(null);
  const [ratioindex, setRatioIndex] = useState([
    { width: 1, height: 1, index: 0, label: "S" },
    { width: 4, height: 5, index: 1, label: "P" },
  ]);

  const [recent, setRecent] = useState({
    image: {
      uri:
        "https://fa12.funtravia.com/destination/20200508/6Ugw9_1b6737ff-4b42-4149-8f08-00796e8c6909",
    },
    location: {},
  });

  // let newrecent = {};

  const Refresh = React.useCallback(() => {
    setRefreshing(true);
    wait(500).then(() => {
      setRefreshing(false);
    });
  }, []);

  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  const selectImg = async (file) => {
    slider.current.scrollToOffset({ index: 0 });
    await setLoading(false);
    setRatio({ width: 1, height: 1, index: 0, label: "S" });
    if (file.node.image.width > file.node.image.height) {
      setRatioIndex([
        { width: 1, height: 1, index: 0, label: "S" },
        { width: 3, height: 2, index: 1, label: "L" },
      ]);
    } else {
      setRatioIndex([
        { width: 1, height: 1, index: 0, label: "S" },
        { width: 4, height: 5, index: 1, label: "P" },
      ]);
    }
    await setRecent(file);
    // await scroll_to();
  };

  const pickcamera = async () => {
    ImagePicker.openCamera({
      cropping: false,
      cropperCircleOverlay: false,
      includeBase64: false,
    }).then((image) => {
      Refresh();
      setRatio({ width: 1, height: 1, index: 0 });
      setRecent({
        node: {
          image: { uri: image.path, filename: "camera.jpg" },
          location: {},
          type: image.mime,
        },
      });
    });
  };

  const nextFunction = async (type, multi) => {
    if (multi.length <= 1) {
      if (type.substr(0, 5) === "video") {
        props.navigation.navigate("CreatePostScreen", {
          location: recent.node.location,
          type: recent.node.type.substr(0, 5),
          file: recent.node.image,
        });
      } else if (type.substr(0, 5) === "image") {
        try {
          let result = await ImagePicker.openCropper({
            path: recent.node.image.uri,
            width: ratio.width * 1000,
            height: ratio.height * 1000,
            // compressImageQuality: 0.7,
          });
          props.navigation.navigate("CreatePostScreen", {
            location: recent.node.location,
            type: recent.node.type.substr(0, 5),
            file: result,
          });
        } catch (e) {
          RNToasty.Show({
            title: "Canceled",
            position: "bottom",
          });
        }
      } else {
        return null;
      }
    } else {
      props.navigation.navigate("CreatePostScreen", {
        location: recent.node.location,
        type: "multi",
        file: checklistVideo,
        ratio: ratio,
      });
    }
  };

  console.log("ratio", ratio);

  const scroll_to = () => {
    setTimeout(() => {
      slider.current.scrollToOffset({ animated: true, offset: 0 });
    }, 3000);
  };

  useEffect(() => {
    (async () => {
      await getAlbumRoll();
      await requestCameraPermission();
      // await scroll_to();
    })();
  }, [selectedAlbum, props.navigation]);

  let buka = useRef(false);

  const backAction = () => {
    if (buka.current === true) {
      buka.current = false;
      // setOpenLongPress(false);
      setChecklistVideo([]);

      BackHandler.removeEventListener("hardwareBackPress", backAction);
      BackHandler.addEventListener("hardwareBackPress", backDei);
    } else {
      props.navigation.goBack();
    }

    return true;
  };

  const backDei = () => {
    props.navigation.goBack();
    return true;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  const [selectedAlbum, setSelectedAlbum] = useState({
    title: "Folder",
    count: 0,
  });

  const requestCameraPermission = async () => {
    try {
      let granted = false;
      if (Platform.OS == "ios") {
        let sPhoto = await check(PERMISSIONS.IOS.CAMERA);
        if (sPhoto === "denied") {
          granted = await request(PERMISSIONS.IOS.CAMERA);
        }
        granted = true;
      } else {
        let sPhoto = await check(PERMISSIONS.ANDROID.CAMERA);
        if (sPhoto === "denied") {
          granted = await request(PERMISSIONS.ANDROID.CAMERA);
        }
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const getAlbumRoll = async () => {
    try {
      let granted = false;
      if (Platform.OS == "ios") {
        let sCamera = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
        if (sCamera === "denied") {
          granted = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
        }
        granted = true;
      } else {
        let sPhoto = await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
        if (sPhoto === "denied") {
          granted = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
        }
        granted = true;
      }

      if (granted) {
        CameraRoll.getAlbums({
          assetType: "All",
          groupTypes: "all",
        })
          .then((r) => {
            if (r.length) {
              setAllalbum(r);
              setSelectedAlbum(r[0]);
              getImageFromRoll(r[0]);
              selectAlbum(r[0]);
            }
          })
          .catch((err) => {
            console.log(err);
          });
        console.log("You can use the camera");
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const getImageFromRoll = async (dataalbum) => {
    let dataCamera = await CameraRoll.getPhotos({
      first: 43,
      assetType: "All",
      // groupTypes: "Album",
      groupName: dataalbum.title,
      include: ["location", "filename", "imageSize", "playableDuration"],
    });
    let data_foto = dataCamera.edges;
    let camera = {
      id: "0",
      mediaType: "camera",
    };
    data_foto.splice(0, 0, camera);
    setImageRoll(data_foto);
    setPageInfo(dataCamera.page_info);
    await selectImg(data_foto[1]);
  };

  const getMoreImage = async () => {
    if (!loadimg && page_info.has_next_page) {
      setLoadimg(true);
      let dataCamera = await CameraRoll.getPhotos({
        after: page_info.end_cursor,
        first: 40,
        assetType: "All",
        // groupTypes: "Album",
        groupName: selectedAlbum.title,
        include: ["location", "filename", "imageSize", "playableDuration"],
      });
      let data_foto = dataCamera.edges;
      const datas = [...imageRoll, ...data_foto];
      setImageRoll(datas);
      setPageInfo(dataCamera.page_info);
      await setLoadimg(false);
    }
  };

  const selectAlbum = async (item) => {
    await setSelectedAlbum(item);
    await setIsVisible(false);
    await getImageFromRoll(item);
    await props.navigation.setParams({ title: item.title });
  };

  const _getDuration = (s) => {
    var m = Math.floor(s / 60);
    m = m >= 10 ? m : "0" + m;
    s = Math.floor(s % 60);
    s = s >= 10 ? s : "0" + s;
    return m + ":" + s;
  };

  const _modalGalery = () => {
    return (
      <Modal
        animationType="fade"
        onRequestClose={() => {
          setIsVisible(false);
        }}
        onBackdropPress={() => setIsVisible(false)}
        onSwipeComplete={() => setIsVisible(false)}
        swipeDirection="left"
        isVisible={isVisible}
        animationIn="slideInLeft"
        animationOut="slideOutLeft"
        style={{
          alignItems: "flex-start",
          alignContent: "flex-start",
          justifyContent: "flex-start",
          margin: 0,
        }}
      >
        <View
          style={{
            height: Dimensions.get("screen").height,
            width: Dimensions.get("screen").width * 0.6,
            backgroundColor: "white",
            justifyContent: "space-between",
            paddingHorizontal: 10,
            paddingTop: 10,
            paddingBottom: 10,
          }}
        >
          <View
            style={{
              width: "100%",
            }}
          >
            <Button
              type="icon"
              position="right"
              variant="transparent"
              onPress={() => setIsVisible(false)}
              style={{
                paddingHorizontal: 10,
                justifyContent: "flex-start",
              }}
            >
              <Arrowbackblack height={20} width={20}></Arrowbackblack>
              <Text
                type="bold"
                size="label"
                style={{
                  color: "#464646",
                  marginHorizontal: 10,
                }}
              >
                {selectedAlbum?.title}
              </Text>
              <Comboboxup height={10} width={10} />
            </Button>
          </View>
          {allAlbums && allAlbums.length ? (
            <FlatList
              style={{
                paddingStart: 0,
                alignContent: "center",
              }}
              // ref={slider}
              scrollEnabled={true}
              showsVerticalScrollIndicator={false}
              data={allAlbums}
              renderItem={({ item, index }) => (
                <Button
                  key={index}
                  type="icon"
                  position="right"
                  variant="transparent"
                  style={{
                    justifyContent: "flex-start",
                    marginVertical: 5,
                  }}
                  onPress={() => selectAlbum(item)}
                >
                  <Text>{item.title}</Text>
                </Button>
              )}
              keyExtractor={(item, index) => "" + index}
            />
          ) : null}
        </View>
      </Modal>
    );
  };

  // let dataSementara = [];
  const selectMutiVideo = (item, index) => {
    let tempsVideo = [...checklistVideo];
    tempsVideo.push(item);
    setChecklistVideo(tempsVideo);
    buka.current = !buka.current;
    setRatio({ width: 1, height: 1, index: 0 });
    if (buka.current === false) {
      setChecklistVideo([]);
    }
  };
  console.log("checklistVideo", checklistVideo);

  const selectOneVideo = async (item, index) => {
    if (item.node.image.width > item.node.image.height) {
      setRatioIndex([
        // { width: 1, height: 1, index: 0, label: "S" },
        { width: 4, height: 5, index: 1, label: "P" },
        { width: 3, height: 2, index: 1, label: "L" },
      ]);
    } else {
      setRatioIndex([
        { width: 1, height: 1, index: 0, label: "S" },
        { width: 4, height: 5, index: 1, label: "P" },
      ]);
    }

    await setRecent(item);
    let tempsVideo = [...checklistVideo];
    const indeks = tempsVideo.findIndex(
      (k) => k.node.image.filename === item.node.image.filename
    );

    if (indeks > -1) {
      tempsVideo.splice(indeks, 1);
      if (tempsVideo.length < 1) {
        buka.current = false;
      }
    } else if (tempsVideo.length < 10) {
      tempsVideo.push(item);
    } else {
      RNToasty.Show({
        title: "Maksimal 10 photos",
        position: "bottom",
      });
    }
    setChecklistVideo(tempsVideo);
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor="#209FAE" barStyle="light-content" />
      <Loading show={loading} />
      <_modalGalery />
      <View
        style={{
          backgroundColor: "#209FAE",
          height: 55,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          alignContent: "center",
          paddingLeft: 5,
        }}
      >
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <Button
            onPress={() => props.navigation.goBack()}
            type="circle"
            variant="transparent"
          >
            <Arrowbackwhite height={20} width={20} />
          </Button>
          <Button
            type="icon"
            position="right"
            variant="transparent"
            onPress={() => setIsVisible(true)}
            style={{
              paddingHorizontal: 5,
              justifyContent: "flex-start",
            }}
          >
            <Text
              type="bold"
              size="label"
              style={{
                color: "white",
                marginHorizontal: 10,
              }}
            >
              {selectedAlbum?.title}
            </Text>
            <Comboboxdown height={10} width={10} />
          </Button>
        </View>
        <Button
          size="medium"
          text={t("next")}
          onPress={() => nextFunction(recent.node.type, checklistVideo)}
        />
      </View>
      <FlatList
        keyExtractor={(item) => item?.node?.image?.uri}
        style={{
          paddingStart: 0,
          alignContent: "center",
          backgroundColor: "white",
        }}
        ref={slider}
        data={imageRoll && imageRoll.length ? imageRoll : null}
        ListHeaderComponent={() => (
          <View
            style={{
              marginBottom: 5,
            }}
          >
            {recent?.node?.type.substr(0, 5) === "video" ? (
              <Video
                source={{
                  uri:
                    Platform.OS === "ios"
                      ? `assets-library://asset/asset.${recent.node.image.filename.substring(
                          recent.node.image.filename.length - 3
                        )}?id=${recent.node.image.uri.substring(
                          5,
                          41
                        )}&ext=${recent.node.image.filename.substring(
                          recent.node.image.filename.length - 3
                        )}`
                      : recent.node?.image?.uri,
                }}
                ref={(ref) => {
                  videoView = ref;
                }}
                onBuffer={videoView?.current?.onBuffer}
                onError={videoView?.current?.videoError}
                style={{
                  width: width,
                  height: width,
                }}
                resizeMode="cover"
              />
            ) : (
              <Image
                source={{ uri: recent.node?.image?.uri }}
                style={{
                  width: width,
                  height: width,
                  resizeMode: ratio.width == 1 ? "cover" : "contain",
                  // resizeMode: "contain",
                }}
              />
            )}
            {/* {buka.current === false ? ( */}
            <TouchableOpacity
              onPress={() =>
                setRatio(ratio.index == 1 ? ratioindex[0] : ratioindex[1])
              }
              style={{
                backgroundColor: "#B2B2B2",
                position: "absolute",
                bottom: 0,
                borderRadius: 20,
                margin: 15,
                width: 40,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {ratio.index == 0 ? (
                <SizeOri height={23} width={23} />
              ) : (
                <SizeStrace height={23} width={23} />
              )}
            </TouchableOpacity>
            {/* ) : null} */}
          </View>
        )}
        renderItem={({ item, index }) =>
          item.mediaType !== "camera" ? (
            <TouchableOpacity
              key={index}
              style={{
                alignContent: "center",
                justifyContent: "center",
                backgroundColor: "white",
                alignItems: "center",
                paddingVertical: 1,
                paddingHorizontal: 1,
              }}
              onPress={() => selectImg(item)}
              onLongPress={() => selectMutiVideo(item, index)}
              // onPress={() => scroll_to()}
            >
              {item.node?.type.substr(0, 5) === "video" ? (
                <View
                  style={{
                    zIndex: 1,
                    flex: 1,
                    borderRadius: 5,
                    position: "absolute",
                    height: "100%",
                    width: "100%",
                  }}
                >
                  <View
                    style={{
                      zIndex: 1,
                      // flex: 1,
                      top: 5,
                      left: 5,
                      paddingHorizontal: 2,
                      borderRadius: 5,
                      position: "absolute",
                      backgroundColor: "rgba(0,0,0,0.50)",
                      borderWidth: 0.5,
                      borderColor: "white",
                    }}
                  >
                    <Text style={{ color: "white" }}>
                      {_getDuration(item.node.image.playableDuration)}
                    </Text>
                  </View>
                  {buka.current === true ? (
                    <Pressable
                      onPress={() => selectOneVideo(item, index)}
                      style={{
                        zIndex: 1,
                        // flex: 1,
                        bottom: 5,
                        right: 5,
                        borderRadius: 15,
                        position: "absolute",
                        backgroundColor: "rgba(0,0,0,0.50)",
                        borderWidth: 2,
                        borderColor: "white",
                        height: 30,
                        width: 30,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {checklistVideo.map((items, index) =>
                        items.node.image.filename ==
                        item.node.image.filename ? (
                          <View
                            key={index}
                            style={{
                              backgroundColor: "#209fae",
                              height: 26,
                              width: 26,
                              borderRadius: 13,
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Text
                              size="description"
                              type="bold"
                              style={{ color: "#FFF" }}
                            >
                              {index + 1}
                            </Text>
                          </View>
                        ) : null
                      )}
                    </Pressable>
                  ) : null}
                </View>
              ) : null}
              <ImageBackground
                source={{ uri: item.node.image.uri }}
                style={{
                  height: Dimensions.get("screen").width / 4 - 1,
                  width: Dimensions.get("screen").width / 4 - 1,
                  resizeMode: "cover",
                }}
              >
                <View
                  style={{
                    zIndex: 1,
                    flex: 1,
                    borderRadius: 5,
                    position: "absolute",
                    height: "100%",
                    width: "100%",
                  }}
                >
                  {buka.current === true ? (
                    <Pressable
                      onPress={() => selectOneVideo(item, index)}
                      style={{
                        zIndex: 1,
                        // flex: 1,
                        bottom: 5,
                        right: 5,
                        borderRadius: 15,
                        position: "absolute",
                        backgroundColor: "rgba(0,0,0,0.50)",
                        borderWidth: 2,
                        borderColor: "white",
                        height: 30,
                        width: 30,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {checklistVideo.map((items, index) =>
                        items.node.image.filename ==
                        item.node.image.filename ? (
                          <View
                            key={index}
                            style={{
                              backgroundColor: "#209fae",
                              height: 26,
                              width: 26,
                              borderRadius: 13,
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Text
                              size="description"
                              type="bold"
                              style={{ color: "#FFF" }}
                            >
                              {index + 1}
                            </Text>
                          </View>
                        ) : null
                      )}
                    </Pressable>
                  ) : null}
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{
                alignContent: "center",
                justifyContent: "center",
                backgroundColor: "#F0F0F0",
                alignItems: "center",
                height: Dimensions.get("screen").width / 4,
                width: Dimensions.get("screen").width / 4,
              }}
              onPress={() => pickcamera()}
            >
              <CameraBlue height={30} width={30} />
            </TouchableOpacity>
          )
        }
        // refreshControl={
        //     <RefreshControl
        //         refreshing={refreshing}
        //         onRefresh={() => Refresh()}
        //     />
        // }
        ListFooterComponent={
          loadimg ? (
            <View
              style={{
                // position: 'absolute',
                // bottom:0,
                width: Dimensions.get("screen").width,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 30,
              }}
            >
              <ActivityIndicator
                animating={loadimg}
                size="large"
                color="#209fae"
              />
            </View>
          ) : null
        }
        numColumns={4}
        onEndReachedThreshold={1}
        onEndReached={getMoreImage}
        onEndThreshold={3000}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    justifyContent: "space-between",
    alignItems: "center",
    height: Dimensions.get("screen").height * 0.9,
    width: "100%",
  },
  preview: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    height: 200,
    width: 200,
    backgroundColor: "green",
  },
  tabView: {
    flex: 1,
    justifyContent: "center",
    width: Dimensions.get("screen").width,
  },
  container: {
    marginTop: 20,
  },
  flex: {
    flex: 1,
  },
  maskContainer: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  mask: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    position: "absolute",
    overflow: "hidden",
  },
  topBottom: {
    height: 50,
    width: width - 100,
    left: 50,
  },
  top: {
    top: 0,
  },
  bottom: {
    top: width - 50,
  },
  side: {
    width: 50,
    height: width,
    top: 0,
  },
  left: {
    left: 0,
  },
  right: {
    left: width - 50,
  },
});
