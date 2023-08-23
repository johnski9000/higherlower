import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function App() {

  const [state, setState] = useState({
    minValue: "",
    maxValue: "",
    currentStep: 1,
    streak: 0,
    previousValue: "",
    currentValue: undefined
  });

  const getRandomNumber = (value:number, title:any) => {
    const randomNumber:any = Math.floor(Math.random() * 20) + 1;
    const { currentValue } = state; 
  
    if (currentValue === undefined) {
      setState({ ...state, currentValue: randomNumber });
    } else {
      let streak = state.streak;
      
      if ((title === "higher" && randomNumber > value) || (title === "lower" && randomNumber < value)) {
        streak += 1
      } else {
        streak = 0
      }
  
      setState({
        ...state,
        streak: streak,
        previousValue: currentValue,
        currentValue: randomNumber,
      });
    }
  };
  
  

    function nextGuess(title:any) {
      // console.log(title)

      // setState({...state, buttonPressed: title})
      getRandomNumber(state.currentValue, title)
    }

    useEffect(() => {
        getRandomNumber(state.currentValue, "");
    }, []);

  return (
    <View style={styles.container}>
      <Text>Will the next number be higher or lower?</Text>
      <Text>(1-20)</Text>
      <Text style={styles.number}>streak - {state.streak}</Text>
      <Text style={styles.number}>current - {state.currentValue}</Text>
      <Text style={styles.number}>previous - {state.previousValue}</Text>
      <View style={{ flexDirection:"row" }}>
        <View style={styles.buttonStyle}>
          <Button title="lower" onPress={() => nextGuess("lower")} />
        </View>
        <View style={styles.buttonStyle}>
        <Button title="higher" onPress={() => nextGuess("higher")} />
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
