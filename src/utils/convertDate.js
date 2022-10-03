import { DateTime } from 'luxon';

export function convertToDateServer(valueISO, timeZone) {
  return DateTime.fromISO(valueISO, { zone: timeZone }).toUTC().toISO();
}

export function convertToDateUI(valueISO, timeZone, format = 'yyyy-MM-dd') {
  if (valueISO === undefined || valueISO === null) return valueISO;

  return DateTime.fromISO(valueISO).setZone(timeZone).toFormat(format);
}

export function convertToDateTimeUI(valueISO, timeZone, format = "yyyy-MM-dd'T'HH:mm") {
  if (valueISO === undefined || valueISO === null) return valueISO;

  return DateTime.fromISO(valueISO).setZone(timeZone).toFormat(format);
}
