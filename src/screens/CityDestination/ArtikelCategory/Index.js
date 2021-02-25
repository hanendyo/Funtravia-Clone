import { View } from "native-base";
import React, { useEffect, useState, useCallback } from "react";
import {
  Dimensions,
  Image,
  FlatList,
  Pressable,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Text, Button } from "../../../component";
import { default_image } from "../../../assets/png";
import { Arrowbackwhite, LikeEmpty, Search } from "../../../assets/svg";
import PopularJournal from "../../../graphQL/Query/Journal/PopularJournal";
import JournalList from "../../../graphQL/Query/Journal/JournalList";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import { Truncate } from "../../../component";
import { dateFormatMonthYears } from "../../../component/src/dateformatter";
import { useTranslation } from "react-i18next";
import Category from "../../../graphQL/Query/Itinerary/ItineraryCategory";
import { TextInput } from "react-native-gesture-handler";

export default function ArtikelCategory(props) {
  let [category, setCategory] = useState(props.route.params.category);
  let { width, height } = Dimensions.get("screen");
  let [search, setSearch] = useState("");
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

  const { t } = useTranslation();
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

  const [
    fetchCategory,
    { data: dataCategory, loading: loadingCategory, error: errorCategory },
  ] = useLazyQuery(Category, {
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
    props.navigation.push("JournalStackNavigation", {
      screen: "DetailJournal",
      params: {
        dataPopuler: data,
      },
    });
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      fetchCategory();
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
            height: "40%",
            borderRadius: 2,
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#DAF0F2",
            marginHorizontal: 15,
            marginVertical: 10,
          }}
        >
          <Search height={15} width={15} style={{ marginLeft: 10 }} />
          <TextInput
            fontSize={14}
            placeholder="Search"
            onChangeText={(x) => setSearch(x)}
            style={{ width: "90%" }}
          />
        </View>
        <FlatList
          data={dataCategory?.category_journal}
          contentContainerStyle={{
            flexDirection: "row",
            paddingRight: 10,
          }}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <Pressable onPress={() => setCategory(item.id)}>
              <Text
                style={{
                  padding: 10,
                  backgroundColor: category === item.id ? "#209FAE" : "#F6F6F6",
                  marginLeft: 10,
                  borderRadius: 5,
                  color: category === item.id ? "white" : "black",
                }}
                size={"description"}
                type={"bold"}
              >
                {item.name}
              </Text>
            </Pressable>
          )}
        />
      </View>
      {list.length > 0 ? (
        <View
          style={{
            flex: 1,
            width: Dimensions.get("window").width,
            paddingHorizontal: 10,
            alignContent: "center",
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
                      width: "21%",
                      height: 110,
                      borderRadius: 10,
                    }}
                  />
                  <View
                    style={{
                      width: "79%",
                      marginVertical: 5,
                      paddingLeft: 10,
                      justifyContent: "space-between",
                    }}
                  >
                    <View>
                      <Text
                        style={{ color: "#209FAE" }}
                        size={"small"}
                        type={"bold"}
                      >
                        #{item?.categori?.name.toLowerCase().replace(/ /g, "")}
                      </Text>
                      <Text
                        size={"label"}
                        type={"bold"}
                        style={{ color: "#3E3E3E", marginTop: 5 }}
                      >
                        <Truncate
                          text={item.title ? item.title : ""}
                          length={40}
                        />
                      </Text>
                      <Text
                        size={"small"}
                        type={"regular"}
                        style={{
                          textAlign: "justify",
                          marginTop: 5,
                          lineHeight: 16,
                        }}
                      >
                        <Truncate
                          text={item.firsttxt ? item.firsttxt : ""}
                          length={110}
                        />
                      </Text>
                    </View>
                    <View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text size={"small"} type={"regular"}>
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
                            size={"small"}
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
                    margin: 10,
                    borderBottomColor: "#f6f6f6",
                    borderBottomWidth: 0.9,
                  }}
                />
              </View>
            )}
            keyExtractor={(item) => item.id}
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
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
