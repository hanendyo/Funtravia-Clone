import React, { useState, useCallback, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Dimensions,
  Image,
  ScrollView,
  FlatList,
  SafeAreaView,
} from "react-native";

import { Arrowbackwhite, Garuda, Calendargreen } from "../../assets/svg";
import { default_image } from "../../assets/png";
import { useTranslation } from "react-i18next";
import { Text, Button } from "../../component";
import Ripple from "react-native-material-ripple";
import { useLazyQuery } from "@apollo/client";
import About from "../../graphQL/Query/Cities/About";

export default function about(props) {
  let [token, setToken] = useState("");
  const [loadings, setloadings] = useState(true);

  const HeaderComponent = {
    headerShown: true,
    title: "About",
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: "About",
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      fontFamily: "Lato-Bold",
      fontSize: 14,
      color: "white",
    },
    headerLeftContainerStyle: {
      background: "#FFF",

      marginLeft: 10,
    },
    headerLeft: () => (
      <Button
        text={""}
        size="medium"
        type="circle"
        variant="transparent"
        onPress={() => props.navigation.goBack()}
        style={{
          height: 55,
        }}
      >
        <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
      </Button>
    ),
  };

  const { t, i18n } = useTranslation();
  const [actives, setActives] = useState(props.route.params.active);

  useEffect(() => {
    refresh();
  }, []);

  const refresh = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    await setToken(tkn);
    await getAboutDetail();
    await setloadings(false);
  };

  const [getAboutDetail, { loading, data, error }] = useLazyQuery(About, {
    fetchPolicy: "network-only",
    variables: {
      id: props.route.params.city_id,
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });
  let about = [];
  if (data && data.list_about_article_city) {
    about = data.list_about_article_city;
  }

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
  }, []);

  const RenderUtama = ({ aktif, render }) => {
    return (
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{
            backgroundColor: "#DAF0F2",
            width: "100%",
          }}
          contentContainerStyle={{
            paddingHorizontal: 10,
          }}
        >
          {render.length > 0 &&
            render.map((item, index) => (
              <Ripple
                onPress={() => {
                  setActives(item.id);
                }}
                style={{
                  // width: '33.333%',
                  paddingHorizontal: 10,
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  size="description"
                  type={actives == item.id ? "bold" : "regular"}
                  style={{
                    paddingVertical: 15,
                    borderBottomWidth: actives == item.id ? 3 : 1,
                    borderBottomColor:
                      actives == item.id ? "#14646E" : "#DAF0F2",
                    color: actives == item.id ? "#14646E" : "#464646",
                  }}
                >
                  {item.name}
                </Text>
              </Ripple>
            ))}
        </ScrollView>
      </View>
    );
  };
  const Rendercontent = ({ active, about }) => {
    let index = about.findIndex((k) => k["id"] === actives);
    let datas = about ? about[index] : null;

    return (
      <View style={{ padding: 20 }}>
        {
          datas && datas.information_article_detail.length
            ? datas.information_article_detail.map((i, index) => {
                return (
                  <View key={index}>
                    {i.type === "image" ? (
                      <View>
                        {i.title ? (
                          <Text
                            size="label"
                            type="bold"
                            style={{
                              marginBottom: 5,
                            }}
                          >
                            {i.title}
                          </Text>
                        ) : null}

                        <View style={{ alignItems: "center" }}>
                          <Image
                            source={i.image ? { uri: i.image } : default_image}
                            resizeMode={"cover"}
                            style={{
                              borderWidth: 0.4,
                              borderColor: "#d3d3d3",
                              marginVertical: 10,
                              height: Dimensions.get("screen").width * 0.8,
                              width: "100%",
                            }}
                          />
                        </View>
                        <Text
                          size="description"
                          type="regular"
                          style={{
                            textAlign: "justify",
                            lineHeight: 21,
                            color: "#464646",
                          }}
                        >
                          {i.text ? i.text : ""}
                        </Text>
                      </View>
                    ) : (
                      <View>
                        {i.title ? (
                          <Text
                            size="label"
                            type="bold"
                            style={{
                              marginBottom: 10,

                              // marginVertical: 10,

                              color: "#464646",
                            }}
                          >
                            {i.title}
                          </Text>
                        ) : null}
                        <Text
                          size="description"
                          type="regular"
                          style={{
                            lineHeight: 21,
                            textAlign: "justify",
                            // fontFamily: "Lato-Regular",
                            // fontSize: 13,
                            color: "#464646",
                          }}
                        >
                          {i.text ? i.text : ""}
                        </Text>
                      </View>
                    )}
                  </View>
                );
              })
            : null
          //  (
          //   <View style={{ alignItems: "center" }}>
          //     <Text
          //       type="regular"
          //       size="title"
          //       style={{
          //         textAlign: "justify",
          //         color: "#464646",
          //       }}
          //     >
          //       {t("noArticle")}
          //     </Text>
          //   </View>
          // )
        }
      </View>
    );
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <ScrollView
        nestedScrollEnabled={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
        // scrol
        style={
          {
            // marginTop: 10,
            // borderWidth: 1,
            // borderColor: 'red',
            // paddingHorizontal: 20,
          }
        }
        contentContainerStyle={
          {
            // paddingHorizontal: 20,
          }
        }
      >
        <RenderUtama aktif={actives} render={about} />

        <Rendercontent active={actives} about={about} />
      </ScrollView>
    </SafeAreaView>
  );
}