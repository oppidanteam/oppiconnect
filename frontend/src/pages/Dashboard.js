import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getCurrentProfile } from '../redux/actions/profileActions';
import PropTypes from 'prop-types';
import Chat from '../components/Chat';
import VideoCall from '../components/VideoCall';

class Dashboard extends Component {
  componentDidMount() {
    this.props.getCurrentProfile();
  }

  render() {
    const { user } = this.props.auth;
    const { profile, loading } = this.props.profile;

    let dashboardContent;

    if (profile === null || loading) {
      dashboardContent = <h4>Loading...</h4>;
    } else {
      dashboardContent = (
        <div>
          <p className="lead text-muted">Welcome {user.name}</p>
          <p>{profile.company}</p>
          <p>{profile.website}</p>
          <p>{profile.location}</p>
          <p>{profile.status}</p>
          <p>{profile.skills.join(', ')}</p>
          <Chat />
          <VideoCall />
        </div>
      );
    }

    return (
      <div className="dashboard">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4">Dashboard</h1>
              {dashboardContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard);
