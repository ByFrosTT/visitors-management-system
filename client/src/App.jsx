import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';

export default function App() {
  const [auth, setAuth] = useState(false);
  const [tab, setTab] = useState('dashboard');
  const [data, setData] = useState({ rooms: [], students: [], fees: [] });
  const [msg, setMsg] = useState('');

  // Form states
  const [student, setStudent] = useState({ name: '', email: '', contact: '', guardianContact: '', selectedRoomId: '', bed: 'B1' });
  const [room, setRoom] = useState({ roomNumber: '', block: 'Boys Wing', capacity: 2, monthlyRent: 5000 });
  
  // Registry states for metrics
  const [leaves, setLeaves] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [movements, setMovements] = useState([]);
  const [leaveForm, setLeaveForm] = useState({ studentName: '', roomDetails: '', reason: 'Holiday', returnDate: '2026-09-01' });
  const [visitorForm, setVisitorForm] = useState({ name: '', contact: '', hostStudent: '', roomNumber: '', reason: 'Visit' });
  const [inOut, setInOut] = useState({ id: '', reason: '', type: 'Out' });
  const [search, setSearch] = useState('');

  const refresh = async () => {
    try {
      const [r, s, f] = await Promise.all([
        axios.get(`${API}/rooms`),
        axios.get(`${API}/students`),
        axios.get(`${API}/fees`)
      ]);
      setData({ rooms: r.data, students: s.data, fees: f.data });
    } catch (e) {
      console.error('Error fetching data:', e);
    }
  };

  useEffect(() => {
    if (auth) refresh();
  }, [auth]);

  const notify = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(''), 3500);
  };

  // 1. Add Student & Allocate Specific Room by ID
  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/students`, {
        name: student.name,
        email: student.email,
        contact: student.contact,
        guardianContact: student.guardianContact
      });

      if (student.selectedRoomId) {
        await axios.post(`${API}/allocate`, {
          studentId: res.data._id,
          roomId: student.selectedRoomId
        });
      }

      notify('✅ Student registered and room allocated successfully');
      setStudent({ name: '', email: '', contact: '', guardianContact: '', selectedRoomId: '', bed: 'B1' });
      refresh();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add student');
    }
  };

  // 2. Add Room
  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/rooms`, {
        roomNumber: room.roomNumber,
        block: room.block,
        capacity: Number(room.capacity),
        monthlyRent: Number(room.monthlyRent)
      });
      notify(`✅ Room ${room.roomNumber} (${room.block}) added successfully`);
      setRoom({ roomNumber: '', block: 'Boys Wing', capacity: 2, monthlyRent: 5000 });
      refresh();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add room');
    }
  };

  // 3. Pay Fee
  const handleFee = async (id, due) => {
    const val = prompt('Enter payment amount (₹):', due);
    if (!val) return;
    await axios.post(`${API}/fees/pay`, { feeId: id, amountPaid: Number(val) });
    notify('Payment recorded successfully');
    refresh();
  };

  // 4. Record Leave
  const handleLeaveSubmit = (e) => {
    e.preventDefault();
    setLeaves([...leaves, { ...leaveForm, id: Date.now() }]);
    notify('Leave application approved and recorded');
    setLeaveForm({ studentName: '', roomDetails: '', reason: 'Holiday', returnDate: '2026-09-01' });
  };

  // 5. Record Visitor
  const handleVisitorSubmit = (e) => {
    e.preventDefault();
    setVisitors([...visitors, { ...visitorForm, id: Date.now(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    notify('Visitor check-in logged');
    setVisitorForm({ name: '', contact: '', hostStudent: '', roomNumber: '', reason: 'Visit' });
  };

  // 6. Record Movement
  const handleMovementSubmit = (e) => {
    e.preventDefault();
    setMovements([...movements, { ...inOut, id: Date.now(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    notify('Student movement recorded');
    setInOut({ id: '', reason: '', type: 'Out' });
  };

  // Computed Stats for Metrics Bar
  const totalStudents = data.students.filter(s => s.status === 'allocated').length;
  const activeLeavesCount = leaves.length;
  const totalVisitorsCount = visitors.length;
  const availableBeds = data.rooms.reduce((acc, r) => acc + (r.capacity - r.occupancy), 0);

  // Professional Styles with Soft Shadowing
  const S = {
    card: { background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)' },
    statBox: { background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', display: 'flex', flexDirection: 'column', gap: '6px', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)', flex: 1 },
    input: { width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box', outline: 'none' },
    btn: { background: '#4f46e5', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px', boxShadow: '0 2px 4px rgba(79, 70, 229, 0.2)' },
    th: { textAlign: 'left', padding: '12px 16px', background: '#f8fafc', color: '#64748b', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0' },
    td: { padding: '12px 16px', borderBottom: '1px solid #f1f5f9', fontSize: '14px', color: '#334155' }
  };

  if (!auth) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ ...S.card, width: '380px', padding: '36px' }}>
          <h2 style={{ margin: '0 0 6px', color: '#0f172a', textAlign: 'center', fontWeight: '700' }}>Hostel Portal</h2>
          <p style={{ margin: '0 0 24px', color: '#64748b', fontSize: '14px', textAlign: 'center' }}>Sign in to manage rooms & admissions</p>
          <form onSubmit={(e) => { e.preventDefault(); setAuth(true); }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input style={S.input} placeholder="Username" defaultValue="admin" required />
            <input style={S.input} type="password" placeholder="Password" defaultValue="password" required />
            <button type="submit" style={S.btn}>Sign In</button>
          </form>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'students', label: 'Student Admissions' },
    { id: 'rooms', label: 'Room Management' },
    { id: 'view', label: 'Directory & Search' },
    { id: 'fees', label: 'Fee Registry' },
    { id: 'inout', label: 'Movement Logs' },
    { id: 'visitors', label: 'Visitor Register' },
    { id: 'leave', label: 'Leave Applications' }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#0f172a' }}>
      
      {/* Sidebar Navigation */}
      <aside style={{ width: '260px', background: '#0f172a', padding: '24px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRight: '1px solid #1e293b' }}>
        <div>
          <div style={{ color: '#fff', fontSize: '19px', fontWeight: '700', padding: '0 12px 24px', borderBottom: '1px solid #1e293b', letterSpacing: '-0.5px' }}>
            Hostel<span style={{ color: '#818cf8' }}>Pro</span>
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '20px' }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                textAlign: 'left', padding: '11px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '500',
                background: tab === t.id ? '#4f46e5' : 'transparent',
                color: tab === t.id ? '#ffffff' : '#94a3b8',
                transition: 'all 0.15s ease'
              }}>
                {t.label}
              </button>
            ))}
          </nav>
        </div>
        <button onClick={() => setAuth(false)} style={{ ...S.btn, background: '#1e293b', color: '#cbd5e1', boxShadow: 'none' }}>Sign Out</button>
      </aside>

      {/* Main Content Workspace */}
      <main style={{ flex: 1, padding: '32px 40px', overflowY: 'auto' }}>
        
        {/* Toast Alert */}
        {msg && <div style={{ background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', padding: '12px 18px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px', fontWeight: '500' }}>{msg}</div>}

        {/* 0. DEDICATED DASHBOARD OVERVIEW */}
        {tab === 'dashboard' && (
          <div>
            <h2 style={{ margin: '0 0 20px', fontSize: '20px', fontWeight: '700' }}>Overview & Metrics</h2>
            
            {/* KPI Cards Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              <div style={S.statBox}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Hostel Residents</span>
                <span style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a' }}>{totalStudents}</span>
                <span style={{ fontSize: '12px', color: '#10b981', fontWeight: '500' }}>Active Occupants</span>
              </div>

              <div style={S.statBox}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Students on Leave</span>
                <span style={{ fontSize: '28px', fontWeight: '700', color: '#f59e0b' }}>{activeLeavesCount}</span>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Approved Applications</span>
              </div>

              <div style={S.statBox}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Visitor Entries</span>
                <span style={{ fontSize: '28px', fontWeight: '700', color: '#6366f1' }}>{totalVisitorsCount}</span>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Logged Today</span>
              </div>

              <div style={S.statBox}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Bed Vacancies</span>
                <span style={{ fontSize: '28px', fontWeight: '700', color: availableBeds > 0 ? '#10b981' : '#ef4444' }}>{availableBeds}</span>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Across all wings</span>
              </div>
            </div>

            {/* Dashboard Quick Summary Tables */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div style={S.card}>
                <h3 style={{ margin: '0 0 16px', fontSize: '16px' }}>Wing Occupancy Summary</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {data.rooms.map(r => (
                    <div key={r._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <span style={{ fontWeight: '600' }}>Room {r.roomNumber} ({r.block})</span>
                      <span style={{ color: r.occupancy >= r.capacity ? '#ef4444' : '#10b981', fontWeight: '600', fontSize: '13px' }}>
                        {r.occupancy} / {r.capacity} Beds Occupied
                      </span>
                    </div>
                  ))}
                  {data.rooms.length === 0 && <div style={{ color: '#64748b', fontSize: '13px' }}>No rooms added yet.</div>}
                </div>
              </div>

              <div style={S.card}>
                <h3 style={{ margin: '0 0 16px', fontSize: '16px' }}>Pending Fee Summary</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {data.fees.filter(f => f.status !== 'paid').map(f => (
                    <div key={f._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#fffbeb', borderRadius: '8px', border: '1px solid #fef3c7' }}>
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '14px' }}>{f.student?.name}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>Room {f.room?.roomNumber}</div>
                      </div>
                      <span style={{ color: '#b45309', fontWeight: '700', fontSize: '14px' }}>
                        Due: ₹{f.amountDue - f.amountPaid}
                      </span>
                    </div>
                  ))}
                  {data.fees.filter(f => f.status !== 'paid').length === 0 && (
                    <div style={{ color: '#16a34a', fontSize: '13px', fontWeight: '500' }}>All dues cleared!</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 1. STUDENT ADMISSIONS & ALLOCATION */}
        {tab === 'students' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '24px' }}>
            <div style={S.card}>
              <h3 style={{ margin: '0 0 18px', fontSize: '17px' }}>Student Admission & Bed Assignment</h3>
              <form onSubmit={handleAddStudent} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <input style={S.input} placeholder="Full Name" required value={student.name} onChange={e => setStudent({...student, name: e.target.value})} />
                <input style={S.input} type="email" placeholder="Email Address" required value={student.email} onChange={e => setStudent({...student, email: e.target.value})} />
                <input style={S.input} placeholder="Student Phone" required value={student.contact} onChange={e => setStudent({...student, contact: e.target.value})} />
                <input style={S.input} placeholder="Guardian Phone" required value={student.guardianContact} onChange={e => setStudent({...student, guardianContact: e.target.value})} />
                
                {/* Compound Room Dropdown: Shows Room Number + Specific Block */}
                <select style={S.input} required value={student.selectedRoomId} onChange={e => setStudent({...student, selectedRoomId: e.target.value})}>
                  <option value="">-- Select Room & Block --</option>
                  {data.rooms.filter(r => r.status === 'available').map(r => (
                    <option key={r._id} value={r._id}>
                      Room {r.roomNumber} ({r.block}) — {r.capacity - r.occupancy} beds free
                    </option>
                  ))}
                </select>

                <select style={S.input} value={student.bed} onChange={e => setStudent({...student, bed: e.target.value})}>
                  <option>Bed B1</option><option>Bed B2</option><option>Bed B3</option>
                </select>
                
                <div style={{ gridColumn: 'span 2', marginTop: '6px' }}>
                  <button type="submit" style={S.btn}>Complete Registration</button>
                </div>
              </form>
            </div>
            
            {/* Live Room List */}
            <div style={S.card}>
              <h3 style={{ margin: '0 0 16px', fontSize: '17px' }}>Live Room Status</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '420px', overflowY: 'auto' }}>
                {data.rooms.map(r => (
                  <div key={r._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '14px' }}>Room {r.roomNumber}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{r.block} • ₹{r.monthlyRent}/mo</div>
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: '600', padding: '4px 8px', borderRadius: '6px', background: r.occupancy >= r.capacity ? '#fee2e2' : '#dcfce7', color: r.occupancy >= r.capacity ? '#991b1b' : '#166534' }}>
                      {r.capacity - r.occupancy} / {r.capacity} Free
                    </span>
                  </div>
                ))}
                {data.rooms.length === 0 && <div style={{ textAlign: 'center', color: '#64748b', fontSize: '13px' }}>No rooms created yet.</div>}
              </div>
            </div>
          </div>
        )}

        {/* 2. ROOM CREATION */}
        {tab === 'rooms' && (
          <div style={{ ...S.card, maxWidth: '520px' }}>
            <h3 style={{ margin: '0 0 18px', fontSize: '17px' }}>Add Room (Multi-Block Supported)</h3>
            <form onSubmit={handleAddRoom} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>Room Number</label>
                <input style={S.input} placeholder="e.g. 101, 102" required value={room.roomNumber} onChange={e => setRoom({...room, roomNumber: e.target.value})} />
              </div>
              
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>Block / Wing Specification</label>
                <select style={S.input} value={room.block} onChange={e => setRoom({...room, block: e.target.value})}>
                  <option value="Boys Wing">Boys Wing</option>
                  <option value="Girls Wing">Girls Wing</option>
                  <option value="Block A">Block A</option>
                  <option value="Block B">Block B</option>
                  <option value="International Wing">International Wing</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>Total Beds</label>
                  <input style={S.input} type="number" min="1" required value={room.capacity} onChange={e => setRoom({...room, capacity: e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>Monthly Rent (₹)</label>
                  <input style={S.input} type="number" required value={room.monthlyRent} onChange={e => setRoom({...room, monthlyRent: e.target.value})} />
                </div>
              </div>

              <button type="submit" style={{ ...S.btn, marginTop: '8px' }}>Create Room</button>
            </form>
          </div>
        )}

        {/* 3. DIRECTORY & SEARCH */}
        {tab === 'view' && (
          <div style={S.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '17px' }}>Resident Student Registry</h3>
              <input style={{ ...S.input, width: '280px' }} placeholder="Search name, room or block..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={S.th}>Room / Block</th>
                  <th style={S.th}>Student Name</th>
                  <th style={S.th}>Contact</th>
                  <th style={S.th}>Guardian Contact</th>
                  <th style={S.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.students.filter(s => 
                  s.name.toLowerCase().includes(search.toLowerCase()) || 
                  (s.allocatedRoom?.roomNumber || '').includes(search) ||
                  (s.allocatedRoom?.block || '').toLowerCase().includes(search.toLowerCase())
                ).map(s => (
                  <tr key={s._id}>
                    <td style={S.td}>
                      <strong>{s.allocatedRoom ? `Room ${s.allocatedRoom.roomNumber}` : '—'}</strong> 
                      {s.allocatedRoom && <span style={{ color: '#64748b', fontSize: '12px' }}> ({s.allocatedRoom.block})</span>}
                    </td>
                    <td style={S.td}>{s.name}</td>
                    <td style={S.td}>{s.contact}</td>
                    <td style={S.td}>{s.guardianContact}</td>
                    <td style={S.td}>
                      <span style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', background: s.status === 'allocated' ? '#ecfdf5' : '#fef2f2', color: s.status === 'allocated' ? '#065f46' : '#991b1b' }}>
                        {s.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 4. FEE REGISTRY */}
        {tab === 'fees' && (
          <div style={S.card}>
            <h3 style={{ margin: '0 0 20px', fontSize: '17px' }}>Hostel Fees & Payment Logs</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={S.th}>Student</th>
                  <th style={S.th}>Assigned Room</th>
                  <th style={S.th}>Due (₹)</th>
                  <th style={S.th}>Paid (₹)</th>
                  <th style={S.th}>Status</th>
                  <th style={S.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.fees.map(f => (
                  <tr key={f._id}>
                    <td style={S.td}>{f.student?.name}</td>
                    <td style={S.td}>Room {f.room?.roomNumber} ({f.room?.block})</td>
                    <td style={S.td}>₹{f.amountDue}</td>
                    <td style={S.td}>₹{f.amountPaid}</td>
                    <td style={S.td}>
                      <span style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', background: f.status === 'paid' ? '#dcfce7' : '#fef3c7', color: f.status === 'paid' ? '#166534' : '#92400e' }}>
                        {f.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={S.td}>
                      {f.status !== 'paid' && (
                        <button onClick={() => handleFee(f._id, f.amountDue - f.amountPaid)} style={{ ...S.btn, padding: '6px 14px', fontSize: '12px', background: '#059669' }}>
                          Pay Due
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 5. MOVEMENT LOGS */}
        {tab === 'inout' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '24px' }}>
            <div style={S.card}>
              <h3 style={{ margin: '0 0 18px', fontSize: '17px' }}>Record Student Check-In / Check-Out</h3>
              <form onSubmit={handleMovementSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input style={S.input} placeholder="Student Name or ID" required value={inOut.id} onChange={e => setInOut({...inOut, id: e.target.value})} />
                <select style={S.input} value={inOut.type} onChange={e => setInOut({...inOut, type: e.target.value})}>
                  <option value="Out">Check Out (Leaving Hostel)</option>
                  <option value="In">Check In (Returning)</option>
                </select>
                <input style={S.input} placeholder="Purpose / Destination" required value={inOut.reason} onChange={e => setInOut({...inOut, reason: e.target.value})} />
                <button type="submit" style={S.btn}>Save Movement Log</button>
              </form>
            </div>

            <div style={S.card}>
              <h3 style={{ margin: '0 0 18px', fontSize: '17px' }}>Movement History</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={S.th}>Student / ID</th>
                    <th style={S.th}>Type</th>
                    <th style={S.th}>Purpose</th>
                    <th style={S.th}>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {movements.map(m => (
                    <tr key={m.id}>
                      <td style={S.td}><strong>{m.id}</strong></td>
                      <td style={S.td}>
                        <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600', background: m.type === 'In' ? '#ecfdf5' : '#fef3c7', color: m.type === 'In' ? '#065f46' : '#92400e' }}>
                          {m.type}
                        </span>
                      </td>
                      <td style={S.td}>{m.reason}</td>
                      <td style={S.td}>{m.time}</td>
                    </tr>
                  ))}
                  {movements.length === 0 && <tr><td colSpan="4" style={{ ...S.td, textAlign: 'center', color: '#94a3b8' }}>No movement recorded today.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. VISITOR DESK */}
        {tab === 'visitors' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '24px' }}>
            <div style={S.card}>
              <h3 style={{ margin: '0 0 18px', fontSize: '17px' }}>Visitor Check-In Form</h3>
              <form onSubmit={handleVisitorSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input style={S.input} placeholder="Visitor Name" required value={visitorForm.name} onChange={e => setVisitorForm({...visitorForm, name: e.target.value})} />
                <input style={S.input} placeholder="Visitor Phone Number" required value={visitorForm.contact} onChange={e => setVisitorForm({...visitorForm, contact: e.target.value})} />
                <input style={S.input} placeholder="Host Student Name" required value={visitorForm.hostStudent} onChange={e => setVisitorForm({...visitorForm, hostStudent: e.target.value})} />
                <input style={S.input} placeholder="Room & Block (e.g. 101 - Boys)" required value={visitorForm.roomNumber} onChange={e => setVisitorForm({...visitorForm, roomNumber: e.target.value})} />
                <button type="submit" style={S.btn}>Log Visitor</button>
              </form>
            </div>

            <div style={S.card}>
              <h3 style={{ margin: '0 0 18px', fontSize: '17px' }}>Today's Visitor Log</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={S.th}>Visitor</th>
                    <th style={S.th}>Visiting</th>
                    <th style={S.th}>Room</th>
                    <th style={S.th}>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {visitors.map(v => (
                    <tr key={v.id}>
                      <td style={S.td}><strong>{v.name}</strong><div style={{ fontSize: '12px', color: '#64748b' }}>{v.contact}</div></td>
                      <td style={S.td}>{v.hostStudent}</td>
                      <td style={S.td}>{v.roomNumber}</td>
                      <td style={S.td}>{v.time}</td>
                    </tr>
                  ))}
                  {visitors.length === 0 && <tr><td colSpan="4" style={{ ...S.td, textAlign: 'center', color: '#94a3b8' }}>No visitor records today.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 7. LEAVE APPLICATIONS */}
        {tab === 'leave' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '24px' }}>
            <div style={S.card}>
              <h3 style={{ margin: '0 0 18px', fontSize: '17px' }}>Submit Leave Application</h3>
              <form onSubmit={handleLeaveSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input style={S.input} placeholder="Student Name" required value={leaveForm.studentName} onChange={e => setLeaveForm({...leaveForm, studentName: e.target.value})} />
                <input style={S.input} placeholder="Room & Block" required value={leaveForm.roomDetails} onChange={e => setLeaveForm({...leaveForm, roomDetails: e.target.value})} />
                <input style={S.input} placeholder="Reason (e.g. Festival, Home Visit)" required value={leaveForm.reason} onChange={e => setLeaveForm({...leaveForm, reason: e.target.value})} />
                <div>
                  <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '4px' }}>Expected Return Date</label>
                  <input style={S.input} type="date" required value={leaveForm.returnDate} onChange={e => setLeaveForm({...leaveForm, returnDate: e.target.value})} />
                </div>
                <button type="submit" style={S.btn}>Approve & Log Leave</button>
              </form>
            </div>

            <div style={S.card}>
              <h3 style={{ margin: '0 0 18px', fontSize: '17px' }}>Active Student Leaves</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={S.th}>Student</th>
                    <th style={S.th}>Room</th>
                    <th style={S.th}>Reason</th>
                    <th style={S.th}>Return Date</th>
                  </tr>
                </thead>
                <tbody>
                  {leaves.map(l => (
                    <tr key={l.id}>
                      <td style={S.td}><strong>{l.studentName}</strong></td>
                      <td style={S.td}>{l.roomDetails}</td>
                      <td style={S.td}>{l.reason}</td>
                      <td style={S.td}>{l.returnDate}</td>
                    </tr>
                  ))}
                  {leaves.length === 0 && <tr><td colSpan="4" style={{ ...S.td, textAlign: 'center', color: '#94a3b8' }}>No approved leaves recorded.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}