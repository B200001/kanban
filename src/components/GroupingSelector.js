import React from 'react';

const GroupingSelector = ({ groupBy, setGroupBy }) => {
  return (
    <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
      <option value="Status">Group by Status</option>
      <option value="User">Group by User</option>
      <option value="Priority">Group by Priority</option>
    </select>
  );
};

export default GroupingSelector;
