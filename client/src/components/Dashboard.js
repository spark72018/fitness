import React from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard(props) {
  return (
    <div className="fixed-action-btn">
      <Link
        to={`${process.env.PUBLIC_URL}/new_routine`}
        className="btn-floating btn-large waves-effect waves-light red"
      >
        <i class="material-icons">add</i>
      </Link>
    </div>
  );
}
