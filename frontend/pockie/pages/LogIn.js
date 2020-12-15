import React, { Component } from 'react';
import { View, Image } from 'react-native';
import {
	colors,
	Row,
	Label,
	Input,
	Button,
	ButtonText,
	Welcome
} from '../utils/theme';

import Spinner from 'react-native-loading-spinner-overlay';
import Layout from '../components/Layout';
import Error from '../components/Error';

import { signIn } from '@okta/okta-react-native';

const image = {
	width: 298,
	height: 210
};

export default class LogIn extends Component {
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
		const { navigation } = this.props;
		signIn({ username, password })
			.then((token) => {
				this.setState(
					{
						progress: false,
						username: '',
						password: '',
						error: ''
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
		return (
			<Layout>
				<View style={{ height: '45%' }}>
					<Image
						source={require('../assets/images/initial_context.png')}
						style={image}
					/>
				</View>
				<Welcome>WELCOME TO POCKIE</Welcome>
				<Row>
					<Spinner
						visible={progress}
						textContent={'Loading...'}
						textStyle={{
							color: '#000'
						}}
					/>
					<Error error={error} />
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
