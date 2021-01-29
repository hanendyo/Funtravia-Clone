import React from "react";
export default function Capital({ text }) {
  if (text) {
    return text
      .toString()
      .toLowerCase()
      .replace(/\b[a-z]/g, function (letter) {
        return letter.toUpperCase();
      });
  } else {
    return text;
  }
}
