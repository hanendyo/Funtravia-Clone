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
} from "react-native";
import { Arrowbackwhite, NewAlbum } from "../../../assets/svg";
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

export default function ChooseAlbumItinerary({
  modalDay,
  setModalDay,
  idItinerary,
  props,
  token,
  setModalAlbum,
}) {
  const { t } = useTranslation();
  const [newItineraryAlbums, setNewItineraryAlbums] = useState(false);
  const [datas, setDatas] = useState();
  const [text, setText] = useState("");
  const {
    data: dataItinerarys,
    loading: loadingdetail,
    error: errordetail,
    refetch,
  } = useQuery(ItineraryAlbums, {
    variables: { itinerary_id: idItinerary, keyword: "" },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });
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
          itinerary_id: idItinerary,
          title: text,
        },
      });

      if (response.data) {
        if (
          (response &&
            response.data &&
            response.data.create_itinerary_album.code === 200) ||
          (response &&
            response.data &&
            response.data.create_itinerary_album.code === "200")
        ) {
          refetch();
          setNewItineraryAlbums(false);
          setText("");
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const pilih = async (id) => {
    setModalAlbum(false);
    setModalDay(false);
    setTimeout(() => {
      props.navigate("CreatePostScreen", {
        token: token,
        id_album: id,
        id_itinerary: idItinerary,
      });
    }, 500);
  };

  const closeItinerary = async () => {
    await setModalAlbum(true);
    await setModalDay(false);
  };

  return (
    <View>
      <Modal
        visible={modalDay}
        animationType="fade"
        onRequestClose={() => {
          setModalDay(false);
        }}
        onDismiss={() => setModalDay(false)}
        style={{
          alignSelf: "center",
          zIndex: 3,
        }}
      >
        <View
          style={{
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignSelf: "flex-start",
              alignItems: "center",
              alignContent: "center",
              backgroundColor: "#209fae",
              height: 55,
              width: Dimensions.get("screen").width,
              marginTop: Platform.OS === "ios" ? 0 : 38,
            }}
          >
            <TouchableOpacity
              style={{
                height: 55,
                width: 55,
                position: "absolute",
                alignItems: "center",
                alignContent: "center",
                paddingTop: 20,
              }}
              onPress={() => closeItinerary()}
            >
              <Arrowbackwhite width={20} height={20} />
            </TouchableOpacity>
            <View
              style={{
                top: 0,
                left: 60,
                height: 50,
                justifyContent: "center",
                marginTop: 5,
              }}
            >
              <Text size="label" type="regular" style={{ color: "#FFF" }}>
                Itinerary Albums
              </Text>
              <Text size="description" type="light" style={{ color: "#FFF" }}>
                {t("Select") + " " + "album"}
              </Text>
            </View>
          </View>
          <ScrollView
            contentContainerStyle={{
              width: Dimensions.get("screen").width,
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
                // borderWidth: 1,
              }}
            >
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
              {dataItinerarys &&
                dataItinerarys?.album_itinerary_list.map((item, index) => (
                  <Pressable
                    key={index}
                    onPress={() => pilih(item.id)}
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
                        {item.count_media}{" "}
                        {item.count_media > 1 ? "photos" : "photo"}
                      </Text>
                    </View>
                  </Pressable>
                ))}
            </View>
          </ScrollView>
        </View>
      </Modal>

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
    </View>
  );
}
