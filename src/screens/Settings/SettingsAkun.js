import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  Platform,
  Pressable,
  ToastAndroid,
  Alert,
  Modal as ModalRN,
  Image,
  ScrollView,
} from "react-native";
import Modal from "react-native-modal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  OptionsVertBlack,
  Arrowbackwhite,
  Nextpremier,
} from "../../assets/svg";
import { calendar_blue, Bg_soon } from "../../assets/png";
import { useLazyQuery } from "@apollo/react-hooks";
import { useTranslation } from "react-i18next";
import { Text, Button, CustomImage } from "../../component";
import Ripple from "react-native-material-ripple";
import { Truncate } from "../../component";
import DatePicker from "react-native-modern-datepicker";
import { Picker } from "react-native";
import {
  dateFormat,
  dateFormatYMD,
  FormatYMD,
} from "../../component/src/dateformatter";
import City from "../../graphQL/Query/Itinerary/City";
import { useMutation } from "@apollo/react-hooks";
import Gender from "../../graphQL/Mutation/Setting/genderSettingAkun";
import DateSetting from "../../graphQL/Mutation/Setting/dateSettingAkun";
import CityMutation from "../../graphQL/Mutation/Setting/citySettingAkun";
import HasPassword from "../../graphQL/Query/Settings/HasPassword";
import CityInformation from "../../graphQL/Query/Cities/CitiesInformation";
import { RNToasty } from "react-native-toasty";
import SettingCity from "./SettingCity";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function SettingsAkun(props) {
  let { t, i18n } = useTranslation();
  let [modalEmail, setModalEmail] = useState(false);
  let [modalPhone, setModalPhone] = useState(false);
  let [modalBirth, setModalBirth] = useState(false);
  let [modalBirth1, setModalBirth1] = useState(false);
  let [modalGender, setModalGender] = useState(false);
  let [token, setToken] = useState("");
  let [setting, setSetting] = useState(props.route.params.setting);
  let [genders, setGender] = useState(props.route.params.setting?.user.gender);
  let [dates, setDate] = useState(props.route.params.setting?.user?.birth_date);
  let [searchCity, setSearchCity] = useState("");
  let [soon, setSoon] = useState(false);
  let [index, setIndex] = useState(0);

  const closeBirth = () => {
    setModalBirth(false);
    setModalBirth1(true);
  };
  const closeBirth1 = () => {
    setModalBirth(true);
    setModalBirth1(false);
  };

  const HeaderComponent = {
    headerTitle: t("accountInformation"),
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      fontFamily: "Lato-Bold",
      fontSize: 18,
      color: "white",
    },
    headerLeft: () => (
      <Button
        type="circle"
        size="small"
        variant="transparent"
        onPress={() => props.navigation.goBack()}
      >
        <Arrowbackwhite height={20} width={20} />
      </Button>
    ),
    headerLeftContainerStyle: {
      paddingLeft: 10,
    },

    headerRight: () => {
      return null;
    },
  };

  const [
    querycity,
    { loading: loadingcity, data: datacity, error: errorcity },
  ] = useLazyQuery(City, {
    fetchPolicy: "network-only",
    variables: {
      keyword: searchCity,
      countries_id: setting?.countries?.id,
    },
    onCompleted: async () => {
      const tempData = [...datacity?.cities_search];
      let index = await tempData.findIndex(
        (k) => k["id"] === setting?.cities?.id
      );
      setIndex(index);
    },
  });

  const resultSearch = async (x) => {
    await setSearchCity(x);
    await querycity();
  };

  const [
    passwords,
    { data: dataPassword, loading: loadingPassword, error: errorPassword },
  ] = useLazyQuery(HasPassword, {
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    await setToken(tkn);
    await querycity();
    await passwords();
    let setsetting = await AsyncStorage.getItem("setting");
    setSetting(JSON.parse(setsetting));
  };

  const [
    mutationGender,
    { data: dataGender, loading: loadingGender, error: errorGender },
  ] = useMutation(Gender, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const [
    mutationDate,
    { data: dataDate, loading: loadingDate, error: errorDate },
  ] = useMutation(DateSetting, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      loadAsync();
    });
    return unsubscribe;
  }, [props.navigation]);

  const arrayShadow = {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: Platform.OS == "ios" ? 0.22 : 2,
    shadowRadius: Platform.OS == "ios" ? 2.22 : 1.0,
    elevation: Platform.OS == "ios" ? 3 : 1,
  };

  const modalBirth1Close = (x) => {
    setDate(x);
    closeBirth1();
  };

  const hasilGender = async (x) => {
    if (x === null || x === "") {
      x = "F";
    }
    try {
      let response = await mutationGender({
        variables: {
          gender: x,
        },
      });
      if (errorGender) {
        throw new Error("Error Input");
      }
      if (response.data) {
        if (response.data.update_gender_settings.code !== 200) {
          throw new Error(response.data.update_gender_settings.message);
        }
        setModalGender(false);
        if (Platform.OS === "android") {
          ToastAndroid.show("Successfully set gender", ToastAndroid.LONG);
        } else {
          Alert.alert("Successfully set gender");
        }
        let tmp_data = { ...setting };
        tmp_data.user.gender = x;
        await setSetting(tmp_data);
        await AsyncStorage.setItem("setting", JSON.stringify(tmp_data));
      }
    } catch (error) {
      Alert.alert("" + error);
    }
  };

  const hasilDate = async (x) => {
    let format = FormatYMD(x);
    try {
      let response = await mutationDate({
        variables: {
          date: format,
        },
      });
      if (errorDate) {
        throw new Error("Error Input");
      }
      if (response.data) {
        if (response.data.update_birth_settings.code !== 200) {
          throw new Error(response.data.update_birth_settings.message);
        }
        setModalBirth(false);
        if (Platform.OS === "android") {
          ToastAndroid.show(
            "Successfully set date of birth",
            ToastAndroid.LONG
          );
        } else {
          Alert.alert("Successfully set date of birth");
        }
        let tmp_data = { ...setting };
        tmp_data.user.birth_date = format;
        await setSetting(tmp_data);
        await AsyncStorage.setItem("setting", JSON.stringify(tmp_data));
      }
    } catch (error) {
      Alert.alert("" + error);
    }
  };

  const hasPassword = () => {
    if (token !== "" && token !== null) {
      if (dataPassword && dataPassword.cek_haspassword) {
        if (dataPassword?.cek_haspassword?.ishasPassword === true) {
          props.navigation.navigate("HasPassword");
        } else {
          props.navigation.navigate("AddPassword");
        }
      }
    }
  };

  const emailChange = async () => {
    await (setModalEmail(false), 3000);
    if (dataPassword?.cek_haspassword?.ishasPassword === true) {
      return await props.navigation.navigate("SettingEmailChange", {
        setting: setting,
      });
    } else {
      return await props.navigation.navigate("AddPasswordEmail");
    }
  };

  const dateTime = async (e) => {
    await closeDatPicker();
    await setDate(FormatYMD(e));
  };

  const closeDatPicker = async () => {
    await setModalBirth1(false);
    setTimeout(() => {
      setModalBirth(true);
    }, 400);
  };

  // Render all

  return (
    <>
      <ScrollView
        style={{
          backgroundColor: "#F6F6F6",
        }}
      >
        {/* Modal Comming Soon */}
        <ModalRN
          useNativeDriver={true}
          visible={soon}
          onRequestClose={() => setSoon(false)}
          transparent={true}
          animationType="fade"
        >
          <Pressable
            // onPress={() => setModalLogin(false)}
            style={{
              width: Dimensions.get("screen").width,
              height: Dimensions.get("screen").height,
              justifyContent: "center",
              opacity: 0.7,
              backgroundColor: "#000",
              position: "absolute",
            }}
          ></Pressable>
          <View
            style={{
              width: Dimensions.get("screen").width - 100,
              marginHorizontal: 50,
              zIndex: 15,
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              borderRadius: 3,
              marginTop: Dimensions.get("screen").height / 4,
            }}
          >
            <View
              style={{
                // backgroundColor: "white",
                // width: Dimensions.get("screen").width - 100,
                padding: 20,
                paddingHorizontal: 20,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={Bg_soon}
                style={{
                  height: Dimensions.get("screen").width - 180,
                  width: Dimensions.get("screen").width - 110,
                  position: "absolute",
                }}
              />
              <Text type="bold" size="h5">
                {t("comingSoon")}!
              </Text>
              <Text type="regular" size="label" style={{ marginTop: 5 }}>
                {t("soonUpdate")}.
              </Text>
              <Button
                text={"OK"}
                style={{
                  marginTop: 20,
                  width: Dimensions.get("screen").width - 300,
                }}
                type="box"
                onPress={() => setSoon(false)}
              ></Button>
            </View>
          </View>
        </ModalRN>

        {/*Modal Email */}
        <View style={styles.centeredView}>
          <Modal
            animationIn="fadeIn"
            animationOut="fadeOut"
            isVisible={modalEmail}
            onRequestClose={() => setModalEmail(false)}
            onBackdropPress={() => {
              setModalEmail(false);
            }}
            // style={{ height: Dimensions.get("screen").width * 0.2 }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalViewEmail}>
                <Text
                  type="bold"
                  size="label"
                  onPress={() => emailChange()}
                  // onPress={() => {
                  //   setModalEmail(false),
                  //     props.navigation.navigate("SettingEmailChange", {
                  //       setting: setting,
                  //     });
                  // }}
                >
                  Change Email
                </Text>
              </View>
            </View>
          </Modal>
        </View>

        {/*Modal Phone */}
        <View style={styles.centeredView}>
          <Modal
            animationIn="fadeIn"
            animationOut="fadeOut"
            isVisible={modalPhone}
            onRequestClose={() => setModalPhone(false)}
            onBackdropPress={() => {
              setModalPhone(false);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text
                  style={{ color: "#209FAE", marginBottom: 20 }}
                  size="label"
                  type="bold"
                >
                  Delete Phone Number
                </Text>
                <Text
                  type="bold"
                  size="label"
                  onPress={() => {
                    setModalPhone(!modalPhone);
                  }}
                  onPress={() => {
                    setModalPhone(false),
                      props.navigation.navigate("SettingPhoneChange");
                  }}
                >
                  Change Phone Number
                </Text>
              </View>
            </View>
          </Modal>
        </View>

        {/* Modal Birth Date */}

        <ModalRN
          onRequestClose={() => setModalBirth(false)}
          onBackdropPress={() => setModalBirth(false)}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          visible={modalBirth}
          transparent={true}
        >
          <Pressable
            // onPress={() => setModalBirth(false)}
            style={{
              backgroundColor: "rgba(0,0,0,0.7)",
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
              alignContent: "center",
              width: Dimensions.get("screen").width,
              height: Dimensions.get("screen").height,
            }}
          >
            <View
              style={{
                backgroundColor: "#fff",
                width: Dimensions.get("screen").width - 40,
                paddingVertical: 40,
                paddingHorizontal: 50,
                borderRadius: 5,
              }}
            >
              <Text size="description" type="bold">
                {t("birthdate")}
              </Text>
              <Pressable
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottomWidth: 1,
                  paddingVertical: 10,
                }}
                onPress={() => closeBirth()}
              >
                <Text size="description" type="regular">
                  {dates ? dateFormatYMD(dates) : t("birthofdate")}
                </Text>
                <CustomImage
                  source={calendar_blue}
                  customStyle={{ width: 20, height: 20 }}
                />
              </Pressable>
              <View
                style={{
                  marginTop: 20,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  size="medium"
                  style={{ width: "48%" }}
                  color="green"
                  text={t("cancel")}
                  onPress={() => setModalBirth(false)}
                ></Button>
                <Button
                  size="medium"
                  style={{ width: "48%" }}
                  text={t("save")}
                  onPress={() => hasilDate(dates)}
                ></Button>
              </View>
            </View>
          </Pressable>
        </ModalRN>

        <DateTimePickerModal
          isVisible={modalBirth1}
          mode="date"
          // value={tanggal}
          date={new Date(dates)}
          onConfirm={(e) => dateTime(e)}
          onCancel={() => closeDatPicker()}
        />

        {/* Modal Jenis Kelamin */}

        <Modal
          onRequestClose={() => setModalGender(false)}
          onBackdropPress={() => setModalGender(false)}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          isVisible={modalGender}
          style={{
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
            alignContent: "center",
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
              alignContent: "center",
              width: Dimensions.get("screen").width - 40,
            }}
          >
            <View
              style={{
                backgroundColor: "#fff",
                width: Dimensions.get("screen").width - 40,
                paddingVertical: 40,
                paddingHorizontal: 50,
                borderRadius: 5,
              }}
            >
              <Text size="description" type="bold">
                {t("gender")}
              </Text>
              <View
                style={{
                  borderBottomWidth: 1,
                }}
              >
                <Picker
                  note
                  mode="dropdown"
                  style={{
                    width: "110%",
                    fontSize: 14,
                    fontFamily: "Lato-Regular",
                    marginLeft: -8,
                    elevation: 20,
                  }}
                  selectedValue={genders}
                  onValueChange={(x) => setGender(x)}
                >
                  <Picker.Item label={t("Male")} value="M" />
                  <Picker.Item label={t("Female")} value="F" />
                </Picker>
              </View>
              <View
                style={{
                  marginTop: 20,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  size="medium"
                  style={{ width: "48%" }}
                  color="tertiary"
                  text={t("cancel")}
                  onPress={() => setModalGender(false)}
                ></Button>
                <Button
                  size="medium"
                  style={{ width: "48%" }}
                  text={t("save")}
                  onPress={() => hasilGender(genders)}
                ></Button>
              </View>
            </View>
          </View>
        </Modal>
        {/* <NavigationEvents onDidFocus={() => loadAsync()} /> */}
        <View
          style={{
            flexDirection: "column",
            marginTop: 5,
            backgroundColor: "#FFFFFF",
            shadowColor: "gray",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: arrayShadow.shadowOpacity,
            shadowRadius: arrayShadow.shadowRadius,
            elevation: arrayShadow.elevation,
          }}
        >
          <View
            style={{
              paddingHorizontal: 15,
              paddingTop: 13,
            }}
          >
            <Text size="label" type="bold">
              {t("personalData")}
            </Text>
          </View>
          <Ripple
            rippleCentered={true}
            // onPress={() => setModelSetNegara(true)}
            style={{
              paddingHorizontal: 15,
              paddingVertical: 13,
              borderBottomColor: "#D1D1D1",
              borderBottomWidth: 0.5,
            }}
          >
            <View
              style={{
                justifyContent: "space-between",
                flexDirection: "row",
              }}
            >
              <Text size="description" type="regular">
                {t("firstName")}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text size="description" type="light" style={{}}>
                  <Truncate
                    text={
                      setting.user.first_name
                        ? setting.user.first_name
                        : "Not Set"
                    }
                    length={30}
                  />
                </Text>
              </View>
            </View>
          </Ripple>
          <Ripple
            rippleCentered={true}
            // onPress={() => setModelSetNegara(true)}
            style={{
              paddingHorizontal: 15,
              paddingVertical: 13,
              borderBottomColor: "#D1D1D1",
              borderBottomWidth: 0.5,
            }}
          >
            <View
              style={{
                justifyContent: "space-between",
                flexDirection: "row",
              }}
            >
              <Text size="description" type="regular">
                {t("lastName")}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text size="description" type="light" style={{}}>
                  <Truncate
                    text={
                      setting && setting.user && setting.user?.last_name
                        ? setting.user?.last_name
                        : "Not Set"
                    }
                    length={30}
                  />
                </Text>
              </View>
            </View>
          </Ripple>
          <Ripple
            rippleCentered={true}
            style={{
              paddingHorizontal: 15,
              paddingVertical: 13,
              borderBottomColor: "#D1D1D1",
              borderBottomWidth: 0.5,
            }}
            onPress={() => setModalGender(true)}
          >
            <View
              style={{
                justifyContent: "space-between",
                flexDirection: "row",
              }}
            >
              <Text size="description" type="regular">
                {t("gender")}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text size="description" type="light" style={{}}>
                  {setting && setting.user && setting.user.gender
                    ? setting.user.gender === "M"
                      ? t("Male")
                      : t("Female")
                    : t("notSet")}
                </Text>
              </View>
            </View>
          </Ripple>
          <Ripple
            rippleCentered={true}
            onPress={(e) => setModalBirth(true)}
            style={{
              paddingHorizontal: 15,
              paddingVertical: 13,
              borderBottomColor: "#D1D1D1",
              borderBottomWidth: 0.5,
            }}
          >
            <View
              style={{
                justifyContent: "space-between",
                flexDirection: "row",
              }}
            >
              <Text size="description" type="regular">
                {t("birthdate")}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text size="description" type="light" style={{}}>
                  {setting.user.birth_date
                    ? dateFormat(setting.user.birth_date)
                    : t("notSet")}
                </Text>
              </View>
            </View>
          </Ripple>
          <Ripple
            rippleCentered={true}
            onPress={() =>
              props.navigation.navigate("AccountStack", {
                screen: "SettingCity",
                params: {
                  props: props,
                  setting: setting,
                  token: token,
                  setSetting: (e) => setSetting(e),
                  index: index,
                },
              })
            }
            style={{
              paddingHorizontal: 15,
              paddingVertical: 13,
            }}
          >
            <View
              style={{
                justifyContent: "space-between",
                flexDirection: "row",
              }}
            >
              <Text size="description" type="regular">
                {t("cityOfRecidence")}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text size="description" type="light" style={{}}>
                  {setting &&
                  setting.cities &&
                  setting?.cities?.id &&
                  setting?.cities?.name
                    ? setting?.cities?.name
                        .toString()
                        .toLowerCase()
                        .replace(/\b[a-z]/g, function(letter) {
                          return letter.toUpperCase();
                        })
                    : t("notSet")}
                </Text>
              </View>
            </View>
          </Ripple>
        </View>
        <View
          style={{
            flexDirection: "row",
            marginTop: 4,
            paddingHorizontal: 15,
            paddingVertical: 13,
            backgroundColor: "#FFFFFF",
            shadowColor: "gray",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: arrayShadow.shadowOpacity,
            shadowRadius: arrayShadow.shadowRadius,
            elevation: arrayShadow.elevation,
          }}
        >
          <View>
            <Text
              size="label"
              type="bold"
              style={{
                marginBottom: 5,
              }}
            >
              {t("email")}
            </Text>
            {setting && setting.user && setting.user.email ? (
              <View
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                  alignItems: "flex-end",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    width: Dimensions.get("screen").width - 50,
                  }}
                >
                  <Pressable
                    onPress={() =>
                      props.navigation.navigate("SettingEmailChange", {
                        setting: setting,
                      })
                    }
                  >
                    <View
                      style={{
                        alignContent: "flex-start",
                        justifyContent: "flex-start",
                      }}
                    >
                      <Text
                        type="regular"
                        size="description"
                        style={{
                          alignSelf: "flex-start",
                        }}
                      >
                        {setting && setting.user && setting.user.email
                          ? setting.user.email
                          : t("notSet")}
                      </Text>
                      <Text type="regular" size="small">
                        {t("emailUsed")}
                      </Text>
                    </View>
                  </Pressable>
                </View>
                {/* <OptionsVertBlack
                width={20}
                height={20}
                onPress={() => {
                  setModalEmail(true);
                }}
              /> */}
              </View>
            ) : (
              <Button
                style={{
                  width: Dimensions.get("screen").width * 0.9,
                  paddingHorizontal: 10,
                }}
                type="box"
                size="medium"
                color="green"
                text={t("AddEmail")}
                onPress={() =>
                  props.navigation.navigate("SettingEmail", {
                    dataEmail: setting.user,
                  })
                }
              />
            )}
          </View>
          {setting && setting.user && setting.user.email ? (
            <View style={{ justifyContent: "center" }}>
              {/* <OptionsVertBlack
              width={15}
              height={15}
              onPress={() => {
                setModalEmail(true);
              }}
            /> */}
            </View>
          ) : null}
        </View>
        <View
          style={{
            flexDirection: "row",
            // marginTop: 4,
            // borderWidth: 1,
            borderTopWidth: 1,
            borderTopColor: "#D1D1D1",
            paddingHorizontal: 15,
            paddingVertical: 13,
            backgroundColor: "#FFFFFF",
            shadowColor: "gray",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: arrayShadow.shadowOpacity,
            shadowRadius: arrayShadow.shadowRadius,
            elevation: arrayShadow.elevation,
          }}
        >
          <View>
            <Text
              size="label"
              type="bold"
              style={{
                marginBottom: 5,
              }}
            >
              {t("phoneNumber")}
            </Text>
            {setting && setting.user && setting.user.phone ? (
              <View
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    width: Dimensions.get("screen").width - 50,
                  }}
                >
                  <View
                    style={{
                      alignContent: "flex-start",
                      justifyContent: "flex-start",
                    }}
                  >
                    <Text
                      type="regular"
                      size="description"
                      style={{
                        alignSelf: "flex-start",
                      }}
                    >
                      {setting.user.phone}
                    </Text>
                    <Text type="regular" size="small">
                      {t("phoneUsed")}
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <Button
                style={{
                  width: Dimensions.get("screen").width - 30,
                  paddingHorizontal: 10,
                }}
                type="box"
                size="medium"
                color="green"
                text={t("addPhoneNumber")}
                // onPress={() => props.navigation.navigate("SettingPhone")}
                onPress={() => setSoon(true)}
              />
            )}
          </View>
          {setting && setting.user && setting.user.phone ? (
            <Pressable
              style={{ justifyContent: "center" }}
              onPress={() => setSoon(true)}
            >
              <OptionsVertBlack width={15} height={15} />
            </Pressable>
          ) : null}
        </View>
        <Pressable
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 4,
            paddingHorizontal: 15,
            paddingVertical: 13,
            backgroundColor: "#FFFFFF",
            borderBottomWidth: 1,
            borderBottomColor: "#D1D1D1",
            shadowColor: "gray",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: arrayShadow.shadowOpacity,
            shadowRadius: arrayShadow.shadowRadius,
            elevation: arrayShadow.elevation,
          }}
          onPress={(x) => hasPassword(x)}
        >
          <Text
            size="label"
            type="regular"
            style={{
              marginBottom: 5,
            }}
          >
            {t("password")}
          </Text>
          <Nextpremier width={15} height={15} />
        </Pressable>
        {/* <Ripple
        onPress={() => null}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          // marginTop: 4,
          borderWidth: 1,
          borderTopWidth: 1,
          borderColor: "#D1D1D1",
          paddingHorizontal: 15,
          paddingVertical: 13,
          backgroundColor: "#FFFFFF",
          shadowColor: "gray",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: arrayShadow.shadowOpacity,
          shadowRadius: arrayShadow.shadowRadius,
          elevation: arrayShadow.elevation,
        }}
      >
        <Text
          size="label"
          type="regular"
          style={{
            marginBottom: 5,
          }}
        >
          {t("Security")}
        </Text>
        <Nextpremier width={15} height={15} />
      </Ripple> */}
        {/* {datacity && datacity?.cities_search.length > 0 ? (
          <SettingCity
            modals={modalCity}
            setModalCity={(e) => setModalCity(e)}
            masukan={(e) => setSetting(e)}
            data={datacity?.cities_search}
            selected={setting}
            token={token}
            setSearchCity={(e) => resultSearch(e)}
            searchCity={searchCity}
            indexCity={index}
            setIndex={(e) => setIndex(e)}
            props={props}
          />
        ) : null} */}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  main: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
  },
  nextArrowView: {
    position: "absolute",
    right: 15,
    alignItems: "flex-end",
    height: 50,
    width: 50,
  },
  nextArrowImage: {
    resizeMode: "contain",
    height: 15,
    width: 15,
  },
  logOutView: {
    width: Dimensions.get("window").width - 30,
    alignSelf: "center",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  anotherNextArrowView: {
    height: 15,
    width: 15,
  },
  rightText: {
    position: "absolute",
    right: 15,
    height: 50,
    width: 150,
    justifyContent: "center",
    flexDirection: "row",
  },
  languageButton: {
    height: 25,
    width: 85,
    backgroundColor: "#F1F1F1",
    borderColor: "#F1F1F1",
    borderWidth: 1,
    borderRadius: 4,
  },
  langButtonFont: {
    fontSize: 16,
  },

  // testt modal
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 5,
    width: Dimensions.get("screen").width * 0.7,
    height: Dimensions.get("screen").width * 0.4,
    alignItems: "center",
    justifyContent: "center",
  },
  modalViewEmail: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 5,
    width: Dimensions.get("screen").width * 0.7,
    height: Dimensions.get("screen").width * 0.2,
    alignItems: "center",
    justifyContent: "center",
  },
});
