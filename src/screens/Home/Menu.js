import React, { useState, useCallback } from "react";
import { View, TouchableOpacity, Alert, StyleSheet } from "react-native";
import {
  Plane,
  More,
  ServiceIcon,
  TourPackageIcon,
  EventIcon,
  DestinationIcon,
} from "../../assets/svg";
import { hotels, rent_car } from "../../assets/png";
import { Text, CustomImage } from "../../component";
import { useTranslation } from "react-i18next";
const menus = [
  {
    name: "flights",
    children: ({ width, height }) => Plane({ width: 50, height: 50 }),
    menu: "Flighting",
  },
  // {
  // 	name: 'Populer Destination',
  // 	children: ({ width, height }) =>
  // 		DestinationIcon({ width: width, height: height }),
  // 	menu: 'DestinationList',
  // },
  {
    name: "popularDestination",
    children: ({ width, height }) => DestinationIcon({ width: 40, height: 40 }),
    menu: "AllDestination",
  },
  {
    name: "hotels",
    children: ({ width, height }) =>
      CustomImage({
        customStyle: { width: 50, height: 50 },
        customImageStyle: {
          width: 50,
          height: 50,
          resizeMode: "contain",
        },
        source: hotels,
      }),
    menu: "Hotels",
  },
  // {
  // 	name: 'Flight & Hotel',
  // 	children: ({ width, height }) =>
  // 		CustomImage({
  // 			customStyle: { width: 50, height: 50 },
  // 			customImageStyle: {
  // 				width: 50,
  // 				height: 50,
  // 				resizeMode: 'contain',
  // 			},
  // 			source: hotel_plane,
  // 		}),
  // 	menu: null,
  // },
  // {
  // 	name: 'Trains',
  // 	children: ({ width, height }) =>
  // 		CustomImage({
  // 			customStyle: { width: 50, height: 50 },
  // 			customImageStyle: {
  // 				width: 50,
  // 				height: 50,
  // 				resizeMode: 'contain',
  // 			},
  // 			source: train,
  // 		}),
  // 	menu: null,
  // },
  // {
  // 	name: 'Bus',
  // 	children: ({ width, height }) =>
  // 		CustomImage({
  // 			customStyle: { width: 50, height: 50 },
  // 			customImageStyle: {
  // 				width: 50,
  // 				height: 50,
  // 				resizeMode: 'contain',
  // 			},
  // 			source: bus_ticket,
  // 		}),
  // 	menu: null,
  // },
  {
    name: "events",
    children: ({ width, height }) => EventIcon({ width: 50, height: 50 }),
    menu: "listevent",
  },
  {
    name: "rent",
    children: ({ width, height }) =>
      CustomImage({
        customStyle: { width: 50, height: 50 },
        customImageStyle: {
          width: 50,
          height: 50,
          resizeMode: "contain",
        },
        source: rent_car,
      }),
    menu: "RentTransportation",
  },
  {
    name: "service",
    children: ({ width, height }) => ServiceIcon({ width: 50, height: 50 }),
    menu: "Service",
  },
  {
    name: "tourPackage",
    children: ({ width, height }) => TourPackageIcon({ width: 50, height: 50 }),
    menu: "PackageTour",
  },
  {
    name: "more",
    children: ({ width, height }) => More({ width: 40, height: 40 }),
    menu: null,
  },
];

export default function Menu({ props }) {
  let [selected] = useState(new Map());
  const { t, i18n } = useTranslation();

  const pressMenu = useCallback(
    (menu) => {
      if (menu != null) {
        props.navigation.navigate(menu);
      } else {
        Alert.alert("Coming Soon", "This Feature Under Contruction");
      }
    },
    [selected]
  );
  return (
    <View style={styles.menuView}>
      {menus.map((menu, index) => (
        <View
          key={index}
          style={{
            width: "25%",
            height: 80,
            marginBottom: 5,
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={styles.menu}
            onPress={() => pressMenu(menu.menu)}
          >
            {menu.children({ width: 35, height: 35 })}
          </TouchableOpacity>
          <Text
            type="regular"
            size="small"
            style={{
              marginTop: 5,
              textAlign: "center",
            }}
          >
            {t(menu.name)}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  menu: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50 / 2,
  },
  menuView: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "flex-start",
    maxWidth: "100%",
    paddingTop: 40,
  },
});
