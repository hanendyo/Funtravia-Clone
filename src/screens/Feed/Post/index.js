import React, { useState, useEffect, useRef } from "react";
import {
	View,
	StyleSheet,
	Dimensions,
	Image,
	TouchableOpacity,
	FlatList,
	NativeModules,
	ImageBackground,
	ScrollView,
	Pressable,
  Alert,
  PermissionsAndroid,
} from "react-native";
import { CustomImage } from "../../../component";
import { back_arrow_white } from "../../../assets/png";
// import * as MediaLibrary from "react-native-media-library";
import {
	launchCamera,
	launchImageLibrary,
	showImagePicker,
} from "react-native-image-picker";
import {
	CameraIcon,
	Arrowbackblack,
	Arrowbackwhite,
	Comboboxup,
	Comboboxdown,
} from "../../../assets/svg";
// import CameraComponent from "../Components/CameraComponent";
// import * as Permissions from "re-permissions";
// import * as ImageManipulators from "expo-image-manipulator";
import AutoHeightImage from "react-native-auto-height-image";
import CameraRoll from "@react-native-community/cameraroll";
import Modal from "react-native-modal";
import { Loading } from "../../../component";
import { Text, Button } from "../../../component";
// import ImageCrop from 'react-native-image-crop';
const { width, height } = Dimensions.get("window");
import { useTranslation } from "react-i18next";
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
			fontFamily: "lato-reg",
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
		// CustomImage({
		// 	customStyle: { width: 20, height: 20 },
		// 	customImageStyle: { width: 20, height: 20, resizeMode: 'contain' },
		// 	isTouchable: true,
		// 	onPress: () => props.navigation.goBack(),
		// 	source: back_arrow_white,
		// }),

		headerRight: () => {
			return (
				<View
					style={{
						flexDirection: "row",
					}}
				>
					<TouchableOpacity
						onPress={() =>
							props.navigation.navigate("CreatePost", {
								file: props.navigation.getParam("file"),
							})
						}
						style={{
							paddingRight: 10,
						}}
					>
						<Text
							allowFontScaling={false}
							style={{
								color: "#FFF",
								// fontWeight: 'bold',
								fontFamily: "lato-bold",
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
	let cropper = useRef();
	let [imageDate, setImageData] = useState({
		filepath: { data: "", uri: "" },
		fileData: "",
		fileUri: "",
	});
	const [croppedImage, setCroppedImage] = useState(null);
	const [recent, setRecent] = useState({
		uri:
			"https://fa12.funtravia.com/destination/20200508/6Ugw9_1b6737ff-4b42-4149-8f08-00796e8c6909",
	});
	// console.log(imageRoll);
	let [cameraModal, setCameraModal] = useState(false);
	const [oriSize, SetOrisize] = useState({
		width: 0,
		height: 0,
	});

	const getsize = (file) => {
		// setLoading(true);
		Image.getSize(file.node.image.uri, (width, height) => {
			SetOrisize({
				width: width,
				height: height,
			});
			// console.log(width, height);
			setSelected(file, width, height);
			// window.scrollTo({ top: 0, behavior: 'smooth' });
		});
	};

	const setSelected = async (file, width, height) => {
		scroll.current.scrollTo({ y: 0, animated: true });
		// slider.current.scrollToIndex({ animated: true, index: 0 });
		const manipulate = await ImageManipulators.manipulateAsync(
			file.uri,
			[
				{
					// resize: {
					// 	width: (width > 2048 ? width / 2: width),
					// 	height: (height > 2048 ? height / 2:height),
					// },
					crop: {
						originX: 0,
						originY: 0,
						width: width,
						height: width,
					},
				},
			],
			{ compress: 0.5, base64: true }
		);
		let tmpFile = Object.assign(file, { base64: manipulate.base64 });
		// console.log(tmpFile);
		await setRecent(tmpFile);
		await setLoading(false);
		// setIsVisible(true);
		props.navigation.setParams({ file: tmpFile });
	};

<<<<<<< Updated upstream
	useEffect(() => {
		props.navigation.setOptions(HeaderComponent);
		(async () => {
			await getAlbumRoll();
			await requestCameraPermission();
			await getImageFromRoll(null);
		})();
=======
  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    (async () => {
      await getAlbumRoll();
      await getImageFromRoll(null);
    })();
>>>>>>> Stashed changes

		// (async () => {
		// 	let { status } = await Permissions.askAsync(Permissions.CAMERA);
		// 	console.log(status);
		// 	if (status !== 'granted') {
		// 		Alert.alert(t('permissioncamera'));
		// 	}
		// })();

		// (async () => {
		//   const { status } = await Permissions.askAsync(Permissions.CAMERA);
		//   console.log("status", status);
		//   if (status === "granted") {
		//     await getAlbumRoll();
		//     await getImageFromRoll(null);
		//   }
		// })();
	}, []);
	const [selectedAlbum, setSelectedAlbum] = useState({
		id: null,
		title: "All Photos",
	});
	const [allAlbums, setAllalbum] = useState([]);
	// console.log('albumsReponse=', allAlbums);
  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        
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
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('getalbum')
        CameraRoll.getAlbums({
          assetType: 'Photos',
        })
        .then(r => {
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

		// console.log(albumsReponse);
		// // setSelectedAlbum(albumsReponse[0]);
		// props.navigation.setParams({ selectedAlbum: selectedAlbum });
		// props.navigation.setParams({
		// 	setside: () => setIsVisible(true),
		// });
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
        console.log('getalbum')
        CameraRoll.getPhotos({
          first: 20,
          assetType: 'Photos',
          groupTypes: 'Album',
          groupName: 'Camera',
          include: ['location','filename','imageSize'],
        })
        .then(r => {
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
		// console.log("getimgrol");
		// MediaLibrary.getPermissionsAsync();
		// if (permission.granted) {
		// const stuff = await MediaLibrary.getAssetsAsync({
		// 	first: 40,
		// 	album: id,
		// 	sortBy: ["modificationTime"],
		// 	mediaType: ["photo"],
		// });
		// // console.log(stuff);
		// let data_foto = stuff.assets;
		// let camera = {
		// 	id: "0",
		// 	mediaType: "camera",
		// };
		// data_foto.splice(0, 0, camera);
		// setImageRoll(data_foto);
		// setRecent({ uri: data_foto[1]?.uri });
		// getsize(data_foto[1]);
		// }
		// });
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
						// alignContent: 'flex-start',
						// alignItems: 'flex-start',
						justifyContent: "space-between",
						paddingHorizontal: 10,
						paddingTop: 10,
						paddingBottom: 10,
						// borderColor: 'black',
						// borderWidth: 1,
					}}
				>
					<View
						style={{
							// borderBottomWidth: 1,
							// borderBottomColor: '#d3d3d3',
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
						{/* <TouchableOpacity
							style={{
								alignSelf: 'flex-start',
								flexDirection: 'row',
								alignItems: 'center',
								//  borderWidth: 1
								padding: 10,
							}}
							onPress={() => setIsVisible(false)}>
							<Arrowbackblack height={20} width={20}></Arrowbackblack>
							<Text size='label' type='bold' style={{ marginLeft: 15 }}>
								{selectedAlbum?.title}
							</Text>
						</TouchableOpacity> */}
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

	let optionLaunch = {
		mediaType: "photo",
		quality: 1,
		includeBase64: true,
		saveToPhotos: true,
	};

	return (
		<ScrollView ref={scroll}>
			<Loading show={loading} />

			{/* <CameraComponent
        open={cameraModal}
        setOpen={(e) => setCameraModal(e)}
        setSelected={(e) => getsize(e)}
      /> */}

			<_modalGalery />
			{/* <Button onPress={() => launchCamera()} text="Launch Camera" />
			<Button
				onPress={() => launchImageLibrary()}
				text="Launch Image Library"
			/> */}
			<View>
				{/* <ImageCrop
					ref={cropper}
					cropWidth={500}
					cropHeight={500}
					source={{
						uri: recent.uri,
					}}
					image={{
						uri: recent.uri,
					}}
				/> */}
			</View>
			<FlatList
				style={{
					paddingStart: 0,
					alignContent: "center",
					backgroundColor: "white",
				}}
				ref={slider}
				// scrollEnabled={false}
				data={imageRoll && imageRoll.length ? imageRoll : null}
				renderItem={({ item, index }) =>
					item.mediaType !== "camera" ? (
            console.log(item.node.image.uri),
						<TouchableOpacity
							style={{
								// flex: 1,
								// height: Dimensions.get('screen').width / 4 - 1,
								// width: Dimensions.get('screen').width / 4 - 1,
								alignContent: "center",
								justifyContent: "center",
								backgroundColor: "white",
								alignItems: "center",
								paddingVertical: 1,
                paddingHorizontal: 1,
                borderWidth:1,
							}}
							onPress={() => getsize(item)}
						>
							<Image
								source={'///storage/emulated/0/DCIM/Camera/SAVE_20200823_063054.jpg'}
								// source={require(item.node.image.uri) }
								style={{
									height: Dimensions.get('screen').width / 4 - 1,
									width: Dimensions.get('screen').width / 4 - 1,
									resizeMode: "cover",
								}}
							/>
						</TouchableOpacity>
					) : (
						<TouchableOpacity
							style={{
								// flex: 1,
								// padding: 50,
								alignContent: "center",
								justifyContent: "center",
								backgroundColor: "#F0F0F0",
								alignItems: "center",
								// marginVertical: 1,
								// marginHorizontal: 1,
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
				// keyExtractor={(item) => item.node.timestamp}
				ListHeaderComponent={
					<View>
						{/* <View
							style={{
								// height: Dimensions.get('screen').width,
								width: Dimensions.get('screen').width,
								// Height: Dimensions.get('screen').width,
								height: Dimensions.get('screen').width,
								backgroundColor: 'white',
								justifyContent: 'center',
							}}> */}
						<AutoHeightImage
							width={Dimensions.get("window").width}
							source={{
								uri: recent.base64
									? "data:image/gif;base64," + recent.base64
                  : recent.uri,
                // uri :  'file:///storage/emulated/0/DCIM/Camera/SAVE_20200823_063054.jpg'
							}}
						/>
						{/* </View> */}
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
