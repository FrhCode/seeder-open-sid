export default function generateRandomLatLongInRadius(
  latitude: number,
  longitude: number,
  radius: number
): [number, number] {
  // Earth's radius in kilometers
  const earthRadius = 6371.0

  // Convert latitude and longitude to radians
  const latRad = toRadians(latitude)
  const longRad = toRadians(longitude)

  // Generate a random bearing (in radians) between 0 and 2*pi
  const bearingRad = Math.random() * 2 * Math.PI

  // Convert radius from kilometers to radians
  const radiusRad = radius / earthRadius

  // Calculate new latitude
  const newLatRad = Math.asin(
    Math.sin(latRad) * Math.cos(radiusRad) +
      Math.cos(latRad) * Math.sin(radiusRad) * Math.cos(bearingRad)
  )

  // Calculate new longitude
  const newLongRad =
    longRad +
    Math.atan2(
      Math.sin(bearingRad) * Math.sin(radiusRad) * Math.cos(latRad),
      Math.cos(radiusRad) - Math.sin(latRad) * Math.sin(newLatRad)
    )

  // Convert new latitude and longitude back to degrees
  const newLatitude = toDegrees(newLatRad)
  const newLongitude = toDegrees(newLongRad)

  return [newLatitude, newLongitude]
}

// Helper function to convert degrees to radians
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

// Helper function to convert radians to degrees
function toDegrees(radians: number): number {
  return radians * (180 / Math.PI)
}
