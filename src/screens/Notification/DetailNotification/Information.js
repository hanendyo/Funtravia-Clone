import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TextInput,
  FlatList,
} from "react-native";
import { Option_blue } from "../../../assets/svg";
import { useTranslation } from "react-i18next";
import { Text, Button } from "../../../component";

const DataInformasi = [
  // {
  // 	id: 1,
  // 	title: 'Tiket #1098987',
  // 	value: 'Bantu saya dalam hal - Transaksi saya yang gagal',
  // 	status: 'SELESAI',
  // 	icon: Star,
  // 	read: false,
  // },
  // {
  // 	id: 2,
  // 	title: 'Tiket #1098987',
  // 	value: 'Bantu saya dalam hal - Transaksi saya yang gagal',
  // 	status: 'SELESAI',
  // 	icon: Star,
  // 	read: true,
  // },
];

const DataItenEx = {
  id: "1",
  city: "Bali",
  date_start: "2020-10-10",
  date_end: "2020-10-15",
};

export default function Information({ navigation }) {
  const { t, i18n } = useTranslation();

  const [dataIten, SetDataIten] = useState(DataItenEx);
  let detailId = navigation.getParam("id");
  let city = navigation.getParam("city");
  let date_from = navigation.getParam("date_from");
  let date_until = navigation.getParam("date_until");
  let [token, setToken] = useState("");
  let [selected] = useState(new Map());
  let [dataTrans, setTrans] = useState(DataInformasi);
  // ===modalfilter===

  const CarDetail = (data, dataIten) => {
    navigation.navigate("CarDetail", {
      datacar: data,
      data_iten: dataIten,
    });
  };

  const RenderTrans = ({ item }) => {
    return (
      <View
        style={{
          borderBottomWidth: 1,
          borderBottomColor: "#D1D1D1",
          // backgroundColor: item.read == false ? 'white' : '#D1D1D1',
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: Dimensions.get("screen").width - 20,
            padding: 10,
          }}
        >
          <View
            style={{
              width: "18%",
            }}
          >
            <item.icon width={45} height={45} />
          </View>
          <View
            style={{
              flexDirection: "column",
              // borderWidth: 1,
              width: "80%",
            }}
          >
            <Text
              size="small"
              type="bold"
              style={{
                // fontFamily: "Lato-Bold",
                color: "#464646",
                width: "100%",
                // fontSize: 13,
                marginBottom: 5,
              }}
            >
              {item.value}
            </Text>
            <Text
              size="small"
              type="regular"
              style={{
                // fontFamily: "Lato-Regular",
                // fontSize: 13,
                width: "100%",
                color: "#464646",
                marginBottom: 7,
              }}
            >
              {item.title}
            </Text>
            <View
              style={{
                backgroundColor: "#32CD32",
                paddingHorizontal: 3,
                paddingVertical: 1,
                marginBottom: 5,
                width: 60,
                alignContent: "center",
                borderRadius: 5,
              }}
            >
              <Text
                size="small"
                type="bold"
                style={{
                  // fontFamily: "Lato-Bold",
                  // fontSize: 13,
                  color: "white",
                  // width: '100%',
                  alignSelf: "center",
                }}
              >
                {item.status}
              </Text>
            </View>
          </View>
          <View
            style={{
              marginTop: 5,
              marginLeft: 5,
              width: "2%",
              alignContent: "center",
            }}
          >
            <Option_blue width={10} height={10} />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        contentContainerStyle={{
          justifyContent: "space-evenly",
        }}
        horizontal={false}
        data={dataTrans}
        renderItem={({ item }) => <RenderTrans item={item} />}
        // keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    // flex: 1,
    // marginTop: 20,
    paddingTop: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  ImageView: {
    // width: (110),
    // height: (110),
    marginRight: 5,
    borderRadius: 10,
    backgroundColor: "rgba(0, 0, 0, 0)",
    // borderColor: 'gray',
    // shadowColor: 'gray',
    // shadowOffset: { width: 3, height: 3 },
    // shadowOpacity: 1,
    // shadowRadius: 3,
    // elevation: 3,
    // opacity: 0.4,
    // elevation: 1,
  },
  Image: {
    resizeMode: "contain",
    borderRadius: 10,
  },
});
