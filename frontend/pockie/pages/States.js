import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text } from 'react-native';
import styled from 'emotion-native-extended';
import { connect } from 'react-redux';

import DropDownPicker from 'react-native-dropdown-picker';
import {
	VictoryAxis,
	VictoryBar,
	VictoryChart,
	VictoryTheme,
} from 'victory-native';

import { colors, fonts, StateTitleText, Row } from '../utils/theme';
import {
	typesOfResult,
	decimalPointGenerator,
	colorsOfResult,
	weeklyCategories,
	yearlyIncome,
	yearlyExpense,
	yearlySaving
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

const KeyShape = styled.View`
	background-color: ${(props) => props.color};
	width: 12px;
	height: 12px;
	border-radius: 12px;
`;

const KeyText = styled.Text`
	font-family: ${fonts.normal};
	font-size: 14;
	color: ${colors.black};
	margin: 0 15px;
`;

function ascendingOrder(data) {
	const array = data.sort((a, b) => a.data - b.data);
	return array[array.length - 1].data;
}

const reducer = (accumulator, currentValue) => accumulator + currentValue;

function States({
	navigation,
	user,
	weeksOfMonth,
	weekly,
	monthly,
	monthlyData,
	filteredObj,
	goals,
}) {
	const [active, setActive] = useState(0);
	const [current, setWeek] = useState(weekly.weekly_expense.length - 1);
	const [totals, setTotal] = useState([]);
	const [purpose, setPurpose] = useState(null);
	const [yearly, setYearly] = useState([]);

	const handleActive = (param) => setActive(param);

	useEffect(() => {
		let totalExpense = 0;
		let totalIncome = 0;
		let totalSaving = 0;

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
		setTotal((state) => [totalExpense, totalIncome, totalSaving]);

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

		const copyExpense = JSON.parse(JSON.stringify(yearlyExpense));
		const copyIncome = JSON.parse(JSON.stringify(yearlyIncome));

		const allSavings = yearlySaving.map(
			(saving) => saving[Object.keys(saving)[1]]
		);
		const expense4Year = ascendingOrder(copyExpense);
		const income4Year = ascendingOrder(copyIncome);
		setYearly([expense4Year, income4Year, allSavings.reduce(reducer)]);
	}, []);

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
							{purpose &&
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
						{monthlyData &&
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
								marginTop: -30,
								alignItems: 'center',
								justifyContent: 'center',
							}}>
							<VictoryChart
								domainPadding={{ x: 15, y: 10 }}
								theme={VictoryTheme.material}
								animate={{
									duration: 1000,
									onLoad: { duration: 500 },
									easeing: 'elasticInOut',
								}}>
								<VictoryAxis tickFormat={yearlyExpense.month} />
								<VictoryAxis
									dependentAxis
									tickFormat={(x) => `£${x / 1000}k`}
								/>
								<VictoryBar
									style={{ data: { fill: colors.red } }}
									data={yearlyIncome}
									x="month"
									y="data"
								/>
								<VictoryBar
									style={{ data: { fill: colors.blue1 } }}
									data={yearlyExpense}
									x="month"
									y="data"
								/>
								<VictoryBar
									style={{ data: { fill: colors.green } }}
									data={yearlySaving}
									x="month"
									y="data"
								/>
							</VictoryChart>
						</Row>
						<Row
							style={{
								flexDirection: 'row',
								justifyContent: 'center',
								alignItems: 'center',
								marginTop: -15,
							}}>
							<KeyShape color={colors.blue1} />
							<KeyText>Expense</KeyText>
							<KeyShape color={colors.red} />
							<KeyText>Income</KeyText>
							<KeyShape color={colors.green} />
							<KeyText>Saving</KeyText>
						</Row>
						{yearly &&
							yearly.map((type, idx) => (
								<Row
									key={type}
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
											{idx !== 2
												? 'The Highest'
												: 'Total'}
										</StateTitleText>
										{idx === 0 && (
											<StateTitleText size="20">
												Expense
											</StateTitleText>
										)}
										{idx === 1 && (
											<StateTitleText size="20">
												Income
											</StateTitleText>
										)}
										{idx === 2 && (
											<StateTitleText size="20">
												Saving
											</StateTitleText>
										)}
									</View>
									<View
										style={{
											width: '75%',
											flexDirection: 'row',
											justifyContent: 'flex-end',
											alignItems: 'center',
										}}>
										{decimalPointGenerator(
											type,
											colorsOfResult(idx)
										)}
									</View>
								</Row>
							))}
					</View>
				)}
			</ScrollView>
		</SubLayout>
	);
}

function mapStateToProps(state) {
	const { user, weekly, monthly, goals } = state.authentication;

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

	const monthlyData = Object.entries(monthly).filter(
		(item, idx) => idx === 1 || idx === 2 || idx === 3
	);

	const categoriesList = weeklyCategories.map((category, idx) =>
		weekly[category][0].filter((day) => day[Object.keys(day)[0]] !== null)
	);

	const filteredObj = categoriesList.map((category, idx) =>
		category.flatMap((day) => day[Object.keys(day)])
	);

	return {
		user,
		weeksOfMonth,
		weekly,
		monthly,
		monthlyData,
		filteredObj,
		goals
	};
}

export default connect(mapStateToProps)(States);
