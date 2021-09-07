import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Dimensions,
  FlatList,
  Alert,
  Platform,
  TextInput,
  Pressable,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Arrowbackwhite,
  IdFlag,
  Check,
  Search,
  Arrowbackios,
  Filternewbiru,
} from "../../../assets/svg";
import { close } from "../../../assets/png";
import CheckBox from "@react-native-community/checkbox";
import Modal from "react-native-modal";
import {
  Text,
  Button,
  FunIcon,
  CustomImage,
  StatusBar as StaBar,
} from "../../../component";
import Ripple from "react-native-material-ripple";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "@apollo/react-hooks";
import CountryListSrcMovie from "../../../graphQL/Query/Countries/CountryListSrcMovie";
import ContinentList from "../../../graphQL/Query/Countries/ContinentList";
import DeviceInfo from "react-native-device-info";
const Notch = DeviceInfo.hasNotch();

const SafeStatusBar = Platform.select({
  ios: Notch ? -50 : -20,
  android: -55,
});

const HeightBar = Platform.select({
  ios: Notch ? 95 : 70,
  android: 60,
});
export default function CountrySrc({
  selectedCountry,
  SetselectedCountry,
  modalshown,
  setModelCountry,
}) {
  const { t } = useTranslation();
  let [datacountry, setdataCountry] = useState(data);
  let [select_continent, setContinentSelected] = useState();
  let [keyword, setKeyword] = useState("");
  let [modalFilter, setmodalFilter] = useState(false);
  let [filterResults, setfilterResults] = useState([]);
  let slider = useRef();
  let [continent_list, setDatacontinent] = useState([]);
  let [continentsearch, setcontinentSearch] = useState("");
  const {
    data: datacontinent,
    loading: loadingcontinent,
    error: errorcontinent,
    refetch: refetchcontinent,
  } = useQuery(ContinentList, {
    variables: {
      keyword: continentsearch ? continentsearch : null,
    },
    onCompleted: () => {
      setDatacontinent(datacontinent.continent_list);
    },
  });

  const { data, loading, error, refetch } = useQuery(CountryListSrcMovie, {
    variables: {
      continent_id: select_continent ? select_continent : null,
      keyword: keyword,
    },
  });

  let list_country_src_movie = [];
  if (data && data.list_country_src_movie) {
    list_country_src_movie = data.list_country_src_movie;
  }

  const hasil = async (detail) => {
    setModelCountry(false);
    SetselectedCountry({
      id: detail.id,
      name: detail.name,
    });
  };

  const [filterContinent, setfilterContinent] = useState([]);
  const _handleCheck = async (id, index, item) => {
    let tempe = [...continent_list];
    let items = { ...item };
    items.checked = !items.checked;
    let inde = tempe.findIndex((key) => key.id === id);
    tempe.splice(inde, 1, items);
    await setfilterContinent(tempe);
    await setDatacontinent(tempe);
  };

  const _handleCheckonModal = async () => {
    await setfilterContinent(continent_list);
  };

  // filter oke
  const UpdateFilter = async () => {
    let hasil = [];
    for (var x of continent_list) {
      if (x.checked === true) {
        hasil.push(x.id);
      }
    }
    await setContinentSelected(hasil);
    await setfilterResults(hasil);
    await setmodalFilter(false);
  };

  const searchContinent = async (input) => {
    let search = new RegExp(input, "i");
    let result = filterContinent.filter((item) => search.test(item.name));
    setDatacontinent(result);
  };

  const ClearAllFilter = () => {
    let temp = [...continent_list];
    let tempData = [];
    for (var x of temp) {
      let data = { ...x };
      data.checked = false;
      tempData.push(data);
    }
    // setfilterContinent([]);
    setDatacontinent(tempData);
    setContinentSelected(null);
    setfilterResults([]);
    setmodalFilter(false);
  };

  // useEffect(() => {}, []);

  return (
    <Modal
      onRequestClose={() => {
        setModelCountry(false);
      }}
      animationIn="slideInRight"
      animationOut="slideOutRight"
      isVisible={modalshown}
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        alignSelf: "center",
        alignContent: "center",
      }}
    >
      <View
        style={{
          flex: 1,
          width: Dimensions.get("screen").width,
          height: Dimensions.get("screen").height,
        }}
      >
        <StaBar backgroundColor="#14646e" barStyle="light-content" />
        <View
          style={{
            flexDirection: "row",
            alignSelf: "flex-start",
            alignItems: "flex-end",
            alignContent: "flex-end",
            backgroundColor: "#209fae",
            height: HeightBar,
            width: Dimensions.get("screen").width,
            marginTop: SafeStatusBar,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Button
              type="circle"
              color="tertiary"
              size="large"
              variant="transparent"
              onPress={() => setModelCountry(false)}
            >
              {Platform.OS == "ios" ? (
                <Arrowbackios height={15} width={15}></Arrowbackios>
              ) : (
                <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
              )}
            </Button>
            <Text
              size="label"
              style={{
                color: "white",
                fontSize: 18,
                fontFamily: "Lato-Bold",
              }}
            >
              {t("country")}
            </Text>
          </View>
        </View>

        <View
          style={{
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height - 55,
            backgroundColor: "white",
          }}
        >
          <View
            style={{
              width: Dimensions.get("screen").width,
              backgroundColor: "white",

              shadowColor: "#d3d3d3",
              shadowOffset: {
                width: 2,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 1,
              elevation: 3,
            }}
          >
            <View
              style={{
                alignContent: "center",
                alignItems: "center",
                paddingHorizontal: 10,
                height: 50,
                justifyContent: "space-between",
                flexDirection: "row",
                width: Dimensions.get("screen").width,
              }}
            >
              <Button
                size="small"
                type="icon"
                variant="bordered"
                color="primary"
                onPress={() => {
                  setmodalFilter(true);
                  _handleCheckonModal();
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
                {filterResults.length > 0 ? (
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
                        // alignSelf: "center",
                      }}
                    >
                      {filterResults.length}
                    </Text>
                  </View>
                ) : null}
              </Button>

              <View
                style={{
                  backgroundColor: "#F0F0F0",
                  borderRadius: 5,
                  flex: 1,
                  paddingHorizontal: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  alignContent: "center",
                  height: 35,
                }}
              >
                <View
                  style={{
                    marginHorizontal: 5,
                  }}
                >
                  <Search width={15} height={15} />
                </View>

                <TextInput
                  underlineColorAndroid="transparent"
                  // placeholder={t("search")}
                  placeholder={t("country")}
                  style={{
                    width: "100%",
                    // borderWidth: 1,
                    padding: 0,
                  }}
                  returnKeyType="search"
                  value={keyword}
                  onChangeText={(x) => setKeyword(x)}
                  onSubmitEditing={(x) => setKeyword(x)}
                />
              </View>
            </View>
          </View>
          <FlatList
            ref={slider}
            data={list_country_src_movie}
            contentContainerStyle={{
              paddingTop: 10,
            }}
            renderItem={({ item }) => {
              return (
                <Pressable
                  onPress={() => hasil(item)}
                  style={({ pressed }) => [
                    {
                      paddingVertical: 15,
                      paddingHorizontal: 20,
                      borderBottomWidth: 0.5,
                      borderBottomColor: "#D1D1D1",
                      flexDirection: "row",
                      alignContent: "center",
                      alignItems: "center",
                      justifyContent: "space-between",
                      backgroundColor: pressed ? "#F6F6F7" : "white",
                    },
                  ]}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        marginRight: 15,
                        elevation: 1,
                      }}
                    >
                      <View
                        style={{
                          height: 30,
                          width: 42,
                          // borderWidth: 1,
                        }}
                      >
                        <FunIcon
                          icon={item.flag}
                          height={30}
                          width={42}
                          style={{}}
                          variant="f"
                        />
                      </View>
                    </View>
                    <Text size="description">{item.name}</Text>
                  </View>
                  <View>
                    {item.id == selectedCountry.id ? (
                      <Check width={20} height={15} />
                    ) : null}
                  </View>
                </Pressable>
              );
            }}
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>
      {/* modal filter continent */}
      <Modal
        onBackdropPress={() => {
          setmodalFilter(false);
        }}
        onRequestClose={() => setmodalFilter(false)}
        onDismiss={() => setmodalFilter(false)}
        isVisible={modalFilter}
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
            borderTopRightRadius: 15,
            borderTopLeftRadius: 15,
            backgroundColor: "white",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              paddingHorizontal: 15,
              paddingTop: 15,
              paddingBottom: 15,
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
                position: "absolute",
                backgroundColor: "with",
                height: 35,
                width: 32,
                top: 0,
                right: 0,
                justifyContent: "flex-end",
                alignContent: "flex-end",
                alignItems: "flex-start",
              }}
              onPress={() => {
                setmodalFilter(false);
              }}
            >
              <CustomImage
                customStyle={{
                  height: 13,
                  width: 13,
                  alignSelf: "flex-start",
                }}
                customImageStyle={{ resizeMode: "contain" }}
                source={close}
              />
            </TouchableOpacity>
          </View>
          {/* garis bottom */}
          <View
            style={{
              borderBottomColor: "#D1D1D1",
              borderBottomWidth: 1,
            }}
          />
          <View
            style={{
              flexDirection: "row",
              flex: 1,
              borderTopWidth: 0.5,
              borderColor: "#d1d1d1",
            }}
          >
            {/* kiri filter */}
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
                      color: "#464646",
                    }}
                  >
                    {t("region")}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <View
                style={{
                  padding: 15,
                }}
              >
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
                    returnKeyType="search"
                    onChangeText={(x) => searchContinent(x)}
                    onSubmitEditing={(x) => searchContinent(x)}
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
                {continent_list.map((item, index) => (
                  <TouchableOpacity
                    onPress={() => _handleCheck(item["id"], index, item)}
                    style={{
                      flexDirection: "row",
                      backgroundColor: "white",
                      // borderColor: "#464646",

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
                      onValueChange={() =>
                        Platform.OS == "ios"
                          ? null
                          : _handleCheck(item["id"], index, item)
                      }
                      value={item["checked"]}
                    />

                    <Text
                      size="label"
                      type="regular"
                      style={{
                        marginLeft: 0,
                        color: "#464646",

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
    </Modal>
  );
}
