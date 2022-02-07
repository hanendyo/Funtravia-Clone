import React, { useEffect, useState, useRef } from "react";
import {
  Dimensions,
  SafeAreaView,
  View,
  Image,
  FlatList,
  Pressable,
  Platform,
  ActivityIndicator,
  Modal,
} from "react-native";
import {
  Arrowbackios,
  Arrowbackwhite,
  Check,
  Delete,
  CropIcon,
} from "../../../assets/svg";
import { Text, Button, FunVideo, Peringatan } from "../../../component";
import ImagePicker from "react-native-image-crop-picker";
import { StackActions } from "@react-navigation/routers";
import { useTranslation } from "react-i18next";
import { stat } from "react-native-fs";
import { TouchableHighlight } from "react-native-gesture-handler";
import { RNToasty } from "react-native-toasty";
import { VESDK } from "react-native-videoeditorsdk";
import { useSelector } from "react-redux";
import {
  Video as VideoCompress,
  Image as ImageCompress,
} from "react-native-compressor";
import Video from "react-native-video";
import RNFS from "react-native-fs";

export default function Crop(props) {
  const [data, setData] = useState(props?.route?.params?.data);
  const [ratio, setRatio] = useState(props?.route?.params?.ratio);
  const [newRatio, setNewRatio] = useState("S");
  const [indexAktif, setIndexAktive] = useState(0);
  const tokenApps = useSelector((data) => data.token);

  const { t } = useTranslation();
  let [loadVid, setLoadVid] = useState(false);
  let [modalDelete, setModalDelete] = useState(false);
  let [aler, showAlert] = useState({ show: false, judul: "", detail: "" });

  const HeaderComponent = {
    headerShown: true,
    transparent: false,
    headerTintColor: "white",
    headerTitle: (
      <Text
        size={Platform.OS == "ios" ? "label" : "header"}
        type="bold"
        style={{ color: "#FFF" }}
      >
        {t("cropNewPost")}
      </Text>
    ),
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerLeft: () => (
      <Button
        text={""}
        size="medium"
        type="circle"
        variant="transparent"
        onPress={() => {
          props.navigation.goBack(null);
        }}
        style={{
          height: 55,
          marginLeft: 5,
        }}
      >
        {Platform.OS == "ios" ? (
          <Arrowbackios height={15} width={15}></Arrowbackios>
        ) : (
          <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
        )}
      </Button>
    ),
    headerRight: () => (
      <Button
        text={""}
        size="medium"
        type="circle"
        variant="transparent"
        onPress={() => Next(data)}
        style={{
          height: 55,
          marginRight: 10,
        }}
      >
        <Text size="description" type="bold" style={{ color: "#FFF" }}>
          Next
        </Text>
      </Button>
    ),
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    // const backAction = () => {
    //   BackHandler.addEventListener(props.navigation.goBack());
    //   return true;
    // };

    // const backHandler = BackHandler.addEventListener(
    //   "hardwareBackPress",
    //   backAction
    // );
  });

  const L = (2.2 / 3) * Dimensions.get("screen").width - 30;
  const P = (5 / 4) * Dimensions.get("screen").width - 30;
  const S = Dimensions.get("screen").width - 30;

  const Next = async (data) => {
    let tempData = [...data];
    for (var i in tempData) {
      if (tempData[i].node.type.substr(0, 5) == "video") {
        if (Platform.OS == "ios") {
          let extension = tempData[i].node.image.filename.split(".").pop();
          const dest = `${RNFS.TemporaryDirectoryPath}${Math.random()
            .toString(36)
            .substring(7)}.${extension}`;
          let absolutePath = await RNFS.copyAssetsVideoIOS(
            tempData[i].node.image.uri,
            dest,
            0,
            0
          );
          let result = await VideoCompress.compress("file://" + absolutePath, {
            compressionMethod: "auto",
          });
          const statResult = await stat(result);
          if (statResult.size <= 50000000) {
            const tempDatas = { ...tempData[i].node.image };
            tempDatas.path = statResult.path;
            tempDatas.uri = statResult.path;
            tempDatas.originalPath = tempData[i].node.image.uri;
            tempDatas.size = statResult.size;
            tempData[i].node.image = tempDatas;
            setData(tempData);
          } else {
            showAlert({
              ...aler,
              show: true,
              judul: t("fileTolarge"),
              detail: t("descMaxUpload"),
            });
          }
        } else {
          const result = await VideoCompress.compress(
            tempData[i].node.image.uri,
            {
              compressionMethod: "auto",
            }
          );
          const statResult = await stat(result);
          // const statResult = await stat(tempData[i].node.image.uri);
          if (statResult.size <= 50000000) {
            const tempDatas = { ...tempData[i].node.image };
            tempDatas.path = statResult.path;
            tempDatas.uri = statResult.path;
            tempDatas.size = statResult.size;
            tempData[i].node.image = tempDatas;
            setData(tempData);
          } else {
            showAlert({
              ...aler,
              show: true,
              judul: t("fileTolarge"),
              detail: t("descMaxUpload"),
            });
          }
        }
      } else {
        if (Platform.OS == "ios") {
          if (tempData[i].node.image.path) {
            let result = await ImageCompress.compress(
              "file://" + tempData[i].node.image.path,
              {
                compressionMethod: "auto",
              }
            );
            let statResult = await stat(result);
            const tempDatas = { ...tempData[i].node.image };
            tempDatas.uri = statResult.path;
            tempDatas.size = statResult.size;
            tempData[i].node.image = tempDatas;
            setData(tempData);
          } else {
            let extension = tempData[i].node.image.filename.split(".").pop();
            const dest = `${RNFS.TemporaryDirectoryPath}${Math.random()
              .toString(36)
              .substring(7)}.${extension}`;
            let absolutePath = await RNFS.copyAssetsFileIOS(
              tempData[i].node.image.uri,
              dest,
              0,
              0
            );
            let result = await ImageCompress.compress(
              "file://" + absolutePath,
              {
                compressionMethod: "auto",
              }
            );
            let statResult = await stat(result);
            const tempDatas = { ...tempData[i].node.image };
            tempDatas.path = statResult.path;
            tempDatas.uri = statResult.path;
            tempDatas.size = statResult.size;
            tempData[i].node.image = tempDatas;
            setData(tempData);
          }
        } else {
          const statResult = await stat(tempData[i].node.image.uri);
          const tempDatas = { ...tempData[i].node.image };
          tempDatas.path = statResult.path;
          tempDatas.uri = statResult.path;
          tempDatas.size = statResult.size;
          tempData[i].node.image = tempDatas;
          setData(tempData);
        }
      }
    }

    props.navigation.dispatch(
      StackActions.replace("FeedStack", {
        screen: "CreatePostScreen",
        params: {
          location: props.route.params.location,
          type: "multi",
          file: data,
          token: tokenApps,
          id_album: props.route.params.id_album,
          id_itin: props.route.params.id_itin,
          title_album: props.route.params.title_album,
          album: props.route.params.album,
          ratio: {
            width: ratio == "L" ? 3 : "P" ? 4 : 1,
            height: ratio == "L" ? 2.2 : "P" ? 5 : 1,
            label: ratio,
          },
        },
      })
    );
  };

  const deleteFile = (index) => {
    const tempData = [...data];
    setIndexAktive(tempData.length - 2 != -1 ? tempData.length - 2 : 0);
    if (tempData && tempData.length > 1) {
      setModalDelete(false);
      tempData.splice(index, 1);
      setData(tempData);
    } else {
      RNToasty.Show({
        title: t("minFotoUpload"),
        position: "bottom",
      });
    }
  };

  const Cropped = (index) => {
    let height;
    let width;
    if (ratio == "L") {
      width = 1080;
      height = (2.2 / 3) * 1080;
    } else if (ratio == "P") {
      width = 1080;
      height = (5 / 4) * 1080;
    } else {
      width = 1080;
      height = 1080;
    }
    ImagePicker.openCropper({
      path: data[index].node.image.uri,
      width: width,
      height: height,
    })
      .then((image) => {
        let tempp = { ...image };
        let tempData = [...data];
        tempp.filename = tempData[index].node.image.filename;
        tempp.uri = tempp.path;
        tempData[index].node.image = tempp;
        setData(tempData);
      })
      .catch((error) => console.log(error));
  };

  let videoView = useRef();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Modal
        useNativeDriver={true}
        visible={modalDelete}
        transparent={true}
        animationType="fade"
      >
        <Pressable
          onPress={() => setModalDelete(false)}
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
            width: Dimensions.get("screen").width / 1.5,
            alignSelf: "center",
            backgroundColor: "#FFF",
            zIndex: 15,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            alignContent: "center",
            borderRadius: 5,
            marginTop: Dimensions.get("screen").height / 3,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              width: Dimensions.get("screen").width / 1.5,
              justifyContent: "center",
              borderRadius: 5,
              // borderWidth: 1,
            }}
          >
            <View
              style={{
                alignItems: "center",
                borderBottomColor: "#d1d1d1",
                borderBottomWidth: 1,
                borderTopRightRadius: 5,
                borderTopLeftRadius: 5,
                backgroundColor: "#f6f6f6",
              }}
            >
              <Text style={{ marginVertical: 15 }} size="title" type="bold">
                {`${t("delete")} ${data[indexAktif]?.node?.type?.substr(0, 5)}`}
              </Text>
            </View>
            <Text
              style={{
                alignSelf: "center",
                textAlign: "center",
                marginTop: 20,
                marginHorizontal: 15,
              }}
              size="label"
              type="regular"
              numberOfLines={2}
            >
              {`${t("deleteFileCrop")} ${data[indexAktif]?.node?.type?.substr(
                0,
                5
              )} ?`}
            </Text>
            <View style={{ marginTop: 20, marginHorizontal: 15 }}>
              <Button
                onPress={() => {
                  deleteFile(indexAktif);
                }}
                color="secondary"
                text={t("delete")}
              ></Button>
              <Button
                onPress={() => {
                  setModalDelete(false);
                }}
                style={{ marginVertical: 7 }}
                variant="transparent"
                text={t("discard")}
              ></Button>
            </View>
          </View>
        </View>
      </Modal>
      <Peringatan
        aler={aler}
        setClose={() => showAlert({ ...aler, show: false })}
      />
      <View
        style={{
          width: Dimensions.get("screen").width,
          paddingHorizontal: 15,
          backgroundColor: "#fff",
          paddingTop: 15,
          height: Dimensions.get("screen").height,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            marginBottom: 20,
          }}
        >
          {data[indexAktif]?.node?.type?.substr(0, 5) == "video" ? null : (
            <TouchableHighlight
              underlayColor={"#f1f1f1"}
              onPress={() => Cropped(indexAktif)}
              style={{ marginRight: 10 }}
            >
              <CropIcon height={20} width={20} />
            </TouchableHighlight>
          )}
          <TouchableHighlight
            underlayColor={"#f1f1f1"}
            onPress={() => setModalDelete(true)}
          >
            <Delete height={20} width={20} />
          </TouchableHighlight>
        </View>
        {data &&
        data[indexAktif] &&
        data[indexAktif]?.node?.type?.substr(0, 5) == "video" ? (
          <>
            <Video
              style={{
                width: Dimensions.get("window").width - 30,
                height: ratio == "L" ? L : ratio == "P" ? P : S,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "#f1f1f1",
              }}
              resizeMode="cover"
              poster={data[indexAktif].node.image.uri.replace(
                "output.m3u8",
                "thumbnail.png"
              )}
              posterResizeMode={"cover"}
              source={{
                uri:
                  Platform.OS === "ios"
                    ? `assets-library://asset/asset.${data[
                        indexAktif
                      ].node.image.filename.substring(
                        data[indexAktif].node.image.filename.length - 3
                      )}?id=${data[indexAktif].node.image.uri.substring(
                        5,
                        41
                      )}&ext=${data[indexAktif].node.image.filename.substring(
                        data[indexAktif].node.image.filename.length - 3
                      )}`
                    : data[indexAktif].node.image.uri,
              }}
              // source={{ uri: data[indexAktif].node.image.uri }}
              paused={false}
              ref={(ref) => {
                videoView = ref;
              }}
              onBuffer={videoView?.current?.onBuffer}
              onError={videoView?.current?.videoError}
            />
            {loadVid ? (
              <View
                style={{
                  position: "absolute",
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  opacity: 0.5,
                  height: newRatio == "L" ? L : newRatio == "P" ? P : S,
                  width: Dimensions.get("window").width - 30,
                  justifyContent: "center",
                  alignItems: "center",
                  marginHorizontal: 15,
                  borderRadius: 10,
                }}
              >
                <ActivityIndicator size="large" color="#209fae" />
              </View>
            ) : null}
          </>
        ) : (
          <Image
            style={{
              width: Dimensions.get("window").width - 30,
              height: ratio == "L" ? L : ratio == "P" ? P : S,
              borderRadius: 10,
            }}
            // source={{ uri: data[indexAktif].node.image.path }}
            source={{ uri: data[indexAktif].node.image.uri }}
          />
        )}
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            marginVertical: 5,
          }}
          keyExtractor={(item, index) => index.toString()}
          data={data}
          renderItem={({ item, index }) => (
            <Pressable
              key={index}
              onPress={() => setIndexAktive(index)}
              style={{
                marginRight: data.length == index + 1 ? 0 : 5,
              }}
            >
              {item.type === "video" ? (
                <FunVideo
                  poster={item.filepath.replace("output.m3u8", "thumbnail.png")}
                  posterResizeMode={"cover"}
                  source={{
                    uri: item.node.image.uri,
                  }}
                  repeat={false}
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 10,
                    opacity: index == indexAktif ? 1 : 0.5,
                    borderWidth: index == indexAktif ? 1 : 0,
                    borderColor: index == indexAktif ? "#209fae" : null,
                  }}
                  resizeMode="cover"
                />
              ) : (
                <Image
                  resizeMode="cover"
                  source={{ uri: item?.node?.image.uri }}
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 10,
                    opacity: index == indexAktif ? 1 : 0.5,
                    borderWidth: index == indexAktif ? 2 : 0,
                    borderColor: index == indexAktif ? "#209fae" : null,
                  }}
                />
              )}
            </Pressable>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
