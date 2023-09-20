import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Button, StyleSheet } from "react-native";
import * as Animatable from "react-native-animatable";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  // interface AppState {
  //   minValue: string;
  //   maxValue: string;
  //   currentStep: number;
  //   streak: number;
  //   topStreak?: number;
  //   previousValue: string;
  //   currentValue?: number;
  // }

  // const [state, setState] = useState<AppState>({
  //   minValue: "",
  //   maxValue: "",
  //   currentStep: 1,
  //   streak: 0,
  //   previousValue: "",
  // });

  // const _storeData = async (streak) => {
  //   try {
  //     let data = await _retrieveData();
  //     if (data < streak) {
  //       await AsyncStorage.setItem("streak", `${streak}`);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  // const _retrieveData = async () => {
  //   try {
  //     const value = await AsyncStorage.getItem("streak");
  //     if (value !== null) {
  //       console.log(value);
  //       return value;
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  //   return "0"; // Default value if not found or in case of error
  // };

  // const getRandomNumber = (value, title, topStreak) => {
  //   const randomNumber = Math.floor(Math.random() * 20) + 1;
  //   const { currentValue } = state;

  //   if (currentValue === undefined) {
  //     setState({ ...state, currentValue: randomNumber });
  //   } else {
  //     let streak = state.streak;

  //     if (
  //       (title === "higher" && randomNumber > value) ||
  //       (title === "lower" && randomNumber < value)
  //     ) {
  //       streak += 1;
  //     } else {
  //       _storeData(streak);
  //       if (state.topStreak < streak) {
  //         setState({
  //           ...state,
  //           topStreak: streak
  //         });
  //       }
  //       streak = 0;
  //     }
  //     if (topStreak !== undefined) {
  //       setState({
  //         ...state,
  //         streak: streak,
  //         topStreak: topStreak,
  //         previousValue: currentValue,
  //         currentValue: randomNumber,
  //       });
  //     } else {
  //       setState({
  //         ...state,
  //         streak: streak,
  //         previousValue: currentValue,
  //         currentValue: randomNumber,
  //       });
  //     }
  //   }
  // };

  // function nextGuess(title) {
  //   getRandomNumber(state.currentValue, title);
  // }

  // useEffect(() => {

  //   async function fetchData() {
  //     try {
  //       const data = await _retrieveData();
  //       const topStreak = Number(data);
  //       console.log("top streak", topStreak);

  //       setState((prevState) => ({ ...prevState, topStreak: topStreak }));

  //       getRandomNumber(state.currentValue, "", topStreak);
  //     } catch (error) {
  //       console.error("There was an error retrieving the data:", error);
  //     }
  //   }
  //   fetchData();
  // }, []);

  interface AppState {
    minValue: string;
    maxValue: string;
    currentStep: number;
    streak: number;
    topStreak?: number;
    previousValue: number | null;
    currentValue?: number;
  }

  const initialState: AppState = {
    minValue: "",
    maxValue: "",
    currentStep: 1,
    streak: 0,
    previousValue: null,
  };

  const [state, setState] = useState<AppState>(initialState);

  const storeData = async (streak: number) => {
    try {
      const storedStreak = await retrieveData();
      if (storedStreak < streak) {
        await AsyncStorage.setItem("streak", `${streak}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const retrieveData = async (): Promise<number> => {
    try {
      const value = await AsyncStorage.getItem("streak");
      return value ? parseInt(value, 10) : 0;
    } catch (error) {
      console.error(error);
      return 0;
    }
  };

  const getRandomNumber = () => Math.floor(Math.random() * 20) + 1;

  function handleGuess(title: string) {
    const randomNumber = getRandomNumber();
    const { currentValue, streak } = state;

    let newStreak = streak;
    if (
      (title === "higher" && randomNumber > currentValue) ||
      (title === "lower" && randomNumber < currentValue)
    ) {
      newStreak += 1;
    } else {
      storeData(newStreak);
      newStreak = 0;
    }

    setState((prevState) => ({
      ...prevState,
      previousValue: currentValue || null,
      currentValue: randomNumber,
      streak: newStreak,
      topStreak: Math.max(prevState.topStreak || 0, newStreak),
    }));
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const topStreak = await retrieveData();
        setState((prevState) => ({ ...prevState, topStreak }));
        handleGuess(""); // Initialize the first value
      } catch (error) {
        console.error("There was an error retrieving the data:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Animatable.View animation="fadeIn" duration={1000}>
        <Text style={styles.title}>
          Will the next number be higher or lower?
        </Text>
        <Text style={styles.subtitle}>(1-20)</Text>
        <Text style={styles.number}>
          Top Streak: {state.topStreak || "N/A"}
        </Text>
        <Text
          style={[
            styles.number,
            {
              color:
                state.streak === 0 && state.previousValue === ""
                  ? "black"
                  : state.streak > 0 && state.previousValue !== undefined
                  ? "green"
                  : "red",
            },
          ]}
        >
          Streak: {state.streak}
        </Text>
      </Animatable.View>
      <View style={styles.resultsContainer}>
        <View>
          <Text style={styles.resultPrevious}>Previous</Text>
          <Animatable.View
            animation="fadeIn"
            duration={1000}
            key={state.previousValue}
          >
            <Text style={styles.resultPrevious}>{state.previousValue}</Text>
          </Animatable.View>
        </View>
        <View>
          <Text style={styles.resultCurrent}>Current</Text>
          <Animatable.View
            animation="fadeIn"
            duration={1000}
            key={String(state.currentValue)}
          >
            <Text style={styles.resultCurrent}>
              {state.currentValue || "N/A"}
            </Text>
          </Animatable.View>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Animatable.View animation="fadeIn" duration={1000} delay={500}>
          {/* <TouchableOpacity
            style={styles.buttonStyle}
            onPress={() => nextGuess("lower")}
          >
            <Text style={styles.buttonText}>Lower</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={() => handleGuess("lower")}
          >
            <Text style={styles.buttonText}>Lower</Text>
          </TouchableOpacity>
        </Animatable.View>

        <Animatable.View animation="fadeIn" duration={1000} delay={500}>
          {/* <TouchableOpacity
            style={styles.buttonStyle}
            onPress={() => nextGuess("higher")}
          >
            <Text style={styles.buttonText}>Higher</Text>
          </TouchableOpacity> */}

          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={() => handleGuess("higher")}
          >
            <Text style={styles.buttonText}>Higher</Text>
          </TouchableOpacity>
        </Animatable.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ECECEC",
    alignItems: "center",
    // justifyContent: 'center',
    paddingTop: 50,
    position: "relative",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    maxWidth: "95%",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  resultsContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 40,
  },
  number: {
    fontSize: 32,
    marginBottom: 15,
    textAlign: "center",
  },
  resultCurrent: {
    fontSize: 32,
    marginBottom: 15,
    textAlign: "center",
  },
  resultPrevious: {
    fontSize: 32,
    marginBottom: 15,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 40,
  },
  buttonStyle: {
    backgroundColor: "#007AFF",
    borderRadius: 10,
    paddingHorizontal: 50,
    paddingVertical: 10,
    marginHorizontal: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
