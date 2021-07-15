import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Image,
  SafeAreaView,
  Pressable,
  FlatList,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { default_image } from "../../../assets/png";
import { Text, Button, Loading, StatusBar, FunImage } from "../../../component";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import AutoHeightImage from "react-native-auto-height-image";
import Account from "../../../graphQL/Query/Home/Account";
import LocationSelector from "./LocationSelector";
import { StackActions } from "@react-navigation/routers";
import {
  PinHijau,
  Xgray,
  Arrowbackwhite,
  Xgrey,
  AlbumFeedBiru,
} from "../../../assets/svg";
import Ripple from "react-native-material-ripple";
import { ScrollView } from "react-native-gesture-handler";
import Geolocation from "react-native-geolocation-service";
import Video from "react-native-video";
import { request, check, PERMISSIONS } from "react-native-permissions";
import { ReactNativeFile } from "apollo-upload-client";
import { useTranslation } from "react-i18next";
import CreateAlbum from "./CreateAlbum";
import { RNToasty } from "react-native-toasty";
import DashedLine from "react-native-dashed-line";
import { useIsFocused } from "@react-navigation/native";

const PostMut = gql`
  mutation(
    $assets: [Upload]!
    $caption: String
    $latitude: String
    $longitude: String
    $location_name: String
    $albums_id: ID
    $itinerary_id: ID
    $day_id: ID
    $oriented: String
  ) {
    create_post(
      input: {
        assets: $assets
        caption: $caption
        latitude: $latitude
        longitude: $longitude
        location_name: $location_name
        albums_id: $albums_id
        itinerary_id: $itinerary_id
        day_id: $day_id
        oriented: $oriented
      }
    ) {
      id
      response_time
      message
      code
    }
  }
`;

const { width, height } = Dimensions.get("screen");

export default function CreatePost(props) {
  const isFocused = useIsFocused();
  const [token, setToken] = useState(props?.route.params.token);
  const [datanearby, setDataNearby] = useState([]);
  const { t } = useTranslation();
  const [Img, setImg] = useState("");
  let [statusText, setStatusText] = useState("");
  let [modellocation, setModellocation] = useState(false);
  let [setting, setSetting] = useState();
  let [modalCreate, setModalCreate] = useState(false);
  let [modalAlbum, setModalAlbum] = useState(false);
  let [idAlbums, setIdAlbums] = useState({});
  let [idItin, setIdItin] = useState({});
  let [loadingok, setLoading] = useState(false);
  let [chosenFile] = useState(props?.route.params.file);
  let videoView = useRef(null);
  let [album, setAlbum] = useState("");

  let [Location, setLocation] = useState({
    address: t("addLocation"),
    latitude: "",
    longitude: "",
  });

  const [MutationCreate, { loading, data, error }] = useMutation(PostMut, {
    context: {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const [refreshing, setRefreshing] = useState(false);
  const Refresh = React.useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => {
      setRefreshing(false);
    });
  }, []);

  const [
    LoadUserProfile,
    {
      data: dataprofile,
      loading: loadingprofile,
      error: errorprofile,
      refetch,
    },
  ] = useLazyQuery(Account, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });
  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };
  const _setStatusText = (data) => {
    setStatusText(data);
  };

  const _setLocation = (data) => {
    setLocation(data);
  };

  const SubmitData = async () => {
    console.log("submit");
    let caption = statusText ? statusText : "-";
    let latitude = Location.latitude !== "" ? Location.latitude : "0";
    let longitude = Location.longitude !== "" ? Location.longitude : "0";
    let location_name =
      Location.address == "" || Location.address == t("addLocation")
        ? "0"
        : Location.address;
    let albums_id = idAlbums ? idAlbums : null;
    let itinerary_id = idItin ? idItin : null;
    let day_id = null;
    let oriented = props?.route?.params?.ratio?.label
      ? props?.route?.params?.ratio?.label
      : "S";
    let assets = [];
    if (props?.route.params.type === "video") {
      const data = new ReactNativeFile({
        uri: chosenFile.uri,
        type: `video/${chosenFile.filename.substring(
          chosenFile.filename.length - 3
        )}`,
        name: chosenFile.filename,
      });
      assets.push(data);
    } else if (props?.route.params.type === "image") {
      const data = new ReactNativeFile({
        uri: chosenFile.path,
        type: chosenFile.mime,
        name: "image.jpeg",
      });
      assets.push(data);
    } else {
      chosenFile.map((item, index) => {
        let typeMedia = item?.node?.type?.split("/");
        let typeExt = item?.node?.image?.filename.split(".");
        if (typeMedia[0] === "video") {
          const data = new ReactNativeFile({
            uri: item?.node?.image?.uri,
            type: `video/${typeExt[typeExt.length - 1]}`,
            name: item?.node?.image?.filename,
          });
          assets.push(data);
        } else {
          const data = new ReactNativeFile({
            uri: item?.node?.image?.uri,
            type: item?.node?.type,
            name: "image.jpeg",
          });
          assets.push(data);
        }
      });
    }

    props.navigation.navigate("BottomStack", {
      screen: "FeedBottomScreen",
      params: {
        screen: "FeedScreen",
        params: {
          isPost: true,
          caption: caption,
          latitude: latitude,
          longitude: longitude,
          location_name: location_name,
          albums_id: albums_id,
          itinerary_id: itinerary_id,
          day_id: day_id,
          oriented: oriented,
          assets: assets,
        },
      },
    });
  };

  const _selectLocation = (value) => {
    setLocation({
      address: value.name,
      latitude: value.latitude,
      longitude: value.longitude,
    });
  };

  const clearLoaction = () => {
    setLocation({
      address: t("addLocation"),
      latitude: "",
      longitude: "",
    });
  };

  const loadAsync = async () => {
    let access_token = await AsyncStorage.getItem("access_token");
    setToken(access_token);
    LoadUserProfile();

    let setsetting = await AsyncStorage.getItem("setting");
    await setSetting(JSON.parse(setsetting));
  };

  useEffect(() => {
    (async () => {
      let granted = false;
      if (Platform.OS == "ios") {
        let sLocation = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        if (sLocation === "denied") {
          granted = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        } else {
          granted = true;
        }
      } else {
        let sLocation = await check(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION);
        if (sLocation === "denied") {
          granted = await request(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION);
        } else {
          granted = true;
        }
      }
      if (granted) {
        await Geolocation.getCurrentPosition(
          (position) => _nearbyLocation(position),
          (err) => console.log(err),
          {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 10000,
          }
        );
      }
    })();
    setAlbum(props.route.params.album);
    setIdAlbums(props.route.params.id_album);
    setIdItin(props.route.params.id_itin);
    // props?.navigation.setOptions(HeaderComponent);
    loadAsync();
  }, [props.route.params]);

  const _nearbyLocation = async (position) => {
    let latitude =
      props?.route.params.location && props?.route.params.location.latitude
        ? props?.route.params.location.latitude
        : position.coords.latitude;
    let longitude =
      props?.route.params.location && props?.route.params.location.longitude
        ? props?.route.params.location.longitude
        : position.coords.longitude;

    try {
      let response = await fetch(
        "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" +
          latitude +
          "," +
          longitude +
          "&radius=500&key=AIzaSyD4qyD449yZQ2_7AbdnUvn9PpAxCZ4wZEg",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            // Authorization: 'Bearer ' + token,
            "Content-Type": "application/json",
          },
          // body: 'originLocationCode=SYD&destinationLocationCode=BKK',
        }
      );
      let responseJson = await response.json();
      if (responseJson.results && responseJson.results.length > 0) {
        let nearby = [];
        for (var i of responseJson.results) {
          let data = {
            place_id: i.place_id,
            name: i.name,
            latitude: i.geometry?.location.lat,
            longitude: i.geometry?.location.lng,
            address: i.vicinity,
            icon: i.icon,
          };
          nearby.push(data);
        }
        setDataNearby(nearby);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [time, setTime] = useState(false);

  const durationTime = (data) => {
    data.currentTime < 60.0 ? setTime(false) : setTime(true);
  };

  const L = (2 / 3) * Dimensions.get("screen").width;
  const P = (5 / 4) * Dimensions.get("screen").width;
  const S = Dimensions.get("screen").width;

  // console.log("propss ", props.route.params);
  // console.log("orinted ", oriented);

  const ReviewResult = () => {
    if (props?.route.params.type === "video") {
      return (
        <Video
          source={{
            uri:
              Platform.OS === "ios"
                ? `assets-library://asset/asset.${chosenFile.filename.substring(
                    chosenFile.filename.length - 3
                  )}?id=${chosenFile.uri.substring(
                    5,
                    41
                  )}&ext=${chosenFile.filename.substring(
                    chosenFile.filename.length - 3
                  )}`
                : chosenFile.uri,
          }}
          ref={(ref) => {
            videoView = ref;
          }}
          onProgress={durationTime}
          paused={isFocused ? false : true}
          repeat={time ? true : false}
          onBuffer={videoView?.current?.onBuffer}
          onError={videoView?.current?.videoError}
          style={{
            width: width,
            height:
              props?.route?.params?.ratio?.label == "L"
                ? L
                : props?.route?.params?.ratio?.label == "P"
                ? P
                : S,
          }}
          resizeMode="cover"
        />
      );
    } else if (props?.route.params.type === "image") {
      return (
        <AutoHeightImage
          width={Dimensions.get("screen").width}
          height={
            props?.route?.params?.ratio?.label == "L"
              ? L
              : props?.route?.params?.ratio?.label == "P"
              ? P
              : S
          }
          source={
            chosenFile && chosenFile.path
              ? {
                  uri: chosenFile.path,
                }
              : default_image
          }
        />
      );
    } else {
      return (
        <>
          <AutoHeightImage
            resizeMode="cover"
            style={{
              marginVertical: 10,
              borderRadius: 10,
              marginHorizontal: 10,
              width: Dimensions.get("screen").width - 20,
              height:
                props.route.params.ratio.label == "L"
                  ? L
                  : props.route.params.ratio.label == "P"
                  ? P
                  : S,
            }}
            source={Img ? { uri: Img } : default_image}
          />
          <FlatList
            onLayout={() => setImg(chosenFile[0].node.image.uri)}
            data={chosenFile}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 10,
            }}
            renderItem={(item, index) => (
              <TouchableOpacity
                onPress={() => setImg(item.item.node.image.uri)}
              >
                <AutoHeightImage
                  width={Dimensions.get("screen").width / 5}
                  style={{
                    marginRight: 5,
                    borderRadius: 5,
                    height: 80,
                    width: Dimensions.get("screen").width / 5,
                  }}
                  source={
                    item.item.node.image.uri && item.item.node.image.uri
                      ? {
                          uri: item.item.node.image.uri,
                        }
                      : default_image
                  }
                />
              </TouchableOpacity>
            )}
          />
        </>
      );
    }
  };

  return (
    <KeyboardAvoidingView
      // behavior={Platform.OS == "ios" ? null : null}
      // keyboardVerticalOffset={100}
      style={{ flex: 1, backgroundColor: "#FFFFFF" }}
    >
      <StatusBar backgroundColor="#209FAE" barStyle="light-content" />
      <View>
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
          <Button
            onPress={() => {
              props?.navigation.goBack();
              setIdAlbums("");
              setAlbum("");
            }}
            type="circle"
            variant="transparent"
          >
            <Arrowbackwhite height={20} width={20} />
          </Button>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
              alignContent: "center",
              height: 55,
            }}
          >
            <Button size="medium" text="Post" onPress={() => SubmitData()} />
          </View>
        </View>
        <ScrollView
          style={{ marginBottom: 90 }}
          showsVerticalScrollIndicator={false}
        >
          <Loading show={loadingok} />
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
              {ReviewResult()}
              <KeyboardAvoidingView
                style={{
                  flexDirection: "row",
                  backgroundColor: "#ffffff",
                  alignItems: "center",
                }}
              >
                <FunImage
                  source={
                    dataprofile &&
                    (dataprofile.user_profile !== undefined ||
                      dataprofile.user_profile !== null ||
                      dataprofile.user_profile !== "")
                      ? {
                          uri: dataprofile.user_profile.picture,
                        }
                      : default_image
                  }
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 50,
                    margin: 10,
                    marginRight: 15,
                  }}
                />
                <View
                  style={{
                    backgroundColor: "#f6f6f6",
                    width: "77%",
                    maxHeight: 60,
                    minHeight: 30,
                    borderRadius: 5,
                    paddingHorizontal: 10,
                  }}
                >
                  <TextInput
                    multiline
                    placeholder={`${t("writeACaption")}...`}
                    maxLength={1000}
                    placeholderStyle={{ fontSize: 30 }}
                    onChangeText={(text) => _setStatusText(text)}
                    onSubmitEditing={(text) => _setStatusText(text)}
                    value={statusText}
                    style={{
                      borderWidth: 0,
                      width: "100%",
                    }}
                  />
                </View>
              </KeyboardAvoidingView>
              <View
                style={{
                  marginHorizontal: 15,
                  paddingVertical: 5,
                  borderBottomWidth: 1,
                  borderColor: "#D1D1D1",
                }}
              >
                <TouchableHighlight
                  activeOpacity={0.6}
                  underlayColor="#FFF"
                  onPress={() => {
                    album
                      ? null
                      : props.navigation.navigate("FeedStack", {
                          screen: "CreateListAlbum",
                          params: {
                            user_id: setting?.user_id,
                            token: token,
                            file: props.route.params.file,
                            type: props.route.params.type,
                            location: props.route.params.location,
                            isAlbum: false,
                          },
                        });
                  }}
                  style={{
                    width: "100%",
                    borderRadius: 5,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      width: "100%",
                      borderRadius: 5,
                    }}
                  >
                    <AlbumFeedBiru height={18} width={18} />
                    <Text
                      type="bold"
                      size="description"
                      style={{
                        marginHorizontal: 5,
                        marginTop: album ? 0 : 10,
                        marginBottom: album ? 0 : 10,
                      }}
                    >
                      {t("addAlbum")}
                    </Text>
                  </View>
                </TouchableHighlight>
                {album ? (
                  <View
                    style={{
                      justifyContent: "space-between",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                      }}
                    >
                      <Text
                        numberOfLines={1}
                        type="regular"
                        size="description"
                        style={{
                          marginHorizontal: 5,
                          marginVertical: 10,
                        }}
                      >
                        {album + " Album " + "-"}{" "}
                        {props?.route?.params?.title_album
                          ? props?.route?.params?.title_album
                          : null}
                      </Text>
                    </View>
                    <Xgrey
                      style={{
                        marginRight: 5,
                      }}
                      height="20"
                      width="20"
                      onPress={() => {
                        setAlbum("");
                        setIdAlbums("");
                      }}
                    />
                  </View>
                ) : null}
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginHorizontal: 15,
                  paddingVertical: 5,
                  borderBottomWidth: 1,
                  borderColor: "#D1D1D1",
                }}
              >
                <Ripple
                  onPress={() => setModellocation(true)}
                  style={{
                    flexDirection: "row",
                    borderRadius: 5,
                    width: "92%",
                    alignItems: "center",
                    alignItems: "center",
                  }}
                >
                  <PinHijau height={15} width={15} />
                  <Text
                    type="bold"
                    size="description"
                    style={{
                      marginHorizontal: 5,
                      marginVertical: 10,
                    }}
                  >
                    {Location.address}
                  </Text>
                </Ripple>
                {Location.latitude !== "" ? (
                  <Ripple
                    onPress={() => clearLoaction()}
                    style={{
                      padding: 5,
                      borderRadius: 10,
                    }}
                  >
                    <Xgrey height={20} width={20} />
                  </Ripple>
                ) : null}
              </View>
              <View
                style={{
                  width: "100%",
                  flexWrap: "wrap",
                  flexDirection: "row",
                  paddingHorizontal: 15,
                  // borderWidth: 1,
                }}
              >
                {Location.latitude === ""
                  ? datanearby.map((value, index) => {
                      return index < 5 ? (
                        <View
                          key={index}
                          style={{
                            width: "100%",
                            height: 50,
                          }}
                        >
                          <Pressable
                            // key={index}
                            onPress={() => _selectLocation(value)}
                            style={{
                              width: "100%",
                              height: "100%",
                              flexDirection: "row",
                              alignItems: "center",
                              // borderColor: "#e1e1e1",
                              // borderBottomWidth: 1,
                              // borderStyle: "dotted",
                              // borderColor: "#209fae",
                              // borderRadius: 5,
                            }}
                          >
                            <PinHijau
                              height={15}
                              width={15}
                              style={{
                                marginLeft: 15,
                              }}
                            />
                            <Text
                              size="description"
                              type="light"
                              style={{
                                marginLeft: 10,
                              }}
                            >
                              {value.name}
                            </Text>
                          </Pressable>
                          <DashedLine
                            dashColor="#e1e1e1"
                            dashThickness={1}
                            dashGap={2}
                            // dashStyle={{ borderRadius: 25 }}
                          />
                        </View>
                      ) : null;
                    })
                  : null}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
        <LocationSelector
          modals={modellocation}
          setModellocation={(e) => setModellocation(e)}
          masukan={(e) => _setLocation(e)}
        />
        {/* <CreateAlbum
          modalAlbum={modalAlbum}
          setModalAlbum={(e) => setModalAlbum(e)}
          user_id={setting?.user_id}
          props={props?.navigation}
          setAlbum={(e) => setAlbum(e)}
          token={token}
          setIdAlbums={(e) => setIdAlbums(e)}
        /> */}
      </View>
    </KeyboardAvoidingView>
  );
}
