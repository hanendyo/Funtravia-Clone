import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  Alert,
  RefreshControl,
  FlatList,
  Pressable,
  Platform,
} from "react-native";
import { Sharegreen, Arrowbackwhite, Arrowbackios } from "../../assets/svg";
import { useLazyQuery, useMutation } from "@apollo/client";
import { Button, Text, FunVideo } from "../../component";
import { useTranslation } from "react-i18next";
import { default_image } from "../../assets/png";
import { PlayVideo } from "../../assets/svg";
import Modal from "react-native-modal";
import album from "../../graphQL/Query/Profile/albumdetailpost";
import ImageSlide from "../../component/src/ImageSlide/sliderPost";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
const { width, height } = Dimensions.get("screen");

export default function albumdetail(props) {
  const { t, i18n } = useTranslation();
  const HeaderComponent = {
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: "Album " + props?.route?.params?.judul,
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      fontFamily: "Lato-Bold",
      fontSize: 14,
      color: "white",
    },
    headerLeftContainerStyle: {
      background: "#FFF",

      marginLeft: 10,
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
        {Platform.OS == "ios" ? (
          <Arrowbackios height={15} width={15}></Arrowbackios>
        ) : (
          <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
        )}
      </Button>
    ),
  };

  let token = props.route.params.token;
  let judul = props.route.params.judul;
  let [modals, setmodal] = useState(false);
  let [dataalbums, setdata] = useState(null);

  const spreadData = (data) => {
    let tmpData = [];
    let count = 1;
    let tmpArray = [];
    let grid = 1;
    for (let val of data) {
      if (count < 3) {
        tmpArray.push(val);
        count++;
      } else {
        tmpArray.push(val);
        tmpArray.push({ grid: grid });
        grid++;
        if (grid == 4) {
          grid = 1;
        }
        tmpData.push(tmpArray);
        count = 1;
        tmpArray = [];
      }
    }
    if (tmpArray.length) {
      tmpData.push(tmpArray);
    }

    return tmpData;
  };

  const [
    getdataalbum,
    { data: dataalbum, loading: loadingalbum, error: erroralbum, refetch },
  ] = useLazyQuery(album, {
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    variables: {
      id: props?.route?.params?.id,
      // type: props?.route?.params?.type,
    },
    onCompleted: () => {
      setdata(dataalbum.all_albums_post_v2);
    },
  });

  function wait(timeout) {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  }

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    getdataalbum();
    wait(1000).then(() => setRefreshing(false));
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      getdataalbum();
    });
    return unsubscribe;
  }, [props.navigation]);

  let [index, setIndex] = useState(0);
  let [dataImage, setImage] = useState([]);
  let [modalss, setModalss] = useState(false);

  const setdataimage = async (data, id) => {
    let inde = data.findIndex((k) => k["id"] === id);
    setIndex(inde);
    var tempdatas = [];
    var x = 0;

    for (var i in data) {
      let wid = 0;
      let hig = 0;
      if (data[i].type !== "video") {
        Image.getSize(data[i].filepath, (width, height) => {
          wid = width;
          hig = height;
        });
      } else {
        wid = 500;
        hig = 500;
      }
      // Image.getSize(data[i].filepath, (width, height) => {
      //   wid = width;
      //   hig = height;
      // });
      tempdatas.push({
        key: i,
        id: data[i].post_id,
        selected: i === inde ? true : false,
        url: data[i].filepath ? data[i].filepath : "",
        width: wid,
        height: hig,
        props: {
          source: data[i].filepath ? data[i].filepath : "",
          type: data[i]?.type,
        },
        by: data[i]?.photoby?.first_name,
      });
      x++;
    }
    await setImage(tempdatas);
    await setModalss(true);
  };

  if (loadingalbum) {
    <SkeletonPlaceholder>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "flex-start",
          paddingHorizontal: 2.5,
        }}
      >
        <View
          style={{
            width: ((width - 12) / 3) * 2,
            height: ((width - 12) / 3) * 2,
            margin: 2.5,
          }}
        >
          <View
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 5,
            }}
          />
        </View>
        <View>
          <View
            style={{
              width: (width - 20) / 3,
              height: (width - 20) / 3,
              margin: 2.5,
            }}
          >
            <View
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 5,
              }}
            />
          </View>
          <View
            onPress={() => setdataimage(dataalbums, item[2].id)}
            style={{
              width: (width - 20) / 3,
              height: (width - 20) / 3,
              margin: 2.5,
            }}
          >
            <View
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 5,
              }}
            />
          </View>
        </View>
      </View>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "flex-start",
          paddingHorizontal: 2.5,
        }}
      >
        <View>
          <View
            style={{
              width: (width - 20) / 3,
              height: (width - 20) / 3,
              margin: 2.5,
            }}
          >
            <View
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 5,
              }}
            />
          </View>
          <View
            onPress={() => setdataimage(dataalbums, item[2].id)}
            style={{
              width: (width - 20) / 3,
              height: (width - 20) / 3,
              margin: 2.5,
            }}
          >
            <View
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 5,
              }}
            />
          </View>
        </View>
        <View
          style={{
            width: ((width - 12) / 3) * 2,
            height: ((width - 12) / 3) * 2,
            margin: 2.5,
          }}
        >
          <View
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 5,
            }}
          />
        </View>
      </View>
      <View style={{ flexDirection: "row" }}>
        <View
          style={{
            width: (width - 20) / 3,
            height: (width - 20) / 3,
            margin: 2.5,
          }}
        >
          <View
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 5,
            }}
          />
        </View>
        <View
          onPress={() => setdataimage(dataalbums, item[2].id)}
          style={{
            width: (width - 20) / 3,
            height: (width - 20) / 3,
            margin: 2.5,
          }}
        >
          <View
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 5,
            }}
          />
        </View>
        <View
          onPress={() => setdataimage(dataalbums, item[2].id)}
          style={{
            width: (width - 20) / 3,
            height: (width - 20) / 3,
            margin: 2.5,
          }}
        >
          <View
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 5,
            }}
          />
        </View>
      </View>
    </SkeletonPlaceholder>;
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <Modal
        onBackdropPress={() => {
          setmodal(false);
        }}
        onRequestClose={() => setmodal(false)}
        onDismiss={() => setmodal(false)}
        animationIn="fadeIn"
        animationOut="fadeOut"
        isVisible={modals}
        style={{
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
          alignContent: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            width: Dimensions.get("screen").width - 60,
            padding: 20,
          }}
        >
          <TouchableOpacity
            style={{
              paddingVertical: 10,
            }}
            onPress={() => pickcamera()}
          >
            <Text size="description" type="regular" style={{}}>
              {t("OpenCamera")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              paddingVertical: 10,
            }}
            onPress={() => pickGallery()}
          >
            <Text size="description" type="regular" style={{}}>
              {t("OpenGallery")}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
      {dataalbums && dataalbums.length > 0 ? (
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 5 }}
          nestedScrollEnabled
          data={spreadData(dataalbums)}
          renderItem={({ item, index }) => {
            // console.log(item);
            if (item.length > 2) {
              if (item[3].grid == 1) {
                return (
                  <View
                    style={{
                      width: "100%",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      paddingHorizontal: 2.5,
                    }}
                    key={index + 1}
                  >
                    <Pressable
                      onPress={() => setdataimage(dataalbums, item[0].id)}
                      style={{
                        width: ((width - 12) / 3) * 2,
                        height: ((width - 12) / 3) * 2,
                        margin: 2.5,
                      }}
                    >
                      {item[0].type === "video" ? (
                        <>
                          <FunVideo
                            poster={item[0].filepath.replace(
                              "output.m3u8",
                              "thumbnail.png"
                            )}
                            posterResizeMode={"cover"}
                            paused={true}
                            // key={"posted" + index + item.id}
                            source={{
                              uri: item[0].filepath,
                            }}
                            muted={true}
                            // defaultSource={default_image}
                            resizeMode="cover"
                            style={{
                              borderRadius: 5,

                              // resizeMode: "cover",
                              width: "100%",
                              height: "100%",
                              backgroundColor: "#fff",
                            }}
                          />
                          <View
                            style={{
                              // flexDirection: "row",
                              position: "absolute",
                              width: "100%",
                              height: "100%",
                              backgroundColor: "rgba(0,0,0,0.4)",
                              justifyContent: "flex-end",
                              borderRadius: 5,

                              // top: 5,
                              // left: "35%",
                            }}
                          >
                            <PlayVideo
                              width={15}
                              height={15}
                              style={{ margin: 10 }}
                            />
                          </View>
                        </>
                      ) : (
                        <Image
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: 5,
                          }}
                          source={
                            item[0].filepath
                              ? { uri: item[0].filepath }
                              : default_image
                          }
                        />
                      )}
                    </Pressable>
                    <View>
                      <Pressable
                        onPress={() => setdataimage(dataalbums, item[1].id)}
                        style={{
                          width: (width - 20) / 3,
                          height: (width - 20) / 3,
                          margin: 2.5,
                        }}
                      >
                        {item[1].type === "video" ? (
                          <>
                            <FunVideo
                              poster={item[1].filepath.replace(
                                "output.m3u8",
                                "thumbnail.png"
                              )}
                              posterResizeMode={"cover"}
                              paused={true}
                              // key={"posted" + index + item.id}
                              source={{
                                uri: item[1].filepath,
                              }}
                              muted={true}
                              // defaultSource={default_image}
                              resizeMode="cover"
                              style={{
                                borderRadius: 5,

                                // resizeMode: "cover",
                                width: "100%",
                                height: "100%",
                                backgroundColor: "#fff",
                              }}
                            />
                            <View
                              style={{
                                // flexDirection: "row",
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                backgroundColor: "rgba(0,0,0,0.4)",
                                justifyContent: "flex-end",
                                borderRadius: 5,

                                // top: 5,
                                // left: "35%",
                              }}
                            >
                              <PlayVideo
                                width={15}
                                height={15}
                                style={{ margin: 10 }}
                              />
                            </View>
                          </>
                        ) : (
                          <Image
                            style={{
                              width: "100%",
                              height: "100%",
                              borderRadius: 5,
                            }}
                            source={
                              item[1].filepath
                                ? { uri: item[1].filepath }
                                : default_image
                            }
                          />
                        )}
                      </Pressable>
                      <Pressable
                        onPress={() => setdataimage(dataalbums, item[2].id)}
                        style={{
                          width: (width - 20) / 3,
                          height: (width - 20) / 3,
                          margin: 2.5,
                        }}
                      >
                        {item[2].type === "video" ? (
                          <>
                            <FunVideo
                              poster={item[2].filepath.replace(
                                "output.m3u8",
                                "thumbnail.png"
                              )}
                              posterResizeMode={"cover"}
                              paused={true}
                              // key={"posted" + index + item.id}
                              source={{
                                uri: item[2].filepath,
                              }}
                              muted={true}
                              // defaultSource={default_image}
                              resizeMode="cover"
                              style={{
                                borderRadius: 5,

                                // resizeMode: "cover",
                                width: "100%",
                                height: "100%",
                                backgroundColor: "#fff",
                              }}
                            />
                            <View
                              style={{
                                // flexDirection: "row",
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                backgroundColor: "rgba(0,0,0,0.4)",
                                justifyContent: "flex-end",
                                borderRadius: 5,

                                // top: 5,
                                // left: "35%",
                              }}
                            >
                              <PlayVideo
                                width={15}
                                height={15}
                                style={{ margin: 10 }}
                              />
                            </View>
                          </>
                        ) : (
                          <Image
                            style={{
                              width: "100%",
                              height: "100%",
                              borderRadius: 5,
                            }}
                            source={
                              item[2].filepath
                                ? { uri: item[2].filepath }
                                : default_image
                            }
                          />
                        )}
                      </Pressable>
                    </View>
                  </View>
                );
              } else if (item[3].grid == 2) {
                return (
                  <View
                    style={{
                      width: "100%",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      paddingHorizontal: 2.5,
                    }}
                    key={index + 2}
                  >
                    <View>
                      <Pressable
                        onPress={() => setdataimage(dataalbums, item[0].id)}
                        style={{
                          width: (width - 20) / 3,
                          height: (width - 20) / 3,
                          margin: 2.5,
                        }}
                      >
                        {item[0].type === "video" ? (
                          <>
                            <FunVideo
                              poster={item[0].filepath.replace(
                                "output.m3u8",
                                "thumbnail.png"
                              )}
                              posterResizeMode={"cover"}
                              paused={true}
                              // key={"posted" + index + item.id}
                              source={{
                                uri: item[0].filepath,
                              }}
                              muted={true}
                              // defaultSource={default_image}
                              resizeMode="cover"
                              style={{
                                borderRadius: 5,

                                // resizeMode: "cover",
                                width: "100%",
                                height: "100%",
                                backgroundColor: "#fff",
                              }}
                            />
                            <View
                              style={{
                                // flexDirection: "row",
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                backgroundColor: "rgba(0,0,0,0.4)",
                                justifyContent: "flex-end",
                                borderRadius: 5,

                                // top: 5,
                                // left: "35%",
                              }}
                            >
                              <PlayVideo
                                width={15}
                                height={15}
                                style={{ margin: 10 }}
                              />
                            </View>
                          </>
                        ) : (
                          <Image
                            style={{
                              width: "100%",
                              height: "100%",
                              borderRadius: 5,
                            }}
                            source={
                              item[0].filepath
                                ? { uri: item[0].filepath }
                                : default_image
                            }
                          />
                        )}
                      </Pressable>
                      <Pressable
                        onPress={() => setdataimage(dataalbums, item[1].id)}
                        style={{
                          width: (width - 20) / 3,
                          height: (width - 20) / 3,
                          margin: 2.5,
                        }}
                      >
                        {item[1].type === "video" ? (
                          <>
                            <FunVideo
                              poster={item[1].filepath.replace(
                                "output.m3u8",
                                "thumbnail.png"
                              )}
                              posterResizeMode={"cover"}
                              paused={true}
                              // key={"posted" + index + item.id}
                              source={{
                                uri: item[1].filepath,
                              }}
                              muted={true}
                              // defaultSource={default_image}
                              resizeMode="cover"
                              style={{
                                borderRadius: 5,

                                // resizeMode: "cover",
                                width: "100%",
                                height: "100%",
                                backgroundColor: "#fff",
                              }}
                            />
                            <View
                              style={{
                                // flexDirection: "row",
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                backgroundColor: "rgba(0,0,0,0.4)",
                                justifyContent: "flex-end",
                                borderRadius: 5,

                                // top: 5,
                                // left: "35%",
                              }}
                            >
                              <PlayVideo
                                width={15}
                                height={15}
                                style={{ margin: 10 }}
                              />
                            </View>
                          </>
                        ) : (
                          <Image
                            style={{
                              width: "100%",
                              height: "100%",
                              borderRadius: 5,
                            }}
                            source={
                              item[1].filepath
                                ? { uri: item[1].filepath }
                                : default_image
                            }
                          />
                        )}
                      </Pressable>
                    </View>
                    <Pressable
                      onPress={() => setdataimage(dataalbums, item[2].id)}
                      style={{
                        width: ((width - 12) / 3) * 2,
                        height: ((width - 12) / 3) * 2,
                        margin: 2.5,
                      }}
                    >
                      {item[2].type === "video" ? (
                        <>
                          <FunVideo
                            poster={item[2].filepath.replace(
                              "output.m3u8",
                              "thumbnail.png"
                            )}
                            posterResizeMode={"cover"}
                            paused={true}
                            // key={"posted" + index + item.id}
                            source={{
                              uri: item[2].filepath,
                            }}
                            muted={true}
                            // defaultSource={default_image}
                            resizeMode="cover"
                            style={{
                              borderRadius: 5,

                              // resizeMode: "cover",
                              width: "100%",
                              height: "100%",
                              backgroundColor: "#fff",
                            }}
                          />
                          <View
                            style={{
                              // flexDirection: "row",
                              position: "absolute",
                              width: "100%",
                              height: "100%",
                              backgroundColor: "rgba(0,0,0,0.4)",
                              justifyContent: "flex-end",
                              borderRadius: 5,

                              // top: 5,
                              // left: "35%",
                            }}
                          >
                            <PlayVideo
                              width={15}
                              height={15}
                              style={{ margin: 10 }}
                            />
                          </View>
                        </>
                      ) : (
                        <Image
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: 5,
                          }}
                          source={
                            item[2].filepath
                              ? { uri: item[2].filepath }
                              : default_image
                          }
                        />
                      )}
                    </Pressable>
                  </View>
                );
              } else {
                return (
                  <View
                    style={{
                      width: "100%",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      paddingHorizontal: 2.5,
                    }}
                    key={index + 3}
                  >
                    {item.map((data, index) => {
                      if (index < 3) {
                        return (
                          <Pressable
                            onPress={() => setdataimage(dataalbums, data.id)}
                            style={{
                              width: (width - 20) / 3,
                              height: (width - 20) / 3,
                              margin: 2.5,
                            }}
                          >
                            {data.type === "video" ? (
                              <>
                                <FunVideo
                                  poster={data.filepath.replace(
                                    "output.m3u8",
                                    "thumbnail.png"
                                  )}
                                  posterResizeMode={"cover"}
                                  paused={true}
                                  // key={"posted" + index + item.id}
                                  source={{
                                    uri: data.filepath,
                                  }}
                                  muted={true}
                                  // defaultSource={default_image}
                                  resizeMode="cover"
                                  style={{
                                    borderRadius: 5,

                                    // resizeMode: "cover",
                                    width: "100%",
                                    height: "100%",
                                    backgroundColor: "#fff",
                                  }}
                                />
                                <View
                                  style={{
                                    // flexDirection: "row",
                                    position: "absolute",
                                    width: "100%",
                                    height: "100%",
                                    backgroundColor: "rgba(0,0,0,0.4)",
                                    justifyContent: "flex-end",
                                    borderRadius: 5,

                                    // top: 5,
                                    // left: "35%",
                                  }}
                                >
                                  <PlayVideo
                                    width={15}
                                    height={15}
                                    style={{ margin: 10 }}
                                  />
                                </View>
                              </>
                            ) : (
                              <Image
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  borderRadius: 5,
                                }}
                                source={
                                  data.filepath
                                    ? { uri: data.filepath }
                                    : default_image
                                }
                              />
                            )}
                          </Pressable>
                        );
                      } else {
                        null;
                      }
                    })}
                  </View>
                );
              }
            } else {
              return (
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    paddingHorizontal: 2.5,
                  }}
                >
                  {item.map((data, index) => {
                    return (
                      <Pressable
                        onPress={() => setdataimage(dataalbums, data.id)}
                        style={{
                          width: (width - 20) / 3,
                          height: (width - 20) / 3,
                          margin: 2.5,
                        }}
                        key={index}
                      >
                        {data.type === "video" ? (
                          <>
                            <FunVideo
                              poster={data.filepath.replace(
                                "output.m3u8",
                                "thumbnail.png"
                              )}
                              posterResizeMode={"cover"}
                              paused={true}
                              // key={"posted" + index + item.id}
                              source={{
                                uri: data.filepath,
                              }}
                              muted={true}
                              // defaultSource={default_image}
                              resizeMode="cover"
                              style={{
                                borderRadius: 5,

                                // resizeMode: "cover",
                                width: "100%",
                                height: "100%",
                                backgroundColor: "#fff",
                              }}
                            />
                            <View
                              style={{
                                // flexDirection: "row",
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                backgroundColor: "rgba(0,0,0,0.4)",
                                justifyContent: "flex-end",
                                borderRadius: 5,

                                // top: 5,
                                // left: "35%",
                              }}
                            >
                              <PlayVideo
                                width={15}
                                height={15}
                                style={{ margin: 10 }}
                              />
                            </View>
                          </>
                        ) : (
                          <Image
                            style={{
                              width: "100%",
                              height: "100%",
                              borderRadius: 5,
                            }}
                            source={
                              data.filepath
                                ? { uri: data.filepath }
                                : default_image
                            }
                          />
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              );
            }
          }}
          keyExtractor={(item) => item.id}
        />
      ) : loadingalbum ? (
        <SkeletonPlaceholder>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "flex-start",
              paddingHorizontal: 2.5,
            }}
          >
            <View
              style={{
                width: ((width - 12) / 3) * 2,
                height: ((width - 12) / 3) * 2,
                margin: 2.5,
              }}
            >
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 5,
                }}
              />
            </View>
            <View>
              <View
                style={{
                  width: (width - 20) / 3,
                  height: (width - 20) / 3,
                  margin: 2.5,
                }}
              >
                <View
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 5,
                  }}
                />
              </View>
              <View
                onPress={() => setdataimage(dataalbums, item[2].id)}
                style={{
                  width: (width - 20) / 3,
                  height: (width - 20) / 3,
                  margin: 2.5,
                }}
              >
                <View
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 5,
                  }}
                />
              </View>
            </View>
          </View>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "flex-start",
              paddingHorizontal: 2.5,
            }}
          >
            <View>
              <View
                style={{
                  width: (width - 20) / 3,
                  height: (width - 20) / 3,
                  margin: 2.5,
                }}
              >
                <View
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 5,
                  }}
                />
              </View>
              <View
                onPress={() => setdataimage(dataalbums, item[2].id)}
                style={{
                  width: (width - 20) / 3,
                  height: (width - 20) / 3,
                  margin: 2.5,
                }}
              >
                <View
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 5,
                  }}
                />
              </View>
            </View>
            <View
              style={{
                width: ((width - 12) / 3) * 2,
                height: ((width - 12) / 3) * 2,
                margin: 2.5,
              }}
            >
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 5,
                }}
              />
            </View>
          </View>
          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                width: (width - 20) / 3,
                height: (width - 20) / 3,
                margin: 2.5,
              }}
            >
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 5,
                }}
              />
            </View>
            <View
              onPress={() => setdataimage(dataalbums, item[2].id)}
              style={{
                width: (width - 20) / 3,
                height: (width - 20) / 3,
                margin: 2.5,
              }}
            >
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 5,
                }}
              />
            </View>
            <View
              onPress={() => setdataimage(dataalbums, item[2].id)}
              style={{
                width: (width - 20) / 3,
                height: (width - 20) / 3,
                margin: 2.5,
              }}
            >
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 5,
                }}
              />
            </View>
          </View>
        </SkeletonPlaceholder>
      ) : (
        <View style={{ alignItems: "center", marginTop: 20 }}>
          <Text size="title" type="bold">
            {t("noData")}
          </Text>
        </View>
      )}

      <ImageSlide
        index={index}
        name="Funtravia Images"
        location={judul}
        show={modalss}
        dataImage={dataImage}
        props={props}
        token={token}
        setClose={() => setModalss(!modalss)}
      />
    </View>
  );
}
