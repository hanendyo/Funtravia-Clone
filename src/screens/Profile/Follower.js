import React, { useState, useCallback, useEffect } from "react";
import { View, Alert, FlatList, TouchableOpacity, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import FollowerQuery from "../../graphQL/Query/Profile/Follower";
import FollowMut from "../../graphQL/Mutation/Profile/FollowMut";
import UnfollowMut from "../../graphQL/Mutation/Profile/UnfollowMut";
import { Text, Button } from "../../component";
import { Arrowbackwhite } from "../../assets/svg";
import { Loading } from "../../component";
import { useTranslation } from "react-i18next";

export default function Follower(props) {
  const { t, i18n } = useTranslation();
  const HeaderComponent = {
    headerTransparent: false,
    title: `${t("Followers")}`,
    headerTintColor: "white",
    headerTitle: `${t("Followers")}`,
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

  const [LoadFollower, { data, loading, error }] = useLazyQuery(FollowerQuery, {
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });
  const loadAsync = async () => {
    setLoading(true);
    let tkn = await AsyncStorage.getItem("access_token");
    setToken(tkn);
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

  const _unfollow = async (id, status) => {
    setLoading(true);
    if (token || token !== "") {
      try {
        let response = await UnfollowMutation({
          variables: {
            id: id,
          },
        });
        if (loadUnfolMut) {
          Alert.alert("Loading!!");
        }
        if (errorUnfolMut) {
          throw new Error("Error Input");
        }

        if (response.data) {
          if (
            response.data.unfollow_user.code === 200 ||
            response.data.unfollow_user.code === "200"
          ) {
            loadAsync();
            setSelectedStatus("0");
          } else {
            throw new Error(response.data.unfollow_user.message);
          }
        }
        setLoading(false);
      } catch (error) {
        Alert.alert("" + error);
        setLoading(false);
      }
    } else {
      Alert.alert("Please Login");
      setLoading(false);
    }
  };

  const _follow = async (id, status) => {
    setLoading(true);

    if (token || token !== "") {
      try {
        let response = await FollowMutation({
          variables: {
            id: id,
          },
        });
        if (loadFollowMut) {
          Alert.alert("Loading!!");
        }
        if (errorFollowMut) {
          throw new Error("Error Input");
        }

        if (response.data) {
          if (
            response.data.follow_user.code === 200 ||
            response.data.follow_user.code === "200"
          ) {
            loadAsync();
            setSelectedStatus("1");
          } else {
            throw new Error(response.data.follow_user.message);
          }
        }
        setLoading(false);
      } catch (error) {
        Alert.alert("" + error);
        setLoading(false);
      }
    } else {
      Alert.alert("Please Login");
      setLoading(false);
    }
  };

  const RenderNameList = ({
    idUser,
    first_name,
    last_name,
    picture,
    username,
    bio,
    status,
  }) => {
    return (
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          alignContent: "center",
          paddingHorizontal: 20,
          paddingVertical: 10,
        }}
      >
        <TouchableOpacity
          onPress={() =>
            props.navigation.push("ProfileStack", {
              screen: "otherprofile",
              params: { idUser: idUser, token: token },
            })
          }
          style={{ flexDirection: "row" }}
        >
          <Image
            source={{ uri: picture }}
            style={{
              resizeMode: "cover",
              height: 50,
              width: 50,
              borderRadius: 25,
            }}
          />
          <View style={{ marginLeft: 20 }}>
            <Text style={{ fontSize: 12, fontFamily: "Lato-Regular" }}>
              {first_name + " " + last_name}
            </Text>
            <Text style={{ fontSize: 10, fontFamily: "lato-light" }}>
              {`@${username}`}
            </Text>
            {/* <Text style={{ fontSize: 10, fontFamily: 'lato-light' }}>
							{bio}
						</Text> */}
          </View>
        </TouchableOpacity>

        <View style={{}}>
          {status == false ? (
            <Button
              size="small"
              type="circle"
              style={{ width: 100 }}
              text="Follow"
              onPress={() => {
                _follow(idUser, status),
                  setSelectedStatus(status),
                  setSelectedId(idUser);
              }}
            ></Button>
          ) : (
            <Button
              size="small"
              type="circle"
              variant="bordered"
              style={{ width: 100 }}
              onPress={() => {
                _unfollow(idUser, status),
                  setSelectedStatus(status),
                  setSelectedId(idUser);
              }}
              text="Unfollow"
            ></Button>
          )}
        </View>
      </View>
    );
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
          paddingVertical: 10,
          justifyContent: "space-evenly",
        }}
        data={data ? data.user_followers : null}
        renderItem={({ item }) => (
          <RenderNameList
            idUser={item.id}
            first_name={item.first_name ? item.first_name : ""}
            last_name={item.last_name ? item.last_name : ""}
            username={item.username ? item.username : ""}
            bio={item.bio}
            status={item.status}
            picture={item.picture}
          />
        )}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        extraData={selectedId}
      />
    </View>
  );
}
