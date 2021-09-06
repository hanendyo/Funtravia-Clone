import React, { useState, useEffect, useCallback } from "react";
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
} from "react-native";
import Modal from "react-native-modal";
import { Search, Filternewbiru, Xhitam } from "../../assets/svg";
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

export default function AllDestination(props) {
  const { t } = useTranslation();

  const HeaderComponent = {
    headerShown: true,
    title: "Popular Destination",
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: t("popularDestination"),
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      fontFamily: "Lato-Bold",
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
        Authorization: `Bearer ${token}`,
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

  //Filter Search City
  const searchCity = async (input) => {
    let data = { ...search };
    data["keyword"] = input;
    setSearch(data);
  };

  const [regionName, setRegionName] = useState([]);

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
      keyword: null,
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

  const RenderList = ({ item }) => {
    return item && item.city.length > 0 ? (
      <View>
        {item ? (
          <View
            style={{
              flex: 1,
            }}
          >
            <TouchableOpacity
              style={{
                height: Dimensions.get("window").width * 0.29,
              }}
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
              <ImageBackground
                source={item.cover ? { uri: item.cover } : default_image}
                style={{
                  width: Dimensions.get("window").width - 20,
                  height: Dimensions.get("window").width * 0.29,
                }}
                imageStyle={[
                  styles.destinationMainImage,
                  {
                    height: Dimensions.get("window").width * 0.29,
                  },
                ]}
              >
                <View
                  style={[
                    styles.destinationMainImageContainer,
                    {
                      height: Dimensions.get("window").width * 0.29,

                      flexDirection: "row",
                      alignItems: "center",
                      alignContent: "center",
                      justifyContent: "center",
                      flexWrap: "wrap",
                    },
                  ]}
                >
                  <Text
                    style={{
                      alignSelf: "center",
                      color: "#ffffff",
                      zIndex: 2,
                      shadowRadius: 2,
                      shadowColor: "#000",
                      elevation: 5,
                      opacity: 1,
                      fontFamily: "Lato-Bold",
                      fontSize: 21,
                    }}
                  >
                    <Truncate text={Capital({ text: item.name })} length={10} />
                  </Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          </View>
        ) : null}
        <View
          style={{
            marginVertical: 10,
            borderBottomWidth: 1,
            borderColor: "#F0F0F0",
          }}
        >
          {item.city && item.city.length
            ? item.city.map((value, i) => {
                return (
                  <TouchableOpacity
                    key={i}
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
                      justifyContent: "space-between",
                      marginBottom: 10,
                    }}
                  >
                    <View
                      style={{
                        height: Dimensions.get("window").width * 0.24,

                        width: (Dimensions.get("window").width - 20) / 2,
                      }}
                    >
                      <FunImage
                        key={value.id}
                        source={
                          value.cover ? { uri: value.cover } : default_image
                        }
                        style={{
                          width: (Dimensions.get("window").width - 20) / 2,
                          height: Dimensions.get("window").width * 0.24,
                        }}
                        imageStyle={[
                          styles.Image,
                          {
                            width: (Dimensions.get("window").width - 20) / 2,
                            height: Dimensions.get("window").width * 0.24,
                          },
                        ]}
                      ></FunImage>
                    </View>
                    <View
                      style={{
                        width: (Dimensions.get("window").width - 20) / 2,
                        height: Dimensions.get("window").width * 0.24,

                        paddingVertical: 5,
                        paddingHorizontal: 10,
                      }}
                    >
                      <View>
                        <Text type="bold" size="title" style={{}}>
                          <Truncate
                            text={Capital({
                              text: value.name,
                            })}
                            length={20}
                          />
                        </Text>
                        <Text type="" size="label" style={{}}>
                          {rupiah(value.count_destination)} {t("destination")}
                        </Text>
                        <Text type="" size="label" style={{}}>
                          {rupiah(value.count_plan_tour)} {t("trip")}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
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
        backgroundColor: "white",
      }}
    >
      <View
        onLayout={(event) => {
          var { x, y, width, height } = event.nativeEvent.layout;
          // setHeight(height);
        }}
        style={{
          flexDirection: "row",
          zIndex: 5,
          paddingHorizontal: 15,
          paddingTop: 10,
          paddingBottom: 5,
          backgroundColor: "#fff",
          position: "absolute",
          top: 0,
        }}
      >
        <Button
          size="small"
          type="icon"
          variant="bordered"
          color="primary"
          onPress={() => {
            setShow(true);
          }}
          style={{
            marginRight: 5,
            borderRadius: 3,
            paddingHorizontal: 10,
            borderColor: "#209FAE",
            paddingBottom: 1,
          }}
        >
          <Filternewbiru width={18} height={18} />
          {cekData() > 0 ? (
            <View
              style={{
                backgroundColor: "#209fae",
                marginLeft: 10,
                width: 20,
                paddingHorizontal: 5,
                borderRadius: 2,
              }}
            >
              <Text
                style={{
                  fontFamily: "Lato-Regular",
                  color: "#ffff",
                  fontSize: 15,
                }}
              >
                {cekData()}
              </Text>
            </View>
          ) : null}
        </Button>
        <View
          style={{
            backgroundColor: "#F0F0F0",
            borderRadius: 3,
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            alignContent: "center",

            paddingHorizontal: 10,
          }}
        >
          <Search width={15} height={15} />

          <TextInput
            underlineColorAndroid="transparent"
            placeholder={t("search")}
            style={{
              width: "100%",
              // borderWidth: 1,
              marginLeft: 5,
              padding: 0,
            }}
            returnKeyType="search"
            onChangeText={(x) => searchCity(x)}
            onSubmitEditing={(x) => searchCity(x)}
          />
        </View>
      </View>

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
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              paddingHorizontal: 15,
              paddingVertical: 20,
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
              <Xhitam height={15} width={15} />
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
                    backgroundColor: "#daf0f2",
                    borderRadius: 5,
                    // flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    alignContent: "center",
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                  }}
                >
                  <Search width={15} height={15} />

                  <TextInput
                    underlineColorAndroid="transparent"
                    placeholder={t("search")}
                    style={{
                      width: "100%",
                      // borderWidth: 1,
                      marginLeft: 5,
                      padding: 0,
                    }}
                    // returnKeyType="search"
                    onChangeText={(x) => searchRegion(x)}
                    onSubmitEditing={(x) => searchRegion(x)}
                  />
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
          marginTop: 50,
          justifyContent: "space-evenly",
          paddingStart: 10,
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
