import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
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

import {
  Arrowbackwhite,
  Xhitam,
  Pointmapblack,
  Pointmapgray,
  Pointmaprecent,
  OptionsVertWhite,
  IdFlag,
  Check,
} from "../../assets/svg";
import Modal from "react-native-modal";
import { Text, Button } from "../../component";
import Ripple from "react-native-material-ripple";
import { useTranslation } from "react-i18next";
import { useLazyQuery, useQuery, useMutation } from "@apollo/react-hooks";
import setCountry from "../../graphQL/Mutation/Setting/setCountry";

export default function SettingNegara({
  modals,
  setModelSetNegara,
  masukan,
  data,
  selected,
  token,
}) {
  const { t, i18n } = useTranslation();
  let [datacountry, setdataCountry] = useState(data);
  let [datasetting, setdataSetting] = useState(selected);
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
            countries_id: detail.id,
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
            response.data.update_country_settings.code === 200 ||
            response.data.update_country_settings.code === "200"
          ) {
            // _Refresh();
            selected.countries = detail;
            await AsyncStorage.setItem("setting", JSON.stringify(selected));
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
        // backgroundColor: 'rgba(0, 0, 0, 0.25)',
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
            // justifyContent: 'center'
            backgroundColor: "#209fae",
            height: 55,
            width: Dimensions.get("screen").width,
            // marginBottom: 20,
            marginTop: Platform.OS === "ios" ? 0 : -20,
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
            // height: '100%',
            height: Dimensions.get("screen").height,
            backgroundColor: "white",
            // paddingTop: 20,
            // paddingHorizontal: 20,
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
                        borderWidth: 0.5,
                        marginRight: 15,
                      }}
                    >
                      <IdFlag width={30} height={20} />
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
