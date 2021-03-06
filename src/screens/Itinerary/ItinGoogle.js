import React, { useState, useEffect } from "react";
import {
  View,
  // Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  NativeModules,
} from "react-native";
import Modal from "react-native-modal";
import { default_image } from "../../assets/png";
import {
  Arrowbackwhite,
  Star,
  PinHijau,
  PinMerah,
  Pointmapgray,
  Arrowbackios,
  Search,
} from "../../assets/svg";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import { Truncate } from "../../component";
import { Button, Text } from "../../component";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import normalize from "react-native-normalize";
import DeviceInfo from "react-native-device-info";
import { API_KEY } from "../../config";

export default function ItinGoogle(props) {
  const { t, i18n } = useTranslation();
  const Notch = DeviceInfo.hasNotch();
  const NotchAndro = NativeModules.StatusBarManager
    ? NativeModules.StatusBarManager.HEIGHT > 24
    : false;
  const deviceId = DeviceInfo.getModel();
  const HeaderComponent = {
    headerShown: true,
    title: "Destination",
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: (
      <Text size="header" style={{ color: "#fff" }}>
        {t("destination")}
      </Text>
    ),
    headerMode: "screen",
    headerStyle: {
      backgroundColor: Platform.OS == "ios" ? "#14646e" : "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      backgroundColor: Platform.OS == "ios" ? "#209fae" : null,
      width: Platform.OS == "ios" ? Dimensions.get("screen").width : null,
      height: Platform.OS == "ios" ? 45 : 45,
      textAlign: Platform.OS == "ios" ? "center" : null,
      paddingTop: Platform.OS == "ios" ? 8 : NotchAndro ? 10 : 7,
      paddingBottom: Platform.OS == "ios" ? 15 : null,
    },
    headerLeftContainerStyle: {
      background: "#FFF",
      position: "absolute",
      zIndex: 999,
      marginLeft: 10,
    },
    headerLeft: () => (
      <Button
        text={""}
        size="medium"
        type="circle"
        variant="transparent"
        onPress={() => {
          if (props.route.params.from == "choose_day_back_to_google") {
            props.navigation.push("itindest", {
              token: token,
              datadayaktif: props.route.params.datadayaktif,
              dataDes: props.route.params.dataDes,
              lat: props.route.params.lat,
              long: props.route.params.long,
              idcity: props.route.params.dataDes.itinerary_detail.city.id,
              idcountries:
                props.route.params.dataDes.itinerary_detail.country.id,
              from: "google_back_to_itin_destination",
            });
          } else {
            props.navigation.goBack();
          }
        }}
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

  let [datadayaktif, setdatadayaktif] = useState(
    props.route.params.datadayaktif
  );
  let [dataDes, setDataDes] = useState(props.route.params.dataDes);
  const token = useSelector((data) => data.token);
  let [dataMap, setDataMap] = useState(null);
  let [detailMap, setDetailMap] = useState(null);
  let [modals, setModal] = useState(false);
  let [lat, setlat] = useState(-8.65);
  let [long, setlong] = useState(115.216667);

  const GetKota = ({ data }) => {
    var filtered_array = data.address_components.filter(function(
      address_component
    ) {
      return address_component.types.includes("administrative_area_level_2");
    });
    var city = filtered_array.length ? filtered_array[0].long_name : "";
    return city;
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    if (props.route.params.lat && props.route.params.long) {
      if (props.route.params.lat !== null && props.route.params.long !== null) {
        setlat(parseFloat(props.route.params.lat));
        setlong(parseFloat(props.route.params.long));
      }
    } else {
      _requestLocation();
    }
  }, []);

  const _requestLocation = async () => {
    await navigator.geolocation.getCurrentPosition(
      (position) => {
        setlat(position.coords.latitude);
        setlong(position.coords.longitude);
      },
      (err) => console.log(err),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 10000 }
    );
  };

  return (
    <View
      style={{
        flex: 1,
        // marginTop: 100,
        height: Dimensions.get("screen").height,
        width: Dimensions.get("screen").width,
        backgroundColor: "#FFF",
      }}
    >
      <ScrollView
        contentContainerStyle={{
          width: Dimensions.get("screen").width,
          alignItems: "center",
          alignContent: "center",
          backgroundColor: "#FFF",
        }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <MapView
          style={{
            // flex: 1,
            marginTop: 10,
            width: Dimensions.get("screen").width - 20,
            marginHorizontal: 10,
            height: Dimensions.get("screen").width * 0.6,
            borderRadius: 10,
          }} //window pake Dimensions
          region={{
            latitude: detailMap ? detailMap.geometry.location.lat : lat,
            longitude: detailMap ? detailMap.geometry.location.lng : long,
            latitudeDelta: 0.007,
            longitudeDelta: 0.007,
          }}
        >
          <Marker
            coordinate={{
              latitude: detailMap ? detailMap.geometry.location.lat : lat,
              longitude: detailMap ? detailMap.geometry.location.lng : long,
            }}
            title={detailMap ? detailMap.name : "Jakarta"}
            description={
              detailMap
                ? detailMap.formatted_address
                : "Daerah Khusus Ibukota Jakarta"
            }
          />
          {/* ) : null} */}
        </MapView>
        <Button
          onPress={() => setModal(true)}
          // color={"tertiary"}
          text=""
          size="medium"
          type="circle"
          style={{
            marginTop: 10,
            paddingLeft: 15,
            width: Dimensions.get("screen").width - 20,
            borderWidth: 1,
            borderRadius: 5,
            flexDirection: "row",
            backgroundColor: "#F6F6F6",
            borderColor: "#d3d3d3",
            justifyContent: "flex-start",
          }}
        >
          <Search width={15} height={15} />
          <Text size="description" style={{ marginLeft: 10 }}>
            {t("search")}
          </Text>
        </Button>

        {detailMap ? (
          <View
            style={{
              width: "95%",
              marginVertical: 10,
              paddingVertical: 10,
              paddingHorizontal: 5,
              backgroundColor: "#FFF",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 5,
            }}
          >
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "center",
                marginBottom: 20,
              }}
            >
              <Image
                style={{
                  height: Dimensions.get("screen").width * 0.3,
                  width: Dimensions.get("screen").width * 0.3,
                  borderRadius: 10,
                  resizeMode: "cover",
                  marginRight: 20,
                }}
                source={
                  detailMap.photos && detailMap.photos[0].photo_reference
                    ? {
                        uri:
                          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=" +
                          detailMap.photos[0].photo_reference +
                          "&key=AIzaSyD4qyD449yZQ2_7AbdnUvn9PpAxCZ4wZEg",
                      }
                    : default_image
                }
              />
              <View
                style={{
                  justifyContent: "space-between",
                }}
              >
                <View>
                  <Text
                    style={{
                      // color: '#5d5d5d',
                      fontSize: 18,
                      fontFamily: "Lato-Bold",
                      width: Dimensions.get("screen").width * 0.5,
                    }}
                  >
                    {detailMap.name}
                  </Text>
                  <View style={{ flexDirection: "row" }}>
                    <PinHijau
                      height={15}
                      width={15}
                      style={{ alignSelf: "center" }}
                    />
                    <Text
                      style={{
                        width: Dimensions.get("screen").width * 0.5,
                        marginLeft: 5,
                        // color: '#5d5d5d',
                        fontSize: 14,
                        fontFamily: "Lato-Regular",
                      }}
                    >
                      <GetKota data={detailMap} />
                    </Text>
                  </View>
                </View>
                {detailMap.rating ? (
                  <View style={{ flexDirection: "row" }}>
                    <Star height={15} width={15} style={{ marginTop: 0 }} />
                    <Text
                      style={{
                        // color: '#5d5d5d',
                        marginLeft: 5,
                        fontSize: 14,
                        fontFamily: "Lato-Regular",
                      }}
                    >
                      {detailMap.rating}
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>
            <View style={{ flexDirection: "row" }}>
              <PinMerah
                height={15}
                width={15}
                style={{ alignSelf: "center" }}
              />

              <Text
                style={{
                  width: Dimensions.get("screen").width * 0.8,
                  marginLeft: 5,
                  // color: '#5d5d5d',
                  textAlign: "justify",
                  fontSize: 12,
                  fontFamily: "Lato-Regular",
                }}
              >
                {detailMap.formatted_address}
              </Text>
            </View>
            <Button
              text={t("addToPlan")}
              onPress={() => {
                props.navigation.push("ItineraryStack", {
                  screen: "ItineraryChooseday",
                  params: {
                    Iditinerary: dataDes.itinerary_detail.id,
                    Kiriman: detailMap,
                    token: token,
                    Position: "google",
                    datadayaktif: datadayaktif,
                    dataDes: dataDes,
                    from: "after_choose_day",
                  },
                });
              }}
              style={{
                marginVertical: 20,

                width: Dimensions.get("screen").width - 40,
              }}
            ></Button>
          </View>
        ) : null}
      </ScrollView>
      <Modal
        onRequestClose={() => setModal(false)}
        animationIn="slideInRight"
        animationOut="slideOutRight"
        isVisible={modals}
        hasBackdrop={false}
        style={{
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
              // alignContent: "center",
              backgroundColor: "#209fae",
              height:
                Platform.OS === "ios"
                  ? normalize(45)
                  : deviceId == "LYA-L29"
                  ? normalize(67)
                  : NotchAndro
                  ? normalize(55)
                  : normalize(55),
              width: Dimensions.get("screen").width,
              // marginBottom: 20,
              marginTop: Platform.OS === "ios" ? (Notch ? 25 : 0) : -26,
            }}
          >
            <TouchableOpacity
              style={{
                // borderWidth: 1,
                height: 50,
                width: 50,
                position: "absolute",
                alignItems: "center",
                alignContent: "center",
                paddingTop: 18,
                // top: 20,
                // left: 20,
              }}
              onPress={() => setModal(false)}
            >
              {Platform.OS == "ios" ? (
                <Arrowbackios height={15} width={15}></Arrowbackios>
              ) : (
                <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
              )}
            </TouchableOpacity>
            <Text
              size="header"
              style={{
                top:
                  Platform.OS == "ios"
                    ? Notch
                      ? 10
                      : 9
                    : deviceId == "LYA-L29"
                    ? 22
                    : NotchAndro
                    ? 19
                    : 19,
                left: Platform.OS == "ios" ? (Notch ? 130 : 120) : 55,
                color: "white",
                height: 50,
                // width: 50,
                position: "absolute",
                alignItems: "center",
                alignContent: "center",
                // paddingTop: 15,
              }}
            >
              {t("findDestination")}
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
              paddingBottom: 20,
            }}
          >
            {/* <View
                        style={{
                            marginHorizontal: 20,
                        }}> */}
            <GooglePlacesAutocomplete
              style={{}}
              query={{
                key: API_KEY,
                language: t("googleLocationLang"), // language of the results
                // components: 'country:id',
              }}
              fetchDetails={true}
              // GooglePlacesDetailsQuery={{}}
              onPress={(data, details = null, search = null) => {
                setDataMap(data);
                setDetailMap(details);
                setModal(false);
              }}
              autoFocus={true}
              listViewDisplayed="auto"
              onFail={(error) => console.log(error)}
              currentLocation={true}
              placeholder={t("SearchForLocation")}
              currentLocationLabel="Nearby location"
              renderLeftButton={() => {
                return (
                  <View style={{ justifyContent: "center" }}>
                    <Pointmapgray />
                  </View>
                );
              }}
              GooglePlacesSearchQuery={{ rankby: "distance" }}
              enablePoweredByContainer={false}
              renderRow={(data) => {
                if (data.description) {
                  var x = data.description.split(",");
                }
                return (
                  <View
                    style={{
                      flexDirection: "row",
                      // height: 70,
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
                      <Pointmapgray />
                    </View>
                    <View
                      style={{ width: Dimensions.get("screen").width - 60 }}
                    >
                      <Text style={{ fontFamily: "Lato-Bold", fontSize: 12 }}>
                        {/* {x[0]} */}
                        {x ? x[0] : data.name}
                      </Text>
                      <Text
                        style={{ fontFamily: "Lato-Regular", fontSize: 12 }}
                      >
                        <Truncate
                          text={
                            data.description ? data.description : data.vicinity
                          }
                          length={65}
                        />
                      </Text>
                    </View>
                  </View>
                );
              }}
              styles={{
                // container: { backgroundColor: 'red' },
                textInputContainer: {
                  height: 40,
                  backgroundColor: "#f4f4f4",
                  borderWidth: 0.5,
                  borderColor: "#6c6c6c",
                  borderRadius: 5,
                  paddingBottom: 5,
                  paddingHorizontal: 10,
                },
                textInput: {
                  marginLeft: 0,
                  marginRight: 0,
                  height: 38,
                  color: "#5d5d5d",
                  fontSize: 14,
                  fontFamily: "Lato-Regular",
                  // borderWidth: 1,
                  backgroundColor: "#f4f4f4",
                  borderColor: "#eaeaea",
                },
                predefinedPlacesDescription: {
                  color: "#646464",
                },
                listView: {
                  // backgroundColor: 'red',
                  // position: 'absolute',
                  // height: 50,
                },
                row: {
                  height: 48,
                },
              }}
            />
          </View>
          {/* </View> */}
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    // flex: 1,
    // marginTop: 20,
    // paddingTop: (50),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  ImageView: {
    // width: (110),
    // height: (110),
    // marginRight: (5),
    borderRadius: 10,
    backgroundColor: "rgba(0, 0, 0, 0)",
    // opacity: 0.4,
    // elevation: 1,
  },
  Image: {
    resizeMode: "cover",
    borderRadius: 10,
  },
});
