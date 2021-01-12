import React from 'react';
import {View, TouchableOpacity, Alert, StyleSheet} from 'react-native';
import {ServiceIcon, EventIcon, DestinationIcon} from '../../assets/svg';
import {Text} from '../../component';
import {useTranslation} from 'react-i18next';
import Svg, {Use, Image} from 'react-native-svg';

export default function MenuNew({props}) {
  const {t} = useTranslation();

  return (
    <View style={styles.menuView}>
      <View
        style={{
          width: '25%',
          height: 80,
          marginBottom: 5,
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={styles.menu}
          onPress={() => props.navigation.navigate('DestinationList')}>
          <DestinationIcon width="35" height="35" />
        </TouchableOpacity>
        <Text
          type="bold"
          size="description"
          style={{
            marginTop: 15,
            textAlign: 'center',
          }}>
          {t('Destination')}
        </Text>
      </View>
      <View
        style={{
          width: '25%',
          height: 80,
          marginBottom: 5,
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={styles.menu}
          onPress={() => props.navigation.navigate('listevent')}>
          <EventIcon width="35" height="35" />
        </TouchableOpacity>
        <Text
          type="bold"
          size="description"
          style={{
            marginTop: 15,
            textAlign: 'center',
          }}>
          {t('Event')}
        </Text>
      </View>
      <View
        style={{
          width: '25%',
          height: 80,
          marginBottom: 5,
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={styles.menu}
          onPress={() => props.navigation.navigate('TravelGoal')}>
          <ServiceIcon width="35" height="35" />
        </TouchableOpacity>
        <Text
          type="bold"
          size="description"
          style={{
            marginTop: 15,
            textAlign: 'center',
          }}>
          {t('Travel Goal')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  menu: {
    width: 75,
    height: 75,
    backgroundColor: 'rgba(218,240,242,0.36)',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    borderRadius: 75 / 2,
    borderColor: 'transparent',
  },
  menuView: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
    paddingTop: 20,
    marginBottom: 20,
  },
});
