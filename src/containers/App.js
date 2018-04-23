// TO DO: - Refactor by creating components for getCount and randomizer functions.
//        - Create button component for on-demand generation, rather than refreshing.
//        - Style page.

import React, { Component } from 'react';
import './App.css';

const urls = [
'https://swapi.co/api/people/',
'https://swapi.co/api/species/',
'https://swapi.co/api/films/',
'https://swapi.co/api/planets/'
];

const getCount = async function() {
  try{
    const [ peopleNum, speciesNum, filmsNum, planetsNum ] = await Promise.all(urls.map(async function(url) {
      const response = await fetch(url);
      return response.json();
    }));
    return {
      peopleNum  : peopleNum.count,
      speciesNum : speciesNum.count,
      filmsNum   : filmsNum.count,
      planetsNum : planetsNum.count
    };
  } catch (err) {
    console.log("Error: ", err);
  }
}

const randomizer = async function(arr){
  try{
    const [ person, species, film, planet ] = await Promise.all(urls.map(async function(url, index) {
      const response = await fetch(url + Math.floor((Math.random() * arr[index]) + 1));
      return response.json();
    }));
    return {
      person: person.name,
      species: species.name,
      film: film.title,
      planet: planet.name
    };
  } catch (err) {
    console.log("Error: ", err);
  }
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      peopleNum: 0,
      speciesNum: 0,
      filmsNum: 0,
      planetsNum: 0,
      person: '',
      species: '',
      film: '',
      planet: ''
    }
  }

  randomizerActivate = () => {
    randomizer([this.state.peopleNum, this.state.speciesNum, this.state.filmsNum, this.state.planetsNum]).then((result) => {
      this.setState({
        person: result.person,
        species: result.species,
        film: result.film,
        planet: result.planet
      });
    });
  }

  componentDidMount(){
    try{
    getCount().then((result) => {
      this.setState({
        peopleNum: result.peopleNum,
        speciesNum: result.speciesNum,
        filmsNum: result.filmsNum,
        planetsNum: result.planetsNum
      });
    }).then(() => { this.randomizerActivate() });
    }
    catch (error) {
      console.log("Error: ", error);
    }
  }

  render() {
    const { peopleNum, speciesNum, filmsNum, planetsNum,
      person, species, film, planet } = this.state;
      return this.state.peopleNum === 0 ?
      <h1 className="tc">Loading...</h1>
      :
      (
        <div className="tc">
        <h1 className="f1">Swapi Randomizer</h1>
        <a class="f6 link dim br3 ba ph3 pv2 mb2 dib genbutton" href="#generate" onClick={this.randomizerActivate}>Generate Character</a>
        <h2>Your name is {person}. You are a {species} that hails from {planet}, and you made your debut appearance in {film}.</h2>
        <h5>using the <a class="swapilink" href="https://swapi.co" target="_blank">Star Wars API</a>, gleaning from a database of {peopleNum} characters, {speciesNum} species, {filmsNum} films, and {planetsNum} planets</h5>
        </div>
        );
    }
  }

  export default App;
