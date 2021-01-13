import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
} from "react-native";
import { default_image } from "../../assets/png";

import { Kosong } from "../../assets/svg";
import { Text } from "../../component";
import { useTranslation } from "react-i18next";

export default function Post({ props, token, data, datauser }) {
  const { t, i18n } = useTranslation();
  const createPost = () => {
    props.navigation.navigate("Post");
  };
  return (
    <View
      style={{
        width: Dimensions.get("window").width,
        // alignItems: 'center',
        marginTop: 2,
      }}
    >
      {data && data.length > 0 ? (
        <FlatList
          nestedScrollEnabled
          style={{ height: Dimensions.get("screen").height }}
          contentContainerStyle={{ paddingBottom: 70 }}
          showsVerticalScrollIndicator={false}
          data={data}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() =>
                props.navigation.navigate("myfeed", {
                  token: token,
                  data: data,
                  index: index,
                  datauser: datauser,
                })
              }
            >
              <Image
                style={{
                  margin: 2,
                  width: Dimensions.get("screen").width * 0.322,
                  height: Dimensions.get("screen").width * 0.322,
                }}
                source={
                  item.assets && item.assets.length > 0
                    ? { uri: item.assets[0].filepath }
                    : default_image
                }
              ></Image>
            </TouchableOpacity>
          )}
          numColumns={3}
          keyExtractor={(item) => item.id}
          // extraData={selected}
        />
      ) : (
        <View
          style={{
            paddingVertical: 40,
            justifyContent: "flex-start",
            alignItems: "center",
            alignContent: "center",
            height: "100%",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Lato-Bold",
              color: "#646464",
              textAlign: "center",
            }}
          >
            {t("noPost")}
          </Text>
          <Kosong
            height={Dimensions.get("screen").width * 0.6}
            width={Dimensions.get("screen").width}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  modalScroll: {
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: "black",
    //opacity: 1,
  },
  fab: {
    position: "absolute",
    bottom: 5,
    right: 10,
  },
});
