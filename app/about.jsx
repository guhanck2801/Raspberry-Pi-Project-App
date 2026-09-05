import { StyleSheet, View, Text, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { LineChart } from 'react-native-gifted-charts'
import { Link } from 'expo-router'

const PI_URL = 'http://192.168.1.100:5000/'
const MAX_POINTS = 10
const MAX_LABELS = 10   // match the number of points

const About = () => {

  const [battery1, setBattery1] = useState([])
  const [battery2, setBattery2] = useState([])
  const [battery3, setBattery3] = useState([])
  const [highest_battery, setHighestBattery] = useState(null)
  const [labels, setLabels] = useState([])

  const [cardWidth, setCardWidth] = useState(0)

  const screenWidth = Dimensions.get('window').width
  const horizontalPadding = 24 * 2 + 20 * 2
  const chartWidth = screenWidth - horizontalPadding

  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await fetch(PI_URL)
        if (!response.ok) return

        const json = await response.json()
        if (!json?.batteryReadings?.length) return

        const latestReadings = json.batteryReadings.slice(-MAX_POINTS)

        const latest = latestReadings[latestReadings.length -1]
        console.log("Latest JSON entry:", latest)

        setHighestBattery(Number(latest.highest_battery)
)
        setBattery1(
          latestReadings.map(item => ({
            value: Number(item.battery1.toFixed(2))
          }))
        )

        setBattery2(
          latestReadings.map(item => ({
            value: Number(item.battery2.toFixed(2))
          }))
        )

        setBattery3(
          latestReadings.map(item => ({
            value: Number(item.battery3.toFixed(2))
          }))
        )

        setLabels(
          latestReadings.map(item =>
            new Date(item.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false
            })
          )
        )

      } catch (err) {
        console.log('Fetch error:', err)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 1000)

    return () => clearInterval(interval)

  }, [])

  return (
    <View style={styles.container}>

      <Text style={styles.pageTitle}>Battery Monitor</Text>
      <Text style={styles.pageSubtitle}>
        Live voltage — last 60 seconds
      </Text>

      <View style={styles.card}>

        {battery1.length === 0 ? (
          <Text style={styles.waitingText}>
            Waiting for live data...
          </Text>
        ) : (
          <>
            <LineChart
              data={battery1}
              data2={battery2}
              data3={battery3}

              height={250}
              width={chartWidth}

              initialSpacing={0}
              endSpacing={0}
              spacing={chartWidth / MAX_POINTS}

              thickness={3}
              curved
              hideDataPoints

              color1="#d32f2f"
              color2="#1976d2"
              color3="#388e3c"

              rulesColor="#eeeeee"
              rulesThickness={1}

              minValue={11.5}
              maxValue={12.8}
              noOfSections={6}

              yAxisOffset={0}
              yAxisLabelWidth={40}
              yAxisTextStyle={{
                color: '#777',
                fontSize: 12,
              }}
            />

            {/* ✅ Custom X Axis */}
            <View style={styles.xAxisContainer}>
              {labels.map((label, index) => (
                <View
                  key={index}
                  style={styles.labelBox}
                >
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={styles.xAxisLabel}
                  >
                    {label}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#d32f2f' }]} />
            <Text style={styles.legendText}>Battery 1</Text>
          </View>

          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#1976d2' }]} />
            <Text style={styles.legendText}>Battery 2</Text>
          </View>

          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#388e3c' }]} />
            <Text style={styles.legendText}>Battery 3</Text>
          </View>
        </View>

        <View style={styles.radioContainer}>

          <View style={styles.radioItem}>
            <View style={styles.radioOuter}>
              {highest_battery === 1 && (
                <View style={[styles.radioInner, { backgroundColor: '#d32f2f' }]} />
              )}
            </View>
            <Text style={[styles.radioText, { color: '#d32f2f' }]}>
              Battery 1
            </Text>
          </View>

          <View style={styles.radioItem}>
            <View style={styles.radioOuter}>
              {highest_battery === 2 && (
                <View style={[styles.radioInner, { backgroundColor: '#1976d2' }]} />
              )}
            </View>
            <Text style={[styles.radioText, { color: '#1976d2' }]}>
              Battery 2
            </Text>
          </View>

          <View style={styles.radioItem}>
            <View style={styles.radioOuter}>
              {highest_battery === 3 && (
                <View style={[styles.radioInner, { backgroundColor: '#388e3c' }]} />
              )}
            </View>
            <Text style={[styles.radioText, { color: '#388e3c' }]}>
              Battery 3
            </Text>
          </View>

        </View>

     </View>

      <Link href="/" style={styles.homeLink}>
        Back Home
      </Link>

    </View>
  )
}

export default About

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
    padding: 24,
  },

  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },

  pageSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    paddingVertical: 24,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
    overflow: 'hidden',
  },

  waitingText: {
    textAlign: 'center',
    paddingVertical: 40,
    color: '#888',
    fontSize: 14,
  },

  xAxisContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',  // 👈 spreads evenly
  marginTop: 20,
  height: 90,
  width: '100%',
  },

  labelBox: {
  width: 30,          // 👈 controls spacing per label
  alignItems: 'center',
  },

  xAxisLabel: {
    fontSize: 11,
    color: '#777',
    width: 60,          // 👈 prevents wrapping
    textAlign: 'center',
    transform: [{ rotate: '-60deg' }],
  },

  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    gap: 28,
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },

  legendText: {
    fontSize: 13,
    color: '#444',
  },

  homeLink: {
    marginTop: 24,
    alignSelf: 'center',
    fontSize: 14,
    borderBottomWidth: 1,
  },

  radioContainer: {
  flexDirection: 'column',
  marginTop: 20,
  gap: 10,
},

radioItem: {
  flexDirection: 'row',
  alignItems: 'center',
},

radioOuter: {
  width: 16,
  height: 16,
  borderRadius: 8,
  borderWidth: 2,
  borderColor: '#999',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 8,
},

radioInner: {
  width: 8,
  height: 8,
  borderRadius: 4,
},

radioText: {
  fontSize: 14,
  fontWeight: '600',
}
})