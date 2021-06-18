import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  // Modal,
} from "react-native";
import Modal from "react-native-modal";

import { back_arrow_white, next_putih, prev_putih } from "../../../assets/png";
import ImageViewer from "react-native-image-zoom-viewer";
import { Button, Text, FunImage, FunVideo } from "../../index";
import { useTranslation } from "react-i18next";
import { Arrowbackwhite } from "../../../assets/svg";

export default function ImageSlide({
  index,
  show,
  setClose,
  dataImage,
  name,
  location,
}) {
  const { t, i18n } = useTranslation();
  // var slidep = useRef(null);
  let [slider, setSlider] = useState([]);
  let [inde, setIn] = useState(0);
  let [preIn, setPreIn] = useState(null);

  // console.log(slider);

  const handel_select = async (index) => {
    // slidep.current.scrollToIndex({ animated: true, index: index });
    var tempdata = [...slider];
    for (var x of tempdata) {
      x.selected = false;
    }
    tempdata[index].selected = true;
    setSlider([]);
    await setIn(index);
    await setSlider(tempdata);
  };

  const handel_next = async () => {
    if (inde < slider.length - 1) {
      // 	var i = inde + 1;
      // 	var tempdata = [...slider];
      // 	for (var x of tempdata) {
      // 		x.selected = false;
      // 	}
      // 	// slide.current.scrollToIndex(true);
      // 	tempdata[i].selected = true;
      // 	setSlider(tempdata);
      setIn(inde + 1);
    }
  };

  const handel_prev = async () => {
    // if (this.props.animation) {
    // 	LayoutAnimation.configureNext(LayoutAnimation.Presets.easeIn);
    // }
    if (inde > 0) {
      // 	var i = inde - 1;
      // 	var tempdata = [...slider];
      // 	for (var x of tempdata) {
      // 		x.selected = false;
      // 	}
      // 	tempdata[i].selected = true;
      // 	setSlider(tempdata);
      setIn(inde - 1);
    }
  };

  return (
    <Modal
      onRequestClose={() => {
        setSlider([]), setClose(), setIn(0);
      }}
      onBackdropPress={() => {
        setSlider([]), setClose(), setIn(0);
      }}
      onDismiss={() => {
        setSlider([]), setClose(), setIn(0);
      }}
      onShow={() => {
        dataImage && dataImage.length > 0 ? setSlider(dataImage) : null;
        index ? setIn(index) : null;
      }}
      animationIn="slideInRight"
      animationOut="slideOutRight"
      isVisible={show}
      style={{
        margin: 0,
        // backgroundColor: 'rgba(0, 0, 0, 0.25)',
        justifyContent: "flex-end",
        alignItems: "center",
        alignSelf: "center",
        alignContent: "center",
      }}
    >
      <KeyboardAvoidingView
        style={{
          flex: 1,
          width: Dimensions.get("screen").width,
          // height: '100%',
          height: Dimensions.get("screen").height,
          backgroundColor: "black",
        }}
        // behavior={Platform.OS === 'ios' ? 'position' : null}
        // keyboardVerticalOffset={30}
        enabled
      >
        <View
          style={{
            height: 55,
            backgroundColor: "black",
            marginTop: 10,
          }}
        >
          <Button
            type="circle"
            variant="transparent"
            onPress={() => {
              setSlider([]), setClose(), setIn(0);
            }}
          >
            <Arrowbackwhite height={20} width={20} />
          </Button>
        </View>
        <View
          style={{
            backgroundColor: "black",
            alignItems: "center",
            // marginBottom: 5,
          }}
        >
          {location ? (
            <Text
              size="description"
              style={{
                color: "white",
                marginBottom: 15,
              }}
            >
              {location}
            </Text>
          ) : null}
          <View
            style={{
              backgroundColor: "#209FAE",
              width: Dimensions.get("screen").width * 0.25,
              height: 30,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 15,
              opacity: 0.5,
              marginBottom: 5,
            }}
          >
            <Text
              size="description"
              type="bold"
              style={{
                color: "white",
                paddingHorizontal: 10,
              }}
            >
              {slider.length} Photos
            </Text>
          </View>
        </View>
        {slider.length > 0 ? (
          <ImageViewer
            renderIndicator={() => <View></View>}
            renderArrowLeft={() => (
              <TouchableOpacity
                style={{
                  height: 30,
                  width: 30,
                  borderRadius: 15,
                  backgroundColor: "rgba(240, 240, 240, 0.5)",
                  alignItems: "center",
                  alignContent: "center",
                  justifyContent: "center",
                  marginLeft: 15,
                }}
                onPress={() => {
                  handel_prev();
                }}
              >
                <Image
                  style={{
                    resizeMode: "contain",
                    height: 15,
                    width: 15,
                    marginRight: 5,
                  }}
                  source={prev_putih}
                />
              </TouchableOpacity>
            )}
            renderArrowRight={() => (
              <TouchableOpacity
                style={{
                  height: 30,
                  width: 30,
                  borderRadius: 15,
                  backgroundColor: "rgba(240, 240, 240, 0.5)",
                  alignItems: "center",
                  alignContent: "center",
                  justifyContent: "center",
                  marginRight: 15,
                }}
                onPress={() => handel_next()}
              >
                <Image
                  style={{
                    resizeMode: "contain",
                    height: 15,
                    width: 15,
                    marginLeft: 5,
                  }}
                  source={next_putih}
                />
              </TouchableOpacity>
            )}
            renderImage={(data) => {
              console.log(data.type);
              console.log(data?.source?.uri);
              console.log({
                width: data?.style?.width,
                height: data?.style?.height,
              });
              return data.type === "video" ? (
                <FunVideo
                  // poster={data.uri.replace("output.m3u8", "thumbnail.png")}
                  // paused={true}
                  key={"video" + data.id}
                  source={{ uri: data?.source?.uri }}
                  muted={true}
                  // defaultSource={default_image}
                  style={{
                    width: data?.style?.width,
                    height: data?.style?.height,
                    // marginRight: 2.5,
                    // marginBottom: 2.5,
                    // backgroundColor: "#f6f6f6",
                    // justifyContent: "center",
                    // alignItems: "center",
                    // resizeMode: "cover",
                  }}
                />
              ) : (
                <FunImage
                  key={"image" + data.id}
                  source={{ uri: data?.source?.uri }}
                  // defaultSource={default_image}
                  style={{
                    width: data?.style?.width,
                    height: data?.style?.height,

                    // marginRight: 2.5,
                    // marginBottom: 2.5,
                    // backgroundColor: "#f6f6f6",
                    // justifyContent: "center",
                    // alignItems: "center",
                    // resizeMode: "cover",
                  }}
                />
              );
            }}
            // enableImageZoom={false}
            saveToLocalByLongPress={false}
            imageUrls={slider}
            onChange={(index) => handel_select(index)}
            index={inde}
            renderFooter={(index) => (
              <View
                style={{
                  marginTop: -30,
                  marginBottom: 10,
                }}
              >
                {slider[index].by ? (
                  <Text
                    size="description"
                    type="bold"
                    style={{
                      color: "white",
                    }}
                  >
                    {t("photoBy") + " " + slider[index].by}
                  </Text>
                ) : name ? (
                  <Text
                    size="description"
                    type="bold"
                    style={{
                      color: "white",
                    }}
                  >
                    {t("photoBy") + " " + name}
                  </Text>
                ) : null}
              </View>
            )}
          />
        ) : null}

        <View
          style={{
            height: "20%",

            backgroundColor: "black",
          }}
        >
          {/* {console.log(slider)} */}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  customSlide: {
    width: 110,
    height: 110,
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  customImage: {
    width: 110,
    height: 110,
    resizeMode: "cover",
  },
});
