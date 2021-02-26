import React, { useState, useEffect, useRef } from "react";
import { View, Dimensions, FlatList, Alert, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Arrowbackwhite, IdFlag, Check } from "../../assets/svg";
import Modal from "react-native-modal";
import { Text, Button } from "../../component";
import Ripple from "react-native-material-ripple";
import { useTranslation } from "react-i18next";
import { useMutation } from "@apollo/react-hooks";
// import setCountry from "../../graphQL/Mutation/Setting/setCountry";
import { FunIcon } from "../../component";
import CityMutation from "../../graphQL/Mutation/Setting/citySettingAkun";
import { TextInput } from "react-native-gesture-handler";

export default function SettingCity({
  modals,
  setModalCity,
  masukan,
  data,
  selected,
  token,
}) {
  const { t } = useTranslation();
  let [datacity, setdataCity] = useState(data);
  // let [search, setSearch] = useState(selected.cities.name);
  let slider = useRef();
  const pushselected = () => {
    console.log("selected.cities", selected.cities);
    if (selected?.cities !== null) {
      var tempData = [...datacity];
      for (var i of tempData) {
        i.selected = false;
      }
      var index = tempData.findIndex((k) => k["id"] == selected?.cities?.id);
      tempData[index].selected = true;
      setdataCity(tempData);
    }
  };

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
        <View
          style={{
            flexDirection: "row",
            alignSelf: "flex-start",
            alignItems: "center",
            alignContent: "center",
            backgroundColor: "#209fae",
            height: 55,
            width: Dimensions.get("screen").width,
            marginTop: Platform.OS === "ios" ? 0 : -20,
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
              style={{
                backgroundColor: "#F1F1F1",
                height: "70%",
                width: Dimensions.get("screen").width * 0.9,
                marginHorizontal: 15,
                marginTop: 5,
                borderRadius: 5,
                paddingLeft: 20,
              }}
              placeholder={t("Search")}
            />
          </View>
          <FlatList
            ref={slider}
            data={datacity}
            stickyHeaderIndices={[0]}
            ListHeaderComponent={
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
                        marginHorizontal: 30,
                        width: Dimensions.get("screen").width * 0.7,
                      }}
                    >
                      {selected?.cities?.name}
                    </Text>
                    <Check width={20} height={15} />
                  </>
                ) : null}
              </View>
            }
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
                      {/* <FunIcon
                        icon={item.flag}
                        height={30}
                        width={42}
                        style={{}}
                        variant="f"
                      /> */}
                    </View>
                    <Text size="description">
                      {item.name
                        .toString()
                        .toLowerCase()
                        .replace(/\b[a-z]/g, function (letter) {
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
              );
            }}
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>
    </Modal>
  );
}
