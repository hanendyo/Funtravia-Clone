import {
  Dimensions,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import { LikeRed, LikeEmpty, Sharegreen } from "../../assets/svg";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { Truncate, Text, ModalLogin } from "../../component";
import { useTranslation } from "react-i18next";
import Liked from "../../graphQL/Mutation/Journal/likedJournal";
import UnLiked from "../../graphQL/Mutation/Journal/unlikedJournal";
import AddCommentJournal from "../../graphQL/Mutation/Journal/AddCommentJournal";
import { useMutation } from "@apollo/react-hooks";
import Ripple from "react-native-material-ripple";
import DeviceInfo from "react-native-device-info";
import { RNToasty } from "react-native-toasty";
import normalize from "react-native-normalize";

export default function AddCommentLike({
  data,
  token,
  listComments,
  setting,
  setModalShare,
  props,
}) {
  let [dataList, setDataList] = useState(data);
  let [text, setText] = useState("");
  const { t } = useTranslation();
  const Notch = DeviceInfo.hasNotch();
  const [modalLogin, setModalLogin] = useState(false);

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
    if (token) {
      if (text) {
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
          RNToasty.Show({
            title: t("somethingwrong"),
            position: "bottom",
          });
        }
      } else {
        RNToasty.Show({
          title: t("messagesEmpty"),
          position: "bottom",
        });
      }
    } else {
      setModalLogin(true);
    }
  };

  const _liked = async (id) => {
    if (token) {
      var tempData = { ...dataList };
      tempData.liked = true;
      setDataList(tempData);
      try {
        let response = await mutationliked({
          variables: {
            id: id,
          },
        });
        console.log("response like", response);
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
      setModalLogin(true);
    }
  };
  console.log(modalLogin);

  const _unliked = async (id) => {
    if (token) {
      var tempData = { ...dataList };
      tempData.liked = false;
      setDataList(tempData);
      try {
        let response = await mutationUnliked({
          variables: {
            id: id,
          },
        });
        console.log("response unlike", response);

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
      }
    } else {
      setModalLogin(true);
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
      <ModalLogin
        modalLogin={modalLogin}
        setModalLogin={() => setModalLogin(false)}
        props={props}
      />
      <View
        style={{
          backgroundColor: "#f6f6f6",
          borderRadius: 30,
          width:
            keyboardStatus == false
              ? Dimensions.get("window").width * 0.6
              : Dimensions.get("window").width - 20,
          minHeight: Dimensions.get("window").width * 0.1,
          maxHeight: Dimensions.get("window").width * 0.3,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
        }}
      >
        {!text ? (
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
              style={{ color: "#464646" }}
            >
              {`${t("commentAs")} ${setting?.user?.first_name} ${
                setting?.user?.last_name ? setting?.user?.last_name : ""
              }`}
            </Text>
          </View>
        ) : null}
        <TextInput
          autoCorrect={keyboardStatus}
          style={{
            // flex: 1,
            marginLeft: 10,
            width: "80%",
            // flexWrap: "wrap",
            color: "#2c2c2c",
            fontSize: normalize(16),
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
          onPress={() => (token ? setModalShare(true) : setModalLogin(true))}
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
