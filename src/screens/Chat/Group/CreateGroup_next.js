import React, { useState, useEffect } from "react";
import {
  View,
  Dimensions,
  TextInput,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  FlatList,
  Pressable,
  Alert,
  Modal,
  KeyboardAvoidingView,
} from "react-native";
import {
  Button,
  Text,
  Truncate,
  CustomImage,
  Loading,
  FunImage,
} from "../../../component";
import { default_image, search_button } from "../../../assets/png";
import { useLazyQuery } from "@apollo/react-hooks";
import {
  Arrowbackwhite,
  SendMessage,
  CheckWhite,
  Xhitam,
  Xgray,
  ArrowRight,
  CameraIcon,
} from "../../../assets/svg";
import TravelWith from "../../../graphQL/Query/Itinerary/TravelWith";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CHATSERVER, RESTFULL_CHAT } from "../../../config";
// import Modal from "react-native-modal";
import ImagePicker from "react-native-image-crop-picker";
import { StackActions } from "@react-navigation/routers";
import { RNToasty } from "react-native-toasty";
import DeviceInfo from "react-native-device-info";

export default function NewGroup(props) {
  const Notch = DeviceInfo.hasNotch();

  const { t, i18n } = useTranslation();
  const [token, setToken] = useState(null);
  let [title, settitle] = useState("");
  const [user, setUser] = useState({});
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
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const ChatOptions = {
    headerShown: true,
    headerTitle: "New Group",
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
      marginLeft: -10,
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
          marginLeft: 10,
        }}
      >
        <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
      </Button>
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
    let token = await AsyncStorage.getItem("access_token");
    if (token) {
      await setToken(token);
      await querywith();
    }

    let data = await AsyncStorage.getItem("setting");
    if (data) {
      await setUser(JSON.parse(data).user);
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
    // console.log(
    //   JSON.stringify({
    //     title: title,
    //     description: "",
    //     member: partisipant,
    //     picture: dataImage,
    //   })
    // );
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
          Authorization: "Bearer " + token,
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
      console.error(error);
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
          // style={{
          //   justifyContent: "center",
          //   alignItems: "center",
          //   alignSelf: "center",
          //   alignContent: "center",
          //   backgroundColor: "#000",
          // }}
        >
          <Pressable
            style={{
              width: Dimensions.get("screen").width,
              height: Dimensions.get("screen").height,
              alignSelf: "center",
              backgroundColor: "#000",
              opacity: 0.7,
            }}
            onPress={() => setmodal(false)}
          />
          <View
            style={{
              position: "absolute",
              backgroundColor: "white",
              width: Dimensions.get("screen").width - 60,
              alignSelf: "center",
              paddingHorizontal: 15,
              paddingVertical: 5,
              top: Dimensions.get("screen").height / 3,
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

        <View
          style={{
            backgroundColor: "white",
            paddingVertical: 20,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
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
                backgroundColor: "#FFFFFF",
                borderRadius: 5,
                width: "100%",
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
                      width: 50,
                      height: 50,
                      borderRadius: 25,
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
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                      }}
                    />
                  </Pressable>
                </View>
              ) : (
                <Pressable
                  onPress={() => setmodal(true)}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
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

              <TextInput
                underlineColorAndroid="transparent"
                placeholder={"Type group subject here...."}
                maxLength={25}
                style={{
                  width: "75%",
                  fontFamily: "Lato-Regular",
                  fontSize: 14,
                  borderBottomWidth: 1,
                  borderBottomColor: "#D1D1D1",
                }}
                item={title}
                onChangeText={(text) => _settitle(text)}
              />
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
            numColumns={5}
            data={userSelected}
            renderItem={({ item, index }) => (
              <Pressable
                key={index}
                // onPress={() => selectUser(item)}
                style={{
                  alignItems: "center",
                  alignContent: "center",
                  // justifyContent: "center",
                  // borderWidth: 1,
                  // width: Dimensions.get("screen").width - 20 / 5,
                }}
              >
                <FunImage
                  Pressable={true}
                  // onPress={() => selectUser(item)}
                  source={
                    item && item.picture ? { uri: item.picture } : default_image
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
                <Text>
                  <Truncate text={item.first_name} length={15} />
                  {/* {item.first_name} */}
                </Text>
              </Pressable>
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
