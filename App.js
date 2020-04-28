import React, { Component } from 'react';
import { View, Picker, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Text, Input, Button, Header, Card } from 'react-native-elements';
import { States } from './States.js';
import { isObjEmpty } from './helper.js';

let api = 'https://api.openweathermap.org/data/2.5/weather?units=imperial&';
let apiKey = '20c5fe03ecf74f09a0632223438e021c';

export default class WeatherApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      city: '', 
      weatherData: { },
      States: States,
      selectedState: States[0]
    };
    this.handleCityChange = this.handleCityChange.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.getTodaysWeather = this.getTodaysWeather.bind(this);
  }

  getTodaysWeather() {
    let here = this;
    fetch(api + 'q=' + here.state.city + ',' + here.state.selectedState + '&appid=' + apiKey)
    .then(res => res.json())
    .then((resJson) => {
      this.setState({ weatherData: resJson })
    })
    .catch(error => console.log(error))
  }

  handleCityChange(value) {
    this.setState({ city: value });
  }

  handleStateChange(value) {
    this.setState({ selectedState: value });
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1}}>
        <Header centerComponent={{ text: 'Weather App', style: { color: '#fff' } }} backgroundColor='#006554' />
        <Input value={this.state.city} onChangeText={this.handleCityChange} placeholder='City'
        style={{ flex: 1, color: 'black'}} />
        <Picker selectedValue={this.state.selectedState} onValueChange={this.handleStateChange} >
          { this.state.States.map((item, index) => {
            return (<Picker.Item label={item} value={item} key={index} />)
          })}
        </Picker>
        <Button title="Search" onPress={this.getTodaysWeather} disabled={this.state.city === ''} buttonStyle={{backgroundColor: '#006554'}} />

        <View style={{ flex: 4 }}>
          { !isObjEmpty(this.state.weatherData) && this.state.weatherData.cod === 200  &&
          <Card title={this.state.weatherData.name}>
            <Text><Text style={{fontWeight: 'bold'}}>Temperature:</Text> { Math.round(this.state.weatherData.main.temp) } &deg; F</Text>
            <Text><Text style={{fontWeight: 'bold'}}>H/L:</Text> { Math.round(this.state.weatherData.main.temp_max) + '/' + Math.round(this.state.weatherData.main.temp_min) } &deg; F</Text>
            <Text><Text style={{fontWeight: 'bold'}}>Feels Like:</Text> { Math.round(this.state.weatherData.main.feels_like) } &deg; F</Text>
            <Text><Text style={{fontWeight: 'bold'}}>Conditions:</Text> { this.state.weatherData.weather[0].description }</Text>
            <Text><Text style={{fontWeight: 'bold'}}>Wind:</Text> { Math.round(this.state.weatherData.wind.speed) } MPH</Text>
          </Card>
          }
          {
            this.state.weatherData.cod == 404 &&
            <Card>
              <Text h1>{this.state.weatherData.message}</Text>
            </Card>
          }
        </View>
      </View>
      </TouchableWithoutFeedback>
    );
  }
}