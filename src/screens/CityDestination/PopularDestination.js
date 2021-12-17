import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  FlatList,
  Alert,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Animated,
} from "react-native";
import Modal from "react-native-modal";
import {
  Search,
  Filternewbiru,
  Xhitam,
  Bottom,
  Above,
  Arrowbackios,
  Xblue,
} from "../../assets/svg";
import { default_image } from "../../assets/png";
import Continent from "../../graphQL/Query/Countries/Continent";
import RegionList_v2 from "../../graphQL/Query/Countries/PopularDestination";
import { useTranslation } from "react-i18next";
import { useLazyQuery } from "@apollo/react-hooks";
import CheckBox from "@react-native-community/checkbox";
import Fillter from "./Fillter/index";
import { Arrowbackwhite, OptionsVertWhite } from "../../assets/svg";
import {
  Button,
  Text,
  Truncate,
  Capital,
  FunImageBackground,
  FunImage,
} from "../../component";
import normalize from "react-native-normalize";

export default function AllDestination(props) {
  const { t } = useTranslation();
  const token = props.route.params.token;
  const scrollY = useRef(new Animated.Value(1));

  const HeaderComponent = {
    headerShown: true,
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: (
      <Text size="header" type="bold" style={{ color: "#fff" }}>
        {t("popularDestination")}
      </Text>
    ),
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
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
        {Platform.OS == "ios" ? (
          <Arrowbackios height={15} width={15}></Arrowbackios>
        ) : (
          <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
        )}
      </Button>
    ),
  };

  let [selected] = useState(new Map());
  let [search, setSearch] = useState({
    type: null,
    keyword: null,
  });

  const [dataResult, setDataResult] = useState([]);
  const [show, setShow] = useState(false);

  const [GetRegionList, { data, loading, error }] = useLazyQuery(
    RegionList_v2,
    {
      fetchPolicy: "network-only",
      variables: {
        keyword: search.keyword ? search.keyword : "",
        type: search.type ? search.type : null,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      onCompleted: () => {
        setDataResult(data);
      },
    }
  );

  //Filter Region
  const [filterRegion, setFilterRegion] = useState([]);

  const searchRegion = async (input) => {
    let search = new RegExp(input, "i");
    let result = filterRegion.filter((item) => search.test(item.name));
    setRegionName(result);
  };

  const clearSearchRegion = async (input) => {
    let search = new RegExp(input, "i");
    let result = filterRegion.filter((item) => search.test(item.name));
    setRegionName(result);
  };

  //Filter Search City
  const searchCity = async (input) => {
    let data = { ...search };
    data["keyword"] = input;
    setSearch(data);
  };

  const [regionName, setRegionName] = useState([]);
  const [region, setRegion] = useState("");

  const ClearAllFilter = () => {
    let temp = [...regionName];
    let tempData = [];
    for (var x of temp) {
      let data = { ...x };
      data.checked = false;
      tempData.push(data);
    }
    setRegionName(tempData);

    let dataSearch = {
      type: null,
      keyword: "",
    };
    setSearch(dataSearch);
    setShow(false);
  };

  //Handle Checkbox
  const handleCheck = (id, item, index) => {
    let temp = [...filterRegion];
    let selected = { ...item };
    selected.checked = !selected.checked;
    let idx = temp.findIndex((key) => key.id === id);
    temp.splice(idx, 1, selected);
    setFilterRegion(temp);
    setRegionName(temp);
  };

  //Handle Update Filter
  const UpdateFilter = async () => {
    let result = [];
    for (let data of regionName) {
      if (data.checked === true) {
        result.push(data.id);
      }
    }

    let filterResult = { ...search };
    filterResult["type"] = result;

    await setSearch(filterResult);
    await setShow(false);
    await GetRegionList();
  };

  const [
    GetContinent,
    { data: dataFillter, loading: loadingcat, error: errorcat },
  ] = useLazyQuery(Continent, {
    fetchPolicy: "network-only",
    onCompleted: () => {
      setRegionName(dataFillter.continent_type);
      setFilterRegion(dataFillter.continent_type);
    },
  });

  const rupiah = (nilai) => {
    let number_string = typeof nilai == "number" ? nilai.toString() : nilai,
      sisa = number_string.length % 3,
      jumlah = number_string.substr(0, sisa),
      ribuan = number_string.substr(sisa).match(/\d{3}/g);

    if (ribuan) {
      let separator = sisa ? "." : "";
      jumlah += separator + ribuan.join(".");
    }

    return jumlah;
  };

  const cekData = () => {
    return search["type"]?.length;
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    GetRegionList();
    GetContinent();
  }, []);
  let [showcity, setShowCity] = useState(null);

  // render list
  const RenderList = ({ item }) => {
    let sumdestination = item.count_destination;

    console.log("item", item);
    return item && item.city.length > 0 ? (
      <View
        style={{
          backgroundColor: "#FFF",
          marginVertical: 5,
          borderRadius: 10,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3.62,

          elevation: 4,
          width: Dimensions.get("screen").width - 20,
        }}
      >
        {item ? (
          <View
            style={{
              flex: 1,
            }}
          >
            {/* <TouchableOpacity
              onPress={() =>
                props.navigation.navigate("CountryStack", {
                  screen: "Country",
                  params: {
                    data: item,
                    exParam: true,
                  },
                })
              }
            > */}
            <View
              style={{
                backgroundColor: "#FFF",
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
                flexDirection: "row",
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  props.navigation.navigate("CountryStack", {
                    screen: "Country",
                    params: {
                      data: item,
                      exParam: true,
                    },
                  })
                }
              >
                <FunImage
                  source={
                    item.image.image ? { uri: item.image.image } : default_image
                  }
                  style={{
                    width: (Dimensions.get("window").width - 270) / 2,
                    height: (Dimensions.get("window").width - 270) / 2,
                    borderRadius: 5,
                    marginHorizontal: 10,
                    marginVertical: 10,
                  }}
                  imageStyle={[
                    styles.Image,
                    {
                      width: (Dimensions.get("window").width - 270) / 2,
                      height: (Dimensions.get("window").width - 270) / 2,
                      borderRadius: 5,
                      marginHorizontal: 10,
                      marginVertical: 10,
                    },
                  ]}
                />
              </TouchableOpacity>

              <View
                style={{
                  width: "70%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginLeft: 10,
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    props.navigation.navigate("CountryStack", {
                      screen: "Country",
                      params: {
                        data: item,
                        exParam: true,
                      },
                    })
                  }
                  style={{
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      size={"title"}
                      type={"bold"}
                      style={{
                        fontSize: 20,
                        color: "#209FAE",
                      }}
                    >
                      {item.name}
                    </Text>
                    <Text
                      size={"label"}
                      type={"regular"}
                      style={{ marginTop: 5 }}
                    >
                      {sumdestination + " " + t("destination")}
                    </Text>
                  </View>
                </TouchableOpacity>
                <View
                  style={{
                    justifyContent: "center",
                  }}
                >
                  {showcity !== item.name ? (
                    <Pressable onPress={() => setShowCity(item.name)}>
                      <Bottom height={25} width={25} style={{ marginTop: 5 }} />
                    </Pressable>
                  ) : (
                    <Pressable
                      onPress={() =>
                        setShowCity(item.name == showcity ? null : item.name)
                      }
                    >
                      <Above height={25} width={25} style={{ marginTop: 5 }} />
                    </Pressable>
                  )}
                </View>
              </View>
            </View>
            {/* </TouchableOpacity> */}
          </View>
        ) : null}
        <View
          style={{
            marginVertical: showcity == item.name ? 10 : 0,
          }}
        >
          {item.name == showcity && item.city.length
            ? item.city.map((value, i) => {
                return (
                  <View
                    style={{
                      backgroundColor: "#F6F6F6",
                      marginLeft: 10,
                      width: Dimensions.get("window").width - 40,
                    }}
                  >
                    <TouchableOpacity
                      key={i + item.name}
                      onPress={() => {
                        if (value.type == "province") {
                          props.navigation.navigate("CountryStack", {
                            screen: "Province",
                            params: {
                              data: value,
                              exParam: true,
                            },
                          });
                        } else {
                          props.navigation.navigate("CountryStack", {
                            screen: "CityDetail",
                            params: {
                              data: {
                                city_id: value.id,
                                city_name: value.name,
                                latitude: value.latitude,
                                longitude: value.longitude,
                              },
                              exParam: true,
                            },
                          });
                        }
                      }}
                      style={{
                        height: Dimensions.get("window").width * 0.24,
                        width: Dimensions.get("window").width - 20,

                        flex: 1,

                        flexDirection: "row",
                      }}
                    >
                      <View
                        style={{
                          justifyContent: "center",
                        }}
                      >
                        <FunImage
                          key={value.id}
                          source={
                            value.cover ? { uri: value.cover } : default_image
                          }
                          style={{
                            width: (Dimensions.get("window").width - 270) / 2,
                            height: (Dimensions.get("window").width - 270) / 2,
                            borderRadius: 5,
                            marginHorizontal: 10,
                            marginVertical: 10,
                          }}
                          imageStyle={[
                            styles.Image,
                            {
                              width: (Dimensions.get("window").width - 270) / 2,
                              height:
                                (Dimensions.get("window").width - 270) / 2,
                              borderRadius: 5,
                              marginHorizontal: 10,
                              marginVertical: 10,
                            },
                          ]}
                        ></FunImage>
                      </View>

                      <View
                        style={{
                          justifyContent: "center",
                          width: "70%",
                          paddingVertical: 5,

                          paddingHorizontal: 10,
                        }}
                      >
                        <Text
                          type="bold"
                          size="title"
                          style={{ color: "#209FAE" }}
                        >
                          <Truncate
                            text={Capital({
                              text: value.name,
                            })}
                            length={20}
                          />
                        </Text>
                        <Text
                          type="regular"
                          size="label"
                          style={{ marginTop: 5 }}
                        >
                          {value.description_type}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <View
                      style={{
                        borderBottomColor: "#dedede",
                        borderBottomWidth: 1,
                        marginHorizontal: 15,
                      }}
                    />
                  </View>
                );
              })
            : null}
        </View>
      </View>
    ) : null;
  };

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <View
        onLayout={(event) => {
          var { x, y, width, height } = event.nativeEvent.layout;
          // setHeight(height);
        }}
        style={{
          alignContent: "center",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 15,

          backgroundColor: "#FFFFFF",

          height: 50,
          zIndex: 5,
          flexDirection: "row",
          width: Dimensions.get("screen").width,
        }}
      >
        <Pressable
          onPress={() => {
            setShow(true);
          }}
          style={{
            borderWidth: 1,
            borderColor: "#209fae",
            height: 35,
            borderRadius: 2,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Filternewbiru
            width={18}
            height={18}
            style={{ marginHorizontal: 7 }}
          />
          {cekData() > 0 ? (
            <View
              style={{
                backgroundColor: "#209fae",
                borderRadius: 2,
                marginRight: 7,
              }}
            >
              <Text
                size="label"
                type="regular"
                style={{
                  paddingHorizontal: 5,
                  color: "#fff",
                }}
              >
                {cekData()}
              </Text>
            </View>
          ) : null}
        </Pressable>
        <View
          style={{
            backgroundColor: "#f6f6f6",
            borderRadius: 2,
            flex: 1,
            paddingHorizontal: 10,
            marginLeft: 7,
            flexDirection: "row",
            alignItems: "center",
            alignContent: "center",
            height: 35,

            borderWidth: 1,
            borderColor: "#e8e8e8",
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
            returnKeyType="search"
            value={search["keyword"]}
            onChangeText={(x) => {
              searchCity(x);
              setSearch({ ...search, ["keyword"]: x });
            }}
            onSubmitEditing={(x) => {
              searchCity(x);
              setSearch({ ...search, ["keyword"]: x });
            }}
          />
          {search["keyword"] !== null ? (
            <TouchableOpacity
              onPress={() => {
                searchCity("");
                setSearch({ ...search, ["keyword"]: null });
              }}
            >
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
      {/* modal filter */}
      <Modal
        isVisible={show}
        onBackdropPress={() => {
          setShow(false);
        }}
        onRequestClose={() => setShow(false)}
        onDismiss={() => setShow(false)}
        style={{
          justifyContent: "flex-end",
          margin: 0,
        }}
      >
        <View
          style={{
            flexDirection: "column",
            height: Dimensions.get("screen").height * 0.6,
            width: Dimensions.get("screen").width,
            backgroundColor: "white",
            // borderTopWidth: 1,
            borderTopRightRadius: 15,
            borderTopLeftRadius: 15,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              paddingHorizontal: 15,
              paddingVertical: 15,
              borderBottomWidth: 1,
              borderBottomColor: "#d1d1d1",
            }}
          >
            <Text
              type="bold"
              size="title"
              style={{
                color: "#464646",
              }}
            >
              Filter
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: "white",
                height: 20,
                width: 32,
                justifyContent: "flex-end",
                alignContent: "flex-end",
                alignItems: "flex-start",
              }}
              onPress={() => setShow(false)}
            >
              <Xhitam height={12} width={12} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              flex: 1,
              borderTopWidth: 0.5,
              borderColor: "#d1d1d1",
            }}
          >
            <View
              style={{
                width: "35%",
                borderRightWidth: 0.5,
                borderColor: "#d1d1d1",
              }}
            >
              <View
                style={{
                  backgroundColor: "#f6f6f6",
                  paddingBottom: 5,
                }}
              >
                <View
                  style={{
                    borderLeftColor: "#209fae",
                    borderLeftWidth: 5,
                    marginLeft: 5,
                    justifyContent: "center",
                    paddingVertical: 15,
                    paddingHorizontal: 10,
                    backgroundColor: "#ffff",
                  }}
                >
                  <Text
                    type="bold"
                    size="title"
                    style={{
                      // fontSize: 20,
                      // fontFamily: "Lato-Bold",
                      color: "#464646",
                      // marginTop: 10,
                    }}
                  >
                    {t("region")}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ padding: 15 }}>
                <View
                  style={{
                    height: 35,
                    backgroundColor: "#f6f6f6",
                    borderRadius: 2,
                    alignItems: "center",
                    flexDirection: "row",
                    paddingHorizontal: 10,
                    borderWidth: 1,
                    borderColor: "#e8e8e8",
                  }}
                >
                  <Search width={15} height={15} style={{ marginRight: 5 }} />

                  <TextInput
                    underlineColorAndroid="transparent"
                    placeholder={t("search")}
                    autoCorrect={false}
                    enablesReturnKeyAutomatically={true}
                    underlineColorAndroid="transparent"
                    style={{
                      width: "85%",
                      // borderWidth: 1,
                      marginLeft: 5,
                      padding: 0,
                    }}
                    // returnKeyType="search"
                    placeholderTextColor="#464646"
                    value={region}
                    onChangeText={(x) => {
                      searchRegion(x);
                      setRegion(x);
                    }}
                    onSubmitEditing={(x) => {
                      searchRegion(x);
                      setRegion(x);
                    }}
                  />
                  {region.length !== 0 ? (
                    <TouchableOpacity
                      onPress={() => {
                        searchRegion("");
                        setRegion("");
                      }}
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
              <ScrollView
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingHorizontal: 15,
                }}
              >
                {regionName.map((item, index) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => handleCheck(item["id"], item, index)}
                    style={{
                      flexDirection: "row",
                      backgroundColor: "white",
                      width: "49%",
                      marginRight: 3,
                      marginBottom: 20,
                      justifyContent: "flex-start",
                      alignContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <CheckBox
                      onCheckColor="#FFF"
                      lineWidth={1}
                      onFillColor="#209FAE"
                      onTintColor="#209FAE"
                      boxType={"square"}
                      style={{
                        alignSelf: "center",
                        width: Platform.select({
                          ios: 30,
                          android: 35,
                        }),
                        transform: Platform.select({
                          ios: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
                          android: [{ scaleX: 1.3 }, { scaleY: 1.3 }],
                        }),
                      }}
                      // onValueChange={() => handleCheck(item["id"], item)}
                      onValueChange={() =>
                        Platform.OS == "ios"
                          ? null
                          : handleCheck(item["id"], item, index)
                      }
                      value={item["checked"]}
                    />

                    <Text
                      size="label"
                      type="regular"
                      style={{
                        marginLeft: 0,
                        marginRight: -10,
                        color: "#464646",
                        marginTop: Platform.OS == "ios" ? -5 : -2,
                        // borderWidth: 5,
                      }}
                    >
                      {item["name"]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              zIndex: 6,
              flexDirection: "row",
              height: 80,
              position: "absolute",
              bottom: 0,
              justifyContent: "space-around",
              alignContent: "center",
              alignItems: "center",
              backgroundColor: "#ffffff",
              width: Dimensions.get("screen").width,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              padding: 10,
              paddingHorizontal: 10,
            }}
          >
            <Button
              variant="bordered"
              color="secondary"
              onPress={() => ClearAllFilter()}
              style={{ width: "30%", borderColor: "#ffff" }}
              text={t("clearAll")}
            ></Button>
            <Button
              onPress={() => UpdateFilter()}
              style={{ width: "65%" }}
              text={t("apply")}
            ></Button>
          </View>
        </View>
      </Modal>

      <FlatList
        contentContainerStyle={{
          justifyContent: "space-evenly",
          paddingStart: 10,
          paddingBottom: Platform.OS === "ios" ? 0 : 60,
        }}
        horizontal={false}
        data={dataResult ? dataResult.populer_city_destination_v2 : null}
        renderItem={({ item, index }) => <RenderList item={item} />}
        showsHorizontalScrollIndicator={false}
        extraData={selected}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  ImageView: {
    height: Dimensions.get("window").width * 0.47 - 16,

    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    overflow: "hidden",

    backgroundColor: "rgba(20,20,20,0.4)",
  },
  Image: {
    resizeMode: "cover",
    height: Dimensions.get("window").width * 0.47 - 16,
    borderRadius: 5,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    overflow: "hidden",
  },
  destinationMainImageContainer: {
    width: "100%",
    height: 150,
    borderRadius: 10,
  },
  destinationMainImage: {
    resizeMode: "cover",
    borderRadius: 10,
    backgroundColor: "black",
  },
  destinationImageView: {
    width: (Dimensions.get("window").width - 37) / 3,
    height: (Dimensions.get("window").width - 37) / 3,
    marginRight: 5,
    borderRadius: 10,
  },
  destinationImage: {
    resizeMode: "cover",
    borderRadius: 10,
  },
});
