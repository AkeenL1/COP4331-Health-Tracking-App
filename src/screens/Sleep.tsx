import AsyncStorage from '@react-native-async-storage/async-storage'
import Slider from '@react-native-community/slider'
import moment from "moment"
import React, { useState } from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import RadioGroup, { RadioButtonProps } from 'react-native-radio-buttons-group'
import NotesButton from '../components/NotesButton'

const radioButtonsData: RadioButtonProps[] = [{
    id: 'btn1',
    label: "Very Little (3 hours or less)",
    value: "Very Little (3 hours or less)",
    size: 30,
    labelStyle: { color: '#800020', fontSize: 20, fontWeight: 'bold' }
},
{
    id: 'btn2',
    label: "Some (4 to 5 hours)",
    value: "Some (4 to 5 hours)",
    size: 30,
    containerStyle: { marginTop: 20 },
    labelStyle: { color: '#EDB100', fontSize: 20, fontWeight: 'bold' }
},
{
    id: 'btn3',
    label: "A Good Amount (6 to 7 hours)",
    value: "A Good Amount (6 to 7 hours)",
    size: 30,
    containerStyle: { marginTop: 20 },
    labelStyle: { color: '#2a8000', fontSize: 20, fontWeight: 'bold' }
},
{
    id: 'btn4',
    label: "A lot (8 to 9 hours)",
    value: "A lot (8 to 9 hours)",
    size: 30,
    containerStyle: { marginTop: 20 },
    labelStyle: { color: '#1B5E20', fontSize: 20, fontWeight: 'bold' }
},
{
    id: 'btn5',
    label: "Excessive (Over 9 hours)",
    value: "Excessive (Over 9 hours)",
    size: 30,
    containerStyle: { marginTop: 20 },
    labelStyle: { color: '#EDB100', fontSize: 20, fontWeight: 'bold' }
}]

let selectedButton
export default function Sleep(): JSX.Element {
    const [sliderValue, tempValue] = useState(1)

    const onPress = async () => {
        let data0 = selectedButton
        let data1 = sliderValue
        console.log("Sleep Screen: Attempting to save data " + data0 + " " + data1)

        if (data0 != null && data1 != null) {
            try {
                const key = "sleepScreen"
                let hash = await AsyncStorage.getItem(key)
                const date = moment().format("DD/MM/YYYY")

                if (hash == null) {
                    console.log("sleepScreen: Hash empty generating new hash")
                    let newHash = { [date]: [data0, data1, ""] }
                    console.log("sleepScreen: Hash generated saving as " + date + " " + [data0, data1, ""])
                    const entry = JSON.stringify(newHash)

                    try {
                        await AsyncStorage.setItem(key, entry)
                        console.log("sleepScreen: Save Successful")
                        Alert.alert("Data successfully saved")
                    } catch (e) {
                        Alert.alert("There was an error saving")
                        console.log("sleepScreen: Save failed - error: " + e)
                    }
                } else {
                    let newHash = JSON.parse(hash)
                    if (newHash[date] != null) {
                        newHash[date] = [data0, data1, newHash[date][2]]
                    } else {
                        newHash[date] = [data0, data1, ""]
                    }
                    const entry = JSON.stringify(newHash)

                    try {
                        await AsyncStorage.setItem(key, entry)
                        console.log("sleepScreen: Hash edited saving as " + date + " " + newHash[date])
                        Alert.alert("Data Successfully saved")
                    } catch (e) {
                        Alert.alert("There was an error saving")
                        console.log("sleepScreen: Save failed - error " + e)
                    }
                }
            } catch (e) {
                Alert.alert("There was an error saving")
                console.log("moodAndEnergyScreen: Save failed - error " + e)
            }
        } else {
            Alert.alert("Error: Data not entered please try again")
        }
    }

    const [radioButtons, setRadioButtons] = useState<RadioButtonProps[]>(radioButtonsData)

    const onPressRadioButton = (radioButtonsArray: RadioButtonProps[]) => {
        setRadioButtons(radioButtonsArray)
        radioButtonsArray.forEach((button) => {
            if (button.selected == true) {
                selectedButton = button.id
                return selectedButton
            }
        })
    }

    return (
        <View style={styles.sleepScreenView}>
            <Text style={styles.question}>{"How much did you sleep today?"}</Text>
            <RadioGroup
                containerStyle={styles.buttons}
                radioButtons={radioButtons}
                onPress={onPressRadioButton}
            />
            <NotesButton parentKey='sleepScreen' />
            <View style={styles.sliderText}>
                <Text style={styles.text}>{"How was your sleep quality?"}</Text>
            </View>
            <View style={styles.sliderView}>
                <Slider
                    style={styles.slider}
                    minimumValue={1}
                    maximumValue={10}
                    onValueChange={(value) => tempValue(value)}
                    step={1}
                    value={sliderValue}
                    maximumTrackTintColor={"#1f1f1e"}
                    minimumTrackTintColor={"#828180"}
                    thumbTintColor={"#BEB1A4"}
                />
            </View>
            <TouchableOpacity
                style={styles.Button}
                onPress={onPress}>
                <Text style={styles.buttonText}>{"Save Data"}</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    //todo:AKEEN make a global stylesheet with sizing,text color,font,etc. - confer w/ team
    text: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 20
    },
    buttonText: {
        color: '#ffffff'
    },
    Button: {
        alignItems: "center",
        backgroundColor: "#262626",
        padding: 10,
        width: 125,
        margin: 20,
        borderRadius: 10
    },
    blackBar: {
        backgroundColor: 'black',
        height: 2,
        width: 225,
        margin: 50
    },
    sleepScreenView: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    sliderView: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    sliderText: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: 260,
        paddingTop: 22
    },
    slider: {
        height: 25,
        width: 325,
    },
    question: {
        fontSize: 25,
        padding: 20,
        fontWeight: 'bold'
    },
    buttons: {
        alignItems: 'flex-start',
        padding: 20,
        border: "10px",
        paddingTop: 10
    }
})
