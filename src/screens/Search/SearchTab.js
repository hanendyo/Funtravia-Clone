import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { back_arrow_white } from "../../assets/png";
import { PointIcon, CalendarIcon } from "../../assets/svg";
import { Container, Header, Tab, Tabs, ScrollableTab } from "native-base";
import {
  //   SearchAccommodation,
  SearchDestination,
  SearchFeed,
  SearchPeople,
  SearchEvent,
} from "./SearchTabs";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";

import SearchBar from "./SearchBar";
import { Text } from "../../component";
import { useTranslation } from "react-i18next";

export default function SearchTab(props) {
  const { t, i18n } = useTranslation();

  // let searchResult = props.searchQueryFromMain;
  let sentInitTab = props.route.params.initTab ? props.route.params.initTab : 0;
  // console.log('poof', sentInitTab);
  // console.log(searchResult);
  let [preview, setPreview] = useState("list");

  let [token, setToken] = useState("");

  let [initTab, setInitTab] = useState(sentInitTab);
  let [input, setInput] = useState(props.route.params.searchInput);
  let refreshOrder = true;
  const HeaderComponent = {
    headerTitle: (
      <Text size="header" style={{ color: "#fff" }}>
        {t("search")}
      </Text>
    ),
    headerStyle: {
      elevation: 0,
      borderBottomWidth: 0,
      backgroundColor: "#209FAE",
    },
    headerTitleStyle: { color: "white" },
    headerLeft: () => (
      <TouchableOpacity
        onPress={() =>
          props.navigation.navigate("SearchPage", { refresh: refreshOrder })
        }
      >
        <Image
          style={{ width: 20, height: 20 }}
          imageStyle={{ width: 20, height: 20, resizeMode: "contain" }}
          source={back_arrow_white}
        />
      </TouchableOpacity>
    ),
    headerLeftContainerStyle: {
      paddingLeft: 20,
    },
    headerRight: null,
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
  }, []);

  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    // console.log(tkn);
    if (tkn !== null) {
      setToken(tkn);
      // console.log('TOKENI: ' + token);
    } else {
      setToken("");
    }

    // setToken(tkn);
  };
  const queryFromSearch = (data) => {
    console.log("dataInput:  ", data);
    setInput(data);
    console.log("input after Tab:", input);
  };

  return (
    <KeyboardAvoidingView
      contentContainerStyle={styles.main}
      behavior={"height"}
      keyboardVerticalOffset={null}
    >
      <ScrollView nestedScrollEnabled={true}>
        <View style={{ alignSelf: "center" }}>
          {/* <SearchBar
            props
            navigation={props.navigation}
            suggestion={false}
            searchtoMainPage={(dataSearchtoMainPage) =>
              queryFromSearch(dataSearchtoMainPage)
            }
            mainTheme={false}
          /> */}
          <SearchBar
            // props={{ route }}
            // route={route}
            navigation={props.navigation}
            mainTheme={false}
            suggestion={false}
            searchtoMainPage={(dataSearchtoMainPage) =>
              queryFromSearch(dataSearchtoMainPage)
            }
          />
        </View>

        <View style={styles.tabView}>
          <Tabs
            initialPage={initTab}
            //Start of native-base library use for tabbing
            renderTabBar={() => (
              <ScrollableTab
                // tabStyle={{ backgroundColor: "transparent" }}
                tabsContainerStyle={{ backgroundColor: "white" }}
                underlineStyle={{
                  borderColor: "#209FAE",
                  backgroundColor: "#209FAE",
                }}
              />
            )}
          >
            <Tab
              heading="Destination"
              tabStyle={{ backgroundColor: "transparent" }}
              activeTabStyle={{ backgroundColor: "transparent" }}
              textStyle={styles.tabFont}
              activeTextStyle={{ fontFamily: "Lato-Bold", color: "#209FAE" }}
            >
              <SearchDestination
                navigation={props.navigation}
                searchQueryFromMain={
                  input && input !== ("" || undefined || null) ? input : null
                }
              />
            </Tab>

            <Tab
              heading="People"
              tabStyle={{ backgroundColor: "transparent" }}
              activeTabStyle={{ backgroundColor: "transparent" }}
              textStyle={styles.tabFont}
              activeTextStyle={{ fontFamily: "Lato-Bold", color: "#209FAE" }}
            >
              <SearchPeople
                navigation={props.navigation}
                searchQueryFromMain={
                  input && input !== ("" || undefined || null) ? input : null
                }
              />
            </Tab>
            <Tab
              heading="Feed"
              tabStyle={{ backgroundColor: "transparent" }}
              activeTabStyle={{ backgroundColor: "transparent" }}
              textStyle={styles.tabFont}
              activeTextStyle={{ fontFamily: "Lato-Bold", color: "#209FAE" }}
            >
              <SearchFeed
                navigation={props.navigation}
                searchQueryFromMain={
                  input && input !== ("" || undefined || null) ? input : null
                }
              />
            </Tab>
            <Tab
              heading="Event"
              tabStyle={{ backgroundColor: "transparent" }}
              activeTabStyle={{ backgroundColor: "transparent" }}
              textStyle={styles.tabFont}
              activeTextStyle={{ fontFamily: "Lato-Bold", color: "#209FAE" }}
            >
              <SearchEvent
                navigation={props.navigation}
                searchQueryFromMain={
                  input && input !== ("" || undefined || null) ? input : null
                }
                // dataPrev={preview}
              />
            </Tab>
          </Tabs>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

SearchTab.navigationOptions = ({ navigation }) => ({
  headerTitle: "Search",
  headerLeft: () =>
    Image({
      style: { width: 20, height: 20 },
      imageStyle: { width: 20, height: 20, resizeMode: "contain" },
      isTouchable: true,
      onPress: () => navigation.goBack(),
      source: back_arrow_white,
    }),
  headerLeftContainerStyle: {
    paddingLeft: 20,
  },
  headerRight: null,
});
const styles = StyleSheet.create({
  main: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
    alignContent: "center",
    width: Dimensions.get("window").width * 0.9,
    backgroundColor: "#F1F1F1",
  },
  tabView: {
    marginTop: 15,
    flex: 1,
    justifyContent: "center",
    width: Dimensions.get("window").width,
    backgroundColor: "#F1F1F1",
  },
  tabFont: {
    fontFamily: "Lato-Bold",
    color: "#6C6C6C",
    fontSize: 12,
  },
});
