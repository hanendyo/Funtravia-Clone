import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Index from "../../screens/Destination/DetailDestinationNew/index";

const DestinationStack = createStackNavigator();
export default function DestinationStackNavigation() {
  return (
    <DestinationStack.Navigator>
      <DestinationStack.Screen name="UnescoDetail" component={Index} />
      {/* <DestinationStack.Screen
        name="DetailUnescoDestination"
        component={DetailUnescoDestination}
        options={{
          headerShown: false,
          headerBackTitleVisible: false,

          // headerTintColor: "white",
          // headerBackTitleVisible: false,
        }}
      /> */}
    </DestinationStack.Navigator>
  );
}
