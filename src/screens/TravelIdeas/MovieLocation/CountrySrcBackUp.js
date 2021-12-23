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
import {
  Arrowbackwhite,
  IdFlag,
  Check,
  Search,
  Arrowbackios,
  Filternewbiru,
  Xblue,
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
      setDatacontinent(datacontinent?.continent_list);
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

  const [continent, setContinent] = useState("");
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

    setDatacontinent(tempData);
    setContinentSelected(null);
    setfilterResults([]);
    setmodalFilter(false);
  };

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

              borderBottomWidth: 1,
              borderBottomColor: "#d1d1d1",
            }}
          >
            <View
              style={{
                alignContent: "center",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 15,
                marginVertical: 5,
                // borderWidth: 1,
                height: 50,
                zIndex: 5,
                flexDirection: "row",
                width: Dimensions.get("screen").width,
              }}
            >
              <Pressable
                onPress={() => {
                  setmodalFilter(true);
                  _handleCheckonModal();
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
                {filterResults.length > 0 ? (
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
                      {filterResults.length}
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
                <Search width={15} height={15} />

                <TextInput
                  underlineColorAndroid="transparent"
                  // placeholder={t("search")}
                  placeholder={t("country")}
                  style={{
                    width: "88%",
                    // borderWidth: 1,
                    marginLeft: 5,
                    padding: 0,
                  }}
                  returnKeyType="search"
                  placeholderTextColor="#464646"
                  value={keyword}
                  onChangeText={(x) => setKeyword(x)}
                  onSubmitEditing={(x) => setKeyword(x)}
                />
                {keyword.length !== 0 ? (
                  <TouchableOpacity
                    onPress={() => {
                      setKeyword("");
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
          </View>
          <FlatList
            ref={slider}
            data={list_country_src_movie}
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
                          borderWidth: 1,
                          borderColor: "#d1d1d1",
                          backgroundColor: "black",
                          alignSelf: "center",
                          alignContent: "center",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                          // width: 35,
                          // height: 25,
                          // paddingTop: 0,
                        }}
                      >
                        <FunIcon icon={item.flag} width={37} height={25} />
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
                    style={{
                      width: "85%",
                      // borderWidth: 1,
                      marginLeft: 5,
                      padding: 0,
                    }}
                    returnKeyType="search"
                    placeholderTextColor="#464646"
                    value={continent}
                    onChangeText={(x) => {
                      searchContinent(x);
                      setContinent(x);
                    }}
                    onSubmitEditing={(x) => {
                      searchContinent(x);
                      setContinent(x);
                    }}
                  />
                  {continent.length !== 0 ? (
                    <TouchableOpacity
                      onPress={() => {
                        searchContinent("");
                        setContinent("");
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
                {continent_list &&
                  continent_list.map((item, index) => (
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
