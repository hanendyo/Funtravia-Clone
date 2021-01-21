import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, FlatList, Modal, Dimensions } from "react-native";

import { useQuery, useLazyQuery } from "@apollo/react-hooks";

import { WebView } from "react-native-webview";
import { back_arrow_white } from "../../assets/png";
import { Nextpremier, Arrowbackwhite } from "../../assets/svg";
import { Text, Button } from "../../component";
export default function FAQ(props) {
  const INJECTEDJAVASCRIPT = `const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=0.5, maximum-scale=0.5, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta);`;
  return (
    <WebView
      source={{ uri: "https://www.funtravia.com" }}
      injectedJavaScript={INJECTEDJAVASCRIPT}
    />
  );
}
FAQ.navigationOptions = ({ navigation }) => ({
  headerTitle: "FAQ",
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

const styles = StyleSheet.create({
  main: {
    width: Dimensions.get("window").width - 15,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
});
