import { DayPresentation } from '../cnfs';
import { StructureOpeningPresentation } from './structure.presentation';

interface TimeRange {
  start: Time;
  end: Time;
}

type OpeningHours = Map<DayPresentation, TimeRange[]>;

enum OpenStatus {
  AnotherDay = 'another-day',
  Now = 'now',
  Today = 'today'
}

interface Time {
  hours: number;
  minutes: number;
}

const SUNDAY_INDEX: number = 6;

const STARTING_TIME_INDEX: number = 0;

const ENDING_TIME_INDEX: number = 1;

const AVAILABLE_DAYS: DayPresentation[] = [
  DayPresentation.Monday,
  DayPresentation.Tuesday,
  DayPresentation.Wednesday,
  DayPresentation.Thursday,
  DayPresentation.Friday,
  DayPresentation.Saturday,
  DayPresentation.Sunday
];

const getDayWithMondayAsFirstWeekDay = (day: number): number => (day === 0 ? SUNDAY_INDEX : day - 1);

const selectAvailableDaysOnNextWeek = (openingDays: DayPresentation[], today: number): DayPresentation[] =>
  openingDays.filter((openingDay: DayPresentation): boolean => AVAILABLE_DAYS.indexOf(openingDay) <= today);

const selectAvailableDaysOnThisWeek = (openingDays: DayPresentation[], today: number): DayPresentation[] =>
  openingDays.filter((openingDay: DayPresentation): boolean => AVAILABLE_DAYS.indexOf(openingDay) > today);

const selectNearestOpeningDay = (openingDays: DayPresentation[], today: number): DayPresentation =>
  [...selectAvailableDaysOnThisWeek(openingDays, today), ...selectAvailableDaysOnNextWeek(openingDays, today)][0];

const getNextOpeningDay = (openStatus: OpenStatus, todayIndex: number, openingHours: OpeningHours): DayPresentation =>
  openStatus === OpenStatus.Today ? AVAILABLE_DAYS[todayIndex] : selectNearestOpeningDay([...openingHours.keys()], todayIndex);

const makeTime = (hours: number = 0, minutes: number = 0): Time => ({
  hours,
  minutes
});

const getOpeningHourAtTimeIndex = (openingHours: string, timeIndex: number): string =>
  openingHours.includes('-') ? openingHours.split("-")[timeIndex].trim() : '';

const timeFromOpeningHour = (openingHours: string, timeIndex: number): Time =>
  getOpeningHourAtTimeIndex(openingHours, timeIndex)
    .split("h")
    .reduce(
      (accumulator: Time, timeString: string, index: number): Time =>
        index === 0 ? makeTime(Number(timeString)) : makeTime(accumulator.hours, Number(timeString)),
      makeTime()
    );

const selectCurentOpenStatus = (openStatus: OpenStatus, timeRangeOpenStatus: OpenStatus): OpenStatus => {
  if (openStatus === OpenStatus.Now || timeRangeOpenStatus === OpenStatus.Now) return OpenStatus.Now;
  if (timeRangeOpenStatus === OpenStatus.Today) return OpenStatus.Today;

  return openStatus;
};

const isCurrentTimeBeforeStartingTime = (currentTime: Time, startingTime: Time): boolean =>
  currentTime.hours < startingTime.hours ||
  (currentTime.hours === startingTime.hours && currentTime.minutes < startingTime.minutes);

const isCurrentTimeAfterEndingTime = (currentTime: Time, endingTime: Time): boolean =>
  currentTime.hours > endingTime.hours || (currentTime.hours === endingTime.hours && currentTime.minutes > endingTime.minutes);

const toOpenStatus = (timeRange: TimeRange, currentTime: Time): OpenStatus => {
  if (isCurrentTimeBeforeStartingTime(currentTime, timeRange.start)) return OpenStatus.Today;
  if (isCurrentTimeAfterEndingTime(currentTime, timeRange.end)) return OpenStatus.AnotherDay;

  return OpenStatus.Now;
};

const getCurentTime = (date: Date): Time => makeTime(date.getHours(), date.getMinutes());

const getTodayOpeningHours = (openingHours: Map<DayPresentation, TimeRange[]>, date: Date): TimeRange[] =>
  openingHours.get(AVAILABLE_DAYS[getDayWithMondayAsFirstWeekDay(date.getDay())]) ?? [];

const getOpenStatus = (date: Date, openingHours: OpeningHours): OpenStatus =>
  getTodayOpeningHours(openingHours, date)
    .map((todayOpeningHour: TimeRange): OpenStatus => toOpenStatus(todayOpeningHour, getCurentTime(date)))
    .reduce(selectCurentOpenStatus, OpenStatus.AnotherDay);

export const getStructureOpening = (date: Date, openingHours: OpeningHours): StructureOpeningPresentation => {
  const openStatus: OpenStatus = getOpenStatus(date, openingHours);
  const isOpen: boolean = openStatus === OpenStatus.Now;

  return {
    isOpen,
    ...(isOpen || openingHours.size === 0
      ? {}
      : { nextOpeningDay: getNextOpeningDay(openStatus, getDayWithMondayAsFirstWeekDay(date.getDay()), openingHours) })
  };
};

const DEFAULT_OPENING_HOURS: OpeningHours = new Map<DayPresentation, TimeRange[]>();

const getTimeRanges = (openingHours: string): TimeRange[] =>
  openingHours.split('|').map(
    (openingHour: string): TimeRange => ({
      end: timeFromOpeningHour(openingHour, ENDING_TIME_INDEX),
      start: timeFromOpeningHour(openingHour, STARTING_TIME_INDEX)
    })
  );

export const formatOpeningHours = (weekOpeningHours: string[] = []): OpeningHours =>
  weekOpeningHours.reduce(
    (formattedOpeningHours: OpeningHours, openingHours: string, dayIndex: number): OpeningHours =>
      openingHours === ''
        ? formattedOpeningHours
        : new Map<DayPresentation, TimeRange[]>([...formattedOpeningHours.entries()]).set(
            AVAILABLE_DAYS[dayIndex],
            getTimeRanges(openingHours)
          ),
    DEFAULT_OPENING_HOURS
  );
