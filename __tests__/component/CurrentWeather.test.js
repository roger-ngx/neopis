import React from 'react';
import CurrentWeather, {_CurrentWeather} from '../../src/components/CurrentWeather/CurrentWeather'
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';

Enzyme.configure({ adapter: new Adapter() })

describe("<CurrentWeather> UI Component", () => {
  const initialState = {weather: {temperature: 0, humidity: 0 }};
  const mockStore = configureStore();
  let store, container, dumbContainer;

  beforeEach(() => {
    store = mockStore(initialState);
    container = shallow(<CurrentWeather store={store}/>);
    dumbContainer = shallow(<_CurrentWeather temperature={25} humidity={75}/>);
  })
  it('render default connect CurrentWeather', () => {
    expect(container.prop('temperature')).toEqual(initialState.weather.temperature);
  });

  it('render default dumb CurrentWeather', () => {
    expect(dumbContainer.find('div.weather_temperature').text()).toEqual('25°C');
  })
})