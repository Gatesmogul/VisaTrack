import { useState } from "react";
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from "react-native";

const COUNTRIES = [
  { code: "+1", country: "USA" },
  { code: "+44", country: "UK" },
  { code: "+234", country: "Nigeria" },
];

export default function CountryPicker({ value, setValue }: any) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable style={styles.box} onPress={() => setOpen(true)}>
        <Text>{value}</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="slide">
        <View style={styles.bg}>
          <View style={styles.card}>
            <FlatList
              data={COUNTRIES}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    setValue(item.code);
                    setOpen(false);
                  }}
                >
                  <Text style={styles.option}>{item.code} — {item.country}</Text>
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  bg:{ flex:1, justifyContent:"center", backgroundColor:"#0006" },
  card:{ backgroundColor:"#fff", margin:30, padding:20, borderRadius:12 },
  box:{ borderWidth:1, borderRadius:10, padding:10, minWidth:70, alignItems:"center" },
  option:{ padding:12, fontSize:16 }
});
