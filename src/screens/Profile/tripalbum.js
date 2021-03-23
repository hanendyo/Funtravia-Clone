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
} from "react-native";
import Modal from "react-native-modal";
import { Emptys } from "../../assets/png";
import { Sharegreen, Arrowbackwhite, Pluswhite } from "../../assets/svg";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import { Button, Text, Loading } from "../../component";
import album from "../../graphQL/Query/Profile/album";
import Uploadfoto from "../../graphQL/Mutation/Profile/Uploadfotoalbum";
import ImagePicker from "react-native-image-crop-picker";
import { useTranslation } from "react-i18next";

export default function tripalbum(props) {
  const HeaderComponent = {
    title: "Trip Album",
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: "Trip Album",
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
    headerLeftContainerStyle: {
      background: "#FFF",

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
        <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
      </Button>
    ),
  };

  const { t, i18n } = useTranslation();
  let iditinerary = props.route.params.iditinerary;
  let token = props.route.params.token;
  let position = props.route.params.position;
  let [loading, setLoading] = useState(false);
  let [day_id, setday_id] = useState();
  let [modals, setmodal] = useState(false);
  console.log(position);

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
  };

  const upload = async (data) => {
    setmodal(false);
    setLoading(true);

    if (data) {
      // console.log(tmpFile.base64);
      try {
        let response = await mutationUpload({
          variables: {
            itinerary_id: iditinerary,
            day_id: day_id,
            description: "0",
            assets: "data:image/jpeg;base64," + data,
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
    ImagePicker.openCamera({
      compressImageMaxWidth: 1024,
      compressImageMaxHeight: 1024,
      cropping: true,
      freeStyleCropEnabled: true,
      includeBase64: true,
    }).then((image) => {
      upload(image.data);
    });
  };
  const pickGallery = async () => {
    ImagePicker.openPicker({
      compressImageMaxWidth: 1024,
      compressImageMaxHeight: 1024,
      cropping: true,
      freeStyleCropEnabled: true,
      includeBase64: true,
    }).then((image) => {
      upload(image.data);
    });
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      onRefresh();
    });
    return unsubscribe;
  }, [props.navigation]);

  return (
    <ScrollView
      style={{
        width: Dimensions.get("screen").width,
        height: Dimensions.get("screen").height,

        backgroundColor: "white",
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
                          onPress={() => {
                            setmodal(true);
                            setday_id(item.id);
                            // props.navigation.push('tripalbumdetail')
                          }}
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
      {/* <NavigationEvents onDidFocus={() => onRefresh()} /> */}

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
