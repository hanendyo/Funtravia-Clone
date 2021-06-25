import React, { useState, useEffect, useRef } from "react";
import { View, Dimensions, FlatList, Alert, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Arrowbackwhite, IdFlag, Check } from "../../assets/svg";
import Modal from "react-native-modal";
import { Text, Button } from "../../component";
import Ripple from "react-native-material-ripple";
import { useTranslation } from "react-i18next";
import { useMutation } from "@apollo/react-hooks";
import setCountry from "../../graphQL/Mutation/Setting/setCountry";
import { FunIcon } from "../../component";

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
        i.selected = false;
      }
      var index = tempData.findIndex(
        (k) => k["id"] === selected?.countries?.id
      );
      tempData[index].selected = true;
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
              tempData[i].selected = false;
            }
            var index = tempData.findIndex((k) => k["id"] === detail.id);
            tempData[index].selected = true;
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
            onPress={() => setModelSetNegara(false)}
          >
            <Arrowbackwhite width={20} height={20} />
          </Button>
          <Text
            size="label"
            style={{
              color: "white",
            }}
          >
            {t("country")}
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
            data={datacountry}
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
                    <Text size="description">{item.name}</Text>
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
