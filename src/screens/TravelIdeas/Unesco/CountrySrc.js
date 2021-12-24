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
  Filternewbiru,
  Xhitam,
  Arrowbackios,
  Xblue,
} from "../../../assets/svg";
import Modal from "react-native-modal";
import { Text, Button, FunIcon } from "../../../component";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "@apollo/react-hooks";
import CountryListSrcUnesco from "../../../graphQL/Query/Countries/CountryListSrcUnesco";
import ContinentList from "../../../graphQL/Query/Countries/ContinentList";
import CheckBox from "@react-native-community/checkbox";
import deviceInfoModule from "react-native-device-info";

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
  const Notch = deviceInfoModule.hasNotch();

  // useEffect(() => {
  //   refetchcontinent();
  // }, []);

  const {
    data: datacontinent,
    loading: loadingcontinent,
    error: errorcontinent,
    refetch: refetchcontinent,
  } = useQuery(ContinentList, {
    variables: {
      keyword: "",
    },
    onCompleted: async () => {
      setDatacontinent(datacontinent?.continent_list);
      setDatacontinentfilter(datacontinent?.continent_list);
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

  const ClearAllFilter = async () => {
    let tempe = [...continent_listfilter];
    let tempes = [];
    for (var x of tempe) {
      let data = { ...x };
      data.checked = false;
      data.show = false;
      await tempes.push(data);
    }

    // let tempdatascountry = [...dataFilterCountry];
    // for (var i in tempdatascountry) {
    //   tempdatascountry[i].checked = false;
    //   tempdatascountry[i].show = false;
    // }
    await setshow(false);
    await setContinentSelecteds([]);
    await setDatacontinent([]);
    await setDatacontinentfilter(tempes);
    await searchcontinentfilter("");
    await setContinent("");
  };
  return (
    <Modal
      onRequestClose={() => {
        setModelCountry(false);
      }}
      animationIn="slideInRight"
      animationOut="slideOutRight"
      isVisible={modalshown}
      avoidKeyboard={true}
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
              borderBottomColor: "#d1d1d1",
              borderBottomWidth: 1,

              // shadowColor: "#d3d3d3",
              // shadowOffset: {
              //   width: 2,
              //   height: 2,
              // },
              // shadowOpacity: 0.25,

              // shadowRadius: 1,
              // elevation: 3,
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
                  setshow(true);
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
                      {cekData(continent_list)}
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
                    width: "85%",
                    // borderWidth: 1,
                    marginLeft: 5,
                    padding: 0,
                  }}
                  placeholderTextColor="#464646"
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
            // contentContainerStyle={{
            //   borderWidth: 1,
            // }}
            renderItem={({ item, index }) => {
              return (
                <Pressable
                  key={index.toString()}
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
        avoidKeyboard={true}
        style={{
          justifyContent: "flex-end",
          margin: 0,
        }}
      >
        <View
          style={{
            flexDirection: "column",
            height:
              Platform.OS == "ios"
                ? Notch
                  ? Dimensions.get("screen").height * 0.51
                  : Dimensions.get("screen").height * 0.53
                : Dimensions.get("screen").height * 0.5,
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
                {continent_listfilter &&
                  continent_listfilter.map((item, index) => (
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
                          marginBottom: 5,
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
