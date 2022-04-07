import NodeGeocoder from 'node-geocoder'
import firebaseAdmin from 'firebase-admin'
import { NOTIFICATION_OPTIONS } from './constants'

export const getCity = async (latitude: number, longitude: number): Promise<string> => {
  const options: NodeGeocoder.Options = {
    provider: 'teleport'
  }

  const geocoder = NodeGeocoder(options)
  const data = await geocoder.reverse({ lat: latitude, lon: longitude })

  return data[0].city
}

export const sendNotification = (token: string, title: string, body: string) => {
  firebaseAdmin.messaging().sendToDevice(
    token,
    { notification: { title, body } },
    NOTIFICATION_OPTIONS
  )
}
