import { useCallback, useEffect, useState } from "react";
import "./App.css";

async function api(path, token, options = {}) {
  const r = await fetch("/api" + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: "Bearer " + token } : {}),
      ...options.headers,
    },
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.message || "Request failed.");
  return data;
}
const blank = {
  project: {
    name: "",
    description: "",
    status: "Planning",
    startDate: "",
    dueDate: "",
  },
  task: {
    name: "",
    project: "",
    status: "To Do",
    priority: "Medium",
    dueDate: "",
    notes: "",
    assignee: "",
  },
  member: { name: "", email: "", role: "" },
};

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("pm-token") || "");
  const [user, setUser] = useState(null),
    [page, setPage] = useState("Overview");
  const [mode, setMode] = useState("login"),
    [auth, setAuth] = useState({ name: "", email: "", password: "" });
  const [projects, setProjects] = useState([]),
    [tasks, setTasks] = useState([]),
    [team, setTeam] = useState([]);
  const [stats, setStats] = useState({ projects: 0, tasks: 0, statuses: {} });
  const [search, setSearch] = useState(""),
    [status, setStatus] = useState("All statuses"),
    [priority, setPriority] = useState("All priorities");
  const [modal, setModal] = useState(""),
    [editId, setEditId] = useState(""),
    [form, setForm] = useState({});
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    if (!token) return;
    try {
      const [me, p, t, m, d] = await Promise.all([
        api("/auth/me", token),
        api("/projects", token),
        api("/tasks", token),
        api("/team", token),
        api("/dashboard", token),
      ]);
      setUser(me);
      setProjects(p);
      setTasks(t);
      setTeam(m);
      setStats(d);
      setError("");
    } catch (e) {
      setError(e.message);
      if (/expired|log in|Account not found/i.test(e.message)) signOut();
    }
  }, [token]);
  useEffect(() => {
    const timer = setTimeout(() => refresh(), 0);
    return () => clearTimeout(timer);
  }, [refresh]);
  function signOut() {
    localStorage.removeItem("pm-token");
    setToken("");
    setUser(null);
    setProjects([]);
    setTasks([]);
    setTeam([]);
  }
  async function authSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const result = await api("/auth/" + mode, "", {
        method: "POST",
        body: JSON.stringify(auth),
      });
      localStorage.setItem("pm-token", result.token);
      setToken(result.token);
      setUser(result.user);
    } catch (err) {
      setError(err.message);
    }
  }
  function open(type, item) {
    let value = item ? { ...item } : { ...blank[type] };
    if (type === "task" && item)
      value = {
        ...value,
        project: item.project?._id || item.project,
        assignee: item.assignee?._id || item.assignee || "",
      };
    if (type === "task" && !item && projects[0])
      value.project = projects[0]._id;
    if (["task", "project"].includes(type) && item)
      value.dueDate = item.dueDate?.slice(0, 10) || "";
    if (type === "project" && item)
      value.startDate = item.startDate?.slice(0, 10) || "";
    setForm(value);
    setEditId(item?._id || "");
    setModal(type);
    setError("");
  }
  async function save(e) {
    e.preventDefault();
    const path = modal === "member" ? "team" : modal + "s";
    const value = { ...form };
    if (modal === "task" && !value.assignee) value.assignee = null;
    try {
      await api("/" + path + (editId ? "/" + editId : ""), token, {
        method: editId ? "PUT" : "POST",
        body: JSON.stringify(value),
      });
      setModal("");
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  }
  async function remove(type, item) {
    if (!confirm("Delete this item?")) return;
    const path = type === "member" ? "team" : type + "s";
    try {
      await api("/" + path + "/" + item._id, token, { method: "DELETE" });
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  }
  async function move(task, next) {
    try {
      await api("/tasks/" + task._id, token, {
        method: "PUT",
        body: JSON.stringify({ status: next }),
      });
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  }
  const shownProjects = projects.filter((x) =>
    x.name.toLowerCase().includes(search.toLowerCase()),
  );
  const shownTasks = tasks.filter(
    (x) =>
      x.name.toLowerCase().includes(search.toLowerCase()) &&
      (status === "All statuses" || x.status === status) &&
      (priority === "All priorities" || x.priority === priority),
  );

  if (!token)
    return (
      <main className="auth">
        <form className="auth-card" onSubmit={authSubmit}>
          <div className="logo">P</div>
          <p className="kicker">PLANWISE WORKSPACE</p>
          <h1>{mode === "login" ? "Welcome back" : "Create an account"}</h1>
          <p className="muted">
            A simple place to plan and track your projects.
          </p>
          {mode === "register" && (
            <label>
              Name
              <input
                required
                value={auth.name}
                onChange={(e) => setAuth({ ...auth, name: e.target.value })}
              />
            </label>
          )}
          <label>
            Email
            <input
              type="email"
              required
              value={auth.email}
              onChange={(e) => setAuth({ ...auth, email: e.target.value })}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              minLength="6"
              required
              value={auth.password}
              onChange={(e) => setAuth({ ...auth, password: e.target.value })}
            />
          </label>
          {error && <p className="error">{error}</p>}
          <button className="btn primary wide">
            {mode === "login" ? "Log in" : "Create account"}
          </button>
          <p className="switch">
            {mode === "login" ? "New here?" : "Already registered?"}{" "}
            <button
              type="button"
              className="link"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setError("");
              }}
            >
              {mode === "login" ? "Create account" : "Log in"}
            </button>
          </p>
        </form>
      </main>
    );

  const pages = ["Overview", "Projects", "Task board", "Team"];
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">
          <span className="logo">P</span> Planwise
        </div>
        <small className="caption">WORKSPACE</small>
        <nav>
          {pages.map((x, i) => (
            <button
              key={x}
              className={"nav " + (page === x ? "active" : "")}
              onClick={() => {
                setPage(x);
                setSearch("");
              }}
            >
              <span>{["⌂", "▤", "▦", "♙"][i]}</span>
              {x}
              {x === "Projects" && <small>{projects.length}</small>}
            </button>
          ))}
        </nav>
        <div className="profile">
          <span className="avatar">{user?.name?.[0]?.toUpperCase()}</span>
          <div>
            <b>{user?.name}</b>
            <small>{user?.email}</small>
          </div>
          <button onClick={signOut} title="Log out">
            ↪
          </button>
        </div>
      </aside>
      <main className="main">
        <header>
          Workspace / <b>{page}</b>
          <span>{new Date().toLocaleDateString()}</span>
        </header>
        <section className="content">
          <div className="heading">
            <div>
              <p className="kicker">YOUR WORKSPACE</p>
              <h1>
                {page === "Overview"
                  ? "Good to see you, " + (user?.name?.split(" ")[0] || "")
                  : page}
              </h1>
              <p className="muted">
                {page === "Overview"
                  ? "Here is what is happening with your work today."
                  : "Organize work and keep your projects moving."}
              </p>
            </div>
            {page !== "Overview" && (
              <button
                className="btn primary"
                onClick={() =>
                  open(
                    page === "Projects"
                      ? "project"
                      : page === "Team"
                        ? "member"
                        : "task",
                  )
                }
              >
                ＋ Add{" "}
                {page === "Projects"
                  ? "project"
                  : page === "Team"
                    ? "member"
                    : "task"}
              </button>
            )}
          </div>
          {error && (
            <p className="error notice">
              {error}
              <button onClick={() => setError("")}>×</button>
            </p>
          )}
          {page === "Overview" && (
            <>
              <div className="stats">
                {[
                  ["Projects", stats.projects],
                  ["Tasks", stats.tasks],
                  ["In progress", stats.statuses["In Progress"] || 0],
                  ["Completed", stats.statuses.Completed || 0],
                ].map(([k, v]) => (
                  <div className="stat" key={k}>
                    <small>{k}</small>
                    <b>{v}</b>
                  </div>
                ))}
              </div>
              <div className="columns two">
                <section className="panel">
                  <Title
                    title="Recent projects"
                    action="View all →"
                    click={() => setPage("Projects")}
                  />
                  {projects.slice(0, 5).map((p) => (
                    <div className="row" key={p._id}>
                      <b>{p.name}</b>
                      <Badge value={p.status} />
                    </div>
                  ))}
                  {!projects.length && <Empty>No projects yet.</Empty>}
                </section>
                <section className="panel">
                  <Title title="Tasks by status" />
                  {["To Do", "In Progress", "Completed"].map((s) => (
                    <div className="row" key={s}>
                      {s}
                      <b>{stats.statuses[s] || 0}</b>
                    </div>
                  ))}
                </section>
              </div>
              <section className="panel">
                <Title
                  title="Recent tasks"
                  action="Open task board →"
                  click={() => setPage("Task board")}
                />
                <Table
                  tasks={tasks.slice(0, 5)}
                  edit={(x) => open("task", x)}
                  remove={(x) => remove("task", x)}
                  move={move}
                />
              </section>
            </>
          )}
          {page === "Projects" && (
            <>
              <div className="toolbar">
                <Search
                  value={search}
                  change={setSearch}
                  placeholder="Search projects"
                />
              </div>
              <div className="columns cards">
                {shownProjects.map((p) => (
                  <article className="panel project" key={p._id}>
                    <Badge value={p.status} />
                    <h3>{p.name}</h3>
                    <p className="muted">{p.description || "No description"}</p>
                    <small>
                      Due: {p.dueDate ? date(p.dueDate) : "Not set"} ·{" "}
                      {
                        tasks.filter(
                          (t) => (t.project?._id || t.project) === p._id,
                        ).length
                      }{" "}
                      tasks
                    </small>
                    <Actions
                      edit={() => open("project", p)}
                      remove={() => remove("project", p)}
                    />
                  </article>
                ))}
              </div>
              {!shownProjects.length && (
                <Empty>
                  No matching projects. Add a project to get started.
                </Empty>
              )}
            </>
          )}
          {page === "Task board" && (
            <>
              <div className="toolbar">
                <Search
                  value={search}
                  change={setSearch}
                  placeholder="Search tasks"
                />
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option>All statuses</option>
                  <option>To Do</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option>All priorities</option>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
              <div className="columns board">
                {["To Do", "In Progress", "Completed"].map((s) => (
                  <section className="lane" key={s}>
                    <h2>
                      {s}{" "}
                      <small>
                        {shownTasks.filter((t) => t.status === s).length}
                      </small>
                    </h2>
                    {shownTasks
                      .filter((t) => t.status === s)
                      .map((t) => (
                        <article className="task" key={t._id}>
                          <h3>{t.name}</h3>
                          <p>
                            {t.project?.name} ·{" "}
                            {t.assignee?.name || "Unassigned"}
                          </p>
                          <Badge value={t.priority} />
                          <div className="row-actions">
                            <button onClick={() => open("task", t)}>
                              Edit
                            </button>
                            <button onClick={() => remove("task", t)}>
                              Delete
                            </button>
                            <button
                              onClick={() =>
                                move(
                                  t,
                                  s === "To Do"
                                    ? "In Progress"
                                    : s === "In Progress"
                                      ? "Completed"
                                      : "To Do",
                                )
                              }
                            >
                              {s === "Completed" ? "Reopen" : "Move"}
                            </button>
                          </div>
                        </article>
                      ))}
                  </section>
                ))}
              </div>
            </>
          )}
          {page === "Team" && (
            <section className="panel">
              {team.map((m) => (
                <div className="row" key={m._id}>
                  <span>
                    <b>{m.name}</b>
                    <small>
                      {m.email} · {m.role}
                    </small>
                  </span>
                  <Actions
                    edit={() => open("member", m)}
                    remove={() => remove("member", m)}
                  />
                </div>
              ))}
              {!team.length && (
                <Empty>No team members yet. Add one to assign tasks.</Empty>
              )}
            </section>
          )}
        </section>
      </main>
      {modal && (
        <div
          className="shade"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setModal("");
          }}
        >
          <form className="dialog" onSubmit={save}>
            <h2>
              {editId ? "Edit " : "Add "}
              {modal}
            </h2>
            <label>
              {modal === "member"
                ? "Name"
                : modal[0].toUpperCase() + modal.slice(1) + " name"}
              <input
                autoFocus
                required
                value={form.name || ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </label>
            {modal === "project" && (
              <>
                <label>
                  Description
                  <textarea
                    value={form.description || ""}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                  />
                </label>
                <label>
                  Status
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value })
                    }
                  >
                    <option>Planning</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                </label>
                <div className="form-row">
                  <label>
                    Start date
                    <input
                      type="date"
                      value={form.startDate || ""}
                      onChange={(e) =>
                        setForm({ ...form, startDate: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    Due date
                    <input
                      type="date"
                      value={form.dueDate || ""}
                      onChange={(e) =>
                        setForm({ ...form, dueDate: e.target.value })
                      }
                    />
                  </label>
                </div>
              </>
            )}
            {modal === "task" && (
              <>
                <label>
                  Project
                  <select
                    required
                    value={form.project || ""}
                    onChange={(e) =>
                      setForm({ ...form, project: e.target.value })
                    }
                  >
                    <option value="">Choose project</option>
                    {projects.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="form-row">
                  <label>
                    Status
                    <select
                      value={form.status}
                      onChange={(e) =>
                        setForm({ ...form, status: e.target.value })
                      }
                    >
                      <option>To Do</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                    </select>
                  </label>
                  <label>
                    Priority
                    <select
                      value={form.priority}
                      onChange={(e) =>
                        setForm({ ...form, priority: e.target.value })
                      }
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </label>
                </div>
                <div className="form-row">
                  <label>
                    Due date
                    <input
                      type="date"
                      value={form.dueDate || ""}
                      onChange={(e) =>
                        setForm({ ...form, dueDate: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    Assignee
                    <select
                      value={form.assignee || ""}
                      onChange={(e) =>
                        setForm({ ...form, assignee: e.target.value })
                      }
                    >
                      <option value="">Unassigned</option>
                      {team.map((m) => (
                        <option key={m._id} value={m._id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <label>
                  Notes
                  <textarea
                    value={form.notes || ""}
                    onChange={(e) =>
                      setForm({ ...form, notes: e.target.value })
                    }
                  />
                </label>
              </>
            )}
            {modal === "member" && (
              <>
                <label>
                  Email
                  <input
                    type="email"
                    required
                    value={form.email || ""}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                </label>
                <label>
                  Role
                  <input
                    required
                    value={form.role || ""}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  />
                </label>
              </>
            )}
            {error && <p className="error">{error}</p>}
            <div className="row-actions">
              <button type="button" onClick={() => setModal("")}>
                Cancel
              </button>
              <button className="btn primary">
                {editId ? "Save changes" : "Add " + modal}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
function Title({ title, action, click }) {
  return (
    <div className="panel-title">
      <h2>{title}</h2>
      {action && (
        <button className="link" onClick={click}>
          {action}
        </button>
      )}
    </div>
  );
}
function Empty({ children }) {
  return <p className="empty">{children}</p>;
}
function date(x) {
  return new Date(x.slice(0, 10) + "T00:00:00").toLocaleDateString();
}
function Badge({ value }) {
  return (
    <span
      className={
        "badge " +
        (value === "Completed"
          ? "green"
          : value === "In Progress"
            ? "purple"
            : value === "High"
              ? "red"
              : value === "Low"
                ? "gray"
                : "amber")
      }
    >
      {value}
    </span>
  );
}
function Search({ value, change, placeholder }) {
  return (
    <input
      className="search"
      aria-label={placeholder}
      placeholder={placeholder}
      value={value}
      onChange={(e) => change(e.target.value)}
    />
  );
}
function Actions({ edit, remove }) {
  return (
    <div className="row-actions">
      <button onClick={edit}>Edit</button>
      <button onClick={remove}>Delete</button>
    </div>
  );
}
function Table({ tasks, edit, remove, move }) {
  return (
    <div className="scroll">
      <table>
        <thead>
          <tr>
            <th>Task</th>
            <th>Project</th>
            <th>Priority</th>
            <th>Due</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((t) => (
            <tr key={t._id}>
              <td>{t.name}</td>
              <td>{t.project?.name || "—"}</td>
              <td>
                <Badge value={t.priority} />
              </td>
              <td>{t.dueDate ? date(t.dueDate) : "—"}</td>
              <td>
                <select
                  value={t.status}
                  onChange={(e) => move(t, e.target.value)}
                >
                  <option>To Do</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </td>
              <td>
                <Actions edit={() => edit(t)} remove={() => remove(t)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
