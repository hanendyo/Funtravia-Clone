import { View } from "native-base";
import { Dimensions, Alert, Keyboard } from "react-native";
import React, { useState } from "react";
import { LikeJournal, Shareout, CommentChat, LikeRed } from "../../assets/svg";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { Loading } from "../../component";
import { useTranslation } from "react-i18next";
import Liked from "../../graphQL/Mutation/Journal/likedJournal";
import UnLiked from "../../graphQL/Mutation/Journal/unlikedJournal";
import AddCommentJournal from "../../graphQL/Mutation/Journal/AddCommentJournal";
import { useMutation } from "@apollo/react-hooks";

export default function AddCommentLike({
  data,
  token,
  fetchData,
  listComments,
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
        if (loadingLike) {
          Alert.alert("Loading!!");
        }
        if (errorLike) {
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
      }}
    >
      <Loading show={loadingLike} />
      <Loading show={loadingUnLike} />
      <View
        style={{
          backgroundColor: "#f6f6f6",
          borderRadius: 20,
          width: Dimensions.get("window").width * 0.6,
          height: Dimensions.get("window").width * 0.13,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
          paddingVertical: 5,
          alignSelf: "center",
        }}
      >
        <CommentChat width={20} height={20} style={{ flex: 1 }} />
        <TextInput
          style={{
            flex: 1,
            fontWeight: "bold",
            marginLeft: 5,
            width: "90%",
            flexWrap: "wrap",
            color: "#2c2c2c",
          }}
          onChangeText={(text) => setText(text)}
          value={text}
          placeholder={t("writeComment")}
          returnKeyType="default"
          onSubmitEditing={() => comment(dataList.id, text)}
        />
      </View>
      <TouchableOpacity onPress={() => Alert.alert("Comming Soon")}>
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
      {data.liked === false ? (
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
      )}
    </View>
  );
}
