import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Dimensions,
  Pressable,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ActivePlan from "./ActivePlan";
import FinishTrip from "./FinishTrip";
import PlanList from "./PlanList";
import { Arrowbackwhite, Xgray } from "../../../assets/svg";
import { useLazyQuery, useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { Button, Text } from "../../../component";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ItineraryCount from "../../../graphQL/Query/Itinerary/ItineraryCount";
import ListItinerary from "../../../graphQL/Query/Itinerary/listitinerary";
import ListItineraryActive from "../../../graphQL/Query/Itinerary/listitineraryA";
import ListItineraryFinish from "../../../graphQL/Query/Itinerary/listitineraryF";

const Tab = createMaterialTopTabNavigator();

export default function TripPlaning(props) {
  const { t, i18n } = useTranslation();
  const [modalLogin, setModalLogin] = useState(false);

  const HeaderComponent = {
    title: "Your Trip",
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: t("youTrip"),
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
        onPress={() => props.navigation.navigate("HomeScreen")}
        style={{
          height: 55,
        }}
      >
        <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
      </Button>
    ),
  };

  let [token, setToken] = useState(null);
  let [loading, setloading] = useState(false);
  let [rData, setData] = useState([]);
  let [AData, setDataActive] = useState([]);
  let [FData, setDataFinish] = useState([]);

  const loadAsync = async () => {
    setloading(true);
    let tkn = await AsyncStorage.getItem("access_token");
    setToken(tkn);
    if (tkn === null) {
      setModalLogin(true);
      // props.navigation.navigate("HomeScreen");
    } else {
      await GetCount();
      await GetData();
      await GetDataActive();
      await GetDataFinish();
    }
    await setloading(false);
  };

  const [planCount, setPlancount] = useState({
    count_active: 0,
    count_draf: 0,
    count_finish: 0,
  });

  const [
    GetCount,
    { data: dataCount, loading: loadingCount, error: errorCount },
  ] = useLazyQuery(ItineraryCount, {
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    onCompleted: () => {
      setPlancount(dataCount.count_myitinerary);
    },
  });

  // console.log(planCount, "planC");
  const [
    GetData,
    { data, loading: loadingdata, error: errordata },
  ] = useLazyQuery(ListItinerary, {
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    onCompleted: () => {
      setData(data?.itinerary_list_draf);
    },
    // variables: { status: "D" },
  });

  const [
    GetDataActive,
    { data: dataActive, loading: loadingdataActive, error: errordataActive },
  ] = useLazyQuery(ListItineraryActive, {
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    onCompleted: () => {
      setDataActive(dataActive.itinerary_list_active);
    },
    // variables: { status: "D" },
  });

  const [
    GetDataFinish,
    { data: dataFinish, loading: loadingdataFinish, error: errordataFinish },
  ] = useLazyQuery(ListItineraryFinish, {
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    onCompleted: () => {
      setDataFinish(dataFinish.itinerary_list_finish);
    },
    // variables: { status: "D" },
  });

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    loadAsync();

    // const unsubscribe = props.navigation.addListener("focus", () => {
    // });
    // return unsubscribe;
  }, [props.navigation]);

  function MyTabBar({ state, descriptors, navigation, position, count }) {
    return (
      <View
        style={{
          flexDirection: "row",
          borderBottomWidth: 1,
          borderBottomColor: "#d3d3d3",
        }}
      >
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
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };
          // modify inputRange for custom behavior
          const inputRange = state.routes.map((_, i) => i);
          // const opacity = Animated.interpolate(position, {
          //   inputRange,
          //   outputRange: inputRange.map((i) => (i === index ? 1 : 0)),
          // });

          return (
            <Pressable
              key={route.name}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{
                borderBottomWidth: isFocused ? 2 : 0,
                paddingVertical: 10,
                borderBottomColor: "#209fae",
                flex: 1,
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                type={isFocused ? "bold" : "regular"}
                size="label"
                style={{
                  color: isFocused ? "#209fae" : "#646464",
                }}
              >
                {index == 0
                  ? count.count_draf
                  : index == 1
                  ? count.count_active
                  : count.count_finish}
              </Text>
              <Text
                type={isFocused ? "bold" : "regular"}
                size="label"
                style={{
                  color: isFocused ? "#209fae" : "#646464",
                }}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    );
  }

  // if (token !== null && dataCount && dataCount.count_myitinerary) {
  return (
    <Tab.Navigator
      backBehavior="none"
      initialRouteName="Edit"
      // tabBarOptions={{
      //   activeTintColor: "#209fae",
      //   labelStyle: {
      //     fontFamily: "Lato-Bold",
      //   },
      //   style: {
      //     backgroundColor: "#ffff",
      //   },
      // }}
      tabBar={(props) => <MyTabBar {...props} count={planCount} />}
    >
      <Tab.Screen
        name="Edit"
        component={() => (
          <PlanList
            props={props}
            token={token}
            rData={rData}
            GetCount={() => GetCount()}
            GetData={(e) => GetData(e)}
            GetDataActive={(e) => GetDataActive(e)}
            GetDataFinish={(e) => GetDataFinish(e)}
            loadingdata={loadingdata}
          />
        )}
        options={{ tabBarLabel: t("planList") }}
      />

      <Tab.Screen
        name="Save"
        component={(e) => (
          <ActivePlan
            props={props}
            token={token}
            AData={AData}
            GetCount={() => GetCount()}
            GetData={(e) => GetData(e)}
            GetDataActive={(e) => GetDataActive(e)}
            GetDataFinish={(e) => GetDataFinish(e)}
            loadingdataActive={loadingdataActive}
          />
        )}
        options={{ tabBarLabel: t("activePlan") }}
      />

      <Tab.Screen
        name="Finish"
        component={
          (e) => (
            <FinishTrip
              props={props}
              token={token}
              FData={FData}
              GetCount={() => GetCount()}
              GetData={(e) => GetData(e)}
              GetDataActive={(e) => GetDataActive(e)}
              GetDataFinish={(e) => GetDataFinish(e)}
              loadingdataFinish={loadingdataFinish}
            />
          )
          // FinishTrip(props, token, FData, GetDataFinish, loadingdataFinish)
        }
        options={{ tabBarLabel: t("finishTrip") }}
      />
    </Tab.Navigator>
  );
  // } else {
  //   return (
  //     // <View
  //     //   style={{
  //     //     flex: 1,
  //     //     alignItems: "center",
  //     //     alignContent: "center",
  //     //     justifyContent: "center",
  //     //   }}
  //     // >
  //     //   {/* <ActivityIndicator animating={true} color="#209fae" size="large" /> */}
  //     // </View>

  //     <Tab.Navigator
  //       backBehavior="none"
  //       initialRouteName="Edit"
  //       // tabBarOptions={{
  //       //   activeTintColor: "#209fae",
  //       //   labelStyle: {
  //       //     fontFamily: "Lato-Bold",
  //       //   },
  //       //   style: {
  //       //     backgroundColor: "#ffff",
  //       //   },
  //       // }}
  //       tabBar={(props) => (
  //         <MyTabBar
  //           {...props}
  //           count={{ count_draf: 0, count_active: 0, count_finish: 0 }}
  //         />
  //       )}
  //     >
  //       <Tab.Screen
  //         name="Edit"
  //         component={() => <View></View>}
  //         // options={{ tabBarLabel: "Plan" }}
  //         options={{ tabBarLabel: t("planList") }}
  //       />
  //       <Tab.Screen
  //         name="Save"
  //         component={() => <View></View>}
  //         // options={{ tabBarLabel: "Ongoing" }}
  //         options={{ tabBarLabel: t("activePlan") }}
  //       />
  //       <Tab.Screen
  //         name="Finish"
  //         component={() => <View></View>}
  //         // options={{ tabBarLabel: "Finish" }}
  //         options={{ tabBarLabel: t("finishTrip") }}
  //       />
  //     </Tab.Navigator>
  //   );
  // }
}

const styles = StyleSheet.create({});
