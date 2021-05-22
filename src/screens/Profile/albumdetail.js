import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  Alert,
  RefreshControl,
  FlatList,
} from "react-native";
import { Sharegreen, Arrowbackwhite } from "../../assets/svg";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import { Button, Text, Loading, shareAction } from "../../component";
import { useTranslation } from "react-i18next";
import { default_image } from "../../assets/png";
import Uploadfoto from "../../graphQL/Mutation/Profile/Uploadfotoalbum";
import Modal from "react-native-modal";
import album from "../../graphQL/Query/Profile/albumdetail";
import ImageSlide from "../../component/src/ImageSlide/sliderwithoutlist";
import ImagePicker from "react-native-image-crop-picker";

export default function albumdetail(props) {
  const HeaderComponent = {
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: "Album " + props?.route?.params?.judul,
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
  let iditinerary = props.route.params.iditinerary;
  let token = props.route.params.token;
  let day_id = props.route.params.day_id;
  let judul = props.route.params.judul;
  let position = props.route.params.position;
  let [modals, setmodal] = useState(false);
  let [loading, setLoading] = useState(false);

  console.log(props.route.params.data.assets);

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
    // getdataalbum();
    wait(1000).then(() => setRefreshing(false));
  };

  const upload = async (data) => {
    setmodal(false);
    setLoading(true);

    if (data) {
      // console.log(tmpFile.base64);
      try {
        let response = await mutationUpload({
          variables: {
            itinerary_id: iditinerary,
            day_id: day_id,
            description: "0",
            assets: "data:image/jpeg;base64," + data,
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
    ImagePicker.openCamera({
      compressImageMaxWidth: 1024,
      compressImageMaxHeight: 1024,
      cropping: true,
      freeStyleCropEnabled: true,
      includeBase64: true,
    }).then((image) => {
      upload(image.data);
    });
  };
  const pickGallery = async () => {
    ImagePicker.openPicker({
      compressImageMaxWidth: 1024,
      compressImageMaxHeight: 1024,
      cropping: true,
      freeStyleCropEnabled: true,
      includeBase64: true,
    }).then((image) => {
      upload(image.data);
    });
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      onRefresh();
    });
    return unsubscribe;
  }, [props.navigation]);

  let [index, setIndex] = useState(0);
  let [dataImage, setImage] = useState([]);
  let [modalss, setModalss] = useState(false);

  const setdataimage = async (data, inde) => {
    console.log("data review image trip", data);
    console.log("index foto", inde);
    setIndex(inde);
    var tempdatas = [];
    var x = 0;

    for (var i in data.album) {
      let wid = 0;
      let hig = 0;
      Image.getSize(data.album[i].assets, (width, height) => {
        wid = width;
        hig = height;
      });
      // console.log(data.album[i].photoby.first_name);
      tempdatas.push({
        key: i,
        selected: i === inde ? true : false,
        url: data.album[i]?.assets ? data.album[i]?.assets : "",
        width: wid,
        height: hig,
        props: {
          source: data.album[i]?.assets ? data.album[i]?.assets : "",
        },
        by: data.album[i]?.photoby?.first_name,
      });
      x++;
    }
    console.log("temp", tempdatas);
    await setImage(tempdatas);
    await setModalss(true);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <Loading show={loading} />
      {/* <NavigationEvents onDidFocus={() => onRefresh()} /> */}

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
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 5 }}
        // ListFooterComponentStyle={{ flex: 1, justifyContent: 'flex-end' }}
        // ListFooterComponent={() => (

        // )}
        numColumns={3}
        nestedScrollEnabled
        data={props.route.params.data.assets}
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
              source={item.filepath ? { uri: item.filepath } : default_image}
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
