import React from 'react';

// ─── Ocean Blue design tokens (matches your hospital dashboard) ───────────────
export const OCEAN = {
  900: '#0c1c3d',
  800: '#0f2252',
  700: '#132d6e',
  600: '#1a3a8f',
  500: '#1e40af',
  400: '#2563eb',
  300: '#3b82f6',
  200: '#93c5fd',
  100: '#dbeafe',
  50:  '#eff6ff',
};

// ─── Badge ────────────────────────────────────────────────────────────────────
const BADGE_STYLES = {
  green:   { background:'#dcfce7', color:'#15803d' },
  amber:   { background:'#fef9c3', color:'#b45309' },
  red:     { background:'#fee2e2', color:'#b91c1c' },
  blue:    { background:'#dbeafe', color:'#1d4ed8' },
  teal:    { background:'#ccfbf1', color:'#0f766e' },
  gray:    { background:'#f3f4f6', color:'#4b5563' },
  orange:  { background:'#ffedd5', color:'#c2410c' },
};

export function Badge({ variant = 'gray', children, style }) {
  const s = BADGE_STYLES[variant] || BADGE_STYLES.gray;
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: '0.01em',
      ...s,
      ...style,
    }}>
      {children}
    </span>
  );
}

// ─── Branch Pill ──────────────────────────────────────────────────────────────
export function BranchPill({ branch }) {
  const map = {
    laxmi: { label: 'Laxmi Nagar', bg: '#ccfbf1', color: '#0f766e' },
    raya:  { label: 'Raya',         bg: '#dbeafe', color: '#1d4ed8' },
    all:   { label: 'All Branches', bg: '#f3f4f6', color: '#374151' },
  };
  const b = map[branch] || map.all;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
      background: b.bg, color: b.color,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: b.color, display:'inline-block' }} />
      {b.label}
    </span>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
export function StatCard({ label, value, sub, accent }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: 12,
      padding: '18px 20px',
      borderTop: `3px solid ${accent || OCEAN[400]}`,
    }}>
      <div style={{ fontSize: 13, color: '#6b7280', fontWeight: 500, marginBottom: 6, textTransform:'uppercase', letterSpacing:'0.05em' }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: accent || OCEAN[600], lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 5 }}>{sub}</div>}
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, style, padding }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: 12,
      padding: padding ?? '20px 24px',
      ...style,
    }}>
      {children}
    </div>
  );
}

// ─── Card Header ─────────────────────────────────────────────────────────────
export function CardHeader({ title, action }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 16 }}>
      <div style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>{title}</div>
      {action}
    </div>
  );
}

// ─── Btn ──────────────────────────────────────────────────────────────────────
export function Btn({ children, onClick, variant='outline', size='md', disabled, style }) {
  const sizes = { sm:{ padding:'4px 12px', fontSize:12 }, md:{ padding:'7px 16px', fontSize:13 }, lg:{ padding:'10px 20px', fontSize:14 } };
  const variants = {
    primary: { background: OCEAN[500], color:'#fff', border:`1px solid ${OCEAN[500]}` },
    outline: { background:'#fff', color:'#374151', border:'1px solid #d1d5db' },
    danger:  { background:'#dc2626', color:'#fff', border:'1px solid #dc2626' },
    ghost:   { background:'transparent', color: OCEAN[500], border:'none' },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...sizes[size],
        ...variants[variant],
        borderRadius: 8,
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        display: 'inline-flex', alignItems: 'center', gap: 6,
        transition: 'all 0.15s',
        ...style,
      }}
    >
      {children}
    </button>
  );
}

// ─── Table ────────────────────────────────────────────────────────────────────
export function Table({ columns, data, emptyMsg }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width:'100%', borderCollapse:'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: OCEAN[900] }}>
            {columns.map((col, i) => (
              <th key={i} style={{
                padding: '11px 14px', textAlign: col.align || 'left',
                color: '#93c5fd', fontWeight: 600, fontSize: 11,
                textTransform: 'uppercase', letterSpacing: '0.06em',
                whiteSpace: 'nowrap',
              }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {!data.length && (
            <tr><td colSpan={columns.length} style={{ padding:'32px', textAlign:'center', color:'#9ca3af' }}>{emptyMsg || 'No records found'}</td></tr>
          )}
          {data.map((row, ri) => (
            <tr key={ri} style={{ borderBottom:'1px solid #f3f4f6', background: ri % 2 === 0 ? '#fff' : '#f9fafb' }}>
              {columns.map((col, ci) => (
                <td key={ci} style={{ padding:'11px 14px', color:'#374151', textAlign: col.align || 'left', verticalAlign:'middle' }}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, width }) {
  if (!open) return null;
  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
        zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
    >
      <div style={{
        background: '#fff', borderRadius: 16, padding: '28px 32px',
        width: width || 520, maxWidth: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        maxHeight: '90vh', overflowY: 'auto',
      }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 22 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#111827' }}>{title}</div>
          <button onClick={onClose} style={{ background:'none', border:'none', fontSize:20, cursor:'pointer', color:'#9ca3af', lineHeight:1 }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Form Field ───────────────────────────────────────────────────────────────
export function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:5 }}>{label}</label>
      {children}
    </div>
  );
}

export function Input({ value, onChange, placeholder, type='text', style }) {
  return (
    <input
      type={type} value={value} onChange={onChange} placeholder={placeholder}
      style={{
        width: '100%', padding: '8px 12px', border: '1px solid #d1d5db',
        borderRadius: 8, fontSize: 13, color: '#111827',
        background: '#fff', boxSizing: 'border-box',
        outline: 'none', ...style,
      }}
    />
  );
}

export function Select({ value, onChange, options, style }) {
  return (
    <select
      value={value} onChange={onChange}
      style={{
        width: '100%', padding: '8px 12px', border: '1px solid #d1d5db',
        borderRadius: 8, fontSize: 13, color: '#111827',
        background: '#fff', boxSizing: 'border-box', ...style,
      }}
    >
      {options.map((o, i) => (
        <option key={i} value={o.value ?? o}>{o.label ?? o}</option>
      ))}
    </select>
  );
}

// ─── Tab Bar ─────────────────────────────────────────────────────────────────
export function TabBar({ tabs, active, onChange }) {
  return (
    <div style={{ display:'flex', gap:4, background:'#f3f4f6', padding:4, borderRadius:10, marginBottom:20 }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            padding: '6px 16px', borderRadius: 7, border:'none', cursor:'pointer',
            fontSize: 13, fontWeight: 500, transition: 'all 0.15s',
            background: active === tab.id ? '#fff' : 'transparent',
            color: active === tab.id ? OCEAN[600] : '#6b7280',
            boxShadow: active === tab.id ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
          }}
        >
          {tab.label}
          {tab.count != null && (
            <span style={{ marginLeft:6, fontSize:11, padding:'1px 6px', borderRadius:10,
              background: active === tab.id ? OCEAN[100] : '#e5e7eb',
              color: active === tab.id ? OCEAN[600] : '#6b7280',
            }}>{tab.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}

// ─── Alert Banner ─────────────────────────────────────────────────────────────
export function Alert({ type='warn', children }) {
  const styles = {
    warn:    { bg:'#fefce8', border:'#fde047', color:'#854d0e' },
    success: { bg:'#f0fdf4', border:'#86efac', color:'#15803d' },
    info:    { bg:OCEAN[50],  border:OCEAN[200], color:OCEAN[700] },
    danger:  { bg:'#fef2f2', border:'#fca5a5', color:'#b91c1c' },
  };
  const s = styles[type];
  return (
    <div style={{
      background: s.bg, border: `1px solid ${s.border}`, borderRadius: 10,
      padding:'10px 16px', fontSize:13, color:s.color, marginBottom:16,
    }}>
      {children}
    </div>
  );
}

// ─── Page Header ─────────────────────────────────────────────────────────────
export function PageHeader({ title, sub, actions }) {
  return (
    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:12 }}>
      <div>
        <h1 style={{ fontSize:22, fontWeight:700, color:'#111827', margin:0 }}>{title}</h1>
        {sub && <p style={{ fontSize:13, color:'#6b7280', marginTop:3, marginBottom:0 }}>{sub}</p>}
      </div>
      {actions && <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>{actions}</div>}
    </div>
  );
}

// ─── Sidebar Nav Item ─────────────────────────────────────────────────────────
export function NavItem({ icon, label, active, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display:'flex', alignItems:'center', gap:10,
        padding:'9px 16px', cursor:'pointer', borderRadius:8, margin:'1px 8px',
        background: active ? 'rgba(255,255,255,0.12)' : 'transparent',
        color: active ? '#fff' : 'rgba(255,255,255,0.65)',
        fontSize:13, fontWeight: active ? 600 : 400,
        transition:'all 0.15s',
        borderLeft: active ? `3px solid #60a5fa` : '3px solid transparent',
      }}
    >
      <span style={{ fontSize:16, flexShrink:0 }}>{icon}</span>
      {label}
    </div>
  );
}