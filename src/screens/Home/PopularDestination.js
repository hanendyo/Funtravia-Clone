import React, { useState, useEffect } from "react";
import {
  View,
  Dimensions,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import BerandaPopuler from "../../graphQL/Query/Home/BerandaPopuler";
import { useQuery } from "@apollo/react-hooks";
import { Capital, Text, FunImageBackground, FunImage } from "../../component";
import { default_image } from "../../assets/png";
import LinearGradient from "react-native-linear-gradient";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const defaultImage =
  "https://fa12.funtravia.com/destination/20200508/6Ugw9_1b6737ff-4b42-4149-8f08-00796e8c6909";

const { width, height } = Dimensions.get("screen");
export default function PopularDestination({ props }) {
  let [selected] = useState(new Map());
  const { data, loading, error } = useQuery(BerandaPopuler);
  const onSelect = (item) => {
    if (item.type == "province") {
      props.navigation.navigate("CountryStack", {
        screen: "Province",
        params: {
          data: item,
          exParam: true,
        },
      });
    } else {
      props.navigation.navigate("CountryStack", {
        screen: "CityDetail",
        params: {
          data: {
            city_id: item.id,
            city_name: item.name,
            latitude: null,
            longitude: null,
          },
          exParam: true,
        },
      });
    }
  };

  return (
    <SafeAreaView>
      {loading ? (
        <SkeletonPlaceholder>
          <View
            style={{
              height: 150,
              width: Dimensions.get("screen").width - 40,
              marginHorizontal: 20,
              marginTop: 10,
              borderRadius: 5,
            }}
          />
          <View
            style={{
              justifyContent: "flex-start",
              flexDirection: "row",
              marginHorizontal: 20,
              marginTop: 10,
            }}
          >
            <View
              style={{
                height: (Dimensions.get("screen").width - 50) / 3,
                width: (Dimensions.get("screen").width - 50) / 3,
                marginRight: 5,
                borderRadius: 5,
              }}
            />
            <View
              style={{
                height: (Dimensions.get("screen").width - 50) / 3,
                width: (Dimensions.get("screen").width - 50) / 3,
                marginRight: 5,
                borderRadius: 5,
              }}
            />
            <View
              style={{
                height: (Dimensions.get("screen").width - 50) / 3,
                width: (Dimensions.get("screen").width - 50) / 3,
                borderRadius: 5,
              }}
            />
          </View>
        </SkeletonPlaceholder>
      ) : (
        <>
          {data && data.beranda_popularV2 ? (
            <View
              style={{
                width: width - 40,
                marginTop: 10,
                marginHorizontal: 20,
                zIndex: -10,
                position: "relative",
              }}
            >
              <TouchableOpacity
                style={{
                  borderRadius: 5,
                  shadowColor: "rgba(0, 0, 0, 0.11);",
                  shadowOffset: { width: 0, height: 6 },
                  shadowRadius: 6,
                  shadowOpacity: 1,
                  elevation: 6,
                }}
                onPress={() =>
                  onSelect(
                    data && data.beranda_popularV2
                      ? data.beranda_popularV2[0]
                      : null
                  )
                }
              >
                <FunImageBackground
                  size={"m" ? "m" : null}
                  source={
                    data &&
                    data.beranda_popularV2[0] &&
                    data.beranda_popularV2[0].cover
                      ? { uri: data.beranda_popularV2[0].cover }
                      : default_image
                  }
                  style={{
                    width: width - 40,
                    height: 150,
                    justifyContent: "flex-end",
                  }}
                  imageStyle={[styles.destinationMainImage, { height: 150 }]}
                >
                  <LinearGradient
                    colors={["rgba(0, 0, 0, 0.5)", "rgba(0, 0, 0, 0)"]}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    style={{
                      height: "50%",
                      width: "100%",
                      alignItems: "flex-start",
                      alignContent: "flex-start",
                      justifyContent: "flex-end",
                      borderRadius: 5,
                      paddingHorizontal: 10,
                      paddingVertical: 10,
                    }}
                  >
                    <Text
                      size="title"
                      type="regular"
                      style={{
                        zIndex: 2,
                        color: "#fff",
                      }}
                    >
                      {data && data.beranda_popularV2[0]
                        ? Capital({
                            text: data.beranda_popularV2[0].name,
                          })
                        : ""}
                    </Text>
                  </LinearGradient>
                </FunImageBackground>
              </TouchableOpacity>
            </View>
          ) : null}
          {data && data.beranda_popularV2.length ? (
            <FlatList
              contentContainerStyle={{
                marginTop: 10,
                // paddingBottom: 15,
                paddingHorizontal: 10,
                marginLeft: 10,
                borderWidth: 1,
              }}
              horizontal={true}
              data={data.beranda_popularV2}
              renderItem={({ item, index }) =>
                index !== 0 ? (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => onSelect(item)}
                    style={{
                      marginRight: 8,
                      shadowColor: "rgba(0, 0, 0, 0.11);",
                      shadowOffset: { width: 0, height: 4 },
                      shadowRadius: 4,
                      shadowOpacity: 1,
                      borderRadius: 5,
                      elevation: 4,
                    }}
                  >
                    <FunImageBackground
                      size="m"
                      key={item.id}
                      source={
                        item && item.cover
                          ? { uri: item.cover }
                          : { uri: defaultImage }
                      }
                      style={{
                        width: (width - 50) / 3,
                        height: (width - 50) / 3,
                        borderRadius: 5,
                        justifyContent: "flex-end",
                      }}
                      imageStyle={styles.destinationImage}
                    >
                      <LinearGradient
                        colors={["rgba(0, 0, 0, 0.5)", "rgba(0, 0, 0, 0)"]}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 0, y: 0 }}
                        style={{
                          height: "50%",
                          width: "100%",
                          justifyContent: "flex-end",
                          borderRadius: 5,
                        }}
                      >
                        <Text
                          size="label"
                          type="bold"
                          style={{
                            color: "#ffff",
                            margin: 5,
                            letterSpacing: 0.5,
                          }}
                        >
                          {Capital({ text: item.name })}
                        </Text>
                      </LinearGradient>
                    </FunImageBackground>
                  </TouchableOpacity>
                ) : null
              }
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              extraData={selected}
            />
          ) : null}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  destinationMainImageContainer: {
    width: "100%",
    height: 150,
    borderRadius: 5,
  },
  destinationMainImage: {
    resizeMode: "cover",
    borderRadius: 5,
    backgroundColor: "black",
  },
  destinationImageView: {
    width: (width - 37) / 3,
    height: (width - 37) / 3,
    marginRight: 5,
    borderRadius: 5,
  },
  destinationImage: {
    resizeMode: "cover",
    borderRadius: 5,
  },
});
