import React, { useState } from "react";
import {
  View,
  FlatList,
  Dimensions,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { CalendarBiru, LikeEmpty, LikeRed, PinHijau } from "../../assets/svg";
import { Text, FunImageBackground } from "../../component";
import { useTranslation } from "react-i18next";
import normalize from "react-native-normalize";
import { default_image } from "../../assets/png";
import { ModalLogin } from "../../component";
import { useMutation } from "@apollo/client";
import { RNToasty } from "react-native-toasty";
import Liked from "../../graphQL/Mutation/Event/likedEvent";
import UnLiked from "../../graphQL/Mutation/unliked";

export default function CardEvents({ data, props, setData, token }) {
  const { t } = useTranslation();
  const [modalLogin, setModalLogin] = useState(false);

  console.log("data", data);

  const [
    mutationliked,
    { loading: loadingLike, data: dataLike, error: errorLike },
  ] = useMutation(Liked, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
        Authorization: `Bearer ${token}`,
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

  return (
    <View style={{ flex: 1 }}>
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
            onPress={() =>
              props.navigation.navigate("eventdetail", {
                event_id: item.id,
                name: item.name,
                token: token,
              })
            }
            key={index.toString()}
            style={{
              borderRadius: 5,
              height: normalize(255),
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
                <View style={{ flex: 1, paddingRight: 10 }}>
                  <Text
                    style={{
                      backgroundColor: "#daf0f2",
                      paddingBottom: 5,
                      paddingTop: 3,
                      paddingHorizontal: 10,
                      alignSelf: "flex-start",
                      borderRadius: 20,
                    }}
                    size="description"
                    type="regular"
                    numberOfLines={1}
                  >
                    {item?.category?.name}
                  </Text>
                </View>
                <View
                  style={{
                    height: 25,
                    width: 25,
                    borderRadius: 15,
                    backgroundColor: "#fff",
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
                  <CalendarBiru height={17} width={17} />
                  <Text
                    size="description"
                    type="regular"
                    style={{ flex: 1, marginLeft: 5 }}
                  >
                    kalender
                  </Text>
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
