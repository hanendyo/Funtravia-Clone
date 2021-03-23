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

import { Arrowbackwhite, Garuda, Calendargreen } from "../../assets/svg";
import { default_image } from "../../assets/png";
import { useTranslation } from "react-i18next";
import { Text, Button } from "../../component";
import Ripple from "react-native-material-ripple";
import { useLazyQuery } from "@apollo/client";
import About from "../../graphQL/Query/Cities/About";
import { TabView, TabBar } from "react-native-tab-view";

const AnimatedIndicator = Animated.createAnimatedComponent(ActivityIndicator);
const { width, height } = Dimensions.get("screen");
const TabBarHeight = 48;
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

  const [canScroll, setCanScroll] = useState(true);
  const headerScrollY = useRef(new Animated.Value(0)).current;
 
  const scrollY = useRef(new Animated.Value(0)).current;

  const HeaderComponent = {
    headerShown: true,
    title: "About",
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: "Essentials - About",
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
    refresh();
  }, []);

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
        Authorization: `Bearer ${token}`,
      },
    },
    onCompleted: () => {
      let tab = [];

      data.list_about_article_city.map((item, index) => {
        tab.push({ key: item.id, title: item.name });
      });

      setRoutes(tab);
      setIndex(props.route.params.indexcity)
    }
  });
  let about = [];
  if (data && data.list_about_article_city) {
    about = data.list_about_article_city;
  }

  console.log("idcity", props.route.params.city_id);
  // console.log("tab", routes);

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
  }, []);

  

  // renderScene
  const renderScene=({ route })=>{
    const focused = route.key === routes[tabIndex].key;
    let numCols;
    let data;
    let renderItem;

    switch(route.key)
    {
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
      }}
        data={data}
        renderItem={renderItem}
      
      
      
      />
      
    )
  }
  const renderIsiLain = ()=> {
    let index = tabIndex;
    let datas = about ? about[index] : null;
    return (
      
      <View style={{ padding: 20 }}>
        {
          datas && datas.information_article_detail.length
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
                              textAlign:"justify",
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
                              textAlign:"justify",
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
            : 
           (
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
          )
        }
      </View>
    );
  }

  console.log(tabIndex);

  const renderIsi = ()=> {
    let index = about.findIndex((k) => k["id"] === actives);
    let datas = about ? about[index] : null;

    return (
      <View style={{ padding: 20 }}>
        {
          datas && datas.information_article_detail.length
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
  }

  

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
        
      <ScrollView
      horizontal={true}
      style={{
        width:"100%",
        backgroundColor:"#DAF0F2",
        
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
            flex:1,
						backgroundColor: "#DAF0F2",
            width:"100%",
						height: TabBarHeight,
						// borderBottomWidth: 1,
						// borderBottomColor: "#daf0f2",
					}}
          
          renderLabel={renderLabel}
          indicatorStyle={styles.indicator}
      
        />
        </ScrollView>
      </Animated.View>
    );
  };

  const renderLabel =({route, focused})=>{
    return (
      
      <View
      style={{
        borderBottomWidth:2,
        borderBottomColor:focused?"#209fae":"#DAF0F2",
        alignContent: "center",
        alignItems: "center",
        justifyContent: "flex-end",
            
      }}
      >
        <Text
          style={[
            focused ? styles.labelActive : styles.label,
            { opacity: focused ? 1 : 0.7 ,height:33},
          ]}
        >
          {route.title}
        </Text>
        </View>    
      );
  }

 
  const renderTabView = () => {
    return (
      <TabView
        onSwipeStart={() => setCanScroll(false)}
        onSwipeEnd={() => setCanScroll(true)}
        onIndexChange={(id) => {
          _tabIndex.current = id;
          setIndex(id);
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
   
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  indicator: { backgroundColor: "#209FAE", height: 0 },
  label: { fontSize: 14, color: "#464646", fontFamily: "Lato-Bold" },
	labelActive: { fontSize: 14, color: "#209FAE", fontFamily: "Lato-Bold" },

})
