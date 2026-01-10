import { StyleSheet } from 'react-native';
// import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
// import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
indexDiv: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
  progcontainer: {
    width: '100%',
    padding: 5,
    backgroundColor: 'transparent',
    borderBottomWidth: 2,
    borderBottomColor: '#5276b9ff',
  },
  progtitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  progstepText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    alignSelf: 'center',
  },
  progressBarTrack: {
    flexDirection: 'row',
    height: 8,
    width: '100%',
    alignItems: 'center',
  },
  progsegment: {
    flex: 1, // Makes each stage take equal width
    height: '100%',
    borderRadius: 4,
  },
  progseparator: {
    width: 6, // The gap between the bars
  },
  completed: {
    backgroundColor: '#4CAF50', // Green
  },
  progactive: {
    backgroundColor: '#2196F3', // Blue
  },
  progLogo: {
    backgroundColor: '#9cc7ebff',
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    alignSelf: 'center',
    borderRadius: 80,
  },
  headText: {
    //flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  passinf: {
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 18,
  },
  lonText: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
  passpoLogo: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        color: '#064274ff',
    },

//Input and Label style Section
  requiredLabel: {
    padding: 10,
    marginTop: -15,
    //backgroundColor: 'grey',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    //marginBottom: 5,
  },
    countryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginLeft: 12,
    //marginBottom: 5,
  },
  asterisk: {
    color: '#ff0000', // Bright red
  },
  input: {
    borderRadius: 8,
    padding: 12,
    width: '95%',
  },
    idCard: {
    width: 20,
    height: 20,
    alignSelf: 'center',
  },
  passNumbFied: {
    width: '100%',
    flexDirection: 'row',
    padding: 5,
    borderRadius: 5,
    borderWidth: 1,
  },
    countryFied: {
    width: '94%',
    marginLeft: 10,
    flexDirection: 'row',
    padding: 3,
    borderRadius: 5,
    borderWidth: 1,
 },
  underComent: {
    fontSize: 14,
    color: '#c9c6c6ff',
    //marginLeft: -40,
    marginBottom: -20,
  },
    country: {
    width: 20,
    height: 20,
    alignSelf: 'center',
  },
  calendar: {
    width: 20,
    height: 20,
    alignSelf: 'center',
  },
  // warnsms: {
  //   width: '95%',
  //   height: 60,
  //   backgroundColor: '#86dde9ff',
  //   padding: 10,
  //   borderRadius: 10,
  // }

  warnsms: {
    width: '100%', // Changed to 100% to match your other inputs
    backgroundColor: '#E3F2FD', // Light blue background
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row', // Align icon and text horizontally
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#90CAF9', // Slightly darker blue border
    marginTop: 10,
  },
  infoCircle: {
    width: 24,
    height: 24,
    borderRadius: 12, // Makes it a perfect circle
    backgroundColor: '#1976D2', // Deep blue circle
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoIconText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  warnText: {
    flex: 1, // Allows text to wrap to the next line
    fontSize: 13,
    color: '#1565C0', // Darker blue text for readability
    lineHeight: 18,
  },
}) 
