import { Ionicons } from "@expo/vector-icons"
import {
  CameraView,
  CameraType,
  useCameraPermissions,
  CameraCapturedPicture,
  CameraViewRef
} from "expo-camera"
import { RefObject, useEffect, useRef, useState } from "react"
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Platform
} from "react-native"
import * as MediaLibrary from "expo-media-library"

export default function Index() {
  let cameraRef = useRef() as RefObject<CameraViewRef> | undefined
  const [isReady, setIsReady] = useState<boolean>(false)
  const [facing, setFacing] = useState<CameraType>("back")
  const [capturedPhoto, setCapturedPhoto] = useState<CameraCapturedPicture>()
  const [permission, requestPermission] = useCameraPermissions()
  const [albums, setAlbums] = useState<MediaLibrary.Album[]>([])
  const [permissionResponse, requestAlbumPermission] =
    MediaLibrary.usePermissions()
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [fullScreenImage, setFullScreenImage] = useState<string | undefined>(
    undefined
  )

  if (!permission) {
    return <View />
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    )
  }

  function toggleCameraFacing() {
    setFacing((current) => {
      return current === "back" ? "front" : "back"
    })
  }

  function openPhoto() {
    if (capturedPhoto) {
      setFullScreenImage(capturedPhoto.uri)
      setIsModalVisible(true)
    }
  }

  async function takePhoto() {
    if (isReady) {
      const camera = cameraRef?.current
      if (camera) {
        const photo = await camera.takePicture({
          base64: true,
          quality: 0.3
        })
        if (photo && photo.uri) {
          setCapturedPhoto(photo)
          if (Platform.OS !== "web") {
            if (permissionResponse!.status !== "granted") {
              await MediaLibrary.requestPermissionsAsync()
            }
            await MediaLibrary.saveToLibraryAsync(photo.uri)
            console.log(albums)
          }
        }
      }
    }
  }

  async function getAlbums() {
    if (permissionResponse!.status !== "granted") {
      await MediaLibrary.requestPermissionsAsync()
    }
    const fetchedAlbums = await MediaLibrary.getAlbumsAsync({
      includeSmartAlbums: true
    })
    setAlbums(fetchedAlbums)
  }

  function AlbumEntry({ album }: { album: MediaLibrary.Album }) {
    const [assets, setAssets] = useState<MediaLibrary.Asset[]>([])

    useEffect(() => {
      async function getAlbumAssets() {
        const albumAssets = await MediaLibrary.getAssetsAsync({ album })
        setAssets(albumAssets.assets)
      }
      getAlbumAssets()
    }, [album])
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={(el) => (cameraRef = el?._cameraRef)}
        facing={facing}
        mirror={false}
        onCameraReady={() => setIsReady(true)}
        style={styles.camera}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.previewImage} onPress={openPhoto}>
            <Image
              source={{ uri: capturedPhoto?.uri }}
              style={styles.previewImage}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { padding: 0 }]}
            onPress={takePhoto}
          >
            <Ionicons name="radio-button-on" size={64} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { position: "absolute", right: 0 }]}
            onPress={toggleCameraFacing}
          >
            <Ionicons name="sync" size={32} color="white" />
          </TouchableOpacity>
        </View>
      </CameraView>

      <Modal
        visible={isModalVisible}
        transparent={false}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => setIsModalVisible(false)}
        >
          <Image
            source={{ uri: fullScreenImage }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </Modal>
    </View>
  )
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
    // alignSelf: 'flex-end',
    // alignItems: 'center',
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
