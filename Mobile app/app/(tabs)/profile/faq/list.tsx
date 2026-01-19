import { StyleSheet, Text, View } from "react-native";

const FAQS = [
  {
    q: "How can I track my visa application?",
    a: "Enter your application in the tracker to see real-time updates.",
  },
  {
    q: "What documents are required?",
    a: "Requirements vary by country and visa type.",
  },
  {
    q: "How long does visa processing take?",
    a: "Processing time depends on the embassy and visa type.",
  },
];

export default function FAQList() {
  return (
    <View style={styles.container}>
      {FAQS.map((faq, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.question}>{faq.q}</Text>
          <Text style={styles.answer}>{faq.a}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    flex: 1,
  },
  card: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 10,
    backgroundColor: "#F9FAFB",
  },
  question: {
    fontWeight: "600",
    marginBottom: 6,
  },
  answer: {
    color: "#6B7280",
  },
});
