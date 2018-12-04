import { updateWeather } from '../../../src/store/actionCreators';
import { neopisReducer } from '../../../src/store/neopisReducer';

describe('weather reducer', () => {
  it('UPDATE_WEATHER success', () => {
    const state = { weather: {} };
    const action = updateWeather({
      temperature: 25,
      humidity: 75
    });

    const result = neopisReducer(state, action);
    expect(result.weather).toEqual({
      temperature: 25,
      humidity: 75
    })
  })
})