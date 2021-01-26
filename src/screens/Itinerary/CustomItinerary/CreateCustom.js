import React, { useState, useEffect } from "react";
import {
  View,
  Dimensions,
  Alert,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import Modal from "react-native-modal";
import { useMutation } from "@apollo/react-hooks";
import { CheckBox, Item, Label, Input, Textarea, Picker } from "native-base";
import { Truncate } from "../../../component";
import {
  Arrowbackwhite,
  Xhitam,
  Pointmapgray,
  Bottom,
} from "../../../assets/svg";
import SaveCustom from "../../../graphQL/Mutation/Itinerary/Savecustom";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useTranslation } from "react-i18next";
import { Button, Text } from "../../../component";
export default function CreateCustom(props) {
  const HeaderComponent = {
    headerShown: true,
    title: "Custom Activity",
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: "Custom Activity",
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      fontFamily: "Lato-Bold",
      fontSize: 14,
      color: "white",
    },
    headerLeftContainerStyle: {
      background: "#FFF",

      marginLeft: 10,
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

  const { t, i18n } = useTranslation();
  let [modals, setModal] = useState(false);
  let [modaldate, setModaldate] = useState(false);
  let [cheked, setcheck] = useState(false);
  let token = props.route.params.token;
  let idItin = props.route.params.idItin;
  let idDay = props.route.params.idDay;
  let itintitle = props.route.params.itintitle;
  let dateitin = props.route.params.dateitin;
  let datatimeline = props.route.params.datatimeline;
  let jammax = props.route.params.jammax;
  let datadayaktif = props.route.params.datadayaktif;
  let [title, setTitle] = useState("");
  let [Address, setAddress] = useState("");
  let [Lat, setLat] = useState("");
  let [Long, setLong] = useState("");
  let [DetailAddress, setDetailAddress] = useState("");
  let [hour, sethour] = useState(1);
  let [minutes, setMinutes] = useState(0);
  let [validate, setValidate] = useState({
    tittle: true,
    duration: true,
    address: true,
    detail: true,
  });
  const jam = [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
  ];
  const menit = [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    46,
    47,
    48,
    49,
    50,
    51,
    52,
    53,
    54,
    55,
    56,
    57,
    58,
    59,
  ];

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    // const unsubscribe = props.navigation.addListener("focus", () => {
    //   loadAsync();
    // });
    // return unsubscribe;
  }, [props.navigation]);

  const [
    mutationSaved,
    { loading: loadingSaved, data: dataSaved, error: errorSaved },
  ] = useMutation(SaveCustom, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const validation = (name, value) => {
    if (name === "tittle") {
      return value.length >= 6 ? true : false;
    } else if (name === "address") {
      return value.length >= 2 ? true : false;
    } else if (name === "detail") {
      return value.length >= 8 ? true : false;
    } else {
      return true;
    }
  };

  const masukan = (detail) => {
    setAddress(detail.name);
    setLat(detail.geometry.location.lat);
    setLong(detail.geometry.location.lng);
    setDetailAddress(detail.formatted_address);
  };

  const onChange = (name, detail) => (text) => {
    let check = validation(name, text);

    if (name === "tittle") {
      setTitle(text);
    }
    if (name === "address") {
      setAddress(text);
    }
    if (name === "detail") {
      setDetailAddress(text);
    }

    setValidate({
      ...validate,
      [name]: check,
    });
  };

  const _Next = async () => {
    // console.log(hour + ':' + minutes);
    if (cheked === true) {
      try {
        let response = await mutationSaved({
          variables: {
            title: title,
            icon: "i-tour",
            qty: 1,
            address: DetailAddress,
            latitude: Lat,
            longitude: Long,
            note: "",
            time: "00:00:00",
            duration: hour + ":" + minutes + ":00",
            total_price: 0,
          },
        });

        if (errorSaved) {
          throw new Error("Error Input");
        }
        // console.log(response.data.save_custom);
        if (response.data) {
          if (response.data.save_custom.code !== 200) {
            throw new Error(response.data.save_custom.message);
          } else {
            props.navigation.navigate("ChoosePosition", {
              idItin: idItin,
              idDay: idDay,
              token: token,
              datatimeline: datatimeline,
              jammax: jammax,
              dataCustom: {
                __typename: "ListSavedActivity",
                address: DetailAddress,
                duration: hour + ":" + minutes + ":00",
                icon: "i-tour",
                images: null,
                latitude: Lat,
                longitude: Long,
                note: "",
                qty: 1,
                time: "00:00:00",
                title: title,
                total_price: 0,
              },
              itintitle: itintitle,
              dateitin: dateitin,
            });
            // Alert.alert('Succes');
          }
        }
      } catch (error) {
        Alert.alert("" + error);
      }
    } else {
      props.navigation.navigate("ChoosePosition", {
        idItin: idItin,
        idDay: idDay,
        token: token,
        datatimeline: datatimeline,
        dataCustom: {
          __typename: "ListSavedActivity",
          address: DetailAddress,
          duration: hour + ":" + minutes,
          icon: "i-tour",
          images: null,
          latitude: Lat,
          longitude: Long,
          note: "",
          qty: 1,
          time: "00:00",
          title: title,
          total_price: 0,
        },
        itintitle: itintitle,
        dateitin: dateitin,
      });
      // console.log('none saved');
    }
  };

  return (
    <View
      style={{
        // marginTop: 70,
        flex: 1,
        width: Dimensions.get("screen").width,
        height: Dimensions.get("screen").height,
      }}
    >
      <View
        style={{
          // position: 'absolute',
          top: 0,
          left: 0,
          width: Dimensions.get("screen").width,
          height: Dimensions.get("screen").width * 0.3,
          backgroundColor: "#f3f3f3",
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          {/* garis .................................. */}
          <View
            style={{
              marginTop: -35,
              flexDirection: "row",
              width: Dimensions.get("screen").width - 140,
              justifyContent: "space-between",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: "50%",
                borderTopColor: "#209fae",
                borderTopWidth: 0.5,
              }}
            ></View>
            <View
              style={{
                width: "50%",
                borderTopColor: "#646464",
                borderTopWidth: 0.5,
              }}
            ></View>
          </View>
          {/* garis .................................. */}

          <View
            style={{
              position: "absolute",
              width: Dimensions.get("screen").width - 40,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View style={{ alignContent: "center", alignItems: "center" }}>
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  borderWidth: 0.5,
                  borderColor: "#209fae",
                  backgroundColor: "#209fae",
                  alignItems: "center",
                  alignContent: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  size="description"
                  type="regular"
                  style={{
                    color: "white",
                  }}
                >
                  1
                </Text>
              </View>
              <Text
                size="small"
                type="bold"
                style={{
                  marginTop: 5,
                  textAlign: "center",
                  width: 100,

                  color: "#209fae",
                }}
              >
                {t("addCustomActivity")}
              </Text>
            </View>
            <View style={{ alignContent: "center", alignItems: "center" }}>
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  borderWidth: 0.5,

                  borderColor: "#209fae",
                  backgroundColor: "#209fae",
                  alignItems: "center",
                  alignContent: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  size="description"
                  type="regular"
                  style={{
                    color: "white",
                  }}
                >
                  2
                </Text>
              </View>
              <Text
                size="small"
                type="bold"
                style={{
                  marginTop: 5,
                  textAlign: "center",
                  width: 100,

                  color: "#209fae",
                }}
              >
                {t("inputdestinationdetail")}
              </Text>
            </View>
            <View style={{ alignContent: "center", alignItems: "center" }}>
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  borderWidth: 0.5,
                  borderColor: "#646464",
                  backgroundColor: "#f3f3f3",
                  alignItems: "center",
                  alignContent: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  size="description"
                  type="regular"
                  style={{
                    fontFamily: "Lato-Regular",
                  }}
                >
                  3
                </Text>
              </View>
              <Text
                size="small"
                type="regular"
                style={{
                  marginTop: 5,
                  textAlign: "center",
                  width: 100,
                }}
              >
                {t("selectitinerary")}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <ScrollView>
        <View style={{ width: Dimensions.get("screen").width, padding: 20 }}>
          <Text
            size="title"
            type="bold"
            style={{
              width: Dimensions.get("screen").width * 0.65,
            }}
          >
            {t("inputdestinationdetail")}
          </Text>

          <View
            style={{
              width: Dimensions.get("screen").width - 40,
              // paddingHorizontal: 20,
            }}
          >
            <Item
              floatingLabel
              style={{
                marginTop: 5,
              }}
            >
              <Label
                style={{
                  fontFamily: "Lato-Regular",
                  fontSize: 12,
                }}
              >
                {t("title")}
              </Label>
              <Input
                style={{
                  fontFamily: "Lato-Regular",
                  fontSize: 14,
                }}
                autoCorrecttitle={false}
                value={title}
                onChangeText={onChange("tittle")}
                keyboardType="default"
              />
            </Item>
            {validate.tittle === false ? (
              <Text
                size="small"
                type="regular"
                style={{
                  color: "#D75995",

                  position: "absolute",
                  bottom: -15,
                }}
              >
                {t("Entertitle")}
              </Text>
            ) : null}
          </View>
          <View
            style={{
              width: Dimensions.get("screen").width - 40,
              flexDirection: "row",
              paddingVertical: 20,
              justifyContent: "space-between",
              alignItems: "center",
              alignContent: "center",
              // borderWidth: 1,
            }}
          >
            <Text size="label" type="bold" style={{}}>
              {t("duration")}
            </Text>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                onPress={() => {
                  setModaldate(true);
                }}
              >
                <Text>
                  {hour < 10 ? "0" + hour : hour} {t("hours")}
                  {" : "}
                  {minutes < 10 ? "0" + minutes : minutes} {t("minutes")}
                </Text>
              </TouchableOpacity>
            </View>
            <Modal
              onRequestClose={() => setModaldate(false)}
              onBackdropPress={() => setModaldate(false)}
              animationIn="fadeIn"
              animationOut="fadeOut"
              isVisible={modaldate}
              style={{
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center",
                alignContent: "center",
              }}
            >
              <View
                style={{
                  width: Dimensions.get("screen").width - 20,
                  backgroundColor: "white",
                  marginBottom: 70,
                  paddingTop: 60,
                  paddingHorizontal: 20,
                  paddingBottom: 30,
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  style={{
                    position: "absolute",
                    top: 20,
                    left: 20,
                  }}
                  onPress={() => setModaldate(false)}
                >
                  <Xhitam width={15} height={15} />
                </TouchableOpacity>
                <Text size="description" type="bold" style={{}}>
                  {t("Selecttime")}
                </Text>
                <View
                  style={{
                    width: "70%",
                    flexDirection: "row",
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Picker
                    iosIcon={
                      <View>
                        <Bottom />
                      </View>
                    }
                    iosHeader="Select Hours"
                    note
                    mode="dropdown"
                    selectedValue={hour}
                    textStyle={{ fontFamily: "Lato-Regular" }}
                    itemTextStyle={{ fontFamily: "Lato-Regular" }}
                    itemStyle={{ fontFamily: "Lato-Regular" }}
                    placeholderStyle={{ fontFamily: "Lato-Regular" }}
                    headerTitleStyle={{
                      fontFamily: "Lato-Regular",
                    }}
                    style={{
                      color: "#209fae",
                      fontFamily: "Lato-Regular",
                    }}
                    onValueChange={(itemValue, itemIndex) => sethour(itemValue)}
                  >
                    {jam.map((item, index) => {
                      return (
                        <Picker.Item
                          key={""}
                          label={item + " h"}
                          value={item}
                        />
                      );
                    })}
                  </Picker>
                  <View
                    style={{
                      width: "10%",
                      alignItems: "flex-end",
                      alignContent: "flex-end",
                    }}
                  >
                    <Text size="description" type="bold" style={{}}>
                      :
                    </Text>
                  </View>
                  <Picker
                    iosHeader="Select Minutes"
                    headerBackButtonTextStyle={{ fontFamily: "Lato-Regular" }}
                    note
                    mode="dropdown"
                    selectedValue={minutes}
                    textStyle={{ fontFamily: "Lato-Regular" }}
                    itemTextStyle={{ fontFamily: "Lato-Regular" }}
                    itemStyle={{ fontFamily: "Lato-Regular" }}
                    placeholderStyle={{ fontFamily: "Lato-Regular" }}
                    iosIcon={
                      <View>
                        <Bottom />
                      </View>
                    }
                    headerTitleStyle={{
                      fontFamily: "Lato-Regular",
                    }}
                    style={{
                      color: "#209fae",
                      fontFamily: "Lato-Regular",
                    }}
                    onValueChange={(itemValue, itemIndex) =>
                      setMinutes(itemValue)
                    }
                  >
                    {menit.map((item, index) => {
                      return (
                        <Picker.Item
                          key={""}
                          label={item + " m"}
                          value={item}
                        />
                      );
                    })}
                  </Picker>
                </View>
                <TouchableOpacity
                  onPress={() => setModaldate(false)}
                  style={{
                    marginTop: 20,
                    backgroundColor: "#209fae",
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderRadius: 5,
                  }}
                >
                  <Text
                    size="description"
                    type="regular"
                    style={{
                      color: "white",
                    }}
                  >
                    {t("Select")}
                  </Text>
                </TouchableOpacity>
              </View>
            </Modal>
          </View>
          <View style={{}}>
            <Text size="label" type="bold" style={{}}>
              {t("address")}
            </Text>
            <TouchableOpacity
              onPress={() => setModal(true)}
              style={{
                marginVertical: 10,
                width: "100%",
                // height: 30,
                paddingHorizontal: 10,
                borderWidth: 0.2,
                borderRadius: 1,
                borderColor: "#646464",
                backgroundColor: "#f3f3f3",
              }}
            >
              <View
                style={{
                  height: 30,
                  flexDirection: "row",
                  // borderWidth: 1,
                  alignItems: "center",
                  alignContent: "center",
                }}
              >
                <Pointmapgray />
                <Input
                  disabled={true}
                  style={{
                    fontFamily: "Lato-Regular",
                    fontSize: 14,
                    marginLeft: 5,
                    padding: 0,
                    // color: '#646464',
                  }}
                  autoCorrect={false}
                  placeholder={"Search Address"}
                  value={Address}
                  onChangeText={onChange("address")}
                  keyboardType="default"
                />
              </View>

              {validate.address === false ? (
                <Text
                  size="small"
                  type="regular"
                  style={{
                    color: "#D75995",

                    position: "absolute",
                    bottom: -15,
                  }}
                >
                  {t("enteraddres")}
                </Text>
              ) : null}
            </TouchableOpacity>

            <Text
              size="label"
              type="bold"
              style={{
                marginTop: 20,
              }}
            >
              {t("detailAddress")}
            </Text>

            <Textarea
              style={{
                width: "100%",
                borderRadius: 1,
                fontFamily: "Lato-Regular",
                backgroundColor: "#f3f3f3",
                padding: 5,
              }}
              rowSpan={5}
              placeholder="Detail Address"
              value={DetailAddress}
              bordered
              maxLength={160}
              onChangeText={onChange("detail")}
            />
            {validate.detail === false ? (
              <Text
                size="small"
                type="regular"
                style={{
                  color: "#D75995",

                  position: "absolute",
                  bottom: -15,
                }}
              >
                {t("enterdetailaddres")}
              </Text>
            ) : null}
          </View>
          <TouchableOpacity
            onPress={() => setcheck(!cheked)}
            style={{
              flexDirection: "row",
              paddingVertical: 20,
            }}
          >
            <CheckBox
              style={{
                marginLeft: -10,
                // backgroundColor: '#209FAE',
                // borderWidth: 0.1,
                borderRadius: 3,
                borderColor: "#A3A3A3",
              }}
              checked={cheked}
              color="#209FAE"
            />
            <Text
              size="small"
              type="regular"
              style={{
                marginLeft: 20,
                // marginTop: 10,
              }}
            >
              {t("saveActivity")}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View
        style={{
          height: 60,
          width: Dimensions.get("screen").width,
          alignContent: "center",
          alignItems: "center",
          justifyContent: "center",
          borderTopWidth: 1,
          borderTopColor: "#f3f3f3",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            if (
              title !== "" &&
              validate.tittle === true &&
              Address !== "" &&
              validate.address === true &&
              DetailAddress !== "" &&
              validate.detail === true &&
              (hour !== 0 || minutes !== 0)
            ) {
              _Next();
            } else {
              Alert.alert(t("pleaseenter"));
            }
          }}
          style={{
            height: 40,
            width: Dimensions.get("screen").width - 40,
            backgroundColor: "#209fae",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 5,
          }}
        >
          <Text size="description" type="regular" style={{ color: "white" }}>
            {t("next")}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        onRequestClose={() => setModal(false)}
        animationIn="slideInRight"
        animationOut="slideOutRight"
        isVisible={modals}
        style={{
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
              height: 50,
              width: Dimensions.get("screen").width,
              // marginBottom: 20,
              marginTop: Platform.OS === "ios" ? 0 : -20,
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
                paddingTop: 15,
                // top: 20,
                // left: 20,
              }}
              onPress={() => setModal(false)}
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
                height: 50,
                // width: 50,
                position: "absolute",
                alignItems: "center",
                alignContent: "center",
                // paddingTop: 15,
              }}
            >
              {t("address")}
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
                key: "AIzaSyD4qyD449yZQ2_7AbdnUvn9PpAxCZ4wZEg",
                language: "id", // language of the results
                // components: 'country:id',
              }}
              fetchDetails={true}
              // GooglePlacesDetailsQuery={{}}
              onPress={(data, details = null, search = null) => {
                setModal(false);
                masukan(details);
              }}
              autoFocus={true}
              listViewDisplayed="auto"
              onFail={(error) => console.log(error)}
              currentLocation={true}
              placeholder={"Search for location"}
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
                // console.log(data);
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
                  // alignContent: "center",
                  // alignItems: "center",
                  backgroundColor: "#f4f4f4",
                  borderWidth: 0.5,
                  borderColor: "#6c6c6c",
                  borderRadius: 5,
                  // paddingVertical: 0,
                  // paddingTop: 5,
                  margin: 0,
                  paddingHorizontal: 10,
                },
                textInput: {
                  marginLeft: 0,
                  marginRight: 0,
                  padding: 0,
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