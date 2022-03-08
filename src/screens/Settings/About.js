import React, { useEffect } from "react";
import { StyleSheet, Dimensions, StatusBar } from "react-native";
import { WebView } from "react-native-webview";
import { Nextpremier, Arrowbackwhite, Arrowbackios } from "../../assets/svg";
import { Text, Button } from "../../component";
import { useTranslation } from "react-i18next";

export default function About(props) {
  const { t, i18n } = useTranslation();
  // let [param, setParam] = useState(props.navigation.getParam('params'));
  // const [Param, { data, loading, error }] = useLazyQuery(getParams, {
  // 	// fetchPolicy: 'network-only',
  // 	// context: {
  // 	// 	headers: {
  // 	// 		'Content-Type': 'application/json',
  // 	// 		Authorization: token?`Bearer ${token}`:null,
  // 	// 	},
  // 	// },
  // 	variables: { code: param },
  // });
  // useEffect(() => {
  // 	Param();
  // }, []);
  const INJECTEDJAVASCRIPT = `const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=0.5, maximum-scale=0.5, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta);`;
  const HeaderComponent = {
    title: "",
    // headerTransparent: true,
    headerTintColor: "white",
    headerTitle: (
      <Text size="header" style={{ color: "#fff" }}>
        {t("aboutFuntravia")}
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
      elevation: Platform.OS == "ios" ? 0 : null,
      borderBottomWidth: Platform.OS == "ios" ? 0 : null,
      width: Platform.OS == "ios" ? Dimensions.get("screen").width : null,
      height: Platform.OS == "ios" ? StatusBar.currentHeight : null,
      textAlign: Platform.OS == "ios" ? "center" : null,
      paddingVertical: Platform.OS == "ios" ? 10 : null,
    },
    headerLeftContainerStyle: {
      background: "#FFF",
      position: "absolute",
      zIndex: 999,
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
  return (
    <WebView
      source={{ uri: "https://funtravia.com" }}
      injectedJavaScript={INJECTEDJAVASCRIPT}
    />
  );
}
const styles = StyleSheet.create({
  main: {
    width: Dimensions.get("window").width - 15,
    margin: 10,
    alignContent: "flex-start",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
});

About.navigationOptions = ({ navigation }) => ({
  headerTitle: "About Funtravia",
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
