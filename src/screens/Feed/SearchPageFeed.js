import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  Text,
  Alert,
  SafeAreaView,
  TextInput
} from "react-native";
import Ripple from "react-native-material-ripple";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CustomImage } from "../../component";
import { NetworkStatus } from "@apollo/client";
import {
  Comment,
  LikeRed,
  LikeEmpty,
  PostButton,
  OptionsVertBlack,
  ShareBlack,
  Kosong,
  SearchWhite,
  Magnifying,
  OptionsVertWhite
} from "../../assets/svg";
import { gql } from "apollo-boost";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import AutoHeightImage from "react-native-auto-height-image";
import likepost from "../../graphQL/Mutation/Post/likepost";
import FeedPost from "../../graphQL/Query/Feed/FeedPost";
import FeedList from "./FeedList";
import FeedPopuler from "../../graphQL/Query/Home/FeedPopuler";
export default function Feed(props) {
  const [active, setActive] = useState("personal");
  const[searchtext, SetSearchtext] = useState("");
  let [token, setToken] = useState("");

  const _searchHandle = (text) => {
    SetSearchtext(text)
  };
  const HeaderComponent = {
    tabBarBadge: null,
    headerShown: false,

  };
  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    // getUserAndToken();
    // const unsubscribe = navigation.addListener("focus", () => {
    //   getUserAndToken();
    // });
    // return unsubscribe;
  }, []);
  const [
    querySearchPost,
    { loading: loadingPost, data: dataPost, error: errorPost },
  ] = useLazyQuery(FeedPopuler, {
    variables: {
      limit: 40,
    },
    fetchPolicy: "network-only",
  });
  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    setToken(tkn);
    querySearchPost();
  };
  useEffect(() => {
    loadAsync();
  }, []);
  return(
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View style={{ backgroundColor: "#209FAE" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}>
            <View
              style={{
                borderWidth:1,
                margin: 15,
                backgroundColor: "#FFFFFF",
                flexDirection: "row",
                borderRadius: 3,
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <Magnifying
                width="20"
                height="20"
                style={{ marginHorizontal: 10 }}
              />
              <TextInput
                value={searchtext}
                onChangeText={(e) => _searchHandle(e)}
                placeholder="Search Feed"
                style={{
                  color: "#464646",
                  height: 40,
                  width: "80%",
                }}
              />
            </View>
            <Ripple>
              <OptionsVertWhite width={20} height={20}/>
            </Ripple>
        </View>
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#fff",
            borderWidth: 1,
            borderColor: "#EEEEEE",
            paddingHorizontal: 10,
          }}
        >
          <Ripple
            onPress={() => {
              setActive("personal");
            }}
            style={{
              // width: width / 2,
              alignContent: "center",
              alignItems: "center",
              // borderBottomWidth: active == "personal" ? 3 : 1,
              // borderBottomColor:
              //   active == "personal" ? "#209FAE" : "#EEEEEE",
              paddingVertical: 15,
              backgroundColor: "#FFFFFF",
              paddingHorizontal: 10,
            }}
          >
            <Text
              size="description"
              type={active == "personal" ? "bold" : "bold"}
              style={{
                color: active == "personal" ? "#209FAE" : "#D1D1D1",
              }}
            >
              All Post
            </Text>
          </Ripple>
          <Ripple
            onPress={() => {
              setActive("group");
            }}
            style={{
              // width: width / 2,
              alignContent: "center",
              alignItems: "center",
              // borderBottomWidth: active == "group" ? 3 : 1,
              // borderBottomColor: active == "group" ? "#209FAE" : "#EEEEEE",
              paddingVertical: 15,
              backgroundColor: "#FFFFFF",
              paddingHorizontal: 10,
            }}
          >
            <Text
              size="description"
              type={active == "group" ? "bold" : "bold"}
              style={{
                color: active == "group" ? "#209FAE" : "#D1D1D1",
              }}
            >
              Travel
            </Text>
          </Ripple>
        </View>
      </View>
      
    </SafeAreaView>
  );

}