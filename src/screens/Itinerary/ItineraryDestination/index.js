import React, { useState, useEffect } from "react";
import {
  View,
  // Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Alert,
  Image,
  FlatList,
} from "react-native";
import { CustomImage, FunIcon } from "../../../component";
import { useQuery, useLazyQuery, useMutation } from "@apollo/react-hooks";
import {
  LikeRed,
  LikeEmpty,
  Arrowbackwhite,
  OptionsVertWhite,
  Star,
  PinHijau,
  LikeEmptynew,
} from "../../../assets/svg";
import FilterItin from "./FillterItin";
import Listdestination from "../../../graphQL/Query/Destination/ListDestinationV2";
import filterDestination from "../../../graphQL/Query/Destination/Destinasifilter";
import Liked from "../../../graphQL/Mutation/Destination/Liked";
import UnLiked from "../../../graphQL/Mutation/unliked";
import { useTranslation } from "react-i18next";
import { Text, Button } from "../../../component";
import LinearGradient from "react-native-linear-gradient";
import { StackActions } from "@react-navigation/routers";

export default function ItineraryDestination(props) {
  const HeaderComponent = {
    headerShown: true,
    title: "Destination",
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: "Destination",
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
    headerLeftContainerStyle: {
      background: "#FFF",

      marginLeft: 10,
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
        }}
      >
        <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
      </Button>
    ),
  };
  const { t, i18n } = useTranslation();

  const {
    data: datafilter,
    loading: loadingfilter,
    error: errorfilter,
  } = useQuery(filterDestination);
  let [token, setToken] = useState(props.route.params.token);
  let [datadayaktif] = useState(props.route.params.datadayaktif);
  let [dataDes] = useState(props.route.params.dataDes);
  let [lat] = useState(props.route.params.lat);
  let [long] = useState(props.route.params.long);
  let [IdItinerary, setId] = useState(props.route.params.IdItinerary);

  let [search, setSearch] = useState({
    type: null,
    keyword: null,
    countries: null,
    cities: null,
    goodfor: null,
    facilities: null,
  });

  const [GetListDestination, { data, loading, error }] = useLazyQuery(
    Listdestination,
    {
      fetchPolicy: "network-only",
      variables: {
        keyword: search.keyword ? search.keyword : null,
        // type: search.type ? search.type : null,
        type:
          search.type && search.type.length > 0
            ? search.type
            : props.route.params && props.route.params.idtype
            ? [props.route.params.idtype]
            : null,
        cities:
          search.city && search.city.length > 0
            ? search.city
            : props.route.params && props.route.params.idcity
            ? [props.route.params.idcity]
            : null,
        countries:
          search.country && search.country.length > 0
            ? search.country
            : props.route.params && props.route.params.idcountries
            ? [props.route.params.idcountries]
            : null,
        goodfor: search.goodfor ? search.goodfor : null,
        facilities: search.facilities ? search.facilities : null,
        rating: search.rating ? search.rating : null,
      },
      context: {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    }
  );

  console.log(data);

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

  const [
    mutationUnliked,
    { loading: loadingUnLike, data: dataUnLike, error: errorUnLike },
  ] = useMutation(UnLiked, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const _liked = async (id) => {
    if (token || token !== "") {
      try {
        let response = await mutationliked({
          variables: {
            destination_id: id,
          },
        });
        if (loadingLike) {
          Alert.alert("Loading!!");
        }
        if (errorLike) {
          throw new Error("Error Input");
        }

        if (response.data) {
          if (
            response.data.setDestination_wishlist.code === 200 ||
            response.data.setDestination_wishlist.code === "200"
          ) {
            GetListDestination();
          } else {
            throw new Error(response.data.setDestination_wishlist.message);
          }

          // Alert.alert('Succes');
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
            type: "destination",
          },
        });
        if (loadingUnLike) {
          Alert.alert("Loading!!");
        }
        if (errorUnLike) {
          throw new Error("Error Input");
        }

        // console.log(response);
        if (response.data) {
          if (
            response.data.unset_wishlist.code === 200 ||
            response.data.unset_wishlist.code === "200"
          ) {
            GetListDestination();
          } else {
            throw new Error(response.data.unset_wishlist.message);
          }
        }
      } catch (error) {
        Alert.alert("" + error);
      }
    } else {
      Alert.alert("Please Login");
    }
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      GetListDestination();
    });
    return unsubscribe;
  }, [props.navigation]);

  return (
    <View
      style={{
        flex: 1,
        alignContent: "center",
        alignItems: "center",
        justifyContent: "flex-start",
        // paddingVertical: 10,
      }}
    >
      {datafilter && datafilter?.destination_filter ? (
        <FilterItin
          type={datafilter?.destination_filter?.type}
          country={datafilter?.destination_filter?.country}
          facility={datafilter?.destination_filter?.facility}
          sendBack={(e) => setSearch(e)}
          props={props}
          token={token}
          datadayaktif={datadayaktif}
          dataDes={dataDes}
          lat={lat}
          long={long}
        />
      ) : null}

      {data && data.destinationList_v2.length ? (
       
       <FlatList
       data={data.destinationList_v2}
       contentContainerStyle={{
         marginTop: 5,
         justifyContent: "space-evenly",
         paddingStart: 10,
         paddingEnd: 10,
         paddingBottom: 120,
       }}
       horizontal={false}
       // data={dataDes}
       renderItem={({ item, index }) => (
         
         <Pressable
           // onPress={() => {
           //   props.navigation.navigate("detailStack", {
           //     id: item.id,
           //     name: item.name,
           //   });
           // }}

           onPress={() => {
             props?.route?.params && props?.route?.params?.iditinerary
               ? props.navigation.push("DestinationUnescoDetail", {
                   id: item.id,
                   name: item.name,
                   token: token,
                   iditinerary: props.route.params.iditinerary,
                   datadayaktif: props.route.params.datadayaktif,
                 })
               : props.navigation.push("DestinationUnescoDetail", {
                   id: item.id,
                   name: item.name,
                   token: token,
                 });
           }}
           style={{
             width: "100%",
             paddingLeft: 10,
             paddingRight: 10,
             elevation: 2,
             backgroundColor: "#FFFFFF",
           
             marginBottom: 10,
             borderRadius: 10,
             marginTop: 10,
             flexDirection: "row",
           }}
         >
           <View
           style={{
             width: "100%",
            
             paddingTop:15,
             flexDirection: "row",
           }}
           >

          
           <Image
             source={
               item.images && item.images.image
                 ? { uri: item.images.image }
                 : default_image
             }
             style={{ width: "40%", height: 145, borderRadius: 10 }}
             resizeMode="cover"
           />
           <View
             style={{
               paddingLeft: 10,
               paddingVertical: 5,
               width: "60%",
               justifyContent: "space-between",
             }}
           >
             <View>
               <View
                 style={{
                   flexDirection: "row",
                   justifyContent: "space-between",
                  
                   alignItems: "center",
                   marginBottom: 5,
                 }}
               >
                 <View
                   style={{
                     backgroundColor: "#F4F4F4",
                     borderRadius: 4,
                     paddingHorizontal: 8,
                     paddingVertical: 3,
                     flexDirection: "row",
                   }}
                 >
                   <Star width={15} height={15} />
                   <Text style={{ paddingLeft: 5 }} type="bold">
                     {item.rating}
                   </Text>
                 </View>
                 {item.liked === false ? (
                   <Button
                     onPress={() => _liked(item.id, index)}
                     type="circle"
                     style={{
                       width: 25,
                       borderRadius: 19,
                       height: 25,
                       justifyContent: "center",
                       alignContent: "center",
                       alignItems: "center",
                       backgroundColor: "#EEEEEE",
                       zIndex: 999,
                     }}
                   >
                     <LikeEmptynew width={15} height={15} />
                   </Button>
                 ) : (
                   <Button
                     onPress={() => _unliked(item.id)}
                     type="circle"
                     style={{
                       width: 25,
                       borderRadius: 17.5,
                       height: 25,
                       justifyContent: "center",
                       alignContent: "center",
                       alignItems: "center",
                       backgroundColor: "#EEEEEE",
                       zIndex: 999,
                     }}
                   >
                     <LikeRed width={15} height={15} />
                   </Button>
                 )}
               </View>
               <Text size="title" type="bold" style={{ marginBottom: 5 }}>
                 {item.name}
               </Text>
               <View
                 style={{
                   flexDirection: "row",
                   alignItems: "center",
                   alignContent: "center",
                   justifyContent: "flex-start",
                 }}
               >
                 <PinHijau width={15} height={15} />
                 <Text
                   type="regular"
                   size="description"
                   style={{ color: "#464646", marginLeft: 5 }}
                 >
                   {item.cities.name && item.countries.name
                     ? `${item.cities.name}`
                     : ""}
                 </Text>
               </View>
             </View>
             {/* icon great for */}
             <View
               style={{
                 marginTop: 10,
                 flexDirection: "row",
                 justifyContent: "space-between",
                 alignContent: "center",
                 alignItems: "center",
                 width: "100%",
                 padding: 0,
                 // width: (Dimensions.get("screen").width - 100) * 0.5 ,
               }}
             >
               <View>
                 <View
                   style={{
                     flexDirection: "row",
                     justifyContent: "space-between",
                   }}
                 >
                   {item.greatfor && item.greatfor.length ? (
                     <View
                       style={{
                         justifyContent: "flex-start",
                         alignContent: "flex-start",
                       }}
                     >
                         <Text
                         size="description"
                         type="bold"
                         style={{
                           color: "#464646",
                         }}
                       >
                         {t("greatFor")}:
                       </Text>
                      
                       <View
                           style={{
                             height: 50,
                             flexDirection: "row",
                             justifyContent: "space-evenly",
                             alignContent: "space-between",
                             alignItems: "stretch",
                             alignSelf: "flex-start",
                           }}
                         >
                            {item.greatfor.map((item, index) => {
                       
                         return index < 3 ? (
                           <FunIcon
                             icon={item.icon}
                             fill="#464646"
                             height={42}
                             width={42}
                             style={{}}
                           />
                           ):null
                           })}
                         </View>
                         
                       
                     </View>
                   ) : (
                     <View
                         style={{
                           height: 50,
                           marginBottom:15,
                           flexDirection: "row",
                           justifyContent: "space-evenly",
                           alignContent: "space-between",
                           alignItems: "stretch",
                           alignSelf: "flex-start",
                       
                       }}
                     >
                       
                 
                     </View>
                   )}
                 </View>
               </View>

               <Button
                 size="small"
                 text={t("adddeswishlist")}
                 color="primary"
                 onPress={() => {
                   props.route.params && props.route.params.iditinerary
                     ? props.navigation.dispatch(
                         StackActions.replace("ItineraryStack", {
                           screen: "ItineraryChooseday",
                           params: {
                             Iditinerary: props.route.params.iditinerary,
                             Kiriman: item.id,
                             token: token,
                             Position: "destination",
                             datadayaktif: props.route.params.datadayaktif,
                           },
                         })
                       )
                     : props.navigation.push("ItineraryStack", {
                         screen: "ItineraryPlaning",
                         params: {
                           idkiriman: item.id,
                           Position: "destination",
                         },
                       });
                 }}
                 style={{
                   marginTop: 10,
                 }}
               />
             </View>
           </View>
           </View>
         </Pressable>
       )}
       // keyExtractor={(item) => item.id}
       showsHorizontalScrollIndicator={false}
      
       // extraData={selected}
     />
      //   <FlatList
      //     style={{
      //       paddingTop: 5,
      //     }}
      //     contentContainerStyle={{
      //       // marginTop: 5,
      //       justifyContent: "space-evenly",
      //       paddingStart: 10,
      //       paddingEnd: 10,
      //       paddingBottom: 10,
      //     }}
      //     horizontal={false}
      //     data={data.destinationList_v2}
      //     renderItem={({ item, inde }) => (
      //       <View
      //         style={{
      //           // height: 280,
      //           borderWidth: 1,
      //           borderColor: "#D8D8D8",
      //           marginBottom: 10,
      //           alignContent: "center",
      //           alignItems: "center",
      //           width: Dimensions.get("screen").width - 30,
      //           borderRadius: 5,
      //           shadowColor: "#646464",
      //           shadowOffset: { width: 0, height: 2 },
      //           shadowOpacity: 5,
      //           shadowRadius: 3,
      //           elevation: 3,
      //           backgroundColor: "white",
      //         }}
      //       >
      //         <TouchableOpacity
      //           style={{
      //             width: "100%",
      //           }}
      //           // onPress={() => {
      //           //   props.navigation.navigate("detailStack", {
      //           //     id: item.id,
      //           //     name: item.name,
      //           //   });
      //           // }}
      //           onPress={() => {
      //             props.route.params && props.route.params.IdItinerary
      //               ? props.navigation.push("DestinationUnescoDetail", {
      //                   id: item.id,
      //                   name: item.name,
      //                   token: token,
      //                   iditinerary: props.route.params.IdItinerary,
      //                   datadayaktif: props.route.params.datadayaktif,
      //                 })
      //               : props.navigation.push("DestinationUnescoDetail", {
      //                   id: item.id,
      //                   name: item.name,
      //                   token: token,
      //                 });
      //           }}
      //         >
      //           <Image
      //             source={{ uri: item.images.image }}
      //             style={{
      //               height: 145,
      //               alignSelf: "center",
      //               width: "100%",
      //               borderTopLeftRadius: 5,
      //               borderTopRightRadius: 5,
      //               marginBottom: 5,
      //             }}
      //             resizeMode="cover"
      //           />
      //         </TouchableOpacity>

      //         <View
      //           style={{
      //             paddingHorizontal: 15,
      //             width: "100%",
      //             marginBottom: 15,
      //           }}
      //         >
      //           <View
      //             style={{
      //               flexDirection: "row",
      //               justifyContent: "space-between",
      //             }}
      //           >
      //             <Text type="bold" size="label" style={{ width: "80%" }}>
      //               {item.name}
      //             </Text>

      //             {item.liked === false ? (
      //               <Button
      //                 onPress={() => _liked(item.id)}
      //                 type="circle"
      //                 style={{
      //                   width: 25,
      //                   borderRadius: 19,
      //                   height: 25,
      //                   justifyContent: "center",
      //                   alignContent: "center",
      //                   alignItems: "center",
      //                   backgroundColor: "#EEEEEE",
      //                   zIndex: 999,
      //                   top: 3,
      //                 }}
      //               >
      //                 <LikeEmptynew width={15} height={15} />
      //               </Button>
      //             ) : (
      //               <Button
      //                 onPress={() => _unliked(item.id)}
      //                 type="circle"
      //                 style={{
      //                   width: 25,
      //                   borderRadius: 17.5,
      //                   height: 25,
      //                   justifyContent: "center",
      //                   alignContent: "center",
      //                   alignItems: "center",
      //                   backgroundColor: "#EEEEEE",
      //                   zIndex: 999,
      //                   top: 3,
      //                 }}
      //               >
      //                 <LikeRed width={15} height={15} />
      //               </Button>
      //             )}
      //           </View>
      //           <View
      //             style={{
      //               flexDirection: "row",
      //               marginTop: 5,
      //               alignContent: "flex-start",
      //             }}
      //           >
      //             <View
      //               style={{
      //                 flexDirection: "row",
      //                 alignItems: "center",
      //                 alignContent: "center",
      //                 justifyContent: "flex-start",
      //               }}
      //             >
      //               <PinHijau width={15} height={15} />
      //               <Text
      //                 type="regular"
      //                 size="description"
      //                 style={{ color: "#464646", marginLeft: 5 }}
      //               >
      //                 {item.cities.name && item.countries.name
      //                   ? `${item.cities.name}`
      //                   : ""}
      //               </Text>
      //             </View>
      //             <View
      //               style={{
      //                 marginLeft: 15,
      //                 flexDirection: "row",
      //                 justifyContent: "space-evenly",
      //                 alignContent: "space-around",
      //                 alignItems: "center",
      //               }}
      //             >
      //               <Star height={15} width={15} />
      //               <View style={{ marginLeft: 5 }}>
      //                 <Text
      //                   size="description"
      //                   type="bold"
      //                   style={{ color: "#000000" }}
      //                 >
      //                   {item.rating !== null ? `${item.rating}` : 5}
      //                 </Text>
      //               </View>
      //             </View>

      //             <View
      //               style={{
      //                 flexDirection: "row",
      //                 justifyContent: "center",
      //                 alignContent: "center",
      //               }}
      //             >
      //               {/* <TicketAvailable
			// 					height={15}
			// 					width={15}
			// 					style={{
			// 						alignSelf: 'center',
			// 						marginLeft: 15,
			// 						marginRight: 5,
			// 					}}
			// 				/> */}
      //               {/* <Image
			// 						source={Ticket}
			// 						style={{
			// 							height: 15,
			// 							width: 15,
			// 							marginLeft: 15,
			// 							marginRight: 5,
			// 							alignSelf: 'center',
			// 						}}
			// 						resizeMode='contain'
			// 					/> */}
      //               {/* <Text
			// 					size='description'
			// 					style={{ textAlign: 'center', textAlignVertical: 'center' }}>
			// 					{t('availableTicket')}
			// 				</Text> */}
      //             </View>
      //           </View>

      //           <View
      //             style={{
      //               marginTop: 10,
      //               flexDirection: "row",
      //               // width: '100%',
      //               justifyContent: "space-between",
      //             }}
      //           >
      //             <View
      //               style={{
      //                 // position: 'absolute',
      //                 // bottom: normalize(0),
      //                 // left: normalize(15),
      //                 // paddingTop: 10,
      //                 // marginRight: 150,
      //                 justifyContent: "flex-start",
      //                 alignContent: "flex-start",
      //                 alignItems: "flex-start",
      //                 // alignSelf: 'flex-end',
      //                 // flexDirection: 'row',
      //               }}
      //             >
      //               <Text
      //                 size="description"
      //                 type="bold"
      //                 style={{
      //                   color: "#464646",
      //                 }}
      //               >
      //                 {t("greatFor")}:
      //               </Text>
      //               <View
      //                 style={{
      //                   flexDirection: "row",
      //                   justifyContent: "space-evenly",
      //                   alignContent: "space-between",
      //                   alignItems: "stretch",
      //                   alignSelf: "flex-start",
      //                   // backgroundColor: 'cyan',
      //                   // marginLeft: -7,
      //                 }}
      //               >
      //                 {item.greatfor.map((item, index) => {
      //                   return item && item.icon ? (
      //                     <FunIcon
      //                       // variant="i"
      //                       icon={item.icon}
      //                       fill="#464646"
      //                       height={42}
      //                       width={42}
      //                       style={{}}
      //                     />
      //                   ) : // <Text>test</Text>
      //                   null;
      //                 })}
      //               </View>
      //             </View>
      //             <Button
      //               text={t("addToPlan")}
      //               style={{}}
      //               color="primary"
      //               onPress={() => {
      //                 props.navigation.push("ItineraryStack", {
      //                   screen: "ItineraryChooseday",
      //                   params: {
      //                     Iditinerary: IdItinerary,
      //                     Kiriman: item.id,
      //                     token: token,
      //                     Position: "destination",
      //                     datadayaktif: datadayaktif,
      //                   },
      //                 });
      //               }}
      //             />
      //           </View>
      //         </View>
      //       </View>
      //     )}
      //     key={""}
      //     keyExtractor={(item) => item.id}
      //     showsHorizontalScrollIndicator={false}
      //     showsVerticalScrollIndicator={false}
      //   />
      ) : null}
    </View>
  );
}
