import { View } from "native-base";
import React, { useEffect, useState, useCallback } from "react";
import {
  Dimensions,
  Image,
  FlatList,
  Pressable,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Text, Button } from "../../component";
import { default_image } from "../../assets/png";
import {
  Arrowbackios,
  Arrowbackwhite,
  LikeEmpty,
  Search,
  SearchWhite,
  Xblue,
} from "../../assets/svg";
import PopularJournal from "../../graphQL/Query/Journal/PopularJournal";
import JournalList from "../../graphQL/Query/Journal/JournalList";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import { Truncate } from "../../component";
import { dateFormatMonthYears } from "../../component/src/dateformatter";
import { useTranslation } from "react-i18next";
import Category from "../../graphQL/Query/Itinerary/ItineraryCategory";
import { TextInput } from "react-native-gesture-handler";

export default function JournalCategory(props) {
  const { t } = useTranslation();
  let [category, setCategory] = useState(props.route.params.category);
  let { width, height } = Dimensions.get("screen");
  let [search, setSearch] = useState("");
  const HeaderComponent = {
    headerShown: true,
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: (
      <Text size="header" style={{ color: "#fff" }}>
        {t("traveljournal")}
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

  const [fetchDataPopuler, { data, loading }] = useLazyQuery(PopularJournal, {
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
      },
    },
  });

  const {
    data: dataList,
    loading: loadingList,
    fetchMore,
    refetch,
    networkStatus,
  } = useQuery(JournalList, {
    variables: {
      category_id: category,
      order_by: null,
      limit: 10,
      offset: 0,
      keyword: search,
    },
    context: {
      headers: {
        "Content-Type": "application/json",
      },
    },
    notifyOnNetworkStatusChange: true,
  });

  console.log("datalist category", dataList);

  let list = [];
  if (dataList && "datas" in dataList.journal_list) {
    list = dataList.journal_list.datas;
  }

  const [refreshing, setRefreshing] = useState(false);

  const Refresh = useCallback(() => {
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

  const onUpdate = (prev, { fetchMoreResult }) => {
    if (!fetchMoreResult) return prev;
    const { page_info } = fetchMoreResult.journal_list;
    const datas = [
      ...prev.journal_list.datas,
      ...fetchMoreResult.journal_list.datas,
    ];

    return Object.assign({}, prev, {
      list: {
        __typename: prev.journal_list.__typename,
        page_info,
        datas,
      },
    });
  };

  const handleOnEndReached = () => {
    if (dataList.journal_list.page_info.hasNextPage) {
      return fetchMore({
        variables: {
          category_id: null,
          keyword: search.keyword,
          orderby: null,
          limit: 10,
          offset: dataList.journal_list.page_info.offset,
        },
        updateQuery: onUpdate,
      });
    }
  };

  // const [
  //   fetchCategory,
  //   { data: dataCategory, loading: loadingCategory, error: errorCategory },
  // ] = useLazyQuery(Category, {
  //   variables: {
  //     category_id: null,
  //     order_by: null,
  //   },
  //   fetchPolicy: "network-only",
  //   context: {
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   },
  // });
  const {
    data: dataCategory,
    loading: loadingCategory,
    error: errorCategory,
    refetch: fetchCategory,
  } = useQuery(Category, {
    variables: {
      category_id: null,
      order_by: null,
    },
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
      },
    },
  });

  const JournalDetail = (data) => {
    props.navigation.navigate("DetailJournal", {
      dataPopuler: data,
    });
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      // fetchCategory();
      fetchDataPopuler();
    });
    return unsubscribe;
  }, [props.navigation]);

  {
    /* ======================================= Render All ====================================================*/
  }

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          backgroundColor: "white",
          height: 110,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            marginTop: 15,
            width: Dimensions.get("screen").width - 30,
            marginHorizontal: 15,
          }}
        >
          <View
            style={{
              height: 40,
              borderRadius: 5,
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#f6f6f6",
              // marginVertical: 10,
              // width: "80%",
              flex: 1,
            }}
          >
            <View
              style={{
                backgroundColor: "#209fae",
                borderBottomLeftRadius: 5,
                borderTopLeftRadius: 5,
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                width: 40,
              }}
            >
              <SearchWhite height={20} width={20} />
            </View>
            <TextInput
              fontSize={16}
              placeholder={t("search")}
              value={search}
              onChangeText={(x) => setSearch(x)}
              style={{ marginHorizontal: 10, flex: 1 }}
            />
            {search.length !== 0 ? (
              <TouchableOpacity
                onPress={() => {
                  setSearch("");
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
          <Pressable
            style={{
              height: 40,
              marginLeft: 5,
              borderRadius: 5,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => props.navigation.goBack()}
          >
            <Text size="label" type="regular">
              {t("cancel")}
            </Text>
          </Pressable>
        </View>
        {dataCategory ? (
          <FlatList
            data={dataCategory?.category_journal}
            initialScrollIndex={props.route.params.index}
            contentContainerStyle={{
              flexDirection: "row",
              paddingRight: 15,
              marginTop: 15,
            }}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <Pressable onPress={() => setCategory(item.id)}>
                <Text
                  style={{
                    padding: 10,
                    backgroundColor:
                      category === item.id ? "#209FAE" : "#F6F6F6",
                    marginLeft: 15,
                    borderRadius: 5,
                    color: category === item.id ? "white" : "black",
                  }}
                  size={"label"}
                  type={"bold"}
                >
                  {item.name}
                </Text>
              </Pressable>
            )}
          />
        ) : null}
      </View>
      {list.length > 0 ? (
        <View
          style={{
            flex: 1,
            width: Dimensions.get("window").width,
            paddingHorizontal: 15,
            alignContent: "center",
            backgroundColor: "#FFF",
          }}
        >
          <FlatList
            data={list}
            renderItem={({ item, index }) => (
              <View>
                <Pressable
                  style={{ flexDirection: "row" }}
                  onPress={() => JournalDetail(item)}
                >
                  <Image
                    source={
                      item.firstimg ? { uri: item.firstimg } : default_image
                    }
                    style={{
                      width: "25%",
                      height: 110,
                      borderRadius: 10,
                    }}
                  />
                  <View
                    style={{
                      width: "75%",
                      marginVertical: 5,
                      paddingLeft: 15,
                      justifyContent: "space-between",
                    }}
                  >
                    <View>
                      <Text
                        style={{ color: "#209FAE" }}
                        size={"description"}
                        type={"bold"}
                      >
                        #{item?.categori?.name.toLowerCase().replace(/ /g, "")}
                      </Text>
                      <Text
                        size={"title"}
                        type={"bold"}
                        style={{ color: "#3E3E3E" }}
                        numberOfLines={1}
                      >
                        {item.title}
                        {/* <Truncate
                          text={item.title ? item.title : ""}
                          length={40}
                        /> */}
                      </Text>
                      <Text
                        size={"label"}
                        type={"regular"}
                        style={{
                          textAlign: "left",
                          marginTop: 5,
                          lineHeight: 18,
                        }}
                        numberOfLines={2}
                      >
                        {item.firsttxt}
                        {/* <Truncate
                          text={item.firsttxt ? item.firsttxt : ""}
                          length={110}
                        /> */}
                      </Text>
                    </View>
                    <View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text size={"description"} type={"regular"}>
                          {dateFormatMonthYears(item.date)}
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <LikeEmpty width={10} height={10} />
                          <Text
                            style={{ marginLeft: 5 }}
                            size={"description"}
                            type={"regular"}
                          >
                            {item.article_response_count > 0
                              ? item.article_response_count +
                                " " +
                                t("likeMany")
                              : item.article_response_count + " " + t("like")}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </Pressable>
                <View
                  style={{
                    marginVertical: 15,
                    borderBottomColor: "#f6f6f6",
                    borderBottomWidth: 1,
                  }}
                />
              </View>
            )}
            keyExtractor={(item) => item.id}
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ marginTop: 15 }}
            refreshing={refreshing}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => Refresh()}
              />
            }
            ListFooterComponent={
              loadingList ? (
                <View
                  style={{
                    width: width,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <ActivityIndicator color="#209FAE" animating={true} />
                </View>
              ) : null
            }
            onEndReachedThreshold={1}
            onEndReached={handleOnEndReached}
          />
        </View>
      ) : (
        <View
          style={{
            backgroundColor: "white",
            alignItems: "center",
            paddingTop: 10,
            flex: 1,
          }}
        >
          {loadingList ? (
            <View
              style={{
                width: width,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator color="#209FAE" animating={true} />
            </View>
          ) : (
            <View
              style={{ backgroundColor: "white", paddingVertical: 20, flex: 1 }}
            >
              <Text size="label" type="bold">
                Tidak Ada Data
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}
