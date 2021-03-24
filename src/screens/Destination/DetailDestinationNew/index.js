import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  View,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  Pressable,
  StyleSheet,
} from "react-native";
import {
  Text,
  Button,
  StatusBar,
  Truncate,
  Capital,
  FunIcon,
} from "../../../component";
import DestinationById from "../../../graphQL/Query/Destination/DestinationById";
import { useQuery } from "@apollo/react-hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  LikeEmpty,
  Star,
  LikeBlack,
  ShareBlack,
  PinHijau,
  UnescoIcon,
  MovieIcon,
  Clock,
  Globe,
  Xhitam,
} from "../../../assets/svg";
import {
  ex_photo_1,
  ex_photo_2,
  ex_photo_3,
  ex_photo_4,
  activity_unesco1,
  activity_unesco2,
  activity_unesco3,
  activity_unesco4,
  activity_unesco5,
  activity_unesco6,
  activity_unesco7,
} from "../../../assets/png";
import { TabBar, SceneMap, TabView } from "react-native-tab-view";
import Modal from "react-native-modal";

export default function index(props) {
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
    variables: { id: props.route.params.id },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });
  console.log("data detail :", data);

  const General = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* View descrition */}
      {data?.destinationById?.description ? (
        <View style={{ minHeight: 30, marginTop: 10 }}>
          <Text
            size="readable"
            type="regular"
            style={{
              width: Dimensions.get("screen").width * 0.9,
              marginHorizontal: 15,
              lineHeight: 20,
              textAlign: "justify",
            }}
          >
            <Truncate text={data?.destinationById?.description} length={200} />
          </Text>
        </View>
      ) : null}

      {/* View GreatFor */}
      <View
        style={{
          marginTop: 10,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: "#F3F3F3",
          minHeight: 50,
          width: Dimensions.get("screen").width * 0.9,
          marginHorizontal: 15,
          justifyContent: "center",
          padding: 10,
        }}
      >
        <Text size="description" type="bold" style={{ textAlign: "center" }}>
          Great For
        </Text>
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              marginTop: 10,
              width: 70,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                height: 40,
                width: 40,
                borderRadius: 20,
                backgroundColor: "#F6F6F6",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FunIcon icon="i-4wd" height={20} width={20} />
            </View>
            <Text size="description" type="light" style={{ marginTop: 5 }}>
              Sunbating
            </Text>
          </View>
          <View
            style={{
              marginTop: 10,
              width: 70,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                height: 40,
                width: 40,
                borderRadius: 20,
                backgroundColor: "#F6F6F6",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FunIcon icon="i-4wd" height={20} width={20} />
            </View>
            <Text size="description" type="light" style={{ marginTop: 5 }}>
              Sunbating
            </Text>
          </View>
          <View
            style={{
              marginTop: 10,
              width: 70,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                height: 40,
                width: 40,
                borderRadius: 20,
                backgroundColor: "#F6F6F6",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FunIcon icon="i-4wd" height={20} width={20} />
            </View>
            <Text size="description" type="light" style={{ marginTop: 5 }}>
              Sunbating
            </Text>
          </View>
          <View
            style={{
              marginTop: 10,
              width: 70,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                height: 40,
                width: 40,
                borderRadius: 20,
                backgroundColor: "#F6F6F6",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FunIcon icon="i-4wd" height={20} width={20} />
            </View>
            <Text size="description" type="light" style={{ marginTop: 5 }}>
              Sunbating
            </Text>
          </View>
        </View>
      </View>

      {/* View Public Facilty */}
      <View
        style={{
          marginTop: 10,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: "#F3F3F3",
          minHeight: 50,
          width: Dimensions.get("screen").width * 0.9,
          marginHorizontal: 15,
          justifyContent: "center",
          padding: 10,
        }}
      >
        <Text size="description" type="bold" style={{ textAlign: "center" }}>
          Public Facility
        </Text>
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              marginTop: 10,
              width: 70,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                height: 40,
                width: 40,
                borderRadius: 20,
                backgroundColor: "#F6F6F6",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FunIcon icon="i-4wd" height={20} width={20} />
            </View>
            <Text size="description" type="light" style={{ marginTop: 5 }}>
              Sunbating
            </Text>
          </View>
          <View
            style={{
              marginTop: 10,
              width: 70,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                height: 40,
                width: 40,
                borderRadius: 20,
                backgroundColor: "#F6F6F6",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FunIcon icon="i-4wd" height={20} width={20} />
            </View>
            <Text size="description" type="light" style={{ marginTop: 5 }}>
              Sunbating
            </Text>
          </View>
        </View>
      </View>

      {/* Movie Location */}
      <View
        style={{
          width: Dimensions.get("screen").width * 0.9,
          marginHorizontal: 15,
          marginTop: 10,
        }}
      >
        <Text size="label" type="bold">
          Movie Location
        </Text>
      </View>
      <ScrollView
        style={{
          width: Dimensions.get("screen").width,
          paddingHorizontal: 15,
        }}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        <Pressable
          style={{
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "#F3F3F3",
            height: 130,
            marginTop: 10,
            flexDirection: "row",
            width: Dimensions.get("screen").width * 0.9,
            padding: 10,
          }}
        >
          <Image
            source={{ uri: data?.destinationById?.images[0].image }}
            style={{ height: "100%", width: "30%", borderWidth: 1 }}
          />
          <View style={{ width: "65%", height: "100%", marginLeft: 10 }}>
            <Text size="label" type="bold">
              Sang Pemimpi
            </Text>
            <Text size="description" type="reguler" style={{ lineHeight: 20 }}>
              {Truncate({
                text: data?.destinationById?.description,
                length: 100,
              })}
            </Text>
          </View>
        </Pressable>
        <Pressable
          style={{
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "#F3F3F3",
            height: 150,
            marginTop: 10,
            flexDirection: "row",
            width: "100%",
            padding: 10,
            marginLeft: 10,
            width: Dimensions.get("screen").width * 0.9,
            marginRight: 30,
          }}
        >
          <Image
            source={{ uri: data?.destinationById?.images[0].image }}
            style={{ height: "100%", width: "30%", borderWidth: 1 }}
          />
          <View style={{ width: "65%", height: "100%", marginLeft: 10 }}>
            <Text size="label" type="bold">
              Sang Pemimpi
            </Text>
            <Text size="description" type="regular">
              {Truncate({
                text: data?.destinationById?.description,
                length: 200,
              })}
            </Text>
          </View>
        </Pressable>
      </ScrollView>

      {/* Photo */}
      <View
        style={{
          width: Dimensions.get("screen").width * 0.9,
          marginHorizontal: 15,
          marginTop: 10,
        }}
      >
        <Text size="label" type="bold">
          Photos
        </Text>
        <View
          style={{
            flexDirection: "row",
            marginTop: 10,
            width: "100%",
          }}
        >
          <Image source={ex_photo_1} style={{ width: 80, height: 80 }} />
          <Image
            source={ex_photo_2}
            style={{ width: 80, height: 80, marginLeft: 2 }}
          />
          <Image
            source={ex_photo_3}
            style={{ width: 80, height: 80, marginLeft: 2 }}
          />
          <Image
            source={ex_photo_4}
            style={{ width: 80, height: 80, marginLeft: 2 }}
          />
        </View>
      </View>

      {/* Another Place */}
      <View
        style={{
          width: Dimensions.get("screen").width * 0.9,
          marginHorizontal: 15,
          marginTop: 10,
          marginBottom: 50,
        }}
      >
        <Text size="label" type="bold">
          Another Place
        </Text>
        <Pressable
          style={{
            borderWidth: 1,
            borderColor: "#F3F3F3",
            borderRadius: 10,
            height: 170,
            padding: 10,
            marginTop: 10,
            width: "100%",
            flexDirection: "row",
          }}
        >
          {/* Image */}
          <Image
            source={ex_photo_1}
            style={{ width: "40%", height: "100%", borderRadius: 10 }}
          />

          {/* Keterangan */}
          {/* rating */}
          <View style={{ width: "55%", marginHorizontal: 10 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: "#F3F3F3",
                  borderRadius: 3,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 5,
                  height: 25,
                }}
              >
                <Star height={15} width={15} />
                <Text size="description" type="bold">
                  4.8
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: "#F3F3F3",
                  height: 34,
                  width: 34,
                  borderRadius: 17,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <LikeEmpty height={15} width={15} />
              </View>
            </View>

            {/* Title */}
            <Text size="label" type="bold" style={{ marginTop: 2 }}>
              <Truncate text={"Kuta Beach"} length={20} />
            </Text>

            {/* Maps */}
            <View
              style={{
                flexDirection: "row",
                marginTop: 5,
                alignItems: "center",
              }}
            >
              <PinHijau height={15} width={15} />
              <Text size="description" type="regular" style={{ marginLeft: 5 }}>
                Central Java
              </Text>
            </View>

            {/* Great for */}
            <Text size="description" type="bold" style={{ marginTop: 10 }}>
              Geat for :
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                height: 35,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-end",
                }}
              >
                <FunIcon icon="i-4wd" height={30} width={30} />
                <FunIcon
                  icon="i-4wd"
                  height={30}
                  width={30}
                  style={{ marginLeft: 10 }}
                />
              </View>
              <Button text={"Add"} style={{ height: "100%" }} />
            </View>
          </View>
        </Pressable>
        <Pressable
          style={{
            borderWidth: 1,
            borderColor: "#F3F3F3",
            borderRadius: 10,
            height: 170,
            padding: 10,
            marginTop: 10,
            width: "100%",
            flexDirection: "row",
          }}
        >
          {/* Image */}
          <Image
            source={ex_photo_2}
            style={{ width: "40%", height: "100%", borderRadius: 10 }}
          />

          {/* Keterangan */}
          {/* rating */}
          <View style={{ width: "55%", marginHorizontal: 10 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: "#F3F3F3",
                  borderRadius: 3,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 5,
                  height: 25,
                }}
              >
                <Star height={15} width={15} />
                <Text size="description" type="bold">
                  4.8
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: "#F3F3F3",
                  height: 34,
                  width: 34,
                  borderRadius: 17,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <LikeEmpty height={15} width={15} />
              </View>
            </View>

            {/* Title */}
            <Text size="label" type="bold" style={{ marginTop: 2 }}>
              <Truncate text={"Legian Beach"} length={20} />
            </Text>

            {/* Maps */}
            <View
              style={{
                flexDirection: "row",
                marginTop: 5,
                alignItems: "center",
              }}
            >
              <PinHijau height={15} width={15} />
              <Text size="description" type="regular" style={{ marginLeft: 5 }}>
                Central Java
              </Text>
            </View>

            {/* Great for */}
            <Text size="description" type="bold" style={{ marginTop: 10 }}>
              Geat for :
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                height: 35,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-end",
                }}
              >
                <FunIcon icon="i-4wd" height={30} width={30} />
                <FunIcon
                  icon="i-4wd"
                  height={30}
                  width={30}
                  style={{ marginLeft: 10 }}
                />
              </View>
              <Button text={"Add"} style={{ height: "100%" }} />
            </View>
          </View>
        </Pressable>
        <Pressable
          style={{
            borderWidth: 1,
            borderColor: "#F3F3F3",
            borderRadius: 10,
            height: 170,
            padding: 10,
            marginTop: 10,
            width: "100%",
            flexDirection: "row",
          }}
        >
          {/* Image */}
          <Image
            source={ex_photo_3}
            style={{ width: "40%", height: "100%", borderRadius: 10 }}
          />

          {/* Keterangan */}
          {/* rating */}
          <View style={{ width: "55%", marginHorizontal: 10 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: "#F3F3F3",
                  borderRadius: 3,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 5,
                  height: 25,
                }}
              >
                <Star height={15} width={15} />
                <Text size="description" type="bold">
                  4.8
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: "#F3F3F3",
                  height: 34,
                  width: 34,
                  borderRadius: 17,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <LikeEmpty height={15} width={15} />
              </View>
            </View>

            {/* Title */}
            <Text size="label" type="bold" style={{ marginTop: 2 }}>
              <Truncate text={"Melasti Beach"} length={20} />
            </Text>

            {/* Maps */}
            <View
              style={{
                flexDirection: "row",
                marginTop: 5,
                alignItems: "center",
              }}
            >
              <PinHijau height={15} width={15} />
              <Text size="description" type="regular" style={{ marginLeft: 5 }}>
                Central Java
              </Text>
            </View>

            {/* Great for */}
            <Text size="description" type="bold" style={{ marginTop: 10 }}>
              Geat for :
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                height: 35,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-end",
                }}
              >
                <FunIcon icon="i-4wd" height={30} width={30} />
                <FunIcon
                  icon="i-4wd"
                  height={30}
                  width={30}
                  style={{ marginLeft: 10 }}
                />
              </View>
              <Button text={"Add"} style={{ height: "100%" }} />
            </View>
          </View>
        </Pressable>
      </View>
    </ScrollView>
  );

  const Activity = () => (
    <ScrollView style={{ flex: 1 }} showsHorizontalScrollIndicator={false}>
      <View
        style={{
          borderWidth: 1,
          borderRadius: 10,
          borderColor: "#F3F3F3",
          minHeight: 250,
          marginTop: 10,
          width: Dimensions.get("screen").width * 0.9,
          marginHorizontal: 15,
          padding: 10,
        }}
      >
        {/* Title */}
        <View
          style={{
            height: 30,
            width: "100%",
            flexDirection: "row",
          }}
        >
          <View
            style={{
              backgroundColor: "#209FAE",
              height: 30,
              width: 30,
              borderRadius: 15,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#FFF" }} size="title" type="bold">
              1
            </Text>
          </View>
          <Text
            size="title"
            type="bold"
            style={{ color: "#209FAE", marginLeft: 15 }}
          >
            Banana Boat
          </Text>
        </View>

        {/* Image*/}
        <Image
          source={activity_unesco1}
          style={{
            height: 150,
            width: "100%",
            marginTop: 10,
            borderRadius: 10,
          }}
        />
        <Text size="description" type="regular" style={{ marginTop: 10 }}>
          <Truncate text={data?.destinationById?.description} length={100} />
        </Text>
        <Button
          onPress={() => setModalActivity(true)}
          text={"Details"}
          type="box"
          size="small"
          variant="transparent"
          style={{
            borderColor: "#209FAE",
            borderWidth: 1,
            marginTop: 10,
            width: 100,
            alignSelf: "center",
            marginBottom: 10,
          }}
        ></Button>
      </View>
      <View
        style={{
          borderWidth: 1,
          borderRadius: 10,
          borderColor: "#F3F3F3",
          minHeight: 250,
          marginTop: 10,
          width: Dimensions.get("screen").width * 0.9,
          marginHorizontal: 15,
          padding: 10,
        }}
      >
        {/* Title */}
        <View
          style={{
            height: 30,
            width: "100%",
            flexDirection: "row",
          }}
        >
          <View
            style={{
              backgroundColor: "#209FAE",
              height: 30,
              width: 30,
              borderRadius: 15,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#FFF" }} size="title" type="bold">
              2
            </Text>
          </View>
          <Text
            size="title"
            type="bold"
            style={{ color: "#209FAE", marginLeft: 15 }}
          >
            Jetski
          </Text>
        </View>

        {/* Image*/}
        <Image
          source={activity_unesco2}
          style={{
            height: 150,
            width: "100%",
            marginTop: 10,
            borderRadius: 10,
          }}
        />
        <Text size="description" type="regular" style={{ marginTop: 10 }}>
          <Truncate text={data?.destinationById?.description} length={100} />
        </Text>
        <Button
          text={"Details"}
          type="box"
          size="small"
          variant="transparent"
          style={{
            borderColor: "#209FAE",
            borderWidth: 1,
            marginTop: 10,
            width: 100,
            alignSelf: "center",
            marginBottom: 10,
          }}
        ></Button>
      </View>
      <View
        style={{
          borderWidth: 1,
          borderRadius: 10,
          borderColor: "#F3F3F3",
          minHeight: 250,
          marginTop: 10,
          width: Dimensions.get("screen").width * 0.9,
          marginHorizontal: 15,
          padding: 10,
        }}
      >
        {/* Title */}
        <View
          style={{
            height: 30,
            width: "100%",
            flexDirection: "row",
          }}
        >
          <View
            style={{
              backgroundColor: "#209FAE",
              height: 30,
              width: 30,
              borderRadius: 15,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#FFF" }} size="title" type="bold">
              3
            </Text>
          </View>
          <Text
            size="title"
            type="bold"
            style={{ color: "#209FAE", marginLeft: 15 }}
          >
            Parasailing
          </Text>
        </View>

        {/* Image*/}
        <Image
          source={activity_unesco3}
          style={{
            height: 150,
            width: "100%",
            marginTop: 10,
            borderRadius: 10,
          }}
        />
        <Text size="description" type="regular" style={{ marginTop: 10 }}>
          <Truncate text={data?.destinationById?.description} length={100} />
        </Text>
        <Button
          onPress={() => setModalActivity(true)}
          text={"Details"}
          type="box"
          size="small"
          variant="transparent"
          style={{
            borderColor: "#209FAE",
            borderWidth: 1,
            marginTop: 10,
            width: 100,
            alignSelf: "center",
            marginBottom: 10,
          }}
        ></Button>
      </View>
    </ScrollView>
  );

  const Facility = () => (
    <ScrollView
      style={{
        flex: 1,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={{
          borderWidth: 1,
          borderRadius: 10,
          borderColor: "#F3F3F3",
          minHeight: 250,
          marginTop: 10,
          width: Dimensions.get("screen").width * 0.9,
          marginHorizontal: 15,
          padding: 10,
        }}
      >
        {/* Title */}
        <View
          style={{
            height: 30,
            width: "100%",
            flexDirection: "row",
          }}
        >
          <View
            style={{
              backgroundColor: "#209FAE",
              height: 30,
              width: 30,
              borderRadius: 15,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#FFF" }} size="title" type="bold">
              1
            </Text>
          </View>
          <Text
            size="title"
            type="bold"
            style={{ color: "#209FAE", marginLeft: 15 }}
          >
            Toilet
          </Text>
        </View>

        {/* Image*/}
        <Image
          source={activity_unesco4}
          style={{
            height: 150,
            width: "100%",
            marginTop: 10,
            borderRadius: 10,
          }}
        />
        <Text size="description" type="regular" style={{ marginTop: 10 }}>
          <Truncate text={data?.destinationById?.description} length={100} />
        </Text>
        <Button
          text={"Details"}
          type="box"
          size="small"
          variant="transparent"
          style={{
            borderColor: "#209FAE",
            borderWidth: 1,
            marginTop: 10,
            width: 100,
            alignSelf: "center",
            marginBottom: 10,
          }}
        ></Button>
      </View>
      <View
        style={{
          borderWidth: 1,
          borderRadius: 10,
          borderColor: "#F3F3F3",
          minHeight: 250,
          marginTop: 10,
          width: Dimensions.get("screen").width * 0.9,
          marginHorizontal: 15,
          padding: 10,
        }}
      >
        {/* Title */}
        <View
          style={{
            height: 30,
            width: "100%",
            flexDirection: "row",
          }}
        >
          <View
            style={{
              backgroundColor: "#209FAE",
              height: 30,
              width: 30,
              borderRadius: 15,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#FFF" }} size="title" type="bold">
              2
            </Text>
          </View>
          <Text
            size="title"
            type="bold"
            style={{ color: "#209FAE", marginLeft: 15 }}
          >
            Changing Room
          </Text>
        </View>

        {/* Image*/}
        <Image
          source={activity_unesco6}
          style={{
            height: 150,
            width: "100%",
            marginTop: 10,
            borderRadius: 10,
          }}
        />
        <Text size="description" type="regular" style={{ marginTop: 10 }}>
          <Truncate text={data?.destinationById?.description} length={100} />
        </Text>
        <Button
          text={"Details"}
          type="box"
          size="small"
          variant="transparent"
          style={{
            borderColor: "#209FAE",
            borderWidth: 1,
            marginTop: 10,
            width: 100,
            alignSelf: "center",
            marginBottom: 10,
          }}
        ></Button>
      </View>
      <View
        style={{
          borderWidth: 1,
          borderRadius: 10,
          borderColor: "#F3F3F3",
          minHeight: 250,
          marginTop: 10,
          width: Dimensions.get("screen").width * 0.9,
          marginHorizontal: 15,
          padding: 10,
        }}
      >
        {/* Title */}
        <View
          style={{
            height: 30,
            width: "100%",
            flexDirection: "row",
          }}
        >
          <View
            style={{
              backgroundColor: "#209FAE",
              height: 30,
              width: 30,
              borderRadius: 15,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#FFF" }} size="title" type="bold">
              3
            </Text>
          </View>
          <Text
            size="title"
            type="bold"
            style={{ color: "#209FAE", marginLeft: 15 }}
          >
            Parking
          </Text>
        </View>

        {/* Image*/}
        <Image
          source={activity_unesco7}
          style={{
            height: 150,
            width: "100%",
            marginTop: 10,
            borderRadius: 10,
          }}
        />
        <Text size="description" type="regular" style={{ marginTop: 10 }}>
          <Truncate text={data?.destinationById?.description} length={100} />
        </Text>
        <Button
          text={"Details"}
          type="box"
          size="small"
          variant="transparent"
          style={{
            borderColor: "#209FAE",
            borderWidth: 1,
            marginTop: 10,
            width: 100,
            alignSelf: "center",
            marginBottom: 10,
          }}
        ></Button>
      </View>
    </ScrollView>
  );

  const Service = () => (
    <ScrollView
      style={{
        flex: 1,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={{
          borderWidth: 1,
          borderRadius: 10,
          borderColor: "#F3F3F3",
          minHeight: 250,
          marginTop: 10,
          width: Dimensions.get("screen").width * 0.9,
          marginHorizontal: 15,
          padding: 10,
        }}
      >
        {/* Title */}
        <View
          style={{
            height: 30,
            width: "100%",
            flexDirection: "row",
          }}
        >
          <View
            style={{
              backgroundColor: "#209FAE",
              height: 30,
              width: 30,
              borderRadius: 15,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#FFF" }} size="title" type="bold">
              1
            </Text>
          </View>
          <Text
            size="title"
            type="bold"
            style={{ color: "#209FAE", marginLeft: 15 }}
          >
            Pijat Tradisional
          </Text>
        </View>

        {/* Image*/}
        <Image
          source={activity_unesco5}
          style={{
            height: 150,
            width: "100%",
            marginTop: 10,
            borderRadius: 10,
          }}
        />
        <Text size="description" type="regular" style={{ marginTop: 10 }}>
          <Truncate text={data?.destinationById?.description} length={100} />
        </Text>
        <Button
          text={"Details"}
          type="box"
          size="small"
          variant="transparent"
          style={{
            borderColor: "#209FAE",
            borderWidth: 1,
            marginTop: 10,
            width: 100,
            alignSelf: "center",
            marginBottom: 10,
          }}
        ></Button>
      </View>
    </ScrollView>
  );

  const FAQ = () => (
    <View
      style={{
        marginTop: 20,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text size="title" type="bold">
        FAQ
      </Text>
    </View>
  );

  const Review = () => (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      {/* View Name */}
      <View
        style={{
          width: Dimensions.get("screen").width * 0.9,
          marginHorizontal: 15,
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
              height: 60,
              width: 60,
              borderRadius: 30,
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
              <Text size="description" type="regular" style={{ marginLeft: 5 }}>
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
        style={{
          width: Dimensions.get("screen").width * 0.9,
          marginHorizontal: 15,
          marginTop: 15,
        }}
      >
        <Text size="label" type="reguler">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Diam cursus
          nunc, etiam Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Diam cursus nunc, etiam Lorem ipsum dolor sit amet, consectetur
          adipiscing elit. Diam cursus nunc, etiam{" "}
        </Text>
      </View>
      <View
        style={{
          width: Dimensions.get("screen").width * 0.9,
          marginHorizontal: 15,
          marginTop: 10,
          flexDirection: "row",
        }}
      >
        <Image
          source={activity_unesco2}
          style={{ height: 110, width: 150, borderRadius: 5 }}
        />
        <Image
          source={activity_unesco2}
          style={{ height: 110, width: 150, marginLeft: 10, borderRadius: 5 }}
        />
      </View>
      <View
        style={{
          width: Dimensions.get("screen").width * 0.9,
          marginHorizontal: 15,
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
              height: 60,
              width: 60,
              borderRadius: 30,
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
              <Text size="description" type="regular" style={{ marginLeft: 5 }}>
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
        style={{
          width: Dimensions.get("screen").width * 0.9,
          marginHorizontal: 15,
          marginTop: 15,
        }}
      >
        <Text size="label" type="reguler">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Diam cursus
          nunc, etiam Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Diam cursus nunc, etiam Lorem ipsum dolor sit amet, consectetur
          adipiscing elit. Diam cursus nunc, etiam{" "}
        </Text>
      </View>
      <View
        style={{
          width: Dimensions.get("screen").width * 0.9,
          marginHorizontal: 15,
          marginTop: 10,
          flexDirection: "row",
        }}
      >
        <Image
          source={activity_unesco2}
          style={{ height: 110, width: 150, borderRadius: 5 }}
        />
        <Image
          source={activity_unesco2}
          style={{ height: 110, width: 150, marginLeft: 10, borderRadius: 5 }}
        />
      </View>
    </ScrollView>
  );

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "general", title: "General" },
    { key: "activity", title: "Activity" },
    { key: "facility", title: "Facility" },
    { key: "service", title: "Service" },
    { key: "FAQ", title: "FAQ" },
    { key: "review", title: "Review" },
  ]);

  const renderScene = SceneMap({
    general: General,
    activity: Activity,
    facility: Facility,
    service: Service,
    FAQ: FAQ,
    review: Review,
  });

  if (loading) {
    <ActivityIndicator animating={true} color="#209FAE" />;
  }

  if (error) {
    <View style={{ marginTop: 20, alignItems: "center" }}>
      <Text size="label" type="bold">
        Error
      </Text>
    </View>;
  }

  const [modalActivity, setModalActivity] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Modal
        isVisible={modalActivity}
        onRequestClose={() => {
          setModalActivity(false);
        }}
        animationIn="slideInRight"
        animationOut="slideOutRight"
        style={{
          // flex: 1,
          backgroundColor: "#fff",
        }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={
              {
                // width: Dimensions.get("screen").width * 0.9,
                // marginHorizontal: 15,
                // marginTop: 10,
                // flexDirection: "row",
              }
            }
          >
            <Text size="title" type="bold" style={{ color: "#209FAE" }}>
              Banana Boat
            </Text>
            <Xhitam height={15} width={15} />
          </View>
        </ScrollView>
      </Modal>
      <ScrollView
        showsVerticalScrollIndicator={false}
        // stickyHeaderIndices={[5]}
      >
        {/* <StatusBar backgroundColor="#14646E" barStyle="light-content" /> */}

        {/* View Image Top */}
        <View
          style={{
            width: Dimensions.get("screen").width,
            height: 200,
            backgroundColor: "#209FAE",
          }}
        >
          {data && data.destinationById && data.destinationById.images ? (
            <Image
              source={{ uri: data?.destinationById?.images[0].image }}
              style={{ height: "100%", width: "100%" }}
            />
          ) : null}
        </View>

        {/*View  Title */}
        <View
          style={{
            marginTop: 10,
            marginHorizontal: 15,
            width: Dimensions.get("screen").width * 0.9,
            minHeight: 50,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              width: Dimensions.get("screen").width * 0.7,
            }}
          >
            <Text size="title" type="black">
              {data?.destinationById?.name}
            </Text>
            <View style={{ flexDirection: "row", marginTop: 2 }}>
              <View
                style={{
                  borderRadius: 3,
                  backgroundColor: "#F4F4F4",
                  padding: 2,
                  marginRight: 5,
                }}
              >
                <Text size="description" type="bold">
                  Beach
                </Text>
              </View>
              <View
                style={{
                  borderRadius: 3,
                  backgroundColor: "#F4F4F4",
                  padding: 2,
                  flexDirection: "row",
                  marginRight: 5,
                }}
              >
                <Star height={13} width={13} />
                <Text size="description" type="bold">
                  4.9
                </Text>
              </View>
              <View
                style={{
                  borderRadius: 2,
                  padding: 2,
                }}
              >
                <Text
                  size="description"
                  type="regular"
                  style={{ color: "#209FAE" }}
                >
                  256 Reviews
                </Text>
              </View>
            </View>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Pressable
              style={{
                backgroundColor: "#F6F6F6",
                marginRight: 2,
                height: 34,
                width: 34,
                borderRadius: 17,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 5,
              }}
            >
              {data?.destinationById.liked === true ? (
                <LikeBlack height={18} width={18} />
              ) : (
                <LikeEmpty height={18} width={18} />
              )}
            </Pressable>
            <Pressable
              style={{
                backgroundColor: "#F6F6F6",
                marginRight: 2,
                height: 34,
                width: 34,
                borderRadius: 17,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ShareBlack height={20} width={20} />
            </Pressable>
          </View>
        </View>

        {/* View Types */}
        <View
          style={{
            width: Dimensions.get("screen").width * 0.9,
            marginHorizontal: 15,
            height: 30,
            marginTop: 5,
            flexDirection: "row",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              padding: 5,
              borderRadius: 5,
              marginRight: 5,
              backgroundColor: "#DAF0F2",
            }}
          >
            <UnescoIcon height={20} width={20} style={{ marginRight: 5 }} />
            <Text size="description" type="regular">
              UNESCO
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              padding: 5,
              borderRadius: 5,
              backgroundColor: "#DAF0F2",
            }}
          >
            <MovieIcon height={20} width={20} style={{ marginRight: 5 }} />
            <Text size="description" type="regular">
              Movie Location
            </Text>
          </View>
        </View>

        {/* View address */}
        <View
          style={{
            marginTop: 10,
            borderTopWidth: 1,
            borderTopColor: "#F6F6F6",
            width: Dimensions.get("screen").width,
            minHeight: 40,
            paddingHorizontal: 15,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",

              width: Dimensions.get("screen").width * 0.75,
            }}
          >
            <PinHijau height={18} width={18} style={{ marginRight: 10 }} />
            <Text size="description" type="regular">
              {data?.destinationById?.address}
            </Text>
          </View>
          <Pressable
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              size="description"
              type="regular"
              style={{ color: "#209FAE" }}
            >
              maps
            </Text>
          </Pressable>
        </View>

        {/* View Time */}
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: "#F6F6F6",
            width: Dimensions.get("screen").width,
            minHeight: 40,
            paddingHorizontal: 15,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              width: Dimensions.get("screen").width * 0.75,
            }}
          >
            <Clock height={18} width={18} style={{ marginRight: 10 }} />
            <Text size="description" type="regular">
              {data?.destinationById?.openat}
            </Text>
          </View>
          <Pressable
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              size="description"
              type="regular"
              style={{ color: "#209FAE" }}
            >
              more
            </Text>
          </Pressable>
        </View>

        {/* View Website */}
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: "#F6F6F6",
            width: Dimensions.get("screen").width,
            minHeight: 40,
            paddingHorizontal: 15,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              width: Dimensions.get("screen").width * 0.75,
            }}
          >
            <Globe height={18} width={18} style={{ marginRight: 10 }} />
            <Text size="description" type="regular">
              {data?.destinationById?.website}
            </Text>
          </View>
          <Pressable
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              size="description"
              type="regular"
              style={{ color: "#209FAE" }}
            >
              more
            </Text>
          </Pressable>
        </View>

        {/* View Garis */}
        <View
          style={{
            backgroundColor: "#F6F6F6",
            height: 5,
            width: Dimensions.get("screen").width,
            marginVertical: 5,
          }}
        />

        {/* Tabs */}

        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          renderTabBar={(props) => (
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              <View>
                <TabBar
                  {...props}
                  style={{
                    backgroundColor: "white",
                    borderBottomWidth: 2,
                    // borderBottomColor: "rgb(32,159,174,0.1)",
                    borderBottomColor: "#D3E9EC",
                  }}
                  renderLabel={({ route, focused }) => {
                    return (
                      <Text
                        style={[
                          focused ? styles.labelActive : styles.label,
                          { opacity: focused ? 1 : 0.7 },
                        ]}
                      >
                        {route.title}
                      </Text>
                    );
                  }}
                  indicatorStyle={styles.indicator}
                />
              </View>
            </ScrollView>
          )}

          // renderTabBar={() => null}
          // renderLazyPlaceholder={() => time()}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    height: 100,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    backgroundColor: "#FFF",
  },
  label: {
    fontSize: 14,
    color: "#464646",
    fontFamily: "Lato-Bold",
  },
  labelActive: {
    fontSize: 14,
    color: "#209FAE",
    fontFamily: "Lato-Bold",
    borderBottomColor: "#209FAE",
  },
  tab: {
    elevation: 1,
    shadowOpacity: 0.5,
    backgroundColor: "#FFF",
    height: 50,
  },
  indicator: { backgroundColor: "#209FAE", height: 2, width: "20%" },
});
