import React, { useState, useEffect } from "react";
import {
  FlatList,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native-gesture-handler";
import {
  View,
  Dimensions,
  StyleSheet,
  Platform,
  Pressable,
  Alert,
} from "react-native";
import Modal from "react-native-modal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  OptionsVertBlack,
  Arrowbackwhite,
  Xhitam,
  Nextpremier,
} from "../../assets/svg";
import { calendar_blue } from "../../assets/png";
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
import { Input, Item, Label } from "native-base";
import City from "../../graphQL/Query/Itinerary/City";
import { useMutation } from "@apollo/react-hooks";
import Gender from "../../graphQL/Mutation/Setting/genderSettingAkun";
import Date from "../../graphQL/Mutation/Setting/dateSettingAkun";
import CityMutation from "../../graphQL/Mutation/Setting/citySettingAkun";
import HasPassword from "../../graphQL/Query/Settings/HasPassword";

export default function SettingsAkun(props) {
  let { t, i18n } = useTranslation();
  let [modalEmail, setModalEmail] = useState(false);
  let [modalPhone, setModalPhone] = useState(false);
  let [modalBirth, setModalBirth] = useState(false);
  let [modalBirth1, setModalBirth1] = useState(false);
  let [modalGender, setModalGender] = useState(false);
  let [modalCity, setModalCity] = useState(false);
  let [modalCity1, setModalCity1] = useState(false);
  let [city, setCity] = useState("");
  let [token, setToken] = useState("");
  let [setLanguage] = useState(i18n.language);
  let [setting, setSetting] = useState(props.route.params.setting);
  let [genders, setGender] = useState(setting?.user.gender);
  let [date, setDate] = useState(setting?.user?.birth_date);
  let [cityName, setCityName] = useState(setting?.cities?.name);
  let [cityId, setCityId] = useState(setting?.cities?.id);

  const closeBirth = () => {
    setModalBirth(false);
    setModalBirth1(true);
  };
  const closeBirth1 = () => {
    setModalBirth(true);
    setModalBirth1(false);
  };

  const closeModalBirth = () => {
    setDate(null);
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
      fontSize: 16,
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
      keyword: city,
      countries_id: setting?.countries?.id,
    },
  });

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

  // console.log("country", setting.countries.id);
  // console.log("city", datacity);
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
  ] = useMutation(Date, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const [
    mutationCity,
    { data: dataCity, loading: loadingCity, error: errorCity },
  ] = useMutation(CityMutation, {
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
    elevation: Platform.OS == "ios" ? 3 : 1.5,
  };

  const modalBirth1Close = (x) => {
    setDate(x);
    closeBirth1();
  };

  const searchcity = (text) => {
    setCity(text);
    console.log(text);
    querycity();
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
        let tmp_data = { ...setting };
        tmp_data.user.birth_date = format;
        await setSetting(tmp_data);
        await AsyncStorage.setItem("setting", JSON.stringify(tmp_data));
      }
    } catch (error) {
      Alert.alert("" + error);
    }
  };

  const onCity = async (id, name) => {
    await setCityId(id);
    await setCityName(name);
    await setModalCity1(false);
  };

  const hasilCity = async (id, name) => {
    try {
      let response = await mutationCity({
        variables: {
          id: id,
        },
      });
      if (errorCity) {
        throw new Error("Error Input");
      }
      if (response.data) {
        if (response.data.update_city_settings.code !== 200) {
          throw new Error(response.data.update_city.message);
        }
        let tmp_data = { ...setting };
        tmp_data.cities.id = id;
        tmp_data.cities.name = name;
        await setSetting(tmp_data);
        await AsyncStorage.setItem("setting", JSON.stringify(tmp_data));
        setModalCity(false);
      }
    } catch (error) {
      Alert.alert("" + error);
    }
  };

  console.log("data : ", dataPassword);
  console.log("token : ", token);
  console.log("setting : ", setting);

  const hasPassword = () => {
    console.log("status", dataPassword?.cek_haspassword?.ishasPassword);
    if (dataPassword?.cek_haspassword?.ishasPassword === false) {
      props.navigation.navigate("AddPassword");
    } else {
      props.navigation.navigate("HasPassword");
    }
  };

  const emailChange = async () => {
    await (setModalEmail(false), 3000);
    console.log("status :", dataPassword?.cek_haspassword?.ishasPassword);
    if (dataPassword?.cek_haspassword?.ishasPassword === false) {
      return await props.navigation.navigate("AddPasswordEmail");
    } else {
      return await props.navigation.navigate("SettingEmailChange", {
        setting: setting,
      });
    }
  };

  // Render all

  return (
    <ScrollView
      style={{
        backgroundColor: "#F6F6F6",
      }}
    >
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

      <Modal
        onRequestClose={() => setModalBirth(false)}
        onBackdropPress={() => setModalBirth(false)}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        isVisible={modalBirth}
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
                {date ? dateFormatYMD(date) : "Birth of Date"}
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
                color="tertiary"
                text="Cancel"
                onPress={() => setModalBirth(false)}
              ></Button>
              <Button
                size="medium"
                style={{ width: "48%" }}
                text="Save"
                onPress={() => hasilDate(date)}
              ></Button>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        onRequestClose={() => setModalBirth1(false)}
        onBackdropPress={() => setModalBirth1(false)}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        isVisible={modalBirth1}
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
              paddingVertical: 20,
              alignItems: "center",
              borderRadius: 5,
            }}
          >
            <DatePicker
              options={{}}
              // current={startDate ? startDate : getToday()}
              // selected={date}
              // maximumDate={toDay()}
              onDateChange={(x) => setDate(x)}
              mode="calendar"
              style={{ borderRadius: 10 }}
            />
            <View style={{ flexDirection: "row", alignSelf: "flex-end" }}>
              <Button
                size="small"
                style={{ alignSelf: "flex-end" }}
                text="Cancel"
                variant="transparent"
                onPress={() => closeModalBirth()}
              ></Button>
              <Button
                size="small"
                style={{ alignSelf: "flex-end" }}
                text="Ok"
                variant="transparent"
                onPress={() => modalBirth1Close(date)}
              ></Button>
            </View>
          </View>
        </View>
      </Modal>

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
                text="Cancel"
                onPress={() => setModalGender(false)}
              ></Button>
              <Button
                size="medium"
                style={{ width: "48%" }}
                text="Save"
                onPress={() => hasilGender(genders)}
              ></Button>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal City */}

      <Modal
        onRequestClose={() => setModalCity(false)}
        onBackdropPress={() => setModalCity(false)}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        isVisible={modalCity}
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
              {t("cityOfRecidence")}
            </Text>
            <Pressable onPress={() => setModalCity1(true)}>
              <Text style={{ borderBottomWidth: 1, marginTop: 20 }}>
                {cityName
                  ? cityName
                      .toString()
                      .toLowerCase()
                      .replace(/\b[a-z]/g, function (letter) {
                        return letter.toUpperCase();
                      })
                  : t("cityOfRecidence")}
              </Text>
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
                color="tertiary"
                text="Cancel"
                onPress={() => setModalCity(false)}
              ></Button>
              <Button
                size="medium"
                style={{ width: "48%" }}
                text="Save"
                onPress={() => hasilCity(cityId, cityName)}
              ></Button>
            </View>
          </View>
        </View>
      </Modal>

      {/* modal city */}
      <Modal
        onRequestClose={() => setModalCity1(false)}
        onBackdropPress={() => setModalCity1(false)}
        onSwipeComplete={() => setModalCity1(false)}
        swipeDirection="down"
        animationIn="slideInUp"
        animationOut="slideOutDown"
        isVisible={modalCity1}
        style={{
          marginBottom: -10,
          justifyContent: "flex-end",
          alignItems: "center",
          alignContent: "center",
        }}
      >
        <View
          style={{
            width: Dimensions.get("screen").width,
            // height: 15,
            padding: 5,
            backgroundColor: "#209fae",
            borderTopEndRadius: 5,
            borderTopLeftRadius: 5,
          }}
        >
          <TouchableOpacity
            style={{
              alignSelf: "flex-end",
              height: 30,
              width: 30,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => setModalCity1(false)}
          >
            <Xhitam height={15} width={15} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: Dimensions.get("screen").width,
            minHeight: Dimensions.get("screen").height * 0.5,
            backgroundColor: "white",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            paddingHorizontal: 20,
          }}
        >
          <Item
            floatingLabel
            style={{
              marginVertical: 10,
            }}
          >
            <Label
              style={{
                fontFamily: "Lato-Regular",
                fontSize: 14,
              }}
            >
              {t("SearchCity")}
            </Label>
            <Input
              style={{
                fontFamily: "Lato-Regular",
                fontSize: 16,
              }}
              returnKeyType="search"
              autoCorrect={false}
              onChangeText={(x) => {
                searchcity(x);
              }}
              // onSubmitEditing={}
              keyboardType="default"
            />
          </Item>
          {datacity && datacity.cities_search.length > 0 ? (
            <FlatList
              style={{
                position: "absolute",
                top: 60,
                width: "100%",
                maxHeight: Dimensions.get("screen").width - 40,

                height: "100%",
              }}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => `${index}`}
              data={datacity.cities_search}
              renderItem={({ item }) => (
                <Pressable
                  style={{
                    backgroundColor: "white",
                    width: "100%",
                    padding: 10,
                  }}
                  onPress={() => onCity(item.id, item?.name)}
                >
                  <Text size="description" type="regular" style={{}}>
                    {item?.name
                      .toString()
                      .toLowerCase()
                      .replace(/\b[a-z]/g, function (letter) {
                        return letter.toUpperCase();
                      })}
                  </Text>
                </Pressable>
              )}
            />
          ) : null}
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
                  : "Not Set"}
              </Text>
            </View>
          </View>
        </Ripple>
        <Ripple
          rippleCentered={true}
          onPress={() => setModalBirth(true)}
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
                  : "Not Set"}
              </Text>
            </View>
          </View>
        </Ripple>
        <Ripple
          rippleCentered={true}
          onPress={() => setModalCity(true)}
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
                {setting?.cities?.name
                  ? setting?.cities?.name
                      .toString()
                      .toLowerCase()
                      .replace(/\b[a-z]/g, function (letter) {
                        return letter.toUpperCase();
                      })
                  : "Not Set"}
              </Text>
            </View>
          </View>
        </Ripple>
      </View>
      <View
        style={{
          flexDirection: "column",
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
                  {setting && setting.user && setting.user.email
                    ? setting.user.email
                    : "Not Set"}
                </Text>
                <Text type="regular" size="small">
                  {t("emailUsed")}
                </Text>
              </View>
            </View>
            <OptionsVertBlack
              width={20}
              height={20}
              onPress={() => {
                setModalEmail(true);
              }}
            />
          </View>
        ) : (
          <Button
            type="box"
            size="medium"
            color="tertiary"
            text={t("AddEmail")}
            onPress={() =>
              props.navigation.navigate("SettingEmail", {
                dataEmail: setting.user,
              })
            }
          />
        )}
      </View>
      <View
        style={{
          flexDirection: "column",
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
            <OptionsVertBlack
              width={20}
              height={20}
              onPress={() => {
                setModalPhone(true);
              }}
            />
          </View>
        ) : (
          <>
            <Button
              type="box"
              size="medium"
              color="tertiary"
              text={t("addPhoneNumber")}
              onPress={() => props.navigation.navigate("SettingPhone")}
            />
            {/* <View
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
            </View> */}
          </>
        )}
      </View>
      <Ripple
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
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
        <Nextpremier width={20} height={20} />
      </Ripple>
      <Ripple
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
        <Nextpremier width={20} height={20} />
      </Ripple>
    </ScrollView>
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
