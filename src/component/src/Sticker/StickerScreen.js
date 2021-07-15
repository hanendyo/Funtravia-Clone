import React, { useEffect, useRef, useState } from "react";
import { View, Dimensions, Text, Pressable } from "react-native";
import * as RNFS from "react-native-fs";
const { width, height } = Dimensions.get("screen");
import AnimatedPlayer from "react-native-animated-webp";
export default function StickerScreen({ submitSticker }) {
    const playerRef = useRef(null);
    const [sticker, setSticker] = useState([]);
    let path = `${RNFS.DocumentDirectoryPath}/sticker/S001CATS`;
    let extension = Platform.OS === "android" ? "file://" : "";
    let size = width / 5 - 5;
    console.log(size);
    const getStickerLocal = () => {
        console.log("getstiker");
        RNFS.mkdir(path);
        RNFS.downloadFile({
            fromUrl: "https://fa12.funtravia.com/sticker/S001CAT/001.webp",
            toFile: path + "/001.webp",
        });
        RNFS.readDir(path).then((result) => {
            setSticker(result);
        });
    };

    useEffect(() => {
        getStickerLocal();
        console.log(`${extension}${path}/001.webp`);
    }, []);

    return (
        <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap" }}>
            {/* <Text>test</Text> */}
            <Pressable
                onPress={() => {
                    submitSticker(
                        `https://fa12.funtravia.com/sticker/S001CAT/001.webp`
                    );
                }}
            >
                <AnimatedPlayer
                    ref={playerRef}
                    thumbnailSource={
                        "https://e7.pngegg.com/pngimages/3/737/png-clipart-sticker-graphics-label-decal-sticker-label.png"
                    }
                    animatedSource={{
                        uri: `${extension}${path}/001.webp`,
                    }}
                    autoplay={true}
                    loop={true}
                    style={{ width: size, height: size }}
                />
            </Pressable>
            {/* <AnimatedPlayer
                ref={playerRef}
                thumbnailSource={
                    "https://e7.pngegg.com/pngimages/3/737/png-clipart-sticker-graphics-label-decal-sticker-label.png"
                }
                animatedSource={{
                    uri: `${extension}${path}/001.webp`,
                }}
                autoplay={true}
                loop={true}
                style={{ width: size, height: size }}
            /> */}
            {/* <AnimatedPlayer
                ref={playerRef}
                thumbnailSource={
                    "https://e7.pngegg.com/pngimages/3/737/png-clipart-sticker-graphics-label-decal-sticker-label.png"
                }
                animatedSource={{
                    uri: `${extension}${path}/001.webp`,
                }}
                autoplay={true}
                loop={true}
                style={{ width: size, height: size }}
            />
            <AnimatedPlayer
                ref={playerRef}
                thumbnailSource={
                    "https://e7.pngegg.com/pngimages/3/737/png-clipart-sticker-graphics-label-decal-sticker-label.png"
                }
                animatedSource={{
                    uri: `${extension}${path}/001.webp`,
                }}
                autoplay={true}
                loop={true}
                style={{ width: size, height: size }}
            />
            <AnimatedPlayer
                ref={playerRef}
                thumbnailSource={
                    "https://e7.pngegg.com/pngimages/3/737/png-clipart-sticker-graphics-label-decal-sticker-label.png"
                }
                animatedSource={{
                    uri: `${extension}${path}/001.webp`,
                }}
                autoplay={true}
                loop={true}
                style={{ width: size, height: size }}
            />
            <AnimatedPlayer
                ref={playerRef}
                thumbnailSource={
                    "https://e7.pngegg.com/pngimages/3/737/png-clipart-sticker-graphics-label-decal-sticker-label.png"
                }
                animatedSource={{
                    uri: `${extension}${path}/001.webp`,
                }}
                autoplay={true}
                loop={true}
                style={{ width: size, height: size }}
            />
            <AnimatedPlayer
                ref={playerRef}
                thumbnailSource={
                    "https://e7.pngegg.com/pngimages/3/737/png-clipart-sticker-graphics-label-decal-sticker-label.png"
                }
                animatedSource={{
                    uri: `${extension}${path}/001.webp`,
                }}
                autoplay={true}
                loop={true}
                style={{ width: size, height: size }}
            />
            <AnimatedPlayer
                ref={playerRef}
                thumbnailSource={
                    "https://e7.pngegg.com/pngimages/3/737/png-clipart-sticker-graphics-label-decal-sticker-label.png"
                }
                animatedSource={{
                    uri: `${extension}${path}/001.webp`,
                }}
                autoplay={true}
                loop={true}
                style={{ width: size, height: size }}
            />
            <AnimatedPlayer
                ref={playerRef}
                thumbnailSource={
                    "https://e7.pngegg.com/pngimages/3/737/png-clipart-sticker-graphics-label-decal-sticker-label.png"
                }
                animatedSource={{
                    uri: `${extension}${path}/001.webp`,
                }}
                autoplay={true}
                loop={true}
                style={{ width: size, height: size }}
            />
            <AnimatedPlayer
                ref={playerRef}
                thumbnailSource={
                    "https://e7.pngegg.com/pngimages/3/737/png-clipart-sticker-graphics-label-decal-sticker-label.png"
                }
                animatedSource={{
                    uri: `${extension}${path}/001.webp`,
                }}
                autoplay={true}
                loop={true}
                style={{ width: size, height: size }}
            /> */}
        </View>
    );
}
