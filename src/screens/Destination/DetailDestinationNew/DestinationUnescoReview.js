import React, { useEffect, useState } from "react";
import {
  Dimensions,
  View,
  SafeAreaView,
  ScrollView,
  Image,
} from "react-native";
import {
  Arrowbackwhite,
  Star,
  StarBlue,
  CameraBlue,
  SendReview,
} from "../../../assets/svg";
import {
  ex_photo_1,
  ex_photo_2,
  ex_photo_3,
  ex_photo_4,
} from "../../../assets/png";
import { Button, Text } from "../../../component";
import { activity_unesco7 } from "../../../assets/png";

export default function DestinationUnescoReview(props) {
  let [data] = useState(props.route.params.data);
  const HeaderComponent = {
    headerShown: true,
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: "Write Review",
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      fontFamily: "Lato-Reguler",
      color: "white",
    },
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
        }}
      >
        <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
      </Button>
    ),
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    // const unsubscribe = props.navigation.addListener("focus");
    // return unsubscribe;
  }, [props.navigation]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
      <View
        style={{
          marginTop: 20,
          width: Dimensions.get("screen").width,
          paddingHorizontal: 15,
        }}
      >
        <Text size="title" type="bold">
          {data.name}
        </Text>
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              borderRadius: 3,
              backgroundColor: "#F4F4F4",
              padding: 2,
              marginRight: 5,
            }}
          >
            <Text size="description" type="bold">
              {data.type.name}
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          height: 150,
          marginTop: 10,
          paddingVertical: 10,
          borderBottomWidth: 1,
          borderBottomColor: "#D1D1D1",
          width: Dimensions.get("screen").width,
          paddingHorizontal: 15,
        }}
      >
        <Image
          source={{ uri: data.images[0].image }}
          height={50}
          width={100}
          style={{ height: "100%", width: "100%", borderRadius: 5 }}
        />
      </View>
      <View
        style={{
          width: Dimensions.get("screen").width,
          paddingHorizontal: 15,
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <Text size="description" type="regular">
          How was your experience at Pandawa Beach ?
        </Text>
        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <StarBlue height={30} width={30} style={{ marginRight: 5 }} />
          <StarBlue height={30} width={30} style={{ marginRight: 5 }} />
          <StarBlue height={30} width={30} style={{ marginRight: 5 }} />
          <StarBlue height={30} width={30} style={{ marginRight: 5 }} />
          <StarBlue height={30} width={30} />
        </View>
        <View
          style={{
            marginTop: 20,
            borderWidth: 1,
            borderColor: "#209FAE",
            height: 50,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CameraBlue width={20} height={20} />
          <Text size="description" type="reguler" style={{ color: "#209FAE" }}>
            Add Photo
          </Text>
        </View>
        <View
          style={{
            marginTop: 10,
            height: 70,
            width: "100%",
            flexDirection: "row",
          }}
        >
          <Image
            source={ex_photo_1}
            style={{ height: "100%", width: 70, marginRight: 5 }}
          />
          <Image
            source={ex_photo_2}
            style={{ height: "100%", width: 70, marginRight: 5 }}
          />
          <Image
            source={ex_photo_3}
            style={{ height: "100%", width: 70, marginRight: 5 }}
          />
          <Image source={ex_photo_4} style={{ height: "100%", width: 70 }} />
        </View>
      </View>
      <View
        style={{
          marginTop: 15,
          width: Dimensions.get("screen").width,
          paddingHorizontal: 15,
        }}
      >
        <Text size="label" type="bold">
          Share with us
        </Text>
        <View
          style={{
            height: 200,
            width: "100%",
            borderWidth: 1,
            borderColor: "#D1D1D1",
            backgroundColor: "#F6F6F6",
            marginTop: 10,
          }}
        >
          <Text
            size="description"
            type="regular"
            style={{ color: "#B6B6B6", margin: 10 }}
          >
            Tell us your feedback
          </Text>
        </View>
      </View>
      <View
        style={{
          marginTop: 15,
          width: Dimensions.get("screen").width,
          paddingHorizontal: 15,
        }}
      >
        <Text size="description" type="light">
          Term and Condition
        </Text>
        <Text size="small" type="light">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vitae mauris
        </Text>
      </View>
      <View
        style={{
          marginTop: 15,
          width: Dimensions.get("screen").width,
          paddingHorizontal: 15,
          marginBottom: 30,
        }}
      >
        <Button
          type="icon"
          color="secondary"
          size="medium"
          text="Send Review"
          style={{
            borderRadius: Dimensions.get("screen").width * 0.7,
            // alignSelf: "center",
          }}
        >
          <SendReview
            height={20}
            width={20}
            // style={{ zIndex: 3, borderWidth: 5 }}
          />
        </Button>
      </View>
    </ScrollView>
  );
}
