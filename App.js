import React from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  ScrollView,
  Dimensions,
  Platform,
  TouchableOpacity,
  AsyncStorage
} from "react-native";

import ToDo from "./ToDo";
import { AppLoading } from "expo";
import uuidv1 from "uuid/v1";

const { width, height } = Dimensions.get("window");

export default class App extends React.Component {
  state = {
    newToDo: "",
    toDos: {},
    loadedToDo: false,
    status: "all"
  };
  componentDidMount() {
    this._loadToDos();
  }
  render() {
    const { newToDo, toDos, isLoading, loadedToDo, status } = this.state;

    if (!loadedToDo) {
      return <AppLoading />;
    }
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.title}>Practice Memo App</Text>
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder={"Text input"}
            onChangeText={this._controlNewToDo}
            autoCorrect={false}
            returnKeyType={"done"}
            placeholderTextColor={"#999"}
            onSubmitEditing={this._addToDo}
            value={newToDo}
          />
          <View style={styles.statusOutContainer}>
            <TouchableOpacity onPress={this._allStatus}>
              <View style={styles.statusContainer}>
                <Text style={styles.status}>All</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this._activeStatus}>
              <View style={styles.statusContainer}>
                <Text style={styles.status}>Active</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this._completeStatus}>
              <View style={styles.statusContainer}>
                <Text style={styles.status}>Complete</Text>
              </View>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.toDos}>
            {this._filterStatus(this.state)}
          </ScrollView>
        </View>
      </View>
    );
  }
  _controlNewToDo = text => {
    this.setState({
      newToDo: text
    });
  };

  _allStatus = () => {
    this.setState({
      status: "all"
    });
  };

  _activeStatus = () => {
    this.setState({
      status: "active"
    });
  };

  _completeStatus = () => {
    this.setState({
      status: "complete"
    });
  };

  _addToDo = () => {
    const { newToDo } = this.state;
    if (newToDo !== "") {
      this.setState(prevState => {
        const ID = uuidv1();
        const newToDoObject = {
          [ID]: {
            id: ID,
            isComplete: false,
            text: newToDo,
            createdAt: Date.now()
          }
        };
        const newState = {
          ...prevState,
          newToDo: "",
          toDos: {
            ...prevState.toDos,
            ...newToDoObject
          }
        };
        this._saveToDos(newState.toDos);
        return { ...newState };
      });
    }
  };
  _updateToDo = (id, text) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            text: text
          }
        }
      };
      this._saveToDos(newState.toDos);
      return { ...newState };
    });
  };

  _deleteToDo = id => {
    this.setState(prevState => {
      const toDos = prevState.toDos;
      delete toDos[id];
      const newState = {
        ...prevState,
        ...toDos
      };
      this._saveToDos(newState.toDos);
      return { ...newState };
    });
  };

  _completeToDo = id => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            isComplete: true
          }
        }
      };
      this._saveToDos(newState.toDos);
      return { ...newState };
    });
  };

  _unCompleteToDo = id => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            isComplete: false
          }
        }
      };
      this._saveToDos(newState.toDos);
      return { ...newState };
    });
  };

  _loadToDos = async () => {
    try {
      const toDos = await AsyncStorage.getItem("toDos");
      const parsedToDos = JSON.parse(toDos);
      this.setState({
        loadedToDo: true,
        toDos: parsedToDos || {}
      });
    } catch (err) {
      console.log(err);
    }
  };

  _saveToDos = newToDos => {
    const saveToDos = AsyncStorage.setItem("toDos", JSON.stringify(newToDos));
  };

  _filterStatus = state => {
    const { status, toDos } = state;
    if (status === "complete") {
      return Object.values(toDos)
        .reverse()
        .map(toDo => {
          if (toDo.isComplete === true) {
            return (
              <ToDo
                key={toDo.id}
                {...toDo}
                updateToDo={this._updateToDo}
                deleteToDo={this._deleteToDo}
                completeToDo={this._completeToDo}
                unCompleteToDo={this._unCompleteToDo}
              />
            );
          }
        });
    } else if (status === "active") {
      return Object.values(toDos)
        .reverse()
        .map(toDo => {
          if (toDo.isComplete === false) {
            return (
              <ToDo
                key={toDo.id}
                {...toDo}
                updateToDo={this._updateToDo}
                deleteToDo={this._deleteToDo}
                completeToDo={this._completeToDo}
                unCompleteToDo={this._unCompleteToDo}
              />
            );
          }
        });
    } else {
      return Object.values(toDos)
        .reverse()
        .map(toDo => (
          <ToDo
            key={toDo.id}
            {...toDo}
            updateToDo={this._updateToDo}
            deleteToDo={this._deleteToDo}
            completeToDo={this._completeToDo}
            unCompleteToDo={this._unCompleteToDo}
          />
        ));
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fa7268",
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    color: "white",
    fontSize: 30,
    marginTop: 30,
    fontWeight: "200",
    marginBottom: 30
  },
  card: {
    backgroundColor: "white",
    flex: 1,
    alignItems: "center",
    width: width - 25,
    fontSize: 25,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    ...Platform.select({
      ios: {
        shadowColor: "rgba(127, 26, 229)",
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: {
          height: -1,
          width: 0
        }
      },
      android: {
        elevation: 3
      }
    })
  },
  input: {
    padding: 20,
    fontSize: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#fa7268",
    marginBottom: 30
  },
  statusOutContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    justifyContent: "space-around"
  },
  statusContainer: {
    margin: 10,
    borderRadius: 20,
    backgroundColor: "#fa7268",
    paddingHorizontal: 30,
    paddingVertical: 20
  },
  status: {
    fontSize: 15,
    color: "white"
  },
  toDos: {
    alignItems: "center"
  }
});
