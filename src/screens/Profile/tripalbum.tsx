import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Dimensions,
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  // Modal,
} from "react-native";
import Modal from "react-native-modal";
import { AsyncStorage } from "react-native";
import {} from "../../../const/PixelRatio";
//data_bg nanti itu Profile Picture, data_pic itu avatar
import { default_image, Emptys } from "../../../const/Png";
import { Sharegreen, Arrowbackwhite, Pluswhite } from "../../../const/Svg";
// import {  } from 'react-native-gesture-handler';
import Ripple from "react-native-material-ripple";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import { Button, Text } from "../../../Component";
import { NavigationEvents } from "react-navigation";
import album from "../../../graphQL/Query/Profile/album";
import Uploadfoto from "../../../graphQL/Mutation/Profile/Uploadfotoalbum";
import * as ImageManipulators from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

import Loading from "../Loading";
import { useTranslation } from "react-i18next";

export default function tripalbum(props) {
  const { t, i18n } = useTranslation();
  let iditinerary = props.navigation.getParam("iditinerary");
  let token = props.navigation.getParam("token");
  let position = props.navigation.getParam("position");
  let [loading, setLoading] = useState(false);
  let [day_id, setday_id] = useState();
  let [modals, setmodal] = useState(false);

  const [
    getdataalbum,
    { data: dataalbum, loading: loadingalbum, error: erroralbum, refetch },
  ] = useLazyQuery(album, {
    fetchPolicy: "network-only",

    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    variables: {
      itinerary_id: iditinerary,
    },
  });

  const [
    mutationUpload,
    { loading: loadingupload, data: dataupload, error: errorupload },
  ] = useMutation(Uploadfoto, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  function wait(timeout) {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  }

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    getdataalbum();
    wait(1000).then(() => setRefreshing(false));

    (async () => {
      let { status } = await Permissions.askAsync(Permissions.CAMERA);
      if (status !== "granted") {
        Alert.alert(t("permissioncamera"));
      }
    })();

    (async () => {
      let { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

      if (status !== "granted") {
        Alert.alert(t("permissioncamera"));
      }
    })();

    // (async () => {
    // 	let { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);

    // 	if (status !== 'granted') {
    // 		Alert.alert(
    // 			t('permissioncamera')
    // 		);
    // 	}
    // })();
  };

  const upload = async (data) => {
    setmodal(false);
    setLoading(true);
    // console.log(data);
    const manipulate = await ImageManipulators.manipulateAsync(data, [], {
      compress: 0.5,
      base64: true,
    });
    let tmpFile = Object.assign(data, { base64: manipulate.base64 });
    if (tmpFile.base64) {
      // console.log(tmpFile.base64);
      try {
        let response = await mutationUpload({
          variables: {
            itinerary_id: iditinerary,
            day_id: day_id,
            description: "0",
            assets: "data:image/jpeg;base64," + tmpFile.base64,
          },
        });
        if (errorupload) {
          throw new Error("Error Input");
        }
        if (response.data) {
          if (response.data.uploadalbums.code !== 200) {
            throw new Error(response.data.uploadalbums.message);
          }
          // Alert.alert(t('success'));
          onRefresh();
          // props.navigation.goBack();
        }
        setLoading(false);
      } catch (error) {
        Alert.alert("" + error);
        setLoading(false);
      }
    }
  };

  const pickcamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      upload(result.uri);
    }
  };
  const pickGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      upload(result.uri);
    }
  };
  // console.log(dataalbum);

  return (
    <ScrollView
      style={{
        width: Dimensions.get("screen").width,
        height: Dimensions.get("screen").height,
      }}
      contentContainerStyle={{ paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
      stickyHeaderIndices={[0]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View
        style={{
          paddingHorizontal: 20,
          backgroundColor: "white",
          paddingTop: 5,
        }}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderBottomColor: "#d1d1d1",
            justifyContent: "space-between",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <View style={{ width: "70%" }}>
            <Text type={"bold"} size="label">
              {dataalbum && dataalbum.itinerary_album_list
                ? dataalbum.itinerary_album_list.name
                : ""}
            </Text>
            <Text>Itinerary photo album</Text>
          </View>
          <Button size={"small"} type="circle" color="tertiary">
            <Sharegreen height={15} width={15}></Sharegreen>
          </Button>
        </View>
      </View>

      {dataalbum &&
      dataalbum.itinerary_album_list &&
      dataalbum.itinerary_album_list.day_album
        ? dataalbum.itinerary_album_list.day_album.map((item, index) => {
            // console.log(item);
            if (position === "profile") {
              return (
                <View
                  style={{
                    paddingHorizontal: 20,
                    width: "100%",
                  }}
                >
                  <View
                    style={{
                      borderBottomWidth: 1,
                      borderColor: "#d1d1d1",
                      paddingVertical: 10,
                    }}
                  >
                    <Text type="bold" style={{ paddingBottom: 5 }}>
                      {t("day")} : {item.day}
                    </Text>

                    {item.album && item.album.length > 0 ? (
                      <TouchableOpacity
                        onPress={() =>
                          props.navigation.push("tripalbumdetail", {
                            data: item,
                            iditinerary: iditinerary,
                            token: token,
                            day_id: item.id,
                            judul: dataalbum.itinerary_album_list.name,
                            position: position,
                          })
                        }
                        style={{
                          padding: 5,
                          // borderWidth: 1,
                          backgroundColor: "white",
                          borderRadius: 5,
                          shadowColor: "#464646",
                          shadowOffset: { width: 2, height: 2 },
                          shadowOpacity: 1,
                          shadowRadius: 2,
                          elevation: 5,
                        }}
                      >
                        <Image
                          source={{ uri: item.album[0].assets }}
                          style={{
                            height: Dimensions.get("screen").width * 0.5,
                            width: "100%",
                            // margin: 2,
                            // borderRadius: 5,
                            resizeMode: "cover",
                          }}
                        ></Image>

                        <View style={{ flexDirection: "row", marginTop: 2 }}>
                          <Image
                            source={
                              item.album[1]
                                ? { uri: item.album[1].assets }
                                : Emptys
                            }
                            style={{
                              marginRight: 2,
                              height:
                                (Dimensions.get("screen").width - 20) * 0.3,
                              width:
                                (Dimensions.get("screen").width - 20) * 0.3,
                              resizeMode: "cover",
                            }}
                          ></Image>
                          <Image
                            source={
                              item.album[2]
                                ? { uri: item.album[2].assets }
                                : Emptys
                            }
                            style={{
                              marginRight: 2,
                              height:
                                (Dimensions.get("screen").width - 20) * 0.3,
                              width:
                                (Dimensions.get("screen").width - 20) * 0.3,
                              resizeMode: "cover",
                            }}
                          ></Image>
                          <ImageBackground
                            source={
                              item.album[3]
                                ? { uri: item.album[3].assets }
                                : Emptys
                            }
                            style={{
                              marginRight: 2,
                              height:
                                (Dimensions.get("screen").width - 20) * 0.3,
                              width:
                                (Dimensions.get("screen").width - 20) * 0.3,
                              // resizeMode: 'cover',
                              alignContent: "center",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            imageStyle={{
                              // marginRight: 2,
                              height:
                                (Dimensions.get("screen").width - 20) * 0.3,
                              width:
                                (Dimensions.get("screen").width - 20) * 0.3,
                              resizeMode: "cover",
                            }}
                          >
                            <View
                              style={{
                                height: "100%",
                                width: "100%",
                                backgroundColor: "rgba(255,255,255,0.4)",
                                alignContent: "center",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Text>View All</Text>
                            </View>
                          </ImageBackground>
                        </View>
                      </TouchableOpacity>
                    ) : position === "profile" ? (
                      <TouchableOpacity
                        onPress={() => {
                          setmodal(true);
                          setday_id(item.id);
                          // props.navigation.push('tripalbumdetail')
                        }}
                        style={{
                          flexDirection: "row",
                          alignContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          type="circle"
                          style={{ borderRadius: 5, height: 60, width: 60 }}
                          color="tertiary"
                        >
                          <Pluswhite height={30} width={30} />
                        </Button>
                        <Text style={{ marginHorizontal: 20 }}>
                          Upload Photos
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <View
                        style={{
                          height: 60,
                          justifyContent: "center",
                          alignContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text>No Album</Text>
                      </View>
                    )}
                  </View>
                </View>
              );
            } else if (
              position !== "profile" &&
              item.album &&
              item.album.length > 0
            ) {
              return (
                <View
                  style={{
                    paddingHorizontal: 20,
                    width: "100%",
                  }}
                >
                  <View
                    style={{
                      borderBottomWidth: 1,
                      borderColor: "#d1d1d1",
                      paddingVertical: 10,
                    }}
                  >
                    <Text type="bold" style={{ paddingBottom: 5 }}>
                      {t("day")} : {item.day}
                    </Text>

                    {item.album && item.album.length > 0 ? (
                      <TouchableOpacity
                        onPress={() =>
                          props.navigation.push("tripalbumdetail", {
                            data: item,
                            iditinerary: iditinerary,
                            token: token,
                            day_id: item.id,
                            judul: dataalbum.itinerary_album_list.name,
                            position: position,
                          })
                        }
                        style={{
                          padding: 5,
                          // borderWidth: 1,
                          backgroundColor: "white",
                          borderRadius: 5,
                          shadowColor: "#464646",
                          shadowOffset: { width: 2, height: 2 },
                          shadowOpacity: 1,
                          shadowRadius: 2,
                          elevation: 5,
                        }}
                      >
                        <Image
                          source={{ uri: item.album[0].assets }}
                          style={{
                            height: Dimensions.get("screen").width * 0.5,
                            width: "100%",
                            // margin: 2,
                            // borderRadius: 5,
                            resizeMode: "cover",
                          }}
                        ></Image>

                        <View style={{ flexDirection: "row", marginTop: 2 }}>
                          <Image
                            source={
                              item.album[1]
                                ? { uri: item.album[1].assets }
                                : Emptys
                            }
                            style={{
                              marginRight: 2,
                              height:
                                (Dimensions.get("screen").width - 20) * 0.3,
                              width:
                                (Dimensions.get("screen").width - 20) * 0.3,
                              resizeMode: "cover",
                            }}
                          ></Image>
                          <Image
                            source={
                              item.album[2]
                                ? { uri: item.album[2].assets }
                                : Emptys
                            }
                            style={{
                              marginRight: 2,
                              height:
                                (Dimensions.get("screen").width - 20) * 0.3,
                              width:
                                (Dimensions.get("screen").width - 20) * 0.3,
                              resizeMode: "cover",
                            }}
                          ></Image>
                          <ImageBackground
                            source={
                              item.album[3]
                                ? { uri: item.album[3].assets }
                                : Emptys
                            }
                            style={{
                              marginRight: 2,
                              height:
                                (Dimensions.get("screen").width - 20) * 0.3,
                              width:
                                (Dimensions.get("screen").width - 20) * 0.3,
                              // resizeMode: 'cover',
                              alignContent: "center",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            imageStyle={{
                              // marginRight: 2,
                              height:
                                (Dimensions.get("screen").width - 20) * 0.3,
                              width:
                                (Dimensions.get("screen").width - 20) * 0.3,
                              resizeMode: "cover",
                            }}
                          >
                            <View
                              style={{
                                height: "100%",
                                width: "100%",
                                backgroundColor: "rgba(255,255,255,0.4)",
                                alignContent: "center",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Text>View All</Text>
                            </View>
                          </ImageBackground>
                        </View>
                      </TouchableOpacity>
                    ) : (
                      <View
                        style={{
                          height: 60,
                          justifyContent: "center",
                          alignContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text>No Album</Text>
                      </View>
                    )}
                  </View>
                </View>
              );
            }
          })
        : null}
      <Loading show={loading} />
      <NavigationEvents onDidFocus={() => onRefresh()} />

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
    </ScrollView>
  );
}

tripalbum.navigationOptions = (props) => ({
  // headerTransparent: true,
  headerTitle: "Trip Album",
  headerMode: "screen",
  headerStyle: {
    backgroundColor: "#209FAE",
    elevation: 0,
    borderBottomWidth: 0,
    // fontSize: 50,
    // justifyContent: 'center',
    // flex:1,
  },
  headerTitleStyle: {
    fontFamily: "Lato-Regular",
    fontSize: 14,
    color: "white",
    alignSelf: "center",
  },
  headerLeft: (
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
  headerRight: <View style={{ flexDirection: "row" }}></View>,
  headerRightStyle: {
    // paddingRight: 20,
  },
});
