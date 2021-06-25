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
import { Arrowbackwhite, Check } from "../../assets/svg";
import Modal from "react-native-modal";
import { Text, Button } from "../../component";
import Ripple from "react-native-material-ripple";
import { useTranslation } from "react-i18next";
import { useMutation } from "@apollo/react-hooks";
import setCurrency from "../../graphQL/Mutation/Setting/setCurrency";

export default function SettingCurrency({
  modals,
  setModelSetCurrency,
  masukan,
  data,
  selected,
  token,
}) {
  const { t } = useTranslation();
  let [datacurrency, setdataCurrency] = useState(data);
  let slider = useRef();
  const pushselected = () => {
    if (selected?.currency) {
      var tempData = [...datacurrency];
      for (var i of tempData) {
        i.selected = false;
      }
      var index = tempData.findIndex((k) => k["id"] === selected?.currency?.id);
      tempData[index].selected = true;
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
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const hasil = async (detail, selected) => {
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
        // console.log(response);
        if (response.data) {
          if (
            response.data.update_currency_settings.code === 200 ||
            response.data.update_currency_settings.code === "200"
          ) {
            selected.currency = detail;
            await AsyncStorage.setItem("setting", JSON.stringify(selected));
            var tempData = [...datacurrency];
            for (var i in tempData) {
              tempData[i].selected = false;
            }
            var index = tempData.findIndex((k) => k["id"] === detail.id);
            tempData[index].selected = true;
            setdataCurrency(tempData);
            masukan(selected);
          } else {
            throw new Error(response.data.update_currency_settings.message);
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
        <View
          style={{
            flexDirection: "row",
            alignSelf: "flex-start",
            alignItems: "center",
            alignContent: "center",
            backgroundColor: "#209fae",
            height: 55,
            width: Dimensions.get("screen").width,
            marginTop: Platform.OS === "ios" ? 20 : -20,
          }}
        >
          <Button
            type="circle"
            color="tertiary"
            size="large"
            variant="transparent"
            onPress={() => setModelSetCurrency(false)}
          >
            <Arrowbackwhite width={20} height={20} />
          </Button>
          <Text
            size="label"
            style={{
              color: "white",
            }}
          >
            {t("currency")}
          </Text>
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
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        marginRight: 15,
                      }}
                    >
                      <Text type="bold" size="label">
                        {item.code}
                      </Text>
                    </View>
                    <Text size="description">{item?.countries?.name}</Text>
                  </View>
                  <View>
                    {item.selected && item.selected == true ? (
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
