import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TextInput,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, CustomImage, Text, Truncate } from "../../component";
import { default_image } from "../../assets/png";
import { useLazyQuery } from "@apollo/react-hooks";
import { Loading } from "../../component";
import { useTranslation } from "react-i18next";
import { Arrowbackwhite } from "../../assets/svg";
import { Image } from "react-native";
import { ImageBackground } from "react-native";
import { ScrollView } from "react-native";
import { FlatList } from "react-native";
import Ripple from "react-native-material-ripple";

export default function TravelIdeas(props) {
  const HeaderComponent = {
    headerShown: true,
    title: "Travel Ideas",
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: "Travel Ideas",
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

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
  }, []);

  let data = [{}, {}, {}];

  return (
    <ScrollView
      contentContainerStyle={{
        backgroundColor: "#f6f6f6",
      }}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      style={{
        flex: 1,
        // backgroundColor: "#fff",
        // padding: 20,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginTop: 50,
        }}
      >
        <Ripple
          style={{
            padding: 30,
            backgroundColor: "#209fae",
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <Text>Unesco</Text>
        </Ripple>
        <Ripple
          style={{
            padding: 30,
            backgroundColor: "#209fae",
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <Text>Movie Location</Text>
        </Ripple>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
