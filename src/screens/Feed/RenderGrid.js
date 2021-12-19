import React, { useRef } from "react";
import { View, Dimensions, Pressable } from "react-native";
import { FunImage, FunVideo } from "../../component";

const { width, height } = Dimensions.get("screen");
export default function RenderGrid({ item, grid, props }) {
  console.log("item", item);
  let videoView = useRef(null);
  if (item.length == 4 && item[3].grid == 1) {
    return (
      <View style={{ flexDirection: "row" }}>
        <Pressable
          onPress={() =>
            props.navigation.navigate("FeedStack", {
              screen: "CommentPost",
              params: {
                post_id: item[0].id,
              },
            })
          }
        >
          {item[0].assets[0].type === "video" ? (
            <FunVideo
              grid={grid}
              innerRef={(ref) => {
                videoView = ref;
              }}
              onBuffer={videoView?.current?.onBuffer}
              onError={videoView?.current?.videoError}
              poster={item[0].assets[0].filepath.replace(
                "output.m3u8",
                "thumbnail.png"
              )}
              posterResizeMode={"cover"}
              source={{
                uri: item[0].assets[0].filepath,
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
                uri: item[0].assets[0].filepath,
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
              props.navigation.navigate("FeedStack", {
                screen: "CommentPost",
                params: {
                  post_id: item[1].id,
                },
              })
            }
          >
            {item[1].assets[0].type === "video" ? (
              <FunVideo
                grid={grid}
                poster={item[1].assets[0].filepath.replace(
                  "output.m3u8",
                  "thumbnail.png"
                )}
                posterResizeMode={"cover"}
                source={{
                  uri: item[0].assets[0].filepath,
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
                  uri: item[1].assets[0].filepath,
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
              props.navigation.navigate("FeedStack", {
                screen: "CommentPost",
                params: {
                  post_id: item[2].id,
                },
              })
            }
          >
            {item[2].assets[0].type === "video" ? (
              <FunVideo
                grid={grid}
                poster={item[2].assets[0].filepath.replace(
                  "output.m3u8",
                  "thumbnail.png"
                )}
                posterResizeMode={"cover"}
                source={{
                  uri: item[2].assets[0].filepath,
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
                  uri: item[2].assets[0].filepath,
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
      <View style={{ flexDirection: "row" }}>
        <View style={{}}>
          <Pressable
            onPress={() =>
              props.navigation.navigate("FeedStack", {
                screen: "CommentPost",
                params: {
                  post_id: item[0].id,
                },
              })
            }
          >
            {item[0].assets[0].type === "video" ? (
              <FunVideo
                grid={grid}
                poster={item[0].assets[0].filepath.replace(
                  "output.m3u8",
                  "thumbnail.png"
                )}
                posterResizeMode={"cover"}
                source={{
                  uri: item[0].assets[0].filepath,
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
                  uri: item[0].assets[0].filepath,
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
              props.navigation.navigate("FeedStack", {
                screen: "CommentPost",
                params: {
                  post_id: item[1].id,
                },
              })
            }
          >
            {item[1].assets[0].type === "video" ? (
              <FunVideo
                grid={grid}
                poster={item[1].assets[0].filepath.replace(
                  "output.m3u8",
                  "thumbnail.png"
                )}
                posterResizeMode={"cover"}
                source={{
                  uri: item[1].assets[0].filepath,
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
                  uri: item[1].assets[0].filepath,
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
            props.navigation.navigate("FeedStack", {
              screen: "CommentPost",
              params: {
                post_id: item[2].id,
              },
            })
          }
        >
          {item[2].assets[0].type === "video" ? (
            <FunVideo
              grid={grid}
              poster={item[2].assets[0].filepath.replace(
                "output.m3u8",
                "thumbnail.png"
              )}
              posterResizeMode={"cover"}
              source={{
                uri: item[2].assets[0].filepath,
              }}
              repeat={true}
              style={{
                height: (width + width) / 3 - 15,
                width: (width + width) / 3 - 21,
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
                uri: item[2].assets[0].filepath,
              }}
              style={{
                height: (width + width) / 3 - 15,
                width: (width + width) / 3 - 21,
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
      <View style={{ flexDirection: "row" }}>
        <Pressable
          onPress={() =>
            props.navigation.navigate("FeedStack", {
              screen: "CommentPost",
              params: {
                post_id: item[0].id,
              },
            })
          }
        >
          {item[0].assets[0].type === "video" ? (
            <FunVideo
              grid={grid}
              poster={item[0].assets[0].filepath.replace(
                "output.m3u8",
                "thumbnail.png"
              )}
              posterResizeMode={"cover"}
              source={{
                uri: item[0].assets[0].filepath,
              }}
              repeat={true}
              style={{
                height: width / 3 - 15,
                width: width / 3 - 15,
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
                uri: item[0].assets[0].filepath,
              }}
              style={{
                height: width / 3 - 15,
                width: width / 3 - 15,
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
            props.navigation.navigate("FeedStack", {
              screen: "CommentPost",
              params: {
                post_id: item[1].id,
              },
            })
          }
        >
          {item[1].assets[0].type === "video" ? (
            <FunVideo
              grid={grid}
              poster={item[0].assets[0].filepath.replace(
                "output.m3u8",
                "thumbnail.png"
              )}
              posterResizeMode={"cover"}
              source={{
                uri: item[0].assets[0].filepath,
              }}
              repeat={true}
              style={{
                height: width / 3 - 15,
                width: width / 3 - 15,
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
                uri: item[1].assets[0].filepath,
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
            props.navigation.navigate("FeedStack", {
              screen: "CommentPost",
              params: {
                post_id: item[2].id,
              },
            })
          }
        >
          {item[2].assets[0].type === "video" ? (
            <FunVideo
              grid={grid}
              poster={item[2].assets[0].filepath.replace(
                "output.m3u8",
                "thumbnail.png"
              )}
              posterResizeMode={"cover"}
              source={{
                uri: item[2].assets[0].filepath,
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
                uri: item[2].assets[0].filepath,
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
    );
  }
  if (item.length < 3) {
    const grid = 1;
    return (
      <View style={{ flexDirection: "row" }}>
        <Pressable
          onPress={() =>
            props.navigation.navigate("FeedStack", {
              screen: "CommentPost",
              params: {
                post_id: item[0].id,
              },
            })
          }
        >
          {item[0].assets[0].type === "video" ? (
            <FunVideo
              grid={grid}
              poster={item[0].assets[0].filepath.replace(
                "output.m3u8",
                "thumbnail.png"
              )}
              posterResizeMode={"cover"}
              source={{
                uri: item[0].assets[0].filepath,
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
                uri: item[0].assets[0].filepath,
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
              props.navigation.navigate("FeedStack", {
                screen: "CommentPost",
                params: {
                  post_id: item[1].id,
                },
              })
            }
            style={{}}
          >
            {item[1].assets[0].type === "video" ? (
              <FunVideo
                grid={grid}
                poster={item[1].assets[0].filepath.replace(
                  "output.m3u8",
                  "thumbnail.png"
                )}
                posterResizeMode={"cover"}
                source={{
                  uri: item[1].assets[0].filepath,
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
                  uri: item[1].assets[0].filepath,
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
      <View style={{ flexDirection: "row" }}>
        <Pressable
          onPress={() =>
            props.navigation.navigate("FeedStack", {
              screen: "CommentPost",
              params: {
                post_id: item[0].id,
              },
            })
          }
        >
          {item[0].assets[0].type === "video" ? (
            <FunVideo
              poster={item[0].assets[0].filepath.replace(
                "output.m3u8",
                "thumbnail.png"
              )}
              posterResizeMode={"cover"}
              source={{
                uri: item[0].assets[0].filepath,
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
              grid={grid}
            />
          ) : (
            <FunImage
              source={{
                uri: item[0].assets[0].filepath,
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
              props.navigation.navigate("FeedStack", {
                screen: "CommentPost",
                params: {
                  post_id: item[1].id,
                },
              })
            }
            style={{}}
          >
            {item[1].assets[0].type === "video" ? (
              <FunVideo
                grid={grid}
                poster={item[1].assets[0].filepath.replace(
                  "output.m3u8",
                  "thumbnail.png"
                )}
                posterResizeMode={"cover"}
                source={{
                  uri: item[1].assets[0].filepath,
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
                  uri: item[1].assets[0].filepath,
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
              props.navigation.navigate("FeedStack", {
                screen: "CommentPost",
                params: {
                  post_id: item[2].id,
                },
              })
            }
            style={{}}
          >
            {item[1].assets[0].type === "video" ? (
              <FunVideo
                grid={grid}
                poster={item[2].assets[0].filepath.replace(
                  "output.m3u8",
                  "thumbnail.png"
                )}
                posterResizeMode={"cover"}
                source={{
                  uri: item[2].assets[0].filepath,
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
                  uri: item[2].assets[0].filepath,
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
