import React, { useState } from "react";
import { Dimensions, View, Image, ScrollView } from "react-native";
import { Text, Button, Truncate } from "../../../component";
import {
	activity_unesco4,
	activity_unesco6,
	activity_unesco7,
} from "../../../assets/png";
import FacilityModal from "./FacilityModal";

export default function Facilities({ data }) {
	const [modalFacility, setModalFacility] = useState(false);

	return (
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
					<Truncate text={data?.description} length={100} />
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
					<Truncate text={data?.description} length={100} />
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
					<Truncate text={data?.description} length={100} />
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

			{/* Modal Facility */}
			<FacilityModal
				setModalFacility={(e) => setModalFacility(e)}
				modals={modalFacility}
				data={data?.destinationById}
			/>
		</ScrollView>
	);
}
