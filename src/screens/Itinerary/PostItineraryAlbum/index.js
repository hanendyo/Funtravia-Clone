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
} from "react-native";
import {
  Text,
  Button,
  StatusBar,
  FunImage,
  FunVideo,
} from "../../../component";
import { useTranslation } from "react-i18next";

const { width } = Dimensions.get("screen");

export default function PostItineraryAlbum(props) {
  const { t } = useTranslation();
  const [dataalbums, setAllalbum] = useState(props.route.params.data_album);
  const [album_id, setalbum_id] = useState(props.route.params.album_id);
  const [token, settoken] = useState(props.route.params.token);
  const [selectedPhoto, setSelectedPhoto] = useState([]);
  let itinerary_id = props.route.params.itinerary_id;

  const HeaderComponent = {
    // title: "Select Photos",
    headerTintColor: "white",
    headerTitle: "Select Photos or Videos",
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
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
  }, [props.navigation]);

  const selectPhoto = (data) => {
    let slcphoto = [...selectedPhoto];
    let index = slcphoto.findIndex((k) => k["id"] === data.id);
    if (index !== -1) {
      slcphoto.splice(index, 1);
      setSelectedPhoto(slcphoto);
    } else {
      slcphoto.push({ id: data.id, assets: data.filepath, type: data.type });
      setSelectedPhoto(slcphoto);
    }
    props.navigation.setOptions({
      headerRight: () => (
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 20,
          }}
        >
          {slcphoto.length > 0 ? (
            <Text
              style={{
                color: "white",
              }}
            >
              {slcphoto.length}/{dataalbums.length} {t("photosSelected")}
            </Text>
          ) : null}
        </View>
      ),
    });
  };

  const gotoCreatePost = (data) => {
    props.navigation.navigate("ItineraryStack", {
      screen: "CraetePostAlbum",
      params: {
        selectedPhoto: data,
        itinerary_id: itinerary_id,
        album_id: album_id,
        token: token,
      },
    });
  };

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <FlatList
        contentContainerStyle={{
          flex: 1,
        }}
        style={{
          paddingStart: 0,
          alignContent: "center",
          // backgroundColor: "white",
        }}
        data={dataalbums}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={{
              alignContent: "center",
              justifyContent: "center",
              backgroundColor: "white",
              alignItems: "center",
              paddingVertical: 1,
              paddingHorizontal: 1,
            }}
            onPress={() => selectPhoto(item)}
          >
            {item.type === "video" ? (
              <FunVideo
                source={{ uri: item.filepath }}
                muted={true}
                poster={item.filepath.replace("output.m3u8", "thumbnail.png")}
                paused={true}
                style={{
                  height: Dimensions.get("screen").width / 4 - 2,
                  width: Dimensions.get("screen").width / 4 - 2,
                  resizeMode: "cover",
                }}
              />
            ) : (
              <FunImage
                source={{ uri: item.filepath }}
                style={{
                  height: Dimensions.get("screen").width / 4 - 2,
                  width: Dimensions.get("screen").width / 4 - 2,
                  resizeMode: "cover",
                }}
              />
            )}
            {/* <Image
              source={{ uri: item.assets }}
              style={{
                height: Dimensions.get("screen").width / 4 - 2,
                width: Dimensions.get("screen").width / 4 - 2,
                resizeMode: "cover",
              }}
            /> */}
            {selectedPhoto.findIndex((k) => k["id"] === item.id) !== -1 ? (
              <View
                style={{
                  width: 25,
                  height: 25,
                  position: "absolute",
                  bottom: 5,
                  right: 5,
                  backgroundColor: "#209fae",
                  borderWidth: 1.5,
                  borderRadius: 13,
                  borderColor: "white",
                  alignItems: "center",
                  justifyContent: "center",
                  alignContent: "center",
                  paddingBottom: 1,
                }}
              >
                <Text
                  type="bold"
                  size="label"
                  style={{
                    color: "white",
                  }}
                >
                  {selectedPhoto.findIndex((k) => k["id"] === item.id) + 1}
                </Text>
              </View>
            ) : (
              <View
                style={{
                  width: 25,
                  height: 25,
                  position: "absolute",
                  bottom: 5,
                  right: 5,
                  borderWidth: 2,
                  borderRadius: 13,
                  borderColor: "white",
                }}
              />
            )}
          </TouchableOpacity>
        )}
        numColumns={4}
      />
      {selectedPhoto.length > 0 ? (
        <View
          style={{
            alignItems: "center",
            padding: 20,
            backgroundColor: "white",
            shadowColor: "#464646",
            shadowOffset: { width: 0, height: 2 },
            elevation: 3,
            shadowOpacity: 1,
            shadowRadius: 2,
          }}
        >
          <Button
            onPress={() => {
              gotoCreatePost(selectedPhoto);
            }}
            size="large"
            text={t("next")}
            style={{
              width: width - 40,
            }}
          ></Button>
        </View>
      ) : null}
    </View>
  );
}
