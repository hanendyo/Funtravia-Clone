import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Dimensions,
  Alert,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Pressable,
} from "react-native";
import { Text } from "../../../component";
import { Button } from "../../../component";
import Modal from "react-native-modal";
import { useTranslation } from "react-i18next";
import {
  MenuProvider,
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { PlusBlack, GridAll, GridDay, Bottom } from "../../../assets/svg";
import { Item, Input, Label } from "native-base";
import CreateAlbum from "../../../graphQL/Mutation/Itinerary/CreateNewAlbum";
import { useMutation } from "@apollo/client";
import normalize from "react-native-normalize";

export default function Albumheader({
  dataAlbum,
  grid,
  setgrid,
  Anggota,
  token,
  itineraryId,
  startRefreshAction,
  dataalbumaktif,
  setdataalbumaktif,
}) {
  const { t, i18n } = useTranslation();
  let slider = useRef();
  let [modalcreate, setModalcreate] = useState(false);
  let [name, setname] = useState("");

  const [
    mutationcreateAlbum,
    { loading: loadingCreate, data: dataCreate, error: errorCreate },
  ] = useMutation(CreateAlbum, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const savecreatealbum = async () => {
    // console.log(name);
    if (name) {
      try {
        let response = await mutationcreateAlbum({
          variables: {
            itinerary_id: itineraryId,
            title: name,
          },
        });

        if (errorCreate) {
          throw new Error("Error Input");
        }
        if (response.data) {
          if (response.data.create_itinerary_album.code !== 200) {
            throw new Error(response.data.create_itinerary_album.message);
          } else {
            await setdataalbumaktif({
              id: response?.data?.create_itinerary_album?.id,
            });
            await setModalcreate(false);
            await setname("");
            await startRefreshAction();
            // console.log(response);
          }
        }
      } catch (error) {
        Alert.alert("" + error);
      }
    } else {
      Alert.alert("pleaseinsertalbumtitle");
    }
  };

  return (
    <View
      onLayout={() => {
        {
          dataalbumaktif && dataalbumaktif.id
            ? setdataalbumaktif(dataalbumaktif)
            : setdataalbumaktif(dataAlbum[0]);
        }
      }}
    >
      <FlatList
        ref={slider}
        style={{}}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        // stickyHeaderIndices={[0]}
        // initialScrollIndex={indexnya}
        // scrollToIndex={indexnya}
        horizontal={true}
        keyExtractor={(item, index) => index + ""}
        data={dataAlbum}
        ListHeaderComponent={() => (
          <Menu>
            <MenuTrigger
              style={{
                height: normalize(32),
                paddingHorizontal: 10,
                alignContent: "center",
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "#d3d3d3",
                backgroundColor: "#f6f6f6",
                marginRight: 5,
                marginHorizontal: 2.5,
                borderRadius: 5,
                flexDirection: "row",
              }}
            >
              {grid === 1 ? (
                <GridDay width={20} height={20} />
              ) : (
                <GridAll width={20} height={20} />
              )}
              <View
                style={{
                  marginLeft: 5,
                }}
              >
                <Bottom height={20} width={20} />
              </View>
            </MenuTrigger>
            <MenuOptions>
              <MenuOption
                style={{ flexDirection: "row" }}
                onSelect={() => setgrid(4)}
              >
                <GridAll width={15} height={15} />
                <Text style={{ marginLeft: 5 }}>View per Album</Text>
              </MenuOption>
              <MenuOption
                style={{ flexDirection: "row" }}
                onSelect={() => setgrid(1)}
              >
                <GridDay width={15} height={15} />
                <Text style={{ marginLeft: 5 }}>View all Album</Text>
              </MenuOption>
            </MenuOptions>
          </Menu>
        )}
        ListFooterComponent={
          Anggota === "true" ? (
            <Pressable
              onPress={() => {
                setname(""), setModalcreate(true);
              }}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 20,
                alignContent: "center",
                justifyContent: "center",

                flexDirection: "row",
                backgroundColor: "#daf0f2",
                height: normalize(32),
                marginHorizontal: 2.5,
                borderRadius: 5,
              }}
            >
              <View
                style={{
                  justifyContent: "center",
                  marginRight: 5,
                }}
              >
                <PlusBlack width={10} height={10} />
              </View>
              <View
                style={{
                  justifyContent: "center",
                }}
              >
                <Text size={"small"} type={"bold"}>
                  {"Create New"}
                </Text>
              </View>
            </Pressable>
          ) : null
        }
        contentContainerStyle={{
          flexDirection: "row",
          paddingStart: 15,
          paddingEnd: 15,
          paddingVertical: 10,
        }}
        renderItem={({ item, index }) => {
          return grid === 1 ? (
            index == 1 ? (
              <View
                style={{
                  paddingVertical: 7.5,
                  paddingHorizontal: 10,
                  alignContent: "center",
                  justifyContent: "center",
                  alignItems: "center",

                  backgroundColor: "#209fae",
                  marginHorizontal: 2.5,
                  borderRadius: 5,
                  flexDirection: "row",
                }}
                onPress={() => {
                  grid === 1 ? setgrid(4) : setgrid(1);
                }}
              >
                <Text size="small" style={{ color: "#fff" }}>
                  View all Album
                </Text>
              </View>
            ) : null
          ) : (
            <Button
              onPress={() => setdataalbumaktif(item)}
              text={item.title}
              size="small"
              color={item.id !== dataalbumaktif?.id ? "green" : "primary"}
              type="box"
              style={{
                marginHorizontal: 2.5,
              }}
            ></Button>
          );
        }}
      />

      <Modal
        onBackdropPress={() => {
          setModalcreate(false);
        }}
        onRequestClose={() => setModalcreate(false)}
        onDismiss={() => setModalcreate(false)}
        animationIn="fadeIn"
        animationOut="fadeOut"
        isVisible={modalcreate}
        style={{
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
          alignContent: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            width: Dimensions.get("screen").width - 60,
            borderRadius: 5,
            padding: 20,
          }}
        >
          <Item
            floatingLabel
            style={{
              marginVertical: 10,
            }}
          >
            <Label
              style={{
                fontFamily: "Lato-Regular",
                fontSize: 14,
              }}
            >
              {t("title")}
            </Label>
            <Input
              //   editable={false}
              style={{
                fontFamily: "Lato-Regular",
                fontSize: 16,
              }}
              maxLength={15}
              autoCorrect={false}
              value={name}
              keyboardType="default"
              onChangeText={(text) => setname(text)}
            />
          </Item>
          <Button
            onPress={() => {
              savecreatealbum();
            }}
            color="primary"
            text={t("save")}
          ></Button>
        </View>
      </Modal>
    </View>
  );
}
