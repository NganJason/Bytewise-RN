import { StyleSheet, Text, View } from 'react-native';

function Startup() {
  return (
    <View style={styles.container}>
      <View>
        <Text>Startup screen</Text>
      </View>
    </View>
  );
}

export default Startup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
