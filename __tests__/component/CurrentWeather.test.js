import React from 'react';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import CurrentWeather, {CurrentWeather_} from '../../src/components/CurrentWeather/CurrentWeather'

Enzyme.configure({ adapter: new Adapter() })

describe("CurrentWeather", () => {
  it('Render without error', async() => {
    const elem = await renderer
    .create(<CurrentWeather_ temperature={25} humidity={75}/>)
    .toJSON();

    expect(elem).toMatchSnapshot();
  });
});

describe("<CurrentWeather> UI Component", () => {
  const initialState = {weather: {temperature: 0, humidity: 0}};
  const mockStore = configureStore();
  let store, container, dumbContainer;

  beforeAll(() => {
    store = mockStore(initialState);
    container = shallow(<CurrentWeather store={store}/>);
    dumbContainer = shallow(<CurrentWeather_ temperature={25} humidity={75}/>);
  })
  it('render default connect CurrentWeather', () => {
    expect(container.prop('temperature')).toEqual(initialState.weather.temperature);
  });

  it('render default dumb CurrentWeather', () => {
    expect(dumbContainer.find('div.weather_temperature').text()).toEqual('25°C');
  });
})