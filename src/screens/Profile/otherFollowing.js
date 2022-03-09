import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Alert,
  FlatList,
  TouchableOpacity,
  Image,
  Pressable,
  Dimensions,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { useLazyQuery, useQuery, useMutation } from "@apollo/react-hooks";
import FollowingQuery from "../../graphQL/Query/Profile/otherFollowing";
import FollowMut from "../../graphQL/Mutation/Profile/FollowMut";
import UnfollowMut from "../../graphQL/Mutation/Profile/UnfollowMut";
import { Text, Button, Loading, Truncate } from "../../component";
import { Arrowbackwhite, Arrowbackios } from "../../assets/svg";
import { useTranslation } from "react-i18next";
import { DefaultProfile } from "../../assets/png";
import normalize from "react-native-normalize";
import { useSelector } from "react-redux";
import FollowingQueryCursorBased from "../../graphQL/Query/Profile/otherFollowing";
import { RNToasty } from "react-native-toasty";

export default function Following(props) {
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
      backgroundColor: Platform.OS == "ios" ? "#14646e" : "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      backgroundColor: Platform.OS == "ios" ? "#209fae" : null,
      elevation: Platform.OS == "ios" ? 0 : null,
      borderBottomWidth: Platform.OS == "ios" ? 0 : null,
      width: Platform.OS == "ios" ? Dimensions.get("screen").width : null,
      height: Platform.OS == "ios" ? StatusBar.currentHeight : null,
      textAlign: Platform.OS == "ios" ? "center" : null,
      paddingVertical: Platform.OS == "ios" ? 10 : null,
    },
    headerLeftContainerStyle: {
      background: "#FFF",
      position: "absolute",
      zIndex: 999,
      marginLeft: 10,
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

  let token = useSelector((data) => data.token);
  let setting = useSelector((data) => data.setting);

  let [loadin, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const idUser = props.route.params.idUser;
  let [data, setdata] = useState(null);

  const { data: dataFollow, loading, error, refetch, fetchMore } = useQuery(
    FollowingQueryCursorBased,
    {
      variables: {
        id: idUser,
        first: 10,
        after: "",
      },
      context: {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      },
      options: {
        fetchPolicy: "network-only",
        errorPolicy: "ignore",
      },
      // pollInterval: 5500,
      notifyOnNetworkStatusChange: true,
      onCompleted: async () => {
        if (dataFollow) {
          setdata(dataFollow?.user_followingbyid_cursor_based.edges);
        }
      },
    }
  );

  const onUpdate = (prev, { fetchMoreResult }) => {
    if (!fetchMoreResult) return prev;
    const { pageInfo } = fetchMoreResult.user_followingbyid_cursor_based;
    const edges = [
      ...prev.user_followingbyid_cursor_based.edges,
      ...fetchMoreResult.user_followingbyid_cursor_based.edges,
    ];
    const feedback = Object.assign({}, prev, {
      user_followingbyid_cursor_based: {
        __typename: prev.user_followingbyid_cursor_based.__typename,
        pageInfo,
        edges,
      },
    });
    return feedback;
  };

  const handleOnEndReached = () => {
    if (
      dataFollow?.user_followingbyid_cursor_based?.pageInfo.hasNextPage &&
      !loading
    ) {
      return fetchMore({
        updateQuery: onUpdate,
        variables: {
          first: 10,
          after:
            dataFollow?.user_followingbyid_cursor_based.pageInfo?.endCursor,
        },
      });
    }
  };

  const loadAsync = async () => {
    setLoading(true);
    // await LoadFollowing();
    await refetch();
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
      let _temStatus = { ...tempUser[index].node };
      let _cursor = tempUser[index].cursor;
      _temStatus.status_following = false;
      let _temData = {
        __typename: "FollowingEdge",
        cursor: _cursor,
        node: _temStatus,
      };

      tempUser.splice(index, 1, _temData);
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
        let _temStatus = { ...tempUser[index].node };
        let _cursor = tempUser[index].cursor;
        _temStatus.status_following = true;
        let _temData = {
          __typename: "FollowingEdge",
          cursor: _cursor,
          node: _temStatus,
        };
        tempUser.splice(index, 1, _temData);
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
      let _temStatus = { ...tempUser[index].node };
      let _cursor = tempUser[index].cursor;
      _temStatus.status_following = true;
      let _temData = {
        __typename: "FollowingEdge",
        curspr: _cursor,
        node: _temStatus,
      };
      tempUser.splice(index, 1, _temData);
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
        let _temStatus = { ...tempUser[index].node };
        let _cursor = tempUser[index].cursor;
        _temStatus.status_following = false;
        let _temData = {
          __typename: "FollowingEdge",
          cursor: _cursor,
          node: _temStatus,
        };
        tempUser.splice(index, 1, _temData);
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
          marginTop: 5,
          justifyContent: "space-evenly",
        }}
        showsVerticalScrollIndicator={false}
        onEndReached={handleOnEndReached}
        onEndReachedThreshold={0.5}
        initialNumToRender={10}
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
                    idUser: item.node.id,
                    token: token,
                  },
                });
              }}
              style={{ flexDirection: "row", flex: 1, alignItems: "center" }}
            >
              <Image
                source={
                  item?.node.picture
                    ? {
                        uri: item.node.picture,
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
                {item?.node.last_name !== null ? (
                  <Text size="description" type="black" numberOfLines={2}>
                    {`${item?.node.first_name} ${item?.node.last_name}`}
                  </Text>
                ) : (
                  <Text size="description" type="black" numberOfLines={2}>
                    {item?.node.first_name}
                  </Text>
                )}
                <Text size="description" type="regular">
                  {`@${item?.node.username}`}
                </Text>
                {item?.node.bio ? (
                  <Text type="regular" size="description" numberOfLines={1}>
                    {item?.node.bio ? item.node.bio : ""}
                  </Text>
                ) : null}
              </View>
            </TouchableOpacity>
            <View style={{ width: "25%", marginLeft: 15 }}>
              {item.node.status_following === false ? (
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
                    _follow(item.node.id, index);
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
                    _unfollow(item.node.id, index);
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
        keyExtractor={(item) => item?.node.id}
        showsHorizontalScrollIndicator={false}
        ListFooterComponent={
          loading ? (
            <View
              style={{
                width: Dimensions.get("screen").width,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 5,
                marginBottom: 20,
              }}
            >
              <ActivityIndicator
                animating={loading}
                size="large"
                color="#209FAE"
              />
            </View>
          ) : null
        }
      />
    </View>
  );
}
