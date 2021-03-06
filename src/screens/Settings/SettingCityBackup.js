import React, { useState, useEffect, useRef } from "react";
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

export default function SettingCity(props) {
  const { t, i18n } = useTranslation();
  const HeaderComponent = {
    headerShown: true,
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: (
      <Text size="header" style={{ color: "#fff" }}>
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
    ),
  };
  let [data, setData] = useState([]);
  let [city, setCity] = useState("");
  let [storage, setStorage] = useState(props.route.params.setting);
  console.log("props", props.route.params.setting);
  let slider = useRef();
  let [rippleHeight, setRippleHeight] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      if (slider.current) {
        slider.current.scrollToIndex({
          index: props.route.params.index,
          animated: true,
        });
      }
    }, 2000);
  }, []);

  const pushselected = () => {
    if (storage.cities !== null) {
      var tempData = [...data];
      for (var i of tempData) {
        ({ ...i, selected: false });
      }
      let index = tempData.findIndex((k) => k["id"] == storage?.cities?.id);
      if (index >= 0) {
        ({ ...tempData[index], selected: true });
      }
      setData(tempData);
    }
  };

  const [
    querycity,
    { loading: loadingKota, data: dataKota, error: errorKota },
  ] = useLazyQuery(City, {
    fetchPolicy: "network-only",
    variables: {
      keyword: city,
      countries_id: storage?.countries?.id,
    },
    onCompleted: () => setData(dataKota.cities_search),
  });

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    pushselected();
    querycity();
  }, []);

  const [
    mutationCity,
    { data: dataCity, loading: loadingCity, error: errorCity },
  ] = useMutation(CityMutation, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : null,
      },
    },
  });

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
            storage.cities = detail;
            await props.route.params.setSetting(storage);
            await AsyncStorage.setItem("setting", JSON.stringify(storage));
            var tempData = [...data];
            for (var i of tempData) {
              ({ ...i, selected: false });
            }
            var index = tempData.findIndex((k) => k["id"] === detail.id);
            if (index >= 0) {
              ({ ...tempData[index], selected: true });
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
      {loadingKota ? (
        <View style={{ paddingVertical: 20 }}>
          <ActivityIndicator animating={true} color="#209FAE" size="large" />
        </View>
      ) : data ? (
        <FlatList
          focusable={true}
          keyboardShouldPersistTaps={"handled"}
          ref={slider}
          getItemLayout={(data, index) => ({
            length: 46,
            offset: 46 * index,
            // length: Platform.OS == "ios" ? rippleHeight : 46,
            // offset: Platform.OS == "ios" ? rippleHeight * index : 46 * index,
            index,
          })}
          data={data}
          renderItem={({ item, index }) => (
            <Pressable
              // onLayout={(e) => setRippleHeight(e.nativeEvent.layout.height)}
              onPress={() => hasil(item)}
              style={{
                paddingVertical: 15,
                paddingHorizontal: 20,
                borderBottomWidth: 0.5,
                borderBottomColor:
                  storage.cities?.id == item.id ? "#209fae" : "#D1D1D1",
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
                    color: storage?.cities?.id == item?.id ? "#209fae" : "#000",
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
                {storage?.cities?.id == item?.id ? (
                  <Check width={20} height={15} />
                ) : null}
              </View>
            </Pressable>
          )}
          keyExtractor={(item) => item /*  */.id}
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
