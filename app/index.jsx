import { StyleSheet, Text, View, Image } from 'react-native'
import { Link } from 'expo-router'
import React from 'react'
import Logo from '../assets/image.png'

const Home = () => {
  return (
    <View style={styles.container}>
<Image
  source={Logo}
  style={styles.img}
  resizeMode="contain"
/>

      <Text style={styles.title}>Welcome to the Rasberry Pi competition</Text>

      <Text style={{marginTop: 10, marginBottom: 30 }}>Click below to view the voltage of the batteries</Text>

      <Link href="/about" style={styles.link}>About Page</Link>

    </View>
  )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
      fontWeight: 'bold',
      fontSize: 18
    },
    img: {
      marginVertical:20,
      width: 150, 
      height: 150 
    },
    link: {
        marginVertical: 10,
        borderBottomWidth: 1
    }
})