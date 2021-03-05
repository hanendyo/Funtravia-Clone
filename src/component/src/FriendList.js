import React, {
  useState,
  useCallback,
  useEffect,
  useImperativeHandle,
} from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  Animated,
  Alert,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Linking,
  Image,
  TouchableHighlight,
  BackHandler,
} from "react-native";

import { Rating, AirbnbRating } from "react-native-ratings";
import { Container, Header, Tab, Tabs, ScrollableTab } from "native-base";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import UnfollowMut from "../../graphQL/Mutation/Profile/UnfollowMut";
import FollowMut from "../../graphQL/Mutation/Profile/FollowMut";

import { useTranslation } from "react-i18next";
import { Text, Button } from "..";
import { default_image } from "../../assets/png";

export default function FriendList({
  props,
  datanya,
  // Refresh,
  // refreshing,
  token,
  onBackPress,
  recent_save,
}) {
  // let [token, setToken] = useState('');
  let [selected] = useState(new Map());
  let [dataUser, setDataUser] = useState(datanya);

  const { t, i18n } = useTranslation();
  const [
    FollowMutation,
    { loading: loadFollowMut, data: dataFollowMut, error: errorFollowMut },
  ] = useMutation(FollowMut, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const [
    UnfollowMutation,
    { loading: loadUnfolMut, data: dataUnfolMut, error: errorUnfolMut },
  ] = useMutation(UnfollowMut, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });
  const eventdetail = (data) => {
    props.navigation.navigate("eventdetail", {
      data: data,
      name: data.name,
      token: token,
    });
  };

  //BUAT FOLLOW UNFOLLOW FUNCTION
  const _unfollow = async (id) => {
    // console.log('get rekt' + typeof status);
    if (token || token !== "") {
      try {
        let response = await UnfollowMutation({
          variables: {
            id: id,
          },
        });
        if (loadUnfolMut) {
          // Alert.alert('Loading!!');
        }
        if (errorUnfolMut) {
          throw new Error("Error Input");
        }

        console.log("for Unfollow:" + response.data.unfollow_user.message);

        if (response.data) {
          if (
            response.data.unfollow_user.code === 200 ||
            response.data.unfollow_user.code === "200"
          ) {
            var tempData = [...dataUser];
            var index = tempData.findIndex((k) => k["id"] === id);
            tempData[index].status = "0";
            setDataUser(tempData);
          } else {
            throw new Error(response.data.unfollow_user.message);
          }

          // Alert.alert('Succes');
        }
      } catch (error) {
        Alert.alert("" + error);
      }
    } else {
      Alert.alert("Please Login");
    }
  };

  const _follow = async (id) => {
    if (token || token !== "") {
      try {
        let response = await FollowMutation({
          variables: {
            id: id,
          },
        });
        if (loadFollowMut) {
          console.log("Loading!!");
        }
        if (errorFollowMut) {
          throw new Error("Error Input");
        }

        console.log("for Follow:" + response.data.follow_user.message);

        if (response.data) {
          if (
            response.data.follow_user.code === 200 ||
            response.data.follow_user.code === "200"
          ) {
            var tempData = [...dataUser];
            var index = tempData.findIndex((k) => k["id"] === id);
            tempData[index].status = "1";
            setDataUser(tempData);
          } else {
            throw new Error(response.data.follow_user.message);
          }
        }
      } catch (error) {
        Alert.alert("" + error);
      }
    } else {
      Alert.alert("Please Login");
    }
  };
  //END OF FOLLOW UNFOLLOW FUNCTION
  // console.log('ini datanya:   \n\n', datanya);
  const _renderItem = ({ item, index }) => {
    // console.log(item);
    return (
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          alignContent: "center",
          // paddingRight: 10,
          // paddingLeft: 20,
          paddingVertical: 10,
        }}
      >
        <TouchableOpacity
          onPress={
            () => {
              recent_save();
              props.navigation.push("ProfileStack", {
                screen: "otherprofile",
                params: {
                  idUser: item.id,
                  token: token,
                },
              });
              BackHandler.removeEventListener(
                "hardwareBackPress",
                onBackPress()
              );
            }
            // props.navigation.push("otherprofile", { idUser: item.id })
          }
          style={{ flexDirection: "row" }}
        >
          <Image
            source={item.picture ? { uri: item.picture } : default_image}
            style={{
              resizeMode: "cover",
              height: 50,
              width: 50,
              borderRadius: 25,
            }}
          />
          <View style={{ marginLeft: 20, justifyContent: "center" }}>
            {item.last_name !== null ? (
              <Text size="small" type="regular">
                {item.first_name + "" + item.last_name}
              </Text>
            ) : (
              <Text size="small" type="regular">
                {item.first_name}
              </Text>
            )}
            <Text style={{ fontSize: 10, fontFamily: "lato-light" }}>
              {`@${item.username}`}
            </Text>
            {/* <Text style={{ fontSize: 10, fontFamily: 'lato-light' }}>
							{item.bio ? item.bio : 'Funtravia'}
						</Text> */}
          </View>
        </TouchableOpacity>

        <View style={{}}>
          {item.status === "0" ? (
            <Button
              size="small"
              type="circle"
              variant="bordered"
              style={{ width: 100 }}
              text={t("follow")}
              onPress={() => {
                _follow(item.id);
              }}
            ></Button>
          ) : (
            <Button
              size="small"
              type="circle"
              style={{ width: 100 }}
              onPress={() => {
                _unfollow(item.id);
              }}
              text={t("following")}
            ></Button>
          )}
        </View>
      </View>
    );
  };

  return (
    <FlatList
      contentContainerStyle={{
        marginTop: 5,
        justifyContent: "space-evenly",
        paddingEnd: 20,
        paddingHorizontal: 10,
      }}
      horizontal={false}
      // data={_FormatData(dataEvent, numColumns)}
      data={dataUser}
      renderItem={_renderItem}
      // numColumns={numColumns}
      keyExtractor={(item, index) => index.toString()}
      showsVerticalScrollIndicator={false}
      extraData={selected}
    />
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: "row",
    // marginTop: 20,
    // paddingTop: (50),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  ImageView: {
    // flex:1,
    // width: Dimensions.get('window').width - (Dimensions.get('window').width * 0.62),
    // height: (187),
    height: Dimensions.get("window").width * 0.47 - 16,
    // marginRight: (5),
    // marginLeft: (5),
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    overflow: "hidden",

    // borderBottomStartRadius: 0,
    backgroundColor: "rgba(20,20,20,0.4)",
    // opacity: 0.4,
    // elevation: 1,
  },
  Image: {
    resizeMode: "cover",
    height: Dimensions.get("window").width * 0.47 - 16,
    // height: (187),
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    overflow: "hidden",
    // borderBottomStartRadius: 0,
  },
  rightText: {
    position: "absolute",
    right: -55,

    alignSelf: "center",
    height: 50,
    width: 150,
    justifyContent: "center",
    alignContent: "center",
    // backgroundColor: 'green',
  },
  halfButton: {
    width: Dimensions.get("window").width / 3.8,
    borderTopLeftRadius: 23,
    borderTopRightRadius: 23,
    borderBottomLeftRadius: 23,
    borderBottomRightRadius: 23,
    height: 30,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "grey",
  },
  buttonTextStyle: {
    fontSize: 12,
    fontFamily: "lato-reg",
    color: "grey",
  },
});
