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
import { LikeEmpty, Star, PinHijau, Love } from "../../../assets/svg";
import Liked from "../../../graphQL/Mutation/Destination/Liked";
import unLiked from "../../../graphQL/Mutation/Destination/UnLiked";
import { useMutation } from "@apollo/client";

export default function Generals({
  data,
  scroll,
  heights,
  props,
  scrollto,
  addTo,
}) {
  let [more, setMore] = useState(false);
  let [lines, setLines] = useState(3);
  let [dataAnother, setDataAnother] = useState(data);
  let [saveData, setSaveData] = useState();
  const layoutText = (e) => {
    setMore(e.nativeEvent.lines.length > 3 && lines !== 0);
  };

  console.log("data general", dataAnother);

  const [
    mutationliked,
    { loading: loadingLike, data: dataLike, error: errorLike },
  ] = useMutation(Liked, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const [
    mutationUnliked,
    { loading: loadingUnLike, data: dataUnLike, error: errorUnLike },
  ] = useMutation(unLiked, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const _liked = async (id) => {
    console.log(id);
    if (token || token !== "") {
      var tempData = { ...dataAnother };
      var index = tempData.another_place.findIndex((k) => k["id"] === id);
      tempData.another_place[index].liked = true;
      setDataAnother(tempData);
      try {
        let response = await mutationliked({
          variables: {
            destination_id: id,
            qty: 1,
          },
        });
        console.log("response like", response);
        if (loadingLike) {
          alert("Loading!!");
        }
        if (errorLike) {
          throw new Error("Error Input");
        }
        if (response.data) {
          if (
            response.data.setDestination_wishlist.code === 200 ||
            response.data.setDestination_wishlist.code === "200"
          ) {
            var tempData = { ...dataAnother };
            var index = tempData.another_place.findIndex((k) => k["id"] === id);
            tempData.another_place[index].liked = true;
            setDataAnother(tempData);
          } else {
            throw new Error(response.data.setDestination_wishlist.message);
          }
        }
      } catch (error) {
        var tempData = { ...dataAnother };
        var index = tempData.another_place.findIndex((k) => k["id"] === id);
        tempData.another_place[index].liked = false;
        setDataAnother(tempData);
        alert("" + error);
      }
    } else {
      alert("Please Login");
    }
  };

  const _unliked = async (id) => {
    if (token || token !== "") {
      var tempData = { ...dataAnother };
      var index = tempData.another_place.findIndex((k) => k["id"] === id);
      tempData.another_place[index].liked = false;
      setDataAnother(tempData);
      try {
        let response = await mutationUnliked({
          variables: {
            destination_id: id,
          },
        });
        console.log("response unlike", response);
        if (loadingUnLike) {
          alert("Loading!!");
        }
        if (errorUnLike) {
          throw new Error("Error Input");
        }
        if (response.data) {
          if (
            response.data.unset_wishlist_destinasi.code === 200 ||
            response.data.unset_wishlist_destinasi.code === "200"
          ) {
            var tempData = { ...dataAnother };
            var index = tempData.another_place.findIndex((k) => k["id"] === id);
            tempData.another_place[index].liked = false;
            setDataAnother(tempData);
          } else {
            throw new Error(response.data.unset_wishlist_destinasi.message);
          }
        }
      } catch (error) {
        var tempData = { ...dataAnother };
        var index = tempData.another_place.findIndex((k) => k["id"] === id);
        tempData.another_place[index].liked = true;
        setDataAnother(tempData);
        alert("" + error);
      }
    } else {
      alert("Please Login");
    }
  };
  return (
    <ScrollView
      ref={scroll}
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
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
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
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                paddingHorizontal: 10,
                // justifyContent: "center",
              }}
            >
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
            contentContainerStyle={{
              // width: Dimensions.get("screen").width,
              paddingLeft: 15,
              paddingRight: 10,
            }}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            spara
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
      {data && data.images ? (
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
              ? data.images.map((item, index) => {
                  if (index < 3) {
                    return (
                      <Image
                        key={index}
                        source={{ uri: item.image }}
                        style={{
                          // width: Dimensions.get("screen").width * 0.15,
                          width: Dimensions.get("screen").width * 0.22,
                          height: Dimensions.get("screen").height * 0.1,
                          marginLeft: 2,
                        }}
                      />
                    );
                  } else if (index === 3 && data.images.length > 4) {
                    return (
                      <>
                        <Image
                          key={index}
                          source={{ uri: item.image }}
                          style={{
                            opacity: 0.9,
                            width: Dimensions.get("screen").width * 0.22,
                            height: Dimensions.get("screen").height * 0.1,
                            opacity: 0.32,
                            marginLeft: 2,
                            backgroundColor: "#000",
                          }}
                        />
                        <Text
                          size="title"
                          type="regular"
                          style={{
                            position: "absolute",
                            right: 40,
                            alignSelf: "center",
                            color: "#FFF",
                          }}
                        >
                          {"+" + (data.images.length - 4)}
                        </Text>
                      </>
                    );
                  } else if (index === 3) {
                    return (
                      <Image
                        key={index}
                        source={{ uri: item.image }}
                        style={{
                          // width: Dimensions.get("screen").width * 0.15,
                          width: Dimensions.get("screen").width * 0.22,
                          height: Dimensions.get("screen").height * 0.1,
                          marginLeft: 2,
                        }}
                      />
                    );
                  } else {
                    null;
                  }
                })
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
        {dataAnother &&
          dataAnother.another_place.map((item, index) =>
            dataAnother.id !== item.id ? (
              <Pressable
                onPress={() =>
                  props.navigation.push("DestinationUnescoDetail", {
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
                        onPress={() => _unliked(item.id)}
                        style={{
                          backgroundColor: "#F3F3F3",
                          height: 34,
                          width: 34,
                          borderRadius: 17,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Love height={15} width={15} />
                      </Pressable>
                    ) : (
                      <Pressable
                        onPress={() => _liked(item.id)}
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
                      onPress={() => addTo()}
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
