import { useQuery } from "@apollo/client";
import React, { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  View,
  SafeAreaView,
  StatusBar,
  Text,
  Dimensions,
} from "react-native";
import Account from "../../../graphQL/Query/Home/Account";
export default function OtherProfiles(props) {
  console.log(props.route.params);

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

    console.log(data);

    return (
      <View>
        <View
          style={{
            backgroundColor: "#FFF",
            height: Platform.OS === "ios" ? 44 : 50,
          }}
        >
          <SafeAreaView>
            <StatusBar
              translucent
              backgroundColor={"#000"}
              barStyle="dark-content"
            />
          </SafeAreaView>
        </View>
        <ScrollView>
          <View>
            <Text>PROFILE</Text>
          </View>
          <View>
            <Text>CONTENT</Text>
          </View>
        </ScrollView>
      </View>
    );
  };

  return <Datauser />;
}
