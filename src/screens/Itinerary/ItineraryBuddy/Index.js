import React, { useState, useEffect } from "react";
import {
  View,
  Dimensions,
  TextInput,
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { CustomImage } from "../../../component";
import { Text } from "../../../component";
import { Button } from "../../../component";
import { default_image, search_button } from "../../../assets/png";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import DeletedBuddy from "../../../graphQL/Mutation/Itinerary/Deletedbuddy";
import MakeAdmin from "../../../graphQL/Mutation/Itinerary/MakeAdmin";
import RemovAdmin from "../../../graphQL/Mutation/Itinerary/RemoveAdmin";
import { Truncate } from "../../../component";
import {
  Arrowbackwhite,
  Delete,
  Member,
  Memberblue,
  PlusCircle,
} from "../../../assets/svg";
import Swipeout from "react-native-swipeout";
import ItineraryDetails from "../../../graphQL/Query/Itinerary/listbuddy";
import { Input } from "native-base";
import { useTranslation } from "react-i18next";

export default function ItineraryBuddy(props) {
  const HeaderComponent = {
    headerShown: true,
    title: "Travel Buddy",
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: "Travel Buddy",
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      fontFamily: "Lato-Regular",
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
        <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
      </Button>
    ),
  };

  const { t, i18n } = useTranslation();
  let iditinerary = props.route.params.iditin;
  let token = props.route.params.token;
  let created_by = props.route.params.created_by;
  // let [dataAll, setDataAll] = useState({});
  let [datadetail, setDatadetail] = useState([]);
  let [search, setSearch] = useState("");
  let [users, setUser] = useState({});

  const [
    GetListEvent,
    { data: dataAll, loading: loadingAll, error: errorAll },
  ] = useLazyQuery(ItineraryDetails, {
    // partialRefetch: true,
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${props.route.params.token}`,
      },
    },
    variables: {
      itinerary_id: props.route.params.iditin,
      key: search,
    },
  });

  // console.log(dataAlls);

  const [
    mutationMakeAdmin,
    { loading: loadingAdmin, data: dataAdmin, error: errorAdmin },
  ] = useMutation(MakeAdmin, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const [
    mutationRemoveAdmin,
    { loading: loadingRemove, data: dataRemove, error: errorRemove },
  ] = useMutation(RemovAdmin, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const [
    mutationDeleteBuddy,
    { loading: loadingDeleted, data: dataDeleted, error: errorDeleted },
  ] = useMutation(DeletedBuddy, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const DeleteBuddy = async (idbuddy, iditinerary) => {
    try {
      let response = await mutationDeleteBuddy({
        variables: {
          itinerary_id: iditinerary,
          buddy_id: idbuddy,
        },
      });
      if (loadingDeleted) {
        Alert.alert("Loading!!");
      }
      if (errorDeleted) {
        throw new Error("Error Deleted");
      }
      if (response.data) {
        if (response.data.delete_buddy.code !== 200) {
          throw new Error(response.data.delete_buddy.message);
        }
        setDatadetail(response.data.delete_buddy.data_buddy);
        _Refresh();
      }
    } catch (error) {
      Alert.alert("" + error);
    }
  };

  const SetAdmin = async (idbuddy, iditinerary) => {
    try {
      let response = await mutationMakeAdmin({
        variables: {
          itinerary_id: iditinerary,
          buddy_id: idbuddy,
        },
      });
      if (loadingAdmin) {
        Alert.alert("Loading!!");
      }
      if (errorAdmin) {
        throw new Error("Error Deleted");
      }
      // console.log(response);
      if (response.data) {
        if (response.data.make_admin.code !== 200) {
          throw new Error(response.data.make_admin.message);
        }
        setDatadetail(response.data.make_admin.data_buddy);
        _Refresh();
      }
    } catch (error) {
      Alert.alert("" + error);
    }
  };

  const RemoveAdmin = async (idbuddy, iditinerary) => {
    try {
      let response = await mutationRemoveAdmin({
        variables: {
          itinerary_id: iditinerary,
          buddy_id: idbuddy,
        },
      });
      if (loadingRemove) {
        Alert.alert("Loading!!");
      }
      if (errorRemove) {
        throw new Error("Error Deleted");
      }
      // console.log(response);
      if (response.data) {
        if (response.data.remove_admin.code !== 200) {
          throw new Error(response.data.remove_admin.message);
        }
        setDatadetail(response.data.remove_admin.data_buddy);
        _Refresh();
      }
    } catch (error) {
      Alert.alert("" + error);
    }
  };

  const swipeoutBtns = (idbuddy, iditin) => {
    return [
      {
        backgroundColor: "#f6f6f6",
        component: (
          <TouchableOpacity
            onPress={() => {
              SetAdmin(idbuddy, iditin);
            }}
            style={{
              height: "100%",
              width: "100%",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <Memberblue height={20} width={20} />
            <Text
              size="small"
              type="regular"
              style={{ textAlign: "center", paddingHorizontal: 2 }}
            >
              {t("SetasAdmin")}
            </Text>
          </TouchableOpacity>
        ),
      },
      {
        backgroundColor: "#f6f6f6",
        component: (
          <TouchableOpacity
            onPress={() => {
              DeleteBuddy(idbuddy, iditin);
            }}
            style={{
              height: "100%",
              width: "100%",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <Delete height={20} width={20} />
            <Text
              size="small"
              type="regular"
              style={{ textAlign: "center", paddingHorizontal: 2 }}
            >
              {t("delete")}
            </Text>
          </TouchableOpacity>
        ),
      },
    ];
  };

  const swipeoutBtn = (idbuddy, iditin) => {
    return [
      {
        backgroundColor: "#f6f6f6",
        component: (
          <TouchableOpacity
            onPress={() => {
              RemoveAdmin(idbuddy, iditin);
            }}
            style={{
              height: "100%",
              width: "100%",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <Member height={20} width={20} />
            <Text size="small" type="regular" style={{ textAlign: "center" }}>
              {t("removeadmin")}
            </Text>
          </TouchableOpacity>
        ),
      },
      {
        backgroundColor: "#f6f6f6",
        component: (
          <TouchableOpacity
            onPress={() => {
              DeleteBuddy(idbuddy, iditin);
            }}
            style={{
              height: "100%",
              width: "100%",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <Delete height={20} width={20} />
            <Text size="small" type="regular" style={{}}>
              {t("delete")}
            </Text>
          </TouchableOpacity>
        ),
      },
    ];
  };

  const array_move = (arr, old_index, new_index) => {
    if (new_index >= arr.length) {
      var k = new_index - arr.length + 1;
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
  };

  const RenderBuddy = ({ databuddy }) => {
    // var inde = databuddy.findIndex((k) => k['user_id'] === created_by);
    // var index = databuddy.findIndex((k) => k['user_id'] === created_by);
    // // if (inde > -1 && created_by == users.id) {
    // databuddy = array_move(databuddy, inde, 0);
    // // }
    var inde = databuddy.findIndex((k) => k["user_id"] === users.id);

    return (
      <SafeAreaView
        style={{
          // width: Dimensions.get("screen").width,
          flex: 1,
          backgroundColor: "#f0f0f0",
        }}
      >
        {databuddy.map((value, i) => {
          if (value.user_id === users.id) {
            return (
              <View
                style={{
                  flexDirection: "row",
                  width: Dimensions.get("screen").width,
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  justifyContent: "space-between",
                  // borderWidth: 1,
                  alignItems: "center",
                  alignContent: "center",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    // width: '100%',
                    // paddingHorizontal: 20,
                    // paddingVertical: 10,
                    alignItems: "center",
                    alignContent: "center",
                  }}
                >
                  {/* {console.log(value)} */}
                  <Image
                    source={
                      value.picture ? { uri: value.picture } : default_image
                    }
                    style={{
                      resizeMode: "cover",
                      height: 50,
                      width: 50,
                      borderRadius: 25,
                    }}
                  />

                  <Text
                    size="label"
                    type="bold"
                    style={{
                      marginLeft: 20,
                    }}
                  >
                    <Truncate text={value.first_name} length={17} />
                  </Text>

                  {/* <Text
										style={{
											fontSize: 12,
											fontFamily: 'Lato-Bold',
											marginLeft: 20,
											color: '#209fae',
										}}>
										Status
									</Text> */}
                </View>

                {value.user_id === created_by ? (
                  <View
                    style={{
                      alignContent: "center",
                      justifyContent: "center",
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: "#209fae",
                      borderRadius: 5,
                      marginLeft: 5,
                      paddingHorizontal: 15,
                      // paddingVertical: 5,
                      height: 30,
                    }}
                  >
                    <Text
                      size="small"
                      type="bold"
                      style={{
                        // marginLeft: 20,
                        color: "#209fae",
                      }}
                    >
                      {t("TripOwner")}
                    </Text>
                  </View>
                ) : value.isadmin === true ? (
                  <View style={{ marginRight: 5 }}>
                    <Text
                      size="small"
                      type="bold"
                      style={{
                        // fontFamily: 'Lato-Bold',
                        // fontSize: 12,
                        color: "#209fae",
                      }}
                    >
                      {t("admin")}
                    </Text>
                  </View>
                ) : null}
              </View>
            );
          } else if (
            inde !== -1 &&
            value.isadmin !== true &&
            databuddy[inde].isadmin === true
          ) {
            return (
              <Swipeout right={swipeoutBtns(value.id, iditinerary)}>
                <View
                  style={{
                    backgroundColor: "#f0f0f0",
                    flexDirection: "row",
                    width: Dimensions.get("screen").width,
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    justifyContent: "space-between",
                    // borderWidth: 1,
                    alignItems: "center",
                    alignContent: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      // width: '100%',
                      // paddingHorizontal: 20,
                      // paddingVertical: 10,
                      alignItems: "center",
                      alignContent: "center",
                    }}
                  >
                    <Image
                      source={
                        value.picture ? { uri: value.picture } : default_image
                      }
                      style={{
                        resizeMode: "cover",
                        height: 50,
                        width: 50,
                        borderRadius: 25,
                        opacity: value.isconfrim !== true ? 0.3 : 1,
                      }}
                    />
                    <View>
                      <View style={{ flexDirection: "row" }}>
                        <Text
                          size="label"
                          type="bold"
                          style={{
                            // fontSize: 14,
                            // fontFamily: 'Lato-Bold',
                            marginLeft: 20,
                            opacity: value.isconfrim !== true ? 0.3 : 1,
                          }}
                        >
                          <Truncate text={value.first_name} length={17} />
                        </Text>
                        {value.isconfrim !== true ? (
                          <Text
                            size="small"
                            type="bold"
                            style={{
                              // fontSize: 12,
                              // fontFamily: 'Lato-Bold',
                              marginHorizontal: 10,
                              color: "#D75995",
                            }}
                          >
                            Pending
                          </Text>
                        ) : value.accepted_at !== null ? null : (
                          <Text
                            size="small"
                            type="bold"
                            style={{
                              // fontSize: 12,
                              // fontFamily: 'Lato-Bold',
                              marginHorizontal: 10,
                              color: "#D75995",
                            }}
                          >
                            Rejected
                          </Text>
                        )}
                      </View>
                      <Text
                        size="small"
                        type="regular"
                        style={{
                          // fontSize: 14,
                          // fontFamily: 'Lato-Regular',
                          marginLeft: 20,
                          opacity: value.isconfrim !== true ? 0.3 : 1,
                        }}
                      >
                        {value.username}
                      </Text>
                    </View>
                  </View>

                  <View></View>
                </View>
              </Swipeout>
            );
          } else if (
            // value.isadmin === true &&
            value.user_id === created_by
            // &&
            // databuddy[inde].isadmin === true
          ) {
            return (
              <View
                style={{
                  flexDirection: "row",
                  width: Dimensions.get("screen").width,
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  justifyContent: "space-between",
                  // borderWidth: 1,
                  alignItems: "center",
                  alignContent: "center",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    // width: '100%',
                    // paddingHorizontal: 20,
                    // paddingVertical: 10,
                    alignItems: "center",
                    alignContent: "center",
                  }}
                >
                  <Image
                    source={
                      value.picture ? { uri: value.picture } : default_image
                    }
                    style={{
                      resizeMode: "cover",
                      height: 50,
                      width: 50,
                      borderRadius: 25,
                    }}
                  />

                  <Text
                    size="label"
                    type="bold"
                    style={{
                      // fontSize: 14,
                      // fontFamily: 'Lato-Bold',
                      marginLeft: 20,
                    }}
                  >
                    <Truncate text={value.first_name} length={17} />
                  </Text>

                  {/* <Text
										style={{
											fontSize: 12,
											fontFamily: 'Lato-Bold',
											marginLeft: 20,
											color: '#209fae',
										}}>
										Status
									</Text> */}
                </View>
                <View
                  style={{
                    alignContent: "center",
                    justifyContent: "center",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: "#209fae",
                    borderRadius: 5,
                    marginLeft: 5,
                    paddingHorizontal: 15,
                    // paddingVertical: 5,
                    height: 30,
                  }}
                >
                  <Text
                    size="label"
                    type="bold"
                    style={{
                      // fontSize: 14,
                      // fontFamily: 'Lato-Bold',
                      // marginLeft: 20,
                      color: "#209fae",
                    }}
                  >
                    {t("TripOwner")}
                  </Text>
                </View>
              </View>
            );
          } else if (
            inde !== -1 &&
            value.isadmin === true &&
            databuddy[inde].isadmin === true
          ) {
            return (
              <Swipeout right={swipeoutBtn(value.id, iditinerary)}>
                <View
                  style={{
                    backgroundColor: "#f0f0f0",
                    flexDirection: "row",
                    width: Dimensions.get("screen").width,
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    justifyContent: "space-between",
                    // borderWidth: 1,
                    alignItems: "center",
                    alignContent: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      // width: '100%',
                      // paddingHorizontal: 20,
                      // paddingVertical: 10,
                      alignItems: "center",
                      alignContent: "center",
                    }}
                  >
                    <Image
                      source={
                        value.picture ? { uri: value.picture } : default_image
                      }
                      style={{
                        resizeMode: "cover",
                        height: 50,
                        width: 50,
                        borderRadius: 25,
                        opacity: value.isconfrim !== true ? 0.3 : 1,
                      }}
                    />
                    <View>
                      <View style={{ flexDirection: "row" }}>
                        <Text
                          size="label"
                          type="bold"
                          style={{
                            // fontSize: 14,
                            // fontFamily: 'Lato-Bold',
                            marginLeft: 20,
                            opacity: value.isconfrim !== true ? 0.3 : 1,
                          }}
                        >
                          <Truncate text={value.first_name} length={17} />
                        </Text>
                        {/* {value.isconfrim !== true ? (
													<Text
														style={{
															fontSize: 12,
															fontFamily: 'Lato-Bold',
															marginHorizontal: 10,
															color: '#D75995',
														}}>
														Pending
													</Text>
												) : null} */}
                      </View>
                      <Text
                        size="small"
                        type="regular"
                        style={{
                          // fontSize: 14,
                          // fontFamily: 'Lato-Regular',
                          marginLeft: 20,
                          opacity: value.isconfrim !== true ? 0.3 : 1,
                        }}
                      >
                        {value.username}
                      </Text>
                    </View>
                  </View>
                  {/* {console.log(value.user_id)}
									{console.log(created_by)} */}
                  {value.user_id === created_by ? (
                    <View style={{ marginRight: 5 }}>
                      <Text
                        size="small"
                        type="bold"
                        style={{
                          // fontFamily: 'Lato-Bold',
                          // fontSize: 12,
                          color: "#209fae",
                        }}
                      >
                        {t("TripOwner")}
                      </Text>
                    </View>
                  ) : (
                    <View style={{ marginRight: 5 }}>
                      <Text
                        size="small"
                        type="bold"
                        style={{
                          // fontFamily: 'Lato-Bold',
                          // fontSize: 12,
                          color: "#209fae",
                        }}
                      >
                        {t("admin")}
                      </Text>
                    </View>
                  )}
                </View>
              </Swipeout>
            );
          } else {
            return (
              <View
                style={{
                  flexDirection: "row",
                  width: Dimensions.get("screen").width,
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  justifyContent: "space-between",
                  // borderWidth: 1,
                  alignItems: "center",
                  alignContent: "center",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    // width: '100%',
                    // paddingHorizontal: 20,
                    // paddingVertical: 10,
                    alignItems: "center",
                    alignContent: "center",
                  }}
                >
                  <Image
                    source={
                      value.picture ? { uri: value.picture } : default_image
                    }
                    style={{
                      resizeMode: "cover",
                      height: 50,
                      width: 50,
                      borderRadius: 25,
                    }}
                  />

                  <Text
                    size="label"
                    type="bold"
                    style={{
                      // fontSize: 14,
                      // fontFamily: 'Lato-Bold',
                      marginLeft: 20,
                    }}
                  >
                    <Truncate text={value.first_name} length={17} />
                  </Text>

                  {/* <Text
										style={{
											fontSize: 12,
											fontFamily: 'Lato-Bold',
											marginLeft: 20,
											color: '#209fae',
										}}>
										Status
									</Text> */}
                </View>

                {value.user_id === created_by ? (
                  <View
                    style={{
                      alignContent: "center",
                      justifyContent: "center",
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: "#209fae",
                      borderRadius: 5,
                      marginLeft: 5,
                      paddingHorizontal: 15,
                      // paddingVertical: 5,
                      height: 30,
                    }}
                  >
                    <Text
                      size="small"
                      type="bold"
                      style={{
                        // fontSize: 14,
                        // fontFamily: 'Lato-Bold',
                        // marginLeft: 20,
                        color: "#209fae",
                      }}
                    >
                      {t("TripOwner")}
                    </Text>
                  </View>
                ) : value.isadmin === true ? (
                  <View style={{ marginRight: 5 }}>
                    <Text
                      size="small"
                      type="bold"
                      style={{
                        // fontFamily: 'Lato-Bold',
                        // fontSize: 12,
                        color: "#209fae",
                      }}
                    >
                      {t("admin")}
                    </Text>
                  </View>
                ) : null}
              </View>
            );
          }
        })}
      </SafeAreaView>
    );
  };

  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  const [refreshing, setRefreshing] = React.useState(
    props.route.params.refresh ? props.route.params.refresh : false
  );

  const loadasync = async () => {
    let user = await AsyncStorage.getItem("user");
    user = JSON.parse(user);
    setUser(user);
  };

  const _Refresh = React.useCallback(() => {
    setDatadetail([]);
    setRefreshing(true);
    GetListEvent();
    wait(2000).then(() => {
      RenderBuddy({ databuddy: datadetail });
      setRefreshing(false);
    });
    loadasync();
  }, []);

  const GetTombolplus = ({ datanya }) => {
    var inde = datanya.findIndex((k) => k["user_id"] === users.id);

    if (inde !== -1 && datanya[inde].isadmin === true) {
      return (
        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate("AddBuddy", {
              iditin: iditinerary,
              token: token,
              dataBuddy: dataAll.list_buddy,
            })
          }
          style={{
            flexDirection: "row",
            width: Dimensions.get("screen").width,
            paddingHorizontal: 20,
            paddingVertical: 10,
            justifyContent: "space-between",
            // borderWidth: 1,
            alignItems: "center",
            alignContent: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              // width: '100%',
              // paddingHorizontal: 20,
              // paddingVertical: 10,
              alignItems: "center",
              alignContent: "center",
            }}
          >
            <PlusCircle height={50} width={50} />

            <Text
              size="label"
              type="bold"
              style={{
                // fontSize: 14,
                // fontFamily: 'Lato-Bold',
                marginLeft: 20,
              }}
            >
              {t("Invitemorebuddy")}
            </Text>
          </View>
          <View></View>
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  };

  const _Search = (x) => {
    setSearch(x);
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      _Refresh();
    });
    return unsubscribe;
  }, [props.navigation]);

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          backgroundColor: "#f0f0f0",
          paddingVertical: 5,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            marginVertical: 5,
          }}
        >
          <Member height={10} width={10} />
          <Text
            size="label"
            type="regular"
            style={{
              marginLeft: 5,
              // fontFamily: 'Lato-Regular', fontSize: 14
            }}
          >
            {" "}
            {dataAll && dataAll.list_buddy ? dataAll.list_buddy.length : 0}{" "}
            {t("member")}
          </Text>
        </View>
        <View
          style={{
            alignContent: "center",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 20,
            height: 50,
            zIndex: 5,
            flexDirection: "row",
            width: Dimensions.get("screen").width,
          }}
        >
          <View
            style={{
              backgroundColor: "#e2ecf8",
              borderRadius: 5,
              width: "100%",
              height: 40,
              borderWidth: 1,
              borderColor: "#d3d3d3",
              // flex: 1,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View>
              <CustomImage
                source={search_button}
                customImageStyle={{ resizeMode: "cover" }}
                customStyle={{
                  height: 15,
                  width: 15,
                  alignSelf: "center",
                  zIndex: 100,
                  marginHorizontal: 5,
                }}
              />
            </View>

            <Input
              // editable={false}
              style={{
                width: "100%",
                fontFamily: "Lato-Regular",
                fontSize: 14,
              }}
              placeholder={t("search")}
              autoCorrect={false}
              value={search}
              onChangeText={_Search}
              keyboardType="default"
            />
          </View>
        </View>
      </View>
      {/* ========== */}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={_Refresh} />
        }
      >
        {dataAll && dataAll.list_buddy.length > 0 ? (
          <View>
            {/* <GetTombolplus datanya={dataAll.itinerary_detail.buddy} /> */}
            <RenderBuddy databuddy={dataAll.list_buddy} />
            <GetTombolplus datanya={dataAll.list_buddy} />
          </View>
        ) : // ) : (
        null}
      </ScrollView>
    </View>
  );
}
