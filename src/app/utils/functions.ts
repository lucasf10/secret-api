import NodeGeocoder from 'node-geocoder'

export const getCity = async (latitude: number, longitude: number): Promise<string> => {
  const options: NodeGeocoder.Options = {
    provider: 'teleport'
  }

  const geocoder = NodeGeocoder(options)
  const data = await geocoder.reverse({ lat: latitude, lon: longitude })

  return data[0].city
}
