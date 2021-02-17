import { Thumbnail, View } from "native-base";
import React, { useEffect, useState, useCallback } from "react";
import {
  Dimensions,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  FlatList,
  Pressable,
  Alert,
  RefreshControl,
} from "react-native";
import { Text, Button } from "../../component";
import { default_image, logo_funtravia } from "../../assets/png";
import { Arrowbackwhite, LikeEmpty } from "../../assets/svg";
import PopularJournal from "../../graphQL/Query/Journal/PopularJournal";
import JournalList from "../../graphQL/Query/Journal/JournalList";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import { Loading, Truncate } from "../../component";
import { dateFormatMonthYears } from "../../component/src/dateformatter";
import { useTranslation } from "react-i18next";
import Category from "../../graphQL/Query/Itinerary/ItineraryCategory";

export default function Journal(props) {
  let [search, setSearch] = useState({
    category_id: null,
    order_by: null,
    limit: null,
    offset: null,
    keyword: null,
  });
  let { width, height } = Dimensions.get("screen");
  const HeaderComponent = {
    headerShown: true,
    title: "Journal",
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: "Journal",
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
      category_id: null,
      order_by: null,
      limit: 10,
      offset: 0,
      keyword: null,
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
    props.navigation.navigate("DetailJournal", {
      dataPopuler: data,
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
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <Loading show={loading} />
      {/* ============================== Populer Journal ====================================================*/}

      {data && data.journal_most_populer ? (
        <View style={styles.container}>
          <Pressable onPress={() => JournalDetail(data.journal_most_populer)}>
            <Image
              source={
                data.journal_most_populer.firstimg
                  ? { uri: data.journal_most_populer.firstimg }
                  : default_image
              }
              style={styles.imageTop}
            />
            <View style={{ marginHorizontal: 10 }}>
              <View>
                <Text style={styles.title} size={"title"} type={"bold"}>
                  {data.journal_most_populer ? (
                    <Truncate
                      text={data.journal_most_populer.title}
                      length={80}
                    />
                  ) : (
                    "Title"
                  )}
                </Text>
              </View>
              <View style={styles.editor}>
                <Thumbnail
                  source={
                    data &&
                    data.journal_most_populer &&
                    data.journal_most_populer.userby &&
                    data.journal_most_populer.userby.picture
                      ? { uri: data.journal_most_populer.userby.picture }
                      : logo_funtravia
                  }
                  style={{
                    borderColor: "#ffffff",
                    height: 35,
                    width: 35,
                  }}
                />
                <View style={styles.dataEditor}>
                  <Text size={"label"} type={"bold"}>
                    {data.journal_most_populer.userby
                      ? data.journal_most_populer.userby
                      : "Funtravia"}
                  </Text>
                  <Text
                    size={"description"}
                    type={"regular"}
                    style={{ marginTop: -2 }}
                  >
                    {data.journal_most_populer.date
                      ? dateFormatMonthYears(data.journal_most_populer.date)
                      : null}
                  </Text>
                </View>
              </View>
            </View>
          </Pressable>
        </View>
      ) : null}
      {dataCategory && dataCategory.category_journal ? (
        <View
          style={{
            height: 50,
            marginTop: 15,
          }}
        >
          <FlatList
            data={dataCategory?.category_journal}
            contentContainerStyle={{
              flexDirection: "row",
              paddingHorizontal: 5,
            }}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <Pressable
                onPress={() =>
                  props.navigation.navigate("JournalCategory", {
                    category: item.id,
                  })
                }
              >
                <Text
                  style={{
                    padding: 10,
                    backgroundColor: "#F6F6F6",
                    marginLeft: 10,
                    borderRadius: 5,
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
      ) : null}

      {/* ============================== Top Contributor ====================================================*/}

      {/* <View style={styles.topContributor}>
					<Text size={'label'} type={'bold'}>
						Top Contributor
					</Text>
					<View style={styles.contributor}>
						<TouchableOpacity>
							<View style={{ alignItems: 'center', width: 88 }}>
								<Thumbnail source={default_image} />
								<Text
									style={{ textAlign: 'center' }}
									size={'small'}
									type={'regular'}>
									Casmala Deni Casmala
								</Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity>
							<View style={{ alignItems: 'center', width: 88 }}>
								<Thumbnail source={default_image} />
								<Text
									style={{ textAlign: 'center' }}
									size={'small'}
									type={'regular'}>
									Casmala Deni Casmala
								</Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity>
							<View style={{ alignItems: 'center', width: 88 }}>
								<Thumbnail source={default_image} />
								<Text
									style={{ textAlign: 'center' }}
									size={'small'}
									type={'regular'}>
									Casmala Deni Casmala
								</Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity>
							<View style={{ alignItems: 'center', width: 88 }}>
								<Thumbnail source={default_image} />
								<Text
									style={{ textAlign: 'center' }}
									size={'small'}
									type={'regular'}>
									Casmala Deni Casmala
								</Text>
							</View>
						</TouchableOpacity>
					</View>
				</View> */}
      {/* ============================== Type Journal ====================================================*/}
      {/* <View style={styles.filterStyle}>
          <Pressable onPress={() => alert("Coming Soon")}>
            <View style={styles.contentFilter}>
              <Text style={{ padding: 10 }} size={'description'} type={'bold'}>
                Family
							</Text>
            </View>
          </Pressable>
          <Pressable onPress={() => alert("Coming Soon")}>
            <View style={styles.contentFilter}>
              <Text style={{ padding: 10 }} size={'description'} type={'bold'}>
                Honey Moon
							</Text>
            </View>
          </Pressable>
          <Pressable onPress={() => alert("Coming Soon")}>
            <View style={styles.contentFilter}>
              <Text style={{ padding: 10 }} size={'description'} type={'bold'}>
                Solo
							</Text>
            </View>
          </Pressable>
        </View> */}

      {/* ============================== List Journal ====================================================*/}

      {list.length > 0 ? (
        <View
          style={{
            flex: 1,
            width: Dimensions.get("window").width,
            paddingHorizontal: 15,
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
                  <Text size="title" type="bold">
                    Loading...
                  </Text>
                </View>
              ) : null
            }
            onEndReachedThreshold={1}
            onEndReached={handleOnEndReached}
          />
        </View>
      ) : null}
    </View>
  );
}

{
  /* ============================== Styles Journal ====================================================*/
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    borderRadius: 10,
    backgroundColor: "#f6f6f6",
    paddingBottom: 20,
    marginHorizontal: 15,
  },
  imageTop: {
    height: 150,
    borderRadius: 10,
  },
  title: {
    marginTop: 10,
    lineHeight: 22,
  },
  editor: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  dataEditor: { marginHorizontal: 10 },
  topContributor: {
    marginHorizontal: 10,
  },
  contributor: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 20,
  },
  filterStyle: {
    marginBottom: 10,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  contentFilter: {
    marginRight: 10,
    backgroundColor: "#f6f6f6",
    borderRadius: 5,
  },
  scroll: {},
});
