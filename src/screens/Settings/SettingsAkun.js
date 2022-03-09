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
  Picker,
  StatusBar,
} from "react-native";
import Modal from "react-native-modal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  OptionsVertBlack,
  Arrowbackwhite,
  Nextpremier,
  Xgray,
  Arrowbackios,
  GoogleIcon,
  FacebookIcon,
} from "../../assets/svg";
import { calendar_blue, Bg_soon } from "../../assets/png";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import { useTranslation } from "react-i18next";
import { Text, Button, CustomImage } from "../../component";
import Ripple from "react-native-material-ripple";
import { Truncate } from "../../component";

import {
  dateFormat,
  dateFormatYMD,
  FormatYMD,
} from "../../component/src/dateformatter";
import City from "../../graphQL/Query/Itinerary/City";
import { useMutation } from "@apollo/react-hooks";
import Gender from "../../graphQL/Mutation/Setting/genderSettingAkun";
import DateSetting from "../../graphQL/Mutation/Setting/dateSettingAkun";
import ConnectionFacebook from "../../graphQL/Mutation/Setting/ConnectionFacebook";
import disConnectionFacebook from "../../graphQL/Mutation/Setting/disConnectionFacebook";
import ConnectionGoogle from "../../graphQL/Mutation/Setting/ConnectionGoogle";
import disConnectionGoogle from "../../graphQL/Mutation/Setting/disConnectionGoogle";
import CityMutation from "../../graphQL/Mutation/Setting/citySettingAkun";
import HasPassword from "../../graphQL/Query/Settings/HasPassword";
import AkunConnect from "../../graphQL/Query/Settings/AkunConnect";
import CityInformation from "../../graphQL/Query/Cities/CitiesInformation";
import { RNToasty } from "react-native-toasty";
import SettingCity from "./SettingCity";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-community/google-signin";
import unConnectionGoogle from "../../graphQL/Mutation/Setting/disConnectionGoogle";
import { LoginManager, AccessToken } from "react-native-fbsdk";
import { setSettingUser, setTokenApps } from "../../redux/action";
import { useDispatch, useSelector } from "react-redux";

export default function SettingsAkun(props) {
  let dispatch = useDispatch();
  // let [token, setToken] = useState(props.route.params.token);
  // let [setting, setSetting] = useState(props.route.params.setting);
  let token = useSelector((data) => data.token);
  let setting = useSelector((data) => data.setting);
  let { t, i18n } = useTranslation();
  let [modalEmail, setModalEmail] = useState(false);
  let [modalPhone, setModalPhone] = useState(false);
  let [modalBirth, setModalBirth] = useState(false);
  let [modalBirth1, setModalBirth1] = useState(false);
  let [modalGender, setModalGender] = useState(false);
  let [modalDisconnect, setModalDisconnect] = useState(false);
  let [genders, setGender] = useState(props.route.params.setting?.user?.gender);
  let [dates, setDate] = useState();
  let [searchCity, setSearchCity] = useState("");
  let [soon, setSoon] = useState(false);
  let indexSend = props?.route?.param?.indexFromSettingCity;
  let [index, setIndex] = useState(0);
  let [indexTemp, setIndexTemp] = useState(0);
  let [dataCitySetting, setDataCitySetting] = useState();

  const closeBirth = () => {
    setModalBirth(false);
    setModalBirth1(true);
  };
  const closeBirth1 = () => {
    setModalBirth(true);
    setModalBirth1(false);
  };

  const HeaderComponent = {
    headerTitle: (
      <Text type="bold" size="header" style={{ color: "#fff" }}>
        {t("accountInformation")}
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
      elevation: Platform.OS == "ios" ? 0 : null,
      borderBottomWidth: Platform.OS == "ios" ? 0 : null,
      width: Platform.OS == "ios" ? Dimensions.get("screen").width : null,
      height: Platform.OS == "ios" ? StatusBar.currentHeight : null,
      textAlign: Platform.OS == "ios" ? "center" : null,
      paddingVertical: Platform.OS == "ios" ? 10 : null,
    },
    headerLeftContainerStyle: {
      background: "#FFF",
      position: "absolute",
      zIndex: 999,
      marginLeft: 10,
    },
    headerLeft: () => (
      <Button
        type="circle"
        size="small"
        variant="transparent"
        onPress={() => props.navigation.goBack()}
      >
        {Platform.OS == "ios" ? (
          <Arrowbackios height={15} width={15}></Arrowbackios>
        ) : (
          <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
        )}
      </Button>
    ),
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
      setDataCitySetting(datacity?.cities_search);
      const tempData = [...datacity?.cities_search];
      let index = await tempData.findIndex(
        (k) => k["id"] === setting?.cities?.id
      );
      if (index > -1) {
        setIndex(index);
        setIndexTemp(index);
      }
    },
  });

  const resultSearch = async (x) => {
    await setSearchCity(x);
    await querycity();
  };

  const [cek_haspassword, setCekHasPassword] = useState({});

  const {
    data: dataPassword,
    loading: loadingPassword,
    error: errorPassword,
    refetch: refetchHasPassword,
  } = useQuery(HasPassword, {
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
    // pollInterval: 5500,
    pollInterval: 5000,
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      setCekHasPassword(dataPassword?.cek_haspassword);
    },
  });
  const [dataAccountConnection, setDataAccountConnection] = useState({});

  const {
    data: dataConnectionAkun,
    loading: loadingConnectionAkun,
    error: errorConnectionAkun,
    refetch: refatchAccountConnect,
  } = useQuery(AkunConnect, {
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },

    // pollInterval: 5000,
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      setDataAccountConnection(dataConnectionAkun?.user_connection_account);
    },
  });

  const [
    mutationConnectionGoogle,
    {
      data: dataConnectionGoogle,
      loading: loadingConnectionGoogle,
      error: errorConnectionGoogle,
    },
  ] = useMutation(ConnectionGoogle, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
  });
  const [
    mutationConnectionFacebook,
    {
      data: dataConnectionFacebook,
      loading: loadingConnectionFacebook,
      error: errorConnectionFacebook,
    },
  ] = useMutation(ConnectionFacebook, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
  });
  const [
    mutationDisConnectionGoogle,
    {
      data: dataDisConnectionGoogle,
      loading: loadingDisConnectionGoogle,
      error: errorDisConnectionGoogle,
    },
  ] = useMutation(disConnectionGoogle, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
  });
  const [
    mutationDisConnectionFacebook,
    {
      data: dataDisConnectionFacebook,
      loading: loadingDisConnectionFacebook,
      error: errorDisConnectionFacebook,
    },
  ] = useMutation(disConnectionFacebook, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
  });

  const _handleGoogleConnect = async () => {
    try {
      await GoogleSignin.configure({
        iosClientId:
          "292367084833-1kfl44kqitftu0bo1apg8924o0tgakst.apps.googleusercontent.com",
        offlineAccess: false,
      });
      let data = await GoogleSignin.getCurrentUser();
      if (data) {
        await GoogleSignin.revokeAccess();
      }

      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn();

      const result = await GoogleSignin.getTokens();

      let response;
      if (result) {
        response = await mutationConnectionGoogle({
          variables: {
            client_token: result.accessToken,
          },
        });
      }

      if (
        response &&
        (response.data.connection_google.code === "200" ||
          response.data.connection_google.code === 200)
      ) {
        refatchAccountConnect();
        RNToasty.Show({
          title: "Success to Connect Google",
          position: "bottom",
        });
      } else {
        refatchAccountConnect();
        RNToasty.Show({
          title: response.data.connection_google.message,
          position: "bottom",
        });
      }
    } catch (error) {
      refatchAccountConnect();
      RNToasty.Show({
        title: "Someting Wrong",
        position: "bottom",
      });
    }
  };

  const [dataDisconnect, setDatadisconnect] = useState("facebook");
  const [idProvider, setIdProvicer] = useState("");
  const _handleModalDisconnect = async (id, provider) => {
    await setIdProvicer(id);
    await setDatadisconnect(provider);
    await setModalDisconnect(true);
  };
  const _handleGoogleDisConnect = async (id) => {
    try {
      let response = await mutationDisConnectionGoogle({
        variables: {
          id: id,
        },
      });

      if (
        response.data.unconnection_google.code === "200" ||
        response.data.unconnection_google.code === 200
      ) {
        refatchAccountConnect();
        RNToasty.Show({
          title: "Success to Disconnect Google",
          position: "bottom",
        });
      } else {
        refatchAccountConnect();
        RNToasty.Show({
          title: response.data.unconnection_google.message,
          position: "bottom",
        });
        setTimeout(() => {
          props.navigation.navigate("AddPassword", {
            setting: setting,
            token: token,
          });
        }, 500);
      }
    } catch (error) {
      RNToasty.Show({
        title: "Someting Wrong",
        position: "bottom",
      });
    }
  };
  const _handleFacebookDisConnect = async (id) => {
    try {
      let response = await mutationDisConnectionFacebook({
        variables: {
          id: id,
        },
      });

      if (
        response.data.unconnection_facebook.code === "200" ||
        response.data.unconnection_facebook.code === 200
      ) {
        refatchAccountConnect();
        RNToasty.Show({
          title: "Success to Disconnect Facebook",
          position: "bottom",
        });
      } else {
        refatchAccountConnect();
        RNToasty.Show({
          title: response.data.unconnection_facebook.message,
          position: "bottom",
        });
      }
    } catch (error) {
      RNToasty.Show({
        title: "Someting Wrong",
        position: "bottom",
      });
    }
  };
  const _handleFacebookConnect = async () => {
    try {
      let FB = await LoginManager.logInWithPermissions([
        "email",
        "public_profile",
        "user_likes",
      ]);
      let FB_Data;
      if (!FB.isCancelled) {
        FB_Data = await AccessToken.getCurrentAccessToken();
      }
      let FCM_TOKEN = await AsyncStorage.getItem("FCM_TOKEN");
      let response;
      if (FB_Data) {
        response = await mutationConnectionFacebook({
          variables: {
            client_token: FB_Data.accessToken,
          },
        });
      }

      if (
        response &&
        (response.data.connection_facebook.code === "200" ||
          response.data.connection_facebook.code === 200)
      ) {
        refatchAccountConnect();
      } else {
        refatchAccountConnect();
      }
    } catch (error) {
      RNToasty.Show({
        title: "Failed to Connect Facebook",
        position: "bottom",
      });
    }
  };

  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    // await setToken(tkn);
    // dispatch(setTokenApps(`Bearer ${tkn}`));
    if (index === indexTemp) {
      querycity();
    }
    refetchHasPassword();
    refatchAccountConnect();
    // await passwords();
    let setsetting = await AsyncStorage.getItem("setting");
    // setSetting(JSON.parse(setsetting));
    dispatch(setSettingUser(JSON.parse(setsetting)));
  };

  const [
    mutationGender,
    { data: dataGender, loading: loadingGender, error: errorGender },
  ] = useMutation(Gender, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
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
        Authorization: token,
      },
    },
  });

  useEffect(() => {
    if (!props.route.params.setting?.user?.birth_date) {
      setDate("1972-01-01");
    } else {
      setDate(props.route.params.setting?.user?.birth_date);
    }
    props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      loadAsync();
    });
    return unsubscribe;
  }, [props.navigation, index, indexSend]);

  const arrayShadow = {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: Platform.OS == "ios" ? 0.22 : 2,
    shadowRadius: Platform.OS == "ios" ? 2.22 : 1.0,
    elevation: Platform.OS == "ios" ? 3 : 1,
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
          RNToasty.Show({
            title: t("FailedSetGender"),
            position: "bottom",
          });
        } else {
          setModalGender(false);
          RNToasty.Show({
            title: t("SuccessfullySetGender"),
            position: "bottom",
          });
          let tmp_data = { ...setting };
          tmp_data.user.gender = x;
          // await setSetting(tmp_data);
          await AsyncStorage.setItem("setting", JSON.stringify(tmp_data));
          dispatch(setSettingUser(tmp_data));
        }
      }
    } catch (error) {
      RNToasty.Show({
        title: t("FailedSetGender"),
        position: "bottom",
      });
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
      if (response.data) {
        if (response.data.update_birth_settings.code !== 200) {
          RNToasty.Show({
            title: t("FailedSetDateofBirth"),
            position: "bottom",
          });
        } else {
          setModalBirth(false);
          RNToasty.Show({
            title: t("SuccessfullySetDateofBirth"),
            position: "bottom",
          });
          let tmp_data = { ...setting };
          tmp_data.user.birth_date = format;
          // await setSetting(tmp_data);
          await AsyncStorage.setItem("setting", JSON.stringify(tmp_data));
          dispatch(setSettingUser(tmp_data));
        }
      }
    } catch (error) {
      RNToasty.Show({
        title: t("FailedSetDateofBirth"),
        position: "bottom",
      });
    }
  };

  const _handlehasPassword = () => {
    if (token !== "" && token !== null) {
      if (cek_haspassword) {
        if (cek_haspassword.ishasPassword === true) {
          props.navigation.navigate("HasPassword", {
            setting: setting,
            token: token,
          });
        } else {
          props.navigation.navigate("AddPassword", {
            setting: setting,
            token: token,
          });
        }
      }
    }
  };

  const emailChange = async () => {
    await (setModalEmail(false), 3000);
    if (dataPassword?.cek_haspassword?.ishasPassword === true) {
      return await props.navigation.navigate("SettingEmailChange", {
        setting: setting,
        token: token,
      });
    } else {
      return await props.navigation.navigate("AddPasswordEmail", {
        setting: setting,
        token: token,
      });
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
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{
        backgroundColor: "#F6F6F6",
        // flex: 1,
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
            borderRadius: 5,
            marginTop: Dimensions.get("screen").height / 3,
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
              borderRadius: 5,
            }}
          >
            <Image
              source={Bg_soon}
              style={{
                height: Dimensions.get("screen").width - 180,
                width: Dimensions.get("screen").width - 110,
                position: "absolute",
                borderRadius: 5,
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
                {t("ChangeEmail")}
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
                {t("deletePhoneNumber")}
              </Text>
              <Text
                type="bold"
                size="label"
                onPress={() => {
                  setModalPhone(!modalPhone);
                }}
                onPress={() => {
                  setModalPhone(false),
                    props.navigation.navigate("SettingPhoneChange", {
                      setting: setting,
                      token: token,
                    });
                }}
              >
                {t("ChangePhoneNumber")}
              </Text>
            </View>
          </View>
        </Modal>
      </View>

      {/* Modal Birth Date */}

      <ModalRN
        onRequestClose={() => setModalBirth(false)}
        onBackdropPress={() => setModalBirth(false)}
        visible={modalBirth}
        transparent={true}
      >
        <Pressable
          onPress={() => setModalBirth(false)}
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
              width: Dimensions.get("screen").width - 110,
              borderRadius: 5,
            }}
          >
            <View
              style={{
                backgroundColor: "#f6f6f6",
                borderRadius: 5,
                alignItems: "center",
                borderBottomColor: "#d1d1d1",
                borderBottomWidth: 1,
              }}
            >
              <Text
                size="title"
                type="bold"
                style={{ marginTop: 12, marginBottom: 15 }}
              >
                {t("birthdate")}
              </Text>
              <Pressable
                onPress={() => setModalBirth(false)}
                style={{
                  height: 50,
                  width: 55,
                  position: "absolute",
                  right: 0,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Xgray width={15} height={15} />
              </Pressable>
            </View>
            <Pressable
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottomWidth: 1,
                borderBottomColor: "#464646",
                marginTop: 30,
                marginHorizontal: 20,
              }}
              onPress={() => closeBirth()}
            >
              <Text size="label" type="regular" style={{ marginVertical: 10 }}>
                {dates ? dateFormatYMD(dates) : t("birthofdate")}
              </Text>
              <CustomImage
                source={calendar_blue}
                customStyle={{ width: 20, height: 20 }}
              />
            </Pressable>
            <View
              style={{
                marginVertical: 20,
                flexDirection: "row",
                justifyContent: "space-between",
                marginHorizontal: 30,
              }}
            >
              <Button
                variant="transparent"
                size="medium"
                style={{ width: "48%" }}
                // color="green"
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
        date={new Date(dates)}
        onConfirm={(e) => dateTime(e)}
        onCancel={() => closeDatPicker()}
      />

      {/* Modal Jenis Kelamin */}

      <ModalRN
        onRequestClose={() => setModalGender(false)}
        onBackdropPress={() => setModalGender(false)}
        transparent={true}
        visible={modalGender}
      >
        <Pressable
          onPress={() => setModalGender(false)}
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
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
            alignContent: "center",
            borderRadius: 5,
            width: Dimensions.get("screen").width - 110,
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              width: Dimensions.get("screen").width - 110,
              borderRadius: 5,
            }}
          >
            <View
              style={{
                backgroundColor: "#f6f6f6",
                borderRadius: 5,
                borderBottomColor: "#d1d1d1",
                borderBottomWidth: 1,
                alignItems: "center",
              }}
            >
              <Text
                size="title"
                type="bold"
                style={{ marginTop: 12, marginBottom: 15 }}
              >
                {t("gender")}
              </Text>
            </View>
            <Pressable
              onPress={() => setModalGender(false)}
              style={{
                height: 50,
                width: 55,
                position: "absolute",
                right: 0,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Xgray width={15} height={15} />
            </Pressable>
            <View
              style={{
                marginHorizontal: 20,
                marginTop: 20,
                borderBottomColor: "#464646",
                borderBottomWidth: 1,
              }}
            >
              <Picker
                note
                mode="dropdown"
                style={{
                  width: "107%",
                  height: Platform.OS === "ios" ? 200 : 40,
                  fontSize: 14,
                  fontFamily: "Lato-Regular",
                  marginLeft: -8,
                  elevation: 20,
                }}
                selectedValue={genders}
                onValueChange={(x) => setGender(x)}
              >
                <Picker.Item label={t("gender")} />
                <Picker.Item label={t("Male")} value="M" />
                <Picker.Item label={t("Female")} value="F" />
              </Picker>
            </View>
            <View
              style={{
                marginVertical: 30,
                flexDirection: "row",
                justifyContent: "space-between",
                marginHorizontal: 20,
              }}
            >
              <Button
                size="medium"
                style={{ width: "48%" }}
                variant="transparent"
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
      </ModalRN>
      {/* <NavigationEvents onDidFocus={() => loadAsync()} /> */}
      <View
        style={{
          marginTop: 15,
          marginHorizontal: 15,
          backgroundColor: "#FFF",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.1,
          shadowRadius: 6.27,
          elevation: 2,
          borderRadius: 10,
        }}
      >
        <View
          style={{
            paddingHorizontal: 15,
            paddingTop: 13,
          }}
        >
          <Text size="title" type="bold">
            {t("personalData")}
          </Text>
        </View>
        <Ripple
          rippleCentered={true}
          // onPress={() => setModelSetNegara(true)}
          style={{
            paddingHorizontal: 15,
            // paddingVertical: 13,
            borderBottomColor: "#D1D1D1",
            borderBottomWidth: 0.5,
          }}
        >
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              marginBottom: 15,
              marginTop: 13,
            }}
          >
            <Text size="label" type="regular">
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
                      : t("notSet")
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
            // paddingVertical: 13,
            borderBottomColor: "#D1D1D1",
            borderBottomWidth: 0.5,
          }}
        >
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              marginBottom: 15,
              marginTop: 13,
            }}
          >
            <Text size="label" type="regular">
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
                      : t("notSet")
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
            // paddingVertical: 13,
            borderBottomColor: "#D1D1D1",
            borderBottomWidth: 0.5,
          }}
          onPress={() => setModalGender(true)}
        >
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              marginBottom: 15,
              marginTop: 13,
            }}
          >
            <Text size="label" type="regular">
              {t("gender")}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text size="description" type="light" style={{}}>
                {setting && setting.user && setting.user?.gender
                  ? setting.user?.gender === "M"
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
            // paddingVertical: 13,
            borderBottomColor: "#D1D1D1",
            borderBottomWidth: 0.5,
          }}
        >
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              marginBottom: 15,
              marginTop: 13,
            }}
          >
            <Text size="label" type="regular">
              {t("birthdate")}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text size="description" type="light" style={{}}>
                {dates ? dateFormat(dates) : t("notSet")}
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
                // setting: setting,
                // token: token,
                // setSetting: (e) => setSetting(e),
                index: index != indexSend ? indexSend : index,
                setIndex: (e) => setIndex(e),
              },
            })
          }
          style={{
            paddingHorizontal: 15,
            // paddingVertical: 13,
          }}
        >
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              marginBottom: 15,
              marginTop: 13,
            }}
          >
            <Text size="label" type="regular">
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
          flexDirection: "column",
          marginVertical: 15,
          paddingHorizontal: 15,
          marginHorizontal: 15,
          // paddingVertical: 13,
          backgroundColor: "#FFFFFF",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.1,
          shadowRadius: 6.27,
          elevation: 2,
          borderRadius: 10,
        }}
      >
        <View
          style={{
            marginTop: 15,
            width: "100%",
          }}
        >
          <Text
            size="label"
            type="bold"
            style={{
              marginBottom: 10,
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
                    // props.navigation.navigate("SettingEmailChange", {
                    //   setting: setting,
                    // })
                    {
                      if (
                        cek_haspassword.ishasPassword &&
                        cek_haspassword.ishasPassword === true
                      ) {
                        return props.navigation.navigate("SettingEmailChange", {
                          setting: setting,
                          token: token,
                        });
                      } else {
                        return props.navigation.navigate("AddPasswordEmail", {
                          setting: setting,
                          token: token,
                        });
                      }
                    }
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
                      size="label"
                      style={{
                        alignSelf: "flex-start",
                        marginBottom: 5,
                      }}
                    >
                      {setting && setting.user && setting.user.email
                        ? setting.user.email
                        : t("notSet")}
                    </Text>
                    <Text
                      type="regular"
                      size="small"
                      style={{ color: "#6c6c6c" }}
                    >
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
                width: "100%",
              }}
              type="box"
              size="medium"
              color="green"
              text={t("AddEmail")}
              onPress={() => {
                cek_haspassword && cek_haspassword.ishasPassword === true
                  ? props.navigation.navigate("SettingEmail", {
                      dataEmail: setting.user,
                      setting: setting,
                      token: token,
                    })
                  : props.navigation.navigate("AddPassword", {
                      setting: setting,
                      token: token,
                    });
              }}
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

        <Pressable
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginVertical: 10,
            borderTopColor: "#D1D1D1",
            borderTopWidth: 0.5,
            // paddingHorizontal: 15,
            // marginHorizontal: 15,
            // backgroundColor: "#FFFFFF",
            // shadowColor: "#000",
            // shadowOffset: {
            //   width: 0,
            //   height: 5,
            // },
            // shadowOpacity: 0.1,
            // shadowRadius: 6.27,
            // elevation: 2,
            // borderRadius: 5,
          }}
          onPress={() => _handlehasPassword()}
        >
          <Text
            size="label"
            type="regular"
            style={{
              marginBottom: 15,
              marginTop: 13,
            }}
          >
            {t("password")}
          </Text>
          <Nextpremier
            width={15}
            height={15}
            style={{
              marginVertical: 15,
            }}
          />
        </Pressable>
      </View>

      <View
        style={{
          flexDirection: "row",
          marginBottom: 15,
          paddingHorizontal: 15,
          marginHorizontal: 15,
          backgroundColor: "#FFFFFF",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.1,
          shadowRadius: 6.27,
          elevation: 2,
          borderRadius: 10,
        }}
      >
        <View style={{ marginVertical: 15, width: "100%" }}>
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
                    size="label"
                    style={{
                      alignSelf: "flex-start",
                      marginVertical: 5,
                    }}
                  >
                    {setting.user.phone}
                  </Text>
                  <Text
                    type="regular"
                    size="small"
                    style={{ color: "#6c6c6c" }}
                  >
                    {t("phoneUsed")}
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <Button
              style={{
                width: "100%",
                paddingHorizontal: 10,
                marginTop: 5,
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

      <View
        style={{
          // flexDirection: "row",
          marginBottom: 15,
          paddingHorizontal: 15,
          marginHorizontal: 15,
          // paddingVertical: 13,
          backgroundColor: "#FFFFFF",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.1,
          shadowRadius: 6.27,
          elevation: 2,
          borderRadius: 10,
        }}
      >
        <View style={{ marginVertical: 15, width: "100%" }}>
          <Text
            size="label"
            type="bold"
            style={{
              marginBottom: 10,
            }}
          >
            {t("connectedAccount")}
          </Text>
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              alignItems: "flex-end",
              marginBottom: 15,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                width: Dimensions.get("screen").width - 60,
                // borderWidth: 1,
              }}
            >
              <FacebookIcon width={40} height={40} />
              <Pressable
                onPress={() =>
                  // props.navigation.navigate("SettingEmailChange", {
                  //   setting: setting,
                  // })
                  {
                    dataAccountConnection?.facebook
                      ? _handleModalDisconnect(
                          dataAccountConnection?.facebook.id,
                          "facebook"
                        )
                      : _handleFacebookConnect();
                  }
                }
                style={{
                  marginLeft: 5,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  // width: "100%",
                  flex: 1,
                  // borderWidth: 1,
                }}
              >
                <View
                  style={{
                    alignContent: "flex-start",
                    justifyContent: "flex-start",
                    // width: "70%",
                  }}
                >
                  <Text
                    type="bold"
                    size="label"
                    style={{
                      alignSelf: "flex-start",
                      marginTop: dataAccountConnection?.facebook ? -15 : -5,
                    }}
                  >
                    Facebook
                  </Text>
                  {dataAccountConnection?.facebook ? (
                    <Text
                      type="regular"
                      size="small"
                      style={{ color: "#6c6c6c" }}
                    >
                      {dataAccountConnection?.facebook?.name}
                    </Text>
                  ) : null}
                </View>
                <Text
                  type="regular"
                  size="label"
                  style={{
                    color: dataAccountConnection?.facebook
                      ? "#D75995"
                      : "#209fae",
                    // color: "#D75995",
                    // width: "30%",
                    // marginBottom: 5,
                  }}
                >
                  {dataAccountConnection?.facebook
                    ? t("disConnect")
                    : t("connect")}
                </Text>
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
                width: Dimensions.get("screen").width - 60,
              }}
            >
              <GoogleIcon width={40} height={40} />
              <Pressable
                onPress={() => {
                  dataAccountConnection?.gmail
                    ? _handleModalDisconnect(
                        dataAccountConnection?.gmail?.id,
                        "google"
                      )
                    : _handleGoogleConnect();
                }}
                style={{
                  marginLeft: 5,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  // width: "100%",
                  flex: 1,
                }}
              >
                <View
                  style={{
                    alignContent: "flex-start",
                    justifyContent: "flex-start",
                  }}
                >
                  <Text
                    type="bold"
                    size="label"
                    style={{
                      alignSelf: "flex-start",
                      marginTop: dataAccountConnection?.gmail?.email ? -5 : -5,
                    }}
                  >
                    Google
                  </Text>
                  {dataAccountConnection?.gmail?.email ? (
                    <Text
                      type="regular"
                      size="small"
                      style={{ color: "#6c6c6c" }}
                    >
                      {dataAccountConnection?.gmail?.email}
                    </Text>
                  ) : null}
                </View>
                <Text
                  type="regular"
                  size="label"
                  style={{
                    color: dataAccountConnection?.gmail ? "#D75995" : "#209fae",
                    // color: "#D75995",
                    // width: "30%",
                    marginBottom: 8,
                  }}
                >
                  {dataAccountConnection?.gmail
                    ? t("disConnect")
                    : t("connect")}
                </Text>
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
        </View>
      </View>
      {/* modal remove_admin */}
      <ModalRN
        useNativeDriver={true}
        visible={modalDisconnect}
        onRequestClose={() => setModalDisconnect(false)}
        transparent={true}
        animationType="fade"
      >
        <Pressable
          onPress={() => setModalDisconnect(false)}
          style={{
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
            justifyContent: "center",
            opacity: 0.7,
            backgroundColor: "#000",
            position: "absolute",
            // top: 0,
            // left: -21,
          }}
        />
        <View
          style={{
            width: Dimensions.get("screen").width - 100,
            marginHorizontal: 50,
            backgroundColor: "#FFF",
            borderRadius: 5,
            zIndex: 10,
            marginTop: Dimensions.get("screen").height / 3,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5,
              paddingHorizontal: 20,
              backgroundColor: "#f6f6f6",
              borderBottomColor: "#d1d1d1",
              borderBottomWidth: 1,
              justifyContent: "center",
            }}
          >
            <Text
              size="title"
              type="bold"
              style={{ marginTop: 13, marginBottom: 15 }}
            >
              {dataDisconnect == "facebook"
                ? t("disconnectFacebook")
                : t("disconnectGoogle")}
            </Text>
            <Pressable
              onPress={() => setModalDisconnect(false)}
              style={{
                height: 50,
                width: 55,
                position: "absolute",
                right: 0,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Xgray width={15} height={15} />
            </Pressable>
          </View>
          <View style={{ paddingHorizontal: 20, marginVertical: 20 }}>
            <Text
              style={{ alignSelf: "center", textAlign: "center" }}
              size="label"
              type="regular"
            >
              {dataDisconnect == "facebook"
                ? t("alertDisconnectFacebook")
                : t("alertDisconnectGoogle")}
            </Text>
          </View>
          <View
            style={{
              paddingHorizontal: 20,
            }}
          >
            <Button
              onPress={() => {
                if (dataDisconnect == "facebook") {
                  _handleFacebookDisConnect(idProvider);
                } else {
                  _handleGoogleDisConnect(idProvider);
                }
                setModalDisconnect(false);
              }}
              color="secondary"
              text={
                dataDisconnect == "facebook"
                  ? t("disconnectFacebook")
                  : t("disconnectGoogle")
              }
            ></Button>
            <Button
              onPress={() => {
                setModalDisconnect(false);
              }}
              // color="secondary"
              variant="transparent"
              text={t("cancel")}
              style={{ marginTop: 5, marginBottom: 15 }}
            ></Button>
          </View>
        </View>
      </ModalRN>
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
