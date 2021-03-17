import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
  Pressable,
} from "react-native";
const { width, height } = Dimensions.get("screen");

export default function RenderGrid({ item, index, props }) {
  console.log(item);
  if (item.length == 4 && item[3].grid == 1) {
    return (
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <Pressable
          onPress={() =>
            props.navigation.navigate("FeedStack", {
              screen: "CommentsById",
              params: {
                post_id: item[2].id,
              },
            })
          }
          style={
            {
              // height: (width + width)/3 -15,
              // width: (width + width)/3 -20,
            }
          }
        >
          <Image
            source={{
              uri: item[2].assets[0].filepath,
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
        </Pressable>
        <View style={{}}>
          <Pressable
            onPress={
              () =>
                props.navigation.navigate("FeedStack", {
                  screen: "CommentsById",
                  params: {
                    post_id: item[0].id,
                  },
                })
              // teststate(index-8)
            }
            style={
              {
                // height: width/3 - 10,
                // width: width/3 - 10,
              }
            }
          >
            <Image
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
          </Pressable>
          <Pressable
            onPress={() =>
              props.navigation.navigate("FeedStack", {
                screen: "CommentsById",
                params: {
                  post_id: item[1].id,
                },
              })
            }
            style={
              {
                // height: width/3 - 10,
                // width: width/3 - 10,
              }
            }
          >
            <Image
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
        }}
      >
        <View style={{}}>
          <Pressable
            onPress={
              () =>
                props.navigation.navigate("FeedStack", {
                  screen: "CommentsById",
                  params: {
                    post_id: item[0].id,
                  },
                })
              // teststate(index-8)
            }
            style={
              {
                // height: width/3 - 10,
                // width: width/3 - 10,
              }
            }
          >
            <Image
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
          </Pressable>
          <Pressable
            onPress={() =>
              props.navigation.navigate("FeedStack", {
                screen: "CommentsById",
                params: {
                  post_id: item[1].id,
                },
              })
            }
            style={
              {
                // height: width/3 - 10,
                // width: width/3 - 10,
              }
            }
          >
            <Image
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
          </Pressable>
        </View>
        <Pressable
          onPress={() =>
            props.navigation.navigate("FeedStack", {
              screen: "CommentsById",
              params: {
                post_id: item[2].id,
              },
            })
          }
          style={
            {
              // height: (width + width)/3 -15,
              // width: (width + width)/3 -20,
            }
          }
        >
          <Image
            source={{
              uri: item[2].assets[0].filepath,
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
        </Pressable>
      </View>
    );
  }
  if (item.length == 4 && item[3].grid == 3) {
    return (
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <Pressable
          onPress={() =>
            props.navigation.navigate("FeedStack", {
              screen: "CommentsById",
              params: {
                post_id: item[0].id,
              },
            })
          }
          style={
            {
              // height: width/3 - 10,
              // width: width/3 - 10,
            }
          }
        >
          <Image
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
        </Pressable>
        <Pressable
          onPress={() =>
            props.navigation.navigate("FeedStack", {
              screen: "CommentsById",
              params: {
                post_id: item[1].id,
              },
            })
          }
          style={
            {
              // height: width/3 - 10,
              // width: width/3 - 10,
            }
          }
        >
          <Image
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
        </Pressable>
        <Pressable
          onPress={() =>
            props.navigation.navigate("FeedStack", {
              screen: "CommentsById",
              params: {
                post_id: item[2].id,
              },
            })
          }
          style={
            {
              // height: width/3 - 10,
              // width: width/3 - 10,
            }
          }
        >
          <Image
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
        </Pressable>
      </View>
    );
  }
  if (item.length < 3) {
    grid = 1;
    return (
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <Pressable
          onPress={() =>
            props.navigation.navigate("FeedStack", {
              screen: "CommentsById",
              params: {
                post_id: item[0].id,
              },
            })
          }
          style={
            {
              // height: width/3 - 10,
              // width: width/3 - 10,
            }
          }
        >
          <Image
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
        </Pressable>
        {item[1] ? (
          <Pressable
            onPress={() =>
              props.navigation.navigate("FeedStack", {
                screen: "CommentsById",
                params: {
                  post_id: item[1].id,
                },
              })
            }
            style={{}}
          >
            <Image
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
          </Pressable>
        ) : null}
      </View>
    );
  }
}
