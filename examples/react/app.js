import React from "react";

class c_App extends React.Component {
  constructor(p_props) {
    super(p_props);

    this.state = {
      l_x: "x",
      l_y: "y",
    };
  }
  render() {
    return (
      <div>
        <h1>{this.state.l_x}</h1>
        <h2>{this.state.l_y}</h2>
      </div>
    );
  }
}
export default c_App;
