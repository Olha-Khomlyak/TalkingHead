import React, {useEffect, useState, useRef} from 'react';
import {View, Text, PermissionsAndroid, TextInput} from 'react-native';
import LottieView from 'lottie-react-native';
import RtcEngine, {
  AudioVolumeIndication,
  AudioVoiceChanger,
  RtcEngineEvents,
  enableAudioVolumeIndication,
} from 'react-native-agora';
import {Button} from 'react-native-elements';
const appId = 'd55d41d18ec948608817759bf5318d72';
const token =
  '006d55d41d18ec948608817759bf5318d72IABeoZTAIZkIYon77BE04HPMr8+5fGBongIvc3HLem8Hq28tgHwAAAAAIgAbEuQAmZzyYQQAAQCZnPJhAwCZnPJhAgCZnPJhBACZnPJh';
const channel = 'inter';

const App = () => {
  const [engine, setEngine] = useState();
  const [currentSpeaker, setCurrentSpeaker] = useState();
  const [animationSpeed, setSpeed] = useState(0);
  const [volume, setVolume] = useState(0);
  const [text, setText] = useState('');

  const animationRef = useRef();

  useEffect(() => {
    reqestPermission();
  }, []);

  useEffect(() => {
    if (currentSpeaker != 0 && volume >= 100) {
      animationRef.current.play();
      setSpeed(1);
      console.log('REMOTE SPEAKER');
    } else {
      setSpeed(0);
      animationRef.current.reset();
    }
  }, [currentSpeaker, volume]);

  const reqestPermission = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
      if (
        granted['android.permission.RECORD_AUDIO'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.CAMERA'] ===
          PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('You can use the cameras & mic');
        init(appId);
        setSpeed(0);
        animationRef.current.reset();
      } else {
        console.log('Permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const init = async id => {
    console.log('INIT AGORA');
    setEngine(await RtcEngine.create(id));
  };

  const startCall = async () => {
    console.log('START CALL');
    await engine.enableAudioVolumeIndication(1000, 3, true).then(res => {
      console.log('enableAudioVolumeIndication: ', res);
    });
    await engine.joinChannel(text, channel, null, 0);
    engine.addListener('UserOffline', (uid, reason) => {
      endCall();
    });
    engine.addListener('AudioVolumeIndication', id => {
      if (id[0]) {
        setCurrentSpeaker(parseInt(id[0].uid));
        setVolume(parseInt(id[0].volume));
        console.log('AudioVolumeIndication: ', id[0]);
      }
    });
  };

  const endCall = async () => {
    setSpeed(0);
    animationRef.current.reset();
    await engine.leaveChannel();
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Text style={{textAlign: 'center', fontSize: 27}}>Animation Trial</Text>
      <TextInput
        style={{borderWidth: 1, margin: 10}}
        onChangeText={value => setText(value)}
        value={text}
        placeholder='Enter token'
      />
      <Button
        title="Start call"
        buttonStyle={{backgroundColor: 'green', margin: 10}}
        onPress={startCall}
      />
      <Button
        title="End call"
        buttonStyle={{backgroundColor: 'red', margin: 10}}
        onPress={endCall}
      />
      <LottieView
        ref={animationRef}
        source={require('./30421-talking-boy-animation.json')}
        speed={animationSpeed}
        loop
        style={{width: 100, height: 100, alignSelf: 'center'}}
      />
    </View>
  );
};

export default App;
