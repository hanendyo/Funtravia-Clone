import React, { useState, useEffect } from "react";
import { Dimensions, View, Image, ScrollView } from "react-native";
import { Text, Button } from "../../../component";
import { LikeEmpty, Star, SendReview } from "../../../assets/svg";
import { activity_unesco2 } from "../../../assets/png";
import { useQuery } from "@apollo/client";
import DestinationById from "../../../graphQL/Query/Destination/DestinationById";

export default function Reviews({ props, data }) {
  console.log("props review", props);
  console.log("props review", data);
  // const [setting, setSetting] = useState("");
  // const [token, setToken] = useState("");

  // const loadAsync = async () => {
  //   let tkn = await AsyncStorage.getItem("access_token");
  //   await setToken(tkn);

  //   let setsetting = await AsyncStorage.getItem("setting");
  //   await setSetting(JSON.parse(setsetting));
  // };

  // useEffect(() => {
  //   const unsubscribe = props.navigation.addListener("focus", () => {
  //     loadAsync();
  //   });
  //   return unsubscribe;
  // }, [props.navigation]);

  // const { data, loading, error } = useQuery(DestinationById, {
  //   // variables: { id: props.props.route.params.id },
  //   variables: { id: "a7b22010-4f53-4108-ba4a-e5cb459791af" },
  //   context: {
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${token}`,
  //     },
  //   },
  // });

  // console.log("data review", data);

  return (
    // <View>
    //   <Text>test</Text>
    // </View>

    <ScrollView
      style={{
        flex: 1,
        width: Dimensions.get("screen").width,
        paddingHorizontal: 15,
      }}
      showsVerticalScrollIndicator={false}
    >
      {data?.destinationById.review?.length > 0 ? (
        <>
          {/* View Name */}
          <View
            style={{
              height: 70,
              flexDirection: "row",
              marginTop: 15,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  backgroundColor: "#464646",
                  height: 50,
                  width: 50,
                  borderRadius: 25,
                }}
              ></View>
              <View style={{ marginLeft: 10 }}>
                <Text size="label" type="bold">
                  Wisnu Utama
                </Text>
                <View style={{ flexDirection: "row" }}>
                  <Star height={15} width={15} />
                  <Star height={15} width={15} />
                  <Star height={15} width={15} />
                  <Star height={15} width={15} />
                  <Text
                    size="description"
                    type="regular"
                    style={{ marginLeft: 5 }}
                  >
                    9.8/10
                  </Text>
                </View>
                <Text size="small" type="reguler">
                  23 June
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <LikeEmpty height={25} width={25} />
              <Text size="small" type="regular" style={{ marginLeft: 10 }}>
                112
              </Text>
            </View>
          </View>
          <View
            style={
              {
                // marginTop: 15,
              }
            }
          >
            <Text
              // numberOfLines={2}
              ellipsizeMode="head"
              size="label"
              type="reguler"
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Diam
              cursus nunc, etiam Lorem ipsum dolor sit amet, consectetur
              adipiscing elit. Diam cursus nunc, etiam Lorem ipsum dolor sit
              amet, consectetur adipiscing elit. Diam cursus nunc, etiam
            </Text>
          </View>
          <View
            style={{
              marginTop: 10,
              flexDirection: "row",
            }}
          >
            <Image
              source={activity_unesco2}
              style={{ height: 110, width: 130, borderRadius: 5 }}
            />
            <Image
              source={activity_unesco2}
              style={{
                height: 110,
                width: 130,
                marginLeft: 10,
                borderRadius: 5,
              }}
            />
          </View>
        </>
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
      <Button
        color="secondary"
        type="icon"
        text="Write Review"
        style={{
          bottom: 0,
          width: Dimensions.get("screen").width * 0.7,
          borderRadius: 42,
          alignSelf: "center",
          marginTop: Dimensions.get("screen").height * 0.2,
        }}
        onPress={() =>
          props.navigation.navigate("DestinationUnescoReview", {
            data: data.destinationById,
          })
        }
      >
        <SendReview height={15} width={15} />
      </Button>
    </ScrollView>
  );
}
