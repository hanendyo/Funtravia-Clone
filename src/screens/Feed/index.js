import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  Pressable,
  Modal,
  StatusBar,
  Platform,
} from "react-native";
import { Button, Text } from "../../component";
import { PostButton, SearchWhite, Xgray } from "../../assets/svg";
import FeedList from "./FeedList";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import DeviceInfo from "react-native-device-info";

export default function Feed(props) {
  const { t } = useTranslation();
  const tokenApps = useSelector((data) => data.token);
  let [modalLogin, setModalLogin] = useState(false);
  const deviceId = DeviceInfo.getModel();
  const HeaderComponent = {
    headerShown: true,
    transparent: false,
    tabBarVisble: false,
    tabBarLabel: "Feed",
    headerTintColor: "white",
    headerTitle: (
      <Text
        type="bold"
        size={Platform.OS == "ios" ? "title" : "header"}
        style={{ color: "#fff" }}
      >
        Fun Feed
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
      paddingTop: Platform.OS == "ios" ? 10 : null,
      paddingBottom: Platform.OS == "ios" ? 15 : null,
    },
    headerLeftContainerStyle: {
      background: "#FFF",
      position: "absolute",
      zIndex: 999,
      marginLeft: 10,
    },
    headerRight: () => (
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          style={{ marginRight: 20 }}
          onPress={() =>
            props.navigation.navigate("FeedStack", { screen: "SearchPageFeed" })
          }
        >
          <SearchWhite height={20} width={20} />
        </TouchableOpacity>
      </View>
    ),
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
  }, [props.navigation]);

  const createPost = () => {
    if (tokenApps) {
      props.navigation.navigate("FeedStack", {
        screen: "Post",
      });
    } else {
      setModalLogin(true);
    }
  };

  if (tokenApps !== "hshs") {
    return (
      <View style={{ flex: 1, backgroundColor: "#F6F6F6" }}>
        <Modal
          useNativeDriver={true}
          visible={modalLogin}
          onRequestClose={() => true}
          transparent={true}
          animationType="fade"
        >
          <Pressable
            onPress={() => setModalLogin(false)}
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
                  onPress={() => setModalLogin(false)}
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
        <FeedList props={props} token={tokenApps} />
        <Pressable style={styles.fab} onPress={createPost}>
          <PostButton height={50} width={50} />
        </Pressable>
      </View>
    );
  }
  if (tokenApps) {
    return (
      <View style={{ flex: 1, backgroundColor: "#F6F6F6" }}>
        {tokenApps ? (
          <Pressable style={styles.fab} onPress={createPost}>
            <PostButton height={50} width={50} />
          </Pressable>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "grey",
  },
  fab: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
});
