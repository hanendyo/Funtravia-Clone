import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  Animated,
  Alert,
  RefreshControl,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { AsyncStorage } from "react-native";
import { PointIcon, CalendarIcon, Kosong } from "../../../assets/svg";
import {
  Container,
  Header,
  Tab,
  Tabs,
  ScrollableTab,
  List,
  ListItem,
} from "native-base";

import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

import SearchUserQuery from "../../../graphQL/Query/Search/SearchPeople";
import UnfollowMut from "../../../graphQL/Mutation/Profile/UnfollowMut";
import FollowMut from "../../../graphQL/Mutation/Profile/FollowMut";
import FriendList from "../../../component/src/FriendList";
import NotFound from "../../../component/src/notFound";

import { useTranslation } from "react-i18next";
import { Text, Button } from "../../../component";

export default function SearchPeople(props) {
  const { t, i18n } = useTranslation();

  const [token, setToken] = useState("");
  // console.log(token);
  const [selected, setSelected] = useState(new Map());
  const [selectedId, setSelectedId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const [selectedDestination, setSelectedDestination] = useState(new Map());
  const [followed, setFollowed] = useState(false);

  let searchUser = props.searchQueryFromMain || "a";
  const [
    querySearchUser,
    { loading: loadingUser, data: dataUser, error: errorUser },
  ] = useLazyQuery(SearchUserQuery, {
    variables: {
      keyword: searchUser && searchUser != null ? searchUser : "null",
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const [
    FollowMutation,
    { loading: loadFollowMut, data: dataFollowMut, error: errorFollowMut },
  ] = useMutation(FollowMut, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const [
    UnfollowMutation,
    { loading: loadUnfolMut, data: dataUnfolMut, error: errorUnfolMut },
  ] = useMutation(UnfollowMut, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const onSelect = React.useCallback(
    (id, status) => {
      const newSelected = new Map(selected);
      // const newSelectedStatus = new Map(selectedStatus);
      newSelected.set(id, !selected.get(id));
      newSelected.set(status, !selected.get(status));
      // console.log(typeof status);
      setSelectedStatus(status);
      console.log("bruh: " + typeof selectedStatus);
      console.log("brah: " + selectedStatus);

      {
        selectedStatus == "0" ? _follow(id) : _unfollow(id);
      }
      // {
      // 	if (selectedStatus === '0') {
      // 		_follow(id);
      // 	} else if (selectedStatus === '1') {
      // 		_unfollow(id);
      // 	} else {
      // 		return Alert.alert('error onSelection');
      // 	}
      // }

      // console.log('followed: ' + followed);
      // setFollowed(!followed);
      //console.log(id_post);
      console.log("afterSelect" + status);
      setSelected(newSelected);
      // console.log('STATUS: ' + status);
    },
    [selected]
  );

  if (dataUser) {
    // console.log('data awal waktu load: ', dataUser.user_search[0]);
  }
  if (loadingUser) {
    console.log("Loading Data User" + loadingUser);
  }
  if (errorUser) {
    console.log("error User " + errorUser);
  }

  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    if (tkn !== null) {
      setToken(tkn);
    } else {
      setToken("");
    }
    // console.log(token);
    querySearchUser();
    // console.log(dataUser);
  };

  // const FollowMutFunc = ({ followed, accountChoose }) => {
  // 	console.log(followed + ' in Function');
  // 	if (followed === false) {
  // 		FollowMutation({
  // 			variables: {
  // 				id: accountChoose,
  // 			},
  // 		});
  // 	} else if (followed === true) {
  // 		UnfollowMutation({
  // 			variables: {
  // 				id: accountChoose,
  // 			},
  // 		});
  // 	} else {
  // 		return null;
  // 	}
  // };

  useEffect(() => {
    loadAsync();
  }, []);

  const _unfollow = async (id) => {
    // console.log('get rekt' + typeof status);
    if (token || token !== "") {
      try {
        let response = await UnfollowMutation({
          variables: {
            id: id,
          },
        });
        if (loadUnfolMut) {
          Alert.alert("Loading!!");
        }
        if (errorUnfolMut) {
          throw new Error("Error Input");
        }

        console.log("for Unfollow:" + response);

        if (response.data) {
          if (
            response.data.unfollow_user.code === 200 ||
            response.data.unfollow_user.code === "200"
          ) {
            loadAsync();
            setSelectedStatus("0");
          } else {
            throw new Error(response.data.unfollow_user.message);
          }

          // Alert.alert('Succes');
        }
      } catch (error) {
        Alert.alert("" + error);
      }
    } else {
      Alert.alert("Please Login");
    }
  };

  const _follow = async (id) => {
    if (token || token !== "") {
      try {
        let response = await FollowMutation({
          variables: {
            id: id,
          },
        });
        if (loadFollowMut) {
          // Alert.alert('Loading!!');
        }
        if (errorFollowMut) {
          throw new Error("Error Input");
        }

        console.log("for Follow" + response.data.follow_user.message);
        if (response.data) {
          if (
            response.data.follow_user.code === 200 ||
            response.data.follow_user.code === "200"
          ) {
            loadAsync();
            setSelectedStatus("1");
            console.log("FOLLOWED AND SET STATE");
          } else {
            throw new Error(response.data.follow_user.message);
          }
        }
      } catch (error) {
        Alert.alert("" + error);
      }
    } else {
      Alert.alert("Please Login");
    }
  };

  return (
    <View
      style={{
        alignSelf: "center",
        justifyContent: "space-evenly",
        // marginTop: 10,
        height: Dimensions.get("window").height * 0.8,
      }}
    >
      {dataUser && dataUser.user_search.length ? (
        <View style={{ paddingStart: 20, paddingEnd: 20 }}>
          <List>
            <FriendList
              props={props}
              datanya={dataUser.user_search}
              token={token}
            />
          </List>
        </View>
      ) : (
        <View
          style={{
            height: "90%",
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          <NotFound wanted={t("user")} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
  },
  nextArrowView: {
    position: "absolute",
    right: 15,
    alignItems: "flex-end",
    height: 50,
    width: 50,
  },
  nextArrowImage: {
    resizeMode: "contain",
    height: 15,
    width: 15,
  },
  logOutView: {
    width: Dimensions.get("window").width - 30,
    alignSelf: "center",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  anotherNextArrowView: {
    position: "absolute",
    right: 0,
    alignItems: "flex-end",
    height: 50,
    width: 50,
  },
  rightText: {
    position: "absolute",
    right: -55,
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
    fontFamily: "lato-reg",
    color: "grey",
  },
});
