import React, { useState } from 'react'
import { StatusBar, SafeAreaView, StyleSheet, Text, ScrollView, Image } from 'react-native'
import { Agenda, CalendarProvider } from 'react-native-calendars'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function Calendar(): JSX.Element {
    var date = new Date()
    const initialDate = date.toISOString().substring(0,10)
    const [currentDateSelected,setCurrentDateSelected] = useState(initialDate)
    const[sleepText,setSleepText] = useState("")

    function getSleepString(parsedData: object) {
        let sleepString: string = "No Sleep Data"
    if(parsedData == null) {
        setSleepText(sleepString)
        return
    }
    switch(parsedData[0]) {
        case 'btn1' :
            sleepString = "Amount: <3 Hours"
            break
        case 'btn2' :
            sleepString = "Amount: 3-5 Hours"
            break
        case 'btn3' :
            sleepString = "Amount: 6-7 Hours"
            break
        case 'btn4' :
            sleepString = "Amount: 8-9 Hours"
            break
        case 'btn5' :
            sleepString = "Amount: >9 Hours"
             break
        default :
            setSleepText(sleepString)
            return
    }
    sleepString = sleepString + "\n Quality: " + parsedData[1] + "/10"
    setSleepText(sleepString)
    return
    }
    return (
        <SafeAreaView style={{marginTop: StatusBar.currentHeight}}>
            <SafeAreaView style={{height: '100%'}}>
                <CalendarProvider date={currentDateSelected}>             
                <Agenda renderList={() => DailyData(currentDateSelected, sleepText)}
                    onDayPress={day => {   
                        setCurrentDateSelected(day.dateString)
                        console.log(currentDateSelected)
                        //getSleepDataForDate(currentDateSelected).then((data) => getSleepString(data))
                        //console.log(currentDateSelected + " is selected, Sleep Data is " + sleepText)
                    }}
                    hideExtraDays={true}
                    theme={{
                        agendaKnobColor: '#5838B4',
                        calendarBackground: 'black',
                        selectedDayBackgroundColor: "#5838B4",
                        monthTextColor: 'white',
                        todayTextColor: '#5838B4',
                        dayTextColor: 'white'
                    }}
                />
                </CalendarProvider> 
            </SafeAreaView>
        </SafeAreaView>
    )
}

async function getListOfUserMedications(): Promise<MedicationModel[]> {
    try {
        let medicationScreenHash: string = await AsyncStorage.getItem('medicationScreen')
        if (medicationScreenHash != null) {
            let parsedMedicationScreen: Object = JSON.parse(medicationScreenHash)
            return Object.values(parsedMedicationScreen)
        } else {
            console.log("The medications screen hash is empty.")
        }
    } catch (e) {
        console.log("There was an error getting the list of user medications: " + e)
    }
}

async function getSleepDataForDate(day: string): Promise<[]> {
    const date: string =  day.substring(8, 10) + '/' +  day.substring(5, 7) + '/' + day.substring(0, 4)
    try {
        let sleepScreenHash: string = await AsyncStorage.getItem('sleepScreen')
        if (sleepScreenHash != null) {
            let parsedSleepScreenHash: Object = JSON.parse(sleepScreenHash)
            return parsedSleepScreenHash[date]
        } else {
            console.log("The sleep screen hash is empty.")
        }
    } catch (e) {
        console.log("There was an error getting the sleep screen data: " + e)
    }
}

async function getMoodAndEnergyDataForDate(date: string): Promise<[]> {
    try {
        let moodAndEnergyScreenHash: string = await AsyncStorage.getItem('moodAndEnergyScreen')
        if (moodAndEnergyScreenHash != null) {
            let parsedMoodAndEnergyScreenHash: Object = JSON.parse(moodAndEnergyScreenHash)
            return parsedMoodAndEnergyScreenHash[date]
        } else {
            console.log("The mood and energy screen hash is empty.")
        }
    } catch (e) {
        console.log("There was an error getting the mood and energy screen data: " + e)
    }
}

function DailyData(day,sleepText): JSX.Element {
    // NOTE TO BRANDON: 
    // Delete these lines when you do your code! This is just to show you examples of how to access the data you need.
    // Change the date that I passed in to see the data for different days!

    //getListOfUserMedications().then((listOfUserMedications) => console.log(listOfUserMedications[0]))
    //getSleepDataForDate('22/11/2022').then((data) => console.log(data))
    //getMoodAndEnergyDataForDate('22/11/2022').then((data) => console.log(data))


    const monthNames: string[] = [
        "January",
        "February", 
        "March", 
        "April", 
        "May", 
        "June",
        "July", 
        "August", 
        "September", 
        "October", 
        "November", 
        "December"
    ]

    let dayText: string
    if (day.substring(8, 9) != "0") {
        dayText = day.substring(8, 10)
    } else {
        dayText = day.substring(9, 10)
    }
    let dateText: string = monthNames[day.substring(5, 7) - 1] + " " + dayText + ", " + day.substring(0, 4)
    return (
        <SafeAreaView style={{flex: 1}}>
            <Text style={styles.dateHeading}>
                {dateText}
            </Text>
            <ScrollView>    
                <SafeAreaView style={styles.dataTitle}>
                    <Image style={styles.imageFormat} source={require('../../assets/SleepNavigationIcon.png')}/>
                    <Text style={styles.titleText}>{"Sleep"}</Text>
                </SafeAreaView>
                <SafeAreaView style={{paddingTop: 10}}>
                 <Text style={styles.otherText}>
                    {sleepText}
                 </Text>
                </SafeAreaView>
                <SafeAreaView style={styles.dataTitle}>
                    <Image style={styles.imageFormat} source={require('../../assets/PillNavigationIcon.png')}/>
                    <Text style={styles.titleText}>{"Medications"}</Text>
                </SafeAreaView>
                <SafeAreaView style={{paddingTop: 10}}>
                    <Text style={styles.otherText}>
                        {"Take Metformin 1 time(s) today\nTake Diazepam 2 times(s) today"}
                    </Text>
                </SafeAreaView>                
                <SafeAreaView style={styles.dataTitle}>
                    <Image style={styles.imageFormat} source={require('../../assets/MoodNavigationIcon.png')}/>
                    <Text style={styles.titleText}>{"Mood/Energy"}</Text>
                </SafeAreaView>
                <SafeAreaView style={{paddingTop: 10}}>
                    <Text style={styles.timeTitle}>{"04:59:"}</Text>
                    <Text style={styles.moodText}>{"Mood: Sad\nEnergy: 1/10"}</Text>
                    <Text style={styles.timeTitle}>{"13:32:"}</Text>
                    <Text style={styles.moodText}>{"Mood: Happy\nEnergy: 6/10"}</Text>
                </SafeAreaView>
            </ScrollView>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    dataTitle: {
        backgroundColor:'#5838B4',
        flexDirection: 'row'
    },
    titleText: {
        paddingLeft: 10, 
        fontSize: 24, 
        fontWeight: 'bold',
        color: 'white'
    },
    moodText: {
        fontWeight: 'bold', 
        paddingLeft: 65, 
        color: 'black', 
        fontSize: 20
    },
    imageFormat: {
        width: 30, 
        height: 30
    },
    timeTitle: {
        paddingLeft: 55, 
        fontSize: 20, 
        fontWeight: 'bold', 
        color: '#5838B4', 
        textDecorationLine: 'underline'
    },
    otherText: {
        fontWeight: 'bold', 
        paddingLeft: 55, 
        color: 'black', 
        fontSize: 20
    },
    dateHeading : {
        fontWeight: 'bold', 
        padding: 10, 
        textAlign: 'center', 
        fontSize: 32, 
        color: 'black'
    }
})