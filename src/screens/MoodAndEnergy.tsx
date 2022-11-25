import AsyncStorage from "@react-native-async-storage/async-storage"
import Slider from '@react-native-community/slider'
import moment from "moment"
import React, { useState } from 'react'
import { Alert, Image, ImageStyle, StyleProp, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import NotesButton from '../components/NotesButton'

export default function MoodAndEnergy(): JSX.Element {
    const [energyIntensity, setEnergyIntensity] = useState(0)
    const [selectedEmojiIndex, setSelectedEmojiIndex] = useState(-1)

    const onPress = async () => {
        let data0 = emojis[selectedEmojiIndex].label == undefined ? null : emojis[selectedEmojiIndex].label
        let data1 = energyIntensity == undefined ? null : energyIntensity
        console.log("Mood and Energy Screen attempting to save data " + data0 + " " + data1)

        if (data0 != null && data1 != null) {
            try {
                const key = "moodAndEnergyScreen"
                const date = moment().format("DD/MM/YYYY")
                let hash = await AsyncStorage.getItem(key)

                if (hash == null) {
                    console.log("moodAndEnergyScreen: Hash empty generating new hash")
                    let newHash = { [date]: [data0, data1, ""] }
                    console.log("moodAndEnergyScreen: Hash generated saving as " + date + " " + [data0, data1, ""])
                    const entry = JSON.stringify(newHash)

                    try {
                        await AsyncStorage.setItem(key, entry)
                        console.log("moodAndEnergyScreen: Save Successful")
                        Alert.alert("Data successfully saved")
                    } catch (e) {
                        Alert.alert("There was an error saving")
                        console.log("moodAndEnergyScreen: Save failed - error: " + e)
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
                        console.log("moodAndEnergyScreen: Hash edited saving as " + date + " " + newHash[date])
                        Alert.alert("Data Successfully saved")
                    } catch (e) {
                        Alert.alert("There was an error saving")
                        console.log("moodAndEnergyScreen: Save failed - error " + e)
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
    const emojis = [
        { source: require('../../assets/moodEmojis/great.png'), label: 'Great', color: '#1dbb9e' },
        { source: require('../../assets/moodEmojis/happy.png'), label: 'Happy', color: '#436a14' },
        { source: require('../../assets/moodEmojis/fine.png'), label: 'Fine', color: '#236bfb' },
        { source: require('../../assets/moodEmojis/sad.png'), label: 'Sad', color: '#e18822' },
        { source: require('../../assets/moodEmojis/awful.png'), label: 'Awful', color: '#fd216a' },
        { source: require('../../assets/moodEmojis/angry.png'), label: 'Angry', color: '#fc1d42' }
    ]

    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 25, fontWeight: 'bold', marginBottom: 10 }}>{"How are you feeling today?"}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginHorizontal: 10 }}>
                {emojis.map((emoji, index) => (
                    <TouchableOpacity key={index} onPress={() => setSelectedEmojiIndex(index)}>
                        <View style={getFaceStyle(index, selectedEmojiIndex)}>
                            <Image style={styles.image} source={emoji.source} />
                            <Text style={{ color: emoji.color, fontWeight: 'bold', fontSize: 15, textAlign: "center" }}>{emoji.label}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
            <Text style={styles.sliderQuestion}>{"How much energy do you have?"}</Text>
            <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={10}
                onValueChange={(value) => setEnergyIntensity(value)}
                step={1}
                value={energyIntensity}
                maximumTrackTintColor={'#1f1f1e'}
                minimumTrackTintColor={"#5838B4"}
                thumbTintColor={"#BEB1A4"}
            />
            <NotesButton parentKey='moodAndEnergyScreen' />
            <TouchableOpacity style={styles.button} onPress={onPress}>
                <Text style={{ color: '#ffffff', fontSize: 20 }}>{"Save Data"}</Text>
            </TouchableOpacity>
        </View>
    )
}

function getFaceStyle(emojiIndex: number, selectedEmojiIndex: number): StyleProp<ImageStyle> {
    if (emojiIndex == selectedEmojiIndex) {
        return styles.selectedEmoji
    }
    return styles.unselectedEmoji
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    unselectedEmoji: {
        marginHorizontal: 10,
        marginVertical: 10,
        borderWidth: 3,
        borderColor: '#f2f2f2',
        borderRadius: 10,
        padding: 2
    },
    selectedEmoji: {
        marginHorizontal: 10,
        marginVertical: 10,
        borderWidth: 3,
        borderColor: '#5838B4',
        borderRadius: 10,
        ShadowRadius: 100,
        shadowOpacity: .8,
        shadowOffset: {
            height: 10,
            width: 10
        },
        shadowColor: "#5838B4",
        padding: 2
    },
    sliderQuestion: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 25,
        marginTop: 35,
        marginBottom: 10
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#262626',
        padding: 10,
        width: 125,
        margin: 20,
        borderRadius: 10
    },
    slider: {
        height: 25,
        width: 325
    },
    image: {
        width: 75,
        height: 75,
        margin: 10
    }
})
