import React, { useState } from 'react'
import { StatusBar, StyleSheet, Text, View, ScrollView, Image } from 'react-native'
import { Agenda, CalendarProvider } from 'react-native-calendars'

export default function Calendar(): JSX.Element {
    var date = new Date()
    const initialDate = date.toISOString().substring(0,10)
    const [currentDateSelected,setCurrentDateSelected] = useState(initialDate)
    return (
        <View style={{marginTop: StatusBar.currentHeight}}>
            <View style={{height: '100%'}}>
                <CalendarProvider date={currentDateSelected}>             
                <Agenda renderList={() => DailyData(currentDateSelected)}
                    onDayPress={day => {   
                        setCurrentDateSelected(day.dateString)
                    }}
                    hideExtraDays={true}
                    theme={{
                        agendaKnobColor: 'grey',
                        selectedDayBackgroundColor: "#2596be",
                        monthTextColor: 'black',
                        todayTextColor: '#2596be',
                        dayTextColor: 'black'
                    }}
                />
                </CalendarProvider> 
            </View>
        </View>
    )
}

function DailyData(day): JSX.Element {
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
        <View style={{flex: 1, borderTopWidth: 0.5, borderTopColor: 'grey', backgroundColor: 'white'}}>
            <Text style={styles.dateHeading}>
                {dateText}
            </Text>
            <ScrollView>
                <View style={styles.dataTitle}>
                    <Image style={styles.imageFormat} source={require('../../assets/SleepNavigationIcon.png')}/>
                    <Text style={styles.titleText}>{"Sleep"}</Text>
                </View>
                <View style={{paddingTop: 10}}>
                    <Text style={styles.otherText}>{"Amount: 3-4 Hours\nQuality: 4/10"}</Text>
                </View>
                <View style={styles.dataTitle}>
                    <Image style={styles.imageFormat} source={require('../../assets/PillNavigationIcon.png')}/>
                    <Text style={styles.titleText}>{"Medications"}</Text>
                </View>
                <View style={{paddingTop: 10}}>
                    <Text style={styles.otherText}>
                        {"Take Metformin 1 time(s) today\nTake Diazepam 2 times(s) today"}
                    </Text>
                </View>                
                <View style={styles.dataTitle}>
                    <Image style={styles.imageFormat} source={require('../../assets/MoodNavigationIcon.png')}/>
                    <Text style={styles.titleText}>{"Mood/Energy"}</Text>
                </View>
                <View style={{paddingTop: 10}}>
                    <Text style={styles.timeTitle}>{"04:59:"}</Text>
                    <Text style={styles.moodText}>{"Mood: Sad\nEnergy: 1/10"}</Text>
                    <Text style={styles.timeTitle}>{"13:32:"}</Text>
                    <Text style={styles.moodText}>{"Mood: Happy\nEnergy: 6/10"}</Text>
                </View>
            </ScrollView>
        </View>
    )
}
const styles = StyleSheet.create({
    dataTitle: {
        backgroundColor:'#2596be',
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
        color: '#2596be', 
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