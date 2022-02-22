import {Input, Item, Label, Textarea} from "native-base";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {
  Dimensions,
  View,
  Picker,
  KeyboardAvoidingView,
  Pressable,
} from "react-native";
import {ScrollView, TouchableOpacity} from "react-native-gesture-handler";
import CheckBox from "@react-native-community/checkbox";
import {
  Arrowbackios,
  Arrowbackwhite,
  Bottom,
  Bottomsegitiga,
  Pointmapgray,
  Xhitam,
} from "../../../assets/svg";
import {Button, Text, Truncate} from "../../../component";
import Modal from "react-native-modal";
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";
import Ripple from "react-native-material-ripple";

export default function editCustomActivity(props) {
  console.log("props", props);
  const {t, i18n} = useTranslation();
  let [modals, setModal] = useState(false);
  let [modaldate, setModaldate] = useState(false);
  let [cheked, setcheck] = useState(false);

  let [title, setTitle] = useState(props.route.params.dataParent.name);
  let [Address, setAddress] = useState(props.route.params.dataParent.address);
  let [Lat, setLat] = useState(props.route.params?.dataParent?.latitude);
  let [Long, setLong] = useState(props.route.params?.dataParent?.longitude);
  let [DetailAddress, setDetailAddress] = useState(
    props.route.params.dataParent.address
  );

  let [validate, setValidate] = useState({
    tittle: true,
    duration: true,
    address: true,
    detail: true,
  });

  const validation = (name, value) => {
    if (name === "tittle") {
      return value.length >= 1 ? true : false;
    } else if (name === "address") {
      return value.length >= 2 ? true : false;
    } else if (name === "detail") {
      return value.length >= 5 ? true : false;
    } else {
      return true;
    }
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

  let [hour, sethour] = useState(
    props.route.params.dataParent.duration.split(":")[0]
  );
  let [minutes, setMinutes] = useState(
    props.route.params.dataParent.duration.split(":")[1]
  );

  //   jam dan menit arrays
  const jam = [...Array(24).keys()].map((x) => `${x}`);
  const menit = [...Array(60).keys()].map((x) => `${x}`);

  const HeaderComponent = {
    headerShown: true,
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: "",
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
      <View
        style={{
          flexDirection: "row",
          alignContent: "center",
          alignItems: "center",
        }}
      >
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

        <View
          style={{
            marginLeft: 10,
          }}
        >
          <Text type="bold" size="title" style={{color: "#fff"}}>
            {t("editCustomActivity")}
          </Text>
        </View>
      </View>
    ),
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
  }, [props.navigation]);

  // function masukan data google
  const masukan = (detail) => {
    console.log("detail", detail);
    setAddress(detail.name);
    setLat(detail.geometry.location.lat);
    setLong(detail.geometry.location.lng);
    setDetailAddress(detail.formatted_address);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FFF",
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {/* title */}

        <View style={{width: Dimensions.get("screen").width, padding: 20}}>
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

          {/* duration */}

          <View
            style={{
              width: Dimensions.get("screen").width - 40,
              flexDirection: "row",
              paddingVertical: 20,
              justifyContent: "space-between",

              alignItems: "center",
              alignContent: "center",
            }}
          >
            <Text size="label" type="bold" style={{}}>
              {t("duration")}
            </Text>
            <View style={{flexDirection: "row"}}>
              <TouchableOpacity
                onPress={() => {
                  setModaldate(true);
                }}
                style={{
                  flexDirection: "row",
                }}
              >
                <View
                  style={{
                    width: 60,
                    height: 20,
                    borderWidth: 0.5,

                    alignItems: "center",
                    borderColor: "#d1d1d1",
                    backgroundColor: "#f6f6f6",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      type="bold"
                      size="label"
                      style={{
                        color: "#209FAE",
                      }}
                    >
                      {hour < 10 ? +hour : hour} {t("h")}
                    </Text>
                    <View
                      style={{
                        justifyContent: "center",
                        paddingLeft: 8,
                      }}
                    >
                      <Bottomsegitiga width={8} height={8} />
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    width: 60,
                    height: 20,
                    marginLeft: 5,
                    alignItems: "center",
                    borderWidth: 0.5,
                    borderColor: "#d1d1d1",
                    backgroundColor: "#f6f6f6",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      type="bold"
                      size="label"
                      style={{
                        color: "#209FAE",
                      }}
                    >
                      {minutes < 10 ? +minutes : minutes} {t("m")}
                    </Text>
                    <View
                      style={{
                        justifyContent: "center",
                        paddingLeft: 8,
                      }}
                    >
                      <Bottomsegitiga width={8} height={8} />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {/* awal modal date */}

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
                    width: "100%",
                    // borderWidth: 1,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View style={{width: "40%"}}>
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
                      textStyle={{fontFamily: "Lato-Regular"}}
                      itemTextStyle={{fontFamily: "Lato-Regular"}}
                      itemStyle={{fontFamily: "Lato-Regular"}}
                      placeholderStyle={{fontFamily: "Lato-Regular"}}
                      headerTitleStyle={{
                        fontFamily: "Lato-Regular",
                      }}
                      style={{
                        color: "#209fae",
                        fontFamily: "Lato-Regular",
                      }}
                      onValueChange={(itemValue, itemIndex) =>
                        sethour(itemValue)
                      }
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
                  </View>
                  <View
                    style={{
                      width: "5%",
                      alignItems: "center",
                    }}
                  >
                    <Text size="description" type="bold" style={{}}>
                      :
                    </Text>
                  </View>
                  <View style={{width: "40%"}}>
                    <Picker
                      iosHeader="Select Minutes"
                      headerBackButtonTextStyle={{fontFamily: "Lato-Regular"}}
                      note
                      mode="dropdown"
                      selectedValue={minutes}
                      textStyle={{fontFamily: "Lato-Regular"}}
                      itemTextStyle={{fontFamily: "Lato-Regular"}}
                      itemStyle={{fontFamily: "Lato-Regular"}}
                      placeholderStyle={{fontFamily: "Lato-Regular"}}
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
                </View>
                <Ripple
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
                </Ripple>
              </View>
            </Modal>
            {/* akhir modal date */}
          </View>
          {/* address */}
          <View>
            <Text size="label" type="bold" style={{}}>
              {t("address")}
            </Text>
            <TouchableOpacity
              onPress={() => setModal(true)}
              style={{
                marginVertical: 10,
                width: "100%",

                paddingHorizontal: 10,
                borderWidth: 0.2,
                borderRadius: 2,
                borderColor: "#646464",
                backgroundColor: "#f3f3f3",
                marginBottom: 20,
              }}
            >
              <View
                style={{
                  height: 30,
                  borderRadius: 2,

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
                  placeholder={t("searchAddress")}
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
          </View>

          <View>
            <Text size="label" type="bold">
              {t("detailAddress")}
            </Text>

            <Textarea
              style={{
                width: "100%",
                borderRadius: 5,

                fontFamily: "Lato-Regular",
                backgroundColor: "#f3f3f3",
                padding: 5,
              }}
              disabled={props.route.params?.dataParent ? true : false}
              rowSpan={5}
              placeholder={t("detailAddress")}
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
          <Pressable
            onPress={() => setcheck(!cheked)}
            style={{
              flexDirection: "row",
              paddingTop: 20,
              justifyContent: "flex-start",
              alignItems: "center",
              alignContent: "center",
            }}
          >
            <CheckBox
              onCheckColor="#FFF"
              lineWidth={2}
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
                  ios: [{scaleX: 0.8}, {scaleY: 0.8}],
                  android: [{scaleX: 1.3}, {scaleY: 1.3}],
                }),
              }}
              value={cheked}
              onValueChange={(check) => setcheck(check)}
            />
            <Text
              size="small"
              type="regular"
              style={{
                marginLeft: 20,
              }}
            >
              {t("saveActivity")}
            </Text>
          </Pressable>
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
              // _Next();
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
          <Text size="description" type="regular" style={{color: "white"}}>
            {t("next")}
          </Text>
        </TouchableOpacity>
      </View>
      <Modal
        onRequestClose={() => setModal(false)}
        animationIn="slideInRight"
        animationOut="slideOutRight"
        hasBackdrop={false}
        isVisible={modals}
        style={{
          backgroundColor: "#209fae",

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
            backgroundColor: "#209fae",
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
          }}
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

              marginTop: Platform.OS === "ios" ? 20 : -20,
            }}
          >
            <Ripple
              style={{
                height: 50,
                width: 50,
                alignItems: "center",
                alignContent: "center",
                paddingTop: 15,
                marginLeft: 10,
              }}
              onPress={() => setModal(false)}
            >
              <Arrowbackwhite width={20} height={20} />
            </Ripple>
            <Text
              size={"title"}
              type={"bold"}
              style={{
                left: 10,

                color: "white",
              }}
            >
              {t("address")}
            </Text>
          </View>
          {/* modal google */}
          <View
            style={{
              width: Dimensions.get("screen").width,
              height: Dimensions.get("screen").height,
              backgroundColor: "white",
              paddingTop: 20,
              paddingHorizontal: 20,
              paddingBottom: 20,
            }}
          >
            <GooglePlacesAutocomplete
              query={{
                key: "AIzaSyD4qyD449yZQ2_7AbdnUvn9PpAxCZ4wZEg",
                language: t("googleLocationLang"), // language of the results
              }}
              fetchDetails={true}
              onPress={(data, details = null, search = null) => {
                masukan(details);
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
                  <View style={{justifyContent: "center"}}>
                    <Pointmapgray />
                  </View>
                );
              }}
              GooglePlacesSearchQuery={{rankby: "distance"}}
              enablePoweredByContainer={false}
              renderRow={(data) => {
                if (data.description) {
                  var x = data.description.split(",");
                }
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
                      <Pointmapgray />
                    </View>
                    <View style={{width: Dimensions.get("screen").width - 60}}>
                      <Text style={{fontFamily: "Lato-Bold", fontSize: 12}}>
                        {/* {x[0]} */}
                        {x ? x[0] : data.name}
                      </Text>
                      <Text style={{fontFamily: "Lato-Regular", fontSize: 12}}>
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
                textInputContainer: {
                  height: 40,
                  backgroundColor: "#f4f4f4",
                  borderWidth: 0.5,
                  borderColor: "#6c6c6c",
                  borderRadius: 5,
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

                  backgroundColor: "#f4f4f4",
                  borderColor: "#eaeaea",
                },
                predefinedPlacesDescription: {
                  color: "#646464",
                },
                listView: {},
                row: {
                  height: 48,
                },
              }}
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
