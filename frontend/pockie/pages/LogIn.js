import React, { Component } from 'react';
import { colors, Row, Label, Input, Button, ButtonText } from '../utils/theme';

import { connect } from 'react-redux';

import Header from '../components/Header';
import Spinner from 'react-native-loading-spinner-overlay';
import Layout from '../components/Layout';
import Error from '../components/Error';

import { userActions } from '../actions';
import { signIn } from '@okta/okta-react-native';

class LogIn extends Component {
	constructor(props) {
		super(props);

		this.state = {
			username: '',
			password: '',
			progress: false,
			error: ''
		};

		this.login = this.login.bind(this);
	}

	login() {
		this.setState({ progress: true });

		const { username, password } = this.state;
		const { navigation, getUser } = this.props;
		signIn({ username, password })
			.then((token) => {
				if (username.includes('a.smith')) {
					getUser(2);
				} else {
					getUser(1);
				}

				this.setState(
					{
						progress: false,
						username: '',
						password: '',
						error: '',
					},
					() => navigation.navigate('Profile')
				);
			})
			.catch((e) => {
				this.setState({ progress: false, error: e.message });
			});
	}

	render() {
		const { progress, error } = this.state;
		const { loadingState } = this.props;

		return (
			<Layout>
				<Header title="Log In" />

				<Spinner
					overlayColor="rgba(99, 168, 241, 0.7)"
					visible={progress || loadingState}
					textContent={'Loading...'}
					textStyle={{
						color: colors.white,
					}}
				/>
				<Error error={error} />
				<Row>
					<Label>Email Address</Label>
					<Input
						onChangeText={(username) => this.setState({ username })}
						placeholder="email"
					/>
					<Label>Password</Label>
					<Input
						secureTextEntry={true}
						placeholder="password"
						onChangeText={(password) => this.setState({ password })}
					/>
					<Button
						bgcolor={colors.blue2}
						style={{ marginTop: 40 }}
						onPress={this.login}>
						<ButtonText color={colors.white}>LOG IN</ButtonText>
					</Button>
				</Row>
			</Layout>
		);
	}
}

function mapStateToProps(state) {
	const { user, finance, loadingState } = state.authentication;
	return { user, finance, loadingState };
}

const actionCreators = {
	getUser: userActions.getUserData
};

export default connect(mapStateToProps, actionCreators)(LogIn);
