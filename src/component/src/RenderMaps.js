import React from "react";
import { ICONSERVER } from "../../config";
import { SvgUri } from "react-native-svg";

export default function RenderMaps({
  icon,
  style = null,
  width = null,
  height = null,
  fill = null,
}) {
  const variant = { mn: "map_negara", mk: "map_kota", w: "weather" };

  const url = `${ICONSERVER}${variant[icon.substring(0, 2)]}/${
    icon.split("-")[1]
  }.svg`;

  return (
    <SvgUri
      style={style ? style : null}
      uri={url}
      width={width ? width : 50}
      height={height ? height : 50}
      fill={fill ? fill : "#000"}
    />
  );
}
