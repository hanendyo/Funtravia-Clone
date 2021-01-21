import React from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Linking,
  Dimensions,
} from "react-native";
import {
  InstagramGrey,
  Phone,
  OpenAt,
  Website,
  FacebookGrey,
} from "../../../assets/png";
import LinearGradient from "react-native-linear-gradient";
const dimensions = Dimensions.get("window");
const barWidth = dimensions.width - 60;
import { useTranslation } from "react-i18next";
import { Text, Button } from "../../../component";
export default function InformasiUmum({ data, tittle }) {
  const { t, i18n } = useTranslation();

  return (
    <View style={{ marginBottom: 10 }}>
      <LinearGradient
        colors={["rgba(032, 159, 174,0.8)", "rgb(255, 255, 255)"]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: barWidth,
          marginLeft: 5,
          marginBottom: 10,
        }}
      >
        <Text
          size="title"
          type="bold"
          style={{
            // fontSize: (18),
            marginVertical: 10,
            paddingLeft: 20,
            // fontFamily: 'lato-bold',
            color: "#FFFFFF",
          }}
        >
          {tittle}
        </Text>
      </LinearGradient>
      <View style={{ marginHorizontal: 20 }}>
        {data && data.phone1 ? (
          <View
            style={{
              flexDirection: "row",
              marginVertical: 5,
            }}
          >
            <Image
              source={Phone}
              style={{
                width: 15,
                height: 15,
                alignSelf: "center",
                marginHorizontal: 5,
              }}
            />
            <Text
              type="regular"
              size="description"
              style={{
                paddingHorizontal: 5,
                color: "#464646",
                // fontFamily: 'lato-reg',
                // fontSize: (13),
              }}
            >
              {data ? data.phone1 : "-"}
            </Text>
          </View>
        ) : null}
        {data && data.website ? (
          <TouchableOpacity
            onPress={() => Linking.openURL(data.website)}
            style={{
              flexDirection: "row",
              marginVertical: 5,
            }}
          >
            <Image
              source={Website}
              style={{
                width: 15,
                height: 15,
                alignSelf: "center",
                marginHorizontal: 5,
              }}
            />
            <Text
              size="description"
              type="regular"
              style={{
                paddingHorizontal: 5,
                color: "#464646",
                // fontFamily: 'lato-reg',
                // fontSize: (13),
              }}
            >
              {data ? data.website : "-"}
            </Text>
          </TouchableOpacity>
        ) : null}
        {data && data.instagram ? (
          <View
            style={{
              flexDirection: "row",
              marginVertical: 5,
            }}
          >
            <Image
              source={InstagramGrey}
              style={{
                width: 15,
                height: 15,
                alignSelf: "center",
                marginHorizontal: 5,
              }}
            />
            <Text
              type="regular"
              size="description"
              style={{
                paddingHorizontal: 5,
                color: "#464646",
                // fontFamily: 'lato-reg',
                // fontSize: (13),
              }}
            >
              {data ? data.instagram : "-"}
            </Text>
          </View>
        ) : null}
        {data && data.facebook ? (
          <View
            style={{
              flexDirection: "row",
              marginVertical: 5,
            }}
          >
            <Image
              source={FacebookGrey}
              style={{
                width: 15,
                height: 15,
                alignSelf: "center",
                marginHorizontal: 5,
              }}
            />
            <Text
              type="regular"
              size="description"
              style={{
                paddingHorizontal: 5,
                color: "#464646",
                // fontFamily: 'lato-reg',
                // fontSize: (13),
              }}
            >
              {data ? data.facebook : "-"}
            </Text>
          </View>
        ) : null}
        <View
          style={{
            flexDirection: "row",
            marginVertical: 5,
          }}
        >
          <Image
            source={OpenAt}
            style={{
              width: 15,
              height: 15,
              alignSelf: "center",
              marginHorizontal: 5,
            }}
          />
          <Text
            type="regular"
            size="description"
            style={{
              paddingHorizontal: 5,
              color: "#464646",
              // fontFamily: 'lato-reg',
              // fontSize: (13),
            }}
          >
            {data ? data.openat : "-"}
          </Text>
        </View>
      </View>
    </View>
  );
}
