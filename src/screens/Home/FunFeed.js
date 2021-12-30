import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  View,
  Modal,
  Pressable,
} from "react-native";

import { Text, Button } from "../../component";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLazyQuery } from "@apollo/react-hooks";
import FeedPopuler from "../../graphQL/Query/Home/FeedPopuler";
import RenderPost from "./RenderPost";
import { RNToasty } from "react-native-toasty";
import { useTranslation } from "react-i18next";
import likepost from "../../graphQL/Mutation/Post/likepost";
import unlikepost from "../../graphQL/Mutation/Post/unlikepost";
import { useMutation } from "@apollo/client";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { Xgray } from "../../assets/svg";
import { setTokenApps } from "../../redux/action";
import { useDispatch } from "react-redux";

const { width, height } = Dimensions.get("screen");
export default function SearchFeed({ props, tokenApps }) {
  let dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  // let [token, setToken] = useState(tokenApps);
  let [users, setuser] = useState(null);
  let [datas, setDatas] = useState(null);
  let [modalLogin, setModalLogin] = useState(false);

  const [
    querySearchPost,
    { loading: loadingPost, data: dataPost, error: errorPost },
  ] = useLazyQuery(FeedPopuler, {
    variables: {
      limit: 5,
      offset: null,
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenApps,
      },
    },
    onCompleted: () => setDatas(dataPost?.feed_post_populer),
    fetchPolicy: "network-only",
  });

  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    // setToken(tkn);

    let user = await AsyncStorage.getItem("setting");
    user = JSON.parse(user);
    setuser(user?.user);
  };
  useEffect(() => {
    const feedasync = props.navigation.addListener("focus", () => {
      querySearchPost();
      loadAsync();
    });
    return feedasync;
  }, [props.navigation]);

  const Ceklogin = (id, item, index) => {
    props.navigation.push("FeedStack", {
      screen: "CommentPost",
      params: {
        post_id: id,
        data: item,
        token: tokenApps,
        _liked: (e) => _like(e),
        _unliked: (e) => _unlike(e),
        indeks: index,
        countKoment: (e) => countKoment(e),
        _deletepost: (e) => _deletepost(e),
      },
    });
  };
  const [
    MutationLike,
    { loading: loadingLike, data: dataLike, error: errorLike },
  ] = useMutation(likepost, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenApps,
      },
    },
  });

  const [
    MutationunLike,
    { loading: loadingunLike, data: dataunLike, error: errorunLike },
  ] = useMutation(unlikepost, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenApps,
      },
    },
  });

  const _like = async (id) => {
    if (tokenApps) {
      try {
        let tempData = [...datas];
        let index = tempData.findIndex((k) => k["id"] === id);
        let tempDatas = { ...tempData[index] };
        tempDatas.liked = true;
        tempDatas.response_count = tempDatas.response_count + 1;
        tempData.splice(index, 1, tempDatas);
        setDatas(tempData);

        let response = await MutationLike({
          variables: {
            post_id: id,
          },
        });

        if (response?.data?.like_post?.code == 200) {
          querySearchPost();
        }
      } catch (e) {
        let tempData = [...datas];
        let index = tempData.findIndex((k) => k["id"] === id);
        let tempDatas = { ...tempData[index] };
        tempDatas.liked = false;
        tempDatas.response_count = tempDatas.response_count - 1;
        tempData.splice(index, 1, tempDatas);
        setDatas(tempData);
      }
    } else {
      setModalLogin(true);
    }
  };

  const _unlike = async (id, index) => {
    if (tokenApps) {
      try {
        let tempData = [...datas];
        let index = tempData.findIndex((k) => k["id"] === id);
        let tempDatas = { ...tempData[index] };
        tempDatas.liked = false;
        tempDatas.response_count = tempDatas.response_count - 1;
        tempData.splice(index, 1, tempDatas);
        setDatas(tempData);
        let response = await MutationunLike({
          variables: {
            post_id: id,
          },
        });

        if (response?.data?.unlike_post?.code == 200) {
          querySearchPost();
        }
      } catch (e) {
        let tempData = [...datas];
        let index = tempData.findIndex((k) => k["id"] === id);
        let tempDatas = { ...tempData[index] };
        tempDatas.liked = true;
        tempDatas.response_count = tempDatas.response_count + 1;
        tempData.splice(index, 1, tempDatas);
        setDatas(tempData);
      }
    } else {
      setModalLogin(true);
    }
  };

  return (
    <>
      <Modal
        useNativeDriver={true}
        visible={modalLogin}
        onRequestClose={() => true}
        transparent={true}
        animationType="fade"
      >
        <Pressable
          onPress={() => setModalLogin(false)}
          style={{
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
            justifyContent: "center",
            opacity: 0.7,
            backgroundColor: "#000",
            position: "absolute",
          }}
        ></Pressable>
        <View
          style={{
            width: Dimensions.get("screen").width - 120,
            marginHorizontal: 60,
            backgroundColor: "#FFF",
            zIndex: 15,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            marginTop: Dimensions.get("screen").height / 4,
            borderRadius: 5,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              width: Dimensions.get("screen").width - 120,
              borderRadius: 5,
            }}
          >
            <View
              style={{
                backgroundColor: "#f6f6f6",
                borderRadius: 5,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  marginTop: 12,
                  marginBottom: 15,
                }}
                size="title"
                type="bold"
              >
                {t("LoginFirst")}
              </Text>
              <Pressable
                onPress={() => setModalLogin(false)}
                style={{
                  height: 50,
                  width: 55,
                  position: "absolute",
                  right: 0,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Xgray width={15} height={15} />
              </Pressable>
            </View>
            <View
              style={{
                alignItems: "center",
                marginHorizontal: 30,
                marginBottom: 15,
                marginTop: 12,
              }}
            >
              <Text style={{ marginBottom: 5 }} size="title" type="bold">
                {t("nextLogin")}
              </Text>
              <Text
                style={{ textAlign: "center", lineHeight: 18 }}
                size="label"
                type="regular"
              >
                {t("textLogin")}
              </Text>
            </View>
            <View style={{ marginHorizontal: 30, marginBottom: 30 }}>
              <Button
                style={{ marginBottom: 5 }}
                onPress={() => {
                  setModalLogin(false);
                  props.navigation.push("AuthStack", {
                    screen: "LoginScreen",
                  });
                }}
                type="icon"
                text={t("signin")}
              ></Button>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  marginVertical: 5,
                }}
              >
                <View
                  style={{
                    width: 50,
                    borderBottomWidth: 1,
                    borderBottomColor: "#d1d1d1",
                    marginHorizontal: 10,
                  }}
                ></View>
                <Text style={{ alignSelf: "flex-end", marginVertical: 10 }}>
                  {t("or")}
                </Text>
                <View
                  style={{
                    width: 50,
                    borderBottomWidth: 1,
                    borderBottomColor: "#d1d1d1",
                    marginHorizontal: 10,
                  }}
                ></View>
              </View>
              <View style={{ alignItems: "center" }}>
                <Text
                  size="label"
                  type="bold"
                  style={{ color: "#209FAE" }}
                  onPress={() => {
                    setModalLogin(false);
                    props.navigation.push("AuthStack", {
                      screen: "RegisterScreen",
                    });
                  }}
                >
                  {t("createAkunLogin")}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      {datas && datas.length > 0 ? (
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
          data={datas}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={{
                marginRight: 7,
                marginLeft: 0,
                borderRadius: 5,
              }}
              onPress={() => Ceklogin(item.id, item, index)}
            >
              <RenderPost
                data={item}
                user={users}
                navigation={props.navigation}
                token={tokenApps}
                _like={(e) => _like(e)}
                _unlike={(e) => _unlike(e)}
                index={index}
              />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => "FUNFEED_" + item.id}
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
  },
});
