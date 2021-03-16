import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Dimensions,
  FlatList,
  Alert,
  Platform,
  TextInput,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Arrowbackwhite, IdFlag, Check, Search } from "../../../assets/svg";
import Modal from "react-native-modal";
import { Text, Button, FunIcon } from "../../../component";
import Ripple from "react-native-material-ripple";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "@apollo/react-hooks";
import CountryListSrcUnesco from "../../../graphQL/Query/Countries/CountryListSrcUnesco";
import ContinentList from "../../../graphQL/Query/Countries/ContinentList";

export default function CountrySrc({
  selectedCountry,
  SetselectedCountry,
  modalshown,
  setModelCountry,
}) {
  const { t } = useTranslation();
  let [datacountry, setdataCountry] = useState(data);
  let [select_continent, setContinentSelected] = useState("");
  console.log(select_continent);
  let [keyword, setKeyword] = useState("");
  let slider = useRef();

  let [continent_list, setDatacontinent] = useState([]);

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
    },
  });

  const { data, loading, error, refetch } = useQuery(CountryListSrcUnesco, {
    variables: {
      continent_id: select_continent ? [select_continent] : null,
      keyword: keyword,
    },
  });
  console.log("continent", data);

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

  useEffect(() => {}, []);

  const selectedContinent = (item, select_continent) => {
    if (item.id == select_continent) {
      setContinentSelected("");
    } else {
      setContinentSelected(item.id);
    }
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
            marginTop: Platform.OS === "ios" ? 0 : -20,
          }}
        >
          <Button
            type="circle"
            color="tertiary"
            size="large"
            variant="transparent"
            onPress={() => setModelCountry(false)}
          >
            <Arrowbackwhite width={20} height={20} />
          </Button>
          <Text
            size="label"
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
            // paddingBottom: 20,
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
              // borderBottomColor: "#d3d3d3",
              // borderBottomWidth: 1,
            }}
          >
            <View
              style={{
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 10,
                backgroundColor: "white",
                // width: Dimensions.get("screen").width,
              }}
            >
              <View
                style={{
                  backgroundColor: "#DAF0F2",
                  borderRadius: 5,
                  width: Dimensions.get("window").width - 20,
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
            />
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
    </Modal>
  );
}
