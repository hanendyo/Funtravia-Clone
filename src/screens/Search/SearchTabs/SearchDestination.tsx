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
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { Source } from "graphql";

import SearchDestinationQuery from "../../../graphQL/Query/Search/SearchDestination";

import NotFound from "../../../component/src/notFound";
import { useTranslation } from "react-i18next";
import { Text, Button, FunIcon, Loading } from "../../../component";
import ListRenderDestination from "../../../component/src/DestinationList";

export default function SearchDestination(props, searchQueryFromMain) {
  const { t, i18n } = useTranslation();

  let [token, setToken] = useState("");
  // let [searchDest, setSearchDest] = useState(props.searchQueryFromMain);
  let searchDest = props.searchQueryFromMain;
  console.log("Search Query From Main Destination:::    ", searchDest);
  const [
    querySearchDestination,
    {
      loading: loadingDestination,
      data: dataDestination,
      error: errorDestination,
    },
  ] = useLazyQuery(SearchDestinationQuery, {
    fetchPolicy: "network-only",
    variables: {
      keyword: searchDest && searchDest != null ? searchDest : "null",
      type: [],
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token?`Bearer ${token}`:null,
      },
    },
  });

  if (loadingDestination) {
  }
  if (errorDestination) {
    // console.log('error Destination ' + errorDestination);
  }
  if (dataDestination) {
    // console.log('DATA ADA OI');
  }

  useEffect(() => {
    loadAsync();
  }, []);

  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    // console.log(tkn);
    if (tkn !== null) {
      setToken(tkn);
    } else {
      setToken("");
    }
    querySearchDestination();
  };

  return (
    <ScrollView>
      <View
        style={{
          alignSelf: "center",
          justifyContent: "space-evenly",
          // marginTop: 10,
          // height: Dimensions.get('window').height * 0.8,
        }}
      >
        {dataDestination !== (null || undefined) &&
        dataDestination &&
        dataDestination.destinationSearch.length ? (
          <ListRenderDestination
            props={props}
            route={props.route}
            datanya={dataDestination.destinationSearch}
            token={token}
            itin={false}
          />
        ) : (
          <View
            style={{
              height: Dimensions.get("window").height * 0.8,
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <NotFound wanted={t("destination")} />
          </View>
        )}
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  main: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
  },
  lightFont: {
    fontFamily: "lato-light",
    fontSize: 10,
  },
  boldFont: {
    fontFamily: "Lato-Bold",
    fontSize: 10,
  },
  languageButton: {
    height: 30,
    width: 100,
    marginRight: 5,
    backgroundColor: "#F1F1F1",
    borderColor: "#F1F1F1",
    borderWidth: 1,
  },
  langButtonFont: {
    fontSize: 12,
  },
});
