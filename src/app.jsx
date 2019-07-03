import React from 'react';

const {Provider, Consumer} = React.createContext('hehe');

function App() {
  return  <Button />
  {/* </Provider>; */}
}

function Button() {
  return <Text />
}

function Text(props, context) {
  console.log(props, context)
  return <Consumer>
    {val => (
      <div>{val}</div>
    )}
  </Consumer>
}

export default App;