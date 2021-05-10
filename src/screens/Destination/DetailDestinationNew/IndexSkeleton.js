import React from "react";
import { View, Dimensions } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

export default function IndexSkeleton() {
	const { width } = Dimensions.get("screen").width;
	return (
		<SkeletonPlaceholder>
			<View style={{ width: Dimensions.get("screen").width, height: 230 }} />
			<View
				style={{
					paddingHorizontal: 15,
					width: Dimensions.get("screen").width,
					flexDirection: "row",
					marginTop: 10,
					alignSelf: "center",
					justifyContent: "space-between",
				}}
			>
				<View>
					<View
						style={{
							height: 20,
							width: Dimensions.get("screen").width * 0.6,
							borderRadius: 10,
						}}
					/>
					<View style={{ flexDirection: "row", marginTop: 5 }}>
						<View
							style={{
								height: 15,
								width: Dimensions.get("screen").width * 0.2,
								borderRadius: 10,
							}}
						/>
						<View
							style={{
								height: 15,
								width: Dimensions.get("screen").width * 0.1,
								borderRadius: 7,
								marginLeft: 5,
							}}
						/>
						<View
							style={{
								height: 15,
								width: Dimensions.get("screen").width * 0.15,
								borderRadius: 7,
								marginLeft: 5,
							}}
						/>
					</View>
				</View>
				<View style={{ flexDirection: "row" }}>
					<View
						style={{
							height: 30,
							width: 30,
							borderRadius: 15,
						}}
					/>
					<View
						style={{
							marginLeft: 5,
							height: 30,
							width: 30,
							borderRadius: 15,
						}}
					/>
				</View>
			</View>
			<View
				style={{
					width: Dimensions.get("screen").width,
					paddingHorizontal: 15,
					flexDirection: "row",
					marginTop: 5,
				}}
			>
				<View
					style={{
						height: 30,
						width: Dimensions.get("screen").width * 0.2,
						borderRadius: 5,
					}}
				/>
				<View
					style={{
						height: 30,
						width: Dimensions.get("screen").width * 0.3,
						marginLeft: 5,
						borderRadius: 5,
					}}
				/>
			</View>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					width: Dimensions.get("screen").width,
					paddingHorizontal: 15,
					marginTop: 10,
				}}
			>
				<View style={{ flexDirection: "row" }}>
					<View style={{ height: 20, width: 20, borderRadius: 10 }} />
					<View
						style={{
							height: 20,
							width: 200,
							borderRadius: 10,
							marginLeft: 10,
						}}
					/>
				</View>
				<View style={{ height: 20, width: 40, borderRadius: 10 }} />
			</View>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					width: Dimensions.get("screen").width,
					paddingHorizontal: 15,
					marginTop: 20,
				}}
			>
				<View style={{ flexDirection: "row" }}>
					<View style={{ height: 20, width: 20, borderRadius: 10 }} />
					<View
						style={{
							height: 20,
							width: 200,
							borderRadius: 10,
							marginLeft: 10,
						}}
					/>
				</View>
				<View style={{ height: 20, width: 40, borderRadius: 10 }} />
			</View>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					width: Dimensions.get("screen").width,
					paddingHorizontal: 15,
					marginTop: 20,
				}}
			>
				<View style={{ flexDirection: "row" }}>
					<View style={{ height: 20, width: 20, borderRadius: 10 }} />
					<View
						style={{
							height: 20,
							width: 200,
							borderRadius: 10,
							marginLeft: 10,
						}}
					/>
				</View>
				<View style={{ height: 20, width: 40, borderRadius: 10 }} />
			</View>
			<View
				style={{
					width: Dimensions.get("screen").width,
					paddingHorizontal: 15,
					justifyContent: "space-around",
					flexDirection: "row",
					marginTop: 10,
					paddingVertical: 10,
					borderBottomWidth: 1,
					borderTopWidth: 1,
					borderTopColor: "#F1F1F1",
					borderBottomColor: "#F1F1F1",
				}}
			>
				<View
					style={{
						height: 30,
						borderRadius: 20,
						width: Dimensions.get("screen").width * 0.3,
					}}
				/>
				<View
					style={{
						height: 30,
						borderRadius: 20,
						width: Dimensions.get("screen").width * 0.3,
					}}
				/>
			</View>
			<View
				style={{
					paddingHorizontal: 15,
					width: Dimensions.get("screen").width,
					marginTop: 5,
				}}
			>
				<View style={{ height: 15, borderRadius: 5, width: "100%" }} />
				<View
					style={{ height: 15, borderRadius: 5, width: "100%", marginTop: 5 }}
				/>
				<View
					style={{ height: 15, borderRadius: 5, width: "100%", marginTop: 5 }}
				/>
				<View
					style={{ height: 15, borderRadius: 5, width: "30%", marginTop: 5 }}
				/>
			</View>
			<View
				style={{
					paddingHorizontal: 15,
					width: width,
					alignItems: "center",
					marginTop: 20,
				}}
			>
				<View style={{ height: 20, width: 80, borderRadius: 10 }} />
			</View>
			<View style={{ width: width, paddingHorizontal: 15, marginTop: 10 }}>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<View style={{ width: 60, height: 60, borderRadius: 30 }} />
					<View style={{ width: 60, height: 60, borderRadius: 30 }} />
					<View style={{ width: 60, height: 60, borderRadius: 30 }} />
					<View style={{ width: 60, height: 60, borderRadius: 30 }} />
				</View>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
						marginTop: 5,
					}}
				>
					<View style={{ width: 60, height: 15, borderRadius: 5 }} />
					<View style={{ width: 60, height: 15, borderRadius: 5 }} />
					<View style={{ width: 60, height: 15, borderRadius: 5 }} />
					<View style={{ width: 60, height: 15, borderRadius: 5 }} />
				</View>
			</View>
			<View
				style={{
					paddingHorizontal: 15,
					width: width,
					alignItems: "center",
					marginTop: 20,
				}}
			>
				<View style={{ height: 20, width: 80, borderRadius: 10 }} />
			</View>
			<View style={{ width: width, paddingHorizontal: 15, marginTop: 10 }}>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<View style={{ width: 60, height: 60, borderRadius: 30 }} />
					<View style={{ width: 60, height: 60, borderRadius: 30 }} />
					<View style={{ width: 60, height: 60, borderRadius: 30 }} />
					<View style={{ width: 60, height: 60, borderRadius: 30 }} />
				</View>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
						marginTop: 5,
					}}
				>
					<View style={{ width: 60, height: 15, borderRadius: 5 }} />
					<View style={{ width: 60, height: 15, borderRadius: 5 }} />
					<View style={{ width: 60, height: 15, borderRadius: 5 }} />
					<View style={{ width: 60, height: 15, borderRadius: 5 }} />
				</View>
			</View>
		</SkeletonPlaceholder>
	);
}
