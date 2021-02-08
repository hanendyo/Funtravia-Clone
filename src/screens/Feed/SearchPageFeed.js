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
import likepost from "../../graphQL/Mutation/Post/likepost";
import FeedPost from "../../graphQL/Query/Feed/FeedPost";
import FeedList from "./FeedList";
import FeedPopuler from "../../graphQL/Query/Home/FeedPopuler";
import FeedPopulerPageing from "../../graphQL/Query/Home/FeedPopulerPageing";
import FeedPageing from "../../graphQL/Query/Feed/FeedPageing";
import Modal from "react-native-modal";

export default function Feed(props) {
  const [active, setActive] = useState("personal");
  const[searchtext, SetSearchtext] = useState("");
  // let [token, setToken] = useState(props.route.params.token);
  let [token, setToken] = useState("");
  // console.log(props.route.params.token);
  let [idx, setIdx] = useState(2);
  let [refreshing, setRefreshing] = useState(false);
  let [modalsearch, setModalsearch] = useState(false);
  let {width, height} = Dimensions.get("screen");
	const loadAsync = async () => {
		let tkn = await AsyncStorage.getItem("access_token");
		setToken(tkn);
    // refetch();
	};
  const _searchHandle = (text) => {
    SetSearchtext(text)
  };
  const HeaderComponent = {
    tabBarBadge: null,
    headerShown: false,

  };
  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);

  }, []);
  const { loading: loadingPost, data: dataPost, error: errorPost, fetchMore, refetch, networkStatus } = useQuery(FeedPopulerPageing, {
    variables: {
      limit: 10,
      offset: 0,
    },
    context: {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		},
    notifyOnNetworkStatusChange: true,
  });
	// console.log(dataPost);
  let feed_post_populer_paging = [];
  if (dataPost && dataPost && 'datas' in dataPost.feed_post_populer_paging){
    feed_post_populer_paging = dataPost.feed_post_populer_paging.datas;
  }
  useEffect(() => {
    loadAsync();
  }, []);
 
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

  const refresh = networkStatus === NetworkStatus.refetch;
  const _refresh = async() => {
    setRefreshing(true);
    feed_post_populer_paging = [];
    refetch();

    wait(1000).then(() => {
      setRefreshing(false);
    });
  };
  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };
  const onUpdate = (prev, { fetchMoreResult }) => {
    if (!fetchMoreResult) return prev;
    const { page_info } = fetchMoreResult.feed_post_populer_paging;
    const datas = [
      ...prev.feed_post_populer_paging.datas,
      ...fetchMoreResult.feed_post_populer_paging.datas,
    ];
    return Object.assign({}, prev, {
        feed_post_populer_paging: {
          __typename: prev.feed_post_populer_paging.__typename,
          page_info,
          datas,
        },
    });
  };

  const handleOnEndReached = () => {
    // console.log('test');
    if (dataPost.feed_post_populer_paging.page_info.hasNextPage){
        return fetchMore({
          variables: {
            limit: 10,
            offset: dataPost.feed_post_populer_paging.page_info.offset + 1,
          },
          updateQuery: onUpdate,
        });
    }
  };

  const teststate = async (index) =>{
    feed_post_populer_paging[index].assets[0].filepath = "https://i.pinimg.com/736x/c6/4f/04/c64f0475196dc54f4dd4386ad962beba.jpg"
    // console.log(feed_post_populer_paging);
    // _refresh();
    setRefreshing(true);
    wait(1000).then(() => {
      setRefreshing(false);
    });
    // _refresh()
  }

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
                onFocus={()=>setModalsearch(true)}
                placeholder="Search Feed"
                style={{
                  color: "#464646",
                  height: 40,
                  width: "80%",
                }}
              />
            </View>
            <Ripple
              onPress={() => {
                // refetch();
                setModalsearch(true)
              }}
              style={{
                height: 70,
                paddingRight: 5,
                // borderWidth:1,
                justifyContent: 'center'
              }}>
              <OptionsVertWhite width={20} height={20}/>
            </Ripple>
        </View>
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
      <Modal
        // onBackdropPress={() => {
        //   setModalsearch(false);
        // }}
        hasBackdrop={false}
        
        onRequestClose={() => setModalsearch(false)}
        // onDismiss={() => setModalmenu(false)}
        // animationIn="fadeInDown"
        // animationOut="fadeInDown"
        isVisible={modalsearch}
        style={{
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
          alignContent: "center",
        }}
      >
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
      </Modal>
      <FlatList
        data={feed_post_populer_paging }
        renderItem={({ item, index }) => (

            (index+1)%9 == 0 ?
            <View>
                <View
                  style={{
                    flexDirection:'row',
                  }}>
                      <View style={{
                        
                      }}>
                        <Pressable
                          onPress={()=> 
                            props.navigation.navigate("FeedStack", {
                            screen: "CommentsById",
                            params: {
                              post_id: feed_post_populer_paging[index-8].id,
                            },
                            })
                            // teststate(index-8)
                          }
                          style={{
                            // height: width/3 - 10,
                            // width: width/3 - 10,
                          }}>
                          <Image
                            
                            source={{ uri: feed_post_populer_paging[index-8].assets[0].filepath }}
                            style={{
                              height: width/3 - 10,
                              width: width/3 - 10,
                              borderRadius: 5,
                              margin: 2,
                              alignSelf: "center",
                              resizeMode: "cover",
                            }}
                          />
                        </Pressable>
                        <Pressable
                          onPress={()=> 
                            props.navigation.navigate("FeedStack", {
                            screen: "CommentsById",
                            params: {
                              post_id: feed_post_populer_paging[index-7].id,
                            },
                            })
                          }
                          style={{
                            // height: width/3 - 10,
                            // width: width/3 - 10,
                          }}>
                            <Image
                              source={{ uri: feed_post_populer_paging[index-7].assets[0].filepath }}
                              style={{
                                height: width/3 - 10,
                                width: width/3 - 10,
                                borderRadius: 5,
                                margin: 2,
                                alignSelf: "center",
                                resizeMode: "cover",
                              }}
                            />
                        </Pressable>
                      </View>
                      <Pressable
                          onPress={()=> 
                            props.navigation.navigate("FeedStack", {
                            screen: "CommentsById",
                            params: {
                              post_id: feed_post_populer_paging[index-6].id,
                            },
                            })
                          }
                          style={{
                            // height: (width + width)/3 -15,
                            // width: (width + width)/3 -20,
                          }}>
                          <Image
                              source={{ uri: feed_post_populer_paging[index-6].assets[0].filepath }}
                              style={{
                                height: (width + width)/3 -15,
                                width: (width + width)/3 -20,
                                borderRadius: 5,
                                margin: 2,
                                alignSelf: "center",
                                resizeMode: "cover",
                              }}
                            />
                      </Pressable>
                </View>
                <View
                  style={{
                    flexDirection:'row',
                  }}> 
                  <Pressable
                    onPress={()=> 
                      props.navigation.navigate("FeedStack", {
                      screen: "CommentsById",
                      params: {
                        post_id: feed_post_populer_paging[index-5].id,
                      },
                      })
                    }
                    style={{
                      // height: (width + width)/3 -15,
                      // width: (width + width)/3 -20,
                    }}>
                      <Image
                      source={{ uri: feed_post_populer_paging[index-5].assets[0].filepath }}
                      style={{
                        height: (width + width)/3 -15,
                        width: (width + width)/3 -20,
                        borderRadius: 5,
                        margin: 2,
                        alignSelf: "center",
                        resizeMode: "cover",
                      }}
                      />
                  </Pressable>

                  <View style={{
                    
                  }}>
                    <Pressable
                      onPress={()=> 
                        props.navigation.navigate("FeedStack", {
                        screen: "CommentsById",
                        params: {
                          post_id: feed_post_populer_paging[index-4].id,
                        },
                        })
                      }
                      style={{
                        // height: width/3 - 10,
                        // width: width/3 - 10,
                      }}>
                      <Image
                        source={{ uri: feed_post_populer_paging[index-4].assets[0].filepath }}
                        style={{
                          height: width/3 - 10,
                          width: width/3 - 10,
                          borderRadius: 5,
                          margin: 2,
                          alignSelf: "center",
                          resizeMode: "cover",
                        }}
                      />
                    </Pressable>
                    <Pressable
                      onPress={()=> 
                        props.navigation.navigate("FeedStack", {
                        screen: "CommentsById",
                        params: {
                          post_id: feed_post_populer_paging[index-3].id,
                        },
                        })
                      }
                      style={{
                        // height: width/3 - 10,
                        // width: width/3 - 10,
                      }}>
                          <Image
                            source={{ uri: feed_post_populer_paging[index-3].assets[0].filepath }}
                            style={{
                              height: width/3 - 10,
                              width: width/3 - 10,
                              borderRadius: 5,
                              margin: 2,
                              alignSelf: "center",
                              resizeMode: "cover",
                            }}
                          />
                      </Pressable>
                </View>
                </View>
                <View
                    style={{
                      flexDirection:'row',
                    }}> 
                    <Pressable
                      onPress={()=> 
                        props.navigation.navigate("FeedStack", {
                        screen: "CommentsById",
                        params: {
                          post_id: feed_post_populer_paging[index-2].id,
                        },
                        })
                      }
                      style={{
                        // height: width/3 - 10,
                        // width: width/3 - 10,
                      }}>
                        <Image
                          source={{ uri: feed_post_populer_paging[index-2].assets[0].filepath }}
                          style={{
                            height: width/3 - 10,
                            width: width/3 - 10,
                            borderRadius: 5,
                            margin: 2,
                            alignSelf: "center",
                            resizeMode: "cover",
                          }}
                        />

                    </Pressable>
                    <Pressable
                      onPress={()=> 
                        props.navigation.navigate("FeedStack", {
                        screen: "CommentsById",
                        params: {
                          post_id: feed_post_populer_paging[index-1].id,
                        },
                        })
                      }
                      style={{
                        // height: width/3 - 10,
                        // width: width/3 - 10,
                      }}>

                        <Image
                          source={{ uri: feed_post_populer_paging[index-1].assets[0].filepath }}
                          style={{
                            height: width/3 - 10,
                            width: width/3 - 10,
                            borderRadius: 5,
                            margin: 2,
                            alignSelf: "center",
                            resizeMode: "cover",
                          }}
                        />
                    </Pressable>
                    <Pressable
                      onPress={()=> 
                        props.navigation.navigate("FeedStack", {
                        screen: "CommentsById",
                        params: {
                          post_id: item.id,
                        },
                        })
                      }
                      style={{
                        // height: width/3 - 10,
                        // width: width/3 - 10,
                      }}>
                        <Image
                          source={{ uri: feed_post_populer_paging[index].assets[0].filepath }}
                          style={{
                            height: width/3 - 10,
                            width: width/3 - 10,
                            borderRadius: 5,
                            margin: 2,
                            alignSelf: "center",
                            resizeMode: "cover",
                          }}
                        />
                    </Pressable>
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
            // flexGrow:1,
            // borderWidth:1,
        }}
        keyExtractor={(item) => item.id_post}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        refreshControl={
          <RefreshControl refreshing={refreshing}  onRefresh={() => _refresh()}/>
        }
        onEndReachedThreshold={1}
        ListFooterComponent={
          loadingPost? 
          <View
            style={{
              // position: 'absolute',
              // bottom:0,
              width: width,
              justifyContent: 'center',
              alignItems:'center',
            }}>
            <Text size='title' type='bold' 
            // style={{ color:'#209fae'}}
            >Loading...</Text>
          </View>
          :null
        }
        onEndReached={handleOnEndReached}
      />
    </SafeAreaView>
  
  );

}