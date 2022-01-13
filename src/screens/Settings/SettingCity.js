import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Dimensions,
  FlatList,
  Alert,
  Platform,
  ActivityIndicator,
  Pressable,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Arrowbackblack,
  Arrowbackios,
  Arrowbackwhite,
  Check,
  Search,
  Xblue,
} from "../../assets/svg";
import Modal from "react-native-modal";
import { Text, Button, StatusBar as StaBar } from "../../component";
import Ripple from "react-native-material-ripple";
import { useTranslation } from "react-i18next";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
// import setCountry from "../../graphQL/Mutation/Setting/setCountry";
import { FunIcon } from "../../component";
import CityMutation from "../../graphQL/Mutation/Setting/citySettingAkun";
import { TextInput } from "react-native-gesture-handler";
import City from "../../graphQL/Query/Itinerary/City";
import { RNToasty } from "react-native-toasty";
import DeviceInfo from "react-native-device-info";
import { useDispatch, useSelector } from "react-redux";
import { setSettingUser } from "../../redux/action";
import normalize from "react-native-normalize";
const Notch = DeviceInfo.hasNotch();
const deviceId = DeviceInfo.getModel();

export default function SettingCity(props) {
  // let token = props.route.params.token;
  let dispatch = useDispatch();
  let token = useSelector((data) => data.token);
  let setting = useSelector((data) => data.setting);
  let [indekScrollto, setIndeksScrollto] = useState(0);
  const { t, i18n } = useTranslation();
  let [play, setPlay] = useState(null);
  let [showLoading, setShowLoading] = useState(false);
  let [indexSend, setIndexSend] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const HeaderComponent = {
    headerShown: true,
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: (
      <Text type="bold" size="header" style={{ color: "#fff" }}>
        {t("City")}
      </Text>
    ),
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerLeftContainerStyle: {
      background: "#FFF",

      marginLeft: 5,
    },
    headerLeft: () => (
      <Button
        text={""}
        size="medium"
        type="circle"
        variant="transparent"
        onPress={() => {
          props.navigation.goBack();
          props.navigation.navigate("SettingsAkun", {
            indexFromSettingCity: indexSend,
          });
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
  let [data, setData] = useState([]);
  let [city, setCity] = useState("");
  // let [storage, setStorage] = useState(props.route.params.setting);
  let [rippleHeight, setRippleHeight] = useState(0);

  // let slider = useRef();
  // useEffect(() => {
  //   setTimeout(() => {
  //     if (slider.current) {
  //       slider.current.scrollToIndex({
  //         animated: true,
  //         index: props.route.params.index ? props.route.params.index : 0,
  //       });
  //     }
  //   }, 2000);
  // }, []);

  // const pushselected = () => {
  //   if (storage.cities !== null) {
  //     var tempData = [...data];
  //     for (var i of tempData) {
  //       ({ ...i, selected: false });
  //     }
  //     let index = tempData.findIndex((k) => k["id"] == storage?.cities?.id);
  //     if (index >= 0) {
  //       ({ ...tempData[index], selected: true });
  //     }
  //     setData(tempData);
  //   }
  // };
  const ref = useRef();

  const Scroll_to = async (index) => {
    index = index ? index : indekScrollto;
    // setIndexSend(index);
    setTimeout(() => {
      if (ref && ref?.current) {
        ref?.current?.scrollToIndex({
          animated: false,
          index: index,
        });
      }
    }, 100);
  };

  const onViewRef = React.useRef(({ viewableItems, changed }) => {
    if (viewableItems) {
      setPlay(viewableItems[0]?.index);
    }
  });

  const viewConfigRef = React.useRef({
    viewAreaCoveragePercentThreshold: 50,
  });

  const [
    querycity,
    { loading: loadingKota, data: dataKota, error: errorKota },
  ] = useLazyQuery(City, {
    fetchPolicy: "network-only",
    variables: {
      keyword: city,
      countries_id: setting?.countries?.id,
    },
    onCompleted: async () => {
      setData(dataKota?.cities_search);
      const tempData = [...dataKota?.cities_search];
      const indeks = await tempData.findIndex(
        (k) => k["id"] === setting?.cities?.id
      );

      if (indeks != -1) {
        await setIndeksScrollto(indeks);
        await Scroll_to(indeks);
      }

      // setTimeout(() => {
      // }, 500);
    },
  });

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    // pushselected();
    setTimeout(() => {
      if (play == props.route.params.index) {
        setShowLoading(true);
      }
    }, 2000);

    const unsubscribe = props.navigation.addListener("focus", () => {
      querycity();
    });
    return unsubscribe;

    // setTimeout(() => {
    //   ref.current.scrollToIndex({
    //     index: props.route.params.index,
    //     animated: true,
    //   });
    // }, 1000);
  }, [play, props.route.params.index, props.navigation]);

  const [
    mutationCity,
    { data: dataCity, loading: loadingCity, error: errorCity },
  ] = useMutation(CityMutation, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
  });

  const scrollToIndexFailed = (error) => {
    const offset = error.averageItemLength * error.index;
    ref.current.scrollToOffset({ offset });
    setTimeout(
      () =>
        ref?.current?.scrollToIndex({
          index: error.index,
        }),
      100
    );
  };

  const hasil = async (detail) => {
    if (token || token !== "") {
      try {
        let response = await mutationCity({
          variables: {
            id: detail.id,
          },
        });

        if (response.data) {
          if (response.data.update_city_settings.code === 200) {
            let newstorage = { ...setting };
            newstorage["cities"] = detail;
            // await props.route.params.setSetting(storage);
            await AsyncStorage.setItem("setting", JSON.stringify(newstorage));
            dispatch(setSettingUser(newstorage));
            var tempData = [...data];
            for (var i of tempData) {
              ({ ...i, selected: false });
            }
            var index = tempData.findIndex((k) => k["id"] === detail.id);
            if (index >= 0) {
              ({ ...tempData[index], selected: true });
              setIndexSend(index);
            }
            setData(tempData);
            Keyboard.dismiss();
            // props.navigation.goBack();
            // masukan(selected);
            // setCity(null);
            // setModalCity(false);
          } else {
            throw new Error(response.data.update_city_settings.message);
          }
        }
      } catch (error) {
        RNToasty.Show({
          title: "Failed To Select City",
          position: "bottom",
        });
      }
    } else {
      RNToasty.Show({
        title: "Please Login",
        position: "bottom",
      });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View
        style={{
          alignContent: "center",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 15,

          // borderWidth: 1,
          height: 50,
          zIndex: 5,
          flexDirection: "row",
          width: Dimensions.get("screen").width,
        }}
      >
        <KeyboardAvoidingView
          enabled
          style={{
            backgroundColor: "#f6f6f6",
            borderRadius: 2,
            flex: 1,
            paddingHorizontal: 10,

            flexDirection: "row",
            alignItems: "center",
            alignContent: "center",
            height: 35,
            borderWidth: 1,
            borderColor: "#e8e8e8",
          }}
        >
          <Search width={15} height={15} />
          <TextInput
            style={{
              width: "85%",
              marginLeft: 10,
              padding: 0,
            }}
            onChangeText={(e) => setCity(e)}
            onSubmitEditing={(e) => setCity(e)}
            placeholder={t("Search")}
            value={city}
          />
          {city.length !== 0 ? (
            <TouchableOpacity onPress={() => setCity("")}>
              <Xblue
                width="20"
                height="20"
                style={{
                  alignSelf: "center",
                  marginRight: 5,
                }}
              />
            </TouchableOpacity>
          ) : null}
        </KeyboardAvoidingView>
      </View>
      {!showLoading ? (
        <View
          style={{
            position: "absolute",
            backgroundColor: "#fff",
            height: Dimensions.get("screen").height,
            width: Dimensions.get("screen").width,
            zIndex: 1,
            // opacity: 0.7,
            paddingTop: Dimensions.get("screen").height / 3,
          }}
        >
          <ActivityIndicator animating={true} color="#209FAE" size="large" />
        </View>
      ) : null}
      {data ? (
        <FlatList
          ref={ref}
          data={data}
          onViewableItemsChanged={onViewRef.current}
          viewabilityConfig={viewConfigRef.current}
          keyExtractor={(item, index) => index}
          scrollToIndex={indekScrollto}
          onScrollToIndexFailed={(e) => {
            scrollToIndexFailed(e);
          }}
          onEndReachedThreshold={1}
          showsVerticalScrollIndicator={false}
          pinchGestureEnabled={false}
          // focusable={true}
          keyboardShouldPersistTaps={"handled"}
          getItemLayout={(data, index) => ({
            length: normalize(50),
            offset: normalize(50) * index,

            // length: Platform.select({
            //   ios: Notch ? 50 : 47,
            //   android: deviceId == "LYA-L29" ? 45.5 : 48.3,
            // }),
            // offset: Platform.select({
            //   ios: Notch ? 50 * index : 47 * index,
            //   android: deviceId == "LYA-L29" ? 45.5 * index : 48.3 * index,
            // }),

            index,
          })}
          // contentContainerStyle={{
          //   paddingBottom: 50,
          // }}
          renderItem={({ item, index }) => (
            <Pressable
              // onLayout={(e) => setRippleHeight(e.nativeEvent.layout.height)}
              onPress={() => hasil(item)}
              style={{
                // paddingVertical: normalize(10),
                // paddingHorizontal: normalize(20),
                height: normalize(50),
                paddingHorizontal: 20,
                borderBottomWidth: 0.5,
                borderBottomColor:
                  setting.cities?.id == item.id ? "#209fae" : "#d0d0d0",
                flexDirection: "row",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  marginRight: 15,
                  elevation: 1,
                }}
              >
                <Text
                  size="description"
                  type="regular"
                  style={{
                    color: setting?.cities?.id == item?.id ? "#209fae" : "#000",
                  }}
                >
                  {item.name
                    .toString()
                    .toLowerCase()
                    .replace(/\b[a-z]/g, function(letter) {
                      return letter.toUpperCase();
                    })}
                </Text>
              </View>
              <View>
                {setting?.cities?.id == item?.id ? (
                  <Check width={20} height={15} />
                ) : null}
              </View>
            </Pressable>
          )}
          // keyExtractor={(item) => item /*  */.id}
        />
      ) : (
        <View style={{ marginVertical: 20, alignItems: "center" }}>
          <Text size="description" type="bold">
            {t("noData")}
          </Text>
        </View>
      )}
    </View>
  );
}
