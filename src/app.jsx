import * as React from 'react'
import {observer} from 'mobx-react'
import {observable} from 'mobx'

// @observer
class Child extends React.Component {
  render() {
    console.log(1)
    const {list} = this.props
    return <ul>
      {list.map((item, index) => <p key={index}>{item}</p>)}
    </ul>
  }
}

@observer
class Container extends React.Component {
  @observable list = []

  handleClick = () => {
    this.list.push(1)
  }

  render() {
    const {list} = this
    return <section>
      <button onClick={this.handleClick}>click me to update</button>
      {/* {list.map((item, index) => <p key={index}>{item}</p>)} */}
      <Child list={list} />
    </section>
  }
}

export default Container