import React, { useState, useEffect } from "react";
import axios from "axios";
import "./KanbanBoard.css"; // External CSS file for styling

// Import your icons
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

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get(API_URL);
        if (response.data && Array.isArray(response.data.tickets)) {
          setTickets(response.data.tickets);
        } else {
          console.error("Tickets data is not an array", response.data);
        }
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    fetchTickets();
  }, []);

  const groupTickets = (tickets, groupBy) => {
    if (!Array.isArray(tickets)) return {};

    switch (groupBy) {
      case "Status":
        return tickets.reduce((groups, ticket) => {
          const group = ticket.status;
          groups[group] = groups[group] || [];
          groups[group].push(ticket);
          return groups;
        }, {});
      case "User":
        return tickets.reduce((groups, ticket) => {
          const group = ticket.userId;
          groups[group] = groups[group] || [];
          groups[group].push(ticket);
          return groups;
        }, {});
      case "Priority":
        return tickets.reduce((groups, ticket) => {
          const group = ticket.priority;
          groups[group] = groups[group] || [];
          groups[group].push(ticket);
          return groups;
        }, {});
      default:
        return {};
    }
  };

  const sortTickets = (tickets, sortBy) => {
    switch (sortBy) {
      case "Priority":
        return tickets.sort((a, b) => b.priority - a.priority);
      case "Title":
        return tickets.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return tickets;
    }
  };

  const groupedTickets = groupTickets(tickets, groupBy);

  return (
    <div className="kanban-container">
      <div className="controls">
        <div className="control-group">
          <label>Group By:</label>
          <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
            <option value="Status">
              <StatusIcon className="icon" /> Status
            </option>
            <option value="User">
              <MenuIcon className="icon" /> User
            </option>
            <option value="Priority">
              <PriorityHigh className="icon" /> Priority
            </option>
          </select>
        </div>

        <div className="control-group">
          <label>Order By:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="Priority">
              <PriorityHigh className="icon" /> Priority
            </option>
            <option value="Title">
              <StatusIcon className="icon" /> Title
            </option>
            <option value="Down">
              <DownIcon className="icon" /> Down
            </option>
            <option value="Add">
              <AddIcon className="icon" /> Add
            </option>
          </select>
        </div>
      </div>

      <div className="kanban-board">
        {Object.keys(groupedTickets).map((group) => (
          <div key={group} className="kanban-column">
            <h3 className="column-title">{group}</h3>
            {sortTickets(groupedTickets[group], sortBy).map((ticket) => (
              <div key={ticket.id} className="ticket-card">
                <h4>{ticket.title}</h4>
                <p>Priority: {ticket.priority}</p>
                <p>Status: {ticket.status}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
