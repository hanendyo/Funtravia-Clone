import React, {
  useState,
  useCallback,
  useEffect,
  useImperativeHandle,
} from "react";
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
  Linking,
  Image,
  TouchableHighlight,
} from "react-native";

import { Item, Right } from "native-base";
import { Rating, AirbnbRating } from "react-native-ratings";
import addToWishlistAccommodation from "../../../graphQL/Mutation/Accommodation/AddToWishlist";
//data_bg nanti itu Profile Picture, data_pic itu avatar
import { bali1 } from "../../../assets/png";
import {
  PointIcon,
  CalendarIcon,
  LikeRed,
  LikeEmpty,
  Kosong,
} from "../../../assets/svg";
import { Container, Header, Tab, Tabs, ScrollableTab } from "native-base";
import { MyTrip, Review, Post } from "../ProfileT";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

import SearchAccommodationQuery from "../../../graphQL/Query/Search/SearchAccommodation";

import ListRenderAccom from "./ListRenderAccom";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useTranslation } from "react-i18next";
import { Text, Button } from "../../../component";
import NotFound from "../../../component/src/notFound";

export default function SearchAccommodation(props) {
  // Alert.alert('still under construction');
  const { t, i18n } = useTranslation();
  let searchAccom = props.searchQueryFromMain;
  // let [dataAcc, setAcc] = useState(AccommodationData);
  const [selected, setSelected] = useState(new Map());
  let [modal, setModal] = useState(false);

  let [token, setToken] = useState("");
  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  const [refreshing, setRefreshing] = React.useState(
    props.route.params.refresh ? props.route.params.refresh : false
  );

  const _Refresh = React.useCallback(() => {
    setRefreshing(true);
    querySearchAccommodation();
    wait(2000).then(() => {
      setRefreshing(false);
    });
  }, []);

  // const [isLiked, setIsLiked] = useState(false);
  // //PLACEHOLDER DATA
  // const AccommodationData = [
  // 	{
  // 		id: 1,
  // 		name: 'Marina Hotel',
  // 		location: 'Jakarta Utara',
  // 		image: [kamar1, kamar2, kamar3],
  // 		rating: 8.2,
  // 		customer: 200,
  // 		price: 820000,
  // 		jarak: 20,
  // 		roomClass: 3,
  // 		Facilities: 10,
  // 		recreation: true,
  // 		photo_spot: true,
  // 	},
  // 	{
  // 		id: 2,
  // 		name: 'Marijuana Hotel zzzz test',
  // 		location: 'Jakarta Barat',
  // 		image: [kamar1, kamar2, kamar3],
  // 		rating: 5.2,
  // 		customer: 200,
  // 		price: 820000,
  // 		jarak: 2000,
  // 		roomClass: 3,
  // 		Facilities: 10,
  // 		recreation: true,
  // 		photo_spot: true,
  // 	},
  // ];
  console.log("ONLOAD:  " + searchAccom);
  const [
    querySearchAccommodation,
    {
      loading: loadingAccommodation,
      data: dataAccommodation,
      error: errorAccommodation,
    },
  ] = useLazyQuery(SearchAccommodationQuery, {
    fetchPolicy: "network-only",
    variables: {
      keyword: searchAccom,
      type: [],
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  let [liked, setLiked] = useState(false);

  if (dataAccommodation) {
    console.log(dataAccommodation);
    // setAcc(null);
    // setAcc(dataAccommodation.AccommodationSearch);
  }
  if (loadingAccommodation) {
    console.log("Loading Data Accom" + loadingAccommodation);
  }
  if (errorAccommodation) {
    console.log("error Accom " + errorAccommodation);
  }

  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    console.log(tkn);
    if (tkn !== null) {
      setToken(tkn);
      // console.log('TOKENI: ' + token);
    } else {
      setToken("");
    }
    querySearchAccommodation();
    // setToken(tkn);
  };
  const createPost = () => {
    props.navigation.navigate("Post");
  };
  useEffect(() => {
    console.log("first: ", searchAccom);

    loadAsync();
    console.log("second: ", searchAccom);

    // console.log(token);
  }, []);

  const [
    likeWishlist,
    {
      loading: loadingLikeWishlist,
      data: dataLikeWishlist,
      error: errorLikeWishlist,
    },
  ] = useMutation(addToWishlistAccommodation, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const [
    mutationUnliked,
    { loading: loadingUnLike, data: dataUnLike, error: errorUnLike },
  ] = useMutation(UnLiked, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const onSelect = React.useCallback(
    (id, liked) => {
      const newSelected = new Map(selected);
      // const newSelectedStatus = new Map(selectedStatus);
      newSelected.set(id, !selected.get(id));
      newSelected.set(liked, !selected.get(liked));
      console.log(typeof liked);
      {
        liked === false ? _liked(id) : _unliked(id);
      }

      // console.log('followed: ' + followed);
      // setFollowed(!followed);
      //console.log(id_post);
      console.log("afterSelect" + liked);
      setSelected(newSelected);
      // console.log('STATUS: ' + status);
    },
    [selected]
  );

  let searchQuerytoo = props.searchQueryFromMain;

  console.log("Search Query is:" + searchQuerytoo);
  const ratingCompleted = (rating) => {
    console.log("Rating is: " + rating);
  };

  let [dataImage, setImage] = useState([bali1]);

  return (
    <View
      style={{
        alignSelf: "center",
        justifyContent: "space-evenly",
        // marginTop: 10,
        height: Dimensions.get("window").height * 0.8,
      }}
    >
      {dataAccommodation !== (null || undefined) &&
      dataAccommodation &&
      dataAccommodation.accomodationSearch.length ? (
        <ListRenderAccom
          props={props}
          datanya={dataAccommodation.accomodationSearch}
          Refresh={(e) => _Refresh()}
          refreshing={refreshing}
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
          <NotFound wanted={t("accommodation")} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    // flex: 1,
    // marginTop: 20,
    paddingTop: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  ImageView: {
    marginRight: 5,
    borderRadius: 10,
    backgroundColor: "rgba(0, 0, 0, 0)",
    borderColor: "gray",
    shadowColor: "gray",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 3,
    // opacity: 0.4,
    // elevation: 1,
  },
  Image: {
    resizeMode: "cover",
    borderRadius: 10,
  },
});
