import { StyleSheet, TextInput } from "react-native";
import { colors } from "../constants/colors";

export default function AppInput(props: any) {
  return (
    <TextInput
      {...props}
      placeholderTextColor={colors.gray}
      style={[styles.input, props.style]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: colors.white,
    marginBottom: 12,
  },
});
