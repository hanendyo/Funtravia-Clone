import React, { useState, useEffect } from "react";
import {
  View,
  Dimensions,
  Image,
  ScrollView,
  Alert,
  ImageBackground,
  TouchableOpacity,
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

export default function ProfileSettings(props) {
  const { t, i18n } = useTranslation();
  const [data, setdata] = useState(props.route.params.data);
  const [dataerror, setdataerror] = useState({
    first_name: false,
    last_name: false,
    username: false,
    bio: false,
  });
  const token = props.route.params.token;
  let [loading, setLoading] = useState(false);
  const [modals, setmodal] = useState(false);

  useEffect(() => {
    // (async () => {
    //   let { status } = await Permissions.askAsync(Permissions.CAMERA);
    //   if (status !== "granted") {
    //     Alert.alert(t("permissioncamera"));
    //   }
    // }
    // )();
    // (async () => {
    // 	let { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    // 	if (status !== 'granted') {
    // 		Alert.alert(t('permissioncamera'));
    // 	}
    // })();
    // (async () => {
    // 	let { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
    // 	if (status !== 'granted') {
    // 		Alert.alert(
    // 			t('permissioncamera')
    // 		);
    // 	}
    // })();
  }, []);

  const upload = async (data) => {
    setmodal(false);
    setLoading(true);
    // console.log(data);
    const manipulate = await ImageManipulators.manipulateAsync(data, [], {
      compress: 0.5,
      base64: true,
    });
    let tmpFile = Object.assign(data, { base64: manipulate.base64 });
    if (tmpFile.base64) {
      // console.log(tmpFile.base64);
      try {
        let response = await mutationUpload({
          variables: {
            picture: "data:image/jpeg;base64," + tmpFile.base64,
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
          props.navigation.goBack();
        }
        setLoading(false);
      } catch (error) {
        Alert.alert("" + error);
        setLoading(false);
      }
    }
  };

  let [uri, seturi] = useState("");

  const pickcamera = async () => {
    ImagePicker.openCamera({
      width: 500,
      height: 500,
      cropping: true,
      cropperCircleOverlay: true,
      includeBase64: true,
    }).then((image) => {
      seturi(image.path);
      //do something with the image
    });

    // let result = await launchCamera({
    //   allowsEditing: true,
    //   aspect: [4, 4],
    //   quality: 1,
    // },);
    // if (!result.cancelled) {
    //   upload(result.uri);
    // }
  };
  const pickGallery = async () => {
    let result = await launchImageLibrary({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });
    if (!result.cancelled) {
      upload(result.uri);
    }
  };

  const validation = (name, value) => {
    let regx = /^\s*\S+\s*$/;

    if (name === "first_name") {
      return value.length <= 2 || value.length > 20 ? false : true;
    } else if (name === "last_name") {
      return value.length > 20 ? false : true;
    } else if (name === "username") {
      return value.match(regx)
        ? value.length <= 2 || value.length > 30
          ? false
          : true
        : false;
    } else if (name === "bio") {
      return value.length > 160 ? false : true;
    } else {
      return true;
    }
  };
  const _handleOnChange = (value, name) => {
    let check = validation(name, value);
    setdata({ ...data, [name]: value });
    if (!check) {
      setdataerror({ ...dataerror, [name]: true });
    } else {
      setdataerror({ ...dataerror, [name]: false });

      if (name === "username") {
        GetUsername();
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
    variables: { type: "username", key: data.username },
  });

  const _handlesave = async () => {
    setLoading(true);
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
            first_name: data.first_name,
            last_name: data.last_name,
            username: data.username,
            bio: data.bio,
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
          props.navigation.goBack();
        }
        setLoading(false);
      } catch (error) {
        Alert.alert("" + error);
        setLoading(false);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={{}} showsVerticalScrollIndicator={false}>
      <ImageBackground
        source={{ uri: uri }}
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
            source={{ uri: data.picture }}
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
              value={data.first_name ? data.first_name : ""}
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
              value={data.last_name ? data.last_name : ""}
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
              value={data.username ? data.username : ""}
              onChangeText={(text) => _handleOnChange(text, "username")}
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
              {t("inputWarningName")}
              {t("username")}
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
              value={data.bio ? data.bio : ""}
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
        <Text size="description">{data.email ? data.email : "-"}</Text>
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
        <Text size="description">{data.phone ? data.phone : "-"}</Text>
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

// ProfileSettings.navigationOptions = ({ navigation }) => ({
//   headerTransparent: true,
//   headerTitle: "",
//   headerMode: "screen",
//   headerStyle: {
//     zIndex: 20,
//     // backgroundColor: '#209FAE',
//     elevation: 0,
//     borderBottomWidth: 0,
//     fontSize: 50,
//     // justifyContent: 'center',
//     // flex:1,
//   },
//   headerTitleStyle: {
//     fontFamily: "Lato-Regular",
//     fontSize: 14,
//     color: "white",
//     alignSelf: "center",
//   },
//   headerLeft: (
//     <Button
//       text={""}
//       size="medium"
//       type="circle"
//       variant="transparent"
//       onPress={() => navigation.goBack()}
//       style={{
//         backgroundColor: "rgba(0,0,0,0.3)",
//       }}
//     >
//       <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
//     </Button>
//   ),
//   headerLeftContainerStyle: {
//     marginLeft: 10,
//   },

//   headerRight: null,
//   headerRightStyle: {},
// });
