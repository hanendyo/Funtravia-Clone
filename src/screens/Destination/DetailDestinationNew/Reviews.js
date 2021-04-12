import React, { useState, useEffect } from "react";
import { Dimensions, View, Image, ScrollView, Animated } from "react-native";
import { Text, Button } from "../../../component";
import { LikeEmpty, Star, SendReview } from "../../../assets/svg";
import { activity_unesco2 } from "../../../assets/png";
import { useQuery } from "@apollo/client";
import DestinationById from "../../../graphQL/Query/Destination/DestinationById";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Reviews({ props, id, scroll, heights, scrollto }) {
  const [setting, setSetting] = useState("");
  const [token, setToken] = useState("");

  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    await setToken(tkn);

    let setsetting = await AsyncStorage.getItem("setting");
    await setSetting(JSON.parse(setsetting));
  };

  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", () => {
      loadAsync();
    });
    return unsubscribe;
  }, [props.navigation]);

  const { data, loading, error } = useQuery(DestinationById, {
    // variables: { id: props.props.route.params.id },
    variables: { id: id },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  return (
    <ScrollView
      ref={scroll}
      contentContainerStyle={{
        width: Dimensions.get("screen").width,
        paddingHorizontal: 15,
        paddingTop: heights,
        height: 1000,
      }}
      onScroll={Animated.event(
        [
          {
            nativeEvent: {
              contentOffset: {
                y: scroll,
              },
            },
          },
        ],
        { useNativeDriver: false }
      )}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
    >
      {data?.destinationById?.review.length > 0 ? (
        <View style={{ marginTop: 20 }}>
          {data?.destinationById?.review.map((item, index) => {
            let set = [1, 2, 3, 4, 5];
            return (
              <View key={item.id}>
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "#464646",
                      height: 50,
                      width: 50,
                      borderRadius: 25,
                    }}
                  ></View>
                  <View
                    style={{
                      marginLeft: 10,
                      width: Dimensions.get("screen").width * 0.7,
                    }}
                  >
                    <Text size="label" type="bold" numberOfLines={1}>
                      {item?.id}
                    </Text>
                    <View style={{ flexDirection: "row" }}>
                      {set.map((value, index) =>
                        item.rating >= value ? (
                          <Star height={15} width={15} />
                        ) : null
                      )}
                      <Text
                        size="description"
                        type="regular"
                        style={{ marginLeft: 5 }}
                      >
                        {item?.rating}
                      </Text>
                    </View>
                    <Text size="small" type="reguler">
                      23 June
                    </Text>
                  </View>
                  {/* <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginLeft: 10,
                    }}
                  >
                    <LikeEmpty height={25} width={25} />
                    <Text
                      size="small"
                      type="regular"
                      style={{ marginLeft: 10 }}
                    >
                      112
                    </Text>
                  </View> */}
                </View>
                <View
                  style={{
                    marginTop: 15,
                  }}
                >
                  <Text ellipsizeMode="head" size="label" type="reguler">
                    {item.ulasan}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      ) : (
        <View
          style={{
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <Text size="label" type="bold">
            Tidak ada Review
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
