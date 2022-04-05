import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  TextInput,
  TouchableOpacity,
  Image,
  View,
  FlatList,
  Pressable,
  RefreshControl,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import {
  Arrowbackios,
  Arrowbackwhite,
  LikeEmpty,
  LikeRed,
  Search,
  Xblue,
} from "../../assets/svg";
import { Button, Text } from "../../component";
import { useSelector } from "react-redux";
import { useLazyQuery } from "@apollo/client";
import { default_image } from "../../assets/png";
import { dateFormatMonthYears } from "../../component/src/dateformatter";
import Journal from "../../graphQL/Query/Journal/JournalFavorite";
import { SafeAreaView } from "react-native-safe-area-context";

export default function JournalFavorite(props) {
  const token = useSelector((data) => data.token);
  const { t } = useTranslation();
  let [textInput, setTextInput] = useState("");
  let [dataFavorite, setDataFavorite] = useState([]);
  let { width, height } = Dimensions.get("screen");

  const HeaderComponent = {
    headerShown: true,
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: (
      <Text size="header" type="bold" style={{ color: "#fff" }}>
        {t("favoriteJournal")}
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
      paddingBottom: Platform.OS == "ios" ? 15 : null,
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

  const [refreshing, setRefreshing] = useState(false);

  const Refresh = useCallback(() => {
    setRefreshing(true);
    fetchDataListFavorite();
    wait(1000).then(() => {
      setRefreshing(false);
    });
  }, []);
  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  const [
    fetchDataListFavorite,
    { data: data, loading: loadingPopuler, error: errorFavorite },
  ] = useLazyQuery(Journal, {
    variables: {
      keyword: textInput,
    },
    fetchPolicy: "network-only",
    onCompleted: () => {
      setDataFavorite(data?.list_journal_favorite);
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
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
      fetchDataListFavorite();
    });
    return unsubscribe;
  }, [props.navigation]);

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: -55, backgroundColor: "#FFF" }}>
      <View
        style={{
          backgroundColor: "#fff",
          alignItems: "center",
        }}
      >
        <View
          style={{
            marginVertical: 10,
            // mrarginBottom: 15,
            marginHorizontal: 15,
            width: Dimensions.get("screen").width - 30,
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
          <Search height={15} width={15} style={{ marginRight: 5 }} />
          <TextInput
            style={{ flex: 1, marginRight: 5, padding: 0 }}
            value={textInput}
            underlineColorAndroid="transparent"
            onChangeText={(x) => setTextInput(x)}
            placeholder={t("search")}
            placeholderTextColor="#464646"
            returnKeyType="search"
            // autoFocus={true}
            fontSize={16}
          />
          {textInput.length !== 0 ? (
            <TouchableOpacity
              onPress={() => {
                setTextInput("");
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
      {/* {dataFavorite.length > 0 ? ( */}
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
          data={dataFavorite}
          renderItem={({ item, index }) =>
            item.travel_journal ? (
              <View>
                <Pressable
                  style={{ flexDirection: "row" }}
                  onPress={() => JournalDetail(item.travel_journal)}
                >
                  <Image
                    source={
                      item?.travel_journal?.firstimg
                        ? { uri: item?.travel_journal.firstimg }
                        : default_image
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
                        #
                        {item?.travel_journal?.categori?.name
                          .toLowerCase()
                          .replace(/ /g, "")}
                      </Text>
                      <Text
                        size={"title"}
                        type={"bold"}
                        style={{ color: "#3E3E3E" }}
                        numberOfLines={1}
                      >
                        {item?.travel_journal?.title}
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
                        {item?.travel_journal?.firsttxt}
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
                          {dateFormatMonthYears(item?.travel_journal?.date)}
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          {item?.travel_journal?.liked ? (
                            <LikeRed width={10} height={10} />
                          ) : (
                            <LikeEmpty width={10} height={10} />
                          )}

                          <Text
                            style={{ marginLeft: 5 }}
                            size={"description"}
                            type={"regular"}
                          >
                            {item?.travel_journal?.article_response_count > 0
                              ? item?.travel_journal.article_response_count +
                                " " +
                                t("likeMany")
                              : item?.travel_journal?.article_response_count +
                                " " +
                                t("like")}
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
            ) : null
          }
          keyExtractor={(item) => item?.travel_journal_id}
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
            loadingPopuler ? (
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
          //   onEndReachedThreshold={1}
          //   onEndReached={handleOnEndReached}
        />
      </View>
      {/* ) : (
        <View
          style={{
            backgroundColor: "white",
            alignItems: "center",
            paddingTop: 10,
            flex: 1,
          }}
        >
          {loadingPopuler ? (
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
              style={{
                backgroundColor: "white",
                paddingVertical: 20,
                flex: 1,
              }}
            >
              <Text size="label" type="bold">
                {t("noData")}
              </Text>
            </View>
          )}
        </View>
      )} */}
    </SafeAreaView>
  );
}
