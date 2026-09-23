import { Actions, EmptyState } from '../components/Common'

export default function TeamPage({ team, onEdit, onDelete }) {
  return <section className="panel"><div className="panel-title"><h2>Team members</h2></div>
    {team.map((member) => <div className="row" key={member._id}><span><b>{member.name}</b><small>{member.email} · {member.role}</small></span>
      <Actions onEdit={() => onEdit(member)} onDelete={() => onDelete(member)} /></div>)}
    {!team.length && <EmptyState>No team members yet. Add one to assign tasks.</EmptyState>}
  </section>
}
