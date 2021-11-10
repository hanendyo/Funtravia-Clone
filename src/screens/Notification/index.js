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
import { useLazyQuery } from "@apollo/react-hooks";
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
  console.log(`PROPS NOTIF: `, props);
  console.log(`STORAGE: `, AsyncStorage);
  const { t, i18n } = useTranslation();
  let [token, setToken] = useState("");
  let HeaderHeight = Dimensions.get("screen").height * 0.15;
  let [heightview, setheight] = useState(0);

  const [canScroll, setCanScroll] = useState(true);
  const _tabIndex = useRef(0);
  const [tabIndex, setTabIndex] = useState(0);
  const [routes] = useState([
    { key: "tab1", title: t("notification") },
    { key: "tab2", title: t("information") },
  ]);
  const isListGliding = useRef(false);
  const TabBarHeight = 43;
  const [dataNotification, setDataNotification] = useState([]);
  const [dataInformation, setDataInformation] = useState([]);
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
  let [y, sety] = useState(0);
  let [gerakan, setgerakan] = useState(new Animated.Value(0));

  const syncScrollOffset = () => {
    const curRouteKey = routes[_tabIndex.current].key;

    listRefArr.current.forEach((item) => {
      if (item.key !== curRouteKey) {
        if (scrollY._value < HeaderHeight && scrollY._value >= 0) {
          if (item.value) {
            item.value.scrollToOffset({
              offset: scrollY._value,
              animated: false,
            });
            listOffset.current[item.key] = scrollY._value;
          }
        } else if (scrollY._value >= HeaderHeight) {
          if (
            listOffset.current[item.key] < HeaderHeight ||
            listOffset.current[item.key] == null
          ) {
            if (item.value) {
              item.value.scrollToOffset({
                offset: HeaderHeight,
                animated: false,
              });
              listOffset.current[item.key] = HeaderHeight;
            }
          }
        }
      }
    });
  };

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

  const startRefreshAction = () => {
    if (Platform.OS === "ios") {
      listRefArr.current.forEach((listRef) => {
        listRef.value.scrollToOffset({
          offset: -50,
          animated: true,
        });
      });
      refresh().finally(() => {
        syncScrollOffset();
        if (scrollY._value < 0) {
          listRefArr.current.forEach((listRef) => {
            listRef.value.scrollToOffset({
              offset: 0,
              animated: true,
            });
          });
        }
      });
    } else if (Platform.OS === "android") {
      Animated.timing(headerMoveScrollY, {
        toValue: -150,
        duration: 300,
        useNativeDriver: true,
      }).start();
      refresh().finally(() => {
        Animated.timing(headerMoveScrollY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }
  };

  const onMomentumScrollBegin = (e) => {
    isListGliding.current = true;
  };

  const onMomentumScrollEnd = () => {
    isListGliding.current = false;
    syncScrollOffset();
  };

  const listPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,
      onStartShouldSetPanResponder: (evt, gestureState) => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        headerScrollY.stopAnimation();
        return false;
      },
      onShouldBlockNativeResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        headerScrollY.stopAnimation();
      },
    })
  ).current;

  const onScrollEndDrag = (e) => {
    const positionX = e.nativeEvent.contentOffset.x;
    const positionY = e.nativeEvent.contentOffset.y;
    if (positionY < y) {
      sety(positionY);
      Animated.timing(gerakan, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else if (positionY > y) {
      sety(positionY);
      Animated.timing(gerakan, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }

    syncScrollOffset();

    const offsetY = e.nativeEvent.contentOffset.y;
    if (Platform.OS === "ios") {
      if (offsetY < -PullToRefreshDist && !refreshStatusRef.current) {
        startRefreshAction();
      }
    }
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
    await setToken(tkn);
    await GetListNotif();
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    loadAsync();
    // GetListNotif();
  }, [datanotif]);

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
    onCompleted: () => {
      setDataNotification(datanotif.list_notification);
    },
  });

  // const [index, setIndex] = useState(0);

  // const GetNotif = () => {
  //   setIndex(0);
  //   return <Invitation navigation={props.navigation} token={token} />;
  // };
  // const GetInformation = () => {
  //   setIndex(1);
  //   return null;
  // };

  const renderNotif = () => {
    return <Invitation navigation={props.navigation} token={token} />;
  };

  const renderInfo = () => {
    return null;
  };

  const renderTabBar = (props) => {
    return (
      <Animated.View
        style={{
          top: 5,
          zIndex: 1,
          position: "absolute",
          width: "100%",
          borderBottomWidth: 2,
          borderBottomColor: "#d1d1d1",
        }}
      >
        <TabBar
          {...props}
          onTabPress={({ route, preventDefault }) => {
            if (isListGliding.current) {
              preventDefault();
            }
          }}
          style={{
            elevation: 0,
            shadowOpacity: 0,
            backgroundColor: "#fff",
            height: TabBarHeight + 5,
            // borderWidth: 1,
            // paddingTop: 0,
            marginTop: Platform.OS === "ios" ? -5 : -10,
          }}
          renderLabel={({ route, focused }) => (
            <Text
              size="label"
              type="bold"
              style={[
                focused ? styles.labelActive : styles.label,
                {
                  opacity: focused ? 1 : 0.8,
                },
              ]}
            >
              {route.title}
            </Text>
          )}
          indicatorStyle={{ backgroundColor: "#209fae" }}
        />
      </Animated.View>
    );
  };

  const renderScene = SceneMap({
    tab1: renderNotif,
    tab2: renderInfo,
  });

  // const renderScene = ({ route }) => {
  //   const focused = route.key === routes[tabIndex].key;
  //   let numCols;
  //   let data;
  //   let renderItem;
  //   switch (route.key) {
  //     case "tab1":
  //       numCols = 2;
  //       data = dataNotification;
  //       renderItem = (e) => {
  //         // GetNotif();
  //         return <Invitation navigation={props.navigation} token={token} />;
  //       };
  //       break;
  //     case "tab2":
  //       numCols = 2;
  //       // data = dataEvent;
  //       data = dataInformation;
  //       renderItem = (e) => {
  //         // rederTab1Item(e, "information")
  //         null;
  //       };
  //       break;
  //     default:
  //       return null;
  //   }
  //   return (
  //     <Animated.FlatList
  //       scrollToOverflowEnabled={true}
  //       // scrollEnabled={canScroll}
  //       {...listPanResponder.panHandlers}
  //       numColumns={numCols}
  //       ref={(ref) => {
  //         if (ref) {
  //           const found = listRefArr.current.find((e) => e.key === route.key);
  //           if (!found) {
  //             listRefArr.current.push({
  //               key: route.key,
  //               value: ref,
  //             });
  //           }
  //         }
  //       }}
  //       scrollEventThrottle={16}
  //       onScroll={
  //         focused
  //           ? Animated.event(
  //               [
  //                 {
  //                   nativeEvent: {
  //                     contentOffset: { y: scrollY },
  //                   },
  //                 },
  //               ],
  //               { useNativeDriver: true }
  //             )
  //           : null
  //       }
  //       onMomentumScrollBegin={(e) => onMomentumScrollBegin(e)}
  //       onScrollEndDrag={(e) => onScrollEndDrag(e)}
  //       onMomentumScrollEnd={onMomentumScrollEnd}
  //       ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
  //       ListHeaderComponent={() => <View style={{ height: 10 }} />}
  //       contentContainerStyle={{
  //         paddingTop: Platform.OS === "ios" ? 90 : 85,
  //         paddingHorizontal: 10,
  //         minHeight: height - SafeStatusBar + HeaderHeight + heightview,
  //       }}
  //       showsHorizontalScrollIndicator={false}
  //       data={data}
  //       renderItem={renderItem}
  //       showsVerticalScrollIndicator={false}
  //       keyExtractor={(item, index) => index.toString()}
  //     />
  //   );
  // };

  return (
    <View style={{ flex: 1 }}>
      <TabView
        onSwipeStart={() => setCanScroll(false)}
        onSwipeEnd={() => setCanScroll(true)}
        onIndexChange={(id) => {
          _tabIndex.current = id;
          setTabIndex(id);
        }}
        navigationState={{ index: tabIndex, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        initialLayout={{
          height: 0,
          width: width,
        }}
      />
    </View>
  );

  // return (
  //   <SafeAreaView style={{ flex: 1 }}>
  //     <Tabs
  //       tabBarUnderlineStyle={{ backgroundColor: "#209FAE", height: 2 }}
  //       tab
  //       tabContainerStyle={{ borderWidth: 0 }}
  //       locked={false}
  //       style={{ borderColor: "#d1d1d1" }}
  //       renderTabBar={() => (
  //         <ScrollableTab style={{ backgroundColor: "#fff" }} />
  //       )}
  //     >
  //       <Tab
  //         heading={
  //           <TabHeading
  //             style={{
  //               width: Dimensions.get("screen").width / 2,
  //               backgroundColor: "#fff",
  //             }}
  //           >
  //             <Text
  //               size="title"
  //               type={index == 0 ? "bold" : "regular"}
  //               style={{ color: index == 0 ? "#209fae" : "#464646" }}
  //             >
  //               {t("notification")}
  //             </Text>
  //           </TabHeading>
  //         }
  //         tabStyle={{
  //           backgroundColor: "#fff",
  //           width: Dimensions.get("screen").width / 2,
  //         }}
  //         activeTabStyle={{
  //           backgroundColor: "#fff",
  //           width: Dimensions.get("screen").width / 2,
  //         }}
  //       >
  //         <GetNotif />
  //       </Tab>
  //       <Tab
  //         heading={
  //           <TabHeading
  //             style={{
  //               width: Dimensions.get("screen").width / 2,
  //               backgroundColor: "#fff",
  //               marginBottom: 5,
  //             }}
  //           >
  //             <Text
  //               size="title"
  //               type={index == 1 ? "bold" : "regular"}
  //               style={{ color: index == 1 ? "#209fae" : "#464646" }}
  //             >
  //               {t("information")}
  //             </Text>
  //           </TabHeading>
  //         }
  //         tabStyle={{
  //           backgroundColor: "white",
  //           width: Dimensions.get("screen").width / 2,
  //         }}
  //         activeTabStyle={{
  //           backgroundColor: "white",
  //           width: Dimensions.get("screen").width / 2,
  //         }}
  //       >
  //         {/* <GetEvent /> */}
  //         <GetInformation />
  //         {/* <Text size="title">Information</Text> */}
  //       </Tab>
  //     </Tabs>
  //   </SafeAreaView>
  // );
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
