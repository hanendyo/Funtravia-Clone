import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TextInput,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, CustomImage } from "../../component";
import { search_button, back_arrow_white } from "../../assets/png";
import { useLazyQuery } from "@apollo/react-hooks";
import { Tab, Tabs, ScrollableTab } from "native-base";
import Destination from "./Destination";
import Event from "./Event";
import Transportation from "./Transportation";
import Service from "./Service";
import Events from "../../graphQL/Query/Wishlist/Event";
import Destinasi from "../../graphQL/Query/Wishlist/Destination";
import Services from "../../graphQL/Query/Wishlist/Services";
import Trans from "../../graphQL/Query/Wishlist/Transportation";
import { Loading } from "../../component";
import { useTranslation } from "react-i18next";
import { Arrowbackwhite } from "../../assets/svg";

export default function Wishlist(props) {
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
      fontSize: 14,
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
        <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
      </Button>
    ),
  };
  const { t, i18n } = useTranslation();
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

  const [
    getTrans,
    { loading: loadingTrans, data: dataTrans, error: errorTrans },
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
  });

  const [getEvent, { loading, data: dataEvent, error }] = useLazyQuery(Events, {
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
  });

  const [
    getDes,
    { loading: loadingDes, data: dataDes, error: errorDes },
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
  });

  const [
    getServices,
    { loading: loadingServices, data: dataServices, error: errorServices },
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

  const search = (x) => {
    setText(textc);
    GetEvent();
    GetDes();
    getServices();
    getTrans();
  };

  const GetEvent = () => {
    return (
      <Event
        props={props}
        dataEvent={
          dataEvent && dataEvent.listevent_wishlist.length > 0
            ? dataEvent.listevent_wishlist
            : []
        }
        token={token}
        refreshing={refreshing}
        Refresh={(e) => _Refresh(e)}
      />
    );
  };

  const GetDes = () => {
    return (
      <Destination
        props={props}
        destinationData={
          dataDes && dataDes.listdetination_wishlist.length > 0
            ? dataDes.listdetination_wishlist
            : []
        }
        token={token}
        refreshing={refreshing}
        Refresh={(e) => _Refresh(e)}
      />
    );
  };

  const GetService = () => {
    return (
      <Service
        props={props}
        serviceData={
          dataServices && dataServices.listservice_wishlist.length > 0
            ? dataServices.listservice_wishlist
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
          dataTrans && dataTrans.listtransportation_wishlist.length > 0
            ? dataTrans.listtransportation_wishlist
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
      <Loading show={loading} />
      {/* <NavigationEvents onDidFocus={() => _Refresh()} /> */}
      <View>
        <View
          style={{
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 10,
            backgroundColor: "white",
          }}
        >
          <View
            style={{
              height: 90,
            }}
          >
            <View
              style={{
                backgroundColor: "#F0F0F0",
                borderRadius: 5,
                width: Dimensions.get("window").width / 1.12,
                height: 45,
                marginTop: 50,
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <View
                style={{
                  marginHorizontal: 8,
                }}
              >
                <CustomImage
                  source={search_button}
                  customImageStyle={{ resizeMode: "cover" }}
                  customStyle={{
                    height: 15,
                    width: 15,
                    alignSelf: "center",
                    zIndex: 100,
                  }}
                />
              </View>
              <View>
                <TextInput
                  value={textc}
                  style={{
                    height: 38,
                    maxWidth: 250,
                    paddingLeft: 5,
                    textAlign: "left",
                  }}
                  underlineColorAndroid="transparent"
                  onChangeText={(x) => setTextc(x)}
                  placeholder={t("searchWishlist")}
                  returnKeyType="search"
                  autoFocus={true}
                  onSubmitEditing={(x) => search(x)}
                />
              </View>
            </View>
          </View>
          <View
            style={{
              paddingVertical: 10,
            }}
          >
            <Tabs
              tabBarUnderlineStyle={{ backgroundColor: "#209FAE" }}
              tabContainerStyle={{ borderWidth: 0 }}
              locked={false}
              renderTabBar={() => (
                <ScrollableTab style={{ backgroundColor: "transparent" }} />
              )}
            >
              <Tab
                heading={t("destination")}
                tabStyle={{ backgroundColor: "white" }}
                activeTabStyle={{ backgroundColor: "white" }}
                textStyle={{ fontFamily: "Lato-Bold", color: "#6C6C6C" }}
                activeTextStyle={{ fontFamily: "Lato-Bold", color: "#209FAE" }}
              >
                <GetDes />
              </Tab>
              {/* <Tab
								heading={t('accommodation')}
								tabStyle={{ backgroundColor: 'white' }}
								activeTabStyle={{ backgroundColor: 'white' }}
								textStyle={{ fontFamily: "Lato-Bold", color: '#6C6C6C' }}
								activeTextStyle={{
									fontFamily: "Lato-Bold",
									color: '#209FAE',
								}}></Tab> */}
              {/* <Tab
								heading={t('transportation')}
								tabStyle={{ backgroundColor: 'white' }}
								activeTabStyle={{ backgroundColor: 'white' }}
								textStyle={{ fontFamily: "Lato-Bold", color: '#6C6C6C' }}
								activeTextStyle={{
									fontFamily: "Lato-Bold",
									color: '#209FAE',
								}}>
								<GetTrans />
							</Tab> */}
              <Tab
                heading={t("events")}
                tabStyle={{ backgroundColor: "white" }}
                activeTabStyle={{ backgroundColor: "white" }}
                textStyle={{ fontFamily: "Lato-Bold", color: "#6C6C6C" }}
                activeTextStyle={{
                  fontFamily: "Lato-Bold",
                  color: "#209FAE",
                }}
              >
                <GetEvent />
              </Tab>
              {/* <Tab
								heading={t('services')}
								tabStyle={{ backgroundColor: 'white' }}
								activeTabStyle={{ backgroundColor: 'white' }}
								textStyle={{ fontFamily: "Lato-Bold", color: '#6C6C6C' }}
								activeTextStyle={{
									fontFamily: "Lato-Bold",
									color: '#209FAE',
								}}>
								<GetService />
							</Tab> */}
            </Tabs>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
