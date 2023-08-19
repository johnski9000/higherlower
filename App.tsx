import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function App() {

  const [number, setNumber] = useState(1);

    const getRandomNumber = () => {
        const randomNumber = Math.floor(Math.random() * 20) + 1;
        setNumber(randomNumber);
    }

    useEffect(() => {
        getRandomNumber();
    }, []);

  return (
    <View style={styles.container}>
      <Text>Will the next number be higher or lower?</Text>
      <Text>(1-20)</Text>
      <Text style={styles.number}>{number}</Text>
      <View style={{ flexDirection:"row" }}>
        <View style={styles.buttonStyle}>
          <Button title="lower" onPress={() => getRandomNumber()} />
        </View>
        <View style={styles.buttonStyle}>
        <Button title="higher" onPress={() => getRandomNumber()} />
        </View>
      </View>      
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: {
    fontSize: 55,
    paddingTop: 20,
  },
  buttonStyle: {
    marginHorizontal: 20,
    marginTop: 5
  }
});
