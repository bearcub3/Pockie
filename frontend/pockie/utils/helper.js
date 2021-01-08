import React from 'react';
import { View } from 'react-native';
import { StateNumber } from './theme';
import { colors } from './theme';

export const getRequestOption = {
	method: 'GET'
};

export function handleResponse(response) {
	return response.json().then((data) => {
		// data && JSON.parse(data);
		if (!response.ok) {
			if (response.status === 401) {
				console.log(response.status);
			}

			const error = (data && data.message) || response.statusText;
			return Promise.reject(error);
		}

		return data;
	});
}

export function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

export const savingPurpose = [
	{ label: 'Buying a house', value: 0 },
	{ label: 'For holidays', value: 1 },
	{ label: 'Family plan', value: 2 },
	{ label: 'Saving money', value: 3 }
];

export const expenseTypes = [
	{ label: 'Rent, Mortage', value: 0 },
	{ label: 'Utilities, Bills', value: 1 },
	{ label: 'Grocery', value: 2 },
	{ label: 'Shopping', value: 3 },
	{ label: 'Entertainment', value: 4 },
	{ label: 'Transportation, Car', value: 5 },
	{ label: 'Healthcare/Medical', value: 6 },
	{ label: 'Personal', value: 7 },
	{ label: 'Education', value: 8 },
	{ label: 'Gift/Donations', value: 9 },
	{ label: 'ETC', value: 10 },
];

export const incomeTypes = [
	{ label: 'Salary, Wages', value: 0 },
	{ label: 'Investments', value: 1 },
	{ label: 'Gifts', value: 2 },
	{ label: 'Allowant/Pocket Money', value: 3 },
	{ label: 'ETC', value: 4 }
];

export const typesOfResult = (value) => {
	const strings = value.split('_');
	switch (strings[1]) {
		case 'expense':
			return 'Expense';
		case 'income':
			return 'Income';
		case 'saving':
			return 'Saving';
		default:
	}
};

export const decimalPointGenerator = (value, color) => {
	const strings = value.toString();
	if (strings.includes('.')) {
		const numbers = strings.split('.');
		return (
			<View
				style={{
					flex: 1,
					flexDirection: 'row',
					justifyContent: 'flex-end',
					alignItems: 'center'
				}}>
				<StateNumber size="43" color={color}>
					{numbers[0]}
				</StateNumber>
				<StateNumber size="25" color={color}>
					.{numbers[1]}
				</StateNumber>
			</View>
		);
	} else {
		return (
			<View
				style={{
					flex: 1,
					flexDirection: 'row',
					justifyContent: 'flex-end',
					alignItems: 'center'
				}}>
				<StateNumber size="43" color={color}>
					{strings}
				</StateNumber>
			</View>
		);
	}
};

export const colorsOfResult = (value) => {
	switch (value) {
		case 0:
			return colors.blue1;
		case 1:
			return colors.red;
		case 2:
			return colors.green;
		default:
	}
};

export const weeklyCategories = [
	'weekly_expense',
	'weekly_income',
	'weekly_saving',
];

export const yearlyIncome = [
	{ month: 'Jan', data: 5000 },
	{ month: 'Feb', data: 4500.5 },
	{ month: 'Mar', data: 6500 },
	{ month: 'Apr', data: 5000 },
	{ month: 'May', data: 5500 },
	{ month: 'Jun', data: 7000.85 },
	{ month: 'Jul', data: 6200 },
	{ month: 'Aug', data: 7400 },
	{ month: 'Sep', data: 4900 },
	{ month: 'Oct', data: 3850 },
	{ month: 'Nov', data: 4050 },
	{ month: 'Dec', data: 4320 }
];

export const yearlyExpense = [
	{ month: 'Jan', data: 3800 },
	{ month: 'Feb', data: 3000 },
	{ month: 'Mar', data: 3500 },
	{ month: 'Apr', data: 3480 },
	{ month: 'May', data: 4220.95 },
	{ month: 'Jun', data: 4030 },
	{ month: 'Jul', data: 4500 },
	{ month: 'Aug', data: 6400.3 },
	{ month: 'Sep', data: 3600 },
	{ month: 'Oct', data: 3000 },
	{ month: 'Nov', data: 3200.55 },
	{ month: 'Dec', data: 3400 }
];

export const yearlySaving = [
	{ month: 'Jan', data: 900 },
	{ month: 'Feb', data: 1000 },
	{ month: 'Mar', data: 1500 },
	{ month: 'Apr', data: 900 },
	{ month: 'May', data: 500 },
	{ month: 'Jun', data: 2000 },
	{ month: 'Jul', data: 1000 },
	{ month: 'Aug', data: 1000 },
	{ month: 'Sep', data: 1000 },
	{ month: 'Oct', data: 600 },
	{ month: 'Nov', data: 700 },
	{ month: 'Dec', data: 1000 }
];

// https://stackoverflow.com/questions/3108986/gaussian-bankers-rounding-in-javascript
export function bankersRound(n, d = 2) {
	var x = n * Math.pow(10, d);
	var r = Math.round(x);
	var br = Math.abs(x) % 1 === 0.5 ? (r % 2 === 0 ? r : r - 1) : r;
	return br / Math.pow(10, d);
}
