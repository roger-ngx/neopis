import { UPDATE_DATE_TIME, 
  UPDATE_WEATHER, 
  UPDATE_LOCATION, 
  UPDATE_SOLAR_ENERGY, 
  UPDATE_BATTERY_STORAGE, 
  UPDATE_GENERATED_ELECTRICITY } from "./actionCreators";

const initialState = {
  dateTime: {
    date: '2018 / 10 / 26 / 수요일',
    time: '15:30:00'
  },
  weather: {
    temperature: 23,
    humidity: 75
  },
  location: '강원도 고성군 간성읍 금수리 산 40-4',
  solarEnergy: {
    thisMonth: 912.9,
    today: 23.9,
    percentage: 92
  },
  batteryStorage: {
    thisMonth: 456.7,
    today: 54.6,
    percentage: 66
  },
  generatedElectricity: {
    thisMonth: 876.5,
    today: 60.2,
    percentage: 32
  }
};

export function neopisReducer(state = initialState, action) {
  const newState = Object.assign({}, state);

  switch (action.type) {
    case UPDATE_DATE_TIME:
      newState.dateTime = action.content
      return newState;

    case UPDATE_WEATHER:
      newState.weather = action.content;
      return newState;

    case UPDATE_LOCATION:
      newState.location = action.content;
      return newState;

    case UPDATE_SOLAR_ENERGY:
      newState.solarEnergy = action.content;
      return newState;

    case UPDATE_BATTERY_STORAGE:
      newState.batteryStorage = action.content;
      return newState;

    case UPDATE_GENERATED_ELECTRICITY:
      newState.generatedElectricity = action.content;
      return newState;

    default:
      return state;
  }
}