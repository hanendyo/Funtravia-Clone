import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Dimensions,
  TextInput,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  StyleSheet,
  Animated,
  FlatList,
} from "react-native";
import { Xblue, Arrowbackios, Arrowbackwhite, Search } from "../../assets/svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Button,
  Text,
  CardDestination,
  CardEvents,
  Truncate,
} from "../../component";
import { useLazyQuery, useMutation } from "@apollo/client";
import Events from "../../graphQL/Query/Wishlist/Event";
import Destinasi from "../../graphQL/Query/Wishlist/Destination";
import { useTranslation } from "react-i18next";
import { TabBar, TabView } from "react-native-tab-view";
import { useSelector } from "react-redux";
import Ripple from "react-native-material-ripple";

const TabBarHeight = Platform.OS == "ios" ? 44 : 40;

export default function Wishlist(props) {
  const _tabIndex = useRef(0);
  const { width, height } = Dimensions.get("screen");
  const tokenApps = useSelector((data) => data.token);
  const { t, i18n } = useTranslation();
  let [dataEvent, setdataEvent] = useState([]);
  let [dataDes, setdataDes] = useState([]);
  // let [setting, setSetting] = useState("");
  // const setting = useSelector((data) => data.setting);

  let [texts, setText] = useState("");
  let [tabIndex, setIndex] = useState(0);
  let scrollRef = useRef();

  const HeaderComponent = {
    headerShown: true,
    title: "Wishlist",
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: (
      <Text size="header" type="bold" style={{ color: "#fff" }}>
        Wishlist
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
        {Platform.OS == "ios" ? (
          <Arrowbackios height={15} width={15}></Arrowbackios>
        ) : (
          <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
        )}
      </Button>
    ),
  };

  const loadAsync = async () => {
    if (tokenApps) {
      getEvent();
      getDes();
    }
    // let setsetting = await AsyncStorage.getItem("setting");
    // await setSetting(JSON.parse(setsetting));
  };

  const [getEvent, { loading, data: dataEven, error }] = useLazyQuery(Events, {
    fetchPolicy: "network-only",
    variables: {
      keyword: texts !== null ? texts : "",
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenApps,
      },
    },
    onCompleted: () => {
      setdataEvent(dataEven?.listevent_wishlist);
    },
  });

  const [
    getDes,
    { loading: loadingDes, data: dataDe, error: errorDes },
  ] = useLazyQuery(Destinasi, {
    fetchPolicy: "network-only",
    variables: {
      keyword: texts,
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenApps,
      },
    },
    onCompleted: () => {
      setdataDes(dataDe?.listdetination_wishlist);
    },
  });

  const search = async (x) => {
    setText(x);
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    props.navigation.addListener("focus", () => {
      loadAsync();
    });
  }, []);

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

  const [routes] = React.useState([
    { key: "destination", title: "Destination" },
    { key: "events", title: "Events" },
  ]);

  const renderScene = ({ route }) => {
    if (route.key == "events") {
      return (
        <CardEvents
          data={dataEvent}
          props={props}
          setData={(e) => setdataEvent(e)}
          token={tokenApps}
          dataFrom="wishlist"
        />
      );
    } else if (route.key == "destination") {
      return (
        <CardDestination
          data={dataDes}
          props={props}
          setData={(e) => setdataDes(e)}
          token={tokenApps}
          dataFrom="wishlist"
        />
      );
    }
  };

  const renderTabBar = (props) => {
    // const y = scrollY.interpolate({
    //   inputRange: [0, HeaderHeight],
    //   outputRange: [HeaderHeight, 55],
    //   extrapolateRight: "clamp",
    // });
    return (
      <Animated.View
        style={{
          top: 0,
          zIndex: 1,

          position: "absolute",
          // transform: [{ translateY: y }],
          width: "100%",
        }}
      >
        <FlatList
          key={"listtabbar"}
          ref={scrollRef}
          data={props.navigationState.routes}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{
            backgroundColor: "white",
          }}
          renderItem={({ item, index }) => (
            <Ripple
              key={"tabx" + index}
              onPress={() => {
                setIndex(index);
                scrollRef.current?.scrollToIndex({
                  index: index,
                  animated: true,
                });
              }}
            >
              <View
                style={{
                  borderBottomWidth: index == tabIndex ? 2 : 1,
                  borderBottomColor: index == tabIndex ? "#209fae" : "#d1d1d1",
                  alignContent: "center",

                  width:
                    props.navigationState.routes.length <= 2
                      ? Dimensions.get("screen").width * 0.5
                      : props.navigationState.routes.length > 2
                      ? Dimensions.get("screen").width * 0.333
                      : null,
                  height: TabBarHeight,
                  alignItems: "center",
                  justifyContent: "center",
                  alignSelf: "center",
                  paddingHorizontal: Platform.OS === "ios" ? 15 : null,
                }}
              >
                <Text
                  style={[
                    index == tabIndex ? styles.labelActive : styles.label,
                    {
                      opacity: index == tabIndex ? 1 : 1,
                      borderBottomWidth: 0,
                      // borderWidth: 1,
                      marginBottom: index == tabIndex ? 0 : 1,
                      borderBottomColor:
                        index == tabIndex &&
                        props.navigationState.routes.length > 1
                          ? "#FFFFFF"
                          : "#209fae",
                      textTransform: "capitalize",
                    },
                  ]}
                >
                  <Truncate
                    text={item?.key ? item.key : ""}
                    length={Platform.OS === "ios" ? 13 : 15}
                  />
                </Text>
              </View>
            </Ripple>
          )}
        />
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{ backgroundColor: "#fff", height: 50, alignItems: "center" }}
      >
        <View
          style={{
            marginTop: 15,
            marginHorizontal: 15,
            width: Dimensions.get("screen").width - 30,
            height: 35,
            backgroundColor: "#f6f6f6",
            borderRadius: 2,
            alignItems: "center",
            flexDirection: "row",
            paddingHorizontal: 10,
            borderWidth: 1,
            borderColor: "#e8e8e8",
          }}
        >
          <Search height={15} width={15} style={{ marginRight: 5 }} />
          <TextInput
            underlineColorAndroid="transparent"
            style={{ flex: 1, marginRight: 5, padding: 0 }}
            value={texts}
            underlineColorAndroid="transparent"
            onChangeText={async (x) => {
              search(x);
            }}
            placeholder={t("search")}
            returnKeyType="search"
          />
          {texts.length !== 0 ? (
            <TouchableOpacity
              onPress={() => {
                setText("");
              }}
            >
              <Xblue
                width="20"
                height="20"
                style={{
                  alignSelf: "center",
                  // marginRight: 10,
                }}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      {/* TAB VIEW */}
      <TabView
        // onSwipeStart={() => setCanScroll(false)}
        // onSwipeEnd={() => setCanScroll(true)}
        onIndexChange={(id) => {
          _tabIndex.current = id;
          setIndex(id);
          scrollRef.current?.scrollToIndex({
            // y: 0,
            // x: 100,
            index: id,
            animated: true,
          });
        }}
        navigationState={{ index: tabIndex, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        initialLayout={{
          height: 0,
          // borderWidth: 1,
          width: width,
        }}
      />
      {/* <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setindex}
        renderTabBar={(props) => {
          return (
            <TabBar
              {...props}
              style={{
                backgroundColor: "white",
                height: 42,
                justifyContent: "center",
              }}
              renderLabel={renderLabel}
              indicatorStyle={{ backgroundColor: "#209FAE", height: 2 }}
            />
          );
        }}
      /> */}
      {/* END TAB VIEW */}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
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
});
