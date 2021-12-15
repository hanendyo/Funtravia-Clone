import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Tab, Tabs, ScrollableTab } from "native-base";
import ActivePlan from "./ActivePlan";
import FinishTrip from "./FinishTrip";
import PlanList from "./PlanList";
import { Arrowbackwhite } from "../../../assets/svg";
import { useLazyQuery, useQuery } from "@apollo/client";
import listitinerary from "../../../graphQL/Query/Itinerary/listitinerary";
import { useTranslation } from "react-i18next";
import { Button, Loading } from "../../../component";

export default function TripPlaning(props) {
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
      Alert.alert("Silahkan Login terlebih dahulu");
      props.navigation.navigate("HomeScreen");
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

  // const {
  //   data: datalistplan,
  //   loading: loadinglistplan,
  //   error: errorlistplan,
  //   refetch: GetListitinplan,
  // } = useQuery(listitinerary, {
  //   fetchPolicy: "network-only",
  //   context: {
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: token?`Bearer ${token}`:null,
  //     },
  //   },
  //   variables: { status: "D" },
  // });

  // const {
  //   data: datalistaktif,
  //   loading: loadinglistaktif,
  //   error: errorlistaktif,
  //   refetch: GetListitinaktif,
  // } = useQuery(listitinerary, {
  //   fetchPolicy: "network-only",
  //   context: {
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: token?`Bearer ${token}`:null,
  //     },
  //   },
  //   variables: { status: "A" },
  // });

  // const {
  //   data: datalistfinish,
  //   loading: loadinglistfinish,
  //   error: errorlistfinish,
  //   refetch: GetListitinfinish,
  // } = useQuery(listitinerary, {
  //   fetchPolicy: "network-only",
  //   context: {
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: token?`Bearer ${token}`:null,
  //     },
  //   },
  //   variables: { status: "F" },
  // });

  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
