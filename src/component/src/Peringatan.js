import React from 'react';
import {
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Modal from 'react-native-modal';
import {Xhitam, AlerIcon} from '../../assets/svg';

export default function ImageSlide({aler, setClose}) {
  return (
    <SafeAreaView style={{flex: 1}}>
      <Modal
        animationIn="fadeIn"
        animationOut="fadeOut"
        isVisible={aler.show}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          alignContent: 'center',
        }}>
        <View
          style={{
            width: Dimensions.get('screen').width - 20,
            backgroundColor: 'white',
            paddingVertical: 20,
            paddingHorizontal: 20,
            borderRadius: 5,
          }}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
              alignContent: 'center',
            }}>
            <TouchableOpacity
              style={{
                height: 20,
                width: 20,
              }}
              onPress={() => setClose()}>
              <Xhitam width={10} height={10} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: '100%',
              justifyContent: 'space-evenly',
              alignContent: 'center',
              alignItems: 'center',
            }}>
            <AlerIcon width={50} height={50} style={{marginBottom: 5}} />
            <Text style={{fontFamily: 'lato-black', fontSize: 22}}>
              {aler.judul}
            </Text>
            <Text style={{fontFamily: 'Lato-Regular', fontSize: 16}}>
              {aler.detail}
            </Text>
          </View>

          <Text></Text>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
