import { readFileSync } from 'fs'
import { Reader, CityResponse } from 'maxmind'

let buffer: Buffer
try {
  buffer = readFileSync('/var/maxmind/GeoIP2-City.mmdb')
} catch (error) {
  throw new Error('Database file not found, please mount to /var/maxmind/GeoIP2-City.mmdb')
}

export default new Reader<CityResponse>(buffer)
