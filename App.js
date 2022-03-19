import React,{useEffect} from 'react';
import { Provider } from "react-redux";
import configureStore from "./stores/configureStore";
import { PersistGate } from "redux-persist/integration/react";
import { SafeAreaView,Platform, StatusBar, StyleSheet, View, Image, Text ,  TouchableOpacity,Linking,AsyncStorage,
} from 'react-native';
import * as Icon from '@expo/vector-icons';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import AppNavigator from './navigation/AppNavigator';
import SplashScreen from 'react-native-splash-screen';
import NotificationPopup from 'react-native-push-notification-popup';
import { subscriber } from './stores/messageService';
import Images from './assets/images/index';
import sosButton from './ios/assets/images/SOS.png';



export default class App extends React.Component {
  state = {
    isLoadingComplete: false
  };

  constructor(props) {
    super(props);
    const { persistor, store } = configureStore();
    this.persistor = persistor;
    this.store = store;
    this.state={  
      isVisible : true,  
     } 
  }

  componentWillUnmount() {
    if (subscriber)
      subscriber.unsubscribe();
  }

  clickHandler = async () =>{
    //function to handle click on floating Action Button 
    let customerCareNumber = await AsyncStorage.getItem('emergencyNumber')
     
        if(customerCareNumber != null){
          Linking.openURL(`tel:${customerCareNumber}`)
        }else {
          alert(" Login To Access SOS Button");
        }
  };

  componentDidMount() {

      var that = this;


    subscriber.subscribe((v) => {
      // console.log("data from subscription " + v);
      let message = v.data.message;
      if (this.popup) {
        this.popup.show({
          onPress: () => { console.log('Pressed') },
          appIconSource: Images.main_icon,
          appTitle: 'RoyalTravels',
          timeText: 'now',
          title: 'Royal Travels',
          body: message,
          // body: 'This is a sample message.\nTesting emoji 😀',
          slideOutTime: 5000
        });
      }
    })
  }

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen ) {
  
      SplashScreen.hide();
      return (
        <Provider store={this.store}>
          <PersistGate persistor={this.persistor}>
            <View style={styles.container}>
               
              {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
              <AppNavigator />
              <NotificationPopup ref={ref => this.popup = ref} />
          
              <TouchableOpacity
              activeOpacity={0.7}
              onPress={this.clickHandler}
              style={styles.touchableOpacityStyle}>
              <Image
                // FAB using TouchableOpacity with an image
                // For online image
            //    source={{
            //      uri:  'https://raw.githubusercontent.com/AboutReact/sampleresource/master/plus_icon.png',
            //    }}
                  source ={sosButton}
                // For local image
                //source={require('./images/float-add-icon.png')}
                style={styles.floatingButtonStyle}
              />
            </TouchableOpacity>
         
         
            </View>
          </PersistGate>
        </Provider>
      );


      
      }
    



      }
  

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        Roboto: require("native-base/Fonts/Roboto.ttf"),
        Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
        // Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf"),
        // Entypo: require("native-base/Fonts/Entypo.ttf"),
        // Feather: require("native-base/Fonts/Feather.ttf"),
        FontAwesome: require("native-base/Fonts/FontAwesome.ttf"),
        // MaterialIcons: require("native-base/Fonts/MaterialIcons.ttf"),
        // MaterialCommunityIcons: require("native-base/Fonts/MaterialCommunityIcons.ttf"),
        // Octicons: require("native-base/Fonts/Octicons.ttf"),
        // Zocial: require("@expo/vector-icons/fonts/Zocial.šttf"),
        // SimpleLineIcons: require("native-base/Fonts/SimpleLineIcons.ttf"),
        // EvilIcons: require("native-base/Fonts/EvilIcons.ttf"),
        // ...Ionicons.font,
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    // console.warn(error);
    console.disableYellowBox = true;
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };

  
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  titleStyle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
  },
  textStyle: {
    fontSize: 16,
    textAlign: 'center',
    padding: 10,
  },
  touchableOpacityStyle: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 100,
  },
  floatingButtonStyle: {
    resizeMode: 'contain',
    width: 50,
    height: 50,
    //backgroundColor:'black'
  },
});
