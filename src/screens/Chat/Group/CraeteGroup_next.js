import React, { useState, useEffect } from "react";
import {
    View,
    Dimensions,
    TextInput,
    Image,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    ActivityIndicator,
    ImageBackground,
    FlatList,
    Pressable,
    Alert,
} from "react-native";
import {
    Button,
    Text,
    Truncate,
    CustomImage,
    Loading,
} from "../../../component";
import { default_image, search_button } from "../../../assets/png";
import { useLazyQuery } from "@apollo/react-hooks";
import {
    Arrowbackwhite,
    SendMessage,
    CheckWhite,
    Xhitam,
    Xgray,
    XGray,
    ArrowRight,
    CameraIcon,
} from "../../../assets/svg";
import TravelWith from "../../../graphQL/Query/Itinerary/TravelWith";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CHATSERVER, RESTFULL_CHAT } from "../../../config";
import Modal from "react-native-modal";
import ImagePicker from "react-native-image-crop-picker";

export default function NewGroup(props) {
    const { t, i18n } = useTranslation();
    const [token, setToken] = useState(null);
    let [title, settitle] = useState("");
    const [user, setUser] = useState({});
    let [loading, setloading] = useState(false);
    const [modals, setmodal] = useState(false);
    const [dataImagepatch, setdataImagepatch] = useState("");
    let [dataImage, setdataImage] = useState(null);
    const [
        querywith,
        { loading: loadingwith, data: DataBuddy, error: errorwith },
    ] = useLazyQuery(TravelWith, {
        fetchPolicy: "network-only",
        variables: {
            keyword: title,
        },
        context: {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        },
    });

    const ChatOptions = {
        headerShown: true,
        headerTitle: "New Group",
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
            marginLeft: -10,
        },
        headerLeft: () => (
            <Button
                text={""}
                size="medium"
                type="circle"
                variant="transparent"
                onPress={() => props.navigation.goBack()}
                style={{
                    height: 55,
                    marginLeft: 10,
                }}
            >
                <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
            </Button>
        ),
        headerRight: () => (
            <View
                style={{
                    flex: 1,
                    flexDirection: "row",
                }}
            ></View>
        ),
    };

    useEffect(() => {
        getUserAndToken();
        props.navigation.setOptions(ChatOptions);
    }, []);

    const getUserAndToken = async () => {
        let token = await AsyncStorage.getItem("access_token");
        if (token) {
            await setToken(token);
            await querywith();
            console.log(token);
        }

        let data = await AsyncStorage.getItem("setting");
        if (data) {
            await setUser(JSON.parse(data).user);
        }
    };

    const _settitle = async (text) => {
        settitle(text);
        querywith();
    };

    const [userSelected, setUserSelected] = useState(
        props.route.params.userSelected
    );
    // console.log();
    const selectUser = (data) => {
        let tempData = [...userSelected];
        let index = tempData.findIndex((k) => k["id"] === data.id);
        if (index !== -1) {
            tempData.splice(index, 1);
            setUserSelected(tempData);
        } else {
            tempData.push(data);
            setUserSelected(tempData);
        }
    };

    const pickcamera = async () => {
        ImagePicker.openCamera({
            width: 500,
            height: 500,
            cropping: true,
            cropperCircleOverlay: true,
            includeBase64: true,
            compressImageMaxWidth: 500,
            compressImageMaxHeight: 500,
        }).then((image) => {
            // console.log(image);
            setdataImage(image.data);
            // dataImage.current = image;
            setdataImagepatch(image.path);
            setmodal(false);
            // upload(image.data);
        });
    };

    const pickGallery = async () => {
        ImagePicker.openPicker({
            width: 500,
            height: 500,
            cropping: true,
            cropperCircleOverlay: true,
            includeBase64: true,
            compressImageMaxWidth: 500,
            compressImageMaxHeight: 500,
        }).then((image) => {
            // console.log(image);
            // dataImage.current = image;
            // dataImagepatch.current = image.path;
            setdataImage(image.data);
            setdataImagepatch(image.path);
            setmodal(false);
            // upload(image.data);
        });
    };

    const _createGrup = async () => {
        setloading(true);
        let partisipant = [];
        for (const user of userSelected) {
            partisipant.push(user.id);
        }
        // console.log(
        //   JSON.stringify({
        //     title: title,
        //     description: "",
        //     member: partisipant,
        //     picture: dataImage,
        //   })
        // );
        try {
            let response = await fetch(RESTFULL_CHAT, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: title,
                    description: "",
                    member: JSON.stringify(partisipant),
                    picture: "data:image/png;base64," + dataImage,
                }),
            });
            let responseJson = await response.json();
            console.log(responseJson);
            if (responseJson.status == true) {
                props.navigation.navigate("ChatStack", {
                    screen: "GroupRoom",
                    params: {
                        room_id: responseJson.room.id,
                        name: responseJson.room.title,
                        picture: responseJson.room.picture,
                        from: "group",
                    },
                });
                setloading(false);
            } else {
                setloading(false);
                throw new Error(responseJson.message);
            }
        } catch (error) {
            setloading(false);
            Alert.alert(error);
            console.error(error);
        }
    };

    return (
        <SafeAreaView
            style={{
                flex: 1,
                // borderWidth: 1,
            }}
        >
            <Loading show={loading} />
            <Modal
                onBackdropPress={() => {
                    setmodal(false);
                }}
                onRequestClose={() => setmodal(false)}
                onDismiss={() => setmodal(false)}
                animationIn="fadeIn"
                animationOut="fadeOut"
                isVisible={modals}
                style={{
                    justifyContent: "center",
                    alignItems: "center",
                    alignSelf: "center",
                    alignContent: "center",
                }}
            >
                <View
                    style={{
                        backgroundColor: "white",
                        width: Dimensions.get("screen").width - 60,
                        padding: 20,
                    }}
                >
                    <TouchableOpacity
                        style={{
                            paddingVertical: 10,
                        }}
                        onPress={() => pickcamera()}
                    >
                        <Text size="description" type="regular" style={{}}>
                            {t("OpenCamera")}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            paddingVertical: 10,
                        }}
                        onPress={() => pickGallery()}
                    >
                        <Text size="description" type="regular" style={{}}>
                            {t("OpenGallery")}
                        </Text>
                    </TouchableOpacity>
                </View>
            </Modal>
            {title != "" ? (
                <View
                    style={{
                        position: "absolute",
                        bottom: 20,
                        right: 20,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {!loading ? (
                        <Pressable
                            onPress={() => _createGrup()}
                            style={{
                                width: 60,
                                height: 60,
                                borderRadius: 30,
                                borderWidth: 1.5,
                                borderColor: "#FFF",
                                backgroundColor: "#209FAE",
                                justifyContent: "center",
                                alignItems: "center",
                                zIndex: 1,
                            }}
                        >
                            <CheckWhite width={20} height={20} />
                        </Pressable>
                    ) : (
                        <Pressable
                            style={{
                                width: 60,
                                height: 60,
                                borderRadius: 30,
                                borderWidth: 1.5,
                                borderColor: "#FFF",
                                backgroundColor: "#209FAE",
                                justifyContent: "center",
                                alignItems: "center",
                                zIndex: 1,
                            }}
                        >
                            <ActivityIndicator
                                animating={true}
                                color="#FFFFFF"
                                size="large"
                            />
                        </Pressable>
                    )}
                </View>
            ) : null}
            <View
                style={{
                    backgroundColor: "white",
                    paddingVertical: 20,
                }}
            >
                <View
                    style={{
                        alignContent: "center",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: 20,
                        height: 50,
                        zIndex: 5,
                        flexDirection: "row",
                        width: Dimensions.get("screen").width,
                    }}
                >
                    <View
                        style={{
                            backgroundColor: "#FFFFFF",
                            borderRadius: 5,
                            width: "100%",
                            height: 40,
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        {dataImagepatch != "" ? (
                            <View>
                                <Pressable
                                    onPress={() => setmodal(true)}
                                    style={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 25,
                                        // borderWidth: 1.5,
                                        // borderColor: "#FFF",
                                        backgroundColor: "#D1D1D1",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        zIndex: 1,
                                        marginRight: 10,
                                    }}
                                >
                                    <Image
                                        source={{ uri: dataImagepatch }}
                                        style={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: 25,
                                        }}
                                    />
                                </Pressable>
                            </View>
                        ) : (
                            <Pressable
                                onPress={() => setmodal(true)}
                                style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: 25,
                                    // borderWidth: 1.5,
                                    // borderColor: "#FFF",
                                    backgroundColor: "#D1D1D1",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    zIndex: 1,
                                    marginRight: 10,
                                }}
                            >
                                <CameraIcon width={20} height={20} />
                            </Pressable>
                        )}

                        <TextInput
                            underlineColorAndroid="transparent"
                            placeholder={"Type group subject here...."}
                            maxLength={25}
                            style={{
                                width: "75%",
                                fontFamily: "Lato-Regular",
                                fontSize: 14,
                                borderBottomWidth: 1,
                                borderBottomColor: "#D1D1D1",
                            }}
                            value={title}
                            onChangeText={(text) => _settitle(text)}
                        />
                    </View>
                </View>
            </View>
            <View
                style={{
                    marginTop: 20,
                    margin: 20,
                    marginBottom: 5,
                }}
            >
                <Text>Participant : {userSelected.length}</Text>
            </View>
            <View
                style={{
                    flexWrap: "wrap",
                    flexDirection: "row",
                    paddingHorizontal: 10,
                }}
            >
                {userSelected.map((value, i) => {
                    return (
                        <Pressable
                            // onPress={() => selectUser(item)}
                            style={{
                                alignItems: "center",
                                alignContent: "center",
                                // justifyContent: "center",
                                // borderWidth: 1,
                                // width: Dimensions.get("screen").width - 20 / 5,
                            }}
                        >
                            <Image
                                Pressable={true}
                                // onPress={() => selectUser(item)}
                                source={
                                    value && value.picture
                                        ? { uri: value.picture }
                                        : default_image
                                }
                                style={{
                                    resizeMode: "cover",
                                    height: 55,
                                    width: 55,
                                    borderRadius: 30,
                                    marginVertical: 10,
                                    marginHorizontal: 8,
                                }}
                            />
                            <Text>{value.first_name}</Text>
                        </Pressable>
                    );
                })}
                {/* <FlatList
          data={userSelected}
          keyExtractor={(item) => item.id}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            marginVertical: 10,
            paddingHorizontal: 20,
          }}
          renderItem={({ item, index }) => (
            <Pressable
              // onPress={() => selectUser(item)}
              style={{
                alignItems: "center",
                alignContent: "center",
                // justifyContent: "center",
                // borderWidth: 1,
              }}
            >
              <Image
                Pressable={true}
                // onPress={() => selectUser(item)}
                source={
                  item && item.picture ? { uri: item.picture } : default_image
                }
                style={{
                  resizeMode: "cover",
                  height: 55,
                  width: 55,
                  borderRadius: 30,
                  marginHorizontal: 5,
                }}
              />
              <Text>{item.first_name}</Text>
            </Pressable>
          )}
        /> */}
            </View>
        </SafeAreaView>
    );
}