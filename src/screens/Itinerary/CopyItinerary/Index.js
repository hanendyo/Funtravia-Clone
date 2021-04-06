import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Picker,
} from "react-native";
import { Button, Loading, Text } from "../../../component";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Bottom, Xhitam } from "../../../assets/svg";
import { Input, Item, Label } from "native-base";
import Modal from "react-native-modal";
import { useTranslation } from "react-i18next";
import DatePicker from "react-native-modern-datepicker";
import { getToday } from "react-native-modern-datepicker";
import DropDownPicker from "react-native-dropdown-picker";

const Tab = createMaterialTopTabNavigator();

export default function CopyItinerary(props) {
  const { t, i18n } = useTranslation();
  let [modal, setModal] = useState(false);
  let [modalEnd, setModalEnd] = useState(false);
  let [startDate, setStartDate] = useState(null);
  let [endDate, setEndDate] = useState(null);
  let [duration, setDuration] = useState(1);
  let [dataCategories, setdataCategories] = useState([]);

  const jam = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
  ];

  const HeaderComponent = {
    headerShown: true,
    title: "",
    // headerTransparent: true,
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

    headerRightStyle: {},
    headerRight: () => (
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
        <Xhitam height={15} width={15}></Xhitam>
      </Button>
    ),
    headerLeft: () => (
      <View>
        <Text
          size={"title"}
          type={"bold"}
          style={{
            color: "#fff",
          }}
        >
          Copy Itinerary
        </Text>
      </View>
    ),
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        padding: 15,
      }}
    >
      <Text type="bold" size="label">
        Hold up! Before you continue
      </Text>
      <Text size="label">Please set title and date of the trip</Text>
      <View
        style={{
          alignContent: "center",
          width: "100%",
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
            {t("TitleofyourTrip")}
          </Label>
          <Input
            autoCorrect={false}
            // value={title}
            onChangeText={(text) => setTitle(text)}
            style={{
              fontFamily: "Lato-Regular",
              fontSize: 16,
            }}
            keyboardType="default"
          />
        </Item>
        {/* date start */}
        <Modal
          onRequestClose={() => setModal(false)}
          onBackdropPress={() => setModal(false)}
          onDismiss={() => setModal(false)}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          isVisible={modal}
          style={{
            // backgroundColor: 'rgba(47, 47, 47, 0.75)',
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
            alignContent: "center",
            width: Dimensions.get("screen").width,
            paddingHorizontal: 20,
            // height: Dimensions.get('screen').height,
          }}
        >
          <DatePicker
            options={{}}
            current={startDate ? startDate : getToday()}
            selected={startDate ? startDate : getToday()}
            minimumDate={getToday()}
            maximumDate={endDate}
            onDateChange={(x) => setstart(x)}
            mode="calendar"
            minuteInterval={30}
            style={{ borderRadius: 10 }}
          />
          {/* </View> */}
        </Modal>
        {/* date end */}
        <Modal
          onRequestClose={() => setModalEnd(false)}
          onBackdropPress={() => setModalEnd(false)}
          onSwipeComplete={() => setModalEnd(false)}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          isVisible={modalEnd}
          style={{
            // backgroundColor: 'rgba(47, 47, 47, 0.75)',
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
            alignContent: "center",
            // width: Dimensions.get('screen').width,
            // height: Dimensions.get('screen').height,
          }}
        >
          <View
            style={{
              width: Dimensions.get("screen").width - 20,
              backgroundColor: "white",
              marginBottom: 70,
              paddingTop: 60,
              paddingHorizontal: 20,
              paddingBottom: 30,
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 20,
                left: 20,
              }}
              onPress={() => setModalEnd(false)}
            >
              <Xhitam width={15} height={15} />
            </TouchableOpacity>
            <Text size="description" type="bold" style={{}}>
              {t("duration")}
            </Text>
            <View
              style={{
                width: "100%",
                // borderWidth: 1,
                flexDirection: "row",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <View style={{ width: "50%" }}>
                <Picker
                  iosIcon={
                    <View>
                      <Bottom />
                    </View>
                  }
                  iosHeader="Select Hours"
                  note
                  mode="dropdown"
                  selectedValue={duration}
                  textStyle={{ fontFamily: "Lato-Regular" }}
                  itemTextStyle={{ fontFamily: "Lato-Regular" }}
                  itemStyle={{ fontFamily: "Lato-Regular" }}
                  placeholderStyle={{ fontFamily: "Lato-Regular" }}
                  headerTitleStyle={{
                    fontFamily: "Lato-Regular",
                  }}
                  style={{
                    color: "#209fae",
                    fontFamily: "Lato-Regular",
                  }}
                  onValueChange={(itemValue, itemIndex) => {
                    let dat = new Date(startDate);
                    dat.setDate(dat.getDate() + itemValue);
                    setEndDate(dat);
                    setDuration(itemValue);
                  }}
                >
                  {jam.map((item, index) => {
                    return (
                      <Picker.Item
                        key={""}
                        label={item + " " + t("days")}
                        value={item}
                      />
                    );
                  })}
                </Picker>
              </View>
            </View>
          </View>
          {/* <TouchableOpacity
										style={{
											alignSelf: 'flex-end',
											height: 30,
											width: 30,
											zIndex: 999,
											marginBottom: 20,
											alignItems: 'center',
											justifyContent: 'center',
										}}
										onPress={() => setModalEnd(false)}>
										<Xgray height={20} width={20} />
									</TouchableOpacity> */}
          {/* <DatePicker
                    options={{}}
                    current={endDate ? endDate : minimum}
                    selected={endDate ? endDate : minimum}
                    minimumDate={minimum}
                    onDateChange={(x) => setEnd(x)}
                    mode="calendar"
                    minuteInterval={30}
                    style={{ borderRadius: 10 }}
                  /> */}
        </Modal>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <View
            style={{
              width: "40%",
              //  marginTop: 10
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
                  color: "#464646",
                }}
              >
                {t("StartDate")}
              </Label>
              <Input
                autoCorrect={false}
                editable={false}
                value={startDate ? dateFormats(startDate) : ""}
                style={{
                  fontFamily: "Lato-Regular",
                  fontSize: 16,
                }}
                keyboardType="default"
              />
            </Item>

            <TouchableOpacity
              style={{
                top: 0,
                left: 0,
                position: "absolute",
                height: "100%",
                width: "100%",
              }}
              onPress={() => setModal(true)}
            ></TouchableOpacity>
          </View>

          <View
            style={{
              width: "40%",
              height: 70,
              paddingTop: 5,
              justifyContent: "space-between",
            }}
          >
            <Text
              size="label"
              type="regular"
              style={
                {
                  // color: 'E4E4E4',
                }
              }
            >
              {t("duration")}
            </Text>
            <TouchableOpacity
              onPress={() => (startDate ? setModalEnd(true) : null)}
            >
              <Text
                size="label"
                type="regular"
                style={
                  {
                    // color: duration > 0 ? "#464646" : "#E4E4E4",
                  }
                }
              >
                {duration} {t("days")}
              </Text>
              <Text
                size="description"
                style={{
                  color: "#d3d3d3",
                }}
              >
                Max. 30 {t("days")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            marginTop: 10,
          }}
        >
          <Text
            size="label"
            style={{
              marginBottom: 5,
            }}
          >
            {t("Category")}
          </Text>
          <DropDownPicker
            items={dataCategories}
            defaultValue={null}
            containerStyle={{ height: 40 }}
            style={{ backgroundColor: "#fafafa" }}
            itemStyle={{
              justifyContent: "flex-start",
            }}
            showArrow={false}
            dropDownStyle={{ backgroundColor: "#fafafa", height: 100 }}
            placeholder={t("selectCategory")}
            // multiple={true}
            // multipleText="%d items have been selected."
            // min={0}
            // max={2}
            onChangeItem={(item) => setcategory_id(item.value)}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
