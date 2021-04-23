import React, { useState, useMemo, useEffect } from "react";
import { Image as RNIMAGE, StyleSheet } from "react-native";
import PropTypes from "prop-types";

function Image({ style, uri, ...restProps }) {
	const flattenedStyles = useMemo(() => StyleSheet.flatten(style), [style]);
	if (
		typeof flattenedStyles.width !== "number" &&
		typeof flattenedStyles.height !== "number"
	) {
		throw new Error("Image requires either width or height");
	}

	const [size, setSize] = useState({
		width: flattenedStyles.width,
		height: flattenedStyles.height,
	});

	useEffect(() => {
		if (!flattenedStyles.width || !flattenedStyles.height) {
			Image.getSize(uri, (w, h) => {
				const ratio = w / h;
				setSize({
					width: flattenedStyles.width || ratio * flattenedStyles.height || 0,
					height: flattenedStyles.height || flattenedStyles.width / ratio || 0,
				});
			});
		}
	}, [uri, flattenedStyles.width, flattenedStyles.height]);

	return (
		<RNIMAGE source={{ uri, caches }} style={[style, size]} {...restProps} />
	);
}

Image.propTypes = {
	uri: PropTypes.string.isRequired,
	style: PropTypes.object,
};

Image.defaultProps = {
	style: {},
};

export default Image;
