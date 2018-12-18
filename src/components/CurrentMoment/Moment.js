import React, { Component } from 'react';
import * as moment from 'moment';
import 'moment/locale/ko';

export function withMoment(Current) {
    return class Moment extends Component {

        constructor(props) {
            super(props);
            moment.locale('kr');

            this.state = {
                date: '',
                time: ''
            }
        }

        componentDidMount() {
            setInterval(() => {
                const [date, time] = moment().format('YYYY / MM / DD / dddd,HH:mm:ss').split(',');
                this.setState({ date, time })
            }, 1000);
        }

        render() {
            return <Current {...this.state} />
        }
    }
}