import React, { useState, useRef } from "react";
import {
  Dimensions,
  View,
  Image,
  ScrollView,
  Pressable,
  Animated,
} from "react-native";
import { Text, Button, Truncate, FunIcon } from "../../../component";
import { LikeEmpty, Star, PinHijau } from "../../../assets/svg";
import { findLastKey } from "lodash";

export default function Generals({ data, scroll, heights }) {
  let [more, setMore] = useState(false);
  let [lines, setLines] = useState(3);
  const layoutText = (e) => {
    setMore(e.nativeEvent.lines.length > 3 && lines !== 0);
  };
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ backgroundColor: "#fff", paddingTop: heights }}
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
    >
      {/* View descrition */}
      {data?.description ? (
        <View
          style={{
            minHeight: 30,
            marginTop: 10,
            width: Dimensions.get("screen").width,
            paddingHorizontal: 15,
          }}
        >
          <Text
            size="readable"
            type="regular"
            style={{
              lineHeight: 20,
              textAlign: "left",
            }}
            numberOfLines={lines}
            onTextLayout={layoutText}
          >
            {data?.description}
          </Text>
          {more && (
            <Text
              size="readable"
              type="regular"
              onPress={() => {
                setLines(0);
                setMore(false);
              }}
              style={{ color: "#209FAE" }}
            >
              more
            </Text>
          )}
          {!more && (
            <Text
              size="readable"
              type="regular"
              onPress={() => {
                setLines(3);
              }}
              style={{ color: "#209FAE" }}
            >
              hide more
            </Text>
          )}
        </View>
      ) : null}

      {/* View GreatFor */}
      {data &&
      data.destinationById &&
      data.destinationById.greatfor.length > 0 ? (
        <View
          style={{
            width: Dimensions.get("screen").width,
            paddingHorizontal: 15,
          }}
        >
          <View
            style={{
              marginTop: 10,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#F3F3F3",
              minHeight: 50,
              justifyContent: "center",
              padding: 10,
              backgroundColor: "#FFF",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: Platform.OS == "ios" ? 0.22 : 2,
              shadowRadius: Platform.OS == "ios" ? 2.22 : 1.0,
              elevation: Platform.OS == "ios" ? 3 : 3.5,
            }}
          >
            <Text
              size="description"
              type="bold"
              style={{ textAlign: "center" }}
            >
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
        </View>
      ) : null}

      {/* View Public Facilty */}
      {data &&
      data.destinationById &&
      data.destinationById.core_facilities.length > 0 ? (
        <View
          style={{
            width: Dimensions.get("screen").width,
            paddingHorizontal: 15,
          }}
        >
          <View
            style={{
              marginTop: 10,
              borderRadius: 10,
              minHeight: 50,
              justifyContent: "center",
              padding: 10,
              backgroundColor: "#FFF",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: Platform.OS == "ios" ? 0.22 : 2,
              shadowRadius: Platform.OS == "ios" ? 2.22 : 1.0,
              elevation: Platform.OS == "ios" ? 3 : 3.5,
            }}
          >
            <Text
              size="description"
              type="bold"
              style={{ textAlign: "center" }}
            >
              Public Facility
            </Text>
            <View style={{ flexDirection: "row" }}>
              {data &&
                data.destinationById &&
                data.destinationById.core_facilities.map((item, index) => (
                  <View
                    key={index}
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
                      <FunIcon icon={item?.icon} height={25} width={25} />
                    </View>
                    <Text
                      size="description"
                      type="light"
                      style={{ marginTop: 5 }}
                    >
                      {item?.name}
                    </Text>
                  </View>
                ))}
            </View>
          </View>
        </View>
      ) : null}

      {/* Movie Location */}
      {data && data.destinationById && data.destinationById.facility ? (
        <>
          <View
            style={{
              width: Dimensions.get("screen").width,
              paddingHorizontal: 15,
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
                marginBottom: 10,
                flexDirection: "row",
                width: Dimensions.get("screen").width * 0.9,
                padding: 10,
                backgroundColor: "#FFF",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: Platform.OS == "ios" ? 0.22 : 2,
                shadowRadius: Platform.OS == "ios" ? 2.22 : 1.0,
                elevation: Platform.OS == "ios" ? 3 : 3.5,
              }}
            >
              <Image
                source={{ uri: data?.images[0].image }}
                style={{ height: "100%", width: "30%", borderWidth: 1 }}
              />
              <View style={{ width: "65%", height: "100%", marginLeft: 10 }}>
                <Text size="label" type="bold">
                  Sang Pemimpi
                </Text>
                <Text
                  size="description"
                  type="reguler"
                  style={{ lineHeight: 20 }}
                >
                  {Truncate({
                    text: data?.description,
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
                height: 130,
                marginTop: 10,
                marginBottom: 10,
                flexDirection: "row",
                width: "100%",
                padding: 10,
                marginLeft: 10,
                width: Dimensions.get("screen").width * 0.9,
                marginRight: 30,
                backgroundColor: "#FFF",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: Platform.OS == "ios" ? 0.22 : 2,
                shadowRadius: Platform.OS == "ios" ? 2.22 : 1.0,
                elevation: Platform.OS == "ios" ? 3 : 3.5,
              }}
            >
              <Image
                source={{ uri: data?.images[0].image }}
                style={{ height: "100%", width: "30%", borderWidth: 1 }}
              />
              <View style={{ width: "65%", height: "100%", marginLeft: 10 }}>
                <Text size="label" type="bold">
                  Sang Pemimpi
                </Text>
                <Text size="description" type="regular">
                  {Truncate({
                    text: data?.description,
                    length: 200,
                  })}
                </Text>
              </View>
            </Pressable>
          </ScrollView>
        </>
      ) : null}

      {/* Photo */}
      {data && data.destinationById && data.destinationById.images ? (
        <View
          style={{
            width: Dimensions.get("screen").width,
            paddingHorizontal: 15,
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
            {data && data.destinationById
              ? data.destinationById.images.map((item, index) => (
                  <Image
                    key={index}
                    source={{ uri: item.image }}
                    style={{ width: 80, height: 80, marginLeft: 2 }}
                  />
                ))
              : null}
          </View>
        </View>
      ) : null}

      {/* Another Place */}
      <View
        style={{
          width: Dimensions.get("screen").width,
          paddingHorizontal: 15,
          marginTop: 10,
          marginBottom: 50,
        }}
      >
        <Text size="label" type="bold">
          Another Place
        </Text>
        {data &&
          data.another_place.map((item, index) => (
            <View
              key={index}
              style={{
                borderWidth: 1,
                borderColor: "#F3F3F3",
                borderRadius: 10,
                height: 170,
                padding: 10,
                marginTop: 10,
                width: "100%",
                flexDirection: "row",
                backgroundColor: "#FFF",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: Platform.OS == "ios" ? 0.22 : 2,
                shadowRadius: Platform.OS == "ios" ? 2.22 : 1.0,
                elevation: Platform.OS == "ios" ? 3 : 3.5,
              }}
            >
              {/* Image */}
              <Image
                source={{ uri: item.images.image }}
                style={{
                  width: "40%",
                  height: "100%",
                  borderRadius: 10,
                }}
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
                      {item.rating}
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
                <Text
                  size="label"
                  type="bold"
                  style={{ marginTop: 2 }}
                  numberOfLines={1}
                >
                  {item.name}
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
                  <Text
                    size="description"
                    type="regular"
                    style={{ marginLeft: 5 }}
                    numberOfLines={1}
                  >
                    {item.cities.name}
                  </Text>
                </View>

                {/* Great for */}

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    height: 50,
                    marginTop: 5,
                  }}
                >
                  <View>
                    <Text size="description" type="bold">
                      Great for :
                    </Text>
                    {item.greatfor.icon ? (
                      <View style={{ flexDirection: "row" }}>
                        <FunIcon
                          icon={item.greatfor.icon}
                          height={30}
                          width={30}
                        />
                      </View>
                    ) : (
                      <Text>-</Text>
                    )}
                  </View>
                  <Button size="small" text={"Add"} style={{ marginTop: 20 }} />
                </View>
              </View>
            </View>
          ))}
      </View>
    </ScrollView>
  );
}
