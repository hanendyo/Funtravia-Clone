import React, { useState, useCallback, useEffect } from "react";
import { View, Alert, FlatList, TouchableOpacity, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import FollowerQuery from "../../graphQL/Query/Profile/otherFollower";
import FollowMut from "../../graphQL/Mutation/Profile/FollowMut";
import UnfollowMut from "../../graphQL/Mutation/Profile/UnfollowMut";
import { Text, Button, Loading, Truncate } from "../../component";
import { Arrowbackwhite } from "../../assets/svg";
import { useTranslation } from "react-i18next";
import { DefaultProfile } from "../../assets/png";

export default function Follower(props) {
  const { t, i18n } = useTranslation();

  const HeaderComponent = {
    headerTransparent: false,
    title: "",
    headerTintColor: "white",
    headerTitle: (
      <Text size="header" style={{ color: "#fff" }}>
        {t("Followers")}
      </Text>
    ),
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      fontFamily: "Lato-Bold",
      fontSize: 14,
      color: "white",
    },
    headerLeftContainerStyle: {
      background: "#FFF",
    },
  };

  let [token, setToken] = useState("");
  let [loadin, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const idUser = props.route.params.idUser;
  let [data, setdata] = useState(null);
  let [setting, setSetting] = useState();
  console.log("aa", data);
  const [LoadFollower, { data: dataFollow, loading, error }] = useLazyQuery(
    FollowerQuery,
    {
      fetchPolicy: "network-only",
      context: {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
      variables: {
        id: idUser,
      },
      onCompleted: () => {
        setdata(dataFollow.user_followersbyid);
      },
    }
  );
  const loadAsync = async () => {
    setLoading(true);
    let tkn = await AsyncStorage.getItem("access_token");
    setToken(tkn);
    let setsetting = await AsyncStorage.getItem("setting");
    setSetting(JSON.parse(setsetting));
    await LoadFollower();
    await setLoading(false);
  };

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
      <Loading show={loadin} />
      <FlatList
        contentContainerStyle={{
          paddingVertical: 5,
          justifyContent: "space-evenly",
        }}
        data={data}
        renderItem={({ item, index }) => (
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              alignContent: "center",
              paddingHorizontal: 15,
              paddingVertical: 15,
              borderBottomWidth: 1,
              borderBottomColor: "#F6F6F6",
            }}
          >
            <TouchableOpacity
              onPress={
                () => {
                  props.navigation.push("ProfileStack", {
                    screen: "otherprofile",
                    params: {
                      idUser: item.id,
                      token: token,
                    },
                  });
                }
                // props.navigation.push("otherprofile", { idUser: item.id })
              }
              style={{ flexDirection: "row" }}
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
                  height: 55,
                  width: 55,
                  borderRadius: 40,
                }}
              />
              <View
                style={{
                  marginLeft: 20,
                  justifyContent: "center",
                  paddingVertical: 1,
                }}
              >
                {item.last_name !== null ? (
                  <Text size="small" type="bold" style={{ marginBottom: 5 }}>
                    {item.first_name + " " + item.last_name}
                  </Text>
                ) : (
                  <Text size="small" type="bold" style={{ marginBottom: 5 }}>
                    {item.first_name}
                  </Text>
                )}
                <Text type="regular" size="small" style={{ marginBottom: 5 }}>
                  {`@${item.username}`}
                </Text>
                {item?.bio ? (
                  <Text type="regular" size="small">
                    <Truncate text={item?.bio ? item.bio : ""} length={40} />
                  </Text>
                ) : null}
              </View>
            </TouchableOpacity>
            {item.id !== setting?.user?.id ? (
              <View style={{}}>
                {item.status_following === false ? (
                  <Button
                    size="small"
                    type="circle"
                    variant="bordered"
                    style={{ width: 100 }}
                    text={t("follow")}
                    onPress={() => {
                      _follow(item.id, index);
                    }}
                  ></Button>
                ) : (
                  <Button
                    size="small"
                    type="circle"
                    style={{ width: 100 }}
                    onPress={() => {
                      _unfollow(item.id, index);
                    }}
                    text={t("following")}
                  ></Button>
                )}
              </View>
            ) : null}
          </View>
        )}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        extraData={selectedId}
      />
    </View>
  );
}
