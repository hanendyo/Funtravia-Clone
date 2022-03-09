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
  StatusBar,
} from "react-native";
import { Text, Button } from "../../component";
import { default_image, logo_funtravia } from "../../assets/png";
import {
  Arrowbackios,
  Arrowbackwhite,
  LikeEmpty,
  SearchWhite,
} from "../../assets/svg";
import PopularJournal from "../../graphQL/Query/Journal/PopularJournal";
import JournalList from "../../graphQL/Query/Journal/JournalList";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import {
  dateFormatMonthYears,
  dateFormatShortMonth,
} from "../../component/src/dateformatter";
import { useTranslation } from "react-i18next";
import Category from "../../graphQL/Query/Itinerary/ItineraryCategory";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

export default function Journal(props) {
  const { t } = useTranslation();
  const [idCategory, setIdCategory] = useState(null);
  const [indexCategory, setIndexCategory] = useState(0);
  let [search, setSearch] = useState({
    category_id: null,
    order_by: null,
    limit: null,
    offset: null,
    keyword: null,
  });
  let { width, height } = Dimensions.get("screen");
  const HeaderComponent = {
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: (
      <Text size="header" type="bold" style={{ color: "#fff" }}>
        {t("traveljournal")}
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
      elevation: Platform.OS == "ios" ? 0 : null,
      borderBottomWidth: Platform.OS == "ios" ? 0 : null,
      width: Platform.OS == "ios" ? Dimensions.get("screen").width : null,
      height: Platform.OS == "ios" ? StatusBar.currentHeight : null,
      textAlign: Platform.OS == "ios" ? "center" : null,
      paddingVertical: Platform.OS == "ios" ? 10 : null,
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
    headerRight: () => (
      <Button
        text={""}
        size="medium"
        type="circle"
        variant="transparent"
        onPress={() =>
          props.navigation.navigate("JournalCategory", {
            category: idCategory,
            index: indexCategory,
          })
        }
        style={{
          height: 55,
          // borderWidth: 1,
          marginRight: 10,
        }}
      >
        <SearchWhite height={20} width={20} />
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
      limit: 100,
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

  // const backAction = () => {
  //   props.navigation.goBack();
  //   return true;
  // };

  // useEffect(() => {
  //   BackHandler.addEventListener("hardwareBackPress", backAction);
  //   return () =>
  //     BackHandler.removeEventListener("hardwareBackPress", backAction);
  // }, []);

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
      {/* <StaBar backgroundColor="#14646e" barStyle="light-content" /> */}
      {/* ============================== Populer Journal ====================================================*/}

      <View style={styles.container}>
        <Pressable onPress={() => JournalDetail(data?.journal_most_populer)}>
          <Image
            source={
              data?.journal_most_populer?.firstimg
                ? { uri: data?.journal_most_populer?.firstimg }
                : default_image
            }
            style={styles.imageTop}
          />
          <View style={{ marginHorizontal: 15 }}>
            <Text
              style={styles.title}
              size={"title"}
              type={"bold"}
              numberOfLines={2}
            >
              {data?.journal_most_populer?.title}
            </Text>
            <View style={styles.editor}>
              <Image
                style={{ width: 40, height: 40, borderRadius: 20 }}
                source={
                  data?.journal_most_populer?.userby?.picture
                    ? { uri: data?.journal_most_populer?.userby?.picture }
                    : logo_funtravia
                }
              />

              <View style={styles.dataEditor}>
                <Text size={"title"} type={"bold"}>
                  {data?.journal_most_populer?.userby?.first_name
                    ? data?.journal_most_populer?.userby?.first_name
                    : "Funtravia"}
                </Text>
                <Text size={"label"} type={"regular"} style={{ marginTop: 0 }}>
                  {data?.journal_most_populer?.date
                    ? dateFormatShortMonth(data?.journal_most_populer?.date)
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
          marginLeft: 10,
          marginTop: 10,
          marginBottom: 9,
          backgroundColor: "white",
        }}
      >
        <FlatList
          data={dataCategory?.category_journal}
          contentContainerStyle={{
            flexDirection: "row",
            paddingRight: 15,
            marginVertical: 5,
          }}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <Pressable
              onPress={() => {
                props.navigation.navigate("JournalCategory", {
                  category: item.id,
                  index: index,
                });
                setIndexCategory(index);
                setIdCategory(item?.id);
              }}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 15,
                backgroundColor: "#f6f6f6",
                marginHorizontal: 3,
                borderRadius: 5,
              }}
            >
              <Text
                // style={{
                //   paddingVertical: 10,
                //   paddingHorizontal: 15,
                //   backgroundColor: "red",
                //   marginHorizontal: 5,
                // }}
                size={"label"}
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
                    // width: 110,
                    width: "25%",
                    height: 110,
                    borderRadius: 10,
                  }}
                />
                <View
                  style={{
                    paddingVertical: 5,
                    width: "75%",
                    paddingLeft: 15,
                    justifyContent: "space-between",
                    // felx: 1,
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
                      style={{
                        color: "#3E3E3E",
                        // marginTop: 5,
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
                        marginTop: 5,
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
                        <LikeEmpty width={12} height={12} />
                        <Text
                          style={{ marginLeft: 5 }}
                          size={"description"}
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
                  marginVertical: 15,
                  borderBottomColor: "#f6f6f6",
                  borderBottomWidth: 1,
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
    paddingBottom: 15,
    marginHorizontal: 15,
  },
  imageTop: {
    height: 180,
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
  dataEditor: { marginHorizontal: 15 },
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
