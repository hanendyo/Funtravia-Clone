import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import {
  Arrowbackios,
  Arrowbackwhite,
  Pointmapblack,
  Search,
  Xblue,
} from "../../../assets/svg";
import Modal from "react-native-modal";
import { StatusBar, Truncate, Text } from "../../../component";
import { useTranslation } from "react-i18next";

export default function LocationSelector({
  modals,
  setModellocation,
  masukan,
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

  let GooglePlacesRef = useRef();

  return (
    <Modal
      animationIn="slideInRight"
      animationOut="slideOutRight"
      isVisible={modals}
      onRequestClose={() => {
        setModellocation(false);
      }}
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        alignSelf: "center",
        alignContent: "center",
      }}
    >
      {/* <StatusBar backgroundColor="#14646E" /> */}
      <KeyboardAvoidingView
        style={{
          flex: 1,
          width: Dimensions.get("screen").width,
          height: Dimensions.get("screen").height,
        }}
        // behavior={Platform.OS === 'ios' ? 'position' : null}
        // keyboardVerticalOffset={30}
        enabled
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
            marginTop: Platform.OS === "ios" ? 30 : -21,
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
          style={{
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
            backgroundColor: "white",
            paddingHorizontal: 15,
            paddingTop: 15,
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
            // listViewDisplayed="auto"
            onFail={(error) => alert(error)}
            placeholder={t("findLocation")}
            renderLeftButton={() => {
              return (
                <View
                  style={{
                    justifyContent: "center",
                    paddingBottom: 5,
                  }}
                >
                  <Search width={20} height={20} />
                </View>
              );
            }}
            renderRightButton={() => {
              return text ? (
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
              ) : null;
            }}
            textInputProps={{
              onChangeText: (text) => {
                setText(text);
              },
              value: text,
            }}
            GooglePlacesSearchQuery={{ rankby: "distance" }}
            setAddressText={text}
            ref={GooglePlacesRef}
            enablePoweredByContainer={false}
            renderRow={(data) => {
              var x = data?.description.split(",");
              return (
                <View
                  style={{
                    flexDirection: "row",
                    alignContent: "flex-start",
                    alignItems: "flex-start",
                    borderWidth: 0,
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
              borderWidth: 1,
              textInputContainer: {
                backgroundColor: "#f6f6f6",
                borderTopWidth: 0,
                borderTopColor: "#FFFFFF",
                borderRadius: 5,
                paddingHorizontal: 10,
              },
              textInput: {
                marginLeft: 0,
                marginRight: 0,
                height: 35,
                color: "#464646",
                fontSize: 14,
                fontFamily: "Lato-Regular",
                backgroundColor: "#f6f6f6",
              },
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
