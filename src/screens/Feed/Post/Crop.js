import React, { useEffect, useState } from "react";
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
import { Video } from "react-native-compressor";
import { stat } from "react-native-fs";
import { TouchableHighlight } from "react-native-gesture-handler";
import { Image as ImageCompress } from "react-native-compressor";
import { RNToasty } from "react-native-toasty";
import { VESDK } from "react-native-videoeditorsdk";
import { useSelector } from "react-redux";

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
      <Text size="header" type="bold" style={{ color: "#FFF" }}>
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
        const result = await Video.compress(tempData[i].node.image.uri, {
          compressionMethod: "auto",
        });
        // const statResult = await stat(result);
        const statResult = await stat(tempData[i].node.image.uri);

        if (statResult.size <= 50000000) {
          const tempDatas = { ...tempData[i].node.image };
          tempDatas.path = statResult.path;
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
        const result = await ImageCompress.compress(
          tempData[i].node.image.uri,
          {
            compressionMethod: "auto",
          }
        );
        const statResult = await stat(result);
        const tempDatas = { ...tempData[i].node.image };
        tempDatas.path = statResult.path;
        tempDatas.size = statResult.size;
        tempData[i].node.image = tempDatas;
        setData(tempData);
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
            width: ratio == "L" ? 3 : 4,
            height: ratio == "L" ? 2.2 : 5,
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

  // const CroppedVideo = async (indexAktif) => {
  //   VESDK.openEditor(data[indexAktif].node.image.uri).then(
  //     (result) => {
  //       let tempData = [...data];
  //       if (result.video) {
  //         tempData[indexAktif].node.image.uri = result.video;
  //       }
  //       setData(tempData);
  //     },
  //     (error) => {
  //     }
  //   );
  // };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Modal
        useNativeDriver={true}
        visible={modalDelete}
        onRequestClose={() => false}
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
            width: Dimensions.get("screen").width / 5,
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
              width: Dimensions.get("screen").width - 140,
              justifyContent: "center",
              borderRadius: 5,
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
              // onPress={() => console.log("crop")}
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
            <FunVideo
              style={{
                width: Dimensions.get("window").width - 30,
                // height: newRatio == "L" ? L : newRatio == "P" ? P : S,
                height: ratio == "L" ? L : ratio == "P" ? P : S,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "#f1f1f1",
              }}
              resizeMode="cover"
              source={{ uri: data[indexAktif].node.image.uri }}
              repeat={true}
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
              // height: newRatio == "L" ? L : newRatio == "P" ? P : S,
              height: ratio == "L" ? L : ratio == "P" ? P : S,
              borderRadius: 10,
            }}
            // source={{ uri: data[indexAktif].node.image.path }}
            source={{ uri: data[indexAktif].node.image.uri }}
          />
        )}
        <FlatList
          // onLayout={() => setImg(data.assets[0])}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            // paddingHorizontal: 10,
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
              {/* {croped > index ? (
                <View
                  style={{
                    position: "absolute",
                    top: 20,
                    right: 20,
                    zIndex: 99,
                  }}
                >
                  <Check width={30} height={30} />
                </View>
              ) : null} */}
              {item.type === "video" ? (
                <FunVideo
                  // poster={item.filepath.replace("output.m3u8", "thumbnail.png")}
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
                  // source={{ uri: item?.node?.image.path }}
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
