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
  ActivityIndicator,
  ToastAndroid,
  Platform,
} from "react-native";
import {
  Arrowbackwhite,
  Star,
  StarBlue,
  CameraBlue,
  SendReview,
  StartBuleIsi,
  PanahPutih,
  Submit,
  Arrowbackios,
} from "../../../assets/svg";
import { RNToasty } from "react-native-toasty";
import { Textarea } from "native-base";
import { Button, Text, FunImage, Loading } from "../../../component";
import Ripple from "react-native-material-ripple";
import Modal from "react-native-modal";
import { useTranslation } from "react-i18next";
import ImagePicker from "react-native-image-crop-picker";
import CheckBox from "@react-native-community/checkbox";
import UploadReview from "../../../graphQL/Mutation/Destination/Review";
import UploadReviewWithoutImgs from "../../../graphQL/Mutation/Destination/ReviewWithoutImg";
import { ReactNativeFile } from "apollo-upload-client";
import { useMutation } from "@apollo/client";
import ImageSlide from "../../../component/src/ImageSlide/index";

export default function DestinationUnescoReview(props) {
  const { t } = useTranslation();
  let [toggleCheckBox, setToggleCheckBox] = useState(false);
  let [dataImage, setDataImage] = useState([]);
  let [data] = useState(props.route.params.data);
  let [maxRating] = useState([1, 2, 3, 4, 5]);
  let [defaultRate, setDefaultRate] = useState(0);
  let [modals, setmodal] = useState(false);
  let [text, setText] = useState("");
  let [gambar, setGambar] = useState([]);
  let [modalss, setModalss] = useState(false);
  let [loading, setloading] = useState(false);

  const HeaderComponent = {
    headerShown: true,
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: (
      <Text size="header" style={{ color: "#fff" }}>
        {t("writeReview")}
      </Text>
    ),
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      fontFamily: "Lato-Regular",
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
        {Platform.OS == "ios" ? (
          <Arrowbackios height={15} width={15}></Arrowbackios>
        ) : (
          <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
        )}
      </Button>
    ),
  };

  const handleBack = () => {
    BackHandler.removeEventListener("hardwareBackPress", backAction);
    props.navigation.goBack();
    return true;
  };

  const backAction = () => {
    // console.log("platform android", Platform.OS === "android");
    if (Platform.OS === "android") {
      ToastAndroid.show("Cancelled", ToastAndroid.LONG);
    }
    return true;
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
    })
      .then((image) => {
        let tempData = [...dataImage];
        let file = new ReactNativeFile({
          uri: image.path,
          type: image.mime,
          name: "review.jpg",
        });
        tempData.splice(0, 0, file);
        setDataImage(tempData);
        setmodal(false);
      })
      .catch((err) => {
        backAction();
      });
  };

  const pickGallery = async () => {
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      cropping: true,
      cropperCircleOverlay: true,
      multiple: true,
    })
      .then((image) => {
        let tempData = [...dataImage];
        image.map((item) => {
          let file = new ReactNativeFile({
            uri: item.path,
            type: item.mime,
            name: "review.jpg",
          });
          tempData.splice(0, 0, file);
          setDataImage(tempData);
        });
        setmodal(false);
      })
      .catch((err) => {
        backAction();
      });
  };

  const [
    mutationUploadV2,
    { loading: loadingupv2, data: dataupv2, error: errorupv2 },
  ] = useMutation(UploadReview, {
    context: {
      headers: {
        "Content-Type": "multipart/form-data",
        // "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });
  const [
    mutationUpload,
    { loading: loadingup, data: dataup, error: errorup },
  ] = useMutation(UploadReviewWithoutImgs, {
    context: {
      headers: {
        // "Content-Type": "multipart/form-data",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const upload = async () => {
    setloading(true);
    if (defaultRate < 1) {
      // if (Platform.OS === "android") {
      //   ToastAndroid.show("rating harus di isi", ToastAndroid.LONG);
      // }
      setloading(false);

      RNToasty.Show({
        title: t("rattingnoempty"),
        position: "bottom",
      });
      return true;
    }
    if (dataImage.length == 0) {
      try {
        let response = await mutationUpload({
          variables: {
            rating: defaultRate,
            ulasan: text !== "" ? text : "-",
            id: data.id,
          },
        });
        if (response.data) {
          if (response.data.create_review_without_img.code !== 200) {
            throw new Error(response.data.create_review_without_img.message);
          }
          // setTimeout(async () => {
          //   await (
          //     <View style={{ marginTop: 20 }}>
          //       <ActivityIndicator />
          //     </View>
          //   );
          // }, 2000);
          setloading(false);

          await props.navigation.navigate("DestinationUnescoDetail");
        }
      } catch (err) {
        Alert.alert("" + err);
      }
    } else {
      try {
        let response = await mutationUploadV2({
          variables: {
            foto: dataImage,
            rating: defaultRate,
            ulasan: text !== "" ? text : "-",
            id: data.id,
          },
        });
        if (response.data) {
          if (response.data.create_review.code !== 200) {
            throw new Error(response.data.create_review.message);
          }
          // setTimeout(async () => {
          //   await (
          //     <View style={{ marginTop: 20 }}>
          //       <ActivityIndicator />
          //     </View>
          //   );
          // }, 2000);
          setloading(false);

          await props.navigation.navigate("DestinationUnescoDetail");
        }
      } catch (err) {
        setloading(false);

        Alert.alert("" + err);
      }
    }
  };
  let [indekk, setindekk] = useState(0);

  const ImagesSlider = async (data, indeks) => {
    setindekk(indeks);
    var tempdatas = [];
    var x = 0;

    for (var i in data) {
      let wid = 0;
      let hig = 0;
      Image.getSize(data[i].uri, (width, height) => {
        wid = width;
        hig = height;
      });
      tempdatas.push({
        key: i,
        url: data[i].uri ? data[i].uri : "",
        width: wid,
        height: hig,
        props: {
          source: data[i].uri ? data[i].uri : "",
        },
      });
      x++;
    }
    console.log("temp", tempdatas);
    await setGambar(tempdatas);
    await setModalss(true);
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
      <Loading show={loading} />
      <ImageSlide
        show={modalss}
        dataImage={gambar}
        setClose={() => setModalss(false)}
        index={indekk}
      />
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
        <FunImage
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
                console.log(item);
                if (index < 3) {
                  return (
                    <Ripple
                      key={index}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={() => ImagesSlider(dataImage, index)}
                    >
                      <Image
                        key={index}
                        source={{ uri: item.uri }}
                        style={{
                          // width: Dimensions.get("screen").width * 0.15,
                          width: Dimensions.get("screen").width * 0.22,
                          height: "100%",
                          marginLeft: 2,
                        }}
                      />
                    </Ripple>
                  );
                } else {
                  return (
                    <Ripple
                      key={index}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={() => ImagesSlider(dataImage, index)}
                    >
                      <Image
                        key={index}
                        source={{ uri: item.uri }}
                        style={{
                          opacity: 0.9,
                          width: Dimensions.get("screen").width * 0.22,
                          // height: Dimensions.get("screen").height * 0.1,
                          height: "100%",
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
                          // right: 40,
                          alignSelf: "center",
                          color: "#FFF",
                          // top: 25,
                        }}
                      >
                        {"+" + (data.images.length - 4)}
                      </Text>
                    </Ripple>
                  );
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
        {/* <View
          style={{
            height: 150,
            width: "100%",
            borderWidth: 1,
            borderColor: "#D1D1D1",
            backgroundColor: "#F6F6F6",
            marginTop: 10,
          }}
        > */}
        <Textarea
          style={{
            width: "100%",
            marginTop: 10,

            // borderRadius: 5,
            fontFamily: "Lato-Regular",
          }}
          rowSpan={5}
          placeholder={t("tellUs")}
          value={text}
          bordered
          maxLength={160}
          onChangeText={(text) => setText(text)}
        />
        {/* <TextInput
            placeholder={t("tellUs")}
            placeholderTextColor="#464646"
            style={{ color: "#464646", marginHorizontal: 5, fontSize: 12 }}
            multiline={true}
            onChangeText={(e) => setText(e)}
          ></TextInput> */}
        {/* </View> */}
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
          onCheckColor="#FFF"
          lineWidth={3}
          onFillColor="#209FAE"
          onTintColor="#209FAE"
          boxType={"square"}
          style={{
            alignSelf: "center",
            width: Platform.select({
              ios: 30,
              android: 35,
            }),
            transform: Platform.select({
              ios: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
              android: [{ scaleX: 1.3 }, { scaleY: 1.3 }],
            }),
          }}
          value={toggleCheckBox}
          onValueChange={(newValue) => setToggleCheckBox(newValue)}
        />

        <Pressable onPress={() => setToggleCheckBox(!toggleCheckBox)}>
          <Text size="description" type="light">
            Term and Condition
          </Text>
          <Text size="small" type="light">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vitae
            mauris
          </Text>
        </Pressable>
      </View>
      <View
        style={{
          marginTop: 15,
          width: Dimensions.get("screen").width,
          height: 40,
          paddingHorizontal: 15,
          marginBottom: 20,
          // opacity: toggleCheckBox ? 1 : 0.5,
        }}
      >
        <Pressable
          onPress={() => upload()}
          disabled={!toggleCheckBox}
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: toggleCheckBox ? "#209FAE" : "#f6f6f6",
            borderRadius: 5,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            size="label"
            type="bold"
            style={{
              color: toggleCheckBox ? "#FFF" : "#c7c7c7",
              marginRight: 10,
            }}
          >
            Send Review
          </Text>
          {toggleCheckBox ? (
            <PanahPutih height={20} width={20} />
          ) : (
            <Submit height={20} width={20} />
          )}
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
