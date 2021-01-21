import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import { WebView } from "react-native-webview";
import { Nextpremier, Arrowbackwhite } from "../../assets/svg";
import { Text, Button } from "../../component";

export default function About(props) {
  // let [param, setParam] = useState(props.navigation.getParam('params'));
  // console.log(param);
  // const [Param, { data, loading, error }] = useLazyQuery(getParams, {
  // 	// fetchPolicy: 'network-only',
  // 	// context: {
  // 	// 	headers: {
  // 	// 		'Content-Type': 'application/json',
  // 	// 		Authorization: `Bearer ${token}`,
  // 	// 	},
  // 	// },
  // 	variables: { code: param },
  // });
  // useEffect(() => {
  // 	Param();
  // }, []);
  const INJECTEDJAVASCRIPT = `const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=0.5, maximum-scale=0.5, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta);`;

  return (
    <WebView
      source={{ uri: "https://www.funtravia.com" }}
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
    fontFamily: "lato-reg",
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
      <Arrowbackwhite height={20} width={20} />
    </Button>
  ),
  headerLeftContainerStyle: {
    paddingLeft: 10,
  },

  headerRight: () => {
    return null;
  },
});
