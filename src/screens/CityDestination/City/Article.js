import React, { useEffect } from "react";
import { View, Image, Dimensions, ScrollView } from "react-native";
import { default_image } from "../../../assets/png";
import { useTranslation } from "react-i18next";
import { Text, FunImage } from "../../../component";

const dimensions = Dimensions.get("screen");

export default function ArticleView({ props, data }) {
	const { t, i18n } = useTranslation();
	console.log("Article", data);

	return (
		<View style={{ padding: 20 }}>
			{data && data.content.length ? (
				data.content.map((i, index) => {
					console.log("item", i);
					return (
						<View key={index}>
							{i.type === "image" ? (
								<View style={{ marginVertical: 10 }}>
									{i.title ? (
										<Text size="label" type="bold">
											{i.title}
										</Text>
									) : null}

									<View
										style={{
											alignItems: "center",
										}}
									>
										<FunImage
											source={i.image ? { uri: i.image } : default_image}
											resizeMode={"cover"}
											style={{
												borderWidth: 0.4,
												borderColor: "#d3d3d3",
												marginTop: 5,
												height: Dimensions.get("screen").width * 0.4,
												width: "100%",
											}}
										/>
									</View>
									<Text
										size="small"
										type="regular"
										style={{
											textAlign: "justify",
											marginTop: 5,
											color: "#464646",
										}}
									>
										{i.text ? i.text : ""}
									</Text>
								</View>
							) : (
								<View style={{ marginVertical: 10 }}>
									{i.title ? (
										<Text
											size="label"
											type="bold"
											style={{
												marginBottom: 5,
												color: "#464646",
											}}
										>
											{i.title}
										</Text>
									) : null}
									<Text
										size="readable"
										type="regular"
										style={{
											marginTop: 5,
											textAlign: "justify",
											color: "#464646",
										}}
									>
										{i.text ? i.text : ""}
									</Text>
								</View>
							)}
						</View>
					);
				})
			) : (
				<View style={{ alignItems: "center" }}>
					<Text
						type="regular"
						size="title"
						style={{
							textAlign: "justify",
							// fontFamily: "Lato-Regular",
							// fontSize: 18,
							color: "#464646",
						}}
					>
						{t("noArticle")}
					</Text>
				</View>
			)}
		</View>
	);
}
