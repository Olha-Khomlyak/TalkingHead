import React from 'react';
import { View, Text, Button } from 'react-native';
import LottieView from 'lottie-react-native';

const App = () => {
  return (
    <View style={{flex:1, backgroundColor:'white'}}>
      <Text style={{textAlign:'center', fontSize:27}}>Animation Trial</Text>
      <Button 
      title='Start call'
      />
      <Text>`{"\n"}`</Text>
      <Button 
      title='End call'
      />
      <LottieView source={require('./30421-talking-boy-animation.json')} autoPlay loop />
    </View>
  );
}

export default App;