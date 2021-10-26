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
import { Tab, Tabs, ScrollableTab, TabHeading } from "native-base";
import Ripple from "react-native-material-ripple";

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
    headerTitle: (
      <Text size="header" style={{ color: "#fff" }}>
        {t("inbox")}
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

  const [index, setIndex] = useState(0);
  console.log("index", index);
  const GetNotif = () => {
    setIndex(0);
    return <Invitation navigation={props.navigation} token={token} />;
  };
  const GetInformation = () => {
    setIndex(1);
    return null;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tabs
        tabBarUnderlineStyle={{ backgroundColor: "#209FAE", height: 2 }}
        tab
        tabContainerStyle={{ borderWidth: 0 }}
        locked={false}
        style={{ borderColor: "#d1d1d1" }}
        renderTabBar={() => (
          <ScrollableTab style={{ backgroundColor: "#fff" }} />
        )}
      >
        <Tab
          heading={
            <TabHeading
              style={{
                width: Dimensions.get("screen").width / 2,
                backgroundColor: "#fff",
              }}
            >
              <Text
                size="title"
                type={index == 0 ? "bold" : "regular"}
                style={{ color: index == 0 ? "#209fae" : "#464646" }}
              >
                {t("notification")}
              </Text>
            </TabHeading>
          }
          tabStyle={{
            backgroundColor: "#fff",
            width: Dimensions.get("screen").width / 2,
          }}
          activeTabStyle={{
            backgroundColor: "#fff",
            width: Dimensions.get("screen").width / 2,
          }}
        >
          <GetNotif />
        </Tab>
        <Tab
          heading={
            <TabHeading
              style={{
                width: Dimensions.get("screen").width / 2,
                backgroundColor: "#fff",
                marginBottom: 5,
              }}
            >
              <Text
                size="title"
                type={index == 1 ? "bold" : "regular"}
                style={{ color: index == 1 ? "#209fae" : "#464646" }}
              >
                {t("information")}
              </Text>
            </TabHeading>
          }
          tabStyle={{
            backgroundColor: "white",
            width: Dimensions.get("screen").width / 2,
          }}
          activeTabStyle={{
            backgroundColor: "white",
            width: Dimensions.get("screen").width / 2,
          }}
        >
          {/* <GetEvent /> */}
          <GetInformation />
          {/* <Text size="title">Information</Text> */}
        </Tab>
      </Tabs>
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
