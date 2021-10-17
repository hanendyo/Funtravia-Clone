import React, { useEffect, useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  TouchableWithoutFeedback,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  Pressable,
  BackHandler,
  Platform,
} from "react-native";
import { Arrowbackios, Arrowbackwhite, Check } from "../../../assets/svg";
import { default_image } from "../../../assets/png";
import { Text, Button } from "../../../component";
import Video from "react-native-video";
import ImagePicker from "react-native-image-crop-picker";
import { StackActions } from "@react-navigation/routers";
import { useTranslation } from "react-i18next";

export default function Crop(props) {
  const [data, setData] = useState(props?.route?.params?.data);
  const [ratio, setRatio] = useState(props?.route?.params?.ratio);
  const [newRatio, setNewRatio] = useState("S");
  const [indexAktif, setIndexAktive] = useState(0);
  const [croped, setCroped] = useState(0);
  const { t } = useTranslation();

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
    headerTitleStyle: {
      fontFamily: "Lato-Bold",
      color: "white",
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
        onPress={() => Next(data, indexAktif)}
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

  const Next = (datas, index) => {
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

    if (!datas[index].node.image.cropRect) {
      if (datas[index].node.type.substr(0, 5) == "video") {
        setNewRatio(ratio);
        setIndexAktive(datas.length - 1 > index ? indexAktif + 1 : 0);
        setCroped((e) => e + 1);
        if (indexAktif + 1 == datas.length) {
          // console.log("index", index);
          props.navigation.dispatch(
            StackActions.replace("FeedStack", {
              screen: "CreatePostScreen",
              params: {
                location: props.route.params.location,
                type: "multi",
                file: data,
                token: token,
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
        }
      } else {
        ImagePicker.openCropper({
          path: data[index].node.image.uri,
          // path: data[index].node.image.path,
          width: width,
          height: height,
        })
          .then((image) => {
            let tempp = { ...image };
            tempp.filename = datas[index].node.image.filename;
            tempp.uri = tempp.path;
            datas[index].node.image = tempp;
            setNewRatio(ratio);
            setCroped((e) => e + 1);
            if (indexAktif + 1 < datas.length) {
              setIndexAktive(datas.length - 1 > index ? indexAktif + 1 : 0);
            }
            setData(datas);
          })
          .catch((error) => console.log(error));
      }
    } else {
      props.navigation.dispatch(
        StackActions.replace("FeedStack", {
          screen: "CreatePostScreen",
          params: {
            location: props.route.params.location,
            type: "multi",
            file: data,
            token: token,
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
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          width: Dimensions.get("screen").width,
          paddingHorizontal: 15,
          marginTop: 10,
          // height: Dimensions.get("screen").width,
        }}
      >
        {data &&
        data[indexAktif] &&
        data[indexAktif]?.node?.type?.substr(0, 5) == "video" ? (
          <Video
            style={{
              width: Dimensions.get("window").width - 30,
              height: newRatio == "L" ? L : newRatio == "P" ? P : S,
              borderRadius: 10,
            }}
            resizeMode="cover"
            source={{ uri: data[indexAktif].node.image.uri }}
          />
        ) : (
          <Image
            style={{
              width: Dimensions.get("window").width - 30,
              height: newRatio == "L" ? L : newRatio == "P" ? P : S,
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
          keyExtractor={(item, index) => item.node.image.modificationDate}
          data={data}
          renderItem={({ item, index }) => (
            <Pressable
              // onPress={() => setIndexAktive(index)}
              style={{
                marginRight: data.length == index + 1 ? 0 : 5,
              }}
            >
              {croped > index ? (
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
              ) : null}
              {item.type === "video" ? (
                <Video
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
