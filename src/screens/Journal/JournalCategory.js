import { Thumbnail, View } from "native-base";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  FlatList,
  Pressable,
  Alert,
} from "react-native";
import { Text, Button } from "../../component";
import { default_image, logo_funtravia } from "../../assets/png";
import { Arrowbackwhite, LikeEmpty, Search } from "../../assets/svg";
import PopularJournal from "../../graphQL/Query/Journal/PopularJournal";
import JournalList from "../../graphQL/Query/Journal/JournalList";
import { useLazyQuery } from "@apollo/react-hooks";
import { Loading, Truncate } from "../../component";
import { dateFormatMonthYears } from "../../component/src/dateformatter";
import { useTranslation } from "react-i18next";
import Category from "../../graphQL/Query/Itinerary/ItineraryCategory";
import { TextInput } from "react-native-gesture-handler";

export default function JournalCategory(props) {
  let [category, setCategory] = useState(props.route.params.category);
  console.log("category", category);
  const HeaderComponent = {
    headerShown: true,
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: "Travel Journal",
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
    variables: {
      category_id: category,
      order: "",
    },
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
      },
    },
  });

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

  const refresh = () => {
    fetchDataPopuler();
    fetchDataList();
  };

  const renderList = ({ item, index }) => {
    return (
      <View>
        <Pressable
          style={{ flexDirection: "row" }}
          onPress={() => JournalDetail(item)}
        >
          <Image
            source={item.firstimg ? { uri: item.firstimg } : default_image}
            style={{
              width: "24%",
              height: 110,
              borderRadius: 10,
            }}
          />
          <View
            style={{
              width: "76%",
              marginVertical: 5,
              paddingLeft: 10,
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text style={{ color: "#209FAE" }} size={"small"} type={"bold"}>
                #{item?.categori?.name}
              </Text>
              <Text
                size={"label"}
                type={"bold"}
                style={{ color: "#3E3E3E", marginTop: 5 }}
              >
                <Truncate text={item.title ? item.title : ""} length={40} />
              </Text>
              <Text
                size={"small"}
                type={"regular"}
                style={{ textAlign: "justify", marginTop: 5 }}
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
        </Pressable>
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
      fetchCategory();
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
          height: 100,
        }}
      >
        <View
          style={{
            height: "50%",
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 2,
          }}
        >
          {/* <Search
            style={{
              position: "absolute",
              borderWidth: 1,
              justifyContent: "center",
              height: "100%",
            }}
          /> */}
          <TextInput
            style={{ backgroundColor: "#DAF0F2" }}
            placeholder="Search"
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
      {dataList && dataList.journal_list.length > 0 ? (
        <View
          style={{
            flex: 1,
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
            showsVerticalScrollIndicator={false}
          />
        </View>
      ) : (
        <View style={{ alignItems: "center", marginTop: 10 }}>
          <Text>Tidak Ada Data</Text>
        </View>
      )}
    </View>
  );
}
