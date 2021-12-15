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

export default function SettingCurrency(props) {
  const { t } = useTranslation();
  let [datacurrency, setdataCurrency] = useState(props?.route?.params?.data);
  let [storage, setStorage] = useState(props?.route?.params?.setting);
  let slider = useRef();

  const HeaderComponent = {
    headerShown: true,
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: (
      <Text size="header" style={{ color: "#fff" }}>
        {t("currency")}
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

  const pushselected = () => {
    if (props.route.params?.setting?.currency?.id) {
      var tempData = [...datacurrency];
      for (var i of tempData) {
        ({ ...i, selected: false });
      }
      var index = tempData.findIndex(
        (k) => k["id"] === props.route.params?.setting?.currency?.id
      );
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

  useEffect(() => {
    props.navigation?.setOptions(HeaderComponent);
    pushselected();
  }, []);

  const hasil = async (detail) => {
    if (token || token !== "") {
      try {
        let response = await MutationsetCurrency({
          variables: {
            currency_id: detail.id,
          },
        });
        if (response.data) {
          if (
            response.data.update_currency_settings.code === 200 ||
            response.data.update_currency_settings.code === "200"
          ) {
            let newstorage = { ...storage };
            newstorage["currency"] = detail;

            await setStorage(newstorage);
            await AsyncStorage.setItem("setting", JSON.stringify(newstorage));
            await props.route.params.setSetting(newstorage);
            var tempData = [...datacurrency];
            for (var i in tempData) {
              ({ ...i, selected: false });
            }
            var index = tempData.findIndex((k) => k["id"] === detail.id);
            if (index >= 0) {
              ({ ...tempData[index], selected: true });
            }
            setdataCurrency(tempData);
            // masukan(newstorage);
            // setModelSetCurrency(false);
          } else {
            throw new Error(response.data.update_currency_settings.message);
          }
        }
      } catch (error) {
        RNToasty.Show({
          title: "Failed To Select Currency",
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
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {datacurrency ? (
        <FlatList
          ref={slider}
          data={datacurrency}
          renderItem={({ item }) => {
            return (
              <Ripple
                onPress={() => hasil(item)}
                style={{
                  paddingVertical: 15,
                  paddingHorizontal: 20,
                  borderBottomWidth: 0.5,
                  borderBottomColor:
                    storage.currency?.id == item.id ? "#209fae" : "#D1D1D1",
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
                          storage.currency?.id == item.id ? "#209fae" : "#000",
                      }}
                    >
                      {item.code}
                    </Text>
                  </View>
                  <Text
                    size="description"
                    style={{
                      color:
                        storage.currency?.id == item.id ? "#209fae" : "#000",
                    }}
                  >
                    {item?.name}
                  </Text>
                </View>
                <View>
                  {storage.currency?.id == item.id ? (
                    <Check width={20} height={15} />
                  ) : null}
                </View>
              </Ripple>
            );
          }}
          keyExtractor={(item) => item.id}
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
