import React from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {Text} from '../../component';
import {default_image} from '../../assets/png';
import {useQuery} from '@apollo/react-hooks';
import BerandaPackage from '../../graphQL/Query/Home/BerandaPackage';
import {useTranslation} from 'react-i18next';

export default function TourPackage({props}) {
  const {t, i18n} = useTranslation();
  const {data, loading, error} = useQuery(BerandaPackage);
  const tourdetail = (item) => {
    props.navigation.navigate('tourdetail', {data: item, exParam: true});
  };
  return (
    <View>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          marginTop: 10,
          flexDirection: 'row',
        }}>
        <Text
          size="label"
          type="bold"
          style={{
            alignSelf: 'flex-start',
          }}>
          {t('tourPackage')}
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
        <Text style={{color: '#AAAAAA'}}>{t('internationalAndDomestic')}</Text>
        <Text
          onPress={() => props.navigation.navigate('PackageTour')}
          type="regular"
          size="description"
          style={{color: '#209FAE'}}>
          {t('viewAll')}
        </Text>
      </View>

      <View
        style={{
          alignSelf: 'center',
          alignContent: 'center',
          justifyContent: 'center',
          marginVertical: 15,
          width: Dimensions.get('window').width - 40,
          flexDirection: 'row',
          marginBottom: 30,
        }}>
        <View
          style={{
            // flex: 1,
            alignItems: 'center',
            justifyContent: 'space-evenly',
            marginRight: 5,
          }}>
          <ImageBackground
            style={{
              flex: 1,
              width: (Dimensions.get('window').width - 50) / 2,
              height: (Dimensions.get('window').width - 135) / 2,
              borderRadius: 10,
              marginBottom: 5,
            }}
            imageStyle={styles.destinationImage}
            source={
              data &&
              data.beranda_package &&
              data.beranda_package.length > 0 &&
              data.beranda_package[0].cover
                ? {uri: data.beranda_package[0].cover}
                : default_image
            }>
            <TouchableOpacity
              onPress={() =>
                tourdetail(
                  data &&
                    data.beranda_package &&
                    data.beranda_package.length > 0
                    ? data.beranda_package[0]
                    : null,
                )
              }>
              <View
                style={{
                  width: (Dimensions.get('window').width - 50) / 2,
                  height: (Dimensions.get('window').width - 135) / 2,
                  borderRadius: 10,
                  backgroundColor: 'rgba(20,20,20,0.4)',
                }}>
                <View
                  style={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    flexDirection: 'column',
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Lato-Bold',
                      color: 'white',
                    }}>
                    {data &&
                    data.beranda_package &&
                    data.beranda_package.length > 0
                      ? data.beranda_package[0].name
                      : 'Name'}
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'Lato-Bold',
                      color: 'white',
                    }}>
                    {data &&
                    data.beranda_package &&
                    data.beranda_package.length > 0
                      ? data.beranda_package[0].day +
                        'D' +
                        data.beranda_package[0]?.night +
                        'N '
                      : 'Duration'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </ImageBackground>

          <ImageBackground
            style={{
              flex: 1,
              width: (Dimensions.get('window').width - 50) / 2,
              height: (Dimensions.get('window').width - 135) / 2,
              borderRadius: 10,
            }}
            imageStyle={styles.destinationImage}
            source={
              data &&
              data.beranda_package &&
              data.beranda_package.length > 1 &&
              data.beranda_package[1].cover
                ? {uri: data.beranda_package[1].cover}
                : default_image
            }>
            <TouchableOpacity
              onPress={() =>
                tourdetail(
                  data &&
                    data.beranda_package &&
                    data.beranda_package.length > 1
                    ? data.beranda_package[1]
                    : null,
                )
              }>
              <View
                style={{
                  width: (Dimensions.get('window').width - 50) / 2,
                  height: (Dimensions.get('window').width - 135) / 2,
                  borderRadius: 10,
                  backgroundColor: 'rgba(20,20,20,0.4)',
                }}>
                <View
                  style={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    flexDirection: 'column',
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Lato-Bold',
                      color: 'white',
                    }}>
                    {data &&
                    data.beranda_package &&
                    data.beranda_package.length > 1
                      ? data.beranda_package[1].name
                      : 'Name'}
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'Lato-Bold',
                      color: 'white',
                    }}>
                    {data &&
                    data.beranda_package &&
                    data.beranda_package.length > 1
                      ? data.beranda_package[1].day +
                        'D' +
                        data.beranda_package[1]?.night +
                        'N '
                      : 'Duration'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </ImageBackground>
        </View>

        <View style={{}}>
          <TouchableOpacity
            onPress={() =>
              tourdetail(
                data && data.beranda_package && data.beranda_package.length > 2
                  ? data.beranda_package[2]
                  : null,
              )
            }>
            <ImageBackground
              source={
                data &&
                data.beranda_package &&
                data.beranda_package.length > 2 &&
                data.beranda_package[2].cover
                  ? {uri: data.beranda_package[2].cover}
                  : default_image
              }
              style={{
                width: (Dimensions.get('window').width - 50) / 2,
                height: Dimensions.get('window').width - 130,

                borderRadius: 10,
                backgroundColor: 'rgba(20,20,20,0.4)',
              }}
              imageStyle={styles.destinationImage}>
              <View
                style={{
                  width: (Dimensions.get('window').width - 50) / 2,
                  height: Dimensions.get('window').width - 130,
                  borderRadius: 10,
                  backgroundColor: 'rgba(20,20,20,0.4)',
                }}>
                <View
                  style={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    flexDirection: 'column',
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Lato-Bold',
                      color: 'white',
                    }}>
                    {data &&
                    data.beranda_package &&
                    data.beranda_package.length > 2
                      ? data.beranda_package[2].name
                      : 'Name'}
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'Lato-Bold',
                      color: 'white',
                    }}>
                    {data &&
                    data.beranda_package &&
                    data.beranda_package.length > 2
                      ? data.beranda_package[2].day +
                        'D' +
                        data.beranda_package[2]?.night +
                        'N '
                      : 'Duration'}
                  </Text>
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    paddingTop: -5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  menu: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50 / 2,
    backgroundColor: '#E2ECF8',
  },
  menuImage: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },

  destinationMainImageContainer: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    backgroundColor: 'rgba(20,20,20,0.4)',
  },
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
  accountButton: {
    width: Dimensions.get('window').width / 3.6,
    borderRadius: 5,
    height: 30,
  },
  buttonText: {
    fontSize: 12,
    fontFamily: 'lato-semibold',
  },
});
