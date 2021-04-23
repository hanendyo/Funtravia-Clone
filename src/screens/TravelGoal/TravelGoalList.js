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
} from "react-native";
import { Button, CustomImage, Text, Truncate } from "../../component";
import { useTranslation } from "react-i18next";
import { Arrowbackwhite, FilterIcon, Search, Xhitam } from "../../assets/svg";
import TravelLists from "../../graphQL/Query/TravelGoal/TravelList";
import { useQuery } from "@apollo/client";
import Modal from "react-native-modal";
import DropDownPicker from "react-native-dropdown-picker";
import { default_image } from "../../assets/png";

export default function TravelGoalList(props) {
  const HeaderComponent = {
    headerShown: true,
    title: "Travel Goal",
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: "Travel Goal",
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

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
  }, []);

  let dataList = [];
  let dataListx = {};
  let [texts, setText] = useState(null);
  let [modal, setModal] = useState(false);
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  let [opens, setOpens] = useState(10);

  const {
    loading: loadingList,
    data: dataLists,
    error: errorList,
    fetchMore,
    refetch,
  } = useQuery(TravelLists, {
    fetchPolicy: "network-only",
    variables: {
      limit: 7,
      offset: 0,
      category_id: [],
      keyword: texts,
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}`,
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

  const handleOnEndReached = () => {
    if (dataListx.travelgoal_list.page_info.hasNextPage) {
      return fetchMore({
        variables: {
          limit: 1,
          offset: dataListx.travelgoal_list.page_info.offset,
        },
        updateQuery: onUpdate,
      });
    }
  };

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          backgroundColor: "white",
          width: Dimensions.get("screen").width,
          zIndex: 5,
        }}
      >
        <View
          style={{
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 10,
            height: 55,
            zIndex: 5,
          }}
        >
          <View
            style={{
              backgroundColor: "#F0F0F0",
              borderRadius: 5,
              width: Dimensions.get("window").width - 30,
              // height: 100,
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              alignContent: "center",
            }}
          >
            <View>
              <Search width={15} height={15} style={{ marginHorizontal: 10 }} />
            </View>

            <TextInput
              underlineColorAndroid="transparent"
              placeholder={t("search")}
              style={{
                width: "100%",
                // borderWidth: 1,
                padding: 0,
              }}
              returnKeyType="search"
              onChangeText={(x) => setText(x)}
              onSubmitEditing={(x) => setText(x)}
            />
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            zIndex: 5,
            marginHorizontal: 15,
            marginBottom: 10,
          }}
        >
          <Button
            size="small"
            type="icon"
            variant="bordered"
            color="primary"
            onPress={() => {
              setModal(true);
            }}
            style={{
              marginRight: 5,
              // paddingHorizontal: 10,
            }}
          >
            <FilterIcon height={15} width={15} style={{ marginRight: 5 }} />
            <Text
              style={{
                fontFamily: "Lato-Regular",
                color: "#0095A7",
                fontSize: 13,
                alignSelf: "center",
                marginRight: 3,
              }}
            >
              {t("filter")}
            </Text>
            {/* {dataFillter.length && Filterlenght > 0 ? (
              <View
                style={{
                  borderRadius: 3,
                  width: 14,
                  height: 14,
                  backgroundColor: "#0095A7",
                  alignContent: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  alignSelf: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Lato-Regular",
                    color: "white",
                    fontSize: 13,
                    alignSelf: "center",
                  }}
                >
                  {Filterlenght}
                </Text>
              </View>
            ) : null} */}
          </Button>

          {/* <FlatList
            contentContainerStyle={{
              justifyContent: "space-evenly",
              marginHorizontal: 3,
            }}
            horizontal={true}
            data={dataFillter.sort(compare)}
            renderItem={_renderFilter}
            showsHorizontalScrollIndicator={false}
            extraData={selected}
          ></FlatList> */}
        </View>
      </View>

      <FlatList
        data={dataList}
        style={{}}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => Refresh()} />
        }
        contentContainerStyle={{
          paddingBottom: 2,
          paddingHorizontal: 15,
        }}
        onEndReachedThreshold={1}
        onEndReached={handleOnEndReached}
        onEndThreshold={3000}
        renderItem={({ item, index }) => (
          <Pressable
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
              width: "100%",
              backgroundColor: "#fff",
              borderRadius: 5,
              justifyContent: "flex-start",
              padding: 10,
              marginVertical: 5,
              // height: 700,
            }}
          >
            <Image
              source={item?.firstimg ? { uri: item?.firstimg } : default_image}
              style={{
                height: (Dimensions.get("screen").width - 60) * 0.25,
                width: (Dimensions.get("screen").width - 60) * 0.25,
                borderRadius: 5,
              }}
            ></Image>
            <View
              style={{
                paddingLeft: 10,
                width: (Dimensions.get("screen").width - 60) * 0.75,
                // borderWidth: 1,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <Text size="small">{item?.category?.name}</Text>
                {item?.created_at ? (
                  <Text size="small">{getdate(item?.created_at)}</Text>
                ) : null}
              </View>
              <Text size="label" type="bold">
                {item?.title}
              </Text>
              {item?.firsttxt ? (
                <Text
                  size="description"
                  numberOfLines={2}
                  style={{
                    textAlign: "justify",
                  }}
                >
                  {item?.firsttxt}
                </Text>
              ) : null}
              {/* <Text size="small" type="light" style={{ fontStyle: "italic" }}>
            12 min read
          </Text> */}
            </View>
          </Pressable>
        )}
      />

      <Modal
        // onLayout={() => dataCountrySelect()}
        isVisible={modal}
        style={{
          justifyContent: "flex-end",
          margin: 0,
        }}
      >
        <View
          style={{
            height: 10,

            backgroundColor: "#209fae",
          }}
        ></View>
        <View
          style={{
            flexDirection: "column",
            height: Dimensions.get("screen").height * 0.75,
            width: Dimensions.get("screen").width,
            backgroundColor: "white",
            // borderTopLeftRadius: 15,
            // borderTopRightRadius: 15,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              paddingHorizontal: 15,
              paddingVertical: 20,
            }}
          >
            <Text
              type="bold"
              size="title"
              style={{
                // fontSize: 20,
                // fontFamily: "Lato-Bold",
                color: "#464646",
              }}
            >
              Filter
            </Text>
            <TouchableOpacity
              style={{
                position: "absolute",
                backgroundColor: "with",
                height: 35,
                width: 32,
                top: 0,
                right: 0,
                justifyContent: "flex-end",
                alignContent: "flex-end",
                alignItems: "flex-start",
              }}
              onPress={() => setModal(false)}
            >
              <Xhitam width={15} height={15} />
            </TouchableOpacity>
          </View>
          {/* ==================garis========================= */}
          <View
            style={{
              borderBottomColor: "#D1D1D1",
              borderBottomWidth: 1,
            }}
          />
          {/* ==================garis========================= */}
          <ScrollView>
            <View
              style={{
                flexDirection: "column",
                justifyContent: "space-between",
                width: "100%",
                paddingHorizontal: 15,
                paddingVertical: 20,
              }}
            >
              <Text
                type="bold"
                size="title"
                style={{
                  // fontSize: 20,
                  // fontFamily: "Lato-Bold",
                  color: "#464646",
                }}
              >
                {t("categories")}
              </Text>

              <FlatList
                contentContainerStyle={{
                  marginHorizontal: 3,
                  paddingVertical: 15,
                  paddingRight: 10,
                  width: screenWidth - 40,
                }}
                data={[]}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    onPress={() => _handleCheck(item["id"], index)}
                    style={{
                      flexDirection: "row",
                      backgroundColor: "white",
                      borderColor: "#464646",
                      width: "49%",
                      marginRight: 3,
                      marginBottom: 20,
                      justifyContent: "flex-start",
                      alignContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <CheckBox
                      onCheckColor="#FFF"
                      lineWidth={3}
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
                      onValueChange={() => _handleCheck(item["id"], index)}
                      value={item["checked"]}
                    />

                    <Text
                      size="label"
                      type="regular"
                      style={{
                        // fontFamily: "Lato-Regular",
                        // fontSize: 16,
                        // alignContent:'center',
                        // textAlign: "center",

                        marginLeft: 0,
                        color: "#464646",
                      }}
                    >
                      {item["name"]}
                    </Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
                numColumns={2}
                showsHorizontalScrollIndicator={false}
                scrollEnabled={false}
              ></FlatList>

              {/* <Text
                type="bold"
                size="title"
                style={{
                  // fontSize: 20,
                  // fontFamily: "Lato-Bold",
                  color: "#464646",
                }}
              >
                {t("location")}
              </Text>
              <View
                style={{
                  borderWidth: 1,
                  borderRadius: 5,
                  borderColor: "#d3d3d3",
                  marginVertical: 10,
                  paddingBottom: opens,
                  // height: 200,
                  width: "100%",
                }}
              >
                <DropDownPicker
                  scrollViewProps={{
                    nestedScrollEnabled: true,
                    persistentScrollbar: true,
                  }}
                  onOpen={() => setOpens(150)}
                  onClose={() => setOpens(10)}
                  items={[]}
                  defaultValue={null}
                  containerStyle={{ height: 40 }}
                  style={{ backgroundColor: "#fafafa" }}
                  itemStyle={{
                    justifyContent: "flex-start",
                  }}
                  showArrow={false}
                  dropDownStyle={{
                    backgroundColor: "#fafafa",
                    height: 150,
                  }}
                  placeholder="Pilih Negara"
                  onChangeItem={(item, index) =>
                    _handleCheckc(item.value, index)
                  }
                />
              </View>
               */}
              {/* {datacity &&
              datacity.get_filter_city &&
              datacity.get_filter_city.length > 0 ? (
                <RenderCity
                  data={datacity}
                  dataFilterCity={dataFilterCity}
                  setFilterCity={(x) => setFilterCity(x)}
                  props={props}
                />
              ) : (
                () => {
                  setFilterCity([]);
                }
              )} */}
            </View>
          </ScrollView>
          <View
            style={{
              flex: 1,
              zIndex: 6,
              flexDirection: "row",
              height: 80,
              position: "absolute",
              bottom: 0,
              justifyContent: "space-around",
              alignContent: "center",
              alignItems: "center",
              backgroundColor: "#ffffff",
              width: Dimensions.get("screen").width,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              padding: 10,
              paddingHorizontal: 10,
            }}
          >
            <Button
              variant="bordered"
              color="secondary"
              // onPress={() => ClearAllFilter()}
              style={{ width: Dimensions.get("screen").width / 2 - 20 }}
              text={t("clearAll")}
            ></Button>
            <Button
              // onPress={() => UpdateFilter()}
              style={{ width: Dimensions.get("screen").width / 2 - 20 }}
              text={t("apply")}
            ></Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({});
