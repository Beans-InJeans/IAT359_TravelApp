import { View, Text } from 'react-native';
import GlobalStyles from '../../styles/GlobalStyles';

export default function List() {
  return(
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.header}>List view screen</Text>
    </View>
  );
}