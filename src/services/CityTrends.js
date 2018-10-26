const debug = require('debug')('citytrends')
const axios = require('axios');

class CityTrends {
    fetchDataFor(city) {

        const openAPIschemaWeather = "https://raw.githubusercontent.com/APIs-guru/openapi-directory/master/APIs/weatherbit.io/2.0.0/swagger.yaml"
        const openAPIschemaTwitter = "https://raw.githubusercontent.com/thejibz/openapi-directory/master/APIs/twitter.com/1.1/swagger.yaml"
        const openAPIschemaGoogle = "https://raw.githubusercontent.com/APIs-guru/openapi-directory/master/APIs/googleapis.com/customsearch/v1/swagger.yaml"

        const twitterHeaders = {
            "x-oauth-v1-consumer-key": process.env.WORLDQL_TWITTER_CONSUMER_KEY,
            "x-oauth-v1-consumer-secret": process.env.WORLDQL_TWITTER_CONSUMER_SECRET,
            "x-oauth-v1-signature-method": "HMAC-SHA1"
        }

        const gqlApis = [
            {
                schema: {url: openAPIschemaTwitter},
                headers: twitterHeaders
            },
            {
                schema: {url: openAPIschemaWeather},
                link: {
                    inType: "get_current_cities_cities_data_items_weather",
                    on: {
                        field: {
                            name: "search",
                            type: "get_v1",
                            schemaUrl: openAPIschemaGoogle,
                            query: {
                                name: "get_v1",
                                params: {
                                    static: {
                                        cx: process.env.WORLDQL_GOOGLE_CSE_CX, 
                                        key: process.env.WORLDQL_GOOGLE_CSE_KEY,
                                        safe: "active",
                                        imgSize: "medium",
                                        searchType: "image",
                                        num: 1
                                    },
                                    parent: [{
                                        q: "description"
                                    }],
                                    variables: {

                                    }
                                }
                            }
                        }
                    }
                }
            },
            {
                schema: {url: openAPIschemaGoogle}
            }
        ]

        const gqlQuery =
            `query($city: String!, $country: String!, $key: String!, $result_type: String!) {
  
                get_current_city_city_country_country(city: $city, country: $country, key: $key) {
                    data {
                        temp
                        weather {
                            description
                            search {
                                items {
                                    link
                                }
                            }
                        }
                    }
                }
 
                get_search_tweets_json (q: $city, result_type: $result_type) {
                    statuses {
                        id_str
                        user {
                            id_str
                        }
                    }
                }

                get_v1(
                    cx: "${process.env.WORLDQL_GOOGLE_CSE_CX}", 
                    key: "${process.env.WORLDQL_GOOGLE_CSE_KEY}",   
                    safe : "active",
                    searchType: "image", 
                    imgSize: "medium",
                    q: $city,
                    num: 1
                ) {
                    items {
                      link
                    }
                  }
            }`

        const gqlVariables = {
            "city": city,
            "country": "france",
            "key": process.env.WORLDQL_WEATHERBIT_KEY,
            "result_type": "popular"
        }

        const gqlRequest = {
            gqlApis: gqlApis,
            gqlQuery: gqlQuery,
            gqlVariables: gqlVariables,
        }


        return axios
            .post(
                "http://localhost:3000/worldql/",
                gqlRequest,
            )
            .then(response => {
                debug("(response) %o", response)
                return this.parseData(response.data.data)
            }).catch(error => {
                debug("(error) %o", error)
            })
    }

    parseData(data) {
        return {
            temp: data.get_current_city_city_country_country.data[0].temp,
            desc: data.get_current_city_city_country_country.data[0].weather.description,
            weather_pic_url: data.get_current_city_city_country_country.data[0].weather.search.items[0].link,
            tweet: data.get_search_tweets_json.statuses[0],
            picture_url: data.get_v1.items[0].link
        }
    }
}


export default CityTrends