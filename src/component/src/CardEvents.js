import React, { useState } from "react";
import {
  View,
  FlatList,
  Dimensions,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { CalendarBiru, LikeEmpty, LikeRed, PinHijau } from "../../assets/svg";
import FunImageBackground from "./FunImageBackground";
import Text from "./Text";
import { useTranslation } from "react-i18next";
import normalize from "react-native-normalize";
import { default_image, CalenderGrey } from "../../assets/png";
import ModalLogin from "./ModalLogin";
import { useMutation } from "@apollo/client";
import { RNToasty } from "react-native-toasty";
import Liked from "../../graphQL/Mutation/Event/likedEvent";
import UnLiked from "../../graphQL/Mutation/unliked";
import { dateFormatBetween } from "../../component/src/dateformatter";
import CustomImage from "./CustomImage";

export default function CardEvents({
  data,
  props,
  setData,
  token,
  dataFrom,
  searchInput,
  from,
  recent_save,
  searchtext,
}) {
  const { t } = useTranslation();
  const [modalLogin, setModalLogin] = useState(false);

  const [
    mutationliked,
    { loading: loadingLike, data: dataLike, error: errorLike },
  ] = useMutation(Liked, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
  });

  const [
    mutationUnliked,
    { loading: loadingUnLike, data: dataUnLike, error: errorUnLike },
  ] = useMutation(UnLiked, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
  });

  const _liked = async (id, index) => {
    if (token) {
      try {
        const tempData = [...data];
        const tempDatalike = { ...tempData[index] };
        tempDatalike.liked = true;
        tempData.splice(index, 1, tempDatalike);
        setData(tempData);
        let response = await mutationliked({
          variables: {
            event_id: id,
          },
        });

        if (response.data) {
          if (!response.data.setEvent_wishlist.code === 200) {
            RNToasty.Show({
              title: t("FailedLikeEvents"),
              position: "bottom",
            });
          }
        }
      } catch (error) {
        const tempData = [...data];
        const tempDatalike = { ...tempData[index] };
        tempDatalike.liked = false;
        tempData.splice(index, 1, tempDatalike);
        setData(tempData);
      }
    } else {
      setModalLogin(true);
    }
  };

  const _unliked = async (id, index) => {
    if (token) {
      try {
        const tempData = [...data];
        const tempDataUnlike = { ...tempData[index] };
        tempDataUnlike.liked = false;
        tempData.splice(index, 1, tempDataUnlike);
        setData(tempData);
        let response = await mutationUnliked({
          variables: {
            id: id,
            type: "event",
          },
        });

        if (response.data) {
          if (!response.data.unset_wishlist.code === 200) {
            RNToasty.Show({
              title: t("somethingwrong"),
              position: "bottom",
            });
          }
        }
      } catch (error) {
        const tempData = [...data];
        const tempDataUnlike = { ...tempData[index] };
        tempDataUnlike.liked = true;
        tempData.splice(index, 1, tempDataUnlike);
        setData(tempData);
      }
    } else {
      setModalLogin(true);
    }
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handlerepeat = (date) => {
    let dates = date.split("-");
    return t("setiap") + " " + monthNames[parseFloat(dates[0]) - 1];
  };

  return (
    <View style={{ flex: 1, marginTop: dataFrom === "wishlist" ? 40 : 0 }}>
      <ModalLogin
        modalLogin={modalLogin}
        setModalLogin={() => setModalLogin(false)}
        props={props}
      />
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{
          marginBottom: 10,
          paddingTop: 15,
          paddingHorizontal: 15,
          width: Dimensions.get("screen").width,
        }}
        renderItem={({ item, index }) => (
          <Pressable
            onPress={() => {
              dataFrom == "search" ? recent_save(searchtext) : null;
              props.navigation.navigate("eventdetail", {
                event_id: item.id,
                name: item.name,
                token: token,
                data_from: dataFrom,
                search_input: searchInput,
                from: from,
                iditinerary: props.route.params?.IdItinerary,
                datadayaktif: props.route.params?.datadayaktif,
              });
            }}
            key={index.toString()}
            style={{
              borderRadius: 5,
              height: normalize(260),
              width: "48.5%",
              marginRight: 10,
              marginBottom: 10,
              backgroundColor: "#fff",
              borderWidth: 1,
              borderColor: "#d1d1d1",
            }}
          >
            <FunImageBackground
              style={{
                height: normalize(160),
                resizMode: "cover",
                borderTopRightRadius: 5,
                borderTopLeftRadius: 5,
                overflow: "hidden",
              }}
              source={
                item && item?.images[0] && item?.images[0].image
                  ? { uri: item?.images[0].image }
                  : default_image
              }
            >
              <View
                style={{
                  width: "100%",
                  paddingHorizontal: 10,
                  marginTop: 10,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    height: 21,
                    minWidth: 60,
                    borderRadius: 11,
                    alignSelf: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(226, 236, 248, 0.85)",
                    paddingHorizontal: 10,
                  }}
                >
                  <Text
                    size="small"
                    style={{
                      textAlign: "center",
                    }}
                  >
                    {item.category.name}
                  </Text>
                </View>
                <View
                  style={{
                    height: 25,
                    width: 25,
                    borderRadius: 15,
                    backgroundColor: "rgba(226, 236, 248, 0.85)",
                  }}
                >
                  {item.liked === false ? (
                    <TouchableOpacity
                      style={{
                        height: 26,
                        width: 26,
                        borderRadius: 50,
                        alignSelf: "center",
                        alignItems: "center",
                        alignContent: "center",
                        justifyContent: "center",

                        zIndex: 9999,
                      }}
                      onPress={() => _liked(item.id, index)}
                    >
                      <LikeEmpty height={13} width={13} />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={{
                        height: 26,
                        width: 26,
                        borderRadius: 50,
                        alignSelf: "center",
                        alignItems: "center",
                        alignContent: "center",
                        justifyContent: "center",

                        zIndex: 9999,
                      }}
                      onPress={() => _unliked(item.id, index)}
                    >
                      <LikeRed height={13} width={13} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </FunImageBackground>
            <View
              style={{
                flex: 1,
                paddingHorizontal: 10,
                paddingVertical: 5,
                justifyContent: "space-between",
              }}
            >
              <Text size="label" type="bold" numberOfLines={2}>
                {item?.name}
              </Text>
              <View style={{ justifyContent: "flex-end", marginBottom: 5 }}>
                <View
                  style={{
                    flexDirection: "row",
                    marginBottom: 5,
                    alignItems: "center",
                  }}
                >
                  {/* <CalendarBiru height={17} width={17} /> */}
                  <CustomImage
                    customStyle={{
                      width: 16,
                      height: 16,
                      marginRight: 5,
                    }}
                    customImageStyle={{
                      width: 18,
                      height: 18,
                      resizeMode: "contain",
                    }}
                    source={CalenderGrey}
                  />
                  {item.is_repeat === true ? (
                    <Text
                      size="description"
                      style={{
                        // marginLeft: 5,
                        flex: 1,
                      }}
                      numberOfLines={1}
                      type="regular"
                    >
                      {handlerepeat(item.start_date, item.end_date)}
                    </Text>
                  ) : (
                    <Text
                      size="description"
                      style={{
                        flex: 1,
                        // marginLeft: 5,
                      }}
                      numberOfLines={1}
                      type="regular"
                    >
                      {dateFormatBetween(item.start_date, item.end_date)}
                    </Text>
                  )}
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <PinHijau height={17} width={17} />
                  <Text
                    size="description"
                    type="regular"
                    style={{ flex: 1, marginLeft: 5 }}
                  >
                    {item?.city?.name}
                  </Text>
                </View>
              </View>
            </View>
          </Pressable>
        )}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={1}
      />
    </View>
  );
}
