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

import {
  PointIcon,
  CalendarIcon,
  Star,
  Kosong,
  LikeEmptynew,
} from "../../../assets/svg";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { Source } from "graphql";
import NotFound from "../../../component/src/notFound";
import { useTranslation } from "react-i18next";
import { Text, Button, FunIcon } from "../../../component";
import SearchEventQuery from "../../../graphQL/Query/Search/SearchEvent";
import ListRenderEvent from "./ListRenderEvent";

export default function SearchDestination(props) {
  const { t, i18n } = useTranslation();

  let [token, setToken] = useState("");
  let searchDest = props.searchQueryFromMain;
  const [
    querySearchEvent,
    { loading: loadingEvent, data: dataEvent, error: errorEvent },
  ] = useLazyQuery(SearchEventQuery, {
    fetchPolicy: "network-only",
    variables: {
      keyword: searchDest,
      type: [],
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  if (loadingEvent) {
    // console.log('Loading Data Event' + loadingEvent);
  }
  if (errorEvent) {
    // console.log('error Event ' + errorEvent);
  }
  if (dataEvent) {
    // console.log('DATA Event SEARCH: ', dataEvent);
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
    querySearchEvent();
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
      {dataEvent !== (null || undefined) &&
      dataEvent &&
      dataEvent.event_search.length ? (
        <ListRenderEvent
          props={props}
          datanya={dataEvent.event_search}
          token={token}
        />
      ) : (
        <View
          style={{
            height: "90%",
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          <NotFound wanted={t("event")} />
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
  lightFont: {
    fontFamily: "lato-light",
    fontSize: 10,
  },
  boldFont: {
    fontFamily: "lato-bold",
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
