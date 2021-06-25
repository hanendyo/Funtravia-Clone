import React, { useState, useEffect } from "react";
import { useLazyQuery, useQuery, useMutation } from "@apollo/react-hooks";
import {
  View,
  Dimensions,
  Platform,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { StackActions } from "@react-navigation/routers";
import { Arrowbackwhite, NewAlbum, Search } from "../../../assets/svg";
import { default_image } from "../../../assets/png";
import Modal from "react-native-modal";
import { Text, Button, FunImage } from "../../../component";
import { useTranslation } from "react-i18next";
import Ripple from "react-native-material-ripple";
import ItineraryAlbums from "../../../graphQL/Query/Itinerary/ListAlbumItinerary";
import AddNewAlbumItinerary from "../../../graphQL/Mutation/Itinerary/AddNewAlbumItinerary";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";
const { width, height } = Dimensions.get("screen");
import { RNToasty } from "react-native-toasty";

export default function ChooseAlbumItinerary(props) {
  console.log("props chhos", props);
  const { t } = useTranslation();
  const [newItineraryAlbums, setNewItineraryAlbums] = useState(false);
  const [datas, setDatas] = useState();
  const [text, setText] = useState("");
  const [searchText, setSearchText] = useState("");
  const [id_itinerary, setId_itinerary] = useState(
    props.route.params.idItinerary
  );

  const HeaderComponent = {
    headerShown: true,
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: "",
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
      <View style={{ flexDirection: "row" }}>
        <Button
          text={""}
          size="medium"
          type="circle"
          variant="transparent"
          onPress={() => props.navigation.goBack()}
        >
          <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
        </Button>
        <View style={{ marginLeft: 5 }}>
          <Text size="label" type="bold" style={{ color: "#FFF" }}>
            Post
          </Text>
          <Text size="description" type="regular" style={{ color: "#FFF" }}>
            {t("Select") + " Album Itinerary"}
          </Text>
        </View>
      </View>
    ),
  };

  const [
    QueryAlbum,
    { data: dataItinerarys, loading: loadingdetail, error: errordetail },
  ] = useLazyQuery(ItineraryAlbums, {
    fetchPolicy: "network-only",
    variables: {
      itinerary_id: id_itinerary,
      keyword: searchText,
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    QueryAlbum();
  }, []);

  const [
    MutationCreateAlbumItinerary,
    { loading: loadingMutation, data: dataMutation, error: errorMutation },
  ] = useMutation(AddNewAlbumItinerary, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const SubmitAdd = async (text) => {
    if (text === "" || text === null) {
      return RNToasty.Show({
        title: t("emptyAlbumTitle"),
        position: "bottom",
      });
    }

    try {
      let response = await MutationCreateAlbumItinerary({
        variables: {
          itinerary_id: id_itinerary,
          title: text,
        },
      });

      if (response.data) {
        if (
          response &&
          response.data &&
          response.data.create_itinerary_album.code === 200
        ) {
          QueryAlbum();
          setNewItineraryAlbums(false);
          setText("");
        } else {
          console.log("error");
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const _searchHandle = (e) => {
    setSearchText(e);
    QueryAlbum();
  };

  const pilih = async (id, title) => {
    props.route.params.isAlbum === false
      ? props.navigation.navigate("FeedStack", {
          screen: "CreatePostScreen",
          params: {
            token: token,
            id_itin: props.route.params.idItinerary,
            id_album: id,
            title_album: title,
            file: props.route.params.file,
            type: props.route.params.type,
            location: props.route.params.location,
            album: "Itinerary",
          },
        })
      : props.navigation.navigate("FeedStack", {
          screen: "ListFotoAlbums",
          params: {
            token: token,
            id_album: id,
            title_album: title,
            album: "Itinerary",
            file: props.route.params.file,
            type: props.route.params.type,
            location: props.route.params.location,
            post_id: props.route.params.post_id,
          },
        });
  };

  const closeItinerary = async () => {
    await setModalAlbum(true);
    await setModalDay(false);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          width: Dimensions.get("screen").width,
          paddingHorizontal: 15,
          backgroundColor: "#fff",
          borderBottomWidth: 2,
          borderColor: "#e1e1e1",
        }}
      >
        <View
          style={{
            height: 40,
            marginVertical: 10,
            borderRadius: 5,
            backgroundColor: "#f6f6f6",
            alignItems: "center",
            paddingHorizontal: 10,
            flexDirection: "row",
          }}
        >
          <Search height={18} width={18} />
          <TextInput
            value={searchText}
            onChangeText={(text) => _searchHandle(text)}
            placeholder={t("lookFor")}
            placeholderTextColor="#464646"
            style={{
              flex: 1,
              color: "#000",
              height: 40,
              // width: "70%",
              width: "77%",
            }}
          />
        </View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          width: Dimensions.get("screen").width,
          // height: Dimensions.get("screen").height,
          paddingHorizontal: 15,
          backgroundColor: "#FFF",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            height: Dimensions.get("screen").height,
            flexWrap: "wrap",
            width: Dimensions.get("screen").width - 30,
          }}
        >
          {loadingdetail ? (
            <View
              style={{
                width: "100%",
                marginTop: 20,
                alignItems: "center",
                alignSelf: "center",
              }}
            >
              <ActivityIndicator size={"small"} color="#209fae" />
            </View>
          ) : (
            <Pressable
              onPress={() => setNewItineraryAlbums(true)}
              style={{
                width: (width - 33) / 3,
                backgroundColor: "#FFF",
                marginTop: 20,
              }}
            >
              <View
                style={{
                  width: width / 3 - 20,
                  height: width / 3 - 20,
                  alignSelf: "center",
                  backgroundColor: "#ECECEC",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 5,
                }}
              >
                <NewAlbum height={60} width={60} />
              </View>
              <View style={{ paddingHorizontal: 10, marginTop: 5 }}>
                <Text size="label" type="bold">
                  Create Album
                </Text>
              </View>
            </Pressable>
          )}
          {dataItinerarys &&
            dataItinerarys?.album_itinerary_list.map((item, index) =>
              loadingdetail ? (
                <View style={{ marginTop: 20 }}>
                  <ActivityIndicator size={"small"} color="#209fae" />
                </View>
              ) : (
                <Pressable
                  key={index}
                  onPress={() => pilih(item.id, item.title)}
                  style={{
                    width: (width - 33) / 3,
                    backgroundColor: "#FFF",
                    marginTop: 20,
                  }}
                >
                  <View
                    style={{
                      width: width / 3 - 20,
                      height: width / 3 - 20,
                      alignSelf: "center",
                    }}
                  >
                    <FunImage
                      source={item.url ? { uri: item.cover } : default_image}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 5,
                      }}
                    />
                  </View>
                  <View style={{ paddingHorizontal: 10, marginTop: 5 }}>
                    <Text size="label" type="bold">
                      {item.title}
                    </Text>
                    <Text size="description" type="light">
                      {item.count_media} {" " + t("photo")}
                      {/* {item.count_media > 1 ? "photos" : "photo"} */}
                    </Text>
                  </View>
                </Pressable>
              )
            )}
        </View>
      </ScrollView>
      <Modal
        useNativeDriver={true}
        visible={newItineraryAlbums}
        onRequestClose={() => setNewItineraryAlbums(false)}
        transparent={true}
        animationType="fade"
      >
        <Pressable
          onPress={() => setNewItineraryAlbums(false)}
          style={{
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
            alignSelf: "center",
            backgroundColor: "#000000",
            opacity: 0.7,
          }}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{
            // height: 200,
            width: Dimensions.get("screen").width - 40,
            top: Dimensions.get("screen").height / 3,
            position: "absolute",
            zIndex: 15,
            // paddingHorizontal: 15,
          }}
        >
          <View
            style={{
              height: "100%",
              width: "100%",
              backgroundColor: "#FFF",
              borderRadius: 5,
              paddingBottom: 15,
            }}
          >
            <View
              style={{
                width: "100%",
                paddingHorizontal: 15,
                borderBottomWidth: 1,
                borderColor: "#d1d1d1",
              }}
            >
              <Text type="bold" size="title" style={{ marginVertical: 10 }}>
                New Album
              </Text>
            </View>
            <View
              style={{
                width: "100%",
                paddingHorizontal: 15,
              }}
            >
              <TextInput
                multiline
                placeholder={t("untitle")}
                maxLength={1000}
                placeholderStyle={{ fontSize: 50 }}
                placeholderTextColor="#6C6C6C"
                style={
                  Platform.OS == "ios"
                    ? {
                        height: 75,
                        maxHeight: 100,
                        marginVertical: 10,
                        marginHorizontal: 10,
                        paddingTop: 10,
                        fontSize: 14,
                        fontFamily: "Lato-Regular",
                      }
                    : {
                        height: 50,
                        borderRadius: 5,
                        backgroundColor: "#f6f6f6",
                        paddingHorizontal: 10,
                        fontSize: 14,
                        marginVertical: 10,
                        fontFamily: "Lato-Regular",
                      }
                }
                onChangeText={(text) => setText(text)}
                value={text}
              />
            </View>
            <View
              style={{
                width: "100%",
                paddingHorizontal: 15,
                justifyContent: "flex-end",
                flexDirection: "row",
              }}
            >
              <Button
                onPress={() => {
                  setNewItineraryAlbums(false);
                  setText("");
                }}
                size="medium"
                color="transparant"
                text={t("cancel")}
              ></Button>
              <Button
                onPress={() => SubmitAdd(text)}
                size="medium"
                color="primary"
                text={t("create") + " " + "Album"}
              ></Button>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
