import React, { useEffect, useState } from 'react'
import { StatusBar, SafeAreaView, StyleSheet, Text, ScrollView, Image } from 'react-native'
import { Agenda, CalendarProvider } from 'react-native-calendars'
import AsyncStorage from '@react-native-async-storage/async-storage'
import moment from 'moment'

export default function Calendar(): JSX.Element {
    var date = new Date()
    const initialDate = date.toISOString().substring(0,10)
    const [currentDateSelected, setCurrentDateSelected] = useState(initialDate)
    const[sleepText, setSleepText] = useState("")
    const[medsText, setMedsText] = useState([])
    const[moodText, setMoodText] = useState([])
    const[moodTimeText, setMoodTimeText] = useState([])

    useEffect(() => {
        updateSleepText()
        updateMedsString()
        updateMoodEnergyText()
    }, [currentDateSelected])

    async function getMoodAndEnergyDataForDate(day: string): Promise<[]> {
        const date: string =  day.substring(8, 10) + '/' +  day.substring(5, 7) + '/' + day.substring(0, 4)
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

    function getSleepString(parsedData: object) {
        let sleepString: string = "No Sleep Data"
        if(parsedData == null) {
            setSleepText(sleepString)
            return sleepString
        }
        switch(parsedData[0]) {
            case 'btn1' :
                sleepString = "Amount: <3 Hours"
                break
            case 'btn2' :
                sleepString = "Amount: 4-5 Hours"
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
                return sleepString
        }
        sleepString = sleepString + "\n Quality: " + parsedData[1] + "/10"
        setSleepText(sleepString)
        return sleepString
    }

    function currentWeekdayIsDrugDay(weeklyFrequency: boolean[]): boolean {
        let selectedDay = Date.parse(currentDateSelected)
        let day: moment.Moment = moment.unix(selectedDay.valueOf())
        let weekday = 7 - day.isoWeekday()

        return weeklyFrequency[weekday]
    }

    function selectedDateInRange(med : MedicationModel): boolean {
        let selectedDate = Date.parse(currentDateSelected)
        let start = Date.parse(med.dateRange[0])
        start = start.valueOf() - (start.valueOf() % (86400 * 1000))
        let end = Date.parse(med.dateRange[1])
        end = (end - (end % (86400 * 1000))) + (86399 * 1000)
        
        return selectedDate.valueOf() >= start && selectedDate.valueOf() <= end.valueOf()
    }

    function getMedsString(meds : MedicationModel[]) {
        let validMeds: string[] = []
        if(meds == null) {
            validMeds.push("No Medications")
            setMedsText(validMeds)
            return
        }
        for(let i = 0; i < meds.length; i++) {
            if (selectedDateInRange(meds[i])) {
                if (currentWeekdayIsDrugDay(meds[i].weeklyFrequency)) {
                    validMeds.push("Take " + meds[i].dailyDoses.toString() + " " + (meds[i].dailyDoses == 1 ? "dose" : "doses") + " of " + meds[i].name)
                }
            }
        }
        if(validMeds.length == 0) {
            validMeds.push("No Medications")
            setMedsText(validMeds)
            return
        }
        setMedsText(validMeds)
    }

    function getMoodEnergyString(parsedData: Object) {
        // if parsedData == Null set to default 
        // Take Object and iterate through pulling out time, mood, and energy for each entry
            // Assign each time and mood/energy data into seperate string arrays with matching indices
        // set moodText to mood/energy array and set moodTimeText to time array
    }
    function updateMedsString(): void {
        getListOfUserMedications().then((listOfUserMedications) => getMedsString(listOfUserMedications))
    }

    function updateSleepText(): void {
        getSleepDataForDate(currentDateSelected).then((data) => getSleepString(data))
    }

    function updateMoodEnergyText(): void {
        getMoodAndEnergyDataForDate(currentDateSelected).then((data) => getMoodEnergyString(data))
    }

    return (
        <SafeAreaView style={{marginTop: StatusBar.currentHeight}}>
            <SafeAreaView style={{height: '100%'}}>
                <CalendarProvider date={currentDateSelected}>             
                <Agenda renderList={() => DailyData(currentDateSelected, sleepText, medsText)}
                    onDayPress={day => {  
                        setCurrentDateSelected(day.dateString)
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

function DailyData(day, sleepText, medsText): JSX.Element {
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
                        {medsText.map((med) => med + "\n")}
                    </Text>
                </SafeAreaView>                
                <SafeAreaView style={styles.dataTitle}>
                    <Image style={styles.imageFormat} source={require('../../assets/MoodNavigationIcon.png')}/>
                    <Text style={styles.titleText}>{"Mood/Energy"}</Text>
                </SafeAreaView>
                <SafeAreaView style={{paddingTop: 10}}>
                    <Text style={styles.timeTitle}>{"04:59:"}</Text>
                    <Text style={styles.moodText}>{"Mood: Sad\nEnergy: 1/10"}</Text>
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