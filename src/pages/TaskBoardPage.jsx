import { useState } from "react";
import { Badge, EmptyState, SearchInput } from "../components/Common";

function TaskCard({ task, onEdit, onDelete, onStatus }) {
  const next =
    task.status === "To Do"
      ? "In Progress"
      : task.status === "In Progress"
        ? "Completed"
        : "To Do";
  return (
    <article className="task">
      <h3>{task.name}</h3>
      <p>
        {task.project?.name || "Project"} ·{" "}
        {task.assignee?.name || "Unassigned"}
      </p>
      <Badge value={task.priority} />
      <div className="row-actions">
        <button onClick={onEdit}>Edit</button>
        <button onClick={onDelete}>Delete</button>
        <button onClick={() => onStatus(task, next)}>
          {task.status === "Completed" ? "Reopen" : "Move"}
        </button>
      </div>
    </article>
  );
}

export default function TaskBoardPage({ tasks, onEdit, onDelete, onStatus }) {
  const [search, setSearch] = useState(""),
    [status, setStatus] = useState("All statuses"),
    [priority, setPriority] = useState("All priorities");
  const visible = tasks.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) &&
      (status === "All statuses" || t.status === status) &&
      (priority === "All priorities" || t.priority === priority),
  );
  return (
    <>
      <div className="toolbar">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search tasks"
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>All statuses</option>
          <option>To Do</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option>All priorities</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </div>
      <div className="columns board">
        {["To Do", "In Progress", "Completed"].map((s) => {
          const items = visible.filter((t) => t.status === s);
          return (
            <section className="lane" key={s}>
              <h2>
                {s} <small>{items.length}</small>
              </h2>
              {items.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={() => onEdit(task)}
                  onDelete={() => onDelete(task)}
                  onStatus={onStatus}
                />
              ))}
              {!items.length && <EmptyState>No tasks here.</EmptyState>}
            </section>
          );
        })}
      </div>
    </>
  );
}
