import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Platform,
  Pressable,
  Button as ButtonRn,
  ActivityIndicator,
} from "react-native";
import { Text, Button, StatusBar } from "../../../component";

const { width } = Dimensions.get("screen");

export default function PostItineraryAlbum(props) {
  const [dataalbums, setAllalbum] = useState(props.route.params.data_album);
  let itinerary_id = props.route.params.itinerary_id;
  // console.log(dataalbums.album);
  const HeaderComponent = {
    title: "Select Photos",
    headerTintColor: "white",
    headerTitle: "Select Photos",
    headerShown: true,
    // headerTransparent: true,
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      fontFamily: "Lato-Bold",
      fontSize: 16,
      color: "white",
    },
  };
  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
  }, [props.navigation]);

  return (
    <View>
      <Text>Feed Album</Text>
    </View>
  );
}
