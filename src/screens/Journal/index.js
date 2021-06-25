import { Thumbnail, View } from "native-base";
import React, { useEffect, useState, useCallback } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  ScrollView,
  FlatList,
  Pressable,
  RefreshControl,
} from "react-native";
import { Text, Button } from "../../component";
import { default_image, logo_funtravia } from "../../assets/png";
import { Arrowbackwhite, LikeEmpty } from "../../assets/svg";
import PopularJournal from "../../graphQL/Query/Journal/PopularJournal";
import JournalList from "../../graphQL/Query/Journal/JournalList";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import { Truncate } from "../../component";
import {
  dateFormatMonthYears,
  dateFormatShortMonth,
} from "../../component/src/dateformatter";
import { useTranslation } from "react-i18next";
import Category from "../../graphQL/Query/Itinerary/ItineraryCategory";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

export default function Journal(props) {
  const { t } = useTranslation();
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
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: t("journal"),
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

  const { data, loading } = useQuery(PopularJournal, {
    context: {
      headers: {
        "Content-Type": "application/json",
      },
    },
    notifyOnNetworkStatusChange: true,
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
      limit: 14,
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

  let journal_list = [];
  if (dataList && "datas" in dataList.journal_list) {
    journal_list = dataList.journal_list.datas;
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
    if (
      prev.journal_list.datas.length <
      fetchMoreResult.journal_list.page_info.offset
    ) {
      if (!fetchMoreResult) return prev;
      const { page_info } = fetchMoreResult.journal_list;
      const datas = [
        ...prev.journal_list.datas,
        ...fetchMoreResult.journal_list.datas,
      ];

      return Object.assign({}, prev, {
        journal_list: {
          __typename: prev.journal_list.__typename,
          page_info,
          datas,
        },
      });
    }
  };

  const handleOnEndReached = () => {
    if (dataList.journal_list.page_info.hasNextPage) {
      return fetchMore({
        variables: {
          category_id: null,
          keyword: search.keyword,
          orderby: null,
          limit: 14,
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
    });
    setTimeout(() => {
      setLoad(false);
    }, 2000);
    return unsubscribe;
  }, [props.navigation]);

  let [load, setLoad] = useState(true);

  {
    /* ======================================= Render All ====================================================*/
  }
  if (load) {
    return (
      <SkeletonPlaceholder>
        <View
          style={{
            width: Dimensions.get("screen").width,
            paddingHorizontal: 15,
          }}
        >
          <View
            style={{
              height: 150,
              width: "100%",
              borderRadius: 10,
              marginTop: 10,
            }}
          ></View>
          <View
            style={{
              marginTop: 10,
              width: "90%",
              height: 10,
              borderRadius: 5,
            }}
          ></View>
          <View
            style={{
              marginTop: 10,
              width: "50%",
              height: 10,
              borderRadius: 5,
            }}
          ></View>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <View style={{ width: 36, height: 36, borderRadius: 18 }}></View>
            <View
              style={{
                height: 40,
                width: "100%",
                marginLeft: 10,
                justifyContent: "center",
              }}
            >
              <View style={{ height: 10, width: "30%" }}></View>
              <View
                style={{
                  height: 10,
                  marginTop: 5,
                  width: "20%",
                }}
              ></View>
            </View>
          </View>
          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <View style={{ width: 80, borderRadius: 5, height: 30 }}></View>
            <View
              style={{
                width: 80,
                borderRadius: 5,
                height: 30,
                marginLeft: 5,
              }}
            ></View>
            <View
              style={{
                width: 80,
                borderRadius: 5,
                height: 30,
                marginLeft: 5,
              }}
            ></View>
            <View
              style={{
                width: 80,
                borderRadius: 5,
                height: 30,
                marginLeft: 5,
              }}
            ></View>
            <View
              style={{
                width: 80,
                borderRadius: 5,
                height: 30,
                marginLeft: 5,
              }}
            ></View>
          </View>
          <View
            style={{
              marginTop: 10,
              flexDirection: "row",
            }}
          >
            <View style={{ height: 110, width: 80, borderRadius: 10 }}></View>
            <View
              style={{
                marginLeft: 10,
                justifyContent: "space-around",
              }}
            >
              <View
                style={{
                  height: 10,
                  width: 50,
                  borderRadius: 5,
                }}
              ></View>
              <View
                style={{
                  height: 10,
                  width: 250,
                  borderRadius: 5,
                  marginTop: 5,
                }}
              ></View>
              <View
                style={{
                  height: 10,
                  width: 250,
                  borderRadius: 5,
                  marginTop: 5,
                }}
              ></View>
              <View
                style={{
                  height: 10,
                  width: 200,
                  borderRadius: 5,
                  marginTop: 5,
                }}
              ></View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    height: 10,
                    width: 50,
                    borderRadius: 5,
                    marginTop: 5,
                  }}
                ></View>
                <View
                  style={{
                    height: 10,
                    width: 50,
                    borderRadius: 5,
                    marginTop: 5,
                  }}
                ></View>
              </View>
            </View>
          </View>
          <View
            style={{
              marginTop: 10,
              flexDirection: "row",
            }}
          >
            <View style={{ height: 110, width: 80, borderRadius: 10 }}></View>
            <View
              style={{
                marginLeft: 10,
                justifyContent: "space-around",
              }}
            >
              <View
                style={{
                  height: 10,
                  width: 50,
                  borderRadius: 5,
                }}
              ></View>
              <View
                style={{
                  height: 10,
                  width: 250,
                  borderRadius: 5,
                  marginTop: 5,
                }}
              ></View>
              <View
                style={{
                  height: 10,
                  width: 250,
                  borderRadius: 5,
                  marginTop: 5,
                }}
              ></View>
              <View
                style={{
                  height: 10,
                  width: 200,
                  borderRadius: 5,
                  marginTop: 5,
                }}
              ></View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    height: 10,
                    width: 50,
                    borderRadius: 5,
                    marginTop: 5,
                  }}
                ></View>
                <View
                  style={{
                    height: 10,
                    width: 50,
                    borderRadius: 5,
                    marginTop: 5,
                  }}
                ></View>
              </View>
            </View>
          </View>
          <View
            style={{
              marginTop: 10,
              flexDirection: "row",
            }}
          >
            <View style={{ height: 110, width: 80, borderRadius: 10 }}></View>
            <View
              style={{
                marginLeft: 10,
                justifyContent: "space-around",
              }}
            >
              <View
                style={{
                  height: 10,
                  width: 50,
                  borderRadius: 5,
                }}
              ></View>
              <View
                style={{
                  height: 10,
                  width: 250,
                  borderRadius: 5,
                  marginTop: 5,
                }}
              ></View>
              <View
                style={{
                  height: 10,
                  width: 250,
                  borderRadius: 5,
                  marginTop: 5,
                }}
              ></View>
              <View
                style={{
                  height: 10,
                  width: 200,
                  borderRadius: 5,
                  marginTop: 5,
                }}
              ></View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    height: 10,
                    width: 50,
                    borderRadius: 5,
                    marginTop: 5,
                  }}
                ></View>
                <View
                  style={{
                    height: 10,
                    width: 50,
                    borderRadius: 5,
                    marginTop: 5,
                  }}
                ></View>
              </View>
            </View>
          </View>
          <View
            style={{
              marginTop: 10,
              flexDirection: "row",
            }}
          >
            <View style={{ height: 110, width: 80, borderRadius: 10 }}></View>
            <View
              style={{
                marginLeft: 10,
                justifyContent: "space-around",
              }}
            >
              <View
                style={{
                  height: 10,
                  width: 50,
                  borderRadius: 5,
                }}
              ></View>
              <View
                style={{
                  height: 10,
                  width: 250,
                  borderRadius: 5,
                  marginTop: 5,
                }}
              ></View>
              <View
                style={{
                  height: 10,
                  width: 250,
                  borderRadius: 5,
                  marginTop: 5,
                }}
              ></View>
              <View
                style={{
                  height: 10,
                  width: 200,
                  borderRadius: 5,
                  marginTop: 5,
                }}
              ></View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    height: 10,
                    width: 50,
                    borderRadius: 5,
                    marginTop: 5,
                  }}
                ></View>
                <View
                  style={{
                    height: 10,
                    width: 50,
                    borderRadius: 5,
                    marginTop: 5,
                  }}
                ></View>
              </View>
            </View>
          </View>
        </View>
      </SkeletonPlaceholder>
    );
  }
  // if (loadingCategory) {
  //   <View
  //     style={{
  //       backgroundColor: "white",
  //       paddingVertical: 20,
  //       height: Dimensions.get("screen").height,
  //     }}
  //   >
  //     <ActivityIndicator animating={true} color="#209FAE" />
  //   </View>;
  // }
  // if (loadingList) {
  //   <View
  //     style={{
  //       backgroundColor: "white",
  //       paddingVertical: 20,
  //       height: Dimensions.get("screen").height,
  //     }}
  //   >
  //     <ActivityIndicator animating={true} color="#209FAE" />
  //   </View>;
  // }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "white" }}
      stickyHeaderIndices={[1]}
      showsVerticalScrollIndicator={false}
    >
      {/* ============================== Populer Journal ====================================================*/}

      <View style={styles.container}>
        <Pressable onPress={() => JournalDetail(data?.journal_most_populer)}>
          <Image
            source={
              data?.journal_most_populer.firstimg
                ? { uri: data?.journal_most_populer.firstimg }
                : default_image
            }
            style={styles.imageTop}
          />
          <View style={{ marginHorizontal: 10 }}>
            <View>
              <Text style={styles.title} size={"title"} type={"bold"}>
                {data?.journal_most_populer ? (
                  <Truncate
                    text={data?.journal_most_populer.title}
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
                  data?.journal_most_populer &&
                  data?.journal_most_populer.userby &&
                  data?.journal_most_populer.userby.picture
                    ? {
                        uri: data?.journal_most_populer.userby.picture,
                      }
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
                  {data?.journal_most_populer.userby.first_name
                    ? data?.journal_most_populer.userby.first_name
                    : "Funtravia"}
                </Text>
                <Text
                  size={"description"}
                  type={"regular"}
                  style={{ marginTop: -2 }}
                >
                  {data?.journal_most_populer.date
                    ? dateFormatShortMonth(data?.journal_most_populer.date)
                    : null}
                </Text>
              </View>
            </View>
          </View>
        </Pressable>
      </View>
      <View
        style={{
          height: 50,
          marginTop: 5,
          backgroundColor: "white",
        }}
      >
        <FlatList
          data={dataCategory?.category_journal}
          contentContainerStyle={{
            flexDirection: "row",
            paddingHorizontal: 5,
            marginTop: 5,
          }}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <Pressable
              onPress={() =>
                props.navigation.navigate("JournalCategory", {
                  category: item.id,
                  index: index,
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

      <View
        style={{
          flex: 1,
          width: Dimensions.get("window").width,
          paddingHorizontal: 15,
          alignContent: "center",
        }}
      >
        <FlatList
          data={journal_list}
          showsVerticalScrollIndicator={false}
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
                      style={{
                        color: "#3E3E3E",
                        marginTop: 5,
                      }}
                      numberOfLines={1}
                    >
                      {item.title}
                      {/* <Truncate
												text={item.title ? item.title : ""}
												length={35}
											/> */}
                    </Text>
                    <Text
                      size={"description"}
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
                            ? item.article_response_count + " " + t("likeMany")
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
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => Refresh()}
            />
          }
          onEndReachedThreshold={1}
          onEndReached={handleOnEndReached}
        />
      </View>
    </ScrollView>
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
