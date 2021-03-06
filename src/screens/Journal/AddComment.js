import { View } from "native-base";
import {
  Dimensions,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  Pressable,
} from "react-native";
import React, { useState, useEffect } from "react";
import { TextInput } from "react-native-gesture-handler";
import { Text } from "../../component";
import { useTranslation } from "react-i18next";
import Liked from "../../graphQL/Mutation/Journal/likedJournal";
import UnLiked from "../../graphQL/Mutation/Journal/unlikedJournal";
import AddCommentJournal from "../../graphQL/Mutation/Journal/AddCommentJournal";
import { useMutation } from "@apollo/react-hooks";
import deviceInfoModule from "react-native-device-info";
import { RNToasty } from "react-native-toasty";
import normalize from "react-native-normalize";
import { useSelector } from "react-redux";

export default function AddComment({
  data,
  // token,
  fetchData,
  listComments,
  setting,
}) {
  const token = useSelector((data) => data.token);
  const Notch = deviceInfoModule.hasNotch();
  let [statusText, setStatusText] = useState("");
  let [text, setText] = useState("");
  const { t } = useTranslation();
  const [
    mutationliked,
    { loading: loadingLike, data: dataLike, error: errorLike },
  ] = useMutation(Liked, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
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
        Authorization: token,
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
        Authorization: token,
      },
    },
  });

  const [keyboardStatus, setKeyboardStatus] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardStatus(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardStatus(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const comment = async (id, text) => {
    Keyboard.dismiss();
    if (token && text !== "") {
      try {
        let response = await MutationAddComment({
          variables: {
            id: id,
            text: text,
          },
        });

        if (response.data) {
          if (response.data.comment_journal.code == 200) {
            setText("");
            setStatusText("");
            listComments();
          } else {
            RNToasty.Show({
              title: t("failedCommentJournal"),
              position: "bottom",
            });
          }
        }
      } catch (error) {
        RNToasty.Show({
          title: t("failedCommentJournal"),
          position: "bottom",
        });
      }
    } else {
      RNToasty.Show({
        title: t("messagesEmpty"),
        position: "bottom",
      });
    }
  };

  const arrayShadow = {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: Platform.OS == "ios" ? 0.22 : 2,
    shadowRadius: Platform.OS == "ios" ? 2.22 : 1.0,
    elevation: Platform.OS == "ios" ? 3 : 1.5,
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "height" : "height"}
      // keyboardVerticalOffset={Notch ? 15 : 65}
      style={{
        paddingHorizontal: 20,
        flexDirection: "row",
        borderWidth: 1,
        borderColor: "#f0f0f0",
        paddingVertical: 10,
        width: Dimensions.get("window").width,
        backgroundColor: "#FFF",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: arrayShadow.shadowOpacity,
        shadowRadius: arrayShadow.shadowRadius,
        elevation: arrayShadow.elevation,
        paddingBottom: keyboardStatus
          ? 10
          : Platform.OS === "ios"
          ? Notch
            ? 13
            : 10
          : 10,
      }}
    >
      <View
        style={{
          backgroundColor: "#f6f6f6",
          borderRadius: 30,
          width: Dimensions.get("window").width * 0.9,
          marginBottom: Platform.OS === "ios" ? (keyboardStatus ? 5 : 8) : 0,
          minHeight: Dimensions.get("window").width * 0.1,
          maxHeight: Dimensions.get("window").width * 0.3,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 5,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 10,
            borderRadius: 50,
            backgroundColor: "#F6F6F6",
            alignItems: "center",
            alignContent: "center",
          }}
        >
          {!statusText ? (
            <View
              style={{
                justifyContent: "center",
                height: "100%",
                width: "80%",
                position: "absolute",
                paddingLeft: 20,
              }}
            >
              <Text
                size="label"
                type="regular"
                numberOfLines={1}
                style={{ color: "#d1d1d1" }}
              >
                {`${t("commentAs")} ${setting?.user?.first_name} ${
                  setting?.user?.last_name ? setting?.user?.last_name : ""
                }`}
              </Text>
            </View>
          ) : null}
          <TextInput
            allowFontScaling={false}
            multiline
            maxLength={1000}
            style={{
              width: Dimensions.get("screen").width - 150,
              // textAlignVertical: "top",
              fontSize: normalize(16),
              marginLeft: Platform.OS == "ios" ? 20 : 15,
              fontFamily: "Lato-Regular",
              maxHeight: 100,
              marginBottom: Platform.OS == "ios" ? 5 : 0,
            }}
            onChangeText={(text) => setStatusText(text)}
            onSubmitEditing={(text) => setStatusText(text)}
            value={statusText}
          />
          <Pressable
            onPress={() => comment(data.id, statusText)}
            style={{
              flex: 1,
              height: 50,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              allowFontScaling={false}
              size="label"
              type="bold"
              style={{
                alignSelf: "center",
                color: "#209fae",
              }}
            >
              {t("Send")}
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
