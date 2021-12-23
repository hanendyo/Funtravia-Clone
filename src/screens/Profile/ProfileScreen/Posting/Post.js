import React, { useRef, useEffect, useState } from "react";
import { View, Dimensions, Image, Pressable } from "react-native";
import { default_image } from "../../../../assets/png";
import { Play, PlayVideo } from "../../../../assets/svg";
const { width, height } = Dimensions.get("screen");
import { FunVideo, FunImage, Text } from "../../../../component";
import { useSelector } from "react-redux";

export default function Posts({ item, navigation, user, dataPost }) {
  const tokenApps = useSelector((data) => data.token);
  let { width, height } = Dimensions.get("screen");
  let videoView = useRef(null);
  if (item.length == 4 && item[3].grid == 1) {
    return (
      <View
        style={{
          flexDirection: "row",
          width: width - 20,
          marginHorizontal: 10,
        }}
      >
        <Pressable
          onPress={() =>
            navigation.navigate("ProfileStack", {
              screen: "myfeed",
              params: {
                token: tokenApps,
                datauser: user,
                post_id: item[0].node.id,
                isProfil: true,
                dataPost: dataPost,
              },
            })
          }
        >
          {item[0]?.node.assets[0]?.type === "video" ? (
            <FunVideo
              innerRef={(ref) => {
                videoView = ref;
              }}
              onBuffer={videoView?.current?.onBuffer}
              onError={videoView?.current?.videoError}
              poster={item[0].node.assets[0].filepath.replace(
                "output.m3u8",
                "thumbnail.png"
              )}
              posterResizeMode={"cover"}
              source={{
                uri: item[0].node.assets[0].filepath,
              }}
              repeat={true}
              style={{
                height: (width + width) / 3 - 15,
                width: (width + width) / 3 - 20,
                borderRadius: 5,
                margin: 2,
              }}
              resizeMode="cover"
              muted={true}
              paused={true}
              grid
            />
          ) : (
            <FunImage
              source={{
                uri: item[0].node.assets[0].filepath,
              }}
              style={{
                height: (width + width) / 3 - 15,
                width: (width + width) / 3 - 20,
                borderRadius: 5,
                margin: 2,
                alignSelf: "center",
                resizeMode: "cover",
              }}
            />
          )}
        </Pressable>
        <View style={{}}>
          <Pressable
            onPress={() =>
              navigation.navigate("ProfileStack", {
                screen: "myfeed",
                params: {
                  token: tokenApps,
                  datauser: user,
                  post_id: item[1].node.id,
                  isProfil: true,
                  dataPost: dataPost,
                },
              })
            }
          >
            {item[1].node.assets[0].type === "video" ? (
              <FunVideo
                grid
                poster={item[1].node.assets[0].filepath.replace(
                  "output.m3u8",
                  "thumbnail.png"
                )}
                posterResizeMode={"cover"}
                source={{
                  uri: item[0].node.assets[0].filepath,
                }}
                repeat={true}
                style={{
                  height: width / 3 - 10,
                  width: width / 3 - 10,
                  borderRadius: 5,
                  margin: 2,
                }}
                resizeMode="cover"
                muted={true}
                paused={true}
              />
            ) : (
              <FunImage
                source={{
                  uri: item[1].node.assets[0].filepath,
                }}
                style={{
                  height: width / 3 - 10,
                  width: width / 3 - 10,
                  borderRadius: 5,
                  margin: 2,
                  alignSelf: "center",
                  resizeMode: "cover",
                }}
              />
            )}
          </Pressable>
          <Pressable
            onPress={() =>
              navigation.navigate("ProfileStack", {
                screen: "myfeed",
                params: {
                  token: tokenApps,
                  datauser: user,
                  post_id: item[2].node.id,
                  isProfil: true,
                  dataPost: dataPost,
                },
              })
            }
          >
            {item[2].node.assets[0].type === "video" ? (
              <FunVideo
                grid
                poster={item[2].node.assets[0].filepath.replace(
                  "output.m3u8",
                  "thumbnail.png"
                )}
                posterResizeMode={"cover"}
                source={{
                  uri: item[2].node.assets[0].filepath,
                }}
                repeat={true}
                style={{
                  height: width / 3 - 10,
                  width: width / 3 - 10,
                  borderRadius: 5,
                  margin: 2,
                }}
                resizeMode="cover"
                muted={true}
                paused={true}
              />
            ) : (
              <FunImage
                source={{
                  uri: item[2].node.assets[0].filepath,
                }}
                style={{
                  height: width / 3 - 10,
                  width: width / 3 - 10,
                  borderRadius: 5,
                  margin: 2,
                  alignSelf: "center",
                  resizeMode: "cover",
                }}
              />
            )}
          </Pressable>
        </View>
      </View>
    );
  }
  if (item.length == 4 && item[3].grid == 2) {
    return (
      <View
        style={{
          flexDirection: "row",
          width: width - 20,
          marginHorizontal: 10,
        }}
      >
        <View style={{}}>
          <Pressable
            onPress={() =>
              navigation.navigate("ProfileStack", {
                screen: "myfeed",
                params: {
                  token: tokenApps,
                  datauser: user,
                  post_id: item[0].node.id,
                  isProfil: true,
                  dataPost: dataPost,
                },
              })
            }
          >
            {item[0].node.assets[0].type === "video" ? (
              <FunVideo
                grid
                poster={item[0].node.assets[0].filepath.replace(
                  "output.m3u8",
                  "thumbnail.png"
                )}
                posterResizeMode={"cover"}
                source={{
                  uri: item[0].node.assets[0].filepath,
                }}
                repeat={true}
                style={{
                  height: width / 3 - 10,
                  width: width / 3 - 10,
                  borderRadius: 5,
                  margin: 2,
                }}
                resizeMode="cover"
                muted={true}
                paused={true}
              />
            ) : (
              <FunImage
                source={{
                  uri: item[0].node.assets[0].filepath,
                }}
                style={{
                  height: width / 3 - 10,
                  width: width / 3 - 10,
                  borderRadius: 5,
                  margin: 2,
                  alignSelf: "center",
                  resizeMode: "cover",
                }}
              />
            )}
          </Pressable>
          <Pressable
            onPress={() =>
              navigation.navigate("ProfileStack", {
                screen: "myfeed",
                params: {
                  token: tokenApps,
                  datauser: user,
                  post_id: item[1].node.id,
                  isProfil: true,
                  dataPost: dataPost,
                },
              })
            }
          >
            {item[1].node.assets[0].type === "video" ? (
              <FunVideo
                grid
                poster={item[1].node.assets[0].filepath.replace(
                  "output.m3u8",
                  "thumbnail.png"
                )}
                posterResizeMode={"cover"}
                source={{
                  uri: item[1].node.assets[0].filepath,
                }}
                repeat={true}
                style={{
                  height: width / 3 - 10,
                  width: width / 3 - 10,
                  borderRadius: 5,
                  margin: 2,
                }}
                resizeMode="cover"
                muted={true}
                paused={true}
              />
            ) : (
              <FunImage
                source={{
                  uri: item[1].node.assets[0].filepath,
                }}
                style={{
                  height: width / 3 - 10,
                  width: width / 3 - 10,
                  borderRadius: 5,
                  margin: 2,
                  alignSelf: "center",
                  resizeMode: "cover",
                }}
              />
            )}
          </Pressable>
        </View>
        <Pressable
          onPress={() =>
            navigation.navigate("ProfileStack", {
              screen: "myfeed",
              params: {
                token: tokenApps,
                datauser: user,
                post_id: item[2].node.id,
                isProfil: true,
                dataPost: dataPost,
              },
            })
          }
        >
          {item[2].node.assets[0].type === "video" ? (
            <FunVideo
              grid
              poster={item[2].node.assets[0].filepath.replace(
                "output.m3u8",
                "thumbnail.png"
              )}
              posterResizeMode={"cover"}
              source={{
                uri: item[2].node.assets[0].filepath,
              }}
              repeat={true}
              style={{
                height: (width + width) / 3 - 15,
                width: (width + width) / 3 - 20,
                borderRadius: 5,
                margin: 2,
              }}
              resizeMode="cover"
              muted={true}
              paused={true}
            />
          ) : (
            <FunImage
              source={{
                uri: item[2].node.assets[0].filepath,
              }}
              style={{
                height: (width + width) / 3 - 15,
                width: (width + width) / 3 - 20,
                borderRadius: 5,
                margin: 2,
                alignSelf: "center",
                resizeMode: "cover",
              }}
            />
          )}
        </Pressable>
      </View>
    );
  }
  if (item.length == 4 && item[3].grid == 3) {
    return (
      <View
        style={{
          flexDirection: "row",
          width: width - 20,
          marginHorizontal: 10,
        }}
      >
        <Pressable
          onPress={() =>
            navigation.navigate("ProfileStack", {
              screen: "myfeed",
              params: {
                token: tokenApps,
                datauser: user,
                post_id: item[0].node.id,
                isProfil: true,
                dataPost: dataPost,
              },
            })
          }
        >
          {item[0].node.assets[0].type === "video" ? (
            <FunVideo
              grid
              poster={item[0].node.assets[0].filepath.replace(
                "output.m3u8",
                "thumbnail.png"
              )}
              posterResizeMode={"cover"}
              source={{
                uri: item[0].node.assets[0].filepath,
              }}
              repeat={true}
              style={{
                height: width / 3 - 12,
                width: width / 3 - 12,
                borderRadius: 5,
                margin: 2,
              }}
              resizeMode="cover"
              muted={true}
              paused={true}
            />
          ) : (
            <FunImage
              source={{
                uri: item[0].node.assets[0].filepath,
              }}
              style={{
                height: width / 3 - 12,
                width: width / 3 - 12,
                borderRadius: 5,
                margin: 2,
                alignSelf: "center",
                resizeMode: "cover",
              }}
            />
          )}
        </Pressable>
        <Pressable
          onPress={() =>
            navigation.navigate("ProfileStack", {
              screen: "myfeed",
              params: {
                token: tokenApps,
                datauser: user,
                post_id: item[1].node.id,
                isProfil: true,
                dataPost: dataPost,
              },
            })
          }
        >
          {item[1].node.assets[0].type === "video" ? (
            <FunVideo
              grid
              poster={item[0].node.assets[0].filepath.replace(
                "output.m3u8",
                "thumbnail.png"
              )}
              posterResizeMode={"cover"}
              source={{
                uri: item[0].node.assets[0].filepath,
              }}
              repeat={true}
              style={{
                height: width / 3 - 12,
                width: width / 3 - 12,
                borderRadius: 5,
                margin: 2,
              }}
              resizeMode="cover"
              muted={true}
              paused={true}
            />
          ) : (
            <FunImage
              source={{
                uri: item[1].node.assets[0].filepath,
              }}
              style={{
                height: width / 3 - 12,
                width: width / 3 - 12,
                borderRadius: 5,
                margin: 2,
                alignSelf: "center",
                resizeMode: "cover",
              }}
            />
          )}
        </Pressable>
        <Pressable
          onPress={() =>
            navigation.navigate("ProfileStack", {
              screen: "myfeed",
              params: {
                token: tokenApps,
                datauser: user,
                post_id: item[2].node.id,
                isProfil: true,
                dataPost: dataPost,
              },
            })
          }
        >
          {item[2].node.assets[0].type === "video" ? (
            <FunVideo
              grid
              poster={item[2].node.assets[0].filepath.replace(
                "output.m3u8",
                "thumbnail.png"
              )}
              posterResizeMode={"cover"}
              source={{
                uri: item[2].node.assets[0].filepath,
              }}
              repeat={true}
              style={{
                height: width / 3 - 12,
                width: width / 3 - 12,
                borderRadius: 5,
                margin: 2,
              }}
              resizeMode="cover"
              muted={true}
              paused={true}
            />
          ) : (
            <FunImage
              source={{
                uri: item[2].node.assets[0].filepath,
              }}
              style={{
                height: width / 3 - 12,
                width: width / 3 - 12,
                borderRadius: 5,
                margin: 2,
                alignSelf: "center",
                resizeMode: "cover",
              }}
            />
          )}
        </Pressable>
      </View>
    );
  }
  if (item.length < 3) {
    const grid = 1;
    return (
      <View
        style={{
          flexDirection: "row",
          width: width - 20,
          marginHorizontal: 10,
        }}
      >
        <Pressable
          onPress={() =>
            navigation.navigate("ProfileStack", {
              screen: "myfeed",
              params: {
                token: tokenApps,
                datauser: user,
                post_id: item[0].node.id,
                isProfil: true,
                dataPost: dataPost,
              },
            })
          }
        >
          {item[0].node.assets[0].type === "video" ? (
            <FunVideo
              grid
              poster={item[0].node.assets[0].filepath.replace(
                "output.m3u8",
                "thumbnail.png"
              )}
              posterResizeMode={"cover"}
              source={{
                uri: item[0].node.assets[0].filepath,
              }}
              repeat={true}
              style={{
                height: width / 3 - 10,
                width: width / 3 - 10,
                borderRadius: 5,
                margin: 2,
              }}
              resizeMode="cover"
              muted={true}
              paused={true}
            />
          ) : (
            <FunImage
              source={{
                uri: item[0].node.assets[0].filepath,
              }}
              style={{
                height: width / 3 - 10,
                width: width / 3 - 10,
                borderRadius: 5,
                margin: 2,
                alignSelf: "center",
                resizeMode: "cover",
              }}
            />
          )}
        </Pressable>
        {item[1] ? (
          <Pressable
            onPress={() =>
              navigation.navigate("ProfileStack", {
                screen: "myfeed",
                params: {
                  token: tokenApps,
                  datauser: user,
                  post_id: item[1].node.id,
                  isProfil: true,
                  dataPost: dataPost,
                },
              })
            }
            style={{}}
          >
            {item[1].node.assets[0].type === "video" ? (
              <FunVideo
                grid
                poster={item[1].node.assets[0].filepath.replace(
                  "output.m3u8",
                  "thumbnail.png"
                )}
                posterResizeMode={"cover"}
                source={{
                  uri: item[1].node.assets[0].filepath,
                }}
                repeat={true}
                style={{
                  height: width / 3 - 10,
                  width: width / 3 - 10,
                  borderRadius: 5,
                  margin: 2,
                }}
                resizeMode="cover"
                muted={true}
                paused={true}
              />
            ) : (
              <FunImage
                source={{
                  uri: item[1].node.assets[0].filepath,
                }}
                style={{
                  height: width / 3 - 10,
                  width: width / 3 - 10,
                  borderRadius: 5,
                  margin: 2,
                  alignSelf: "center",
                  resizeMode: "cover",
                }}
              />
            )}
          </Pressable>
        ) : null}
      </View>
    );
  }
  if (item.length === 3) {
    return (
      <View
        style={{
          flexDirection: "row",
          width: width - 20,
          marginHorizontal: 10,
        }}
      >
        <Pressable
          onPress={() =>
            navigation.navigate("ProfileStack", {
              screen: "myfeed",
              params: {
                token: tokenApps,
                datauser: user,
                post_id: item[0].node.id,
                isProfil: true,
                dataPost: dataPost,
              },
            })
          }
        >
          {item[0].node.assets[0].type === "video" ? (
            <FunVideo
              grid
              poster={item[0].node.assets[0].filepath.replace(
                "output.m3u8",
                "thumbnail.png"
              )}
              posterResizeMode={"cover"}
              source={{
                uri: item[0].node.assets[0].filepath,
              }}
              repeat={true}
              style={{
                height: width / 3 - 10,
                width: width / 3 - 10,
                borderRadius: 5,
                margin: 2,
              }}
              resizeMode="cover"
              muted={true}
              paused={true}
            />
          ) : (
            <FunImage
              source={{
                uri: item[0].node.assets[0].filepath,
              }}
              style={{
                height: width / 3 - 10,
                width: width / 3 - 10,
                borderRadius: 5,
                margin: 2,
                alignSelf: "center",
                resizeMode: "cover",
              }}
            />
          )}
        </Pressable>
        {item[1] ? (
          <Pressable
            onPress={() =>
              navigation.navigate("ProfileStack", {
                screen: "myfeed",
                params: {
                  token: tokenApps,
                  datauser: user,
                  post_id: item[1].node.id,
                  isProfil: true,
                  dataPost: dataPost,
                },
              })
            }
            style={{}}
          >
            {item[1].node.assets[0].type === "video" ? (
              <FunVideo
                grid
                poster={item[1].node.assets[0].filepath.replace(
                  "output.m3u8",
                  "thumbnail.png"
                )}
                posterResizeMode={"cover"}
                source={{
                  uri: item[1].node.assets[0].filepath,
                }}
                repeat={true}
                style={{
                  height: width / 3 - 10,
                  width: width / 3 - 10,
                  borderRadius: 5,
                  margin: 2,
                }}
                resizeMode="cover"
                muted={true}
                paused={true}
              />
            ) : (
              <FunImage
                source={{
                  uri: item[1].node.assets[0].filepath,
                }}
                style={{
                  height: width / 3 - 10,
                  width: width / 3 - 10,
                  borderRadius: 5,
                  margin: 2,
                  alignSelf: "center",
                  resizeMode: "cover",
                }}
              />
            )}
          </Pressable>
        ) : null}
        {item[2] ? (
          <Pressable
            onPress={() =>
              navigation.navigate("ProfileStack", {
                screen: "myfeed",
                params: {
                  token: tokenApps,
                  datauser: user,
                  post_id: item[2].node.id,
                  isProfil: true,
                  dataPost: dataPost,
                },
              })
            }
            style={{}}
          >
            {item[1].node.assets[0].type === "video" ? (
              <FunVideo
                grid
                poster={item[2].node.assets[0].filepath.replace(
                  "output.m3u8",
                  "thumbnail.png"
                )}
                posterResizeMode={"cover"}
                source={{
                  uri: item[2].node.assets[0].filepath,
                }}
                repeat={true}
                style={{
                  height: width / 3 - 10,
                  width: width / 3 - 10,
                  borderRadius: 5,
                  margin: 2,
                }}
                resizeMode="cover"
                muted={true}
                paused={true}
              />
            ) : (
              <FunImage
                source={{
                  uri: item[2].node.assets[0].filepath,
                }}
                style={{
                  height: width / 3 - 10,
                  width: width / 3 - 10,
                  borderRadius: 5,
                  margin: 2,
                  alignSelf: "center",
                  resizeMode: "cover",
                }}
              />
            )}
          </Pressable>
        ) : null}
      </View>
    );
  }
}
