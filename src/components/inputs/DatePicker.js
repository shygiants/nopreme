import React, {Component} from 'react';
import {Box, Text, Calendar} from 'grommet';

import moment from 'moment-timezone';
require('moment/locale/ko');

export default class DatePicker extends Component {
    componentDidMount() {
        const {name, label, value, onChange} = this.props;

        const date = this.convertToISO(value);
        
        onChange(date);

    }

    convertToISO(date) {
        let parsed;
        if (date instanceof Date) {
            parsed = date;
        } else {
            parsed = new Date(date);

            if (parsed.toString() === 'Invalid Date') {
                parsed = moment.tz(date, 'LL', 'Asia/Seoul').format();

                if (parsed.toString() === 'Invalid date') {
                    const now = new Date();
                    now.setHours(0);
                    now.setMinutes(0);
                    now.setSeconds(0);
                    now.setMilliseconds(0);
                    parsed = now.toISOString();
                }

                return parsed;
            }
        }

        return parsed.toISOString();
    }

    format(date) {
        return moment.tz(date, 'Asia/Seoul').format('LL');
    }

    render() {
        const {name, label, value, onChange} = this.props;

        const date = this.convertToISO(value);

        return (
            <Box
                gap='small'
            >
                <Text
                    size='small'
                    color='brand'
                >
                    {label}
                </Text>
                <Text
                    weight='bold'
                    margin='small'
                >
                    {this.format(date)}
                </Text>
                <Calendar
                    size='small'
                    date={date}
                    onSelect={onChange}
                />
            </Box>
        );
    }
}