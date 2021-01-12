import React from 'react';
import {
  StyleSheet,
  View,
  Platform,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Alert,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationEvents} from 'react-navigation';
import {CustomImage} from '../../core-ui';
import {facebook_vektor} from '../../const/Png';
import {useMutation} from '@apollo/react-hooks';
import * as Facebook from 'expo-facebook';
import {FB_CLIENT_ID, FB_SECRET_ID} from '../../config/config';
import FacebookGraph from '../../graphQL/Mutation/Login/Facebook';
import {useTranslation} from 'react-i18next';
import {Text} from '../../Component';
import {loading_intertwine} from '../../const/Gif';
import {LoginButton} from 'react-native-fbsdk';

export default function LoginFacebook(props) {
  const {t, i18n} = useTranslation();

  const [mutation, {loading, data, error}] = useMutation(FacebookGraph);
  const [
    mutationFB,
    {loading: loadingfb, data: datafb, error: errorfb},
  ] = useMutation(FacebookGraph);
  const facebookLogIn = async () => {
    await Facebook.initializeAsync({appId: FB_CLIENT_ID});
    const {type, token} = await Facebook.logInWithReadPermissionsAsync({
      permissions: ['public_profile', 'email'],
    });
    let pushTkn = await AsyncStorage.getItem('token');
    let response;
    // console.log(type, token);
    if (type === 'success' && token) {
      response = await mutationFB({
        variables: {
          fbtoken: token.toString(),
          token: pushTkn,
        },
      });
      // console.log(response);
      if (response) {
        if (
          response.data.login_facebook.code === 200 ||
          response.data.login_facebook.code === '200'
        ) {
          await AsyncStorage.setItem(
            'access_token',
            response.data.login_facebook.access_token,
          );
          await AsyncStorage.setItem(
            'user',
            JSON.stringify(response.data.login_facebook.user),
          );
          await AsyncStorage.setItem(
            'setting',
            JSON.stringify(response.data.login_facebook.data_setting),
          );
          props.navigation.navigate('Home');
        } else if (
          response.data.login_facebook.code === 400 ||
          response.data.login_facebook.code === '400'
        ) {
          Alert.alert('Failed', response.data.login_facebook.message);
          props.navigation.navigate('login');
        } else {
          Alert.alert('Failed', 'Failed Login With Facebook');
          props.navigation.navigate('login');
        }
      }
      // console.log(loading);
    } else {
      Alert.alert('Failed to login Facebook');
      props.navigation.navigate('login');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
      }}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      // keyboardVerticalOffset={30}
      enabled>
      <NavigationEvents onDidFocus={() => facebookLogIn()} />

      <ScrollView
        style={{
          paddingTop: 80,
        }}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}>
        <View
          style={{
            // flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <CustomImage
            customStyle={{
              alignSelf: 'center',
              width: 200,
              height: 175,
            }}
            source={facebook_vektor}
          />
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'space-evenly',
              marginVertical: 10,
            }}>
            <Text
              style={{fontSize: 25, fontFamily: 'lato-bold'}}
              type="bold"
              size="h5">
              {t('loginUsingFacebook')}
            </Text>
          </View>
          <View
            style={{
              alignContent: 'center',
              justifyContent: 'space-evenly',
              marginVertical: 10,
            }}>
            <Text
              numberOfLines={2}
              style={{
                textAlign: 'center',
              }}
              type="regular"
              size="description">
              {t('pleaseWait')}
            </Text>
            <Image
              source={loading_intertwine}
              style={{alignSelf: 'center', width: 100, height: 100}}
            />

            {/* <Text
							numberOfLines={2}
							style={{
								textAlign: 'center',
							}}
							type='regular'
							size='description'>
							{}
						</Text>*/}
          </View>
          <View
            style={{
              // marginTop: 40,
              marginBottom: 80,
              alignItems: 'center',
            }}>
            <Text>{`${t('loading')}...`}</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    margin: 50,
    alignItems: 'center',
  },
  inputTextStyle: {
    width: Dimensions.get('window').width / 1.2,
    fontSize: 14,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#D75995',
    borderRadius: 20,
    padding: 15,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
