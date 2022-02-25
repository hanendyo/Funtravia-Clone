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
  SafeAreaView,
  ScrollView,
} from "react-native";
import {
  Arrowbackblack,
  Arrowbackiosblack,
  Arrowbackwhite,
  Comboboxup,
  Comboboxdown,
  SizeOri,
  SizeStrace,
  CameraBlue,
  Mute,
  Unmute,
  Arrowbackios,
} from "../../../assets/svg";
import {
  Text,
  Button,
  StatusBar,
  FunVideo,
  Peringatan,
} from "../../../component";
import CameraRoll from "@react-native-community/cameraroll";
import Modal from "react-native-modal";
import { Loading } from "../../../component";
import { request, check, PERMISSIONS } from "react-native-permissions";
import ImagePicker from "react-native-image-crop-picker";
import { RNToasty } from "react-native-toasty";
import { useTranslation } from "react-i18next";
import { useIsFocused } from "@react-navigation/native";
const { width } = Dimensions.get("screen");
import { hash, stat } from "react-native-fs";
import { useSelector } from "react-redux";
import { Video, Image as ImageCompress } from "react-native-compressor";
import RNFS from "react-native-fs";
import DeviceInfo from "react-native-device-info";

export default function Post(props) {
  const Notch = DeviceInfo.hasNotch();
  const tokenApps = useSelector((data) => data.token);
  const isFocused = useIsFocused();
  const [time, setTime] = useState(false);
  const { t, i18n } = useTranslation();
  const [imageRoll, setImageRoll] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [Preview, setPreview] = useState(true);
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
  const [mute, setMute] = useState(false);
  let [aler, showAlert] = useState({ show: false, judul: "", detail: "" });
  let [loadVid, setLoadVid] = useState(false);

  let slider = useRef(null);
  let videoView = useRef(null);
  const [ratioindex, setRatioIndex] = useState([
    { width: 1, height: 1, index: 0, label: "S" },
  ]);

  const [recent, setRecent] = useState({
    image: {
      uri:
        "https://fa12.funtravia.com/destination/20200508/6Ugw9_1b6737ff-4b42-4149-8f08-00796e8c6909",
    },
    location: {},
  });

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
    setPreview(true);
    // slider.current.scrollToOffset({ index: 0 });
    await setLoading(false);
    // setRatio({ width: 1, height: 1, index: 0, label: "S" });
    if (file.node.image.width > file.node.image.height) {
      setRatioIndex([
        { width: 1, height: 1, index: 0, label: "S" },
        { width: 3, height: 2.2, index: 1, label: "L" },
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
    })
      .then((image) => {
        Refresh();
        setRatio({ width: 1, height: 1, index: 0 });
        setRecent({
          node: {
            image: { uri: image.path, filename: "camera.jpg" },
            location: {},
            type: image.mime,
          },
        });
      })
      .catch((err) => {
        RNToasty.Show({
          title: "Canceled",
          position: "bottom",
        });
      });
  };
  const nextFunction = async (type, multi) => {
    if (multi.length <= 1) {
      if (type.substr(0, 5) === "video") {
        let height;
        let width;
        if (ratio.label == "L") {
          width = 1080;
          height = (2.2 / 3) * 1080;
        } else if (ratio.label == "P") {
          width = 1080;
          height = (5 / 4) * 1080;
        } else {
          width = 1080;
          height = 1080;
        }
        let tempData = { ...recent.node.image };

        if (Platform.OS == "ios") {
          const dest = `${RNFS.TemporaryDirectoryPath}${Math.random()
            .toString(36)
            .substring(7)}.MOV`;
          let absolutePath = await RNFS.copyAssetsVideoIOS(
            tempData.uri,
            dest,
            0,
            0
          );
          const statResult = await stat(absolutePath);
          if (statResult.size <= 50000000) {
            tempData.height = height;
            tempData.width = width;
            tempData.size = statResult.size;
            tempData.uri = "file://" + statResult.path;
            props.navigation.navigate("CreatePostScreen", {
              location: recent.node.location,
              type: recent.node.type.substr(0, 5),
              file: tempData,
              token: tokenApps,
              ratio: ratio,
            });
          } else {
            showAlert({
              ...aler,
              show: true,
              judul: t("fileTolarge"),
              detail: t("descMaxUpload"),
            });
          }
        } else {
          const statResult = await stat(tempData.uri);
          if (statResult.size <= 50000000) {
            tempData.height = height;
            tempData.width = width;
            tempData.size = statResult.size;
            tempData.uri = statResult.path;
            props.navigation.navigate("CreatePostScreen", {
              location: recent.node.location,
              type: recent.node.type.substr(0, 5),
              file: tempData,
              token: tokenApps,
              ratio: ratio,
            });
          } else {
            showAlert({
              ...aler,
              show: true,
              judul: t("fileTolarge"),
              detail: t("descMaxUpload"),
            });
          }
        }
      } else if (type.substr(0, 5) === "image") {
        let height;
        let width;
        if (ratio.label == "L") {
          width = 1080;
          height = (2.2 / 3) * 1080;
        } else if (ratio.label == "P") {
          width = 1080;
          height = (5 / 4) * 1080;
        } else {
          width = 1080;
          height = 1080;
        }
        ImagePicker.openCropper({
          path: recent.node.image.uri,
          width: width,
          height: height,
        })
          .then((image) => {
            props.navigation.navigate("CreatePostScreen", {
              location: recent.node.location,
              type: recent.node.type.substr(0, 5),
              file: image,
              token: tokenApps,
              id_album: props.route.params.id_album,
              id_itin: props.route.params.id_itin,
              title_album: props.route.params.title_album,
              album: props.route.params.album,
              ratio: ratio,
            });
          })
          .catch((error) => console.log(error));
      } else {
        return null;
      }
    } else {
      let height;
      let width;
      if (ratio.label == "L") {
        width = 1080;
        height = (2.2 / 3) * 1080;
      } else if (ratio.label == "P") {
        width = 1080;
        height = (5 / 4) * 1080;
      } else {
        width = 1080;
        height = 1080;
      }
      for (var i = 0; i < checklistVideo.length; i++) {
        checklistVideo[i].node.image.height = height;
      }
      for (var i = 0; i < checklistVideo.length; i++) {
        checklistVideo[i].node.image.width = width;
      }

      // if (Platform.OS == "ios") {
      //   for (var i of checklistVideo) {
      //     let extension = i.node.image.filename.split(".").pop();
      //     const dest = `${RNFS.TemporaryDirectoryPath}${Math.random()
      //       .toString(36)
      //       .substring(7)}.${extension}`;
      //     let absolutePath = await RNFS.copyAssetsFileIOS(
      //       i.node.image.uri,
      //       dest,
      //       0,
      //       0
      //     );
      //     i.node.image.uri = "file://" + absolutePath;
      //   }
      // }

      // const dest = `${RNFS.TemporaryDirectoryPath}${Math.random()
      //   .toString(36)
      //   .substring(7)}.MOV`;
      // let absolutePath = await RNFS.copyAssetsVideoIOS(
      //   tempData.uri,
      //   dest,
      //   0,
      //   0
      // );

      props.navigation.navigate("FeedStack", {
        screen: "Crop",
        params: {
          data: checklistVideo,
          ratio: ratio.label ? ratio.label : "S",
          location: recent.node.location,
          token: tokenApps,
          location: recent.node.location,
          id_album: props.route.params.id_album,
          id_itin: props.route.params.id_itin,
          title_album: props.route.params.title_album,
          album: props.route.params.album,
        },
      });
    }
  };

  useEffect(() => {
    (async () => {
      await getAlbumRoll();
      // await getAllImageFromRoll();
      await requestCameraPermission();
    })();
  }, [selectedAlbum, props.navigation]);

  let buka = useRef(false);

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

  function compare(a, b) {
    const bandA = a.title.toUpperCase();
    const bandB = b.title.toUpperCase();

    let comparison = 0;
    if (bandA > bandB) {
      comparison = 1;
    } else if (bandA < bandB) {
      comparison = -1;
    }
    return comparison;
  }

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
          .then(async (r) => {
            let array_album = [
              {
                count: 0,
                title: "Recent Photos",
              },
              {
                count: 0,
                title: "Recent Videos",
              },
            ];

            if (r.length) {
              r.sort(compare);
              let merge = array_album.concat(r);
              await setAllalbum(merge);
              await setSelectedAlbum(merge[0]);
              await getImageFromRoll(merge[0]);
              await selectAlbum(merge[0]);
            } else {
              await setAllalbum(array_album);
              await setSelectedAlbum(array_album[0]);
              await getImageFromRoll(array_album[0]);
              await selectAlbum(array_album[0]);
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
    let dataCamera;
    switch (dataalbum.title) {
      case "Recent Photos":
        dataCamera = await CameraRoll.getPhotos({
          first: 100,
          assetType: "Photos",
          // groupTypes: "Album",
          // groupName: "Recent Photos",
          include: ["location", "filename", "imageSize", "playableDuration"],
        });
        break;
      case "Recent Videos":
        dataCamera = await CameraRoll.getPhotos({
          first: 100,
          assetType: "Videos",
          // groupTypes: "Album",
          // groupName: "Recent Photos",
          include: ["location", "filename", "imageSize", "playableDuration"],
        });
        break;
      default:
        dataCamera = await CameraRoll.getPhotos({
          first: 100,
          assetType: "All",
          groupTypes: "Album",
          groupName: dataalbum.title,
          include: ["location", "filename", "imageSize", "playableDuration"],
        });
        break;
    }

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
      let dataCamera;
      switch (selectedAlbum.title) {
        case "Recent Photos":
          dataCamera = await CameraRoll.getPhotos({
            after: page_info.end_cursor,
            first: 40,
            assetType: "Photos",
            // groupTypes: "Album",
            // groupName: "Recent Photos",
            include: ["location", "filename", "imageSize", "playableDuration"],
          });
          break;
        case "Recent Videos":
          dataCamera = await CameraRoll.getPhotos({
            after: page_info.end_cursor,
            first: 40,
            assetType: "Videos",
            // groupTypes: "Album",
            // groupName: "Recent Photos",
            include: ["location", "filename", "imageSize", "playableDuration"],
          });
          break;
        default:
          dataCamera = await CameraRoll.getPhotos({
            after: page_info.end_cursor,
            first: 40,
            assetType: "All",
            groupTypes: "Album",
            groupName: dataalbum.title,
            include: ["location", "filename", "imageSize", "playableDuration"],
          });
          break;
      }
      let data_foto = dataCamera.edges;
      const datas = [...imageRoll, ...data_foto];
      setImageRoll(datas);
      setPageInfo(dataCamera.page_info);
      setLoadimg(false);
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
            paddingTop: Platform.OS == "ios" ? 60 : 10,
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
              {Platform.OS == "ios" ? (
                <Arrowbackiosblack height={15} width={15}></Arrowbackiosblack>
              ) : (
                <Arrowbackblack height={20} width={20}></Arrowbackblack>
              )}
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

  const selectMutiVideo = async (item, index) => {
    let tempsVideo = [...checklistVideo];
    tempsVideo.push(item);
    setChecklistVideo(tempsVideo);
    buka.current = !buka.current;
    setRatio({ ratio });
    if (buka.current === false) {
      setChecklistVideo([]);
    }
    await setRecent(item);
  };

  const selectOneVideo = async (item, index) => {
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

  const durationTime = (data) => {
    data.currentTime < 60.0
      ? recent?.node?.image?.playableDuration.toString().substr(0, 1) ==
        data.currentTime.toString().substr(0, 1)
        ? setTime(true)
        : setTime(false)
      : setTime(false);
  };

  return (
    <SafeAreaView
      style={{
        // flex: 1,
        backgroundColor: "#14646e",
      }}
    >
      <StatusBar backgroundColor="#14646e" barStyle="light-content" />
      <Loading show={loading} />
      <_modalGalery />

      <View
        style={{
          backgroundColor: "#209FAE",
          height: Platform.OS === "ios" ? (Notch ? 44 : 44) : 55,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          alignContent: "center",

          // marginTop: Platform.OS == "android" ? StatusBar.currentHeight : 0,
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
            {Platform.OS == "ios" ? (
              <Arrowbackios height={15} width={15}></Arrowbackios>
            ) : (
              <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
            )}
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
          onPress={() => nextFunction(recent?.node?.type, checklistVideo)}
        />
      </View>

      <FlatList
        keyExtractor={(item) => item?.node?.image?.uri}
        style={{
          backgroundColor: "white",
          height: Dimensions.get("screen").height * 0.85,
          // marginBottom: 100,
        }}
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View
            style={{
              // alignItems: "center",
              backgroundColor: "#fff",
            }}
          >
            {recent?.node?.type.substr(0, 5) === "video" ? (
              <>
                <FunVideo
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
                  ref={(slider) => {
                    videoView = slider;
                  }}
                  onProgress={(e) => durationTime(e)}
                  paused={
                    props.route.name == "Post" && isFocused ? false : true
                  }
                  repeat={time ? true : false}
                  // onBuffer={videoView?.current?.onBuffer}
                  onError={videoView?.current?.videoError}
                  style={{
                    width: ratio.label == "P" ? width * (4 / 5) : width,
                    height: ratio.label == "L" ? width * (2.2 / 3) : width,
                  }}
                  muted={mute ? true : false}
                  resizeMode="cover"
                ></FunVideo>
                {loadVid ? (
                  <View
                    style={{
                      position: "absolute",
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      opacity: 0.5,
                      height: "100%",
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <ActivityIndicator size="large" color="#209fae" />
                  </View>
                ) : null}
              </>
            ) : (
              <View
                style={{
                  height: width,
                  width: width,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  // resizeMode="contain"
                  source={{ uri: recent.node?.image?.uri }}
                  style={{
                    width: ratio.label == "P" ? width * (4 / 5) : width,
                    height: ratio.label == "L" ? width * (2.2 / 3) : width,
                    // width: ratio.label == "P" ? width * (4 / 5) : width,
                    // height: ratio.label == "L" ? width * (2 / 3) : width,
                    // width: width,
                    // height: width,
                    // resizeMode: ratio.width == 1 ? "cover" : "contain",
                    // resizeMode: "contain",
                  }}
                />
                {/* <ImageCropper
            style={{
              width: width,
              height: width,
              borderWidth: 5,
            }}
            imageUri={recent.node?.image?.uri}
            setCropperParams={() => setCropperParams}
            resizeMode="contain"
          /> */}
              </View>
            )}
            {checklistVideo.length < 2 ? (
              <Pressable
                onPress={() =>
                  setRatio(ratio.index == 1 ? ratioindex[0] : ratioindex[1])
                }
                style={{
                  idth: width,
                  // height: width,
                  backgroundColor: "#B2B2B2",
                  position: "absolute",
                  bottom: 0,
                  borderRadius: 20,
                  margin: 15,
                  width: 40,
                  height: 40,
                  left: 0,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {ratio.index == 0 ? (
                  <SizeOri height={23} width={23} />
                ) : (
                  <SizeStrace height={23} width={23} />
                )}
              </Pressable>
            ) : null}
            {recent?.node?.type.substr(0, 5) === "video" ? (
              <Pressable
                onPress={() => setMute(!mute)}
                style={{
                  position: "absolute",
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  // backgroundColor: "#464646",
                  bottom: 10,
                  right: 10,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {mute ? (
                  <Mute width="15" height="15" />
                ) : (
                  <Unmute width="15" height="15" />
                )}
              </Pressable>
            ) : null}
          </View>
        }
        ref={slider}
        data={imageRoll && imageRoll.length ? imageRoll : null}
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
                marginBottom: 15,
              }}
              onPress={() => selectImg(item)}
              onLongPress={() => selectMutiVideo(item, index)}
              delayLongPress={800}

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
                        // bottom: 5,
                        // right: 5,
                        // borderRadius: 15,
                        // position: "absolute",
                        // backgroundColor: "rgba(0,0,0,0.50)",
                        // borderWidth: 2,
                        borderColor: "black",
                        // height: 30,
                        // width: 30,
                        width: "100%",
                        height: "100%",
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
                              position: "absolute",
                              backgroundColor: "#209fae",
                              height: 26,
                              width: 26,
                              borderRadius: 13,
                              borderWidth: 1,
                              bottom: 5,
                              right: 5,
                              borderColor: "#FFF",
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
                        // bottom: 5,
                        // right: 5,
                        // borderRadius: 15,
                        // position: "absolute",
                        // backgroundColor: "rgba(0,0,0,0.50)",
                        // borderWidth: 2,
                        borderColor: "black",
                        // height: 30,
                        // width: 30,
                        width: "100%",
                        height: "100%",
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
                              position: "absolute",
                              backgroundColor: "#209fae",
                              height: 26,
                              width: 26,
                              borderRadius: 13,
                              borderWidth: 1,
                              bottom: 5,
                              right: 5,
                              borderColor: "#FFF",
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
                marginVertical: 10,
                paddingBottom: 40,
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
        onEndReachedThreshold={0.5}
        // onEndReached={getMoreImage}
        initialNumToRender={40}
        onEndThreshold={3000}
        onScroll={() => setPreview(false)}
      />
      <Peringatan
        aler={aler}
        setClose={() => showAlert({ ...aler, show: false })}
      />
    </SafeAreaView>
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
