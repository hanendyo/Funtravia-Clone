import { Thumbnail, View } from "native-base";
import { Dimensions, Image, FlatList, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, Button } from "../../component";
import { default_image, logo_funtravia } from "../../assets/png";
import React, { useEffect, useRef, useState } from "react";
import { Arrowbackwhite, LikeEmpty } from "../../assets/svg";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Truncate, Loading } from "../../component";
import { useLazyQuery } from "@apollo/react-hooks";
import JournalById from "../../graphQL/Query/Journal/JournalById";
import JournalCommentList from "../../graphQL/Query/Journal/JournalCommentList";
import { dateFormatForNotif } from "../../component/src/dateformatter";
import { useTranslation } from "react-i18next";
import AddCommentLike from "./AddCommentLike";

export default function DetailJournal(props) {
  const HeaderComponent = {
    headerShown: true,
    title: "Journal Detail",
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: "Journal Detail",
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

  let [dataPopuler] = useState(props.route.params.dataPopuler);
  let [token, setToken] = useState(props.route.params.token);
  let [setting, setSetting] = useState();
  let slider = useRef();
  let [y, setY] = useState(0);

  const { t } = useTranslation();
  const [fetchData, { data, loading }] = useLazyQuery(JournalById, {
    variables: { id: dataPopuler.id },
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  console.log(data)

  const afterComment = async () => {
    await fetchDataComment();
    await scroll_to();
  };

  const [
    fetchDataComment,
    { data: dataComment, loading: loadingComment },
  ] = useLazyQuery(JournalCommentList, {
    variables: { id: dataPopuler.id },
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    await setToken(tkn);

    let setsetting = await AsyncStorage.getItem("setting");
    await setSetting(JSON.parse(setsetting));
    await fetchData();
    await fetchDataComment();
  };

  console.log("token detail journal", token)

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    loadAsync();
  }, []);

  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  const scroll_to = () => {
    wait(1000).then(() => {
      slider.current.scrollTo({ y: y });
    });
  };

  const duration = (datetime) => {
    var date1 = new Date(datetime).getTime();
    var datenow = new Date();
    var date2 = datenow.getTime();
    var msec = date2 - date1;
    var mins = Math.floor(msec / 60000);
    var hrs = Math.floor(mins / 60);
    var days = Math.floor(hrs / 24);
    var yrs = Math.floor(days / 365);
    mins = mins % 60;
    hrs = hrs % 24;
    if (days > 1) {
      return dateFormatForNotif(
        datetime.slice(0, 10),
        datenow.toISOString().slice(0, 10)
      );
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

  const renderComment = ({ item, index }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginHorizontal: 20,
          marginVertical: 5,
          width: Dimensions.get("window").width * 0.9,
          justifyContent: "space-between",
        }}
      >
        <Loading show={loadingComment} />
        <View
          style={{
            flexDirection: "row",
            marginVertical: 2,
            minHeight: Dimensions.get("window").width * 0.05,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              item.user.id !== setting?.user?.id
                ? props.navigation.push("ProfileStack", {
                  screen: "otherprofile",
                  params: {
                    idUser: item.user.id,
                  },
                })
                : props.navigation.push("ProfileStack", {
                  screen: "ProfileTab",
                });
            }}
          >
            <Thumbnail
              source={
                item.user && item.user.picture
                  ? { uri: item.user.picture }
                  : default_image
              }
              style={{ borderColor: "#fcfcfc", borderWidth: 2 }}
            />
          </TouchableOpacity>
          <View style={{ marginLeft: 15 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                size={"description"}
                type={"bold"}
                onPress={() => {
                  item.user.id !== setting?.user?.id
                    ? props.navigation.push("ProfileStack", {
                      screen: "otherprofile",
                      params: {
                        idUser: item.user.id,
                      },
                    })
                    : props.navigation.push("ProfileStack", {
                      screen: "ProfileTab",
                    });
                }}
              >
                {item.user.first_name}
              </Text>
              {item && item.created_at ? (
                <Text size={"small"} type={"light"} style={{ marginLeft: 10 }}>
                  {duration(item.created_at)}
                </Text>
              ) : null}
            </View>
            <View
              style={{
                marginTop: 5,
                alignSelf: "center",
                width: Dimensions.get("window").width * 0.7,
              }}
            >
              <Text
                size={"description"}
                type={"regular"}
                style={{ textAlign: "justify" }}
              >
                {item.text}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  {
    /* ==================================== Render All ============================================== */
  }
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <Loading show={loading} />
      {data && data.journal_byid ? (
        <ScrollView ref={slider} showsVerticalScrollIndicator={false}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginHorizontal: 20,
              marginVertical: 10,
              width: Dimensions.get("window").width * 0.9,
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                onPress={() => {
                  data.journal_byid.userby
                    ? data.journal_byid.userby.id !== setting?.user?.id
                      ? props.navigation.push("ProfileStack", {
                        screen: "otherprofile",
                        params: {
                          idUser: data.journal_byid.userby.id,
                        },
                      })
                      : props.navigation.push("ProfileStack", {
                        screen: "ProfileTab",
                      })
                    : Alert.alert("Journal By Funtravia");
                }}
              >
                <Thumbnail
                  source={
                    data.journal_byid.userby
                      ? { uri: data.journal_byid.userby.picture }
                      : logo_funtravia
                  }
                  style={{ borderColor: "#fcfcfc", borderWidth: 2 }}
                />
              </TouchableOpacity>
              <View style={{ marginLeft: 10 }}>
                <Text
                  size={"description"}
                  type={"bold"}
                  onPress={() => {
                    data.journal_byid.userby
                      ? data.journal_byid.userby.id !== setting?.user?.id
                        ? props.navigation.push("ProfileStack", {
                          screen: "otherprofile",
                          params: {
                            idUser: data.journal_byid.userby.id,
                          },
                        })
                        : props.navigation.push("ProfileStack", {
                          screen: "ProfileTab",
                        })
                      : Alert.alert("Journal By Funtravia");
                  }}
                >
                  <Truncate
                    text={
                      data.journal_byid.userby
                        ? data.journal_byid.userby.username
                        : "Funtravia"
                    }
                    length={20}
                  />
                </Text>
                <Text
                  size={"small"}
                  type={"regular"}
                  style={{ color: "#209FAE" }}
                >
                  #solo
                </Text>
              </View>
            </View>
            {data.journal_byid &&
              data.journal_byid.userby &&
              data.journal_byid.userby.id ? (
                <TouchableOpacity>
                  <View
                    style={{
                      borderColor: "#209FAE",
                      borderWidth: 1,
                      borderRadius: 14,
                    }}
                  >
                    <Text
                      size={"small"}
                      type={"regular"}
                      style={{
                        paddingHorizontal: 25,
                        paddingVertical: 6,
                        color: "#209FAE",
                      }}
                    >
                      {`${t("follow")}`}
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : null}
          </View>
          <View style={{ marginHorizontal: 20 }}>
            <View>
              <Text size={"title"} type={"bold"}>
                <Truncate
                  text={data.journal_byid ? data.journal_byid.title : "Title"}
                  length={50}
                />
              </Text>
            </View>
            <View style={{ marginTop: 7 }}>
              <View
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                }}
              >
                {data && data.journal_byid && data.journal_byid.created_at ? (
                  <Text size={"small"} type={"light"}>
                    {duration(data.journal_byid.created_at)}
                  </Text>
                ) : null}
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <LikeEmpty width={10} height={10} />
                  <Text size={"small"} type={"bold"} style={{ marginLeft: 5 }}>
                    {data.journal_byid &&
                      data.journal_byid.article_response_count > 1
                      ? data.journal_byid.article_response_count +
                      " " +
                      t("likeMany")
                      : data.journal_byid.article_response_count +
                      " " +
                      t("like")}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* ==================================== Article ============================================== */}

          {data.journal_byid && data.journal_byid.article ? (
            <>
              {data.journal_byid.article.map((item, index) => {
                if (item.type === "image") {
                  return (
                    <View key={index}>
                      <View style={{ marginTop: 20 }}>
                        {item.image ?
                          <Image
                            source={item.image ? { uri: item.image } : null}
                            style={{
                              width: Dimensions.get("window").width,
                              height: Dimensions.get("window").width * 0.7,
                            }}
                          />
                          : null}
                      </View>
                      {item.title ? (
                        <View
                          style={{
                            marginTop: 20,
                            alignSelf: "center",
                            width: Dimensions.get("window").width * 0.9,
                          }}
                        >
                          <Text
                            size={"label"}
                            type={"bold"}
                            style={{ textAlign: "justify" }}
                          >
                            {item.title ? item.title : null}
                          </Text>
                        </View>
                      ) : null}
                      {item.text ? (
                        <View
                          style={{
                            marginTop: 5,
                            alignSelf: "center",
                            width: Dimensions.get("window").width * 0.9,
                          }}
                        >
                          <Text
                            size={"description"}
                            type={"regular"}
                            style={{ textAlign: "justify" }}
                          >
                            {item.text ? item.text : null}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  );
                } else {
                  return (
                    <View key={index}>
                      <View
                        style={{
                          marginTop: 1,
                          alignSelf: "center",
                          width: Dimensions.get("window").width * 0.9,
                        }}
                      >
                        {item.text ? (
                          <View
                            style={{
                              marginTop: 5,
                              alignSelf: "center",
                              width: Dimensions.get("window").width * 0.9,
                            }}
                          >
                            <Text
                              size={"description"}
                              type={"regular"}
                              style={{ textAlign: "justify" }}
                            >
                              {item.text ? item.text : null}
                            </Text>
                          </View>
                        ) : null}
                      </View>
                    </View>
                  );
                }
              })}
            </>
          ) : null}

          {/* ==================================== End Article ============================================== */}

          {/* ==================================== Created By ============================================== */}

          <View
            style={{
              marginTop: 20,
              marginHorizontal: 20,
              alignSelf: "auto",
              width: Dimensions.get("window").width * 0.9,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Text size={"small"} type={"regular"}>
                Created By
              </Text>
              <Text
                size={"small"}
                type={"bold"}
                style={{ marginLeft: 5 }}
                onPress={() => {
                  data.journal_byid.userby
                    ? data.journal_byid.userby.id !== setting?.user?.id
                      ? props.navigation.push("ProfileStack", {
                        screen: "otherprofile",
                        params: {
                          idUser: data.journal_byid.userby.id,
                        },
                      })
                      : props.navigation.push("ProfileStack", {
                        screen: "ProfileTab",
                      })
                    : Alert.alert("Journal By Funtravia");
                }}
              >
                {data.journal_byid && data.journal_byid.userby
                  ? data.journal_byid.userby
                  : "Funtravia"}
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text size={"small"} type={"bold"}>
                Copyright
              </Text>
              <Text size={"small"} type={"bold"} style={{ marginLeft: 5 }}>
                {data.journal_byid && data.journal_byid.date
                  ? data.journal_byid.date.substring(0, 4)
                  : null}
              </Text>
            </View>
          </View>
          <View
            style={{
              marginTop: 10,
              marginHorizontal: 20,
              borderBottomColor: "#f6f6f6",
              borderBottomWidth: 0.9,
            }}
          />

          {/* ==================================== List Comment ============================================== */}

          <View
            style={{ marginHorizontal: 20, marginTop: 10 }}
            onLayout={(event) => {
              const layout = event.nativeEvent.layout;
              setY(layout.y);
            }}
          >
            <View>
              <Text size={"label"} type={"bold"}>
                Comments
              </Text>
            </View>
          </View>
          {dataComment &&
            dataComment.comment_journal_list &&
            dataComment.comment_journal_list.length ? (
              <FlatList
                renderItem={renderComment}
                data={dataComment.comment_journal_list}
                keyExtractor={(dataComment) => dataComment.id}
                nestedScrollEnabled
                ListHeaderComponent={null}
                ListFooterComponent={null}
              />
            ) : (
              <View
                style={{
                  width: Dimensions.get("window").width * 0.9,
                  marginHorizontal: 20,
                  alignItems: "center",
                }}
              >
                <Text>{`${t("NoComment")}`}</Text>
              </View>
            )}
          {dataComment &&
            dataComment.comment_journal_list &&
            dataComment.comment_journal_list.length > 100 ? (
              <TouchableOpacity>
                <View
                  style={{
                    marginVertical: 20,
                    marginHorizontal: 20,
                  }}
                >
                  <Button
                    text={"Load More Comments"}
                    size="medium"
                    type="box"
                    color="black"
                    variant="bordered"
                    onPress={() => props.navigation.goBack()}
                    style={{
                      borderColor: "#464646",
                    }}
                  />
                </View>
              </TouchableOpacity>
            ) : null}
        </ScrollView>
      ) : null}
      {/* ==================================== Add Comment, Like and Unlike ============================================== */}
      {data && data.journal_byid ? (
        <AddCommentLike
          data={data.journal_byid}
          token={token}
          fetchData={(e) => fetchData(e)}
          listComment={() => afterComment()}
        />
      ) : null}
    </View>
  );
}
