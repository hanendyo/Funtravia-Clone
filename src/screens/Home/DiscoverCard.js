import React from 'react';
import {
  View,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  Travel_Ideas,
  Travel_Itinerary,
  Travel_Journal,
} from '../../assets/ilustration';
import {Text} from '../../component';

export default function DiscoverCard({props}) {
  let discoverCardsData = [
    {
      id: 1,
      text: 'Travel Ideas',
      background_image: Travel_Ideas,
    },
    {
      id: 2,
      text: 'Itinerary',
      background_image: Travel_Itinerary,
    },
    {
      id: 3,
      text: 'Travel Journal',
      background_image: Travel_Journal,
    },
  ];

  return (
    <View
      style={{
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View
        style={{
          width: '95%',
          alignSelf: 'center',
          marginTop: 10,
          justifyContent: 'space-evenly',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <TouchableOpacity key={discoverCardsData[0].id} onPress={() => null}>
          <ImageBackground
            source={discoverCardsData[0].background_image}
            style={{
              height: Dimensions.get('screen').height * 0.21 + 20,
              width: Dimensions.get('screen').width * 0.3 - 7,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
            imageStyle={{borderRadius: 10}}
            resizeMode="cover">
            <Text
              size="label"
              type="bold"
              style={{
                color: '#FFFFFF',
                textAlign: 'center',
                paddingBottom: 25,
              }}>
              {discoverCardsData[0].text}
            </Text>
          </ImageBackground>
        </TouchableOpacity>

        <TouchableOpacity
          key={discoverCardsData[1].id}
          onPress={() => props.navigation.navigate('PackageTour')}>
          <ImageBackground
            source={discoverCardsData[1].background_image}
            style={{
              height: Dimensions.get('screen').height * 0.21 + 20,
              width: Dimensions.get('screen').width * 0.3 - 7,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
            imageStyle={{borderRadius: 10}}
            resizeMode="cover">
            <Text
              size="label"
              type="bold"
              style={{
                color: '#FFFFFF',
                textAlign: 'center',
                paddingBottom: 25,
              }}>
              {discoverCardsData[1].text}
            </Text>
          </ImageBackground>
        </TouchableOpacity>

        <TouchableOpacity
          key={discoverCardsData[2].id}
          onPress={() => props.navigation.navigate('Journal')}>
          <ImageBackground
            source={discoverCardsData[2].background_image}
            style={{
              height: Dimensions.get('screen').height * 0.21 + 20,
              width: Dimensions.get('screen').width * 0.3 - 7,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
            imageStyle={{borderRadius: 10}}
            resizeMode="cover">
            <Text
              size="label"
              type="bold"
              style={{
                color: '#FFFFFF',
                textAlign: 'center',
                paddingBottom: 25,
              }}>
              {discoverCardsData[2].text}
            </Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  destinationMainImageContainer: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  destinationMainImage: {
    resizeMode: 'cover',
    borderRadius: 10,
    backgroundColor: 'black',
  },
  destinationImage: {
    resizeMode: 'cover',
    borderRadius: 10,
  },
});
