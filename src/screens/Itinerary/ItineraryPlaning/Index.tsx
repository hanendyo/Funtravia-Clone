import React, { useState, useEffect } from 'react';
import {
	View,
	StyleSheet,
	ImageBackground,
	Dimensions,
	TextInput,
} from 'react-native';
import { AsyncStorage } from 'react-native';
import { CustomImage } from '../../core-ui';
// import {  } from '../../const/PixelRatio';
import { bali1, bali2, bali3, bali4 } from '../../const/photo';
import { back_arrow_white } from '../../const/Png';

import { gql } from 'apollo-boost';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import { Header, Content, Tab, Tabs, ScrollableTab } from 'native-base';
import ActivePlan from './TripPlaningDetail/ActivePlan';
import FinishTrip from './TripPlaningDetail/FinishTrip';
import PlanList from './listItinPlaning';
import { SafeAreaView } from 'react-navigation';
import listitinerary from '../../graphQL/Query/Itinerary/listitinerary';
import { ItineraryChooseday } from './ItinDetails';
import { Text, Button } from '../../Component';
import { Arrowbackwhite } from '../../const/Svg';

export default function ItineraryPlaning(props) {
	let [token, setToken] = useState('');
	let [preview, setPreview] = useState('list');
	let [DataPlan, setDataPlan] = useState(0);
	let [DataActive, setDataActive] = useState(0);
	let [DataFinish, setDataFinish] = useState(0);
	// let [statusnya, setStatus] = useState('A');
	let idkiriman = props.route.params.idkiriman

	const loadAsync = async () => {
		let tkn = await AsyncStorage.getItem('access_token
		setToken(tkn);
		// console.log(tkn);
	};

	useEffect(() => {
		loadAsync();
	}, []);

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View>
				<View
					style={{
						alignContent: 'center',
						alignItems: 'center',
						justifyContent: 'center',
						// paddingVertical: (10),
					}}>
					<View
						style={
							{
								// paddingVertical: (10),
							}
						}>
						{token ? (
							<PlanList
								props={props}
								idkiriman={idkiriman}
								token={token}
								jumlah={(e) => setDataPlan(e)}
								Position={props.route.params.Position}
							/>
						) : null}
					</View>
				</View>
			</View>
		</SafeAreaView>
	);
}

ItineraryPlaning.navigationOptions = ({ navigation }) => ({
	headerTitle: (
		<Text
			size='label'
			style={{
				color: 'white',
			}}>
			Choose Your Trip
		</Text>
	),
	headerMode: 'screen',
	headerStyle: {
		backgroundColor: '#209FAE',
		elevation: 0,
		borderBottomWidth: 0,
	},
	headerLeft: (
		<Button
			text={''}
			size='medium'
			type='circle'
			variant='transparent'
			onPress={() => navigation.goBack()}
			style={{
				height: 55,
			}}>
			<Arrowbackwhite height={20} width={20}></Arrowbackwhite>
		</Button>
	),
	headerLeftContainerStyle: {
		paddingLeft: 10,
	},
	headerRight: <View style={{}}></View>,
	headerRightStyle: {
		// paddingRight: 20,
	},
});

const styles = StyleSheet.create({});
