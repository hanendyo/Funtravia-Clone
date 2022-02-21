import { View } from "native-base";
import React, { useEffect, useState, useCallback, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Dimensions,
  Image,
  FlatList,
  Pressable,
  RefreshControl,
  ActivityIndicator,
  SafeAreaView,
  Animated,
  PanResponder,
  StyleSheet,
  Platform,
} from "react-native";
import { Text, Button, FunImage } from "../../../component";
import { default_image } from "../../../assets/png";
import {
  Arrowbackios,
  Arrowbackwhite,
  LikeEmpty,
  Search,
} from "../../../assets/svg";
import ArtikelList from "../../../graphQL/Query/Countries/Articlelist";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import { Truncate } from "../../../component";
import { dateFormatMonthYears } from "../../../component/src/dateformatter";
import { useTranslation } from "react-i18next";
import Category from "../../../graphQL/Query/Countries/Articlecategory";
import { TextInput } from "react-native-gesture-handler";
import { TabView } from "react-native-tab-view";
import Ripple from "react-native-material-ripple";

export default function ArtikelCategory(props) {
  let { t } = useTranslation();
  const [articles, setArticles] = useState(props.route.params.article);
  let [token, setToken] = useState("");
  const [routes, setRoutes] = useState([0]);
  const [tabIndex, setIndex] = useState(0);
  const TabBarHeight = 45;
  const [canScroll, setCanScroll] = useState(true);
  const scrollY = useRef(new Animated.Value(0)).current;
  const _tabIndex = useRef(0);
  const listRefArr = useRef([]);
  let scrollRef = useRef();
  const [actives, setActives] = useState(props.route.params.id);
  const [tabData] = useState(Array(1).fill(0));
  const [tabData1] = useState(Array(1).fill(0));
  const headerScrollY = useRef(new Animated.Value(0)).current;
  const HeaderComponent = {
    headerShown: true,
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: props.route.params.header,
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

  // useQuery Category by id country
  const {
    data: dataCategory,
    loading: loadingCategory,
    error: errorCategory,
    refetch: fetchCategory,
  } = useQuery(Category, {
    variables: {
      id: props.route.params.country,
    },
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
      },
    },
    onCompleted: () => {
      // let tab = [];
      // dataCategory.category_article_bycountry.map((item, index) => {
      //   tab.push({ key: item.id, title: item.name });
      // });
      // setRoutes(tab);
    },
  });

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);

    let tab = [];

    articles.map((item, index) => {
      console.log("item", item);
      tab.push({ key: item.id, title: item.title });
    });

    setRoutes(tab);
    // setTimeout(() => {
    //   scrollRef.current?.scrollToIndex({
    //     index: props.route.params.indexArc,
    //     animated: true,
    //   });
    // }, 5000);
  }, []);

  // render Tab View
  const renderTabView = () => {
    return (
      <TabView
        onSwipeStart={() => setCanScroll(false)}
        onSwipeEnd={() => setCanScroll(true)}
        onIndexChange={(id) => {
          _tabIndex.current = id;
          setIndex(id);
          scrollRef.current?.scrollToIndex({
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

  // render Scene
  const renderScene = ({ route }) => {
    const focused = route.key === routes[tabIndex];
    let numCols;
    let data;
    let renderItem;

    switch (route.key) {
      case "general":
        data = tabData;
        renderItem = renderactive;
        break;
      default:
        data = tabData1;
        renderItem = renderactive;
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
          paddingHorizontal: 15,
        }}
        data={data}
        renderItem={renderItem}
      />
    );
  };

  // render Tabbar
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
          data={props?.navigationState?.routes}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{
            backgroundColor: "#F6F6F6",
            // borderBottomWidth: 0.5,
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
                  borderBottomWidth: index == tabIndex ? 2 : 1,
                  borderBottomColor: index == tabIndex ? "#209fae" : "#d1d1d1",
                  alignContent: "center",
                  paddingHorizontal: 15,
                  width:
                    props?.navigationState.routes?.length <= 2
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
                      opacity: index == tabIndex ? 1 : 0.7,
                      borderBottomWidth: 0,

                      borderBottomColor:
                        index == tabIndex &&
                        props?.navigationState.routes?.length > 1
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

  // render active
  const renderactive = () => {
    let index = tabIndex;
    let datas = articles[index]?.content ? articles[index].content : null;

    return (
      <View
        style={{
          paddingVertical: 15,
        }}
      >
        {datas && datas.length
          ? datas.map((i, index) => {
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
          : null}
      </View>
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
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  indicator: { backgroundColor: "#209FAE", height: 0 },
  label: { fontSize: 14, color: "#464646", fontFamily: "Lato-Bold" },
  labelActive: { fontSize: 14, color: "#209FAE", fontFamily: "Lato-Bold" },
});
