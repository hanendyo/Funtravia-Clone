import { Item, Label, Input, View, Textarea } from 'native-base';
import React, { useState, useEffect, useRef } from 'react';
import { Alert, Dimensions, SafeAreaView, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import moment from 'moment';
import { Arrowbackwhite, Book, OptionsVertWhite } from '../../../const/Svg';
import Dates from 'react-native-dates';

// import { CalendarList } from 'react-native-common-date-picker';
import { LocaleConfig, Calendar, CalendarList } from 'react-native-calendars';
import { getToday, getFormatedDate } from 'react-native-modern-datepicker';
import { NavigationEvents } from 'react-navigation';

export default function calendar(props) {
	let [state, setState] = useState(props.navigation.getParam('history'));
	let [position, setPosition] = useState(props.navigation.getParam('position'));
	let [select, setSelect] = useState([]);
	let _calendar = useRef(null);

	const setNewdate = () => {
		var date = new Date(); // Now
		date.setDate(date.getDate() + 90); // Set now + 30 days as the new date

		return date;
	};

	let [states, setstates] = useState({
		date: null,
		startDate: null,
		endDate: null,
		focus: 'startDate',
		visible: true,
		displayedDate: new Date(),
		minDate: new Date(),
		maxDate: setNewdate(),
	});

	const isDateBlocked = (date) => date.isBefore(moment(), 'day');

	const onGetTime = () => {
		// console.log(_calendar);
		// you can get the selected time.
		// console.log('onGetTime: ', _calendar.getSelection());
	};

	const month = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'Mei',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec',
	];

	const day = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
	];

	const trigger = () => {
		var x = [...select];
		var start = x[0];
		var end = x[1];

		var star = new Date(start);
		// star.setDate(start.getDate());

		var en = new Date(end);
		// en.setDate(end.getDate());

		var tempdata = { ...state };

		tempdata.departure = {
			fulldate: star,
			year: start.getFullYear(),
			month: month[start.getMonth()],
			day: day[start.getDay()],
			date: start.getDate(),
		};

		tempdata.return = {
			fulldate: en,
			year: end.getFullYear(),
			month: month[end.getMonth()],
			day: day[end.getDay()],
			date: end.getDate(),
		};

		// console.log(tempdata);

		props.navigation.navigate('Flighting', {
			kiriman: tempdata,
		});
	};

	const onSelection = (newSelection) => {
		setSelect(newSelection);
	};

	const Getmont = ({ data }) => {
		var x = data.split('-');
		return '' + x[0] + month[x[1]] + '';
	};

	let [Range, setRange] = useState([]);

	const setDates = (x) => {
		// console.log(x);
		// console.log(Range);

		var tempdata = { ...state };

		console.log(position);

		if (position === 'departure') {
			// var start = x[0];
			var star = new Date(x[0]);
			// star.setDate(start.getDate());
			if (x[0] && x[0] !== '') {
				tempdata.departure = {
					fulldate: star,
					year: star.getFullYear(),
					month: month[star.getMonth()],
					day: day[star.getDay()],
					date: star.getDate(),
				};
			}
		} else {
			var star = new Date(x[0]);

			if (x[0] && x[0] !== '') {
				tempdata.return = {
					fulldate: star,
					year: star.getFullYear(),
					month: month[star.getMonth()],
					day: day[star.getDay()],
					date: star.getDate(),
				};
			}

			// if (x[x.length - 1] && x[x.length - 1] !== '') {
			// 	var end = new Date(x[x.length - 1]);
			// 	// en.setDate(end.getDate());
			// 	tempdata.return = {
			// 		fulldate: end,
			// 		year: end.getFullYear(),
			// 		month: month[end.getMonth()],
			// 		day: day[end.getDay()],
			// 		date: end.getDate(),
			// 	};
			// }
		}

		console.log(tempdata);
		props.navigation.navigate('Flighting', {
			kiriman: tempdata,
		});
	};

	let [markedDates, setmarkedDates] = useState({});
	let [markingType, setmarkingType] = useState('');

	let [startdate, setstartdate] = useState(null);
	let [enddate, setenddate] = useState(null);
	const handleselect = (day) => {
		setmarkedDates([]);
		let z = {};
		if (day.dateString) {
			z[day.dateString] = {
				selected: true,
				color: '#209fae',
				// selected: true,
				// marked: true,
				textColor: 'white',
			};
			setmarkedDates(z);
			setRange([day.dateString]);
		}
	};

	// const handleselect = (day) => {
	// 	// console.log('ada');
	// 	// console.log(day);
	// 	// console.log(startdate);
	// 	// console.log(enddate);

	// 	setmarkedDates([]);

	// 	// setmarkingType('multi-period');
	// 	if (state.round === true) {
	// 		var x = startdate !== null ? startdate : {};
	// 		var y = day;
	// 		setenddate(day);
	// 	}
	// 	if (startdate === null) {
	// 		setstartdate(day);
	// 		var x = day;
	// 		var y = enddate !== null ? enddate : {};
	// 	} else if (day.timestamp <= startdate.timestamp) {
	// 		setstartdate(day);
	// 		var x = day;
	// 		var y = enddate !== null ? enddate : {};
	// 	} else {
	// 		var x = startdate !== null ? startdate : {};
	// 		var y = day;
	// 		setenddate(day);
	// 	}

	// 	let z = {};
	// 	if (x.dateString) {
	// 		z[x.dateString] = {
	// 			startingDay: true,
	// 			color: '#209fae',
	// 			// selected: true,
	// 			// marked: true,
	// 			textColor: 'white',
	// 		};
	// 		setmarkedDates(z);
	// 		setRange([x.dateString]);
	// 	}
	// 	if (y.dateString) {
	// 		var listDate = [];
	// 		var startDate = x.dateString;
	// 		var endDate = y.dateString;
	// 		var dateMove = new Date(startDate);
	// 		var strDate = startDate;

	// 		while (strDate < endDate) {
	// 			var strDate = dateMove.toISOString().slice(0, 10);
	// 			listDate.push(strDate);
	// 			dateMove.setDate(dateMove.getDate() + 1);
	// 		}
	// 		// console.log(listDate);

	// 		setRange(listDate);

	// 		for (var i in listDate) {
	// 			if (i === '0') {
	// 				// console.log(i);
	// 				z[listDate[i]] = {
	// 					startingDay: true,
	// 					color: '#209fae',
	// 					// selected: true,
	// 					// marked: true,
	// 					textColor: 'white',
	// 				};
	// 			} else if (i === '' + (listDate.length - 1)) {
	// 				// console.log(i);
	// 				z[listDate[i]] = {
	// 					endingDay: true,
	// 					color: '#209fae',
	// 					// selected: true,
	// 					// marked: true,
	// 					textColor: 'white',
	// 				};
	// 			} else {
	// 				z[listDate[i]] = {
	// 					// endingDay: true,
	// 					color: 'red',
	// 					// selected: true,
	// 					// marked: true,
	// 					textColor: 'white',
	// 				};
	// 			}
	// 		}

	// 		setmarkedDates(z);
	// 	}
	// 	// setmarkingType('period');
	// };

	// let referensi = useRef();

	// console.log(referensi);

	// const refresh = () => {
	// 	if (state.round === true) {
	// 		let z = {};
	// 		var listDate = [];
	// 		var startDate = state.departure.fulldate.toISOString().slice(0, 10);
	// 		var endDate = state.return.fulldate.toISOString().slice(0, 10);

	// 		// setstartdate(startDate);
	// 		// setenddate(endDate);

	// 		// console.log(startDate);
	// 		// console.log(endDate);

	// 		var dateMove = new Date(startDate);
	// 		var strDate = startDate;

	// 		if (strDate === endDate) {
	// 			listDate.push(strDate);
	// 		}

	// 		while (strDate < endDate) {
	// 			var strDate = dateMove.toISOString().slice(0, 10);
	// 			listDate.push(strDate);
	// 			dateMove.setDate(dateMove.getDate() + 1);
	// 		}
	// 		// console.log(listDate);

	// 		setRange(listDate);

	// 		for (var i in listDate) {
	// 			if (i === '0') {
	// 				// console.log(i);
	// 				z[listDate[i]] = {
	// 					startingDay: true,
	// 					color: '#209fae',
	// 					// selected: true,
	// 					// marked: true,
	// 					textColor: 'white',
	// 				};
	// 			} else if (i === '' + (listDate.length - 1)) {
	// 				// console.log(i);
	// 				z[listDate[i]] = {
	// 					endingDay: true,
	// 					color: '#209fae',
	// 					// selected: true,
	// 					// marked: true,
	// 					textColor: 'white',
	// 				};
	// 			} else {
	// 				z[listDate[i]] = {
	// 					// endingDay: true,
	// 					color: 'red',
	// 					// selected: true,
	// 					// marked: true,
	// 					textColor: 'white',
	// 				};
	// 			}
	// 		}

	// 		setmarkedDates(z);
	// 	} else {
	// 		// let z = {};
	// 		// var startDate = state.departure.fulldate.toISOString().slice(0, 10);
	// 		// z[startDate] = {
	// 		// 	startingDay: true,
	// 		// 	color: '#209fae',
	// 		// 	// selected: true,
	// 		// 	// marked: true,
	// 		// 	textColor: 'white',
	// 		// };
	// 		// setmarkedDates(z);
	// 	}
	// };

	return (
		<SafeAreaView
			style={{
				flex: 1,
			}}>
			{/* <NavigationEvents onDidFocus={() => refresh()} /> */}

			<CalendarList
				style={{}}
				minDate={
					position === 'departure' ? states.minDate : state.departure.fulldate
				}
				// Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
				maxDate={states.maxDate}
				// enableSwipeMonths={true}
				onDayPress={(day) => {
					handleselect(day);
				}}
				// markingType={'period'}
				markedDates={markedDates}
				theme={{
					// backgroundColor: '#ffffff',
					// calendarBackground: '#ffffff',
					// textSectionTitleColor: '#b6c1cd',
					// textSectionTitleDisabledColor: '#d9e1e8',
					selectedDayBackgroundColor: '#209fae',
					// selectedDayTextColor: '#ffffff',
					todayTextColor: '#D75995',
					// dayTextColor: '#2d4150',
					// textDisabledColor: '#d9e1e8',
					// dotColor: '#00adf5',
					// selectedDotColor: '#ffffff',
					// arrowColor: 'orange',
					// disabledArrowColor: '#d9e1e8',
					// monthTextColor: 'blue',
					// indicatorColor: 'blue',
					textDayFontFamily: 'lato-reg',
					textMonthFontFamily: 'lato-bold',
					textDayHeaderFontFamily: 'lato-bold',
					// textDayFontWeight: '300',
					// textMonthFontWeight: 'bold',
					// textDayHeaderFontWeight: '300',
					textDayFontSize: 14,
					toDayFontSize: 18,
					textMonthFontSize: 14,
					textDayHeaderFontSize: 14,
				}}

				// dayComponent={({ date, state }) => {
				// 	return (
				// 		<View>
				// 			<Text
				// 				style={{
				// 					textAlign: 'center',
				// 					color: state === 'disabled' ? 'gray' : 'red',
				// 				}}>
				// 				{date.day}
				// 			</Text>
				// 		</View>
				// 	);
				// }}
			/>
			<View
				style={{
					height: 50,
					width: Dimensions.get('screen').width,
					position: 'absolute',
					bottom: 0,
					alignItems: 'center',
					justifyContent: 'center',
				}}>
				<TouchableOpacity
					style={{
						height: '100%',
						width: Dimensions.get('screen').width,
						alignItems: 'center',
						justifyContent: 'center',
						backgroundColor: '#209fae',
					}}
					onPress={() => {
						setDates(Range);
					}}>
					<Text
						style={{
							fontFamily: 'lato-reg',
							fontSize: 16,
							color: 'white',
						}}>
						Pilih
					</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}

calendar.navigationOptions = (props) => ({
	// headerTransparent: true,
	headerTitle: 'Calendar',
	headerMode: 'screen',
	headerStyle: {
		backgroundColor: '#209FAE',
		elevation: 0,
		borderBottomWidth: 0,
		// fontSize: 50,
		// justifyContent: 'center',
		// flex:1,
	},
	headerTitleStyle: {
		fontFamily: 'lato-reg',
		fontSize: 14,
		color: 'white',
		alignSelf: 'center',
	},
	headerLeft: (
		<TouchableOpacity
			style={{
				height: 40,
				width: 40,
				// borderWidth:1,
				justifyContent: 'center',
				alignContent: 'center',
				alignItems: 'center',
				// backgroundColor:'white'
			}}
			onPress={() => props.navigation.goBack()}>
			<Arrowbackwhite height={20} width={20}></Arrowbackwhite>
		</TouchableOpacity>
	),
	headerLeftContainerStyle: {
		// paddingLeft: 20,
	},
	headerRight: (
		<View style={{ flexDirection: 'row' }}>
			<TouchableOpacity
				style={{
					height: 40,
					width: 40,
					// borderWidth:1,
					justifyContent: 'center',
					alignContent: 'center',
					alignItems: 'center',
					// backgroundColor:'white'
				}}
				onPress={() => Alert.alert('Coming soon!')}>
				<OptionsVertWhite height={20} width={20} />
			</TouchableOpacity>
		</View>
	),
	headerRightStyle: {
		// paddingRight: 20,
	},
});
