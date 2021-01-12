import React, {useState, useCallback} from 'react';
import {
  View,
  ImageBackground,
  Dimensions,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {bali1, bali2, bali3, bali4} from '../../../const/photo';
import {Text, Button} from '../../component';
import {useTranslation} from 'react-i18next';

const refImages = [
  {
    id: '1',
    name: 'Vacation To Bali Island',
    desc: 'Funtravia',
    image: bali1,
  },
  {
    id: '2',
    name: 'Komodo Island Is Fun',
    desc: 'Funtravia',
    image: bali2,
  },
  {
    id: '3',
    name: 'Raja Ampat The Best View',
    desc: 'Funtravia',
    image: bali3,
  },
  {
    id: '4',
    name: 'Lembang Culinary',
    desc: 'Funtravia',
    image: bali4,
  },
];
export default function PopularItinerary({props}) {
  const {t, i18n} = useTranslation();

  let [selected] = useState(new Map());
  const onSelect = useCallback(
    (id, name) => {
      props.navigation.navigate('detailStack', {
        id: id,
        name: name,
      });
    },
    [selected],
  );
  const RenderRefImg = ({id, desc, name, image, onSelect, selected}) => {
    return (
      <TouchableOpacity
        style={{
          // width: (110),
          height: (Dimensions.get('window').width - 40) / 2,
          width: Dimensions.get('window').width - 40,
          marginLeft: 10,
        }}
        onPress={() => props.navigation.navigate('ItineraryPlaning')}>
        <ImageBackground
          key={id}
          source={image}
          style={[
            styles.destinationImageView,
            {
              width: Dimensions.get('window').width - 40,
              height: (Dimensions.get('window').width - 40) / 2,
            },
          ]}
          imageStyle={[
            styles.destinationImage,
            {
              width: Dimensions.get('window').width - 40,
              height: (Dimensions.get('window').width - 40) / 2,
            },
          ]}>
          <View
            style={[
              styles.destinationImageView,
              {
                zIndex: 99,
                width: Dimensions.get('window').width - 40,
                height: (Dimensions.get('window').width - 40) / 2,
                flexDirection: 'row',
                alignItems: 'center',
                alignContent: 'center',
                justifyContent: 'center',
                flexWrap: 'wrap',
              },
            ]}>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Text
                size="title"
                type="black"
                style={{
                  color: '#ffff',
                  letterSpacing: 0.5,
                  marginVertical: 5,
                }}>
                {name}
              </Text>
              <Text
                size="label"
                type="bold"
                style={{
                  color: '#ffff',
                  letterSpacing: 0.5,
                  fontSize: 13,
                  marginVertical: 5,
                }}>
                {desc}
              </Text>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };
  return (
    <View>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          marginTop: 20,
          flexDirection: 'row',
        }}>
        <Text
          size="label"
          type="bold"
          style={{
            alignSelf: 'flex-start',
          }}>
          {t('popularItinerarySuggestion')}
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
        }}>
        <Text style={{color: '#AAAAAA'}}>{t('hereAre')}</Text>
      </View>
      <FlatList
        contentContainerStyle={{
          marginTop: 20,
          justifyContent: 'space-evenly',
          paddingStart: 10,
          paddingEnd: 20,
        }}
        horizontal={true}
        data={refImages}
        renderItem={({item}) => (
          <RenderRefImg
            id={item.id}
            name={item.name}
            desc={item.desc}
            image={item.image}
            onSelect={onSelect}
            selected={!!selected.get(item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        extraData={selected}
      />
      <View
        style={{
          margin: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
        <Button
          onPress={() =>
            // props.navigation.navigate('')

            Alert.alert(t('comingSoon'))
          }
          text={t('exploreMore')}
          style={{
            width: Dimensions.get('window').width / 1.12,
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  destinationMainImage: {
    resizeMode: 'cover',
    borderRadius: 10,
    backgroundColor: 'black',
  },

  destinationImageView: {
    width: 110,
    height: 110,
    marginRight: 5,
    borderRadius: 10,
    backgroundColor: 'rgba(20,20,20,0.4)',
  },
  destinationImage: {
    resizeMode: 'cover',
    borderRadius: 10,
  },
});
