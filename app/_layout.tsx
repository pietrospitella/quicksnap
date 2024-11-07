import { useFonts } from "@/hooks/useFont"
import { Stack } from "expo-router"
import { useCallback, useEffect, useState } from "react"
import * as SplashScreen from "expo-splash-screen"
import { useThemeColor } from "@/hooks/useThemeColor"
import { useColorScheme } from "@/hooks/useColorScheme.web"
import { View } from "react-native"
import LottieView from "lottie-react-native"

SplashScreen.preventAutoHideAsync()

function App() {
  const [appIsReady, setAppIsReady] = useState(false)

  useEffect(() => {
    async function prepare() {
      try {
        await useFonts()
        // await useColorScheme()
        // await useThemeColor()

        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!

        // await new Promise(resolve => setTimeout(resolve, 2000))
      } catch (e) {
        console.warn(e)
      } finally {
        setAppIsReady(true)
      }
    }

    prepare()
  }, [])

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync()
    }
  }, [appIsReady])

  if (!appIsReady) {
    return null
  }

  return (
    <View onLayout={onLayoutRootView} style={{ height: "100%" }}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "QuickSnap",
            headerTitleStyle: { fontFamily: "CircularStd" }
          }}
        />
        <Stack.Screen
          name="edit"
          options={{
            title: "Edit",
            headerTitleStyle: { fontFamily: "CircularStd" }
          }}
        />
      </Stack>
    </View>
  )
}

function SplashScreenView() {
  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <LottieView
        source={require("../assets/camera.json")}
        autoPlay
        loop
        style={{
          width: 200,
          height: 200,
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
        webStyle={{
          width: 200,
          height: 200,
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      />
    </View>
  )
}

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false)
  useEffect(() => {
    setTimeout(() => {
      setIsReady(true)
    }, 2000)
  }, [isReady])
  return (
    <View style={{ height: "100%", flex: 1 }}>
      {!isReady ? <SplashScreenView /> : <App />}
    </View>
  )
}
