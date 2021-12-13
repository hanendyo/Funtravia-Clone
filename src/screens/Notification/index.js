import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  SafeAreaView,
  BackHandler,
  View,
  Dimensions,
  Animated,
  PanResponder,
  Platform,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, Button } from "../../component";
import { gql } from "apollo-boost";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import Information from "./DetailNotification/Information";
import Invitation from "./DetailNotification/Invitation";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { useTranslation } from "react-i18next";
import { Arrowbackios, Arrowbackwhite } from "../../assets/svg";
import { Tab, Tabs, ScrollableTab, TabHeading } from "native-base";
import Ripple from "react-native-material-ripple";
import DeviceInfo from "react-native-device-info";

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
  let HeaderHeight = Dimensions.get("screen").height * 0.15;
  let [heightview, setheight] = useState(0);
  let [datanotif, SetDataNotif] = useState([]);

  let [readall, setreadall] = useState(true);

  const [canScroll, setCanScroll] = useState(true);
  const _tabIndex = useRef(0);
  const [tabIndex, setTabIndex] = useState(0);
  const [routes] = useState([
    { key: "tab1", title: t("notification") },
    { key: "tab2", title: t("information") },
  ]);
  const [index, setIndex] = useState(0);
  const isListGliding = useRef(false);
  const TabBarHeight = 45;
  const headerScrollY = useRef(new Animated.Value(0)).current;
  const listRefArr = useRef([]);
  const scrollY = useRef(new Animated.Value(0)).current;
  const { width, height } = Dimensions.get("screen");
  const SafeStatusBar = Platform.select({
    ios: Notch ? 48 : 20,
    android: StatusBar.currentHeight,
  });
  const refreshStatusRef = useRef(false);
  const PullToRefreshDist = 150;
  const Notch = DeviceInfo.hasNotch();
  const listOffset = useRef({});

  const refresh = async () => {
    refreshStatusRef.current = true;
    await loadAsync();
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("done");
      }, 2000);
    }).then((value) => {
      refreshStatusRef.current = false;
    });
  };

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
    setToken(tkn);
    // GetListInvitation();
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    loadAsync();
    // GetListNotif();
  }, [token]);

  const {
    data: datasnotif,
    loading: loadingnotif,
    error: errornotif,
  } = useQuery(ListNotifikasi_, {
    options: {
      fetchPolicy: "network-only",
      errorPolicy: "ignore",
    },
    notifyOnNetworkStatusChange: true,
    pollInterval: 5000,
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    onCompleted: () => {
      SetDataNotif(datasnotif.list_notification);
      let status = 0;
      for (var x of datasnotif.list_notification) {
        if (x.isread === false) {
          status = 1;
        }
      }
      if (status === 1) {
        setreadall(true);
      } else {
        setreadall(false);
      }
    },
  });

  const renderScene = ({ route }) => {
    if (route.key == "tab1") {
      return (
        <Invitation
          navigation={props.navigation}
          token={token}
          readall={readall}
          setreadall={(e) => setreadall(e)}
          datanotif={datanotif}
          SetDataNotif={(e) => SetDataNotif(e)}
          // GetListInvitation={() => GetListInvitation()}
        />
      );
    } else if (route.key == "tab2") {
      return <Invitation navigation={props.navigation} token={token} />;
    }
  };

  const renderLabel = ({ route, focused }) => {
    return (
      <Text
        style={[
          focused ? styles.labelActive : styles.label,
          { opacity: focused ? 1 : 1, height: "100%", marginBottom: 2 },
        ]}
      >
        {route.title}
      </Text>
    );
  };
  return (
    <View style={{ flex: 1 }}>
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
                height: 42,
                justifyContent: "center",
                // alignItems: "center",
                // borderTopLeftRadius: searchAktif ? 0 : 15,
                // borderTopRightRadius: searchAktif ? 0 : 15,
              }}
              renderLabel={renderLabel}
              indicatorStyle={styles.indicator}
            />
          );
        }}
      />
    </View>
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
    fontSize: Platform.OS == "ios" ? 18 : 16,
    color: "#464646",
    fontFamily: "Lato-Bold",
  },
  labelActive: {
    fontSize: Platform.OS == "ios" ? 18 : 16,
    color: "#209FAE",
    fontFamily: "Lato-Bold",
  },
  tab: {
    elevation: 1,
    shadowOpacity: 0.5,
    backgroundColor: "#FFF",
    height: 40,
  },
  indicator: { backgroundColor: "#209FAE", height: 2 },
});
