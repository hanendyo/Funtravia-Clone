import React from "react";
import { View, Dimensions, Image, Pressable } from "react-native";
import { default_image } from "../../../../assets/png";
import { Play, PlayVideo } from "../../../../assets/svg";
const { width, height } = Dimensions.get("screen");
import { FunVideo } from "../../../../component";

export default function Posts({ item, index, navigation, user }) {
  // console.log(item);
  if (item?.length > 2) {
    if (item[3]?.grid == 1) {
      return (
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "flex-start",
            paddingHorizontal: 2.5,
          }}
        >
          <Pressable
            onPress={() => {
              // navigation.push("FeedStack", {
              // 	screen: "CommentsById",
              // 	params: {
              // 		post_id: item[0]?.id,
              // 	},
              // });
              navigation.push("ProfileStack", {
                screen: "myfeed",
                params: {
                  token: token,
                  datauser: user,
                  post_id: item[0]?.id,
                },
              });
            }}
            style={{
              width: ((width - 12) / 3) * 2,
              height: ((width - 12) / 3) * 2,
              margin: 2.5,
            }}
          >
            {item[0]?.assets[0]?.type === "video" ? (
              <>
                <FunVideo
                  poster={item[0]?.assets[0]?.filepath.replace(
                    "output.m3u8",
                    "thumbnail.png"
                  )}
                  posterResizeMode={"contain"}
                  paused={true}
                  key={"posted" + item.id}
                  source={{
                    uri: item[0]?.assets[0]?.filepath,
                  }}
                  muted={true}
                  // defaultSource={default_image}
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#fff",
                    borderRadius: 5,
                  }}
                />
                <View
                  style={{
                    // flexDirection: "row",
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0,0,0,0.6)",
                    justifyContent: "flex-end",
                    borderRadius: 5,
                    // bottom: "35%",
                    // left: "35%",
                  }}
                >
                  <PlayVideo width={15} height={15} style={{ margin: 10 }} />
                </View>
              </>
            ) : (
              // <FunVideo
              //   poster={item[0]?.assets[0]?.filepath.replace(
              //     "output.m3u8",
              //     "thumbnail.png"
              //   )}
              //   posterResizeMode={"cover"}
              //   source={{
              //     uri: item[0]?.assets[0]?.filepath,
              //   }}
              //   repeat={true}
              //   style={{
              //     width: "100%",
              //     height: "100%",
              //     backgroundColor: "#fff",
              //     borderRadius: 5,
              //   }}
              //   resizeMode="cover"
              //   muted={true}
              //   paused={true}
              // />
              <Image
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 5,
                }}
                source={
                  item[0]?.assets[0]?.filepath
                    ? { uri: item[0]?.assets[0]?.filepath }
                    : default_image
                }
              />
            )}
          </Pressable>
          <View>
            <Pressable
              onPress={() => {
                // navigation.push("FeedStack", {
                //   screen: "CommentsById",
                //   params: {
                //     post_id: item[1]?.id,
                //   },
                // });
                navigation.push("ProfileStack", {
                  screen: "myfeed",
                  params: {
                    token: token,
                    datauser: user,
                    post_id: item[1]?.id,
                  },
                });
              }}
              style={{
                width: (width - 20) / 3,
                height: (width - 20) / 3,
                margin: 2.5,
              }}
            >
              {item[1]?.assets[0] && item[1]?.assets[0]?.type === "video" ? (
                <>
                  <FunVideo
                    poster={item[1]?.assets[0]?.filepath.replace(
                      "output.m3u8",
                      "thumbnail.png"
                    )}
                    posterResizeMode={"contain"}
                    paused={true}
                    key={"posted" + item.id}
                    source={{
                      uri: item[1]?.assets[0] && item[1]?.assets[0]?.filepath,
                    }}
                    muted={true}
                    // defaultSource={default_image}
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: "#fff",
                      borderRadius: 5,
                    }}
                  />
                  <View
                    style={{
                      // flexDirection: "row",
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      backgroundColor: "rgba(0,0,0,0.6)",
                      justifyContent: "flex-end",
                      borderRadius: 5,

                      // bottom: "35%",
                      // left: "35%",
                    }}
                  >
                    <PlayVideo width={15} height={15} style={{ margin: 10 }} />
                  </View>
                </>
              ) : (
                // <FunVideo
                //   poster={item[1]?.assets[0]?.filepath.replace(
                //     "output.m3u8",
                //     "thumbnail.png"
                //   )}
                //   posterResizeMode={"cover"}
                //   source={{
                //     uri: item[1]?.assets[0] && item[1]?.assets[0]?.filepath,
                //   }}
                //   repeat={true}
                //   style={{
                //     width: "100%",
                //     height: "100%",
                //     backgroundColor: "#fff",
                //     borderRadius: 5,
                //   }}
                //   resizeMode="cover"
                //   muted={true}
                //   paused={true}
                // />
                <Image
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 5,
                  }}
                  source={
                    item[1]?.assets[0] && item[1]?.assets[0]?.filepath
                      ? {
                          uri: item[1]?.assets[0].filepath,
                        }
                      : default_image
                  }
                />
              )}
            </Pressable>
            <Pressable
              onPress={() => {
                // navigation.push("FeedStack", {
                //   screen: "CommentsById",
                //   params: {
                //     post_id: item[2]?.id,
                //   },
                // });
                navigation.push("ProfileStack", {
                  screen: "myfeed",
                  params: {
                    token: token,
                    datauser: user,
                    post_id: item[2]?.id,
                  },
                });
              }}
              style={{
                width: (width - 20) / 3,
                height: (width - 20) / 3,
                margin: 2.5,
              }}
            >
              {item[2]?.assets[0]?.type === "video" ? (
                <>
                  <FunVideo
                    poster={item[2]?.assets[0]?.filepath.replace(
                      "output.m3u8",
                      "thumbnail.png"
                    )}
                    posterResizeMode={"contain"}
                    paused={true}
                    key={"posted" + item.id}
                    source={{
                      uri: item[2]?.assets[0]?.filepath,
                    }}
                    muted={true}
                    // defaultSource={default_image}
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: "#fff",
                      borderRadius: 5,
                    }}
                  />
                  <View
                    style={{
                      // flexDirection: "row",
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      backgroundColor: "rgba(0,0,0,0.6)",
                      justifyContent: "flex-end",
                      borderRadius: 5,

                      // bottom: "35%",
                      // left: "35%",
                    }}
                  >
                    <PlayVideo width={15} height={15} style={{ margin: 10 }} />
                  </View>
                </>
              ) : (
                // <FunVideo
                //   poster={item[2]?.assets[0]?.filepath.replace(
                //     "output.m3u8",
                //     "thumbnail.png"
                //   )}
                //   posterResizeMode={"cover"}
                //   source={{
                //     uri: item[2]?.assets[0]?.filepath,
                //   }}
                //   repeat={true}
                //   style={{
                //     width: "100%",
                //     height: "100%",
                //     backgroundColor: "#fff",
                //     borderRadius: 5,
                //   }}
                //   resizeMode="cover"
                //   muted={true}
                //   paused={true}
                // />
                <Image
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 5,
                  }}
                  source={
                    item[2]?.assets[0]?.filepath
                      ? {
                          uri: item[2]?.assets[0].filepath,
                        }
                      : default_image
                  }
                />
              )}
            </Pressable>
          </View>
        </View>
      );
    } else if (item[3]?.grid == 2) {
      return (
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "flex-start",
            paddingHorizontal: 2.5,
          }}
        >
          <View>
            <Pressable
              onPress={() => {
                // navigation.push("FeedStack", {
                //   screen: "CommentsById",
                //   params: {
                //     post_id: item[0]?.id,
                //   },
                // });
                navigation.push("ProfileStack", {
                  screen: "myfeed",
                  params: {
                    token: token,
                    datauser: user,
                    post_id: item[0]?.id,
                  },
                });
              }}
              style={{
                width: (width - 20) / 3,
                height: (width - 20) / 3,
                margin: 2.5,
              }}
            >
              {item[0]?.assets[0]?.type === "video" ? (
                <>
                  <FunVideo
                    poster={item[0]?.assets[0]?.filepath.replace(
                      "output.m3u8",
                      "thumbnail.png"
                    )}
                    posterResizeMode={"contain"}
                    paused={true}
                    key={"posted" + item.id}
                    source={{
                      uri: item[0]?.assets[0]?.filepath,
                    }}
                    muted={true}
                    // defaultSource={default_image}
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: "#fff",
                      borderRadius: 5,
                    }}
                  />
                  <View
                    style={{
                      // flexDirection: "row",
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      backgroundColor: "rgba(0,0,0,0.6)",
                      justifyContent: "flex-end",
                      borderRadius: 5,

                      // bottom: "35%",
                      // left: "35%",
                    }}
                  >
                    <PlayVideo width={15} height={15} style={{ margin: 10 }} />
                  </View>
                </>
              ) : (
                // <FunVideo
                //   poster={item[0]?.assets[0]?.filepath.replace(
                //     "output.m3u8",
                //     "thumbnail.png"
                //   )}
                //   posterResizeMode={"cover"}
                //   source={{
                //     uri: item[0]?.assets[0]?.filepath,
                //   }}
                //   repeat={true}
                //   style={{
                //     width: "100%",
                //     height: "100%",
                //     backgroundColor: "#fff",
                //     borderRadius: 5,
                //   }}
                //   resizeMode="cover"
                //   muted={true}
                //   paused={false}
                // />
                <Image
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 5,
                  }}
                  source={
                    item[0]?.assets[0]?.filepath
                      ? {
                          uri: item[0]?.assets[0].filepath,
                        }
                      : default_image
                  }
                />
              )}
            </Pressable>
            <Pressable
              onPress={() => {
                // navigation.push("FeedStack", {
                //   screen: "CommentsById",
                //   params: {
                //     post_id: item[1]?.id,
                //   },
                // });
                navigation.push("ProfileStack", {
                  screen: "myfeed",
                  params: {
                    token: token,
                    datauser: user,
                    post_id: item[1]?.id,
                  },
                });
              }}
              style={{
                width: (width - 20) / 3,
                height: (width - 20) / 3,
                margin: 2.5,
              }}
            >
              {item[1]?.assets[0]?.type === "video" ? (
                <>
                  <FunVideo
                    poster={item[1]?.assets[0]?.filepath.replace(
                      "output.m3u8",
                      "thumbnail.png"
                    )}
                    posterResizeMode={"contain"}
                    paused={true}
                    key={"posted" + item.id}
                    source={{
                      uri: item[1]?.assets[0]?.filepath,
                    }}
                    muted={true}
                    // defaultSource={default_image}
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: "#fff",
                      borderRadius: 5,
                    }}
                  />
                  <View
                    style={{
                      // flexDirection: "row",
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      backgroundColor: "rgba(0,0,0,0.6)",
                      justifyContent: "flex-end",
                      borderRadius: 5,

                      // bottom: "35%",
                      // left: "35%",
                    }}
                  >
                    <PlayVideo width={15} height={15} style={{ margin: 10 }} />
                  </View>
                </>
              ) : (
                // <FunVideo
                //   poster={item[1]?.assets[0]?.filepath.replace(
                //     "output.m3u8",
                //     "thumbnail.png"
                //   )}
                //   posterResizeMode={"cover"}
                //   source={{
                //     uri: item[1]?.assets[0]?.filepath,
                //   }}
                //   repeat={true}
                //   style={{
                //     width: "100%",
                //     height: "100%",
                //     backgroundColor: "#fff",
                //     borderRadius: 5,
                //   }}
                //   resizeMode="cover"
                //   muted={true}
                //   paused={false}
                // />
                <Image
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 5,
                  }}
                  source={
                    item[1]?.assets[0]?.filepath
                      ? {
                          uri: item[1]?.assets[0].filepath,
                        }
                      : default_image
                  }
                />
              )}
            </Pressable>
          </View>
          <Pressable
            onPress={() => {
              //   navigation.push("FeedStack", {
              //     screen: "CommentsById",
              //     params: {
              //       post_id: item[2]?.id,
              //     },
              //   });
              navigation.push("ProfileStack", {
                screen: "myfeed",
                params: {
                  token: token,
                  datauser: user,
                  post_id: item[2]?.id,
                },
              });
            }}
            style={{
              width: ((width - 12) / 3) * 2,
              height: ((width - 12) / 3) * 2,
              margin: 2.5,
            }}
          >
            {item[2]?.assets[0]?.type === "video" ? (
              <>
                <FunVideo
                  poster={item[2]?.assets[0]?.filepath.replace(
                    "output.m3u8",
                    "thumbnail.png"
                  )}
                  posterResizeMode={"contain"}
                  paused={true}
                  key={"posted" + item.id}
                  source={{
                    uri: item[2]?.assets[0]?.filepath,
                  }}
                  muted={true}
                  // defaultSource={default_image}
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#fff",
                    borderRadius: 5,
                  }}
                />
                <View
                  style={{
                    // flexDirection: "row",
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0,0,0,0.6)",
                    justifyContent: "flex-end",
                    borderRadius: 5,

                    // bottom: "35%",
                    // left: "35%",
                  }}
                >
                  <PlayVideo width={15} height={15} style={{ margin: 10 }} />
                </View>
              </>
            ) : (
              // <FunVideo
              //   poster={item[2]?.assets[0]?.filepath.replace(
              //     "output.m3u8",
              //     "thumbnail.png"
              //   )}
              //   posterResizeMode={"cover"}
              //   source={{
              //     uri: item[2]?.assets[0]?.filepath,
              //   }}
              //   repeat={true}
              //   style={{
              //     width: "100%",
              //     height: "100%",
              //     backgroundColor: "#fff",
              //     borderRadius: 5,
              //   }}
              //   resizeMode="cover"
              //   muted={true}
              //   paused={false}
              // />
              <Image
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 5,
                }}
                source={
                  item[2]?.assets[0]?.filepath
                    ? { uri: item[2]?.assets[0]?.filepath }
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
        >
          {item.map((data, index) => {
            if (index < 3) {
              return (
                <Pressable
                  key={"a" + index}
                  onPress={() => {
                    // navigation.push("FeedStack", {
                    //   screen: "CommentsById",
                    //   params: {
                    //     post_id: data.id,
                    //   },
                    // });
                    navigation.push("ProfileStack", {
                      screen: "myfeed",
                      params: {
                        token: token,
                        datauser: user,
                        post_id: data.id,
                      },
                    });
                  }}
                  style={{
                    width: (width - 20) / 3,
                    height: (width - 20) / 3,
                    margin: 2.5,
                  }}
                >
                  {data.assets[0]?.type === "video" ? (
                    <>
                      <FunVideo
                        poster={data.assets[0]?.filepath.replace(
                          "output.m3u8",
                          "thumbnail.png"
                        )}
                        posterResizeMode={"contain"}
                        paused={true}
                        key={"posted" + data.id}
                        source={{
                          uri: data.assets[0]?.filepath,
                        }}
                        muted={true}
                        // defaultSource={default_image}
                        style={{
                          width: "100%",
                          height: "100%",
                          backgroundColor: "#fff",
                          borderRadius: 5,
                        }}
                      />
                      <View
                        style={{
                          // flexDirection: "row",
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          backgroundColor: "rgba(0,0,0,0.6)",
                          justifyContent: "flex-end",
                          borderRadius: 5,

                          // bottom: "35%",
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
                    // <FunVideo
                    //   poster={data.assets[0]?.filepath.replace(
                    //     "output.m3u8",
                    //     "thumbnail.png"
                    //   )}
                    //   posterResizeMode={"cover"}
                    //   source={{
                    //     uri: data.assets[0]?.filepath,
                    //   }}
                    //   repeat={true}
                    //   style={{
                    //     width: "100%",
                    //     height: "100%",
                    //     backgroundColor: "#fff",
                    //     borderRadius: 5,
                    //   }}
                    //   resizeMode="cover"
                    //   muted={true}
                    //   paused={false}
                    // />
                    <Image
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 5,
                      }}
                      source={
                        data.assets[0]?.filepath
                          ? {
                              uri: data.assets[0].filepath,
                            }
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
              key={"b" + index}
              onPress={() => {
                // navigation.push("FeedStack", {
                //   screen: "CommentsById",
                //   params: {
                //     post_id: data.id,
                //   },
                // });
                navigation.push("ProfileStack", {
                  screen: "myfeed",
                  params: {
                    token: token,
                    datauser: user,
                    post_id: data.id,
                  },
                });
              }}
              style={{
                width: (width - 20) / 3,
                height: (width - 20) / 3,
                margin: 2.5,
              }}
            >
              {data.assets[0]?.type === "video" ? (
                <>
                  <FunVideo
                    poster={data.assets[0]?.filepath.replace(
                      "output.m3u8",
                      "thumbnail.png"
                    )}
                    posterResizeMode={"contain"}
                    paused={true}
                    key={"posted" + data.id}
                    source={{
                      uri: data.assets[0]?.filepath,
                    }}
                    muted={true}
                    // defaultSource={default_image}
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: "#fff",
                      borderRadius: 5,
                    }}
                  />
                  <View
                    style={{
                      // flexDirection: "row",
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      backgroundColor: "rgba(0,0,0,0.6)",
                      justifyContent: "flex-end",
                      borderRadius: 5,

                      // bottom: "35%",
                      // left: "35%",
                    }}
                  >
                    <PlayVideo width={15} height={15} style={{ margin: 10 }} />
                  </View>
                </>
              ) : (
                // <FunVideo
                //   poster={data.assets[0]?.filepath.replace(
                //     "output.m3u8",
                //     "thumbnail.png"
                //   )}
                //   posterResizeMode={"cover"}
                //   source={{
                //     uri: data.assets[0]?.filepath,
                //   }}
                //   repeat={true}
                //   style={{
                //     width: "100%",
                //     height: "100%",
                //     backgroundColor: "#fff",
                //     borderRadius: 5,
                //   }}
                //   resizeMode="cover"
                //   muted={true}
                //   paused={false}
                // />
                <Image
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 5,
                  }}
                  source={
                    data.assets[0]?.filepath
                      ? { uri: data.assets[0]?.filepath }
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
}
