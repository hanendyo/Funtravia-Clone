import React, { useState, useEffect, useCallback } from "react";
import { View, Image, ActivityIndicator } from "react-native";
import Modal from "react-native-modal";

// import { loading } from "../../assets/Gif";

export default function Loading({ show }) {
  let [status, setStatus] = useState(false);
  return (
    <Modal animationOut="fadeOut" isVisible={show}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
            width: 75,
            height: 75,
            borderRadius: 5,
          }}
        >
          <ActivityIndicator animating={true} size="large" color="#209fae" />
        </View>
      </View>
    </Modal>
  );
}
