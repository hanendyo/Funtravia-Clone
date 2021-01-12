import React from 'react';
export default function Truncate({ text, length = null, ending = null }) {
	if (length == null) {
		length = 15;
	}
	if (ending == null) {
		ending = '...';
	}
	if (text.length > length) {
		return text.substring(0, length - ending.length) + ending;
	} else {
		return text;
	}
}
