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
  FlatList,
  TextInput,
} from "react-native";
import Modal from "react-native-modal";
import { Emptys } from "../../assets/png";
import {
  Sharegreen,
  Arrowbackwhite,
  Pluswhite,
  PlayVideo,
  Nextpremier,
} from "../../assets/svg";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import {
  Button,
  Text,
  Loading,
  shareAction,
  FunImage,
  FunImageBackground,
  FunVideo,
} from "../../component";
import albumbyitinerary from "../../graphQL/Query/Profile/albumbyitinerary";
import Uploadfoto from "../../graphQL/Mutation/Profile/Uploadfotoalbum";
import ImagePicker from "react-native-image-crop-picker";
import { useTranslation } from "react-i18next";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";
import { dateFormats } from "../../component/src/dateformatter";

export default function tripalbum(props) {
  const { t, i18n } = useTranslation();

  const HeaderComponent = {
    title: "Trip Album",
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: t("travelAlbum"),
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      fontFamily: "Lato-Bold",
      fontSize: 18,
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

  let iditinerary = props.route.params.iditinerary;
  let token = props.route.params.token;
  let position = props.route.params.position;
  let [loading, setLoading] = useState(false);
  let [day_id, setday_id] = useState();
  let [modals, setmodal] = useState(false);
  //   console.log(token);

  const { width, height } = Dimensions.get("screen");

  const [
    getdataalbum,
    { data: dataalbum, loading: loadingalbum, error: erroralbum, refetch },
  ] = useLazyQuery(albumbyitinerary, {
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

  //   console.log(dataalbum);

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
    onRefresh();
    // const unsubscribe = props.navigation.addListener("focus", () => {});
    // return unsubscribe;
  }, [props.navigation]);

  const RenderAlbum = ({ item, index }) => {
    return (
      <View
        style={{
          paddingHorizontal: 20,
          // width: "100%",
          width: width,
        }}
      >
        <View
          style={{
            borderBottomWidth: 1,
            borderColor: "#d1d1d1",
            paddingVertical: 20,
          }}
        >
          <Text type="bold" style={{ paddingBottom: 10 }}>
            {item.title} :
          </Text>

          {item.media && item.media.length > 0 ? (
            <Pressable
              onPress={() =>
                // props.navigation.push("tripalbumdetail", {
                //   data: item,
                //   iditinerary: iditinerary,
                //   token: token,
                //   day_id: item.id,
                //   judul: dataalbum.itinerary_album_list_v2.name,
                //   position: position,
                // })
                props.navigation.push("albumdetail", {
                  id: item.id,
                  type: item.type,
                  token: token,
                  judul: item.title,
                })
              }
              style={{
                padding: 7,
                //   borderWidth: 1,
                width: width - 40,
                backgroundColor: "white",
                borderRadius: 5,
                shadowColor: "#464646",
                shadowOffset: { width: 2, height: 2 },
                shadowOpacity: 1,
                shadowRadius: 2,
                elevation: 5,
              }}
            >
              {item.media[0].type == "video" ? (
                <View>
                  <FunVideo
                    poster={item.media[0].filepath.replace(
                      "output.m3u8",
                      "thumbnail.png"
                    )}
                    posterResizeMode={"cover"}
                    paused={true}
                    key={"posted" + index + item.id}
                    source={{
                      uri: item.media[0].filepath,
                    }}
                    muted={true}
                    // defaultSource={default_image}
                    resizeMode="cover"
                    style={{
                      // resizeMode: "cover",
                      width: width - 54,
                      height: Dimensions.get("screen").width * 0.5,
                      backgroundColor: "#fff",
                      borderRadius: 5,
                    }}
                  />
                  <View
                    style={{
                      // flexDirection: "row",
                      position: "absolute",
                      width: width - 54,
                      height: Dimensions.get("screen").width * 0.5,
                      backgroundColor: "rgba(0,0,0,0.4)",
                      justifyContent: "flex-end",
                      borderRadius: 5,

                      // top: 5,
                      // left: "35%",
                    }}
                  >
                    <PlayVideo width={15} height={15} style={{ margin: 10 }} />
                  </View>
                </View>
              ) : (
                <FunImage
                  source={{ uri: item.media[0].filepath }}
                  style={{
                    height: Dimensions.get("screen").width * 0.5,
                    width: width - 54,
                    borderRadius: 5,

                    // margin: 2,
                    // borderRadius: 5,
                    resizeMode: "cover",
                  }}
                />
              )}

              <View
                style={{
                  flexDirection: "row",
                  marginTop: 3,
                  width: width - 54,
                  justifyContent: "space-between",
                }}
              >
                {item.media[1] && item.media[1].type == "video" ? (
                  <View
                    style={{
                      flex: 1,
                      borderRadius: 3,
                    }}
                  >
                    <FunVideo
                      poster={item.media[1].filepath.replace(
                        "output.m3u8",
                        "thumbnail.png"
                      )}
                      posterResizeMode={"cover"}
                      paused={true}
                      key={"posted" + index + item.id}
                      source={{
                        uri: item.media[1].filepath,
                      }}
                      muted={true}
                      // defaultSource={default_image}
                      resizeMode="cover"
                      style={{
                        borderRadius: 3,

                        // resizeMode: "cover",
                        height: (width - 60) / 3,
                        width: (width - 60) / 3,
                        backgroundColor: "#fff",
                        // borderRadius: 5,
                      }}
                    />
                    <View
                      style={{
                        // flexDirection: "row",
                        position: "absolute",
                        height: (width - 60) / 3,
                        width: (width - 60) / 3,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        justifyContent: "flex-end",
                        //   borderRadius: 5,
                        borderRadius: 3,

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
                  </View>
                ) : (
                  <View
                    style={{
                      flex: 1,
                      borderRadius: 3,
                    }}
                  >
                    <FunImage
                      size="m"
                      source={
                        item.media[1] ? { uri: item.media[1].filepath } : Emptys
                      }
                      style={{
                        //   marginRight: 2,
                        borderRadius: 3,

                        height: (width - 60) / 3,
                        width: (width - 60) / 3,
                        resizeMode: "cover",
                      }}
                    />
                  </View>
                )}
                {item.media[2] && item.media[2].type == "video" ? (
                  <View
                    style={{
                      flex: 1,
                      marginHorizontal: 3,
                    }}
                  >
                    <FunVideo
                      poster={item.media[2].filepath.replace(
                        "output.m3u8",
                        "thumbnail.png"
                      )}
                      posterResizeMode={"cover"}
                      paused={true}
                      key={"posted" + index + item.id}
                      source={{
                        uri: item.media[2].filepath,
                      }}
                      muted={true}
                      // defaultSource={default_image}
                      resizeMode="cover"
                      style={{
                        height: (width - 60) / 3,
                        width: (width - 60) / 3,
                        backgroundColor: "#fff",
                        borderRadius: 3,
                      }}
                    />
                    <View
                      style={{
                        position: "absolute",
                        height: (width - 60) / 3,
                        width: (width - 60) / 3,
                        backgroundColor: "rgba(0,0,0,0.4)",
                        justifyContent: "flex-end",
                        borderRadius: 3,
                      }}
                    >
                      <PlayVideo
                        width={15}
                        height={15}
                        style={{ margin: 10 }}
                      />
                    </View>
                  </View>
                ) : (
                  <View
                    style={{
                      flex: 1,
                      marginHorizontal: 3,
                    }}
                  >
                    <FunImage
                      source={
                        item.media[2] ? { uri: item.media[2].filepath } : Emptys
                      }
                      style={{
                        height: (width - 60) / 3,
                        width: (width - 60) / 3,
                        resizeMode: "cover",
                        borderRadius: 3,
                      }}
                    />
                  </View>
                )}
                {item.media[3] && item.media[3].type == "video" ? (
                  <View
                    style={{
                      flex: 1,
                      // borderWidth: 1,
                      // margin: 1,
                    }}
                  >
                    <FunVideo
                      poster={item.media[2].filepath.replace(
                        "output.m3u8",
                        "thumbnail.png"
                      )}
                      posterResizeMode={"cover"}
                      paused={true}
                      key={"posted" + index + item.id}
                      source={{
                        uri: item.media[3].filepath,
                      }}
                      muted={true}
                      resizeMode="cover"
                      style={{
                        height: (width - 60) / 3,
                        width: (width - 60) / 3,
                        backgroundColor: "#fff",
                        borderRadius: 3,
                      }}
                    />
                    <View
                      style={{
                        // flexDirection: "row",
                        position: "absolute",
                        height: (width - 60) / 3,
                        width: (width - 60) / 3,
                        //   backgroundColor: "rgba(0,0,0,0.4)",
                        justifyContent: "flex-end",
                        borderRadius: 3,

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
                    <View
                      style={{
                        position: "absolute",
                        height: (width - 60) / 3,
                        width: (width - 60) / 3,
                        backgroundColor: "rgba(255,255,255,0.85)",
                        alignContent: "center",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 3,
                      }}
                    >
                      <Text>{t("viewAll")}</Text>
                    </View>
                  </View>
                ) : (
                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    <ImageBackground
                      source={
                        item.media[3] ? { uri: item.media[3].filepath } : Emptys
                      }
                      style={{
                        //   marginRight: 2,
                        height: (width - 60) / 3,
                        width: (width - 60) / 3,
                        // resizeMode: 'cover',
                        alignContent: "center",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      imageStyle={{
                        // marginRight: 2,
                        height: (width - 60) / 3,
                        width: (width - 60) / 3,
                        resizeMode: "cover",
                      }}
                    >
                      <View
                        style={{
                          height: "100%",
                          width: "100%",
                          backgroundColor: "rgba(255,255,255,0.85)",
                          alignContent: "center",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text>{t("viewAll")}</Text>
                      </View>
                    </ImageBackground>
                  </View>
                )}
              </View>
            </Pressable>
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
                  props.navigation.navigate("FeedStack", {
                    screen: "Post",
                    params: {
                      id_album: item.id,
                      id_itin: dataalbum.itinerary_album_list_v2.id,
                      title_album: item.title,
                      // token: token,
                      // ratio: {
                      //   width: 1,
                      //   height: 1,
                      //   index: 0,
                      //   label: "S",
                      // },
                      // type: "image",
                      album: "Itinerary",
                    },
                  });
                }}
                type="circle"
                style={{ borderRadius: 5, height: 60, width: 60 }}
                color="tertiary"
              >
                <Pluswhite height={30} width={30} />
              </Button>
              <Text style={{ marginHorizontal: 20 }}>Upload Photos</Text>
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
              <Text>{t("noPhotos")}</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const getdate = (start, end) => {
    start = start.split(" ");
    end = end.split(" ");

    return dateFormats(start[0]) + " - " + dateFormats(end[0]);
  };

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          backgroundColor: "white",
          //   paddingTop: 5,
          marginBottom: 10,
          paddingHorizontal: 20,
          flexDirection: "row",
          paddingVertical: 15,
          // borderBottomWidth: 1,
          borderBottomColor: "#d1d1d1",
          justifyContent: "space-between",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <View style={{ width: "70%" }}>
          <Text type={"bold"} size="label" numberOfLines={1}>
            {dataalbum && dataalbum.itinerary_album_list_v2
              ? dataalbum.itinerary_album_list_v2.name
              : ""}
          </Text>
          {/* <Text>Itinerary photo album</Text> */}
        </View>
        <Pressable
          onPress={
            () =>
              props.navigation.push("ItineraryStack", {
                screen: "itindetail",
                params: {
                  itintitle: dataalbum?.itinerary_album_list_v2?.name,
                  country: dataalbum?.itinerary_album_list_v2?.id,
                  dateitin: getdate(
                    dataalbum?.itinerary_album_list_v2?.start_date,
                    dataalbum?.itinerary_album_list_v2?.end_date
                  ),
                  token: token,
                  status: "favorite",
                },
              })
            // shareAction({ from: "itinerary", target: iditinerary })
          }
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            type="bold"
            style={{
              color: "#209fae",
              // marginVertical: 2,
            }}
          >
            {t("viewTrip")}
          </Text>
          <Nextpremier
            width={12}
            height={12}
            style={{
              marginTop: 3,
            }}
          />
        </Pressable>
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
        }}
      >
        {dataalbum &&
        dataalbum.itinerary_album_list_v2 &&
        dataalbum.itinerary_album_list_v2.album.length > 0 ? (
          <FlatList
            data={dataalbum.itinerary_album_list_v2.album}
            renderItem={({ item, index }) => (
              <RenderAlbum item={item} index={index} />
            )}
            contentContainerStyle={{
              backgroundColor: "#fff",
              // flex: 1,
            }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        ) : (
          <Text
            type="bold"
            style={{
              alignSelf: "center",
              marginVertical: 20,
            }}
          >
            {t("noData")}
          </Text>
        )}
      </View>

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
    </View>
  );
}
