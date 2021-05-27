import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import React, { useState, useEffect } from "react";
import {
  View,
  Dimensions,
  Platform,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Arrowbackwhite, Select } from "../../../assets/svg";
import Modal from "react-native-modal";
import { FunImage, Text } from "../../../component";
import { useTranslation } from "react-i18next";
import {
  MenuContext,
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers,
  MenuProvider,
} from "react-native-popup-menu";
import ChooseDay from "./ChooseDay";

export default function Album({ modals, setModalAlbum }) {
  let { width, height } = Dimensions.get("screen");
  const { t, i18n } = useTranslation();
  const [select, setSelect] = useState("Itinerary Album");
  const [album, setAlbum] = useState("");
  const [modalDay, setModalDay] = useState(false);

  let dataSatu = [
    { image: null, title: "Album 1", description: "10 photos" },
    { image: null, title: "Album 2", description: "30 photos" },
    { image: null, title: "Album 3", description: "50 photos" },
    { image: null, title: "Album 4", description: "20 photos" },
    { image: null, title: "Album 5", description: "20 photos" },
    { image: null, title: "Album 6", description: "40 photos" },
    { image: null, title: "Album 7", description: "20 photos" },
    { image: null, title: "Album 8", description: "20 photos" },
    { image: null, title: "Album 9", description: "40 photos" },
    { image: null, title: "Album 10", description: "20 photos" },
    { image: null, title: "Album 11", description: "20 photos" },
    { image: null, title: "Album 12", description: "40 photos" },
  ];
  let dataDua = [
    { image: null, title: "Album 1", description: "10 photos" },
    { image: null, title: "Album 4", description: "20 photos" },
    { image: null, title: "Album 5", description: "20 photos" },
    { image: null, title: "Album 6", description: "40 photos" },
    { image: null, title: "Album 2", description: "30 photos" },
    { image: null, title: "Album 3", description: "50 photos" },
  ];

  const Choose = (albums) => {
    setAlbum(albums);
    setModalDay(true);
  };

  return (
    <Modal
      animationIn="slideInRight"
      animationOut="slideOutRight"
      isVisible={modals}
      onRequestClose={() => {
        setModalAlbum(false);
      }}
      style={{
        // justifyContent: "flex-end",
        // alignItems: "center",
        alignSelf: "center",
        // alignContent: "center",
      }}
    >
      <View
        style={{
          flex: 1,
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
            marginTop: Platform.OS === "ios" ? 0 : -21,
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
            onPress={() => setModalAlbum(false)}
          >
            <Arrowbackwhite width={20} height={20} />
          </TouchableOpacity>
          <View
            style={{
              top: 0,
              left: 60,
              height: 50,
              // position: "absolute",
              justifyContent: "center",
              marginTop: 5,
            }}
          >
            <Text size="label" type="regular" style={{ color: "#FFF" }}>
              Post
            </Text>
            <Text size="description" type="light" style={{ color: "#FFF" }}>
              {`${t("Select") + " Album"}`}
            </Text>
          </View>
        </View>
        <View
          style={{
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
            // height: 300,
            backgroundColor: "white",
          }}
        >
          <View
            style={{
              width: Dimensions.get("screen").width,
              // height: 150,

              height: height - 130,
            }}
          >
            <MenuProvider>
              <Menu
                renderer={renderers.ContextMenu}
                style={{
                  width: width,
                  paddingHorizontal: 15,
                }}
              >
                <MenuTrigger
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 15,
                    width: 150,
                    borderRadius: 10,
                  }}
                >
                  <Text size="description" type="regular">
                    {select ? select : "Feed Album"}
                  </Text>
                  <Select height="10" width="10" style={{ marginLeft: 5 }} />
                </MenuTrigger>
                <MenuOptions
                  optionsContainerStyle={{
                    // paddingBottom: 50,
                    height: 50,
                    // marginBottom: 10,
                  }}
                >
                  <MenuOption onSelect={() => setSelect("Itinerary Album")}>
                    <Text size="description" type="regular">
                      Itinerary Album
                    </Text>
                  </MenuOption>
                  <MenuOption onSelect={() => setSelect("Feed Album")}>
                    <Text size="description" type="regular">
                      Feed Album
                    </Text>
                  </MenuOption>
                </MenuOptions>
              </Menu>
              <View
                style={{
                  borderBottomColor: 10,
                  width: width,
                  height: 1,
                  opacity: 0.1,
                  backgroundColor: "#000",
                }}
              ></View>
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={{
                  // flex: 1,
                  borderBottomColor: 10,
                  width: width,
                  paddingHorizontal: 15,
                  backgroundColor: "#FFF",
                  marginVertical: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                  }}
                >
                  {select === "Itinerary Album"
                    ? dataSatu.map((item, index) => (
                        <Pressable
                          key={index}
                          style={{
                            marginTop: 10,
                            width: (width - 30) / 3,
                            // borderWidth: 1,
                          }}
                          onPress={() => Choose(item?.title)}
                        >
                          <View
                            style={{
                              height: 130,
                              width: "98%",
                              backgroundColor: "#F6F6F6",
                              justifyContent: "center",
                              alignItems: "center",
                              borderRadius: 5,
                            }}
                          >
                            {/* <FunImage source={{}} /> */}
                          </View>
                          <View style={{ paddingLeft: 5, marginTop: 10 }}>
                            <Text size="label" type="regular">
                              {item.title}
                            </Text>
                            <Text size="description" type="light">
                              {item.description}
                            </Text>
                          </View>
                        </Pressable>
                      ))
                    : dataDua.map((item, index) => (
                        <Pressable
                          key={index}
                          style={{
                            marginTop: 10,
                            width: (width - 30) / 3,
                            // borderWidth: 1,
                          }}
                        >
                          <View
                            style={{
                              height: 130,
                              width: "98%",
                              backgroundColor: "#F6F6F6",
                              justifyContent: "center",
                              alignItems: "center",
                              borderRadius: 5,
                            }}
                          >
                            {/* <FunImage source={{}} /> */}
                          </View>
                          <View style={{ paddingLeft: 5, marginTop: 10 }}>
                            <Text size="label" type="regular">
                              {item.title}
                            </Text>
                            <Text size="description" type="light">
                              {item.description}
                            </Text>
                          </View>
                        </Pressable>
                      ))}
                </View>
              </ScrollView>
            </MenuProvider>
          </View>
        </View>
      </View>
      <ChooseDay
        modals={modalDay}
        setModalDay={(e) => setModalDay(e)}
        albums={album}
      />
    </Modal>
  );
}