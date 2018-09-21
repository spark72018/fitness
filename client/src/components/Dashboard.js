import React from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard({
  auth,
  routines,
  handleDashboardClick,
  handleDashboardEditClick
}) {
  return (
    <div className="dashboard-container">
      <div className="dashboard">
        {!auth ? (
          <h4>Must be logged in to view your dashboard!</h4>
        ) : routines.length === 0 ? (
          <React.Fragment>
            <h4>Currently no routines.</h4>
            <h4>Click the add button to create a new routine!</h4>
          </React.Fragment>
        ) : (
          <div className="collection z-depth-3">
            <h4>My Routines</h4>
            <ul>
              {routines.map(({ routineName, _id }, idx) => (
                <li key={`routine${idx}`}>
                  <Link
                    data-routineid={_id}
                    className="collection-item badge"
                    onClick={handleDashboardClick}
                    to={`${process.env.PUBLIC_URL}/workout`}
                  >
                    {routineName}
                  </Link>
                  <Link
                    data-routineid={_id}
                    to={`${process.env.PUBLIC_URL}/routine`}
                    onClick={handleDashboardEditClick}
                    className="btn-floating btn-medium waves-effect waves-light blue"
                  >
                    <i className="large material-icons">edit</i>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="fixed-action-btn">
        <Link
          to={`${process.env.PUBLIC_URL}/new_routine`}
          className="btn-floating btn-large waves-effect waves-light blue"
        >
          <i className="material-icons">add</i>
        </Link>
      </div>
    </div>
  );
}
