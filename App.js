import React from "react";
import { Provider } from "react-redux";
import { StyleSheet, SafeAreaView } from "react-native";
import Photos from "./src/screens/Photos";
import store from "./src/redux/store";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Provider store={store}>
        <Photos />
      </Provider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
