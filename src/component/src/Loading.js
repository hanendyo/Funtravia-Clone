import React, { useState, useEffect, useCallback } from "react";
import { View, Image } from "react-native";
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
            width: 100,
            height: 100,
            borderRadius: 5,
          }}
        >
          <Image
            // source={loading ? loading : null}
            style={{ alignSelf: "center", width: 70, height: 70 }}
          />
        </View>
      </View>
    </Modal>
  );
}
