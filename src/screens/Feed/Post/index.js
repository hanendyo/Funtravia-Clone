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
  Permission,
} from "react-native";
import {
  CameraIcon,
  Arrowbackblack,
  Arrowbackwhite,
  Comboboxup,
  Comboboxdown,
  SizeOri,
  SizeStrace,
  CameraBlue,
} from "../../../assets/svg";
import CameraRoll from "@react-native-community/cameraroll";
import Modal from "react-native-modal";
import { Loading } from "../../../component";
import { Text, Button } from "../../../component";
import { useTranslation } from "react-i18next";
import { CropView } from "react-native-image-crop-tools";
import ImgToBase64 from "react-native-image-base64";
import ImageResizer from "react-native-image-resizer";
import ImagePicker from "react-native-image-crop-picker";
const { width, height } = Dimensions.get("screen");
export default function Post(props) {
  const HeaderComponent = {
    title: "",
    headerTintColor: "white",
    headerTitle: "",
    headerShown: true,
    headerTransparent: true,
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      fontFamily: "Lato-Bold",
      fontSize: 14,
      color: "white",
    },
    // headerLeftContainerStyle: {
    // 	background: "#FFF",
    // },
    // headerLeft: () => {
    // 	return (
    // 		<View
    // 			style={{
    // 				flexDirection: "row",
    // 				// justifyContent: '',
    // 				paddingHorizontal: 5,
    // 				alignItems: "center",
    // 			}}
    // 		>
    // 			<Button
    // 				type="circle"
    // 				size="small"
    // 				variant="transparent"
    // 				onPress={() => props.navigation.goBack()}
    // 			>
    // 				<Arrowbackwhite height={20} width={20} />
    // 			</Button>
    // 			{/* <TouchableOpacity
    // 			onPress={() => setIsVisible(true)}
    // 			style={{
    // 				flexDirection: 'row',
    // 				alignItems: 'center',
    // 				height: 50,
    // 				borderWidth:1,
    // 				borderColor: '#209fae',
    // 				paddingHorizontal: 5,
    // 			}}>
    // 			<Text
    // 					type="bold"
    // 					size="label"
    // 					style={{
    // 						color: "white",
    // 						marginRight: 10,
    // 					}}>
    // 					{selectedAlbum.title}
    // 				</Text>
    // 				<Comboboxdown height={10} width={10} />
    // 			</TouchableOpacity> */}
    // 			{/* <Button
    // 				type="box"
    // 				position="right"
    // 				color="secondary"
    // 				variant="bordered"
    // 				onPress={() => setIsVisible(true)}
    // 				text={selectedAlbum.title}
    // 				style={{
    // 					paddingHorizontal: 10,
    // 					height: 40,
    // 					width: 120,
    // 					justifyContent: "flex-start",
    // 				}}
    // 			>
    // 				<Text
    // 					type="bold"
    // 					size="label"
    // 					style={{
    // 						color: "white",
    // 						marginRight: 10,
    // 					}}
    // 				>
    // 					{selectedAlbum.title}
    // 				</Text>
    // 				<Comboboxdown height={10} width={10} />
    // 			</Button> */}
    // 		</View>
    // 	);
    // },
    // headerRight: () => {
    // 	return (
    // 		<View
    // 			style={{
    // 				flexDirection: "row",
    // 			}}
    // 		>
    // 			<TouchableOpacity
    // 				onPress={() => nextFunction()}
    // 				style={{
    // 					paddingRight: 10,
    // 				}}
    // 			>
    // 				<Text
    // 					allowFontScaling={false}
    // 					style={{
    // 						color: "#FFF",
    // 						fontFamily: "Lato-Bold",
    // 						fontSize: 14,
    // 						marginHorizontal: 5,
    // 						marginVertical: 10,
    // 					}}
    // 				>
    // 					Next
    // 				</Text>
    // 			</TouchableOpacity>
    // 		</View>
    // 	);
    // },
    // headerRightStyle: {
    // 	marginRight: 20,
    // },
  };
  const { t } = useTranslation();
  const [imageRoll, setImageRoll] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ratio, setRatio] = useState({ width: 1, height: 1, index: 0 });
  const [ratioindex, setRatioIndex] = useState([
    { width: 1, height: 1, index: 0 },
    { width: 4, height: 5, index: 1 },
  ]);
  // console.log(ratioindex);
  const [recent, setRecent] = useState({
    image: {
      uri:
        "https://fa12.funtravia.com/destination/20200508/6Ugw9_1b6737ff-4b42-4149-8f08-00796e8c6909",
    },
    location: {},
  });
  let [cameraModal, setCameraModal] = useState(false);
  let slider = useRef(null);
  let scroll = useRef(null);
  let cropRef = useRef(null);
  const selectImg = async (file) => {
    // console.log(file)
    await setRecent({ image: file.node.image, location: file.node.location });
    await setLoading(false);
    setRatio({ width: 1, height: 1, index: 0 });
    // console.log(file.node.image.width,file.node.image.height)
    if (file.node.image.width > file.node.image.height) {
      // console.log('lenscape')
      setRatioIndex([
        { width: 1, height: 1, index: 0 },
        { width: 3, height: 2, index: 1 },
      ]);
    } else {
      // console.log('potret')
      setRatioIndex([
        { width: 1, height: 1, index: 0 },
        { width: 4, height: 5, index: 1 },
      ]);
    }
  };
  const pickcamera = async () => {
    ImagePicker.openCamera({
      //   width: 500,
      //   height: 500,
      cropping: false,
      cropperCircleOverlay: false,
      includeBase64: false,
    }).then((image) => {
      setRatio({ width: 1, height: 1, index: 0 }),
        setRecent({ image: { uri: image.path }, location: {} });
    });
  };
  const nextFunction = async () => {
    cropRef.current.saveImage();
  };

  useEffect(() => {
    (async () => {
      await getAlbumRoll();
      await requestCameraPermission();
      // await props.navigation.setOptions(HeaderComponent);
    })();
  }, [selectedAlbum, props.navigation]);

  const [selectedAlbum, setSelectedAlbum] = useState({
    title: "Folder",
    count: 0,
  });
  // console.log(selectedAlbum)
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
        // console.log("getalbum");
        CameraRoll.getAlbums({
          assetType: "Photos",
        })
          .then((r) => {
            r.sort(compare);
            // console.log(r);
            setAllalbum(r);
            setSelectedAlbum(r[0]);
            getImageFromRoll(r[0]);
            selectAlbum(r[0]);
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

  const getImageFromRoll = async (dataalbum) => {
    console.log(dataalbum);
    let dataCamera = await CameraRoll.getPhotos({
      first: 51,
      assetType: "Photos",
      groupTypes: "Album",
      groupName: dataalbum.title,
      include: ["location", "filename", "imageSize"],
    });
    let data_foto = dataCamera.edges;
    let camera = {
      id: "0",
      mediaType: "camera",
    };
    data_foto.splice(0, 0, camera);
    setImageRoll(data_foto);
    await selectImg(data_foto[1]);
  };
  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };
  const selectAlbum = async (item) => {
    // console.log(item);
    await setSelectedAlbum(item);
    await setIsVisible(false);
    await getImageFromRoll(item);
    await props.navigation.setParams({ title: item.title });
    // await wait(2000).then(() => {
    // console.log('oke');
    props.navigation.setOptions(HeaderComponent);
    // });
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

  const convertBase64 = (result) => {
    Image.getSize(result.uri, (width, height) => {
      console.log(result.uri);
      console.log(width, height);
      let compress;
      if (width < 1024) {
        compress = 90;
      } else {
        compress = 60;
      }
      ImageResizer.createResizedImage(
        result.uri,
        width,
        height,
        "PNG",
        compress,
        0,
        undefined
      )
        .then((response) => {
          // console.log(response);
          ImgToBase64.getBase64String(response.uri)
            .then((base64String) =>
              props.navigation.navigate("CreatePostScreen", {
                location: recent.location,
                base64: base64String,
                image: result,
              })
            )
            .catch((err) => console.log(err));
        })
        .catch((err) => {
          console.log(err);
          // Oops, something went wrong. Check that the filename is correct and
          // inspect err to get more details.
        });
    });
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
          {/* <Button
						type="icon"
						position="right"
						variant="transparent"
						style={{ justifyContent: "flex-start", marginVertical: 5 }}
						onPress={() => selectAllAlbum()}
					>
						<Text>All Photos</Text>
					</Button> */}
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
    // <ScrollView ref={scroll}>
    <View>
      <Loading show={loading} />
      <_modalGalery />
      <View style={{ backgroundColor: "#209FAE", height: 55 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            alignContent: "center",
            height: 55,
            marginLeft: 40,
          }}
        >
          <TouchableOpacity
            onPress={() => setIsVisible(true)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              height: 50,
              borderWidth: 1,
              borderColor: "#209fae",
              paddingHorizontal: 5,
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
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => nextFunction()}
            style={{
              paddingRight: 10,
              paddingLeft: 20,
              height: 55,
              // borderWidth: 1,
              alignItems: "center",
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <Text
              allowFontScaling={false}
              style={{
                alignSelf: "center",
                color: "#FFF",
                fontFamily: "Lato-Bold",
                fontSize: 14,
                marginHorizontal: 5,
              }}
            >
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <CropView
          sourceUrl={recent.image.uri}
          style={{ width: width, height: width }}
          ref={cropRef}
          onImageCrop={(result) => convertBase64(result)}
          keepAspectRatio
          aspectRatio={{ width: ratio.width, height: ratio.height }}
        />
        <TouchableOpacity
          onPress={() =>
            setRatio(ratio.index == 1 ? ratioindex[0] : ratioindex[1])
          }
          style={{
            backgroundColor: "#B2B2B2",
            position: "absolute",
            bottom: 0,
            borderRadius: 20,
            margin: 15,
            width: 40,
            height: 40,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {ratio.index == 0 ? (
            <SizeOri height={23} width={23} />
          ) : (
            <SizeStrace height={23} width={23} />
          )}
          {/* <Text
						style={{
							color: "#fff",
							fontFamily: "Lato-Bold",
							fontWeight: "bold",
						}}
					>
						{ratio.width}{' '}:{' '}{ratio.height}
					</Text> */}
        </TouchableOpacity>
      </View>
      <FlatList
        style={{
          paddingStart: 0,
          alignContent: "center",
          backgroundColor: "white",
          // marginBottom: 450,
          // paddingBottom: 10,
          height: width - 20,
        }}
        ref={slider}
        data={imageRoll && imageRoll.length ? imageRoll : null}
        renderItem={({ item, index }) =>
          item.mediaType !== "camera" ? (
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
              onPress={() => pickcamera()}
            >
              <CameraBlue height={30} width={30} />
            </TouchableOpacity>
          )
        }
        numColumns={4}
        // ListHeaderComponent={

        // }
      />
    </View>
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
