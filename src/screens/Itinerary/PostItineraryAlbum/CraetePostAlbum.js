import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Platform,
  Pressable,
  Button as ButtonRn,
  ActivityIndicator,
  ImageBackground,
  TextInput,
  Alert,
} from "react-native";
import {
  Text,
  Button,
  StatusBar,
  FunImage,
  FunVideo,
} from "../../../component";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native-gesture-handler";
import { default_image } from "../../../assets/png";
import PostMut from "../../../graphQL/Mutation/Itinerary/PostToFeed";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("screen");

export default function CraetePostAlbum(props) {
  let itinerary_id = props.route.params.itinerary_id;
  let selectedPhoto = props.route.params.selectedPhoto;
  let album_id = props.route.params.album_id;
  let token = props.route.params.token;

  const [indexAktif, setIndexAktive] = useState(0);
  let [statusText, setStatusText] = useState("");
  let [loadingok, setLoading] = useState(false);
  let [Location, setLocation] = useState({
    address: "Add Location",
    latitude: "",
    longitude: "",
  });
  let [setting, setSetting] = useState();
  const loadAsync = async () => {
    let setsetting = await AsyncStorage.getItem("setting");
    setSetting(JSON.parse(setsetting));
  };
  const HeaderComponent = {
    title: "Select Photos",
    headerTintColor: "white",
    headerTitle: "Post Album",
    headerShown: true,
    // headerTransparent: true,
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      fontFamily: "Lato-Bold",
      fontSize: 16,
      color: "white",
    },
    headerRight: () => (
      <Pressable
        onPress={() => {
          SubmitData(statusText, Location);
        }}
        style={({ pressed }) => [
          {
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            // marginRight: 10,
            backgroundColor: pressed ? "#178b99" : "#209fae",
            // height: 30,
            paddingHorizontal: 20,
          },
        ]}
      >
        <Text
          size="label"
          style={{
            color: "white",
          }}
        >
          Post
        </Text>
      </Pressable>
    ),
  };
  const [MutationCreate, { loading, data, error }] = useMutation(PostMut, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const _setStatusText = async (text) => {
    setStatusText(text);
    await props.navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => {
            SubmitData(text, Location);
          }}
          style={({ pressed }) => [
            {
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              // marginRight: 10,
              backgroundColor: pressed ? "#178b99" : "#209fae",
              // height: 30,
              paddingHorizontal: 20,
            },
          ]}
        >
          <Text
            size="label"
            style={{
              color: "white",
            }}
          >
            Post
          </Text>
        </Pressable>
      ),
    });
  };
  useEffect(() => {
    loadAsync();
    props.navigation.setOptions(HeaderComponent);
  }, [props.navigation]);

  const SubmitData = async (statusText, Location) => {
    props.navigation.setOptions({
      headerRight: () => (
        <View
          style={{
            marginRight: 10,
          }}
        >
          <ActivityIndicator animating={true} size="large" color="white" />
        </View>
      ),
    });
    let caption = statusText ? statusText : "-";
    let latitude = Location?.latitude !== "" ? Location?.latitude : "0";
    let longitude = Location?.longitude !== "" ? Location?.longitude : "0";
    let location_name =
      Location?.address == "" || Location?.address == "Add Location"
        ? "0"
        : Location.address;
    try {
      let response = await MutationCreate({
        variables: {
          caption: caption,
          latitude: 0,
          longitude: 0,
          location_name: 0,
          assets: JSON.stringify(selectedPhoto),
          itinerary_id: itinerary_id,
          album_id: album_id,
        },
      });

      if (response.data) {
        if (response.data.create_post_itinerary_albums.code === 200) {
          props.navigation.navigate("BottomStack", {
            screen: "FeedBottomScreen",
            params: {
              screen: "FeedScreen",
              params: {
                isPost: false,
                isItinerary: true,
              },
            },
          });

          // props.navigation.navigate("FeedScreen", { isposting: true });
        } else {
          throw new Error(response.data.create_post_itinerary_albums.message);
        }
      } else {
        throw new Error("Error Input");
      }
    } catch (error) {
      props.navigation.setOptions({
        headerRight: () => (
          <Pressable
            onPress={() => {
              SubmitData();
            }}
            style={({ pressed }) => [
              {
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                // marginRight: 10,
                backgroundColor: pressed ? "#178b99" : "#209fae",
                // height: 30,
                paddingHorizontal: 20,
              },
            ]}
          >
            <Text
              size="label"
              style={{
                color: "white",
              }}
            >
              Post
            </Text>
          </Pressable>
        ),
      });
      Alert.alert("" + error);
    }
  };

  return (
    <ScrollView
      style={{
        backgroundColor: "white",
        // flex: 1,
      }}
    >
      <View style={{}}></View>
      <ImageBackground
        source={{ uri: selectedPhoto[indexAktif].assets }}
        style={{
          width: width - 20,
          height: width - 120,
          borderRadius: 15,
          margin: 10,
        }}
        imageStyle={{
          borderRadius: 15,
          resizeMode: "cover",
        }}
      >
        <View
          style={{
            position: "absolute",
            top: 15,
            right: 10,
            backgroundColor: "#040404",
            opacity: 0.8,
            paddingHorizontal: 10,
            borderRadius: 13,
            height: 25,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            type="bold"
            style={{
              color: "white",
            }}
          >
            {indexAktif + 1} / {selectedPhoto.length}
          </Text>
        </View>
      </ImageBackground>
      <FlatList
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 10,
        }}
        data={selectedPhoto}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => setIndexAktive(index)}
            style={{
              marginHorizontal: 2,
            }}
          >
            {item.type === "video" ? (
              <FunVideo
                source={{ uri: item.assets }}
                muted={true}
                poster={item.assets.replace("output.m3u8", "thumbnail.png")}
                paused={true}
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 10,
                  opacity: index == indexAktif ? 1 : 0.5,
                }}
              />
            ) : (
              <FunImage
                source={{ uri: item.assets }}
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 10,
                  opacity: index == indexAktif ? 1 : 0.5,
                }}
              />
            )}
          </TouchableOpacity>
        )}
      />
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "#ffffff",
          borderBottomColor: "#f0f0f0f0",
          borderBottomWidth: 1,
          marginHorizontal: 10,
        }}
      >
        <Image
          source={
            setting && setting.user
              ? {
                  uri: setting.user.picture,
                }
              : default_image
          }
          style={{
            width: 50,
            height: 50,
            borderRadius: 50,
            marginVertical: 10,
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
    </ScrollView>
  );
}
