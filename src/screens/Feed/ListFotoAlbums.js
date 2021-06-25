import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  FlatList,
  Pressable,
  Dimensions,
} from "react-native";
import { Text, Button } from "../../component";
import { Arrowbackwhite } from "../../assets/svg";
import { useTranslation } from "react-i18next";
import ListFotoAlbum from "../../graphQL/Query/Feed/ListFotoAlbum";
import { useLazyQuery } from "@apollo/client";
import RenderGridAlbum from "./RenderGridAlbum";
import AddAlbumFeed from "../../graphQL/Mutation/Post/AddAlbumFeed";
import { useMutation } from "@apollo/client";
import { RNToasty } from "react-native-toasty";

export default function ListFotoAlbums(props) {
  console.log("props foto", props);
  const { t } = useTranslation();
  const [show, setShow] = useState(true);
  const [token, setToken] = useState(props.route.params.token);
  console.log("show", show);
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
          onPress={() => {
            show === true
              ? props.navigation.goBack()
              : props.navigation.navigate("BottomStack", {
                  screen: "FeedBottomScreen",
                  params: {
                    screen: "FeedScreen",
                    params: {
                      isPost: "",
                      caption: "",
                      latitude: "",
                      longitude: "",
                      location_name: "",
                      albums_id: "",
                      itinerary_id: "",
                      day_id: "",
                      oriented: "",
                      assets: "",
                    },
                  },
                });
          }}
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
    // props.navigation.setOptions({ headerLeft: View });
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
    onCompleted: () => console.log("dataFotoAlbum didalam", dataFotoAlbum),
  });

  console.log("dataFotoAlbum", dataFotoAlbum);
  console.log("loadingFotoAlbum", loadingFotoAlbum);
  console.log("errorFotoAlbum", errorFotoAlbum);
  console.log("props.route.params.id_album", props.route.params.id_album);

  const [
    MutationAddAlbumFeed,
    { loading: loadingMutation, data: dataMutation, error: errorMutation },
  ] = useMutation(AddAlbumFeed, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const SubmitAdd = async () => {
    console.log("submit");
    try {
      let response = await MutationAddAlbumFeed({
        variables: {
          album_id: props.route.params.id_album,
          post_id: props.route.params.post_id,
        },
      });

      console.log("response", response);
      if (response.data) {
        if (
          response &&
          response.data &&
          response.data.link_post_to_album.code === 200
        ) {
          console.log("berhasil");
          await QueryFotoAlbum();
          await setShow(false);
          await RNToasty.Show({
            title: "Berhasil memindahkan Foto",
            position: "bottom",
            duration: 1,
          });
        } else {
          console.log("gagal");
        }
      }
    } catch (e) {
      console.log(e);
      RNToasty.Show({
        title: t("failedCreateAlbum"),
        position: "bottom",
      });
    }
  };

  const spreadData = (data) => {
    let tmpData = [];
    let count = 1;
    let tmpArray = [];
    let grid = 1;
    for (let val of data) {
      if (count < 3) {
        tmpArray.push(val);
        count++;
      } else {
        tmpArray.push(val);
        tmpArray.push({ grid: grid });
        grid++;
        if (grid == 4) {
          grid = 1;
        }
        tmpData.push(tmpArray);
        count = 1;
        tmpArray = [];
      }
    }
    if (tmpArray.length) {
      tmpData.push(tmpArray);
    }
    return tmpData;
  };

  let lis_foto = [];
  if (dataFotoAlbum && dataFotoAlbum.detail_media_album) {
    lis_foto = spreadData(dataFotoAlbum.detail_media_album);
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={lis_foto}
        renderItem={({ item, index }) => (
          <RenderGridAlbum item={item} index={index} props={props} />
        )}
        style={{
          marginHorizontal: 10,
        }}
        keyExtractor={(item) => item[0].id}
        showsVerticalScrollIndicator={false}
      />
      {show ? (
        <View
          style={{
            position: "absolute",
            width: Dimensions.get("screen").width,
            // height: 100,
            backgroundColor: "#FFF",
            borderTopWidth: 1,
            borderColor: "#d1d1d1",
            paddingHorizontal: 15,
            bottom: 0,
          }}
        >
          <Button
            onPress={() => SubmitAdd()}
            text="Tag to this album"
            style={{ marginVertical: 20 }}
            size="large"
          ></Button>
        </View>
      ) : null}
    </SafeAreaView>
  );
}
