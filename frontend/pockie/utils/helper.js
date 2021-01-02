import React from 'react';
import { View } from 'react-native';
import { StateNumber } from './theme';
import { colors } from './theme';

export const getRequestOption = {
	method: 'GET',
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
	{ label: 'Saving money', value: 3 },
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
	{ label: 'ETC', value: 10 }
];

export const incomeTypes = [
	{ label: 'Salary, Wages', value: 0 },
	{ label: 'Investments', value: 1 },
	{ label: 'Gifts', value: 2 },
	{ label: 'Allowant/Pocket Money', value: 3 },
	{ label: 'ETC', value: 4 },
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
					alignItems: 'center',
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
					alignItems: 'center',
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
	'weekly_saving'
];
