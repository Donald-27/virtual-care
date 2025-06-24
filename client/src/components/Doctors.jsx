import React, { useState, useEffect } from 'react';
import { fetchDoctors } from '../api/api';

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [filter, setFilter] = useState('');
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetchDoctors().then(data => {
      setDoctors(data || []);
      const deps = Array.from(new Set((data||[]).map(d => d.department)));
      setDepartments(deps);
    });
  }, []);

  const filtered = filter
    ? doctors.filter(d => d.department === filter)
    : doctors;

  return (
    <div className="container">
      <h2>Available Doctors</h2>
      <label>
        Filter by Department:
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="">All</option>
          {departments.map(dep => (
            <option key={dep} value={dep}>{dep}</option>
          ))}
        </select>
      </label>
      <table style={{ marginTop:'1rem' }}>
        <thead>
          <tr><th>ID</th><th>Name</th><th>Department</th></tr>
        </thead>
        <tbody>
          {filtered.map(d => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.name}</td>
              <td>{d.department}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
