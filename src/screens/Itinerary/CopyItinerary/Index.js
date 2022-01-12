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
import { Bottom, Xhitam, Xwhite } from "../../../assets/svg";
import { Input, Item, Label } from "native-base";
import Modal from "react-native-modal";
import { useTranslation } from "react-i18next";
import DatePicker from "react-native-modern-datepicker";
import { getToday } from "react-native-modern-datepicker";
import DropDownPicker from "react-native-dropdown-picker";
import ItineraryCategory from "../../../graphQL/Query/Itinerary/ItineraryCategory";
import { useLazyQuery, useMutation } from "@apollo/client";
import { dateFormats } from "../../../component/src/dateformatter";
import saveCopy from "../../../graphQL/Mutation/Itinerary/CopyItinerary";
import { StackActions } from "@react-navigation/routers";
import { useSelector } from "react-redux";

const Tab = createMaterialTopTabNavigator();

export default function CopyItinerary(props) {
  const { t, i18n } = useTranslation();
  let [modal, setModal] = useState(false);
  let [startDate, setStartDate] = useState(getToday());
  let [endDate, setEndDate] = useState(null);
  let [dataCategories, setdataCategories] = useState([]);
  let [title, setTitle] = useState(props.route?.params?.datadetail?.name);
  let [minimum, setMinimum] = useState("");
  let [opens, setOpens] = useState(0);
  let [category_id, setcategory_id] = useState(
    props.route?.params?.datadetail?.categori?.id
      ? props.route?.params?.datadetail?.categori?.id
      : "a47944f4-a2e1-4eae-83d1-5bf001475074"
  );
  const token = useSelector((data) => data.token);

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
          marginRight: 10,
        }}
      >
        <Xwhite height={13} width={13}></Xwhite>
      </Button>
    ),
    headerLeft: () => (
      <View>
        <Text
          size={"title"}
          type={"bold"}
          style={{
            color: "#fff",
            marginLeft: 10,
          }}
        >
          {t("copyItinerary")}
        </Text>
      </View>
    ),
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    getkategori();
  }, []);

  const setstart = async (x) => {
    await setStartDate(x);
    await setEndDate(new Date(x));
    await setMinimum(x);
    await setModal(false);
    {
      endDate ? setdur(x, endDate) : null;
    }
  };

  const [
    getkategori,
    { data: dataCategory, loading: loadingCategory, error: errorCategory },
  ] = useLazyQuery(ItineraryCategory, {
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
      },
    },
    onCompleted: () => {
      let tempdata = [];
      for (var i of dataCategory?.category_journal) {
        tempdata.push({
          label: i.name,
          value: i.id,
        });
      }
      setdataCategories(tempdata);
    },
  });

  const [
    mutationSave,
    { loading: LoadingSave, data: dataSave, error: errorSave },
  ] = useMutation(saveCopy, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
  });

  const _handlesave = async () => {
    console.log({
      itinerary_id: props.route.params.idiItin,
      start_date: startDate,
      title: title,
      category_id: category_id,
    });
    try {
      let response = await mutationSave({
        variables: {
          itinerary_id: props.route.params.idiItin,
          start_date: startDate,
          title: title,
          category_id: category_id,
        },
      });
      if (LoadingSave) {
        // setLoadingApp(true);
      }
      if (errorSave) {
        throw new Error("Error Input");
      }
      console.log(response);
      if (response.data) {
        if (response.data.duplicate_itinerary.code !== 200) {
          throw new Error(response.data.duplicate_itinerary.message);
        } else {
          props.navigation.dispatch(
            StackActions.replace("ItineraryStack", {
              screen: "itindetail",
              params: {
                country: response.data.duplicate_itinerary.id,
                token: token,
                status: "edit",
              },
            })
          );
        }
      }
      // setLoadingApp(false);
    } catch (error) {
      console.log(error);

      Alert.alert("" + error);
      // setLoadingApp(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: "#fff",
      }}
    >
      <View>
        <Text type="bold" size="title">
          {t("holdoncopyitinerary")}
        </Text>
      </View>
      <View
        style={{
          paddingTop: 2,
        }}
      >
        <Text size="label">{t("settitle&trip")}</Text>
      </View>

      <View
        style={{
          alignContent: "center",
          paddingVertical: 15,
          // paddingHorizontal: 5,
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
            value={title}
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

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 15,
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
            <View>
              <Text
                size="label"
                type="regular"
                style={
                  {
                    // color: duration > 0 ? "#464646" : "#E4E4E4",
                  }
                }
              >
                {props.route?.params?.datadetail?.day?.length} {t("days")}
              </Text>
              <Text
                size="description"
                style={{
                  color: "#d3d3d3",
                }}
              >
                Max. 30 {t("days")}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            marginTop: 10,
            paddingBottom: opens,
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
            onOpen={() => setOpens(150)}
            onClose={() => setOpens(0)}
            items={dataCategories}
            containerStyle={{ height: 40 }}
            style={{ backgroundColor: "#fafafa" }}
            itemStyle={{
              justifyContent: "flex-start",
            }}
            showArrow={false}
            dropDownStyle={{ backgroundColor: "#fafafa", height: 150 }}
            placeholder={t("selectCategory")}
            // multiple={true}
            // multipleText="%d items have been selected."
            // min={0}
            // max={2}
            onChangeItem={(item) => setcategory_id(item.value)}
          />
        </View>
      </View>
      <Button
        onPress={() => {
          _handlesave();
        }}
        text={t("save")}
        color="secondary"
        style={{
          marginTop: 25,
        }}
      ></Button>
    </View>
  );
}

const styles = StyleSheet.create({});
