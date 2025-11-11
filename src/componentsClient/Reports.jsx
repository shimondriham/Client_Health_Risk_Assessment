import React from "react";

export default function Reports() {
  return (
    <div className="container-fluid">
      <div className="row vh-100">
        {/* תפריט צד */}
        <div className="col-2 bg-light d-flex flex-column justify-content-between p-3">
          <div>
            <button className="btn btn-light mb-3">X</button>
            <ul className="list-unstyled">
              <li><hr /></li>
              <li><hr /></li>
              <li><hr /></li>
              <li><hr /></li>
            </ul>
          </div>
          <button className="btn btn-outline-dark">Log out</button>
        </div>

        {/* תוכן עמוד */}
        <div className="col p-4">
          <h1>Reports</h1>
          <div className="d-flex align-items-center mb-4">
            <div
              className="rounded-circle bg-secondary me-3"
              style={{ width: "60px", height: "60px" }}
            ></div>
            <h2>User</h2>
          </div>

          <div className="bg-light p-4 rounded">
            <ul>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}