import {
  Dimensions,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  View,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { LikeRed, LikeEmpty, Sharegreen } from "../../assets/svg";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { Loading, Truncate, Text, shareAction } from "../../component";
import { useTranslation } from "react-i18next";
import Liked from "../../graphQL/Mutation/Journal/likedJournal";
import UnLiked from "../../graphQL/Mutation/Journal/unlikedJournal";
import AddCommentJournal from "../../graphQL/Mutation/Journal/AddCommentJournal";
import { useMutation } from "@apollo/react-hooks";
import Ripple from "react-native-material-ripple";
import DeviceInfo from "react-native-device-info";

export default function AddCommentLike({
  data,
  token,
  fetchData,
  listComments,
  setting,
  setModalShare,
}) {
  let [dataList, setDataList] = useState(data);
  let [text, setText] = useState("");
  const { t } = useTranslation();
  const Notch = DeviceInfo.hasNotch();

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

  const [ace, setAce] = useState(false);
  // const autoCorrectEnable =()=>{

  // }

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

  const [y, setY] = useState(0);

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

  const [lineStatus, setLineStatus] = useState(false);
  const textLength = () => {
    if (keyboardStatus === false) {
      return Notch ? 24 : 22;
    } else {
      return Notch ? 35 : 35;
    }
  };
  const deviceId = DeviceInfo.getModel();

  return (
    <KeyboardAvoidingView
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
        alignItems: "center",
        marginBottom: keyboardStatus
          ? Platform.OS == "ios"
            ? Notch
              ? deviceId == "iPhone 12 Pro"
                ? 30
                : -40
              : -45
            : null
          : null,
      }}
    >
      <View
        style={{
          backgroundColor: "#f6f6f6",
          borderRadius: 30,
          width:
            keyboardStatus == false
              ? Dimensions.get("window").width * 0.6
              : Dimensions.get("window").width - 20,
          // height: Dimensions.get("window").width * 0.13,
          minHeight: Dimensions.get("window").width * 0.1,
          maxHeight: Dimensions.get("window").width * 0.3,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
        }}
      >
        <TextInput
          autoCorrect={keyboardStatus}
          style={{
            // flex: 1,
            marginLeft: 10,
            width: "80%",
            // flexWrap: "wrap",
            color: "#2c2c2c",
            fontSize: 14,
            lineHeight: 16,
            marginVertical: 5,
            marginBottom: Platform.OS == "ios" ? 10 : 0,
            marginTop: Platform.OS == "ios" ? null : 0,
          }}
          multiline={true}
          onChangeText={(text) => {
            setText(text);
          }}
          value={text}
          placeholder={Truncate({
            text:
              t("commentAs") +
              " " +
              setting?.user?.first_name +
              " " +
              setting?.user?.last_name,
            // length: keyboardStatus == false ? (Notch ? 24 : 22) : 22,
            length: textLength(),
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
            marginLeft: keyboardStatus
              ? Platform.OS == "ios"
                ? Notch
                  ? 10
                  : 10
                : null
              : Platform.OS == "ios"
              ? Notch
                ? -10
                : 0
              : -10,
          }}
          onPress={() => comment(dataList.id, text)}
        >
          <Text type="bold" size="description" style={{ color: "#209FAE" }}>
            {t("Send")}
          </Text>
        </Ripple>
      </View>
      {keyboardStatus == false ? (
        <TouchableOpacity
          // onPress={() => shareAction({ from: "journal", target: dataList.id })}
          onPress={() => setModalShare(true)}
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
      ) : null}
      {keyboardStatus == false ? (
        dataList?.liked === false ? (
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
        )
      ) : null}
    </KeyboardAvoidingView>
  );
}
