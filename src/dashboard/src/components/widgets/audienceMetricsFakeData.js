/* eslint-disable no-param-reassign */
import moment from 'moment'

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min // Максимум не включается, минимум включается
}

const maxByDayOfWeek = {
  1: 3500,
  2: 4000,
  3: 4600,
  4: 4800,
  5: 4700,
  6: 4100,
  7: 4000
}

export default () => {
  const data = []
  const current = moment('2020-08-01')
  const end = moment('2020-08-15')

  while (current.unix() < end.unix()) {
    const week = current.format('E')
    data.push({
      'Sessions.date': current.format('YYYY-MM-DD'),
      'Sessions.pageviews': getRandomInt(maxByDayOfWeek[week] - 500, maxByDayOfWeek[week]),
      'Sessions.count': getRandomInt(maxByDayOfWeek[week] - 1000, maxByDayOfWeek[week] - 500),
      'Sessions.events': getRandomInt(maxByDayOfWeek[week] - 1500, maxByDayOfWeek[week] - 1000),
      'Sessions.visitors': getRandomInt(maxByDayOfWeek[week] - 2000, maxByDayOfWeek[week] - 1500)
    })
    current.add(1, 'days')
  }

  return data
}
