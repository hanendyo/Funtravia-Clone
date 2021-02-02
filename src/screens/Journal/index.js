import { Thumbnail, View } from "native-base";
import React, { useEffect } from "react";
import {
  Dimensions,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  FlatList,
  Pressable,
  Alert
} from "react-native";
import { Text, Button } from "../../component";
import { default_image, logo_funtravia } from "../../assets/png";
import { Arrowbackwhite, LikeEmpty } from "../../assets/svg";
import PopularJournal from "../../graphQL/Query/Journal/PopularJournal";
import JournalList from "../../graphQL/Query/Journal/JournalList";
import { useLazyQuery } from "@apollo/react-hooks";
import { Loading, Truncate } from "../../component";
import { dateFormatMonthYears } from "../../component/src/dateformatter";
import { useTranslation } from "react-i18next";

export default function Journal(props) {
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

  const [fetchDataList, { data: dataList }] = useLazyQuery(JournalList, {
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

  const refresh = () => {
    fetchDataPopuler();
    fetchDataList();
  };

  const renderList = ({ item, index }) => {
    return (
      <View>
        <TouchableOpacity
          style={{ flexDirection: "row" }}
          onPress={() => JournalDetail(item)}
        >
          <Image
            source={item.firstimg ? { uri: item.firstimg } : default_image}
            style={{
              width: "30%",
              height: Dimensions.get("window").width - 220,
              borderRadius: 10,
            }}
          />
          <View
            style={{
              width: "70%",
              height: Dimensions.get("window").width * 0.34,
              marginTop: 10,
              paddingLeft: 20,
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text style={{ color: "#209FAE" }} size={"small"} type={"bold"}>
                #solo
              </Text>
              <Text size={"label"} type={"bold"} style={{ color: "#3E3E3E" }}>
                <Truncate text={item.title ? item.title : ""} length={50} />
              </Text>
              <Text
                size={"small"}
                type={"regular"}
                style={{ textAlign: "justify" }}
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
        </TouchableOpacity>
        <View
          style={{
            margin: 10,
            borderBottomColor: "#f6f6f6",
            borderBottomWidth: 0.9,
          }}
        />
      </View>
    );
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      refresh();
    });
    return unsubscribe;
  }, [props.navigation]);
  {
    /* ======================================= Render All ====================================================*/
  }


  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <Loading show={loading} />
      {/* <NavigationEvents onDidFocus={() => refresh()} /> */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={styles.scroll}
        stickyHeaderIndices={[2]}
      >
        {/* ============================== Populer Journal ====================================================*/}

        {data && data.journal_most_populer ? (
          <View style={styles.container}>
            <TouchableOpacity
              onPress={() => JournalDetail(data.journal_most_populer)}
            >
              <Image
                source={
                  data.journal_most_populer.firstimg
                    ? { uri: data.journal_most_populer.firstimg }
                    : default_image
                }
                style={styles.imageTop}
              />
              <View style={{ marginHorizontal: 20 }}>
                <View>
                  <Text style={styles.title} size={"title"} type={"bold"}>
                    {data.journal_most_populer
                      ? data.journal_most_populer.title
                      : "Title"}
                  </Text>
                </View>
                <View style={styles.editor}>
                  <Thumbnail
                    source={
                      data && data.journal_most_populer
                        && data.journal_most_populer.userby
                        && data.journal_most_populer.userby.picture
                        ? { uri: data.journal_most_populer.userby.picture }
                        : logo_funtravia
                    }
                    style={{ borderColor: "#ffffff", borderWidth: 2 }}
                  />
                  <View style={styles.dataEditor}>
                    <Text size={"label"} type={"bold"}>
                      {data.journal_most_populer.userby
                        ? data.journal_most_populer.userby
                        : "Funtravia"}
                    </Text>
                    <Text size={"small"} type={"regular"}>
                      {data.journal_most_populer.date
                        ? dateFormatMonthYears(data.journal_most_populer.date)
                        : null}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
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

        {dataList && dataList.journal_list.length > 0 ? (
          <View
            style={{
              marginVertical: 10,
              width: Dimensions.get("window").width,
              paddingHorizontal: 10,
              alignContent: "center",
            }}
          >
            <FlatList
              data={dataList.journal_list}
              renderItem={renderList}
              keyExtractor={(data) => data.id}
              nestedScrollEnabled
              ListHeaderComponent={
                <ScrollView>
                  <View style={styles.filterStyle}>
                    <Pressable onPress={() => Alert.alert("Coming Soon")}>
                      <View style={styles.contentFilter}>
                        <Text style={{ padding: 10 }} size={'description'} type={'bold'}>
                          Family
                        </Text>
                      </View>
                    </Pressable>
                    <Pressable onPress={() => Alert.alert("Coming Soon")}>
                      <View style={styles.contentFilter}>
                        <Text style={{ padding: 10 }} size={'description'} type={'bold'}>
                          Honey Moon
                        </Text>
                      </View>
                    </Pressable>
                    <Pressable onPress={() => Alert.alert("Coming Soon")}>
                      <View style={styles.contentFilter}>
                        <Text style={{ padding: 10 }} size={'description'} type={'bold'}>
                          Solo
                        </Text>
                      </View>
                    </Pressable>
                    <Pressable onPress={() => Alert.alert("Coming Soon")}>
                      <View style={styles.contentFilter}>
                        <Text style={{ padding: 10 }} size={'description'} type={'bold'}>
                          Bussines
                        </Text>
                      </View>
                    </Pressable>
                  </View>
                </ScrollView>
              }
              ListFooterComponent={null}
            />
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

{
  /* ============================== Styles Journal ====================================================*/
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginHorizontal: 5,
    borderRadius: 15,
    backgroundColor: "#f6f6f6",
    width: Dimensions.get("window").width * 0.95,
    alignSelf: "center",
    paddingBottom: 10,
  },
  imageTop: {
    width: Dimensions.get("window").width * 0.95,
    height: Dimensions.get("window").width * 0.5,
    borderRadius: 15,
  },
  title: {
    marginVertical: 5,
  },
  editor: {
    flexDirection: "row",
    alignItems: "center",
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
    flexDirection: "row",
    marginBottom: 10,
    // paddingHorizontal: 10,
  },
  contentFilter: {
    marginRight: 10,
    backgroundColor: "#f6f6f6",
    borderRadius: 5,
  },
  scroll: {},
});
