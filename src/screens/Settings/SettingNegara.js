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
import {
  Arrowbackblack,
  Arrowbackios,
  Arrowbackwhite,
  Check,
  Search,
  Xblue,
} from "../../assets/svg";
import Modal from "react-native-modal";
import { Text, Button, StatusBar as StaBar } from "../../component";
import Ripple from "react-native-material-ripple";
import { useTranslation } from "react-i18next";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
// import setCountry from "../../graphQL/Mutation/Setting/setCountry";
import { FunIcon } from "../../component";
import CountriesMutation from "../../graphQL/Mutation/Setting/setCountry";
import { TextInput } from "react-native-gesture-handler";
import Country from "../../graphQL/Query/Countries/CountryListSrc";
import { RNToasty } from "react-native-toasty";
import { useDispatch, useSelector } from "react-redux";
import { setSettingUser } from "../../redux/action";

export default function SettingNegara(props) {
  // let [token, setToken] = useState(props.route.params.token);
  let dispatch = useDispatch();
  let token = useSelector((data) => data.token);
  let setting = useSelector((data) => data.setting);
  let [indekScrollto, setIndeksScrollto] = useState(0);
  const { t, i18n } = useTranslation();
  const HeaderComponent = {
    headerShown: true,
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: (
      <Text type="bold" size="header" style={{ color: "#fff" }}>
        {t("country")}
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

  let [data, setData] = useState([]);
  let [country, setCountry] = useState("");
  // let [storage, setStorage] = useState(props.route.params.setting);
  let [rippleHeight, setRippleHeight] = useState(0);

  // let slider = useRef();
  // useEffect(() => {
  //   setTimeout(() => {
  //     if (slider.current) {
  //       slider.current.scrollToIndex({
  //         index: props.route.params.index,
  //         animated: true,
  //       });
  //     }
  //   }, 1000);
  // }, []);

  const ref = React.useRef(null);

  const Scroll_to = async (index) => {
    index = index ? index : indekScrollto;
    setTimeout(() => {
      if (ref && ref?.current) {
        ref?.current?.scrollToIndex({
          animation: false,
          index: index,
        });
      }
    }, 100);
  };

  const clearFilter = () => {
    setCountry("");
  };

  useEffect(() => {
    clearFilter();
    setTimeout(() => {
      ref.current.scrollToIndex({
        index: props.route.params.index,
        animated: true,
      });
    }, 1000);
  }, []);

  const pushselected = async () => {
    if (setting?.countries && data) {
      var tempData = [...data];

      for (var i of tempData) {
        ({ ...i, selected: false });
      }
      var index = tempData.findIndex((k) => k["id"] === setting?.countries?.id);
      if (index >= 0) {
        ({ ...tempData[index], selected: true });
      }
      setData(tempData);
    }
  };

  const [
    queryCountry,
    { loading: loadingNegara, data: dataNegara, error: errorNegara },
  ] = useLazyQuery(Country, {
    fetchPolicy: "network-only",
    variables: {
      keyword: country,
      continent_id: null,
    },
    onCompleted: async () => {
      setData(dataNegara?.list_country_src);
      const tempData = [...dataNegara?.list_country_src];
      await setIndeksScrollto(indeks);
      const indeks = tempData.findIndex((k) => {
        k["id"] == props.route.params.index;
      });
      if (indeks != -1) {
        await setIndeksScrollto(indeks);
        await Scroll_to(indeks);
      }
    },
  });

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    // pushselected();
    const unsubscribe = props.navigation.addListener("focus", () => {
      queryCountry();
    });
    return unsubscribe;
  }, [props.navigation]);

  const [
    mutationCity,
    { data: dataCity, loading: loadingCity, error: errorCity },
  ] = useMutation(CountriesMutation, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
  });

  const hasil = async (detail) => {
    if (token || token !== "") {
      try {
        let response = await mutationCity({
          variables: {
            countries_id: detail.id,
          },
        });
        if (response.data) {
          if (
            response.data.update_country_settings.code === 200 ||
            response.data.update_country_settings.code === "200"
          ) {
            let newstorage = { ...setting };
            newstorage["countries"] = detail;

            // await setStorage(newstorage);
            // await props.route.params.setSetting(newstorage);
            await AsyncStorage.setItem("setting", JSON.stringify(newstorage));
            dispatch(setSettingUser(newstorage));

            var tempData = [...data];
            for (var i of tempData) {
              ({ ...i, selected: false });
            }
            var index = tempData.findIndex((k) => k["id"] === detail.id);
            if (index >= 0) {
              ({ ...tempData[index], selected: true });
            }
            setData(tempData);
          } else {
            throw new Error(response.data.update_city_settings.message);
          }
        }
      } catch (error) {
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

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View
        style={{
          alignContent: "center",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 15,

          // borderWidth: 1,
          height: 50,
          zIndex: 5,
          flexDirection: "row",
          width: Dimensions.get("screen").width,
        }}
      >
        <View
          style={{
            backgroundColor: "#f6f6f6",
            borderRadius: 2,
            flex: 1,
            paddingHorizontal: 10,

            flexDirection: "row",
            alignItems: "center",
            alignContent: "center",
            height: 35,
            borderWidth: 1,
            borderColor: "#e8e8e8",
          }}
        >
          <Search width={15} height={15} />
          <TextInput
            value={country}
            id={"inputData"}
            style={{
              width: "85%",
              marginLeft: 10,
              padding: 0,
            }}
            onChangeText={(e) => {
              setCountry(e);
            }}
            onSubmitEditing={(e) => setCountry(e)}
            autoCorrect={false}
            // autoCompleteType={false}
            placeholder={t("Search")}
          />
          {country.length !== 0 ? (
            <TouchableOpacity onPress={() => clearFilter()}>
              <Xblue
                width="20"
                height="20"
                style={{
                  alignSelf: "center",
                  marginRight: 5,
                }}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      {loadingNegara ? (
        <View style={{ paddingVertical: 20 }}>
          <ActivityIndicator animating={true} color="#209FAE" size="large" />
        </View>
      ) : data ? (
        <FlatList
          ref={ref}
          getItemLayout={(data, index) => ({
            length: Platform.OS == "ios" ? rippleHeight : 46,
            offset: Platform.OS == "ios" ? rippleHeight * index : 46 * index,
            index,
          })}
          data={data}
          scrollToIndex={indekScrollto}
          // onScrollToIndexFailed={(e) => {
          //   scrollToIndexFailed(e);
          // }}
          renderItem={({ item, index }) => (
            <Ripple
              onLayout={(e) => setRippleHeight(e.nativeEvent.layout.height)}
              onPress={() => hasil(item)}
              style={{
                paddingVertical: 15,
                paddingHorizontal: 20,
                borderBottomWidth: 0.5,
                borderBottomColor:
                  setting?.countries?.id == item.id ? "#209fae" : "#D1D1D1",
                flexDirection: "row",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  marginRight: 15,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  elevation: 1,
                }}
              >
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: "#d1d1d1",
                    backgroundColor: "black",
                    alignSelf: "center",
                    alignContent: "center",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    // width: 35,
                    // height: 25,
                    // paddingTop: 0,
                  }}
                >
                  <FunIcon icon={item.flag} width={37} height={25} />
                </View>
                <Text
                  size="description"
                  type="regular"
                  style={{
                    paddingLeft: 15,
                    color:
                      setting?.countries?.id == item.id ? "#209fae" : "#000",
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
                {setting?.countries?.id == item.id ? (
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
            {t("noData")}
          </Text>
        </View>
      )}
    </View>
  );
}
