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
	Plane,
	ArrowLong,
	Info,
	FlightTake,
	FlightLanding,
	Flight,
	Checkblok,
	NoteGreen,
	Bottom,
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
// import { SwipeablePanel } from 'rn-swipeable-panel';

export default function FlightPrice(props) {
	let [modalshow, setModalshow] = useState(false);
	let [request, setrequest] = useState(props.navigation.getParam('request'));
	let [token, settoken] = useState(props.navigation.getParam('token'));
	let [dataBerangkats, setdataBerangkat] = useState(
		props.navigation.getParam('dataBerangkat'),
	);
	let [dataPulang, setdataPulang] = useState(
		props.navigation.getParam('dataPulang'),
	);
	let [Datas, setDatas] = useState(props.navigation.getParam('kamus'));

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

	const openPanel = () => {
		setModalshow(true);
	};

	const closePanel = () => {
		setModalshow(false);
	};

	const Getdatafly = ({ id }) => {
		let inde = dataBerangkats.itineraries[0].segments.findIndex(
			(k) => k['id'] === id,
		);
		let x = dataBerangkats.itineraries[0].segments[inde];
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

	const Getdataflys = ({ id }) => {
		let inde = dataPulang.itineraries[0].segments.findIndex(
			(k) => k['id'] === id,
		);
		let x = dataPulang.itineraries[0].segments[inde];
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

		if (z / 60 >= 1) {
			jam = Math.floor(jam + z / 60);

			return jam + 'j';
		} else {
			return jam + 'j ' + z + 'm';
		}
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

	const getTime = (date) => {
		var x = date.split('T');
		var y = x[1].split(':');

		return '' + y[0] + ' : ' + y[1];
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
	const GetTotal = ({ berangkat, pulang }) => {
		// console.log(berangkat);
		// console.log(pulang);
		// console.log(parseInt(berangkat));
		// console.log(parseInt(pulang));

		let jumlah = parseInt(berangkat) + parseInt(pulang);
		return rupiah(jumlah);
	};

	const renderContent = () => {
		return (
			<View>
				<Text>Get directions to your location</Text>
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
			dataBerangkats.travelerPricings &&
			dataBerangkats.travelerPricings.length > 0
				? dataBerangkats.travelerPricings.map((itemss, ins) => {
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

		if (request.round === true) {
			{
				dataPulang.travelerPricings && dataPulang.travelerPricings.length > 0
					? dataPulang.travelerPricings.map((itemss, ins) => {
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
		}

		return (
			<View
				style={{
					paddingHorizontal: 20,
				}}>
				{adult > 0 ? (
					<View
						style={{
							paddingVertical: 10,
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
							paddingVertical: 10,
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
							paddingVertical: 10,

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
							paddingVertical: 10,

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
				<View
					style={{
						borderTopWidth: 1,
						borderTopColor: '#d3d3d3',
						paddingVertical: 10,

						flexDirection: 'row',
						alignItems: 'center',
						alignContent: 'center',
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
						{currency}{' '}
						{request.round === true ? (
							<GetTotal
								berangkat={
									dataBerangkats.price && dataBerangkats.price.base
										? dataBerangkats.price.base
										: 0
								}
								pulang={
									dataPulang.price && dataPulang.price.base
										? dataPulang.price.base
										: 0
								}
							/>
						) : (
							rupiah(
								dataBerangkats.price && dataBerangkats.price.base
									? dataBerangkats.price.base
									: 0,
							)
						)}
					</Text>
				</View>
			</View>
		);
	};

	const Renderbottom = () => {
		return (
			<View
				style={{
					height: 70,
					width: Dimensions.get('screen').width,
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
							<View>
								<Text
									style={{
										fontFamily: 'lato-bold',
										fontSize: 24,
										color: '#D75995',
									}}>
									{dataBerangkats.price && dataBerangkats.price.currency
										? dataBerangkats.price.currency
										: '-'}{' '}
									{request.round === true ? (
										<GetTotal
											berangkat={
												dataBerangkats.price && dataBerangkats.price.base
													? dataBerangkats.price.base
													: 0
											}
											pulang={
												dataPulang.price && dataPulang.price.base
													? dataPulang.price.base
													: 0
											}
										/>
									) : (
										rupiah(
											dataBerangkats.price && dataBerangkats.price.base
												? dataBerangkats.price.base
												: 0,
										)
									)}
								</Text>
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
										Earn 12 Points
									</Text>
								</View>
							</View>
						</View>
					</View>
				</View>
				<TouchableOpacity
					// onPress={() => _handleSelect()}
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
		);
	};

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					paddingHorizontal: 20,
				}}>
				<View
					style={{
						marginVertical: 20,
						flexDirection: 'row',
						alignItems: 'center',
						alignContent: 'center',
					}}>
					<Plane height={50} width={50} />
					<View style={{ marginLeft: 10 }}>
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
									fontFamily: 'lato-bold',
									fontSize: 18,
									color: '#464646',
								}}>
								<Truncate text={request.from.city} length={12} />
							</Text>
							<ArrowLong
								height={20}
								width={20}
								style={{ marginHorizontal: 10 }}
							/>
							<Text
								style={{
									fontFamily: 'lato-bold',
									fontSize: 18,
									color: '#464646',
								}}>
								{' '}
								<Truncate text={request.to.city} length={12} />
							</Text>
						</View>
						<Text
							style={{
								fontFamily: 'lato-light',
								fontSize: 14,
							}}>
							{request.from.code} - {request.to.code}
						</Text>
					</View>
				</View>
				{/* pergi */}
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
					{dataBerangkats.itineraries && dataBerangkats.itineraries.length > 0
						? dataBerangkats.itineraries.map((item, i) => {
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
																	// flexDirection: 'row',
																	// paddingVertical: 10,
																	// borderWidth: 1,
																}
															}>
															<Animated.View
																// style={{
																// 	opacity: item.segments[inde - 1]
																// 		? displays
																// 		: 1,
																// 	display: item.segments[inde - 1]
																// 		? displayz === true
																// 			? 'flex'
																// 			: 'none'
																// 		: 'flex',
																// }}
																style={{
																	display: 'flex',
																}}>
																{item.segments[inde - 1] ? (
																	<View
																		style={{
																			borderBottomWidth: 1,
																			borderBottomColor: '#d3d3d3',
																			marginVertical: 20,
																		}}></View>
																) : null}

																<View
																	style={
																		{
																			// justifyContent: 'space-between',
																		}
																	}>
																	<View
																		style={{
																			marginBottom: 10,
																			flexDirection: 'row',
																			justifyContent: 'space-between',
																			alignItems: 'flex-end',
																			alignContent: 'flex-end',
																		}}>
																		<View>
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
																		<View>
																			<View
																				style={{
																					flexDirection: 'row',
																					alignContent: 'center',
																					alignItems: 'center',
																					marginBottom: 10,
																				}}>
																				<Text
																					style={{
																						fontFamily: 'lato-semibold',
																						fontSize: 16,
																					}}>
																					PROMO
																				</Text>
																				<View
																					style={{
																						height: 5,
																						width: 5,
																						backgroundColor: '#464646',
																						borderRadius: 3,
																						marginHorizontal: 5,
																					}}></View>
																				<Text
																					style={{
																						fontFamily: 'lato-semibold',
																						fontSize: 16,
																					}}>
																					{item.segments.length > 1
																						? 'Transit'
																						: 'Langsung'}
																				</Text>
																			</View>
																			<Text
																				style={{
																					textAlign: 'right',
																					fontFamily: 'lato-light',
																					fontSize: 12,
																				}}>
																				{request.class}
																			</Text>
																		</View>
																	</View>
																	<View
																		style={{
																			flexDirection: 'row',
																			justifyContent: 'space-between',
																		}}>
																		<View
																			style={{
																				flexDirection: 'row',
																			}}>
																			<Text
																				style={{
																					fontFamily: 'lato-light',
																					fontSize: 14,
																				}}>
																				{getTimes(datas.departure.at)}
																				{' - '}
																			</Text>
																			<Text
																				style={{
																					fontFamily: 'lato-light',
																					fontSize: 14,
																				}}>
																				{getTimes(datas.arrival.at)}
																			</Text>
																		</View>
																		<View>
																			<View
																				style={{
																					flexDirection: 'row',
																					alignContent: 'center',
																					alignItems: 'center',
																				}}>
																				<Text
																					style={{
																						fontFamily: 'lato-bold',
																						fontSize: 16,
																					}}>
																					{getTime(datas.departure.at)}
																				</Text>
																				<Flight
																					style={{ marginHorizontal: 10 }}
																					height={20}
																					width={20}
																				/>
																				{/* jam ========================================================================= */}
																				<Text
																					style={{
																						fontFamily: 'lato-bold',
																						fontSize: 16,
																					}}>
																					{getTime(datas.arrival.at)}
																				</Text>
																			</View>
																		</View>
																	</View>
																</View>

																<View
																	style={{
																		marginTop: 10,
																		flexDirection: 'row',
																		alignContent: 'flex-start',
																		alignItems: 'flex-start',
																		justifyContent: 'flex-start',
																		// borderWidth: 1,
																	}}>
																	<View
																		style={{
																			// borderWidth: 1,
																			// flexDirection: 'row',
																			justifyContent: 'space-between',
																		}}>
																		<View
																			style={{
																				// borderWidth: 1,
																				zIndex: 9,
																				flexDirection: 'row',
																				alignItems: 'flex-start',
																				alignContent: 'flex-start',
																			}}>
																			<View>
																				<View
																					style={{
																						flexDirection: 'row',
																						alignItems: 'flex-end',
																						alignContent: 'flex-end',
																					}}>
																					<FlightTake
																						style={{ marginRight: 10 }}
																						height={30}
																						width={30}
																					/>
																					<View
																						style={{
																							height: 15,
																							width: 15,
																							borderRadius: 10,
																							backgroundColor: 'white',
																							borderWidth: 3,
																							borderColor: '#209fae',
																						}}>
																						{/* bulatan atas ========================================================= */}
																					</View>
																				</View>
																				<View
																					style={{
																						borderRightColor: '#209fae',
																						borderRightWidth: 3,
																						height: 100,
																						marginLeft: 46,
																						alignSelf: 'flex-start',
																						marginTop: -1,
																						zIndex: 1,
																					}}>
																					{/* garis ============================================================ */}
																				</View>
																			</View>

																			<View
																				style={{
																					paddingTop: 10,
																					marginLeft: 10,
																					width: '75%',
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
																							fontFamily: 'lato-light',
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
																			</View>
																		</View>

																		<View
																			style={{
																				marginTop: -20,
																				// borderWidth: 1,
																				zIndex: 9,
																				flexDirection: 'row',
																				alignItems: 'flex-start',
																				alignContent: 'flex-start',
																			}}>
																			<View
																				style={{
																					flexDirection: 'row',
																					alignItems: 'flex-end',
																					alignContent: 'flex-end',
																				}}>
																				<FlightLanding
																					style={{ marginRight: 10 }}
																					height={30}
																					width={30}
																				/>
																				<View
																					style={{
																						height: 15,
																						width: 15,
																						borderRadius: 10,
																						backgroundColor: '#209fae',
																						borderWidth: 3,
																						borderColor: '#209fae',
																					}}>
																					{/* bulatan bawah ========================================================= */}
																				</View>
																			</View>
																			<View
																				style={{
																					paddingTop: 10,
																					marginLeft: 10,
																					width: '75%',
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
																						{getKota(datas.arrival.iataCode)}
																					</Text>
																					<Text
																						style={{
																							fontFamily: 'lato-light',
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
																						// textAlign: 'right',
																					}}>
																					{getName(datas.arrival.iataCode)}
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
																		</View>
																	</View>
																</View>
															</Animated.View>

															{/* {item.segments[inde - 1] ? (
                                            <TouchableOpacity
                                                // onPress={() => {
                                                // 	// setmasking(0);
                                                // 	setdisplay(!displayz),
                                                // 		Animated.timing(gerakan, {
                                                // 			toValue: displayz === true ? 0 : 1,
                                                // 			// delay: 500,
                                                // 			duration: 3000,
                                                // 		}).start();
                                                // }}
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
                                        ) : null} */}
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
				{/* bagian bagage berangkat ====================================================== */}

				<View
					style={{
						paddingVertical: 20,
						marginHorizontal: 20,
						width: Dimensions.get('screen').width - 80,
					}}>
					{dataBerangkats.travelerPricings &&
					dataBerangkats.travelerPricings.length > 0
						? dataBerangkats.travelerPricings.map((itemss, ins) => {
								return ins === 0 && itemss.travelerType === 'ADULT' ? (
									<View
										style={{
											paddingVertical: 10,

											borderBottomWidth: 1,
											borderBottomColor: '#d3d3d3',
										}}>
										{/* {console.log(itemss)} */}
										{itemss.fareDetailsBySegment.length > 0
											? itemss.fareDetailsBySegment.map((ite, ind) => {
													return (
														<View>
															{/* tansit========================================== */}
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
															{/* tansit========================================== */}

															<View
																style={{
																	flexDirection: 'row',
																	// marginVertical: 5,
																	alignItems: 'flex-start',
																	alignContent: 'flex-start',
																}}>
																<NoteGreen height={15} width={15} />
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
					<View
						style={{
							borderBottomWidth: 1,
							borderBottomColor: '#d3d3d3',
						}}>
						<View
							style={{
								marginVertical: 10,
								flexDirection: 'row',
								justifyContent: 'space-between',
								alignContent: 'center',
								alignItems: 'center',
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
							</View>
							<Text
								style={{
									fontFamily: 'lato-reg',
									fontSize: 14,
									color: '#209fae',
									marginHorizontal: 10,
								}}>
								Info
							</Text>
						</View>
						<View
							style={{
								marginVertical: 10,
								justifyContent: 'space-between',
								flexDirection: 'row',
								alignContent: 'center',
								alignItems: 'center',
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
									Reschedule
								</Text>
							</View>
							<Text
								style={{
									fontFamily: 'lato-reg',
									fontSize: 14,
									color: '#209fae',
									marginHorizontal: 10,
								}}>
								Info
							</Text>
						</View>
					</View>
				</View>

				{/* pulang ====================================================== */}

				{request.round === true ? (
					<View>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								alignContent: 'center',
								marginVertical: 20,
							}}>
							<Plane height={50} width={50} />
							<View style={{ marginLeft: 10 }}>
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
											fontFamily: 'lato-bold',
											fontSize: 18,
											color: '#464646',
										}}>
										<Truncate text={request.to.city} length={12} />
									</Text>
									<ArrowLong
										height={20}
										width={20}
										style={{ marginHorizontal: 10 }}
									/>
									<Text
										style={{
											fontFamily: 'lato-bold',
											fontSize: 18,
											color: '#464646',
										}}>
										{' '}
										<Truncate text={request.from.city} length={12} />
									</Text>
								</View>
								<Text
									style={{
										fontFamily: 'lato-light',
										fontSize: 14,
									}}>
									{request.to.code} - {request.from.code}
								</Text>
							</View>
						</View>

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
							{dataPulang.itineraries && dataPulang.itineraries.length > 0
								? dataPulang.itineraries.map((item, i) => {
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
																			// flexDirection: 'row',
																			// paddingVertical: 10,
																			// borderWidth: 1,
																		}
																	}>
																	<Animated.View
																		// style={{
																		// 	opacity: item.segments[inde - 1]
																		// 		? displays
																		// 		: 1,
																		// 	display: item.segments[inde - 1]
																		// 		? displayz === true
																		// 			? 'flex'
																		// 			: 'none'
																		// 		: 'flex',
																		// }}
																		style={{
																			display: 'flex',
																		}}>
																		{item.segments[inde - 1] ? (
																			<View
																				style={{
																					borderBottomWidth: 1,
																					borderBottomColor: '#d3d3d3',
																					marginVertical: 20,
																				}}></View>
																		) : null}

																		<View
																			style={
																				{
																					// justifyContent: 'space-between',
																				}
																			}>
																			<View
																				style={{
																					marginBottom: 10,
																					flexDirection: 'row',
																					justifyContent: 'space-between',
																					alignItems: 'flex-end',
																					alignContent: 'flex-end',
																				}}>
																				<View>
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
																								? Datas.carriers[
																										datas.carrierCode
																								  ]
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
																				<View>
																					<View
																						style={{
																							flexDirection: 'row',
																							alignContent: 'center',
																							alignItems: 'center',
																							marginBottom: 10,
																						}}>
																						<Text
																							style={{
																								fontFamily: 'lato-semibold',
																								fontSize: 16,
																							}}>
																							PROMO
																						</Text>
																						<View
																							style={{
																								height: 5,
																								width: 5,
																								backgroundColor: '#464646',
																								borderRadius: 3,
																								marginHorizontal: 5,
																							}}></View>
																						<Text
																							style={{
																								fontFamily: 'lato-semibold',
																								fontSize: 16,
																							}}>
																							{item.segments.length > 1
																								? 'Transit'
																								: 'Langsung'}
																						</Text>
																					</View>
																					<Text
																						style={{
																							textAlign: 'right',
																							fontFamily: 'lato-light',
																							fontSize: 12,
																						}}>
																						{request.class}
																					</Text>
																				</View>
																			</View>
																			<View
																				style={{
																					flexDirection: 'row',
																					justifyContent: 'space-between',
																				}}>
																				<View
																					style={{
																						flexDirection: 'row',
																					}}>
																					<Text
																						style={{
																							fontFamily: 'lato-light',
																							fontSize: 14,
																						}}>
																						{getTimes(datas.departure.at)}
																						{' - '}
																					</Text>
																					<Text
																						style={{
																							fontFamily: 'lato-light',
																							fontSize: 14,
																						}}>
																						{getTimes(datas.arrival.at)}
																					</Text>
																				</View>
																				<View>
																					<View
																						style={{
																							flexDirection: 'row',
																							alignContent: 'center',
																							alignItems: 'center',
																						}}>
																						<Text
																							style={{
																								fontFamily: 'lato-bold',
																								fontSize: 16,
																							}}>
																							{getTime(datas.departure.at)}
																						</Text>
																						<Flight
																							style={{ marginHorizontal: 10 }}
																							height={20}
																							width={20}
																						/>
																						{/* jam ========================================================================= */}
																						<Text
																							style={{
																								fontFamily: 'lato-bold',
																								fontSize: 16,
																							}}>
																							{getTime(datas.arrival.at)}
																						</Text>
																					</View>
																				</View>
																			</View>
																		</View>

																		<View
																			style={{
																				marginTop: 10,
																				flexDirection: 'row',
																				alignContent: 'flex-start',
																				alignItems: 'flex-start',
																				justifyContent: 'flex-start',
																				// borderWidth: 1,
																			}}>
																			<View
																				style={{
																					// borderWidth: 1,
																					// flexDirection: 'row',
																					justifyContent: 'space-between',
																				}}>
																				<View
																					style={{
																						// borderWidth: 1,
																						zIndex: 9,
																						flexDirection: 'row',
																						alignItems: 'flex-start',
																						alignContent: 'flex-start',
																					}}>
																					<View>
																						<View
																							style={{
																								flexDirection: 'row',
																								alignItems: 'flex-end',
																								alignContent: 'flex-end',
																							}}>
																							<FlightTake
																								style={{ marginRight: 10 }}
																								height={30}
																								width={30}
																							/>
																							<View
																								style={{
																									height: 15,
																									width: 15,
																									borderRadius: 10,
																									backgroundColor: 'white',
																									borderWidth: 3,
																									borderColor: '#209fae',
																								}}>
																								{/* bulatan atas ========================================================= */}
																							</View>
																						</View>
																						<View
																							style={{
																								borderRightColor: '#209fae',
																								borderRightWidth: 3,
																								height: 100,
																								marginLeft: 46,
																								alignSelf: 'flex-start',
																								marginTop: -1,
																								zIndex: 1,
																							}}>
																							{/* garis ============================================================ */}
																						</View>
																					</View>

																					<View
																						style={{
																							paddingTop: 10,
																							marginLeft: 10,
																							width: '75%',
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
																								{getKota(
																									datas.departure.iataCode,
																								)}
																							</Text>
																							<Text
																								style={{
																									fontFamily: 'lato-light',
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
																							{getName(
																								datas.departure.iataCode,
																							)}
																						</Text>
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
																					</View>
																				</View>

																				<View
																					style={{
																						marginTop: -20,
																						// borderWidth: 1,
																						zIndex: 9,
																						flexDirection: 'row',
																						alignItems: 'flex-start',
																						alignContent: 'flex-start',
																					}}>
																					<View
																						style={{
																							flexDirection: 'row',
																							alignItems: 'flex-end',
																							alignContent: 'flex-end',
																						}}>
																						<FlightLanding
																							style={{ marginRight: 10 }}
																							height={30}
																							width={30}
																						/>
																						<View
																							style={{
																								height: 15,
																								width: 15,
																								borderRadius: 10,
																								backgroundColor: '#209fae',
																								borderWidth: 3,
																								borderColor: '#209fae',
																							}}>
																							{/* bulatan bawah ========================================================= */}
																						</View>
																					</View>
																					<View
																						style={{
																							paddingTop: 10,
																							marginLeft: 10,
																							width: '75%',
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
																								{getKota(
																									datas.arrival.iataCode,
																								)}
																							</Text>
																							<Text
																								style={{
																									fontFamily: 'lato-light',
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
																								// textAlign: 'right',
																							}}>
																							{getName(datas.arrival.iataCode)}
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
																				</View>
																			</View>
																		</View>
																	</Animated.View>

																	{/* {item.segments[inde - 1] ? (
                                            <TouchableOpacity
                                                // onPress={() => {
                                                // 	// setmasking(0);
                                                // 	setdisplay(!displayz),
                                                // 		Animated.timing(gerakan, {
                                                // 			toValue: displayz === true ? 0 : 1,
                                                // 			// delay: 500,
                                                // 			duration: 3000,
                                                // 		}).start();
                                                // }}
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
                                        ) : null} */}
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

						{/* bagian bagage pulang ====================================================== */}

						<View
							style={{
								paddingVertical: 20,
								marginHorizontal: 20,
								width: Dimensions.get('screen').width - 80,
							}}>
							{dataPulang.travelerPricings &&
							dataPulang.travelerPricings.length > 0
								? dataPulang.travelerPricings.map((itemss, ins) => {
										return ins === 0 && itemss.travelerType === 'ADULT' ? (
											<View
												style={{
													paddingVertical: 10,

													borderBottomWidth: 1,
													borderBottomColor: '#d3d3d3',
												}}>
												{/* {console.log(itemss)} */}
												{itemss.fareDetailsBySegment.length > 0
													? itemss.fareDetailsBySegment.map((ite, ind) => {
															return (
																<View>
																	{/* tansit========================================== */}
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
																	{/* tansit========================================== */}

																	<View
																		style={{
																			flexDirection: 'row',
																			// marginVertical: 5,
																			alignItems: 'flex-start',
																			alignContent: 'flex-start',
																		}}>
																		<NoteGreen height={15} width={15} />
																		<View>
																			<Getdataflys id={ite.segmentId} />
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
							<View
								style={{
									borderBottomWidth: 1,
									borderBottomColor: '#d3d3d3',
								}}>
								<View
									style={{
										marginVertical: 10,
										flexDirection: 'row',
										justifyContent: 'space-between',
										alignContent: 'center',
										alignItems: 'center',
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
									</View>
									<Text
										style={{
											fontFamily: 'lato-reg',
											fontSize: 14,
											color: '#209fae',
											marginHorizontal: 10,
										}}>
										Info
									</Text>
								</View>
								<View
									style={{
										marginVertical: 10,
										justifyContent: 'space-between',
										flexDirection: 'row',
										alignContent: 'center',
										alignItems: 'center',
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
											Reschedule
										</Text>
									</View>
									<Text
										style={{
											fontFamily: 'lato-reg',
											fontSize: 14,
											color: '#209fae',
											marginHorizontal: 10,
										}}>
										Info
									</Text>
								</View>
							</View>
						</View>
					</View>
				) : null}
				{/* <View style={{ height: 50 }}></View> */}
			</ScrollView>

			{/* bagian footer =========================== */}

			<Modal
				animationIn='slideInUp'
				animationOut='slideOutDown'
				isVisible={modalshow}
				avoidKeyboard={false}
				style={{
					justifyContent: 'flex-end',
					alignItems: 'center',
					alignContent: 'center',
					margin: 0,
				}}>
				<Animated.View
					style={{
						height: 5,
						backgroundColor: '#209fae',
						// opacity: opacity,
						width: '100%',
					}}></Animated.View>
				<View
					style={{
						backgroundColor: 'white',
						paddingBottom: 10,
						width: Dimensions.get('screen').width,
						// paddingHorizontal: 20,

						// borderWidth: 1,
					}}>
					<TouchableOpacity
						style={{
							// shadowColor: '#464646',
							// shadowOffset: { width: 2, height: 2 },
							// shadowOpacity: 1,
							// shadowRadius: 2,
							// elevation: 5,
							flexDirection: 'row',
							// height: 30,
							padding: 20,
							borderBottomWidth: 1,
							borderBottomColor: '#d3d3d3',
							width: '100%',
							backgroundColor: 'white',
							// display: isPanelActive === true ? 'none' : 'flex',
							alignContent: 'center',
							alignItems: 'center',
							justifyContent: 'flex-start',
						}}
						onPressIn={() => {
							closePanel();
						}}
						onPress={() => {
							closePanel();
						}}
						onPressOut={() => {
							closePanel();
						}}
						onLongPress={() => {
							closePanel();
						}}>
						<Bottom height={20} width={20} style={{}} />
						<Text
							style={{
								fontFamily: 'lato-light',
								fontSize: 14,
							}}>
							Total Price for 3 Person(s)
						</Text>
					</TouchableOpacity>

					<Getharga />
				</View>
				<Renderbottom />
			</Modal>

			<TouchableOpacity
				style={{
					// shadowColor: '#464646',
					// shadowOffset: { width: 2, height: 2 },
					// shadowOpacity: 1,
					// shadowRadius: 2,
					// elevation: 5,
					flexDirection: 'row',
					// height: 30,
					paddingVertical: 10,
					paddingHorizontal: 20,
					borderBottomColor: '#d3d3d3',
					borderBottomWidth: 0.5,
					borderTopColor: '#d3d3d3',
					borderTopWidth: 0.5,
					width: '100%',
					backgroundColor: 'white',
					// display: isPanelActive === true ? 'none' : 'flex',
					alignContent: 'center',
					alignItems: 'center',
					justifyContent: 'flex-start',
				}}
				onPressIn={() => {
					openPanel();
				}}
				onPress={() => {
					openPanel();
				}}
				onPressOut={() => {
					openPanel();
				}}
				onLongPress={() => {
					openPanel();
				}}>
				<Bottom height={20} width={20} style={{}} />
				<Text
					style={{
						fontFamily: 'lato-light',
						fontSize: 14,
					}}>
					Total Price for 3 Person(s)
				</Text>
			</TouchableOpacity>
			<Renderbottom />
		</SafeAreaView>
	);
}

FlightPrice.navigationOptions = (props) => ({
	// headerTransparent: true,
	headerTitle: 'Booking Summary',
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
