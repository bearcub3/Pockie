import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text } from 'react-native';
import styled from 'emotion-native-extended';
import { connect } from 'react-redux';

import DropDownPicker from 'react-native-dropdown-picker';
import { VictoryBar, VictoryChart, VictoryTheme } from 'victory-native';

import { colors, fonts, StateTitleText, Row } from '../utils/theme';
import {
	typesOfResult,
	decimalPointGenerator,
	colorsOfResult,
	weeklyCategories,
} from '../utils/helper';

import SubLayout from '../components/SubLayout';
import StateContext from '../context/StateContext';
import Tab2 from '../components/Tab2';
import SectionAccordion from '../components/SectionAccordion';

const menus = ['WEEKLY', 'MONTHLY', 'YEARLY'];

const YearText = styled.Text`
	font-family: ${fonts.main};
	font-size: 16;
	color: ${(props) => props.color};
	margin: 0;
	padding: 0;
`;

const MonthText = styled.Text`
	font-family: ${fonts.main};
	font-size: 40;
	color: ${(props) => props.color};
	margin-top: -15;
`;

function States({ navigation, user, weeksOfMonth, weekly, monthly, goals }) {
	const [active, setActive] = useState(0);
	const [monthlyData, setMonthly] = useState(null);
	const [current, setWeek] = useState(weekly.weekly_expense.length - 1);
	const [totals, setTotal] = useState([]);
	const [purpose, setPurpose] = useState(null);

	const handleActive = (param) => setActive(param);

	useEffect(() => {
		let totalExpense = 0;
		let totalIncome = 0;
		let totalSaving = 0;

		const tempMonthly = Object.entries(monthly).filter(
			(item, idx) => idx === 1 || idx === 2 || idx === 3
		);
		setMonthly(tempMonthly);

		const categoriesList = weeklyCategories.map((category, idx) =>
			weekly[category][current].filter(
				(day) => day[Object.keys(day)[0]] !== null
			)
		);

		const filteredObj = categoriesList.map((category, idx) =>
			category.flatMap((day) => day[Object.keys(day)])
		);

		filteredObj.map((type, idx) =>
			type.map((detail) => {
				switch (idx) {
					case 0:
						return (totalExpense += +detail.amount);
					case 1:
						return (totalIncome += +detail.amount);
					case 2:
						return (totalSaving += +detail.amount);
					default:
				}
			})
		);
		setTotal([totalExpense, totalIncome, totalSaving]);

		const details = filteredObj.map((type, idx) =>
			type.map((detail) => {
				let dataType = { type: null, amount: 0 };
				if (idx !== 2) {
					dataType.type = detail.type;
					dataType.amount = detail.amount;
					return dataType;
				} else {
					const currentGoal = detail.goal_id;
					const goalDetail = goals.filter(
						(goal) => goal.id === currentGoal
					);
					dataType.type = goalDetail[0].purpose;
					dataType.amount = detail.amount;
					return dataType;
				}
			})
		);
		setPurpose(details);
	}, [monthly, weekly, current]);

	return (
		<SubLayout title="Finance State" prev={navigation}>
			<StateContext.Provider value={menus}>
				<Tab2 handleActive={handleActive} active={active} />
			</StateContext.Provider>
			<ScrollView>
				{active === 0 && (
					<View
						style={{
							marginLeft: 30,
							marginRight: 30
						}}>
						<Row
							style={{
								alignItems: 'flex-start',
								position: 'relative',
								zIndex: 0
							}}>
							<YearText color={colors.blue3}>
								{monthly && monthly.year}
							</YearText>
							<MonthText color={colors.blue1}>
								{monthly && monthly.month}
							</MonthText>
							{weeksOfMonth.length > 0 && (
								<DropDownPicker
									items={weeksOfMonth}
									defaultValue={weeksOfMonth[0].value}
									containerStyle={{
										height: 40,
										width: '50%',
										position: 'relative',
										top: -65,
										right: -160,
										zIndex: 0,
									}}
									style={{
										backgroundColor: '#fafafa',
										alignSelf: 'flex-end',
									}}
									itemStyle={{
										justifyContent: 'flex-start',
										paddingLeft: 5,
									}}
									dropDownStyle={{
										backgroundColor: `${colors.white}`
									}}
									activeItemStyle={{
										backgroundColor: `${colors.grey4}`
									}}
									onChangeItem={(item, idx) =>
										setWeek(item.value)
									}
								/>
							)}
							{weeklyCategories &&
								weeklyCategories.map((category, idx) => (
									<SectionAccordion
										key={category}
										category={category}
										currentIndex={idx}
										totals={totals && totals[idx]}
										purpose={purpose && purpose[idx]}
									/>
								))}
						</Row>
					</View>
				)}
				{active === 1 && (
					<View
						style={{
							marginLeft: 30,
							marginRight: 30
						}}>
						<Row
							style={{
								marginBottom: -5,
								alignItems: 'center',
							}}>
							<YearText color={colors.grey2}>
								{monthly && monthly.year}
							</YearText>
							<MonthText color={colors.grey1}>
								{monthly && monthly.month}
							</MonthText>
						</Row>
						{monthly &&
							monthlyData.map((type, idx) => (
								<Row
									key={type[0]}
									style={{
										borderBottomWidth: 1,
										borderBottomColor: colors.grey2,
										flexDirection: 'row',
										marginBottom: 0,
										marginTop: 10
									}}>
									<View
										style={{
											flexDirection: 'column',
											width: '25%',
											justifyContent: 'center',
										}}>
										<StateTitleText size="13">
											The month's
										</StateTitleText>
										<StateTitleText size="20">
											{typesOfResult(type[0])}
										</StateTitleText>
									</View>
									<View
										style={{
											width: '75%',
											flexDirection: 'row',
											justifyContent: 'flex-end',
											alignItems: 'center',
										}}>
										{decimalPointGenerator(
											type[1],
											colorsOfResult(idx)
										)}
									</View>
								</Row>
							))}
					</View>
				)}
				{active === 2 && (
					<View
						style={{
							marginLeft: 30,
							marginRight: 30
						}}>
						<Row
							style={{
								marginBottom: -5,
								alignItems: 'center',
							}}
						/>
					</View>
				)}
			</ScrollView>
		</SubLayout>
	);
}

function mapStateToProps(state) {
	const { user, weekly, monthly, goals, savings } = state.authentication;

	const weeksOfMonth = weekly.weekly_expense.map((week, idx) => {
		if (idx === 0) {
			return {
				label: 'This week',
				value: idx,
			};
		} else if (idx === 1) {
			return {
				label: 'Last week',
				value: idx,
			};
		} else if (idx === 2) {
			return {
				label: `${idx} weeks ago`,
				value: idx,
			};
		} else {
			return {
				label: `${idx} weeks ago`,
				value: idx,
			};
		}
	});

	return {
		user,
		weeksOfMonth,
		weekly,
		monthly,
		goals,
	};
}

export default connect(mapStateToProps)(States);
