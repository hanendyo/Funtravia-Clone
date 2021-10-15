import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import { Arrowbackwhite, Pointmapblack, Search } from "../../../assets/svg";
import Modal from "react-native-modal";
import { StatusBar, Truncate } from "../../../component";
import { useTranslation } from "react-i18next";

export default function LocationSelector({
  modals,
  setModellocation,
  masukan,
}) {
  const { t, i18n } = useTranslation();

  // console.log(modals);
  const hasil = (detail) => {
    // console.log(detail);
    masukan({
      address: detail.name + ", " + detail.address_components[2]?.short_name,
      latitude: detail.geometry.location.lat,
      longitude: detail.geometry.location.lng,
    });
  };

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
              // borderWidth: 1,
              height: 55,
              width: 55,
              position: "absolute",
              alignItems: "center",
              alignContent: "center",
              paddingTop: 20,
              // marginTop: 5,
              // top: 20,
              // left: 20,
            }}
            onPress={() => setModellocation(false)}
          >
            <Arrowbackwhite width={20} height={20} />
          </TouchableOpacity>
          <Text
            style={{
              top: 13,
              left: 55,
              fontFamily: "Lato-Regular",
              fontSize: 14,
              color: "white",
              height: 55,
              // width: 50,
              position: "absolute",
              alignItems: "center",
              alignContent: "center",
              // paddingTop: 15,
              marginTop: 7,
            }}
          >
            {t("selectLocation")}
          </Text>
        </View>
        <View
          style={{
            width: Dimensions.get("screen").width,
            // height: '100%',
            height: Dimensions.get("screen").height,
            backgroundColor: "white",
            paddingTop: 20,
            paddingHorizontal: 20,
          }}
        >
          {/* <View
                        style={{
                            marginHorizontal: 20,
                        }}> */}
          <GooglePlacesAutocomplete
            query={{
              key: "AIzaSyD4qyD449yZQ2_7AbdnUvn9PpAxCZ4wZEg",
              language: "id", // language of the results
              // components: "country:id",
            }}
            fetchDetails={true}
            // GooglePlacesDetailsQuery={{}}
            onPress={(data, details = null, search = null) => {
              setModellocation(false);
              hasil(details);
            }}
            autoFocus={true}
            listViewDisplayed="auto"
            onFail={(error) => alert(error)}
            // currentLocation={true}
            placeholder={t("findLocation")}
            // currentLocationLabel='Nearby location'
            renderLeftButton={() => {
              return (
                <View style={{ justifyContent: "center", paddingBottom: 5 }}>
                  <Search width={20} height={20} />
                </View>
              );
            }}
            GooglePlacesSearchQuery={{ rankby: "distance" }}
            enablePoweredByContainer={false}
            renderRow={(data) => {
              console.log(data);
              var x = data?.description.split(",");
              console.log(data?.description);
              return (
                <View
                  style={{
                    flexDirection: "row",
                    // height: 100,
                    alignContent: "flex-start",
                    alignItems: "flex-start",
                    // width: Dimensions.get('screen').width - 60,
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
                      // paddingBottom: 10,
                      paddingRight: 10,
                    }}
                  >
                    <Text style={{ fontFamily: "Lato-Bold", fontSize: 14 }}>
                      {x[0]}
                    </Text>
                    <Text style={{ fontFamily: "Lato-Regular", fontSize: 12 }}>
                      {data.description}
                      {/* <Truncate text={data.description} length={65} /> */}
                    </Text>
                  </View>
                </View>
              );
            }}
            styles={{
              // container: { backgroundColor: 'red' },
              textInputContainer: {
                // height: 40,
                backgroundColor: "#F4F4F4",
                borderTopWidth: 0.5,
                borderTopColor: "#FFFFFF",
                // borderBottomWidth: 0.5,
                // borderBottomColor: '#6c6c6c',
                borderRadius: 3,
                // paddingBottom: 5,
                paddingHorizontal: 10,
              },
              textInput: {
                marginLeft: 0,
                marginRight: 0,
                // height: 38,
                color: "#5d5d5d",
                fontSize: 14,
                fontFamily: "Lato-Regular",
                // borderWidth: 1,
                backgroundColor: "#F4F4F4",
                // borderColor: '#eaeaea',
              },
              predefinedPlacesDescription: {
                // color: '#646464',
              },
              listView: {
                // backgroundColor: 'red',
                // position: 'absolute',
                // height: 50,
              },
              row: {
                // height: 48,
              },
            }}
          />
        </View>
        {/* </View> */}
      </KeyboardAvoidingView>
    </Modal>
  );
}
