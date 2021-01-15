import React, { useState, useEffect } from "react";
import {
  View,
  Dimensions,
  TextInput,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import { CustomImage } from "../../../component";
import { Text } from "../../../component";
import { Button, Truncate, Loading } from "../../../component";
import { default_image, search_button } from "../../../assets/png";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import { Arrowbackwhite, WhiteCheck } from "../../../assets/svg";
import TravelWith from "../../../graphQL/Query/Itinerary/TravelWith";
import ItineraryDetails from "../../../graphQL/Query/Itinerary/ItineraryDetails";
import saveBuddy from "../../../graphQL/Mutation/Itinerary/AddBuddy";
import { useTranslation } from "react-i18next";

export default function AddBuddy(props) {
  const HeaderComponent = {
    headerShown: true,
    title: "Travel Buddy",
    headerTransparent: false,
    headerTintColor: "#f0f0f0",
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
      color: "#f0f0f0",
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

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      _setSearch(null);
      GetListEvent();
    });
    return unsubscribe;
  }, [props.navigation]);

  const { t, i18n } = useTranslation();
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
        Authorization: `Bearer ${props.route.params.token}`,
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
        Authorization: `Bearer ${props.route.params.token}`,
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
            props.navigation.navigate("ItineraryBuddy", {
              iditin: props.route.params.iditin,
              token: props.route.params.token,
              dataitin:
                datadetail && datadetail.itinerary_detail ? datadetail : null,
              databuddy: response.data.add_buddy.data_buddy,
            });
          } else {
            throw new Error(response.data.add_buddy.message);
          }
        }
        setloading(false);
      } catch (error) {
        setloading(false);
        Alert.alert("" + error);
      }
    } else {
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
        Authorization: `Bearer ${props.route.params.token}`,
      },
    },
  });

  const _setSearch = async (text) => {
    setSearch(text);
    querywith();
  };

  const RenderBuddy = ({ databuddy }) => {
    return (
      <View style={{ width: Dimensions.get("screen").width }}>
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
                          // fontFamily: 'Lato-Bold',
                          marginLeft: 20,
                        }}
                      >
                        <Truncate text={value.first_name} length={17} />
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
                        }}
                      >
                        <Truncate text={value.first_name} length={17} />
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
                      }}
                    >
                      <Truncate text={value.first_name} length={17} />
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
      }}
    >
      <Loading show={loading} />

      <View
        style={{
          backgroundColor: "#f0f0f0",
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

            <TextInput
              underlineColorAndroid="transparent"
              placeholder={t("search")}
              style={{
                width: "100%",
                fontFamily: "Lato-Regular",
                fontSize: 14,
              }}
              value={search}
              onChangeText={(text) => _setSearch(text)}
            />
          </View>
        </View>
      </View>
      {/* ========== */}
      <ScrollView>
        {DataBuddy && DataBuddy.search_travelwith ? (
          <RenderBuddy databuddy={DataBuddy.search_travelwith} />
        ) : null}
      </ScrollView>

      <View
        style={{
          zIndex: 999,
          position: "absolute",
          left: 0,
          bottom: 0,
          height: 60,
          width: Dimensions.get("window").width,
          backgroundColor: "#f0f0f0",
          paddingVertical: 10,
          borderTopWidth: 1,
          borderColor: "#F0F0F0",
          shadowColor: "#F0F0F0",
          shadowOffset: { width: 2, height: 2 },
          shadowOpacity: 1,
          shadowRadius: 2,
          elevation: 3,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button
          text={t("save")}
          size="medium"
          color="primary"
          type="box"
          onPress={() => _save()}
          style={{
            width: Dimensions.get("window").width - 40,
          }}
        ></Button>
      </View>
    </View>
  );
}
