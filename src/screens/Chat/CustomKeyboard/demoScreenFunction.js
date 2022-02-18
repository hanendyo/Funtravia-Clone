import React, { useState } from "react";
import { ScrollView, StyleSheet, TextInput } from "react-native";
import {
  Keyboard,
  Text,
  View,
  Colors,
  Spacings,
  Constants,
  Typography,
  Button,
  Switch,
  Assets,
} from "react-native-ui-lib";
import { Pressable } from "react-native";
import _ from "lodash";
import "./demoKeyboards";

const KeyboardAccessoryView = Keyboard.KeyboardAccessoryView;
const KeyboardUtils = Keyboard.KeyboardUtils;
const KeyboardRegistry = Keyboard.KeyboardRegistry;
const TrackInteractive = true;

const keyboards = [
  {
    id: "unicorn.ImagesKeyboard",
    icon: "",
  },
  {
    id: "unicorn.CustomKeyboard",
    icon: "",
  },
];

export default function Room({ navigation, route }) {
  const [message, setMessage] = useState([]);
  const [customKeyboard, SetcustomKeyboard] = useState({
    component: undefined,
    initialProps: undefined,
  });

  const [receivedKeyboardData, SetreceivedKeyboardData] = useState(undefined);
  const [useSafeArea, SetuseSafeArea] = useState(true);
  const [keyboardOpenState, SetkeyboardOpenState] = useState(false);
  const onKeyboardItemSelected = (keyboardId, params) => {
    const receivedKeyboardData = `onItemSelected from "${keyboardId}"\nreceived params: ${JSON.stringify(
      params
    )}`;
    SetreceivedKeyboardData({ receivedKeyboardData });
  };

  const onKeyboardResigned = () => {
    resetKeyboardView();
  };

  const isCustomKeyboardOpen = () => {
    // const { keyboardOpenState, customKeyboard } = this.state;
    let tempcustomKeyboard = { ...customKeyboard };
    return keyboardOpenState && !_.isEmpty(tempcustomKeyboard);
  };

  const resetKeyboardView = () => {
    SetcustomKeyboard({});
  };

  const dismissKeyboard = () => {
    KeyboardUtils.dismiss();
  };

  const toggleUseSafeArea = () => {
    // const { useSafeArea } = this.state;
    SetuseSafeArea(!useSafeArea);

    if (isCustomKeyboardOpen()) {
      dismissKeyboard();
      showLastKeyboard();
    }
  };

  const showLastKeyboard = () => {
    SetcustomKeyboard({});
    setTimeout(() => {
      SetkeyboardOpenState(true);
      SetcustomKeyboard({});
    }, 500);
  };

  const showKeyboardView = (component, title) => {
    SetkeyboardOpenState(true);
    SetcustomKeyboard({
      component,
      initialProps: { title },
    });
  };

  const onHeightChanged = (keyboardAccessoryViewHeight) => {
    if (Platform.OS == "ios") {
      // this.setState({ keyboardAccessoryViewHeight });
    }
  };

  const renderKeyboardAccessoryViewContent = () => {
    return (
      <View style={styles.keyboardContainer}>
        <View>
          <TextInput
            value={message}
            multiline
            placeholder="Type a message"
            onChangeText={(text) => setChat(text)}
            underlineColorAndroid="transparent"
            onFocus={resetKeyboardView()}
          />
          <Button onPress={KeyboardUtils.dismiss} />
        </View>
        <View>
          <View>
            {keyboards.map((keyboard) => (
              <Button
                key={keyboard.id}
                onPress={() => showKeyboardView(keyboard.id)}
              />
            ))}
          </View>

          <Button onPress={resetKeyboardView()} />
        </View>
      </View>
    );
  };

  const requestShowKeyboard = () => {
    KeyboardRegistry.requestShowKeyboard("unicorn.ImagesKeyboard");
  };

  const onRequestShowKeyboard = (componentID) => {
    SetcustomKeyboard({
      component: componentID,
      initialProps: { title: "Keyboard 1 opened by button" },
    });
  };

  const safeAreaSwitchToggle = () => {
    if (Platform.OS !== "ios") {
      return;
    }
    const { useSafeArea } = this.state;
    return (
      <View>
        <View style={styles.separatorLine} />
        <View>
          <Text>Safe Area Enabled:</Text>
          <Switch value={useSafeArea} onValueChange={toggleUseSafeArea} />
        </View>
        <View style={styles.separatorLine} />
      </View>
    );
  };
  return (
    <View flex bg-dark80>
      <Text h2 marginT-page marginL-page>
        KeyboardAccessoryView + KeyboardRegistry
      </Text>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardDismissMode={TrackInteractive ? "interactive" : "none"}
      >
        <Text text40 dark10 marginV-20 center>
          {message}
        </Text>
        <Text testID={"demo-message"}>{receivedKeyboardData}</Text>
        <Button
          label={"Open Images Keyboard"}
          link
          onPress={requestShowKeyboard}
          style={styles.button}
        />
        {safeAreaSwitchToggle()}
      </ScrollView>

      <KeyboardAccessoryView
        renderContent={() => {
          return (
            <View style={styles.keyboardContainer}>
              <View>
                <TextInput
                  value={message}
                  multiline
                  placeholder="Type a message"
                  onChangeText={(text) => setChat(text)}
                  underlineColorAndroid="transparent"
                  onFocus={() => resetKeyboardView()}
                />
                <Button onPress={() => KeyboardUtils.dismiss} />
              </View>
              <View>
                <View>
                  {keyboards.map((keyboard) => (
                    <Button
                      key={keyboard.id}
                      onPress={() => showKeyboardView(keyboard.id)}
                    />
                  ))}
                </View>

                <Button onPress={() => resetKeyboardView()} />
              </View>
            </View>
          );
        }}
        onHeightChanged={() => onHeightChanged()}
        trackInteractive={TrackInteractive}
        kbInputRef={message}
        kbComponent={customKeyboard.component}
        kbInitialProps={customKeyboard.initialProps}
        onItemSelected={() => onKeyboardItemSelected}
        onKeyboardResigned={() => onKeyboardResigned}
        revealKeyboardInteractive
        onRequestShowKeyboard={() => onRequestShowKeyboard}
        useSafeArea={useSafeArea}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: Spacings.s5,
    flex: 1,
    justifyContent: "center",
  },
  textInput: {
    flex: 1,
    paddingVertical: Spacings.s2,
    paddingHorizontal: Spacings.s3,
    ...Typography.text70,
    lineHeight: undefined,
    backgroundColor: Colors.grey60,
    borderRadius: 8,
  },
  button: {
    padding: Spacings.s2,
  },
  keyboardContainer: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.dark60,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.dark80,
  },
});
