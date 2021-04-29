import React from "react";
import { View, Dimensions, Image, ScrollView } from "react-native";
import Modal from "react-native-modal";
import { Text, StatusBar } from "../../../component";
import { Xhitam } from "../../../assets/svg";
import { activity_unesco4 } from "../../../assets/png";

export default function FacilityModal({ setModalFacility, modals, data }) {
	return (
		<Modal
			onRequestClose={() => {
				setModalFacility(false);
			}}
			animationIn="slideInUp"
			animationOut="slideOutDown"
			isVisible={modals}
			style={{
				alignSelf: "center",
				alignContent: "center",
			}}
		>
			<StatusBar backgroundColor="#14646E" barStyle="light-content" />
			<View
				style={{
					backgroundColor: "#FFF",
					width: Dimensions.get("screen").width,
					height: Dimensions.get("screen").height,
				}}
			>
				<ScrollView style={{ borderWidth: 1, flex: 1, height: 10 }}>
					<View
						style={{
							width: Dimensions.get("screen").width,
							paddingHorizontal: 15,
							flexDirection: "row",
							justifyContent: "space-between",
							marginVertical: 30,
							alignItems: "center",
						}}
					>
						<Text size="title" type="bold" style={{ color: "#209FAE" }}>
							Tolet
						</Text>
						<Xhitam
							height={15}
							width={15}
							onPress={() => {
								setModalFacility(false);
							}}
						/>
					</View>
					<View
						style={{
							height: 200,
							width: Dimensions.get("screen").width,
							paddingHorizontal: 15,
						}}
					>
						<Image
							source={activity_unesco4}
							style={{ width: "100%", height: "100%", borderRadius: 5 }}
						/>
					</View>
					<View
						style={{
							width: Dimensions.get("screen").width,
							paddingHorizontal: 15,
						}}
					>
						<Text size="label" type="regular" style={{ marginTop: 20 }}>
							Lorem Ipsum is simply dummy text of the printing and typesetting
							industry. Lorem Ipsum has been the industry's standard dummy text
							ever since the 1500s, when an unknown printer took a galley of
							Lorem Ipsum is simply dummy text of the printing and typesetting
							industry. Lorem Ipsum has been the industry's standard dummy text
							ever since the 1500s, when an unknown printer took a galley of
						</Text>
					</View>
				</ScrollView>
			</View>
		</Modal>
	);
}
