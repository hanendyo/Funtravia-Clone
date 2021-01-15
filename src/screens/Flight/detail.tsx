import { Item, Label, Input, Accordion } from 'native-base';
import React, { useState, useEffect } from 'react';
import {
	Dimensions,
	Platform,
	Text,
	// FlatList,
	View,
	StyleSheet,
	TouchableOpacity,
	SafeAreaView,
	ScrollView,
	KeyboardAvoidingView,
	Image,
	Alert,
	Animated,
	BackHandler,
} from 'react-native';
import Modal from 'react-native-modal';

import {
	arrowbottom,
	back_arrow_white,
	default_image,
	Menuputih,
	next_arrow_black,
	warning,
} from '../../../const/Png';
import {
	Arrowbackwhite,
	ArrowRight,
	FlightHeader,
	OptionsVertWhite,
	Pointmapgray,
	WhiteCheck,
	Xhitam,
	GA,
	ID,
	QG,
	JT,
	Edit,
	Filters,
	Sort,
	Google,
	Detail,
	Bag,
	CheckOval,
	Arrow,
	Checkblok,
	Info,
	FlightLanding,
	FlightTake,
	ArrowLong,
	Bottom,
	Right,
	Flight,
	NoteGreen,
} from '../../../const/Svg';
import { CustomImage } from '../../../core-ui';

import { Airport } from '../../../const/Airport';
import { NavigationEvents } from 'react-navigation';
import Truncate from '../../../utils/Truncate';
import { State } from 'react-native-image-zoom-viewer/built/image-viewer.type';
import { rupiah } from '../../../const/Rupiah';
import { SvgUri } from 'react-native-svg';
import Loading from '../Loading';
import { FlatList } from 'react-native-gesture-handler';

export default function Flightdetail(props) {
	let [loading, setLoading] = useState(false);
	let [data, setData] = useState({});

	let [dataBerangkat, setdataBerangkat] = useState({});
	let [Datas, setKamus] = useState([]);
	let [DataRequest, setRequest] = useState([]);
	let [token, setToken] = useState([]);
	let [gerakan, setgerakan] = useState(new Animated.Value(0));

	const displays = gerakan.interpolate({
		inputRange: [0, 1],
		outputRange: [0, 1],
		extrapolate: 'clamp',
	});

	let [displayz, setdisplay] = useState(false);

	const dataArray = [
		{
			title: '',
			content: <View></View>,
			map: <View></View>,
		},
	];

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

	const getTime = (date) => {
		var x = date.split('T');
		var y = x[1].split(':');

		return '' + y[0] + ':' + y[1];
	};

	const getTimes = (date) => {
		var x = date.split('T');
		var y = x[0].split('-');

		return '' + y[2] + ' ' + month[parseInt(y[1]) - 1];
	};

	const getDuration = (Dur) => {
		var x = Dur.split('H');
		// console.log(x);
		var y = x[0] ? x[0].split('PT') : [];
		// console.log(y);
		var z = x[1] ? x[1].split('M') : [];
		// console.log(z);
		return (
			'' +
			(y[1] && y[1] !== '' ? y[1] : '0') +
			'j ' +
			(z[0] && z[0] !== '' ? z[0] : '0') +
			'mnt'
		);
	};

	const getdeparture = (data) => {
		// var x = state.departure.fulldate;
		var datereq = data.toISOString().split('T');
		return datereq[0];
	};

	const getKota = (code) => {
		var datafilter = Airport.filter((item) => item.code.includes(code));
		// let data =  filterData(code);
		return '' + Truncate({ text: datafilter[0].city, length: 10 });
	};

	const getName = (code) => {
		var datafilter = Airport.filter((item) => item.code.includes(code));
		// let data =  filterData(code);
		return '' + datafilter[0].name;
	};

	const hitungDuration = (start, end) => {
		let startDate = new Date(start);
		// Do your operations
		let endDate = new Date(end);
		let seconds = (endDate.getTime() - startDate.getTime()) / 10009;
		let jam = Math.round(seconds / 360);
		let x = start.split('T');
		let y = x[1].split(':');

		let a = end.split('T');
		let b = a[1].split(':');

		let z = parseInt(y[1]) + parseInt(b[1]);

		// console.log(jam);
		// console.log(b);
		// console.log(z);
		if (z / 60 >= 1) {
			// console.log(z);
			jam = Math.floor(jam + z / 60);

			return jam + 'j';
		} else {
			return jam + 'j ' + z + 'm';
		}

		// console.log(Math.floor(seconds / 36000));
	};

	// console.log(dataFlight);
	// console.log(DataRequest);
	// console.log(Datas);

	const Getdatafly = ({ id }) => {
		let inde = data.itineraries[0].segments.findIndex((k) => k['id'] === id);
		let x = data.itineraries[0].segments[inde];
		// console.log(x);
		return (
			<View>
				<Text
					style={{
						fontFamily: 'lato-light',
						fontSize: 14,
						marginLeft: 5,
					}}>
					{Datas.aircraft && Datas.aircraft[x.aircraft.code]
						? Datas.aircraft[x.aircraft.code]
						: '-'}
				</Text>
			</View>
		);
	};

	const Getharga = () => {
		let adult = 0;
		let adults = 0;
		let child = 0;
		let childs = 0;
		let infant = 0;
		let infants = 0;
		let other = 0;
		let others = 0;
		let currency = '';

		{
			data.travelerPricings && data.travelerPricings.length > 0
				? data.travelerPricings.map((itemss, ins) => {
						// console.log(itemss);

						if (itemss.travelerType === 'ADULT') {
							adult += parseInt(itemss.price.base);
							currency = itemss.price.currency;
							adults++;
						} else if (itemss.travelerType === 'CHILD') {
							child += parseInt(itemss.price.base);
							childs++;
						} else if (itemss.travelerType === 'HELD_INFANT') {
							infant += parseInt(itemss.price.base);
							infants++;
						} else {
							other += parseInt(itemss.price.base);
							others++;
						}
				  })
				: null;
		}

		return (
			<View>
				{adult > 0 ? (
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							alignContent: 'center',
							justifyContent: 'space-between',
						}}>
						<Text
							style={{
								fontFamily: 'lato-light',
								fontSize: 14,
							}}>
							Adult Basic Fare ( x{adults} )
						</Text>

						<Text
							style={{
								fontFamily: 'lato-light',
								fontSize: 14,
							}}>
							{currency} {rupiah(adult)}
						</Text>
					</View>
				) : null}
				{child > 0 ? (
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							alignContent: 'center',
							justifyContent: 'space-between',
						}}>
						<Text
							style={{
								fontFamily: 'lato-light',
								fontSize: 14,
							}}>
							Child Basic Fare ( x{childs} )
						</Text>

						<Text
							style={{
								fontFamily: 'lato-light',
								fontSize: 14,
							}}>
							{currency} {rupiah(child)}
						</Text>
					</View>
				) : null}
				{infant > 0 ? (
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							alignContent: 'center',
							justifyContent: 'space-between',
						}}>
						<Text
							style={{
								fontFamily: 'lato-light',
								fontSize: 14,
							}}>
							Infant Basic Fare ( x{infants} )
						</Text>
						<Text
							style={{
								fontFamily: 'lato-light',
								fontSize: 14,
							}}>
							{currency} {rupiah(infant)}
						</Text>
					</View>
				) : null}
				{other > 0 ? (
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							alignContent: 'center',
							justifyContent: 'space-between',
						}}>
						<Text
							style={{
								fontFamily: 'lato-light',
								fontSize: 14,
							}}>
							Other Basic Fare ( x{others})
						</Text>

						<Text
							style={{
								fontFamily: 'lato-light',
								fontSize: 14,
							}}>
							{currency} {rupiah(other)}
						</Text>
					</View>
				) : null}
			</View>
		);
	};

	const _handleSelect = async () => {
		setLoading(true);
		if (DataRequest.round === false) {
			setLoading(false);
			props.navigation.navigate('FlightPrice', {
				request: DataRequest,
				token: token,
				dataBerangkat: data,
				kamus: Datas,
				dataPulang: {},
			});
		} else if (DataRequest.round === true) {
			if (dataBerangkat.price) {
				setLoading(false);
				props.navigation.navigate('FlightPrice', {
					request: DataRequest,
					token: token,
					dataBerangkat: dataBerangkat,
					dataPulang: data,
					kamus: Datas,
				});
			} else {
				try {
					let response = await fetch(
						'https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=' +
							DataRequest.to.code +
							'&destinationLocationCode=' +
							DataRequest.from.code +
							'&departureDate=' +
							getdeparture(DataRequest.return.fulldate) +
							'&adults=' +
							DataRequest.passengers.adult +
							'&children=' +
							DataRequest.passengers.childern +
							'&infants=' +
							DataRequest.passengers.infant +
							'&&currencyCode=IDR&travelClass=' +
							DataRequest.class +
							'',
						{
							method: 'GET',
							headers: {
								Accept: 'application/json',
								Authorization: 'Bearer ' + token,
								'Content-Type': 'application/json',
							},
							// body: 'originLocationCode=SYD&destinationLocationCode=BKK',
						},
					);
					let responseJson = await response.json();
					console.log(responseJson);
					if (responseJson.data && responseJson.data.length > 0) {
						// setDataFlight(responseJson.data);
						// setData(responseJson.dictionaries);
						props.navigation.navigate('ListFlightRound', {
							dataresult: responseJson,
							request: DataRequest,
							token: token,
							dataBerangkat: data,
							kamus: Datas,
						});
					} else {
						Alert.alert('Data pencarian kosong');
						// return false;
					}
					setLoading(false);
				} catch (error) {
					console.error(error);
					setLoading(false);
				}
			}
		}
	};

	const Refresh = () => {
		setData(props.navigation.getParam('data'));

		setdataBerangkat(
			props.navigation.getParam('dataBerangkat')
				? props.navigation.getParam('dataBerangkat')
				: {},
		);
		setKamus(props.navigation.getParam('kamus'));
		setRequest(props.navigation.getParam('request'));
		setToken(props.navigation.getParam('token'));
	};

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<NavigationEvents onDidFocus={() => Refresh()} />
			<Loading show={loading} />
			{/* {data.itineraries && data.itineraries.length > 0 ? (
				<View style={{ height: Dimensions.get('screen').height - 60 }}> */}
			<ScrollView
				showsHorizontalScrollIndicator={false}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					alignItems: 'center',
					alignContent: 'center',
					paddingTop: 20,
					// paddingHorizontal: 20,
				}}>
				{/* bagian atas ================================================ */}
				<Animated.View
					style={{
						shadowColor: '#464646',
						shadowOffset: { width: 2, height: 2 },
						shadowOpacity: 1,
						shadowRadius: 2,
						elevation: 5,
						borderRadius: 5,
						width: Dimensions.get('screen').width - 40,
						backgroundColor: '#f6f6f6',
						padding: 20,
					}}>
					{/* {console.log(data)} */}
					{data.itineraries && data.itineraries.length > 0
						? data.itineraries.map((item, i) => {
								// console.log(item);
								return (
									<View>
										{item.segments && item.segments.length > 0 ? (
											<View>
												{item.segments.map((datas, inde) => {
													return (
														<View
															style={
																{
																	// paddingVertical: 10,
																	// borderWidth: 1,
																}
															}>
															<Animated.View
																style={{
																	opacity: item.segments[inde - 1]
																		? displays
																		: 1,
																	display: item.segments[inde - 1]
																		? displayz === true
																			? 'flex'
																			: 'none'
																		: 'flex',
																}}>
																{item.segments[inde - 1] ? (
																	<View
																		style={{
																			marginVertical: 20,
																			backgroundColor: 'white',
																			borderWidth: 1,
																			// flexDirection: 'row',
																			borderColor: '#d3d3d3',
																			borderRadius: 5,
																			padding: 10,
																		}}>
																		<View>
																			<View
																				style={{
																					flexDirection: 'row',
																					alignItems: 'center',
																					alignContent: 'center',
																				}}>
																				<Info height={10} width={10} />
																				<Text
																					style={{
																						marginHorizontal: 5,
																						fontFamily: 'lato-bold',
																						fontSize: 14,
																					}}>
																					{hitungDuration(
																						item.segments[inde - 1].arrival.at,

																						datas.departure.at,
																					)}
																				</Text>
																				<Text
																					style={{
																						// marginHorizontal: 10,
																						fontFamily: 'lato-bold',
																						fontSize: 14,
																					}}>
																					transit in
																				</Text>

																				<Text
																					style={{
																						fontFamily: 'lato-bold',
																						fontSize: 14,
																					}}>
																					{' '}
																					{getKota(datas.departure.iataCode)}
																				</Text>
																				<Text
																					style={{
																						fontFamily: 'lato-bold',
																						fontSize: 14,
																					}}>
																					{' '}
																					{'('}
																					{datas.departure.iataCode}
																					{')'}
																				</Text>
																			</View>
																			<Text
																				style={{
																					marginLeft: 15,
																					fontFamily: 'lato-light',
																					fontSize: 14,
																				}}>
																				You need to check in again and transfer
																				your baggage manually
																			</Text>
																		</View>
																	</View>
																) : null}
																<View
																	style={{
																		// borderWidth: 1,
																		// marginVertical: 10,
																		alignContent: 'flex-end',
																		alignItems: 'flex-end',
																		flexDirection: 'row',
																		justifyContent: 'space-between',
																	}}>
																	{datas.carrierCode === 'ID' ? (
																		<ID width={80} height={40} />
																	) : datas.carrierCode === 'GA' ? (
																		<GA width={80} height={40} />
																	) : datas.carrierCode === 'JT' ? (
																		<JT width={80} height={40} />
																	) : datas.carrierCode === 'QG' ? (
																		<QG width={80} height={40} />
																	) : (
																		<Text
																			style={{
																				height: 40,
																				fontFamily: 'lato-reg',
																				fontSize: 10,
																			}}>
																			{Datas.carriers &&
																			Datas.carriers[datas.carrierCode]
																				? Datas.carriers[datas.carrierCode]
																				: '-'}
																		</Text>
																	)}

																	<View
																		style={{
																			flexDirection: 'row',
																		}}>
																		<Text
																			style={{
																				fontFamily: 'lato-light',
																				fontSize: 14,
																			}}>
																			{datas.carrierCode}
																			{' - '}
																		</Text>
																		<Text
																			style={{
																				fontFamily: 'lato-light',
																				fontSize: 14,
																			}}>
																			{datas.aircraft.code}
																		</Text>
																	</View>
																</View>
																<View
																	style={{
																		// borderWidth: 1,
																		// marginVertical: 10,
																		flexDirection: 'row',
																		justifyContent: 'space-between',
																	}}>
																	<View
																		style={{
																			width: '50%',
																			alignContent: 'flex-start',
																			alignItems: 'flex-start',
																		}}>
																		<View
																			style={{
																				flexDirection: 'row',
																				// borderWidth: 1,
																			}}>
																			<Text
																				style={{
																					fontFamily: 'lato-bold',
																					fontSize: 16,
																				}}>
																				{getKota(datas.departure.iataCode)}
																			</Text>
																			<Text
																				style={{
																					fontFamily: 'lato-bold',
																					fontSize: 16,
																				}}>
																				{' '}
																				{'('}
																				{datas.departure.iataCode}
																				{')'}
																			</Text>
																		</View>
																		<Text
																			style={{
																				fontFamily: 'lato-reg',
																				fontSize: 12,
																			}}>
																			{getName(datas.departure.iataCode)}
																		</Text>
																	</View>

																	<View
																		style={{
																			width: '50%',
																			alignContent: 'flex-end',
																			alignItems: 'flex-end',
																		}}>
																		<View
																			style={{
																				flexDirection: 'row',
																				// borderWidth: 1,
																			}}>
																			<Text
																				style={{
																					fontFamily: 'lato-bold',
																					fontSize: 16,
																				}}>
																				{getKota(datas.arrival.iataCode)}
																			</Text>
																			<Text
																				style={{
																					fontFamily: 'lato-bold',
																					fontSize: 16,
																				}}>
																				{' '}
																				{'('}
																				{datas.arrival.iataCode}
																				{')'}
																			</Text>
																		</View>
																		<Text
																			style={{
																				fontFamily: 'lato-reg',
																				fontSize: 12,
																				textAlign: 'right',
																			}}>
																			{getName(datas.arrival.iataCode)}
																		</Text>
																	</View>
																</View>
																<View
																	style={{
																		marginVertical: 10,
																		flexDirection: 'row',
																		alignSelf: 'center',
																		alignItems: 'center',
																	}}>
																	<View
																		style={{
																			height: 15,
																			width: 15,
																			borderRadius: 10,
																			// backgroundColor: 'white',
																			borderWidth: 3,
																			borderColor: '#209fae',
																		}}></View>
																	<View
																		style={{
																			borderBottomColor: '#209fae',
																			borderBottomWidth: 3,
																			width: '90%',
																		}}></View>
																	<View
																		style={{
																			height: 15,
																			width: 15,
																			borderRadius: 10,
																			backgroundColor: '#209fae',
																			borderWidth: 3,
																			borderColor: '#209fae',
																		}}></View>
																</View>

																<View
																	style={{
																		// borderWidth: 1,
																		// marginVertical: 10,
																		flexDirection: 'row',
																		justifyContent: 'space-between',
																	}}>
																	<View>
																		<Text
																			style={{
																				fontFamily: 'lato-bold',
																				fontSize: 16,
																			}}>
																			{getTime(datas.departure.at)}
																		</Text>
																		<Text
																			style={{
																				fontFamily: 'lato-light',
																				fontSize: 14,
																			}}>
																			{getTimes(datas.departure.at)}
																		</Text>
																	</View>
																	<Text
																		style={{
																			fontFamily: 'lato-reg',
																			fontSize: 14,
																		}}>
																		{getDuration(datas.duration)}
																	</Text>
																	<View>
																		<Text
																			style={{
																				fontFamily: 'lato-bold',
																				fontSize: 16,
																			}}>
																			{getTime(datas.arrival.at)}
																		</Text>
																		<Text
																			style={{
																				fontFamily: 'lato-light',
																				fontSize: 14,
																			}}>
																			{getTimes(datas.arrival.at)}
																		</Text>
																	</View>
																</View>
															</Animated.View>

															{item.segments[inde - 1] &&
															inde === item.segments.length - 1 ? (
																<TouchableOpacity
																	onPress={() => {
																		// setmasking(0);
																		setdisplay(!displayz),
																			Animated.timing(gerakan, {
																				toValue: displayz === true ? 0 : 1,
																				// delay: 500,
																				duration: 3000,
																			}).start();
																	}}
																	style={{
																		height: 30,
																		marginTop: 10,
																		flexDirection: 'row',
																		alignItems: 'flex-end',
																		alignContent: 'flex-end',
																		justifyContent: 'center',
																	}}>
																	<View
																		style={{
																			borderBottomWidth: 1,
																			borderTopWidth: 1,
																			borderBottomColor: '#d3d3d3',
																			borderTopColor: '#d3d3d3',
																			width: 50,
																			height: 5,
																		}}></View>
																</TouchableOpacity>
															) : null}
														</View>
													);
												})}
											</View>
										) : null}
									</View>
								);
						  })
						: null}
				</Animated.View>
				{/* bagian refund ====================================================== */}
				<View
					style={{
						paddingVertical: 20,
						width: Dimensions.get('screen').width - 80,
						borderBottomWidth: 1,
						borderBottomColor: '#d3d3d3',
					}}>
					<View
						style={{
							flexDirection: 'row',
							alignContent: 'center',
							alignItems: 'center',
						}}>
						<Checkblok height={10} width={10} />
						<Text
							style={{
								fontFamily: 'lato-reg',
								fontSize: 14,
								color: '#209fae',
								marginHorizontal: 10,
							}}>
							Refundable
						</Text>
						<Checkblok height={10} width={10} />
						<Text
							style={{
								fontFamily: 'lato-reg',
								fontSize: 14,
								color: '#209fae',
								marginHorizontal: 10,
							}}>
							Reschedule
						</Text>
					</View>
					{data.travelerPricings && data.travelerPricings.length > 0
						? data.travelerPricings.map((itemss, ins) => {
								return ins === 0 && itemss.travelerType === 'ADULT' ? (
									<View
										style={{
											paddingVertical: 10,
										}}>
										{/* {console.log(itemss)} */}
										{itemss.fareDetailsBySegment.length > 0
											? itemss.fareDetailsBySegment.map((ite, ind) => {
													return (
														<View>
															{itemss.fareDetailsBySegment[ind - 1] ? (
																<View
																	style={{
																		marginVertical: 20,
																		backgroundColor: 'white',
																		borderWidth: 1,
																		// flexDirection: 'row',
																		borderColor: '#d3d3d3',
																		borderRadius: 5,
																		padding: 10,
																	}}>
																	<View>
																		<View
																			style={{
																				flexDirection: 'row',
																				alignItems: 'center',
																				alignContent: 'center',
																			}}>
																			<Info height={10} width={10} />

																			<Text
																				style={{
																					marginHorizontal: 10,
																					fontFamily: 'lato-bold',
																					fontSize: 14,
																				}}>
																				Transit
																			</Text>
																		</View>
																	</View>
																</View>
															) : null}

															<View
																style={{
																	flexDirection: 'row',
																	marginVertical: 5,
																	alignItems: 'flex-start',
																	alignContent: 'flex-start',
																}}>
																<Detail height={15} width={15} />
																<View>
																	<Getdatafly id={ite.segmentId} />
																	<Text
																		style={{
																			fontSize: 14,
																			fontFamily: 'lato-light',
																			marginHorizontal: 5,
																		}}>
																		Class {ite.cabin}
																	</Text>
																	{ite.brandedFare ? (
																		<Text
																			style={{
																				fontSize: 14,
																				fontFamily: 'lato-light',
																				marginHorizontal: 5,
																			}}>
																			Type {ite.brandedFare}
																		</Text>
																	) : null}
																	<Text
																		style={{
																			fontSize: 14,
																			fontFamily: 'lato-light',
																			marginHorizontal: 5,
																		}}>
																		Fare {itemss.fareOption}
																	</Text>
																</View>
															</View>
															<View
																style={{
																	flexDirection: 'row',
																	marginVertical: 5,
																	alignItems: 'center',
																	alignContent: 'center',
																}}>
																<Bag height={15} width={15} />

																<View
																	style={{
																		width: '95%',
																		flexDirection: 'row',
																		justifyContent: 'space-between',
																		alignContent: 'center',
																		alignItems: 'center',
																	}}>
																	{ite.includedCheckedBags &&
																	ite.includedCheckedBags.weight ? (
																		<Text
																			style={{
																				fontSize: 14,
																				fontFamily: 'lato-light',
																				marginHorizontal: 5,
																			}}>
																			Cabin Baggage{' '}
																			{ite.includedCheckedBags.weight}{' '}
																			{ite.includedCheckedBags.weightUnit}
																		</Text>
																	) : (
																		<Text
																			style={{
																				fontSize: 14,
																				fontFamily: 'lato-light',
																				marginHorizontal: 5,
																			}}>
																			Cabin Baggage 0 KG
																		</Text>
																	)}

																	<Text
																		style={{
																			fontSize: 14,
																			fontFamily: 'lato-bold',
																			marginHorizontal: 5,
																			color: '#209fae',
																		}}>
																		Buy Extra Baggage
																	</Text>
																</View>
															</View>
														</View>
													);
											  })
											: null}
									</View>
								) : null;
						  })
						: null}
				</View>
				{/* harga ================================================ */}
				<View
					style={{
						paddingVertical: 20,
						width: Dimensions.get('screen').width - 80,
						borderBottomWidth: 1,
						borderBottomColor: '#d3d3d3',
					}}>
					<Text
						style={{
							fontFamily: 'lato-bold',
							fontSize: 16,
							marginBottom: 10,
						}}>
						Price Detail
					</Text>
					<Getharga />
					<View
						style={{
							marginTop: 10,
							flexDirection: 'row',
							justifyContent: 'space-between',
						}}>
						<Text
							style={{
								fontFamily: 'lato-bold',
								fontSize: 14,
							}}>
							Total Price
						</Text>
						<Text
							style={{
								fontFamily: 'lato-bold',
								fontSize: 14,
							}}>
							{data.price && data.price.currency ? data.price.currency : '-'}{' '}
							{rupiah(data.price && data.price.base ? data.price.base : 0)}
						</Text>
					</View>
				</View>
				{/* {bagasi =====================================================} */}

				{data.itineraries && data.itineraries.length > 0
					? data.itineraries.map((items, i) => {
							// console.log(item);
							return (
								<View style={{}}>
									{items.segments && items.segments.length > 0 ? (
										<FlatList
											contentContainerStyle={{
												padding: 3,
												justifyContent: 'space-evenly',
												paddingHorizontal: 20,
											}}
											data={items.segments}
											horizontal
											renderItem={({ item, index }) => {
												return (
													<View>
														<View
															style={{
																marginVertical: 20,
																marginRight: 5,
																shadowColor: '#464646',
																shadowOffset: { width: 2, height: 2 },
																shadowOpacity: 1,
																shadowRadius: 2,
																elevation: 2,
																borderRadius: 5,
																width: Dimensions.get('screen').width - 40,
																backgroundColor: 'white',
																padding: 20,
																// height: Dimensions.get('screen').width * 0.5,
															}}>
															<Text
																style={{
																	fontSize: 16,
																	fontFamily: 'lato-bold',
																	marginBottom: 10,
																}}>
																Baggage Prices (Per Pax)
															</Text>

															<View
																style={{
																	// borderWidth: 1,
																	// marginVertical: 10,
																	alignContent: 'flex-end',
																	alignItems: 'flex-end',
																	flexDirection: 'row',
																	justifyContent: 'space-between',
																}}>
																{item.carrierCode === 'ID' ? (
																	<ID width={80} height={40} />
																) : item.carrierCode === 'GA' ? (
																	<GA width={80} height={40} />
																) : item.carrierCode === 'JT' ? (
																	<JT width={80} height={40} />
																) : item.carrierCode === 'QG' ? (
																	<QG width={80} height={40} />
																) : (
																	<Text
																		style={{
																			height: 40,
																			fontFamily: 'lato-reg',
																			fontSize: 10,
																		}}>
																		{Datas.carriers &&
																		Datas.carriers[item.carrierCode]
																			? Datas.carriers[item.carrierCode]
																			: '-'}
																	</Text>
																)}
															</View>
															<Accordion
																style={{
																	// marginTop: 20,
																	borderWidth: 0,
																}}
																// animation={1}
																dataArray={dataArray}
																expanded={1}
																headerStyle={{}}
																contentStyle={{}}
																renderHeader={(itemz, expanded) => (
																	<View
																		style={{
																			flexDirection: 'row',
																			justifyContent: 'space-between',
																		}}>
																		{/* <Text>{item.title}</Text> */}
																		<View
																			style={{
																				// width: Dimensions.get('screen').width,

																				flexDirection: 'row',
																				justifyContent: 'flex-start',
																				alignContent: 'center',
																				alignItems: 'center',
																				// paddingHorizontal: 20,
																			}}>
																			<Text
																				style={{
																					fontFamily: 'lato-light',
																					fontSize: 18,
																					color: '#464646',
																				}}>
																				<Truncate
																					text={getKota(
																						item.departure.iataCode,
																					)}
																					length={10}
																				/>
																			</Text>
																			<ArrowLong
																				height={20}
																				width={20}
																				style={{ marginHorizontal: 10 }}
																			/>
																			<Text
																				style={{
																					fontFamily: 'lato-light',
																					fontSize: 18,
																					color: '#464646',
																				}}>
																				{' '}
																				<Truncate
																					text={getKota(item.arrival.iataCode)}
																					length={10}
																				/>
																			</Text>
																		</View>

																		{expanded ? (
																			<Bottom
																				style={{ margin: 3 }}
																				height={20}
																				width={20}
																			/>
																		) : (
																			<Right
																				style={{ margin: 3 }}
																				height={20}
																				width={20}
																			/>
																		)}
																	</View>
																)}
																renderContent={(item) => (
																	<View
																		style={{
																			padding: 20,
																			borderBottomWidth: 1,
																			borderBottomColor: '#d3d3d3',
																		}}>
																		<Text
																			style={{
																				fontFamily: 'lato-light',
																				fontSize: 18,
																				color: '#464646',
																			}}>
																			{' '}
																			No baggage price on this flight
																		</Text>
																	</View>
																)}
															/>
														</View>
													</View>
												);
											}}
										/>
									) : null}
								</View>
							);
					  })
					: null}
				{/* <View style={{ height: 70 }}></View> */}
			</ScrollView>

			<View
				style={{
					height: 70,
					backgroundColor: 'white',
					flexDirection: 'row',
					shadowColor: '#464646',
					shadowOffset: { width: 2, height: 2 },
					shadowOpacity: 1,
					shadowRadius: 2,
					elevation: 5,
					paddingHorizontal: 20,
					justifyContent: 'space-between',
					alignItems: 'center',
					alignContent: 'center',
				}}>
				<View
					style={{
						flexDirection: 'row',
						alignContent: 'center',
						alignItems: 'center',
					}}>
					{data.price && data.travelerPricings.length > 0
						? data.travelerPricings.map((itemss, ins) => {
								// console.log(itemss);
								return ins === 0 && itemss.travelerType === 'ADULT' ? (
									<View
										style={{
											// width: '40%',
											// padding: 10,
											justifyContent: 'center',
											alignItems: 'center',
											alignContent: 'center',
											// borderWidth: 1,
											// height: Dimensions.get('screen').width * 0.25,
										}}>
										<View
											style={{
												flexDirection: 'row',
												alignContent: 'flex-end',
												alignItems: 'flex-end',
											}}>
											<Text
												style={{
													fontFamily: 'lato-bold',
													fontSize: 24,
													color: '#D75995',
												}}>
												{itemss.price.currency +
													' ' +
													rupiah(itemss.price.base)}
											</Text>
											<Text
												style={{
													fontFamily: 'lato-reg',
													fontSize: 14,
													marginBottom: 5,
													// color: '#209fae',
												}}>
												{' '}
												/ pax
											</Text>
										</View>
									</View>
								) : null;
						  })
						: null}
				</View>
				<TouchableOpacity
					onPress={() => _handleSelect()}
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						alignContent: 'center',
						backgroundColor: '#209fae',
						paddingHorizontal: 25,
						paddingVertical: 10,
						borderRadius: 5,
					}}>
					<Text
						style={{
							fontFamily: 'lato-bold',
							fontSize: 16,
							marginLeft: 5,
							color: 'white',
						}}>
						Select
					</Text>
				</TouchableOpacity>
			</View>
			{/* </View>
			) : null} */}
		</SafeAreaView>
	);
}

Flightdetail.navigationOptions = (props) => ({
	// headerTransparent: true,
	headerTitle: 'Flight Details',
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
