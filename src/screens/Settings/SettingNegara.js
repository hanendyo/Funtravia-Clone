import React, { useState, useEffect, useRef } from "react";
import { View, Dimensions, FlatList, Alert, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Arrowbackwhite, IdFlag, Check } from "../../assets/svg";
import Modal from "react-native-modal";
import { Text, Button, StatusBar as StaBar } from "../../component";
import Ripple from "react-native-material-ripple";
import { useTranslation } from "react-i18next";
import { useMutation } from "@apollo/react-hooks";
import setCountry from "../../graphQL/Mutation/Setting/setCountry";
import { FunIcon } from "../../component";
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

export default function SettingNegara({
  modals,
  setModelSetNegara,
  masukan,
  data,
  selected,
  token,
}) {
  const { t } = useTranslation();
  let [datacountry, setdataCountry] = useState(data);
  let slider = useRef();
  const pushselected = () => {
    if (selected?.countries) {
      var tempData = [...datacountry];
      for (var i of tempData) {
        ({ ...i, selected: false });
      }
      var index = tempData.findIndex(
        (k) => k["id"] === selected?.countries?.id
      );
      if (index >= 0) {
        ({ ...tempData[index], selected: true });
      }
      setdataCountry(tempData);
    }
  };
  const [
    MutationsetCountry,
    { loading: loadingSet, data: dataSet, error: errorSet },
  ] = useMutation(setCountry, {
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
        let response = await MutationsetCountry({
          variables: {
            countries_id: detail?.id,
          },
        });
        if (response.data) {
          if (
            response.data.update_country_settings.code === 200 ||
            response.data.update_country_settings.code === "200"
          ) {
            selected.countries = detail;
            let tempSetting = { ...selected };
            if (
              selected?.countries?.id === tempSetting?.cities?.countries?.id
            ) {
              tempSetting.cities = selected.cities;
            } else {
              tempSetting.cities = null;
            }
            await AsyncStorage.setItem("setting", JSON.stringify(tempSetting));
            var tempData = [...datacountry];
            for (var i in tempData) {
              ({ ...i, selected: false });
            }
            var index = tempData.findIndex((k) => k["id"] === detail.id);
            if (index >= 0) {
              ({ ...tempData[index], selected: true });
            }
            setdataCountry(tempData);
            masukan(selected);
          } else {
            throw new Error(response.data.update_country_settings.message);
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
  }, []);

  return (
    <Modal
      onRequestClose={() => {
        setModelSetNegara(false);
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
              onPress={() => setModelSetNegara(false)}
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
              {t("country")}
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
          <FlatList
            ref={slider}
            data={datacountry}
            renderItem={({ item }) => {
              console.log("item", item.id);
              console.log("selected", selected.countries.id);
              return (
                <Ripple
                  onPress={() => hasil(item, selected)}
                  style={{
                    // paddingVertical: 15,
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
                      flexDirection: "row",
                      // borderWidth: 1,
                      marginVertical: 10,
                    }}
                  >
                    <View
                      style={{
                        marginRight: 15,
                        elevation: 1,
                      }}
                    >
                      <FunIcon
                        icon={item.flag}
                        height={30}
                        width={42}
                        style={{}}
                        variant="f"
                      />
                    </View>
                    <Text
                      size="description"
                      type="regular"
                      style={{ alignSelf: "center" }}
                    >
                      {item.name}
                    </Text>
                  </View>
                  <View>
                    {selected?.countries?.id == item.id ? (
                      <Check width={20} height={15} />
                    ) : null}
                  </View>
                </Ripple>
              );
            }}
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>
    </Modal>
  );
}
