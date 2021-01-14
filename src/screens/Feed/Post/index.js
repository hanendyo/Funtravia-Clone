import React, { useState, useEffect, useRef } from "react";
import {
	View,
	StyleSheet,
	Dimensions,
	Image,
	TouchableOpacity,
	FlatList,
	ScrollView,
	PermissionsAndroid,
} from "react-native";
import {
	CameraIcon,
	Arrowbackblack,
	Arrowbackwhite,
	Comboboxup,
	Comboboxdown,
} from "../../../assets/svg";
import AutoHeightImage from "react-native-auto-height-image";
import CameraRoll from "@react-native-community/cameraroll";
import Modal from "react-native-modal";
import { Loading } from "../../../component";
import { Text, Button } from "../../../component";
import { useTranslation } from "react-i18next";
import ImgToBase64 from "react-native-image-base64";
import { CropView } from "react-native-image-crop-tools";

const { width, height } = Dimensions.get("screen");
export default function Post(props) {
	const HeaderComponent = {
		title: "",
		headerTintColor: "white",
		headerTitle: "",
		headerMode: "screen",
		headerStyle: {
			backgroundColor: "#209FAE",
			elevation: 0,
			borderBottomWidth: 0,
		},
		headerTitleStyle: {
			fontFamily: "Lato-Regular",
			fontSize: 14,
			color: "white",
		},
		headerLeftContainerStyle: {
			background: "#FFF",
		},
		headerLeft: () => {
			return (
				<View
					style={{
						flexDirection: "row",
						// justifyContent: '',
						alignItems: "center",
					}}
				>
					<Button
						type="circle"
						size="small"
						variant="transparent"
						onPress={() => props.navigation.goBack()}
					>
						<Arrowbackwhite height={20} width={20} />
					</Button>
					<Button
						type="icon"
						position="right"
						variant="transparent"
						onPress={() => setIsVisible(true)}
						style={{
							paddingHorizontal: 10,
							justifyContent: "flex-start",
						}}
					>
						<Text
							type="bold"
							size="label"
							style={{
								color: "white",
								marginRight: 10,
							}}
						>
							{selectedAlbum.title}
						</Text>
						<Comboboxdown height={10} width={10} />
					</Button>
				</View>
			);
		},
		headerRight: () => {
			return (
				<View
					style={{
						flexDirection: "row",
					}}
				>
					<TouchableOpacity
						onPress={() => console.log("TEST")}
						style={{
							paddingRight: 10,
						}}
					>
						<Text
							allowFontScaling={false}
							style={{
								color: "#FFF",
								// fontWeight: 'bold',
								fontFamily: "Lato-Bold",
								fontSize: 14,
								marginHorizontal: 5,
								marginVertical: 10,
							}}
						>
							Next
						</Text>
					</TouchableOpacity>
				</View>
			);
		},
		headerRightStyle: {
			marginRight: 20,
		},
	};
	const { t } = useTranslation();
	const [imageRoll, setImageRoll] = useState([]);
	const [isVisible, setIsVisible] = useState(false);
	const [loading, setLoading] = useState(false);
	let slider = useRef(null);
	let scroll = useRef(null);
	let cropRef = useRef(null);
	const [recent, setRecent] = useState({
		uri:
			"https://fa12.funtravia.com/destination/20200508/6Ugw9_1b6737ff-4b42-4149-8f08-00796e8c6909",
	});
	let [cameraModal, setCameraModal] = useState(false);
	const [oriSize, SetOrisize] = useState({
		width: 0,
		height: 0,
	});

	const selectImg = async (file) => {
		await setRecent(file.node.image);
		await setLoading(false);
	};

	useEffect(() => {
		props.navigation.setOptions(HeaderComponent);
		(async () => {
			await getAlbumRoll();
			await requestCameraPermission();
			await getImageFromRoll(null);
		})();
	}, []);
	const [selectedAlbum, setSelectedAlbum] = useState({
		id: null,
		title: "All Photos",
	});
	const [allAlbums, setAllalbum] = useState([]);
	const requestCameraPermission = async () => {
		try {
			const granted = await PermissionsAndroid.request(
				PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
			);
			if (granted === PermissionsAndroid.RESULTS.GRANTED) {
				console.log("You can use the write");
			} else {
				console.log("Camera permission denied");
			}
		} catch (err) {
			console.warn(err);
		}
	};
	const getAlbumRoll = async () => {
		try {
			const granted = await PermissionsAndroid.request(
				PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
			);
			if (granted === PermissionsAndroid.RESULTS.GRANTED) {
				console.log("getalbum");
				CameraRoll.getAlbums({
					assetType: "Photos",
				})
					.then((r) => {
						r.sort(compare);
						console.log(r);
						setAllalbum(r);
					})
					.catch((err) => {
						//Error Loading Images
					});
				console.log("You can use the camera");
			} else {
				console.log("Camera permission denied");
			}
		} catch (err) {
			console.warn(err);
		}
	};
	const compare = (a, b) => {
		if (a.title < b.title) {
			return -1;
		}
		if (a.title > b.title) {
			return 1;
		}
		return 0;
	};

	const getImageFromRoll = async (data) => {
		try {
			const granted = await PermissionsAndroid.request(
				PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
			);
			if (granted === PermissionsAndroid.RESULTS.GRANTED) {
				console.log("getalbum");
				CameraRoll.getPhotos({
					first: 20,
					assetType: "Photos",
					groupTypes: "Album",
					groupName: "Camera",
					include: ["location", "filename", "imageSize"],
				})
					.then((r) => {
						// r.sort(compare);
						// console.log(r.edges);
						console.log(r.edges[0]);
						// setAllalbum(r);
						let data_foto = r.edges;
						let camera = {
							id: "0",
							mediaType: "camera",
						};
						data_foto.splice(0, 0, camera);
						setImageRoll(data_foto);
					})
					.catch((err) => {
						//Error Loading Images
					});
				console.log("You can use the camera");
			} else {
				console.log("Camera permission denied");
			}
		} catch (err) {
			console.warn(err);
		}
	};

	const selectAlbum = async (item) => {
		await setSelectedAlbum(item);
		props.navigation.setParams({ selectedAlbum: item });
		setIsVisible(false);
		await getImageFromRoll(item.id);
	};
	const selectAllAlbum = async () => {
		let item = {
			id: null,
			title: "AllPhotos",
		};
		await setSelectedAlbum(item);
		props.navigation.setParams({ selectedAlbum: item });
		setIsVisible(false);
		await getImageFromRoll(item.id);
	};

	const _modalGalery = () => {
		return (
			<Modal
				onRequestClose={() => {
					setIsVisible(false);
				}}
				onBackdropPress={() => setIsVisible(false)}
				onSwipeComplete={() => setIsVisible(false)}
				swipeDirection="left"
				isVisible={isVisible}
				animationIn="slideInLeft"
				animationOut="slideOutLeft"
				style={{
					alignItems: "flex-start",
					alignContent: "flex-start",
					justifyContent: "flex-start",
					margin: 0,
				}}
			>
				<View
					style={{
						height: Dimensions.get("screen").height,
						width: Dimensions.get("screen").width * 0.6,
						backgroundColor: "white",
						justifyContent: "space-between",
						paddingHorizontal: 10,
						paddingTop: 10,
						paddingBottom: 10,
					}}
				>
					<View
						style={{
							width: "100%",
						}}
					>
						<Button
							type="icon"
							position="right"
							variant="transparent"
							onPress={() => setIsVisible(false)}
							style={{
								paddingHorizontal: 10,
								justifyContent: "flex-start",
							}}
						>
							<Arrowbackblack height={20} width={20}></Arrowbackblack>
							<Text
								type="bold"
								size="label"
								style={{
									color: "464646",
									marginHorizontal: 10,
								}}
							>
								{selectedAlbum?.title}
							</Text>
							<Comboboxup height={10} width={10} />
						</Button>
					</View>
					<Button
						type="icon"
						position="right"
						variant="transparent"
						style={{ justifyContent: "flex-start", marginVertical: 5 }}
						onPress={() => selectAllAlbum()}
					>
						<Text>All Photos</Text>
					</Button>
					<FlatList
						style={{
							paddingStart: 0,
							alignContent: "center",
						}}
						ref={slider}
						scrollEnabled={true}
						showsVerticalScrollIndicator={false}
						data={allAlbums}
						renderItem={({ item }) => (
							<Button
								type="icon"
								position="right"
								variant="transparent"
								style={{ justifyContent: "flex-start", marginVertical: 5 }}
								onPress={() => selectAlbum(item)}
							>
								<Text>{item.title}</Text>
							</Button>
						)}
						keyExtractor={(item) => item.id}
					/>
				</View>
			</Modal>
		);
	};

	return (
		<ScrollView ref={scroll}>
			<Loading show={loading} />
			<_modalGalery />
			<FlatList
				style={{
					paddingStart: 0,
					alignContent: "center",
					backgroundColor: "white",
				}}
				ref={slider}
				data={imageRoll && imageRoll.length ? imageRoll : null}
				renderItem={({ item, index }) =>
					item.mediaType !== "camera" ? (
						(console.log(item.node.image),
						(
							<TouchableOpacity
								style={{
									alignContent: "center",
									justifyContent: "center",
									backgroundColor: "white",
									alignItems: "center",
									paddingVertical: 1,
									paddingHorizontal: 1,
								}}
								onPress={() => selectImg(item)}
							>
								<Image
									source={{ uri: item.node.image.uri }}
									style={{
										height: Dimensions.get("screen").width / 4 - 1,
										width: Dimensions.get("screen").width / 4 - 1,
										resizeMode: "cover",
									}}
								/>
							</TouchableOpacity>
						))
					) : (
						<TouchableOpacity
							style={{
								alignContent: "center",
								justifyContent: "center",
								backgroundColor: "#F0F0F0",
								alignItems: "center",
								height: Dimensions.get("screen").width / 4,
								width: Dimensions.get("screen").width / 4,
							}}
							onPress={() => setCameraModal(!cameraModal)}
						>
							<CameraIcon height={30} width={30} />
						</TouchableOpacity>
					)
				}
				numColumns={4}
				ListHeaderComponent={
					<View>
						<CropView
							sourceUrl={recent.uri}
							style={{ width: width, height: height / 2 }}
							ref={cropRef}
							onImageCrop={(res) => console.warn(res)}
							keepAspectRatio
							aspectRatio={{ width: 16, height: 9 }}
						/>
					</View>
				}
			/>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	main: {
		justifyContent: "space-between",
		alignItems: "center",
		height: Dimensions.get("screen").height * 0.9,
		width: "100%",
	},
	preview: {
		flex: 1,
		justifyContent: "flex-end",
		alignItems: "center",
		height: 200,
		width: 200,
		backgroundColor: "green",
	},
	tabView: {
		flex: 1,
		justifyContent: "center",
		width: Dimensions.get("screen").width,
	},
	container: {
		marginTop: 20,
	},
	flex: {
		flex: 1,
	},
	maskContainer: {
		position: "absolute",
		top: 0,
		left: 0,
	},
	mask: {
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		position: "absolute",
		overflow: "hidden",
	},
	topBottom: {
		height: 50,
		width: width - 100,
		left: 50,
	},
	top: {
		top: 0,
	},
	bottom: {
		top: width - 50,
	},
	side: {
		width: 50,
		height: width,
		top: 0,
	},
	left: {
		left: 0,
	},
	right: {
		left: width - 50,
	},
});
