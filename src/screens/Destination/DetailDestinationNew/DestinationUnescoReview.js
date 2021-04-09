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
} from "react-native";
import {
  Arrowbackwhite,
  Star,
  StarBlue,
  CameraBlue,
  SendReview,
} from "../../../assets/svg";
import { Button, Text } from "../../../component";
import Ripple from "react-native-material-ripple";
import Modal from "react-native-modal";
import { useTranslation } from "react-i18next";
import ImagePicker from "react-native-image-crop-picker";
import CheckBox from "@react-native-community/checkbox";

export default function DestinationUnescoReview(props) {
  const { t } = useTranslation();
  let [toggleCheckBox, setToggleCheckBox] = useState(false);
  let [dataImage, setDataImage] = useState([]);
  let [data] = useState(props.route.params.data);
  let [maxRating] = useState([1, 2, 3, 4, 5]);
  let [defaultRate, setDefaultRate] = useState(0);
  let [modals, setmodal] = useState(false);
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
    console.log("testkamera");
    ImagePicker.openCamera({
      width: 500,
      height: 500,
      cropping: true,
      multiple: true,
    }).then((image) => {
      console.log(image);
      let tempData = [...dataImage];
      tempData.splice(0, 0, image);
      setDataImage(tempData);
      BackHandler.addEventListener("hardwareBackPress", backAction);
      setmodal(false);
    });
  };

  const pickGallery = async () => {
    console.log("testGalery");
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      cropping: true,
      cropperCircleOverlay: true,
      multiple: true,
    }).then((image) => {
      console.log(image);
      let tempData = [...dataImage];
      image.map((item) => tempData.splice(0, 0, item));
      setDataImage(tempData);
      setmodal(false);
    });
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
                  <Star height={30} width={30} style={{ marginRight: 15 }} />
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
              {dataImage.map((item, index) => (
                <Image
                  key={index}
                  source={{ uri: item?.path }}
                  style={{ height: "100%", width: 70, marginRight: 5 }}
                />
              ))}
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
          paddingHorizontal: 15,
          marginBottom: 30,
        }}
      >
        <Button
          onPress={() => null}
          type="icon"
          color="secondary"
          size="medium"
          text="Send Review"
          style={{
            borderRadius: Dimensions.get("screen").width * 0.7,
            // alignSelf: "center",
          }}
        >
          <SendReview
            height={20}
            width={20}
            // style={{ zIndex: 3, borderWidth: 5 }}
          />
        </Button>
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
