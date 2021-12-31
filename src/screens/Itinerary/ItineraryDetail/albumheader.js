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
import {
  PlusBlack,
  GridAll,
  GridDay,
  Bottom,
  OptionsVertBlack,
  Xgray,
} from "../../../assets/svg";
import { Item, Input, Label } from "native-base";
import CreateAlbum from "../../../graphQL/Mutation/Itinerary/CreateNewAlbum";
import { useMutation } from "@apollo/client";
import normalize from "react-native-normalize";
import DeleteAlbumItinerary from "../../../graphQL/Mutation/Album/DeleteAlbumItinerary";
import RenameAlbumTitle from "../../../graphQL/Mutation/Album/RenameAlbumTitle";
import Delete from "../../../component/src/AlertModal/Delete";

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
  let [name, setname] = useState(dataalbumaktif?.title);
  const [modalDeleteAlbum, setmodalDeleteAlbum] = useState(false);
  const [modalOptions, setmodalOptions] = useState(false);
  const [itemName, setitemName] = useState("");
  const [albumId, setalbumId] = useState("");
  const [editStatus, setEditStatus] = useState(false);

  const LongPressAlbum = (item) => {
    setitemName(item.title);
    setalbumId(item.id);

    if (Anggota === "true") {
      setmodalDeleteAlbum(true);
    }
  };

  const [
    mutationRenameAlbum,
    {
      loading: loadingRenameAlbum,
      data: dataRenameAlbum,
      error: errorRenameAlbum,
    },
  ] = useMutation(RenameAlbumTitle, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
  });

  const renameAlbum = async () => {
    try {
      let response = await mutationRenameAlbum({
        variables: {
          album_id: dataalbumaktif.id,
          title: name,
        },
      });
      if (response.data) {
        if (response.data.rename_album_itinerary.code !== 200) {
          throw new Error(response.data.rename_album_itinerary.message);
        } else {
          setModalcreate(false);
          setdataalbumaktif({ ...dataalbumaktif, title: name });
        }
      }
    } catch (error) {
      console.log(error);
      setModalcreate(false);
    }
  };

  const [
    mutationcreateAlbum,
    { loading: loadingCreate, data: dataCreate, error: errorCreate },
  ] = useMutation(CreateAlbum, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
  });
  console.log("daata album aktif", dataalbumaktif);

  const [
    mutationDeleteAlbum,
    { loading: loadingDelete, data: dataDelete, error: errorDelete },
  ] = useMutation(DeleteAlbumItinerary, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
  });

  const deleteAlbum = async () => {
    try {
      let response = await mutationDeleteAlbum({
        variables: {
          album_id: albumId,
        },
      });

      if (response?.data) {
        if (response.data.delete_albums_with_post?.code !== 200) {
          throw new Error(response.data.detele_albums_with_post.message);
        } else {
          setdataalbumaktif(dataAlbum[0]);
          startRefreshAction();
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const savecreatealbum = async () => {
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
            // await setname("");
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
              text={item?.title}
              size="small"
              color={item.id !== dataalbumaktif?.id ? "green" : "primary"}
              type="box"
              style={{
                marginHorizontal: 2.5,
              }}
              onLongPress={() => {
                LongPressAlbum(item);
              }}
            ></Button>
          );
        }}
      />
      {grid !== 1 && (
        <View style={{ backgroundColor: "#f6f6f6" }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginHorizontal: 10,
              marginVertical: 10,
            }}
          >
            <Text type="bold">
              {dataalbumaktif?.title ? dataalbumaktif?.title : name}
            </Text>
            {Anggota === "true" && (
              <TouchableOpacity onPress={() => setmodalOptions(true)}>
                <OptionsVertBlack width={15} height={15} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

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
              editStatus === true ? renameAlbum() : savecreatealbum();
            }}
            color="primary"
            text={t("save")}
          ></Button>
        </View>
      </Modal>

      {/* Modal Delete Album */}
      <Delete
        modals={modalDeleteAlbum}
        setModals={() => setmodalDeleteAlbum()}
        message={`${t("deleteAlbumWith")} ${itemName}?`}
        messageHeader={t("deleteAlbum")}
        onDelete={() => {
          deleteAlbum(albumId);
          setmodalDeleteAlbum(false);
        }}
      />

      {/* Modal Option */}
      <Modal
        // useNativeDriver={true}
        animationType="fade"
        visible={modalOptions}
        onBackdropPress={() => setmodalOptions(false)}
        onRequestClose={() => setmodalOptions(false)}
        transparent={true}
      >
        <Pressable
          onPress={() => setmodalOptions(false)}
          style={{
            width: Dimensions.get("screen").width + 25,
            height: Dimensions.get("screen").height,
            justifyContent: "center",
            opacity: 0.7,
            backgroundColor: "#000",
            position: "absolute",
            left: -21,
          }}
        />
        <View
          style={{
            width: Dimensions.get("screen").width - 140,
            // marginHorizontal: 70,
            alignSelf: "center",
            backgroundColor: "#FFF",
            zIndex: 15,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            alignContent: "center",
            borderRadius: 5,
            marginTop: Dimensions.get("screen").height / 10,
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              width: Dimensions.get("screen").width - 100,
              borderRadius: 5,
            }}
          >
            <View
              style={{
                borderBottomWidth: 1,
                borderColor: "#d1d1d1",
                backgroundColor: "#f6f6f6",
                alignItems: "center",
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
              }}
            >
              <Text style={{ marginVertical: 15 }} size="title" type="bold">
                {t("option")}
              </Text>
            </View>
            <Pressable
              onPress={() => setmodalOptions(false)}
              style={{
                position: "absolute",
                right: 0,
                width: 55,
                justifyContent: "center",
                alignItems: "center",
                height: 55,
              }}
            >
              <Xgray width={15} height={15} />
            </Pressable>
            <TouchableOpacity
              style={{
                alignItems: "center",
                borderBottomColor: "#d1d1d1",
                borderBottomWidth: 1,
              }}
              onPress={() => {
                setmodalOptions(false);
                setEditStatus(true);
                setname(dataalbumaktif?.title);
                setModalcreate(true);
                // Alert.alert("Sorry, feature is not available");
              }}
            >
              <Text size="label" type="regular" style={{ marginVertical: 15 }}>
                {`${t("edit")} ${t("title")}`}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                alignItems: "center",
                borderBottomColor: "#d1d1d1",
                borderBottomWidth: 1,
              }}
              onPress={() => {
                setmodalOptions(false);
                LongPressAlbum(dataalbumaktif);
              }}
            >
              <Text size="label" type="regular" style={{ marginVertical: 15 }}>
                {t("delete")} Album
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
