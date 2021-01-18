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
  Modal,
} from "react-native";
import { AsyncStorage } from "react-native";
import { default_image } from "../../../assets/png";
import {
  PointIcon,
  CalendarIcon,
  PostButton,
  Kosong,
} from "../../../assets/svg";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
// import Constants from 'expo-constants';

import SearchPostQuery from "../../../graphQL/Query/Search/SearchPost";
import NotFound from "../../../component/src/notFound";
import { useTranslation } from "react-i18next";
import { Text, Button } from "../../../component";

// let SearchFeed = [
// 	{ id: 1, name: 'Joko' },
// 	{ id: 2, name: 'Anwar' },
// 	{ id: 3, name: 'chairil' },
// 	{ id: 4, name: 'bejo' },
// 	{ id: 5, name: 'teagan' },
// ];

export default function SearchFeed(props) {
  const { t, i18n } = useTranslation();
  let [token, setToken] = useState(null);
  let emptyArray = Array;
  let [showModal, setShowModal] = useState(false);

  let searchPost = props.searchQueryFromMain;
  const [
    querySearchPost,
    { loading: loadingPost, data: dataPost, error: errorPost },
  ] = useLazyQuery(SearchPostQuery, {
    variables: {
      keyword: searchPost,
    },
  });
  if (dataPost) {
    console.log(dataPost.search_feed_post.keys(emptyArray));
  }
  if (loadingPost) {
    console.log("Loading Data Post" + loadingPost);
  }
  if (errorPost) {
    console.log("error Post " + errorPost);
  }

  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    setToken(tkn);
    querySearchPost();
  };
  useEffect(() => {
    loadAsync();
  }, []);

  const [selected, setSelected] = React.useState(new Map());

  const onSelect = React.useCallback(
    (id) => {
      const newSelected = new Map(selected);
      newSelected.set(id, !selected.get(id));
      setSelected(newSelected);
      // console.log(id);
    },
    [selected]
  );
  const comment = (id_post, caption, image_post, username) => {
    props.navigation.navigate("comment", {
      id_post,
      caption,
      image_post,
      username,
    });
    console.log(id_post);
  };

  const Item = ({ data, index, datauser, id, uri }) => {
    return (
      <View style={styles.main}>
        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate("SinglePost", {
              post_id: id,
            })
          }
        >
          <ImageBackground
            source={uri ? { uri: uri } : default_image}
            imageStyle={{
              resizeMode: "cover",
            }}
            style={{
              flex: 1,

              height: Dimensions.get("window").width / 3 - 2,
              width: Dimensions.get("window").width / 3 - 2,
            }}
          ></ImageBackground>
        </TouchableOpacity>
      </View>
    );
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
      {dataPost &&
      dataPost.search_feed_post.length !== 0 &&
      dataPost !== NaN ? (
        <FlatList
          style={{ paddingStart: 0, paddingEnd: 5 }}
          data={dataPost ? dataPost.search_feed_post : null}
          renderItem={({ item, index }) => (
            <View style={{ position: "absolute", right: 0 }}>
              <View
                style={{
                  flexDirection: "column",
                  marginVertical: 1,
                  marginHorizontal: 1,
                  //marginRight: Dimensions.get('window').width / 36,
                  //marginBottom: Dimensions.get('window').width / 36,
                }}
              >
                <Item
                  id={item.id}
                  uri={item.assets[0].filepath}
                  data={dataPost.search_feed_post}
                  datauser={item.user}
                  index={index}
                  // locationz={null}
                  // selected={!!selected.get(item.id)}
                  // onSelect={onSelect}
                />
              </View>
            </View>
          )}
          numColumns={3}
          keyExtractor={(item) => item.id}
          extraData={selected}
        />
      ) : (
        <View
          style={{
            height: "90%",
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          <NotFound wanted={t("posts")} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  modalScroll: {
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: "black",
    //opacity: 1,
  },
});
