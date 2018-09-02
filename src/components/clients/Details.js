import React, { Component } from "react";
import { Link } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import Spinner from "../layout/Spinner";
import PropTypes from "prop-types";

class Details extends Component {
  state = {
    showBalanceUpdate: false,
    balanceUpdateAmount: ""
  };

  balanceSubmit = e => {
    e.preventDefault();
    console.log(this.state.balanceUpdateAmount);
    const { client, firestore } = this.props;
    const { balanceUpdateAmount } = this.state;
    const clientUpdate = {
      balance: parseFloat(balanceUpdateAmount)
    };
    // update in firestore
    firestore.update({ collection: "clients", doc: client.id }, clientUpdate);
  };
  changeBalance = e => this.setState({ [e.target.name]: e.target.value });
  // Delete client
  onDeleteClick = _ => {
    const { client, firestore } = this.props;
    firestore
      .delete({ collection: "clients", doc: client.id })
      .then(() => this.props.history.push("/"));
  };
  render() {
    const { client } = this.props;
    const { showBalanceUpdate, balanceUpdateAmount } = this.state;

    let balanceForm = "";
    //if Balance form should display
    if (showBalanceUpdate) {
      balanceForm = (
        <form onSubmit={this.balanceSubmit}>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              name="balanceUpdateAmount"
              placeholder="Add New Balance"
              value={balanceUpdateAmount}
              onChange={this.changeBalance}
            />
            <div className="input-group-append">
              <input
                type="submit"
                value="update"
                className="btn btn-outline-dark"
              />
            </div>
          </div>
        </form>
      );
    } else {
      balanceForm = null;
    }
    if (client) {
      return (
        <div>
          <div className="row">
            <div className="col-md-6">
              <Link to="/" className="btn btn-lin">
                <i className="fa fa-arrow-circle-left" />
                Back to Dasboard
              </Link>
            </div>
            <div className="col-md-6">
              <div className="btn-group float-right">
                <Link to={`/client/edit/${client.id}`} className="btn btn-dark">
                  Edit
                </Link>
                <button onClick={this.onDeleteClick} className="btn btn-danger">
                  Delete
                </button>
              </div>
            </div>
          </div>
          <hr />
          <div className="card">
            <h3 className="card-header">
              {client.firstName}
              {client.lastName}
            </h3>
            <div className="card-body">
              <div className="row">
                <div className="col-md-8 col-5m-6">
                  <h4>
                    Client ID:
                    {""} <span className="text-secondary">{client.id}</span>
                  </h4>
                </div>
                <div className="col-md-4 col-5m-6">
                  <h3 className="pull-right">
                    Balance:
                    <span
                      className={`${
                        client.balance > 0 ? "text-danger" : "text-success"
                      }`}
                    >
                      {" "}
                      ${parseFloat(client.balance).toFixed(2)}
                    </span>{" "}
                    <small>
                      <a
                        href="#!"
                        onClick={() =>
                          this.setState({
                            showBalanceUpdate: !this.state.showBalanceUpdate
                          })
                        }
                      >
                        <i className="fa fa-pencil-alt" />
                      </a>
                    </small>
                  </h3>
                  {balanceForm}
                </div>
              </div>
              <hr />
              <ul className="list-group">
                <li className="list-group-item">
                  Contact Email:
                  {client.email}
                </li>
                <li className="list-group-item">
                  Contact Phone:
                  {client.phone}
                </li>
              </ul>
            </div>
          </div>
        </div>
      );
    } else {
      return <Spinner />;
    }
  }
}

Details.propTypes = {
  firestore: PropTypes.object.isRequired
};

export default compose(
  firestoreConnect(props => [
    { collection: "clients", storeAs: "client", doc: props.match.params.id }
  ]),
  connect(({ firestore: { ordered } }, props) => ({
    client: ordered.client && ordered.client[0]
  }))
)(Details);
