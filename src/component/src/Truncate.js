import React from "react";
import runes from "runes";
export default function Truncate({ text, length = null, ending = null }) {
	if (text) {
		if (length == null) {
			length = 15;
		}
		if (ending == null) {
			ending = "...";
		}
		if (text.length > length) {
			return runes.substr(text, 0, length - ending.length) + ending;
		} else {
			return text;
		}
	} else {
		return text;
	}
}
