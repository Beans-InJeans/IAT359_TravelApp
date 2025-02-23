import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-web';

export default function SignUp() {
    return(
        <View>
            <Text>Sign Up</Text>
            <TextInput
                onChangeText={onChangeText}
                value={firstname}
                placeholder='First Name'
            />
            <TextInput
                onChangeText={onChangeText}
                value={lastname}
                placeholder='Last Name'
            />
            <TextInput
                onChangeText={onChangeText}
                value={email}
                placeholder='Email'
            />
            <TextInput
                onChangeText={onChangeText}
                value={username}
                placeholder='Username'
            />
            <TextInput
                onChangeText={onChangeText}
                value={password}
                placeholder='Password'
            />
        </View>
    );
}