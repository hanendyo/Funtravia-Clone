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
  let [slider, setSlider] = useState([]);
  let [inde, setIn] = useState(0);
  let [preIn, setPreIn] = useState(null);

  const handel_select = async (index) => {
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
      setIn(inde + 1);
    }
  };

  const handel_prev = async () => {
    if (inde > 0) {
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
          height: Dimensions.get("screen").height,
          backgroundColor: "black",
        }}
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
          }}
        >
          <Text
            size="label"
            style={{
              color: "white",
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
            saveToLocalByLongPress={false}
            imageUrls={slider}
            onChange={(index) => handel_select(index)}
            index={inde}
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
              setSlider([]), setClose(), setIn(0);
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