import React from "react";
import { ICONSERVER } from "../../config";
import { SvgUri } from "react-native-svg";

export default function FunIcon({
  icon,
  style = null,
  width = null,
  height = null,
  fill = null,
}) {
  const variant = { i: "icon", g: "icon", w: "weather", f: "flag", m: "map" };
  const url = `${ICONSERVER}${variant[icon.charAt(0)]}/${
    icon.split("-")[1]
  }.svg`;
  // console.log(url);
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
