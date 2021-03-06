import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Pressable,
  FlatList,
  RefreshControl,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  Platform,
  SafeAreaView,
} from "react-native";
// import { TouchableOpacity } from "react-native-gesture-handler";
import { Button, Text } from "../../component";
import { useTranslation } from "react-i18next";
import {
  Arrowbackios,
  Arrowbackwhite,
  Filternewbiru,
  Search,
  Xhitam,
  Xblue,
} from "../../assets/svg";
import TravelLists from "../../graphQL/Query/TravelGoal/TravelList";
import Travelcategorys from "../../graphQL/Query/TravelGoal/Travelcategory";
import { useQuery } from "@apollo/client";
import Modal from "react-native-modal";
import { default_image } from "../../assets/png";
import CheckBox from "@react-native-community/checkbox";
import normalize from "react-native-normalize";
import { useSelector } from "react-redux";
import DeviceInfo from "react-native-device-info";

export default function TravelGoalList(props) {
  const { t, i18n } = useTranslation();
  let tokenApps = useSelector((data) => data.token);
  const Notch = DeviceInfo.hasNotch();
  const [heights, setHeights] = useState(0);
  const HeaderComponent = {
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: (
      <Text size="header" type="bold" style={{ color: "#fff" }}>
        {t("travelgoals")}
      </Text>
    ),
    headerMode: "screen",
    headerStyle: {
      backgroundColor: Platform.OS == "ios" ? "#14646e" : "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      backgroundColor: Platform.OS == "ios" ? "#209fae" : null,
      width: Platform.OS == "ios" ? Dimensions.get("screen").width : null,
      height: Platform.OS == "ios" ? 45 : null,
      textAlign: Platform.OS == "ios" ? "center" : null,
      paddingTop: Platform.OS == "ios" ? 8 : null,
      paddingBottom: Platform.OS == "ios" ? 15 : 1,
    },
    headerLeftContainerStyle: {
      background: "#FFF",
      position: "absolute",
      zIndex: 999,
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

  let dataList = [];
  let dataListx = {};
  let [dataFillter, setdataFillter] = useState([]);
  let [dataFillters, setdataFillters] = useState([]);
  let [texts, setText] = useState("");
  let [textCategory, setTextCategory] = useState("");
  let [modal, setModal] = useState(false);

  let [idCategory, setIdCategory] = useState([]);
  let [idFilterCategory, setIdFilterCategory] = useState([]);
  let [tempIdCategory, setTempIdCategory] = useState([]);
  let [datacategory, setdatacategory] = useState([]);
  let [datacategoryFilter, setdatacategoryFilter] = useState([]);
  let [tempDataCategory, setTempDataCategory] = useState([]);
  let [hasApply, setHasApply] = useState(1);

  const _handleModalSearch = async (text) => {
    setTextCategory(text);
    let searchData = new RegExp(text, "i");
    if (searchData != `/(?:)/i`) {
      let categoryData = datacategory.filter((item) =>
        searchData.test(item.name)
      );
      await setdatacategoryFilter(categoryData);
    } else {
      await setdatacategoryFilter(datacategory);
    }
  };

  const [keyword, setKeyword] = useState("");

  const {
    loading: loadingcategory,
    data: datacategorys,
    error: errorcategory,
  } = useQuery(Travelcategorys, {
    variables: { keyword: keyword },
    context: {
      headers: {
        "Content-Type": "application/json",
      },
    },
    onCompleted: async () => {
      await setdatacategory(datacategorys?.category_travelgoal);
      await setdatacategoryFilter(datacategorys?.category_travelgoal);
      await setTempDataCategory(datacategorys?.category_travelgoal);
    },
  });

  const [filterResult, setfilterResults] = useState(null);

  const cekData = async (status) => {
    // let data = [];
    // for (var x of datacategory) {
    //   if (x.checked === true) {
    //     data.push(x);
    //   }
    // }

    if (status == "clear") {
      await setfilterResults(0);
    } else {
      let data = datacategory?.filter((x) => x.checked === true);
      let dataLength = data?.length ? data?.length : 0;
      await setfilterResults(dataLength);
    }
  };

  useEffect(() => {
    if (!modal && datacategoryFilter?.length != 0) {
      setdatacategory(tempDataCategory);
      setdatacategoryFilter(tempDataCategory);
    }
    setTextCategory("");
  }, [modal]);

  const {
    loading: loadingList,
    data: dataLists,
    error: errorList,
    fetchMore,
    refetch,
  } = useQuery(TravelLists, {
    fetchPolicy: "network-only",
    variables: {
      limit: 6,
      offset: 0,
      // category_id: filtercategory,
      category_id: idFilterCategory,
      keyword: texts,
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenApps,
      },
    },
  });

  {
    dataLists?.travelgoal_list?.datas
      ? ((dataList = dataLists?.travelgoal_list?.datas),
        (dataListx = dataLists))
      : null;
  }

  const [refreshing, setRefreshing] = useState(false);
  const Refresh = React.useCallback(() => {
    setRefreshing(true);
    refetch();
    wait(1000).then(() => {
      setRefreshing(false);
    });
  }, []);
  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  const getdate = (date) => {
    date = date.replace(" ", "T");
    var date1 = new Date(date).getTime();
    var date2 = new Date().getTime();
    var msec = date2 - date1;
    var mins = Math.floor(msec / 60000);
    var hrs = Math.floor(mins / 60);
    var days = Math.floor(hrs / 24);
    var month = Math.floor(days / 30);
    var yrs = Math.floor(days / 365);
    mins = mins % 60;
    hrs = hrs % 24;
    if (yrs > 0) {
      return yrs + " " + t("yearsAgo");
    }
    if (month > 0) {
      return month + " " + t("monthAgo");
    }
    if (days > 0) {
      return days + " " + t("daysAgo");
    }
    if (hrs > 0) {
      return hrs + " " + t("hoursAgo");
    }
    if (mins > 0) {
      return mins + " " + t("minutesAgo");
    } else {
      return t("justNow");
    }
  };

  const onUpdate = (prev, { fetchMoreResult }) => {
    if (
      prev.travelgoal_list.datas.length <
      fetchMoreResult.travelgoal_list.page_info.offset
    ) {
      if (!fetchMoreResult) return prev;
      const { page_info } = fetchMoreResult.travelgoal_list;
      const datas = [
        ...prev.travelgoal_list.datas,
        ...fetchMoreResult.travelgoal_list.datas,
      ];

      return Object.assign({}, prev, {
        travelgoal_list: {
          __typename: prev.travelgoal_list.__typename,
          page_info,
          datas,
        },
      });
    }
  };

  const compare = (a, b) => {
    return b.checked - a.checked;
  };

  const handleOnEndReached = () => {
    if (dataListx.travelgoal_list.page_info.hasNextPage) {
      return fetchMore({
        variables: {
          limit: 5,
          offset: dataListx.travelgoal_list.page_info.offset,
        },
        updateQuery: onUpdate,
      });
    }
  };

  const _handleCheck = async (id, index, datas) => {
    let dataCheck = [...datacategory];
    let dataFilter = [...datacategoryFilter];
    let temp_idCategory = [...idCategory];

    let indexCategory = temp_idCategory.findIndex((k) => k == id);
    if (indexCategory == -1) {
      temp_idCategory.push(id);
      await setIdCategory(temp_idCategory);
    } else {
      temp_idCategory.splice(indexCategory, 1);
      await setIdCategory(temp_idCategory);
    }
    let items = { ...datas };
    items.checked = !items.checked;
    let indexFilter = dataFilter.findIndex((key) => key.id === id);
    let indexCheck = dataCheck.findIndex((key) => key.id === id);
    dataCheck.splice(indexCheck, 1, items);
    dataFilter.splice(indexFilter, 1, items);
    await setdatacategoryFilter(dataFilter);
    await setdatacategory(dataCheck);
  };

  const UpdateFilter = async () => {
    await setIdFilterCategory(idCategory);
    // await setdatacategoryFilter(datacategory);
    await setTempDataCategory(datacategory);
    await setModal(false);
    await setTextCategory("");
    await cekData();
    await refetch();
    // setKeyword(textCategory);
  };

  const ClearAllFilter = async () => {
    // let temp_category = [...datacategory];
    // let temp_category_push = [];
    // for (var y of temp_category) {
    //   let data = { ...y };
    //   data.checked = false;
    //   temp_category_push.push(data);
    // }
    // await setdatacategory(temp_category_push);
    // await setdatacategoryFilter(temp_category_push);
    // await setTempDataCategory(temp_category_push);
    let clear = "clear";
    await setdatacategory(datacategorys?.category_travelgoal);
    await setdatacategoryFilter(datacategorys?.category_travelgoal);
    await setTempDataCategory(datacategorys?.category_travelgoal);
    await setIdCategory([]);
    await setIdFilterCategory([]);
    await setModal(false);
    await cekData(clear);
    await refetch();
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    if (modal == true) {
      setdatacategory(datacategoryFilter);
    }
    const unsubscribe = props.navigation.addListener("focus", () => {
      setIdCategory(idFilterCategory);
      // Getdatacategory();
    });
    return unsubscribe;
  }, [props.navigation, modal]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* mulai filter search */}
      <View
        onLayout={(event) => {
          var { x, y, width, height } = event.nativeEvent.layout;
          setHeights(height);
        }}
        style={{
          alignContent: "center",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "white",
          paddingHorizontal: 15,

          height: 50,
          zIndex: 5,
          flexDirection: "row",
          width: Dimensions.get("screen").width,
        }}
      >
        <Pressable
          onPress={() => {
            setModal(true);
          }}
          style={{
            borderWidth: 1,
            borderColor: "#209fae",
            height: 35,
            borderRadius: 2,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Filternewbiru
            width={18}
            height={18}
            style={{ marginHorizontal: 7 }}
          />
          {filterResult > 0 ? (
            <View
              style={{
                backgroundColor: "#209fae",
                borderRadius: 2,
                marginRight: 7,
              }}
            >
              <Text
                size="label"
                type="regular"
                style={{
                  paddingHorizontal: 5,
                  color: "#fff",
                }}
              >
                {filterResult}
              </Text>
            </View>
          ) : null}
        </Pressable>
        <View
          style={{
            backgroundColor: "#f6f6f6",
            borderRadius: 2,
            flex: 1,
            paddingHorizontal: 10,
            marginLeft: 7,
            flexDirection: "row",
            alignItems: "center",
            alignContent: "center",
            height: 35,
            borderWidth: 1,
            borderColor: "#e8e8e8",
          }}
        >
          <Search width={15} height={15} />

          <TextInput
            underlineColorAndroid="transparent"
            placeholder={t("search")}
            style={{
              marginHorizontal: 8,
              padding: 0,
              flex: 1,
              // borderWidth: 1,
            }}
            returnKeyType="search"
            placeholderTextColor="#464646"
            value={texts}
            // onChangeText={(x) => _setSearch(x)}
            // onSubmitEditing={(x) => _setSearch(x)}
            onChangeText={(x) => setText(x)}
            onSubmitEditing={(x) => setText(x)}
          />
          {texts.length ? (
            <TouchableOpacity onPress={() => setText("")}>
              <Xblue
                width="20"
                height="20"
                style={{
                  alignSelf: "center",
                }}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <FlatList
        data={dataList}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        showsVerticalScrollIndicator={false}
        // refreshControl={
        //   <RefreshControl refreshing={refreshing} onRefresh={() => Refresh()} />
        // }
        // contentContainerStyle={{
        //   paddingBottom: 2,
        //   paddingHorizontal: 15,
        //   paddingTop: heights + 10,
        // }}
        onEndReachedThreshold={1}
        onEndReached={handleOnEndReached}
        onEndThreshold={3000}
        renderItem={({ item, index }) => (
          <Pressable
            key={index}
            onPress={() => {
              props.navigation.push("TravelGoalDetail", {
                article_id: item.id,
              });
            }}
            style={{
              shadowOpacity: 0.5,
              shadowColor: "#d3d3d3",
              elevation: 3,
              flexDirection: "row",
              // width: "100%",
              backgroundColor: "#fff",
              borderRadius: 5,
              justifyContent: "flex-start",
              padding: 10,
              marginVertical: 5,
              width: Dimensions.get("screen").width - 30,
              marginHorizontal: 15,
            }}
          >
            <Image
              source={item?.cover ? { uri: item?.cover } : default_image}
              style={{
                height: (Dimensions.get("screen").width - 60) * 0.25,
                width: (Dimensions.get("screen").width - 60) * 0.25,
                borderRadius: 5,
              }}
            ></Image>
            <View
              style={{
                paddingLeft: 10,
                flex: 1,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-between",
                  marginBottom: 2,
                }}
              >
                <Text size="small" type="light">
                  {item?.category?.name}
                </Text>
                {item?.created_at ? (
                  <Text size="small" type="light">
                    {getdate(item?.created_at)}
                  </Text>
                ) : null}
              </View>
              <Text
                size="label"
                type="bold"
                numberOfLines={1}
                style={{ marginBottom: 3 }}
              >
                {item?.title}
              </Text>
              {item?.description ? (
                <Text
                  size="description"
                  numberOfLines={2}
                  style={{
                    textAlign: "left",
                    lineHeight: normalize(18),
                  }}
                >
                  {item?.description}
                </Text>
              ) : null}
              {/* <Text size="small" type="light" style={{ fontStyle: "italic" }}>
            12 min read
          </Text> */}
            </View>
          </Pressable>
        )}
        ListFooterComponent={
          loadingList ? (
            <View
              style={{
                width: Dimensions.get("screen").width,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 10,
                marginBottom: 20,
              }}
            >
              <ActivityIndicator
                animating={loadingList}
                size="large"
                color="#209FAE"
              />
            </View>
          ) : dataList.length === 0 ? (
            <View
              style={{
                marginTop: 20,
                alignItems: "center",
                width: Dimensions.get("screen").width,
              }}
            >
              <Text size="label" type="bold">
                {t("noData")}
              </Text>
            </View>
          ) : null
        }
      />

      <Modal
        keyboardShouldPersistTaps={"always"}
        avoidKeyboard={true}
        onBackdropPress={async () => {
          // await setTextCategory("");
          await setModal(false);
        }}
        onRequestClose={async () => {
          // await setTextCategory("");
          await setModal(false);
        }}
        onDismiss={async () => {
          // await setTextCategory("");
          await setModal(false);
        }}
        isVisible={modal}
        style={{
          justifyContent: "flex-end",
          margin: 0,
        }}
      >
        <View
          style={{
            flexDirection: "column",
            height:
              Platform.OS === "ios"
                ? Dimensions.get("screen").height * 0.47
                : Dimensions.get("screen").height * 0.4,
            width: Dimensions.get("screen").width,
            backgroundColor: "white",
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              paddingHorizontal: 15,
              paddingVertical: 20,
              borderBottomWidth: 1,
              borderBottomColor: "#d1d1d1",
            }}
          >
            <Text
              type="bold"
              size="title"
              style={{
                color: "#464646",
              }}
            >
              Filter
            </Text>
            <TouchableOpacity
              style={{
                // position: "absolute",
                // backgroundColor: "with",
                height: 20,
                width: 32,
                top: 0,
                right: 0,
                justifyContent: "flex-end",
                alignContent: "flex-end",
                alignItems: "flex-start",
              }}
              onPress={() => {
                setModal(false);
              }}
            >
              <Xhitam height={15} width={15} />
            </TouchableOpacity>
          </View>

          {/* end of header */}

          <View style={{ flexDirection: "row", height: "100%" }}>
            <View
              style={{
                width: "40%",
                borderRightWidth: 1,
                borderRightColor: "#d1d1d1",
                backgroundColor: "#f6f6f6",
              }}
            >
              <Pressable
                style={{
                  borderLeftColor: "#209fae",
                  borderLeftWidth: 3,
                  backgroundColor: "#fff",
                }}
              >
                <Text
                  type="bold"
                  size="label"
                  style={{
                    marginBottom: 18,
                    marginTop: 15,
                    marginLeft: 10,
                  }}
                >
                  {t("Category")}
                </Text>
              </Pressable>
            </View>
            <View style={{ height: "100%", flex: 1, padding: 15 }}>
              <View
                style={{
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
                <Search width={15} height={15} style={{ marginRight: 5 }} />
                <TextInput
                  style={{
                    flex: 1,
                    marginHorizontal: 5,
                    padding: 0,
                    fontSize: normalize(14),
                  }}
                  onChangeText={(e) => _handleModalSearch(e)}
                  placeholderTextColor="#464646"
                  value={textCategory}
                  placeholder={t("search")}
                ></TextInput>
                {textCategory.length ? (
                  <TouchableOpacity onPress={() => _handleModalSearch("")}>
                    <Xblue
                      width="20"
                      height="20"
                      style={{
                        alignSelf: "center",
                      }}
                    />
                  </TouchableOpacity>
                ) : null}
              </View>
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ marginBottom: 50, marginTop: 10 }}
              >
                {datacategoryFilter && datacategoryFilter.length > 0 ? (
                  datacategoryFilter.map((item, index) => {
                    return (
                      <TouchableOpacity
                        key={index + "bruh"}
                        onPress={() => _handleCheck(item["id"], index, item)}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginBottom: 15,
                          height: 30,
                        }}
                      >
                        <CheckBox
                          onCheckColor="#FFF"
                          animationDuration={0}
                          lineWidth={4}
                          onFillColor="#209FAE"
                          onTintColor="#209FAE"
                          boxType={"square"}
                          style={{
                            alignSelf: "center",
                            width: Platform.select({
                              ios: 30,
                              android: 35,
                            }),
                            transform: Platform.select({
                              ios: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
                              android: [{ scaleX: 1.3 }, { scaleY: 1.3 }],
                            }),
                          }}
                          // value={item.idtoogle}
                          // onValueChange={(newValue) =>
                          //   Platform.OS == "ios" ? null : setToogle(newValue)
                          // }
                          value={item["checked"]}
                          onValueChange={() =>
                            _handleCheck(item["id"], index, item)
                          }
                        />
                        <View
                          // onPress={() => _handleCheck(item["id"], index, item)}
                          style={{
                            // borderWidth: 1,
                            width: "80%",
                            height: "100%",
                            justifyContent: "center",
                          }}
                        >
                          <Text
                            size="label"
                            type="regular"
                            style={{
                              marginLeft: 0,
                              marginRight: -10,
                              color: "#464646",
                              marginTop: Platform.OS == "ios" ? -5 : -2,
                              // borderWidth: 5,
                            }}
                          >
                            {item["name"]}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })
                ) : (
                  <View style={{ alignItems: "center", marginTop: 10 }}>
                    <Text size="description" type="bold">
                      {t("noData")}
                    </Text>
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        </View>
        <View
          style={{
            // borderWidth: 1,
            height: Platform.OS === "ios" ? (Notch ? 70 : 50) : 50,
            width: Dimensions.get("screen").width,
            backgroundColor: "#fff",
            flexDirection: "row",
            paddingHorizontal: 10,
            paddingTop: 5,
            // paddingBottom: 10,
            justifyContent: "space-between",
            borderWidth: 1,
            borderColor: "#f6f6f6",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <Button
            variant="bordered"
            color="secondary"
            onPress={() => {
              ClearAllFilter();
              // setHasApply(2);
            }}
            style={{ width: "30%", borderColor: "#ffff" }}
            text={t("clearAll")}
          ></Button>
          <Button
            onPress={() => {
              UpdateFilter();
              // setHasApply(3);
            }}
            style={{ width: "65%", marginBottom: 10 }}
            text={t("apply")}
          ></Button>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
