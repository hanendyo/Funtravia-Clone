import React, { useState, useCallback, useEffect } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { FunIcon } from "../../component";
import { Arrowbackwhite, TypeC, TypeF } from "../../assets/svg";
import { SafeAreaView } from "react-navigation";
import { useTranslation } from "react-i18next";
import { Text, Button } from "../../component";

export default function Beforeyougo(props) {
  const { t, i18n } = useTranslation();
  useEffect(() => {}, []);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        nestedScrollEnabled={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={{
          marginTop: 10,
          // borderWidth: 1,
          // borderColor: 'red',
          paddingHorizontal: 20,
        }}
      >
        <View
          style={{
            width: "100%",
            borderBottomWidth: 1,
            borderBottomColor: "#d1d1d1",
            paddingVertical: 10,
          }}
        >
          <Text size="label" type="bold" style={{ marginBottom: 5 }}>
            {`${t("passport")} ${"&"} ${t("visa")}`}
          </Text>
          <Text size="description" type="regular" style={{ color: "#d1d1d1" }}>
            {t("forUpToDate")}
          </Text>
          <Text size="description" type="bold">
            www.imigrasi.co.id
          </Text>
        </View>
        <View
          style={{
            width: "100%",
            borderBottomWidth: 1,
            borderBottomColor: "#d1d1d1",
            paddingVertical: 10,
          }}
        >
          <Text type="bold" size="label" style={{ marginBottom: 5 }}>
            {t("currency")}
          </Text>
          <Text type="regular" size="description" style={{ color: "#d1d1d1" }}>
            Indonesia Rupiah (IDR)
          </Text>
        </View>

        <View
          style={{
            width: "100%",
            borderBottomWidth: 1,
            borderBottomColor: "#d1d1d1",
            paddingVertical: 10,
          }}
        >
          <Text type="bold" size="label" style={{ marginBottom: 5 }}>
            {t("climate")}
          </Text>
          <View
            style={{
              width: "100%",
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <FunIcon icon="w-rain_heavy" height={60} width={60} />
            <Text
              type="regular"
              size="description"
              style={{
                width: "80%",

                textAlign: "justify",
                color: "#6c6c6c",
              }}
            >
              Lorem ipsum adipiscing turpis dolor elit. nunc id sit Tortor nec
              amet, consectetur varius ermentum ut cursus at. Vitae habitant id
              lorem amet aliquam
            </Text>
          </View>
          <View
            style={{
              width: "100%",
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <FunIcon icon="w-sunny" height={60} width={60} />
            <Text
              size="description"
              type="regular"
              style={{
                width: "80%",
                // fontFamily: "Lato-Regular",
                // fontSize: 14,
                textAlign: "justify",
                color: "#6c6c6c",
              }}
            >
              Lorem ipsum adipiscing turpis dolor elit. nunc id sit Tortor nec
              amet, consectetur varius ermentum ut cursus at. Vitae habitant id
              lorem amet aliquam
            </Text>
          </View>
        </View>
        <View
          style={{
            width: "100%",
            borderBottomWidth: 1,
            borderBottomColor: "#d1d1d1",
            paddingVertical: 10,
          }}
        >
          <Text size="label" type="bold" style={{ marginBottom: 5 }}>
            {t("electricity")}
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TypeC height={60} width={60} />

              <Text
                size="description"
                type="regular"
                style={{
                  // fontFamily: "Lato-Regular",
                  // fontSize: 14,
                  color: "#6c6c6c",
                }}
              >
                Type C
              </Text>
            </View>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TypeF height={60} width={60} />

              <Text
                size="description"
                type="regular"
                style={{
                  // fontFamily: "Lato-Regular",
                  // fontSize: 14,
                  color: "#6c6c6c",
                }}
              >
                Type F
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            width: "100%",
            borderBottomWidth: 1,
            borderBottomColor: "#d1d1d1",
            paddingVertical: 10,
          }}
        >
          <Text type="bold" size="label" style={{ marginBottom: 5 }}>
            Money
          </Text>
          <Text
            size="description"
            type="regular"
            style={{
              // fontFamily: "Lato-Regular",
              // fontSize: 14,
              textAlign: "justify",
              color: "#6c6c6c",
            }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tortor
            varius fermentum turpis nunc id nec ut cursus at. Vitae habitant id
            lorem amet aliquam.
          </Text>
        </View>
        <View
          style={{
            width: "100%",
            borderBottomWidth: 1,
            borderBottomColor: "#d1d1d1",
            paddingVertical: 10,
          }}
        >
          <Text type="bold" size="label" style={{ marginBottom: 5 }}>
            Custom informtion
          </Text>
          <Text
            size="description"
            type="regular"
            style={{
              // fontFamily: "Lato-Regular",
              // fontSize: 14,
              textAlign: "justify",
              color: "#6c6c6c",
            }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tortor
            varius fermentum turpis nunc id nec ut cursus at. Vitae habitant id
            lorem amet aliquam.
          </Text>
        </View>
        <View
          style={{
            width: "100%",
            borderBottomWidth: 1,
            borderBottomColor: "#d1d1d1",
            paddingVertical: 10,
          }}
        >
          <Text type="bold" size="label" style={{ marginBottom: 5 }}>
            {t("smoke")} {"&"} {t("alcohol")}
          </Text>
          <Text
            size="description"
            type="regular"
            style={{
              // fontFamily: "Lato-Regular",
              // fontSize: 14,
              textAlign: "justify",
              color: "#6c6c6c",
            }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tortor
            varius fermentum turpis nunc id nec ut cursus at. Vitae habitant id
            lorem amet aliquam.
          </Text>
        </View>
        <View
          style={{
            width: "100%",
            borderBottomWidth: 1,
            borderBottomColor: "#d1d1d1",
            paddingVertical: 10,
          }}
        >
          <Text type="bold" size="label" style={{ marginBottom: 5 }}>
            {t("accommodation")}
          </Text>
          <Text
            size="description"
            type="regular"
            style={{
              // fontFamily: "Lato-Regular",
              // fontSize: 14,
              textAlign: "justify",
              color: "#6c6c6c",
            }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tortor
            varius fermentum turpis nunc id nec ut cursus at. Vitae habitant id
            lorem amet aliquam.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
