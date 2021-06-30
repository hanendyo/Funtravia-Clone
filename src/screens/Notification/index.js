import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TextInput,
  Platform,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Text, Button, CustomImage } from "../../component";

import { gql } from "apollo-boost";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { Header, Content, Tab, Tabs, ScrollableTab } from "native-base";
import Information from "./DetailNotification/Information";
import Invitation from "./DetailNotification/Invitation";
import { TabBar, SceneMap, TabView } from "react-native-tab-view";
const ListNotifikasi_ = gql`
  query {
    list_notification {
      ids
      notification_type
      isread
      itinerary_buddy {
        id
        itinerary_id
        user_id
        isadmin
        isconfrim
        myuser {
          id
          username
          first_name
          last_name
          picture
        }
        userinvite {
          id
          username
          first_name
          last_name
          picture
        }
        accepted_at
        rejected_at
      }
      comment_feed {
        id
        post_id
        text
        user {
          id
          username
          first_name
          last_name
          picture
        }
        post {
          assets {
            filepath
          }
        }
        post_asset {
          type
          filepath
        }
        created_at
        updated_at
      }
      like_feed {
        id
        post_id
        response
        user {
          id
          username
          first_name
          last_name
          picture
        }
        post_asset {
          type
          filepath
        }
      }

      follow_user {
        user_req
        user_follow
        status
        user {
          id
          username
          first_name
          last_name
          picture
          status_following
          status_follower
        }
      }
      tgl_buat
      created_at
      updated_at
    }
  }
`;

export default function Notification(props) {
  let [token, setToken] = useState("");
  let [preview, setPreview] = useState("list");
  const HeaderComponent = {
    headerShown: true,
    transparent: false,
    tabBarVisble: false,
    headerTintColor: "white",
    headerTitle: "Inbox",
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
  };
  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    await setToken(tkn);
    await GetListNotif();
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    loadAsync();
  }, []);
  const [
    GetListNotif,
    { data: datanotif, loading: loadingnotif, error: errornotif },
  ] = useLazyQuery(ListNotifikasi_, {
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const renderLabel = ({ route, focused }) => {
    return (
      <Text
        style={[
          focused ? styles.labelActive : styles.label,
          { opacity: focused ? 1 : 0.7 },
        ]}
      >
        {route.title}
      </Text>
    );
  };

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "personal", title: "Invitation" },
    { key: "group", title: "Information" },
  ]);

  const renderScene = ({ route }) => {
    if (route.key == "personal") {
      return token ? (
        <Invitation navigation={props.navigation} token={token} />
      ) : null;
    } else if (route.key == "group") {
      return null;
      // return <Information navigation={props.navigation} />;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TabView
        lazy={true}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={(props) => {
          return (
            <TabBar
              {...props}
              style={{
                backgroundColor: "white",
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
    fontSize: 14,
    color: "#464646",
    fontFamily: "Lato-Bold",
  },
  labelActive: {
    fontSize: 14,
    color: "#209FAE",
    fontFamily: "Lato-Bold",
  },
  tab: {
    elevation: 1,
    shadowOpacity: 0.5,
    backgroundColor: "#FFF",
    height: 50,
  },
  indicator: { backgroundColor: "#209FAE", height: 3 },
});
