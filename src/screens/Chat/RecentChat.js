import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { Text } from "../../component";
import { Tagdestination, Tagimage, Tagsticker, PinAbu } from "../../assets/svg";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ChatList({ data, style, room }) {
  const [datas, setDatas] = useState(data);

  // const getlocal = async () => {
  AsyncStorage.getItem("history_" + room).then((datas) => {
    let recent = JSON.parse(datas);
    if (recent && recent.length > 0) {
      let time_local = new Date(recent[0].time);
      let time_atas = new Date(data.time);
      if (time_local > time_atas) {
        // setDatas(recent[0]);
        // data = recent[0];
        setDatas(recent[0]);
      } else {
        data = data;

        setDatas(data);
      }
    }
  });
  // };

  if (datas.type == "sticker") {
    return (
      <View
        style={{
          flexDirection: "row",
          alignContent: "center",
          // borderWidth: 1,
        }}
      >
        <Tagsticker width={11} height={11} style={{ marginRight: 4 }} />
        <Text style={style} size="description" type="regular">
          Sticker
        </Text>
      </View>
    );
  }

  if (datas.type == "tag_destination") {
    let data_des = JSON.parse(datas.text);
    return (
      <View
        style={{
          flexDirection: "row",
          alignContent: "center",
        }}
      >
        <Tagdestination width={11} height={11} style={{ marginRight: 4 }} />
        <Text style={style} size="description" type="regular">
          {data_des.name}
        </Text>
      </View>
    );
  }

  if (datas.type == "tag_post") {
    return (
      <View
        style={{
          flexDirection: "row",
          alignContent: "center",
          // borderWidth: 1,
        }}
      >
        <Tagimage width={11} height={11} style={{ marginRight: 4 }} />
        <Text style={style} size="description" type="regular">
          Post
        </Text>
      </View>
    );
  }

  if (datas.type == "tag_city") {
    let data_city = JSON.parse(datas.text);
    return (
      <View
        style={{
          flexDirection: "row",
          alignContent: "center",
        }}
      >
        <PinAbu width={11} height={11} style={{ marginRight: 4 }} />
        <Text style={style} size="description" type="regular">
          {data_city.name}
        </Text>
      </View>
    );
  }

  if (datas.type == "tag_province") {
    let data_province = JSON.parse(datas.text);
    return (
      <View
        style={{
          flexDirection: "row",
          alignContent: "center",
        }}
      >
        <PinAbu width={11} height={11} style={{ marginRight: 4 }} />
        <Text style={style} size="description" type="regular">
          {data_province.name}
        </Text>
      </View>
    );
  }
  if (datas.type == "tag_country") {
    let data_province = JSON.parse(datas.text);
    return (
      <View
        style={{
          flexDirection: "row",
          alignContent: "center",
        }}
      >
        <PinAbu width={11} height={11} style={{ marginRight: 4 }} />
        <Text style={style} size="description" type="regular">
          {data_province.name}
        </Text>
      </View>
    );
  }
  if (datas.type == "tag_movie") {
    let data_movie = JSON.parse(datas.text);
    return (
      <View
        style={{
          flexDirection: "row",
          alignContent: "center",
        }}
      >
        {/* <Movie width={11} height={11} style={{ marginRight: 4 }} /> */}
        <PinAbu width={11} height={11} style={{ marginRight: 4 }} />
        <Text style={style} size="description" type="regular">
          {data_movie.name}
        </Text>
      </View>
    );
  }

  if (datas.type == "att_image") {
    return (
      <View
        style={{
          flexDirection: "row",
          alignContent: "center",
        }}
      >
        <Tagimage width={11} height={11} style={{ marginRight: 4 }} />
        <Text style={style} size="description" type="regular">
          Image
        </Text>
      </View>
    );
  }

  return (
    <Text style={style} size="description" numberOfLines={2}>
      {datas.text}
    </Text>
  );
}