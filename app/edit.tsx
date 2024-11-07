import { StyleSheet, View } from "react-native"

export default function Edit() {
  return <View></View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
  },
  message: {
    textAlign: "center",
    paddingBottom: 10
  },
  camera: {
    flex: 1
  },
  buttonContainer: {
    height: "80%",
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    backgroundColor: "transparent",
    margin: 64
  },
  button: {
    borderRadius: 100,
    padding: 8,
    backgroundColor: "#000",
    width: 64,
    height: 64,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "CircularStd",
    color: "white"
  },
  previewImage: {
    position: "absolute",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#fff",
    borderRadius: 12,
    left: 0,
    width: 60,
    height: 60,
    backgroundColor: "#000"
  }
})
