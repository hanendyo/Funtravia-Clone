import React, { useEffect, useState } from "react";
import {
  Dimensions,
  View,
  ScrollView,
  Image,
  TextInput,
  Pressable,
  BackHandler,
  Alert,
  Linking,
} from "react-native";
import {
  Arrowbackwhite,
  Star,
  StarBlue,
  CameraBlue,
  SendReview,
  StartBuleIsi,
  PanahPutih,
} from "../../../assets/svg";
import { Button, Text } from "../../../component";
import Ripple from "react-native-material-ripple";
import Modal from "react-native-modal";
import { useTranslation } from "react-i18next";
import ImagePicker from "react-native-image-crop-picker";
import CheckBox from "@react-native-community/checkbox";
import UploadReview from "../../../graphQL/Mutation/Destination/Review";
import { ReactNativeFile } from "apollo-upload-client";
import { useMutation } from "@apollo/client";

export default function DestinationUnescoReview(props) {
  const { t } = useTranslation();
  let [toggleCheckBox, setToggleCheckBox] = useState(false);
  let [dataImage, setDataImage] = useState([]);
  let [data] = useState(props.route.params.data);
  let [maxRating] = useState([1, 2, 3, 4, 5]);
  let [defaultRate, setDefaultRate] = useState(0);
  let [modals, setmodal] = useState(false);
  let [text, setText] = useState("");
  const HeaderComponent = {
    headerShown: true,
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: "Write Review",
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      fontFamily: "Lato-Reguler",
      color: "white",
    },
    headerLeftContainerStyle: {
      background: "#FFF",
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

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    // const unsubscribe = props.navigation.addListener("focus");
    // return unsubscribe;
  }, [props.navigation]);

  const pickcamera = async () => {
    ImagePicker.openCamera({
      width: 500,
      height: 500,
      cropping: true,
      multiple: true,
    }).then((image) => {
      let tempData = [...dataImage];
      let file = new ReactNativeFile({
        uri: image.path,
        type: image.mime,
        name: data.name,
      });
      tempData.splice(0, 0, file);
      setDataImage(tempData);
      setmodal(false);
    });
  };

  const pickGallery = async () => {
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      cropping: true,
      cropperCircleOverlay: true,
      multiple: true,
    }).then((image) => {
      let tempData = [...dataImage];
      image.map((item) => {
        let file = new ReactNativeFile({
          uri: item.path,
          type: item.mime,
          name: data.name,
        });
        tempData.splice(0, 0, file);
        setDataImage(tempData);
      });

      setmodal(false);
    });
  };

  const [
    mutationUploadV2,
    { loading: loadingupv2, data: dataupv2, error: errorupv2 },
  ] = useMutation(UploadReview, {
    context: {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  console.log(dataImage);

  const upload = async () => {
    try {
      let response = await mutationUploadV2({
        variables: {
          file: dataImage,
          rating: defaultRate,
          ulasan: text,
          destination_id: data.id,
        },
      });

      console.log(response.data);
      // if (response.data) {
      //   if (response.data.update_fotoprofile_v2.code !== 200) {
      //     throw new Error(response.data.update_fotoprofile_v2.message);
      //   }
      //   let Xsetting = { ...seting.current };
      //   Xsetting.user["picture"] = response.data.update_fotoprofile_v2.path;
      //   await AsyncStorage.setItem("setting", JSON.stringify(Xsetting));

      // }
    } catch (err) {
      Alert.alert("" + err);
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
      <View
        style={{
          marginTop: 20,
          width: Dimensions.get("screen").width,
          paddingHorizontal: 15,
        }}
      >
        <Text size="title" type="bold">
          {data.name}
        </Text>
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              borderRadius: 3,
              backgroundColor: "#F4F4F4",
              padding: 2,
              marginRight: 5,
            }}
          >
            <Text size="description" type="bold">
              {data.type.name}
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          height: 150,
          marginTop: 10,
          paddingVertical: 10,
          borderBottomWidth: 1,
          borderBottomColor: "#D1D1D1",
          width: Dimensions.get("screen").width,
          paddingHorizontal: 15,
        }}
      >
        <Image
          source={{ uri: data.images[0].image }}
          height={50}
          width={100}
          style={{ height: "100%", width: "100%", borderRadius: 5 }}
        />
      </View>
      <View
        style={{
          width: Dimensions.get("screen").width,
          paddingHorizontal: 15,
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <Text size="description" type="regular" style={{ textAlign: "center" }}>
          {t("howExperience")} {data?.name} ?
        </Text>
        <View style={{ flexDirection: "row", marginTop: 10 }}>
          {maxRating.map((item, index) => {
            return (
              <Pressable onPress={() => setDefaultRate(item)} key={item}>
                {item <= defaultRate ? (
                  <StartBuleIsi
                    height={30}
                    width={30}
                    style={{ marginRight: 15 }}
                  />
                ) : (
                  <StarBlue
                    height={30}
                    width={30}
                    style={{ marginRight: 15 }}
                  />
                )}
              </Pressable>
            );
          })}
        </View>
        <Ripple
          onPress={() => setmodal(true)}
          rippleCentered={true}
          style={{
            marginTop: 20,
            borderWidth: 1,
            borderColor: "#209FAE",
            height: 50,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CameraBlue width={20} height={20} />
          <Text size="description" type="reguler" style={{ color: "#209FAE" }}>
            {t("addFoto")}
          </Text>
        </Ripple>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          // contentContainerStyle={{ paddingHorizontal: 15 }}
        >
          {dataImage.length > 0 ? (
            <View
              style={{
                marginTop: 10,
                height: 70,
                width: "100%",
                flexDirection: "row",
              }}
            >
              {dataImage.map((item, index) => {
                if (index < 3) {
                  return (
                    <Image
                      key={index}
                      source={{ uri: item.uri }}
                      style={{
                        // width: Dimensions.get("screen").width * 0.15,
                        width: Dimensions.get("screen").width * 0.22,
                        height: Dimensions.get("screen").height * 0.1,
                        marginLeft: 2,
                      }}
                    />
                  );
                } else if (index === 3 && dataImage.length > 4) {
                  return (
                    <View key={index}>
                      <Image
                        key={index}
                        source={{ uri: item.uri }}
                        style={{
                          opacity: 0.9,
                          width: Dimensions.get("screen").width * 0.22,
                          height: Dimensions.get("screen").height * 0.1,
                          opacity: 0.32,
                          marginLeft: 2,
                          backgroundColor: "#000",
                        }}
                      />
                      <Text
                        size="title"
                        type="regular"
                        style={{
                          position: "absolute",
                          right: 40,
                          alignSelf: "center",
                          color: "#FFF",
                        }}
                      >
                        {"+" + (dataImage.length - 4)}
                      </Text>
                    </View>
                  );
                } else if (index === 3) {
                  return (
                    <Image
                      key={index}
                      source={{ uri: item.uri }}
                      style={{
                        // width: Dimensions.get("screen").width * 0.15,
                        width: Dimensions.get("screen").width * 0.22,
                        height: Dimensions.get("screen").height * 0.1,
                        marginLeft: 2,
                      }}
                    />
                  );
                } else {
                  null;
                }
              })}
            </View>
          ) : null}
        </ScrollView>
      </View>
      <View
        style={{
          marginTop: 15,
          width: Dimensions.get("screen").width,
          paddingHorizontal: 15,
        }}
      >
        <Text size="label" type="bold">
          {t("shareUs")}
        </Text>
        <View
          style={{
            height: 150,
            width: "100%",
            borderWidth: 1,
            borderColor: "#D1D1D1",
            backgroundColor: "#F6F6F6",
            marginTop: 10,
          }}
        >
          <TextInput
            placeholder={t("tellUs")}
            placeholderTextColor="#464646"
            style={{ color: "#464646", margin: 5, fontSize: 14 }}
            multiline={true}
            onChangeText={(e) => setText(e)}
          ></TextInput>
        </View>
      </View>
      <View
        style={{
          marginTop: 15,
          width: Dimensions.get("screen").width,
          paddingHorizontal: 15,
          flexDirection: "row",
        }}
      >
        <CheckBox
          style={{ alignSelf: "flex-start" }}
          value={toggleCheckBox}
          onValueChange={(newValue) => setToggleCheckBox(newValue)}
        />
        <View>
          <Text size="description" type="light">
            Term and Condition
          </Text>
          <Text size="small" type="light">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vitae
            mauris
          </Text>
        </View>
      </View>
      <View
        style={{
          marginTop: 15,
          width: Dimensions.get("screen").width,
          height: 40,
          paddingHorizontal: 15,
          marginBottom: 20,
        }}
      >
        <Pressable
          onPress={() => upload()}
          disabled={!toggleCheckBox}
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#209FAE",
            borderRadius: 5,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            size="label"
            type="bold"
            style={{ color: "#FFF", marginRight: 10 }}
          >
            Send Review
          </Text>
          <PanahPutih height={20} width={20} />
        </Pressable>
        {/* <Button
          disable={tombol}
          type="icon"
          color="primary"
          size="medium"
          text="Send Review"
        >
          <PanahPutih height={20} width={20} />
        </Button> */}
      </View>
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
          <Ripple
            style={{
              paddingVertical: 10,
            }}
            onPress={() => pickcamera()}
          >
            <Text size="description" type="regular" style={{}}>
              {t("OpenCamera")}
            </Text>
          </Ripple>
          <Ripple
            style={{
              paddingVertical: 10,
            }}
            onPress={() => pickGallery()}
          >
            <Text size="description" type="regular" style={{}}>
              {t("OpenGallery")}
            </Text>
          </Ripple>
        </View>
      </Modal>
    </ScrollView>
  );
}
