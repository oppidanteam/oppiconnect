import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile } from '../redux/actions/profileActions';

class Profile extends Component {
  componentDidMount() {
    this.props.getCurrentProfile();
  }

  render() {
    const { profile, loading } = this.props.profile;

    let profileContent;

    if (profile === null || loading) {
      profileContent = <h4>Loading...</h4>;
    } else {
      profileContent = (
        <div>
          <h1 className="display-4">Profile</h1>
          <p>{profile.company}</p>
          <p>{profile.website}</p>
          <p>{profile.location}</p>
          <p>{profile.status}</p>
          <p>{profile.skills.join(', ')}</p>
          <h3>Metrics</h3>
          <p>Revenue: {profile.metrics.revenue}</p>
          <p>Employees: {profile.metrics.employees}</p>
          <h3>Milestones</h3>
          {profile.milestones.map((milestone, index) => (
            <div key={index}>
              <h4>{milestone.title}</h4>
              <p>{milestone.date}</p>
              <p>{milestone.description}</p>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="profile">
        <div className="container">
          <div className="row">
            <div className="col-md-12">{profileContent}</div>
          </div>
        </div>
      </div>
    );
  }
}

Profile.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(mapStateToProps, { getCurrentProfile })(Profile);
