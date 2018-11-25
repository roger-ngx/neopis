import userService from "../services/userService";
import sensorService from "../services/sensorService";
import _ from 'lodash';

export const UPDATE_DATE_TIME = 'UPDATE_DATE_TIME';
export const UPDATE_WEATHER = 'UPDATE_WEATHER';
export const UPDATE_LOCATION = 'UPDATE_LOCATION';
export const UPDATE_SOLAR_ENERGY = 'UPDATE_SOLAR_ENERGY';
export const UPDATE_BATTERY_STORAGE = 'UPDATE_BATTERY_STORAGE';
export const UPDATE_GENERATED_ELECTRICITY = 'UPDATE_GENERATED_ELECTRICITY';
export const UPDATE_SUMMARY_CHART = 'UPDATE_SUMMARY_CHART';
export const UPDATE_CURRENT_USER = 'UPDATE_CURRENT_USER';
export const UPDATE_CHART_DATA = 'UPDATE_CHART_DATA';
export const INITIAL_CHART_DATA = 'INITIAL_CHART_DATA';

export const updateDateTime = content => ({
  type: UPDATE_DATE_TIME,
  content
});

export const updateWeather = content => ({
  type: UPDATE_WEATHER,
  content
});

export const updateLocation = content => ({
  type: UPDATE_LOCATION,
  content
});

export const updateSolarEneryInformation = content => ({
  type: UPDATE_SOLAR_ENERGY,
  content
});

export const updateBatteryInfor = content => ({
  type: UPDATE_BATTERY_STORAGE,
  content
});

export const updateGeneratedElectricity = content => ({
  type: UPDATE_GENERATED_ELECTRICITY,
  content
});

export const updateSummaryChart = content => ({
  type: UPDATE_SUMMARY_CHART,
  content
});

export const updateCurrentUser = content => ({
  type: UPDATE_CURRENT_USER,
  content
});

export const initialChartData = content => ({
  type: INITIAL_CHART_DATA,
  content
});

export const getUsersMe = () => dispatch => userService.me().then(res => dispatch(updateCurrentUser(res.data)))

export const getInitialDataForChart =
  (gwId, params) =>
    dispatch =>
      sensorService.getSensorsData(gwId, params)
        .then(res => {
          const sensorData = _.filter(_.get(res, 'data.data.sensors'), data => _.isObject(data));

          sensorData && dispatch(initialChartData(sensorData))
        });

