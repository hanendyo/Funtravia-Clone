import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Modal,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Tab, Tabs, ScrollableTab } from "native-base";
import ActivePlan from "./ActivePlan";
import FinishTrip from "./FinishTrip";
import PlanList from "./PlanList";
import { Arrowbackwhite, Xgray } from "../../../assets/svg";
import { useLazyQuery, useQuery } from "@apollo/client";
import listitinerary from "../../../graphQL/Query/Itinerary/listitinerary";
import { useTranslation } from "react-i18next";
import { Button, Loading } from "../../../component";

export default function TripPlaning(props) {
  let [modalLogin, setModalLogin] = useState(false);
  const HeaderComponent = {
    title: "Your Trip",
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: "Your Trip",
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
        onPress={() => props.navigation.navigate("HomeScreen")}
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
  let [DataPlan, setDataPlan] = useState(0);
  let [DataActive, setDataActive] = useState(0);
  let [DataFinish, setDataFinish] = useState(0);
  let [loading, setloading] = useState(false);
  const loadAsync = async () => {
    setloading(true);
    let tkn = await AsyncStorage.getItem("access_token");
    setToken(tkn);
    if (tkn === null) {
      setModalLogin(true);
      // props.navigation.navigate("HomeScreen");
    } else {
      console.log(tkn);
      // await GetListitinplan();
      // await GetListitinaktif();
      // await GetListitinfinish();
    }
    await setloading(false);
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      loadAsync();
    });
    return unsubscribe;
  }, [props.navigation]);

  const {
    data: datalistplan,
    loading: loadinglistplan,
    error: errorlistplan,
    refetch: GetListitinplan,
  } = useQuery(listitinerary, {
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    variables: { status: "D" },
  });

  const {
    data: datalistaktif,
    loading: loadinglistaktif,
    error: errorlistaktif,
    refetch: GetListitinaktif,
  } = useQuery(listitinerary, {
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    variables: { status: "A" },
  });

  const {
    data: datalistfinish,
    loading: loadinglistfinish,
    error: errorlistfinish,
    refetch: GetListitinfinish,
  } = useQuery(listitinerary, {
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    variables: { status: "F" },
  });

  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  console.log(datalistplan);
  console.log(datalistaktif);
  console.log(datalistfinish);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Modal
        useNativeDriver={true}
        visible={modalLogin}
        onRequestClose={() => true}
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
          }}
        ></Pressable>
        <View
          style={{
            width: Dimensions.get("screen").width - 120,
            marginHorizontal: 60,
            backgroundColor: "#FFF",
            zIndex: 15,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            marginTop: Dimensions.get("screen").height / 4,
            borderRadius: 5,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              width: Dimensions.get("screen").width - 120,
              borderRadius: 5,
            }}
          >
            <View
              style={{
                backgroundColor: "#f6f6f6",
                borderRadius: 5,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  marginTop: 12,
                  marginBottom: 15,
                }}
                size="title"
                type="bold"
              >
                {t("LoginFirst")}
              </Text>
              <Pressable
                onPress={() => {
                  props.navigation.navigate("HomeScreen");
                  setModalLogin(false);
                }}
                style={{
                  height: 50,
                  width: 55,
                  position: "absolute",
                  right: 0,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Xgray width={15} height={15} />
              </Pressable>
            </View>
            <View
              style={{
                alignItems: "center",
                marginHorizontal: 30,
                marginBottom: 15,
                marginTop: 12,
              }}
            >
              <Text style={{ marginBottom: 5 }} size="title" type="bold">
                {t("nextLogin")}
              </Text>
              <Text
                style={{ textAlign: "center", lineHeight: 18 }}
                size="label"
                type="regular"
              >
                {t("textLogin")}
              </Text>
            </View>
            <View style={{ marginHorizontal: 30, marginBottom: 30 }}>
              <Button
                style={{ marginBottom: 5 }}
                onPress={() => {
                  setModalLogin(false);
                  props.navigation.push("AuthStack", {
                    screen: "LoginScreen",
                  });
                }}
                type="icon"
                text={t("signin")}
              ></Button>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  marginVertical: 5,
                }}
              >
                <View
                  style={{
                    width: 50,
                    borderBottomWidth: 1,
                    borderBottomColor: "#d1d1d1",
                    marginHorizontal: 10,
                  }}
                ></View>
                <Text style={{ alignSelf: "flex-end", marginVertical: 10 }}>
                  {t("or")}
                </Text>
                <View
                  style={{
                    width: 50,
                    borderBottomWidth: 1,
                    borderBottomColor: "#d1d1d1",
                    marginHorizontal: 10,
                  }}
                ></View>
              </View>
              <View style={{ alignItems: "center" }}>
                <Text
                  size="label"
                  type="bold"
                  style={{ color: "#209FAE" }}
                  onPress={() => {
                    setModalLogin(false);
                    props.navigation.push("AuthStack", {
                      screen: "RegisterScreen",
                    });
                  }}
                >
                  {t("createAkunLogin")}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Loading show={loading} />
      {/* <NavigationEvents onDidFocus={() => loadAsync()} /> */}

      <View>
        <View
          style={{
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View>
            {token ? (
              <Tabs
                // initialPage={
                //   props.route.params.index!==undefined ? props.route.params.index : 0
                // }
                tabBarUnderlineStyle={{ backgroundColor: "#209FAE" }}
                tabContainerStyle={{ borderWidth: 0, backgroundColor: "white" }}
                locked={false}
                renderTabBar={() => (
                  <ScrollableTab style={{ backgroundColor: "white" }} />
                )}
              >
                <Tab
                  // heading={
                  //   (datalistplan &&
                  //   datalistplan.itinerary_list_bystatus.length > 0
                  //     ? "" + datalistplan.itinerary_list_bystatus.length
                  //     : "0") +
                  //   " " +
                  //   t("planList")
                  // }
                  heading={t("planList")}
                  tabStyle={{ backgroundColor: "white" }}
                  activeTabStyle={{ backgroundColor: "white" }}
                  textStyle={{ fontFamily: "Lato-Bold", color: "#6C6C6C" }}
                  activeTextStyle={{
                    fontFamily: "Lato-Bold",
                    color: "#209FAE",
                  }}
                >
                  {/* {datalistplan && datalistplan.itinerary_list_bystatus ? ( */}
                  <PlanList
                    props={props}
                    token={token}
                    jumlah={(e) => setDataPlan(e)}
                    // data={datalistplan}
                    GetListitinplan={(e) => loadAsync(e)}
                  />
                  {/* ) : null} */}
                </Tab>
                <Tab
                  // heading={
                  //   (datalistaktif &&
                  //   datalistaktif.itinerary_list_bystatus.length > 0
                  //     ? "" + datalistaktif.itinerary_list_bystatus.length
                  //     : "0") +
                  //   " " +
                  //   t("activePlan")
                  // }
                  heading={t("activePlan")}
                  tabStyle={{
                    backgroundColor: "white",
                    flexDirection: "column",
                  }}
                  activeTabStyle={{ backgroundColor: "white" }}
                  textStyle={{ fontFamily: "Lato-Bold", color: "#6C6C6C" }}
                  activeTextStyle={{
                    fontFamily: "Lato-Bold",
                    color: "#209FAE",
                  }}
                >
                  {/* {datalistaktif && datalistaktif.itinerary_list_bystatus ? ( */}
                  <ActivePlan
                    props={props}
                    token={token}
                    jumlah={(e) => setDataActive(e)}
                    // data={datalistaktif}
                    GetListitinaktif={(e) => loadAsync(e)}
                  />
                  {/* ) : null} */}
                </Tab>

                <Tab
                  // heading={
                  //   (datalistfinish &&
                  //     datalistfinish.itinerary_list_bystatus.length > 0
                  //     ? "" + datalistfinish.itinerary_list_bystatus.length
                  //     : "0") +
                  //     " " +
                  //     t("finishTrip")
                  //   }
                  heading={t("finishTrip")}
                  tabStyle={{ backgroundColor: "white" }}
                  activeTabStyle={{ backgroundColor: "white" }}
                  textStyle={{ fontFamily: "Lato-Bold", color: "#6C6C6C" }}
                  activeTextStyle={{
                    fontFamily: "Lato-Bold",
                    color: "#209FAE",
                  }}
                >
                  {/* {datalistfinish && datalistfinish.itinerary_list_bystatus ? ( */}
                  <FinishTrip
                    props={props}
                    token={token}
                    jumlah={(e) => setDataFinish(e)}
                    // data={datalistfinish}
                    GetListitinfinish={(e) => loadAsync(e)}
                  />
                  {/* ) : null} */}p{" "}
                </Tab>
              </Tabs>
            ) : null}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
