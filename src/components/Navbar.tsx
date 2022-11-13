import React from 'react'
import { Image } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Calendar from '../screens/Calendar'
import Medication from '../screens/Medication'
import MoodAndEnergy from '../screens/MoodAndEnergy'
import Sleep from '../screens/Sleep'

const Tab = createBottomTabNavigator()

const calendarTabOptions = {
    tabBarIcon: ({focused}) => (
        focused 
         ?  <Image style={{height: 25, width: 25}} source={require('../../assets/NavBarIcons/NewSelectedCalendarIcon.png')} />
         :  <Image style={{height: 25, width: 25}} source={require('../../assets/NavBarIcons/NewCalendarIcon.png')} />
    )
}
const medicationTabOptions = {
    tabBarIcon: ({focused}) => (
        focused 
         ?  <Image style={{height: 25, width: 25}} source={require('../../assets/NavBarIcons/NewSelectedMedsIcon.png')} />
         :  <Image style={{height: 25, width: 25}} source={require('../../assets/NavBarIcons/NewMedsIcon.png')} />
    )
}
const moodAndEnergyTabOptions = {
    tabBarIcon: ({focused}) => (
        focused 
         ?  <Image style={{height: 25, width: 25}} source={require('../../assets/NavBarIcons/NewSelectedMoodIcon.png')} />
         :  <Image style={{height: 25, width: 25}} source={require('../../assets/NavBarIcons/NewMoodIcon.png')} />
    )
}
const sleepTabOptions = {
   tabBarIcon: ({focused}) => (
   focused 
    ?   <Image style={{height: 25, width: 25}} source={require('../../assets/NavBarIcons/NewSelectedSleepIcon.png')} />
    :   <Image style={{height: 25, width: 25}} source={require('../../assets/NavBarIcons/NewSleepIcon.png')} />
   )
}
const navBarScreenOptions = {
    headerShown: false,
    tabBarShowLabel: false,
    tabBarHideOnKeyboard: true,
    tabBarStyle: {
        backgroundColor: "#FFFFFF"
    }
}

export default function Navbar(): JSX.Element {
    return (
        <Tab.Navigator screenOptions={navBarScreenOptions}>
            <Tab.Screen name="calendar" component={Calendar} options={calendarTabOptions} />
            <Tab.Screen name="medication" component={Medication} options={medicationTabOptions} />
            <Tab.Screen name="moodAndEnergy" component={MoodAndEnergy} options={moodAndEnergyTabOptions} />
            <Tab.Screen name="sleep" component={Sleep} options={sleepTabOptions} />
        </Tab.Navigator>
    )
}
