import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { shallow } from 'enzyme';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import {CurrentMoment_} from '../../src/components/CurrentMoment/CurrentMoment';
import { withMoment } from '../../src/components/CurrentMoment/Moment';

Enzyme.configure({ adapter: new Adapter() })

describe('Current Moment component test', () => {
  it('should render datetime', () => {
    const CurrentMoment = withMoment(CurrentMoment_);

    const wrapper = shallow(<CurrentMoment />)

    expect(wrapper.first().is(CurrentMoment_)).toBe(true);
    
    const instance = wrapper.instance();

    instance.setState({date:'2132', time: '00000'});

    expect(wrapper.first().prop('time')).toEqual('00000');
  })

  it('test rendering', () => {
    const tree = renderer.create(<CurrentMoment_ />).toJSON();
    expect(tree).toMatchSnapshot();
  })

  it('render without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<CurrentMoment_ />, div);
  })
})