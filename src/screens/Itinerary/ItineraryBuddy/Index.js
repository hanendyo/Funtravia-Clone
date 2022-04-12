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
  Arrowbackios,
  Arrowbackwhite,
  Check,
  Delete,
  Member,
  Memberblue,
  PlusCircle,
  Search,
  Xhitam,
  Xblue,
} from "../../../assets/svg";
import Swipeout from "react-native-swipeout";
import ItineraryDetails from "../../../graphQL/Query/Itinerary/listbuddy";
import { Input } from "native-base";
import { useTranslation } from "react-i18next";
import normalize from "react-native-normalize";

export default function ItineraryBuddy(props) {
  const { t, i18n } = useTranslation();

  const HeaderComponent = {
    headerShown: true,
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: (
      <Text type="bold" size="header" style={{ color: "#fff" }}>
        {t("travelBuddy")}
      </Text>
    ),
    headerMode: "screen",
    headerStyle: {
      backgroundColor: Platform.OS == "ios" ? "#14646e" : "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      backgroundColor: Platform.OS == "ios" ? "#209fae" : null,
      width: Platform.OS == "ios" ? Dimensions.get("screen").width : null,
      height: Platform.OS == "ios" ? 45 : null,
      textAlign: Platform.OS == "ios" ? "center" : null,
      paddingTop: Platform.OS == "ios" ? 8 : null,
      paddingBottom: Platform.OS == "ios" ? 15 : null,
    },
    headerLeftContainerStyle: {
      background: "#FFF",
      // position: "absolute",
      zIndex: 999,
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

  let iditinerary = props.route.params.iditin;
  let token = props.route.params.token;
  let created_by = props.route.params.created_by;
  // let [dataAll, setDataAll] = useState({});
  let [datadetail, setDatadetail] = useState([]);
  let [search, setSearch] = useState("");
  let [users, setUser] = useState({});
  let [AdminTrip, setAdminTrip] = useState(true);
  let [seeBuddyNotAdmin, setSeeBuddyNotAdmin] = useState([]);

  const [
    GetListEvent,
    { data: dataAll, loading: loadingAll, error: errorAll },
  ] = useLazyQuery(ItineraryDetails, {
    // partialRefetch: true,
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: props.route.params.token,
      },
    },
    variables: {
      itinerary_id: props.route.params.iditin,
      key: search,
    },
    onCompleted: async (value) => {
      let Admin = value?.list_buddy.filter((x) => x.user_id == users.id);
      await setAdminTrip(Admin[0].isadmin);
      let FilterBuddy = value?.list_buddy.filter((i) => i.isconfrim == true);

      await setSeeBuddyNotAdmin(FilterBuddy);
    },
  });

  const [
    mutationMakeAdmin,
    { loading: loadingAdmin, data: dataAdmin, error: errorAdmin },
  ] = useMutation(MakeAdmin, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
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
        Authorization: token,
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
        Authorization: token,
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
            <Check height={20} width={20} />
            <Text
              size="small"
              type="regular"
              style={{
                textAlign: "center",
                paddingHorizontal: 2,
                color: "#209FAE",
              }}
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

  const swipeoutBtnsx = (idbuddy, iditin) => {
    return [
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
            <Xhitam height={13} width={13} />
            <Text
              size="small"
              type="regular"
              style={{ textAlign: "center", marginTop: 3 }}
            >
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
    var inde = databuddy.findIndex((k) => k["user_id"] === users.id);

    return (
      <SafeAreaView
        style={{
          flex: 1,

          backgroundColor: "#FFFFFF",
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
                  borderBottomWidth: 1,
                  borderBottomColor: "#f6f6f6",
                  alignItems: "center",
                  alignContent: "center",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    flex: 1,
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
                  <View
                    style={{
                      marginLeft: 20,
                      flex: 1,
                    }}
                  >
                    <Text size="label" type="bold">
                      {value?.first_name} {value?.last_name}
                    </Text>
                    <Text size="label" type="light">
                      {"@" + value?.username}
                    </Text>
                  </View>
                </View>

                {value.user_id === created_by ? (
                  <View
                    style={{
                      alignContent: "center",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 5,
                      marginLeft: 5,
                      paddingHorizontal: 15,
                      height: 30,
                    }}
                  >
                    <Text
                      size="description"
                      type="bold"
                      style={{
                        color: "#209fae",
                      }}
                    >
                      {t("TripOwner")}
                    </Text>
                  </View>
                ) : value.isadmin === true ? (
                  <View
                    style={{
                      alignContent: "center",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 5,
                      marginLeft: 5,
                      paddingHorizontal: 15,
                      height: 30,
                    }}
                  >
                    <Text
                      size="description"
                      type="bold"
                      style={{
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
              <Swipeout
                right={
                  value.isconfrim !== true
                    ? swipeoutBtnsx(value.id, iditinerary)
                    : swipeoutBtns(value.id, iditinerary)
                }
              >
                <View
                  style={{
                    backgroundColor: "#FFFFFF",
                    flexDirection: "row",
                    width: Dimensions.get("screen").width,
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    justifyContent: "space-between",
                    borderBottomWidth: 1,
                    borderBottomColor: "#f6f6f6",
                    alignItems: "center",
                    alignContent: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",

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
                    <View
                      style={{
                        marginLeft: 20,
                        flex: 1,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          opacity: value.isconfrim !== true ? 0.3 : 1,
                          width: normalize(270),
                        }}
                      >
                        <Text
                          size="label"
                          type="bold"
                          style={{
                            flex: 1,
                          }}
                          numberOfLines={2}
                        >
                          {value?.first_name} {value?.last_name}
                        </Text>
                        {value.isconfrim !== true ? (
                          <Text
                            size="small"
                            type="bold"
                            style={{
                              marginHorizontal: 10,
                              color: "#D75995",
                            }}
                          >
                            {t("pending")}
                          </Text>
                        ) : value.accepted_at !== null ? null : (
                          <Text
                            size="small"
                            type="bold"
                            style={{
                              marginHorizontal: 10,
                              color: "#D75995",
                            }}
                          >
                            {t("rejected")}
                          </Text>
                        )}
                      </View>

                      <Text
                        size="label"
                        type="light"
                        style={{
                          opacity: value.isconfrim !== true ? 0.3 : 1,
                        }}
                      >
                        {"@" + value?.username}
                      </Text>
                    </View>
                  </View>

                  <View></View>
                </View>
              </Swipeout>
            );
          } else if (value.user_id === created_by) {
            return (
              <View
                style={{
                  flexDirection: "row",
                  width: Dimensions.get("screen").width,
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  justifyContent: "space-between",

                  alignItems: "center",
                  alignContent: "center",
                }}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",

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
                      marginLeft: 20,

                      flex: 1,
                    }}
                    numberOfLines={1}
                  >
                    {value?.first_name} {value?.last_name}
                  </Text>
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
                    backgroundColor: "#FFFFFF",
                    flexDirection: "row",
                    width: Dimensions.get("screen").width,
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    justifyContent: "space-between",
                    borderBottomWidth: 1,
                    borderBottomColor: "#F6F6F6",
                    alignItems: "center",
                    alignContent: "center",
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
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
                    <View
                      style={{
                        marginLeft: 20,
                        flex: 1,
                      }}
                    >
                      <Text size="label" type="bold">
                        {value?.first_name} {value?.last_name}
                      </Text>
                      <Text size="label" type="light">
                        {"@" + value?.username}
                      </Text>
                    </View>
                  </View>

                  {value.user_id === created_by ? (
                    <View
                      style={{
                        alignContent: "center",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 5,
                        marginLeft: 5,
                        paddingHorizontal: 15,
                        height: 30,
                      }}
                    >
                      <Text
                        size="description"
                        type="bold"
                        style={{
                          color: "#209fae",
                        }}
                      >
                        {t("TripOwner")}
                      </Text>
                    </View>
                  ) : value.isadmin === true ? (
                    <View
                      style={{
                        alignContent: "center",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 5,
                        marginLeft: 5,
                        paddingHorizontal: 15,
                        height: 30,
                      }}
                    >
                      <Text
                        size="description"
                        type="bold"
                        style={{
                          color: "#209fae",
                        }}
                      >
                        {t("admin")}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </Swipeout>
            );
          } else if (value.isconfrim == true) {
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
                    flex: 1,
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
                      // fontFamily: "Lato-Bold",
                      marginLeft: 20,
                      // width: "60%",
                      flex: 1,
                    }}
                    numberOfLines={1}
                  >
                    {/* <Truncate text={value.first_name} length={17} /> */}
                    {value?.first_name} {value?.last_name}
                    {/* asep setidai nugroho jijijijij ijijijijiji huhuhuhuhu */}
                  </Text>

                  {/* <Text
										style={{
											fontSize: 12,
											fontFamily: "Lato-Bold",
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
                        // fontFamily: "Lato-Bold",
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
                        // fontFamily: "Lato-Bold",
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
    loadasync();
    setDatadetail([]);
    setRefreshing(true);
    GetListEvent();
    wait(2000).then(() => {
      RenderBuddy({ databuddy: datadetail });
      setRefreshing(false);
    });
  }, []);

  const GetTombolplus = ({ datanya }) => {
    var inde = datanya.findIndex((k) => k["user_id"] === users.id);

    if (
      inde !== -1 &&
      datanya[inde].isadmin === true &&
      props.route.params?.dataitin.itinerary_detail?.status !== "F"
    ) {
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
            alignItems: "center",
            alignContent: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              alignContent: "center",
            }}
          >
            <PlusCircle height={50} width={50} />

            <Text
              size="label"
              type="regular"
              style={{
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
        backgroundColor: "#FFFFFF",
      }}
    >
      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",

            alignContent: "center",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <Member height={15} width={15} />
          <Text
            size="label"
            type="regular"
            style={{
              marginLeft: 5,
              // fontFamily: 'Lato-Regular', fontSize: 14
            }}
          >
            {" "}
            {dataAll && dataAll.list_buddy && AdminTrip == true
              ? dataAll.list_buddy.length
              : seeBuddyNotAdmin?.length}{" "}
            {t("member")}
          </Text>
        </View>
        <View
          style={{
            alignContent: "center",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 15,
            paddingBottom: 5,

            // borderWidth: 1,
            height: 40,
            marginTop: 10,
            zIndex: 5,
            flexDirection: "row",
            width: "98%",
          }}
        >
          <View
            style={{
              backgroundColor: "#f6f6f6",
              borderRadius: 2,
              flex: 1,
              paddingHorizontal: 10,
              // paddingBottom:
              marginLeft: 7,
              flexDirection: "row",
              alignItems: "center",
              alignContent: "center",
              borderColor: "#e8e8e8",
            }}
          >
            <Search width={15} height={15} />

            <Input
              // editable={false}
              style={{
                width: "80%",
                marginLeft: 0,
                padding: 0,
              }}
              placeholder={t("search")}
              autoCorrect={false}
              value={search}
              onChangeText={_Search}
              placeholderTextColor="#464646"
              keyboardType="default"
            />
            {search.length !== 0 ? (
              <TouchableOpacity onPress={() => setSearch("")}>
                <Xblue
                  width="20"
                  height="20"
                  style={{
                    alignSelf: "center",
                  }}
                />
              </TouchableOpacity>
            ) : null}
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
        ) : (
          // ) : (
          <Text
            size="label"
            type="bold"
            style={{ alignSelf: "center", marginTop: 30 }}
          >
            {t("noData")}
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
