import React, { useState, useEffect } from "react";
import {
  View,
  ImageBackground,
  Dimensions,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";
import { AsyncStorage } from "react-native";
import { default_image } from "../../../const/Png";
import { CustomImage } from "../../../core-ui";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import AutoHeightImage from "react-native-auto-height-image";
import { back_arrow_white } from "../../../const/Png";
import Account from "../../../graphQL/Query/Home/Account";
import LocationSelector from "./LocationSelector";
import { NavigationEvents } from "react-navigation";
import * as Permissions from "expo-permissions";

import Loading from "../Loading";
import {
  Arrowbackwhite,
  Xhitam,
  Pointmapblack,
  Pointmapgray,
  Pointmaprecent,
  OptionsVertWhite,
  Search,
  PinHijau,
  Xgray,
} from "../../../const/Svg";
import { Text, Button } from "../../../Component";
import Ripple from "react-native-material-ripple";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import Geolocation from "react-native-geolocation-service";
const PostMut = gql`
  mutation(
    $caption: String
    $latitude: String
    $longitude: String
    $location_name: String
    $assets: String!
  ) {
    create_post(
      input: {
        caption: $caption
        latitude: $latitude
        longitude: $longitude
        location_name: $location_name
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

export default function CreatePost(props) {
  let [statusText, setStatusText] = useState("");
  let [modellocation, setModellocation] = useState(false);
  let [Location, setLocation] = useState({
    address: "Add Location",
    latitude: "",
    longitude: "",
  });
  let [loadingok, setLoading] = useState(false);
  const chosenPicture = props.navigation.getParam("file");
  const [token, setToken] = useState(null);
  const [datanearby, setDataNearby] = useState([]);
  const [MutationCreate, { loading, data, error }] = useMutation(PostMut, {
    context: {
      headers: {
        "Content-Type": "application/json",
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
    props.navigation.setParams({
      SubmitData: SubmitData,
      location: Location,
      text: data,
    });
    wait(1000).then(() => {
      props.navigation.setParams({
        SubmitData: SubmitData,
        location: Location,
        text: data,
      });
    });

    // props.navigation.getParam('setText');
  };
  const _setLocation = (data) => {
    props.navigation.setParams({
      SubmitData: SubmitData,
      text: statusText,
      location: data,
    });
    setLocation(data);

    wait(1000).then(() => {
      props.navigation.setParams({
        SubmitData: SubmitData,
        text: statusText,
        location: data,
      });
    });
  };
  // console.log(chosenPicture.base64);
  const SubmitData = async (text, location) => {
    // return false;
    setLoading(true);
    let caption = text ? text : "-";
    let latitude = location.latitude !== "" ? location.latitude : "0";
    let longitude = location.longitude !== "" ? location.longitude : "0";
    let location_name =
      location.address == "" || location.address == "Add Location"
        ? "0"
        : location.address;
    // console.log(caption);
    try {
      let response = await MutationCreate({
        variables: {
          caption: caption,
          latitude: latitude,
          longitude: longitude,
          location_name: location_name,
          assets: "data:image/png;base64," + chosenPicture.base64,
        },
      });
      if (response.data) {
        if (response.data.create_post.code === 200) {
          // console.log('ok');
          setLoading(false);
          props.navigation.navigate("Feed");
        } else {
          // console.log('error');
          setLoading(false);
          throw new Error(response.data.create_post.message);
        }

        // Alert.alert('Succes');
      } else {
        throw new Error("Error Input");
      }
    } catch (error) {
      // console.log(error);
      setLoading(false);
      Alert.alert("" + error);
    }
  };
  // const submit = () => {
  // 	SubmitData();
  // 	// console.log('fungsi', props.navigation.getParam('SubmitData'));
  // 	// props.navigation.getParam('SubmitData');
  // };

  const _selectLocation = (value) => {
    console.log(value.latitude);
    setLocation({
      address: value.name,
      latitude: value.latitude,
      longitude: value.longitude,
    });
    wait(1000).then(() => {
      props.navigation.setParams({
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
    // console.log(detail);
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
      const { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status === "granted") {
        // console.log('status', status);
        await Geolocation.getCurrentPosition(
          (position) => _nearbyLocation(position),
          (err) => console.log(err),
          { enableHighAccuracy: false, timeout: 8000, maximumAge: 10000 }
        );
      }
    })();
    loadAsync();
    props.navigation.setParams({
      SubmitData: SubmitData,
      location: Location,
      text: statusText,
    });
  }, []);

  const _requestLocation = async () => {};

  const _nearbyLocation = async (position) => {
    // console.log(position.coords.latitude);
    try {
      let response = await fetch(
        "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" +
          position.coords.latitude +
          "," +
          position.coords.longitude +
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
      behavior={Platform.OS === "ios" ? "padding" : null}
      style={{ flex: 1 }}
    >
      <ScrollView style={{}}>
        <Loading show={loadingok} />
        <NavigationEvents
          onDidFocus={() =>
            props.navigation.setParams({
              SubmitData: SubmitData,
              location: Location,
              text: statusText,
            })
          }
        />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            style={
              {
                // flex: 1,
                // justifyContent: 'flex-start',
              }
            }
          >
            {/* <View
							style={{
								// height: Dimensions.get('screen').width,
								width: Dimensions.get('screen').width,
								// Height: Dimensions.get('screen').width,
								height: Dimensions.get('screen').width,
								backgroundColor: 'white',
								justifyContent: 'center',
							}}> */}
            <AutoHeightImage
              width={Dimensions.get("window").width}
              source={
                chosenPicture && chosenPicture.uri
                  ? {
                      uri: chosenPicture.base64
                        ? "data:image/gif;base64," + chosenPicture.base64
                        : chosenPicture.uri,
                    }
                  : default_image
              }
            />
            {/* </View> */}

            <View
              style={{
                flexDirection: "row",
                marginTop: 25,
                backgroundColor: "#ffffff",
                borderBottomColor: "#f0f0f0f0",
                borderBottomWidth: 1,
                // height: Dimensions.get('screen').height / 3,
              }}
            >
              <Image
                source={
                  dataprofile &&
                  (dataprofile.user_profile !== undefined || null || "")
                    ? { uri: dataprofile.user_profile.picture }
                    : default_image
                }
                style={{
                  width: 50,
                  height: 50,
                  // padding: 10,
                  borderRadius: 50,
                  margin: 10,
                  marginRight: 15,
                }}
              />
              <TextInput
                multiline
                placeholder={"Write a caption.."}
                maxLength={255}
                style={{
                  height: 75,
                  width: Dimensions.get("screen").width - 100,
                  // borderBottomColor: '#f0f0f0f0',
                  // borderWidth: 1,
                }}
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
                onPress={() => setModellocation(true)}
                style={{
                  flexDirection: "row",

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
            {/* <FlatList
							data={datanearby}
							style={{
								marginHorizontal: 10,
							}}
							renderItem={({ item, index }) => (
								<Button
									type='box'
									variant='bordered'
									color='primary'
									size='small'
									style={{
										marginHorizontal: 2,
									}}
									text={item.name}></Button>
							)}
							horizontal
							showsHorizontalScrollIndicator={false}
							keyExtractor={(item) => item.place_id}
						/> */}
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
    </KeyboardAvoidingView>
  );
}

CreatePost.navigationOptions = ({ navigation }) => {
  const { params } = navigation.state;
  return {
    headerTitle: "New Post",
    headerMode: "screen",
    headerStyle: {
      zIndex: 20,
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
      fontSize: 50,
    },
    headerTitleStyle: {
      fontFamily: "Lato-Regular",
      fontSize: 14,
      color: "white",
      alignSelf: "center",
    },
    headerLeft: () =>
      CustomImage({
        customStyle: { width: 20, height: 20 },
        customImageStyle: { width: 20, height: 20, resizeMode: "contain" },
        isTouchable: true,
        onPress: () => navigation.goBack(),
        source: back_arrow_white,
      }),
    headerLeftContainerStyle: {
      paddingLeft: 20,
    },
    headerRight: () => {
      return (
        <TouchableOpacity
          onPress={() => {
            params.SubmitData(
              navigation.getParam("text"),
              navigation.getParam("location")
            );
          }}
          style={{
            paddingRight: 10,
          }}
        >
          <Text
            allowFontScaling={false}
            style={{
              color: "#FFF",
              // fontWeight: 'bold',
              fontFamily: "Lato-Bold",
              fontSize: 14,
              marginHorizontal: 5,
              marginVertical: 10,
            }}
          >
            Post
          </Text>
        </TouchableOpacity>
      );
    },
    headerRightStyle: {
      marginRight: 20,
    },
  };
};
