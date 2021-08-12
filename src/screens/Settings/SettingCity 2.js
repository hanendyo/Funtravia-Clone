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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Arrowbackwhite, IdFlag, Check, Search } from "../../assets/svg";
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
import DeviceInfo from "react-native-device-info";
const Notch = DeviceInfo.hasNotch();

const SafeStatusBar = Platform.select({
  ios: Notch ? -50 : -20,
  android: -55,
});

const HeightBar = Platform.select({
  ios: Notch ? 95 : 70,
  android: 60,
});
export default function SettingCity({
  modals,
  setModalCity,
  masukan,
  data,
  selected,
  token,
  setSearchCity,
}) {
  const { t } = useTranslation();
  let [datacity, setdataCity] = useState(data);
  let [city, setCity] = useState("");
  let slider = useRef();
  let [indexCity, setIndexCity] = useState(0);
  let [rippleHeight, setRippleHeight] = useState(0);
  const pushselected = () => {
    if (selected?.cities !== null) {
      var tempData = [...datacity];
      for (var i of tempData) {
        ({ ...i, selected: false });
      }
      let index = tempData.findIndex((k) => k["id"] == selected?.cities?.id);
      setIndexCity(index);
      if (index >= 0) {
        ({ ...tempData[index], selected: true });
      }
      setdataCity(tempData);
    }
  };

  const [
    querycity,
    { loading: loadingKota, data: dataKota, error: errorKota },
  ] = useLazyQuery(City, {
    fetchPolicy: "network-only",
    variables: {
      keyword: city,
      countries_id: selected?.countries?.id,
    },
    onCompleted: () => setdataCity(dataKota.cities_search),
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

  const hasil = async (detail, selected) => {
    if (token || token !== "") {
      try {
        let response = await mutationCity({
          variables: {
            id: detail.id,
          },
        });
        if (response.data) {
          if (response.data.update_city_settings.code === 200) {
            selected.cities = detail;
            await AsyncStorage.setItem("setting", JSON.stringify(selected));
            var tempData = [...datacity];
            for (var i of tempData) {
              ({ ...i, selected: false });
            }
            var index = tempData.findIndex((k) => k["id"] === detail.id);
            setIndexCity(index);
            if (index >= 0) {
              ({ ...tempData[index], selected: true });
            }
            setdataCity(tempData);
            masukan(selected);
            setCity(null);
            setModalCity(false);
          } else {
            throw new Error(response.data.update_city_settings.message);
          }
        }
      } catch (error) {
        Alert.alert("" + error);
      }
    } else {
      Alert.alert("Please Login");
    }
  };

  useEffect(() => {
    pushselected();
    querycity();
  }, []);

  return (
    <Modal
      onRequestClose={() => {
        setModalCity(false);
      }}
      animationIn="slideInRight"
      animationOut="slideOutRight"
      isVisible={modals}
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        alignSelf: "center",
        alignContent: "center",
      }}
    >
      <View
        style={{
          flex: 1,
          width: Dimensions.get("screen").width,
          height: Dimensions.get("screen").height,
        }}
      >
        <StaBar backgroundColor="#14646e" barStyle="light-content" />
        <View
          style={{
            flexDirection: "row",
            alignSelf: "flex-start",
            alignItems: "flex-end",
            alignContent: "flex-end",
            backgroundColor: "#209fae",
            height: HeightBar,
            width: Dimensions.get("screen").width,
            marginTop: SafeStatusBar,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Button
              type="circle"
              color="tertiary"
              size="large"
              variant="transparent"
              onPress={() => setModalCity(false)}
            >
              <Arrowbackwhite width={20} height={20} />
            </Button>
            <Text
              size="label"
              style={{
                color: "white",
                fontFamily: "Lato-Bold",
                fontSize: 18,
              }}
            >
              {t("City")}
            </Text>
          </View>
        </View>
        <View
          style={{
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
            backgroundColor: "white",
            paddingBottom: 20,
          }}
        >
          <View
            style={{
              width: Dimensions.get("screen").width - 40,
              height: 35,
              elevation: 1,
              marginTop: 10,
              flexDirection: "row",
              marginHorizontal: 20,
              backgroundColor: "#f1f1f1",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 5,
            }}
          >
            <Search height={15} width={15} style={{ marginLeft: 10 }} />
            <TextInput
              // id="search"
              style={{
                flex: 1,
                paddingLeft: 10,
              }}
              onChangeText={(e) => setCity(e)}
              onSubmitEditing={(e) => setCity(e)}
              placeholder={t("Search")}
            />
          </View>
          {/* <View
            style={{
              height: 40,
              width: "100%",
              backgroundColor: "white",
              flexDirection: "row",
              alignItems: "center",
              elevation: 1,
            }}
          >
            {selected?.cities?.name ? (
              <>
                <Text
                  style={{
                    color: "#209FAE",
                    marginHorizontal: 15,
                    width: Dimensions.get("screen").width * 0.7,
                  }}
                >
                  {selected?.cities?.name}
                </Text>
                <Check width={20} height={15} />
              </>
            ) : null}
          </View> */}
          {loadingKota ? (
            <View style={{ paddingVertical: 20 }}>
              <ActivityIndicator
                animating={true}
                color="#209FAE"
                size="large"
              />
            </View>
          ) : dataKota?.cities_search.length > 0 ? (
            <FlatList
              ref={slider}
              getItemLayout={(data, index) => ({
                length: rippleHeight,
                offset: rippleHeight * index,
                index,
              })}
              data={dataKota?.cities_search}
              initialScrollIndex={indexCity}
              renderItem={({ item }) => (
                <Ripple
                  onLayout={(e) => setRippleHeight(e.nativeEvent.layout.height)}
                  onPress={() => hasil(item, selected)}
                  style={{
                    paddingVertical: 15,
                    paddingHorizontal: 20,
                    borderBottomWidth: 0.5,
                    borderBottomColor:
                      selected?.cities?.id == item.id ? "#209fae" : "#D1D1D1",
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
                        color:
                          selected?.cities?.id == item.id ? "#209fae" : "#000",
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
                    {selected?.cities?.id == item.id ? (
                      <Check width={20} height={15} />
                    ) : null}
                  </View>
                </Ripple>
              )}
              keyExtractor={(item) => item.id}
            />
          ) : (
            <View style={{ marginVertical: 20, alignItems: "center" }}>
              <Text size="description" type="bold">
                Tidak ada data
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}