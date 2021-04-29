import React, { useState } from "react";
import { Dimensions, View, Image, ScrollView } from "react-native";
import { Text, Button, Truncate } from "../../../component";
import { activity_unesco5 } from "../../../assets/png";
import ServiceModal from "./ServiceModal";

export default function index({ data }) {
	const [modalService, setModalService] = useState(false);
	return (
		<ScrollView
			style={{
				flex: 1,
				width: Dimensions.get("screen").width,
				paddingHorizontal: 15,
				backgroundColor: "#fff",
			}}
			showsVerticalScrollIndicator={false}
		>
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
							1
						</Text>
					</View>
					<Text
						size="title"
						type="bold"
						style={{ color: "#209FAE", marginLeft: 15 }}
					>
						Pijat Tradisional
					</Text>
				</View>

				{/* Image*/}
				<Image
					source={activity_unesco5}
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
					onPress={() => setModalService(true)}
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
			{/* Modal Service */}
			<ServiceModal
				setModalService={(e) => setModalService(e)}
				modals={modalService}
				data={data?.destinationById}
			/>
		</ScrollView>
	);
}
