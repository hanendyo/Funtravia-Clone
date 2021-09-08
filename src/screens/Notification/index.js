import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  SafeAreaView,
  BackHandler,
  View,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, Button } from "../../component";
import { gql } from "apollo-boost";
import { useLazyQuery } from "@apollo/react-hooks";
import Information from "./DetailNotification/Information";
import Invitation from "./DetailNotification/Invitation";
import { TabBar, TabView } from "react-native-tab-view";
import { useTranslation } from "react-i18next";
import { Arrowbackios, Arrowbackwhite } from "../../assets/svg";

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
  const { t, i18n } = useTranslation();
  let [token, setToken] = useState("");
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
      fontSize: 18,
      color: "white",
    },
    headerLeftContainerStyle: {
      background: "#FFF",
    },
    headerLeft: () => (
      <Button
        text={""}
        size="medium"
        type="circle"
        variant="transparent"
        onPress={() => {
          props.navigation.goBack(null);
        }}
        style={{
          height: 55,
          marginLeft: 5,
        }}
      >
        {Platform.OS == "ios" ? (
          <Arrowbackios height={15} width={15}></Arrowbackios>
        ) : (
          <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
        )}
      </Button>
    ),
  };
  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    await setToken(tkn);
    await GetListNotif();
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    loadAsync();
    const backAction = () => {
      BackHandler.addEventListener(props.navigation.goBack());
      return true;
    };

    // const backHandler = BackHandler.addEventListener(
    //   "hardwareBackPress",
    //   backAction
    // );

    // return () => backHandler.remove();
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
    { key: "personal", title: "Notification" },
    { key: "group", title: "Information" },
  ]);

  const renderScene = ({ route }) => {
    if (route.key == "personal") {
      return token ? (
        <Invitation navigation={props.navigation} token={token} />
      ) : null;
    } else if (route.key == "group") {
      return token ? (
        <View>
          <Text>{""}</Text>
        </View>
      ) : null;
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
    fontSize: 16,
    color: "#000000",
    fontFamily: "Lato-Regular",
    width: Dimensions.get("screen").width * 0.5,
    textAlign: "center",
    alignSelf: "center",
  },
  labelActive: {
    fontSize: 16,
    color: "#209FAE",
    fontFamily: "Lato-Bold",
    width: Dimensions.get("screen").width * 0.5,
    textAlign: "center",
    alignSelf: "center",
  },
  tab: {
    elevation: 1,
    shadowOpacity: 0.5,
    backgroundColor: "#FFF",
    height: 45,
  },
  indicator: { backgroundColor: "#209FAE", height: 2 },
});
