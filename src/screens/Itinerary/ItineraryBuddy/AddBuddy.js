import React, { useState, useEffect } from "react";
import {
  View,
  Dimensions,
  TextInput,
  Alert,
  Image,
  ScrollView,
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
import normalize from "react-native-normalize";

export default function AddBuddy(props) {
  const { t, i18n } = useTranslation();
  const HeaderComponent = {
    headerShown: true,
    title: "",
    headerTransparent: false,
    headerTintColor: "#f0f0f0",
    headerTitle: (
      <Text type="bold" style={{ color: "#fff", fontSize: normalize(18) }}>
        {t("addtravelBuddy")}
      </Text>
    ),
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      fontFamily: "Lato-Bold",
      fontSize: 18,
      color: "white",
    },
    headerLeftContainerStyle: {
      background: "#FFF",
      marginLeft: 10,
    },
    headerLRightContainerStyle: {
      background: "#FFF",
      marginRight: 10,
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
    var filterdata = [...dataFilter];
    var inde = dataNews.findIndex((x) => x === value.id);
    var indeFilter = filterdata.findIndex((y) => y["id"] === value.id);

    if (inde !== -1) {
      dataNews.splice(inde, 1);
      setNew(dataNews);

      filterdata.splice(indeFilter, 1);
      setFilter(filterdata);
    } else if (indeFilter !== -1) {
      filterdata.splice(indeFilter, 1);
      setFilter(filterdata);
    } else {
      dataNews.push(value.id);
      setNew(dataNews);

      filterdata.push(value);
      setFilter(filterdata);
    }
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
      <View style={{ width: Dimensions.get("screen").width, marginBottom: 60 }}>
        {databuddy.map((value, i) => {
          var datafilter = dataFilter.filter((e) =>
            (e.user_id ? e.user_id : e.id).includes(value.id)
          );

          if (datafilter && datafilter.length) {
            var datafilters = dataFiltersave.filter((e) =>
              (e.user_id ? e.user_id : e.id).includes(value.id)
            );
            if (datafilters && datafilters.length) {
              return null;
              // <View
              //   style={{
              //     flexDirection: "row",
              //     width: Dimensions.get("screen").width,
              //     borderBottomWidth: 1,
              //     borderBottomColor: "#F6F6F6",
              //     paddingHorizontal: 20,
              //     paddingVertical: 20,
              //     justifyContent: "space-between",
              //     alignItems: "center",
              //     alignContent: "center",
              //   }}
              // >
              //   <View
              //     style={{
              //       flexDirection: "row",
              //       alignItems: "center",
              //       alignContent: "center",
              //     }}
              //   >
              //     <Image
              //       source={
              //         value && value.picture
              //           ? { uri: value.picture }
              //           : default_image
              //       }
              //       style={{
              //         resizeMode: "cover",
              //         height: 50,
              //         width: 50,
              //         borderRadius: 25,
              //       }}
              //     />

              //     <View
              //       style={{
              //         marginLeft: 20,
              //         width: Dimensions.get("screen").width * 0.46,
              //       }}
              //     >
              //       <Text size="description" type="bold">
              //         {value?.first_name} {value?.last_name}
              //       </Text>

              //       <Text size="description" type="regular">
              //         {"@" + value.username}
              //       </Text>
              //       {value?.bio ? (
              //         <Text size="description" type="regular">
              //           <Truncate
              //             text={value?.bio ? value?.bio : ""}
              //             length={30}
              //           />
              //         </Text>
              //       ) : null}
              //     </View>
              //   </View>
              //   <Button
              //     text=""
              //     size="small"
              //     color="primary"
              //     type="circle"
              //     disabled
              //     style={{
              //       width: 80,
              //       height: 30,
              //     }}
              //   >
              //     <WhiteCheck width={20} height={20} />
              //   </Button>
              // </View>
            } else {
              return (
                <View
                  style={{
                    flexDirection: "row",
                    width: Dimensions.get("screen").width,
                    borderBottomWidth: 1,
                    borderBottomColor: "#F6F6F6",
                    paddingHorizontal: 20,
                    paddingVertical: 20,
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

                    <View
                      style={{
                        marginLeft: 20,
                        width: Dimensions.get("screen").width * 0.46,
                      }}
                    >
                      <Text size="description" type="bold">
                        {value?.first_name} {value?.last_name}
                      </Text>

                      <Text size="description" type="regular">
                        {"@" + value.username}
                      </Text>
                      {value?.bio ? (
                        <Text size="description" type="regular">
                          <Truncate
                            text={value?.bio ? value?.bio : ""}
                            length={30}
                          />
                        </Text>
                      ) : null}
                    </View>
                  </View>
                  <Button
                    text=""
                    size="small"
                    color="primary"
                    type="circle"
                    onPress={() => AddtoBuddy(value)}
                    // disabled
                    style={{
                      width: 80,
                      height: 30,
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
                  borderBottomWidth: 1,
                  borderBottomColor: "#F6F6F6",
                  paddingHorizontal: 20,
                  paddingVertical: 20,
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

                  <View
                    style={{
                      marginLeft: 20,
                      width: Dimensions.get("screen").width * 0.46,
                    }}
                  >
                    <Text size="description" type="bold">
                      {value?.first_name} {value?.last_name}
                    </Text>

                    <Text size="description" type="regular">
                      {"@" + value.username}
                    </Text>
                    {value?.bio ? (
                      <Text size="description" type="regular">
                        <Truncate
                          text={value?.bio ? value?.bio : ""}
                          length={30}
                        />
                      </Text>
                    ) : null}
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
                    width: 80,
                    height: 30,
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
        backgroundColor: "#FFFFFF",
      }}
    >
      <Loading show={loading} />

      <View
        style={{
          paddingTop: 15,
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
              backgroundColor: "#F6F6F6",
              borderRadius: 5,
              width: "100%",
              height: 35,
              paddingHorizontal: 15,

              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View>
              <Search width={15} height={15} />
            </View>

            <TextInput
              underlineColorAndroid="transparent"
              placeholder={t("search")}
              style={{
                width: "88%",
                fontFamily: "Lato-Regular",
                marginLeft: 5,
                fontSize: 14,
                color: "#464646",
              }}
              value={search}
              onChangeText={(text) => _setSearch(text)}
            />
            {search !== null ? (
              <TouchableOpacity onPress={() => setSearch(null)}>
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
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
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
          backgroundColor: "#FFFFFF",
          paddingVertical: 10,
          borderTopWidth: 1.5,
          borderColor: "#f6f6f6",
          shadowColor: "#FFFFFF",
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
          color={dataNew.length > 0 ? "primary" : "disabled"}
          type="box"
          onPress={() => (dataNew.length > 0 ? _save() : null)}
          style={{
            width: Dimensions.get("window").width - 40,
          }}
        ></Button>
      </View>
    </View>
  );
}
