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
import ArtikelList from "../../../graphQL/Query/Countries/Articlelist";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import { Truncate } from "../../../component";
import { dateFormatMonthYears } from "../../../component/src/dateformatter";
import { useTranslation } from "react-i18next";
import Category from "../../../graphQL/Query/Countries/Articlecategory";
import { TextInput } from "react-native-gesture-handler";

export default function ArtikelCategory(props) {
  let [category, setCategory] = useState(props.route.params.id);
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

  const {
    data: dataList,
    loading: loadingList,
    fetchMore,
    refetch,
    networkStatus,
  } = useQuery(ArtikelList, {
    variables: {
      category_id: category,
      country_id: props.route.params.country,
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
  if (dataList && "datas" in dataList.list_articel_country_category) {
    list = dataList.list_articel_country_category.datas;
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
    const { page_info } = fetchMoreResult.list_articel_country_category;
    const datas = [
      ...prev.list_articel_country_category.datas,
      ...fetchMoreResult.list_articel_country_category.datas,
    ];

    return Object.assign({}, prev, {
      list: {
        __typename: prev.list_articel_country_category.__typename,
        page_info,
        datas,
      },
    });
  };

  const handleOnEndReached = () => {
    if (dataList.list_articel_country_category.page_info.hasNextPage) {
      return fetchMore({
        variables: {
          category_id: null,
          keyword: search,
          orderby: null,
          limit: 10,
          offset: dataList.list_articel_country_category.page_info.offset,
        },
        updateQuery: onUpdate,
      });
    }
  };

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
  });

  const ArticelDetail = (data) => {
    props.navigation.push("ArticelDetail", {
      id: data.id,
      category_id: category,
      country_id: props.route.params.country,
      title: data.title,
    });
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      // fetchCategory();
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
          data={dataCategory?.category_article_bycountry}
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
              <Pressable
                style={{
                  flexDirection: "row",
                  padding: 2,
                }}
                onPress={() => ArticelDetail(item)}
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
                      #{item?.countries?.name.toLowerCase().replace(/ /g, "")} #
                      {item?.category?.name.toLowerCase().replace(/ /g, "")}
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
                        length={100}
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
                      {/* <View
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
                        </View> */}
                    </View>
                  </View>
                </View>
              </Pressable>
            )}
            ItemSeparatorComponent={() => {
              return (
                <View
                  style={{
                    height: 2,
                    backgroundColor: "#f6f6f6",
                  }}
                ></View>
              );
            }}
            contentContainerStyle={
              {
                // paddingTop: 10,
                // backgroundColor: "#f3f3f3",
              }
            }
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
