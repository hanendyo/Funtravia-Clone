import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Dimensions,
  Image,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import { AsyncStorage, FlatList, ScrollView } from "react-native";
import {} from "../../../const/PixelRatio";
//data_bg nanti itu Profile Picture, data_pic itu avatar
import { Sharegreen, Arrowbackwhite } from "../../../const/Svg";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import { Button, Text } from "../../../Component";
import { useTranslation } from "react-i18next";
import { default_image } from "../../../const/Png";
import Uploadfoto from "../../../graphQL/Mutation/Profile/Uploadfotoalbum";
import * as ImageManipulators from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import Loading from "../Loading";
import Modal from "react-native-modal";
import * as Permissions from "expo-permissions";
import { NavigationEvents } from "react-navigation";
import album from "../../../graphQL/Query/Profile/albumdetail";
import ImageSlide from "../ImageSlide/sliderwithoutlist";

export default function tripalbumdetail(props) {
  const { t, i18n } = useTranslation();
  // let data = props.navigation.getParam('data');
  let iditinerary = props.navigation.getParam("iditinerary");
  let token = props.navigation.getParam("token");
  let day_id = props.navigation.getParam("day_id");
  let judul = props.navigation.getParam("judul");
  let position = props.navigation.getParam("position");
  let [modals, setmodal] = useState(false);
  let [loading, setLoading] = useState(false);

  const [
    getdataalbum,
    { data: dataalbum, loading: loadingalbum, error: erroralbum, refetch },
  ] = useLazyQuery(album, {
    fetchPolicy: "network-only",

    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    variables: {
      itinerary_id: iditinerary,
      day_id: day_id,
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

  function wait(timeout) {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  }

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    getdataalbum();
    wait(1000).then(() => setRefreshing(false));

    (async () => {
      let { status } = await Permissions.askAsync(Permissions.CAMERA);
      if (status !== "granted") {
        Alert.alert(t("permissioncamera"));
      }
    })();

    (async () => {
      let { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

      if (status !== "granted") {
        Alert.alert(t("permissioncamera"));
      }
    })();

    // (async () => {
    // 	let { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);

    // 	if (status !== 'granted') {
    // 		Alert.alert(
    // 			t('permissioncamera')
    // 		);
    // 	}
    // })();
  };

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
            itinerary_id: iditinerary,
            day_id: day_id,
            description: "0",
            assets: "data:image/jpeg;base64," + tmpFile.base64,
          },
        });
        if (errorupload) {
          throw new Error("Error Input");
        }
        if (response.data) {
          if (response.data.uploadalbums.code !== 200) {
            throw new Error(response.data.uploadalbums.message);
          }
          // Alert.alert(t('success'));
          onRefresh();
          // props.navigation.goBack();
        }
        setLoading(false);
      } catch (error) {
        Alert.alert("" + error);
        setLoading(false);
      }
    }
  };

  const pickcamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      upload(result.uri);
    }
  };

  const pickGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      upload(result.uri);
    }
  };

  // {
  // 	dataalbum &&
  // 	dataalbum.itinerary_album_list &&
  // 	dataalbum.itinerary_album_list.day_album.length > 0
  // 		? console.log('coming soon')
  // 		: null;
  // }

  let [index, setIndex] = useState(0);
  let [dataImage, setImage] = useState([]);
  let [modalss, setModalss] = useState(false);

  const setdataimage = async (data, inde) => {
    setIndex(inde);
    // console.log(data);
    var tempdatas = [];
    var x = 0;
    for (var i in data.album) {
      tempdatas.push({
        key: i,
        selected: i === inde ? true : false,
        url: data.album[i].assets ? data.album[i].assets : "",
        width: Dimensions.get("screen").width,
        height: 300,
        props: {
          source: data.album[i].assets ? data.album[i].assets : "",
        },
        by: data.album[i].created_by,
      });
      x++;
    }
    await setImage(tempdatas);
    await setModalss(true);
  };

  return (
    <View style={{ flex: 1 }}>
      <Loading show={loading} />
      <NavigationEvents onDidFocus={() => onRefresh()} />

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
      {dataalbum && dataalbum.list_album_itinerary_day ? (
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          stickyHeaderIndices={[0]}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          ListHeaderComponent={() => (
            <View
              style={{
                paddingHorizontal: 20,
                backgroundColor: "white",
                paddingTop: 5,
                shadowColor: "#464646",
                shadowOffset: { width: 2, height: 2 },
                shadowOpacity: 1,
                shadowRadius: 2,
                elevation: 5,
              }}
            >
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  paddingVertical: 10,
                  // borderBottomWidth: 1,
                  // borderBottomColor: '#d1d1d1',
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ width: "70%" }}>
                  <Text type={"bold"} size="label">
                    {dataalbum.list_album_itinerary_day
                      ? dataalbum.list_album_itinerary_day.name
                      : ""}
                  </Text>
                  <Text>
                    {t("day")} :{" "}
                    {dataalbum.list_album_itinerary_day.day_album[0].day}
                  </Text>
                </View>
                <Button size={"small"} type="circle" color="tertiary">
                  <Sharegreen height={15} width={15}></Sharegreen>
                </Button>
              </View>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 5 }}
          // ListFooterComponentStyle={{ flex: 1, justifyContent: 'flex-end' }}
          // ListFooterComponent={() => (

          // )}
          numColumns={3}
          nestedScrollEnabled
          data={dataalbum.list_album_itinerary_day.day_album[0].album}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() =>
                setdataimage(
                  dataalbum.list_album_itinerary_day.day_album[0],
                  index
                )
              }
              style={{
                margin: 2,
                height: (Dimensions.get("screen").width - 12) / 3,
                width: (Dimensions.get("screen").width - 12) / 3,
              }}
            >
              <Image
                source={item.assets ? { uri: item.assets } : default_image}
                style={{
                  // margin: 2,
                  height: (Dimensions.get("screen").width - 12) / 3,
                  width: (Dimensions.get("screen").width - 12) / 3,
                  resizeMode: "cover",
                }}
              ></Image>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <View style={{ flex: 1 }}></View>
      )}

      {position === "profile" ? (
        <View
          style={{
            height: 55,
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center",
            backgroundColor: "white",
            shadowColor: "#464646",
            shadowOffset: { width: 2, height: 2 },
            shadowOpacity: 1,
            shadowRadius: 2,
            elevation: 5,
          }}
        >
          <Button
            onPress={() => setmodal(true)}
            text="Upload More Photos"
            style={{ width: Dimensions.get("screen").width - 40 }}
          ></Button>
        </View>
      ) : null}
      <ImageSlide
        index={index}
        name="Funtravia Images"
        location={judul}
        // {...props}
        show={modalss}
        dataImage={dataImage}
        setClose={() => setModalss(!modalss)}
      />
    </View>
  );
}

tripalbumdetail.navigationOptions = (props) => ({
  // headerTransparent: true,
  headerTitle: "Trip Album",
  headerMode: "screen",
  headerStyle: {
    backgroundColor: "#209FAE",
    elevation: 0,
    borderBottomWidth: 0,
    // fontSize: 50,
    // justifyContent: 'center',
    // flex:1,
  },
  headerTitleStyle: {
    fontFamily: "Lato-Regular",
    fontSize: 14,
    color: "white",
    alignSelf: "center",
  },
  headerLeft: (
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
  headerLeftContainerStyle: {
    paddingLeft: 10,
  },
  headerRight: <View style={{ flexDirection: "row" }}></View>,
  headerRightStyle: {
    // paddingRight: 20,
  },
});
