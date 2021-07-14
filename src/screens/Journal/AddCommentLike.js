import { View } from "native-base";
import { Dimensions, Alert, Keyboard } from "react-native";
import React, { useState } from "react";
import { LikeRed, LikeEmpty, Sharegreen } from "../../assets/svg";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { Loading, Truncate, Text, shareAction } from "../../component";
import { useTranslation } from "react-i18next";
import Liked from "../../graphQL/Mutation/Journal/likedJournal";
import UnLiked from "../../graphQL/Mutation/Journal/unlikedJournal";
import AddCommentJournal from "../../graphQL/Mutation/Journal/AddCommentJournal";
import { useMutation } from "@apollo/react-hooks";
import Ripple from "react-native-material-ripple";

export default function AddCommentLike({
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
      var tempData = { ...dataList };
      tempData.liked = true;
      setDataList(tempData);
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
          } else {
            throw new Error(response.data.like_journal.message);
          }
        }
      } catch (error) {
        var tempData = { ...dataList };
        tempData.liked = false;
        setDataList(tempData);
        Alert.alert("" + error);
      }
    } else {
      Alert.alert("Please Login");
    }
  };

  const _unliked = async (id) => {
    if (token || token !== "") {
      var tempData = { ...dataList };
      tempData.liked = false;
      setDataList(tempData);
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
          } else {
            throw new Error(response.data.unlike_journal.message);
          }
        }
      } catch (error) {
        var tempData = { ...dataList };
        tempData.liked = true;
        setDataList(tempData);
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
        // paddingTop: 10,
        // paddingBottom: 10,
        // paddingHorizontal: 20,
        // width: Dimensions.get("window").width,
        // justifyContent: "center",
        // flexDirection: "row",
        // backgroundColor: "white",
        // borderWidth: 1,
      }}
    >
      {/* <Loading show={loadingLike} />
      <Loading show={loadingUnLike} /> */}
      <View
        style={{
          backgroundColor: "#f6f6f6",
          borderRadius: 30,
          width: Dimensions.get("window").width * 0.6,
          // height: Dimensions.get("window").width * 0.13,
          minHeight: Dimensions.get("window").width * 0.1,
          maxHeight: Dimensions.get("window").width * 0.2,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
          // paddingVertical: 5,
        }}
      >
        <TextInput
          style={{
            flex: 1,
            marginLeft: 5,
            width: "90%",
            flexWrap: "wrap",
            color: "#2c2c2c",
            fontSize: 12,
            lineHeight: 16,
          }}
          multiline={true}
          onChangeText={(text) => setText(text)}
          value={text}
          placeholder={Truncate({
            text:
              t("commentAs") +
              " " +
              setting?.user?.first_name +
              " " +
              setting?.user?.last_name,
            length: 25,
          })}
        />
        <Ripple
          rippleCentered={true}
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: Dimensions.get("window").width * 0.1,
            borderRadius: 15,
            width: "20%",
          }}
          onPress={() => comment(dataList.id, text)}
        >
          <Text type="bold" size="description" style={{ color: "#209FAE" }}>
            {t("Send")}
          </Text>
        </Ripple>
      </View>
      <TouchableOpacity
        onPress={() => shareAction({ from: "journal", target: dataList.id })}
      >
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
          <Sharegreen width={20} height={20} />
        </View>
      </TouchableOpacity>
      {dataList?.liked === false ? (
        <TouchableOpacity onPress={() => _liked(dataList.id)}>
          <View
            style={{
              marginLeft: 5,
              borderRadius: 30,
              backgroundColor: "#f6f6f6",
              width: Dimensions.get("window").width * 0.13,
              height: Dimensions.get("window").width * 0.13,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LikeEmpty width={20} height={20} />
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => _unliked(dataList.id)}>
          <View
            style={{
              marginLeft: 5,
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
