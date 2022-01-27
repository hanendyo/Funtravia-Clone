import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
  Pressable,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import {
  Arrowbackios,
  Arrowbackwhite,
  Pointmapblack,
  Search,
  Xblue,
} from "../../../assets/svg";
import Modal from "react-native-modal";
import { Text } from "../../../component";
import { useTranslation } from "react-i18next";
import DeviceInfo from "react-native-device-info";
const Notch = DeviceInfo.hasNotch();

export default function LocationSelector({
  props,
  modals,
  setModellocation,
  masukan,
  datanearby,
}) {
  const { t, i18n } = useTranslation();
  let [text, setText] = useState("");

  const hasil = (detail) => {
    masukan({
      address: detail.name + ", " + detail.address_components[2]?.short_name,
      latitude: detail.geometry.location.lat,
      longitude: detail.geometry.location.lng,
    });
  };
  const hasilNearby = (detail) => {
    setModellocation(false);
    masukan({
      address: detail.name,
      latitude: detail.latitude,
      longitude: detail.longitude,
    });
  };

  let GooglePlacesRef = useRef();

  let [hieghts, setHeights] = useState(30);

  return (
    <Modal
      animationIn="slideInRight"
      animationOut="slideOutRight"
      isVisible={modals}
      onRequestClose={() => {
        setModellocation(false);
      }}
      style={{
        margin: 0,
      }}
    >
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#14646e",
        }}
      >
        {/* <StatusBar backgroundColor="#14646E" /> */}
        <StatusBar backgroundColor="#14646e" barStyle="light-content" />

        <View
          style={{
            flexDirection: "row",
            alignSelf: "flex-start",
            alignItems: "center",
            alignContent: "center",
            backgroundColor: "#209fae",
            height: 55,
            width: Dimensions.get("screen").width,
            // marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
          }}
        >
          <TouchableOpacity
            style={{
              height: 55,
              width: 55,
              alignItems: "center",
              alignContent: "center",
              paddingTop: 20,
            }}
            onPress={() => setModellocation(false)}
          >
            {Platform.OS == "ios" ? (
              <Arrowbackios height={15} width={15}></Arrowbackios>
            ) : (
              <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
            )}
          </TouchableOpacity>
          <Text size="header" type="bold" style={{ color: "#fff" }}>
            {t("selectLocation")}
          </Text>
        </View>
        <View
          onLayout={(e) => {
            let layout = e.nativeEvent.layout;
            setHeights(layout.height);
          }}
          style={{
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
            backgroundColor: "white",
            paddingHorizontal: 15,
            paddingTop: 15,
            // alignItems: "center",
            // paddingHorizontal: 20,
          }}
        >
          <GooglePlacesAutocomplete
            query={{
              key: "AIzaSyD4qyD449yZQ2_7AbdnUvn9PpAxCZ4wZEg",
              language: "id", // language of the results
              // components: "country:id",
            }}
            fetchDetails={true}
            onPress={(data, details = null, search = null) => {
              setModellocation(false);
              hasil(details);
            }}
            autoFocus={true}
            onFail={(error) => console.warn(error)}
            placeholder={t("findLocation")}
            renderLeftButton={() => {
              return (
                <View
                  style={{
                    justifyContent: "center",
                    paddingBottom: 0,
                  }}
                >
                  <Search width={20} height={20} />
                </View>
              );
            }}
            renderRightButton={() => {
              return Platform.OS == "android" ? (
                text ? (
                  <Pressable
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      width: 50,
                      marginRight: -10,
                    }}
                    onPress={() => {
                      setText("");
                      GooglePlacesRef.current.setAddressText("");
                    }}
                  >
                    <Xblue width={20} height={20} />
                  </Pressable>
                ) : null
              ) : null;
            }}
            textInputProps={{
              onChangeText: (text) => {
                setText(text);
              },
              value: text,
              clearButonMode: "never",
            }}
            GooglePlacesSearchQuery={{
              rankby: "distance",
            }}
            predefinedPlacesAlwaysVisible={true}
            setAddressText={text}
            ref={GooglePlacesRef}
            enablePoweredByContainer={false}
            renderRow={(data) => {
              data = data ? data : datanearby;
              var x = data?.description.split(",");
              return (
                <View
                  style={{
                    flexDirection: "row",
                    alignContent: "flex-start",
                    alignItems: "flex-start",
                  }}
                >
                  <View
                    style={{
                      width: 20,
                      paddingTop: 3,
                    }}
                  >
                    <Pointmapblack />
                  </View>
                  <View
                    style={{
                      width: Dimensions.get("screen").width - 60,
                      paddingRight: 10,
                    }}
                  >
                    <Text style={{ fontFamily: "Lato-Bold", fontSize: 14 }}>
                      {x[0]}
                    </Text>
                    <Text style={{ fontFamily: "Lato-Regular", fontSize: 12 }}>
                      {data.description}
                    </Text>
                  </View>
                </View>
              );
            }}
            styles={{
              textInputContainer: {
                backgroundColor: "#f1f1f1",
                height: 45,
                paddingHorizontal: 10,
                borderRadius: 5,
              },
              textInput: {
                backgroundColor: "#f1f1f1",
                fontFamily: "Lato-Regular",
                fontSize: 14,
              },
            }}
          />
        </View>
        {datanearby && datanearby.length > 0 && !text ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{
              marginTop: -hieghts + 60,
              marginHorizontal: 15,
            }}
          >
            {datanearby.map((item, index) => {
              return index < 10 ? (
                <Pressable
                  onPress={() => hasilNearby(item)}
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignContent: "flex-start",
                    alignItems: "flex-start",
                    borderBottomWidth: 0.5,
                    borderBottomColor: "#d1d1d1",
                  }}
                >
                  <View
                    style={{
                      width: 20,
                      paddingTop: 3,
                      marginLeft: 10,
                      marginTop: 10,
                    }}
                  >
                    <Pointmapblack />
                  </View>
                  <View
                    style={{
                      width: Dimensions.get("screen").width - 60,
                      paddingRight: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Lato-Bold",
                        fontSize: 14,
                        marginTop: 10,
                      }}
                    >
                      {item.name}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Lato-Regular",
                        fontSize: 12,
                        marginBottom: 10,
                      }}
                    >
                      {item.address}
                    </Text>
                  </View>
                </Pressable>
              ) : null;
            })}
          </ScrollView>
        ) : null}
      </SafeAreaView>
    </Modal>
  );
}
