import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import styled from 'emotion-native-extended';

import { colors, fonts, StateTitleText } from '../utils/theme';

import Accordion from 'react-native-collapsible/Accordion';
import {
	typesOfResult,
	decimalPointGenerator,
	colorsOfResult,
	savingPurpose,
	expenseTypes,
	incomeTypes,
} from '../utils/helper';

const ListText = styled.Text`
	font-family: ${fonts.plain};
	font-size: 16;
	color: ${(props) => props.color};
`;

class SectionAccordion extends Component {
	state = {
		activeSections: []
	};

	_renderHeader = (section) => {
		const { currentIndex } = this.props;
		return (
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					marginTop: 10
				}}>
				<View>
					<StateTitleText size="13">The week's</StateTitleText>
					<StateTitleText size="20">
						{typesOfResult(section.title)}
					</StateTitleText>
				</View>
				{decimalPointGenerator(
					section.total[currentIndex],
					colorsOfResult(currentIndex)
				)}
			</View>
		);
	};

	_renderContent = (section) => {
		return (
			<View>
				{section.content.map((item, idx) => (
					<View
						key={item.type + `${idx}`}
						style={{
							flexDirection: 'row',
							justifyContent: 'space-between',
							marginBottom: 10,
						}}>
						<ListText color={colors.grey1}>{item.type}</ListText>
						<ListText color={colors.black}>{item.amount}</ListText>
					</View>
				))}
			</View>
		);
	};

	_updateSections = (activeSections) => {
		this.setState({ activeSections });
	};

	_typeGenerator = (value) => {
		switch (value) {
			case 0:
				return this.props.purpose.map((item, idx) => ({
					amount: item.amount,
					type: expenseTypes[item.type].label
				}));
			case 1:
				return this.props.purpose.map((item, idx) => ({
					amount: item.amount,
					type: incomeTypes[item.type].label,
				}));
			case 2:
				return this.props.purpose.map((item, idx) => ({
					amount: item.amount,
					type: savingPurpose[item.type].label
				}));
		}
	};

	render() {
		const { category, totals, currentIndex } = this.props;

		const SECTIONS = [
			{
				title: category,
				total: totals || 0,
				content: this._typeGenerator(currentIndex) || 'loading'
			},
		];

		return (
			<View
				style={{
					flex: 1,
					width: '100%',
					flexDirection: 'column',
					borderBottomWidth: 1,
					borderBottomColor: colors.grey2,
				}}>
				<Accordion
					sections={SECTIONS}
					activeSections={this.state.activeSections}
					renderHeader={this._renderHeader}
					renderContent={this._renderContent}
					onChange={this._updateSections}
				/>
			</View>
		);
	}
}

function mapStateToProps(state) {
	const { weekly } = state.authentication;
	return {
		weekly,
	};
}

export default connect(mapStateToProps)(SectionAccordion);
