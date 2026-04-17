"use client";
import { useState, useCallback, useMemo } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0f1117;
    --bg2: #161b25;
    --bg3: #1d2333;
    --bg4: #242938;
    --border: #2a3045;
    --border2: #343d55;
    --text: #e8ecf4;
    --text2: #8b95b0;
    --text3: #5a6480;
    --green: #22d67a;
    --green-bg: rgba(34,214,122,0.1);
    --green-border: rgba(34,214,122,0.25);
    --red: #ff4d6d;
    --red-bg: rgba(255,77,109,0.1);
    --red-border: rgba(255,77,109,0.25);
    --amber: #f5a623;
    --amber-bg: rgba(245,166,35,0.1);
    --amber-border: rgba(245,166,35,0.25);
    --blue: #4d9fff;
    --blue-bg: rgba(77,159,255,0.1);
    --blue-border: rgba(77,159,255,0.25);
    --purple: #a78bfa;
    --accent: #22d67a;
    --radius: 10px;
    --radius-lg: 14px;
    --mono: 'DM Mono', monospace;
    --sans: 'DM Sans', sans-serif;
  }

  body { font-family: var(--sans); background: var(--bg); color: var(--text); font-size: 14px; line-height: 1.5; }
  button { font-family: var(--sans); cursor: pointer; }
  input, select, textarea { font-family: var(--sans); }

  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg2); }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }

  .erp-root { display: flex; height: 100vh; overflow: hidden; }

  /* SIDEBAR */
  .sidebar {
    width: 220px; min-width: 220px; background: var(--bg2);
    border-right: 1px solid var(--border); display: flex; flex-direction: column;
    padding: 0; transition: width 0.2s; z-index: 50;
  }
  .sidebar-logo {
    padding: 20px 18px 16px; border-bottom: 1px solid var(--border);
  }
  .logo-mark {
    display: flex; align-items: center; gap: 9px;
  }
  .logo-icon {
    width: 32px; height: 32px; background: var(--green);
    border-radius: 8px; display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .logo-icon svg { color: #0f1117; }
  .logo-name { font-size: 15px; font-weight: 600; color: var(--text); letter-spacing: -0.3px; }
  .logo-sub { font-size: 11px; color: var(--text3); margin-top: 1px; }

  .sidebar-nav { flex: 1; padding: 12px 10px; overflow-y: auto; }
  .nav-section { margin-bottom: 20px; }
  .nav-label {
    font-size: 10px; font-weight: 600; color: var(--text3); letter-spacing: 0.08em;
    text-transform: uppercase; padding: 0 8px; margin-bottom: 6px;
  }
  .nav-item {
    display: flex; align-items: center; gap: 9px; padding: 8px 10px;
    border-radius: 8px; cursor: pointer; color: var(--text2);
    font-size: 13px; font-weight: 400; transition: all 0.15s;
    border: 1px solid transparent; margin-bottom: 2px;
  }
  .nav-item:hover { background: var(--bg3); color: var(--text); }
  .nav-item.active {
    background: var(--green-bg); color: var(--green);
    border-color: var(--green-border);
  }
  .nav-item svg { flex-shrink: 0; }
  .nav-badge {
    margin-left: auto; background: var(--red); color: #fff;
    font-size: 10px; font-weight: 600; padding: 1px 6px; border-radius: 10px;
    font-family: var(--mono);
  }
  .nav-badge.amber { background: var(--amber); }

  .sidebar-footer {
    padding: 12px 10px; border-top: 1px solid var(--border);
  }
  .shop-name-pill {
    display: flex; align-items: center; gap: 8px; padding: 8px 10px;
    background: var(--bg3); border-radius: 8px;
  }
  .shop-avatar {
    width: 26px; height: 26px; border-radius: 6px; background: var(--amber-bg);
    border: 1px solid var(--amber-border); display: flex; align-items: center;
    justify-content: center; font-size: 11px; font-weight: 600; color: var(--amber);
  }
  .shop-info { flex: 1; min-width: 0; }
  .shop-nm { font-size: 12px; font-weight: 500; color: var(--text); }
  .shop-plan { font-size: 10px; color: var(--text3); }

  /* MAIN */
  .main-area { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

  .topbar {
    height: 56px; background: var(--bg2); border-bottom: 1px solid var(--border);
    display: flex; align-items: center; padding: 0 24px; gap: 16px; flex-shrink: 0;
  }
  .topbar-title { font-size: 16px; font-weight: 600; color: var(--text); flex: 1; }
  .topbar-date { font-size: 12px; color: var(--text3); font-family: var(--mono); }

  .btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: 8px; font-size: 13px; font-weight: 500;
    border: 1px solid; transition: all 0.15s; cursor: pointer;
  }
  .btn-primary {
    background: var(--green); color: #0f1117; border-color: var(--green);
  }
  .btn-primary:hover { background: #1ec96e; }
  .btn-ghost {
    background: transparent; color: var(--text2); border-color: var(--border);
  }
  .btn-ghost:hover { background: var(--bg3); color: var(--text); border-color: var(--border2); }
  .btn-danger {
    background: var(--red-bg); color: var(--red); border-color: var(--red-border);
  }
  .btn-sm { padding: 5px 10px; font-size: 12px; }

  .page { flex: 1; overflow-y: auto; padding: 24px; }

  /* CARDS */
  .card {
    background: var(--bg2); border: 1px solid var(--border);
    border-radius: var(--radius-lg); padding: 18px 20px;
  }
  .card-sm { padding: 14px 16px; }

  .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px; }
  .kpi-card {
    background: var(--bg2); border: 1px solid var(--border);
    border-radius: var(--radius-lg); padding: 18px 20px; position: relative; overflow: hidden;
  }
  .kpi-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
  }
  .kpi-card.green::before { background: var(--green); }
  .kpi-card.red::before { background: var(--red); }
  .kpi-card.amber::before { background: var(--amber); }
  .kpi-card.blue::before { background: var(--blue); }
  .kpi-label { font-size: 11px; color: var(--text3); font-weight: 500; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px; }
  .kpi-value { font-size: 26px; font-weight: 600; color: var(--text); font-family: var(--mono); letter-spacing: -0.5px; }
  .kpi-value.green { color: var(--green); }
  .kpi-value.red { color: var(--red); }
  .kpi-value.amber { color: var(--amber); }
  .kpi-sub { font-size: 11px; color: var(--text3); margin-top: 6px; display: flex; align-items: center; gap: 4px; }
  .kpi-icon { position: absolute; top: 18px; right: 18px; opacity: 0.15; }

  /* ALERTS */
  .alert {
    display: flex; align-items: center; gap: 10px; padding: 10px 14px;
    border-radius: 8px; font-size: 13px; margin-bottom: 10px; border: 1px solid;
  }
  .alert.red { background: var(--red-bg); border-color: var(--red-border); color: var(--red); }
  .alert.amber { background: var(--amber-bg); border-color: var(--amber-border); color: var(--amber); }
  .alert.green { background: var(--green-bg); border-color: var(--green-border); color: var(--green); }

  /* TABLES */
  .table-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; }
  th {
    text-align: left; padding: 10px 14px; font-size: 11px; font-weight: 600;
    color: var(--text3); text-transform: uppercase; letter-spacing: 0.06em;
    border-bottom: 1px solid var(--border); background: var(--bg3);
    white-space: nowrap;
  }
  td {
    padding: 11px 14px; font-size: 13px; color: var(--text2);
    border-bottom: 1px solid var(--border); vertical-align: middle;
  }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: var(--bg3); }
  .td-mono { font-family: var(--mono); font-size: 12px; }

  /* STATUS BADGES */
  .badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 9px; border-radius: 20px; font-size: 11px; font-weight: 500;
    border: 1px solid; white-space: nowrap;
  }
  .badge::before { content: ''; width: 5px; height: 5px; border-radius: 50%; background: currentColor; }
  .badge.green { background: var(--green-bg); color: var(--green); border-color: var(--green-border); }
  .badge.red { background: var(--red-bg); color: var(--red); border-color: var(--red-border); }
  .badge.amber { background: var(--amber-bg); color: var(--amber); border-color: var(--amber-border); }
  .badge.blue { background: var(--blue-bg); color: var(--blue); border-color: var(--blue-border); }
  .badge.gray { background: var(--bg4); color: var(--text3); border-color: var(--border2); }

  /* FORMS */
  .form-grid { display: grid; gap: 14px; }
  .form-grid-2 { grid-template-columns: 1fr 1fr; }
  .form-grid-3 { grid-template-columns: 1fr 1fr 1fr; }
  .form-group { display: flex; flex-direction: column; gap: 5px; }
  label { font-size: 12px; font-weight: 500; color: var(--text2); }
  input, select, textarea {
    background: var(--bg3); border: 1px solid var(--border);
    color: var(--text); border-radius: 8px; padding: 8px 12px;
    font-size: 13px; outline: none; transition: border-color 0.15s;
    width: 100%;
  }
  input:focus, select:focus, textarea:focus {
    border-color: var(--green); box-shadow: 0 0 0 3px var(--green-bg);
  }
  input::placeholder { color: var(--text3); }
  select option { background: var(--bg3); }

  /* MODAL */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.7);
    display: flex; align-items: center; justify-content: center;
    z-index: 100; padding: 20px;
  }
  .modal {
    background: var(--bg2); border: 1px solid var(--border2);
    border-radius: var(--radius-lg); width: 100%; max-width: 560px;
    max-height: 90vh; overflow-y: auto;
  }
  .modal-header {
    padding: 18px 22px 14px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
  }
  .modal-title { font-size: 15px; font-weight: 600; color: var(--text); }
  .modal-body { padding: 20px 22px; }
  .modal-footer {
    padding: 14px 22px; border-top: 1px solid var(--border);
    display: flex; gap: 10px; justify-content: flex-end;
  }
  .close-btn {
    background: none; border: none; color: var(--text3); padding: 4px;
    border-radius: 4px; display: flex; align-items: center; justify-content: center;
  }
  .close-btn:hover { background: var(--bg4); color: var(--text); }

  /* SECTION HEADERS */
  .section-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 14px;
  }
  .section-title { font-size: 14px; font-weight: 600; color: var(--text); }
  .section-sub { font-size: 12px; color: var(--text3); margin-top: 2px; }

  /* PARTS FUND */
  .fund-display {
    text-align: center; padding: 28px 20px;
    background: var(--bg3); border-radius: var(--radius-lg); border: 1px solid var(--border);
    margin-bottom: 20px;
  }
  .fund-label { font-size: 12px; color: var(--text3); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px; }
  .fund-value { font-size: 40px; font-weight: 600; font-family: var(--mono); letter-spacing: -1px; }
  .fund-value.ok { color: var(--green); }
  .fund-value.warn { color: var(--amber); }
  .fund-value.low { color: var(--red); }
  .fund-sub { font-size: 12px; color: var(--text3); margin-top: 6px; }

  /* PROGRESS BAR */
  .prog-track {
    height: 6px; background: var(--bg4); border-radius: 3px; overflow: hidden; margin-top: 6px;
  }
  .prog-fill { height: 100%; border-radius: 3px; transition: width 0.4s; }

  /* DAYS INDICATOR */
  .days-dot {
    display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 5px;
  }

  /* STAT ROW */
  .stat-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 0; border-bottom: 1px solid var(--border);
    font-size: 13px;
  }
  .stat-row:last-child { border-bottom: none; }
  .stat-l { color: var(--text2); }
  .stat-r { font-family: var(--mono); font-weight: 500; color: var(--text); }

  /* LEDGER TYPE ICONS */
  .tx-type {
    display: inline-flex; align-items: center; justify-content: center;
    width: 28px; height: 28px; border-radius: 7px; flex-shrink: 0;
  }
  .tx-type.income { background: var(--green-bg); color: var(--green); }
  .tx-type.expense { background: var(--red-bg); color: var(--red); }
  .tx-type.withdraw { background: var(--amber-bg); color: var(--amber); }
  .tx-type.transfer { background: var(--blue-bg); color: var(--blue); }

  /* WITHDRAW CARD */
  .withdraw-card {
    background: var(--amber-bg); border: 1px solid var(--amber-border);
    border-radius: var(--radius-lg); padding: 20px;
  }

  /* CHECK CARD */
  .check-card {
    border-radius: var(--radius-lg); padding: 16px 18px; margin-bottom: 10px;
    border: 1px solid;
  }
  .check-card.pass { background: var(--green-bg); border-color: var(--green-border); }
  .check-card.fail { background: var(--red-bg); border-color: var(--red-border); }
  .check-card.warn { background: var(--amber-bg); border-color: var(--amber-border); }

  /* RESPONSIVE */
  @media (max-width: 900px) {
    .kpi-grid { grid-template-columns: repeat(2, 1fr); }
    .form-grid-3 { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 640px) {
    .sidebar { display: none; }
    .kpi-grid { grid-template-columns: repeat(2, 1fr); }
    .form-grid-2, .form-grid-3 { grid-template-columns: 1fr; }
    .page { padding: 16px; }
  }

  .divider { height: 1px; background: var(--border); margin: 18px 0; }
  .text-mono { font-family: var(--mono); }
  .text-sm { font-size: 12px; }
  .text-xs { font-size: 11px; }
  .text-muted { color: var(--text3); }
  .text-secondary { color: var(--text2); }
  .text-green { color: var(--green); }
  .text-red { color: var(--red); }
  .text-amber { color: var(--amber); }
  .text-blue { color: var(--blue); }
  .fw-600 { font-weight: 600; }
  .fw-500 { font-weight: 500; }
  .flex { display: flex; }
  .flex-col { flex-direction: column; }
  .items-center { align-items: center; }
  .justify-between { justify-content: space-between; }
  .gap-4 { gap: 4px; }
  .gap-8 { gap: 8px; }
  .gap-10 { gap: 10px; }
  .gap-12 { gap: 12px; }
  .gap-14 { gap: 14px; }
  .gap-16 { gap: 16px; }
  .mb-6 { margin-bottom: 6px; }
  .mb-10 { margin-bottom: 10px; }
  .mb-14 { margin-bottom: 14px; }
  .mb-20 { margin-bottom: 20px; }
  .mb-24 { margin-bottom: 24px; }
  .mt-4 { margin-top: 4px; }
  .mt-8 { margin-top: 8px; }
  .ml-auto { margin-left: auto; }
  .w-full { width: 100%; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
`;

// ─── SEED DATA ─────────────────────────────────────────────────────────────────
const seedJobs = [
  { id: "JB001", customer: "Ravi Kumar", phone: "9876543210", motorType: "Submersible Pump", hp: 1, workType: "Motor Rewinding", jobCost: 3000, partsCost: 2400, oldCopper: 300, advance: 2400, paid: 2400, status: "Completed", payStatus: "Partial", date: "2026-04-01", deliveryDate: "2026-04-03", lastFollowup: "2026-04-10" },
  { id: "JB002", customer: "Murugan", phone: "9443977602", motorType: "Self Priming Pump", hp: 0.5, workType: "Motor Rewinding", jobCost: 1800, partsCost: 900, oldCopper: 150, advance: 900, paid: 900, status: "In Progress", payStatus: "Partial", date: "2026-04-02", deliveryDate: null, lastFollowup: null },
  { id: "JB003", customer: "Duraisamy", phone: "9585567226", motorType: "Open Well Pump", hp: 3, workType: "Bearing Replacement", jobCost: 1200, partsCost: 450, oldCopper: 0, advance: 450, paid: 1200, status: "Delivered", payStatus: "Paid", date: "2026-04-03", deliveryDate: "2026-04-05", lastFollowup: null },
  { id: "JB004", customer: "Jayaraj", phone: "9842112345", motorType: "Centrifugal Motor", hp: 5, workType: "Pump Service", jobCost: 6600, partsCost: 3200, oldCopper: 600, advance: 3200, paid: 3200, status: "Completed", payStatus: "Partial", date: "2026-04-04", deliveryDate: "2026-04-06", lastFollowup: "2026-04-08" },
  { id: "JB005", customer: "Kaliraj", phone: "9944418529", motorType: "Submersible Pump", hp: 2, workType: "Motor Rewinding", jobCost: 5000, partsCost: 2800, oldCopper: 400, advance: 2800, paid: 5000, status: "Delivered", payStatus: "Paid", date: "2026-04-05", deliveryDate: "2026-04-07", lastFollowup: null },
  { id: "JB006", customer: "Bosh Brothers", phone: "9123582870", motorType: "High Speed Motor", hp: 1, workType: "Starter Repair", jobCost: 800, partsCost: 120, oldCopper: 0, advance: 120, paid: 800, status: "Delivered", payStatus: "Paid", date: "2026-04-06", deliveryDate: "2026-04-06", lastFollowup: null },
  { id: "JB007", customer: "Nataragen", phone: "9442473483", motorType: "Submersible Pump", hp: 1, workType: "Motor Rewinding", jobCost: 3500, partsCost: 1800, oldCopper: 250, advance: 0, paid: 0, status: "Waiting Parts", payStatus: "Unpaid", date: "2026-04-08", deliveryDate: null, lastFollowup: null },
  { id: "JB008", customer: "Karupasamy", phone: "8940324362", motorType: "Compressor Motor", hp: 5, workType: "Motor Rewinding", jobCost: 5500, partsCost: 3100, oldCopper: 500, advance: 3100, paid: 3100, status: "In Progress", payStatus: "Partial", date: "2026-04-09", deliveryDate: null, lastFollowup: null },
];

const seedLedger = [
  { id: 1, date: "2026-04-01", jobId: "JB001", desc: "Advance — Ravi Kumar", type: "income", cat: "Advance", amount: 2400, balance: 7400 },
  { id: 2, date: "2026-04-01", jobId: "JB001", desc: "Copper wire — JB001", type: "expense", cat: "Parts", amount: 2400, balance: 5000 },
  { id: 3, date: "2026-04-03", jobId: "JB003", desc: "Full payment — Duraisamy", type: "income", cat: "Job Payment", amount: 1200, balance: 6200 },
  { id: 4, date: "2026-04-04", jobId: "JB004", desc: "Advance — Jayaraj", type: "income", cat: "Advance", amount: 3200, balance: 9400 },
  { id: 5, date: "2026-04-04", jobId: "JB004", desc: "Parts — JB004 pump service", type: "expense", cat: "Parts", amount: 3200, balance: 6200 },
  { id: 6, date: "2026-04-05", jobId: "JB005", desc: "Full payment — Kaliraj", type: "income", cat: "Job Payment", amount: 5000, balance: 11200 },
  { id: 7, date: "2026-04-06", jobId: "JB006", desc: "Full payment — Bosh Brothers", type: "income", cat: "Job Payment", amount: 800, balance: 12000 },
  { id: 8, date: "2026-04-07", jobId: null, desc: "Electricity bill — April", type: "expense", cat: "Utility", amount: 2800, balance: 9200 },
  { id: 9, date: "2026-04-08", jobId: "JB008", desc: "Advance — Karupasamy", type: "income", cat: "Advance", amount: 3100, balance: 12300 },
  { id: 10, date: "2026-04-09", jobId: null, desc: "Owner withdrawal — April 1st", type: "withdraw", cat: "Owner Draw", amount: 4000, balance: 8300 },
  { id: 11, date: "2026-04-10", jobId: null, desc: "Copper scrap sale", type: "income", cat: "Scrap", amount: 1200, balance: 9500 },
];

const seedPartsFund = [
  { id: 1, date: "2026-04-01", jobId: "JB001", desc: "Advance transferred — JB001", added: 2400, spent: 0, recovery: 0, balance: 2400 },
  { id: 2, date: "2026-04-01", jobId: "JB001", desc: "Copper wire purchased", added: 0, spent: 2400, recovery: 0, balance: 0 },
  { id: 3, date: "2026-04-04", jobId: "JB004", desc: "Advance transferred — JB004", added: 3200, spent: 0, recovery: 0, balance: 3200 },
  { id: 4, date: "2026-04-04", jobId: "JB004", desc: "Parts purchased — JB004", added: 0, spent: 3200, recovery: 0, balance: 0 },
  { id: 5, date: "2026-04-08", jobId: "JB008", desc: "Advance transferred — JB008", added: 3100, spent: 0, recovery: 0, balance: 3100 },
  { id: 6, date: "2026-04-10", jobId: null, desc: "Copper scrap recovered", added: 0, spent: 0, recovery: 1200, balance: 4300 },
];

// ─── HELPERS ───────────────────────────────────────────────────────────────────
const fmt = (n) => "₹" + Math.round(n).toLocaleString("en-IN");
const today = () => new Date().toISOString().slice(0, 10);
const daysSince = (d) => {
  if (!d) return null;
  const diff = (new Date() - new Date(d)) / (1000 * 60 * 60 * 24);
  return Math.floor(diff);
};

// ─── ICONS ─────────────────────────────────────────────────────────────────────
const Icon = {
  Dashboard: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>,
  Jobs: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>,
  Ledger: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
  Parts: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>,
  Pending: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
  Withdraw: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>,
  Plus: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
  X: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
  Check: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>,
  Alert: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>,
  Arrow: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></svg>,
  Motor: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>,
  Eye: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>,
};

console.log(process.env.MONGODB_URI);

// ─── MODAL COMPONENT ───────────────────────────────────────────────────────────
const Modal = ({ title, onClose, children, footer }) => (
  <div className="modal-overlay" onClick={(e) => e.target.className === "modal-overlay" && onClose()}>
    <div className="modal">
      <div className="modal-header">
        <span className="modal-title">{title}</span>
        <button className="close-btn" onClick={onClose}><Icon.X /></button>
      </div>
      <div className="modal-body">{children}</div>
      {footer && <div className="modal-footer">{footer}</div>}
    </div>
  </div>
);

// ─── DASHBOARD PAGE ────────────────────────────────────────────────────────────
const Dashboard = ({ jobs, ledger, partsFund }) => {
  const cashBalance = ledger.length ? ledger[ledger.length - 1].balance : 0;
  const pfBalance = partsFund.length ? partsFund[partsFund.length - 1].balance : 0;
  const todayIncome = ledger.filter(t => t.date === today() && t.type === "income").reduce((s, t) => s + t.amount, 0);
  const pendingTotal = jobs.filter(j => j.payStatus !== "Paid").reduce((s, j) => s + (j.jobCost - j.paid), 0);
  const pendingCount = jobs.filter(j => j.payStatus !== "Paid").length;
  const recentTx = [...ledger].reverse().slice(0, 8);

  return (
    <div className="page">
      {/* Alerts */}
      {pfBalance < 5000 && (
        <div className="alert amber mb-10">
          <Icon.Alert /> Parts fund is low ({fmt(pfBalance)}) — refill before taking new rewinding jobs.
        </div>
      )}
      {pendingTotal > 30000 && (
        <div className="alert red mb-10">
          <Icon.Alert /> High pending payments — {fmt(pendingTotal)} outstanding from {pendingCount} jobs. Follow up now.
        </div>
      )}
      {cashBalance > 10000 && pfBalance >= 5000 && (
        <div className="alert green mb-10">
          <Icon.Check /> Cash and parts fund are healthy. Safe to start new jobs.
        </div>
      )}

      {/* KPI Cards */}
      <div className="kpi-grid mb-24">
        <div className="kpi-card green">
          <div className="kpi-label">Cash balance</div>
          <div className="kpi-value green">{fmt(cashBalance)}</div>
          <div className="kpi-sub">Available in shop right now</div>
          <div className="kpi-icon"><Icon.Ledger /></div>
        </div>
        <div className={`kpi-card ${pfBalance >= 5000 ? "green" : pfBalance >= 2000 ? "amber" : "red"}`}>
          <div className="kpi-label">Parts fund</div>
          <div className={`kpi-value ${pfBalance >= 5000 ? "green" : pfBalance >= 2000 ? "amber" : "red"}`}>{fmt(pfBalance)}</div>
          <div className="kpi-sub">Available for buying materials</div>
          <div className="kpi-icon"><Icon.Parts /></div>
        </div>
        <div className="kpi-card blue">
          <div className="kpi-label">Today&apos;s income</div>
          <div className="kpi-value">{fmt(todayIncome)}</div>
          <div className="kpi-sub">Collected today</div>
          <div className="kpi-icon"><Icon.Arrow /></div>
        </div>
        <div className={`kpi-card ${pendingTotal > 30000 ? "red" : pendingTotal > 10000 ? "amber" : "green"}`}>
          <div className="kpi-label">Pending payments</div>
          <div className={`kpi-value ${pendingTotal > 30000 ? "red" : pendingTotal > 10000 ? "amber" : "green"}`}>{fmt(pendingTotal)}</div>
          <div className="kpi-sub">{pendingCount} jobs waiting</div>
          <div className="kpi-icon"><Icon.Pending /></div>
        </div>
      </div>

      <div className="grid-2">
        {/* Recent Transactions */}
        <div className="card">
          <div className="section-header mb-14">
            <div><div className="section-title">Recent transactions</div></div>
          </div>
          {recentTx.map(tx => (
            <div key={tx.id} className="flex items-center gap-10" style={{ padding: "9px 0", borderBottom: "1px solid var(--border)" }}>
              <div className={`tx-type ${tx.type}`}>
                {tx.type === "income" ? "↑" : tx.type === "withdraw" ? "↗" : "↓"}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="text-sm fw-500" style={{ color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tx.desc}</div>
                <div className="text-xs text-muted">{tx.date} · {tx.cat}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className={`text-sm fw-500 text-mono ${tx.type === "income" ? "text-green" : tx.type === "withdraw" ? "text-amber" : "text-red"}`}>
                  {tx.type === "income" ? "+" : "-"}{fmt(tx.amount)}
                </div>
                <div className="text-xs text-muted text-mono">{fmt(tx.balance)}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Active Jobs Summary */}
        <div className="card">
          <div className="section-header mb-14">
            <div><div className="section-title">Active jobs</div></div>
          </div>
          {jobs.filter(j => j.status !== "Delivered").slice(0, 7).map(j => {
            const balance = j.jobCost - j.paid;
            return (
              <div key={j.id} className="flex items-center gap-10" style={{ padding: "9px 0", borderBottom: "1px solid var(--border)" }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--bg3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon.Motor />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="text-sm fw-500" style={{ color: "var(--text)" }}>{j.customer}</div>
                  <div className="text-xs text-muted">{j.id} · {j.workType}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span className={`badge ${j.status === "In Progress" ? "blue" : j.status === "Completed" ? "amber" : j.status === "Waiting Parts" ? "red" : "gray"}`}>
                    {j.status}
                  </span>
                  {balance > 0 && <div className="text-xs text-red text-mono mt-4">{fmt(balance)} due</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─── JOBS PAGE ─────────────────────────────────────────────────────────────────
const Jobs = ({ jobs, setJobs, ledger, setLedger, partsFund, setPartsFund }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [showPay, setShowPay] = useState(null);
  const [showDetail, setShowDetail] = useState(null);
  const [filter, setFilter] = useState("All");
  const [form, setForm] = useState({ customer: "", phone: "", motorType: "Submersible Pump", hp: "", workType: "Motor Rewinding", jobCost: "", partsCost: "", oldCopper: "", advance: "" });
  const [payForm, setPayForm] = useState({ amount: "", type: "Balance" });

  const cashBalance = ledger.length ? ledger[ledger.length - 1].balance : 0;
  const pfBalance = partsFund.length ? partsFund[partsFund.length - 1].balance : 0;

  const filtered = filter === "All" ? jobs : jobs.filter(j => j.status === filter || j.payStatus === filter);

  const canStart = (partsCost, advance) => {
    const pc = Number(partsCost);
    const adv = Number(advance);
    return adv >= pc || (pfBalance + adv) >= pc;
  };

  const handleAdd = () => {
    const newId = "JB" + String(jobs.length + 1).padStart(3, "0");
    const pc = Number(form.partsCost);
    const adv = Number(form.advance);
    if (!form.customer || !form.jobCost) return;

    const newJob = { id: newId, ...form, hp: Number(form.hp), jobCost: Number(form.jobCost), partsCost: pc, oldCopper: Number(form.oldCopper), advance: adv, paid: adv, status: canStart(pc, adv) ? "In Progress" : "Waiting Parts", payStatus: adv >= Number(form.jobCost) ? "Paid" : adv > 0 ? "Partial" : "Unpaid", date: today(), deliveryDate: null, lastFollowup: null };
    setJobs(prev => [...prev, newJob]);

    if (adv > 0) {
      const lastBal = ledger.length ? ledger[ledger.length - 1].balance : 0;
      setLedger(prev => [...prev, { id: prev.length + 1, date: today(), jobId: newId, desc: `Advance — ${form.customer}`, type: "income", cat: "Advance", amount: adv, balance: lastBal + adv }]);
      const lastPF = partsFund.length ? partsFund[partsFund.length - 1].balance : 0;
      setPartsFund(prev => [...prev, { id: prev.length + 1, date: today(), jobId: newId, desc: `Advance transferred — ${newId}`, added: adv, spent: 0, recovery: 0, balance: lastPF + adv }]);
    }
    setShowAdd(false);
    setForm({ customer: "", phone: "", motorType: "Submersible Pump", hp: "", workType: "Motor Rewinding", jobCost: "", partsCost: "", oldCopper: "", advance: "" });
  };

  const handlePay = () => {
    const amt = Number(payForm.amount);
    if (!amt || !showPay) return;
    const job = jobs.find(j => j.id === showPay);
    const newPaid = job.paid + amt;
    const newPayStatus = newPaid >= job.jobCost ? "Paid" : "Partial";
    setJobs(prev => prev.map(j => j.id === showPay ? { ...j, paid: newPaid, payStatus: newPayStatus, status: newPayStatus === "Paid" ? "Delivered" : j.status } : j));
    const lastBal = ledger.length ? ledger[ledger.length - 1].balance : 0;
    setLedger(prev => [...prev, { id: prev.length + 1, date: today(), jobId: showPay, desc: `${payForm.type} — ${job.customer}`, type: "income", cat: "Job Payment", amount: amt, balance: lastBal + amt }]);
    setShowPay(null);
    setPayForm({ amount: "", type: "Balance" });
  };

  const statusColors = { "In Progress": "blue", "Completed": "amber", "Delivered": "green", "Waiting Parts": "red" };
  const payColors = { Paid: "green", Partial: "amber", Unpaid: "red" };

  return (
    <div className="page">
      <div className="section-header mb-20">
        <div>
          <div className="section-title" style={{ fontSize: 18 }}>Job management</div>
          <div className="section-sub">{jobs.length} total jobs · {jobs.filter(j => j.payStatus !== "Paid").length} with pending payments</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}><Icon.Plus /> New job</button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-8 mb-14" style={{ flexWrap: "wrap" }}>
        {["All", "In Progress", "Completed", "Waiting Parts", "Delivered", "Unpaid", "Partial"].map(f => (
          <button key={f} onClick={() => setFilter(f)} className="btn btn-ghost btn-sm" style={filter === f ? { background: "var(--green-bg)", color: "var(--green)", borderColor: "var(--green-border)" } : {}}>{f}</button>
        ))}
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="table-wrap">
          <table>
            <thead><tr>
              <th>Job ID</th><th>Customer</th><th>Motor</th><th>Work</th>
              <th>Job cost</th><th>Advance</th><th>Balance due</th>
              <th>Status</th><th>Payment</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map(j => {
                const bal = j.jobCost - j.paid;
                return (
                  <tr key={j.id}>
                    <td><span className="td-mono text-blue">{j.id}</span></td>
                    <td><div className="fw-500" style={{ color: "var(--text)" }}>{j.customer}</div><div className="text-xs text-muted">{j.phone}</div></td>
                    <td><div style={{ color: "var(--text)" }}>{j.motorType}</div><div className="text-xs text-muted">{j.hp}HP</div></td>
                    <td>{j.workType}</td>
                    <td className="td-mono">{fmt(j.jobCost)}</td>
                    <td className="td-mono text-green">{fmt(j.advance)}</td>
                    <td className={`td-mono ${bal > 0 ? "text-red" : "text-green"}`}>{bal > 0 ? fmt(bal) : "—"}</td>
                    <td><span className={`badge ${statusColors[j.status] || "gray"}`}>{j.status}</span></td>
                    <td><span className={`badge ${payColors[j.payStatus]}`}>{j.payStatus}</span></td>
                    <td>
                      <div className="flex gap-8">
                        <button className="btn btn-ghost btn-sm" onClick={() => setShowDetail(j)}><Icon.Eye /></button>
                        {j.payStatus !== "Paid" && <button className="btn btn-primary btn-sm" onClick={() => setShowPay(j.id)}>Pay</button>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Job Modal */}
      {showAdd && (
        <Modal title="Add new job" onClose={() => setShowAdd(false)} footer={
          <>
            <button className="btn btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAdd}><Icon.Plus /> Create job</button>
          </>
        }>
          {form.partsCost && form.advance && (
            <div className={`check-card ${canStart(form.partsCost, form.advance) ? "pass" : "fail"} mb-14`}>
              <div className="flex items-center gap-8">
                {canStart(form.partsCost, form.advance) ? <Icon.Check /> : <Icon.Alert />}
                <span className="fw-500" style={{ fontSize: 13 }}>
                  {canStart(form.partsCost, form.advance) ? "Safe to start — advance covers parts cost" : `Cannot start — advance must cover ₹${form.partsCost} parts cost`}
                </span>
              </div>
            </div>
          )}
          <div className="form-grid gap-14">
            <div className="form-grid form-grid-2">
              <div className="form-group"><label>Customer name *</label><input value={form.customer} onChange={e => setForm(p => ({ ...p, customer: e.target.value }))} placeholder="Customer name" /></div>
              <div className="form-group"><label>Phone</label><input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="10-digit number" /></div>
            </div>
            <div className="form-grid form-grid-2">
              <div className="form-group"><label>Motor type</label>
                <select value={form.motorType} onChange={e => setForm(p => ({ ...p, motorType: e.target.value }))}>
                  {["Submersible Pump", "Self Priming Pump", "Open Well Pump", "High Speed Motor", "Centrifugal Motor", "Compressor Motor", "Jet Motor"].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group"><label>HP</label><input type="number" value={form.hp} onChange={e => setForm(p => ({ ...p, hp: e.target.value }))} placeholder="e.g. 1.5" /></div>
            </div>
            <div className="form-group"><label>Work type</label>
              <select value={form.workType} onChange={e => setForm(p => ({ ...p, workType: e.target.value }))}>
                {["Motor Rewinding", "Bearing Replacement", "Pump Service", "Starter Repair", "Seal Replacement", "Cable Repair", "General Maintenance"].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-grid form-grid-3">
              <div className="form-group"><label>Job cost (₹) *</label><input type="number" value={form.jobCost} onChange={e => setForm(p => ({ ...p, jobCost: e.target.value }))} placeholder="3000" /></div>
              <div className="form-group"><label>Parts cost (₹)</label><input type="number" value={form.partsCost} onChange={e => setForm(p => ({ ...p, partsCost: e.target.value }))} placeholder="2400" /></div>
              <div className="form-group"><label>Old copper (₹)</label><input type="number" value={form.oldCopper} onChange={e => setForm(p => ({ ...p, oldCopper: e.target.value }))} placeholder="300" /></div>
            </div>
            <div className="form-group">
              <label>Advance collected (₹) — minimum = parts cost</label>
              <input type="number" value={form.advance} onChange={e => setForm(p => ({ ...p, advance: e.target.value }))} placeholder={form.partsCost || "0"} />
              {form.partsCost && <div className="text-xs text-muted mt-4">Required minimum: {fmt(Number(form.partsCost))}</div>}
            </div>
          </div>
        </Modal>
      )}

      {/* Pay Modal */}
      {showPay && (() => {
        const job = jobs.find(j => j.id === showPay);
        const remaining = job.jobCost - job.paid;
        return (
          <Modal title={`Record payment — ${showPay}`} onClose={() => setShowPay(null)} footer={
            <>
              <button className="btn btn-ghost" onClick={() => setShowPay(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handlePay}><Icon.Check /> Record payment</button>
            </>
          }>
            <div className="card card-sm mb-14" style={{ background: "var(--bg3)" }}>
              <div className="stat-row"><span className="stat-l">Customer</span><span className="stat-r">{job.customer}</span></div>
              <div className="stat-row"><span className="stat-l">Job cost</span><span className="stat-r">{fmt(job.jobCost)}</span></div>
              <div className="stat-row"><span className="stat-l">Already paid</span><span className="stat-r text-green">{fmt(job.paid)}</span></div>
              <div className="stat-row"><span className="stat-l">Balance remaining</span><span className="stat-r text-red">{fmt(remaining)}</span></div>
            </div>
            <div className="form-grid gap-12">
              <div className="form-group"><label>Payment type</label>
                <select value={payForm.type} onChange={e => setPayForm(p => ({ ...p, type: e.target.value }))}>
                  <option>Balance</option><option>Advance</option><option>Full Payment</option>
                </select>
              </div>
              <div className="form-group">
                <label>Amount (₹)</label>
                <input type="number" value={payForm.amount} onChange={e => setPayForm(p => ({ ...p, amount: e.target.value }))} placeholder={String(remaining)} />
                <div className="flex gap-8 mt-8">
                  <button className="btn btn-ghost btn-sm" onClick={() => setPayForm(p => ({ ...p, amount: String(remaining) }))}>Full {fmt(remaining)}</button>
                </div>
              </div>
            </div>
            <div className="alert green" style={{ marginTop: 14 }}>
              <Icon.Check /> This will automatically update the cash ledger and job status.
            </div>
          </Modal>
        );
      })()}

      {/* Detail Modal */}
      {showDetail && (
        <Modal title={`Job details — ${showDetail.id}`} onClose={() => setShowDetail(null)}>
          <div className="form-grid gap-10">
            <div className="card card-sm" style={{ background: "var(--bg3)" }}>
              <div className="stat-row"><span className="stat-l">Customer</span><span className="stat-r">{showDetail.customer}</span></div>
              <div className="stat-row"><span className="stat-l">Phone</span><span className="stat-r">{showDetail.phone || "—"}</span></div>
              <div className="stat-row"><span className="stat-l">Motor</span><span className="stat-r">{showDetail.motorType} · {showDetail.hp}HP</span></div>
              <div className="stat-row"><span className="stat-l">Work type</span><span className="stat-r">{showDetail.workType}</span></div>
              <div className="stat-row"><span className="stat-l">Date received</span><span className="stat-r">{showDetail.date}</span></div>
            </div>
            <div className="card card-sm" style={{ background: "var(--bg3)" }}>
              <div className="stat-row"><span className="stat-l">Job cost</span><span className="stat-r">{fmt(showDetail.jobCost)}</span></div>
              <div className="stat-row"><span className="stat-l">Parts cost</span><span className="stat-r">{fmt(showDetail.partsCost)}</span></div>
              <div className="stat-row"><span className="stat-l">Old copper recovery</span><span className="stat-r text-green">+{fmt(showDetail.oldCopper)}</span></div>
              <div className="stat-row"><span className="stat-l">Net parts cost</span><span className="stat-r">{fmt(showDetail.partsCost - showDetail.oldCopper)}</span></div>
              <div className="stat-row"><span className="stat-l">Job margin</span><span className="stat-r text-green">{fmt(showDetail.jobCost - showDetail.partsCost + showDetail.oldCopper)}</span></div>
              <div className="stat-row"><span className="stat-l">Amount paid</span><span className="stat-r text-green">{fmt(showDetail.paid)}</span></div>
              <div className="stat-row"><span className="stat-l">Balance due</span><span className={`stat-r ${showDetail.jobCost - showDetail.paid > 0 ? "text-red" : "text-green"}`}>{fmt(showDetail.jobCost - showDetail.paid)}</span></div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── CASH LEDGER PAGE ──────────────────────────────────────────────────────────
const Ledger = ({ ledger, setLedger }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ desc: "", type: "expense", cat: "Parts", amount: "" });

  const balance = ledger.length ? ledger[ledger.length - 1].balance : 0;
  const totalIn = ledger.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalOut = ledger.filter(t => t.type !== "income").reduce((s, t) => s + t.amount, 0);

  const handleAdd = () => {
    if (!form.amount || !form.desc) return;
    const amt = Number(form.amount);
    const lastBal = ledger.length ? ledger[ledger.length - 1].balance : 0;
    const newBal = form.type === "income" ? lastBal + amt : lastBal - amt;
    setLedger(prev => [...prev, { id: prev.length + 1, date: today(), jobId: null, desc: form.desc, type: form.type, cat: form.cat, amount: amt, balance: newBal }]);
    setShowAdd(false);
    setForm({ desc: "", type: "expense", cat: "Parts", amount: "" });
  };

  const typeIcon = { income: "↑", expense: "↓", withdraw: "↗", transfer: "⇄" };

  return (
    <div className="page">
      <div className="section-header mb-20">
        <div>
          <div className="section-title" style={{ fontSize: 18 }}>Cash ledger</div>
          <div className="section-sub">Running balance — single source of truth</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}><Icon.Plus /> Add entry</button>
      </div>

      <div className="grid-3 mb-24">
        <div className="kpi-card green">
          <div className="kpi-label">Current balance</div>
          <div className="kpi-value green">{fmt(balance)}</div>
        </div>
        <div className="kpi-card blue">
          <div className="kpi-label">Total income</div>
          <div className="kpi-value">{fmt(totalIn)}</div>
        </div>
        <div className="kpi-card red">
          <div className="kpi-label">Total out</div>
          <div className="kpi-value red">{fmt(totalOut)}</div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="table-wrap">
          <table>
            <thead><tr>
              <th>Date</th><th>Type</th><th>Description</th><th>Category</th><th>Job ID</th><th style={{ textAlign: "right" }}>Amount</th><th style={{ textAlign: "right" }}>Balance</th>
            </tr></thead>
            <tbody>
              {[...ledger].reverse().map(tx => (
                <tr key={tx.id}>
                  <td className="td-mono text-muted">{tx.date}</td>
                  <td>
                    <div className={`tx-type ${tx.type}`} style={{ display: "inline-flex" }}>{typeIcon[tx.type]}</div>
                  </td>
                  <td style={{ color: "var(--text)" }}>{tx.desc}</td>
                  <td><span className={`badge ${tx.type === "income" ? "green" : tx.type === "withdraw" ? "amber" : "gray"}`}>{tx.cat}</span></td>
                  <td className="td-mono text-blue">{tx.jobId || "—"}</td>
                  <td className={`td-mono text-right ${tx.type === "income" ? "text-green" : "text-red"}`} style={{ textAlign: "right" }}>
                    {tx.type === "income" ? "+" : "−"}{fmt(tx.amount)}
                  </td>
                  <td className="td-mono fw-500" style={{ textAlign: "right", color: "var(--text)" }}>{fmt(tx.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd && (
        <Modal title="Add ledger entry" onClose={() => setShowAdd(false)} footer={
          <>
            <button className="btn btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAdd}><Icon.Plus /> Add entry</button>
          </>
        }>
          <div className="form-grid gap-12">
            <div className="form-group"><label>Description</label><input value={form.desc} onChange={e => setForm(p => ({ ...p, desc: e.target.value }))} placeholder="e.g. Electricity bill, Parts purchase..." /></div>
            <div className="form-grid form-grid-2">
              <div className="form-group"><label>Type</label>
                <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                  <option value="income">Income</option><option value="expense">Expense</option><option value="withdraw">Owner Withdrawal</option>
                </select>
              </div>
              <div className="form-group"><label>Category</label>
                <select value={form.cat} onChange={e => setForm(p => ({ ...p, cat: e.target.value }))}>
                  {["Parts", "Job Payment", "Advance", "Utility", "Labour", "Scrap", "Owner Draw", "Other"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group"><label>Amount (₹)</label><input type="number" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} placeholder="0" /></div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── PARTS FUND PAGE ───────────────────────────────────────────────────────────
const PartsFundPage = ({ partsFund, setPartsFund, ledger, setLedger }) => {
  const balance = partsFund.length ? partsFund[partsFund.length - 1].balance : 0;
  const totalAdded = partsFund.reduce((s, r) => s + r.added + r.recovery, 0);
  const totalSpent = partsFund.reduce((s, r) => s + r.spent, 0);
  const [showSpend, setShowSpend] = useState(false);
  const [spendForm, setSpendForm] = useState({ jobId: "", desc: "", amount: "" });

  const handleSpend = () => {
    const amt = Number(spendForm.amount);
    if (!amt) return;
    const lastPF = partsFund.length ? partsFund[partsFund.length - 1].balance : 0;
    const lastLedger = ledger.length ? ledger[ledger.length - 1].balance : 0;
    setPartsFund(prev => [...prev, { id: prev.length + 1, date: today(), jobId: spendForm.jobId, desc: spendForm.desc || "Parts purchased", added: 0, spent: amt, recovery: 0, balance: lastPF - amt }]);
    setLedger(prev => [...prev, { id: prev.length + 1, date: today(), jobId: spendForm.jobId || null, desc: spendForm.desc || "Parts purchased", type: "expense", cat: "Parts", amount: amt, balance: lastLedger - amt }]);
    setShowSpend(false);
    setSpendForm({ jobId: "", desc: "", amount: "" });
  };

  const pct = Math.min((balance / 15000) * 100, 100);
  const fundStatus = balance >= 5000 ? "ok" : balance >= 2000 ? "warn" : "low";
  const fundLabel = balance >= 5000 ? "Healthy — safe to buy parts" : balance >= 2000 ? "Low — refill soon" : "Critical — do not buy new wire";

  return (
    <div className="page">
      <div className="section-header mb-20">
        <div>
          <div className="section-title" style={{ fontSize: 18 }}>Parts fund</div>
          <div className="section-sub">Dedicated money for buying materials only</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowSpend(true)}>Record parts purchase</button>
      </div>

      <div className="fund-display">
        <div className="fund-label">Parts fund balance</div>
        <div className={`fund-value ${fundStatus}`}>{fmt(balance)}</div>
        <div className="fund-sub">{fundLabel}</div>
        <div className="prog-track" style={{ maxWidth: 300, margin: "14px auto 0" }}>
          <div className="prog-fill" style={{ width: pct + "%", background: fundStatus === "ok" ? "var(--green)" : fundStatus === "warn" ? "var(--amber)" : "var(--red)" }} />
        </div>
        <div className="text-xs text-muted" style={{ marginTop: 6 }}>Target minimum: ₹5,000</div>
      </div>

      <div className="grid-3 mb-24">
        <div className="card card-sm">
          <div className="kpi-label" style={{ marginBottom: 6 }}>Total added</div>
          <div className="fw-600 text-green text-mono">{fmt(totalAdded)}</div>
          <div className="text-xs text-muted mt-4">Advances + recoveries</div>
        </div>
        <div className="card card-sm">
          <div className="kpi-label" style={{ marginBottom: 6 }}>Total spent</div>
          <div className="fw-600 text-red text-mono">{fmt(totalSpent)}</div>
          <div className="text-xs text-muted mt-4">Parts purchased</div>
        </div>
        <div className="card card-sm">
          <div className="kpi-label" style={{ marginBottom: 6 }}>Net position</div>
          <div className={`fw-600 text-mono ${totalAdded - totalSpent >= 0 ? "text-green" : "text-red"}`}>{fmt(totalAdded - totalSpent)}</div>
          <div className="text-xs text-muted mt-4">Added minus spent</div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)" }}>
          <span className="section-title">Transaction history</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Date</th><th>Job</th><th>Description</th><th style={{ textAlign: "right" }}>Added</th><th style={{ textAlign: "right" }}>Spent</th><th style={{ textAlign: "right" }}>Recovery</th><th style={{ textAlign: "right" }}>Balance</th></tr></thead>
            <tbody>
              {[...partsFund].reverse().map(r => (
                <tr key={r.id}>
                  <td className="td-mono text-muted">{r.date}</td>
                  <td className="td-mono text-blue">{r.jobId || "—"}</td>
                  <td style={{ color: "var(--text)" }}>{r.desc}</td>
                  <td className="td-mono text-green" style={{ textAlign: "right" }}>{r.added > 0 ? fmt(r.added) : "—"}</td>
                  <td className="td-mono text-red" style={{ textAlign: "right" }}>{r.spent > 0 ? fmt(r.spent) : "—"}</td>
                  <td className="td-mono" style={{ textAlign: "right", color: "var(--purple)" }}>{r.recovery > 0 ? fmt(r.recovery) : "—"}</td>
                  <td className="td-mono fw-500" style={{ textAlign: "right", color: "var(--text)" }}>{fmt(r.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showSpend && (
        <Modal title="Record parts purchase" onClose={() => setShowSpend(false)} footer={
          <>
            <button className="btn btn-ghost" onClick={() => setShowSpend(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSpend}><Icon.Check /> Record purchase</button>
          </>
        }>
          {Number(spendForm.amount) > balance && (
            <div className="alert red mb-14"><Icon.Alert /> Amount exceeds parts fund balance ({fmt(balance)}). Collect more advance first.</div>
          )}
          <div className="form-grid gap-12">
            <div className="form-group"><label>Job ID (optional)</label><input value={spendForm.jobId} onChange={e => setSpendForm(p => ({ ...p, jobId: e.target.value }))} placeholder="e.g. JB007" /></div>
            <div className="form-group"><label>Description</label><input value={spendForm.desc} onChange={e => setSpendForm(p => ({ ...p, desc: e.target.value }))} placeholder="e.g. Copper wire 1.5kg for JB007" /></div>
            <div className="form-group"><label>Amount spent (₹)</label><input type="number" value={spendForm.amount} onChange={e => setSpendForm(p => ({ ...p, amount: e.target.value }))} placeholder="0" /></div>
          </div>
          <div className="card card-sm mt-8" style={{ background: "var(--bg3)" }}>
            <div className="stat-row"><span className="stat-l">Current balance</span><span className="stat-r">{fmt(balance)}</span></div>
            <div className="stat-row"><span className="stat-l">After this purchase</span><span className={`stat-r ${balance - Number(spendForm.amount) < 5000 ? "text-amber" : "text-green"}`}>{fmt(balance - Number(spendForm.amount || 0))}</span></div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── PENDING PAYMENTS PAGE ─────────────────────────────────────────────────────
const Pending = ({ jobs, setJobs, ledger, setLedger }) => {
  const pending = jobs.filter(j => j.payStatus !== "Paid");
  const total = pending.reduce((s, j) => s + (j.jobCost - j.paid), 0);
  const [showPay, setShowPay] = useState(null);
  const [payAmt, setPayAmt] = useState("");

  const handleQuickPay = () => {
    const amt = Number(payAmt);
    if (!amt || !showPay) return;
    const job = jobs.find(j => j.id === showPay);
    const newPaid = job.paid + amt;
    setJobs(prev => prev.map(j => j.id === showPay ? { ...j, paid: newPaid, payStatus: newPaid >= j.jobCost ? "Paid" : "Partial", lastFollowup: today() } : j));
    const lastBal = ledger.length ? ledger[ledger.length - 1].balance : 0;
    setLedger(prev => [...prev, { id: prev.length + 1, date: today(), jobId: showPay, desc: `Payment — ${job.customer}`, type: "income", cat: "Job Payment", amount: amt, balance: lastBal + amt }]);
    setShowPay(null); setPayAmt("");
  };

  const daysColor = (d) => d === null ? "var(--text3)" : d <= 7 ? "var(--green)" : d <= 14 ? "var(--amber)" : "var(--red)";
  const urgency = (d) => d === null ? "Not delivered yet" : d <= 7 ? "Recent" : d <= 14 ? "Follow up" : "Urgent";

  return (
    <div className="page">
      <div className="section-header mb-20">
        <div>
          <div className="section-title" style={{ fontSize: 18 }}>Pending payments</div>
          <div className="section-sub">{pending.length} jobs · {fmt(total)} outstanding</div>
        </div>
      </div>

      {pending.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "40px 20px" }}>
          <div className="text-green fw-600" style={{ fontSize: 16, marginBottom: 8 }}>All payments collected!</div>
          <div className="text-muted text-sm">No outstanding balances right now.</div>
        </div>
      ) : (
        <>
          <div className="alert amber mb-20">
            <Icon.Alert /> {fmt(total)} pending from {pending.length} jobs. Call customers with 14+ days overdue first.
          </div>
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div className="table-wrap">
              <table>
                <thead><tr>
                  <th>Job ID</th><th>Customer</th><th>Motor</th><th>Total</th><th>Paid</th><th style={{ textAlign: "right" }}>Balance</th><th>Delivered</th><th>Urgency</th><th>Action</th>
                </tr></thead>
                <tbody>
                  {pending.sort((a, b) => (daysSince(b.deliveryDate) || 0) - (daysSince(a.deliveryDate) || 0)).map(j => {
                    const bal = j.jobCost - j.paid;
                    const ds = daysSince(j.deliveryDate);
                    return (
                      <tr key={j.id}>
                        <td className="td-mono text-blue">{j.id}</td>
                        <td><div className="fw-500" style={{ color: "var(--text)" }}>{j.customer}</div><div className="text-xs text-muted">{j.phone}</div></td>
                        <td className="text-sm">{j.motorType}</td>
                        <td className="td-mono">{fmt(j.jobCost)}</td>
                        <td className="td-mono text-green">{fmt(j.paid)}</td>
                        <td className="td-mono fw-500 text-red" style={{ textAlign: "right" }}>{fmt(bal)}</td>
                        <td>
                          {j.deliveryDate ? (
                            <div>
                              <div className="text-sm">{j.deliveryDate}</div>
                              <div className="text-xs" style={{ color: daysColor(ds) }}>{ds}d ago</div>
                            </div>
                          ) : <span className="text-muted text-sm">Not yet</span>}
                        </td>
                        <td>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 500, color: daysColor(ds) }}>
                            <span className="days-dot" style={{ background: daysColor(ds) }} />
                            {urgency(ds)}
                          </span>
                        </td>
                        <td><button className="btn btn-primary btn-sm" onClick={() => { setShowPay(j.id); setPayAmt(String(bal)); }}>Collect</button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {showPay && (() => {
        const job = jobs.find(j => j.id === showPay);
        const bal = job.jobCost - job.paid;
        return (
          <Modal title={`Collect payment — ${showPay}`} onClose={() => setShowPay(null)} footer={
            <>
              <button className="btn btn-ghost" onClick={() => setShowPay(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleQuickPay}><Icon.Check /> Confirm collection</button>
            </>
          }>
            <div className="card card-sm mb-14" style={{ background: "var(--bg3)" }}>
              <div className="stat-row"><span className="stat-l">Customer</span><span className="stat-r">{job.customer}</span></div>
              <div className="stat-row"><span className="stat-l">Balance due</span><span className="stat-r text-red">{fmt(bal)}</span></div>
            </div>
            <div className="form-group">
              <label>Amount collected (₹)</label>
              <input type="number" value={payAmt} onChange={e => setPayAmt(e.target.value)} />
              <div className="flex gap-8 mt-8">
                <button className="btn btn-ghost btn-sm" onClick={() => setPayAmt(String(bal))}>Full amount {fmt(bal)}</button>
              </div>
            </div>
          </Modal>
        );
      })()}
    </div>
  );
};

// ─── WITHDRAWAL PAGE ───────────────────────────────────────────────────────────
const Withdrawal = ({ ledger, setLedger, partsFund }) => {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [done, setDone] = useState(false);
  const cashBalance = ledger.length ? ledger[ledger.length - 1].balance : 0;
  const pfBalance = partsFund.length ? partsFund[partsFund.length - 1].balance : 0;
  const amt = Number(amount);
  const afterWithdraw = cashBalance - amt;
  const canWithdraw = pfBalance >= 5000 && afterWithdraw >= 3000 && amt > 0;

  const withdrawals = ledger.filter(t => t.type === "withdraw");

  const handleWithdraw = () => {
    if (!canWithdraw) return;
    const lastBal = ledger.length ? ledger[ledger.length - 1].balance : 0;
    setLedger(prev => [...prev, { id: prev.length + 1, date: today(), jobId: null, desc: `Owner withdrawal${reason ? " — " + reason : ""}`, type: "withdraw", cat: "Owner Draw", amount: amt, balance: lastBal - amt }]);
    setDone(true);
    setTimeout(() => setDone(false), 3000);
    setAmount(""); setReason("");
  };

  return (
    <div className="page">
      <div className="section-header mb-20">
        <div>
          <div className="section-title" style={{ fontSize: 18 }}>Owner withdrawal</div>
          <div className="section-sub">Two conditions must pass before you can withdraw</div>
        </div>
      </div>

      {done && <div className="alert green mb-14"><Icon.Check /> Withdrawal recorded successfully.</div>}

      <div className="grid-2 mb-20">
        <div className={`check-card ${pfBalance >= 5000 ? "pass" : "fail"}`}>
          <div className="flex items-center gap-8">
            {pfBalance >= 5000 ? <Icon.Check /> : <Icon.Alert />}
            <div>
              <div className="fw-500" style={{ fontSize: 13, color: pfBalance >= 5000 ? "var(--green)" : "var(--red)" }}>Condition 1: Parts fund {pfBalance >= 5000 ? "OK" : "LOW"}</div>
              <div className="text-xs text-muted mt-4">Balance: {fmt(pfBalance)} — minimum ₹5,000 required</div>
            </div>
          </div>
        </div>
        <div className={`check-card ${afterWithdraw >= 3000 && amt > 0 ? "pass" : amt > 0 ? "fail" : "warn"}`}>
          <div className="flex items-center gap-8">
            {afterWithdraw >= 3000 && amt > 0 ? <Icon.Check /> : <Icon.Alert />}
            <div>
              <div className="fw-500" style={{ fontSize: 13, color: afterWithdraw >= 3000 && amt > 0 ? "var(--green)" : "var(--amber)" }}>Condition 2: Shop cash after withdrawal</div>
              <div className="text-xs text-muted mt-4">{amt > 0 ? `Will be: ${fmt(afterWithdraw)} — minimum ₹3,000 required` : "Enter amount to check"}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="withdraw-card mb-24">
        <div className="fw-600 mb-14" style={{ color: "var(--amber)" }}>Withdraw from shop</div>
        <div className="form-grid gap-12">
          <div className="form-group">
            <label>Amount (₹)</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g. 3000" style={{ background: "var(--bg2)" }} />
          </div>
          <div className="form-group">
            <label>Reason (optional)</label>
            <input value={reason} onChange={e => setReason(e.target.value)} placeholder="e.g. Home expenses, groceries..." style={{ background: "var(--bg2)" }} />
          </div>
        </div>
        <div className="card card-sm mt-12" style={{ background: "var(--bg2)" }}>
          <div className="stat-row"><span className="stat-l">Current cash balance</span><span className="stat-r text-green">{fmt(cashBalance)}</span></div>
          <div className="stat-row"><span className="stat-l">Withdrawal amount</span><span className="stat-r text-amber">{amt > 0 ? fmt(amt) : "—"}</span></div>
          <div className="stat-row"><span className="stat-l">Balance after withdrawal</span><span className={`stat-r ${afterWithdraw >= 3000 ? "text-green" : "text-red"}`}>{amt > 0 ? fmt(afterWithdraw) : "—"}</span></div>
        </div>
        <button className="btn btn-primary w-full mt-12" onClick={handleWithdraw} disabled={!canWithdraw} style={{ opacity: canWithdraw ? 1 : 0.4, cursor: canWithdraw ? "pointer" : "not-allowed", justifyContent: "center" }}>
          {canWithdraw ? <><Icon.Check /> Confirm withdrawal of {amt > 0 ? fmt(amt) : "—"}</> : "Conditions not met — cannot withdraw"}
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)" }}>
          <span className="section-title">Withdrawal history</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Date</th><th>Description</th><th style={{ textAlign: "right" }}>Amount</th><th style={{ textAlign: "right" }}>Balance after</th></tr></thead>
            <tbody>
              {withdrawals.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: "center", padding: 24, color: "var(--text3)" }}>No withdrawals recorded yet.</td></tr>
              ) : withdrawals.reverse().map(w => (
                <tr key={w.id}>
                  <td className="td-mono text-muted">{w.date}</td>
                  <td style={{ color: "var(--text)" }}>{w.desc}</td>
                  <td className="td-mono text-amber fw-500" style={{ textAlign: "right" }}>{fmt(w.amount)}</td>
                  <td className="td-mono" style={{ textAlign: "right", color: "var(--text)" }}>{fmt(w.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ─── ROOT APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [jobs, setJobs] = useState(seedJobs);
  const [ledger, setLedger] = useState(seedLedger);
  const [partsFund, setPartsFund] = useState(seedPartsFund);

  const cashBalance = ledger.length ? ledger[ledger.length - 1].balance : 0;
  const pfBalance = partsFund.length ? partsFund[partsFund.length - 1].balance : 0;
  const pendingCount = jobs.filter(j => j.payStatus !== "Paid").length;
  const activeCount = jobs.filter(j => j.status === "In Progress" || j.status === "Waiting Parts").length;

  const pageNames = { dashboard: "Dashboard", jobs: "Jobs", ledger: "Cash ledger", parts: "Parts fund", pending: "Pending payments", withdraw: "Withdrawal" };

  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: <Icon.Dashboard /> },
    { key: "jobs", label: "Jobs", icon: <Icon.Jobs />, badge: activeCount > 0 ? activeCount : null },
    { key: "ledger", label: "Cash ledger", icon: <Icon.Ledger /> },
    { key: "parts", label: "Parts fund", icon: <Icon.Parts />, badge: pfBalance < 5000 ? "!" : null, badgeClass: "amber" },
    { key: "pending", label: "Pending", icon: <Icon.Pending />, badge: pendingCount > 0 ? pendingCount : null },
    { key: "withdraw", label: "Withdrawal", icon: <Icon.Withdraw /> },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="erp-root">
        <div className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-mark">
              <div className="logo-icon"><Icon.Motor /></div>
              <div>
                <div className="logo-name">MotorERP</div>
                <div className="logo-sub">Workshop manager</div>
              </div>
            </div>
          </div>

          <div className="sidebar-nav">
            <div className="nav-section">
              <div className="nav-label">Main</div>
              {navItems.map(item => (
                <div key={item.key} className={`nav-item ${page === item.key ? "active" : ""}`} onClick={() => setPage(item.key)}>
                  {item.icon}
                  {item.label}
                  {item.badge && <span className={`nav-badge ${item.badgeClass || ""}`}>{item.badge}</span>}
                </div>
              ))}
            </div>

            <div className="nav-section">
              <div className="nav-label">Quick info</div>
              <div style={{ padding: "8px 10px", background: "var(--bg3)", borderRadius: 8, fontSize: 12 }}>
                <div className="flex justify-between mb-6">
                  <span className="text-muted">Cash</span>
                  <span className="text-green text-mono fw-500">{fmt(cashBalance)}</span>
                </div>
                <div className="flex justify-between mb-6">
                  <span className="text-muted">Parts fund</span>
                  <span className={`text-mono fw-500 ${pfBalance >= 5000 ? "text-green" : "text-amber"}`}>{fmt(pfBalance)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Pending jobs</span>
                  <span className={`text-mono fw-500 ${pendingCount > 5 ? "text-red" : "text-amber"}`}>{pendingCount}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="sidebar-footer">
            <div className="shop-name-pill">
              <div className="shop-avatar">M</div>
              <div className="shop-info">
                <div className="shop-nm">Mcqural Workshop</div>
                <div className="shop-plan">Pro plan</div>
              </div>
            </div>
          </div>
        </div>

        <div className="main-area">
          <div className="topbar">
            <div className="topbar-title">{pageNames[page]}</div>
            <div className="topbar-date">{new Date().toLocaleDateString("en-IN", { weekday: "short", year: "numeric", month: "short", day: "numeric" })}</div>
          </div>

          {page === "dashboard" && <Dashboard jobs={jobs} ledger={ledger} partsFund={partsFund} />}
          {page === "jobs" && <Jobs jobs={jobs} setJobs={setJobs} ledger={ledger} setLedger={setLedger} partsFund={partsFund} setPartsFund={setPartsFund} />}
          {page === "ledger" && <Ledger ledger={ledger} setLedger={setLedger} />}
          {page === "parts" && <PartsFundPage partsFund={partsFund} setPartsFund={setPartsFund} ledger={ledger} setLedger={setLedger} />}
          {page === "pending" && <Pending jobs={jobs} setJobs={setJobs} ledger={ledger} setLedger={setLedger} />}
          {page === "withdraw" && <Withdrawal ledger={ledger} setLedger={setLedger} partsFund={partsFund} />}
        </div>
      </div>
    </>
  );
}
