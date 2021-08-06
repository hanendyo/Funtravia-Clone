import React, { useState, useEffect } from "react";
import { Dimensions, View, Image, Alert, Pressable } from "react-native";
import { Text, FunImage } from "../../../component";
import {
  dateFormatMDY,
  dateFormats,
} from "../../../component/src/dateformatter";
import { Star } from "../../../assets/svg";
import { useQuery } from "@apollo/client";
import DestinationById from "../../../graphQL/Query/Destination/DestinationById";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ripple from "react-native-material-ripple";
import ImageSlide from "../../../component/src/ImageSlide";
import { useTranslation } from "react-i18next";

export default function Reviews({ props, id }) {
  const { t, i18n } = useTranslation();
  const [setting, setSetting] = useState("");
  const [token, setToken] = useState("");
  let [gambar, setGambar] = useState([]);
  let [modalss, setModalss] = useState(false);

  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    await setToken(tkn);

    let setsetting = await AsyncStorage.getItem("setting");
    await setSetting(JSON.parse(setsetting));
  };

  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", () => {
      loadAsync();
    });
    return unsubscribe;
  }, [props.navigation]);

  const { data, loading, error } = useQuery(DestinationById, {
    variables: { id: id },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  let [indekknya, setIndek] = useState(0);

  const ImagesSlider = async (data, indekss) => {
    setIndek(indekss);
    var tempdatas = [];
    var x = 0;

    for (var i in data.image) {
      let wid = 0;
      let hig = 0;
      Image.getSize(data.image[i].image, (width, height) => {
        wid = width;
        hig = height;
      });
      tempdatas.push({
        key: i,
        url: data.image[i].image ? data.image[i].image : "",
        width: wid,
        height: hig,
        props: {
          source: data.image[i].image ? data.image[i].image : "",
        },
      });
      x++;
    }
    await setGambar(tempdatas);
    await setModalss(true);
  };

  return (
    <>
      <ImageSlide
        show={modalss}
        dataImage={gambar}
        index={indekknya}
        setClose={() => setModalss(false)}
      />
      {data?.destinationById?.review.length > 0 ? (
        <View style={{ paddingTop: 20, paddingLeft: 15 }}>
          {data?.destinationById?.review.map((item, index) => {
            let set = [1, 2, 3, 4, 5];
            return (
              <View key={item.id + "1"} style={{ marginBottom: 20 }}>
                <Pressable
                  style={{
                    flexDirection: "row",
                  }}
                  onPress={() => {
                    item && item.user && item.user.id !== null
                      ? item?.user?.id !== setting?.user?.id
                        ? props.navigation.push("ProfileStack", {
                            screen: "otherprofile",
                            params: {
                              idUser: item.user.id,
                            },
                          })
                        : props.navigation.push("ProfileStack", {
                            screen: "ProfileTab",
                            params: {
                              token: token,
                            },
                          })
                      : Alert.alert("User has been deleted");
                  }}
                >
                  <FunImage
                    style={{
                      backgroundColor: "#464646",
                      height: 38,
                      width: 38,
                      borderRadius: 19,
                    }}
                    source={
                      item && item.user && item.user.picture
                        ? { uri: item?.user?.picture }
                        : null
                    }
                  />
                  <View
                    style={{
                      marginLeft: 10,
                      width: Dimensions.get("screen").width * 0.7,
                    }}
                  >
                    <Text size="label" type="bold" numberOfLines={1}>
                      {item?.user?.first_name + " " + item?.user?.last_name}
                    </Text>
                    <View style={{ flexDirection: "row" }}>
                      {set.map((value, index) =>
                        item.rating >= value ? (
                          <Star height={15} width={15} key={"rat" + index} />
                        ) : null
                      )}
                      <Text
                        size="description"
                        type="regular"
                        style={{ marginLeft: 5 }}
                      >
                        {item?.rating}
                      </Text>
                    </View>
                    <Text size="small" type="reguler">
                      {dateFormatMDY(item?.updated_at)}
                    </Text>
                  </View>
                </Pressable>
                {item.ulasan && item.ulasan !== "-" ? (
                  <View
                    style={{
                      marginTop: 10,
                      marginLeft: 50,
                    }}
                  >
                    <Text
                      ellipsizeMode="head"
                      size="label"
                      type="reguler"
                      style={{ lineHeight: 20 }}
                    >
                      {item.ulasan}
                    </Text>
                  </View>
                ) : null}
                {item && item.image.length > 0 ? (
                  <View
                    style={{
                      height: 90,
                      width: "80%",
                      justifyContent: "space-between",
                      flexDirection: "row",
                      marginTop: 10,
                      marginLeft: 50,
                      // marginHorizontal: 5,
                    }}
                  >
                    {item
                      ? item.image.map((items, indexs) => {
                          if (indexs < 1) {
                            return (
                              <Ripple
                                key={"img_re" + index + indexs}
                                style={{
                                  justifyContent: "center",
                                  alignItems: "center",
                                  width: "49%",
                                  height: "100%",
                                }}
                                onPress={() => ImagesSlider(item, indexs)}
                              >
                                <FunImage
                                  key={indexs + "1"}
                                  source={{ uri: items.image }}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    borderRadius: 3,
                                  }}
                                />
                              </Ripple>
                            );
                          } else if (item.image.length > 2 && indexs === 1) {
                            return (
                              <Ripple
                                key={"img_re" + index + indexs}
                                style={{
                                  justifyContent: "center",
                                  alignItems: "center",
                                  width: "49%",
                                  height: "100%",
                                }}
                                onPress={() => ImagesSlider(item, indexs)}
                              >
                                <FunImage
                                  key={indexs + "2"}
                                  source={{ uri: items.image }}
                                  style={{
                                    opacity: 0.9,
                                    width: "100%",
                                    height: "100%",
                                    opacity: 0.32,
                                    borderRadius: 3,
                                  }}
                                />
                                <Text
                                  size="title"
                                  type="regular"
                                  style={{
                                    position: "absolute",
                                    right: 40,
                                    alignSelf: "center",
                                    color: "#FFF",
                                    top: 30,
                                  }}
                                >
                                  {"+" + (item.image.length - 2)}
                                </Text>
                              </Ripple>
                            );
                          } else if (indexs === 1) {
                            return (
                              <Ripple
                                key={"img_re" + index + indexs}
                                style={{
                                  justifyContent: "center",
                                  alignItems: "center",
                                  width: "49%",
                                  height: "100%",
                                }}
                                onPress={() => ImagesSlider(item, indexs)}
                              >
                                <FunImage
                                  key={index + "3"}
                                  source={{ uri: items.image }}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    borderRadius: 3,
                                  }}
                                />
                              </Ripple>
                            );
                          } else {
                            null;
                          }
                        })
                      : null}
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>
      ) : (
        <View
          style={{
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <Text size="label" type="bold">
            {t("noData")} review
          </Text>
        </View>
      )}
    </>
  );
}
