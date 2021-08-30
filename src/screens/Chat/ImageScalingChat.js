import React, { useState, useMemo, useEffect } from "react";
import { Image, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import {
  Text,
  Button,
  Truncate,
  StatusBar,
  Errors,
  FunImage,
  FunImageAutoSize,
} from "../../component";
function AutoScaleImage({ style, uri, ...restProps }: Props) {
  const flattenedStyles = useMemo(() => StyleSheet.flatten(style), [style]);
  if (
    typeof flattenedStyles.width !== "number" &&
    typeof flattenedStyles.height !== "number"
  ) {
    throw new Error("AutoScaleImage requires either width or height");
  }

  const [size, setSize] = useState({
    width: flattenedStyles.width,
    height: flattenedStyles.height,
  });

  useEffect(() => {
    if (!flattenedStyles.width || !flattenedStyles.height) {
      Image.getSize(uri, (w, h) => {
        const ratio = w / h;
        let wd = flattenedStyles.width || ratio * flattenedStyles.height || 0;
        let hg = flattenedStyles.height || flattenedStyles.width / ratio || 0;
        const L = (2.2 / 3) * wd;
        const P = (5 / 4) * wd;
        if (hg > P) {
          hg = P;
        }
        if (hg < L) {
          hg = L;
        }
        setSize({
          width: wd,
          height: hg,
        });
      });
    }
  }, [uri, flattenedStyles.width, flattenedStyles.height]);

  return <FunImage source={{ uri }} style={[style, size]} {...restProps} />;
}

AutoScaleImage.propTypes = {
  uri: PropTypes.string.isRequired,
  style: PropTypes.object,
};

AutoScaleImage.defaultProps = {
  style: {},
};

export default AutoScaleImage;
