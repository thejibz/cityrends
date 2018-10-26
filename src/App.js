import React, { Component } from 'react'
import WeatherCard from './components/WeatherCard'
import TweetCard from './components/TweetCard'
import PictureCard from './components/PictureCard'
import Grid from '@material-ui/core/Grid'

import CityTrends from './services/CityTrends'

import logo from './logo.svg'
import './App.css'

localStorage.debug = 'citytrends'
const debug = require('debug')('citytrends')
const axios = require('axios');

class App extends Component {

  citytrends = new CityTrends()

  constructor(props) {

    super(props)

    this.state = {
      city: "",
      weather: {
        loading: false,
        temp: "",
        desc: "",
        picture: ""
      },
      tweet: {
        loading: false,
        html: ""
      },
      picture: {
        loading: false,
        url: ""
      }
    }
  }

  handleChange = (e) => {

    this.setState({ city: e.target.value })
  }

  handleClick = (e) => {

    this.setState({
      picture: { loading: true },
      weather: { loading: true },
      tweet: { loading: true }
    })
    this.citytrends.fetchDataFor(this.state.city).then(data => {
      debug("(data) %o", data)

      this.setState({
        weather: {
          loading: false,
          temp: data.temp,
          desc: data.desc,
          picture: data.weather_pic_url,
        },
        picture: {
          loading: false,
          url: data.picture_url
        }
      })

      let tweet_url = "https://twitter.com/" + data.tweet.user.id_str + "/status/" + data.tweet.id_str
      debug("(tweet_url) %o", tweet_url)

      axios
        .get("https://cors-anywhere.herokuapp.com/https://publish.twitter.com/oembed?url=" + tweet_url, { headers: { "x-requested-with": "worldql" } })
        .then(tweet => {
          debug("(tweet) %o", tweet)

          this.setState({
            tweet: {
              html: tweet.data.html,
              loading: false
            }
          })
        }).catch(error => debug("(error) %o", error))
    })

    e.preventDefault()
  }

  render() {
    return (
      <div className="App" >
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to CityTrends</h1>
        </header>

        <input type="text" value={this.state.city} placeholder="Enter a city name" onChange={this.handleChange} style={{ margin: '10px' }} />
        <input type="button" value="GO" onClick={this.handleClick} style={{ margin: '10px' }} />
        <Grid
          container
          alignItems="center"
          justify="center">

          <div alignItems='center'>
            <WeatherCard loading={this.state.weather.loading} temp={this.state.weather.temp} desc={this.state.weather.desc} picture_url={this.state.weather.picture} />
            <TweetCard loading={this.state.tweet.loading} tweet={this.state.tweet.html} />
            <PictureCard loading={this.state.picture.loading} picture_url={this.state.picture.url} />
          </div>

        </Grid>

      </div>
    );
  }
}

export default App;
