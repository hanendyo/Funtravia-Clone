import React, { useState, useRef } from "react";
import { Dimensions, View, Image, ScrollView, Pressable } from "react-native";
import { Text, Button, FunImage, FunIcon } from "../../../component";
import { LikeEmpty, Star, PinHijau, Love } from "../../../assets/svg";
import Liked from "../../../graphQL/Mutation/Destination/Liked";
import unLiked from "../../../graphQL/Mutation/Destination/UnLiked";
import { useMutation } from "@apollo/client";
import Ripple from "react-native-material-ripple";
import ImageSlide from "../../../component/src/ImageSlide";
const { width, height } = Dimensions.get("screen");
import { useTranslation } from "react-i18next";

export default function Generals({ data, props, addTo }) {
  let [more, setMore] = useState(false);
  const { t } = useTranslation();
  let [lines, setLines] = useState(3);
  let [dataAnother, setDataAnother] = useState({});
  let [gambar, setGambar] = useState([]);
  let [modalss, setModalss] = useState(false);
  const layoutText = (e) => {
    setMore(e.nativeEvent.lines.length > 3 && lines !== 0);
  };

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

  const ImagesSlider = async (data) => {
    var tempdatas = [];
    var x = 0;

    for (var i in data.images) {
      let wid = 0;
      let hig = 0;
      Image.getSize(data.images[i].image, (width, height) => {
        wid = width;
        hig = height;
      });
      tempdatas.push({
        key: i,
        url: data.images[i].image ? data.images[i].image : "",
        width: wid,
        height: hig,
        props: {
          source: data.images[i].image ? data.images[i].image : "",
        },
      });
      x++;
    }
    await setGambar(tempdatas);
    await setModalss(true);
  };
  return (
    <View
      onLayout={(event) => {
        setDataAnother(data);
      }}
    >
      <ImageSlide
        show={modalss}
        dataImage={gambar}
        setClose={() => setModalss(false)}
      />
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
              {t("readMore")}
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
              {t("readless")}
            </Text>
          )}
        </View>
      ) : null}

      {/* View GreatFor */}
      {data && data.greatfor.length > 0 ? (
        <View
          style={{
            width: Dimensions.get("screen").width,
            paddingHorizontal: 15,
            // paddingVertical: 10,
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
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 5,
              },
              shadowOpacity: 0.1,
              shadowRadius: 6.27,

              elevation: 6,
            }}
          >
            <Text
              size="description"
              type="bold"
              style={{ textAlign: "center" }}
            >
              Great For
            </Text>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
              }}
            >
              {data &&
                data.greatfor.map((item, index) => {
                  return (
                    <View
                      key={index}
                      style={{
                        marginTop: 10,
                        width: (width - 50) / 4,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          height: 60,
                          width: 60,
                          borderRadius: 30,
                          backgroundColor: "#F6F6F6",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FunIcon icon={item?.icon} height={40} width={40} />
                      </View>
                      <Text size="small" type="light" style={{ marginTop: 5 }}>
                        {item?.name}
                      </Text>
                    </View>
                  );
                })}
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
            // paddingTop: 10,
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
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 5,
              },
              shadowOpacity: 0.1,
              shadowRadius: 6.27,

              elevation: 6,
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
              }}
            >
              {data &&
                data.core_facilities.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      marginTop: 10,
                      width: (width - 50) / 4,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        height: 60,
                        width: 60,
                        borderRadius: 30,
                        backgroundColor: "#F6F6F6",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FunIcon icon={item?.icon} height={40} width={40} />
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
              marginTop: 20,
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
              paddingBottom: 20,
            }}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            spara
          >
            {data &&
              data.movie_location.map((item, index) => (
                <Pressable
                  onPress={() => {
                    props.navigation.push("TravelIdeaStack", {
                      screen: "Detail_movie",
                      params: {
                        movie_id: item.id,
                        token: token,
                      },
                    });
                  }}
                  key={index}
                  style={{
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "#F3F3F3",
                    // height: 150,
                    marginTop: 10,
                    marginBottom: 10,
                    flexDirection: "row",
                    // width: Dimensions.get("screen").width * 0.9,
                    width: Dimensions.get("screen").width * 0.9,
                    padding: 10,
                    backgroundColor: "#FFF",
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 5,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 6.27,

                    elevation: 6,
                    marginRight: 5,
                  }}
                >
                  <FunImage
                    source={{ uri: item?.cover }}
                    style={{ height: 150, width: 100 }}
                  />
                  <View
                    style={{
                      flex: 1,
                      height: "100%",
                      marginLeft: 10,
                      paddingVertical: 5,
                    }}
                  >
                    <Text size="title" type="bold">
                      {item?.title}
                    </Text>
                    <Text
                      size="description"
                      type="regular"
                      style={{
                        lineHeight: 18,
                        textAlign: "justify",
                        marginTop: 8,
                      }}
                      numberOfLines={6}
                    >
                      {item?.description}
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
              height: 80,
            }}
          >
            {data
              ? data.images.map((item, index) => {
                  if (index < 3) {
                    return (
                      <FunImage
                        key={index + "1"}
                        source={{ uri: item.image }}
                        style={{
                          // // width: Dimensions.get("screen").width * 0.15,
                          // width: Dimensions.get("screen").width * 0.22,
                          width: (Dimensions.get("screen").width - 40) / 4,
                          height: "100%",
                          marginLeft: 2,
                        }}
                      />
                    );
                  } else if (index === 3 && data.images.length > 4) {
                    return (
                      <Ripple
                        key={index + "2"}
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        onPress={() => ImagesSlider(data)}
                      >
                        <FunImage
                          key={index}
                          source={{ uri: item.image }}
                          style={{
                            opacity: 0.9,
                            // width: Dimensions.get("screen").width * 0.22,
                            width: (Dimensions.get("screen").width - 40) / 4,
                            height: "100%",
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
                            top: 30,
                          }}
                        >
                          {"+" + (data.images.length - 4)}
                        </Text>
                      </Ripple>
                    );
                  } else if (index === 3) {
                    return (
                      <FunImage
                        key={index + "3"}
                        source={{ uri: item.image }}
                        style={{
                          // width: Dimensions.get("screen").width * 0.22,
                          width: (Dimensions.get("screen").width - 40) / 4,
                          height: "100%",
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
          marginTop: 20,
          marginBottom: 50,
        }}
      >
        {dataAnother?.another_place?.length > 0 ? (
          <Text size="label" type="bold">
            Another Place
          </Text>
        ) : null}
        {dataAnother &&
          dataAnother?.another_place?.map((item, index) =>
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
                  // height: 170,
                  padding: 10,
                  marginTop: 10,
                  width: "100%",
                  flexDirection: "row",
                  backgroundColor: "#FFF",
                  shadowColor: "#FFF",
                  shadowOffset: {
                    width: 0,
                    height: 5,
                  },
                  shadowOpacity: 0.1,
                  shadowRadius: 6.27,

                  elevation: 6,
                }}
              >
                <View style={{ justifyContent: "center" }}>
                  {/* Image */}
                  <FunImage
                    source={{ uri: item.images.image }}
                    style={{
                      width: 130,
                      height: 130,
                      borderRadius: 10,
                    }}
                  />
                </View>

                {/* Keterangan */}
                {/* rating */}
                <View
                  style={{
                    flex: 1,
                    paddingLeft: 10,
                    height: 130,
                    justifyContent: "space-between",
                  }}
                >
                  <View>
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
                            height: 30,
                            width: 30,
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
                            height: 30,
                            width: 30,
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
                  </View>
                  {/* Great for */}

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      height: 50,
                      marginTop: 10,
                      alignItems: "flex-end",
                    }}
                  >
                    <View>
                      <Text size="description" type="bold">
                        Great for :
                      </Text>
                      <View style={{ flexDirection: "row" }}>
                        {item.greatfor.length > 0 ? (
                          item.greatfor.map((item, index) => {
                            return index < 3 ? (
                              <FunIcon
                                key={index}
                                icon={item.icon}
                                fill="#464646"
                                height={35}
                                width={35}
                              />
                            ) : null;
                          })
                        ) : (
                          <Text>-</Text>
                        )}
                      </View>
                    </View>
                    <Button
                      onPress={() => addTo()}
                      size="small"
                      text={"Add"}
                      // style={{ marginTop: 15 }}
                    />
                  </View>
                </View>
              </Pressable>
            ) : null
          )}
      </View>
    </View>
  );
}
