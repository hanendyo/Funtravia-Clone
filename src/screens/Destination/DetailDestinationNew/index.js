import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  View,
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { Text, StatusBar } from "../../../component";
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
} from "../../../assets/svg";
import { TabBar, SceneMap, TabView } from "react-native-tab-view";
import Modal from "react-native-modal";
import Ripple from "react-native-material-ripple";
import Liked from "../../../graphQL/Mutation/Destination/Liked";
import ActivityModal from "./ActivityModal";
import FacilityModal from "./FacilityModal";
import ServiceModal from "./ServiceModal";
import Generals from "./Generals";
import Activities from "./Activities";
import Facilities from "./Facilities";
import Services from "./Services";
import Reviews from "./Reviews";

const { width, height } = Dimensions.get("screen");
export default function index(props) {
  console.log("props index :", props);
  const [setting, setSetting] = useState("");
  const [token, setToken] = useState("");
  const [modalActivity, setModalActivity] = useState(false);
  const [modalFacility, setModalFacility] = useState(false);
  const [modalService, setModalService] = useState(false);
  const [modalTime, setModalTime] = useState(false);
  const [modalSosial, setModalSosial] = useState(false);

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

  const General = () => {
    return <Generals data={data.destinationById} />;
  };

  const Activity = () => {
    return <Activities data={data.destinationById} />;
  };

  const Facility = () => {
    return <Facilities data={data.destinationById} />;
  };

  const Service = () => {
    return <Services data={data.destinationById} />;
  };

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

  const Review = () => {
    return <Reviews data={data} props={props} />;
  };

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "general", title: "General" },
    // { key: "activity", title: "Activity" },
    // { key: "facility", title: "Facility" },
    // { key: "service", title: "Service" },
    // { key: "FAQ", title: "FAQ" },
    { key: "review", title: "Review" },
  ]);

  const renderScene = SceneMap({
    general: General,
    // activity: Activity,
    // facility: Facility,
    // service: Service,
    // FAQ: FAQ,
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
          // stickyHeaderIndices={[5]}
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
                        { opacity: focused ? 1 : 0.7 },
                      ]}
                    >
                      {route.title}
                    </Text>
                  );
                }}
                indicatorStyle={styles.indicator}
              />
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
    // width: "100%",
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
    // height: 50,
  },
  indicator: { backgroundColor: "#209FAE", height: 3 },
});
