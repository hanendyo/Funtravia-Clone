import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TextInput,
  SafeAreaView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Xblue } from "../../assets/svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, Text } from "../../component";
import { fromPromise, useLazyQuery } from "@apollo/client";
import { Tab, Tabs, ScrollableTab, TabHeading } from "native-base";
import Destination from "./Destination";
import Event from "./Event";
import Transportation from "./Transportation";
import Service from "./Service";
import Events from "../../graphQL/Query/Wishlist/Event";
import Destinasi from "../../graphQL/Query/Wishlist/Destination";
import Services from "../../graphQL/Query/Wishlist/Services";
import Trans from "../../graphQL/Query/Wishlist/Transportation";
import { useTranslation } from "react-i18next";
import { Arrowbackios, Arrowbackwhite, Search } from "../../assets/svg";

export default function Wishlist(props) {
  const { t, i18n } = useTranslation();
  const HeaderComponent = {
    headerShown: true,
    title: "Wishlist",
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: "Wishlist",
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      fontFamily: "Lato-Bold",
      fontSize: 18,
      color: "white",
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
  let [token, setToken] = useState("");
  let [texts, setText] = useState("");
  let [textc, setTextc] = useState("");

  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    setToken(tkn);
    if (tkn) {
      getEvent();
      getDes();
      getServices();
      getTrans();
    }
  };

  let [dataTrans, setdataTrans] = useState({});
  let [dataEvent, setdataEvent] = useState({});
  let [dataDes, setdataDes] = useState({});
  let [dataServices, setdataServices] = useState({});

  const [
    getTrans,
    { loading: loadingTrans, data: dataTran, error: errorTrans },
  ] = useLazyQuery(Trans, {
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
      setdataTrans(dataTran);
    },
  });

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
      setdataEvent(dataEven);
    },
  });

  const [
    getDes,
    { loading: loadingDes, data: dataDe, error: errorDes },
  ] = useLazyQuery(Destinasi, {
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
      setdataDes(dataDe);
    },
  });

  const [
    getServices,
    { loading: loadingServices, data: dataService, error: errorServices },
  ] = useLazyQuery(Services, {
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
      setdataServices(dataService);
    },
  });

  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  const [refreshing, setRefreshing] = React.useState(false);

  const _Refresh = React.useCallback(() => {
    loadAsync();
    wait(2000).then(() => {
      setRefreshing(false);
    });
  }, []);

  const search = async (x) => {
    setText(x);
  };

  let [index, setindex] = useState(0);

  const GetEvent = () => {
    setindex(1);
    return (
      <Event
        props={props}
        dataEvent={
          !loading
            ? dataEvent && dataEvent?.listevent_wishlist?.length > 0
              ? dataEvent?.listevent_wishlist
              : []
            : []
        }
        Textcari={texts}
        token={token}
        refreshing={refreshing}
        Refresh={(e) => _Refresh(e)}
      />
    );
  };

  const GetDes = () => {
    setindex(0);
    return (
      <Destination
        props={props}
        token={token}
        refreshing={refreshing}
        Textcari={texts}
        Refresh={(e) => _Refresh(e)}
      />
    );
  };

  const GetService = () => {
    return (
      <Service
        props={props}
        serviceData={
          dataServices && dataServices?.listservice_wishlist?.length > 0
            ? dataServices?.listservice_wishlist
            : []
        }
        token={token}
        refreshing={refreshing}
        Refresh={(e) => _Refresh(e)}
      />
    );
  };

  const GetTrans = () => {
    return (
      <Transportation
        props={props}
        transData={
          dataTrans && dataTrans?.listtransportation_wishlist?.length > 0
            ? dataTrans?.listtransportation_wishlist
            : []
        }
        token={token}
        refreshing={refreshing}
        Refresh={(e) => _Refresh(e)}
      />
    );
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    _Refresh();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ backgroundColor: "#fff" }}>
        <View
          style={{
            marginTop: 15,
            marginHorizontal: 15,
            width: Dimensions.get("screen").width - 30,
            height: 40,
            backgroundColor: "#f6f6f6",
            borderRadius: 5,
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Search height={20} width={20} style={{ marginHorizontal: 10 }} />
          <TextInput
            style={{ flex: 1, borderRadius: 5, marginRight: 5 }}
            value={texts}
            underlineColorAndroid="transparent"
            onChangeText={async (x) => {
              search(x);
            }}
            placeholder={t("search")}
            placeholderTextColor="#464646"
            returnKeyType="search"
            autoFocus={false}
            fontSize={16}
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
                  marginRight: 10,
                }}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      <Tabs
        tabContainerStyle={{ height: 200, borderWidth: 1 }}
        tabBarUnderlineStyle={{ backgroundColor: "#209FAE", height: 2 }}
        // tabContainerStyle={{ borderWidth: 0 }}
        locked={false}
        style={{ borderColor: "#d1d1d1" }}
        renderTabBar={() => (
          <ScrollableTab style={{ backgroundColor: "#fff" }} />
        )}
      >
        <Tab
          heading={
            <TabHeading
              style={{
                width: Dimensions.get("screen").width / 2,
                backgroundColor: "#fff",
                marginBottom: 5,
              }}
            >
              <Text
                size="label"
                type="bold"
                style={{ color: index == 0 ? "#209fae" : "#464646" }}
              >
                {t("destination")}
              </Text>
            </TabHeading>
          }
          tabStyle={{
            backgroundColor: "#fff",
            width: Dimensions.get("screen").width / 2,
          }}
          activeTabStyle={{
            backgroundColor: "#fff",
            width: Dimensions.get("screen").width / 2,
          }}
        >
          <GetDes />
        </Tab>
        <Tab
          heading={
            <TabHeading
              style={{
                width: Dimensions.get("screen").width / 2,
                backgroundColor: "#fff",
                marginBottom: 5,
              }}
            >
              <Text
                size="label"
                type="bold"
                style={{ color: index == 1 ? "#209fae" : "#464646" }}
              >
                {t("events")}
              </Text>
            </TabHeading>
          }
          tabStyle={{
            backgroundColor: "white",
            width: Dimensions.get("screen").width / 2,
          }}
          activeTabStyle={{
            backgroundColor: "white",
            width: Dimensions.get("screen").width / 2,
          }}
        >
          <GetEvent />
        </Tab>
      </Tabs>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
