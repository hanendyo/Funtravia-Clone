import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Dimensions,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Text } from "../../../component";
import { Button } from "../../../component";
import Modal from "react-native-modal";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import { PlusBlack, GridAll, GridDay } from "../../../assets/svg";
import { FlatList } from "react-native-gesture-handler";
import AddDay from "../../../graphQL/Mutation/Itinerary/AddDay";
import DeleteDay from "../../../graphQL/Mutation/Itinerary/DeleteDay";
import UpdateTimeline from "../../../graphQL/Mutation/Itinerary/UpdateTimeline";
import { useTranslation } from "react-i18next";
import Ripple from "react-native-material-ripple";
import {
  MenuProvider,
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";

export default function ItineraryDay({
  dataDay,
  props,
  token,
  iditinerary,
  setAkhir,
  setidDayz,
  datadayaktif,
  setdatadayaktif,
  setLoading,
  Refresh,
  status,
  GetTimeline,
  dataAkhir,
  indexnya,
  setIndex,
  Anggota,
  tabIndex,
  grid,
  setgrid,
}) {
  const { t, i18n } = useTranslation();
  let [modalmenu, setModalmenu] = useState(false);
  // let [dataDay, setDataday] = useState(dataday);
  let slider = useRef();
  let [idDay, setIdDays] = useState(dataDay ? dataDay[0].id : null);
  let [modalsave, setModalsave] = useState(false);
  let [nexts, setnexts] = useState({});

  const [
    mutationAddDay,
    { loading: Loadingday, data: dataAddDay, error: errorday },
  ] = useMutation(AddDay, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const [
    mutationDeleteDay,
    { loading: Loadingdeleteday, data: datadeleteDay, error: errordeleteday },
  ] = useMutation(DeleteDay, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const [
    mutationSaveTimeline,
    { loading: loadingSave, data: dataSave, error: errorSave },
  ] = useMutation(UpdateTimeline, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const getdatebaru = (dateakhir) => {
    dateakhir = dateakhir.split(" ");
    var tomorrow = new Date(dateakhir[0]);
    tomorrow.setDate(tomorrow.getDate());
    return tomorrow;
  };

  const addButton = async () => {
    var datebaru = getdatebaru(dataDay[dataDay.length - 1].date);
    var urutanbaru = parseInt(dataDay[dataDay.length - 1].day);

    try {
      let response = await mutationAddDay({
        variables: {
          id: iditinerary,
          date: datebaru,
          day: urutanbaru,
        },
      });

      if (errorday) {
        throw new Error("Error Input");
      }
      if (response.data) {
        if (response.data.add_dayitinerary.code !== 200) {
          throw new Error(response.data.add_dayitinerary.message);
        }

        const xX = {
          ...response.data.add_dayitinerary.dataday[
            response.data.add_dayitinerary.dataday.length - 1
          ],
        };

        xX["total_hours"] = "00:00";
        // setDataday(response.data.add_dayitinerary.dataday);
        await setIndex(response.data.add_dayitinerary.dataday.length - 1);
        await setdatadayaktif(xX);
        await setIdDay(
          response.data.add_dayitinerary.dataday[
            response.data.add_dayitinerary.dataday.length - 1
          ].id
        );
        await slider.current.scrollToEnd();
        await Refresh();
      }
    } catch (error) {
      Alert.alert("" + error);
    }
  };

  const setIdDay = (id) => {
    setIdDays(id);
    setidDayz(id);
  };

  const savetimeline = async () => {
    setModalsave(false);

    if (dataAkhir && dataAkhir.length > 0) {
      try {
        let response = await mutationSaveTimeline({
          variables: {
            idday: idDay,
            value: JSON.stringify(dataAkhir),
          },
        });

        if (errorSave) {
          throw new Error("Error Input");
        }
        if (response.data) {
          if (response.data.update_timeline.code !== 200) {
            throw new Error(response.data.update_timeline.message);
          }
          setAkhir([]);
          nextday(nexts);
          setnexts({});
        }
      } catch (error) {
        Alert.alert("" + error);
      }
    }
  };

  const nextday = async (nex) => {
    await setAkhir(null);
    await setModalsave(false);
    await setIndex(nex.index);
    await setIdDay(nex.item.id);
    await slider.current.scrollToIndex({
      index: nex.index,
    });
    await GetTimeline(nex.item.id);

    setdatadayaktif(nex.item);
    setnexts({});
  };

  const setaktip = async (item, x) => {
    setnexts({
      item: item,
      index: x,
    });
    if (dataAkhir && dataAkhir.length > 0) {
      await setModalsave(true);
    } else {
      await setIndex(x);
      await setIdDay(item.id);
      await slider.current.scrollToIndex({
        index: x,
      });
      await setdatadayaktif(item);
      await GetTimeline(item.id);
    }
  };

  const setdata = async (data) => {
    setdatadayaktif(data[0]);
    await GetTimeline(idDay);
  };

  return (
    <View
      onLayout={() => {
        {
          datadayaktif && datadayaktif.day
            ? setaktip(datadayaktif, parseInt(datadayaktif.day) - 1)
            : setdata(dataDay && dataDay.length ? dataDay : []);
        }
      }}
      style={{
        width: Dimensions.get("screen").width,
      }}
    >
      <FlatList
        ref={slider}
        style={{}}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={indexnya}
        // scrollToIndex={indexnya}
        horizontal={true}
        keyExtractor={(item, index) => index + ""}
        data={dataDay}
        ListHeaderComponent={
          tabIndex === 1 ? (
            <Menu>
              <MenuTrigger
                style={{
                  paddingVertical: 7.5,
                  paddingHorizontal: 10,
                  alignContent: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "#d3d3d3",
                  backgroundColor: "#f6f6f6",
                  marginHorizontal: 2.5,
                  borderRadius: 5,
                  flexDirection: "row",
                }}
              >
                {/* <PlusBlack
              width={15}
              height={15}
              style={{
                marginRight: 10,
              }}
            />
            <PlusBlack width={10} height={10} /> */}
                {grid === 1 ? (
                  <GridDay width={15} height={15} />
                ) : (
                  <GridAll width={15} height={15} />
                )}
              </MenuTrigger>
              <MenuOptions>
                <MenuOption
                  style={{ flexDirection: "row" }}
                  onSelect={() => setgrid(4)}
                >
                  <GridAll width={15} height={15} />
                  <Text style={{ marginLeft: 5 }}>View per day</Text>
                </MenuOption>
                <MenuOption
                  style={{ flexDirection: "row" }}
                  onSelect={() => setgrid(1)}
                >
                  <GridDay width={15} height={15} />
                  <Text style={{ marginLeft: 5 }}>View all day</Text>
                </MenuOption>
              </MenuOptions>
            </Menu>
          ) : null
        }
        ListFooterComponent={
          status === "edit" && Anggota === "true" ? (
            <Ripple
              onPress={() => addButton()}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 25,
                alignContent: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: "#d3d3d3",
                borderStyle: "dashed",
                marginHorizontal: 2.5,
                borderRadius: 5,
              }}
            >
              <PlusBlack width={10} height={10} />
            </Ripple>
          ) : null
        }
        contentContainerStyle={{
          flexDirection: "row",
          paddingStart: 15,
          paddingEnd: 15,
          paddingVertical: 10,
        }}
        renderItem={({ item, index }) => {
          return tabIndex == 1 ? (
            grid === 1 ? (
              index == 1 ? (
                <View
                  style={{
                    paddingVertical: 7.5,
                    paddingHorizontal: 10,
                    alignContent: "center",
                    justifyContent: "center",
                    alignItems: "center",

                    backgroundColor: "#209fae",
                    marginHorizontal: 2.5,
                    borderRadius: 5,
                    flexDirection: "row",
                  }}
                  onPress={() => {
                    grid === 1 ? setgrid(4) : setgrid(1);
                  }}
                >
                  <Text size="small" style={{ color: "#fff" }}>
                    View All day
                  </Text>
                </View>
              ) : null
            ) : (
              <Button
                onPress={() => setaktip(item, index)}
                text={t("day") + " " + item.day}
                size="small"
                color={indexnya !== index ? "green" : "primary"}
                type="box"
                style={{
                  marginHorizontal: 2.5,
                }}
              ></Button>
            )
          ) : (
            <Button
              onPress={() => setaktip(item, index)}
              text={t("day") + " " + item.day}
              size="small"
              color={indexnya !== index ? "green" : "primary"}
              type="box"
              style={{
                marginHorizontal: 2.5,
              }}
            ></Button>
          );
        }}
      />

      <Modal
        onBackdropPress={() => {
          setModalmenu(false);
        }}
        onRequestClose={() => setModalmenu(false)}
        onDismiss={() => setModalmenu(false)}
        animationIn="fadeIn"
        animationOut="fadeOut"
        isVisible={modalmenu}
        style={{
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
          alignContent: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            width: Dimensions.get("screen").width - 60,
            padding: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              deteteday(iditinerary, idDay);
            }}
          >
            {dataDay &&
            dataDay.length > 0 &&
            dataDay[indexnya] &&
            dataDay[indexnya].day ? (
              <Text style={{ color: "#d75995" }}>
                {t("delete")} {t("day")} {dataDay[indexnya].day} {t("from")}{" "}
                {t("Itinerary")}
              </Text>
            ) : null}
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        onBackdropPress={() => {
          setModalsave(false);
        }}
        onRequestClose={() => setModalsave(false)}
        onDismiss={() => setModalsave(false)}
        animationIn="fadeIn"
        animationOut="fadeOut"
        isVisible={modalsave}
        style={{
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
          alignContent: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            width: Dimensions.get("screen").width - 60,
            padding: 20,
          }}
        >
          <Text>{t("alertsave")}</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingVertical: 20,
              paddingHorizontal: 40,
            }}
          >
            <Button
              onPress={() => {
                savetimeline();
              }}
              color="primary"
              text={t("save")}
            ></Button>
            <Button
              onPress={() => {
                nextday(nexts);
              }}
              color="secondary"
              variant="bordered"
              text={t("delete")}
            ></Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}
