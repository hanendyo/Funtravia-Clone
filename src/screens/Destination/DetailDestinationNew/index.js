import React, { useEffect, useState, useRef } from "react";
import {
  ActivityIndicator,
  Dimensions,
  View,
  Image,
  Pressable,
  StyleSheet,
  Animated,
} from "react-native";
import { Text, StatusBar } from "../../../component";
import DestinationById from "../../../graphQL/Query/Destination/DestinationById";
import { useQuery } from "@apollo/react-hooks";
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
import BottomButton from "./BottomButton";
const HEADER_EXPANDED_HEIGHT = 380;
const HEADER_COLLAPSED_HEIGHT = 50;

const { width, height } = Dimensions.get("screen");
export default function index(props) {
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

  const General = () => {
    return (
      <Generals
        data={data.destinationById}
        scroll={scrollY}
        heights={HEADER_EXPANDED_HEIGHT + 50}
      />
    );
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
    return (
      <Reviews
        id={data.destinationById.id}
        props={props}
        scroll={scrollY}
        heights={HEADER_EXPANDED_HEIGHT + 50}
      />
    );
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

  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
    outputRange: [HEADER_EXPANDED_HEIGHT, HEADER_COLLAPSED_HEIGHT],
    extrapolate: "clamp",
  });

  const tops = scrollY.interpolate({
    inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
    outputRange: [HEADER_EXPANDED_HEIGHT, HEADER_COLLAPSED_HEIGHT],
    extrapolate: "clamp",
  });

  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const heroTitleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar backgroundColor="#14646E" barStyle="light-content" />
      {loading ? (
        <View style={{ marginTop: 50 }}>
          <ActivityIndicator animating={true} color="#209FAE" />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <Animated.View
            style={{
              height: headerHeight,
              width: Dimensions.get("screen").width,
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              zIndex: 1,
              // backgroundColor: "#209FAE",
              // justifyContent: "space-between",
            }}
          >
            <Animated.View
              style={{
                height: 50,
                width: Dimensions.get("screen").width,
                flexDirection: "row",
                opacity: headerTitleOpacity,
                position: "absolute",
                zIndex: 5,
                backgroundColor: "#209FAE",
              }}
            >
              <Ripple
                onPress={() => props.navigation.goBack()}
                style={{
                  // position: "absolute",
                  zIndex: 3,
                  paddingTop: 15,
                  paddingLeft: 15,
                }}
              >
                <Arrowbackwhite height={20} width={20} />
              </Ripple>
              <Animated.Text
                style={{
                  // textAlign: "center",
                  fontSize: 20,
                  paddingTop: 15,
                  marginLeft: 20,
                  opacity: headerTitleOpacity,
                  color: "#FFF",
                }}
              >
                {data?.destinationById?.name}
              </Animated.Text>
            </Animated.View>

            <Animated.View
              style={{
                backgroundColor: "#FFF",
                flex: 1,
                justifyContent: "flex-end",
              }}
            >
              {/* View Image Top */}

              <Animated.View
                style={{
                  width: Dimensions.get("screen").width,
                  // height: 180,
                  zIndex: 10,
                  backgroundColor: "#FFF",
                  opacity: heroTitleOpacity,
                  bottom: 0,
                  // top: 0,
                  // position: "absolute",
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
                    style={{ height: 180, width: "100%" }}
                  />
                ) : null}
              </Animated.View>
              <Animated.View
                style={{
                  paddingTop: 10,
                  paddingHorizontal: 15,
                  width: Dimensions.get("screen").width,
                  minHeight: 50,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  // height: headerHeight,
                  backgroundColor: "#FFF",
                  // position: "absolute",
                  // top: 0,
                  bottom: 0,
                  // zIndex: 4,
                  opacity: heroTitleOpacity,
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
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
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
              </Animated.View>

              {/* View Types */}

              <Animated.View
                style={{
                  width: Dimensions.get("screen").width,
                  paddingHorizontal: 15,
                  height: 30,
                  paddingVertical: 5,
                  flexDirection: "row",
                  opacity: heroTitleOpacity,
                  backgroundColor: "#FFF",
                  bottom: 0,
                  opacity: heroTitleOpacity,
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
                  <UnescoIcon
                    height={20}
                    width={20}
                    style={{ marginRight: 5 }}
                  />
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
                    <MovieIcon
                      height={20}
                      width={20}
                      style={{ marginRight: 5 }}
                    />
                    <Text size="description" type="regular">
                      Movie Location
                    </Text>
                  </View>
                ) : null}
              </Animated.View>

              {/* View address */}

              <Animated.View
                style={{
                  paddingTop: 10,
                  borderTopWidth: 1,
                  borderTopColor: "#F6F6F6",
                  width: Dimensions.get("screen").width,
                  minHeight: 40,
                  paddingHorizontal: 15,
                  backgroundColor: "#FFF",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  bottom: 0,
                  opacity: heroTitleOpacity,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",

                    width: Dimensions.get("screen").width * 0.75,
                  }}
                >
                  <PinHijau
                    height={18}
                    width={18}
                    style={{ marginRight: 10 }}
                  />
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
              </Animated.View>

              {/* View Time */}

              <Animated.View
                style={{
                  borderTopWidth: 1,
                  borderTopColor: "#F6F6F6",
                  width: Dimensions.get("screen").width,
                  minHeight: 40,
                  paddingHorizontal: 15,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#FFF",
                  bottom: 0,
                  opacity: heroTitleOpacity,
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
                <Ripple
                  onPress={() => setModalTime(true)}
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: 40,
                  }}
                >
                  <Text
                    size="description"
                    type="regular"
                    style={{ color: "#209FAE" }}
                  >
                    more
                  </Text>
                </Ripple>
              </Animated.View>

              {/* View Website */}

              <Animated.View
                style={{
                  borderTopWidth: 1,
                  borderTopColor: "#F6F6F6",
                  width: Dimensions.get("screen").width,
                  minHeight: 40,
                  paddingHorizontal: 15,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#FFF",
                  bottom: 0,
                  opacity: heroTitleOpacity,
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
                <Ripple
                  onPress={() => setModalSosial(true)}
                  style={{
                    minHeight: 40,
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
                </Ripple>
              </Animated.View>

              {/* View Garis */}
              <Animated.View
                style={{
                  backgroundColor: "#F6F6F6",
                  height: 3,
                  width: Dimensions.get("screen").width,
                  // paddingVertical: 5,
                }}
              />
            </Animated.View>
          </Animated.View>
          {/* Tabs */}
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            renderTabBar={(props) => (
              <Animated.View
                style={{
                  // top: 0,
                  zIndex: 1,
                  position: "absolute",
                  // paddingHorizontal: 15,
                  transform: [{ translateY: tops }],
                  width: "100%",
                }}
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
                          { opacity: focused ? 1 : 0.7 },
                        ]}
                      >
                        {route.title}
                      </Text>
                    );
                  }}
                  indicatorStyle={styles.indicator}
                />
              </Animated.View>
            )}
          />
        </View>
      )}

      {/* BottomButton */}
      <BottomButton routed={index} props={props} data={data?.destinationById} />

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
            <Ripple
              onPress={() => setModalTime(false)}
              style={{
                paddingVertical: 10,
                width: 30,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Xhitam height={15} width={15} />
            </Ripple>
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
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 10,
            }}
          >
            <Text size="title" type="bold">
              Information
            </Text>
            <Ripple
              onPress={() => setModalSosial(false)}
              style={{
                paddingVertical: 10,
                width: 30,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Xhitam height={15} width={15} />
            </Ripple>
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
