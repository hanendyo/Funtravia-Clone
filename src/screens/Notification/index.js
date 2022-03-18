import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Platform,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Pressable,
} from "react-native";
import { Text, Button } from "../../component";
import { useQuery } from "@apollo/react-hooks";
import Information from "./DetailNotification/Information";
import Invitation from "./DetailNotification/Invitation";
import { TabBar, TabView } from "react-native-tab-view";
import { useTranslation } from "react-i18next";
import { Arrowbackios, Arrowbackwhite } from "../../assets/svg";
import { useSelector } from "react-redux";

export default function Notification(props) {
  const tokenApps = useSelector((data) => data.token);
  const { t } = useTranslation();
  let [token, setToken] = useState(props.route.params.token);
  let [readall, setreadall] = useState(true);
  let [showSideModal, setshowSideModal] = useState(false);
  const [routes] = useState([
    { key: "tab1", title: t("notification") },
    { key: "tab2", title: t("information") },
  ]);
  const [index, setIndex] = useState(0);

  const HeaderComponent = {
    headerShown: true,
    transparent: false,
    tabBarVisble: false,
    headerTintColor: "white",
    headerTitle: (
      <Text size="header" type="bold" style={{ color: "#fff" }}>
        {t("inbox")}
      </Text>
    ),
    headerMode: "screen",
    headerStyle: {
      backgroundColor: Platform.OS == "ios" ? "#14646e" : "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      backgroundColor: Platform.OS == "ios" ? "#209fae" : null,
      width: Platform.OS == "ios" ? Dimensions.get("screen").width : null,
      height: Platform.OS == "ios" ? 45 : null,
      textAlign: Platform.OS == "ios" ? "center" : null,
      paddingTop: Platform.OS == "ios" ? 8 : null,
      paddingBottom: Platform.OS == "ios" ? 15 : 1,
    },
    headerLeftContainerStyle: {
      background: "#FFF",
      position: "absolute",
      zIndex: 999,
      marginLeft: 10,
    },
    headerLeft: () => (
      <Button
        size="medium"
        type="circle"
        variant="transparent"
        onPress={() => {
          props.navigation.goBack();
        }}
        style={{
          height: 55,
          marginLeft: 5,
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

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
  }, []);

  const renderScene = ({ route }) => {
    if (route.key == "tab1") {
      return (
        <Invitation
          navigation={props.navigation}
          token={tokenApps}
          readall={readall}
          setreadall={(e) => setreadall(e)}
          setshowSideModal={(e) => setshowSideModal(e)}
        />
      );
    } else if (route.key == "tab2") {
      return null;
    }
  };

  const renderLabel = ({ route, focused }) => {
    return (
      <Text
        style={[
          focused ? styles.labelActive : styles.label,
          { opacity: focused ? 1 : 1, height: "100%", marginBottom: 2 },
        ]}
      >
        {route.title}
      </Text>
    );
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {showSideModal ? (
        <Pressable
          onPress={() => setshowSideModal(false)}
          style={{
            width: Dimensions.get("screen").width + 25,
            height: Dimensions.get("screen").height,
            justifyContent: "center",
            opacity: 0.7,
            zIndex: 99999999,
            backgroundColor: "#000",
            position: "absolute",
          }}
        ></Pressable>
      ) : null}
      <TabView
        lazy={true}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={(id) => {
          return setIndex(id);
        }}
        renderTabBar={(props) => {
          return (
            <TabBar
              {...props}
              style={{
                backgroundColor: "white",
                height: 42,
                justifyContent: "center",
              }}
              renderLabel={renderLabel}
              indicatorStyle={styles.indicator}
            />
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    height: 100,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    backgroundColor: "#FFF",
  },
  label: {
    fontSize: Platform.OS == "ios" ? 18 : 16,
    color: "#464646",
    fontFamily: "Lato-Bold",
  },
  labelActive: {
    fontSize: Platform.OS == "ios" ? 18 : 16,
    color: "#209FAE",
    fontFamily: "Lato-Bold",
  },
  tab: {
    elevation: 1,
    shadowOpacity: 0.5,
    backgroundColor: "#FFF",
    height: 40,
  },
  indicator: { backgroundColor: "#209FAE", height: 2 },
});
