import { View } from "native-base";
import {
  Dimensions,
  Alert,
  Keyboard,
  Platform,
  ToastAndroid,
  KeyboardAvoidingView,
  Pressable,
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
import deviceInfoModule from "react-native-device-info";
import normalize from "react-native-normalize";

export default function AddComment({
  data,
  token,
  fetchData,
  listComments,
  setting,
}) {
  const Notch = deviceInfoModule.hasNotch();
  let [statusText, setStatusText] = useState("");
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
        Authorization: token ? `Bearer ${token}` : null,
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
        Authorization: token ? `Bearer ${token}` : null,
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
        Authorization: token ? `Bearer ${token}` : null,
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
            setStatusText("");
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
    // <View
    //   style={{
    //     paddingTop: 10,
    //     paddingBottom: 10,
    //     paddingHorizontal: 20,
    //     width: Dimensions.get("window").width,
    //     justifyContent: "center",
    //     flexDirection: "row",
    //     backgroundColor: "white",

    //     borderWidth: 2,
    //     borderColor: "#F0F0F0",
    //     shadowOffset: { width: 0, height: 1 },
    //     shadowOpacity: arrayShadow.shadowOpacity,
    //     shadowRadius: arrayShadow.shadowRadius,
    //     elevation: arrayShadow.elevation,
    //   }}
    // >
    //   {/* <Loading show={loadingLike} />
    //   <Loading show={loadingUnLike} /> */}
    //   <View
    //     style={{
    //       backgroundColor: "#f6f6f6",
    //       borderRadius: 30,
    //       width: "100%",
    //       minHeight: Dimensions.get("window").width * 0.13,
    //       maxHeight: Dimensions.get("window").width * 0.16,
    //       flexDirection: "row",
    //       paddingHorizontal: 10,
    //       justifyContent: "space-between",
    //     }}
    //   >
    //     <TextInput
    //       style={{
    //         flex: 1,
    //         marginLeft: 15,
    //         width: "40%",
    //         flexWrap: "wrap",
    //         color: "#2c2c2c",
    //         fontSize: 12,
    //         lineHeight: 16,
    //         marginVertical: 5,
    //         marginTop: Platform.OS == "ios" ? 10 : 0,
    //       }}
    //       multiline={true}
    //       onChangeText={(text) => setText(text)}
    //       value={text}
    //       placeholder={Truncate({
    //         text:
    //           t("commentAs") +
    //           " " +
    //           setting?.user?.first_name +
    //           " " +
    //           setting?.user?.last_name,
    //         length: 35,
    //       })}
    //       onChangeText={(text) => setText(text)}
    //     />
    //     <Ripple
    //       rippleCentered={true}
    //       style={{
    //         alignItems: "center",
    //         justifyContent: "center",
    //         height: "100%",
    //         borderRadius: 15,
    //         width: "20%",
    //       }}
    //       onPress={() => comment(data.id, text)}
    //     >
    //       <Text type="bold" size="description" style={{ color: "#209FAE" }}>
    //         {t("Send")}
    //       </Text>
    //     </Ripple>
    //   </View>
    // </View>
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "height" : "height"}
      // keyboardVerticalOffset={Notch ? 15 : 65}
      style={{
        width: Dimensions.get("window").width,

        paddingHorizontal: 10,
      }}
    >
      <View
        style={{
          backgroundColor: "#ffffff",
          borderBottomRightRadius: 15,
          borderBottomLeftRadius: 15,
          paddingVertical: 10,
          marginVertical: 5,
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
