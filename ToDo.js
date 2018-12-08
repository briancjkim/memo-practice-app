import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput
} from "react-native";

const { width, height } = Dimensions.get("window");

export default class ToDo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      toDoValue: props.text
    };
  }

  render() {
    const { isEditing, toDoValue } = this.state;
    const { text, deleteToDo, id, isComplete } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.column}>
          <TouchableOpacity onPress={this._toggleComplete}>
            <View
              style={[
                styles.circle,
                isComplete ? styles.completedCircle : styles.unCompletedCircle
              ]}
            />
          </TouchableOpacity>
          {isEditing ? (
            <TextInput
              style={[
                styles.text,
                styles.input,
                isComplete ? styles.completeText : styles.unCompleteText
              ]}
              value={toDoValue}
              multiLine={true}
              onChangeText={this._controlInput}
              returnKeyType={"done"}
              onBlur={this._finishEditing}
            />
          ) : (
            <Text
              style={[
                styles.text,
                isComplete ? styles.completeText : styles.UnCompleteText
              ]}
            >
              {text}
            </Text>
          )}
        </View>

        {isEditing ? (
          <View style={styles.actions}>
            <TouchableOpacity onPress={this._finishEditing}>
              <View style={styles.actionContainer}>
                <Text style={styles.actionText}>✅</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.actions}>
            <TouchableOpacity onPress={this._startEditing}>
              <View style={styles.actionContainer}>
                <Text style={styles.actionText}>✏️</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={event => {
                event.stopPropagation();
                deleteToDo(id);
              }}
            >
              <View style={styles.actionContainer}>
                <Text style={styles.actionText}>❌</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
  _toggleComplete = event => {
    event.stopPropagation();
    const { isComplete, id, completeToDo, unCompleteToDo } = this.props;
    if (isComplete) {
      unCompleteToDo(id);
    } else {
      completeToDo(id);
    }
  };

  _controlInput = text => {
    this.setState({
      toDoValue: text
    });
  };

  _startEditing = event => {
    event.stopPropagation();
    this.setState({
      isEditing: true
    });
  };

  _finishEditing = event => {
    event.stopPropagation();
    const { isEditing, toDoValue } = this.state;
    const { id, updateToDo } = this.props;
    updateToDo(id, toDoValue);
    this.setState({
      isEditing: false
    });
  };
}
const styles = StyleSheet.create({
  container: {
    width: width - 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomColor: "#fa7268",
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 3,
    marginRight: 20
  },
  completedCircle: {
    borderColor: "#bbb"
  },
  unCompletedCircle: {
    borderColor: "#fa7268"
  },
  column: {
    flexDirection: "row",
    alignItems: "center",
    width: width / 2
  },
  text: {
    fontSize: 20,
    fontWeight: "200",
    marginVertical: 20
  },
  completeText: {
    color: "#bbb",
    textDecorationLine: "line-through"
  },
  unCompleteText: {
    color: "#353839"
  },
  actions: {
    flexDirection: "row"
  },
  actionContainer: {
    marginHorizontal: 10,
    marginVertical: 10
  },
  input: {
    marginVertical: 20,
    width: width / 2
  }
});
