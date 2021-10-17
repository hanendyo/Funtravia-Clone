import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { Arrowbackios, Arrowbackwhite } from "../../assets/svg";
import { Button, Text } from "../../component";
import { useTranslation } from "react-i18next";
export default function Privacy(props) {
  const { t, i18n } = useTranslation();
  const HeaderComponent = {
    // headerTransparent: true,
    headerTintColor: "white",
    headerTitle: (
      <Text size="header" style={{ color: "#fff" }}>
        {t("privacyPolicy")}
      </Text>
    ),
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
        style={
          {
            // backgroundColor: "rgba(0,0,0,0.3)",
          }
        }
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
  const INJECTEDJAVASCRIPT = `const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=0.5, maximum-scale=0.5, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta);`;
  return (
    <WebView
      source={{ uri: "https://funtravia.com/privacy" }}
      injectedJavaScript={INJECTEDJAVASCRIPT}
    />
  );
}
Privacy.navigationOptions = ({ navigation }) => ({
  headerTitle: "Privacy",
  headerMode: "screen",
  headerStyle: {
    backgroundColor: "#209FAE",
    elevation: 0,
    borderBottomWidth: 0,
    fontSize: 50,
  },
  headerTitleStyle: {
    fontFamily: "Lato-Bold",
    fontSize: 14,
    color: "white",
  },
  headerLeft: (
    <Button
      type="circle"
      size="small"
      variant="transparent"
      onPress={() => navigation.goBack()}
    >
      {Platform.OS == "ios" ? (
        <Arrowbackios height={15} width={15}></Arrowbackios>
      ) : (
        <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
      )}
    </Button>
  ),
  headerLeftContainerStyle: {
    paddingLeft: 10,
  },

  headerRight: () => {
    return null;
  },
});

const styles = StyleSheet.create({});
