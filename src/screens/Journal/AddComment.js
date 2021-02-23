import { View } from "native-base";
import { Dimensions, Alert, Keyboard } from "react-native";
import React, { useState, useEffect } from "react";
import { LikeJournal, Shareout, CommentChat, LikeRed } from "../../assets/svg";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { Loading, Text, Truncate } from "../../component";
import { useTranslation } from "react-i18next";
import Liked from "../../graphQL/Mutation/Journal/likedJournal";
import UnLiked from "../../graphQL/Mutation/Journal/unlikedJournal";
import AddCommentJournal from "../../graphQL/Mutation/Journal/AddCommentJournal";
import { useMutation } from "@apollo/react-hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ripple from "react-native-material-ripple";

export default function AddComment({
  data,
  token,
  fetchData,
  listComments,
  setting,
}) {
  let [dataList, setDataList] = useState(data);
  let [text, setText] = useState("");
  const { t } = useTranslation();
  const [
    mutationliked,
    { loading: loadingLike, data: dataLike, error: errorLike },
  ] = useMutation(Liked, {
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

  const [
    MutationAddComment,
    { loading: loadingComment, data: dataListComment, error: errorComment },
  ] = useMutation(AddCommentJournal, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const comment = async (id, text) => {
    console.log(id, text);

    Keyboard.dismiss();
    if ((token || token !== "") && text !== "") {
      try {
        let response = await MutationAddComment({
          variables: {
            id: id,
            text: text,
          },
        });
        console.log("response :", response);
        if (loadingComment) {
          Alert.alert("Loading!!");
        }
        if (errorComment) {
          throw new Error("Error Input");
        }
        if (response.data) {
          if (
            response.data.comment_journal.code === 200 ||
            response.data.comment_journal.code === "200"
          ) {
            setText("");
            listComments();
          } else {
            throw new Error(response.data.comment_journal.message);
          }
        }
      } catch (error) {
        Alert.alert("" + error);
      }
    } else {
      Alert.alert("Please Insert a Text");
    }
  };

  const _liked = async (id) => {
    if (token || token !== "") {
      try {
        let response = await mutationliked({
          variables: {
            id: id,
          },
        });
        if (loadingLike) {
          Alert.alert("Loading!!");
        }
        if (errorLike) {
          throw new Error("Error Input");
        }
        if (response.data) {
          if (
            response.data.like_journal.code === 200 ||
            response.data.like_journal.code === "200"
          ) {
            var tempData = { ...dataList };
            tempData.liked = true;
            setDataList(tempData);
            fetchData();
          } else {
            throw new Error(response.data.like_journal.message);
          }
        }
      } catch (error) {
        Alert.alert("" + error);
      }
    } else {
      Alert.alert("Please Login");
    }
  };

  const _unliked = async (id) => {
    if (token || token !== "") {
      try {
        let response = await mutationUnliked({
          variables: {
            id: id,
          },
        });
        if (loadingUnLike) {
          Alert.alert("Loading!!");
        }
        if (errorUnLike) {
          throw new Error("Error Input");
        }
        if (response.data) {
          if (
            response.data.unlike_journal.code === 200 ||
            response.data.unlike_journal.code === "200"
          ) {
            var tempData = { ...dataList };
            tempData.liked = false;
            setDataList(tempData);
            fetchData();
          } else {
            throw new Error(response.data.unlike_journal.message);
          }
        }
      } catch (error) {
        Alert.alert("" + error);
      }
    } else {
      Alert.alert("Please Login");
    }
  };

  const arrayShadow = {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: Platform.OS == "ios" ? 0.22 : 2,
    shadowRadius: Platform.OS == "ios" ? 2.22 : 1.0,
    elevation: Platform.OS == "ios" ? 3 : 1.5,
  };

  return (
    <View
      style={{
        paddingTop: 10,
        paddingBottom: 10,
        paddingHorizontal: 20,
        width: Dimensions.get("window").width,
        justifyContent: "center",
        flexDirection: "row",
        backgroundColor: "white",
        borderWidth: 2,
        borderColor: "#F0F0F0",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: arrayShadow.shadowOpacity,
        shadowRadius: arrayShadow.shadowRadius,
        elevation: arrayShadow.elevation,
      }}
    >
      {/* <Loading show={loadingLike} />
      <Loading show={loadingUnLike} /> */}
      <View
        style={{
          backgroundColor: "#f6f6f6",
          borderRadius: 20,
          width: "100%",
          height: Dimensions.get("window").width * 0.13,
          flexDirection: "row",
          paddingHorizontal: 10,
          paddingVertical: 5,
          justifyContent: "space-between",
        }}
      >
        <TextInput
          style={{
            flex: 1,
            fontWeight: "bold",
            marginLeft: 5,
            width: "40%",
            flexWrap: "wrap",
            color: "#2c2c2c",
          }}
          onChangeText={(text) => setText(text)}
          value={text}
          placeholder={Truncate({
            text:
              t("commentAs") +
              " " +
              setting?.user?.first_name +
              " " +
              setting?.user?.last_name,
            length: 35,
          })}
          // returnKeyType="default"
          // onSubmitEditing={() => comment(dataList.id, text)}
        />
        <Ripple
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            borderRadius: 15,
          }}
          onPress={() => comment(data.id, text)}
        >
          <Text type="bold" size="description" style={{ color: "#209FAE" }}>
            {t("Send")}
          </Text>
        </Ripple>
      </View>
      {/* <TouchableOpacity onPress={() => Alert.alert("Comming Soon")}>
        <View
          style={{
            marginLeft: 10,
            borderRadius: 30,
            backgroundColor: "#f6f6f6",
            width: Dimensions.get("window").width * 0.13,
            height: Dimensions.get("window").width * 0.13,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Shareout width={20} height={20} />
        </View>
      </TouchableOpacity>
      {data?.liked === false ? (
        <TouchableOpacity onPress={() => _liked(dataList.id)}>
          <View
            style={{
              marginLeft: 10,
              borderRadius: 30,
              backgroundColor: "#f6f6f6",
              width: Dimensions.get("window").width * 0.13,
              height: Dimensions.get("window").width * 0.13,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LikeJournal width={20} height={20} />
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => _unliked(dataList.id)}>
          <View
            style={{
              marginLeft: 10,
              borderRadius: 30,
              backgroundColor: "#f6f6f6",
              width: Dimensions.get("window").width * 0.13,
              height: Dimensions.get("window").width * 0.13,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LikeRed width={20} height={20} />
          </View>
        </TouchableOpacity>
      )} */}
    </View>
  );
}
