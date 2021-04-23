// DO NOT DELETE, OLD SEARCH PAGE

import React, { useState, useEffect, useCallback, Component } from "react";
import {
  View,
  StyleSheet,
  Alert,
  ImageBackground,
  Dimensions,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Pressable,
  Image,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import {
  default_image,
  search_button,
  back_arrow_white,
  closeCircle,
} from "../../assets/png";
import FollowerQuery from "../../graphQL/Query/Profile/Follower";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import { HotelIcon, PlaneHotel, Plane, Train, Xgray } from "../../assets/svg";
import AutocompleteTest from "./SearchBar";
import { Item, List, ListItem } from "native-base";
import SearchUserQuery from "../../graphQL/Query/Search/SearchPeople";
import FollowMut from "../../graphQL/Mutation/Profile/FollowMut";
import UnfollowMut from "../../graphQL/Mutation/Profile/UnfollowMut";
import BerandaPopuler from "../../graphQL/Query/Home/BerandaPopuler";
import { Text } from "../../component";
import { useTranslation } from "react-i18next";
import SearchBar from "./SearchBar";
import FriendList from "../../component/src/FriendList";
import { useIsFocused } from "@react-navigation/native";

export default function SearchPage(props, { navigation, route }) {
  const { t, i18n } = useTranslation();
  const isFocused = useIsFocused();
  // console.log('data Search: ', dataFromSearchBar);
  const [selected, setSelected] = useState(new Map());
  const [selectedDestination, setSelectedDestination] = useState(new Map());
  const [followed, setFollowed] = useState(false);
  let [search, setSearch] = useState("");
  let [accountChoose, setAccountChoose] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  let [token, setToken] = useState("");
  const viewWidth = Dimensions.get("window").width * 0.9;
  let [searchCache, setSearchCache] = useState();
  let [input, setInput] = useState("");
  let [passedArr, setPassedArr] = useState([]);

  let [refresh, setRefresh] = useState(false);
  const HeaderComponent = {
    headerTitle: "Search",
    headerTitleStyle: { color: "white" },
    headerStyle: {
      elevation: 0,
      borderBottomWidth: 0,
      backgroundColor: "#209FAE",
    },
    headerLeft: () => (
      <TouchableOpacity onPress={() => props.navigation.goBack()}>
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

  const onRefresh = () => {
    wait(10).then(() => setRefresh(false));
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
  }, []);

  const onSelectDestination = (item) => {
    // props.navigation.navigate("CountryStack",{screen:"CityDetail", params:{ data: item, exParam: true }});

    props.navigation.navigate("detailStack", {
      id: item.id,
      name: item.name,
    });
  };

  const userFromSearch = (data) => {
    console.log("kek:  ", data);
    setInput(data);
  };

  const cacheAsync = async (token) => {
    let seacac = await AsyncStorage.getItem("searchCache");
    // console.log('typeSearchResult ' + typeof seacac);
    let parseArr = JSON.parse(seacac);
    // console.log('typeSearchResult ' + parseArr.slice(0, 5));
    console.log("ParseArr:", parseArr);
    let filterArr = parseArr.filter(function(fil) {
      return fil !== (" " || null || undefined);
    });
    let limitArr = filterArr.slice(-6);
    console.log("LIMIT ARR", limitArr);
    let reverseArr = limitArr.reverse();
    console.log("REVERSE ARRAY", reverseArr);
    setSearchCache(reverseArr);
  };

  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    // console.log(tkn);
    if (tkn !== null) {
      setToken(tkn);
      // console.log('TOKENO: ', token);
    } else {
      setToken("");
    }
    cacheAsync(token);
    querySearchUser();
  };

  useEffect(() => {
    loadAsync();

    querySearchUser;
  }, []);

  const [
    querySearchUser,
    { loading: loadingUser, data: dataUser, error: errorUser },
  ] = useLazyQuery(SearchUserQuery, {
    variables: {
      keyword: input,
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  useEffect(() => {
    props.navigation.addListener("focus", () => {
      setPassedArr(null);
      setInput(null);
      cacheAsync();
      userFromSearch("");
    });
  }, [navigation]);

  // if (dataUser) {
  // 	console.log('dataUser:  ', dataUser);
  // }

  const {
    data: dataCityPopuler,
    loading: loadingCityPopuler,
    error: errorCityPopuler,
  } = useQuery(BerandaPopuler);

  let beranda_popularV2 = [];
  if (dataCityPopuler && dataCityPopuler.beranda_popularV2) {
    beranda_popularV2 = dataCityPopuler.beranda_popularV2;
  }
  console.log(beranda_popularV2);
  const toUser = () => {
    props.navigation.navigate("SearchPeople");
  };

  const RenderPopularDestination = ({ item }) => {
    return (
      <TouchableOpacity
        // onPress={() => props.navigation.navigate(`${value.name} `)}
        onPress={(id_city) => onSelectDestination(item)}
        style={{
          backgroundColor: "#f1f1f1",
          borderRadius: 42,
          paddingHorizontal: 20,
          paddingVertical: 5,
          margin: 2.5,
        }}
      >
        <Text size="small" key={item.id}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const RenderSearchCacheResult = ({ item, index }) => {
    return (
      <View
        style={{
          backgroundColor: "#f1f1f1",
          borderRadius: 42,
          paddingHorizontal: 10,
          paddingVertical: 5,
          margin: 2.5,
          flexDirection: "row",
          justifyContent: "space-around",
          alignContent: "space-around",
        }}
      >
        <TouchableOpacity
          // onPress={() => props.navigation.navigate(`${value.name} `)}
          onPress={() => {
            props.navigation.navigate("SearchTab", {
              searchInput: item,
            });
          }}
        >
          <Text size="small" key={index}>
            {item}
          </Text>
        </TouchableOpacity>
        <Pressable
          onPress={() => {
            console.log("index", index);
            _clearSpecificAsyncStorage(index, item);
          }}
          style={{
            // position: 'absolute',
            // right: 10,
            height: 15,
            width: 15,
            borderRadius: 15,
            // borderColor: 'black',
            // borderWidth: 1,
            alignContent: "center",
            justifyContent: "center",
            // alignSelf: 'center',
            marginLeft: 10,
            // paddingRight: 15,
          }}
        >
          <Image
            source={closeCircle}
            resizeMode="contain"
            style={{
              height: 17,
              width: 17,
              alignSelf: "center",
              justifyContent: "center",
            }}
          />
        </Pressable>
      </View>
    );
  };

  const _clearAsyncStorage = async () => {
    console.log(AsyncStorage.getItem("searchCache"));
    AsyncStorage.removeItem("searchCache");
    console.log("is it cleared? ", AsyncStorage.getItem("searchCache"));
    setSearchCache(null);
  };

  const _clearSpecificAsyncStorage = async (index) => {
    let seacac = await AsyncStorage.getItem("searchCache");

    let parseArr = JSON.parse(seacac);
    let filterArr = parseArr.filter(function(fil) {
      return fil !== (" " || null || undefined);
    });
    let limitArr = filterArr.slice(-6);
    console.log("LIMIT ARR", limitArr);
    let reverseArr = limitArr.reverse();
    console.log("REVERSE ARRAY", reverseArr);
    let deleteArr = reverseArr.slice(index, index + 1);
    let deleteArrStr = deleteArr.toString();
    console.log("The Chosen One: " + deleteArrStr);
    let remainArr = reverseArr.filter((e) => e != deleteArrStr);
    console.log("Remaining: " + remainArr);

    setSearchCache(remainArr);
    await AsyncStorage.setItem("searchCache", JSON.stringify(remainArr));
    // console.log('BOOOOOO:   ', AsyncStorage.getItem('searchCache'));

    // console.log('is it cleared? ', AsyncStorage.getItem('searchCache'));
  };

  return (
    <KeyboardAvoidingView
      contentContainerStyle={styles.main}
      behavior={"height"}
      keyboardVerticalOffset={null}
    >
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
        }
        contentContainerStyle={{
          width: viewWidth,
          alignSelf: "center",
        }}
      >
        <View
          style={{
            justifyContent: "space-evenly",
          }}
        >
          <View
            style={{
              alignContent: "center",
              alignItems: "flex-end",
              backgroundColor: "#F1F1F1",
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
                onKeyPress={(e) => {
                  e.key === "Backspace" ? searchInput("") : null;
                }}
                enablesReturnKeyAutomatically={true}
                onChangeText={(text) => {}}
                // onSubmitEditing={goSearchTab}
                placeholder={t("searchHome")}
              />
            </View>
          </View>
          <SearchBar
            // props={{ route }}
            route={route}
            navigation={props.navigation}
            suggestion={true}
            mainTheme={true}
            searchtoMainPage={(dataSearchtoMainPage) =>
              userFromSearch(dataSearchtoMainPage)
            }
            initialTextFromMain={input}
            initialArrayFromMain={passedArr}
            // dataSearchtoMainPage={input}
          />

          <View style={{ marginTop: 20, marginBottom: 15 }}>
            {searchCache ? (
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    width: viewWidth,
                    justifyContent: "space-between",
                    alignContent: "flex-end",
                    // borderBottomWidth: 1,
                  }}
                >
                  <Text
                    // size='description'
                    type="regular"
                    style={{
                      // fontFamily: "Lato-Regular",
                      textAlign: "left",
                    }}
                  >
                    {t("recent")}
                  </Text>
                  <TouchableOpacity onPress={() => _clearAsyncStorage()}>
                    <Text
                      type="bold"
                      size="small"
                      style={{
                        // fontFamily: "Lato-Bold",
                        textAlign: "right",
                        color: "#5092D0",
                        // fontSize: 11,
                      }}
                    >
                      Clear All
                    </Text>
                  </TouchableOpacity>
                </View>
                <ScrollView>
                  <FlatList
                    contentContainerStyle={{
                      // flexDirection: 'row',
                      marginTop: 5,
                      alignItems: "flex-start",
                    }}
                    // horizontal={true}
                    data={searchCache}
                    renderItem={({ item, index }) => (
                      <RenderSearchCacheResult item={item} index={index} />
                    )}
                    // inverted
                    keyExtractor={(item) => item.index}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    extraData={selected}
                    numColumns={3}
                  />
                </ScrollView>
              </View>
            ) : null}
            <View>
              <View
                style={{
                  flexDirection: "row",
                  width: viewWidth,
                  justifyContent: "space-between",
                  alignContent: "flex-end",
                }}
              >
                <Text
                  // size='description'
                  type="regular"
                  style={{
                    // fontFamily: "Lato-Regular",
                    textAlign: "left",
                  }}
                >
                  {t("popularDestination")}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    props.navigation.navigate("CountryStack", {
                      screen: "AllDestination",
                    })
                  }
                >
                  <Text
                    type="bold"
                    size="small"
                    style={{
                      // fontFamily: "Lato-Bold",
                      textAlign: "right",
                      color: "#5092D0",
                    }}
                  >
                    {t("others")}
                  </Text>
                </TouchableOpacity>
              </View>

              {loadingCityPopuler ? (
                <ActivityIndicator
                  animating={loadingCityPopuler}
                  size="large"
                  color="#209fae"
                />
              ) : (
                <View
                  style={{
                    width: "100%",
                    flexWrap: "wrap",
                    flexDirection: "row",
                    paddingHorizontal: 10,
                    borderWidth: 1,
                  }}
                >
                  {beranda_popularV2.map((value, index) => {
                    <RenderPopularDestination item={value} />;

                    // <TouchableOpacity
                    //   onPress={() => onSelectDestination(item)}
                    //   style={{
                    //     backgroundColor: "#f1f1f1",
                    //     borderRadius: 42,
                    //     paddingHorizontal: 20,
                    //     paddingVertical: 5,
                    //     margin: 2.5,
                    //   }}
                    // >
                    //   <Text size="small">{value.name}</Text>
                    // </TouchableOpacity>;
                  })}
                </View>
                // <FlatList
                //   contentContainerStyle={{
                //     flexDirection: "row",

                //     marginTop: 12,
                //     alignItems: "flex-start",
                //   }}
                //   horizontal={true}
                //   data={beranda_popularV2}
                //   renderItem={({ item, index }) => (
                //     <RenderPopularDestination item={item} />
                //   )}
                //   keyExtractor={(item) => item.id}
                //   showsHorizontalScrollIndicator={false}
                //   extraData={selected}
                // />
              )}
            </View>
          </View>
          <>
            <View
              style={{
                flexDirection: "row",
                // width: viewWidth + 10,
                justifyContent: "space-between",
                //paddingTop: 40,
              }}
            >
              <Text type="regular" style={{ textAlign: "left" }}>
                {t("people")}
              </Text>
            </View>

            {dataUser ? (
              <View>
                <List>
                  <FriendList
                    props={props}
                    datanya={dataUser ? dataUser.user_search : null}
                    token={token}
                  />
                </List>
              </View>
            ) : null}
          </>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    // justifyContent: 'flex-start',
    alignContent: "center",
    alignSelf: "center",
    width: Dimensions.get("window").width * 0.9,
    height: Dimensions.get("window").height,
    paddingHorizontal: 10,
    // marginTop: 1000,
    backgroundColor: "#FFFFFF",
  },
  rightText: {
    position: "absolute",
    right: -45,
    height: 50,
    width: 150,
    justifyContent: "center",
    alignContent: "center",
  },
  halfButton: {
    width: Dimensions.get("window").width / 3.8,
    borderTopLeftRadius: 23,
    borderTopRightRadius: 23,
    borderBottomLeftRadius: 23,
    borderBottomRightRadius: 23,
    height: 30,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "grey",
  },
  buttonTextStyle: {
    fontSize: 12,
    fontFamily: "Lato-Regular",
    color: "grey",
  },
});
