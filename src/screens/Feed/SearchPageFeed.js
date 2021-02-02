import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  Alert,
  SafeAreaView,
  TextInput,
  Pressable,
  FlatList,
  Image,
  RefreshControl,

} from "react-native";
import Ripple from "react-native-material-ripple";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { 
  CustomImage, 
  Text,
  Button,
  FloatingInput,
  Peringatan,
  Loading, } from "../../component";
import { NetworkStatus } from "@apollo/client";
import {
  Comment,
  LikeRed,
  LikeEmpty,
  PostButton,
  OptionsVertBlack,
  ShareBlack,
  Kosong,
  SearchWhite,
  Magnifying,
  OptionsVertWhite
} from "../../assets/svg";
import { gql } from "apollo-boost";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import AutoHeightImage from "react-native-auto-height-image";
import likepost from "../../graphQL/Mutation/Post/likepost";
import FeedPost from "../../graphQL/Query/Feed/FeedPost";
import FeedList from "./FeedList";
import FeedPopuler from "../../graphQL/Query/Home/FeedPopuler";
export default function Feed(props) {
  const [active, setActive] = useState("personal");
  const[searchtext, SetSearchtext] = useState("");
  let [token, setToken] = useState("");
  let [idx, setIdx] = useState(2);
  let [refreshing, setRefreshing] = useState(false);
  let {width, height} = Dimensions.get("screen");
  const _searchHandle = (text) => {
    SetSearchtext(text)
  };
  const HeaderComponent = {
    tabBarBadge: null,
    headerShown: false,

  };
  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    // getUserAndToken();
    // const unsubscribe = navigation.addListener("focus", () => {
    //   getUserAndToken();
    // });
    // return unsubscribe;
  }, []);
  const { loading: loadingPost, data: dataPost, error: errorPost } = useQuery(FeedPopuler, {
    variables: {
      limit: 36,
      offset: null,
    },
    notifyOnNetworkStatusChange: true,
  });

  // console.log(dataPost);
  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    setToken(tkn);
    // querySearchPost();
  };
  useEffect(() => {
    loadAsync();
  }, []);
  if (loadingPost){
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View style={{ backgroundColor: "#209FAE" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}>
            <View
              style={{
                // borderWidth:1,
                margin: 15,
                backgroundColor: "#FFFFFF",
                flexDirection: "row",
                borderRadius: 3,
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <Magnifying
                width="20"
                height="20"
                style={{ marginHorizontal: 10 }}
              />
              <TextInput
                value={searchtext}
                onChangeText={(e) => _searchHandle(e)}
                placeholder="Search Feed"
                style={{
                  color: "#464646",
                  height: 40,
                  width: "80%",
                }}
              />
            </View>
            <Pressable
              style={{
                height: 70,
                paddingRight: 5,
                // borderWidth:1,
                justifyContent: 'center'
              }}>
              <OptionsVertWhite width={20} height={20}/>
            </Pressable>
        </View>
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#fff",
            borderWidth: 1,
            borderColor: "#EEEEEE",
            paddingHorizontal: 10,
          }}
        >
          <Ripple
            onPress={() => {
              setActive("personal");
            }}
            style={{
              // width: width / 2,
              alignContent: "center",
              alignItems: "center",
              // borderBottomWidth: active == "personal" ? 3 : 1,
              // borderBottomColor:
              //   active == "personal" ? "#209FAE" : "#EEEEEE",
              paddingVertical: 15,
              backgroundColor: "#FFFFFF",
              paddingHorizontal: 10,
            }}
          >
            <Text
              size="description"
              type={active == "personal" ? "bold" : "bold"}
              style={{
                color: active == "personal" ? "#209FAE" : "#D1D1D1",
              }}
            >
              All Post
            </Text>
          </Ripple>
          <Ripple
            onPress={() => {
              setActive("group");
            }}
            style={{
              // width: width / 2,
              alignContent: "center",
              alignItems: "center",
              // borderBottomWidth: active == "group" ? 3 : 1,
              // borderBottomColor: active == "group" ? "#209FAE" : "#EEEEEE",
              paddingVertical: 15,
              backgroundColor: "#FFFFFF",
              paddingHorizontal: 10,
            }}
          >
            <Text
              size="description"
              type={active == "group" ? "bold" : "bold"}
              style={{
                color: active == "group" ? "#209FAE" : "#D1D1D1",
              }}
            >
              Travel
            </Text>
          </Ripple>
        </View>
      </View>
      <View
        style={{
          flex:1,
          justifyContent: 'center',
          alignItems:'center',
        }}>
        <Text size='title'>Loading...</Text>
      </View>
      
    </SafeAreaView>
  
    );
  }
  if (errorPost){
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View style={{ backgroundColor: "#209FAE" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}>
            <View
              style={{
                // borderWidth:1,
                margin: 15,
                backgroundColor: "#FFFFFF",
                flexDirection: "row",
                borderRadius: 3,
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <Magnifying
                width="20"
                height="20"
                style={{ marginHorizontal: 10 }}
              />
              <TextInput
                value={searchtext}
                onChangeText={(e) => _searchHandle(e)}
                placeholder="Search Feed"
                style={{
                  color: "#464646",
                  height: 40,
                  width: "80%",
                }}
              />
            </View>
            <Pressable
              style={{
                height: 70,
                paddingRight: 5,
                // borderWidth:1,
                justifyContent: 'center'
              }}>
              <OptionsVertWhite width={20} height={20}/>
            </Pressable>
        </View>
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#fff",
            borderWidth: 1,
            borderColor: "#EEEEEE",
            paddingHorizontal: 10,
          }}
        >
          <Ripple
            onPress={() => {
              setActive("personal");
            }}
            style={{
              // width: width / 2,
              alignContent: "center",
              alignItems: "center",
              // borderBottomWidth: active == "personal" ? 3 : 1,
              // borderBottomColor:
              //   active == "personal" ? "#209FAE" : "#EEEEEE",
              paddingVertical: 15,
              backgroundColor: "#FFFFFF",
              paddingHorizontal: 10,
            }}
          >
            <Text
              size="description"
              type={active == "personal" ? "bold" : "bold"}
              style={{
                color: active == "personal" ? "#209FAE" : "#D1D1D1",
              }}
            >
              All Post
            </Text>
          </Ripple>
          <Ripple
            onPress={() => {
              setActive("group");
            }}
            style={{
              // width: width / 2,
              alignContent: "center",
              alignItems: "center",
              // borderBottomWidth: active == "group" ? 3 : 1,
              // borderBottomColor: active == "group" ? "#209FAE" : "#EEEEEE",
              paddingVertical: 15,
              backgroundColor: "#FFFFFF",
              paddingHorizontal: 10,
            }}
          >
            <Text
              size="description"
              type={active == "group" ? "bold" : "bold"}
              style={{
                color: active == "group" ? "#209FAE" : "#D1D1D1",
              }}
            >
              Travel
            </Text>
          </Ripple>
        </View>
      </View>
      <View
        style={{
          flex:1,
          justifyContent: 'center',
          alignItems:'center',
        }}>
        <Text size='title'>Error...</Text>
      </View>
      
    </SafeAreaView>
  
    );
  }

  // if (networkStatus === NetworkStatus.refetch) return 'Refetching!';
  // const _refresh =() => {
  //   setRefreshing(true);
  //   refetch();
  //   wait(1000).then(() => {
  //     setRefreshing(false);
  //   });
  // };
  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };
  return(
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View style={{ backgroundColor: "#209FAE" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}>
            <View
              style={{
                // borderWidth:1,
                margin: 15,
                backgroundColor: "#FFFFFF",
                flexDirection: "row",
                borderRadius: 3,
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <Magnifying
                width="20"
                height="20"
                style={{ marginHorizontal: 10 }}
              />
              <TextInput
                value={searchtext}
                onChangeText={(e) => _searchHandle(e)}
                placeholder="Search Feed"
                style={{
                  color: "#464646",
                  height: 40,
                  width: "80%",
                }}
              />
            </View>
            <Pressable
              style={{
                height: 70,
                paddingRight: 5,
                // borderWidth:1,
                justifyContent: 'center'
              }}>
              <OptionsVertWhite width={20} height={20}/>
            </Pressable>
        </View>
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#fff",
            borderWidth: 1,
            borderColor: "#EEEEEE",
            paddingHorizontal: 10,
          }}
        >
          <Ripple
            onPress={() => {
              setActive("personal");
            }}
            style={{
              // width: width / 2,
              alignContent: "center",
              alignItems: "center",
              // borderBottomWidth: active == "personal" ? 3 : 1,
              // borderBottomColor:
              //   active == "personal" ? "#209FAE" : "#EEEEEE",
              paddingVertical: 15,
              backgroundColor: "#FFFFFF",
              paddingHorizontal: 10,
            }}
          >
            <Text
              size="description"
              type={active == "personal" ? "bold" : "bold"}
              style={{
                color: active == "personal" ? "#209FAE" : "#D1D1D1",
              }}
            >
              All Post
            </Text>
          </Ripple>
          <Ripple
            onPress={() => {
              setActive("group");
            }}
            style={{
              // width: width / 2,
              alignContent: "center",
              alignItems: "center",
              // borderBottomWidth: active == "group" ? 3 : 1,
              // borderBottomColor: active == "group" ? "#209FAE" : "#EEEEEE",
              paddingVertical: 15,
              backgroundColor: "#FFFFFF",
              paddingHorizontal: 10,
            }}
          >
            <Text
              size="description"
              type={active == "group" ? "bold" : "bold"}
              style={{
                color: active == "group" ? "#209FAE" : "#D1D1D1",
              }}
            >
              Travel
            </Text>
          </Ripple>
        </View>
      </View>
      <FlatList
        data={dataPost.feed_post_populer }
        renderItem={({ item, index }) => (
            console.log(index),
            (index+1)%9 == 0 ?
            <View>
                <View
                  style={{
                    flexDirection:'row',
                  }}>
                      <View style={{
                        
                      }}>
                        <Image
                          source={{ uri: dataPost.feed_post_populer[index-8].assets[0].filepath }}
                          style={{
                            height: width/3 - 10,
                            width: width/3 - 10,
                            borderRadius: 5,
                            margin: 2,
                            alignSelf: "center",
                            resizeMode: "cover",
                          }}
                        />
                        <Image
                          source={{ uri: dataPost.feed_post_populer[index-7].assets[0].filepath }}
                          style={{
                            height: width/3 - 10,
                            width: width/3 - 10,
                            borderRadius: 5,
                            margin: 2,
                            alignSelf: "center",
                            resizeMode: "cover",
                          }}
                        />
                      </View>
                      <Image
                          source={{ uri: dataPost.feed_post_populer[index-6].assets[0].filepath }}
                          style={{
                            height: (width + width)/3 -15,
                            width: (width + width)/3 -20,
                            borderRadius: 5,
                            margin: 2,
                            alignSelf: "center",
                            resizeMode: "cover",
                          }}
                        />
                </View>
                <View
                  style={{
                    flexDirection:'row',
                  }}> 
                  <Image
                  source={{ uri: dataPost.feed_post_populer[index-5].assets[0].filepath }}
                  style={{
                    height: (width + width)/3 -15,
                    width: (width + width)/3 -20,
                    borderRadius: 5,
                    margin: 2,
                    alignSelf: "center",
                    resizeMode: "cover",
                  }}
                  />
                  <View style={{
                    
                  }}>
                    <Image
                      source={{ uri: dataPost.feed_post_populer[index-4].assets[0].filepath }}
                      style={{
                        height: width/3 - 10,
                        width: width/3 - 10,
                        borderRadius: 5,
                        margin: 2,
                        alignSelf: "center",
                        resizeMode: "cover",
                      }}
                    />
                      <Image
                        source={{ uri: dataPost.feed_post_populer[index-3].assets[0].filepath }}
                        style={{
                          height: width/3 - 10,
                          width: width/3 - 10,
                          borderRadius: 5,
                          margin: 2,
                          alignSelf: "center",
                          resizeMode: "cover",
                        }}
                      />
                </View>
                </View>
                <View
                    style={{
                      flexDirection:'row',
                    }}> 
                      <Image
                        source={{ uri: dataPost.feed_post_populer[index-2].assets[0].filepath }}
                        style={{
                          height: width/3 - 10,
                          width: width/3 - 10,
                          borderRadius: 5,
                          margin: 2,
                          alignSelf: "center",
                          resizeMode: "cover",
                        }}
                      />
                        <Image
                          source={{ uri: dataPost.feed_post_populer[index-1].assets[0].filepath }}
                          style={{
                            height: width/3 - 10,
                            width: width/3 - 10,
                            borderRadius: 5,
                            margin: 2,
                            alignSelf: "center",
                            resizeMode: "cover",
                          }}
                        />
                        <Image
                          source={{ uri: item.assets[0].filepath }}
                          style={{
                            height: width/3 - 10,
                            width: width/3 - 10,
                            borderRadius: 5,
                            margin: 2,
                            alignSelf: "center",
                            resizeMode: "cover",
                          }}
                        />
                  </View>
            </View>:null        
        )}
        style={{
          marginHorizontal: 10,
          // width: '100%',
          // height: '50%'
        }}
        // horizontal
        contentContainerStyle={{
          // flexDirection: 'column',
          // flexWrap: 'wrap',
          
        }}
        keyExtractor={(item) => item.id_post}
        showsVerticalScrollIndicator={false}
        // refreshing={false}
        // refreshControl={
        //   <RefreshControl refreshing={refreshing}  onRefresh={() => _refresh()}/>
        // }

      />
      
    </SafeAreaView>
  
  );

}