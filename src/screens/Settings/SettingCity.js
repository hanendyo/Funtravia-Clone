import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Dimensions,
  FlatList,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Arrowbackwhite, IdFlag, Check } from "../../assets/svg";
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
  const pushselected = () => {
    if (selected?.cities !== null) {
      var tempData = [...datacity];
      for (var i of tempData) {
        i.selected = false;
      }
      var index = tempData.findIndex((k) => k["id"] == selected?.cities?.id);
      if (index >= 0) {
        tempData[index].selected = true;
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
          if (
            response.data.update_city_settings.code === 200 ||
            response.data.update_city_settings.code === "200"
          ) {
            selected.cities = detail;
            await AsyncStorage.setItem("setting", JSON.stringify(selected));
            var tempData = [...datacity];
            for (var i in tempData) {
              tempData[i].selected = false;
            }
            var index = tempData.findIndex((k) => k["id"] === detail.id);
            tempData[index].selected = true;
            setdataCity(tempData);
            masukan(selected);
            setCity(null);
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
      <StaBar backgroundColor="#14646e" barStyle="light-content" />
      <View
        style={{
          flex: 1,
          width: Dimensions.get("screen").width,
          height: Dimensions.get("screen").height,
          borderWidth: 1,
        }}
      >
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
          <View style={{ height: 50, width: "100%", elevation: 1 }}>
            <TextInput
              id="search"
              style={{
                backgroundColor: "#F1F1F1",
                height: "70%",
                width: Dimensions.get("screen").width * 0.9,
                marginHorizontal: 15,
                marginTop: 5,
                borderRadius: 5,
                paddingLeft: 20,
              }}
              onChangeText={(e) => setCity(e)}
              placeholder={t("Search")}
            />
          </View>
          <View
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
          </View>
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
              data={dataKota?.cities_search}
              // stickyHeaderIndices={[0]}
              renderItem={({ item }) => (
                <Ripple
                  onPress={() => hasil(item, selected)}
                  style={{
                    paddingVertical: 15,
                    paddingHorizontal: 20,
                    borderBottomWidth: 0.5,
                    borderBottomColor: "#D1D1D1",
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
                    <Text size="description">
                      {item.name
                        .toString()
                        .toLowerCase()
                        .replace(/\b[a-z]/g, function(letter) {
                          return letter.toUpperCase();
                        })}
                    </Text>
                  </View>
                  <View>
                    {item.selected && item.selected == true ? (
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
