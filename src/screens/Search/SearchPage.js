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

export default function SearchPage(props, { navigation, route }) {
  const { t, i18n } = useTranslation();
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

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
  }, []);

  const onSelectDestination = (item) => {
    props.navigation.navigate("CityDetail", { data: item, exParam: true });
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
    console.log(parseArr);
    let filterArr = parseArr.filter(function (fil) {
      return fil !== (" " || null || undefined);
    });
    limitArr = filterArr.slice(-6);
    console.log("LIMIT ARR", limitArr);
    reverseArr = limitArr.reverse();
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

  // if (dataUser) {
  // 	console.log('dataUser:  ', dataUser);
  // }

  const {
    data: dataBerandaPopuler,
    loading: loadingBerandaPopuler,
    error: errorBerandaPopuler,
  } = useQuery(BerandaPopuler);

  // if (dataUser) {
  // 	console.log(dataUser);
  // }
  // if (loadingUser) {
  // 	console.log('Loading Data User' + loadingUser);
  // }
  // if (errorUser) {
  // 	console.log('error User ' + errorUser);
  // }

  const toPage = () => {
    props.navigation.navigate("destinationDetail", {
      search: search,
    });
    // props.navigation.navigate('INSERT PAGE HERE')
  };

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
    console.log("SearchResult: " + parseArr);
    let cacheArr = parseArr.slice(-5);
    console.log("cacheSearchResult: " + cacheArr);
    let deleteArr = cacheArr.slice(index, index + 1);
    let deleteArrStr = deleteArr.toString();
    console.log("The Chosen One: " + deleteArrStr);
    let remainArr = cacheArr.filter((e) => e != deleteArrStr);
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
          <SearchBar
            // props={{ route }}
            route={route}
            navigation={props.navigation}
            suggestion={true}
            mainTheme={true}
            searchtoMainPage={(dataSearchtoMainPage) =>
              userFromSearch(dataSearchtoMainPage)
            }
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
              {dataBerandaPopuler ? (
                <>
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
                        props.navigation.navigate("AllDestination")
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

                  <FlatList
                    contentContainerStyle={{
                      flexDirection: "row",

                      marginTop: 12,
                      alignItems: "flex-start",
                    }}
                    horizontal={true}
                    data={
                      dataBerandaPopuler &&
                      dataBerandaPopuler.beranda_popularV2.length
                        ? dataBerandaPopuler.beranda_popularV2
                        : null
                    }
                    renderItem={({ item, index }) => (
                      <RenderPopularDestination item={item} />
                    )}
                    keyExtractor={(item) => item.id}
                    showsHorizontalScrollIndicator={false}
                    extraData={selected}
                  />
                </>
              ) : null}
            </View>
          </View>

          {/* <View
						style={{
							flexDirection: 'row',
							width: viewWidth,
							justifyContent: 'space-between',
						}}>
						<Text type='regular' style={{ textAlign: 'left' }}>
							{t('ticketAndAccommodation')}
						</Text>
						<Text
							type='bold'
							size='small'
							style={{
								// fontFamily: "Lato-Bold",
								textAlign: 'right',
								color: '#5092D0',
								// fontSize: 11,
							}}>
							{t('others')}
						</Text>
					</View>
					<View
						style={{
							marginTop: -20,
							width: viewWidth,
							// backgroundColor: 'green',
						}}>
						<Menu props={props} />
					</View> */}
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
