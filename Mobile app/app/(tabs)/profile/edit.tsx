import { apiFetch } from "@/lib/api";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function EditProfileScreen() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    apiFetch("/users/me").then((data) => {
      setFullName(data.fullName);
      setAvatar(data.avatarUrl);
    });
  }, []);

  // Permission Handler
  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "VisaTrack needs access to your Photos to update your profile picture.",
      );
      return false;
    }
    return true;
  };

  // Choose from library
  const chooseFromLibrary = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }

    setModalVisible(false);
  };

  // Take photo
  const takePhoto = async () => {
    const camPerm = await ImagePicker.requestCameraPermissionsAsync();
    if (!camPerm.granted) {
      Alert.alert(
        "Permission Required",
        "Camera permission is needed to take a new photo.",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }

    setModalVisible(false);
  };

  const deletePhoto = () => {
    setAvatar(null);
    setModalVisible(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("fullName", fullName);

      if (avatar && avatar.startsWith("file")) {
        formData.append("avatar", {
          uri: avatar,
          name: "avatar.jpg",
          type: "image/jpeg",
        } as any);
      }

      await apiFetch("/users/me", {
        method: "PUT",
        body: formData,
      });

      router.back();
    } catch (e) {
      Alert.alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Avatar */}
      <Pressable onPress={() => setModalVisible(true)}>
        <Image
          source={{
            uri: avatar || "https://i.pravatar.cc/150",
          }}
          style={styles.avatar}
        />
        <Text style={styles.changePhoto}>Change Photo</Text>
      </Pressable>

      {/* Input */}
      <TextInput
        style={styles.input}
        value={fullName}
        onChangeText={setFullName}
        placeholder="Full name"
      />

      {/* Save Button */}
      <Pressable style={styles.saveBtn} onPress={handleSave} disabled={saving}>
        <Text style={styles.saveText}>
          {saving ? "Saving..." : "Save Changes"}
        </Text>
      </Pressable>

      {/* Bottom Sheet Modal (Your Screen 2) */}
      <Modal
        transparent
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        />

        <View style={styles.modalBox}>
          <Pressable style={styles.modalItem} onPress={takePhoto}>
            <Text style={styles.modalText}>Take Photo</Text>
          </Pressable>

          <Pressable style={styles.modalItem} onPress={chooseFromLibrary}>
            <Text style={styles.modalText}>Choose from Library</Text>
          </Pressable>

          <Pressable style={styles.modalItemDelete} onPress={deletePhoto}>
            <Text style={styles.modalDeleteText}>Delete Photo</Text>
          </Pressable>

          <Pressable
            style={[styles.modalItem, styles.modalCancel]}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.modalText}>Cancel</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#FFFFFF",
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignSelf: "center",
    marginBottom: 8,
  },
  changePhoto: {
    textAlign: "center",
    color: "#2563EB",
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  saveBtn: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 8,
  },
  saveText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "600",
  },

  // MODAL STYLES
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalBox: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  modalItem: {
    paddingVertical: 16,
    alignItems: "center",
  },
  modalItemDelete: {
    paddingVertical: 16,
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
  },
  modalText: {
    fontSize: 16,
    color: "#2563EB",
  },
  modalDeleteText: {
    fontSize: 16,
    color: "#EF4444",
    fontWeight: "500",
  },
  modalCancel: {
    marginTop: 6,
    paddingVertical: 16,
    backgroundColor: "#F3F4F6",
  },
});
