import * as Font from "expo-font"
 
export const useFonts = async () =>
  await Font.loadAsync({
    CircularStd: require('../assets/fonts/CircularStd-Medium.ttf')
})