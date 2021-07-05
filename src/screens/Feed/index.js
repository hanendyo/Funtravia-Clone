import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  Text,
  Alert,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CustomImage, shareAction } from "../../component";
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
} from "../../assets/svg";
import { gql } from "apollo-boost";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import AutoHeightImage from "react-native-auto-height-image";
import likepost from "../../graphQL/Mutation/Post/likepost";
import FeedPost from "../../graphQL/Query/Feed/FeedPost";
import FeedList from "./FeedList";
import { useTranslation } from "react-i18next";
import { RNToasty } from "react-native-toasty";

export default function Feed(props) {
  const { t } = useTranslation();
  const HeaderComponent = {
    headerShown: true,
    transparent: false,
    tabBarVisble: false,
    tabBarLabel: "Feed",
    headerTintColor: "white",
    headerTitle: "Fun Feed",
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

  // const GetFeedPost = gql`
  // 	query($offset: Int) {
  // 		feed_post(limit: 5, offset:$offset) {
  // 			id
  // 			caption
  // 			longitude
  // 			latitude
  // 			location_name
  // 			liked
  // 			comment_count
  // 			response_count
  // 			created_at
  // 			updated_at
  // 			assets {
  // 				id
  // 				type
  // 				filepath
  // 			}
  // 			user {
  // 				id
  // 				username
  // 				first_name
  // 				last_name
  // 				picture
  // 				ismyfeed
  // 			}
  // 		}
  // 	}
  // `;

  const [token, setToken] = useState();
  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    await setToken(tkn);
    // if (tkn == null) {
    //   props.navigation.navigate("AuthStack", {
    //     screen: "LoginScreen",
    //   });
    //   RNToasty.Show({
    //     title: t("pleaselogin"),
    //     position: "bottom",
    //   });
    // }
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);

    const unsubscribe = props.navigation.addListener("focus", (data) => {
      loadAsync();
    });
    return unsubscribe;
  }, [props.navigation]);

  const createPost = () => {
    if (token && token !== null && token !== "") {
      props.navigation.navigate("FeedStack", {
        screen: "Post",
      });
    } else {
      props.navigation.navigate("AuthStack", {
        screen: "LoginScreen",
      });
      RNToasty.Show({
        title: t("pleaselogin"),
        position: "bottom",
      });
    }
  };

  if (token !== "hshs") {
    return (
      <View style={{ flex: 1, backgroundColor: "#F6F6F6" }}>
        <FeedList props={props} token={token} />
        <Pressable style={styles.fab} onPress={createPost}>
          <PostButton height={50} width={50} />
        </Pressable>
      </View>
    );
  }
  if (token && token !== null && token !== "") {
    return (
      <View style={{ flex: 1, backgroundColor: "#F6F6F6" }}>
        {token ? (
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
