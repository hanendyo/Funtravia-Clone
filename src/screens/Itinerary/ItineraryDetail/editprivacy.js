import { useMutation } from "@apollo/client";
import React, { useState, useCallback, useEffect, useRef } from "react";
import { FlatList, Pressable, View, Alert } from "react-native";
import {
  Arrowbackios,
  Arrowbackwhite,
  CheckWhite,
  Globe,
  GlobeWorld,
  Newglobe,
  Newpadlock,
  Padlock,
} from "../../../assets/svg";
import { Button, Text } from "../../../component";
import { useTranslation } from "react-i18next";
import UpdatePrivacy from "../../../graphQL/Mutation/Itinerary/EditPrivacy";
import { useSelector } from "react-redux";

export default function editprivacy(props) {
  const { t, i18n } = useTranslation();
  const [dataPrivate, setDataPrivate] = useState(props.route.params.isprivate);
  const [dataID, setDataId] = useState(props.route.params.id);
  const token = useSelector((data) => data.token);
  const HeaderComponent = {
    headerShown: true,
    title: (
      <Text size="header" style={{ color: "#fff" }}>
        {t("edit privacy")}
      </Text>
    ),
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: t("edit") + " " + t("privacy"),
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerLeftContainerStyle: {
      background: "#FFF",
      marginLeft: 10,
    },

    headerRightStyle: {},
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
        {Platform.OS == "ios" ? (
          <Arrowbackios height={15} width={15}></Arrowbackios>
        ) : (
          <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
        )}
      </Button>
    ),
  };

  // data hardcode privacy for flatlist
  const dataprivacy = [
    {
      isprivate: true,
      icon: <Newpadlock width={25} height={25} />,
      title: t("private"),
      subtitle: t("onlyyou"),
    },
    {
      isprivate: false,
      icon: <GlobeWorld width={25} height={25} />,
      title: t("public"),
      subtitle: t("everyoneinfuntravia"),
    },
  ];

  const [
    mutationprivacy,
    { loading: loadingSave, data: dataSave, error: errorSave },
  ] = useMutation(UpdatePrivacy, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
  });

  const updateprivacy = async (item) => {
    try {
      let response = await mutationprivacy({
        variables: {
          id: dataID,
          is_private: item,
        },
      });
      if (loadingSave) {
        Alert.alert("Loading!!");
      }
      if (errorSave) {
        throw new Error("Error Input");
      }

      if (response.data) {
        if (
          response.data.itinerary_is_public.code === 200 ||
          response.data.itinerary_is_public.code === "200"
        ) {
          setDataPrivate(item);
        } else {
          throw new Error(response.data.message);
        }

        // Alert.alert('Succes');
      }
    } catch (error) {
      Alert.alert("" + error);
    }
  };
  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
  }, [props.navigation]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FFF",
      }}
    >
      <View
        style={{
          paddingHorizontal: 15,
          paddingVertical: 15,
        }}
      >
        <View>
          <Text size={"title"} type={"bold"} style={{ marginBottom: 5 }}>
            {t("titleeditprivacy")}
          </Text>
          <Text size={"readable"} type={"regular"}>
            {t("subtitleeditprivacy")}
          </Text>
        </View>
      </View>
      <View>
        <FlatList
          data={dataprivacy}
          contentContainerStyle={{
            paddingHorizontal: 15,
            marginBottom: 100,
          }}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.isprivate + "a"}
          renderItem={({ item, index }) => (
            <Pressable onPress={() => updateprivacy(item.isprivate)}>
              <View
                style={{
                  paddingHorizontal: 20,
                  paddingVertical: 30,
                  borderBottomColor: "#dedede",
                  borderBottomWidth: 1,
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <View
                    style={{
                      justifyContent: "center",
                    }}
                  >
                    {item.isprivate == dataPrivate ? (
                      <View
                        style={{
                          height: 25,
                          width: 25,
                          borderRadius: 25,
                          backgroundColor: "#209FAE",
                          justifyContent: "center",

                          alignItems: "center",
                        }}
                      >
                        <CheckWhite width={15} height={15} />
                      </View>
                    ) : (
                      <View
                        style={{
                          height: 25,
                          width: 25,
                          borderRadius: 25,
                          backgroundColor: "#dedede",
                          justifyContent: "center",

                          alignItems: "center",
                        }}
                      />
                    )}
                  </View>
                  <View
                    style={{
                      marginHorizontal: 20,
                      justifyContent: "center",
                    }}
                  >
                    {item.icon}
                  </View>
                  <View
                    style={{
                      justifyContent: "center",
                    }}
                  >
                    <Text size={"title"} type={"bold"}>
                      {item.title}
                    </Text>
                    <Text size={"title"} type={"regular"}>
                      {item.subtitle}
                    </Text>
                  </View>
                </View>
              </View>
            </Pressable>
          )}
        />
      </View>
    </View>
  );
}
