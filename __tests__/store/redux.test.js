import { updateWeather } from '../../src/store/actionCreators';
import { neopisReducer } from '../../src/store/neopisReducer';
import deepFreeze from 'deep-freeze';

describe('weather reducer', () => {
  it('UPDATE_WEATHER success', () => {
    const state = { weather: {} };
    const action = updateWeather({
      temperature: 25,
      humidity: 75
    });

    deepFreeze(state);
    deepFreeze(action);

    const newState = neopisReducer(state, action);
    expect(newState.weather).toEqual({
      temperature: 25,
      humidity: 75
    })
  })
})