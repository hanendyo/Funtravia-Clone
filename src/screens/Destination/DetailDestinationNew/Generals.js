import React, { useState, useRef } from "react";
import {
  Dimensions,
  View,
  Image,
  ScrollView,
  Pressable,
  Animated,
} from "react-native";
import Ripple from "react-native-material-ripple";
import { Text, Button, Truncate, FunIcon } from "../../../component";
import { LikeEmpty, Star, PinHijau, LikeBlack } from "../../../assets/svg";

export default function Generals({ data, scroll, heights, props }) {
  console.log("props general", props);
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
                <Text size="small" type="light" style={{ marginTop: 5 }}>
                  Sunbating
                </Text>
              </View>
            </View>
          </View>
        </View>
      ) : null}

      {/* View Public Facilty */}
      {data && data.core_facilities.length > 0 ? (
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
                data.core_facilities.map((item, index) => (
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
                    <Text size="small" type="light" style={{ marginTop: 5 }}>
                      {item?.name}
                    </Text>
                  </View>
                ))}
            </View>
          </View>
        </View>
      ) : null}

      {/* Moview */}
      {data && data.movie_location.length > 0 ? (
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
            {data &&
              data.movie_location.map((item, index) => (
                <Pressable
                  key={index}
                  style={{
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "#F3F3F3",
                    height: 130,
                    marginTop: 10,
                    marginBottom: 10,
                    flexDirection: "row",
                    // width: Dimensions.get("screen").width * 0.9,
                    width: Dimensions.get("screen").width * 0.7,
                    padding: 10,
                    backgroundColor: "#FFF",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: Platform.OS == "ios" ? 0.22 : 2,
                    shadowRadius: Platform.OS == "ios" ? 2.22 : 1.0,
                    elevation: Platform.OS == "ios" ? 3 : 3.5,
                    marginRight: 5,
                  }}
                >
                  <Image
                    source={{ uri: item?.cover }}
                    style={{ height: "100%", width: "30%", borderWidth: 1 }}
                  />
                  <View
                    style={{ width: "65%", height: "100%", marginLeft: 10 }}
                  >
                    <Text size="label" type="bold">
                      {item?.title}
                    </Text>
                    <Text
                      size="description"
                      type="reguler"
                      style={{ lineHeight: 20 }}
                    >
                      {Truncate({
                        text: item?.description,
                        length: 100,
                      })}
                    </Text>
                  </View>
                </Pressable>
              ))}
          </ScrollView>
        </>
      ) : null}

      {/* Photo */}
      {data.images ? (
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
            {data
              ? data.images.map((item, index) => (
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
          data.another_place.map((item, index) =>
            data.id !== item.id ? (
              <Pressable
                onPress={() =>
                  props.navigation.navigate("DestinationUnescoDetail", {
                    id: item.id,
                    name: item.name,
                    token: token,
                  })
                }
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
                    {item.liked === true ? (
                      <Pressable
                        style={{
                          backgroundColor: "#F3F3F3",
                          height: 34,
                          width: 34,
                          borderRadius: 17,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <LikeBlack height={15} width={15} />
                      </Pressable>
                    ) : (
                      <Pressable
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
                      </Pressable>
                    )}
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
                    <Button
                      size="small"
                      text={"Add"}
                      style={{ marginTop: 20 }}
                    />
                  </View>
                </View>
              </Pressable>
            ) : null
          )}
      </View>
    </ScrollView>
  );
}
