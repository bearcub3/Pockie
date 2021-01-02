import React, { Component } from 'react';
import { Alert } from 'react-native';
import { colors, Welcome, Row, Button, ButtonText } from '../utils/theme';

import Spinner from 'react-native-loading-spinner-overlay';
import Layout from '../components/Layout';
import Error from '../components/Error';

import { clearTokens } from '@okta/okta-react-native';

export default class Settings extends Component {
	constructor(props) {
		super(props);

		this.state = {
			progress: false,
			error: '',
		};

		this.logout = this.logout.bind(this);
	}

	logout() {
		this.setState({ progress: true });
		const { navigation } = this.props;

		clearTokens()
			.then(() => {
				this.setState({ progress: false }, () =>
					navigation.navigate('Home')
				);
			})
			.catch((e) => {
				this.setState({ error: e.message, progress: false });
				Alert.alert('Log Out Error', e.message, { cancelable: false });
			});
	}

	render() {
		const { progress, error } = this.state;
		return (
			<Layout>
				<Welcome>BYE FOR NOW</Welcome>
				<Row>
					<Spinner
						visible={progress}
						textContent={'Loading...'}
						textStyle={{
							color: '#000'
						}}
					/>
					<Error error={error} />
					<Button
						bgcolor={colors.blue2}
						style={{ marginTop: 40 }}
						onPress={this.logout}>
						<ButtonText color={colors.white}>LOG OUT</ButtonText>
					</Button>
				</Row>
			</Layout>
		);
	}
}
