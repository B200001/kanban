import React, { useState, useEffect } from "react";
import axios from "axios";
import "./KanbanBoard.css";

// Import SVG icons as React components
import { ReactComponent as StatusIcon } from './assets/Display.svg';
import { ReactComponent as PriorityHigh } from './assets/Img - High Priority.svg';
import { ReactComponent as PriorityMedium } from './assets/Img - Medium Priority.svg';
import { ReactComponent as PriorityLow } from './assets/Img - Low Priority.svg';
import { ReactComponent as PriorityUrgentColor } from './assets/SVG - Urgent Priority colour.svg';
import { ReactComponent as PriorityUrgentGrey } from './assets/SVG - Urgent Priority grey.svg';
import { ReactComponent as BacklogIcon } from './assets/Backlog.svg';
import { ReactComponent as CancelledIcon } from './assets/Cancelled.svg';
import { ReactComponent as InProgressIcon } from './assets/in-progress.svg';
import { ReactComponent as DoneIcon } from './assets/Done.svg';
import { ReactComponent as NoPriorityIcon } from './assets/No-priority.svg';
import { ReactComponent as ToDoIcon } from './assets/To-do.svg';
import { ReactComponent as DownIcon } from './assets/down.svg';
import { ReactComponent as AddIcon } from './assets/add.svg';
import { ReactComponent as MenuIcon } from './assets/3 dot menu.svg';

const API_URL = "https://api.quicksell.co/v1/internal/frontend-assignment";

const KanbanBoard = () => {
  const [tickets, setTickets] = useState([]);
  const [groupBy, setGroupBy] = useState("Status");
  const [sortBy, setSortBy] = useState("Priority");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      try {
        const response = await axios.get(API_URL);
        if (response.data && Array.isArray(response.data.tickets)) {
          setTickets(response.data.tickets);
        } else {
          setError("Invalid response from the server");
        }
      } catch (error) {
        setError("Error fetching tickets");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Backlog": return <BacklogIcon />;
      case "Cancelled": return <CancelledIcon />;
      case "In Progress": return <InProgressIcon />;
      case "Done": return <DoneIcon />;
      default: return null;
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "High": return <PriorityHigh />;
      case "Medium": return <PriorityMedium />;
      case "Low": return <PriorityLow />;
      case "Urgent": return <PriorityUrgentColor />;
      default: return <NoPriorityIcon />;
    }
  };

  const priorityOrder = {
    "Urgent": 5,
    "High": 4,
    "Medium": 3,
    "Low": 2,
    "No Priority": 1,
  };

  const sortTickets = (tickets, sortBy) => {
    switch (sortBy) {
      case "Priority":
        return tickets.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
      case "Title":
        return tickets.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return tickets;
    }
  };

  const groupTickets = (tickets, groupBy) => {
    if (!Array.isArray(tickets)) return {};

    return tickets.reduce((groups, ticket) => {
      let groupKey = "";
      if (groupBy === "Status") {
        groupKey = ticket.status || "Unknown Status";
      } else if (groupBy === "User") {
        groupKey = ticket.userId || "No User Assigned";
      } else if (groupBy === "Priority") {
        groupKey = ticket.priority || "No Priority";
      }
      groups[groupKey] = groups[groupKey] || [];
      groups[groupKey].push(ticket);
      return groups;
    }, {});
  };

  if (loading) return <div>Loading tickets...</div>;
  if (error) return <div>{error}</div>;

  const groupedTickets = groupTickets(tickets, groupBy);

  return (
    <div className="kanban-container">
      <div className="controls">
        <div className="control-group">
          <label>Group By:</label>
          <div className="select-with-icon">
            <StatusIcon className="icon" />
            <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
              <option value="Status">Status</option>
              <option value="User">User</option>
              <option value="Priority">Priority</option>
            </select>
          </div>
        </div>

        <div className="control-group">
          <label>Order By:</label>
          <div className="select-with-icon">
            <PriorityHigh className="icon" />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="Priority">Priority</option>
              <option value="Title">Title</option>
            </select>
          </div>
        </div>
      </div>

      <div className="kanban-board">
        {Object.keys(groupedTickets).map((group) => (
          <div key={group} className="kanban-column">
            <h3 className="column-title">{group}</h3>
            {sortTickets(groupedTickets[group], sortBy).map((ticket) => (
              <div key={ticket.id} className="ticket-card">
                <h4>{ticket.title}</h4>
                <p>Priority: {ticket.priority} {getPriorityIcon(ticket.priority)}</p>
                <p>Status: {ticket.status} {getStatusIcon(ticket.status)}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
