import React, { useState, useCallback, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Animated,
  View,
  Dimensions,
  Image,
  ScrollView,
  FlatList,
  SafeAreaView,
  PanResponder,
  ActivityIndicator,
  StatusBar,
  StyleSheet,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useLazyQuery } from "@apollo/client";
import PracticalCountries from "../../../graphQL/Query/Countries/PracticalCountries";
import { TabBar, TabView } from "react-native-tab-view";
import { Button, Text } from "../../../component";
import { Arrowbackwhite } from "../../../assets/svg";
import Ripple from "react-native-material-ripple";

const AnimatedIndicator = Animated.createAnimatedComponent(ActivityIndicator);
const { width, height } = Dimensions.get("screen");
const TabBarHeight = 48;
const HeaderHeight = 300;
const SafeStatusBar = Platform.select({
  ios: 44,
  android: StatusBar.currentHeight,
});

export default function PracticalInformation(props) {
  let [token, setToken] = useState("");
  const [loadings, setloadings] = useState(true);
  const [tabIndex, setIndex] = useState(props.route.params.indexcountry);
  const [routes, setRoutes] = useState([0]);
  const [tabData] = useState(Array(1).fill(0));
  const [tabData1] = useState(Array(1).fill(0));
  const listRefArr = useRef([]);
  const listOffset = useRef({});
  const _tabIndex = useRef(0);
  const isListGliding = useRef(false);
  let scrollRef = useRef();

  const [canScroll, setCanScroll] = useState(true);
  const headerScrollY = useRef(new Animated.Value(0)).current;

  const scrollY = useRef(new Animated.Value(0)).current;

  const HeaderComponent = {
    headerShown: true,
    title: "Practical Information",
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: "Essentials - Practical Information",
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
  const [actives, setActives] = useState(props.route.params.active);
  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToIndex({
        index: props.route.params.indexcountry,
        animated: true,
      });
    }, 3000);
    refresh();
  }, []);

  const refresh = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    await setToken(tkn);
    await getPracticalDetail();
    await setloadings(false);
  };

  const [getPracticalDetail, { loading, data, error }] = useLazyQuery(
    PracticalCountries,
    {
      fetchPolicy: "network-only",
      variables: {
        id: props.route.params.country_id,
      },
      context: {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
      onCompleted: () => {
        let tab = [];

        data.list_practical_article_country.map((item, index) => {
          tab.push({ key: item.id, title: item.name });
        });

        setRoutes(tab);
        setIndex(props.route.params.indexcountry);
      },
    }
  );

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

  let practical = [];
  if (data && data.list_practical_article_country) {
    practical = data.list_practical_article_country;
  }

  // console.log("Practical", practical);

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
  }, []);

  const RenderUtama = ({ aktif, render }) => {
    return (
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{
            backgroundColor: "#DAF0F2",
            width: "100%",
          }}
          contentContainerStyle={{
            paddingHorizontal: 10,
          }}
        >
          {render.length > 0 &&
            render.map((item, index) => (
              <Ripple
                onPress={() => {
                  setActives(item.id);
                }}
                style={{
                  // width: '33.333%',
                  paddingHorizontal: 10,
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  size="description"
                  type={actives == item.id ? "bold" : "regular"}
                  style={{
                    paddingVertical: 15,
                    borderBottomWidth: actives == item.id ? 3 : 1,
                    borderBottomColor:
                      actives == item.id ? "#14646E" : "#DAF0F2",
                    color: actives == item.id ? "#14646E" : "#464646",
                  }}
                >
                  {item.name}
                </Text>
              </Ripple>
            ))}
        </ScrollView>
      </View>
    );
  };
  const Rendercontent = ({ active, practical }) => {
    let index = practical.findIndex((k) => k["id"] === actives);
    let datas = practical ? practical[index] : null;

    return (
      <View style={{ padding: 20 }}>
        {datas && datas.information_article_detail.length
          ? datas.information_article_detail.map((i, index) => {
              return (
                <View key={index}>
                  {i.type === "image" ? (
                    <View>
                      {i.title ? (
                        <Text
                          size="label"
                          type="bold"
                          style={{
                            marginBottom: 5,
                          }}
                        >
                          {i.title}
                        </Text>
                      ) : null}
                      <Text
                        size="description"
                        type="regular"
                        style={{
                          textAlign: "justify",
                          lineHeight: 21,
                          color: "#464646",
                        }}
                      >
                        {i.text ? i.text : ""}
                      </Text>
                      <View style={{ alignItems: "center" }}>
                        <Image
                          source={i.image ? { uri: i.image } : default_image}
                          resizeMode={"cover"}
                          style={{
                            borderWidth: 0.4,
                            borderColor: "#d3d3d3",
                            marginVertical: 10,
                            height: Dimensions.get("screen").width * 0.8,
                            width: "100%",
                          }}
                        />
                      </View>
                    </View>
                  ) : (
                    <View>
                      {i.title ? (
                        <Text
                          size="label"
                          type="bold"
                          style={{
                            marginBottom: 10,

                            // marginVertical: 10,

                            color: "#464646",
                          }}
                        >
                          {i.title}
                        </Text>
                      ) : null}
                      <Text
                        size="description"
                        type="regular"
                        style={{
                          lineHeight: 21,
                          textAlign: "justify",
                          // fontFamily: "Lato-Regular",
                          // fontSize: 13,
                          color: "#464646",
                        }}
                      >
                        {i.text ? i.text : ""}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })
          : null}
      </View>
    );
  };

  const renderScene = ({ route }) => {
    const focused = route.key === routes[tabIndex];
    let numCols;
    let data;
    let renderItem;

    switch (route.key) {
      case actives:
        // numCols = 2;
        data = tabData;
        renderItem = renderIsi;
        break;
      default:
        data = tabData1;
        renderItem = renderIsiLain;
    }
    return (
      <Animated.FlatList
        scrollToOverflowEnabled={true}
        {...listPanResponder.panHandlers}
        ref={(ref) => {
          if (ref) {
            const found = listRefArr.current.find((e) => e.key === route.key);
            if (!found) {
              listRefArr.current.push({
                key: route.key,
                value: ref,
              });
            }
          }
        }}
        scrollEventThrottle={16}
        onScroll={
          focused
            ? Animated.event(
                [
                  {
                    nativeEvent: { contentOffset: { y: scrollY } },
                  },
                ],
                { useNativeDriver: true }
              )
            : null
        }
        contentContainerStyle={{
          paddingTop: TabBarHeight,
        }}
        data={data}
        renderItem={renderItem}
      />
    );
  };
  const renderIsiLain = () => {
    let index = tabIndex;
    let datas = practical ? practical[index] : null;
    return (
      <View style={{ padding: 20 }}>
        {datas && datas.information_article_detail.length
          ? datas.information_article_detail.map((i, index) => {
              return (
                <View key={index}>
                  {i.type === "image" ? (
                    <View>
                      {i.title ? (
                        <Text
                          size="readable"
                          type="bold"
                          style={{
                            marginBottom: 5,
                            textAlign: "justify",
                          }}
                        >
                          {i.title}
                        </Text>
                      ) : null}

                      <View style={{ alignItems: "center" }}>
                        <Image
                          source={i.image ? { uri: i.image } : default_image}
                          resizeMode={"cover"}
                          style={{
                            borderWidth: 0.4,
                            borderColor: "#d3d3d3",
                            marginVertical: 10,
                            height: Dimensions.get("screen").width * 0.8,
                            width: "100%",
                          }}
                        />
                      </View>
                      <Text
                        size="readable"
                        type="regular"
                        style={{
                          textAlign: "justify",
                          lineHeight: 20,
                          color: "#464646",
                        }}
                      >
                        {i.text ? i.text : ""}
                      </Text>
                    </View>
                  ) : (
                    <View>
                      {i.title ? (
                        <Text
                          size="readable"
                          type="bold"
                          style={{
                            // marginBottom: 5,
                            textAlign: "justify",
                            // marginVertical: 10,

                            color: "#464646",
                          }}
                        >
                          {i.title}
                        </Text>
                      ) : null}
                      <Text
                        size="readable"
                        type="regular"
                        style={{
                          lineHeight: 20,
                          textAlign: "justify",
                          color: "#464646",
                        }}
                      >
                        {i.text ? i.text : ""}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })
          : null}
      </View>
    );
  };
  const renderIsi = () => {
    let index = practical.findIndex((k) => k["id"] === actives);
    let datas = practical ? practical[index] : null;

    return (
      <View style={{ padding: 20 }}>
        {datas && datas.information_article_detail.length
          ? datas.information_article_detail.map((i, index) => {
              return (
                <View key={index}>
                  {i.type === "image" ? (
                    <View>
                      {i.title ? (
                        <Text
                          size="label"
                          type="bold"
                          style={{
                            marginBottom: 5,
                          }}
                        >
                          {i.title}
                        </Text>
                      ) : null}

                      <View style={{ alignItems: "center" }}>
                        <Image
                          source={i.image ? { uri: i.image } : default_image}
                          resizeMode={"cover"}
                          style={{
                            borderWidth: 0.4,
                            borderColor: "#d3d3d3",
                            marginVertical: 10,
                            height: Dimensions.get("screen").width * 0.8,
                            width: "100%",
                          }}
                        />
                      </View>
                      <Text
                        size="description"
                        type="regular"
                        style={{
                          textAlign: "justify",
                          lineHeight: 21,
                          color: "#464646",
                        }}
                      >
                        {i.text ? i.text : ""}
                      </Text>
                    </View>
                  ) : (
                    <View>
                      {i.title ? (
                        <Text
                          size="label"
                          type="bold"
                          style={{
                            marginBottom: 10,

                            // marginVertical: 10,

                            color: "#464646",
                          }}
                        >
                          {i.title}
                        </Text>
                      ) : null}
                      <Text
                        size="description"
                        type="regular"
                        style={{
                          lineHeight: 21,
                          textAlign: "justify",
                          // fontFamily: "Lato-Regular",
                          // fontSize: 13,
                          color: "#464646",
                        }}
                      >
                        {i.text ? i.text : ""}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })
          : null}
      </View>
    );
  };
  const renderTabBar = (props) => {
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
            backgroundColor: "#DAF0F2",
            borderBottomWidth: 0.5,
          }}
          renderItem={({ item, index }) => (
            <Ripple
              onPress={() => {
                setIndex(index);
                scrollRef.current?.scrollToIndex({
                  // y: 0,
                  // x: 100,
                  index: index,
                  animated: true,
                });
              }}
            >
              <View
                style={{
                  borderBottomWidth: 2,
                  borderBottomColor: index == tabIndex ? "#209fae" : "#DAF0F2",
                  alignContent: "center",
                  paddingHorizontal: 15,
                  width:
                    props.navigationState.routes.length < 2
                      ? Dimensions.get("screen").width
                      : props.navigationState.routes.length < 3
                      ? Dimensions.get("screen").width * 0.5
                      : props.navigationState.routes.length < 4
                      ? Dimensions.get("screen").width * 0.33
                      : null,
                  height: TabBarHeight,
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <Text
                  style={[
                    index == tabIndex ? styles.labelActive : styles.label,
                    {
                      opacity: index == tabIndex ? 1 : 0.7,
                      height: 38,
                      paddingTop: 2,
                      textTransform: "capitalize",
                    },
                  ]}
                >
                  {item.title}
                </Text>
              </View>
            </Ripple>
          )}
        />
        {/* <ScrollView
          horizontal={true}
          style={{
            width: "100%",
            backgroundColor: "#DAF0F2",
          }}
          // contentContainerStyle={{
          //   width:"100%"
          // }}
          showsHorizontalScrollIndicator={false}
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
              flex: 1,
              backgroundColor: "#DAF0F2",
              width: "100%",
              height: TabBarHeight,
              // borderBottomWidth: 1,
              // borderBottomColor: "#daf0f2",
            }}
            renderLabel={renderLabel}
            indicatorStyle={styles.indicator}
          />
        </ScrollView> */}
      </Animated.View>
    );
  };

  const renderLabel = ({ route, focused }) => {
    return (
      <View
        style={{
          borderBottomWidth: 2,
          borderBottomColor: focused ? "#209fae" : "#DAF0F2",
          alignContent: "center",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <Text
          style={[
            focused ? styles.labelActive : styles.label,
            { opacity: focused ? 1 : 0.7, height: 33 },
          ]}
        >
          {route.title}
        </Text>
      </View>
    );
  };

  const renderTabView = () => {
    return (
      <TabView
        onSwipeStart={() => setCanScroll(false)}
        onSwipeEnd={() => setCanScroll(true)}
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
          width: Dimensions.get("screen").width,
        }}
      />
    );
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      {renderTabView()}
      {/* <ScrollView
        nestedScrollEnabled={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
        // scrol
        style={
          {
            // marginTop: 10,
            // borderWidth: 1,
            // borderColor: 'red',
            // paddingHorizontal: 20,
          }
        }
        contentContainerStyle={
          {
            // paddingHorizontal: 20,
          }
        }
      >
        <RenderUtama aktif={actives} render={practical} />

        <Rendercontent active={actives} practical={practical} />
      </ScrollView> */}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  indicator: { backgroundColor: "#209FAE", height: 0 },
  label: { fontSize: 14, color: "#464646", fontFamily: "Lato-Bold" },
  labelActive: { fontSize: 14, color: "#209FAE", fontFamily: "Lato-Bold" },
});
