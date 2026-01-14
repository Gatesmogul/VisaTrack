import { FlatList, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import CountryFlag from "react-native-country-flag";


type Country = {
  name: string;
  code: string;
};

const COUNTRIES: Country[] = [
  { name: "Nigeria", code: "NG" },
  { name: "United States", code: "US" },
  { name: "United Kingdom", code: "GB" },
  { name: "Canada", code: "CA" },
  { name: "France", code: "FR" },
];

export function CountryPickerModal({
  visible,
  onClose,
  onSelect,
}: {
  visible: boolean;
  onClose: () => void;
  onSelect: (country: Country) => void;
}) {
  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <Text style={styles.title}>Select Country</Text>

        <FlatList
          data={COUNTRIES}
          keyExtractor={(item) => item.code}
          renderItem={({ item }) => (
            <Pressable
              style={styles.row}
              onPress={() => {
                onSelect(item);
                onClose();
              }}
            >
              <CountryFlag isoCode={item.code} size={24} />
              <Text style={styles.name}>{item.name}</Text>
            </Pressable>
          )}
        />

        <Pressable onPress={onClose}>
          <Text style={styles.close}>Close</Text>
        </Pressable>
      </View>
    </Modal>
  );
}



 const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFF",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    gap: 12,
    borderBottomWidth: 1,
    borderColor: "#EEE",
  },
  name: {
    fontSize: 15,
    color: "#111827",
  },
  close: {
    marginTop: 20,
    color: "#2563EB",
    fontWeight: "600",
    textAlign: "center",
  },
});
