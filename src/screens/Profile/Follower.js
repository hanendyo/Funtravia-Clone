import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import FollowerQuery from "../../graphQL/Query/Profile/Follower";
import FollowMut from "../../graphQL/Mutation/Profile/FollowMut";
import UnfollowMut from "../../graphQL/Mutation/Profile/UnfollowMut";
import { Text, Button } from "../../component";
import { Arrowbackios, Arrowbackwhite } from "../../assets/svg";
import { Loading } from "../../component";
import { useTranslation } from "react-i18next";
import { DefaultProfile } from "../../assets/png";
import normalize from "react-native-normalize";
import { useDispatch, useSelector } from "react-redux";
import { setApps } from "../../redux/action";

export default function Follower(props) {
  let dispatch = useDispatch();
  const token = useSelector((data) => data.token);
  const { t, i18n } = useTranslation();
  const HeaderComponent = {
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: (
      <Text size="header" type="bold" style={{ color: "#fff" }}>
        {t("Followers")}
      </Text>
    ),
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    // headerTitleStyle: {
    //   fontFamily: "Lato-Bold",
    //   fontSize: 18,
    //   color: "white",
    // },
    headerLeftContainerStyle: {
      background: "#FFF",
    },
    headerLeft: () => (
      <Button
        text={""}
        size="medium"
        type="circle"
        variant="transparent"
        onPress={() => props.navigation.goBack()}
        style={{
          height: 55,
          marginLeft: 5,
        }}
      >
        {Platform.OS == "ios" ? (
          <Arrowbackios height={15} width={15}></Arrowbackios>
        ) : (
          <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
        )}
      </Button>
    ),
  };

  let [loadin, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  let [data, setdata] = useState([]);

  const loadAsync = async () => {
    setLoading(true);
    let tkn = await AsyncStorage.getItem("access_token");
    // setToken(tkn);
    // dispatch(setTokenApps(`Bearer ${tkn}`));
    await LoadFollower();
    await setLoading(false);
  };

  const [LoadFollower, { data: dataFollow, loading, error }] = useLazyQuery(
    FollowerQuery,
    {
      fetchPolicy: "network-only",
      context: {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      },
      onCompleted: async () => {
        setdata(dataFollow.user_followers);
      },
    }
  );
  // console.log(dataFollow);

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    loadAsync();
  }, []);

  const [
    FollowMutation,
    { loading: loadFollowMut, data: dataFollowMut, error: errorFollowMut },
  ] = useMutation(FollowMut, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
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
        Authorization: token,
      },
    },
  });

  const _unfollow = async (id, index) => {
    if (token) {
      let tempUser = [...data];
      let _temStatus = { ...tempUser[index] };
      _temStatus.status_following = false;
      tempUser.splice(index, 1, _temStatus);
      setdata(tempUser);
      try {
        let response = await UnfollowMutation({
          variables: {
            id: id,
          },
        });
        if (errorUnfolMut) {
          throw new Error("Error Input");
        }
        if (response.data) {
          if (
            response.data.unfollow_user.code === 200 ||
            response.data.unfollow_user.code === "200"
          ) {
            console.log("berhasil");
          } else {
            throw new Error(response.data.unfollow_user.message);
          }
        }
      } catch (error) {
        RNToasty.Show({
          title: error,
          position: "bottom",
        });
        let tempUser = [...data];
        let _temStatus = { ...tempUser[index] };
        _temStatus.status_following = true;
        tempUser.splice(index, 1, _temStatus);
        setdata(tempUser);
      }
    } else {
      RNToasty.Show({
        title: "Please Login",
        position: "bottom",
      });
    }
  };

  const _follow = async (id, index) => {
    // setLoading(true);
    if (token) {
      let tempUser = [...data];
      let _temStatus = { ...tempUser[index] };
      _temStatus.status_following = true;
      tempUser.splice(index, 1, _temStatus);
      setdata(tempUser);
      try {
        let response = await FollowMutation({
          variables: {
            id: id,
          },
        });
        if (errorFollowMut) {
          throw new Error("Error Input");
        }

        if (response.data) {
          if (
            response.data.follow_user.code === 200 ||
            response.data.follow_user.code === "200"
          ) {
            console.log("berhasil");
          } else {
            throw new Error(response.data.follow_user.message);
          }
        }
      } catch (error) {
        RNToasty.Show({
          title: "Failed To Follow This User!",
          position: "bottom",
        });
        let tempUser = [...data];
        let _temStatus = { ...tempUser[index] };
        _temStatus.status_following = false;
        tempUser.splice(index, 1, _temStatus);
        setdata(tempUser);
      }
    } else {
      RNToasty.Show({
        title: "Please Login",
        position: "bottom",
      });
      // setLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      {/* <Loading show={loadin} /> */}
      <FlatList
        contentContainerStyle={{
          justifyContent: "space-evenly",
          marginTop: 5,
        }}
        showsVerticalScrollIndicator={false}
        data={data}
        renderItem={({ item, index }) => (
          <View
            style={{
              width: Dimensions.get("screen").width,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 15,
              paddingVertical: 15,
              borderBottomWidth: 1,
              borderBottomColor: "#F6F6F6",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                props.navigation.push("ProfileStack", {
                  screen: "otherprofile",
                  params: {
                    idUser: item.id,
                    token: token,
                  },
                });
              }}
              style={{
                flexDirection: "row",
                flex: 1,
                alignItems: "center",
              }}
            >
              <Image
                source={
                  item.picture
                    ? {
                        uri: item.picture,
                      }
                    : DefaultProfile
                }
                style={{
                  resizeMode: "cover",
                  height: normalize(50),
                  width: normalize(50),
                  borderRadius: 50,
                }}
              />
              <View
                style={{
                  marginLeft: 10,
                  justifyContent: "space-around",
                  flex: 1,
                }}
              >
                {item.last_name !== null ? (
                  <Text size="description" type="black" numberOfLines={2}>
                    {`${item.first_name} ${item.last_name}`}
                  </Text>
                ) : (
                  <Text size="description" type="black" numberOfLines={2}>
                    {item.first_name}
                  </Text>
                )}
                <Text size="description" type="regular">
                  {`@${item.username}`}
                </Text>
                {item?.bio ? (
                  <Text type="regular" size="description" numberOfLines={1}>
                    {item?.bio ? item.bio : ""}
                  </Text>
                ) : null}
              </View>
            </TouchableOpacity>

            <View style={{ width: "25%", marginLeft: 15 }}>
              {item.status_following === false ? (
                <Pressable
                  style={{
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: "#209fae",
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 30,
                  }}
                  onPress={() => {
                    _follow(item.id, index);
                  }}
                >
                  <Text
                    size="description"
                    type="regular"
                    style={{
                      color: "#209fae",
                    }}
                  >
                    {t("follow")}
                  </Text>
                </Pressable>
              ) : (
                <Pressable
                  style={{
                    borderRadius: 20,
                    width: "100%",
                    backgroundColor: "#209fae",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 30,
                  }}
                  onPress={() => {
                    _unfollow(item.id, index);
                  }}
                >
                  <Text
                    size="description"
                    type="regular"
                    style={{
                      color: "#fff",
                    }}
                  >
                    {t("following")}
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        extraData={selectedId}
      />
    </View>
  );
}
