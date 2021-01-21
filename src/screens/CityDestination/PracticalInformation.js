import React, { useState, useCallback, useEffect } from "react";
import { View, ScrollView, SafeAreaView } from "react-native";
import { Arrowbackwhite, TypeC, TypeF } from "../../assets/svg";
import Ripple from "react-native-material-ripple";
import { Text, Button } from "../../component";
import { useTranslation } from "react-i18next";
import { FunIcon } from "../../component";

export default function PracticalInformation(props) {
  const HeaderComponent = {
    headerShown: true,
    title: "Practical Information",
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: "Practical Information",
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
  const [actives, setActives] = useState("Electricity");
  const { t, i18n } = useTranslation();

  const Rendercontent = ({ active }) => {
    if (active === "Electricity") {
      return (
        <View
          style={{
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
            <Text
              size="description"
              type="regular"
              style={{ color: "#d1d1d1" }}
            >
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
            <Text
              type="regular"
              size="description"
              style={{ color: "#d1d1d1" }}
            >
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
                amet, consectetur varius ermentum ut cursus at. Vitae habitant
                id lorem amet aliquam
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
                amet, consectetur varius ermentum ut cursus at. Vitae habitant
                id lorem amet aliquam
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
              varius fermentum turpis nunc id nec ut cursus at. Vitae habitant
              id lorem amet aliquam.
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
              varius fermentum turpis nunc id nec ut cursus at. Vitae habitant
              id lorem amet aliquam.
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
              varius fermentum turpis nunc id nec ut cursus at. Vitae habitant
              id lorem amet aliquam.
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
              varius fermentum turpis nunc id nec ut cursus at. Vitae habitant
              id lorem amet aliquam.
            </Text>
          </View>
        </View>
      );
    } else {
      return null;
    }
  };
  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
  }, []);
  return (
    <SafeAreaView style={{ flex: 1 }}>
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
          <Ripple
            onPress={() => {
              setActives("Electricity");
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
              type={actives == "Electricity" ? "bold" : "regular"}
              style={{
                paddingVertical: 15,
                borderBottomWidth: actives == "Electricity" ? 3 : 1,
                borderBottomColor:
                  actives == "Electricity" ? "#14646E" : "#DAF0F2",
                color: actives == "Electricity" ? "#14646E" : "#464646",
              }}
            >
              Electricity
            </Text>
          </Ripple>
          <Ripple
            onPress={() => {
              setActives("EmergencyNumber");
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
              type={actives == "EmergencyNumber" ? "bold" : "regular"}
              style={{
                paddingVertical: 15,
                borderBottomWidth: actives == "EmergencyNumber" ? 3 : 1,
                borderBottomColor:
                  actives == "EmergencyNumber" ? "#14646E" : "#DAF0F2",
                color: actives == "EmergencyNumber" ? "#14646E" : "#464646",
              }}
            >
              Emergency Number
            </Text>
          </Ripple>
          <Ripple
            onPress={() => {
              setActives("Health");
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
              type={actives == "Health" ? "bold" : "regular"}
              style={{
                borderBottomWidth: actives == "Health" ? 3 : 1,
                borderBottomColor: actives == "Health" ? "#14646E" : "#DAF0F2",
                paddingVertical: 15,
                color: actives == "Health" ? "#14646E" : "#464646",
              }}
            >
              Health
            </Text>
          </Ripple>
          <Ripple
            onPress={() => {
              setActives("Language");
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
              type={actives == "Language" ? "bold" : "regular"}
              style={{
                borderBottomWidth: actives == "Language" ? 3 : 1,
                borderBottomColor:
                  actives == "Language" ? "#14646E" : "#DAF0F2",
                paddingVertical: 15,
                color: actives == "Language" ? "#14646E" : "#464646",
              }}
            >
              Language
            </Text>
          </Ripple>
          <Ripple
            onPress={() => {
              setActives("Money");
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
              type={actives == "Money" ? "bold" : "regular"}
              style={{
                borderBottomWidth: actives == "Money" ? 3 : 1,
                borderBottomColor: actives == "Money" ? "#14646E" : "#DAF0F2",
                paddingVertical: 15,
                color: actives == "Money" ? "#14646E" : "#464646",
              }}
            >
              Money
            </Text>
          </Ripple>
          <Ripple
            onPress={() => {
              setActives("Visa");
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
              type={actives == "Visa" ? "bold" : "regular"}
              style={{
                borderBottomWidth: actives == "Visa" ? 3 : 1,
                borderBottomColor: actives == "Visa" ? "#14646E" : "#DAF0F2",
                paddingVertical: 15,
                color: actives == "Visa" ? "#14646E" : "#464646",
              }}
            >
              Visa & Passport
            </Text>
          </Ripple>
          <Ripple
            onPress={() => {
              setActives("TimeZone");
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
              type={actives == "TimeZone" ? "bold" : "regular"}
              style={{
                borderBottomWidth: actives == "TimeZone" ? 3 : 1,
                borderBottomColor:
                  actives == "TimeZone" ? "#14646E" : "#DAF0F2",
                paddingVertical: 15,
                color: actives == "TimeZone" ? "#14646E" : "#464646",
              }}
            >
              Time Zone
            </Text>
          </Ripple>
          <Ripple
            onPress={() => {
              setActives("Taxes");
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
              type={actives == "Taxes" ? "bold" : "regular"}
              style={{
                borderBottomWidth: actives == "Taxes" ? 3 : 1,
                borderBottomColor: actives == "Taxes" ? "#14646E" : "#DAF0F2",
                paddingVertical: 15,
                color: actives == "Taxes" ? "#14646E" : "#464646",
              }}
            >
              Taxes & Tipping
            </Text>
          </Ripple>
        </ScrollView>
        <Rendercontent active={actives} />
      </ScrollView>
    </SafeAreaView>
  );
}
