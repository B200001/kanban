import React, { useState, useEffect } from 'react';
import axios from 'axios';
import KanbanBoard from './components/KanbanBoard';
import GroupingSelector from './components/GroupingSelector';
import SortingSelector from './components/SortingSelector';

const API_URL = 'https://api.quicksell.co/v1/internal/frontend-assignment';

function App() {
  const [tickets, setTickets] = useState([]);
  const [groupBy, setGroupBy] = useState('Status');
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get(API_URL);
        setTickets(response.data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };
    fetchTickets();
  }, []);

  return (
    <div className="app">
      <div className="controls">
        {/* <GroupingSelector groupBy={groupBy} setGroupBy={setGroupBy} /> */}
        {/* <SortingSelector sortBy={sortBy} setSortBy={setSortBy} /> */}
      </div>
      <KanbanBoard tickets={tickets} groupBy={groupBy} sortBy={sortBy} />
    </div>
  );
}

export default App;
