import { Item, Label, Input } from "native-base";
import React, { useState, useEffect } from "react";
import {
  Dimensions,
  Platform,
  Text,
  FlatList,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Image,
  Alert,
} from "react-native";
import Modal from "react-native-modal";

import { back_arrow_white, default_image, Menuputih } from "../../../const/Png";
import {
  Arrowbackwhite,
  FlightHeader,
  OptionsVertWhite,
  Pointmapgray,
  WhiteCheck,
  Xhitam,
} from "../../../const/Svg";
import { CustomImage } from "../../../core-ui";

import { Airport } from "../../../const/Airport";
import { NavigationEvents } from "react-navigation";

export default function searchFlight(props) {
  let [Datas, setData] = useState(Airport);
  let [dataFilter, setDataFilter] = useState([]);
  let [texts, settext] = useState("");
  let position = props.route.params.position;

  let [state, setState] = useState(props.route.params.history);

  const filterData = (x) => {
    // console.log(x);
    settext(x);
    var datafilter = Datas.filter((item) => item.city.includes(x));
    if (datafilter) {
      // console.log(datafilter);
      setDataFilter(datafilter);
    }
  };

  const trigger = (item) => {
    var tempdata = { ...state };
    if (position === "Destination") {
      tempdata.from = item;
    } else {
      tempdata.to = item;
    }

    props.navigation.navigate("Flighting", {
      kiriman: tempdata,
    });
  };

  const _refresh = () => {
    settext("");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationEvents onDidFocus={() => _refresh()} />

      <View
        style={{
          width: Dimensions.get("screen").width,

          height: Dimensions.get("screen").height,
          backgroundColor: "white",
          // borderRadius: 5,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          paddingHorizontal: 20,
          // paddingVertical: 10,
        }}
      >
        <View
          style={{
            marginVertical: 20,
            borderRadius: 5,
            height: 40,
            alignItems: "center",
            alignContent: "center",
            flexDirection: "row",
            backgroundColor: "#f3f3f3",
            paddingHorizontal: 10,
          }}
        >
          <Pointmapgray height={15} width={15} />
          <Input
            style={{
              fontFamily: "Lato-Regular",
              fontSize: 18,
              marginLeft: 5,
            }}
            returnKeyType="search"
            autoCorrect={false}
            value={texts}
            onChangeText={(c) => {
              // console.log('tai');
              filterData(c);
            }}
            // onSubmitEditing={}
            keyboardType="default"
            autoFocus={true}
          />
        </View>

        {dataFilter && dataFilter.length > 0 ? (
          <FlatList
            style={{
              // position: 'absolute',
              // top: 60,
              width: "100%",

              height: "100%",
            }}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => `${index}`}
            data={dataFilter}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  // backgroundColor: 'white',
                  width: "100%",
                  padding: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: "#d3d3d3",
                }}
                onPress={() => trigger(item)}
              >
                <Text
                  style={{
                    fontFamily: "Lato-Bold",
                    fontSize: 18,
                  }}
                >
                  {item.city}
                </Text>
                <Text
                  style={{
                    fontFamily: "Lato-Regular",
                    fontSize: 14,
                  }}
                >
                  {item.code} - {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
        ) : null}
      </View>
    </SafeAreaView>
  );
}

searchFlight.navigationOptions = (props) => ({
  // headerTransparent: true,
  headerTitle: props.route.params.position,
  headerMode: "screen",
  headerStyle: {
    backgroundColor: "#209FAE",
    elevation: 0,
    borderBottomWidth: 0,
    // fontSize: 50,
    // justifyContent: 'center',
    // flex:1,
  },
  headerTitleStyle: {
    fontFamily: "Lato-Bold",
    fontSize: 14,
    color: "white",
    alignSelf: "center",
  },
  headerLeft: (
    <TouchableOpacity
      style={{
        height: 40,
        width: 40,
        // borderWidth:1,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        // backgroundColor:'white'
      }}
      onPress={() => props.navigation.goBack()}
    >
      <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
    </TouchableOpacity>
  ),
  headerLeftContainerStyle: {
    // paddingLeft: 20,
  },
  headerRight: (
    <View style={{ flexDirection: "row" }}>
      <TouchableOpacity
        style={{
          height: 40,
          width: 40,
          // borderWidth:1,
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          // backgroundColor:'white'
        }}
        onPress={() => Alert.alert("Coming soon!")}
      >
        <OptionsVertWhite height={20} width={20} />
      </TouchableOpacity>
    </View>
  ),
  headerRightStyle: {
    // paddingRight: 20,
  },
});
