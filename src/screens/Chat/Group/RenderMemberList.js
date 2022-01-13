import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
  Pressable,
} from "react-native";
import {
  Arrowbackwhite,
  Delete,
  Member,
  Memberblue,
  PlusCircle,
  ArrowRightBlue,
} from "../../../assets/svg";
import Swipeout from "react-native-swipeout";

import {
  Button,
  Text,
  StatusBar,
  FunImage,
  FunImageBackground,
} from "../../../component";
import { useTranslation } from "react-i18next";
import { CHATSERVER, RESTFULL_API } from "../../../config";
import { RNToasty } from "react-native-toasty";

export default function RenderMemberList({
  item,
  index,
  mydata,
  props,
  dataDetail,
  getUserAndToken,
  token,
  setModalkick,
  setModalmakeadmin,
  setSelected,
  setIndexActive,
  indexActive,
  setModalremoveadmin,
}) {
  const { t } = useTranslation();

  const swipeoutBtnrmadmin = (item) => {
    return [
      {
        backgroundColor: "#f6f6f6",
        component: (
          <TouchableOpacity
            onPress={() => {
              setModalremoveadmin(true);
              setSelected(item);
            }}
            style={{
              height: "100%",
              width: "100%",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <Member height={20} width={20} />
            <Text size="small" type="regular" style={{ textAlign: "center" }}>
              {t("removeadmin")}
            </Text>
          </TouchableOpacity>
        ),
      },
      {
        backgroundColor: "#f6f6f6",
        component: (
          <TouchableOpacity
            onPress={() => {
              setModalkick(true);
              setSelected(item);
            }}
            style={{
              height: "100%",
              width: "100%",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <Delete height={20} width={20} />
            <Text
              size="small"
              type="regular"
              style={{
                textAlign: "center",
                paddingHorizontal: 2,
              }}
            >
              {t("delete")}
            </Text>
          </TouchableOpacity>
        ),
      },
    ];
  };

  const swipeoutBtnmkadmin = (item) => {
    return [
      {
        backgroundColor: "#f6f6f6",
        component: (
          <TouchableOpacity
            onPress={() => {
              setModalmakeadmin(true);
              setSelected(item);
            }}
            style={{
              height: "100%",
              width: "100%",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <Memberblue height={20} width={20} />
            <Text size="small" type="regular" style={{ textAlign: "center" }}>
              {t("SetasAdmin")}
            </Text>
          </TouchableOpacity>
        ),
      },
      {
        backgroundColor: "#f6f6f6",
        component: (
          <TouchableOpacity
            onPress={() => {
              setModalkick(true);
              setSelected(item);
            }}
            style={{
              height: "100%",
              width: "100%",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <Delete height={20} width={20} />
            <Text size="small" type="regular" style={{}}>
              {t("delete")}
            </Text>
          </TouchableOpacity>
        ),
      },
    ];
  };

  const swipeoutBtnPendding = (item) => {
    return [
      {
        backgroundColor: "#f6f6f6",
        component: (
          <TouchableOpacity
            onPress={() => {
              setModalkick(true);
              setSelected(item);
            }}
            style={{
              height: "100%",
              width: "100%",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <Delete height={20} width={20} />
            <Text size="small" type="regular" style={{}}>
              {t("delete")}
            </Text>
          </TouchableOpacity>
        ),
      },
    ];
  };
  if (dataDetail && dataDetail.type == "itinerary") {
    return (
      <Swipeout
        onOpen={() => setIndexActive(index)}
        close={indexActive !== index}
        backgroundColor={"#f6f6f6"}
        disabled={
          mydata.user_id == item.user_id || mydata.isadmin !== true
            ? true
            : false
        }
        // onClose={() => setIndexActive(-1)}
        right={
          item.isadmin == true
            ? swipeoutBtnrmadmin(item)
            : item.isconfrim == true
            ? swipeoutBtnmkadmin(item)
            : swipeoutBtnPendding(item)
        }
      >
        <View
          style={{
            flexDirection: "row",
            paddingVertical: 10,
            borderBottomColor: "#EEEEEE",
            backgroundColor: "#FFFFFF",
            borderBottomWidth: 1,
            paddingHorizontal: 15,
            justifyContent: "space-between",
            alignItems: "center",
            opacity: item.isconfrim !== true ? 0.5 : 1,
          }}
        >
          <Pressable
            onPress={() =>
              props.navigation.navigate("ProfileStack", {
                screen: "otherprofile",
                params: {
                  idUser: item.user_id,
                },
              })
            }
            style={{
              flexDirection: "row",
              alignItems: "center",
              flex: 1,
            }}
          >
            <FunImage
              source={{ uri: item.picture }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                marginRight: 20,
              }}
            />
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text size="label" type="bold" numberOfLines={1}>
                {item.first_name} {item?.last_name}
              </Text>
              <Text size="label" type="regular" numberOfLines={1}>
                @{item.username}
              </Text>
            </View>
          </Pressable>
          {item.isadmin == true ? (
            <View style={{ marginRight: 5 }}>
              <Text
                size="label"
                type="bold"
                style={{
                  // fontFamily: "Lato-Bold",
                  // fontSize: 12,
                  color: "#209fae",
                }}
              >
                {t("admin")}
              </Text>
            </View>
          ) : item.isconfrim !== true ? (
            <View style={{ marginRight: 5 }}>
              <Text
                size="description"
                // type="bold"
                style={{
                  // fontFamily: "Lato-Bold",
                  // fontSize: 12,
                  color: "#464646",
                }}
              >
                {t("pending")}
              </Text>
            </View>
          ) : null}
        </View>
      </Swipeout>
    );
  }

  if (mydata && mydata.isadmin == true) {
    if (mydata.user_id !== item.user_id) {
      return (
        <Swipeout
          onOpen={() => setIndexActive(index)}
          close={indexActive !== index}
          backgroundColor={"#f6f6f6"}
          // onClose={() => setIndexActive(-1)}
          right={
            item.isadmin == true
              ? swipeoutBtnrmadmin(item)
              : swipeoutBtnmkadmin(item)
          }
        >
          <View
            style={{
              flexDirection: "row",
              paddingVertical: 10,
              borderBottomColor: "#EEEEEE",
              backgroundColor: "#FFFFFF",
              borderBottomWidth: 1,
              paddingHorizontal: 15,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Pressable
              onPress={() =>
                props.navigation.navigate("ProfileStack", {
                  screen: "otherprofile",
                  params: {
                    idUser: item.user_id,
                  },
                })
              }
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <FunImage
                source={{ uri: item.picture }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  marginRight: 20,
                }}
              />
              <View style={{ maxWidth: item.isadmin == true ? "70%" : "75%" }}>
                <Text numberOfLines={1}>
                  {item.first_name} {item?.last_name}
                </Text>
                <Text>@{item.username}</Text>
              </View>
            </Pressable>
            {item.isadmin == true ? (
              <View style={{ marginRight: 5 }}>
                <Text
                  size="description"
                  type="bold"
                  style={{
                    // fontFamily: "Lato-Bold",
                    // fontSize: 12,
                    color: "#209fae",
                  }}
                >
                  {t("admin")}
                </Text>
              </View>
            ) : null}
          </View>
        </Swipeout>
      );
    } else {
      return (
        <View
          onPress={() =>
            props.navigation.navigate("ProfileStack", {
              screen: "otherprofile",
              params: {
                idUser: item.user_id,
              },
            })
          }
          style={{
            flexDirection: "row",
            paddingVertical: 10,
            borderBottomColor: "#EEEEEE",
            backgroundColor: "#FFFFFF",
            borderBottomWidth: 1,
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 15,
          }}
        >
          <Pressable
            onPress={() =>
              props.navigation.navigate("ProfileStack", {
                screen: "otherprofile",
                params: {
                  idUser: item.user_id,
                },
              })
            }
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <FunImage
              source={{ uri: item.picture }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                marginRight: 20,
              }}
            />
            <View style={{ maxWidth: item.isadmin == true ? "70%" : "75%" }}>
              <Text numberOfLines={1}>
                {item.first_name} {item?.last_name}
              </Text>
              <Text>@{item.username}</Text>
            </View>
          </Pressable>
          {item.isadmin == true ? (
            <View style={{ marginRight: 5 }}>
              <Text
                size="description"
                type="bold"
                style={{
                  // fontFamily: "Lato-Bold",
                  // fontSize: 12,
                  color: "#209fae",
                }}
              >
                {t("admin")}
              </Text>
            </View>
          ) : null}
        </View>
      );
    }
  } else {
    return (
      <View
        style={{
          flexDirection: "row",
          paddingVertical: 10,
          borderBottomColor: "#EEEEEE",
          backgroundColor: "#FFFFFF",
          borderBottomWidth: 1,
          justifyContent: "space-between",
          alignItems: "center",
          marginHorizontal: 15,
        }}
      >
        <Pressable
          onPress={() =>
            props.navigation.push("ProfileStack", {
              screen: "otherprofile",
              params: {
                idUser: item.id,
              },
            })
          }
          style={{
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
          }}
        >
          <FunImage
            source={{ uri: item.picture }}
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              marginRight: 20,
            }}
          />
          <View
            style={{
              // maxWidth: item.isadmin == true ? "70%" : "75%",
              flex: 1,
              paddingRight: 10,
            }}
          >
            <Text size="label" type="bold" numberOfLines={1}>
              {item.first_name} {item?.last_name}
            </Text>
            <Text size="label" type="regular" numberOfLines={1}>
              @{item.username}
            </Text>
          </View>
        </Pressable>
        {item.isadmin == true ? (
          <View style={{ marginRight: 5 }}>
            <Text
              size="label"
              type="bold"
              style={{
                // fontFamily: "Lato-Bold",
                // fontSize: 12,
                color: "#209fae",
              }}
            >
              {t("admin")}
            </Text>
          </View>
        ) : null}
      </View>
    );
  }
}
