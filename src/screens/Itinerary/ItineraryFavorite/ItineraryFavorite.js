import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Platform,
  ActivityIndicator,
  Pressable,
  View,
  Modal as ModalRN,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { Button, Text, CardItinerary } from "../../../component";
import { Bg_soon } from "../../../assets/png";
import {
  Arrowbackwhite,
  Search,
  Xblue,
  Arrowbackios,
} from "../../../assets/svg";
import { useTranslation } from "react-i18next";
import { useLazyQuery } from "@apollo/client";
import Favorite from "../../../graphQL/Query/Itinerary/ItineraryFavorite";

export default function ItineraryFavorite(props) {
  const { t } = useTranslation();
  let [soon, setSoon] = useState(false);
  const HeaderComponent = {
    headerShown: true,
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: (
      <Text size="header" type="bold" style={{ color: "#fff" }}>
        {t("itineraryFavorite")}
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
      marginLeft: 10,
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
          <Arrowbackios height={20} width={20}></Arrowbackios>
        ) : (
          <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
        )}
      </Button>
    ),
  };
  let [token, setToken] = useState("");
  let [setting, setSetting] = useState();
  let [textInput, setTextInput] = useState("");
  let [text, setText] = useState("");
  let { width, height } = Dimensions.get("screen");
  let [dataFavorite, setDataFavorite] = useState([]);

  const cari = async (x) => {
    await setText(textInput);
    await fetchDataListFavorite();
  };

  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    await setToken(tkn);

    let setsetting = await AsyncStorage.getItem("setting");
    await setSetting(JSON.parse(setsetting));
    await fetchDataListFavorite();
  };

  const [
    fetchDataListFavorite,
    { data: data, loading: loadingPopuler, error: errorFavorite },
  ] = useLazyQuery(Favorite, {
    variables: {
      keyword: textInput,
    },
    fetchPolicy: "network-only",
    onCompleted: () => {
      setDataFavorite(data?.itinerary_list_favorite);
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : null,
      },
    },
  });

  console.log("dataFavorite", dataFavorite);

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      loadAsync();
    });
    return unsubscribe;
  }, []);
  {
    /* ======================================= Render All ====================================================*/
  }

  return (
    <View style={{ flex: 1 }}>
      <ModalRN
        useNativeDriver={true}
        visible={soon}
        onRequestClose={() => setSoon(false)}
        transparent={true}
        animationType="fade"
      >
        <Pressable
          // onPress={() => setModalLogin(false)}
          style={{
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
            justifyContent: "center",
            opacity: 0.7,
            backgroundColor: "#000",

            position: "absolute",
            borderRadius: 5,
          }}
        ></Pressable>
        <View
          style={{
            width: Dimensions.get("screen").width - 100,
            marginHorizontal: 50,
            zIndex: 15,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            borderRadius: 5,
            marginTop: Dimensions.get("screen").height / 3,
          }}
        >
          <View
            style={{
              // backgroundColor: "white",
              // width: Dimensions.get("screen").width - 100,
              padding: 20,
              paddingHorizontal: 20,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 5,
            }}
          >
            <Image
              source={Bg_soon}
              style={{
                height: Dimensions.get("screen").width - 180,
                width: Dimensions.get("screen").width - 110,
                position: "absolute",
                borderRadius: 5,
              }}
            />
            <Text type="bold" size="h5">
              {t("comingSoon")}!
            </Text>
            <Text type="regular" size="label" style={{ marginTop: 5 }}>
              {t("soonUpdate")}.
            </Text>
            <Button
              text={"OK"}
              style={{
                marginTop: 20,
                width: Dimensions.get("screen").width / 5,
                borderWidth: 1,
              }}
              type="box"
              onPress={() => setSoon(false)}
            ></Button>
          </View>
        </View>
      </ModalRN>
      <View
        style={{
          backgroundColor: "#fff",
          // height: 65,
          alignItems: "center",
        }}
      >
        <View
          style={{
            marginVertical: 10,
            // mrarginBottom: 15,
            marginHorizontal: 15,
            width: Dimensions.get("screen").width - 30,
            height: 35,
            backgroundColor: "#f6f6f6",
            borderRadius: 2,
            alignItems: "center",
            flexDirection: "row",
            paddingHorizontal: 10,
            borderWidth: 1,
            borderColor: "#e8e8e8",
          }}
        >
          <Search height={15} width={15} style={{ marginRight: 5 }} />
          <TextInput
            style={{ flex: 1, marginRight: 5, padding: 0 }}
            value={textInput}
            underlineColorAndroid="transparent"
            onChangeText={(x) => setTextInput(x)}
            placeholder={t("search")}
            placeholderTextColor="#464646"
            returnKeyType="search"
            // autoFocus={true}
            fontSize={16}
          />
          {textInput.length !== 0 ? (
            <TouchableOpacity
              onPress={() => {
                setTextInput("");
              }}
            >
              <Xblue
                width="20"
                height="20"
                style={{
                  alignSelf: "center",
                  marginRight: 10,
                }}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      {dataFavorite && dataFavorite.length > 0 ? (
        <CardItinerary
          data={dataFavorite}
          props={props}
          token={token}
          setting={setting}
          setData={(e) => setDataFavorite(e)}
        />
      ) : (
        <View
          style={{
            backgroundColor: "white",
            alignItems: "center",
            paddingTop: 10,
            flex: 1,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              paddingVertical: 20,
              flex: 1,
            }}
          >
            <Text size="label" type="bold">
              {t("noData")}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
