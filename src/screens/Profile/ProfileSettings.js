import React, { useState, useEffect } from "react";
import {
  View,
  Dimensions,
  Image,
  ScrollView,
  Alert,
  ImageBackground,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import Modal from "react-native-modal";
import { Button, Text, Loading } from "../../component";
import { Addphoto, Arrowbackwhite } from "../../assets/svg";
import { Input, Item, Label } from "native-base";
import { useTranslation } from "react-i18next";
import EditProfile from "../../graphQL/Mutation/Profile/EditProfile";
import Uploadfoto from "../../graphQL/Mutation/Profile/Uploadfoto";
import Check from "../../graphQL/Query/Profile/check";
import { useLazyQuery, useMutation } from "@apollo/client";
import { Akunsaya } from "../../assets/png";
import ImagePicker from "react-native-image-crop-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileSettings(props) {
  const HeaderComponent = {
    title: "",
    headerTransparent: true,
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
      <Button
        text={""}
        size="medium"
        type="circle"
        variant="transparent"
        onPress={() => backAction()}
        style={{
          backgroundColor: "rgba(0,0,0,0.3)",
        }}
      >
        <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
      </Button>
    ),
  };

  const { t, i18n } = useTranslation();
  const [dataerror, setdataerror] = useState({
    first_name: false,
    last_name: false,
    username: false,
    bio: false,
  });
  const token = props.route.params.token;
  let [loading, setLoading] = useState(false);
  const [modals, setmodal] = useState(false);
  let [dataImage, setdataImage] = useState(null);
  let [dataImagepatch, setdataImagepatch] = useState(
    props.route.params.data.picture
  );
  // let [seting, setSeting] = useState({});
  // const [data, setdata] = useState(props.route.params.data);
  let data = React.useRef({ ...props.route.params.data });

  let seting = React.useRef({});

  const loadAsync = async () => {
    let setting = await AsyncStorage.getItem("setting");
    setting = JSON.parse(setting);
    seting.current = setting;
  };

  const backAction = () => {
    Alert.alert("", t("areyousure"), [
      {
        text: t("discard"),
        onPress: () => {
          BackHandler.removeEventListener("hardwareBackPress", backAction);
          props.navigation.goBack();
        },
        style: "cancel",
      },
      {
        text: t("saved"),
        onPress: () => {
          BackHandler.removeEventListener("hardwareBackPress", backAction);
          _handlesave();
        },
      },
    ]);
    return true;
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    loadAsync();

    BackHandler.addEventListener("hardwareBackPress", backAction);

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, []);

  const upload = async (data) => {
    setmodal(false);
    setLoading(true);
    if (data) {
      // console.log(tmpFile.base64);
      try {
        let response = await mutationUpload({
          variables: {
            picture: "data:image/jpeg;base64," + data,
          },
        });
        if (errorupload) {
          throw new Error("Error Input");
        }
        if (response.data) {
          if (response.data.update_fotoprofile.code !== 200) {
            throw new Error(response.data.update_fotoprofile.message);
          }
          // Alert.alert(t('success'));
          let Xsetting = { ...seting.current };
          Xsetting.user["picture"] = response.data.update_fotoprofile.message;
          await AsyncStorage.setItem("setting", JSON.stringify(Xsetting));

          //  await props.navigation.goBack();
        }
        setLoading(false);
      } catch (error) {
        Alert.alert("" + error);
        setLoading(false);
      }
    }
  };

  const pickcamera = async () => {
    ImagePicker.openCamera({
      width: 500,
      height: 500,
      cropping: true,
      cropperCircleOverlay: true,
      includeBase64: true,
    }).then((image) => {
      // console.log(image);
      setdataImage(image.data);
      setdataImagepatch(image.path);
      setmodal(false);
      // upload(image.data);
    });
  };

  const pickGallery = async () => {
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      cropping: true,
      cropperCircleOverlay: true,
      includeBase64: true,
    }).then((image) => {
      // console.log(image);
      setdataImage(image.data);
      setdataImagepatch(image.path);
      setmodal(false);
      // upload(image.data);
    });
  };

  const validation = (name, value) => {
    // let regx = /^\s*\S+\s*$/;
    let regx = /^(?=[a-zA-Z0-9._]{6,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    if (name === "first_name") {
      return value.length <= 2 || value.length > 20 ? false : true;
    } else if (name === "last_name") {
      return value.length > 20 ? false : true;
    } else if (name === "username") {
      return value.match(regx)
        ? value.length <= 5 ||
          value.length > 30 ||
          value.toLowerCase() !== value
          ? false
          : true
        : false;
    } else if (name === "bio") {
      return value.length > 160 ? false : true;
    } else {
      return true;
    }
  };
  const _handleOnChange = async (value, name) => {
    let check = validation(name, value);
    // await setdata({ ...data, [name]: value });
    data.current[name] = value;

    if (!check) {
      await setdataerror({ ...dataerror, [name]: true });
    } else {
      await setdataerror({ ...dataerror, [name]: false });

      if (name === "username") {
        await GetUsername();
      }
    }
  };

  const [
    mutationEdit,
    { loading: loadingEdit, data: dataEdit, error: errorEdit },
  ] = useMutation(EditProfile, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const [
    mutationUpload,
    { loading: loadingupload, data: dataupload, error: errorupload },
  ] = useMutation(Uploadfoto, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const [
    GetUsername,
    { data: datausername, loading: loadingusername, error: errorusername },
  ] = useLazyQuery(Check, {
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    variables: { type: "username", key: data.current.username },
  });

  const _handlesave = async () => {
    setLoading(true);
    if (dataImage) {
      await upload(dataImage);
    }

    let x = 0;
    for (var i in dataerror) {
      if (dataerror[i] === true) {
        x++;
      }
    }

    if (x > 0 || (datausername && datausername.user_check.isused === true)) {
      setLoading(false);
      Alert.alert(t("Terdapat kesalahan"));
    } else {
      // console.log(datausername);
      try {
        let response = await mutationEdit({
          variables: {
            first_name: data.current.first_name,
            last_name: data.current.last_name,
            username: data.current.username,
            bio: data.current.bio,
          },
        });
        if (errorEdit) {
          throw new Error("Error Input");
        }
        if (response.data) {
          if (response.data.update_profile.code !== 200) {
            throw new Error(response.data.update_profile.message);
          }
          // Alert.alert(t('success'));

          let Xsetting = { ...seting.current };
          console.log(Xsetting.user);
          Xsetting.user["first_name"] = data.current.first_name;
          Xsetting.user["last_name"] = data.current.last_name;
          Xsetting.user["username"] = data.current.username;
          Xsetting.user["bio"] = data.current.bio;
          AsyncStorage.setItem("setting", JSON.stringify(Xsetting));
          props.navigation.goBack();
        }
        setLoading(false);
      } catch (error) {
        Alert.alert("" + error);
        setLoading(false);
      }
    }
  };

  console.log(seting.current.user);

  return (
    <ScrollView contentContainerStyle={{}} showsVerticalScrollIndicator={false}>
      <ImageBackground
        source={Akunsaya}
        imageStyle={{
          width: Dimensions.get("screen").width,
          height: 200,
          resizeMode: "cover",
        }}
        style={{
          width: Dimensions.get("screen").width,
          height: 200,
        }}
      ></ImageBackground>
      <View
        style={{
          width: Dimensions.get("screen").width,
          justifyContent: "center",
          flexDirection: "row",
          // position: 'absolute',
          marginTop: -50,
          paddingHorizontal: 20,
          alignItems: "flex-end",
          // borderWidth: 1,
        }}
      >
        <View
          style={{
            // position: 'absolute',
            shadowOpacity: 0.5,
            shadowColor: "#d3d3d3",
            elevation: 4,
            alignSelf: "center",
            borderColor: "white",
            borderRadius: 60,
            borderWidth: 3,
            backgroundColor: "#B8E0E5",
            height: 101,
            width: 101,

            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={{ uri: dataImagepatch }}
            style={{
              borderRadius: 60,
              resizeMode: "cover",
              height: "100%",
              width: "100%",
            }}
          />
          <Button
            onPress={() => setmodal(true)}
            style={{ position: "absolute", right: -15, bottom: 0 }}
            type="circle"
            color="secondary"
            size="small"
          >
            <Addphoto width={15} height={15} />
          </Button>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 20,
          width: Dimensions.get("window").width,
          justifyContent: "space-between",
          // borderWidth: 1,
          marginTop: 20,
        }}
      >
        <View style={{ width: "45%" }}>
          <Item
            floatingLabel
            style={
              {
                // marginVertical: 10,
              }
            }
          >
            <Label
              style={{
                fontFamily: "Lato-Regular",
                fontSize: 14,
              }}
            >
              {t("firstName")}
            </Label>
            <Input
              maxLength={20}
              style={{ fontFamily: "Lato-Regular", fontSize: 14 }}
              value={data.current.first_name ? data.current.first_name : ""}
              onChangeText={(text) => _handleOnChange(text, "first_name")}
              keyboardType="default"
            />
          </Item>
          {dataerror && dataerror.first_name === true ? (
            <Text
              type="regular"
              size="small"
              style={{
                color: "#D75995",
              }}
            >
              {t("inputWarningName")}
              {t("firstName")}
            </Text>
          ) : null}
        </View>
        <View style={{ width: "45%" }}>
          <Item
            floatingLabel
            style={
              {
                // marginVertical: 10,
              }
            }
          >
            <Label
              style={{
                fontFamily: "Lato-Regular",
                fontSize: 14,
              }}
            >
              {t("lastName")}
            </Label>
            <Input
              maxLength={20}
              style={{ fontFamily: "Lato-Regular", fontSize: 14 }}
              value={data.current.last_name ? data.current.last_name : ""}
              onChangeText={(text) => _handleOnChange(text, "last_name")}
              keyboardType="default"
            />
          </Item>
          {dataerror && dataerror.last_name === true ? (
            <Text
              type="regular"
              size="small"
              style={{
                color: "#D75995",
              }}
            >
              {t("inputWarningName")}
              {t("lastName")}
            </Text>
          ) : null}
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 20,
          width: Dimensions.get("window").width,
          justifyContent: "space-between",
          // borderWidth: 1,
          marginTop: 20,
        }}
      >
        <View style={{ width: "100%" }}>
          <Item
            floatingLabel
            style={
              {
                // marginVertical: 10,
              }
            }
          >
            <Label
              style={{
                fontFamily: "Lato-Regular",
                fontSize: 14,
              }}
            >
              {t("username")}
            </Label>
            <Input
              maxLength={30}
              style={{ fontFamily: "Lato-Regular", fontSize: 14 }}
              value={data.current.username ? data.current.username : ""}
              onChangeText={(text) => _handleOnChange(text, "username")}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="default"
            />
          </Item>
          {dataerror && dataerror.username === true ? (
            <Text
              type="regular"
              size="small"
              style={{
                color: "#D75995",
              }}
            >
              {/* {t("inputWarningName")} */}
              {t("username")} {t("min6char")}
            </Text>
          ) : null}
          {datausername && datausername.user_check.isused === true ? (
            <Text
              type="regular"
              size="small"
              style={{
                color: "#D75995",
              }}
            >
              *{t("Usernameisused")}
            </Text>
          ) : null}
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 20,
          width: Dimensions.get("window").width,
          justifyContent: "space-between",
          // borderWidth: 1,
          marginTop: 20,
        }}
      >
        <View style={{ width: "100%" }}>
          <Item
            floatingLabel
            style={
              {
                // marginVertical: 10,
              }
            }
          >
            <Label
              style={{
                fontFamily: "Lato-Regular",
                fontSize: 14,
              }}
            >
              {t("Bio")}
            </Label>
            <Input
              maxLength={160}
              style={{ fontFamily: "Lato-Regular", fontSize: 14 }}
              value={data.current.bio ? data.current.bio : ""}
              onChangeText={(text) => _handleOnChange(text, "bio")}
              keyboardType="default"
            />
          </Item>
          {dataerror && dataerror.bio === true ? (
            <Text
              type="regular"
              size="small"
              style={{
                color: "#D75995",
              }}
            >
              *{t("bio ditolak")}
            </Text>
          ) : null}
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 20,
          width: Dimensions.get("window").width,
          justifyContent: "space-between",
          // borderWidth: 1,
          marginTop: 20,
        }}
      >
        <View
          style={{
            width: "100%",
            borderBottomWidth: 1,
            borderBottomColor: "#d3d3d3",
          }}
        >
          <Text type="bold" size="title">
            {t("accountInformation")}
          </Text>
        </View>
      </View>
      <View
        style={{
          // flexDirection: 'row',
          paddingHorizontal: 20,
          width: Dimensions.get("window").width,
          justifyContent: "space-between",
          // borderWidth: 1,
          marginTop: 10,
        }}
      >
        <Text style={{ color: "#A6A6A6" }}>{t("emailAddress")}</Text>
        <Text size="description">
          {data.current.email ? data.current.email : "-"}
        </Text>
      </View>
      <View
        style={{
          // flexDirection: 'row',
          paddingHorizontal: 20,
          width: Dimensions.get("window").width,
          justifyContent: "space-between",
          // borderWidth: 1,
          marginTop: 10,
        }}
      >
        <Text style={{ color: "#A6A6A6" }}>{t("phoneNumber")}</Text>
        <Text size="description">
          {data.current.phone ? data.current.phone : "-"}
        </Text>
      </View>
      <View
        style={{
          // flexDirection: 'row',
          paddingHorizontal: 20,
          width: Dimensions.get("window").width,
          justifyContent: "space-between",
          // borderWidth: 1,
          marginVertical: 20,
        }}
      >
        <Button
          color="secondary"
          style={{}}
          text={t("save")}
          onPress={() => {
            _handlesave();
          }}
        />
      </View>
      <Loading show={loading} />
      <Modal
        onBackdropPress={() => {
          setmodal(false);
        }}
        onRequestClose={() => setmodal(false)}
        onDismiss={() => setmodal(false)}
        animationIn="fadeIn"
        animationOut="fadeOut"
        isVisible={modals}
        style={{
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
          alignContent: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            width: Dimensions.get("screen").width - 60,
            padding: 20,
          }}
        >
          <TouchableOpacity
            style={{
              paddingVertical: 10,
            }}
            onPress={() => pickcamera()}
          >
            <Text size="description" type="regular" style={{}}>
              {t("OpenCamera")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              paddingVertical: 10,
            }}
            onPress={() => pickGallery()}
          >
            <Text size="description" type="regular" style={{}}>
              {t("OpenGallery")}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
}
