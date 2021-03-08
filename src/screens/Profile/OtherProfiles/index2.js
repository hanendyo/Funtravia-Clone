import { useQuery } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  View,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import Account from "../../../graphQL/Query/Profile/Other";
import { Text, CustomImage, StatusBar } from "../../../component";

export default function OtherProfiles(props) {
  let [token, setToken] = useState(null);
  console.log(props.route.params);

  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    await setToken(tkn);
  };

  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", () => {
      loadAsync();
    });
    return unsubscribe;
  }, [props.navigation]);

  const Datauser = () => {
    const { data, loading, error, refetch } = useQuery(Account, {
      fetchPolicy: "network-only",
      context: {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
      variables: {
        id: props.route.params.idUser,
      },
    });

    if (loading) {
      return (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator animating={true} color="#209fae" size="large" />
        </View>
      );
    }

    return (
      <View>
        <StatusBar backgroundColor={"#14646e"} barStyle="light-content" />
        <ScrollView>
          <View>
            <Text>PROFILE</Text>
          </View>
          <View>
            <Text>{data.user_profilebyid.first_name}</Text>
          </View>
        </ScrollView>
      </View>
    );
  };

  if (token) {
    return <Datauser />;
  } else {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          alignContent: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator animating={true} color="#209fae" size="large" />
      </View>
    );
  }
}
