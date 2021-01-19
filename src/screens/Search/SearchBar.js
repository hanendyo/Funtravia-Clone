import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  FlatList,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import Modal from "react-native-modal";

import { search_button } from "../../assets/png";
import SearchTab from "./SearchTab";
import { useLazyQuery } from "@apollo/react-hooks";
import SearchDestinationQuery from "../../graphQL/Query/Search/SearchDestination";
import SearchAccommodationQuery from "../../graphQL/Query/Search/SearchAccommodation";
import SearchUserQuery from "../../graphQL/Query/Search/SearchPeople";
import SearchPostQuery from "../../graphQL/Query/Search/SearchPost";
import { Text } from "../../component";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SearchEventQuery from "../../graphQL/Query/Search/SearchEvent";

export default function SearchBar({
  props,
  navigation,
  route,
  suggestion,
  mainTheme,
  searchtoMainPage,
  // dataSearchtoMainPage,
}) {
  let [searchQuery, setSearchQuery] = useState(null);
  const initialArray = [];

  const { t, i18n } = useTranslation();
  const [searchEvent, setSearchEvent] = useState(initialArray);
  const [searchUser, setSearchUser] = useState(initialArray);
  const [searchDestination, setSearchDestination] = useState(initialArray);
  const [searchPost, setSearchPost] = useState(initialArray);
  const [search, setSearch] = useState(initialArray);
  const [searchText, setSearchText] = useState([]);
  let [searchCache, setSearchCache] = useState([]);
  let [sentSearch, setSentSearch] = useState("");
  const [input, setInput] = useState("");
  let [modalSearch, setModalSearch] = useState(false);

  const goSearchTab = async () => {
    if (!sentSearch.trim() || sentSearch.length == 0) {
      console.log("empty searchbar");
      Alert.alert("Please Fill The Search Bar");
    } else {
      // console.log('The Query Is: ' + sentSearch);
      const value = await AsyncStorage.getItem("searchCache");
      console.log("value: " + value);
      if (value && value != ("" || null || undefined)) {
        let parseArr = JSON.parse(value);
        parseArr.push(searchText);
        // console.log('parseArr: ' + parseArr);

        await AsyncStorage.setItem("searchCache", JSON.stringify(parseArr));
      } else {
        // console.log("it's empty");
        await AsyncStorage.setItem("searchCache", JSON.stringify([search]));
        // keepCache(searchCache);
      }

      navigation.navigate("SearchTab", {
        searchInput: sentSearch,
      });

      // await sendInitTab(tabTarget);
    }
  };

  const sendInitTab = async (number) => {
    // console.log('The Query Is: ' + search);
    const value = await AsyncStorage.getItem("searchCache");
    // console.log('value: ' + value);
    if (value) {
      let parseArr = JSON.parse(value);
      parseArr.push(search);
      // console.log('parseArr: ' + parseArr);

      await AsyncStorage.setItem("searchCache", JSON.stringify(parseArr));
    } else {
      // console.log("it's empty");
      await AsyncStorage.setItem("searchCache", JSON.stringify(search));
      // keepCache(searchCache);
    }
    await props.navigation.navigate("SearchTab", {
      initTab: number,
      searchInput: sentSearch,
    });
  };

  // START OF SEARCH FUNCTION

  const [
    querySearchDestination,
    {
      loading: loadingDestination,
      data: dataDestination,
      error: errorDestination,
    },
  ] = useLazyQuery(SearchDestinationQuery);
  const [
    querySearchPost,
    { loading: loadingPost, data: dataPost, error: errorPost },
  ] = useLazyQuery(SearchPostQuery);
  const [
    querySearchEvent,
    { loading: loadingEvent, data: dataEvent, error: errorEvent },
  ] = useLazyQuery(SearchEventQuery);
  // const [
  // 	querySearchAccommodation,
  // 	{
  // 		loading: loadingAccommodation,
  // 		data: dataAccommodation,
  // 		error: errorAccommodation,
  // 	},
  // ] = useLazyQuery(SearchAccommodationQuery);

  const [
    querySearchUser,
    { loading: loadingUser, data: dataUser, error: errorUser },
  ] = useLazyQuery(SearchUserQuery);

  const searchInput = async (text) => {
    setSearchText(text);
    try {
      let response = await querySearchDestination({
        variables: {
          keyword: text,
          type: [],
        },
      });

      querySearchUser({
        variables: {
          keyword: text,
        },
      });

      if (errorDestination || errorPost || errorUser || errorEvent) {
        setSearch([]);
      }
      if (dataDestination) {
        setSearchDestination([
          ...searchDestination,
          dataDestination.destinationSearch,
        ]);
        // console.log('data User: ' + dataUser.user_search);
        // console.log(
        // 	'data hasil Destination: ',
        // 	dataDestination.destinationSearch,
        // 	'\n\n',
        // 	typeof searchDestination,
        // );
      }
      // 	console.log(
      // 		'data hasil search: ',
      // 		searchDestination,
      // 		'\n\n',
      // 		typeof searchDestination,
      // 	);
      // 	// setSearch([...search, searchDestination]);
      // 	// console.log('data Dest: ' + search);
      // 	// console.log('searchResult: ' + searchDestination.id);
      // }
      else if (dataUser) {
        setSearchUser([...searchUser, dataUser.user_search]);
        // console.log('data User: ' + dataUser.user_search);
        // console.log(
        // 	'data hasil User: ',
        // 	dataUser.user_search,
        // 	'\n\n',
        // 	typeof searchUser,
        // );
      } else if (dataUser || dataDestination == "") {
        setSearchUser(null);
        setSearchDestination(null);
        setSearch(null);
        console.log("cleared autocomplete, query not found!");
      }
    } catch (error) {
      Alert.alert("" + error);
    }
  };

  // END OF SEARCH FUNCTION
  return (
    <View>
      {mainTheme ? (
        <View
          style={{
            alignContent: "center",
            alignItems: "flex-end",
          }}
        >
          <View
            style={{
              marginTop: 10,
              width: Dimensions.get("screen").width * 0.9,
              flexDirection: "row",
              borderBottomWidth: 2,
              borderBottomColor: "#209FAE",
              justifyContent: "flex-start",
              alignSelf: "center",
            }}
          >
            <Image
              source={search_button}
              imageStyle={{ resizeMode: "cover" }}
              style={{
                height: 15,
                width: 15,
                alignSelf: "center",
                zIndex: 100,
              }}
            />
            <TextInput
              value={input}
              style={{
                height: 38,
                width: Dimensions.get("window").width * 0.9,
                paddingLeft: 5,
                textAlign: "left",
                fontSize: 10,
              }}
              underlineColorAndroid="transparent"
              // onKeyPress={({ nativeEvent }) => {
              // 	nativeEvent.key === 'Backspace' ? searchInput(null) : null;
              // }}
              onChangeText={(text) => {
                setInput(text);
                setSearchQuery(text);
                setSentSearch(text);
                setSearchText(text);
                searchtoMainPage(text);
              }}
              onSubmitEditing={goSearchTab}
              placeholder={t("searchHome")}
            />
          </View>
        </View>
      ) : (
        <View
          style={{
            // backgroundColor: 'cyan',
            alignContent: "center",
            alignItems: "flex-end",
          }}
        >
          <View
            style={{
              marginTop: 10,
              // backgroundColor: 'lightblue',
              width: Dimensions.get("screen").width * 0.9,
              flexDirection: "row",
              borderWidth: 1,
              borderRadius: 2,
              // borderBottomColor: '#209FAE',
              justifyContent: "flex-start",
              alignSelf: "center",
              borderColor: "#E8E8E8",
              backgroundColor: "#F4F4F4",
            }}
          >
            <Image
              source={search_button}
              imageStyle={{ resizeMode: "cover" }}
              style={{
                marginLeft: 5,
                height: 15,
                width: 15,
                alignSelf: "center",
                zIndex: 100,
              }}
            />
            <TextInput
              value={input}
              style={{
                height: 38,
                width: Dimensions.get("window").width * 0.9,
                paddingLeft: 5,
                textAlign: "left",
                fontSize: 10,
              }}
              underlineColorAndroid="transparent"
              // onKeyPress={({ nativeEvent }) => {
              // 	nativeEvent.key === 'Backspace' ? searchInput(null) : null;
              // }}
              onChangeText={(text) => {
                setInput(text);
                setSearchQuery(text);
                setSentSearch(text);
                // setSearchText(text)
              }}
              onSubmitEditing={goSearchTab}
              placeholder={t("searchHome")}
            />
          </View>
        </View>
      )}

      {/* implementation of autocomplete Flatlist, **STILL BORKED** */}
      {suggestion && searchText && searchText.length > 0 ? (
        <View
          style={{
            alignContent: "center",
            alignSelf: "center",
            width: "100%",
            elevation: 1000,
            zIndex: 1000000,
          }}
        >
          <TouchableOpacity
            style={{
              // backgroundColor: 'grey',
              borderColor: "#F0F0F0",
              borderWidth: 1,
              width: "100%",
              padding: 10,
            }}
            onPress={() => sendInitTab(0)}
          >
            <Text size="small" type="regular">
              {`Search ${input} at Destination`}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              // backgroundColor: 'grey',
              borderColor: "#F0F0F0",
              borderWidth: 1,
              width: "100%",
              padding: 10,
            }}
            onPress={() => sendInitTab(1)}
          >
            <Text size="small" type="regular">
              {`Search ${input} at People`}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              // backgroundColor: 'grey',
              borderColor: "#F0F0F0",
              borderWidth: 1,
              width: "100%",
              padding: 10,
            }}
            onPress={() => sendInitTab(2)}
          >
            <Text size="small" type="regular">
              {`Search ${input} at Feed`}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              // backgroundColor: 'grey',
              borderColor: "#F0F0F0",
              borderWidth: 1,
              width: "100%",
              padding: 10,
            }}
            onPress={() => sendInitTab(3)}
          >
            <Text size="small" type="regular">
              {`Search ${input} at Event`}
            </Text>
          </TouchableOpacity>
          <FlatList
            style={{
              // position: 'absolute',
              // top: 60,
              width: "100%",
              maxHeight: Dimensions.get("screen").width - 50,
            }}
            inverted
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => `${index}`}
            data={
              // search &&
              // ||
              searchDestination
              // searchPost &&
              // searchEvent ||
              // searchUser
            }
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={{
                  borderColor: "grey",
                  // borderColor: 'green',
                  borderWidth: 1,
                  width: "100%",
                  padding: 10,
                  flexDirection: "row",
                }}
                onPress={() => {
                  // setResult(item.id, item.name),
                  console.log(item[index]);
                  //goSearchTab(1);
                  setSearchQuery(item);

                  // sendInitTab(0);
                }}
              >
                <Text>dari search Destination </Text>
                <Text size="small" type="regular">
                  {item ? item[0].name : null}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      ) : (
        <View></View>
      )}
    </View>
  );
}
