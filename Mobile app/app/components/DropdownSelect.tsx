import { useState } from "react";
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from "react-native";

export default function DropdownSelect({ label, value, setValue, options }: any) {
  const [open, setOpen] = useState(false);

  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={styles.label}>{label}</Text>

      <Pressable style={styles.input} onPress={() => setOpen(true)}>
        <Text>{value || "Select..."}</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <FlatList
              data={options}
              renderItem={({ item }) => (
                <Pressable onPress={() => { setValue(item); setOpen(false); }}>
                  <Text style={styles.option}>{item}</Text>
                </Pressable>
              )}
            />
            <Pressable onPress={() => setOpen(false)}>
              <Text style={{ textAlign: "center" }}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { marginBottom: 6, fontWeight: "500" },
  input: { borderWidth: 1, padding: 12, borderRadius: 10 },
  modalBg: { flex: 1, justifyContent: "center", backgroundColor: "#0007" },
  modalCard: { backgroundColor: "#fff", margin: 30, padding: 16, borderRadius: 12 },
  option: { padding: 12, fontSize: 16 },
});
