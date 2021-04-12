import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { default_image } from "../../assets/png";
import { CommentWhite, LikeWhite } from "../../assets/svg";
import { useLazyQuery } from "@apollo/react-hooks";
import FeedPopuler from "../../graphQL/Query/Home/FeedPopuler";
import { Text, Button } from "../../component";
import { Truncate } from "../../component";
import LinearGradient from "react-native-linear-gradient";

const { width, height } = Dimensions.get("screen");
export default function SearchFeed({ props }) {
  let [token, setToken] = useState("");
  let [users, setuser] = useState(null);

  const [
    querySearchPost,
    { loading: loadingPost, data: dataPost, error: errorPost },
  ] = useLazyQuery(FeedPopuler, {
    variables: {
      limit: 5,
      offset: null,
    },
    fetchPolicy: "network-only",
  });

  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    setToken(tkn);
    let user = await AsyncStorage.getItem("setting");
    user = JSON.parse(user);
    setuser(user.user);

    querySearchPost();
  };
  useEffect(() => {
    loadAsync();
  }, []);

  const [selected, setSelected] = React.useState(new Map());
  const [selectedUri, setSelectedUri] = React.useState(new Map());

  const onSelect = React.useCallback(
    (id, uri) => {
      const newSelected = new Map(selected);
      const newUri = new Map(selected);

      newSelected.set(id, !selected.get(id));
      newUri.set(uri, !selected.get(uri));

      setSelected(newSelected);
      setSelectedUri(newUri);
    },
    [selected]
  );

  return (
    <>
      {dataPost && dataPost.feed_post_populer.length > 0 ? (
        <FlatList
          contentContainerStyle={{
            marginTop: 10,
            marginBottom: 30,
            paddingStart: 20,
            paddingEnd: 15,
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={dataPost ? dataPost.feed_post_populer : null}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={{
                marginRight: 7,
                marginLeft: 0,
                margin: 5,
                shadowColor: "#464646",
                backgroundColor: "#fff",
                shadowOffset: { width: 0, height: 0 },
                shadowRadius: 0.5,
                shadowOpacity: 0.5,
                elevation: 2,
                borderRadius: 5,
              }}
              onPress={() =>
                props.navigation.navigate("FeedStack", {
                  screen: "CommentsById",
                  params: {
                    post_id: item.id,
                    token: token,
                  },
                })
              }
            >
              <ImageBackground
                source={
                  item.assets[0].filepath
                    ? { uri: item.assets[0].filepath }
                    : default_image
                }
                imageStyle={{
                  resizeMode: "cover",
                  borderRadius: 5,
                }}
                style={{
                  width: (width - 70) / 2,
                  height: (width + 70) / 2,
                }}
              >
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    marginLeft: 10,
                    width: "100%",
                    marginTop: 10,
                    alignContent: "center",
                  }}
                  onPress={() => {
                    item.user.id !== users?.id
                      ? props.navigation.push("ProfileStack", {
                          screen: "otherprofile",
                          params: {
                            idUser: item.user.id,
                          },
                        })
                      : props.navigation.push("ProfileStack", {
                          screen: "ProfileTab",
                          params: { token: token },
                        });
                  }}
                >
                  <Image
                    source={
                      item.user.picture
                        ? { uri: item.user.picture }
                        : default_image
                    }
                    style={{
                      // marginTop: 10	,
                      resizeMode: "cover",
                      height: 27,
                      width: 27,
                      borderRadius: 15,
                      zIndex: 10000,
                      borderColor: "white",
                      borderWidth: 1,
                    }}
                  />
                  <View
                    style={{
                      justifyContent: "center",
                      alignContent: "center",
                      alignSelf: "center",
                      marginLeft: -10,
                      backgroundColor: "rgba(0,0,0,0.4)",
                      paddingHorizontal: 3,
                      // paddingVertical: ,
                      borderRadius: 2,
                      height: 20,
                    }}
                  >
                    <Text
                      size="small"
                      type="bold"
                      // numberOfLines={2}
                      style={{
                        textAlign: "center",
                        marginHorizontal: 12,
                        color: "rgba(255,255,255,1)",
                        textShadowColor: "rgba(0, 0, 0, 0.75)",
                        textShadowOffset: { width: -1, height: 1 },
                        textShadowRadius: 10,
                      }}
                    >
                      <Truncate text={`@${item.user.username}`} length={13} />
                    </Text>
                  </View>
                </TouchableOpacity>
                <LinearGradient
                  colors={["black", "transparent"]}
                  style={{
                    height: "33%",
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    borderRadius: 5,
                    paddingLeft: 10,
                    paddingTop: 5,
                  }}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 0, y: 0 }}
                >
                  <Text
                    size="description"
                    ellipsizeMode="clip"
                    numberOfLines={2}
                    style={{
                      color: "white",
                      alignSelf: "baseline",
                      justifyContent: "flex-end",
                    }}
                  >
                    {item.caption ? (
                      <Truncate text={item.caption} length={45} />
                    ) : null}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      position: "absolute",
                      bottom: 5,
                      marginLeft: 10,
                    }}
                  >
                    <Button
                      onPress={() => null}
                      type="icon"
                      variant="transparent"
                      position="left"
                      size="small"
                      style={{
                        paddingHorizontal: 2,
                        marginRight: 10,
                        color: "white",
                        // right: 10,
                      }}
                    >
                      <LikeWhite height={17} width={18} />
                      <Text
                        size="description"
                        style={{
                          textAlign: "center",
                          marginHorizontal: 3,
                          color: "white",
                        }}
                      >
                        {item.response_count}
                      </Text>
                    </Button>
                    <Button
                      onPress={() => null}
                      type="icon"
                      variant="transparent"
                      position="left"
                      size="small"
                      style={{
                        paddingHorizontal: 1,
                        // right: 10,
                      }}
                    >
                      <CommentWhite
                        height={17}
                        width={18}
                        fill={"#FFFFFF"}
                        color={"white"}
                      />
                      <Text
                        size="description"
                        style={{
                          textAlign: "center",
                          marginHorizontal: 3,
                          color: "white",
                        }}
                      >
                        {item.comment_count}
                      </Text>
                    </Button>
                  </View>
                </LinearGradient>
              </ImageBackground>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          // extraData={selected}
        />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  main: {
    height: (width / 2 - 20) * 1.5,
    width: width / 2 - 20,
    backgroundColor: "white",
    borderRadius: 5,
    marginLeft: 10,
    // borderWidth: 0.2,
    flexDirection: "row",
    shadowColor: "#6F7273",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 3,
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
