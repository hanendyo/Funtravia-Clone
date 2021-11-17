import React, { useState, useEffect } from "react";
import {
  View,
  Dimensions,
  TextInput,
  SafeAreaView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Xblue, Arrowbackios, Arrowbackwhite, Search } from "../../assets/svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, Text, CardDestination, CardEvents } from "../../component";
import { useLazyQuery, useMutation } from "@apollo/client";
import Events from "../../graphQL/Query/Wishlist/Event";
import Destinasi from "../../graphQL/Query/Wishlist/Destination";
import { useTranslation } from "react-i18next";
import { TabBar, TabView } from "react-native-tab-view";
import { RNToasty } from "react-native-toasty";
import UnLiked from "../../graphQL/Mutation/unliked";

export default function Wishlist(props) {
  const { t, i18n } = useTranslation();
  let [dataEvent, setdataEvent] = useState([]);
  let [dataDes, setdataDes] = useState([]);
  let [token, setToken] = useState("");
  let [setting, setSetting] = useState("");
  let [texts, setText] = useState("");
  let [index, setindex] = useState(0);

  const HeaderComponent = {
    headerShown: true,
    title: "Wishlist",
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: (
      <Text size="header" type="bold" style={{ color: "#fff" }}>
        Wishlist
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
          <Arrowbackios height={15} width={15}></Arrowbackios>
        ) : (
          <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
        )}
      </Button>
    ),
  };

  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    setToken(tkn);
    if (tkn) {
      getEvent();
      getDes();
    }
    let setsetting = await AsyncStorage.getItem("setting");
    await setSetting(JSON.parse(setsetting));
  };

  const [getEvent, { loading, data: dataEven, error }] = useLazyQuery(Events, {
    fetchPolicy: "network-only",
    variables: {
      keyword: texts !== null ? texts : "",
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    onCompleted: () => {
      setdataEvent(dataEven?.listevent_wishlist);
    },
  });

  const [
    getDes,
    { loading: loadingDes, data: dataDe, error: errorDes },
  ] = useLazyQuery(Destinasi, {
    fetchPolicy: "network-only",
    variables: {
      keyword: texts,
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    onCompleted: () => {
      setdataDes(dataDe?.listdetination_wishlist);
    },
  });

  const search = async (x) => {
    setText(x);
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    props.navigation.addListener("focus", () => {
      loadAsync();
    });
  }, []);

  const renderLabel = ({ route, focused }) => {
    return (
      <View
        style={{
          width: Dimensions.get("screen").width / 2,
          height: 40,
          justifyContent: "center",
          alignItems: "center",
          marginTop: -10,
        }}
      >
        <Text
          style={{
            opacity: focused ? 1 : 0.7,
            color: focused ? "#209fae" : "#464646",
          }}
          size="title"
          type={focused ? "bold" : "regular"}
        >
          {route.title}
        </Text>
      </View>
    );
  };

  const [routes] = React.useState([
    { key: "destination", title: "Destination" },
    { key: "events", title: "Events" },
  ]);

  const renderScene = ({ route }) => {
    if (route.key == "events") {
      return (
        <CardEvents
          data={dataEvent}
          props={props}
          setData={(e) => setdataEvent(e)}
          token={token}
        />
      );
    } else if (route.key == "destination") {
      return (
        <CardDestination
          data={dataDes}
          props={props}
          setData={(e) => setdataDes(e)}
          token={token}
        />
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{ backgroundColor: "#fff", height: 50, alignItems: "center" }}
      >
        <View
          style={{
            marginTop: 15,
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
            underlineColorAndroid="transparent"
            style={{ flex: 1, marginRight: 5, padding: 0 }}
            value={texts}
            underlineColorAndroid="transparent"
            onChangeText={async (x) => {
              search(x);
            }}
            placeholder={t("search")}
            returnKeyType="search"
          />
          {texts.length !== 0 ? (
            <TouchableOpacity
              onPress={() => {
                setText("");
              }}
            >
              <Xblue
                width="20"
                height="20"
                style={{
                  alignSelf: "center",
                  // marginRight: 10,
                }}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      {/* TAB VIEW */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setindex}
        renderTabBar={(props) => {
          return (
            <TabBar
              {...props}
              style={{
                backgroundColor: "white",
              }}
              renderLabel={renderLabel}
              indicatorStyle={{ backgroundColor: "#209FAE", height: 2 }}
            />
          );
        }}
      />
      {/* END TAB VIEW */}
    </SafeAreaView>
  );
}
