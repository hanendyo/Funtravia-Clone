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
import { Button, Text } from "../../index";
import { useTranslation } from "react-i18next";
import { Arrowbackwhite, Arrowrightwhite } from "../../../assets/svg";

export default function ImageSlide({
  index,
  show,
  setClose,
  dataImage,
  name,
  location,
  props,
  token,
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
        setSlider([]), setClose();
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
              setSlider([]), setClose();
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
          <Text
            size="label"
            style={{
              color: "white",
              //   marginBottom: 15,
            }}
          >
            Photos on trip
          </Text>
          {location ? (
            <Text
              size="label"
              type="bold"
              style={{
                color: "white",
                marginBottom: 15,
              }}
            >
              {location}
            </Text>
          ) : null}
          {/* <View
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
          </View> */}
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
            // enableImageZoom={false}
            saveToLocalByLongPress={false}
            imageUrls={slider}
            onChange={(index) => handel_select(index)}
            index={inde}
            // renderFooter={(index) => (
            //   <View
            //     style={{
            //       marginTop: -30,
            //       marginBottom: 10,
            //     }}
            //   >
            //     {slider[index].by ? (
            //       <Text
            //         size="description"
            //         type="bold"
            //         style={{
            //           color: "white",
            //         }}
            //       >
            //         {t("photoBy") + " " + slider[index].by}
            //       </Text>
            //     ) : name ? (
            //       <Text
            //         size="description"
            //         type="bold"
            //         style={{
            //           color: "white",
            //         }}
            //       >
            //         {t("photoBy") + " " + name}
            //       </Text>
            //     ) : null}
            //   </View>
            // )}
          />
        ) : null}

        <View
          style={{
            height: "20%",
            width: "100%",
            backgroundColor: "black",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingBottom: 30,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              //   console.log("test");
              setClose();
              props.navigation.push("FeedStack", {
                screen: "CommentsById",
                params: {
                  post_id: dataImage[inde].id,
                  token: token,
                },
              });
            }}
            style={{
              borderWidth: 1,
              borderColor: "#ffff",
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 30,
              flexDirection: "row",
            }}
          >
            <Text
              size="label"
              style={{
                color: "#fff",
                marginRight: 10,
              }}
            >
              View photo on Fun Feed
            </Text>
            <Arrowrightwhite width={20} height={20}></Arrowrightwhite>
          </TouchableOpacity>
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
