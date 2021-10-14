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
  Filternewbiru,
  Xhitam,
  Arrowbackios,
  Xblue,
} from "../../../assets/svg";
import Modal from "react-native-modal";
import { Text, Button, FunIcon } from "../../../component";
import Ripple from "react-native-material-ripple";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "@apollo/react-hooks";
import CountryListSrcUnesco from "../../../graphQL/Query/Countries/CountryListSrcUnesco";
import ContinentList from "../../../graphQL/Query/Countries/ContinentList";
import CheckBox from "@react-native-community/checkbox";
import { TemporaryDirectoryPath } from "react-native-fs";

export default function CountrySrc({
  selectedCountry,
  SetselectedCountry,
  modalshown,
  setModelCountry,
}) {
  const { t } = useTranslation();
  let [datacountry, setdataCountry] = useState(data);
  let [select_continent, setContinentSelected] = useState("");
  let [select_continents, setContinentSelecteds] = useState([]);
  let [keyword, setKeyword] = useState("");
  let slider = useRef();
  let [FilterContinent, setFilterContinent] = useState([]);
  let [continent_list, setDatacontinent] = useState([]);
  let [continent_listfilter, setDatacontinentfilter] = useState([]);
  // show filter
  let [show, setshow] = useState(false);

  const {
    data: datacontinent,
    loading: loadingcontinent,
    error: errorcontinent,
    refetch: refetchcontinent,
  } = useQuery(ContinentList, {
    variables: {
      keyword: "",
    },
    onCompleted: () => {
      continent_list = setDatacontinent(datacontinent.continent_list);
      setDatacontinentfilter(datacontinent.continent_list);
    },
  });

  const { data, loading, error, refetch } = useQuery(CountryListSrcUnesco, {
    variables: {
      continent_id: select_continents ? select_continents : null,
      keyword: keyword,
    },
  });

  let list_country_src_unesco = [];
  if (data && data.list_country_src_unesco) {
    list_country_src_unesco = data.list_country_src_unesco;
  }

  const hasil = async (detail) => {
    setModelCountry(false);
    SetselectedCountry({
      id: detail.id,
      name: detail.name,
    });
  };

  const selectedContinent = (item, select_continent) => {
    if (item.id == select_continent) {
      setContinentSelected("");
    } else {
      setContinentSelected(item.id);
    }
  };

  // cek data filter

  const cekData = (data) => {
    // let dat = continent_list.filter((k) => k.checked === true);
    return select_continents.length;
  };

  // set filter
  const [continent, setContinent] = useState("");
  const searchcontinentfilter = async (teks) => {
    let searching = new RegExp(teks, "i");
    let Continent = continent_list.filter((item) => searching.test(item.name));
    setDatacontinentfilter(Continent);
  };

  // checkbox handle

  const _handleCheck = async (id, index, item) => {
    let tempe = [...continent_listfilter];
    let items = { ...item };
    items.checked = !items.checked;
    let inde = tempe.findIndex((key) => key.id === id);
    tempe.splice(inde, 1, items);
    await setDatacontinentfilter(tempe);
    await setDatacontinent(tempe);

    // await setdataFilterCategoris(tempe);
  };

  // update filter handle
  const UpdateFilter = async () => {
    let idselected = [];
    let tempdatasfilter = [...continent_listfilter];
    for (var i in tempdatasfilter) {
      if (tempdatasfilter[i].checked == true) {
        tempdatasfilter[i].show = true;
        tempdatasfilter.push(tempdatasfilter[i]);
        idselected.push(tempdatasfilter[i].id);
      }
    }
    await setContinentSelecteds(idselected);
    await setshow(false);
  };

  const ClearAllFilter = () => {
    let tempe = [...continent_listfilter];
    let tempes = [];
    for (var x of tempe) {
      let data = { ...x };
      data.checked = false;
      data.show = false;
      tempes.push(data);
    }

    // let tempdatascountry = [...dataFilterCountry];
    // for (var i in tempdatascountry) {
    //   tempdatascountry[i].checked = false;
    //   tempdatascountry[i].show = false;
    // }
    setshow(false);
    setContinentSelecteds([]);
    setDatacontinent([]);
    setDatacontinentfilter(tempes);
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
        <View
          style={{
            flexDirection: "row",
            alignSelf: "flex-start",
            alignItems: "center",
            alignContent: "center",
            backgroundColor: "#209fae",
            height: 55,
            width: Dimensions.get("screen").width,
            marginTop: Platform.OS === "ios" ? 20 : -20,
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
            size="title"
            type="bold"
            style={{
              color: "white",
            }}
          >
            {t("country")}
          </Text>
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
              paddingBottom: 20,
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
                flexDirection: "row",
                paddingHorizontal: 15,
                paddingVertical: 10,
                backgroundColor: "#fff",
              }}
            >
              <Button
                size="small"
                type="icon"
                variant="bordered"
                color="primary"
                onPress={() => {
                  setshow(true);
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
                        // alignSelf: "center",
                      }}
                    >
                      {cekData(continent_list)}
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
                    width: "85%",
                    // borderWidth: 1,
                    padding: 0,
                  }}
                  returnKeyType="search"
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
            {/* 
            <FlatList
              data={continent_list}
              horizontal={true}
              contentContainerStyle={{
                paddingHorizontal: 10,
                // paddingBottom: 20,
                backgroundColor: "white",
                // width: Dimensions.get("window").width,
              }}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => {
                return (
                  <Pressable
                    onPress={() => selectedContinent(item, select_continent)}
                    style={({ pressed }) => [
                      {
                        padding: 10,
                        // backgroundColor: pressed ? "#F6F6F7" : "white",
                        backgroundColor:
                          select_continent == item.id ? "#209FAE" : "#F6F6F6",
                        borderRadius: 5,
                        minWidth: 70,
                        marginRight: 5,
                        alignItems: "center",
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color:
                          select_continent == item.id ? "white" : "#464646",
                      }}
                    >
                      {item.name}
                    </Text>
                  </Pressable>
                );
              }}
            /> */}
          </View>
          <FlatList
            ref={slider}
            data={list_country_src_unesco}
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
                    {item.selected && item.selected == true ? (
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
      {/* modal filter */}
      <Modal
        onBackdropPress={() => {
          setshow(false);
        }}
        onRequestClose={() => setshow(false)}
        onDismiss={() => setshow(false)}
        isVisible={show}
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
            borderTopWidth: 1,
            borderTopRightRadius: 15,
            borderTopLeftRadius: 15,
          }}
        >
          {/* bagian atas filter*/}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              paddingHorizontal: 15,
              paddingVertical: 15,
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
              onPress={() => setshow(false)}
            >
              <Xhitam height={12} width={12} />
            </TouchableOpacity>
          </View>
          {/* bagian content filter */}
          <View
            style={{
              flexDirection: "row",
              flex: 1,
              borderTopWidth: 1,
              borderColor: "#d1d1d1",
            }}
          >
            {/* sidebar filter */}
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
                    {t("continent")}
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
                    backgroundColor: "#f6f6f6",
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
                      width: "85%",
                      // borderWidth: 1,
                      marginLeft: 5,
                      padding: 0,
                    }}
                    returnKeyType="search"
                    value={continent}
                    onChangeText={(x) => {
                      searchcontinentfilter(x);
                      setContinent(x);
                    }}
                    onSubmitEditing={(x) => {
                      searchcontinentfilter(x);
                      setContinent(x);
                    }}
                  />
                  {continent.length !== 0 ? (
                    <TouchableOpacity
                      onPress={() => {
                        searchcontinentfilter("");
                        setContinent("");
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
              <ScrollView
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingHorizontal: 15,
                }}
              >
                {continent_listfilter.map((item, index) => (
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
                      // onValueChange={() =>
                      //   _handleCheck(item["id"], index, item)
                      // }
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
          {/* bagian footer modal filter */}
          <View
            style={{
              flex: 1,
              zIndex: 6,
              flexDirection: "row",
              height: 75,
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
