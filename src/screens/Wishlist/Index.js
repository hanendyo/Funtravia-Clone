import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TextInput,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  FlatList,
} from "react-native";
import {
  BlockDestination,
  LikeEmpty,
  Love,
  MovieIcon,
  PinHijau,
  Star,
  UnescoIcon,
  Xblue,
  Arrowbackios,
  Arrowbackwhite,
  Search,
  Kalenderhijau,
  LikeRed,
} from "../../assets/svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, FunIcon, FunImage, Text } from "../../component";
import { fromPromise, useLazyQuery } from "@apollo/client";
import { Tab, Tabs, ScrollableTab, TabHeading } from "native-base";
import Destination from "./Destination";
import Event from "./Event";
import Transportation from "./Transportation";
import Service from "./Service";
import Events from "../../graphQL/Query/Wishlist/Event";
import Destinasi from "../../graphQL/Query/Wishlist/Destination";
import Services from "../../graphQL/Query/Wishlist/Services";
import Trans from "../../graphQL/Query/Wishlist/Transportation";
import { useTranslation } from "react-i18next";
import { default_image } from "../../assets/png";
import { TabBar, SceneMap, TabView } from "react-native-tab-view";
import ImageBackground from "../../component/src/FunImageBackground";
import { dateFormatBetween } from "../../component/src/dateformatter";

export default function Wishlist(props) {
  const { t, i18n } = useTranslation();
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
  let [token, setToken] = useState("");
  let [texts, setText] = useState("");

  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    setToken(tkn);
    if (tkn) {
      getEvent();
      getDes();
      getServices();
      getTrans();
    }
  };

  let [dataTrans, setdataTrans] = useState({});
  let [dataEvent, setdataEvent] = useState({});
  let [dataDes, setdataDes] = useState();
  let [dataServices, setdataServices] = useState({});

  const [
    getTrans,
    { loading: loadingTrans, data: dataTran, error: errorTrans },
  ] = useLazyQuery(Trans, {
    fetchPolicy: "network-only",
    variables: {
      keyword: texts !== null ? texts : "",
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    onCompleted: () => {
      setdataTrans(dataTran);
    },
  });

  const [getEvent, { loading, data: dataEven, error }] = useLazyQuery(Events, {
    fetchPolicy: "network-only",
    variables: {
      keyword: texts !== null ? texts : "",
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
        Authorization: `Bearer ${token}`,
      },
    },
    onCompleted: () => {
      setdataDes(dataDe?.listdetination_wishlist);
    },
  });

  const [
    getServices,
    { loading: loadingServices, data: dataService, error: errorServices },
  ] = useLazyQuery(Services, {
    fetchPolicy: "network-only",
    variables: {
      keyword: texts !== null ? texts : "",
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    onCompleted: () => {
      setdataServices(dataService);
    },
  });

  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  const [refreshing, setRefreshing] = React.useState(false);

  const _Refresh = React.useCallback(() => {
    loadAsync();
    wait(2000).then(() => {
      setRefreshing(false);
    });
  }, []);

  const search = async (x) => {
    setText(x);
  };

  let [index, setindex] = useState(0);

  const GetEvent = () => {
    setindex(1);
    return (
      <Event
        props={props}
        dataEvent={
          !loading
            ? dataEvent && dataEvent?.listevent_wishlist?.length > 0
              ? dataEvent?.listevent_wishlist
              : []
            : []
        }
        Textcari={texts}
        token={token}
        refreshing={refreshing}
        Refresh={(e) => _Refresh(e)}
      />
    );
  };

  const GetDes = () => {
    setindex(0);
    return <Destination props={props} token={token} dataDes={dataDes} />;
  };

  const GetService = () => {
    return (
      <Service
        props={props}
        serviceData={
          dataServices && dataServices?.listservice_wishlist?.length > 0
            ? dataServices?.listservice_wishlist
            : []
        }
        token={token}
        refreshing={refreshing}
        Refresh={(e) => _Refresh(e)}
      />
    );
  };

  const GetTrans = () => {
    return (
      <Transportation
        props={props}
        transData={
          dataTrans && dataTrans?.listtransportation_wishlist?.length > 0
            ? dataTrans?.listtransportation_wishlist
            : []
        }
        token={token}
        refreshing={refreshing}
        Refresh={(e) => _Refresh(e)}
      />
    );
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    _Refresh();
  }, []);

  const renderLabel = ({ route, focused }) => {
    return (
      <View
        style={{
          width: Dimensions.get("screen").width / 2,
          height: 40,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            opacity: focused ? 1 : 0.7,
            color: focused ? "#209fae" : "#464646",
          }}
          size="label"
          type={focused ? "bold" : "regular"}
        >
          {route.title}
        </Text>
      </View>
    );
  };

  // const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "destination", title: "Destination" },
    { key: "events", title: "Events" },
  ]);

  const renderScene = ({ route }) => {
    if (route.key == "events") {
      return loading ? (
        <View
          style={{
            flex: 1,
            width: Dimensions.get("screen").width,
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 15,
          }}
        >
          <ActivityIndicator animating={loading} size="large" color="#209fae" />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={{
            marginTop: 10,
            justifyContent: "space-evenly",
            paddingHorizontal: 15,
            paddingBottom: 20,
          }}
          horizontal={false}
          data={dataEvent}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => eventdetail(item)}
              style={{
                // justifyContent: "center",
                width: (Dimensions.get("screen").width - 45) / 2,
                height: 280,
                flexDirection: "column",
                backgroundColor: "#FFF",
                shadowColor: "#FFF",
                shadowOffset: {
                  width: 0,
                  height: 5,
                },
                shadowOpacity: 0.1,
                shadowRadius: 6.27,
                elevation: 6,
                marginRight: 15,
                borderRadius: 5,
                marginTop: 10,
              }}
            >
              <View
                style={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  right: 10,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignContent: "center",
                  zIndex: 9999,
                }}
              >
                <View
                  style={{
                    // bottom: (9),
                    // height: 21,
                    // minWidth: 60,
                    borderRadius: 30,
                    alignSelf: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(226, 236, 248, 0.85)",
                    // paddingHorizontal: 10,
                  }}
                >
                  <Text
                    size="description"
                    style={{
                      marginBottom: 3,
                      marginTop: 2,
                      marginHorizontal: 10,
                    }}
                  >
                    {item.category.name}
                  </Text>
                </View>
                <View
                  style={{
                    height: 26,
                    width: 26,
                    borderRadius: 50,
                    alignSelf: "center",
                    alignItems: "center",
                    alignContent: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(226, 236, 248, 0.85)",
                    // zIndex: 999,
                  }}
                >
                  {item.liked === false ? (
                    <TouchableOpacity
                      style={{
                        height: 26,
                        width: 26,
                        borderRadius: 50,
                        alignSelf: "center",
                        alignItems: "center",
                        alignContent: "center",
                        justifyContent: "center",

                        zIndex: 9999,
                      }}
                      onPress={() => _liked(item.id)}
                    >
                      <LikeEmpty height={13} width={13} />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={{
                        height: 26,
                        width: 26,
                        borderRadius: 50,
                        alignSelf: "center",
                        alignItems: "center",
                        alignContent: "center",
                        justifyContent: "center",

                        zIndex: 9999,
                      }}
                      onPress={() => _unliked(item.id)}
                    >
                      <LikeRed height={13} width={13} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              <TouchableOpacity
                onPress={() => eventdetail(item)}
                style={{
                  height: Dimensions.get("window").width * 0.47 - 16,
                }}
              >
                <ImageBackground
                  key={item.id}
                  source={
                    item.images.length
                      ? { uri: item.images[0].image }
                      : default_image
                  }
                  style={{
                    height: Dimensions.get("window").width * 0.47 - 16,
                    borderTopRightRadius: 5,
                    borderTopLeftRadius: 5,
                    overflow: "hidden",
                    backgroundColor: "rgba(20,20,20,0.4)",
                  }}
                  imageStyle={{
                    resizeMode: "cover",
                    height: Dimensions.get("window").width * 0.47 - 16,
                    borderTopRightRadius: 5,
                    borderTopLeftRadius: 5,
                    overflow: "hidden",
                  }}
                ></ImageBackground>
              </TouchableOpacity>
              <View
                style={{
                  flex: 1,
                  flexDirection: "column",
                  justifyContent: "space-around",
                  height: 230,
                  marginVertical: 5,
                  marginHorizontal: 10,
                }}
              >
                <Text
                  onPress={() => eventdetail(item)}
                  size="label"
                  type="bold"
                  numberOfLines={2}
                >
                  {item.name}
                </Text>
                <View
                  style={{
                    height: "50%",
                    flexDirection: "column",
                    justifyContent: "space-around",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      width: "100%",
                      marginBottom: 3,
                    }}
                  >
                    <Kalenderhijau width={15} height={15} />
                    <Text
                      size="description"
                      style={{
                        paddingRight: 20,
                        width: "100%",
                        marginLeft: 5,
                      }}
                    >
                      {dateFormatBetween(item.start_date, item.end_date)}
                    </Text>
                  </View>
                  <View
                    style={{
                      // flex: 1,
                      flexDirection: "row",
                      width: "100%",
                      borderColor: "grey",
                    }}
                  >
                    <PinHijau width={15} height={15} />
                    <Text
                      size="description"
                      style={{
                        width: "100%",
                        marginLeft: 5,
                      }}
                    >
                      {item.city.name}
                    </Text>
                  </View>
                </View>
              </View>
            </Pressable>
          )}
          numColumns={2}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            dataEvent.length === 0 ? (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 20,
                }}
              >
                <Text size="label" type="regular">
                  {t("noData")}
                </Text>
              </View>
            ) : null
          }
        />
      );
    } else if (route.key == "destination") {
      return (
        <View style={{ flex: 1 }}>
          {loadingDes ? (
            <View style={{ alignItems: "center", marginTop: 20 }}>
              <ActivityIndicator color="#209fae" size="large" />
            </View>
          ) : dataDes && dataDes.length > 0 ? (
            <FlatList
              contentContainerStyle={{
                paddingHorizontal: 15,
                paddingVertical: 15,
              }}
              data={dataDes}
              renderItem={({ item, index }) => (
                <Pressable
                  onPress={() =>
                    props.navigation.push("DestinationUnescoDetail", {
                      id: item.id,
                      name: item.name,
                      token: token,
                    })
                  }
                  key={"nir" + index}
                  style={{
                    borderWidth: 1,
                    borderColor: "#F3F3F3",
                    borderRadius: 10,
                    // height: 190,
                    height: Dimensions.get("screen").height / 5,
                    marginBottom: 15,
                    width: "100%",
                    flexDirection: "row",
                    backgroundColor: "#FFF",
                    shadowColor: "#FFF",
                    shadowOffset: {
                      width: 0,
                      height: 5,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 6.27,
                    elevation: 6,
                  }}
                >
                  <View style={{ justifyContent: "center" }}>
                    {/* Image */}
                    <FunImage
                      source={{
                        uri: item.cover ? item.cover : item.images[0].image,
                      }}
                      style={{
                        // width: 160,
                        width: Dimensions.get("screen").width / 2.7,
                        height: "100%",
                        borderBottomLeftRadius: 10,
                        borderTopLeftRadius: 10,
                      }}
                    />
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        position: "absolute",
                        top: 10,
                        right: 10,
                        left: 10,
                        width: "87%",
                        zIndex: 2,
                        // borderWidth: 3,
                        borderColor: "#209fae",
                      }}
                    >
                      {item.liked === true ? (
                        <Pressable
                          onPress={() => _unlikedAnother(item.id)}
                          style={{
                            backgroundColor: "#F3F3F3",
                            height: 30,
                            width: 30,
                            borderRadius: 17,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Love height={15} width={15} />
                        </Pressable>
                      ) : (
                        <Pressable
                          onPress={() => _likedAnother(item.id)}
                          style={{
                            backgroundColor: "#F3F3F3",
                            height: 30,
                            width: 30,
                            borderRadius: 17,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <LikeEmpty height={15} width={15} />
                        </Pressable>
                      )}
                      {item?.rating != 0 ? (
                        <View
                          style={{
                            flexDirection: "row",
                            backgroundColor: "#F3F3F3",
                            borderRadius: 3,
                            justifyContent: "center",
                            alignItems: "center",
                            paddingHorizontal: 5,
                            height: 20,
                          }}
                        >
                          <Star height={15} width={15} />
                          <Text size="description" type="bold">
                            {item.rating.substr(0, 3)}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  </View>

                  {/* Keterangan */}
                  {/* rating */}
                  <View
                    style={{
                      flex: 1,
                      paddingHorizontal: 8,
                      paddingVertical: 7,
                      // height: 170,
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={{ borderWidth: 0 }}>
                      {/* Title */}
                      <View
                        style={{
                          flexDirection: "row",
                          paddingHorizontal: 3,
                          // alignItems: "center",
                        }}
                      >
                        <BlockDestination
                          height={16}
                          width={16}
                          style={{ marginTop: 5 }}
                        />
                        <Text
                          size="label"
                          type="bold"
                          numberOfLines={2}
                          style={{
                            marginLeft: 5,
                            marginBottom: 2,
                            flexWrap: "wrap",
                            width: "90%",
                          }}
                        >
                          {item.name}
                        </Text>
                      </View>

                      {/* Maps */}
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginLeft: 5,
                        }}
                      >
                        <PinHijau height={15} width={15} />
                        <Text
                          size="description"
                          type="regular"
                          style={{ marginLeft: 5 }}
                          numberOfLines={1}
                        >
                          {item.cities.name}
                        </Text>
                      </View>
                    </View>
                    {/* Great for */}
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        marginTop: 5,
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          justifyContent: "flex-end",
                          // borderWidth: 1,
                          // paddingHorizontal: 7,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                            }}
                          >
                            {item.movie_location?.length > 0 ? (
                              <UnescoIcon
                                height={28}
                                width={28}
                                style={{ marginRight: 5 }}
                              />
                            ) : null}
                            {item.type?.name.toLowerCase().substr(0, 6) ==
                            "unesco" ? (
                              <MovieIcon height={28} width={28} />
                            ) : null}
                          </View>
                          {dataDes?.destinationById?.movie_location?.length >
                          0 ? (
                            <UnescoIcon
                              height={33}
                              width={33}
                              style={{ marginRight: 5 }}
                            />
                          ) : null}
                          {dataDes?.destinationById?.type?.name
                            .toLowerCase()
                            .substr(0, 6) == "unesco" ? (
                            <MovieIcon height={28} width={28} />
                          ) : null}
                        </View>
                        <View
                          style={{
                            marginBottom: item.greatfor.length > 0 ? 0 : 7,
                          }}
                        >
                          {item.greatfor.length > 0 ? (
                            <Text
                              size="label"
                              type="bold"
                              // style={{ marginLeft: 5 }}
                            >
                              {t("GreatFor") + " :"}
                            </Text>
                          ) : null}
                          <View
                            style={{
                              flexDirection: "row",
                              marginLeft: -5,
                            }}
                          >
                            {item.greatfor.length > 0
                              ? item.greatfor.map((item, index) => {
                                  return index < 3 ? (
                                    <FunIcon
                                      key={"grat" + index}
                                      icon={item.icon}
                                      fill="#464646"
                                      height={37}
                                      width={37}
                                    />
                                  ) : null;
                                })
                              : null}
                          </View>
                        </View>
                      </View>
                      <View
                        style={{
                          justifyContent: "flex-end",
                          paddingBottom: 5,
                          paddingRight: 5,
                        }}
                      >
                        <Button
                          onPress={() => addToPlan(item)}
                          size="small"
                          text={t("add")}
                          style={{ height: 25 }}
                          // style={{ marginTop: 15 }}
                        />
                      </View>
                    </View>

                    {/* <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        height: 50,
                        marginTop: 10,
                        alignItems: "flex-end",
                        borderWidth: 1,
                      }}
                    >
                      {dataDes?.destinationById?.movie_location?.length > 0 ||
                      dataDes?.destinationById?.type?.name
                        .toLowerCase()
                        .substr(0, 6) == "unesco" ? (
                        <View>
                          <Text>test</Text>
                        </View>
                      ) : null}
                      <View style={{ borderWidth: 1 }}>
                        <Text size="description" type="bold">
                          Great for :
                        </Text>
                        <View style={{ flexDirection: "row" }}>
                          {item.greatfor.length > 0 ? (
                            item.greatfor.map((item, index) => {
                              return index < 3 ? (
                                <FunIcon
                                  key={"grat" + index}
                                  icon={item.icon}
                                  fill="#464646"
                                  height={35}
                                  width={35}
                                />
                              ) : null;
                            })
                          ) : (
                            <Text>-</Text>
                          )}
                        </View>
                      </View>
                      <Button
                        onPress={() => addToPlan(item)}
                        size="small"
                        text={"Add"}
                        // style={{ marginTop: 15 }}
                      />
                    </View> */}
                  </View>
                </Pressable>
              )}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={{ alignItems: "center", marginTop: 20 }}>
              <Text size="label" type="regular">
                {t("noData")}
              </Text>
            </View>
          )}
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ backgroundColor: "#fff" }}>
        <View
          style={{
            marginTop: 15,
            marginHorizontal: 15,
            width: Dimensions.get("screen").width - 30,
            height: 40,
            backgroundColor: "#f6f6f6",
            borderRadius: 5,
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Search height={20} width={20} style={{ marginHorizontal: 10 }} />
          <TextInput
            style={{ flex: 1, borderRadius: 5, marginRight: 5 }}
            value={texts}
            underlineColorAndroid="transparent"
            onChangeText={async (x) => {
              search(x);
            }}
            placeholder={t("search")}
            placeholderTextColor="#464646"
            returnKeyType="search"
            autoFocus={false}
            fontSize={16}
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
                  marginRight: 10,
                }}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      {/* TAB VIEW */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setindex}
        renderTabBar={(props) => {
          return (
            <TabBar
              {...props}
              style={{
                backgroundColor: "white",
              }}
              renderLabel={renderLabel}
              indicatorStyle={{ backgroundColor: "#209FAE", height: 2 }}
            />
          );
        }}
      />
      {/* END TAB VIEW */}
      {/* <Tabs
        locked={true}
        tabContainerStyle={{ height: 200, borderWidth: 1 }}
        tabBarUnderlineStyle={{ backgroundColor: "#209FAE", height: 2 }}
        // tabContainerStyle={{ borderWidth: 0 }}
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
                marginBottom: 5,
              }}
            >
              <Text
                size="label"
                type="bold"
                style={{ color: index == 0 ? "#209fae" : "#464646" }}
              >
                {t("destination")}
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
          <GetDes />
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
                size="label"
                type="bold"
                style={{ color: index == 1 ? "#209fae" : "#464646" }}
              >
                {t("events")}
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
          <GetEvent />
        </Tab>
      </Tabs> */}
    </SafeAreaView>
  );
}
