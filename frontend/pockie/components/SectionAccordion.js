import React, { Component } from 'react';
import { View, Text } from 'react-native';
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
	incomeTypes
} from '../utils/helper';

const ListText = styled.Text`
	font-family: ${fonts.plain};
	font-size: 16;
	color: ${(props) => props.color};
`;

class SectionAccordion extends Component {
	state = {
		activeSections: [],
	};

	_renderHeader = (section) => {
		return (
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					marginTop: 10,
				}}>
				<View>
					<StateTitleText size="13">The week's</StateTitleText>
					<StateTitleText size="20">
						{typesOfResult(section.title)}
					</StateTitleText>
				</View>
				{decimalPointGenerator(
					section.total,
					colorsOfResult(this.props.currentIndex)
				)}
			</View>
		);
	};

	_renderContent = (section) => {
		return (
			<View>
				{section.content.map((item) => (
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'space-between',
							marginBottom: 10
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

	render() {
		const { category, totals, purpose, currentIndex } = this.props;
		function typeGenerator(value) {
			switch (value) {
				case 0:
					return purpose.map((item, idx) => ({
						amount: item.amount,
						type: expenseTypes[idx].label,
					}));
				case 1:
					return purpose.map((item, idx) => ({
						amount: item.amount,
						type: incomeTypes[idx].label
					}));
				case 2:
					return purpose.map((item, idx) => ({
						amount: item.amount,
						type: savingPurpose[idx].label,
					}));
			}
		}

		const types = purpose && typeGenerator(currentIndex);

		const SECTIONS = [
			{
				title: category,
				total: totals || 0,
				content: types || 'loading',
			}
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
		weekly
	};
}

export default connect(mapStateToProps)(SectionAccordion);
