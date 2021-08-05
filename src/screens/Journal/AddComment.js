import { View } from "native-base";
import {
  Dimensions,
  Alert,
  Keyboard,
  Platform,
  ToastAndroid,
} from "react-native";
import React, { useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import { Text, Truncate } from "../../component";
import { useTranslation } from "react-i18next";
import Liked from "../../graphQL/Mutation/Journal/likedJournal";
import UnLiked from "../../graphQL/Mutation/Journal/unlikedJournal";
import AddCommentJournal from "../../graphQL/Mutation/Journal/AddCommentJournal";
import { useMutation } from "@apollo/react-hooks";
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
    Keyboard.dismiss();
    if ((token || token !== "") && text !== "") {
      try {
        let response = await MutationAddComment({
          variables: {
            id: id,
            text: text,
          },
        });
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
          borderRadius: 30,
          width: "100%",
          minHeight: Dimensions.get("window").width * 0.13,
          maxHeight: Dimensions.get("window").width * 0.16,
          flexDirection: "row",
          paddingHorizontal: 10,
          justifyContent: "space-between",
        }}
      >
        <TextInput
          style={{
            flex: 1,
            marginLeft: 15,
            width: "40%",
            flexWrap: "wrap",
            color: "#2c2c2c",
            fontSize: 12,
            lineHeight: 16,
            marginVertical: 5,
            marginTop: Platform.OS == "ios" ? 10 : 0,
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
            length: 35,
          })}
          onChangeText={(text) => setText(text)}
        />
        <Ripple
          rippleCentered={true}
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            borderRadius: 15,
            width: "20%",
          }}
          onPress={() => comment(data.id, text)}
        >
          <Text type="bold" size="description" style={{ color: "#209FAE" }}>
            {t("Send")}
          </Text>
        </Ripple>
      </View>
    </View>
  );
}
