import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Dimensions,
	SafeAreaView,
	View,
	Image,
	ScrollView,
	TouchableWithoutFeedback,
	Pressable,
	StyleSheet,
	Alert,
} from "react-native";
import { Text, Button, StatusBar, Truncate, FunIcon } from "../../../component";
import DestinationById from "../../../graphQL/Query/Destination/DestinationById";
import { useQuery, useMutation } from "@apollo/react-hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
	Arrowbackwhite,
	LikeEmpty,
	Star,
	LikeBlack,
	ShareBlack,
	PinHijau,
	UnescoIcon,
	MovieIcon,
	Clock,
	Globe,
	Xhitam,
	WebsiteHitam,
	TeleponHitam,
	InstagramHitam,
	ClockHitam,
	SendReview,
} from "../../../assets/svg";
import {
	activity_unesco1,
	activity_unesco2,
	activity_unesco3,
	activity_unesco4,
	activity_unesco5,
	activity_unesco6,
	activity_unesco7,
} from "../../../assets/png";
import { TabBar, SceneMap, TabView } from "react-native-tab-view";
import Modal from "react-native-modal";
import Ripple from "react-native-material-ripple";
import Liked from "../../../graphQL/Mutation/Destination/Liked";
import ActivityModal from "./ActivityModal";
import FacilityModal from "./FacilityModal";
import ServiceModal from "./ServiceModal";

const { width, height } = Dimensions.get("screen");
export default function index(props) {
	const [setting, setSetting] = useState("");
	const [token, setToken] = useState("");
	const [modalActivity, setModalActivity] = useState(false);
	const [modalFacility, setModalFacility] = useState(false);
	const [modalService, setModalService] = useState(false);
	const [modalTime, setModalTime] = useState(false);
	const [modalSosial, setModalSosial] = useState(false);
	const [modalReview, setModalReview] = useState(false);

	const loadAsync = async () => {
		let tkn = await AsyncStorage.getItem("access_token");
		await setToken(tkn);

		let setsetting = await AsyncStorage.getItem("setting");
		await setSetting(JSON.parse(setsetting));
	};

	useEffect(() => {
		const unsubscribe = props.navigation.addListener("focus", () => {
			loadAsync();
		});
		return unsubscribe;
	}, [props.navigation]);

	const { data, loading, error } = useQuery(DestinationById, {
		variables: { id: props.route.params.id },
		context: {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		},
	});
	console.log("data detail :", data);

	const General = (props) => {
		let [more, setMore] = useState(false);
		let [lines, setLines] = useState(3);
		const layoutText = (e) => {
			setMore(e.nativeEvent.lines.length > 3 && lines !== 0);
		};
		return (
			<>
				{loading ? (
					<View style={{ marginTop: 20 }}>
						<ActivityIndicator animating={true} color="#209FAE" />
					</View>
				) : (
					<ScrollView showsVerticalScrollIndicator={false}>
						{/* View descrition */}
						{data?.destinationById?.description ? (
							<View
								style={{
									minHeight: 30,
									marginTop: 10,
									width: Dimensions.get("screen").width,
									paddingHorizontal: 15,
								}}
							>
								<Text
									size="readable"
									type="regular"
									style={{
										lineHeight: 20,
										textAlign: "left",
									}}
									numberOfLines={lines}
									onTextLayout={layoutText}
								>
									{data?.destinationById?.description}
								</Text>
								{more && (
									<Text
										size="readable"
										type="regular"
										onPress={() => {
											setLines(0);
											setMore(false);
										}}
										style={{ color: "#209FAE" }}
									>
										more
									</Text>
								)}
								{!more && (
									<Text
										size="readable"
										type="regular"
										onPress={() => {
											setLines(3);
										}}
										style={{ color: "#209FAE" }}
									>
										hide more
									</Text>
								)}
							</View>
						) : null}

						{/* View GreatFor */}
						{data &&
						data.destinationById &&
						data.destinationById.greatfor.length > 0 ? (
							<View
								style={{
									width: Dimensions.get("screen").width,
									paddingHorizontal: 15,
								}}
							>
								<View
									style={{
										marginTop: 10,
										borderRadius: 10,
										borderWidth: 1,
										borderColor: "#F3F3F3",
										minHeight: 50,
										justifyContent: "center",
										padding: 10,
										backgroundColor: "#FFF",
										shadowOffset: { width: 0, height: 1 },
										shadowOpacity: Platform.OS == "ios" ? 0.22 : 2,
										shadowRadius: Platform.OS == "ios" ? 2.22 : 1.0,
										elevation: Platform.OS == "ios" ? 3 : 3.5,
									}}
								>
									<Text
										size="description"
										type="bold"
										style={{ textAlign: "center" }}
									>
										Great For
									</Text>
									<View style={{ flexDirection: "row" }}>
										<View
											style={{
												marginTop: 10,
												width: 70,
												justifyContent: "center",
												alignItems: "center",
											}}
										>
											<View
												style={{
													height: 40,
													width: 40,
													borderRadius: 20,
													backgroundColor: "#F6F6F6",
													justifyContent: "center",
													alignItems: "center",
												}}
											>
												<FunIcon icon="i-4wd" height={20} width={20} />
											</View>
											<Text
												size="description"
												type="light"
												style={{ marginTop: 5 }}
											>
												Sunbating
											</Text>
										</View>
										<View
											style={{
												marginTop: 10,
												width: 70,
												justifyContent: "center",
												alignItems: "center",
											}}
										>
											<View
												style={{
													height: 40,
													width: 40,
													borderRadius: 20,
													backgroundColor: "#F6F6F6",
													justifyContent: "center",
													alignItems: "center",
												}}
											>
												<FunIcon icon="i-4wd" height={20} width={20} />
											</View>
											<Text
												size="description"
												type="light"
												style={{ marginTop: 5 }}
											>
												Sunbating
											</Text>
										</View>
										<View
											style={{
												marginTop: 10,
												width: 70,
												justifyContent: "center",
												alignItems: "center",
											}}
										>
											<View
												style={{
													height: 40,
													width: 40,
													borderRadius: 20,
													backgroundColor: "#F6F6F6",
													justifyContent: "center",
													alignItems: "center",
												}}
											>
												<FunIcon icon="i-4wd" height={20} width={20} />
											</View>
											<Text
												size="description"
												type="light"
												style={{ marginTop: 5 }}
											>
												Sunbating
											</Text>
										</View>
										<View
											style={{
												marginTop: 10,
												width: 70,
												justifyContent: "center",
												alignItems: "center",
											}}
										>
											<View
												style={{
													height: 40,
													width: 40,
													borderRadius: 20,
													backgroundColor: "#F6F6F6",
													justifyContent: "center",
													alignItems: "center",
												}}
											>
												<FunIcon icon="i-4wd" height={20} width={20} />
											</View>
											<Text
												size="description"
												type="light"
												style={{ marginTop: 5 }}
											>
												Sunbating
											</Text>
										</View>
									</View>
								</View>
							</View>
						) : null}

						{/* View Public Facilty */}
						{data &&
						data.destinationById &&
						data.destinationById.core_facilities.length > 0 ? (
							<View
								style={{
									width: Dimensions.get("screen").width,
									paddingHorizontal: 15,
								}}
							>
								<View
									style={{
										marginTop: 10,
										borderRadius: 10,
										minHeight: 50,
										justifyContent: "center",
										padding: 10,
										backgroundColor: "#FFF",
										shadowOffset: { width: 0, height: 1 },
										shadowOpacity: Platform.OS == "ios" ? 0.22 : 2,
										shadowRadius: Platform.OS == "ios" ? 2.22 : 1.0,
										elevation: Platform.OS == "ios" ? 3 : 3.5,
									}}
								>
									<Text
										size="description"
										type="bold"
										style={{ textAlign: "center" }}
									>
										Public Facility
									</Text>
									<View style={{ flexDirection: "row" }}>
										{data &&
											data.destinationById &&
											data.destinationById.core_facilities.map(
												(item, index) => (
													<View
														key={index}
														style={{
															marginTop: 10,
															width: 70,
															justifyContent: "center",
															alignItems: "center",
														}}
													>
														<View
															style={{
																height: 40,
																width: 40,
																borderRadius: 20,
																backgroundColor: "#F6F6F6",
																justifyContent: "center",
																alignItems: "center",
															}}
														>
															<FunIcon
																icon={item?.icon}
																height={25}
																width={25}
															/>
														</View>
														<Text
															size="description"
															type="light"
															style={{ marginTop: 5 }}
														>
															{item?.name}
														</Text>
													</View>
												)
											)}
									</View>
								</View>
							</View>
						) : null}

						{/* Movie Location */}
						{data && data.destinationById && data.destinationById.facility ? (
							<>
								<View
									style={{
										width: Dimensions.get("screen").width,
										paddingHorizontal: 15,
										marginTop: 10,
									}}
								>
									<Text size="label" type="bold">
										Movie Location
									</Text>
								</View>
								<ScrollView
									style={{
										width: Dimensions.get("screen").width,
										paddingHorizontal: 15,
									}}
									horizontal={true}
									showsHorizontalScrollIndicator={false}
								>
									<Pressable
										style={{
											borderRadius: 10,
											borderWidth: 1,
											borderColor: "#F3F3F3",
											height: 130,
											marginTop: 10,
											marginBottom: 10,
											flexDirection: "row",
											width: Dimensions.get("screen").width * 0.9,
											padding: 10,
											backgroundColor: "#FFF",
											shadowOffset: { width: 0, height: 1 },
											shadowOpacity: Platform.OS == "ios" ? 0.22 : 2,
											shadowRadius: Platform.OS == "ios" ? 2.22 : 1.0,
											elevation: Platform.OS == "ios" ? 3 : 3.5,
										}}
									>
										<Image
											source={{ uri: data?.destinationById?.images[0].image }}
											style={{ height: "100%", width: "30%", borderWidth: 1 }}
										/>
										<View
											style={{ width: "65%", height: "100%", marginLeft: 10 }}
										>
											<Text size="label" type="bold">
												Sang Pemimpi
											</Text>
											<Text
												size="description"
												type="reguler"
												style={{ lineHeight: 20 }}
											>
												{Truncate({
													text: data?.destinationById?.description,
													length: 100,
												})}
											</Text>
										</View>
									</Pressable>
									<Pressable
										style={{
											borderRadius: 10,
											borderWidth: 1,
											borderColor: "#F3F3F3",
											height: 130,
											marginTop: 10,
											marginBottom: 10,
											flexDirection: "row",
											width: "100%",
											padding: 10,
											marginLeft: 10,
											width: Dimensions.get("screen").width * 0.9,
											marginRight: 30,
											backgroundColor: "#FFF",
											shadowOffset: { width: 0, height: 1 },
											shadowOpacity: Platform.OS == "ios" ? 0.22 : 2,
											shadowRadius: Platform.OS == "ios" ? 2.22 : 1.0,
											elevation: Platform.OS == "ios" ? 3 : 3.5,
										}}
									>
										<Image
											source={{ uri: data?.destinationById?.images[0].image }}
											style={{ height: "100%", width: "30%", borderWidth: 1 }}
										/>
										<View
											style={{ width: "65%", height: "100%", marginLeft: 10 }}
										>
											<Text size="label" type="bold">
												Sang Pemimpi
											</Text>
											<Text size="description" type="regular">
												{Truncate({
													text: data?.destinationById?.description,
													length: 200,
												})}
											</Text>
										</View>
									</Pressable>
								</ScrollView>
							</>
						) : null}

						{/* Photo */}
						{data && data.destinationById && data.destinationById.images ? (
							<View
								style={{
									width: Dimensions.get("screen").width,
									paddingHorizontal: 15,
									marginTop: 10,
								}}
							>
								<Text size="label" type="bold">
									Photos
								</Text>
								<View
									style={{
										flexDirection: "row",
										marginTop: 10,
										width: "100%",
									}}
								>
									{data && data.destinationById
										? data.destinationById.images.map((item, index) => (
												<Image
													key={index}
													source={{ uri: item.image }}
													style={{ width: 80, height: 80, marginLeft: 2 }}
												/>
										  ))
										: null}
								</View>
							</View>
						) : null}

						{/* Another Place */}
						<View
							style={{
								width: Dimensions.get("screen").width,
								paddingHorizontal: 15,
								marginTop: 10,
								marginBottom: 50,
							}}
						>
							<Text size="label" type="bold">
								Another Place
							</Text>
							{data &&
								data.destinationById.another_place.map(
									(item, index) => (
										console.log("anot", item),
										(
											<View
												key={index}
												style={{
													borderWidth: 1,
													borderColor: "#F3F3F3",
													borderRadius: 10,
													height: 170,
													padding: 10,
													marginTop: 10,
													width: "100%",
													flexDirection: "row",
													backgroundColor: "#FFF",
													shadowOffset: { width: 0, height: 1 },
													shadowOpacity: Platform.OS == "ios" ? 0.22 : 2,
													shadowRadius: Platform.OS == "ios" ? 2.22 : 1.0,
													elevation: Platform.OS == "ios" ? 3 : 3.5,
												}}
											>
												{/* Image */}
												<Image
													source={{ uri: item.images.image }}
													style={{
														width: "40%",
														height: "100%",
														borderRadius: 10,
													}}
												/>

												{/* Keterangan */}
												{/* rating */}
												<View style={{ width: "55%", marginHorizontal: 10 }}>
													<View
														style={{
															flexDirection: "row",
															justifyContent: "space-between",
															alignItems: "center",
														}}
													>
														<View
															style={{
																flexDirection: "row",
																backgroundColor: "#F3F3F3",
																borderRadius: 3,
																justifyContent: "center",
																alignItems: "center",
																paddingHorizontal: 5,
																height: 25,
															}}
														>
															<Star height={15} width={15} />
															<Text size="description" type="bold">
																{item.rating}
															</Text>
														</View>
														<View
															style={{
																backgroundColor: "#F3F3F3",
																height: 34,
																width: 34,
																borderRadius: 17,
																justifyContent: "center",
																alignItems: "center",
															}}
														>
															<LikeEmpty height={15} width={15} />
														</View>
													</View>

													{/* Title */}
													<Text
														size="label"
														type="bold"
														style={{ marginTop: 2 }}
														numberOfLines={1}
													>
														{item.name}
													</Text>

													{/* Maps */}
													<View
														style={{
															flexDirection: "row",
															marginTop: 5,
															alignItems: "center",
														}}
													>
														<PinHijau height={15} width={15} />
														<Text
															size="description"
															type="regular"
															style={{ marginLeft: 5 }}
															numberOfLines={1}
														>
															{item.cities.name}
														</Text>
													</View>

													{/* Great for */}

													<View
														style={{
															flexDirection: "row",
															justifyContent: "space-between",
															height: 50,
															marginTop: 5,
														}}
													>
														<View>
															<Text size="description" type="bold">
																Great for :
															</Text>
															{item.greatfor.icon ? (
																<View style={{ flexDirection: "row" }}>
																	<FunIcon
																		icon={item.greatfor.icon}
																		height={30}
																		width={30}
																	/>
																</View>
															) : null}
														</View>
														<Button text={"Add"} style={{ marginTop: 5 }} />
													</View>
												</View>
											</View>
										)
									)
								)}
						</View>
					</ScrollView>
				)}
			</>
		);
	};

	const Activity = () => (
		<ScrollView
			style={{
				flex: 1,
				width: Dimensions.get("screen").width,
				paddingHorizontal: 15,
			}}
			showsHorizontalScrollIndicator={false}
		>
			<View
				style={{
					borderWidth: 1,
					borderRadius: 10,
					borderColor: "#F3F3F3",
					minHeight: 250,
					marginTop: 10,
					padding: 10,
					backgroundColor: "#FFF",
					shadowOffset: { width: 0, height: 1 },
					shadowOpacity: Platform.OS == "ios" ? 0.22 : 2,
					shadowRadius: Platform.OS == "ios" ? 2.22 : 1.0,
					elevation: Platform.OS == "ios" ? 3 : 3.5,
				}}
			>
				{/* Title */}
				<View
					style={{
						height: 30,
						width: "100%",
						flexDirection: "row",
					}}
				>
					<View
						style={{
							backgroundColor: "#209FAE",
							height: 30,
							width: 30,
							borderRadius: 15,
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<Text style={{ color: "#FFF" }} size="title" type="bold">
							1
						</Text>
					</View>
					<Text
						size="title"
						type="bold"
						style={{ color: "#209FAE", marginLeft: 15 }}
					>
						Banana Boat
					</Text>
				</View>

				{/* Image*/}
				<Image
					source={activity_unesco1}
					style={{
						height: 150,
						width: "100%",
						marginTop: 10,
						borderRadius: 10,
					}}
				/>
				<Text size="description" type="regular" style={{ marginTop: 10 }}>
					<Truncate text={data?.destinationById?.description} length={100} />
				</Text>
				<Button
					onPress={() => setModalActivity(true)}
					// onPress={() => console.log("true")}
					text={"Details"}
					type="box"
					size="small"
					variant="transparent"
					style={{
						borderColor: "#209FAE",
						borderWidth: 1,
						marginTop: 10,
						width: 100,
						alignSelf: "center",
						marginBottom: 10,
					}}
				></Button>
			</View>
			<View
				style={{
					borderWidth: 1,
					borderRadius: 10,
					borderColor: "#F3F3F3",
					minHeight: 250,
					marginTop: 10,
					padding: 10,
					backgroundColor: "#FFF",
					shadowOffset: { width: 0, height: 1 },
					shadowOpacity: Platform.OS == "ios" ? 0.22 : 2,
					shadowRadius: Platform.OS == "ios" ? 2.22 : 1.0,
					elevation: Platform.OS == "ios" ? 3 : 3.5,
				}}
			>
				{/* Title */}
				<View
					style={{
						height: 30,
						width: "100%",
						flexDirection: "row",
					}}
				>
					<View
						style={{
							backgroundColor: "#209FAE",
							height: 30,
							width: 30,
							borderRadius: 15,
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<Text style={{ color: "#FFF" }} size="title" type="bold">
							2
						</Text>
					</View>
					<Text
						size="title"
						type="bold"
						style={{ color: "#209FAE", marginLeft: 15 }}
					>
						Jetski
					</Text>
				</View>

				{/* Image*/}
				<Image
					source={activity_unesco2}
					style={{
						height: 150,
						width: "100%",
						marginTop: 10,
						borderRadius: 10,
					}}
				/>
				<Text size="description" type="regular" style={{ marginTop: 10 }}>
					<Truncate text={data?.destinationById?.description} length={100} />
				</Text>
				<Button
					text={"Details"}
					type="box"
					size="small"
					variant="transparent"
					style={{
						borderColor: "#209FAE",
						borderWidth: 1,
						marginTop: 10,
						width: 100,
						alignSelf: "center",
						marginBottom: 10,
					}}
				></Button>
			</View>
			<View
				style={{
					borderWidth: 1,
					borderRadius: 10,
					borderColor: "#F3F3F3",
					minHeight: 250,
					padding: 10,
					backgroundColor: "#FFF",
					shadowOffset: { width: 0, height: 1 },
					shadowOpacity: Platform.OS == "ios" ? 0.22 : 2,
					shadowRadius: Platform.OS == "ios" ? 2.22 : 1.0,
					elevation: Platform.OS == "ios" ? 3 : 3.5,
					marginVertical: 10,
				}}
			>
				{/* Title */}
				<View
					style={{
						height: 30,
						width: "100%",
						flexDirection: "row",
					}}
				>
					<View
						style={{
							backgroundColor: "#209FAE",
							height: 30,
							width: 30,
							borderRadius: 15,
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<Text style={{ color: "#FFF" }} size="title" type="bold">
							3
						</Text>
					</View>
					<Text
						size="title"
						type="bold"
						style={{ color: "#209FAE", marginLeft: 15 }}
					>
						Parasailing
					</Text>
				</View>

				{/* Image*/}
				<Image
					source={activity_unesco3}
					style={{
						height: 150,
						width: "100%",
						marginTop: 10,
						borderRadius: 10,
					}}
				/>
				<Text size="description" type="regular" style={{ marginTop: 10 }}>
					<Truncate text={data?.destinationById?.description} length={100} />
				</Text>
				<Button
					onPress={() => setModalActivity(true)}
					text={"Details"}
					type="box"
					size="small"
					variant="transparent"
					style={{
						borderColor: "#209FAE",
						borderWidth: 1,
						marginTop: 10,
						width: 100,
						alignSelf: "center",
						marginBottom: 10,
					}}
				></Button>
			</View>
		</ScrollView>
	);

	const Facility = () => (
		<ScrollView
			style={{
				flex: 1,
				width: Dimensions.get("screen").width,
				paddingHorizontal: 15,
			}}
			showsVerticalScrollIndicator={false}
		>
			<View
				style={{
					borderWidth: 1,
					borderRadius: 10,
					borderColor: "#F3F3F3",
					minHeight: 250,
					marginTop: 10,
					padding: 10,
					backgroundColor: "#FFF",
					shadowOffset: { width: 0, height: 1 },
					shadowOpacity: Platform.OS == "ios" ? 0.22 : 2,
					shadowRadius: Platform.OS == "ios" ? 2.22 : 1.0,
					elevation: Platform.OS == "ios" ? 3 : 3.5,
				}}
			>
				{/* Title */}
				<View
					style={{
						height: 30,
						width: "100%",
						flexDirection: "row",
					}}
				>
					<View
						style={{
							backgroundColor: "#209FAE",
							height: 30,
							width: 30,
							borderRadius: 15,
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<Text style={{ color: "#FFF" }} size="title" type="bold">
							1
						</Text>
					</View>
					<Text
						size="title"
						type="bold"
						style={{ color: "#209FAE", marginLeft: 15 }}
					>
						Toilet
					</Text>
				</View>

				{/* Image*/}
				<Image
					source={activity_unesco4}
					style={{
						height: 150,
						width: "100%",
						marginTop: 10,
						borderRadius: 10,
					}}
				/>
				<Text size="description" type="regular" style={{ marginTop: 10 }}>
					<Truncate text={data?.destinationById?.description} length={100} />
				</Text>
				<Button
					onPress={() => setModalFacility(true)}
					text={"Details"}
					type="box"
					size="small"
					variant="transparent"
					style={{
						borderColor: "#209FAE",
						borderWidth: 1,
						marginTop: 10,
						width: 100,
						alignSelf: "center",
						marginBottom: 10,
					}}
				></Button>
			</View>
			<View
				style={{
					borderWidth: 1,
					borderRadius: 10,
					borderColor: "#F3F3F3",
					minHeight: 250,
					marginTop: 10,
					padding: 10,
					backgroundColor: "#FFF",
					shadowOffset: { width: 0, height: 1 },
					shadowOpacity: Platform.OS == "ios" ? 0.22 : 2,
					shadowRadius: Platform.OS == "ios" ? 2.22 : 1.0,
					elevation: Platform.OS == "ios" ? 3 : 3.5,
				}}
			>
				{/* Title */}
				<View
					style={{
						height: 30,
						width: "100%",
						flexDirection: "row",
					}}
				>
					<View
						style={{
							backgroundColor: "#209FAE",
							height: 30,
							width: 30,
							borderRadius: 15,
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<Text style={{ color: "#FFF" }} size="title" type="bold">
							2
						</Text>
					</View>
					<Text
						size="title"
						type="bold"
						style={{ color: "#209FAE", marginLeft: 15 }}
					>
						Changing Room
					</Text>
				</View>

				{/* Image*/}
				<Image
					source={activity_unesco6}
					style={{
						height: 150,
						width: "100%",
						marginTop: 10,
						borderRadius: 10,
					}}
				/>
				<Text size="description" type="regular" style={{ marginTop: 10 }}>
					<Truncate text={data?.destinationById?.description} length={100} />
				</Text>
				<Button
					text={"Details"}
					type="box"
					size="small"
					variant="transparent"
					style={{
						borderColor: "#209FAE",
						borderWidth: 1,
						marginTop: 10,
						width: 100,
						alignSelf: "center",
						marginBottom: 10,
					}}
				></Button>
			</View>
			<View
				style={{
					borderWidth: 1,
					borderRadius: 10,
					borderColor: "#F3F3F3",
					minHeight: 250,
					marginVertical: 10,
					padding: 10,
					backgroundColor: "#FFF",
					shadowOffset: { width: 0, height: 1 },
					shadowOpacity: Platform.OS == "ios" ? 0.22 : 2,
					shadowRadius: Platform.OS == "ios" ? 2.22 : 1.0,
					elevation: Platform.OS == "ios" ? 3 : 3.5,
				}}
			>
				{/* Title */}
				<View
					style={{
						height: 30,
						width: "100%",
						flexDirection: "row",
					}}
				>
					<View
						style={{
							backgroundColor: "#209FAE",
							height: 30,
							width: 30,
							borderRadius: 15,
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<Text style={{ color: "#FFF" }} size="title" type="bold">
							3
						</Text>
					</View>
					<Text
						size="title"
						type="bold"
						style={{ color: "#209FAE", marginLeft: 15 }}
					>
						Parking
					</Text>
				</View>

				{/* Image*/}
				<Image
					source={activity_unesco7}
					style={{
						height: 150,
						width: "100%",
						marginTop: 10,
						borderRadius: 10,
					}}
				/>
				<Text size="description" type="regular" style={{ marginTop: 10 }}>
					<Truncate text={data?.destinationById?.description} length={100} />
				</Text>
				<Button
					text={"Details"}
					type="box"
					size="small"
					variant="transparent"
					style={{
						borderColor: "#209FAE",
						borderWidth: 1,
						marginTop: 10,
						width: 100,
						alignSelf: "center",
						marginBottom: 10,
					}}
				></Button>
			</View>
		</ScrollView>
	);

	const Service = () => (
		<ScrollView
			style={{
				flex: 1,
				width: Dimensions.get("screen").width,
				paddingHorizontal: 15,
			}}
			showsVerticalScrollIndicator={false}
		>
			<View
				style={{
					borderWidth: 1,
					borderRadius: 10,
					borderColor: "#F3F3F3",
					minHeight: 250,
					marginVertical: 10,
					padding: 10,
					backgroundColor: "#FFF",
					shadowOffset: { width: 0, height: 1 },
					shadowOpacity: Platform.OS == "ios" ? 0.22 : 2,
					shadowRadius: Platform.OS == "ios" ? 2.22 : 1.0,
					elevation: Platform.OS == "ios" ? 3 : 3.5,
				}}
			>
				{/* Title */}
				<View
					style={{
						height: 30,
						width: "100%",
						flexDirection: "row",
					}}
				>
					<View
						style={{
							backgroundColor: "#209FAE",
							height: 30,
							width: 30,
							borderRadius: 15,
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<Text style={{ color: "#FFF" }} size="title" type="bold">
							1
						</Text>
					</View>
					<Text
						size="title"
						type="bold"
						style={{ color: "#209FAE", marginLeft: 15 }}
					>
						Pijat Tradisional
					</Text>
				</View>

				{/* Image*/}
				<Image
					source={activity_unesco5}
					style={{
						height: 150,
						width: "100%",
						marginTop: 10,
						borderRadius: 10,
					}}
				/>
				<Text size="description" type="regular" style={{ marginTop: 10 }}>
					<Truncate text={data?.destinationById?.description} length={100} />
				</Text>
				<Button
					onPress={() => setModalService(true)}
					text={"Details"}
					type="box"
					size="small"
					variant="transparent"
					style={{
						borderColor: "#209FAE",
						borderWidth: 1,
						marginTop: 10,
						width: 100,
						alignSelf: "center",
						marginBottom: 10,
					}}
				></Button>
			</View>
		</ScrollView>
	);

	const FAQ = () => (
		<View
			style={{
				marginTop: 20,
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<Text size="title" type="bold">
				FAQ
			</Text>
		</View>
	);

	const Review = () => (
		<ScrollView
			style={{
				flex: 1,
				width: Dimensions.get("screen").width,
				paddingHorizontal: 15,
			}}
			showsVerticalScrollIndicator={false}
		>
			{data.destinationById.review.length > 0 ? (
				<>
					{/* View Name */}
					<View
						style={{
							height: 70,
							flexDirection: "row",
							marginTop: 15,
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<View style={{ flexDirection: "row" }}>
							<View
								style={{
									backgroundColor: "#464646",
									height: 50,
									width: 50,
									borderRadius: 25,
								}}
							></View>
							<View style={{ marginLeft: 10 }}>
								<Text size="label" type="bold">
									Wisnu Utama
								</Text>
								<View style={{ flexDirection: "row" }}>
									<Star height={15} width={15} />
									<Star height={15} width={15} />
									<Star height={15} width={15} />
									<Star height={15} width={15} />
									<Text
										size="description"
										type="regular"
										style={{ marginLeft: 5 }}
									>
										9.8/10
									</Text>
								</View>
								<Text size="small" type="reguler">
									23 June
								</Text>
							</View>
						</View>
						<View style={{ flexDirection: "row", alignItems: "center" }}>
							<LikeEmpty height={25} width={25} />
							<Text size="small" type="regular" style={{ marginLeft: 10 }}>
								112
							</Text>
						</View>
					</View>
					<View
						style={
							{
								// marginTop: 15,
							}
						}
					>
						<Text
							// numberOfLines={2}
							ellipsizeMode="head"
							size="label"
							type="reguler"
						>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Diam
							cursus nunc, etiam Lorem ipsum dolor sit amet, consectetur
							adipiscing elit. Diam cursus nunc, etiam Lorem ipsum dolor sit
							amet, consectetur adipiscing elit. Diam cursus nunc, etiam
						</Text>
					</View>
					<View
						style={{
							marginTop: 10,
							flexDirection: "row",
						}}
					>
						<Image
							source={activity_unesco2}
							style={{ height: 110, width: 130, borderRadius: 5 }}
						/>
						<Image
							source={activity_unesco2}
							style={{
								height: 110,
								width: 130,
								marginLeft: 10,
								borderRadius: 5,
							}}
						/>
					</View>
				</>
			) : (
				<View
					style={{
						alignItems: "center",
						marginTop: 20,
					}}
				>
					<Text size="label" type="bold">
						Tidak ada Review
					</Text>
				</View>
			)}
			<Button
				color="secondary"
				type="icon"
				text="Write Review"
				style={{
					bottom: 0,
					width: Dimensions.get("screen").width * 0.7,
					borderRadius: 42,
					alignSelf: "center",
					marginTop: Dimensions.get("screen").height * 0.2,
				}}
				onPress={() =>
					props.navigation.navigate("DestinationUnescoReview", {
						data: data.destinationById,
					})
				}
			>
				<SendReview height={15} width={15} />
			</Button>
		</ScrollView>
	);

	const [index, setIndex] = React.useState(0);
	const [routes] = React.useState([
		{ key: "general", title: "General" },
		{ key: "activity", title: "Activity" },
		{ key: "facility", title: "Facility" },
		{ key: "service", title: "Service" },
		{ key: "FAQ", title: "FAQ" },
		{ key: "review", title: "Review" },
	]);

	const renderScene = SceneMap({
		general: General,
		activity: Activity,
		facility: Facility,
		service: Service,
		FAQ: FAQ,
		review: Review,
	});

	const [
		mutationliked,
		{ loading: loadingLike, data: dataLike, error: errorLike },
	] = useMutation(Liked, {
		context: {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		},
	});

	const _liked = async (id) => {
		console.log("id :", id);
		console.log("token :", token);
		if (token || token !== "") {
			try {
				let response = await mutationliked({
					variables: {
						id: id,
						qty: 1,
					},
				});
				console.log("Response :", response);
				if (loadingLike) {
					Alert.alert("Loading!!");
				}
				if (errorLike) {
					throw new Error("Error Input");
				}
				if (response.data) {
					if (
						response.data.like_journal.code === 200 ||
						response.data.like_journal.code === "200"
					) {
						// var tempData = { ...dataList };
						// tempData.liked = true;
						// setDataList(tempData);
						// fetchData();
					} else {
						throw new Error(response.data.like_journal.message);
					}
				}
			} catch (error) {
				Alert.alert("" + error);
			}
		} else {
			Alert.alert("Please Login");
		}
	};

	const _unliked = async (id) => {
		if (token || token !== "") {
			try {
				let response = await mutationUnliked({
					variables: {
						id: id,
					},
				});
				if (loadingUnLike) {
					Alert.alert("Loading!!");
				}
				if (errorUnLike) {
					throw new Error("Error Input");
				}
				if (response.data) {
					if (
						response.data.unlike_journal.code === 200 ||
						response.data.unlike_journal.code === "200"
					) {
						var tempData = { ...dataList };
						tempData.liked = false;
						setDataList(tempData);
						fetchData();
					} else {
						throw new Error(response.data.unlike_journal.message);
					}
				}
			} catch (error) {
				Alert.alert("" + error);
			}
		} else {
			Alert.alert("Please Login");
		}
	};

	return (
		<View style={{ flex: 1, backgroundColor: "#fff" }}>
			<StatusBar backgroundColor="#14646E" barStyle="light-content" />
			{loading ? (
				<View style={{ marginTop: 50 }}>
					<ActivityIndicator animating={true} color="#209FAE" />
				</View>
			) : (
				<ScrollView
					showsVerticalScrollIndicator={false}
					// stickyHeaderIndices={[7]}
					style={{ flex: 1 }}
				>
					{/* View Image Top */}
					<View
						style={{
							width: Dimensions.get("screen").width,
							height: 180,
							backgroundColor: "#209FAE",
						}}
					>
						<Ripple
							onPress={() => props.navigation.goBack()}
							style={{
								position: "absolute",
								zIndex: 3,
								marginTop: 20,
								marginLeft: 10,
							}}
						>
							<Arrowbackwhite height={20} width={20} />
						</Ripple>

						{data && data.destinationById && data.destinationById.images ? (
							<Image
								source={{ uri: data?.destinationById?.images[0].image }}
								style={{ height: "100%", width: "100%" }}
							/>
						) : null}
					</View>

					{/*View  Title */}
					<View
						style={{
							marginTop: 10,
							marginHorizontal: 15,
							width: Dimensions.get("screen").width * 0.9,
							minHeight: 50,
							flexDirection: "row",
							justifyContent: "space-between",
						}}
					>
						<View
							style={{
								width: Dimensions.get("screen").width * 0.7,
							}}
						>
							<Text size="title" type="black">
								{data?.destinationById?.name}
							</Text>
							<View style={{ flexDirection: "row", marginTop: 2 }}>
								<View
									style={{
										borderRadius: 3,
										backgroundColor: "#F4F4F4",
										padding: 3,
										marginRight: 5,
									}}
								>
									<Text size="description" type="bold">
										{data?.destinationById?.type?.name}
									</Text>
								</View>
								<View
									style={{
										borderRadius: 3,
										backgroundColor: "#F4F4F4",
										padding: 3,
										flexDirection: "row",
										marginRight: 5,
										alignItems: "center",
									}}
								>
									<Star height={13} width={13} />
									<Text
										size="description"
										type="bold"
										style={{ marginLeft: 3 }}
									>
										{data?.destinationById?.rating}
									</Text>
								</View>
								<View
									style={{
										borderRadius: 2,
										padding: 3,
									}}
								>
									<Text
										size="description"
										type="regular"
										style={{ color: "#209FAE" }}
									>
										{data?.destinationById?.count_review} Reviews
									</Text>
								</View>
							</View>
						</View>
						<View style={{ flexDirection: "row", alignItems: "center" }}>
							{data?.destinationById.liked === true ? (
								<Pressable
									style={{
										backgroundColor: "#F6F6F6",
										marginRight: 2,
										height: 34,
										width: 34,
										borderRadius: 17,
										alignItems: "center",
										justifyContent: "center",
										marginRight: 5,
									}}
									onPress={() => _liked(data.destinationById.id)}
								>
									<LikeBlack height={18} width={18} />
								</Pressable>
							) : (
								<Pressable
									style={{
										backgroundColor: "#F6F6F6",
										marginRight: 2,
										height: 34,
										width: 34,
										borderRadius: 17,
										alignItems: "center",
										justifyContent: "center",
										marginRight: 5,
									}}
									onPress={() => _liked(data.destinationById.id)}
								>
									<LikeEmpty height={18} width={18} />
								</Pressable>
							)}
							<Pressable
								style={{
									backgroundColor: "#F6F6F6",
									marginRight: 2,
									height: 34,
									width: 34,
									borderRadius: 17,
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<ShareBlack height={20} width={20} />
							</Pressable>
						</View>
					</View>

					{/* View Types */}
					<View
						style={{
							width: Dimensions.get("screen").width * 0.9,
							marginHorizontal: 15,
							height: 30,
							marginTop: 5,
							flexDirection: "row",
						}}
					>
						<View
							style={{
								flexDirection: "row",
								justifyContent: "center",
								alignItems: "center",
								padding: 5,
								borderRadius: 5,
								marginRight: 5,
								backgroundColor: "#DAF0F2",
							}}
						>
							<UnescoIcon height={20} width={20} style={{ marginRight: 5 }} />
							<Text size="description" type="regular">
								UNESCO
							</Text>
						</View>
						{data.destinationById.movie_location.length > 0 ? (
							<View
								style={{
									flexDirection: "row",
									justifyContent: "center",
									alignItems: "center",
									padding: 5,
									borderRadius: 5,
									backgroundColor: "#DAF0F2",
								}}
							>
								<MovieIcon height={20} width={20} style={{ marginRight: 5 }} />
								<Text size="description" type="regular">
									Movie Location
								</Text>
							</View>
						) : null}
					</View>

					{/* View address */}
					<View
						style={{
							marginTop: 10,
							borderTopWidth: 1,
							borderTopColor: "#F6F6F6",
							width: Dimensions.get("screen").width,
							minHeight: 40,
							paddingHorizontal: 15,
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<View
							style={{
								flexDirection: "row",

								width: Dimensions.get("screen").width * 0.75,
							}}
						>
							<PinHijau height={18} width={18} style={{ marginRight: 10 }} />
							<Text size="description" type="regular">
								{data?.destinationById?.address}
							</Text>
						</View>
						<Pressable
							style={{
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Text
								size="description"
								type="regular"
								style={{ color: "#209FAE" }}
							>
								maps
							</Text>
						</Pressable>
					</View>

					{/* View Time */}
					<View
						style={{
							borderTopWidth: 1,
							borderTopColor: "#F6F6F6",
							width: Dimensions.get("screen").width,
							minHeight: 40,
							paddingHorizontal: 15,
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<View
							style={{
								flexDirection: "row",
								width: Dimensions.get("screen").width * 0.75,
							}}
						>
							<Clock height={18} width={18} style={{ marginRight: 10 }} />
							<Text size="description" type="regular">
								{data?.destinationById?.openat}
							</Text>
						</View>
						<Pressable
							onPress={() => setModalTime(true)}
							// onPress={() => console.log("true")}
							style={{
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Text
								size="description"
								type="regular"
								style={{ color: "#209FAE" }}
							>
								more
							</Text>
						</Pressable>
					</View>

					{/* View Website */}
					<View
						style={{
							borderTopWidth: 1,
							borderTopColor: "#F6F6F6",
							width: Dimensions.get("screen").width,
							minHeight: 40,
							paddingHorizontal: 15,
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<View
							style={{
								flexDirection: "row",
								width: Dimensions.get("screen").width * 0.75,
							}}
						>
							<Globe height={18} width={18} style={{ marginRight: 10 }} />
							<Text size="description" type="regular">
								{data?.destinationById?.website}
							</Text>
						</View>
						<Pressable
							onPress={() => setModalSosial(true)}
							style={{
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Text
								size="description"
								type="regular"
								style={{ color: "#209FAE" }}
							>
								more
							</Text>
						</Pressable>
					</View>

					{/* View Garis */}
					<View
						style={{
							backgroundColor: "#F6F6F6",
							height: 5,
							width: Dimensions.get("screen").width,
							marginVertical: 5,
						}}
					/>

					{/* Tabs */}
					<TabView
						navigationState={{ index, routes }}
						renderScene={renderScene}
						onIndexChange={setIndex}
						renderTabBar={(props) => (
							<ScrollView
								horizontal={true}
								showsHorizontalScrollIndicator={false}
								style={{ flex: 1 }}
							>
								<TabBar
									{...props}
									style={{
										backgroundColor: "white",
										borderBottomWidth: 2,
										borderBottomColor: "#D3E9EC",
									}}
									renderLabel={({ route, focused }) => {
										return (
											<Text
												style={[
													focused ? styles.labelActive : styles.label,
													{
														opacity: focused ? 1 : 0.7,
													},
												]}
											>
												{route.title}
											</Text>
										);
									}}
									indicatorStyle={{
										...styles.indicator,
										width: "20%",
									}}
								/>
							</ScrollView>
						)}

						// renderTabBar={() => null}
						// renderLazyPlaceholder={() => time()}
					/>
				</ScrollView>
			)}

			{/* Modal Activiy */}
			<ActivityModal
				setModalActivity={(e) => setModalActivity(e)}
				modals={modalActivity}
				data={data?.destinationById}
			/>

			{/* Modal Facility */}
			<FacilityModal
				setModalFacility={(e) => setModalFacility(e)}
				modals={modalFacility}
				data={data?.destinationById}
			/>

			{/* Modal Service */}
			<ServiceModal
				setModalService={(e) => setModalService(e)}
				modals={modalService}
				data={data?.destinationById}
			/>

			{/* Modal Time */}
			<Modal
				isVisible={modalTime}
				onRequestClose={() => {
					setModalTime(false);
				}}
				animationIn="slideInUp"
				animationOut="slideOutDown"
			>
				<View
					style={{
						backgroundColor: "#fff",
						minHeight: 150,
						// borderRadius: 5,
					}}
				>
					{/* Information */}
					<View
						style={{
							flexDirection: "row",
							marginHorizontal: 15,
							marginVertical: 20,
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<Text size="title" type="bold">
							Operational (Local Time)
						</Text>
						<Xhitam
							onPress={() => setModalTime(false)}
							height={15}
							width={15}
						/>
					</View>

					{/* Detail Information */}
					<View
						style={{
							marginHorizontal: 15,
						}}
					>
						{data && data.destinationById && data.destinationById.openat ? (
							<Text size="label" type="reguler">
								{data.destinationById.openat}
							</Text>
						) : (
							"-"
						)}
					</View>
					{/* <View
            style={{
              marginTop: 20,
              marginHorizontal: 15,
            }}
          >
            <Text size="label" type="reguler">
              Open 24 hours
            </Text>
          </View> */}
				</View>
			</Modal>

			{/* Modal Sosial */}
			<Modal
				isVisible={modalSosial}
				onRequestClose={() => {
					setModalSosial(false);
				}}
				animationIn="slideInUp"
				animationOut="slideOutDown"
			>
				<View
					style={{
						backgroundColor: "#fff",
						minHeight: 200,
						// borderRadius: 5,
					}}
				>
					{/* Information */}
					<View
						style={{
							flexDirection: "row",
							marginHorizontal: 15,
							marginVertical: 20,
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<Text size="title" type="bold">
							Information
						</Text>
						<Xhitam
							onPress={() => setModalSosial(false)}
							height={15}
							width={15}
						/>
					</View>

					{/* Detail Information */}
					<View
						style={{
							marginHorizontal: 15,
							flexDirection: "row",
							alignItems: "center",
							width: Dimensions.get("screen").width * 0.7,
						}}
					>
						<TeleponHitam height={15} width={15} style={{ marginRight: 10 }} />
						{data && data.destinationById && data.destinationById.phone1 ? (
							<Text size="label" type="reguler">
								{data.destinationById.phone1}
							</Text>
						) : (
							"-"
						)}
					</View>
					<View
						style={{
							marginTop: 20,
							marginHorizontal: 15,
							flexDirection: "row",
							alignItems: "center",
							width: Dimensions.get("screen").width * 0.7,
						}}
					>
						<WebsiteHitam height={15} width={15} style={{ marginRight: 10 }} />
						{data && data.destinationById && data.destinationById.website ? (
							<Text size="label" type="reguler">
								{data.destinationById.website}
							</Text>
						) : (
							"-"
						)}
					</View>
					<View
						style={{
							marginTop: 20,
							marginHorizontal: 15,
							flexDirection: "row",
							alignItems: "center",
							width: Dimensions.get("screen").width * 0.7,
						}}
					>
						<InstagramHitam
							height={15}
							width={15}
							style={{ marginRight: 10 }}
						/>
						{data && data.destinationById && data.destinationById.instagram ? (
							<Text size="label" type="reguler">
								{data.destinationById.instagram}
							</Text>
						) : (
							"-"
						)}
					</View>
				</View>
			</Modal>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FFF",
	},
	header: {
		height: 100,
		width: "100%",
		alignItems: "center",
		justifyContent: "center",
		position: "absolute",
		backgroundColor: "#FFF",
	},
	label: {
		fontSize: 14,
		color: "#464646",
		fontFamily: "Lato-Bold",
	},
	labelActive: {
		fontSize: 14,
		color: "#209FAE",
		fontFamily: "Lato-Bold",
		borderBottomColor: "#209FAE",
	},
	tab: {
		elevation: 1,
		shadowOpacity: 0.5,
		backgroundColor: "#FFF",
		height: 50,
	},
	indicator: { backgroundColor: "#209FAE", height: 2 },
});
