import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { Text, Truncate } from "../../component";
import {
  Tagdestination,
  Tagimage,
  Tagsticker,
  PinAbu,
  Tagdocument,
} from "../../assets/svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

export default function RecentChat({ data, style, room }) {
  const [datas, setDatas] = useState(data);
  const settingApps = useSelector((data) => data.setting);
  const { t } = useTranslation();

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
        setDatas(data);
      }
    } else {
      setDatas(data);
    }
  });
  // };

  if (datas.type == "sticker") {
    return (
      <View
        style={{
          flexDirection: "row",
          alignContent: "center",
          alignItems: "center",
          // borderWidth: 1,
        }}
      >
        <Tagsticker width={11} height={11} style={{ marginRight: 5 }} />
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
          // alignItems: "center",
        }}
      >
        <Tagdestination width={11} height={11} style={{ margin: 5 }} />
        <Text style={style} size="description" type="regular" numberOfLines={2}>
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
          alignItems: "center",
        }}
      >
        <Text style={{}} size="description" numberOfLines={1}>
          {datas.chat == "personal"
            ? datas.user_id == settingApps.user_id
              ? t("you") + " : "
              : ""
            : datas.user_id == settingApps.user_id
            ? t("you") + " : "
            : Truncate({ text: datas.name }, { length: 8 }) + " : "}
        </Text>
        <Tagimage width={11} height={11} style={{ marginRight: 5 }} />
        <Text style={{ flex: 1 }} size="description" type="regular">
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
          alignItems: "center",
        }}
      >
        <Text style={{}} size="description" numberOfLines={1}>
          {datas.chat == "personal"
            ? datas.user_id == settingApps.user_id
              ? t("you") + " : "
              : ""
            : datas.user_id == settingApps.user_id
            ? t("you") + " : "
            : Truncate({ text: datas.name }, { length: 8 }) + " : "}
        </Text>
        <PinAbu
          width={11}
          height={11}
          style={{ marginRight: 5, marginVertical: 5 }}
        />
        <Text
          style={{ flex: 1 }}
          size="description"
          type="regular"
          numberOfLines={1}
        >
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
          alignItems: "center",
        }}
      >
        <Text style={{}} size="description" numberOfLines={1}>
          {datas.chat == "personal"
            ? datas.user_id == settingApps.user_id
              ? t("you") + " : "
              : ""
            : datas.user_id == settingApps.user_id
            ? t("you") + " : "
            : Truncate({ text: datas.name }, { length: 8 }) + " : "}
        </Text>
        <PinAbu
          width={11}
          height={11}
          style={{ marginRight: 5, marginVertical: 5 }}
        />
        <Text
          style={{ flex: 1 }}
          size="description"
          type="regular"
          numberOfLines={1}
        >
          {data_province.name}
        </Text>
      </View>
    );
  }
  if (datas.type == "tag_country") {
    let dataCountry = JSON.parse(datas.text);
    return (
      <View
        style={{
          flexDirection: "row",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{}} size="description" numberOfLines={1}>
          {datas.chat == "personal"
            ? datas.user_id == settingApps.user_id
              ? t("you") + " : "
              : ""
            : datas.user_id == settingApps.user_id
            ? t("you") + " : "
            : Truncate({ text: datas.name }, { length: 8 }) + " : "}
        </Text>
        <PinAbu
          width={11}
          height={11}
          style={{ marginRight: 5, marginVertical: 5 }}
        />
        <Text
          style={{ flex: 1 }}
          size="description"
          type="regular"
          numberOfLines={1}
        >
          {dataCountry.name}
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
          alignItems: "center",
        }}
      >
        <Text type="regular" size="description" numberOfLines={2}>
          {datas.chat == "personal"
            ? datas.user_id == settingApps.user_id
              ? t("you") + " " + t("sendAMovie") + data_movie.name
              : t("sendAMovie") + data_movie.name
            : datas.user_id == settingApps.user_id
            ? t("you") + " " + t("sendAMovie") + data_movie.name
            : Truncate({ text: datas.name }, { length: 8 }) +
              " " +
              t("sendAMovie") +
              data_movie.name +
              data_movie.name}
        </Text>
        {/* <Text style={style} size="description" type="regular" numberOfLines={2}>
          {t("sendAMovie") + data_movie.name}
        </Text> */}
      </View>
    );
  }
  if (datas.type == "tag_event") {
    let data_event = JSON.parse(datas.text);
    return (
      <View
        style={{
          flexDirection: "row",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{}} size="description" numberOfLines={2}>
          {datas.chat == "personal"
            ? datas.user_id == settingApps.user_id
              ? t("you") + " " + t("sendAnEvent") + data_event.name
              : t("sendAnEvent") + data_event.name
            : datas.user_id == settingApps.user_id
            ? t("you") + " " + t("sendAnEvent") + data_event.name
            : Truncate({ text: datas.name }, { length: 8 }) +
              " " +
              t("sendAnEvent") +
              data_event.name}
        </Text>
      </View>
    );
  }
  if (datas.type == "tag_travel_goal") {
    let data_travel_goal = JSON.parse(datas.text);
    return (
      <View
        style={{
          flexDirection: "row",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <Text size="description" type="regular" numberOfLines={1}>
          {datas.chat == "personal"
            ? datas.user_id == settingApps.user_id
              ? t("you") + " : "
              : ""
            : datas.user_id == settingApps.user_id
            ? t("you") + " : "
            : Truncate({ text: datas.name }, { length: 8 }) + " : "}
        </Text>
        <Tagdocument
          width={11}
          height={11}
          style={{ marginRight: 5, marginVertical: 5 }}
        />
        <Text
          style={{ flex: 1 }}
          size="description"
          type="regular"
          numberOfLines={1}
        >
          {data_travel_goal.name}
        </Text>
      </View>
    );
  }
  if (datas.type == "tag_journal") {
    let data_travel_goal = JSON.parse(datas.text);
    return (
      <View
        style={{
          flexDirection: "row",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{}} size="description" numberOfLines={1}>
          {datas.chat == "personal"
            ? datas.user_id == settingApps.user_id
              ? t("you") + " : "
              : ""
            : datas.user_id == settingApps.user_id
            ? t("you") + " : "
            : Truncate({ text: datas.name }, { length: 8 }) + " : "}
        </Text>
        <Tagdocument
          width={11}
          height={11}
          style={{ marginRight: 5, marginVertical: 5 }}
        />
        <Text
          style={{ flex: 1 }}
          size="description"
          type="regular"
          numberOfLines={1}
        >
          {data_travel_goal.name}
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
          alignItems: "center",
        }}
      >
        <Text style={style} size="description" numberOfLines={1}>
          {datas.chat == "personal"
            ? datas.user_id == settingApps.user_id
              ? t("you") + " : "
              : ""
            : datas.user_id == settingApps.user_id
            ? t("you") + " : "
            : Truncate({ text: datas.name }, { length: 8 }) + " : "}
        </Text>
        <Tagimage width={11} height={11} style={{ marginRight: 5 }} />
        <Text style={style} size="description" type="regular">
          Image
        </Text>
      </View>
    );
  }

  return (
    <Text style={style} size="description" numberOfLines={2}>
      {datas.chat == "personal"
        ? datas.user_id == settingApps.user_id
          ? t("you") + " : " + datas.text
          : datas.text
        : datas.user_id == settingApps.user_id
        ? t("you") + " : " + datas.text
        : Truncate({ text: datas.name }, { length: 8 }) + " : " + datas.text}
    </Text>
  );
}
