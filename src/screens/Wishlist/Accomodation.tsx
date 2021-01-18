import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CustomImage } from "../../component";
import { Text, Button } from "../../component";
import { MapIconGreen, default_image, Foto } from "../../assets/png";
import { rupiah } from "../../component/src/Rupiah";
import { AirbnbRating } from "react-native-ratings";
import { LikeRed, LikeEmpty } from "../../assets/svg";

const AccommodationData = [
  {
    id: 1,
    name: "Marina Hotel",
    location: "Jakarta Utara",
    image: [default_image, default_image, default_image],
    ratting: 8.2,
    customer: 200,
    price: 820000,
    jarak: 20,
    roomClass: 3,
    Facilities: 10,
    recreation: true,
    photo_spot: true,
    liked: true,
  },
  {
    id: 2,
    name: "Marijuana Hotel",
    location: "Jakarta Barat",
    image: [default_image, default_image, default_image],
    ratting: 5.2,
    customer: 200,
    price: 820000,
    jarak: 2000,
    roomClass: 3,
    Facilities: 10,
    recreation: true,
    photo_spot: true,
    liked: true,
  },
];

export default function Accommodation({ dataPrev }) {
  let [token, setToken] = useState("");
  let [dataAcc, setAcc] = useState(AccommodationData);

  const handler_liked = (id) => {
    const tempData = [...dataAcc];
    var index = tempData.findIndex((k) => k["id"] === id);
    if (tempData[index]["liked"] == false) {
      tempData[index]["liked"] = !tempData[index]["liked"];
    } else {
      tempData.splice(index, 1);
    }

    setAcc(tempData);
  };

  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    setToken(tkn);
    // console.log(tkn);
  };

  const ratingCompleted = (rating) => {
    console.log("Rating is: " + rating);
  };

  useEffect(() => {
    // loadAsync();
  }, []);

  const RenderAcc = ({ data }) => {
    return (
      <View>
        {/* {dataPrev == 'list' ? ( */}
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: "#F0F0F0",
            marginBottom: 10,
          }}
        >
          <View
            style={{
              // width: (110),
              // height: (120),
              width: Dimensions.get("window").width - 20,
              marginTop: 10,
              // marginBottom: (10),
              flex: 1,
              flexDirection: "row",
            }}
          >
            <TouchableOpacity
              style={{
                // height: (150),
                width: Dimensions.get("screen").width * 0.3,
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 10,
              }}
            >
              <ImageBackground
                key={data.id}
                source={data.image[0]}
                style={[
                  styles.ImageView,
                  {
                    width: Dimensions.get("screen").width * 0.25,
                    height: Dimensions.get("screen").width * 0.25,
                    backgroundColor: "white",
                    borderColor: "gray",
                    shadowColor: "gray",
                    shadowOffset: { width: 2, height: 2 },
                    shadowOpacity: 1,
                    shadowRadius: 3,
                    elevation: 3,
                  },
                ]}
                imageStyle={[
                  styles.Image,
                  {
                    width: Dimensions.get("screen").width * 0.25,
                    height: Dimensions.get("screen").width * 0.25,
                  },
                ]}
              ></ImageBackground>
            </TouchableOpacity>
            <View
              style={{
                height: "100%",
                width: Dimensions.get("window").width * 0.6,
                paddingLeft: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  flex: 1,
                  // marginBottom: (10),
                }}
              >
                <View
                  style={{
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      width: Dimensions.get("window").width * 0.6,
                      flexDirection: "row",
                    }}
                  >
                    <View>
                      <TouchableOpacity
                        style={{
                          width: Dimensions.get("window").width * 0.6 - 30,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "lato-bold",
                            fontSize: 16,
                            // color: '#D7598F',
                            // marginLeft: (5),
                          }}
                        >
                          {data.name}
                        </Text>
                      </TouchableOpacity>
                      <View
                        style={{
                          flexDirection: "row",
                        }}
                      >
                        <View
                          style={{
                            marginRight: 10,
                            alignItems: "center",
                            justifyContent: "center",
                            alignContent: "center",
                          }}
                        >
                          <AirbnbRating
                            count={5}
                            // reviews={[]}
                            showRating={false}
                            // reviewSize={0}
                            isDisabled={true}
                            defaultRating={data.ratting / 2}
                            size={10}
                          />
                        </View>
                        <Text
                          style={{
                            fontFamily: "lato-bold",
                            fontSize: 10,
                            color: "#209FAE",
                          }}
                        >
                          {data.ratting}
                        </Text>
                        <Text
                          style={{
                            fontFamily: "lato-reg",
                            fontSize: 10,
                            // color: '#209FAE',
                          }}
                        >
                          {" "}
                          ({data.customer})
                        </Text>
                      </View>
                    </View>
                    <View
                      style={
                        {
                          // marginTop: (-20),
                          // marginRight: (20),
                        }
                      }
                    >
                      <TouchableOpacity
                        onPress={() => handler_liked(data.id)}
                        style={{
                          // alignSelf: 'flex-end',
                          height: 30,
                          width: 30,
                          borderRadius: 15,
                          backgroundColor: "rgb(240, 240, 240)",
                          alignItems: "center",
                          alignContent: "center",
                          justifyContent: "center",
                        }}
                      >
                        {data.liked == true ? (
                          <LikeRed height={15} width={15} />
                        ) : (
                          <LikeEmpty height={15} width={15} />
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                    }}
                  >
                    <CustomImage
                      customStyle={{
                        width: 20,
                        height: 20,
                      }}
                      customImageStyle={{
                        width: 20,
                        height: 20,
                        resizeMode: "contain",
                      }}
                      // isTouchable={true}
                      // onPress={() => props.navigation.navigate('Home')}
                      source={MapIconGreen}
                    />
                    <Text
                      style={{
                        fontFamily: "lato-reg",
                        color: "#464646",
                        marginLeft: 3,
                      }}
                    >
                      {data.location}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                    }}
                  >
                    <View
                      style={{
                        // borderWidth: 1,
                        // borderColor: 'red',
                        alignItems: "flex-end",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "lato-bold",
                          fontSize: 18,
                          color: "#209FAE",
                          // marginLeft: (5),
                        }}
                      >
                        {`Rp.${rupiah(data.price)}`}
                      </Text>
                    </View>
                    <View
                      style={{
                        // borderWidth: 1,
                        // borderColor: 'red',
                        alignItems: "flex-end",
                        justifyContent: "flex-end",
                        paddingBottom: 3,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "lato-reg",
                          fontSize: 10,
                          // color: '#D7598F',
                          // marginLeft: (5),
                        }}
                      >
                        /kamar/malam
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View
            style={{
              width: Dimensions.get("window").width - 20,
              backgroundColor: "rgb(240, 240, 240)",
              marginBottom: 10,
              marginTop: 5,

              borderRadius: 5,
              height: 20,
              flexDirection: "row",
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            <View
              style={{
                minWidth: (Dimensions.get("window").width - 40) / 3,
                flexDirection: "row",
                alignContent: "flex-end",
                justifyContent: "flex-end",
                alignItems: "center",
                // borderColor: 'red',
                // borderWidth: 1,
              }}
            >
              <Text
                style={{
                  fontFamily: "lato-reg",
                  fontSize: 10,
                  marginHorizontal: 3,
                  marginLeft: 20,
                }}
              >
                {data.jarak} km
              </Text>
              <Text
                style={{
                  fontFamily: "lato-reg",
                  fontSize: 10,
                  marginHorizontal: 3,
                }}
              >
                from your location
              </Text>
            </View>
            <View
              style={{
                minWidth: (Dimensions.get("window").width - 40) / 3,
                flexDirection: "row",
                alignContent: "flex-end",
                justifyContent: "flex-end",
                alignItems: "center",

                // borderColor: 'red',
                // borderWidth: 1,
              }}
            >
              <Text
                style={{
                  fontFamily: "lato-reg",
                  fontSize: 10,
                  marginHorizontal: 3,
                }}
              >
                {data.roomClass}
              </Text>
              <Text
                style={{
                  fontFamily: "lato-reg",
                  fontSize: 10,
                  marginHorizontal: 3,
                  marginRight: 20,
                }}
              >
                Room Class
              </Text>
            </View>
            <View
              style={{
                minWidth: (Dimensions.get("window").width - 40) / 3,
                flexDirection: "row",
                alignContent: "flex-end",
                justifyContent: "flex-end",
                alignItems: "center",

                // borderColor: 'red',
                // borderWidth: 1,
              }}
            >
              <Text
                style={{
                  fontFamily: "lato-reg",
                  fontSize: 10,
                  marginHorizontal: 3,
                }}
              >
                {data.Facilities}
              </Text>
              <Text
                style={{
                  fontFamily: "lato-reg",
                  fontSize: 10,
                  marginHorizontal: 3,
                  marginRight: 20,
                }}
              >
                Facilities
              </Text>
            </View>
          </View>
        </View>
        {/* ) : (
					<View
						style={{
							// width: (110),
							width: Dimensions.get('window').width - (20),
							marginTop: (10),
							// marginBottom: (5),
						}}>
						<ImageBackground
							// key={value.id}
							source={data.image[1]}
							style={[
								styles.ImageView,
								{
									width: Dimensions.get('window').width - (20),
									height: (180),
									borderRadius: (10),
									marginVertical: (10),
									padding: (10),
								},
							]}
							imageStyle={[
								styles.Image,
								{
									width: Dimensions.get('window').width - (20),
									height: (180),
									borderRadius: (10),
								},
							]}>
							<View
								style={{
									// flexDirection: 'row',
									flex: 1,
									marginBottom: (10),
									// borderWidth: 1,
									// borderColor: 'red',
									// width: (250),
									// height: (25),
								}}>
								<View
									style={{
										flexDirection: 'row',
										width: Dimensions.get('window').width - (40),
									}}>
									<View
										style={{
											width: Dimensions.get('window').width - (85),
										}}></View>

									<TouchableOpacity
										style={{
											// alignSelf: 'flex-end',
											height: (40),
											width: (40),
											borderRadius: (20),
											backgroundColor: 'rgb(240, 240, 240)',
											alignItems: 'center',
											alignContent: 'center',
											justifyContent: 'center',
										}}>
										<CustomImage
											customStyle={{
												width: (20),
												height: (20),
											}}
											customImageStyle={{
												width: (20),
												height: (20),
												resizeMode: 'contain',
											}}
											// isTouchable={true}
											// onPress={() => props.navigation.navigate('Home')}
											source={love_merah}
										/>
									</TouchableOpacity>
								</View>
							</View>
						</ImageBackground>
						<View>
							<View
								style={{
									// zIndex: 99,
									width: Dimensions.get('window').width - (40),
									marginHorizontal: (10),
									// height: (100),
								}}>
								<View
									style={{
										flexDirection: 'row',
										flex: 1,
										marginBottom: (10),

										// borderWidth: 1,
										// borderColor: 'red',
										// width: (250),
										// height: (25),
									}}>
									<View>
										<View
											style={{
												flexDirection: 'row',
											}}>
											<View
												style={{
													width:
														Dimensions.get('window').width - (180),
													flexDirection: 'row',
												}}>
												<Text
													style={{
														fontFamily: 'lato-bold',
														fontSize: (20),
														// color: '#D7598F',
														// marginLeft: (5),
													}}>
													{data.name}
												</Text>
												<View
													style={{
														marginLeft: (10),
														alignItems: 'center',
														justifyContent: 'center',
														alignContent: 'center',
													}}>
													<AirbnbRating
														count={5}
														// reviews={[]}
														showRating={false}
														// reviewSize={0}
														isDisabled={true}
														defaultRating={data.ratting / 2}
														size={(10)}
													/>
												</View>
											</View>
										</View>

										<View
											style={{
												flexDirection: 'row',
											}}>
											<CustomImage
												customStyle={{
													width: (20),
													height: (20),
												}}
												customImageStyle={{
													width: (20),
													height: (20),
													resizeMode: 'contain',
												}}
												// isTouchable={true}
												// onPress={() => props.navigation.navigate('Home')}
												source={MapIconGreen}
											/>
											<Text
												style={{
													fontFamily: 'lato-reg',
													// fontSize: (16),
													// color: '#D7598F',
													marginLeft: (3),
												}}>
												{data.location}
											</Text>
										</View>
										<View
											style={{
												flexDirection: 'row',
												width: Dimensions.get('window').width - (40),
											}}>
											<View
												style={{
													flexDirection: 'row',
													minWidth:
														(Dimensions.get('window').width - (40)) /
														2,
												}}>
												<View
													style={{
														// borderWidth: 1,
														// borderColor: 'red',
														alignItems: 'flex-end',
														justifyContent: 'flex-end',
													}}>
													<Text
														style={{
															fontFamily: 'lato-bold',
															fontSize: (18),
															color: '#209FAE',
															// marginLeft: (5),
														}}>
														{`Rp.${rupiah(data.price)}`}
													</Text>
												</View>
												<View
													style={{
														// borderWidth: 1,
														// borderColor: 'red',
														alignItems: 'flex-end',
														justifyContent: 'flex-end',
														paddingBottom: (3),
													}}>
													<Text
														style={{
															fontFamily: 'lato-reg',
															fontSize: (10),
															// color: '#D7598F',
															// marginLeft: (5),
														}}>
														/kamar/malam
													</Text>
												</View>
											</View>
											<View
												style={{
													flexDirection: 'row',
													minWidth:
														(Dimensions.get('window').width - (40)) /
														2,
													alignItems: 'flex-end',
													justifyContent: 'flex-end',
													paddingBottom: (5),
												}}>
												<Text
													style={{
														fontFamily: 'lato-bold',
														fontSize: (10),
														color: '#209FAE',
													}}>
													{data.ratting}
												</Text>
												<Text
													style={{
														fontFamily: 'lato-reg',
														fontSize: (10),
														// color: '#209FAE',
													}}>
													{' '}
													({data.customer})
												</Text>
											</View>
										</View>
									</View>
								</View>
							</View>
						</View>
						<View
							style={{
								width: Dimensions.get('window').width - (20),
								backgroundColor: 'rgb(240, 240, 240)',
								marginBottom: (10),
								borderRadius: (5),
								height: (20),
								flexDirection: 'row',
								justifyContent: 'center',
								alignContent: 'center',
							}}>
							<View
								style={{
									minWidth:
										(Dimensions.get('window').width - (40)) / 3,
									flexDirection: 'row',
									alignContent: 'flex-end',
									justifyContent: 'flex-end',
									alignItems: 'center',
									// borderColor: 'red',
									// borderWidth: 1,
								}}>
								<Text
									style={{
										fontFamily: 'lato-reg',
										fontSize: (10),
										marginHorizontal: (3),
										marginLeft: (20),
									}}>
									{data.jarak} km
								</Text>
								<Text
									style={{
										fontFamily: 'lato-reg',
										fontSize: (10),
										marginHorizontal: (3),
									}}>
									from your location
								</Text>
							</View>
							<View
								style={{
									minWidth:
										(Dimensions.get('window').width - (40)) / 3,
									flexDirection: 'row',
									alignContent: 'flex-end',
									justifyContent: 'flex-end',
									alignItems: 'center',

									// borderColor: 'red',
									// borderWidth: 1,
								}}>
								<Text
									style={{
										fontFamily: 'lato-reg',
										fontSize: (10),
										marginHorizontal: (3),
									}}>
									{data.roomClass}
								</Text>
								<Text
									style={{
										fontFamily: 'lato-reg',
										fontSize: (10),
										marginHorizontal: (3),
										marginRight: (20),
									}}>
									Room Class
								</Text>
							</View>
							<View
								style={{
									minWidth:
										(Dimensions.get('window').width - (40)) / 3,
									flexDirection: 'row',
									alignContent: 'flex-end',
									justifyContent: 'flex-end',
									alignItems: 'center',

									// borderColor: 'red',
									// borderWidth: 1,
								}}>
								<Text
									style={{
										fontFamily: 'lato-reg',
										fontSize: (10),
										marginHorizontal: (3),
									}}>
									{data.Facilities}
								</Text>
								<Text
									style={{
										fontFamily: 'lato-reg',
										fontSize: (10),
										marginHorizontal: (3),
										marginRight: (20),
									}}>
									Facilities
								</Text>
							</View>
						</View>
					</View>
				)} */}
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        contentContainerStyle={{
          marginTop: 5,
          justifyContent: "space-evenly",
          paddingStart: 10,
          paddingEnd: 10,
          paddingBottom: 120,
        }}
        horizontal={false}
        data={dataAcc}
        renderItem={({ item }) => (
          <RenderAcc
            data={item}
            // onSelect={onSelect}
            // selected={!!selected.get(item.id)}
          />
        )}
        // keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        // extraData={selected}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    // flex: 1,
    // marginTop: 20,
    // paddingTop: (50),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  ImageView: {
    // width: (110),
    // height: (110),
    // marginRight: (5),
    borderRadius: 10,
    backgroundColor: "rgba(0, 0, 0, 0)",
    // opacity: 0.4,
    // elevation: 1,
  },
  Image: {
    resizeMode: "cover",
    borderRadius: 10,
  },
});
