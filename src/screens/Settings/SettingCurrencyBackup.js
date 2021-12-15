import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TextInput,
  FlatList,
  Alert,
  Image,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
  TouchableHighlight,
  // CheckBox,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Arrowbackios, Arrowbackwhite, Check } from "../../assets/svg";
import Modal from "react-native-modal";
import { Text, Button, StatusBar as StaBar } from "../../component";
import Ripple from "react-native-material-ripple";
import { useTranslation } from "react-i18next";
import { useMutation } from "@apollo/react-hooks";
import { RNToasty } from "react-native-toasty";
import setCurrency from "../../graphQL/Mutation/Setting/setCurrency";

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

export default function SettingCurrency({
  modals,
  setModelSetCurrency,
  masukan,
  data,
  selected,
  token,
}) {
  console.log("selected", selected);
  const { t } = useTranslation();
  let [datacurrency, setdataCurrency] = useState(data);
  let [storage, setStorage] = useState(selected);
  let slider = useRef();
  const pushselected = () => {
    if (selected?.currency) {
      var tempData = [...datacurrency];
      for (var i of tempData) {
        ({ ...i, selected: false });
      }
      var index = tempData.findIndex((k) => k["id"] === selected?.currency?.id);
      if (index >= 0) {
        ({ ...tempData[index], selected: true });
      }
      setdataCurrency(tempData);
    }
  };
  const [
    MutationsetCurrency,
    { loading: loadingSet, data: dataSet, error: errorSet },
  ] = useMutation(setCurrency, {
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
        let response = await MutationsetCurrency({
          variables: {
            currency_id: detail.id,
          },
        });
        // if (loadingLike) {
        // 	Alert.alert('Loading!!');
        // }
        // if (errorLike) {
        // 	throw new Error('Error Input');
        // }
        if (response.data) {
          if (
            response.data.update_currency_settings.code === 200 ||
            response.data.update_currency_settings.code === "200"
          ) {
            console.log("storage", storage);
            let newstorage = { ...storage };
            newstorage["currency"] = detail;

            await setStorage(newstorage);
            // console.log("storages", storage);

            await AsyncStorage.setItem("setting", JSON.stringify(newstorage));
            // await props.route.params.setSetting(newstorage);
            var tempData = [...datacurrency];
            for (var i in tempData) {
              ({ ...i, selected: false });
            }
            var index = tempData.findIndex((k) => k["id"] === detail.id);
            if (index >= 0) {
              ({ ...tempData[index], selected: true });
            }
            setdataCurrency(tempData);
            masukan(newstorage);
            // setModelSetCurrency(false);
          } else {
            throw new Error(response.data.update_currency_settings.message);
          }
        }
      } catch (error) {
        console.log(error);
        RNToasty.Show({
          title: "Failed To Select Country",
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

  useEffect(() => {
    pushselected();
  }, []);

  return (
    <Modal
      onRequestClose={() => {
        setModelSetCurrency(false);
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
              onPress={() => setModelSetCurrency(false)}
            >
              {Platform.OS == "ios" ? (
                <Arrowbackios height={15} width={15}></Arrowbackios>
              ) : (
                <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
              )}
            </Button>
            <Text size="header" type="bold" style={{ color: "#fff" }}>
              {t("currency")}
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
            data={datacurrency}
            renderItem={({ item }) => {
              return (
                <Ripple
                  onPress={() => hasil(item, selected)}
                  style={{
                    paddingVertical: 15,
                    paddingHorizontal: 20,
                    borderBottomWidth: 0.5,
                    borderBottomColor:
                      selected.currency?.id == item.id ? "#209fae" : "#D1D1D1",
                    flexDirection: "row",
                    alignContent: "center",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        marginRight: 15,
                      }}
                    >
                      <Text
                        type="bold"
                        size="label"
                        style={{
                          color:
                            selected.currency?.id == item.id
                              ? "#209fae"
                              : "#000",
                        }}
                      >
                        {item.code}
                      </Text>
                    </View>
                    <Text
                      size="description"
                      style={{
                        color:
                          selected.currency?.id == item.id ? "#209fae" : "#000",
                      }}
                    >
                      {item?.name}
                    </Text>
                  </View>
                  <View>
                    {selected.currency.id == item.id ? (
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
