import React, { useState, useEffect } from "react";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import {
  View,
  Dimensions,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Arrowbackwhite, Check } from "../../../assets/svg";
import Modal from "react-native-modal";
import { Text } from "../../../component";
import { useTranslation } from "react-i18next";
import Ripple from "react-native-material-ripple";
import ItineraryDetails from "../../../graphQL/Query/Itinerary/ItineraryDetails";

export default function ChooseDay({ modals, setModalDay, idItinerary }) {
  const { t, i18n } = useTranslation();
  const [choose, setChoose] = useState(false);
  const [select, setSelect] = useState("Itinerary Album");
  let dataDay = [
    { day: "Day 1", selected: false },
    { day: "Day 2", selected: false },
    { day: "Day 3", selected: false },
    { day: "Day 4", selected: false },
    { day: "Day 5", selected: false },
    { day: "Day 6", selected: false },
  ];

  const [data, setData] = useState(dataDay);
  const [datas, setDatas] = useState();
  const {
    data: dataItinerary,
    loading: loadingdetail,
    error: errordetail,
  } = useQuery(ItineraryDetails, {
    variables: { id: idItinerary },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    onCompleted: () => {
      setDatas(dataItinerary.itinerary_detail);
    },
  });

  const pilih = (day) => {
    const tempData = [...dataDay];
    const index = tempData.findIndex((k) => k["day"] === day);
    tempData[index].selected = true;
    setData(tempData);
  };

  return (
    <Modal
      animationIn="slideInRight"
      animationOut="slideOutRight"
      isVisible={modals}
      onRequestClose={() => {
        setModalDay(false);
      }}
      style={{
        // justifyContent: "flex-end",
        // alignItems: "center",
        alignSelf: "center",
        // alignContent: "center",
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
            marginTop: Platform.OS === "ios" ? 0 : -21,
          }}
        >
          <TouchableOpacity
            style={{
              height: 55,
              width: 55,
              position: "absolute",
              alignItems: "center",
              alignContent: "center",
              paddingTop: 20,
            }}
            onPress={() => setModalDay(false)}
          >
            <Arrowbackwhite width={20} height={20} />
          </TouchableOpacity>
          <View
            style={{
              top: 0,
              left: 60,
              height: 50,
              // position: "absolute",
              justifyContent: "center",
              marginTop: 5,
            }}
          >
            <Text size="label" type="regular" style={{ color: "#FFF" }}>
              albums
            </Text>
            <Text size="description" type="light" style={{ color: "#FFF" }}>
              {t("selecDay")}
            </Text>
          </View>
        </View>
        <View
          style={{
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
            // height: 300,
            backgroundColor: "white",
          }}
        >
          {datas &&
            datas?.day.map((item, index) => (
              <Ripple
                // onPress={() => pilih(item?.day?.id)}
                onPress={() => alert(`Day ${item.day}`)}
                style={{
                  // width: width,
                  marginHorizontal: 15,
                  paddingVertical: 15,
                  borderBottomWidth: 1,
                  // borderColor: "rgb(80,80,80)",
                  borderColor: "#f1f1f1",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 20,
                    marginLeft: 10,
                  }}
                >
                  <Check height="15" width="15" />
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ marginLeft: 10 }}>Day</Text>
                  <Text style={{ marginLeft: 10 }}>{item.day}</Text>
                </View>
              </Ripple>
            ))}
        </View>
      </View>
    </Modal>
  );
}
