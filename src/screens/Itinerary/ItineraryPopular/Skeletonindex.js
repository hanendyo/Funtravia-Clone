import { Row } from "native-base";
import React from "react";
import { View, Dimensions } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

export default function IndexSkeleton() {
	const { width } = Dimensions.get("screen").width;
	return (
		<SkeletonPlaceholder>
			<View style={{ flexDirection: "row", marginLeft: 15 }}>
				<View
					style={{
						width: Dimensions.get("screen").width * 0.6,
						height: 130,
						borderRadius: 10,
						marginTop: 10,
					}}
				/>
				<View
					style={{
						width: Dimensions.get("screen").width * 0.5,
						height: 130,
						borderRadius: 10,
						marginTop: 10,
						marginLeft: 10,
					}}
				/>
			</View>
			<View
				style={{
					width: Dimensions.get("screen").width,
					height: 5,
					marginTop: 20,
				}}
			></View>
			<View
				style={{
					marginHorizontal: 15,
					width: Dimensions.get("screen").width * 0.4,
					height: 20,
					borderRadius: 5,
					marginTop: 10,
				}}
			></View>
			<View style={{ marginHorizontal: 15, flexDirection: "row" }}>
				<View
					style={{
						width: Dimensions.get("screen").width * 0.25,
						height: 30,
						borderRadius: 5,
						marginTop: 10,
					}}
				></View>
				<View
					style={{
						width: Dimensions.get("screen").width * 0.25,
						height: 30,
						borderRadius: 5,
						marginTop: 10,
						marginLeft: 5,
					}}
				></View>
				<View
					style={{
						width: Dimensions.get("screen").width * 0.25,
						height: 30,
						borderRadius: 5,
						marginTop: 10,
						marginLeft: 5,
					}}
				></View>
				<View
					style={{
						width: Dimensions.get("screen").width * 0.25,
						height: 30,
						borderRadius: 5,
						marginTop: 10,
						marginLeft: 5,
					}}
				></View>
				<View
					style={{
						width: Dimensions.get("screen").width * 0.25,
						height: 30,
						borderRadius: 5,
						marginTop: 10,
						marginLeft: 5,
					}}
				></View>
			</View>
			<View
				style={{
					width: Dimensions.get("screen").width,
					height: 2,
					borderRadius: 5,
					marginTop: 10,
				}}
			></View>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-around",
					marginTop: 20,
					width: width,
					paddingHorizontal: 15,
				}}
			>
				<View
					style={{
						width: Dimensions.get("screen").width * 0.2,
						height: 20,
						borderRadius: 10,
					}}
				/>
				<View
					style={{
						width: Dimensions.get("screen").width * 0.2,
						height: 20,
						borderRadius: 10,
					}}
				/>
				<View
					style={{
						width: Dimensions.get("screen").width * 0.2,
						height: 20,
						borderRadius: 10,
					}}
				/>
			</View>
			<View
				style={{
					marginTop: 10,
					width: width,
					height: 130,
					marginHorizontal: 15,
					borderRadius: 5,
					paddingVertical: 5,
				}}
			>
				<View
					style={{
						borderRadius: 5,
					}}
				>
					<View style={{ flexDirection: "row" }}>
						<View
							style={{
								width: Dimensions.get("screen").width * 0.3,
								height: 100,
								borderTopLeftRadius: 10,
							}}
						></View>
						<View style={{ marginLeft: 5, justifyContent: "space-between" }}>
							<View
								style={{
									height: 20,
									width: Dimensions.get("screen").width * 0.3,
									borderRadius: 5,
								}}
							></View>
							<View
								style={{
									marginTop: 10,
									height: 15,
									width: Dimensions.get("screen").width * 0.4,
									borderRadius: 5,
								}}
							></View>
							<View
								style={{
									marginTop: 5,
									height: 10,
									width: Dimensions.get("screen").width * 0.3,
									borderRadius: 5,
								}}
							></View>
							<View
								style={{
									marginTop: 10,
									height: 15,
									width: Dimensions.get("screen").width * 0.4,
									borderRadius: 5,
								}}
							></View>
						</View>
					</View>
				</View>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-around",
						marginTop: 5,
					}}
				>
					<View
						style={{
							height: 20,
							width: Dimensions.get("screen").width * 0.3,
							borderRadius: 5,
						}}
					></View>
					<View
						style={{
							height: 20,
							width: Dimensions.get("screen").width * 0.3,
							borderRadius: 5,
						}}
					></View>
				</View>
			</View>
			<View
				style={{
					marginTop: 10,
					width: width,
					height: 130,
					marginHorizontal: 15,
					borderRadius: 5,
					paddingVertical: 5,
				}}
			>
				<View
					style={{
						borderRadius: 5,
					}}
				>
					<View style={{ flexDirection: "row" }}>
						<View
							style={{
								width: Dimensions.get("screen").width * 0.3,
								height: 100,
								borderTopLeftRadius: 10,
							}}
						></View>
						<View style={{ marginLeft: 5, justifyContent: "space-between" }}>
							<View
								style={{
									height: 20,
									width: Dimensions.get("screen").width * 0.3,
									borderRadius: 5,
								}}
							></View>
							<View
								style={{
									marginTop: 10,
									height: 15,
									width: Dimensions.get("screen").width * 0.4,
									borderRadius: 5,
								}}
							></View>
							<View
								style={{
									marginTop: 5,
									height: 10,
									width: Dimensions.get("screen").width * 0.3,
									borderRadius: 5,
								}}
							></View>
							<View
								style={{
									marginTop: 10,
									height: 15,
									width: Dimensions.get("screen").width * 0.4,
									borderRadius: 5,
								}}
							></View>
						</View>
					</View>
				</View>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-around",
						marginTop: 5,
					}}
				>
					<View
						style={{
							height: 20,
							width: Dimensions.get("screen").width * 0.3,
							borderRadius: 5,
						}}
					></View>
					<View
						style={{
							height: 20,
							width: Dimensions.get("screen").width * 0.3,
							borderRadius: 5,
						}}
					></View>
				</View>
			</View>
			<View
				style={{
					marginTop: 10,
					width: width,
					height: 130,
					marginHorizontal: 15,
					borderRadius: 5,
					paddingVertical: 5,
				}}
			>
				<View
					style={{
						borderRadius: 5,
					}}
				>
					<View style={{ flexDirection: "row" }}>
						<View
							style={{
								width: Dimensions.get("screen").width * 0.3,
								height: 100,
								borderTopLeftRadius: 10,
							}}
						></View>
						<View style={{ marginLeft: 5, justifyContent: "space-between" }}>
							<View
								style={{
									height: 20,
									width: Dimensions.get("screen").width * 0.3,
									borderRadius: 5,
								}}
							></View>
							<View
								style={{
									marginTop: 10,
									height: 15,
									width: Dimensions.get("screen").width * 0.4,
									borderRadius: 5,
								}}
							></View>
							<View
								style={{
									marginTop: 5,
									height: 10,
									width: Dimensions.get("screen").width * 0.3,
									borderRadius: 5,
								}}
							></View>
							<View
								style={{
									marginTop: 10,
									height: 15,
									width: Dimensions.get("screen").width * 0.4,
									borderRadius: 5,
								}}
							></View>
						</View>
					</View>
				</View>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-around",
						marginTop: 5,
					}}
				>
					<View
						style={{
							height: 20,
							width: Dimensions.get("screen").width * 0.3,
							borderRadius: 5,
						}}
					></View>
					<View
						style={{
							height: 20,
							width: Dimensions.get("screen").width * 0.3,
							borderRadius: 5,
						}}
					></View>
				</View>
			</View>
		</SkeletonPlaceholder>
	);
}
