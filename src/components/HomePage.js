
import dateFormat from 'dateformat'
import 'firebase/functions'
import React from 'react'
import { withFirebase } from 'react-redux-firebase'
import Quotes from './Quotes'
import SplashScreen from './SplashScreen'

class HomePage extends React.Component {
  constructor(props) {
    super(props)
    this.firebase = props.firebase
    this.state = {
      isLoaded: false,
      data: null
    }
  }

  componentDidMount() {
    const getQuotes = this.firebase.functions().httpsCallable('getQuotes')
    getQuotes({status: "current"}).then((result) => {
      this.setState({
        isLoaded: true,
        data: result.data,
      })
    })
  }

  render() { 
    if (!this.state.isLoaded) {
      return <SplashScreen/>
    }
    const date = new Date(this.state.data.datePublished._seconds * 1000)
    const dateStr = dateFormat(date, "mmmm dS, yyyy")
    const cutoff = 10
    return (
    <div className="main">
      <h3>Last Week's Winners</h3>
      <small>({dateStr})</small>
      <Quotes quotes={this.state.data.quotes.slice(0, cutoff)}/>
      {this.state.data.quotes.length > cutoff ?
        <React.Fragment>
          <br/>
          <h3>Honorable Mentions</h3>
          <Quotes quotes={this.state.data.quotes.slice(cutoff)}/>
        </React.Fragment> :
        null}
    </div>
    )
  }
}

export default withFirebase(HomePage)