import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Dimensions,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { FunIcon } from "../../../component";
import { Text } from "../../../component";
import { Button } from "../../../component";
import Modal from "react-native-modal";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import {
  Add,
  Hotel,
  Car,
  Service,
  OptionsVertBlack,
  Plus,
  Plusgrey,
  PlusBlack,
} from "../../../assets/svg";
import { FlatList } from "react-native-gesture-handler";
import ItinDrag from "./ItinDrag";
import AddDay from "../../../graphQL/Mutation/Itinerary/AddDay";
import Timeline from "../../../graphQL/Query/Itinerary/Timeline";
import DeleteDay from "../../../graphQL/Mutation/Itinerary/DeleteDay";
import UpdateTimeline from "../../../graphQL/Mutation/Itinerary/UpdateTimeline";
import { useTranslation } from "react-i18next";
import Ripple from "react-native-material-ripple";

export default function ItineraryDay({
  dataday,
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
}) {
  const { t, i18n } = useTranslation();

  let [modalmenu, setModalmenu] = useState(false);
  let [dataDay, setDataday] = useState(dataday);
  let [dataAkhir, setdataAkhir] = useState();

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

  const deteteday = async (iditinerary, idDay) => {
    setLoading(true);
    try {
      let response = await mutationDeleteDay({
        variables: {
          itinerary_id: iditinerary,
          day_id: idDay,
        },
      });

      if (errorday) {
        throw new Error("Error Input");
      }
      if (response.data) {
        if (response.data.delete_day.code !== 200) {
          throw new Error(response.data.delete_day.message);
        }
        await setdatadayaktif(dataDay[0]);
        await Refresh();
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert("" + error);
    }
  };

  const getdatebaru = (dateakhir) => {
    dateakhir = dateakhir.split(" ");
    var tomorrow = new Date(dateakhir[0]);
    tomorrow.setDate(tomorrow.getDate());
    return tomorrow;
  };

  const addButton = async () => {
    setLoading(true);
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

        setDataday(response.data.add_dayitinerary.dataday);
        // setTimeout(() => {
        setIndex(dataDay.length);
        setIdDay(dataDay[dataDay.length - 1].id);
        await slider.current.scrollToEnd();
        Refresh();
        // await slider.current.scrollToIndex({
        // 	index: dataDay.length - 1,
        // });
        // }, 1700);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert("" + error);
    }
  };

  let slider = useRef();

  let [indexnya, setIndex] = useState(0);

  let [idDay, setIdDays] = useState(dataDay[0].id);

  const setIdDay = (id) => {
    setIdDays(id);
    setidDayz(id);
  };

  let [modalsave, setModalsave] = useState(false);
  let [nexts, setnexts] = useState({});

  const savetimeline = async () => {
    setLoading(true);

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
          // Refresh();
          setdataAkhir(null);
          setAkhir([]);
          nextday(nexts);
          setnexts({});
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        Alert.alert("" + error);
      }
    }
  };

  const nextday = async (nex) => {
    setAkhir(null), setdataAkhir(null);
    setModalsave(false);
    setIndex(nex.index);
    setIdDay(nex.item.id);
    await GetTimeline(idDay);
    // setTimeout(() => {
    await slider.current.scrollToIndex({
      index: nex.index,
    });
    setLoading(false);
    setdatadayaktif(nex.item);
    setnexts({});
  };

  const setaktip = async (item, x) => {
    setLoading(true);
    setnexts({
      item: item,
      index: x,
    });
    if (dataAkhir && dataAkhir.length > 0) {
      // Alert.alert('Silahkan simpan data sebelumnya');
      setModalsave(true);
      setLoading(false);
    } else {
      setIndex(x);
      setIdDay(item.id);
      await GetTimeline(idDay);
      await slider.current.scrollToIndex({
        index: x,
      });
      setLoading(false);
      setdatadayaktif(item);
    }
  };
  const setdata = async (data) => {
    setdatadayaktif(data[0]);
    await GetTimeline(idDay);
  };

  useEffect(() => {
    {
      datadayaktif && datadayaktif.day
        ? setaktip(datadayaktif, parseInt(datadayaktif.day) - 1)
        : setdata(dataDay && dataDay.length ? dataDay : []);
    }

    // _fetchItem(dataKota);
  }, []);

  const [
    GetTimeline,
    { data: datatimeline, loading: loadingtimeline, error: errortimeline },
  ] = useLazyQuery(Timeline, {
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    variables: { id: idDay },
  });

  return (
    <View
      style={{
        width: Dimensions.get("screen").width,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        {/* {dataDay && dataDay.length ? ( */}
        <FlatList
          ref={slider}
          style={{}}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={indexnya}
          horizontal={true}
          keyExtractor={(item, index) => index + ""}
          data={dataDay}
          ListFooterComponent={
            status === "notsaved" ? (
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
            return (
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
        {/* ) : null} */}
      </View>

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
            // height: '50%',
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
