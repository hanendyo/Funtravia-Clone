import React, { useState, useEffect } from "react";
import {
  View,
  Dimensions,
  TextInput,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Pressable,
  Modal,
  KeyboardAvoidingView,
} from "react-native";
import { Button, Text, Truncate, Loading, FunImage } from "../../../component";
import { default_image } from "../../../assets/png";
import { useLazyQuery } from "@apollo/react-hooks";
import {
  Arrowbackwhite,
  CheckWhite,
  CameraIcon,
  Xgray,
} from "../../../assets/svg";
import TravelWith from "../../../graphQL/Query/Itinerary/TravelWith";
import { useTranslation } from "react-i18next";
import { RESTFULL_CHAT } from "../../../config";
import ImagePicker from "react-native-image-crop-picker";
import { StackActions } from "@react-navigation/routers";
import { RNToasty } from "react-native-toasty";
import DeviceInfo from "react-native-device-info";
import { useSelector } from "react-redux";

export default function NewGroup(props) {
  const Notch = DeviceInfo.hasNotch();
  const tokenApps = useSelector((data) => data.token);
  const { t } = useTranslation();
  let [title, settitle] = useState("");
  let [loading, setloading] = useState(false);
  const [modals, setmodal] = useState(false);
  const [dataImagepatch, setdataImagepatch] = useState("");
  let [dataImage, setdataImage] = useState(null);
  const [
    querywith,
    { loading: loadingwith, data: DataBuddy, error: errorwith },
  ] = useLazyQuery(TravelWith, {
    fetchPolicy: "network-only",
    variables: {
      keyword: title,
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenApps,
      },
    },
  });

  const ChatOptions = {
    headerShown: true,
    headerTitle: "",
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    // headerTitleStyle: {
    //   fontFamily: "Lato-Bold",
    //   fontSize: 18,
    //   color: "white",
    //   // marginLeft: -10,
    // },

    headerLeft: () => (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Button
          text={""}
          size="medium"
          type="circle"
          variant="transparent"
          onPress={() => props.navigation.goBack()}
          style={{
            height: 55,
            marginLeft: 10,
          }}
        >
          <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
        </Button>
        <View>
          <Text size="label" style={{ color: "white" }}>
            {t("newGroupChat")}
          </Text>
          <Text style={{ color: "white" }}>{t("addParticipants")}</Text>
        </View>
      </View>
    ),
    headerRight: () => (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
        }}
      ></View>
    ),
  };

  useEffect(() => {
    getUserAndToken();
    props.navigation.setOptions(ChatOptions);
  }, []);

  const getUserAndToken = async () => {
    if (tokenApps) {
      await querywith();
    }
  };

  const _settitle = async (text) => {
    settitle(text);
    querywith();
  };

  const [userSelected, setUserSelected] = useState(
    props.route.params.userSelected
  );
  const selectUser = (data) => {
    let tempData = [...userSelected];
    let index = tempData.findIndex((k) => k["id"] === data.id);
    if (index !== -1) {
      tempData.splice(index, 1);
      setUserSelected(tempData);
    } else {
      tempData.push(data);
      setUserSelected(tempData);
    }
  };

  const pickcamera = async () => {
    ImagePicker.openCamera({
      width: 500,
      height: 500,
      cropping: true,
      cropperCircleOverlay: true,
      includeBase64: true,
      compressImageMaxWidth: 500,
      compressImageMaxHeight: 500,
    })
      .then((image) => {
        setdataImage(image.data);
        setdataImagepatch(image.path);
        setmodal(false);
      })
      .catch((e) => {
        RNToasty.Normal({
          title: "Cancelled",
          position: "bottom",
        });
      });
  };

  const pickGallery = async () => {
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      cropping: true,
      cropperCircleOverlay: true,
      includeBase64: true,
      compressImageMaxWidth: 500,
      compressImageMaxHeight: 500,
    })
      .then((image) => {
        // dataImage.current = image;
        // dataImagepatch.current = image.path;
        setdataImage(image.data);
        setdataImagepatch(image.path);
        setmodal(false);
        // upload(image.data);
      })
      .catch((e) => {
        RNToasty.Normal({
          title: "Cancelled",
          position: "bottom",
        });
      });
  };

  const _createGrup = async () => {
    setloading(true);
    let partisipant = [];
    for (const user of userSelected) {
      partisipant.push(user.id);
    }
    let data_kirim;
    if (dataImage !== null) {
      data_kirim = JSON.stringify({
        title: title,
        description: "",
        member: JSON.stringify(partisipant),
        picture: "data:image/png;base64," + dataImage,
      });
    } else {
      data_kirim = JSON.stringify({
        title: title,
        description: "",
        member: JSON.stringify(partisipant),
      });
    }
    try {
      let response = await fetch(RESTFULL_CHAT, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: tokenApps,
          "Content-Type": "application/json",
        },
        body: data_kirim,
      });
      let responseJson = await response.json();
      if (responseJson.status == true) {
        props.navigation.dispatch(
          StackActions.replace("ChatStack", {
            screen: "GroupRoom",
            params: {
              room_id: responseJson.room.id,
              name: responseJson.room.title,
              picture: responseJson.room.picture,
              from: "group",
            },
          })
        );
        setloading(false);
      } else {
        setloading(false);
        throw new Error(responseJson.message);
      }
    } catch (error) {
      setloading(false);
      RNToasty.Show({
        title: `${error}`,
        position: "bottom",
      });
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        padding: 10,
        // borderWidth: 1,
      }}
    >
      <View
        style={{
          flex: 1,
          borderRadius: 15,
          margin: 15,
        }}
      >
        <Loading show={loading} />
        <Modal
          onBackdropPress={() => {
            setmodal(false);
          }}
          animationType="fade"
          onRequestClose={() => setmodal(false)}
          onDismiss={() => setmodal(false)}
          visible={modals}
          transparent={true}
        >
          <Pressable
            style={{
              width: Dimensions.get("screen").width,
              height: Dimensions.get("screen").height,
              alignSelf: "center",
              backgroundColor: "#000",
              opacity: 0.7,
              position: "absolute",
            }}
            onPress={() => setmodal(false)}
          />
          <View
            style={{
              width: Dimensions.get("screen").width - 100,
              marginHorizontal: 50,
              borderRadius: 10,
              marginTop: Dimensions.get("screen").height / 3,
              backgroundColor: "#fff",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                paddingHorizontal: 20,
                backgroundColor: "#f6f6f6",
                borderBottomColor: "#d1d1d1",
                borderBottomWidth: 1,
                justifyContent: "center",
              }}
            >
              <Text
                size="title"
                type="bold"
                style={{ marginTop: 13, marginBottom: 15 }}
              >
                {t("option")}
              </Text>
              <Pressable
                onPress={() => setmodal(false)}
                style={{
                  height: 50,
                  width: 55,
                  position: "absolute",
                  right: 0,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Xgray width={15} height={15} />
              </Pressable>
            </View>
            <TouchableOpacity
              style={{
                alignItems: "center",
                borderBottomWidth: 1,
                borderBottomColor: "#d1d1d1",
              }}
              onPress={() => pickcamera()}
            >
              <Text
                size="description"
                type="regular"
                style={{ marginTop: 15, marginBottom: 18 }}
              >
                {t("OpenCamera")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                alignItems: "center",
              }}
              onPress={() => pickGallery()}
            >
              <Text
                size="description"
                type="regular"
                style={{ marginTop: 15, marginBottom: 18 }}
              >
                {t("OpenGallery")}
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <View
          style={{
            backgroundColor: "white",
            paddingVertical: 20,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            borderBottomColor: "#D1D1D1",
            borderBottomWidth: 0.5,
          }}
        >
          <View
            style={{
              alignContent: "center",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 20,
              height: 50,
              zIndex: 5,
              flexDirection: "row",
              width: Dimensions.get("screen").width,
            }}
          >
            <View
              style={{
                backgroundColor: "#FFF",
                borderRadius: 5,
                width: Dimensions.get("screen").width - 80,
                height: 40,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {dataImagepatch != "" ? (
                <View>
                  <Pressable
                    onPress={() => setmodal(true)}
                    style={{
                      width: 55,
                      height: 55,
                      borderRadius: 35,
                      // borderWidth: 1.5,
                      // borderColor: "#FFF",
                      backgroundColor: "#D1D1D1",
                      justifyContent: "center",
                      alignItems: "center",
                      zIndex: 1,
                      marginRight: 10,
                    }}
                  >
                    <Image
                      source={{ uri: dataImagepatch }}
                      style={{
                        width: 55,
                        height: 55,
                        borderRadius: 35,
                      }}
                    />
                  </Pressable>
                </View>
              ) : (
                <Pressable
                  onPress={() => setmodal(true)}
                  style={{
                    width: 55,
                    height: 55,
                    borderRadius: 35,
                    // borderWidth: 1.5,
                    // borderColor: "#FFF",
                    backgroundColor: "#D1D1D1",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 1,
                    marginRight: 10,
                  }}
                >
                  <CameraIcon width={20} height={20} />
                </Pressable>
              )}
              <View
                style={{
                  borderBottomColor: "#C6C6C6",
                  paddingVertical: 5,
                  marginBottom: 5,
                  borderBottomWidth: 1,
                  width: "75%",
                }}
              >
                <TextInput
                  underlineColorAndroid="transparent"
                  placeholder={"Type group subject here...."}
                  maxLength={25}
                  style={{
                    fontFamily: "Lato-Regular",
                    fontSize: 14,
                    paddingVertical: 5,
                    // backgroundColor: "red",
                  }}
                  item={title}
                  onChangeText={(text) => _settitle(text)}
                />
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            paddingTop: 20,
            padding: 20,
            paddingBottom: 5,
            backgroundColor: "#FFFFFF",
          }}
        >
          <Text>Participant : {userSelected.length}</Text>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : null}
          keyboardVerticalOffset={Notch ? 90 : 65}
          style={{
            flex: 1,
            backgroundColor: "#FFFFFF",
            // flexWrap: "wrap",
            // flexDirection: "row",
            paddingHorizontal: 10,
            borderBottomLeftRadius: 15,
            borderBottomRightRadius: 15,
            // borderWidth: 1,
          }}
        >
          <FlatList
            // numColumns={5}
            data={userSelected}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                key={index}
                // onPress={() => selectUser(item)}
                style={{
                  flexDirection: "row",
                  width: Dimensions.get("screen").width - 30,
                  paddingVertical: 5,
                  // justifyContent: "space-between",
                  // alignItems: "center",
                  // alignContent: "center",
                  borderBottomWidth: 1,
                  borderBottomColor: "#F6F6F6",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    alignContent: "center",
                    width: "100%",
                  }}
                >
                  <FunImage
                    Pressable={true}
                    // onPress={() => selectUser(item)}
                    source={
                      item && item.picture
                        ? { uri: item.picture }
                        : default_image
                    }
                    style={{
                      resizeMode: "cover",
                      height: (Dimensions.get("screen").width - 40) / 5 - 20,
                      width: (Dimensions.get("screen").width - 40) / 5 - 20,
                      borderRadius: (Dimensions.get("screen").width - 40) / 5,
                      marginVertical: 10,
                      marginHorizontal: 10,
                    }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      size="label"
                      type="bold"
                      style={{
                        marginLeft: 10,
                      }}
                      numberOfLines={2}
                    >
                      {item.first_name} {item.last_name ? item.last_name : ""}
                    </Text>

                    <Text
                      numberOfLines={1}
                      size="description"
                      type="regular"
                      style={{
                        marginLeft: 10,
                        marginTop: 3,
                      }}
                    >
                      @{item.username}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />

          {title != "" ? (
            !loading ? (
              <Pressable
                onPress={() => _createGrup()}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  borderWidth: 1.5,
                  borderColor: "#FFF",
                  backgroundColor: "#209FAE",
                  position: "relative",
                  bottom: 90,
                  marginBottom: -60,
                  right: 15,
                  justifyContent: "center",
                  alignItems: "center",
                  alignSelf: "flex-end",
                  zIndex: 1,
                }}
              >
                <CheckWhite width={20} height={20} />
              </Pressable>
            ) : (
              <Pressable
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  borderWidth: 1.5,
                  borderColor: "#FFF",
                  backgroundColor: "#209FAE",
                  position: "relative",
                  bottom: 90,
                  marginBottom: -60,
                  right: 15,
                  justifyContent: "center",
                  alignItems: "center",
                  alignSelf: "flex-end",
                  zIndex: 1,
                }}
              >
                <ActivityIndicator
                  animating={true}
                  color="#FFFFFF"
                  size="large"
                />
              </Pressable>
            )
          ) : null}
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}
