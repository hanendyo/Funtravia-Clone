import React, { useState, useEffect } from "react";
import { View, SafeAreaView, FlatList, Pressable } from "react-native";
import { Text, Button } from "../../component";
import { Arrowbackwhite } from "../../assets/svg";
import { useTranslation } from "react-i18next";
import ListFotoAlbum from "../../graphQL/Query/Feed/ListFotoAlbum";
import { useLazyQuery } from "@apollo/client";
import RenderGrid from "./RenderGrid";

export default function ListFotoAlbums(props) {
  console.log("props foto", props);
  const { t } = useTranslation();
  const HeaderComponent = {
    headerShown: true,
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: "",
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
      <View style={{ flexDirection: "row" }}>
        <Button
          text={""}
          size="medium"
          type="circle"
          variant="transparent"
          onPress={() => props.navigation.goBack()}
        >
          <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
        </Button>
        <View style={{ marginLeft: 5 }}>
          <Text size="label" type="bold" style={{ color: "#FFF" }}>
            Tag to
          </Text>
          <Text size="description" type="regular" style={{ color: "#FFF" }}>
            {t("Select") + " Album"}
          </Text>
        </View>
      </View>
    ),
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    QueryFotoAlbum();
  }, []);

  const [
    QueryFotoAlbum,
    { data: dataFotoAlbum, loading: loadingFotoAlbum, error: errorFotoAlbum },
  ] = useLazyQuery(ListFotoAlbum, {
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    variables: { album_id: props.route.params.id_album },
  });

  const spreadData = (data) => {
    console.log(data);
    return data;
  };

  let lis_foto = [];
  if (dataFotoAlbum && dataFotoAlbum.detail_media_album) {
    lis_foto = spreadData(dataFotoAlbum.detail_media_album);
  }

  console.log("list_foto_page", lis_foto);
  console.log("dataFotoAlbum", dataFotoAlbum);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* <FlatList
        data={dataFotoAlbum}
        renderItem={(item, index) => {
          console.log("lebth", item.detail_media_album.length);
        }}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      /> */}
    </SafeAreaView>
  );
}
