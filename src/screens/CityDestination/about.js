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
  Platform,
} from "react-native";
import {
  Arrowbackwhite,
  Garuda,
  Calendargreen,
  Arrowbackios,
} from "../../assets/svg";
import { default_image } from "../../assets/png";
import { useTranslation } from "react-i18next";
import { Text, Button, FunImage, Truncate } from "../../component";
import Ripple from "react-native-material-ripple";
import { useLazyQuery } from "@apollo/client";
import About from "../../graphQL/Query/Cities/About";
import { TabView, TabBar } from "react-native-tab-view";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const AnimatedIndicator = Animated.createAnimatedComponent(ActivityIndicator);
const { width, height } = Dimensions.get("screen");
const TabBarHeight = 40;
const HeaderHeight = 300;
const SafeStatusBar = Platform.select({
  ios: 44,
  android: StatusBar.currentHeight,
});

export default function about(props) {
  let [token, setToken] = useState("");
  const [loadings, setloadings] = useState(true);
  const [tabIndex, setIndex] = useState(0);
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
  const { t, i18n } = useTranslation();

  const HeaderComponent = {
    headerShown: true,
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: (
      <Text size="header" style={{ color: "#fff" }}>{`${t("essentials")} - ${t(
        "about"
      )}`}</Text>
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

  let [load, setLoad] = useState(true);
  const [actives, setActives] = useState(props.route.params.active);

  useEffect(() => {
    // setIndex(props.route.params.indexcity);
    setTimeout(() => {
      scrollRef.current?.scrollToIndex({
        index: props.route.params.indexcity,
        animated: true,
      });
    }, 3000);
    refresh();
  }, []);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setLoad(false);
  //   }, 1000);
  // }, []);

  const refresh = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    await setToken(tkn);
    await getAboutDetail();
    await setloadings(false);
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

  const [getAboutDetail, { loading, data, error }] = useLazyQuery(About, {
    fetchPolicy: "network-only",
    variables: {
      id: props.route.params.city_id,
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : null,
      },
    },
    onCompleted: () => {
      let tab = [];

      data.list_about_article_city.map((item, index) => {
        tab.push({ key: item.id, title: item.name });
      });

      setRoutes(tab);
      setIndex(props.route.params.indexcity);
    },
  });
  let about = [];
  if (data && data.list_about_article_city) {
    about = data.list_about_article_city;
  }

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
  }, []);

  // renderScene
  const renderScene = ({ route }) => {
    const focused = route.key === routes[tabIndex];

    let numCols;
    let data;
    let renderItem;

    switch (route.key) {
      case actives:
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
        // numColumns={numCols}
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
          paddingHorizontal: 15,
        }}
        data={data}
        renderItem={renderItem}
      />
    );
  };
  const renderIsiLain = () => {
    let index = tabIndex;
    let datas = about ? about[index] : null;
    return (
      <View
        style={{
          paddingVertical: 15,
        }}
      >
        {datas && datas.information_article_detail.length ? (
          datas.information_article_detail.map((i, index) => {
            if (!i) {
              <View key={"content" + index} style={{ alignItems: "center" }}>
                <Text
                  type="regular"
                  size="title"
                  style={{
                    textAlign: "justify",
                    color: "#464646",
                  }}
                >
                  {t("noArticle")}
                </Text>
              </View>;
            } else {
              return (
                <View key={index}>
                  {i.type === "image" ? (
                    <View>
                      {i.title ? (
                        <Text
                          size="title"
                          type="bold"
                          style={{
                            marginBottom: 5,
                            paddingHorizontal: 5,
                          }}
                        >
                          {i.title}
                        </Text>
                      ) : null}

                      <View
                        style={{
                          alignItems: "center",
                        }}
                      >
                        <FunImage
                          source={i.image ? { uri: i.image } : default_image}
                          resizeMode={"cover"}
                          style={{
                            borderWidth: 0.4,
                            marginTop: i.title ? 5 : 0,
                            borderColor: "#d3d3d3",
                            height: Dimensions.get("screen").width * 0.4,
                            width: "100%",
                          }}
                        />
                      </View>
                      <Text
                        size="description"
                        type="light"
                        style={{
                          textAlign: "left",
                          marginTop: 5,
                          marginBottom: 15,
                          color: "#616161",
                          paddingHorizontal: 5,
                        }}
                      >
                        {i.text ? i.text : ""}
                      </Text>
                    </View>
                  ) : (
                    <View>
                      {i.title ? (
                        <Text
                          size="title"
                          type="bold"
                          style={{
                            marginBottom: 5,
                            paddingHorizontal: 5,

                            color: "#464646",
                          }}
                        >
                          {i.title}
                        </Text>
                      ) : null}
                      <Text
                        size="title"
                        type="regular"
                        style={{
                          lineHeight: 22,
                          textAlign: "left",
                          color: "#464646",
                          marginBottom: 15,

                          paddingHorizontal: 5,
                        }}
                      >
                        {i.text ? i.text : ""}
                      </Text>
                    </View>
                  )}
                </View>
              );
            }
          })
        ) : (
          <View style={{ alignItems: "center" }}>
            <Text
              type="regular"
              size="title"
              style={{
                textAlign: "justify",
                color: "#464646",
              }}
            >
              {t("noArticle")}
            </Text>
          </View>
        )}
      </View>
    );
  };

  // console.log("TabIndex", tabIndex);

  const renderIsi = () => {
    let index = about.findIndex((k) => k["id"] === actives);
    let datas = about ? about[index] : null;

    return (
      <View
        style={{
          paddingVertical: 15,
        }}
      >
        {datas && datas.information_article_detail.length
          ? datas.information_article_detail.map((i, index) => {
              if (!i) {
                <View key={"content" + index} style={{ alignItems: "center" }}>
                  <Text
                    type="regular"
                    size="title"
                    style={{
                      textAlign: "justify",
                      color: "#464646",
                    }}
                  >
                    {t("noArticle")}
                  </Text>
                </View>;
              } else {
                return (
                  <View key={index}>
                    {i.type === "image" ? (
                      <View>
                        {i.title ? (
                          <Text
                            size="title"
                            type="bold"
                            style={{
                              marginBottom: 5,

                              paddingHorizontal: 5,
                            }}
                          >
                            {i.title}
                          </Text>
                        ) : null}

                        <View
                          style={{
                            alignItems: "center",
                          }}
                        >
                          <FunImage
                            source={i.image ? { uri: i.image } : default_image}
                            resizeMode={"cover"}
                            style={{
                              borderWidth: 0.4,
                              marginTop: i.title ? 5 : 0,
                              borderColor: "#d3d3d3",
                              height: Dimensions.get("screen").width * 0.4,
                              width: "100%",
                              borderWidth: 1,
                            }}
                          />
                        </View>
                        <Text
                          size="description"
                          type="light"
                          style={{
                            textAlign: "left",
                            marginTop: 5,
                            marginBottom: 15,
                            color: "#616161",
                            paddingHorizontal: 5,
                          }}
                        >
                          {i.text ? i.text : ""}
                        </Text>
                      </View>
                    ) : (
                      <View>
                        {i.title ? (
                          <Text
                            size="title"
                            type="bold"
                            style={{
                              marginBottom: 5,
                              paddingHorizontal: 5,

                              color: "#464646",
                            }}
                          >
                            {i.title}
                          </Text>
                        ) : null}
                        <Text
                          size="title"
                          type="regular"
                          style={{
                            lineHeight: 22,
                            textAlign: "left",
                            color: "#464646",
                            marginBottom: 15,

                            paddingHorizontal: 5,
                          }}
                        >
                          {i.text ? i.text : ""}
                        </Text>
                      </View>
                    )}
                  </View>
                );
              }
            })
          : null
        //  (
        //   <View style={{ alignItems: "center" }}>
        //     <Text
        //       type="regular"
        //       size="title"
        //       style={{
        //         textAlign: "justify",
        //         color: "#464646",
        //       }}
        //     >
        //       {t("noArticle")}
        //     </Text>
        //   </View>
        // )
        }
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
            borderBottomWidth: 1,
            borderColor: "#d1d1d1",
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
                  borderBottomWidth: index == tabIndex ? 2 : 2,
                  borderBottomColor: index == tabIndex ? "#209fae" : "#DAF0F2",
                  alignContent: "center",
                  paddingHorizontal: 15,
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
                }}
              >
                <Text
                  style={[
                    index == tabIndex ? styles.labelActive : styles.label,
                    {
                      opacity: index == tabIndex ? 1 : 1,
                      borderBottomWidth: 0,

                      borderBottomColor:
                        index == tabIndex &&
                        props.navigationState.routes.length > 1
                          ? "#FFFFFF"
                          : "#209fae",
                      textTransform: "capitalize",
                    },
                  ]}
                >
                  <Truncate text={item?.title ? item.title : ""} length={14} />
                </Text>
              </View>
            </Ripple>
          )}
        />
      </Animated.View>
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

  // if (load) {
  //   return (
  //     <SkeletonPlaceholder>
  //       <View style={{ flexDirection: "row" }}>
  //         <View
  //           style={{
  //             height: 10,
  //             width: 50,
  //             borderRadius: 10,
  //             margin: 10,
  //           }}
  //         ></View>
  //         <View
  //           style={{
  //             height: 10,
  //             width: 50,
  //             borderRadius: 10,
  //             margin: 10,
  //           }}
  //         ></View>
  //         <View
  //           style={{
  //             height: 10,
  //             width: 50,
  //             borderRadius: 10,
  //             margin: 10,
  //           }}
  //         ></View>
  //         <View
  //           style={{
  //             height: 10,
  //             width: 50,
  //             borderRadius: 10,
  //             margin: 10,
  //           }}
  //         ></View>
  //         <View
  //           style={{
  //             height: 10,
  //             width: 50,
  //             borderRadius: 10,
  //             margin: 10,
  //           }}
  //         ></View>
  //         <View
  //           style={{
  //             height: 10,
  //             width: 50,
  //             borderRadius: 10,
  //             margin: 10,
  //           }}
  //         ></View>
  //         <View
  //           style={{
  //             height: 10,
  //             width: 50,
  //             borderRadius: 10,
  //             margin: 10,
  //           }}
  //         ></View>
  //       </View>

  //       <View
  //         style={{
  //           width: Dimensions.get("screen").width,
  //           paddingHorizontal: 15,
  //         }}
  //       >
  //         <View
  //           style={{
  //             marginTop: 10,
  //             width: "80%",
  //             height: 12,
  //             borderRadius: 5,
  //           }}
  //         ></View>
  //         <View
  //           style={{
  //             height: 150,
  //             width: "100%",
  //             borderRadius: 10,
  //             marginTop: 10,
  //           }}
  //         ></View>

  //         <View
  //           style={{
  //             marginTop: 10,
  //             width: "100%",
  //             height: 10,
  //             borderRadius: 5,
  //           }}
  //         ></View>
  //         <View
  //           style={{
  //             marginTop: 10,
  //             width: "100%",
  //             height: 10,
  //             borderRadius: 5,
  //           }}
  //         ></View>
  //         <View
  //           style={{
  //             marginTop: 10,
  //             width: "100%",
  //             height: 10,
  //             borderRadius: 5,
  //           }}
  //         ></View>
  //         <View
  //           style={{
  //             marginTop: 10,
  //             width: "100%",
  //             height: 10,
  //             borderRadius: 5,
  //           }}
  //         ></View>
  //         <View
  //           style={{
  //             marginTop: 10,
  //             width: "80%",
  //             height: 12,
  //             borderRadius: 5,
  //           }}
  //         ></View>
  //         <View
  //           style={{
  //             height: 150,
  //             width: "100%",
  //             borderRadius: 10,
  //             marginTop: 10,
  //           }}
  //         ></View>

  //         <View
  //           style={{
  //             marginTop: 10,
  //             width: "100%",
  //             height: 10,
  //             borderRadius: 5,
  //           }}
  //         ></View>
  //         <View
  //           style={{
  //             marginTop: 10,
  //             width: "100%",
  //             height: 10,
  //             borderRadius: 5,
  //           }}
  //         ></View>
  //         <View
  //           style={{
  //             marginTop: 10,
  //             width: "100%",
  //             height: 10,
  //             borderRadius: 5,
  //           }}
  //         ></View>
  //         <View
  //           style={{
  //             marginTop: 10,
  //             width: "100%",
  //             height: 10,
  //             borderRadius: 5,
  //           }}
  //         ></View>
  //         <View
  //           style={{
  //             marginTop: 10,
  //             width: "100%",
  //             height: 10,
  //             borderRadius: 5,
  //           }}
  //         ></View>
  //         <View
  //           style={{
  //             marginTop: 10,
  //             width: "100%",
  //             height: 10,
  //             borderRadius: 5,
  //           }}
  //         ></View>
  //         <View
  //           style={{
  //             marginTop: 10,
  //             width: "100%",
  //             height: 10,
  //             borderRadius: 5,
  //           }}
  //         ></View>
  //       </View>
  //     </SkeletonPlaceholder>
  //   );
  // }
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      {renderTabView()}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  indicator: { backgroundColor: "#209FAE", height: 0 },
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
