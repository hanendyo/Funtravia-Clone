import React, { useState, useEffect } from "react";
import {
  View,
  Dimensions,
  TextInput,
  Alert,
  Image,
  ScrollView,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { CustomImage } from "../../../component";
import { Text } from "../../../component";
import { Button, Truncate, Loading } from "../../../component";
import { default_image, search_button } from "../../../assets/png";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import {
  Arrowbackios,
  Arrowbackwhite,
  Search,
  WhiteCheck,
  Xblue,
} from "../../../assets/svg";
import TravelWith from "../../../graphQL/Query/Itinerary/TravelWith";
import ItineraryDetails from "../../../graphQL/Query/Itinerary/ItineraryDetails";
import saveBuddy from "../../../graphQL/Mutation/Itinerary/AddBuddy";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import DeviceInfo from "react-native-device-info";

export default function AddBuddy(props) {
  const Notch = DeviceInfo.hasNotch();
  const { t, i18n } = useTranslation();
  const tokenApps = useSelector((data) => data.token);
  const HeaderComponent = {
    headerShown: true,
    headerTransparent: false,
    headerTintColor: "#f0f0f0",
    headerTitle: (
      <Text size="header" style={{ color: "#fff" }}>
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
      marginLeft: Platform.OS == "ios" ? null : -15,
      backgroundColor: Platform.OS == "ios" ? "#209fae" : null,
      width: Platform.OS == "ios" ? Dimensions.get("screen").width : null,
      height: Platform.OS == "ios" ? 45 : null,
      textAlign: Platform.OS == "ios" ? "center" : null,
      paddingTop: Platform.OS == "ios" ? 8 : null,
      paddingBottom: Platform.OS == "ios" ? 15 : null,
    },
    headerLeftContainerStyle: {
      background: "#FFF",
      position: "absolute",
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

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      _setSearch(null);
      GetListEvent();
    });
    return unsubscribe;
  }, [props.navigation]);

  let [search, setSearch] = useState(" ");
  let [dataFilter, setFilter] = useState(props.route.params.dataBuddy);
  let [dataFiltersave, setFiltersave] = useState(props.route.params.dataBuddy);
  let [dataNew, setNew] = useState([]);
  let [loading, setloading] = useState(false);

  const [
    mutationAddBuddy,
    { loading: Loadingbuddy, data: databuddy, error: errorbuddy },
  ] = useMutation(saveBuddy, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenApps,
      },
    },
  });

  const [
    GetListEvent,
    { data: datadetail, loading: loadingdetail, error: errordetail },
  ] = useLazyQuery(ItineraryDetails, {
    // partialRefetch: true,
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenApps,
      },
    },
    variables: { id: props.route.params.iditin },
  });

  const _save = async () => {
    setloading(true);
    if (dataNew.length > 0) {
      try {
        let response = await mutationAddBuddy({
          variables: {
            user_id: dataNew,
            itinerary_id: props.route.params.iditin,
            isadmin: false,
          },
        });

        if (errorbuddy) {
          throw new Error("failed");
        }
        if (response) {
          if (
            response.data.add_buddy.code === 200 ||
            response.data.add_buddy.code === "200"
          ) {
            props.navigation.goBack();
            RNToasty.Show({
              duration: 1,
              title: "sukses add new member",
              position: "bottom",
            });
          } else {
            throw new Error(response.data.add_buddy.message);
          }
        }
        setloading(false);
      } catch (error) {
        RNToasty.Show({
          duration: 1,
          title: "error : someting wrong!",
          position: "bottom",
        });
        props.navigation.goBack();
        setloading(false);
        Alert.alert("" + error);
      }
    } else {
      props.navigation.goBack();
      // GetListEvent();
      setloading(false);

      props.navigation.navigate("ItineraryBuddy", {
        iditin: props.route.params.iditin,
        token: props.route.params.token,
        dataitin: datadetail && datadetail.itinerary_detail ? datadetail : null,
        databuddy:
          datadetail && datadetail.itinerary_detail
            ? datadetail.itinerary_detail.buddy
            : null,
      });
    }
  };

  const AddtoBuddy = async (value) => {
    var dataNews = [...dataNew];
    dataNews.push(value.id);
    setNew(dataNews);

    var filterdata = [...dataFilter];
    filterdata.push(value);
    setFilter(filterdata);
  };

  const DeleteBuddy = (value) => {
    var tempdata = [...dataFilter];
    var index = tempdata.findIndex(
      (k) => k["user_id" ? "user_id" : "id"] === value.id
    );
    tempdata.splice(index, 1);
    setFilter(tempdata);

    var dataNews = [...dataNew];
    var inde = dataNews.findIndex((x) => x === value.id);
    dataNews.splice(inde, 1);
    setNew(dataNews);
  };

  const [dataResult, setDataResult] = useState([]);

  const [
    querywith,
    { loading: loadingwith, data: DataBuddy, error: errorwith },
  ] = useLazyQuery(TravelWith, {
    fetchPolicy: "network-only",
    variables: {
      // itinerary_id: props.route.params.iditin,
      keyword: search,
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenApps,
      },
    },

    onCompleted: () => {
      if (DataBuddy && DataBuddy.search_travelwith) {
        setDataResult(DataBuddy.search_travelwith);
      }
    },
  });

  const _setSearch = async (text) => {
    setSearch(text);
    querywith();
  };

  const RenderBuddy = ({ databuddy }) => {
    return (
      <View style={{ width: Dimensions.get("screen").width - 20 }}>
        {databuddy.map((value, i) => {
          var datafilter = dataFilter.filter((e) =>
            (e.user_id ? e.user_id : e.id).includes(value.id)
          );

          if (datafilter && datafilter.length) {
            var datafilters = dataFiltersave.filter((e) =>
              (e.user_id ? e.user_id : e.id).includes(value.id)
            );
            if (datafilters && datafilters.length) {
              return (
                <View
                  style={{
                    opacity: 0.5,
                    flexDirection: "row",
                    width: Dimensions.get("screen").width - 20,
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
                    <Image
                      source={
                        value && value.picture
                          ? { uri: value.picture }
                          : default_image
                      }
                      style={{
                        resizeMode: "cover",
                        height: 50,
                        width: 50,
                        borderRadius: 25,
                      }}
                    />

                    <View>
                      <Text
                        size="label"
                        type="bold"
                        style={{
                          // fontSize: 14,
                          // fontFamily: "Lato-Bold",
                          marginLeft: 20,
                          width: "100%",
                        }}
                        numberOfLines={1}
                      >
                        <Truncate
                          text={
                            value.first_name +
                            " " +
                            (value?.last_name ? value.last_name : "")
                          }
                          length={17}
                        />
                        {/* {value?.first_name} {value?.last_name} */}
                        {/* asep setidai nugroho jijijijij ijijijijiji huhuhuhuhu */}
                      </Text>

                      <Text
                        size="small"
                        type="regular"
                        style={{
                          marginLeft: 20,
                        }}
                      >
                        {value.username}
                      </Text>
                    </View>
                  </View>
                  <Button
                    text=""
                    size="small"
                    color="primary"
                    type="circle"
                    disabled
                    style={{
                      width: Dimensions.get("screen").width * 0.25,
                    }}
                  >
                    <WhiteCheck width={20} height={20} />
                  </Button>
                </View>
              );
            } else {
              return (
                <View
                  style={{
                    flexDirection: "row",
                    width: Dimensions.get("screen").width - 20,
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
                      alignItems: "center",
                      alignContent: "center",
                    }}
                  >
                    <Image
                      source={
                        value && value.picture
                          ? { uri: value.picture }
                          : default_image
                      }
                      style={{
                        resizeMode: "cover",
                        height: 50,
                        width: 50,
                        borderRadius: 25,
                      }}
                    />

                    <View>
                      <Text
                        size="label"
                        type="bold"
                        style={{
                          marginLeft: 20,
                          width: "100%",
                        }}
                        numberOfLines={1}
                      >
                        <Truncate
                          text={
                            value.first_name +
                            " " +
                            (value?.last_name ? value.last_name : "")
                          }
                          length={17}
                        />
                        {/* {value?.first_name} {value?.last_name} */}
                        {/* asep setidai nugroho jijijijij ijijijijiji huhuhuhuhu */}
                      </Text>

                      <Text
                        size="small"
                        type="regular"
                        style={{
                          marginLeft: 20,
                        }}
                      >
                        {value.username}
                      </Text>
                    </View>
                  </View>
                  <Button
                    text=""
                    size="small"
                    color="primary"
                    type="circle"
                    onPress={() => DeleteBuddy(value)}
                    style={{
                      width: Dimensions.get("screen").width * 0.25,
                    }}
                  >
                    <WhiteCheck width={20} height={20} />
                  </Button>
                </View>
              );
            }
          } else {
            return (
              <View
                style={{
                  flexDirection: "row",
                  width: Dimensions.get("screen").width - 20,
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
                  <Image
                    source={
                      value && value.picture
                        ? { uri: value.picture }
                        : default_image
                    }
                    style={{
                      resizeMode: "cover",
                      height: 50,
                      width: 50,
                      borderRadius: 25,
                    }}
                  />

                  <View>
                    <Text
                      size="label"
                      type="bold"
                      style={{
                        marginLeft: 20,
                        width: "100%",
                      }}
                      numberOfLines={1}
                    >
                      <Truncate
                        text={
                          value.first_name +
                          " " +
                          (value?.last_name ? value.last_name : "")
                        }
                        length={17}
                      />
                    </Text>

                    <Text
                      size="small"
                      type="regular"
                      style={{
                        marginLeft: 20,
                      }}
                    >
                      {value.username}
                    </Text>
                  </View>
                </View>
                <Button
                  text={t("add")}
                  size="small"
                  color="primary"
                  type="circle"
                  variant="bordered"
                  onPress={() => AddtoBuddy(value)}
                  style={{
                    width: Dimensions.get("screen").width * 0.25,
                  }}
                ></Button>
              </View>
            );
          }
        })}
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        // padding: 10,
      }}
    >
      <View
        style={{
          flex: 1,

          borderRadius: 15,
          //   padding: 10,
          //   marginBottom: 20,
          //   backgroundColor: "#FFFFFF",
        }}
      >
        <View
          style={{
            flex: 1,
            marginTop: 10,
            marginHorizontal: 10,
            borderRadius: 15,
            // //   marginBottom: 20,
            backgroundColor: "#FFFFFF",
          }}
        >
          <Loading show={loading} />
          <View
            style={{
              //   backgroundColor: "#f0f0f0",
              paddingVertical: 10,
            }}
          >
            <View
              style={{
                alignContent: "center",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 20,

                height: 50,
                zIndex: 5,
                flexDirection: "row",
                width: Dimensions.get("screen").width - 20,
              }}
            >
              <View
                style={{
                  backgroundColor: "#F6F6F6",
                  borderRadius: 5,
                  width: "100%",
                  height: 40,
                  borderWidth: 1,
                  borderColor: "#e8e8e8",
                  // flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 10,
                }}
              >
                <Search width={15} height={15} style={{ marginRight: 5 }} />

                <TextInput
                  underlineColorAndroid="transparent"
                  placeholder={t("search")}
                  style={{
                    width: "85%",
                    // borderWidth: 1,
                    marginLeft: 5,
                    padding: 0,
                  }}
                  placeholderTextColor="#464646"
                  value={search}
                  onChangeText={(text) => _setSearch(text)}
                />
                {search?.length ? (
                  <TouchableOpacity
                    onPress={() => {
                      setSearch("");
                    }}
                    style={{ marginLeft: 5 }}
                  >
                    <Xblue
                      width="15"
                      height="15"
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
            style={{
              flex: 1,
            }}
          >
            {loadingwith ? (
              <View style={{ alignItems: "center", marginTop: 20 }}>
                <ActivityIndicator color={"#209fae"} size={"small"} />
              </View>
            ) : dataResult && dataResult?.length ? (
              <RenderBuddy databuddy={dataResult} />
            ) : (
              <Text
                size="label"
                type="bold"
                style={{ marginTop: 20, alignSelf: "center" }}
              >
                {t("noData")}
              </Text>
            )}
          </ScrollView>
        </View>
      </View>
      <View
        style={{
          zIndex: 999,
          height: Platform.OS === "ios" ? (Notch ? 70 : 50) : 50,
          width: Dimensions.get("screen").width,
          backgroundColor: "#fff",
          flexDirection: "row",
          paddingHorizontal: 10,
          paddingTop: 5,
          // paddingBottom: 10,
          justifyContent: "space-between",
          borderWidth: 1,
          borderColor: "#f6f6f6",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <Button
          text={t("save")}
          size="medium"
          color="primary"
          type="box"
          onPress={() => _save()}
          style={{
            width: "100%",
          }}
        ></Button>
      </View>
    </View>
  );
}
