import React, { useState, useEffect, useRef } from "react";
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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { default_image } from "../../../assets/png";
import { Text, Button, Loading, StatusBar, FunImage } from "../../../component";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import AutoHeightImage from "react-native-auto-height-image";
import Account from "../../../graphQL/Query/Home/Account";
import LocationSelector from "./LocationSelector";
import Album from "./Album";
import { PinHijau, Xgray, Arrowbackwhite } from "../../../assets/svg";
import Ripple from "react-native-material-ripple";
import { ScrollView } from "react-native-gesture-handler";
import Geolocation from "react-native-geolocation-service";
import Video from "react-native-video";
import { request, check, PERMISSIONS } from "react-native-permissions";
import { ReactNativeFile } from "apollo-upload-client";

const PostMut = gql`
  mutation(
    $caption: String
    $latitude: String
    $longitude: String
    $location_name: String
    $type: String
    $assets: Upload!
  ) {
    create_post(
      input: {
        caption: $caption
        latitude: $latitude
        longitude: $longitude
        location_name: $location_name
        type: $type
        assets: $assets
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
export default function CreatePost({ navigation, route }) {
  let [statusText, setStatusText] = useState("");
  let [modellocation, setModellocation] = useState(false);
  let [modalAlbum, setModalAlbum] = useState(false);
  let [Location, setLocation] = useState({
    address: "Add Location",
    latitude: "",
    longitude: "",
  });
  let [loadingok, setLoading] = useState(false);
  let [chosenFile] = useState(route.params.file);
  const [token, setToken] = useState(null);
  const [datanearby, setDataNearby] = useState([]);
  let videoView = useRef(null);

  const [MutationCreate, { loading, data, error }] = useMutation(PostMut, {
    context: {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    },
  });

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
    setLoading(true);
    let caption = statusText ? statusText : "-";
    let latitude = Location.latitude !== "" ? Location.latitude : "0";
    let longitude = Location.longitude !== "" ? Location.longitude : "0";
    let location_name =
      Location.address == "" || Location.address == "Add Location"
        ? "0"
        : Location.address;

    let assets = null;
    if (route.params.type === "video") {
      assets = new ReactNativeFile({
        uri: chosenFile.uri,
        type: `video/${chosenFile.filename.substring(
          chosenFile.filename.length - 3
        )}`,
        name: chosenFile.filename,
      });
    } else {
      assets = new ReactNativeFile({
        uri: chosenFile.path,
        type: chosenFile.mime,
        name: "image.jpeg",
      });
    }

    try {
      let response = await MutationCreate({
        variables: {
          caption: caption,
          latitude: latitude,
          longitude: longitude,
          location_name: location_name,
          type: route.params.type,
          assets,
        },
      });
      if (response.data) {
        if (response.data.create_post.code === 200) {
          setLoading(false);
          navigation.navigate("BottomStack", {
            screen: "FeedScreen",
            params: {
              isposting: true,
            },
          });
        } else {
          setLoading(false);
          throw new Error(response.data.create_post.message);
        }
      } else {
        throw new Error("Error Input");
      }
    } catch (err) {
      console.log(error);
      setLoading(false);
      Alert.alert("" + err);
    }
  };

  const _selectLocation = (value) => {
    console.log(value.latitude);
    setLocation({
      address: value.name,
      latitude: value.latitude,
      longitude: value.longitude,
    });
    wait(1000).then(() => {
      navigation.setParams({
        SubmitData: SubmitData,
        text: statusText,
        location: {
          address: value.name,
          latitude: value.latitude,
          longitude: value.longitude,
        },
      });
    });
  };
  const clearLoaction = () => {
    setLocation({
      address: "Add Location",
      latitude: "",
      longitude: "",
    });
  };

  const loadAsync = async () => {
    let access_token = await AsyncStorage.getItem("access_token");
    setToken(access_token);
    LoadUserProfile();
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
            timeout: 8000,
            maximumAge: 10000,
          }
        );
      }
    })();
    // navigation.setOptions(HeaderComponent);
    loadAsync();
  }, []);

  const _nearbyLocation = async (position) => {
    let latitude =
      route.params.location && route.params.location.latitude
        ? route.params.location.latitude
        : position.coords.latitude;
    let longitude =
      route.params.location && route.params.location.longitude
        ? route.params.location.longitude
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
      // console.log(responseJson.results);
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
        // console.log(nearby);
        setLoading(false);
      } else {
        setLoading(false);
        // Alert.alert('Data Kosong');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      keyboardVerticalOffset={65}
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
            onPress={() => navigation.goBack()}
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
        <ScrollView style={{}}>
          <Loading show={loadingok} />
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
              {route.params.type === "video" ? (
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
                  onBuffer={videoView?.current?.onBuffer}
                  onError={videoView?.current?.videoError}
                  style={{
                    width: width,
                    height: width,
                  }}
                  resizeMode="cover"
                />
              ) : (
                <AutoHeightImage
                  width={Dimensions.get("screen").width}
                  source={
                    chosenFile && chosenFile.path
                      ? {
                          uri: chosenFile.path,
                        }
                      : default_image
                  }
                />
              )}
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: "#ffffff",
                  borderBottomColor: "#f0f0f0f0",
                  borderBottomWidth: 1,
                }}
              >
                <FunImage
                  source={
                    dataprofile &&
                    (dataprofile.user_profile !== undefined || null || "")
                      ? {
                          uri: dataprofile.user_profile.picture,
                        }
                      : { uri: default_image }
                  }
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 50,
                    margin: 10,
                    marginRight: 15,
                  }}
                />
                <TextInput
                  multiline
                  placeholder={"Write a caption.."}
                  maxLength={1000}
                  style={
                    Platform.OS == "ios"
                      ? {
                          height: 75,
                          width: Dimensions.get("screen").width - 100,
                          maxHeight: 100,
                          marginVertical: 5,
                          marginHorizontal: 10,
                          paddingTop: 10,
                        }
                      : {
                          height: 75,
                          width: Dimensions.get("screen").width - 100,
                        }
                  }
                  onChangeText={(text) => _setStatusText(text)}
                  value={statusText}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 10,
                  marginHorizontal: 15,
                }}
              >
                <Ripple
                  onPress={() => setModalAlbum(true)}
                  style={{
                    flexDirection: "row",

                    alignItems: "center",
                  }}
                >
                  <Text
                    type="bold"
                    size="description"
                    style={{
                      marginHorizontal: 5,
                    }}
                  >
                    {/* {Location.address} */}
                    Add Album
                  </Text>
                </Ripple>
                {Location.latitude !== "" ? (
                  <Ripple
                    onPress={() => clearLoaction()}
                    style={{
                      padding: 5,
                    }}
                  >
                    <Xgray height={15} width={15} />
                  </Ripple>
                ) : null}
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 10,
                  marginHorizontal: 15,
                }}
              >
                <Ripple
                  onPress={() => setModellocation(true)}
                  style={{
                    flexDirection: "row",
                    borderRadius: 5,
                    alignItems: "center",
                  }}
                >
                  {Location.latitude !== "" ? (
                    <PinHijau height={15} width={15} />
                  ) : null}
                  <Text
                    type="bold"
                    size="description"
                    style={{
                      marginHorizontal: 5,
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
                    }}
                  >
                    <Xgray height={15} width={15} />
                  </Ripple>
                ) : null}
              </View>
              <View
                style={{
                  borderBottomColor: "#E1E1E1",
                  borderBottomWidth: 1,
                  width: 150,
                  margin: 10,
                }}
              ></View>
              <View
                style={{
                  width: "100%",
                  flexWrap: "wrap",
                  flexDirection: "row",
                  paddingHorizontal: 10,
                }}
              >
                {datanearby.map((value, index) => {
                  return index < 5 ? (
                    <Button
                      onPress={() => _selectLocation(value)}
                      type="box"
                      variant="bordered"
                      color="primary"
                      size="small"
                      style={{
                        marginHorizontal: 2,
                        marginVertical: 2,
                      }}
                      text={value.name}
                    ></Button>
                  ) : null;
                })}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
        <LocationSelector
          modals={modellocation}
          setModellocation={(e) => setModellocation(e)}
          masukan={(e) => _setLocation(e)}
        />
        <Album
          modals={modalAlbum}
          setModalAlbum={(e) => setModalAlbum(e)}
          // masukan={(e) => _setLocation(e)}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
