// Topin Config Portal — React port of "Topin Config Portal - All Themes" (Claude Design prototype).
// Screen logic below is carried over from the prototype unchanged; the view is generated JSX.
import React from 'react';
import './tokens.css';
import './hover.css';

const DCLogic = React.Component;
// Renders a bound value the way the prototype runtime did.
const I = v => (v === undefined || v === null || typeof v === 'boolean') ? null : <span className="sc-interp">{String(v)}</span>;
const C = {
  amber:{bg:'var(--component-colors-utility-amber-utility-amber-50)',bd:'var(--component-colors-utility-amber-utility-amber-200)',tx:'var(--component-colors-utility-amber-utility-amber-700)',dot:'var(--component-colors-utility-amber-utility-amber-500)'},
  grey:{bg:'var(--component-colors-utility-neutral-utility-neutral-50)',bd:'var(--component-colors-utility-neutral-utility-neutral-200)',tx:'var(--component-colors-utility-neutral-utility-neutral-700)',dot:'var(--component-colors-utility-neutral-utility-neutral-500)'},
  blue:{bg:'var(--component-colors-utility-blue-utility-blue-50)',bd:'var(--component-colors-utility-blue-utility-blue-200)',tx:'var(--component-colors-utility-blue-utility-blue-700)',dot:'var(--component-colors-utility-blue-utility-blue-500)'},
  green:{bg:'var(--component-colors-utility-green-utility-green-50)',bd:'var(--component-colors-utility-green-utility-green-200)',tx:'var(--component-colors-utility-green-utility-green-700)',dot:'var(--component-colors-utility-green-utility-green-500)'},
  red:{bg:'var(--component-colors-utility-red-utility-red-50)',bd:'var(--component-colors-utility-red-utility-red-200)',tx:'var(--component-colors-utility-red-utility-red-700)',dot:'var(--component-colors-utility-red-utility-red-500)'},
  brand:{bg:'var(--component-colors-utility-brand-utility-brand-50)',bd:'var(--component-colors-utility-brand-utility-brand-200)',tx:'var(--component-colors-utility-brand-utility-brand-700)',dot:'var(--component-colors-utility-brand-utility-brand-500)'}
};
const ACC = {teal:{bg:'var(--acc-a-bg)',tx:'var(--acc-a-tx)'}, violet:{bg:'var(--acc-b-bg)',tx:'var(--acc-b-tx)'}, amber:{bg:'var(--acc-c-bg)',tx:'var(--acc-c-tx)'}, sage:{bg:'var(--acc-d-bg)',tx:'var(--acc-d-tx)'}, rose:{bg:'var(--acc-e-bg)',tx:'var(--acc-e-tx)'}};
const ASTAT = {'In Progress':C.amber,'Yet to Invite':C.grey,'Yet to Start':C.blue,'Completed':C.green,'Draft':C.grey};
const CSTAT = {Invited:C.grey,Attempted:C.blue,'In Progress':C.amber,Shortlisted:C.green,Rejected:C.red};
const A = [
  ['Untitled Assessment - SEB - copy','In Progress',41],['Untitled Assessment - SEB','In Progress',41],
  ['Generative and Agentic AI','Yet to Invite',30],['Generative and Agentic AI','Yet to Start',20],
  ['Generative and Agentic AI','In Progress',30],['Generative and Agentic AI','Completed',30],
  ['College Dost Common','Draft',60],['College Dost Common','Yet to Start',60],
  ['College Dost Common','In Progress',60],['College Dost Common','Completed',60]
].map((a,i)=>({i,name:a[0],status:a[1],score:a[2]}));
const CN = [['Aarav','Shortlisted',30,'9:00 AM'],['Ananya','In Progress',null,'10:07 AM'],['Rohan','Attempted',30,'11:14 AM'],['Priya','Shortlisted',33,'12:21 PM'],['Vikram','In Progress',null,'1:28 PM'],['Sneha','Rejected',8,'2:35 PM'],['Arjun','Shortlisted',38,'3:42 PM'],['Kavya','In Progress',null,'4:49 PM'],['Rahul','Attempted',23,'5:56 PM'],['Isha','Rejected',9,'7:03 PM']];
const STATUS_OPTS = [{key:'All',label:'All',count:18},{group:'Active'},{key:'In Progress',label:'In Progress',count:7,indent:true},{key:'Yet to Invite',label:'Yet to Invite',count:2,indent:true},{key:'Yet to Start',label:'Yet to Start',count:3,indent:true},{key:'Completed',label:'Completed',count:4},{key:'Draft',label:'Drafts',count:2}];
const PRESETS = {
  Standard:{cam:true,camAuto:false,audio:true,screen:true,face:true,device:false,autoTerm:true,tab:true,mobile:false,seb:false},
  Secure:{cam:true,camAuto:true,audio:true,screen:true,face:true,device:true,autoTerm:true,tab:true,mobile:false,seb:true},
  Practice:{cam:false,camAuto:false,audio:false,screen:false,face:false,device:false,autoTerm:false,tab:true,mobile:false,seb:false}
};
const SETTINGS = [['cam','Camera Monitoring',{k:'camAuto',label:'Auto-Terminate on Camera Violations'}],['audio','Audio Monitoring'],['screen','Screen Monitoring'],['face','Face Verification'],['device','Electronic Device Detection'],['autoTerm','Auto Terminate on Violations'],['tab','Tab & Window Switch Monitoring',{stepper:true,label:'Warnings Before Termination'}],['mobile','Attempt on Mobile',null,true],['seb','Secure Browser Exam']];
const sw = (on, disabled) => ({on, track: on ? 'var(--brand)' : 'var(--colors-zinc-300)', knob: on ? '18px' : '2px', op: disabled ? 0.5 : 1});

class Component extends DCLogic {
  state = { screen:null, from:'list', tab:'basic', collapsed:null, menu:null, invBy:'New Candidates', status:'All', mine:false, refreshing:false, toast:null, copied:false, cand:'All', candSearch:'', candPage:1, drawer:false, invite:'single', invRows:[{id:0,name:"",phone:"",email:""}], invNext:1, adv:'Proctoring', template:'Standard', tg:{...PRESETS.Standard, master:true}, warnings:5, tip:null, page:1, rowsPer:'10', search:'', cur:A[0] };
  componentDidMount(){
    this.applyTheme();
    this._over = e => {
      const el = e.target && e.target.closest ? e.target.closest('[data-tip]') : null;
      if (el === this._tipEl) return;
      this._tipEl = el;
      if (!el || !el.getAttribute('data-tip')) return this.setState({gtip:null});
      const r = el.getBoundingClientRect();
      this.setState({gtip:{text:el.getAttribute('data-tip'), side:el.getAttribute('data-tip-side') || 'top', l:r.left, t:r.top, b:r.bottom, ri:r.right, cx:r.left + r.width / 2, cy:r.top + r.height / 2}}, () => { const t = document.querySelector('[role="tooltip"]'); if (!t || !this.state.gtip || this.state.gtip.side === 'right') return; const b = t.getBoundingClientRect(), pad = 8; let dx = 0; if (b.right > window.innerWidth - pad) dx = window.innerWidth - pad - b.right; if (b.left + dx < pad) dx = pad - b.left; if (dx) this.setState(st => st.gtip ? {gtip:{...st.gtip, dx}} : null); });
    };
    this._hideTip = () => { this._tipEl = null; this.state.gtip && this.setState({gtip:null}); };
    document.addEventListener('mouseover', this._over);
    document.addEventListener('focusin', this._over);
    document.addEventListener('focusout', this._hideTip);
    document.addEventListener('click', this._hideTip, true);
    window.addEventListener('scroll', this._hideTip, true);
    this._down = e => { if (this.state.menu && !e.target.closest('[data-menu]')) this.setState({menu:null}); };
    this._key = e => { if (e.key === 'Escape') this.setState({menu:null, drawer:false}); };
    document.addEventListener('mousedown', this._down);
    window.addEventListener('keydown', this._key);
  }
  componentDidUpdate(){ this.applyTheme(); }
  componentWillUnmount(){
    document.removeEventListener('mouseover', this._over);
    document.removeEventListener('focusin', this._over);
    document.removeEventListener('focusout', this._hideTip);
    document.removeEventListener('click', this._hideTip, true);
    window.removeEventListener('scroll', this._hideTip, true);
    document.removeEventListener('mousedown', this._down);
    window.removeEventListener('keydown', this._key);
    clearTimeout(this._t1); clearTimeout(this._t2); clearTimeout(this._t3);
  }
  applyTheme(){
    const m = 'topin-tech', th = {'Orange + Graphite':'orangegraphite', Indigo:'indigo', Forest:'forest'}[this.state.themeSel || this.props.theme] || 'orangegraphite';
    if (this._applied === th) return;
    this._applied = th;
    document.documentElement.setAttribute('data-mode', m);
    document.documentElement.setAttribute('data-theme', th);
  }

  showToast(msg){
    clearTimeout(this._t2);
    this.setState({toast:msg});
    this._t2 = setTimeout(() => this.setState({toast:null}), 2400);
  }
  renderVals(){
    const s = this.state, set = o => this.setState(o);
    const themeSwitch = [['Orange + Graphite','var(--colors-orange-500)'],['Indigo','var(--colors-indigo-500)'],['Forest','var(--colors-emerald-500)']].map(([name,dot]) => { const on = (s.themeSel || 'Orange + Graphite') === name; return {name, dot, bg: on ? 'var(--colors-base-white)' : 'transparent', fg: on ? 'var(--colors-zinc-900)' : 'var(--colors-base-white)', pick: () => set({themeSel:name})}; });
    const collapsed = s.collapsed ?? !!this.props.sidebarCollapsed;
    const screen = s.screen ?? this.props.startScreen ?? 'list';
    const go = (sc, extra = {}) => { set({screen:sc, menu:null, tip:null, ...extra}); window.scrollTo(0,0); };
    const tipOn = k => () => set({tip:k});
    const tipOff = () => s.tip && set({tip:null});

    const navItems = [['Home','#i-dash'],['My Questions','#i-msg'],['Users & Roles','#i-users'],['Integrations','#i-apps']].map(([label, icon]) => {
      const active = label === 'Home';
      return {label, icon: active ? icon + '-s' : icon, active, current: active ? 'page' : undefined, iconColor: active ? 'var(--nav-icon)' : 'currentColor', bg: active ? 'var(--nav-bg)' : 'transparent', hoverBg: active ? 'var(--nav-bg)' : 'var(--hover)', color: active ? 'var(--nav-ink)' : 'var(--ink)', weight: active ? 600 : 500, tip: collapsed && s.tip === 'nav-' + label, enter: tipOn('nav-' + label), onClick: () => active ? go('list') : this.showToast(label + ' is not part of this prototype')};
    });
    const navBottom = [{label:'Help', tip: collapsed && s.tip === 'nav-Help', enter: tipOn('nav-Help')}];

    const q = s.search.trim().toLowerCase();
    const rows = A.filter(r => (s.status === 'All' || r.status === s.status) && (!q || r.name.toLowerCase().includes(q))).map((r, idx) => ({
      ...r, start:'02 Nov, 03:52 PM', end:'09 Nov, 12:00 AM', b: ASTAT[r.status],
      divider: idx ? '1px solid var(--border)' : 'none',
      open: () => go('details', {tab:'basic', cur:r}),
      key: e => { if (e.key === 'Enter') go('details', {tab:'basic', cur:r}); },
      stats: e => { e.stopPropagation(); go('stats', {cur:r, from:'list'}); },
      clone: e => { e.stopPropagation(); this.showToast('Assessment cloned'); },
      statsTip: s.tip === 's' + r.i, cloneTip: s.tip === 'c' + r.i, enterS: tipOn('s' + r.i), enterC: tipOn('c' + r.i)
    }));
    const statusSel = STATUS_OPTS.find(o => o.key === s.status);
    const statusOptions = STATUS_OPTS.map(o => o.group ? {isGroup:true, label:o.group} : {isOption:true, label:o.label, count:o.count, selected:o.key === s.status, bg: o.key === s.status ? 'var(--subtle)' : 'transparent', padL: o.indent ? '16px' : '8px', pick: () => set({status:o.key, menu:null})});
    const pages = [1,2,3,'…',8,9,10].map(p => ({label:p, gap: p === '…', bg: p === s.page ? 'var(--hover)' : 'transparent', weight: p === s.page ? 600 : 500, color: p === '…' ? 'var(--muted)' : 'var(--ink)', go: () => p !== '…' && set({page:p})}));
    const cur = {...s.cur, b: ASTAT[s.cur.status]};

    const tabs = [['basic','Basic Details'],['sections','Sections Details'],['advanced','Advanced Options']].map(([k, label, count]) => ({label, count, color: s.tab === k ? 'var(--ink)' : 'var(--muted)', line: s.tab === k ? 'var(--accent)' : 'transparent', pick: () => set({tab:k})}));

    const KP = [['Invited',150,'teal','#i-users','All'],['Attempted',100,'violet','#i-clip','Attempted'],['In Progress',50,'amber','#i-user-share','In Progress'],['Average Score','25.1','brand','#i-target','All','/ 41'],['Shortlisted',30,'sage','#i-user-check','Shortlisted'],['Rejected',15,'rose','#i-user-x','Rejected']];
    const kpiSel = s.kpi ?? 'Invited';
    const kpis = KP.map(([label, value, c, icon, filter, suffix]) => {
      const selected = kpiSel === label;
      return {label, value, c: ACC[c] || C[c], icon, suffix, selected, border: selected ? 'var(--accent)' : 'var(--border)', ring: selected ? '0 0 0 1px var(--accent)' : 'none', pick: () => set({kpi:label, cand:filter, candPage:1})};
    });
    const cq = s.candSearch.trim().toLowerCase();
    const candidates = CN.map((c, i) => ({sno:i + 1, name:c[0] + ' Sharma', email:c[0].toLowerCase() + '.sharma@example.com', initials:c[0][0] + 'S', status:c[1], score:c[2], invited:'28 Oct 2026, ' + c[3]}))
      .filter(c => (s.cand === 'All' || c.status === s.cand) && (!cq || c.name.toLowerCase().includes(cq) || c.email.includes(cq)))
      .map((c, idx) => ({...c, b: CSTAT[c.status], divider: idx ? '1px solid var(--border)' : 'none', hasScore: c.score != null, scoreText: c.score != null ? c.score + '/41' : '--', scoreColor: c.score != null ? 'var(--ink)' : 'var(--muted)', barW: c.score != null ? Math.round(c.score / 41 * 72) + 'px' : '0px'}));
    const candOptions = ['All','Invited','Attempted','In Progress','Shortlisted','Rejected'].map(k => ({label: k === 'All' ? 'All statuses' : k, selected: s.cand === k, bg: s.cand === k ? 'var(--subtle)' : 'transparent', pick: () => set({cand:k, menu:null, candPage:1, kpi: KP.find(x => x[4] === k && x[0] !== 'Average Score')?.[0] || 'Invited'})}));
    const candPages = [1,2,'…',15].map(p => ({label:p, gap: p === '…', bg: p === s.candPage ? 'var(--hover)' : 'transparent', weight: p === s.candPage ? 600 : 500, color: p === '…' ? 'var(--muted)' : 'var(--ink)', go: () => p !== '…' && set({candPage:p})}));

    const tg = s.tg;
    const toggle = k => () => set({tg:{...tg, [k]:!tg[k]}});
    const settings = SETTINGS.map(([k, label, sub, disabled]) => {
      const main = sw(tg[k] && !disabled, disabled);
      const subSw = sub && !sub.stepper ? sw(tg[sub.k] && tg[k], !tg[k]) : null;
      return {label, ...main, disabled: !!disabled, toggle: toggle(k), labelColor: disabled ? 'var(--muted)' : 'var(--ink)',
        hasSubToggle: !!subSw, hasStepper: !!(sub && sub.stepper && tg[k]), subLabel: sub ? sub.label : '',
        subOn: subSw ? subSw.on : false, subTrack: subSw ? subSw.track : '', subKnob: subSw ? subSw.knob : '', subOp: subSw ? subSw.op : 1,
        subToggle: sub && !sub.stepper ? () => tg[k] && set({tg:{...tg, [sub.k]:!tg[sub.k]}}) : null};
    });
    const templates = [['Standard','Balanced security for exams'],['Secure','Maximum security for exams'],['Practice','Light checks for low-stakes runs']].map(([title, desc]) => {
      const on = s.template === title;
      return {title, desc, bg: on ? 'var(--tint)' : 'var(--colors-background-bg-primary)', borderStyle: on ? 'solid' : 'dashed', borderColor: on ? 'transparent' : 'var(--border)', pick: () => set({template:title, tg:{...PRESETS[title], master:tg.master}})};
    });
    const advNav = ['Proctoring','Communications','Results & Review','Candidate Experience','Reporting & Analytics'].map(label => ({label, bg: s.adv === label ? 'var(--hover)' : 'transparent', weight: s.adv === label ? 600 : 500, color: s.adv === label ? 'var(--ink)' : 'var(--muted)', pick: () => set({adv:label})}));

    const copied = s.copied;
    const copyBtn = copied ? {bg:C.green.bg, bd:C.green.bd, tx:C.green.tx, icon:'#i-check', label:'Copied'} : {bg:'var(--colors-background-bg-primary)', bd:'var(--border)', tx:'var(--ink)', icon:'#i-copy', label:'Copy'};

    const g = s.gtip;
    const gtip = !g ? null : g.side === 'right'
      ? {text:g.text, left:(g.ri + 10) + 'px', top:g.cy + 'px', transform:'translateY(-50%)', al:'-4px', at:'50%', ab:'auto', ml:'0px', mt:'-4px'}
      : g.side === 'bottom'
      ? {text:g.text, left:(g.cx + (g.dx || 0)) + 'px', top:(g.b + 8) + 'px', transform:'translateX(-50%)', al:'calc(50% - ' + (g.dx || 0) + 'px)', at:'-4px', ab:'auto', ml:'-4px', mt:'0px'}
      : {text:g.text, left:(g.cx + (g.dx || 0)) + 'px', top:(g.t - 8) + 'px', transform:'translate(-50%,-100%)', al:'calc(50% - ' + (g.dx || 0) + 'px)', at:'auto', ab:'-4px', ml:'-4px', mt:'0px'};
    return { themeSwitch,
      gtip, sideTip: collapsed ? 'Expand sidebar' : 'Collapse sidebar', sideTipSide: collapsed ? 'right' : 'bottom',
      expanded: !collapsed, collapsed, sideW: collapsed ? '64px' : '280px', collapseBtnW: collapsed ? '32px' : '40px',
      itemPad: collapsed ? '0px' : '12px', itemW: collapsed ? '44px' : '100%', sidePad: collapsed ? '16px 10px' : '16px', barLeft: collapsed ? '-10px' : '-16px', itemJustify: collapsed ? 'center' : 'flex-start',
      toggleSide: () => set({collapsed: !collapsed, tip:null}),
      navItems, navBottom, tipOff, tipCredits: tipOn('credits'), creditsTip: collapsed && s.tip === 'credits',
      isList: screen === 'list', isDetails: screen === 'details', isStats: screen === 'stats',
      search: s.search, onSearch: e => set({search:e.target.value}),
      statusLabel: `${statusSel.label} (${statusSel.count})`, statusMenuOpen: s.menu === 'status', statusOptions,
      toggleStatusMenu: () => set({menu: s.menu === 'status' ? null : 'status'}),
      createdByLabel: s.mine ? 'Created by me' : 'Created by all', toggleCreatedBy: () => set({mine:!s.mine}),
      refresh: () => { if (s.refreshing) return; set({refreshing:true}); this._t1 = setTimeout(() => { this.setState({refreshing:false}); this.showToast('Assessments refreshed'); }, 900); },
      refreshing: s.refreshing, showRows: !s.refreshing, rows, noRows: rows.length === 0,
      skeletons: Array.from({length:10}, (_, i) => ({w: [180,150,200,170,210,160,190,140,175,200][i] + 'px', divider: i ? '1px solid var(--border)' : 'none'})),
      page: s.page, pages,
      toggle_rows: () => set({menu: s.menu === 'rows' ? null : 'rows'}), open_rows: s.menu === 'rows', label_rows: s.rowsPer, rowsH: '36px',
      opts_rows: ['10','25','50'].map(v => ({label:v, selected: s.rowsPer === v, bg: s.rowsPer === v ? 'var(--subtle)' : 'transparent', pick: () => set({rowsPer:v, menu:null})})),
      toggle_inv: () => set({menu: s.menu === 'inv' ? null : 'inv'}), open_inv: s.menu === 'inv', label_inv: s.invBy, invH: '40px',
      opts_inv: ['New Candidates','Existing Candidates'].map(v => ({label:v, selected: s.invBy === v, bg: s.invBy === v ? 'var(--subtle)' : 'transparent', pick: () => set({invBy:v, menu:null})})),
      firstPage: () => set({page:1}), lastPage: () => set({page:10}),
      prevPage: () => set({page: Math.max(1, s.page - 1)}), nextPage: () => set({page: Math.min(10, s.page + 1)}),
      cur, goList: () => go('list'), goStats: () => go('stats', {from:'details'}),
      goBackFromStats: () => go(s.from === 'details' ? 'details' : 'list'),
      cloneCur: () => this.showToast('Assessment cloned'), openDrawer: () => set({drawer:true}),
      tabs, tabBasic: s.tab === 'basic', tabSections: s.tab === 'sections', tabAdvanced: s.tab === 'advanced',
      detailMetrics: [{label:'Invited Candidates', value:150, c:ACC.teal, icon:'#i-users'},{label:'In-Progress Candidates', value:50, c:ACC.amber, icon:'#i-user-share'},{label:'Attempted Candidates', value:100, c:ACC.violet, icon:'#i-user-check'}],
      copyBtn, copyLink: () => { try { navigator.clipboard && navigator.clipboard.writeText('https://app.topin.tech/customer/assessments/a1?referrer=Edit%20Assessment').catch(() => {}); } catch (e) {} clearTimeout(this._t3); set({copied:true}); this._t3 = setTimeout(() => this.setState({copied:false}), 2000); },
      tags: ['Hiring','React JS','Fresher Hiring','Multiple Choice','Off Campus Hiring','+8'],
      sections: [['Aptitude',10,10,'15 mins','Multiple Choice'],['React JS',12,15,'20 mins','Multiple Choice'],['Coding',2,10,'20 mins','Coding'],['Communication',5,6,'5 mins','Subjective']].map((x, i) => ({name:x[0], q:x[1], m:x[2], d:x[3], t:x[4], divider: i ? '1px solid var(--border)' : 'none'})),
      advNav, templates, settings, master: {...sw(tg.master), toggle: toggle('master')},
      warnings: s.warnings, warnUp: () => set({warnings: Math.min(20, s.warnings + 1)}), warnDown: () => set({warnings: Math.max(1, s.warnings - 1)}),
      download: () => this.showToast('Results download started'),
      kpis, candidates, noCandidates: candidates.length === 0, candSearch: s.candSearch, onCandSearch: e => set({candSearch:e.target.value}),
      candLabel: s.cand === 'All' ? 'All statuses' : s.cand, candMenuOpen: s.menu === 'cand', candOptions,
      toggleCandMenu: () => set({menu: s.menu === 'cand' ? null : 'cand'}),
      candPages, candPrev: () => set({candPage: Math.max(1, s.candPage - 1)}), candNext: () => set({candPage: Math.min(15, s.candPage + 1)}),
      drawer: s.drawer, closeDrawer: () => set({drawer:false}),
      isSingle: s.invite === 'single', isBulk: s.invite === 'bulk',
      singleBg: s.invite === 'single' ? 'var(--hover)' : 'var(--colors-background-bg-primary)', bulkBg: s.invite === 'bulk' ? 'var(--hover)' : 'var(--colors-background-bg-primary)',
      setSingle: () => set({invite:'single'}), setBulk: () => set({invite:'bulk'}),
      inviteRows: s.invRows.map((r, i) => ({...r, removable: i > 0, remove: () => set({invRows: s.invRows.filter(x => x.id !== r.id)}), onname: e => { const v = e.target.value; set({invRows: s.invRows.map(x => x.id === r.id ? {...x, name:v} : x)}); }, onphone: e => { const v = e.target.value; set({invRows: s.invRows.map(x => x.id === r.id ? {...x, phone:v} : x)}); }, onemail: e => { const v = e.target.value; set({invRows: s.invRows.map(x => x.id === r.id ? {...x, email:v} : x)}); }})), addInviteRow: () => set({invRows: [...s.invRows, {id:s.invNext, name:'', phone:'', email:''}], invNext: s.invNext + 1}),
      sendInvite: () => { set({drawer:false, invRows:[{id:0,name:'',phone:'',email:''}], invNext:1}); this.showToast('Invite sent'); },
      toast: s.toast
    };
  }
}

Component.prototype.render = function render() {
  const V = this.renderVals();
  return (
    <>
      <svg aria-hidden="true" style={{position: "absolute", width: "0", height: "0", overflow: "hidden"}}>
        <symbol id="i-home" data-wavekit="home-line" viewBox="0 0 24 24">
          <g>
            {" "}
            <path d="M8 17H16M11.0177 2.76401L4.23539 8.03914C3.78202 8.39176 3.55534 8.56807 3.39203 8.78887C3.24737 8.98446 3.1396 9.2048 3.07403 9.43907C3 9.70353 3 9.99071 3 10.5651V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V10.5651C21 9.99071 21 9.70353 20.926 9.43907C20.8604 9.2048 20.7526 8.98446 20.608 8.78887C20.4447 8.56807 20.218 8.39176 19.7646 8.03914L12.9823 2.76402C12.631 2.49076 12.4553 2.35414 12.2613 2.30162C12.0902 2.25528 11.9098 2.25528 11.7387 2.30162C11.5447 2.35414 11.369 2.49076 11.0177 2.76401Z" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" fill="none" />
            {" "}
          </g>
        </symbol>
        <symbol id="i-dash" data-wavekit="grid-01" viewBox="0 0 24 24">
          <g>
            {" "}
            <path d="M4.6 3H8.4C8.96005 3 9.24008 3 9.45399 3.10899C9.64215 3.20487 9.79513 3.35785 9.89101 3.54601C10 3.75992 10 4.03995 10 4.6V8.4C10 8.96005 10 9.24008 9.89101 9.45399C9.79513 9.64215 9.64215 9.79513 9.45399 9.89101C9.24008 10 8.96005 10 8.4 10H4.6C4.03995 10 3.75992 10 3.54601 9.89101C3.35785 9.79513 3.20487 9.64215 3.10899 9.45399C3 9.24008 3 8.96005 3 8.4V4.6C3 4.03995 3 3.75992 3.10899 3.54601C3.20487 3.35785 3.35785 3.20487 3.54601 3.10899C3.75992 3 4.03995 3 4.6 3ZM15.6 3H19.4C19.9601 3 20.2401 3 20.454 3.10899C20.6422 3.20487 20.7951 3.35785 20.891 3.54601C21 3.75992 21 4.03995 21 4.6V8.4C21 8.96005 21 9.24008 20.891 9.45399C20.7951 9.64215 20.6422 9.79513 20.454 9.89101C20.2401 10 19.9601 10 19.4 10H15.6C15.0399 10 14.7599 10 14.546 9.89101C14.3578 9.79513 14.2049 9.64215 14.109 9.45399C14 9.24008 14 8.96005 14 8.4V4.6C14 4.03995 14 3.75992 14.109 3.54601C14.2049 3.35785 14.3578 3.20487 14.546 3.10899C14.7599 3 15.0399 3 15.6 3ZM15.6 14H19.4C19.9601 14 20.2401 14 20.454 14.109C20.6422 14.2049 20.7951 14.3578 20.891 14.546C21 14.7599 21 15.0399 21 15.6V19.4C21 19.9601 21 20.2401 20.891 20.454C20.7951 20.6422 20.6422 20.7951 20.454 20.891C20.2401 21 19.9601 21 19.4 21H15.6C15.0399 21 14.7599 21 14.546 20.891C14.3578 20.7951 14.2049 20.6422 14.109 20.454C14 20.2401 14 19.9601 14 19.4V15.6C14 15.0399 14 14.7599 14.109 14.546C14.2049 14.3578 14.3578 14.2049 14.546 14.109C14.7599 14 15.0399 14 15.6 14ZM4.6 14H8.4C8.96005 14 9.24008 14 9.45399 14.109C9.64215 14.2049 9.79513 14.3578 9.89101 14.546C10 14.7599 10 15.0399 10 15.6V19.4C10 19.9601 10 20.2401 9.89101 20.454C9.79513 20.6422 9.64215 20.7951 9.45399 20.891C9.24008 21 8.96005 21 8.4 21H4.6C4.03995 21 3.75992 21 3.54601 20.891C3.35785 20.7951 3.20487 20.6422 3.10899 20.454C3 20.2401 3 19.9601 3 19.4V15.6C3 15.0399 3 14.7599 3.10899 14.546C3.20487 14.3578 3.35785 14.2049 3.54601 14.109C3.75992 14 4.03995 14 4.6 14Z" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" fill="none" />
            {" "}
          </g>
        </symbol>
        <symbol id="i-msg" data-wavekit="message-question-square" viewBox="0 0 24 24">
          <g>
            {" "}
            <path d="M10 8.00224C10.1762 7.50136 10.524 7.07901 10.9817 6.80998C11.4395 6.54095 11.9777 6.4426 12.501 6.53237C13.0243 6.62213 13.499 6.89421 13.8409 7.30041C14.1829 7.70661 14.37 8.22072 14.3692 8.75168C14.3692 10.2506 12.1209 11 12.1209 11M12.1499 14H12.1599M7 18V20.3355C7 20.8684 7 21.1348 7.10923 21.2716C7.20422 21.3906 7.34827 21.4599 7.50054 21.4597C7.67563 21.4595 7.88367 21.2931 8.29976 20.9602L10.6852 19.0518C11.1725 18.662 11.4162 18.4671 11.6875 18.3285C11.9282 18.2055 12.1844 18.1156 12.4492 18.0613C12.7477 18 13.0597 18 13.6837 18H16.2C17.8802 18 18.7202 18 19.362 17.673C19.9265 17.3854 20.3854 16.9265 20.673 16.362C21 15.7202 21 14.8802 21 13.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V14C3 14.93 3 15.395 3.10222 15.7765C3.37962 16.8117 4.18827 17.6204 5.22354 17.8978C5.60504 18 6.07003 18 7 18Z" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" fill="none" />
            {" "}
          </g>
        </symbol>
        <symbol id="i-users" data-wavekit="users-01" viewBox="0 0 24 24">
          <g>
            {" "}
            <path d="M22 21V19C22 17.1362 20.7252 15.5701 19 15.126M15.5 3.29076C16.9659 3.88415 18 5.32131 18 7C18 8.67869 16.9659 10.1159 15.5 10.7092M17 21C17 19.1362 17 18.2044 16.6955 17.4693C16.2895 16.4892 15.5108 15.7105 14.5307 15.3045C13.7956 15 12.8638 15 11 15H8C6.13623 15 5.20435 15 4.46927 15.3045C3.48915 15.7105 2.71046 16.4892 2.30448 17.4693C2 18.2044 2 19.1362 2 21M13.5 7C13.5 9.20914 11.7091 11 9.5 11C7.29086 11 5.5 9.20914 5.5 7C5.5 4.79086 7.29086 3 9.5 3C11.7091 3 13.5 4.79086 13.5 7Z" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" fill="none" />
            {" "}
          </g>
        </symbol>
        <symbol id="i-apps" data-wavekit="puzzle-piece-01" viewBox="0 0 24 24">
          <g>
            {" "}
            <path d="M12.5 6V4.5C12.5 3.11929 11.3807 2 10 2C8.61929 2 7.5 3.11929 7.5 4.5V6H6.5C5.10218 6 4.40326 6 3.85195 6.22836C3.11687 6.53284 2.53284 7.11687 2.22836 7.85195C2 8.40326 2 9.10218 2 10.5H3.5C4.88071 10.5 6 11.6193 6 13C6 14.3807 4.88071 15.5 3.5 15.5H2V17.2C2 18.8802 2 19.7202 2.32698 20.362C2.6146 20.9265 3.07354 21.3854 3.63803 21.673C4.27976 22 5.11984 22 6.8 22H8V20.25C8 19.0074 9.00736 18 10.25 18C11.4926 18 12.5 19.0074 12.5 20.25V22H13.2C14.8802 22 15.7202 22 16.362 21.673C16.9265 21.3854 17.3854 20.9265 17.673 20.362C18 19.7202 18 18.8802 18 17.2V15.5H19.5C20.8807 15.5 22 14.3807 22 13C22 11.6193 20.8807 10.5 19.5 10.5H18C18 9.10218 18 8.40326 17.7716 7.85195C17.4672 7.11687 16.8831 6.53284 16.1481 6.22836C15.5967 6 14.8978 6 13.5 6H12.5Z" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" fill="none" />
            {" "}
          </g>
        </symbol>
        <symbol id="i-help" data-wavekit="help-circle" viewBox="0 0 24 24">
          <g>
            {" "}
            <path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13M12 17H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" fill="none" />
            {" "}
          </g>
        </symbol>
        <symbol id="i-sidebar" data-wavekit="layout-left" viewBox="0 0 24 24">
          <g>
            {" "}
            <path d="M9 3V21M7.8 3H16.2C17.8802 3 18.7202 3 19.362 3.32698C19.9265 3.6146 20.3854 4.07354 20.673 4.63803C21 5.27976 21 6.11984 21 7.8V16.2C21 17.8802 21 18.7202 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.7202 21 17.8802 21 16.2 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V7.8C3 6.11984 3 5.27976 3.32698 4.63803C3.6146 4.07354 4.07354 3.6146 4.63803 3.32698C5.27976 3 6.11984 3 7.8 3Z" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" fill="none" />
            {" "}
          </g>
        </symbol>
        <symbol id="i-search" data-wavekit="search-lg" viewBox="0 0 24 24">
          <g>
            {" "}
            <path d="M21 21L17.5001 17.5M20 11.5C20 16.1944 16.1944 20 11.5 20C6.80558 20 3 16.1944 3 11.5C3 6.80558 6.80558 3 11.5 3C16.1944 3 20 6.80558 20 11.5Z" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" fill="none" />
            {" "}
          </g>
        </symbol>
        <symbol id="i-coin" data-wavekit="coins-01" viewBox="0 0 24 24">
          <g>
            {" "}
            <path d="M15.9377 15.9377C19.3603 15.4795 22 12.548 22 9C22 5.13401 18.866 2 15 2C11.452 2 8.52049 4.63967 8.06227 8.06227M16 15C16 18.866 12.866 22 9 22C5.13401 22 2 18.866 2 15C2 11.134 5.13401 8 9 8C12.866 8 16 11.134 16 15Z" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" fill="none" />
            {" "}
          </g>
        </symbol>
        <symbol id="i-user" data-wavekit="user-01" viewBox="0 0 24 24">
          <g>
            {" "}
            <path d="M20 21C20 19.6044 20 18.9067 19.8278 18.3389C19.44 17.0605 18.4395 16.06 17.1611 15.6722C16.5933 15.5 15.8956 15.5 14.5 15.5H9.5C8.10444 15.5 7.40665 15.5 6.83886 15.6722C5.56045 16.06 4.56004 17.0605 4.17224 18.3389C4 18.9067 4 19.6044 4 21M16.5 7.5C16.5 9.98528 14.4853 12 12 12C9.51472 12 7.5 9.98528 7.5 7.5C7.5 5.01472 9.51472 3 12 3C14.4853 3 16.5 5.01472 16.5 7.5Z" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" fill="none" />
            {" "}
          </g>
        </symbol>
        <symbol id="i-sparkles" data-wavekit="stars-02" viewBox="0 0 24 24">
          <g>
            {" "}
            <path d="M4.5 22V17M4.5 7V2M2 4.5H7M2 19.5H7M13 3L11.2658 7.50886C10.9838 8.24209 10.8428 8.60871 10.6235 8.91709C10.4292 9.1904 10.1904 9.42919 9.91709 9.62353C9.60871 9.8428 9.24209 9.98381 8.50886 10.2658L4 12L8.50886 13.7342C9.24209 14.0162 9.60871 14.1572 9.91709 14.3765C10.1904 14.5708 10.4292 14.8096 10.6235 15.0829C10.8428 15.3913 10.9838 15.7579 11.2658 16.4911L13 21L14.7342 16.4911C15.0162 15.7579 15.1572 15.3913 15.3765 15.0829C15.5708 14.8096 15.8096 14.5708 16.0829 14.3765C16.3913 14.1572 16.7579 14.0162 17.4911 13.7342L22 12L17.4911 10.2658C16.7579 9.98381 16.3913 9.8428 16.0829 9.62353C15.8096 9.42919 15.5708 9.1904 15.3765 8.91709C15.1572 8.60871 15.0162 8.24209 14.7342 7.50886L13 3Z" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" fill="none" />
            {" "}
          </g>
        </symbol>
        <symbol id="i-plus" data-wavekit="plus" viewBox="0 0 24 24">
          <g>
            {" "}
            <path d="M12 5V19M5 12H19" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" fill="none" />
            {" "}
          </g>
        </symbol>
        <symbol id="i-down" data-wavekit="chevron-down" viewBox="0 0 24 24">
          <g>
            {" "}
            <path d="M6 9L12 15L18 9" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" fill="none" />
            {" "}
          </g>
        </symbol>
        <symbol id="i-up" data-wavekit="chevron-up" viewBox="0 0 24 24">
          <g>
            {" "}
            <path d="M18 15L12 9L6 15" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" fill="none" />
            {" "}
          </g>
        </symbol>
        <symbol id="i-right" data-wavekit="chevron-right" viewBox="0 0 24 24">
          <g>
            {" "}
            <path d="M9 18L15 12L9 6" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" fill="none" />
            {" "}
          </g>
        </symbol>
        <symbol id="i-left" data-wavekit="chevron-left" viewBox="0 0 24 24">
          <g>
            {" "}
            <path d="M15 18L9 12L15 6" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" fill="none" />
            {" "}
          </g>
        </symbol>
        <symbol id="i-first" data-wavekit="chevron-left-double" viewBox="0 0 24 24">
          <g>
            {" "}
            <path d="M18 17L13 12L18 7M11 17L6 12L11 7" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" fill="none" />
            {" "}
          </g>
        </symbol>
        <symbol id="i-last" data-wavekit="chevron-right-double" viewBox="0 0 24 24">
          <g>
            {" "}
            <path d="M6 17L11 12L6 7M13 17L18 12L13 7" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" fill="none" />
            {" "}
          </g>
        </symbol>
        <symbol id="i-selector" data-wavekit="chevron-selector-vertical" viewBox="0 0 24 24">
          <g>
            {" "}
            <path d="M7 15L12 20L17 15M7 9L12 4L17 9" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" fill="none" />
            {" "}
          </g>
        </symbol>
        <symbol id="i-refresh" data-wavekit="refresh-cw-01" viewBox="0 0 24 24">
          <g>
            {" "}
            <path d="M22 10C22 10 19.995 7.26822 18.3662 5.63824C16.7373 4.00827 14.4864 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.1031 21 19.5649 18.2543 20.6482 14.5M16 10H22V4" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" fill="none" />
            {" "}
          </g>
        </symbol>
        <symbol id="i-check" data-wavekit="check" viewBox="0 0 24 24">
          <g>
            {" "}
            <path d="M20 6L9 17L4 12" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" fill="none" />
            {" "}
          </g>
        </symbol>
        <symbol id="i-chart" data-wavekit="bar-chart-10" viewBox="0 0 24 24">
          <g>
            {" "}
            <path d="M9 7H4.6C4.03995 7 3.75992 7 3.54601 7.10899C3.35785 7.20487 3.20487 7.35785 3.10899 7.54601C3 7.75992 3 8.03995 3 8.6V19.4C3 19.9601 3 20.2401 3.10899 20.454C3.20487 20.6422 3.35785 20.7951 3.54601 20.891C3.75992 21 4.03995 21 4.6 21H9M9 21H15M9 21L9 4.6C9 4.03995 9 3.75992 9.10899 3.54601C9.20487 3.35785 9.35785 3.20487 9.54601 3.10899C9.75992 3 10.0399 3 10.6 3L13.4 3C13.9601 3 14.2401 3 14.454 3.10899C14.6422 3.20487 14.7951 3.35785 14.891 3.54601C15 3.75992 15 4.03995 15 4.6V21M15 11H19.4C19.9601 11 20.2401 11 20.454 11.109C20.6422 11.2049 20.7951 11.3578 20.891 11.546C21 11.7599 21 12.0399 21 12.6V19.4C21 19.9601 21 20.2401 20.891 20.454C20.7951 20.6422 20.6422 20.7951 20.454 20.891C20.2401 21 19.9601 21 19.4 21H15" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" fill="none" />
            {" "}
          </g>
        </symbol>
        <symbol id="i-copy" data-wavekit="copy-01" viewBox="0 0 24 24">
          <g>
            {" "}
            <path d="M5 15C4.06812 15 3.60218 15 3.23463 14.8478C2.74458 14.6448 2.35523 14.2554 2.15224 13.7654C2 13.3978 2 12.9319 2 12V5.2C2 4.0799 2 3.51984 2.21799 3.09202C2.40973 2.71569 2.71569 2.40973 3.09202 2.21799C3.51984 2 4.0799 2 5.2 2H12C12.9319 2 13.3978 2 13.7654 2.15224C14.2554 2.35523 14.6448 2.74458 14.8478 3.23463C15 3.60218 15 4.06812 15 5M12.2 22H18.8C19.9201 22 20.4802 22 20.908 21.782C21.2843 21.5903 21.5903 21.2843 21.782 20.908C22 20.4802 22 19.9201 22 18.8V12.2C22 11.0799 22 10.5198 21.782 10.092C21.5903 9.71569 21.2843 9.40973 20.908 9.21799C20.4802 9 19.9201 9 18.8 9H12.2C11.0799 9 10.5198 9 10.092 9.21799C9.71569 9.40973 9.40973 9.71569 9.21799 10.092C9 10.5198 9 11.0799 9 12.2V18.8C9 19.9201 9 20.4802 9.21799 20.908C9.40973 21.2843 9.71569 21.5903 10.092 21.782C10.5198 22 11.0799 22 12.2 22Z" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" fill="none" />
            {" "}
          </g>
        </symbol>
        <symbol id="i-back" data-wavekit="arrow-left" viewBox="0 0 24 24">
          <g>
            {" "}
            <path d="M19 12H5M12 5L5 12L12 19" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" fill="none" />
            {" "}
          </g>
        </symbol>
        <symbol id="i-stack" data-wavekit="layers-three-01" viewBox="0 0 24 24">
          <g>
            {" "}
            <path d="M2 12L11.6422 16.8211C11.7734 16.8867 11.839 16.9195 11.9078 16.9324C11.9687 16.9438 12.0313 16.9438 12.0922 16.9324C12.161 16.9195 12.2266 16.8867 12.3578 16.8211L22 12M2 17L11.6422 21.8211C11.7734 21.8867 11.839 21.9195 11.9078 21.9324C11.9687 21.9438 12.0313 21.9438 12.0922 21.9324C12.161 21.9195 12.2266 21.8867 12.3578 21.8211L22 17M2 7L11.6422 2.17889C11.7734 2.11329 11.839 2.0805 11.9078 2.06759C11.9687 2.05616 12.0313 2.05616 12.0922 2.06759C12.161 2.0805 12.2266 2.11329 12.3578 2.17889L22 7L12.3578 11.8211C12.2266 11.8867 12.161 11.9195 12.0922 11.9324C12.0313 11.9438 11.9687 11.9438 11.9078 11.9324C11.839 11.9195 11.7734 11.8867 11.6422 11.8211L2 7Z" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" fill="none" />
            {" "}
          </g>
        </symbol>
        <symbol id="i-clock" data-wavekit="clock" viewBox="0 0 24 24">
          <g>
            {" "}
            <path d="M12 6V12L16 14M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" fill="none" />
            {" "}
          </g>
        </symbol>
        <symbol id="i-trophy" data-wavekit="trophy-01" viewBox="0 0 24 24">
          <g>
            {" "}
            <path d="M12 15C8.68629 15 6 12.3137 6 9V3.44444C6 3.0306 6 2.82367 6.06031 2.65798C6.16141 2.38021 6.38021 2.16141 6.65798 2.06031C6.82367 2 7.0306 2 7.44444 2H16.5556C16.9694 2 17.1763 2 17.342 2.06031C17.6198 2.16141 17.8386 2.38021 17.9397 2.65798C18 2.82367 18 3.0306 18 3.44444V9C18 12.3137 15.3137 15 12 15ZM12 15V18M18 4H20.5C20.9659 4 21.1989 4 21.3827 4.07612C21.6277 4.17761 21.8224 4.37229 21.9239 4.61732C22 4.80109 22 5.03406 22 5.5V6C22 6.92997 22 7.39496 21.8978 7.77646C21.6204 8.81173 20.8117 9.62038 19.7765 9.89778C19.395 10 18.93 10 18 10M6 4H3.5C3.03406 4 2.80109 4 2.61732 4.07612C2.37229 4.17761 2.17761 4.37229 2.07612 4.61732C2 4.80109 2 5.03406 2 5.5V6C2 6.92997 2 7.39496 2.10222 7.77646C2.37962 8.81173 3.18827 9.62038 4.22354 9.89778C4.60504 10 5.07003 10 6 10M7.44444 22H16.5556C16.801 22 17 21.801 17 21.5556C17 19.5919 15.4081 18 13.4444 18H10.5556C8.59188 18 7 19.5919 7 21.5556C7 21.801 7.19898 22 7.44444 22Z" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" fill="none" />
            {" "}
          </g>
        </symbol>
        <symbol id="i-pencil" data-wavekit="edit-02" viewBox="0 0 24 24">
          <g>
            {" "}
            <path d="M18 10L14 6M2.49997 21.5L5.88434 21.124C6.29783 21.078 6.50458 21.055 6.69782 20.9925C6.86926 20.937 7.03242 20.8586 7.18286 20.7594C7.35243 20.6475 7.49952 20.5005 7.7937 20.2063L21 7C22.1046 5.89543 22.1046 4.10457 21 3C19.8954 1.89543 18.1046 1.89543 17 3L3.7937 16.2063C3.49952 16.5005 3.35243 16.6475 3.24061 16.8171C3.1414 16.9676 3.06299 17.1307 3.00749 17.3022C2.94493 17.4954 2.92196 17.7021 2.87601 18.1156L2.49997 21.5Z" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" fill="none" />
            {" "}
          </g>
        </symbol>
        <symbol id="i-user-plus" data-wavekit="user-plus-01" viewBox="0 0 24 24">
          <g>
            {" "}
            <path d="M12 15.5H7.5C6.10444 15.5 5.40665 15.5 4.83886 15.6722C3.56045 16.06 2.56004 17.0605 2.17224 18.3389C2 18.9067 2 19.6044 2 21M19 21V15M16 18H22M14.5 7.5C14.5 9.98528 12.4853 12 10 12C7.51472 12 5.5 9.98528 5.5 7.5C5.5 5.01472 7.51472 3 10 3C12.4853 3 14.5 5.01472 14.5 7.5Z" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" fill="none" />
            {" "}
          </g>
        </symbol>
        <symbol id="i-user-share" data-wavekit="user-right-01" viewBox="0 0 24 24">
          <g>
            {" "}
            <path d="M19 15L22 18L19 21M22 18H16M12 15.5H7.5C6.10444 15.5 5.40665 15.5 4.83886 15.6722C3.56045 16.06 2.56004 17.0605 2.17224 18.3389C2 18.9067 2 19.6044 2 21M14.5 7.5C14.5 9.98528 12.4853 12 10 12C7.51472 12 5.5 9.98528 5.5 7.5C5.5 5.01472 7.51472 3 10 3C12.4853 3 14.5 5.01472 14.5 7.5Z" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" fill="none" />
            {" "}
          </g>
        </symbol>
        <symbol id="i-user-check" data-wavekit="user-check-01" viewBox="0 0 24 24">
          <g>
            {" "}
            <path d="M12 15.5H7.5C6.10444 15.5 5.40665 15.5 4.83886 15.6722C3.56045 16.06 2.56004 17.0605 2.17224 18.3389C2 18.9067 2 19.6044 2 21M16 18L18 20L22 16M14.5 7.5C14.5 9.98528 12.4853 12 10 12C7.51472 12 5.5 9.98528 5.5 7.5C5.5 5.01472 7.51472 3 10 3C12.4853 3 14.5 5.01472 14.5 7.5Z" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" fill="none" />
            {" "}
          </g>
        </symbol>
        <symbol id="i-user-x" data-wavekit="user-x-01" viewBox="0 0 24 24">
          <g>
            {" "}
            <path d="M16.5 16L21.5 21M21.5 16L16.5 21M12 15.5H7.5C6.10444 15.5 5.40665 15.5 4.83886 15.6722C3.56045 16.06 2.56004 17.0605 2.17224 18.3389C2 18.9067 2 19.6044 2 21M14.5 7.5C14.5 9.98528 12.4853 12 10 12C7.51472 12 5.5 9.98528 5.5 7.5C5.5 5.01472 7.51472 3 10 3C12.4853 3 14.5 5.01472 14.5 7.5Z" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" fill="none" />
            {" "}
          </g>
        </symbol>
        <symbol id="i-clip" data-wavekit="clipboard-check" viewBox="0 0 24 24">
          <g>
            {" "}
            <path d="M16 4C16.93 4 17.395 4 17.7765 4.10222C18.8117 4.37962 19.6204 5.18827 19.8978 6.22354C20 6.60504 20 7.07003 20 8V17.2C20 18.8802 20 19.7202 19.673 20.362C19.3854 20.9265 18.9265 21.3854 18.362 21.673C17.7202 22 16.8802 22 15.2 22H8.8C7.11984 22 6.27976 22 5.63803 21.673C5.07354 21.3854 4.6146 20.9265 4.32698 20.362C4 19.7202 4 18.8802 4 17.2V8C4 7.07003 4 6.60504 4.10222 6.22354C4.37962 5.18827 5.18827 4.37962 6.22354 4.10222C6.60504 4 7.07003 4 8 4M9 15L11 17L15.5 12.5M9.6 6H14.4C14.9601 6 15.2401 6 15.454 5.89101C15.6422 5.79513 15.7951 5.64215 15.891 5.45399C16 5.24008 16 4.96005 16 4.4V3.6C16 3.03995 16 2.75992 15.891 2.54601C15.7951 2.35785 15.6422 2.20487 15.454 2.10899C15.2401 2 14.9601 2 14.4 2H9.6C9.03995 2 8.75992 2 8.54601 2.10899C8.35785 2.20487 8.20487 2.35785 8.10899 2.54601C8 2.75992 8 3.03995 8 3.6V4.4C8 4.96005 8 5.24008 8.10899 5.45399C8.20487 5.64215 8.35785 5.79513 8.54601 5.89101C8.75992 6 9.03995 6 9.6 6Z" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" fill="none" />
            {" "}
          </g>
        </symbol>
        <symbol id="i-lock" data-wavekit="lock-01" viewBox="0 0 24 24">
          <g>
            {" "}
            <path d="M17 10V8C17 5.23858 14.7614 3 12 3C9.23858 3 7 5.23858 7 8V10M12 14.5V16.5M8.8 21H15.2C16.8802 21 17.7202 21 18.362 20.673C18.9265 20.3854 19.3854 19.9265 19.673 19.362C20 18.7202 20 17.8802 20 16.2V14.8C20 13.1198 20 12.2798 19.673 11.638C19.3854 11.0735 18.9265 10.6146 18.362 10.327C17.7202 10 16.8802 10 15.2 10H8.8C7.11984 10 6.27976 10 5.63803 10.327C5.07354 10.6146 4.6146 11.0735 4.32698 11.638C4 12.2798 4 13.1198 4 14.8V16.2C4 17.8802 4 18.7202 4.32698 19.362C4.6146 19.9265 5.07354 20.3854 5.63803 20.673C6.27976 21 7.11984 21 8.8 21Z" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" fill="none" />
            {" "}
          </g>
        </symbol>
        <symbol id="i-shield" data-wavekit="shield-tick" viewBox="0 0 24 24">
          <g>
            {" "}
            <path d="M9 11.5L11 13.5L15.5 9M20 12C20 16.9084 14.646 20.4784 12.698 21.6149C12.4766 21.744 12.3659 21.8086 12.2097 21.8421C12.0884 21.8681 11.9116 21.8681 11.7903 21.8421C11.6341 21.8086 11.5234 21.744 11.302 21.6149C9.35396 20.4784 4 16.9084 4 12V7.2176C4 6.41809 4 6.01833 4.13076 5.6747C4.24627 5.37114 4.43398 5.10028 4.67766 4.88553C4.9535 4.64244 5.3278 4.50208 6.0764 4.22135L11.4382 2.21067C11.6461 2.13271 11.75 2.09373 11.857 2.07828C11.9518 2.06457 12.0482 2.06457 12.143 2.07828C12.25 2.09373 12.3539 2.13271 12.5618 2.21067L17.9236 4.22135C18.6722 4.50208 19.0465 4.64244 19.3223 4.88553C19.566 5.10028 19.7537 5.37114 19.8692 5.6747C20 6.01833 20 6.41809 20 7.2176V12Z" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" fill="none" />
            {" "}
          </g>
        </symbol>
        <symbol id="i-ext" data-wavekit="link-external-01" viewBox="0 0 24 24">
          <g>
            {" "}
            <path d="M15 3H21L21 9M21 3L13 11M10 5H7.8C6.11984 5 5.27976 5 4.63803 5.32698C4.07354 5.6146 3.6146 6.07354 3.32698 6.63803C3 7.27976 3 8.11984 3 9.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21H14.2C15.8802 21 16.7202 21 17.362 20.673C17.9265 20.3854 18.3854 19.9265 18.673 19.362C19 18.7202 19 17.8802 19 16.2V14" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" fill="none" />
            {" "}
          </g>
        </symbol>
        <symbol id="i-download" data-wavekit="download-01" viewBox="0 0 24 24">
          <g>
            {" "}
            <path d="M21 15V16.2C21 17.8802 21 18.7202 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.7202 21 17.8802 21 16.2 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V15M7 10L12 15L17 10M12 15V3" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" fill="none" />
            {" "}
          </g>
        </symbol>
        <symbol id="i-info" data-wavekit="info-circle" viewBox="0 0 24 24">
          <g>
            {" "}
            <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" fill="none" />
            {" "}
          </g>
        </symbol>
        <symbol id="i-target" data-wavekit="target-04" viewBox="0 0 24 24">
          <g>
            {" "}
            <path d="M16 8V5L19 2L20 4L22 5L19 8H16ZM16 8L12 11.9999M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2M17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" fill="none" />
            {" "}
          </g>
        </symbol>
        <symbol id="i-x" data-wavekit="x" viewBox="0 0 24 24">
          <g>
            {" "}
            <path d="M17 7L7 17M7 7L17 17" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" fill="none" />
            {" "}
          </g>
        </symbol>
        <symbol id="i-upload" data-wavekit="upload-cloud-01" viewBox="0 0 24 24">
          <g>
            {" "}
            <path d="M4 16.2422C2.79401 15.435 2 14.0602 2 12.5C2 10.1564 3.79151 8.23129 6.07974 8.01937C6.54781 5.17213 9.02024 3 12 3C14.9798 3 17.4522 5.17213 17.9203 8.01937C20.2085 8.23129 22 10.1564 22 12.5C22 14.0602 21.206 15.435 20 16.2422M16 16L12 12L8 16M12 12V21" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" fill="none" />
            {" "}
          </g>
        </symbol>
        <symbol id="i-cal" data-wavekit="calendar" viewBox="0 0 24 24">
          <g>
            {" "}
            <path d="M21 10H3M16 2V6M8 2V6M7.8 22H16.2C17.8802 22 18.7202 22 19.362 21.673C19.9265 21.3854 20.3854 20.9265 20.673 20.362C21 19.7202 21 18.8802 21 17.2V8.8C21 7.11984 21 6.27976 20.673 5.63803C20.3854 5.07354 19.9265 4.6146 19.362 4.32698C18.7202 4 17.8802 4 16.2 4H7.8C6.11984 4 5.27976 4 4.63803 4.32698C4.07354 4.6146 3.6146 5.07354 3.32698 5.63803C3 6.27976 3 7.11984 3 8.8V17.2C3 18.8802 3 19.7202 3.32698 20.362C3.6146 20.9265 4.07354 21.3854 4.63803 21.673C5.27976 22 6.11984 22 7.8 22Z" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" fill="none" />
            {" "}
          </g>
        </symbol>
        <symbol id="i-dash-s" data-wavekit="grid-01" viewBox="0 0 24 24">
          <g>
            {" "}
            <g>
              {" "}
              <path d="M4.56811 2C5.85605 2.00016 7.1465 2.00016 8.4319 2C8.68429 1.99997 8.93008 1.99994 9.13824 2.01695C9.36683 2.03563 9.63656 2.07969 9.90799 2.21799C10.2843 2.40974 10.5903 2.7157 10.782 3.09202C10.9203 3.36345 10.9644 3.63318 10.9831 3.86178C11.0001 4.06994 11 4.31574 11 4.56813V8.43189C11 8.68427 11.0001 8.93007 10.9831 9.13824C10.9644 9.36683 10.9203 9.63656 10.782 9.90799C10.5903 10.2843 10.2843 10.5903 9.90799 10.782C9.63656 10.9203 9.36683 10.9644 9.13824 10.9831C8.93007 11.0001 8.68427 11 8.43189 11H4.56812C4.31574 11 4.06994 11.0001 3.86178 10.9831C3.63318 10.9644 3.36345 10.9203 3.09202 10.782C2.7157 10.5903 2.40974 10.2843 2.21799 9.90799C2.07969 9.63656 2.03563 9.36683 2.01695 9.13824C1.99994 8.93008 1.99997 8.68429 2 8.4319C2 8.42128 2.00001 8.41065 2.00001 8.40001V4.60001C2.00001 4.58936 2 4.57873 2 4.56811C1.99997 4.31572 1.99994 4.06993 2.01695 3.86178C2.03563 3.63318 2.07969 3.36345 2.21799 3.09202C2.40974 2.7157 2.7157 2.40974 3.09202 2.21799C3.36345 2.07969 3.63318 2.03563 3.86178 2.01695C4.06993 1.99994 4.31572 1.99997 4.56811 2Z" fillRule="evenodd" clipRule="evenodd" fill="currentColor" />
              {" "}
              <path d="M4.56811 13C5.85605 13.0002 7.1465 13.0002 8.4319 13C8.68429 13 8.93008 12.9999 9.13824 13.017C9.36683 13.0356 9.63656 13.0797 9.90799 13.218C10.2843 13.4097 10.5903 13.7157 10.782 14.092C10.9203 14.3634 10.9644 14.6332 10.9831 14.8618C11.0001 15.0699 11 15.3157 11 15.5681V19.4319C11 19.6843 11.0001 19.9301 10.9831 20.1382C10.9644 20.3668 10.9203 20.6366 10.782 20.908C10.5903 21.2843 10.2843 21.5903 9.90799 21.782C9.63656 21.9203 9.36683 21.9644 9.13824 21.9831C8.93007 22.0001 8.68427 22 8.43189 22H4.56812C4.31574 22 4.06994 22.0001 3.86178 21.9831C3.63318 21.9644 3.36345 21.9203 3.09202 21.782C2.7157 21.5903 2.40974 21.2843 2.21799 20.908C2.07969 20.6366 2.03563 20.3668 2.01695 20.1382C1.99994 19.9301 1.99997 19.6843 2 19.4319C2 19.4213 2.00001 19.4106 2.00001 19.4V15.6C2.00001 15.5894 2 15.5787 2 15.5681C1.99997 15.3157 1.99994 15.0699 2.01695 14.8618C2.03563 14.6332 2.07969 14.3634 2.21799 14.092C2.40974 13.7157 2.7157 13.4097 3.09202 13.218C3.36345 13.0797 3.63318 13.0356 3.86178 13.017C4.06993 12.9999 4.31572 13 4.56811 13Z" fillRule="evenodd" clipRule="evenodd" fill="currentColor" />
              {" "}
              <path d="M15.5681 2C16.856 2.00016 18.1465 2.00016 19.4319 2C19.6843 1.99997 19.9301 1.99994 20.1382 2.01695C20.3668 2.03563 20.6366 2.07969 20.908 2.21799C21.2843 2.40974 21.5903 2.7157 21.782 3.09202C21.9203 3.36345 21.9644 3.63318 21.9831 3.86178C22.0001 4.06994 22 4.31574 22 4.56813V8.43189C22 8.68427 22.0001 8.93007 21.9831 9.13824C21.9644 9.36683 21.9203 9.63656 21.782 9.90799C21.5903 10.2843 21.2843 10.5903 20.908 10.782C20.6366 10.9203 20.3668 10.9644 20.1382 10.9831C19.9301 11.0001 19.6843 11 19.4319 11H15.5681C15.3157 11 15.0699 11.0001 14.8618 10.9831C14.6332 10.9644 14.3634 10.9203 14.092 10.782C13.7157 10.5903 13.4097 10.2843 13.218 9.90799C13.0797 9.63656 13.0356 9.36683 13.017 9.13824C12.9999 8.93008 13 8.68429 13 8.4319C13 8.42128 13 8.41065 13 8.40001V4.60001C13 4.58936 13 4.57873 13 4.56811C13 4.31572 12.9999 4.06993 13.017 3.86178C13.0356 3.63318 13.0797 3.36345 13.218 3.09202C13.4097 2.7157 13.7157 2.40974 14.092 2.21799C14.3634 2.07969 14.6332 2.03563 14.8618 2.01695C15.0699 1.99994 15.3157 1.99997 15.5681 2Z" fillRule="evenodd" clipRule="evenodd" fill="currentColor" />
              {" "}
              <path d="M15.5681 13C16.856 13.0002 18.1465 13.0002 19.4319 13C19.6843 13 19.9301 12.9999 20.1382 13.017C20.3668 13.0356 20.6366 13.0797 20.908 13.218C21.2843 13.4097 21.5903 13.7157 21.782 14.092C21.9203 14.3634 21.9644 14.6332 21.9831 14.8618C22.0001 15.0699 22 15.3157 22 15.5681V19.4319C22 19.6843 22.0001 19.9301 21.9831 20.1382C21.9644 20.3668 21.9203 20.6366 21.782 20.908C21.5903 21.2843 21.2843 21.5903 20.908 21.782C20.6366 21.9203 20.3668 21.9644 20.1382 21.9831C19.9301 22.0001 19.6843 22 19.4319 22H15.5681C15.3157 22 15.0699 22.0001 14.8618 21.9831C14.6332 21.9644 14.3634 21.9203 14.092 21.782C13.7157 21.5903 13.4097 21.2843 13.218 20.908C13.0797 20.6366 13.0356 20.3668 13.017 20.1382C12.9999 19.9301 13 19.6843 13 19.4319C13 19.4213 13 19.4106 13 19.4V15.6C13 15.5894 13 15.5787 13 15.5681C13 15.3157 12.9999 15.0699 13.017 14.8618C13.0356 14.6332 13.0797 14.3634 13.218 14.092C13.4097 13.7157 13.7157 13.4097 14.092 13.218C14.3634 13.0797 14.6332 13.0356 14.8618 13.017C15.0699 12.9999 15.3157 13 15.5681 13Z" fillRule="evenodd" clipRule="evenodd" fill="currentColor" />
              {" "}
            </g>
            {" "}
          </g>
        </symbol>
        <symbol id="i-users-s" data-wavekit="users-01" viewBox="0 0 24 24">
          <g>
            {" "}
            <g>
              {" "}
              <path d="M18.0316 14.8768C18.1692 14.3419 18.7144 14.0199 19.2493 14.1576C21.4056 14.7126 23 16.6688 23 19V21C23 21.5523 22.5523 22 22 22C21.4477 22 21 21.5523 21 21V19C21 17.6035 20.0449 16.4275 18.7507 16.0945C18.2159 15.9568 17.8939 15.4116 18.0316 14.8768Z" fillRule="evenodd" clipRule="evenodd" fill="currentColor" />
              {" "}
              <path d="M14.5731 2.91554C14.7803 2.40361 15.3633 2.1566 15.8752 2.36382C17.7058 3.10481 19 4.90006 19 7C19 9.09994 17.7058 10.8952 15.8752 11.6362C15.3633 11.8434 14.7803 11.5964 14.5731 11.0845C14.3658 10.5725 14.6129 9.98953 15.1248 9.7823C16.2261 9.33652 17 8.25744 17 7C17 5.74256 16.2261 4.66348 15.1248 4.2177C14.6129 4.01047 14.3658 3.42748 14.5731 2.91554Z" fillRule="evenodd" clipRule="evenodd" fill="currentColor" />
              {" "}
              <path d="M7.17894 14C8.72631 14.0005 10.2737 14.0005 11.8211 14C12.9117 13.9996 13.6559 13.9994 14.2941 14.1704C16.0196 14.6327 17.3673 15.9804 17.8296 17.7059C18.0599 18.5652 17.9932 19.4836 18.0002 20.3641C18.001 20.471 18.0027 20.6872 17.9489 20.8882C17.8102 21.4059 17.4059 21.8102 16.8882 21.9489C16.6872 22.0028 16.471 22.001 16.3641 22.0002C11.7891 21.9637 7.21092 21.9637 2.63591 22.0002C2.529 22.001 2.31279 22.0028 2.11177 21.9489C1.59413 21.8102 1.18981 21.4059 1.05111 20.8882C0.99725 20.6872 0.998973 20.471 0.999825 20.3641C1.00683 19.4858 0.940485 18.5639 1.17037 17.7059C1.63271 15.9804 2.98044 14.6327 4.70591 14.1704C5.34412 13.9994 6.08832 13.9996 7.17894 14Z" fillRule="evenodd" clipRule="evenodd" fill="currentColor" />
              {" "}
              <path d="M4.5 7C4.5 4.23858 6.73858 2 9.5 2C12.2614 2 14.5 4.23858 14.5 7C14.5 9.76142 12.2614 12 9.5 12C6.73858 12 4.5 9.76142 4.5 7Z" fillRule="evenodd" clipRule="evenodd" fill="currentColor" />
              {" "}
            </g>
            {" "}
          </g>
        </symbol>
        <symbol id="i-apps-s" data-wavekit="puzzle-piece-01" viewBox="0 0 24 24">
          <g>
            {" "}
            <path d="M6.5 4.5C6.5 2.567 8.067 1 10 1C11.933 1 13.5 2.567 13.5 4.5V5L13.5343 5C14.2041 4.99999 14.7569 4.99998 15.2095 5.03086C15.6788 5.06288 16.1129 5.13142 16.5307 5.30448C17.5108 5.71046 18.2895 6.48915 18.6955 7.46927C18.8686 7.88708 18.9371 8.32118 18.9691 8.79046C18.9837 9.00406 18.9914 9.23999 18.9955 9.5H19.5C21.433 9.5 23 11.067 23 13C23 14.933 21.433 16.5 19.5 16.5H19V17.2413C19 18.0463 19 18.7106 18.9558 19.2518C18.9099 19.8139 18.8113 20.3306 18.564 20.816C18.1805 21.5686 17.5686 22.1805 16.816 22.564C16.3306 22.8113 15.8139 22.9099 15.2518 22.9558C14.7106 23 14.0463 23 13.2413 23H12.5C11.9477 23 11.5 22.5523 11.5 22V20.25C11.5 19.5596 10.9404 19 10.25 19C9.55964 19 9 19.5596 9 20.25V22C9 22.5523 8.55228 23 8 23H6.75868C5.95372 23 5.28936 23 4.74817 22.9558C4.18608 22.9099 3.66937 22.8113 3.18404 22.564C2.43139 22.1805 1.81947 21.5686 1.43597 20.816C1.18868 20.3306 1.09012 19.8139 1.04419 19.2518C0.999976 18.7106 0.999987 18.0463 1 17.2413L1 15.5C1 14.9477 1.44772 14.5 2 14.5H3.5C4.32843 14.5 5 13.8284 5 13C5 12.1716 4.32843 11.5 3.5 11.5H2C1.44772 11.5 1 11.0523 1 10.5L1 10.4657C0.999991 9.79594 0.999984 9.24307 1.03086 8.79046C1.06288 8.32118 1.13142 7.88708 1.30448 7.46927C1.71046 6.48915 2.48915 5.71046 3.46927 5.30448C3.88708 5.13142 4.32118 5.06288 4.79046 5.03086C5.24307 4.99998 5.79594 4.99999 6.46573 5L6.5 5L6.5 4.5Z" fillRule="evenodd" clipRule="evenodd" fill="currentColor" />
            {" "}
          </g>
        </symbol>
        <symbol id="i-msg-s" data-wavekit="message-question-square" viewBox="0 0 24 24">
          <g>
            {" "}
            <path d="M16.2414 2H7.7588C6.95383 1.99999 6.28946 1.99998 5.74827 2.04419C5.18617 2.09012 4.66947 2.18868 4.18413 2.43597C3.43149 2.81947 2.81956 3.43139 2.43607 4.18404C2.18878 4.66937 2.09022 5.18608 2.04429 5.74818C2.00007 6.28937 2.00008 6.95373 2.0001 7.7587L2.00005 14.1376C1.99962 14.933 1.9993 15.5236 2.13639 16.0353C2.50626 17.4156 3.58445 18.4938 4.96482 18.8637C5.27229 18.9461 5.60829 18.9789 6.0001 18.9918L6.00009 20.371C6.00005 20.6062 6 20.846 6.01785 21.0425C6.03492 21.2305 6.08012 21.5852 6.32778 21.8955C6.61276 22.2525 7.0449 22.4602 7.50172 22.4597C7.8987 22.4593 8.20394 22.273 8.36137 22.1689C8.52597 22.06 8.7132 21.9102 8.89688 21.7632L11.31 19.8327C11.8286 19.4178 11.9826 19.3007 12.1425 19.219C12.303 19.137 12.4738 19.0771 12.6504 19.0408C12.8263 19.0047 13.0197 19 13.6838 19H16.2414C17.0464 19 17.7107 19 18.2519 18.9558C18.814 18.9099 19.3307 18.8113 19.8161 18.564C20.5687 18.1805 21.1806 17.5686 21.5641 16.816C21.8114 16.3306 21.91 15.8139 21.9559 15.2518C22.0001 14.7106 22.0001 14.0463 22.0001 13.2413V7.75868C22.0001 6.95372 22.0001 6.28936 21.9559 5.74818C21.91 5.18608 21.8114 4.66937 21.5641 4.18404C21.1806 3.43139 20.5687 2.81947 19.8161 2.43597C19.3307 2.18868 18.814 2.09012 18.2519 2.04419C17.7107 1.99998 17.0464 1.99999 16.2414 2ZM11.4887 7.67211C11.7428 7.52274 12.0417 7.46814 12.3322 7.51797C12.6228 7.56781 12.8863 7.71888 13.0762 7.94441C13.266 8.16994 13.37 8.45539 13.3695 8.75019V8.75168C13.3695 8.97025 13.1923 9.27142 12.6907 9.60587C12.4702 9.75281 12.2427 9.86729 12.0664 9.94567C11.9796 9.98423 11.9087 10.0125 11.8618 10.0304C11.8384 10.0393 11.8213 10.0455 11.8114 10.049L11.8023 10.0522L11.8038 10.0517C11.2806 10.2268 10.998 10.7927 11.1725 11.3162C11.3454 11.835 11.9218 12.1201 12.4386 11.9483C12.4841 11.933 12.529 11.9164 12.5738 11.8994C12.6499 11.8704 12.7546 11.8284 12.8786 11.7733C13.1238 11.6643 13.4584 11.4978 13.8001 11.27C14.4225 10.855 15.3693 10.0322 15.3695 8.75212C15.3704 7.98537 15.1 7.24301 14.6062 6.65641C14.1122 6.06954 13.4264 5.67645 12.6703 5.54676C11.9143 5.41707 11.1367 5.55916 10.4753 5.94785C9.81396 6.33653 9.3115 6.94674 9.05694 7.6704C8.87367 8.19138 9.14744 8.7623 9.66843 8.94557C10.1894 9.12885 10.7603 8.85507 10.9436 8.33408C11.0414 8.05598 11.2345 7.82148 11.4887 7.67211ZM12.1502 13C11.5979 13 11.1502 13.4477 11.1502 14C11.1502 14.5523 11.5979 15 12.1502 15H12.1602C12.7125 15 13.1602 14.5523 13.1602 14C13.1602 13.4477 12.7125 13 12.1602 13H12.1502Z" fillRule="evenodd" clipRule="evenodd" fill="currentColor" />
            {" "}
          </g>
        </symbol>
      </svg>
      <div style={{display: "flex", minHeight: "100vh", background: "var(--colors-background-bg-primary)"}}>
        <aside data-screen-label="Sidebar" style={{position: "sticky", top: "0", height: "100vh", flex: "none", width: V.sideW, padding: V.sidePad, borderRight: "1px solid var(--border)", background: "var(--sidebar)", display: "flex", flexDirection: "column", transition: "width .18s ease", zIndex: "20"}}>
          {" "}
          <div style={{height: "44px", display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            {" "}
            {V.expanded && (<>
              {" "}
              <svg role="img" aria-label="topin.tech" width="130" height="28" viewBox="0 0 558 120" style={{display: "block", flex: "none"}}>
                <path d="M66.6879 27.042L45.0139 48.7159H59.128C59.9222 48.7159 60.566 49.3597 60.566 50.1539V60.9867C60.566 62.2678 62.115 62.9094 63.0209 62.0035L82.5037 42.5207C82.7734 42.251 82.9249 41.8853 82.9249 41.5039V28.0589C82.9249 27.2647 82.2811 26.6208 81.4869 26.6208H67.7047C67.3233 26.6208 66.9575 26.7724 66.6879 27.042Z" style={{fill: "var(--logo-accent)"}} />
                <path d="M45.0514 27.69V48.7184H3.47172C2.19057 48.7184 1.54897 47.1695 2.45488 46.2636L22.0453 26.6731C22.315 26.4035 22.6808 26.252 23.0621 26.252H43.6134C44.4076 26.252 45.0514 26.8958 45.0514 27.69Z" style={{fill: "var(--logo-main)"}} />
                <path d="M45.0506 79.9077V49.3698V48.7195L1.24941 92.5207C0.796457 92.9737 1.11726 93.7481 1.75784 93.7481H31.2102C31.7823 93.7481 32.331 93.5209 32.7355 93.1164L44.4188 81.433C44.8234 81.0285 45.0506 80.4798 45.0506 79.9077Z" style={{fill: "var(--logo-main)"}} />
                <path d="M134.003 88.6409C135.37 88.6409 136.772 88.5383 138.208 88.3332C139.644 88.0597 140.806 87.7862 141.695 87.5127V94.3846C140.738 94.8632 139.37 95.2393 137.592 95.5128C135.815 95.8547 134.105 96.0257 132.464 96.0257C129.592 96.0257 126.925 95.547 124.464 94.5897C122.071 93.5641 120.122 91.8204 118.618 89.3589C117.113 86.8973 116.361 83.4442 116.361 78.9997V46.999H108.566V42.6912L116.464 39.1014L120.054 27.4089H125.387V40.0245H141.285V46.999H125.387V78.7945C125.387 82.145 126.173 84.6408 127.746 86.2819C129.387 87.8546 131.473 88.6409 134.003 88.6409ZM196.396 67.4097C196.396 71.991 195.781 76.0594 194.55 79.6151C193.388 83.1023 191.678 86.0767 189.422 88.5383C187.234 90.9999 184.533 92.8803 181.319 94.1795C178.174 95.4103 174.652 96.0257 170.755 96.0257C167.131 96.0257 163.78 95.4103 160.703 94.1795C157.626 92.8803 154.96 90.9999 152.703 88.5383C150.447 86.0767 148.669 83.1023 147.37 79.6151C146.139 76.0594 145.524 71.991 145.524 67.4097C145.524 61.3241 146.549 56.1958 148.601 52.0248C150.652 47.7854 153.592 44.5716 157.421 42.3836C161.25 40.1271 165.798 38.9989 171.063 38.9989C176.054 38.9989 180.43 40.1271 184.191 42.3836C188.02 44.5716 190.995 47.7854 193.114 52.0248C195.302 56.1958 196.396 61.3241 196.396 67.4097ZM154.857 67.4097C154.857 71.7175 155.404 75.4782 156.498 78.692C157.661 81.8373 159.438 84.2647 161.832 85.9742C164.225 87.6836 167.268 88.5383 170.96 88.5383C174.652 88.5383 177.695 87.6836 180.088 85.9742C182.482 84.2647 184.225 81.8373 185.319 78.692C186.482 75.4782 187.063 71.7175 187.063 67.4097C187.063 63.0335 186.482 59.307 185.319 56.23C184.157 53.153 182.379 50.794 179.986 49.1529C177.661 47.4435 174.618 46.5888 170.857 46.5888C165.25 46.5888 161.182 48.435 158.652 52.1273C156.122 55.8197 154.857 60.9138 154.857 67.4097ZM232.753 38.9989C239.522 38.9989 244.958 41.3579 249.061 46.0759C253.232 50.794 255.317 57.9052 255.317 67.4097C255.317 73.632 254.36 78.8971 252.446 83.2049C250.599 87.4443 247.967 90.658 244.548 92.8461C241.198 94.9658 237.232 96.0257 232.65 96.0257C229.847 96.0257 227.351 95.6496 225.163 94.8974C222.975 94.1453 221.095 93.188 219.522 92.0256C218.018 90.7948 216.718 89.4614 215.624 88.0255H215.009C215.146 89.1879 215.282 90.658 215.419 92.4358C215.556 94.2137 215.624 95.7522 215.624 97.0513V119.616H206.599V40.0245H213.983L215.214 47.5119H215.624C216.718 45.9392 218.018 44.5033 219.522 43.2041C221.095 41.9049 222.941 40.8792 225.06 40.1271C227.249 39.3749 229.813 38.9989 232.753 38.9989ZM231.112 46.5888C227.419 46.5888 224.445 47.3067 222.189 48.7427C219.932 50.1102 218.291 52.1957 217.265 54.9992C216.24 57.8027 215.693 61.3583 215.624 65.6661V67.4097C215.624 71.9226 216.103 75.7517 217.06 78.8971C218.018 82.0425 219.624 84.4357 221.881 86.0767C224.206 87.7178 227.351 88.5383 231.317 88.5383C234.667 88.5383 237.403 87.6152 239.522 85.769C241.71 83.9229 243.317 81.4271 244.343 78.2817C245.437 75.068 245.984 71.4098 245.984 67.3071C245.984 61.0164 244.753 55.9907 242.292 52.2299C239.898 48.4691 236.172 46.5888 231.112 46.5888ZM274.624 40.0245V95H265.598V40.0245H274.624ZM270.214 19.4087C271.581 19.4087 272.778 19.8874 273.803 20.8447C274.897 21.7336 275.444 23.1695 275.444 25.1524C275.444 27.067 274.897 28.5029 273.803 29.4602C272.778 30.4175 271.581 30.8961 270.214 30.8961C268.709 30.8961 267.444 30.4175 266.419 29.4602C265.393 28.5029 264.88 27.067 264.88 25.1524C264.88 23.1695 265.393 21.7336 266.419 20.8447C267.444 19.8874 268.709 19.4087 270.214 19.4087ZM314.4 38.9989C320.965 38.9989 325.922 40.6057 329.272 43.8195C332.623 46.9648 334.298 52.0932 334.298 59.2044V95H325.375V59.8198C325.375 55.3753 324.383 52.059 322.401 49.8709C320.418 47.6828 317.306 46.5888 313.067 46.5888C306.981 46.5888 302.776 48.2982 300.451 51.7171C298.127 55.1359 296.964 60.0591 296.964 66.4866V95H287.938V40.0245H295.221L296.554 47.5119H297.067C298.297 45.5973 299.802 44.0246 301.58 42.7938C303.426 41.4946 305.443 40.5374 307.631 39.922C309.819 39.3066 312.076 38.9989 314.4 38.9989ZM345.905 89.4614C345.905 86.9315 346.52 85.1536 347.751 84.128C348.982 83.1023 350.452 82.5895 352.162 82.5895C353.939 82.5895 355.444 83.1023 356.674 84.128C357.974 85.1536 358.623 86.9315 358.623 89.4614C358.623 91.923 357.974 93.7008 356.674 94.7949C355.444 95.8889 353.939 96.4359 352.162 96.4359C350.452 96.4359 348.982 95.8889 347.751 94.7949C346.52 93.7008 345.905 91.923 345.905 89.4614ZM388.94 88.6409C390.307 88.6409 391.709 88.5383 393.145 88.3332C394.581 88.0597 395.743 87.7862 396.632 87.5127V94.3846C395.675 94.8632 394.307 95.2393 392.529 95.5128C390.752 95.8547 389.042 96.0257 387.401 96.0257C384.529 96.0257 381.862 95.547 379.401 94.5897C377.008 93.5641 375.059 91.8204 373.555 89.3589C372.05 86.8973 371.298 83.4442 371.298 78.9997V46.999H363.503V42.6912L371.401 39.1014L374.991 27.4089H380.324V40.0245H396.222V46.999H380.324V78.7945C380.324 82.145 381.11 84.6408 382.683 86.2819C384.324 87.8546 386.41 88.6409 388.94 88.6409ZM424.769 38.9989C429.487 38.9989 433.521 40.0245 436.872 42.0759C440.29 44.1272 442.889 47.0332 444.667 50.794C446.513 54.4864 447.436 58.8283 447.436 63.8199V69.2559H409.794C409.931 75.4782 411.504 80.2305 414.512 83.5126C417.589 86.7263 421.863 88.3332 427.333 88.3332C430.82 88.3332 433.897 88.0255 436.564 87.4101C439.299 86.7263 442.103 85.769 444.974 84.5383V92.4358C442.171 93.6666 439.402 94.5555 436.666 95.1026C433.931 95.718 430.683 96.0257 426.923 96.0257C421.726 96.0257 417.111 94.9658 413.076 92.8461C409.11 90.7264 405.999 87.581 403.743 83.41C401.555 79.1706 400.461 74.0081 400.461 67.9225C400.461 61.9053 401.452 56.7428 403.435 52.435C405.486 48.1273 408.324 44.811 411.948 42.4861C415.64 40.1613 419.914 38.9989 424.769 38.9989ZM424.666 46.3836C420.358 46.3836 416.94 47.7854 414.41 50.5888C411.948 53.3239 410.478 57.1531 409.999 62.0763H438C438 58.9309 437.521 56.1958 436.564 53.871C435.607 51.5461 434.137 49.7341 432.154 48.435C430.239 47.0674 427.743 46.3836 424.666 46.3836ZM479.38 96.0257C474.526 96.0257 470.184 95.0342 466.355 93.0512C462.594 91.0683 459.619 87.9913 457.431 83.8203C455.312 79.6493 454.252 74.3158 454.252 67.82C454.252 61.0506 455.38 55.5462 457.636 51.3068C459.893 47.0674 462.936 43.9562 466.765 41.9733C470.662 39.9903 475.073 38.9989 479.996 38.9989C482.799 38.9989 485.5 39.3066 488.099 39.922C490.697 40.469 492.817 41.1528 494.458 41.9733L491.688 49.4606C490.047 48.8452 488.133 48.264 485.945 47.717C483.757 47.17 481.705 46.8965 479.791 46.8965C476.098 46.8965 473.056 47.6828 470.662 49.2555C468.269 50.8282 466.491 53.153 465.329 56.23C464.167 59.307 463.585 63.1361 463.585 67.7174C463.585 72.0936 464.167 75.8201 465.329 78.8971C466.491 81.9741 468.235 84.2989 470.56 85.8716C472.885 87.4443 475.791 88.2306 479.278 88.2306C482.287 88.2306 484.919 87.9229 487.176 87.3075C489.5 86.6921 491.62 85.94 493.535 85.0511V93.0512C491.688 94.0085 489.637 94.7265 487.381 95.2051C485.193 95.7522 482.526 96.0257 479.38 96.0257ZM511.532 39.922C511.532 41.2211 511.463 42.5545 511.327 43.922C511.258 45.2896 511.156 46.5204 511.019 47.6144H511.634C512.797 45.6999 514.267 44.1272 516.045 42.8964C517.822 41.6656 519.805 40.7425 521.993 40.1271C524.182 39.4433 526.438 39.1014 528.763 39.1014C533.207 39.1014 536.9 39.8194 539.84 41.2553C542.849 42.6229 545.105 44.7768 546.609 47.717C548.114 50.6572 548.866 54.4864 548.866 59.2044V95H539.943V59.8198C539.943 55.3753 538.951 52.059 536.968 49.8709C534.985 47.6828 531.874 46.5888 527.635 46.5888C523.532 46.5888 520.318 47.3751 517.993 48.9478C515.669 50.4521 513.993 52.7085 512.968 55.7172C512.01 58.6574 511.532 62.2814 511.532 66.5892V95H502.506V17.0497H511.532V39.922Z" style={{fill: "var(--ink)"}} />
              </svg>
              {" "}
            </>)}
            {" "}
            {V.collapsed && (<>
              <span style={{width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                <svg role="img" aria-label="topin.tech" width="32" height="32" viewBox="0 0 120 120" style={{display: "block", flex: "none"}}>
                  <path d="M85.3651 27.4673L63.6912 49.1412H77.8053C78.5995 49.1412 79.2433 49.785 79.2433 50.5792V61.412C79.2433 62.6931 80.7923 63.3347 81.6982 62.4288L101.181 42.946C101.451 42.6763 101.602 42.3106 101.602 41.9292V28.4842C101.602 27.69 100.958 27.0461 100.164 27.0461H86.382C86.0006 27.0461 85.6348 27.1976 85.3651 27.4673Z" style={{fill: "var(--logo-accent)"}} />
                  <path d="M63.7286 28.1153V49.1437H22.149C20.8678 49.1437 20.2262 47.5948 21.1321 46.6889L40.7225 27.0984C40.9922 26.8288 41.358 26.6772 41.7394 26.6772H62.2906C63.0848 26.6772 63.7286 27.3211 63.7286 28.1153Z" style={{fill: "var(--logo-main)"}} />
                  <path d="M63.7279 80.333V49.7951V49.1448L19.9267 92.946C19.4737 93.3989 19.7945 94.1734 20.4351 94.1734H49.8875C50.4595 94.1734 51.0082 93.9462 51.4127 93.5416L63.0961 81.8583C63.5006 81.4538 63.7279 80.9051 63.7279 80.333Z" style={{fill: "var(--logo-main)"}} />
                </svg>
              </span>
            </>)}
            {" "}
            {V.expanded && (<>
              <button aria-label={V.sideTip} data-tip={V.sideTip} data-tip-side={V.sideTipSide} onClick={V.toggleSide} style={{width: "40px", height: "40px", borderRadius: "8px", border: "none", background: "transparent", color: "var(--muted)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flex: "none"}} className="hv1">
                {" "}
                <svg width="20" height="20" viewBox="-1.333 -1.333 26.667 26.667" style={{flex: "none", fill: "currentColor"}}>
                  <use href="#i-sidebar" x="0" y="0" width="24" height="24" />
                </svg>
                {" "}
              </button>
            </>)}
            {" "}
          </div>
          {" "}
          {V.collapsed && (<>
            {" "}
            <button aria-label="Expand sidebar" data-tip="Expand sidebar" data-tip-side="right" onClick={V.toggleSide} style={{marginTop: "12px", width: "44px", height: "44px", border: "none", borderRadius: "10px", background: "transparent", color: "var(--muted)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"}} className="hv2">
              {" "}
              <svg width="20" height="20" viewBox="-1.333 -1.333 26.667 26.667" style={{flex: "none", fill: "currentColor"}}>
                <use href="#i-sidebar" x="0" y="0" width="24" height="24" />
              </svg>
              {" "}
            </button>
            {" "}
          </>)}
          {" "}
          <nav style={{marginTop: "16px", display: "flex", flexDirection: "column", gap: "4px"}}>
            {" "}
            {(V.navItems || []).map((n, n$i) => (<React.Fragment key={n$i}>
              {" "}
              <div style={{position: "relative"}}>
                {" "}
                {n.active && (<>
                  <span style={{position: "absolute", left: V.barLeft, top: "10px", bottom: "10px", width: "3px", borderRadius: "0 3px 3px 0", background: "var(--accent)"}} />
                </>)}
                {" "}
                <button aria-current={n.current} onClick={n.onClick} onMouseEnter={n.enter} onMouseLeave={V.tipOff} aria-label={n.label} style={{width: V.itemW, height: "44px", borderRadius: "10px", padding: `0 ${V.itemPad}`, display: "flex", alignItems: "center", justifyContent: V.itemJustify, gap: "12px", border: "none", background: n.bg, color: n.color, fontSize: "14px", lineHeight: "20px", fontWeight: n.weight, cursor: "pointer", textAlign: "left", whiteSpace: "nowrap", "--hv3-0": n.hoverBg}} className="hv3">
                  {" "}
                  <svg width="20" height="20" viewBox="-1.333 -1.333 26.667 26.667" style={{flex: "none", fill: "currentColor", color: n.iconColor}}>
                    <use href={n.icon} x="0" y="0" width="24" height="24" />
                  </svg>
                  {" "}
                  {V.expanded && (<>
                    <span>
                      {I(n.label)}
                    </span>
                  </>)}
                  {" "}
                </button>
                {" "}
                {n.tip && (<>
                  <span style={{position: "absolute", left: "calc(100% + 10px)", top: "50%", transform: "translateY(-50%)", background: "var(--tip)", color: "var(--colors-text-text-white)", boxShadow: "0px 12px 16px -4px var(--colors-effects-shadows-shadow-lg-01), 0px 4px 6px -2px var(--colors-effects-shadows-shadow-lg-02), 0px 2px 2px -1px var(--colors-effects-shadows-shadow-lg-03)", fontSize: "12px", lineHeight: "18px", fontWeight: "600", padding: "8px 12px", borderRadius: "8px", whiteSpace: "nowrap", pointerEvents: "none", zIndex: "60"}}>
                    {I(n.label)}
                    <span style={{position: "absolute", left: "-4px", top: "50%", width: "8px", height: "8px", background: "var(--tip)", transform: "translateY(-50%) rotate(45deg)"}} />
                  </span>
                </>)}
                {" "}
              </div>
              {" "}
            </React.Fragment>))}
            {" "}
          </nav>
          {" "}
          <div style={{flex: "1"}} />
          {" "}
          {V.expanded && (<>
            {" "}
            <div data-screen-label="Credits" style={{position: "relative", overflow: "hidden", isolation: "isolate", padding: "16px", borderRadius: "12px", background: "var(--colors-background-bg-primary)", boxShadow: "0px 4px 6px -1px color-mix(in srgb, var(--colors-semantic-brand-600) 16%, transparent), 0px 2px 4px -2px color-mix(in srgb, var(--colors-semantic-brand-600) 10%, transparent)", display: "flex", flexDirection: "column", gap: "12px"}}>
              {" "}
              <div aria-hidden="true" style={{position: "absolute", inset: "0", zIndex: "-1", pointerEvents: "none", background: "linear-gradient(180deg, var(--tint) 0%, var(--colors-background-bg-primary) 75%)"}} />
              {" "}
              <div aria-hidden="true" style={{position: "absolute", inset: "0", zIndex: "-1", pointerEvents: "none", backgroundImage: "radial-gradient(circle at 1px 1px, var(--colors-semantic-brand-300) 1px, transparent 1.2px)", backgroundSize: "10px 10px", backgroundPosition: "4px 4px", opacity: ".4", WebkitMaskImage: "linear-gradient(180deg, var(--colors-base-black) 0%, transparent 75%)", maskImage: "linear-gradient(180deg, var(--colors-base-black) 0%, transparent 75%)"}} />
              {" "}
              <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px"}}>
                {" "}
                <span style={{display: "flex", alignItems: "center", gap: "8px"}}>
                  {" "}
                  <span style={{width: "28px", height: "28px", borderRadius: "8px", background: "var(--colors-background-bg-primary)", boxShadow: "0px 1px 2px 0px var(--colors-effects-shadows-shadow-xs)", color: "var(--tint-ink)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none"}}>
                    <svg width="16" height="16" viewBox="0 0 24 24" style={{flex: "none", fill: "currentColor"}}>
                      <use href="#i-coin" />
                    </svg>
                  </span>
                  {" "}
                  <span style={{fontSize: "14px", lineHeight: "20px", fontWeight: "600", color: "var(--ink)"}}>
                    {"Credits"}
                  </span>
                  {" "}
                </span>
                {" "}
              </div>
              {" "}
              <div role="progressbar" aria-label="Credits left" aria-valuenow="57" aria-valuemin="0" aria-valuemax="100" aria-valuetext="1,148 of 2,000 credits left" style={{position: "relative", height: "112px"}}>
                {" "}
                <svg width="200" height="108" viewBox="0 0 200 108" aria-hidden="true" style={{display: "block", margin: "0 auto", overflow: "visible"}}>
                  {" "}
                  <path d="M 118.8 16.1 A 86 86 0 0 1 186 100" data-tip="Used · 852 credits (43%)" fill="none" stroke="var(--colors-background-bg-quaternary)" strokeWidth="12" strokeLinecap="round" style={{cursor: "default"}} />
                  {" "}
                  <path d="M 14 100 A 86 86 0 0 1 118.8 16.1" data-tip="Left · 1,148 credits (57%)" fill="none" stroke="var(--component-colors-components-progressbars-brand)" strokeWidth="12" strokeLinecap="round" style={{cursor: "default"}} />
                  {" "}
                  <circle cx="118.8" cy="16.1" r="7" data-tip="Left · 1,148 credits (57%)" fill="var(--colors-background-bg-primary)" stroke="var(--component-colors-components-progressbars-brand)" strokeWidth="3" />
                  {" "}
                </svg>
                {" "}
                <div style={{position: "absolute", left: "0", right: "0", bottom: "0", display: "flex", flexDirection: "column", alignItems: "center"}}>
                  {" "}
                  <span style={{fontSize: "24px", lineHeight: "32px", fontWeight: "600", color: "var(--ink)", fontVariantNumeric: "proportional-nums"}}>
                    {"1,148"}
                  </span>
                  {" "}
                  <span style={{fontSize: "12px", lineHeight: "18px", color: "var(--muted)"}}>
                    {"of 2,000 left"}
                  </span>
                  {" "}
                </div>
                {" "}
              </div>
              {" "}
              <div style={{display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", fontSize: "12px", lineHeight: "18px", color: "var(--muted)"}}>
                {" "}
                <span style={{display: "flex", alignItems: "center", gap: "6px"}}>
                  <span style={{width: "8px", height: "8px", borderRadius: "50%", background: "var(--component-colors-components-progressbars-brand)"}} />
                  {"Left 57%"}
                </span>
                {" "}
                <span style={{display: "flex", alignItems: "center", gap: "6px"}}>
                  <span style={{width: "8px", height: "8px", borderRadius: "50%", background: "var(--colors-background-bg-quaternary)"}} />
                  {"Used 43%"}
                </span>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </>)}
          {" "}
          {V.collapsed && (<>
            {" "}
            <div style={{display: "flex", justifyContent: "center", position: "relative"}} onMouseEnter={V.tipCredits} onMouseLeave={V.tipOff}>
              {" "}
              <span role="progressbar" aria-label="Credits left" aria-valuenow="57" aria-valuemin="0" aria-valuemax="100" style={{position: "relative", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--tint-ink)"}}>
                {" "}
                <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true" style={{position: "absolute", inset: "0", transform: "rotate(-90deg)"}}>
                  {" "}
                  <circle cx="20" cy="20" r="17" fill="var(--tint)" stroke="var(--colors-background-bg-quaternary)" strokeWidth="3" />
                  {" "}
                  <circle cx="20" cy="20" r="17" fill="none" stroke="var(--component-colors-components-progressbars-brand)" strokeWidth="3" strokeLinecap="round" pathLength="100" strokeDasharray="56.99999999999999 100" />
                  {" "}
                </svg>
                {" "}
                <svg width="16" height="16" viewBox="0 0 24 24" style={{position: "relative", flex: "none", fill: "currentColor"}}>
                  <use href="#i-coin" />
                </svg>
                {" "}
              </span>
              {" "}
              {V.creditsTip && (<>
                <span style={{position: "absolute", left: "calc(100% + 10px)", top: "50%", transform: "translateY(-50%)", background: "var(--tip)", color: "var(--colors-text-text-white)", boxShadow: "0px 12px 16px -4px var(--colors-effects-shadows-shadow-lg-01), 0px 4px 6px -2px var(--colors-effects-shadows-shadow-lg-02), 0px 2px 2px -1px var(--colors-effects-shadows-shadow-lg-03)", fontSize: "12px", lineHeight: "18px", fontWeight: "600", padding: "8px 12px", borderRadius: "8px", whiteSpace: "nowrap", pointerEvents: "none", zIndex: "60"}}>
                  {"1,148 credits left"}
                  <span style={{position: "absolute", left: "-4px", top: "50%", width: "8px", height: "8px", background: "var(--tip)", transform: "translateY(-50%) rotate(45deg)"}} />
                </span>
              </>)}
              {" "}
            </div>
            {" "}
          </>)}
          {" "}
          <div style={{marginTop: "12px", display: "flex", flexDirection: "column", gap: "4px"}}>
            {" "}
            {(V.navBottom || []).map((n, n$i) => (<React.Fragment key={n$i}>
              {" "}
              <div style={{position: "relative"}}>
                {" "}
                <button onMouseEnter={n.enter} onMouseLeave={V.tipOff} aria-label={n.label} style={{width: V.itemW, height: "44px", borderRadius: "10px", padding: `0 ${V.itemPad}`, display: "flex", alignItems: "center", justifyContent: V.itemJustify, gap: "12px", border: "none", background: "transparent", color: "var(--ink)", fontSize: "14px", lineHeight: "20px", fontWeight: "500", cursor: "pointer", textAlign: "left"}} className="hv4">
                  {" "}
                  <svg width="20" height="20" viewBox="-1.333 -1.333 26.667 26.667" style={{flex: "none", fill: "currentColor"}}>
                    <use href="#i-help" x="0" y="0" width="24" height="24" />
                  </svg>
                  {" "}
                  {V.expanded && (<>
                    <span>
                      {I(n.label)}
                    </span>
                  </>)}
                  {" "}
                </button>
                {" "}
                {n.tip && (<>
                  <span style={{position: "absolute", left: "calc(100% + 10px)", top: "50%", transform: "translateY(-50%)", background: "var(--tip)", color: "var(--colors-text-text-white)", boxShadow: "0px 12px 16px -4px var(--colors-effects-shadows-shadow-lg-01), 0px 4px 6px -2px var(--colors-effects-shadows-shadow-lg-02), 0px 2px 2px -1px var(--colors-effects-shadows-shadow-lg-03)", fontSize: "12px", lineHeight: "18px", fontWeight: "600", padding: "8px 12px", borderRadius: "8px", whiteSpace: "nowrap", pointerEvents: "none", zIndex: "60"}}>
                    {I(n.label)}
                    <span style={{position: "absolute", left: "-4px", top: "50%", width: "8px", height: "8px", background: "var(--tip)", transform: "translateY(-50%) rotate(45deg)"}} />
                  </span>
                </>)}
                {" "}
              </div>
              {" "}
            </React.Fragment>))}
            {" "}
            <div style={{height: "44px", width: V.itemW, display: "flex", alignItems: "center", justifyContent: V.itemJustify, gap: "10px", padding: `0 ${V.itemPad}`}}>
              {" "}
              <span style={{width: "32px", height: "32px", borderRadius: "50%", background: "var(--hover)", border: "1px solid var(--border)", color: "var(--muted)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none"}}>
                {" "}
                <svg width="16" height="16" viewBox="0 0 24 24" style={{flex: "none", fill: "currentColor"}}>
                  <use href="#i-user" />
                </svg>
                {" "}
              </span>
              {" "}
              {V.expanded && (<>
                {" "}
                <div style={{display: "flex", flexDirection: "column", minWidth: "0"}}>
                  {" "}
                  <span style={{fontSize: "14px", lineHeight: "20px", fontWeight: "500"}}>
                    {"Isaac"}
                  </span>
                  {" "}
                  <span style={{fontSize: "12px", lineHeight: "16px", color: "var(--muted)"}}>
                    {"Admin"}
                  </span>
                  {" "}
                </div>
                {" "}
              </>)}
              {" "}
            </div>
            {" "}
          </div>
        </aside>
        <main style={{flex: "1", minWidth: "0"}}>
          <div style={{maxWidth: "1840px", margin: "0 auto", padding: "32px clamp(24px,3vw,48px) 24px"}}>
            {V.isList && (<>
              <div data-screen-label="01 My Assessments" style={{display: "flex", flexDirection: "column", gap: "24px"}}>
                {" "}
                <div data-group="assessments-header" style={{display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap"}}>
                  {" "}
                  <h1 style={{margin: "0", fontSize: "24px", lineHeight: "32px", fontWeight: "600"}}>
                    {"My Assessments"}
                  </h1>
                  {" "}
                  <div style={{display: "flex", gap: "12px"}}>
                    {" "}
                    <button style={{display: "inline-flex", alignItems: "center", gap: "8px", height: "40px", padding: "0 16px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--colors-background-bg-primary)", color: "var(--ink)", fontSize: "14px", lineHeight: "20px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap"}} className="hv5">
                      {" "}
                      <svg width="20" height="20" viewBox="-1.333 -1.333 26.667 26.667" style={{flex: "none", fill: "currentColor", color: "var(--colors-foreground-fg-brand-primary-600)"}}>
                        <use href="#i-sparkles" x="0" y="0" width="24" height="24" />
                      </svg>
                      {"Create Assessment using AI "}
                    </button>
                    {" "}
                    <button style={{display: "inline-flex", alignItems: "center", gap: "8px", height: "40px", padding: "0 16px", borderRadius: "8px", border: "1px solid var(--brand)", background: "var(--brand)", color: "var(--colors-text-text-primary-on-brand)", fontSize: "14px", lineHeight: "20px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap"}} className="hv6">
                      {" "}
                      <svg width="20" height="20" viewBox="-1.333 -1.333 26.667 26.667" style={{flex: "none", fill: "currentColor"}}>
                        <use href="#i-plus" x="0" y="0" width="24" height="24" />
                      </svg>
                      {"Create Assessment "}
                    </button>
                    {" "}
                  </div>
                  {" "}
                </div>
                {" "}
                <div data-group="assessments-list" style={{display: "flex", flexDirection: "column", gap: "16px", minWidth: "0"}}>
                  {" "}
                  <div style={{display: "flex", alignItems: "center", gap: "12px", minHeight: "40px", flexWrap: "wrap"}}>
                    {" "}
                    <label style={{position: "relative", width: "320px", maxWidth: "100%", height: "40px", display: "block"}}>
                      {" "}
                      <span style={{position: "absolute", left: "12px", top: "10px", color: "var(--muted)", display: "flex"}}>
                        <svg width="20" height="20" viewBox="-1.333 -1.333 26.667 26.667" style={{flex: "none", fill: "currentColor"}}>
                          <use href="#i-search" x="0" y="0" width="24" height="24" />
                        </svg>
                      </span>
                      {" "}
                      <input placeholder="Search assessments" value={V.search} onChange={V.onSearch} style={{width: "100%", height: "40px", borderRadius: "8px", border: "1px solid var(--border)", padding: "0 12px 0 40px", fontSize: "14px", lineHeight: "20px", background: "var(--colors-background-bg-primary)", outline: "none"}} />
                      {" "}
                    </label>
                    {" "}
                    <div style={{flex: "1"}} />
                    {" "}
                    <div data-menu="status" style={{position: "relative"}}>
                      {" "}
                      <button onClick={V.toggleStatusMenu} aria-haspopup="listbox" style={{width: "168px", height: "40px", borderRadius: "10px", border: "none", background: "var(--colors-background-bg-primary)", boxShadow: "inset 0 0 0 1px var(--border), 0px 1px 2px 0px var(--colors-effects-shadows-shadow-xs)", padding: "0 12px 0 14px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", fontSize: "14px", lineHeight: "20px", fontWeight: "500", cursor: "pointer", color: "var(--ink)"}} className="hv7">
                        {" "}
                        <span>
                          {I(V.statusLabel)}
                        </span>
                        {" "}
                        <svg width="16" height="16" viewBox="0 0 24 24" style={{flex: "none", fill: "currentColor", color: "var(--muted)"}}>
                          <use href="#i-down" />
                        </svg>
                        {" "}
                      </button>
                      {" "}
                      {V.statusMenuOpen && (<>
                        {" "}
                        <div role="listbox" style={{position: "absolute", top: "calc(100% + 6px)", right: "0", width: "240px", background: "var(--colors-background-bg-primary)", border: "1px solid var(--border)", borderRadius: "10px", padding: "4px 0", boxShadow: "0px 12px 16px -4px var(--colors-effects-shadows-shadow-lg-01), 0px 4px 6px -2px var(--colors-effects-shadows-shadow-lg-02), 0px 2px 2px -1px var(--colors-effects-shadows-shadow-lg-03)", zIndex: "40", animation: "fin .12s ease"}}>
                          {" "}
                          {(V.statusOptions || []).map((o, o$i) => (<React.Fragment key={o$i}>
                            {" "}
                            {o.isGroup && (<>
                              <div style={{padding: "8px 12px 4px", fontSize: "12px", lineHeight: "16px", fontWeight: "500", color: "var(--muted)"}}>
                                {I(o.label)}
                              </div>
                            </>)}
                            {" "}
                            {o.isOption && (<>
                              {" "}
                              <button role="option" onClick={o.pick} style={{width: "calc(100% - 8px)", margin: "0 4px", height: "40px", borderRadius: "8px", border: "none", background: o.bg, padding: `8px 10px 8px ${o.padL}`, display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", lineHeight: "20px", fontWeight: "500", color: "var(--ink)", cursor: "pointer", textAlign: "left"}} className="hv8">
                                {" "}
                                <span style={{flex: "1"}}>
                                  {I(o.label)}
                                </span>
                                {" "}
                                <span style={{color: "var(--muted)", fontWeight: "400"}}>
                                  {I(o.count)}
                                </span>
                                {" "}
                                <span style={{width: "16px", display: "flex", color: "var(--brand)"}}>
                                  {o.selected && (<>
                                    <svg width="16" height="16" viewBox="0 0 24 24" style={{flex: "none", fill: "currentColor"}}>
                                      <use href="#i-check" />
                                    </svg>
                                  </>)}
                                </span>
                                {" "}
                              </button>
                              {" "}
                            </>)}
                            {" "}
                          </React.Fragment>))}
                          {" "}
                        </div>
                        {" "}
                      </>)}
                      {" "}
                    </div>
                    {" "}
                    <button onClick={V.toggleCreatedBy} style={{height: "40px", borderRadius: "10px", border: "none", background: "var(--colors-background-bg-primary)", boxShadow: "inset 0 0 0 1px var(--border), 0px 1px 2px 0px var(--colors-effects-shadows-shadow-xs)", padding: "0 12px 0 14px", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", lineHeight: "20px", fontWeight: "500", cursor: "pointer", color: "var(--ink)", whiteSpace: "nowrap"}} className="hv9">
                      {" "}
                      <span>
                        {I(V.createdByLabel)}
                      </span>
                      {" "}
                      <svg width="16" height="16" viewBox="0 0 24 24" style={{flex: "none", fill: "currentColor", color: "var(--muted)"}}>
                        <use href="#i-selector" />
                      </svg>
                      {" "}
                    </button>
                    {" "}
                    <button aria-label="Refresh assessments" data-tip="Refresh assessments" onClick={V.refresh} style={{width: "40px", height: "40px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--colors-background-bg-primary)", color: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"}} className="hv10">
                      {" "}
                      <svg width="20" height="20" viewBox="-1.333 -1.333 26.667 26.667" style={{flex: "none", fill: "currentColor"}}>
                        <use href="#i-refresh" x="0" y="0" width="24" height="24" />
                      </svg>
                      {" "}
                    </button>
                    {" "}
                  </div>
                  {" "}
                  <div style={{border: "1px solid var(--border)", borderRadius: "12px", overflowX: "auto", background: "var(--colors-background-bg-primary)"}}>
                    <div style={{minWidth: "1000px"}}>
                      {" "}
                      <div style={{display: "grid", gridTemplateColumns: "minmax(0,299fr) minmax(0,177fr) minmax(0,176fr) minmax(0,177fr) minmax(0,84fr) minmax(0,148fr)", height: "43px", background: "var(--subtle)", borderBottom: "1px solid var(--border)", fontSize: "12px", lineHeight: "18px", fontWeight: "500", color: "var(--muted)"}}>
                        {" "}
                        <div style={{padding: "12px 20px"}}>
                          {"Assessment"}
                        </div>
                        <div style={{padding: "12px 20px"}}>
                          {"Status"}
                        </div>
                        <div style={{padding: "12px 20px"}}>
                          {"Start Time"}
                        </div>
                        <div style={{padding: "12px 20px"}}>
                          {"End Time"}
                        </div>
                        <div style={{padding: "12px 20px"}}>
                          {"Score"}
                        </div>
                        <div style={{padding: "12px 20px"}}>
                          {"Actions"}
                        </div>
                        {" "}
                      </div>
                      {" "}
                      {V.refreshing && (<>
                        {" "}
                        {(V.skeletons || []).map((k, k$i) => (<React.Fragment key={k$i}>
                          {" "}
                          <div style={{display: "grid", gridTemplateColumns: "minmax(0,299fr) minmax(0,177fr) minmax(0,176fr) minmax(0,177fr) minmax(0,84fr) minmax(0,148fr)", height: "64px", alignItems: "center", borderTop: k.divider}}>
                            {" "}
                            <div style={{padding: "0 20px"}}>
                              <div style={{height: "12px", width: k.w, borderRadius: "6px", background: "var(--hover)", animation: "sk 1.2s ease-in-out infinite"}} />
                            </div>
                            {" "}
                            <div style={{padding: "0 20px"}}>
                              <div style={{height: "24px", width: "96px", borderRadius: "999px", background: "var(--hover)", animation: "sk 1.2s ease-in-out infinite"}} />
                            </div>
                            {" "}
                            <div style={{padding: "0 20px"}}>
                              <div style={{height: "12px", width: "110px", borderRadius: "6px", background: "var(--hover)", animation: "sk 1.2s ease-in-out infinite"}} />
                            </div>
                            {" "}
                            <div style={{padding: "0 20px"}}>
                              <div style={{height: "12px", width: "110px", borderRadius: "6px", background: "var(--hover)", animation: "sk 1.2s ease-in-out infinite"}} />
                            </div>
                            {" "}
                            <div style={{padding: "0 20px"}}>
                              <div style={{height: "12px", width: "24px", borderRadius: "6px", background: "var(--hover)", animation: "sk 1.2s ease-in-out infinite"}} />
                            </div>
                            {" "}
                            <div style={{padding: "0 20px", display: "flex", gap: "8px"}}>
                              <div style={{height: "28px", width: "28px", borderRadius: "8px", background: "var(--hover)", animation: "sk 1.2s ease-in-out infinite"}} />
                              <div style={{height: "28px", width: "28px", borderRadius: "8px", background: "var(--hover)", animation: "sk 1.2s ease-in-out infinite"}} />
                            </div>
                            {" "}
                          </div>
                          {" "}
                        </React.Fragment>))}
                        {" "}
                      </>)}
                      {" "}
                      {V.showRows && (<>
                        {" "}
                        {(V.rows || []).map((r, r$i) => (<React.Fragment key={r$i}>
                          {" "}
                          <div role="button" tabIndex="0" onClick={r.open} onKeyDown={r.key} style={{display: "grid", gridTemplateColumns: "minmax(0,299fr) minmax(0,177fr) minmax(0,176fr) minmax(0,177fr) minmax(0,84fr) minmax(0,148fr)", height: "64px", alignItems: "center", borderTop: r.divider, cursor: "pointer", background: "var(--colors-background-bg-primary)"}} className="hv11">
                            {" "}
                            <div style={{padding: "0 20px", fontWeight: "500", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>
                              {I(r.name)}
                            </div>
                            {" "}
                            <div style={{padding: "0 20px", display: "flex"}}>
                              {" "}
                              <span style={{display: "inline-flex", alignItems: "center", gap: "8px", height: "24px", padding: "1px 10px", borderRadius: "999px", border: `1px solid ${r.b.bd}`, background: r.b.bg, color: r.b.tx, fontSize: "14px", lineHeight: "20px", fontWeight: "500", whiteSpace: "nowrap"}}>
                                <span style={{width: "6px", height: "6px", borderRadius: "50%", background: r.b.dot, flex: "none"}} />
                                {I(r.status)}
                              </span>
                              {" "}
                            </div>
                            {" "}
                            <div style={{padding: "0 20px", whiteSpace: "nowrap"}}>
                              {I(r.start)}
                            </div>
                            {" "}
                            <div style={{padding: "0 20px", whiteSpace: "nowrap"}}>
                              {I(r.end)}
                            </div>
                            {" "}
                            <div style={{padding: "0 20px", fontWeight: "600"}}>
                              {I(r.score)}
                            </div>
                            {" "}
                            <div style={{padding: "0 20px", display: "flex", gap: "4px"}}>
                              {" "}
                              <div style={{position: "relative", display: "flex"}}>
                                {" "}
                                <button aria-label="View Statistics" onClick={r.stats} onMouseEnter={r.enterS} onMouseLeave={V.tipOff} onFocus={r.enterS} onBlur={V.tipOff} style={{width: "36px", height: "36px", borderRadius: "8px", border: "none", background: "transparent", color: "var(--muted)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"}} className="hv12">
                                  {" "}
                                  <svg width="20" height="20" viewBox="-1.333 -1.333 26.667 26.667" style={{flex: "none", fill: "currentColor"}}>
                                    <use href="#i-chart" x="0" y="0" width="24" height="24" />
                                  </svg>
                                  {" "}
                                </button>
                                {" "}
                                {r.statsTip && (<>
                                  <span style={{position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)", background: "var(--tip)", color: "var(--colors-text-text-white)", boxShadow: "0px 12px 16px -4px var(--colors-effects-shadows-shadow-lg-01), 0px 4px 6px -2px var(--colors-effects-shadows-shadow-lg-02), 0px 2px 2px -1px var(--colors-effects-shadows-shadow-lg-03)", fontSize: "12px", lineHeight: "18px", fontWeight: "600", padding: "8px 12px", borderRadius: "8px", whiteSpace: "nowrap", pointerEvents: "none", zIndex: "30"}}>
                                    {"View Statistics"}
                                    <span style={{position: "absolute", bottom: "-4px", left: "50%", width: "8px", height: "8px", background: "var(--tip)", transform: "translateX(-50%) rotate(45deg)"}} />
                                  </span>
                                </>)}
                                {" "}
                              </div>
                              {" "}
                              <div style={{position: "relative", display: "flex"}}>
                                {" "}
                                <button aria-label="Clone Assessment" onClick={r.clone} onMouseEnter={r.enterC} onMouseLeave={V.tipOff} onFocus={r.enterC} onBlur={V.tipOff} style={{width: "36px", height: "36px", borderRadius: "8px", border: "none", background: "transparent", color: "var(--muted)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"}} className="hv13">
                                  {" "}
                                  <svg width="20" height="20" viewBox="-1.333 -1.333 26.667 26.667" style={{flex: "none", fill: "currentColor"}}>
                                    <use href="#i-copy" x="0" y="0" width="24" height="24" />
                                  </svg>
                                  {" "}
                                </button>
                                {" "}
                                {r.cloneTip && (<>
                                  <span style={{position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)", background: "var(--tip)", color: "var(--colors-text-text-white)", boxShadow: "0px 12px 16px -4px var(--colors-effects-shadows-shadow-lg-01), 0px 4px 6px -2px var(--colors-effects-shadows-shadow-lg-02), 0px 2px 2px -1px var(--colors-effects-shadows-shadow-lg-03)", fontSize: "12px", lineHeight: "18px", fontWeight: "600", padding: "8px 12px", borderRadius: "8px", whiteSpace: "nowrap", pointerEvents: "none", zIndex: "30"}}>
                                    {"Clone Assessment"}
                                    <span style={{position: "absolute", bottom: "-4px", left: "50%", width: "8px", height: "8px", background: "var(--tip)", transform: "translateX(-50%) rotate(45deg)"}} />
                                  </span>
                                </>)}
                                {" "}
                              </div>
                              {" "}
                            </div>
                            {" "}
                          </div>
                          {" "}
                        </React.Fragment>))}
                        {" "}
                        {V.noRows && (<>
                          <div style={{height: "128px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)"}}>
                            {"No assessments match your filters."}
                          </div>
                        </>)}
                        {" "}
                      </>)}
                      {" "}
                      <div style={{minHeight: "65px", padding: "12px 20px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", flexWrap: "wrap"}}>
                        {" "}
                        <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
                          {" "}
                          <span>
                            {"Page"}
                          </span>
                          {" "}
                          <span style={{width: "40px", height: "36px", borderRadius: "10px", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center"}}>
                            {I(V.page)}
                          </span>
                          {" "}
                          <span>
                            {"of 10"}
                          </span>
                          {" "}
                          <span style={{width: "1px", height: "20px", background: "var(--border)"}} />
                          {" "}
                          <span>
                            {"Rows per page"}
                          </span>
                          {" "}
                          <div data-menu="rows" style={{position: "relative", width: "80px"}}>
                            {" "}
                            <button onClick={V.toggle_rows} aria-haspopup="listbox" style={{width: "80px", height: V.rowsH, borderRadius: "10px", border: "none", background: "var(--colors-background-bg-primary)", boxShadow: "inset 0 0 0 1px var(--border), 0px 1px 2px 0px var(--colors-effects-shadows-shadow-xs)", padding: "0 12px 0 14px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", fontSize: "14px", lineHeight: "20px", fontWeight: "500", cursor: "pointer", color: "var(--ink)"}} className="hv14">
                              <span>
                                {I(V.label_rows)}
                              </span>
                              <svg width="16" height="16" viewBox="0 0 24 24" style={{flex: "none", fill: "currentColor", color: "var(--muted)"}}>
                                <use href="#i-down" />
                              </svg>
                            </button>
                            {" "}
                            {V.open_rows && (<>
                              {" "}
                              <div role="listbox" style={{position: "absolute", bottom: "calc(100% + 6px)", left: "0", width: "100%", minWidth: "max-content", background: "var(--colors-background-bg-primary)", border: "1px solid var(--border)", borderRadius: "10px", padding: "4px 0", boxShadow: "0px 12px 16px -4px var(--colors-effects-shadows-shadow-lg-01), 0px 4px 6px -2px var(--colors-effects-shadows-shadow-lg-02), 0px 2px 2px -1px var(--colors-effects-shadows-shadow-lg-03)", zIndex: "90", animation: "fin .12s ease"}}>
                                {" "}
                                {(V.opts_rows || []).map((o, o$i) => (<React.Fragment key={o$i}>
                                  {" "}
                                  <button role="option" onClick={o.pick} style={{width: "calc(100% - 8px)", margin: "0 4px", height: "40px", borderRadius: "8px", border: "none", background: o.bg, padding: "8px 10px 8px 8px", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", lineHeight: "20px", fontWeight: "500", color: "var(--ink)", cursor: "pointer", textAlign: "left", whiteSpace: "nowrap"}} className="hv15">
                                    <span style={{flex: "1"}}>
                                      {I(o.label)}
                                    </span>
                                    <span style={{width: "16px", display: "flex", color: "var(--brand)"}}>
                                      {o.selected && (<>
                                        <svg width="16" height="16" viewBox="0 0 24 24" style={{flex: "none", fill: "currentColor"}}>
                                          <use href="#i-check" />
                                        </svg>
                                      </>)}
                                    </span>
                                  </button>
                                  {" "}
                                </React.Fragment>))}
                                {" "}
                              </div>
                              {" "}
                            </>)}
                            {" "}
                          </div>
                          {" "}
                        </div>
                        {" "}
                        <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
                          {" "}
                          <button aria-label="First page" data-tip="First page" onClick={V.firstPage} style={{width: "40px", height: "40px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--colors-background-bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"}} className="hv16">
                            <svg width="20" height="20" viewBox="-1.333 -1.333 26.667 26.667" style={{flex: "none", fill: "currentColor"}}>
                              <use href="#i-first" x="0" y="0" width="24" height="24" />
                            </svg>
                          </button>
                          {" "}
                          <button aria-label="Previous page" data-tip="Previous page" onClick={V.prevPage} style={{width: "40px", height: "40px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--colors-background-bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"}} className="hv17">
                            <svg width="20" height="20" viewBox="-1.333 -1.333 26.667 26.667" style={{flex: "none", fill: "currentColor"}}>
                              <use href="#i-left" x="0" y="0" width="24" height="24" />
                            </svg>
                          </button>
                          {" "}
                          <div style={{display: "flex", gap: "2px"}}>
                            {" "}
                            {(V.pages || []).map((p, p$i) => (<React.Fragment key={p$i}>
                              {" "}
                              <button onClick={p.go} disabled={p.gap} style={{width: "40px", height: "40px", borderRadius: "8px", border: "none", background: p.bg, fontSize: "14px", lineHeight: "20px", fontWeight: p.weight, color: p.color, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"}} className="hv18">
                                {I(p.label)}
                              </button>
                              {" "}
                            </React.Fragment>))}
                            {" "}
                          </div>
                          {" "}
                          <button aria-label="Next page" data-tip="Next page" onClick={V.nextPage} style={{width: "40px", height: "40px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--colors-background-bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"}} className="hv19">
                            <svg width="20" height="20" viewBox="-1.333 -1.333 26.667 26.667" style={{flex: "none", fill: "currentColor"}}>
                              <use href="#i-right" x="0" y="0" width="24" height="24" />
                            </svg>
                          </button>
                          {" "}
                          <button aria-label="Last page" data-tip="Last page" onClick={V.lastPage} style={{width: "40px", height: "40px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--colors-background-bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"}} className="hv20">
                            <svg width="20" height="20" viewBox="-1.333 -1.333 26.667 26.667" style={{flex: "none", fill: "currentColor"}}>
                              <use href="#i-last" x="0" y="0" width="24" height="24" />
                            </svg>
                          </button>
                          {" "}
                        </div>
                        {" "}
                      </div>
                      {" "}
                    </div>
                  </div>
                  {" "}
                </div>
              </div>
            </>)}
            {V.isDetails && (<>
              <div data-screen-label="02 Assessment Details" style={{display: "flex", flexDirection: "column", gap: "24px"}}>
                {" "}
                <div data-group="assessment-overview" style={{display: "flex", flexDirection: "column", gap: "12px"}}>
                  {" "}
                  <button onClick={V.goList} style={{height: "28px", display: "inline-flex", alignItems: "center", gap: "6px", border: "none", background: "transparent", padding: "0 4px 0 0", color: "var(--muted)", fontSize: "14px", lineHeight: "20px", fontWeight: "500", cursor: "pointer", borderRadius: "6px"}} className="hv21">
                    {" "}
                    <svg width="16" height="16" viewBox="0 0 24 24" style={{flex: "none", fill: "currentColor"}}>
                      <use href="#i-back" />
                    </svg>
                    {"Back "}
                  </button>
                  {" "}
                  <div style={{display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", flexWrap: "wrap"}}>
                    {" "}
                    <div style={{display: "flex", flexDirection: "column", gap: "6px", minWidth: "0"}}>
                      {" "}
                      <div style={{display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap"}}>
                        {" "}
                        <h1 style={{margin: "0", fontSize: "24px", lineHeight: "32px", fontWeight: "600"}}>
                          {I(V.cur.name)}
                        </h1>
                        {" "}
                        <span style={{display: "inline-flex", alignItems: "center", gap: "8px", height: "24px", padding: "1px 10px", borderRadius: "999px", border: `1px solid ${V.cur.b.bd}`, background: V.cur.b.bg, color: V.cur.b.tx, fontSize: "14px", lineHeight: "20px", fontWeight: "500", whiteSpace: "nowrap"}}>
                          <span style={{width: "6px", height: "6px", borderRadius: "50%", background: V.cur.b.dot}} />
                          {I(V.cur.status)}
                        </span>
                        {" "}
                      </div>
                      {" "}
                      <div style={{display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap", marginTop: "2px"}}>
                        {" "}
                        <span style={{display: "flex", alignItems: "center", gap: "8px"}}>
                          <svg width="16" height="16" viewBox="0 0 24 24" style={{flex: "none", fill: "currentColor", color: "var(--muted)"}}>
                            <use href="#i-stack" />
                          </svg>
                          <span style={{color: "var(--muted)"}}>
                            {"Sections:"}
                          </span>
                          <span style={{fontWeight: "500"}}>
                            {"4"}
                          </span>
                        </span>
                        {" "}
                        <span style={{display: "flex", alignItems: "center", gap: "8px"}}>
                          <svg width="16" height="16" viewBox="0 0 24 24" style={{flex: "none", fill: "currentColor", color: "var(--muted)"}}>
                            <use href="#i-clock" />
                          </svg>
                          <span style={{color: "var(--muted)"}}>
                            {"Duration:"}
                          </span>
                          <span style={{fontWeight: "500"}}>
                            {"60 mins"}
                          </span>
                        </span>
                        {" "}
                        <span style={{display: "flex", alignItems: "center", gap: "8px"}}>
                          <svg width="16" height="16" viewBox="0 0 24 24" style={{flex: "none", fill: "currentColor", color: "var(--muted)"}}>
                            <use href="#i-trophy" />
                          </svg>
                          <span style={{color: "var(--muted)"}}>
                            {"Score:"}
                          </span>
                          <span style={{fontWeight: "500"}}>
                            {I(V.cur.score)}
                          </span>
                        </span>
                        {" "}
                      </div>
                      {" "}
                      <div style={{display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap"}}>
                        {" "}
                        <span style={{display: "flex", alignItems: "center", gap: "8px"}}>
                          <svg width="16" height="16" viewBox="0 0 24 24" style={{flex: "none", fill: "currentColor", color: "var(--muted)"}}>
                            <use href="#i-cal" />
                          </svg>
                          <span style={{color: "var(--muted)"}}>
                            {"Start Date:"}
                          </span>
                          <span style={{fontWeight: "500"}}>
                            {"09 Nov 2026, 03:52 PM"}
                          </span>
                        </span>
                        {" "}
                        <span style={{display: "flex", alignItems: "center", gap: "8px"}}>
                          <svg width="16" height="16" viewBox="0 0 24 24" style={{flex: "none", fill: "currentColor", color: "var(--muted)"}}>
                            <use href="#i-cal" />
                          </svg>
                          <span style={{color: "var(--muted)"}}>
                            {"End Date:"}
                          </span>
                          <span style={{fontWeight: "500"}}>
                            {"14 Nov 2026, 12:00 AM"}
                          </span>
                          {" "}
                          <button aria-label="Edit End Date" data-tip="Edit End Date" style={{width: "28px", height: "28px", borderRadius: "8px", border: "none", background: "transparent", color: "var(--muted)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"}} className="hv22">
                            <svg width="16" height="16" viewBox="0 0 24 24" style={{flex: "none", fill: "currentColor"}}>
                              <use href="#i-pencil" />
                            </svg>
                          </button>
                          {" "}
                        </span>
                        {" "}
                      </div>
                      {" "}
                    </div>
                    {" "}
                    <div style={{display: "flex", alignItems: "center", gap: "12px"}}>
                      {" "}
                      <button onClick={V.cloneCur} style={{display: "inline-flex", alignItems: "center", gap: "8px", height: "40px", padding: "0 10px", borderRadius: "8px", border: "none", background: "transparent", color: "var(--colors-text-text-brand-secondary-700)", fontSize: "14px", lineHeight: "20px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap"}} className="hv23">
                        {" "}
                        <svg width="20" height="20" viewBox="-1.333 -1.333 26.667 26.667" style={{flex: "none", fill: "currentColor"}}>
                          <use href="#i-copy" x="0" y="0" width="24" height="24" />
                        </svg>
                        {"Clone Assessment "}
                      </button>
                      {" "}
                      <button onClick={V.goStats} style={{display: "inline-flex", alignItems: "center", gap: "8px", height: "40px", padding: "0 16px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--colors-background-bg-primary)", color: "var(--ink)", fontSize: "14px", lineHeight: "20px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap"}} className="hv24">
                        {" "}
                        <svg width="20" height="20" viewBox="-1.333 -1.333 26.667 26.667" style={{flex: "none", fill: "currentColor"}}>
                          <use href="#i-chart" x="0" y="0" width="24" height="24" />
                        </svg>
                        {"View Statistics "}
                      </button>
                      {" "}
                      <button onClick={V.openDrawer} style={{display: "inline-flex", alignItems: "center", gap: "8px", height: "40px", padding: "0 16px", borderRadius: "8px", border: "1px solid var(--brand)", background: "var(--brand)", color: "var(--colors-text-text-primary-on-brand)", fontSize: "14px", lineHeight: "20px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap"}} className="hv25">
                        {" "}
                        <svg width="20" height="20" viewBox="-1.333 -1.333 26.667 26.667" style={{flex: "none", fill: "currentColor"}}>
                          <use href="#i-user-plus" x="0" y="0" width="24" height="24" />
                        </svg>
                        {"Invite Candidates "}
                      </button>
                      {" "}
                    </div>
                    {" "}
                  </div>
                  {" "}
                </div>
                {" "}
                <div data-group="assessment-tabs" style={{display: "flex", flexDirection: "column", gap: "16px"}}>
                  {" "}
                  <div role="tablist" style={{display: "flex", gap: "24px", borderBottom: "1px solid var(--border)"}}>
                    {" "}
                    {(V.tabs || []).map((t, t$i) => (<React.Fragment key={t$i}>
                      {" "}
                      <button role="tab" onClick={t.pick} style={{display: "flex", alignItems: "center", gap: "8px", padding: "0 2px 12px", border: "none", background: "transparent", fontSize: "14px", lineHeight: "20px", fontWeight: "600", color: t.color, boxShadow: `inset 0 -2px 0 ${t.line}`, marginBottom: "-1px", cursor: "pointer", borderRadius: "4px 4px 0 0"}} className="hv26">
                        {" "}
                        <span>
                          {I(t.label)}
                        </span>
                        {" "}
                        {t.count && (<>
                          <span style={{fontSize: "12px", lineHeight: "18px", padding: "0 8px", borderRadius: "999px", border: "1px solid var(--border)", color: "var(--muted)", fontWeight: "500"}}>
                            {I(t.count)}
                          </span>
                        </>)}
                        {" "}
                      </button>
                      {" "}
                    </React.Fragment>))}
                    {" "}
                  </div>
                  {" "}
                  {V.tabBasic && (<>
                    {" "}
                    <div style={{display: "flex", gap: "16px", flexWrap: "wrap"}}>
                      {" "}
                      {(V.detailMetrics || []).map((m, m$i) => (<React.Fragment key={m$i}>
                        {" "}
                        <div style={{flex: "1 1 220px", padding: "16px", borderRadius: "12px", border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "12px"}}>
                          {" "}
                          <span style={{width: "48px", height: "48px", borderRadius: "50%", background: m.c.bg, color: m.c.tx, display: "flex", alignItems: "center", justifyContent: "center", flex: "none"}}>
                            <svg width="20" height="20" viewBox="-1.333 -1.333 26.667 26.667" style={{flex: "none", fill: "currentColor"}}>
                              <use href={m.icon} x="0" y="0" width="24" height="24" />
                            </svg>
                          </span>
                          {" "}
                          <div style={{display: "flex", flexDirection: "column"}}>
                            <span style={{fontWeight: "500", color: "var(--muted)"}}>
                              {I(m.label)}
                            </span>
                            <span style={{fontSize: "24px", lineHeight: "32px", fontWeight: "600", fontVariantNumeric: "proportional-nums"}}>
                              {I(m.value)}
                            </span>
                          </div>
                          {" "}
                        </div>
                        {" "}
                      </React.Fragment>))}
                      {" "}
                    </div>
                    {" "}
                    <div style={{padding: "16px", borderRadius: "12px", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "12px"}}>
                      {" "}
                      <div style={{display: "flex", alignItems: "center", gap: "12px"}}>
                        {" "}
                        <span style={{fontSize: "16px", lineHeight: "24px", fontWeight: "600"}}>
                          {"Assessment Link"}
                        </span>
                        {" "}
                        <span style={{display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", lineHeight: "16px", fontWeight: "500", color: "var(--muted)"}}>
                          <svg width="16" height="16" viewBox="0 0 24 24" style={{flex: "none", fill: "currentColor"}}>
                            <use href="#i-lock" />
                          </svg>
                          {"Private Assessment"}
                        </span>
                        {" "}
                      </div>
                      {" "}
                      <div style={{display: "flex", gap: "8px"}}>
                        {" "}
                        <div style={{flex: "1", minWidth: "0", height: "40px", borderRadius: "8px", border: "1px solid var(--border)", padding: "0 12px", display: "flex", alignItems: "center", background: "var(--colors-background-bg-primary)"}}>
                          <span style={{whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>
                            {"https://app.topin.tech/customer/assessments/a1?referrer=Edit%20Assessment"}
                          </span>
                        </div>
                        {" "}
                        <button onClick={V.copyLink} style={{display: "inline-flex", alignItems: "center", gap: "8px", height: "40px", padding: "0 16px", borderRadius: "8px", border: `1px solid ${V.copyBtn.bd}`, background: V.copyBtn.bg, color: V.copyBtn.tx, fontSize: "14px", lineHeight: "20px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap", flex: "none"}}>
                          {" "}
                          <svg width="20" height="20" viewBox="-1.333 -1.333 26.667 26.667" style={{flex: "none", fill: "currentColor"}}>
                            <use href={V.copyBtn.icon} x="0" y="0" width="24" height="24" />
                          </svg>
                          {I(V.copyBtn.label)}{" "}
                        </button>
                        {" "}
                      </div>
                      {" "}
                      <div style={{marginTop: "4px", minHeight: "58px", padding: "8px 8px 8px 16px", borderRadius: "10px", background: "var(--subtle)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap"}}>
                        {" "}
                        <div style={{display: "flex", alignItems: "center", gap: "8px"}}>
                          {" "}
                          <svg width="16" height="16" viewBox="0 0 24 24" style={{flex: "none", fill: "currentColor", color: "var(--muted)"}}>
                            <use href="#i-shield" />
                          </svg>
                          {" "}
                          <span style={{color: "var(--muted)"}}>
                            {"SEB Exit PIN:"}
                          </span>
                          {" "}
                          <span style={{fontWeight: "600", letterSpacing: "0.08em"}}>
                            {"AAAAAA"}
                          </span>
                          {" "}
                        </div>
                        {" "}
                        <button style={{display: "inline-flex", alignItems: "center", gap: "8px", height: "40px", padding: "0 10px", borderRadius: "8px", border: "none", background: "transparent", color: "var(--colors-text-text-brand-secondary-700)", fontSize: "14px", lineHeight: "20px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap"}} className="hv27">
                          {"View Invigilator Page"}
                          <svg width="16" height="16" viewBox="0 0 24 24" style={{flex: "none", fill: "currentColor"}}>
                            <use href="#i-ext" />
                          </svg>
                        </button>
                        {" "}
                      </div>
                      {" "}
                    </div>
                    {" "}
                    <div style={{padding: "16px", borderRadius: "12px", border: "1px solid var(--border)"}}>
                      {" "}
                      <div style={{fontSize: "16px", lineHeight: "24px", fontWeight: "600", marginBottom: "12px"}}>
                        {"Basic Details"}
                      </div>
                      {" "}
                      <div style={{display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: "16px"}}>
                        {" "}
                        <div>
                          <div style={{color: "var(--muted)"}}>
                            {"Organisation"}
                          </div>
                          <div style={{marginTop: "4px", fontWeight: "500"}}>
                            {"College Dost"}
                          </div>
                        </div>
                        {" "}
                        <div>
                          <div style={{color: "var(--muted)"}}>
                            {"Created Date"}
                          </div>
                          <div style={{marginTop: "4px", fontWeight: "500"}}>
                            {"26 Oct 2026"}
                          </div>
                        </div>
                        {" "}
                        <div>
                          <div style={{color: "var(--muted)"}}>
                            {"Published Date"}
                          </div>
                          <div style={{marginTop: "4px", fontWeight: "500"}}>
                            {"28 Oct 2026"}
                          </div>
                        </div>
                        {" "}
                        <div>
                          <div style={{color: "var(--muted)"}}>
                            {"Start Date"}
                          </div>
                          <div style={{marginTop: "4px", fontWeight: "500"}}>
                            {"09 Nov 2026, 03:52 PM"}
                          </div>
                        </div>
                        {" "}
                        <div>
                          <div style={{color: "var(--muted)"}}>
                            {"End Date"}
                          </div>
                          <div style={{marginTop: "4px", fontWeight: "500"}}>
                            {"14 Nov 2026, 12:00 AM"}
                          </div>
                        </div>
                        {" "}
                      </div>
                      {" "}
                      <div style={{height: "1px", background: "var(--border)", margin: "20px 0"}} />
                      {" "}
                      <div style={{color: "var(--muted)"}}>
                        {"Tags"}
                      </div>
                      {" "}
                      <div style={{marginTop: "8px", display: "flex", flexWrap: "wrap", gap: "8px"}}>
                        {" "}
                        {(V.tags || []).map((g, g$i) => (<React.Fragment key={g$i}>
                          {" "}
                          <span style={{height: "24px", display: "inline-flex", alignItems: "center", padding: "0 10px", borderRadius: "999px", border: "1px solid var(--border)", background: "var(--subtle)", fontWeight: "500", whiteSpace: "nowrap"}}>
                            {I(g)}
                          </span>
                          {" "}
                        </React.Fragment>))}
                        {" "}
                      </div>
                      {" "}
                    </div>
                    {" "}
                  </>)}
                  {" "}
                  {V.tabSections && (<>
                    {" "}
                    <div style={{border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden"}}>
                      {" "}
                      <div style={{padding: "16px 20px", fontSize: "18px", lineHeight: "28px", fontWeight: "600"}}>
                        {"Sections"}
                      </div>
                      {" "}
                      <div style={{display: "grid", gridTemplateColumns: "2fr 1.4fr 1fr 1.2fr 1.8fr", height: "43px", background: "var(--subtle)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", fontSize: "12px", lineHeight: "18px", fontWeight: "500", color: "var(--muted)"}}>
                        {" "}
                        <div style={{padding: "12px 20px"}}>
                          {"Section"}
                        </div>
                        <div style={{padding: "12px 20px"}}>
                          {"Questions"}
                        </div>
                        <div style={{padding: "12px 20px"}}>
                          {"Marks"}
                        </div>
                        <div style={{padding: "12px 20px"}}>
                          {"Duration"}
                        </div>
                        <div style={{padding: "12px 20px"}}>
                          {"Question type"}
                        </div>
                        {" "}
                      </div>
                      {" "}
                      {(V.sections || []).map((x, x$i) => (<React.Fragment key={x$i}>
                        {" "}
                        <div style={{display: "grid", gridTemplateColumns: "2fr 1.4fr 1fr 1.2fr 1.8fr", height: "56px", alignItems: "center", borderTop: x.divider}}>
                          {" "}
                          <div style={{padding: "0 20px", fontWeight: "500"}}>
                            {I(x.name)}
                          </div>
                          <div style={{padding: "0 20px"}}>
                            {I(x.q)}
                          </div>
                          <div style={{padding: "0 20px"}}>
                            {I(x.m)}
                          </div>
                          <div style={{padding: "0 20px"}}>
                            {I(x.d)}
                          </div>
                          <div style={{padding: "0 20px"}}>
                            {I(x.t)}
                          </div>
                          {" "}
                        </div>
                        {" "}
                      </React.Fragment>))}
                      {" "}
                    </div>
                    {" "}
                  </>)}
                  {" "}
                  {V.tabAdvanced && (<>
                    {" "}
                    <div style={{display: "flex", gap: "48px", alignItems: "flex-start"}}>
                      {" "}
                      <div style={{width: "172px", flex: "none", display: "flex", flexDirection: "column", gap: "4px"}}>
                        {" "}
                        {(V.advNav || []).map((a, a$i) => (<React.Fragment key={a$i}>
                          {" "}
                          <button onClick={a.pick} style={{height: "36px", borderRadius: "8px", border: "none", padding: "0 10px", textAlign: "left", background: a.bg, fontSize: "14px", lineHeight: "20px", fontWeight: a.weight, color: a.color, cursor: "pointer"}} className="hv28">
                            {I(a.label)}
                          </button>
                          {" "}
                        </React.Fragment>))}
                        {" "}
                      </div>
                      {" "}
                      <div style={{flex: "1", minWidth: "0"}}>
                        {" "}
                        <div style={{display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", paddingBottom: "20px", borderBottom: "1px solid var(--border)"}}>
                          {" "}
                          <div>
                            <div style={{fontSize: "16px", lineHeight: "24px", fontWeight: "600"}}>
                              {"Proctoring"}
                            </div>
                            <div style={{color: "var(--muted)"}}>
                              {"Choose how the exam is accessed, secured, and monitored. Pick a template or customize each setting."}
                            </div>
                          </div>
                          {" "}
                          <button role="switch" aria-label="Proctoring" onClick={V.master.toggle} style={{position: "relative", width: "36px", height: "20px", borderRadius: "999px", border: "none", padding: "0", background: V.master.track, cursor: "pointer", flex: "none", transition: "background .15s"}}>
                            {" "}
                            <span style={{position: "absolute", top: "2px", left: V.master.knob, width: "16px", height: "16px", borderRadius: "50%", background: "var(--colors-background-bg-primary)", boxShadow: "0px 1px 3px 0px var(--colors-effects-shadows-shadow-sm-01), 0px 1px 2px -1px var(--colors-effects-shadows-shadow-sm-02)", transition: "left .15s", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand)"}}>
                              {V.master.on && (<>
                                <svg width="12" height="12" viewBox="0 0 24 24" style={{fill: "currentColor"}}>
                                  <use href="#i-check" />
                                </svg>
                              </>)}
                            </span>
                            {" "}
                          </button>
                          {" "}
                        </div>
                        {" "}
                        <div style={{display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: "16px", margin: "16px 0"}}>
                          {" "}
                          {(V.templates || []).map((p, p$i) => (<React.Fragment key={p$i}>
                            {" "}
                            <button onClick={p.pick} style={{textAlign: "left", padding: "16px 20px", borderRadius: "10px", border: `1px ${p.borderStyle} ${p.borderColor}`, background: p.bg, cursor: "pointer", display: "flex", flexDirection: "column"}} className="hv29">
                              {" "}
                              <span style={{fontSize: "16px", lineHeight: "24px", fontWeight: "600", color: "var(--ink)"}}>
                                {I(p.title)}
                              </span>
                              {" "}
                              <span style={{color: "var(--muted)"}}>
                                {I(p.desc)}
                              </span>
                              {" "}
                            </button>
                            {" "}
                          </React.Fragment>))}
                          {" "}
                        </div>
                        {" "}
                        {(V.settings || []).map((t, t$i) => (<React.Fragment key={t$i}>
                          {" "}
                          <div style={{padding: "16px 0", borderBottom: "1px solid var(--border)"}}>
                            {" "}
                            <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", minHeight: "20px"}}>
                              {" "}
                              <span style={{fontWeight: "500", color: t.labelColor}}>
                                {I(t.label)}
                              </span>
                              {" "}
                              <button role="switch" aria-label={t.label} onClick={t.toggle} disabled={t.disabled} style={{position: "relative", width: "36px", height: "20px", borderRadius: "999px", border: "none", padding: "0", background: t.track, cursor: "pointer", flex: "none", opacity: t.op, transition: "background .15s"}}>
                                {" "}
                                <span style={{position: "absolute", top: "2px", left: t.knob, width: "16px", height: "16px", borderRadius: "50%", background: "var(--colors-background-bg-primary)", boxShadow: "0px 1px 3px 0px var(--colors-effects-shadows-shadow-sm-01), 0px 1px 2px -1px var(--colors-effects-shadows-shadow-sm-02)", transition: "left .15s", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand)"}}>
                                  {t.on && (<>
                                    <svg width="12" height="12" viewBox="0 0 24 24" style={{fill: "currentColor"}}>
                                      <use href="#i-check" />
                                    </svg>
                                  </>)}
                                </span>
                                {" "}
                              </button>
                              {" "}
                            </div>
                            {" "}
                            {t.hasSubToggle && (<>
                              {" "}
                              <div style={{marginTop: "16px", paddingLeft: "16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px"}}>
                                {" "}
                                <span>
                                  {I(t.subLabel)}
                                </span>
                                {" "}
                                <button role="switch" aria-label={t.subLabel} onClick={t.subToggle} style={{position: "relative", width: "36px", height: "20px", borderRadius: "999px", border: "none", padding: "0", background: t.subTrack, cursor: "pointer", flex: "none", opacity: t.subOp, transition: "background .15s"}}>
                                  {" "}
                                  <span style={{position: "absolute", top: "2px", left: t.subKnob, width: "16px", height: "16px", borderRadius: "50%", background: "var(--colors-background-bg-primary)", boxShadow: "0px 1px 3px 0px var(--colors-effects-shadows-shadow-sm-01), 0px 1px 2px -1px var(--colors-effects-shadows-shadow-sm-02)", transition: "left .15s", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand)"}}>
                                    {t.subOn && (<>
                                      <svg width="12" height="12" viewBox="0 0 24 24" style={{fill: "currentColor"}}>
                                        <use href="#i-check" />
                                      </svg>
                                    </>)}
                                  </span>
                                  {" "}
                                </button>
                                {" "}
                              </div>
                              {" "}
                            </>)}
                            {" "}
                            {t.hasStepper && (<>
                              {" "}
                              <div style={{marginTop: "16px", paddingLeft: "16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px"}}>
                                {" "}
                                <span>
                                  {I(t.subLabel)}
                                </span>
                                {" "}
                                <div style={{display: "flex", height: "36px", border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden", background: "var(--colors-background-bg-primary)"}}>
                                  {" "}
                                  <span style={{width: "44px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "500"}}>
                                    {I(V.warnings)}
                                  </span>
                                  {" "}
                                  <div style={{display: "flex", flexDirection: "column", borderLeft: "1px solid var(--border)"}}>
                                    {" "}
                                    <button aria-label="Increase" onClick={V.warnUp} style={{flex: "1", width: "24px", border: "none", background: "var(--colors-background-bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--muted)", padding: "0"}} className="hv30">
                                      <svg width="12" height="12" viewBox="0 0 24 24" style={{fill: "currentColor"}}>
                                        <use href="#i-up" />
                                      </svg>
                                    </button>
                                    {" "}
                                    <button aria-label="Decrease" onClick={V.warnDown} style={{flex: "1", width: "24px", border: "none", borderTop: "1px solid var(--border)", background: "var(--colors-background-bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--muted)", padding: "0"}} className="hv31">
                                      <svg width="12" height="12" viewBox="0 0 24 24" style={{fill: "currentColor"}}>
                                        <use href="#i-down" />
                                      </svg>
                                    </button>
                                    {" "}
                                  </div>
                                  {" "}
                                </div>
                                {" "}
                              </div>
                              {" "}
                            </>)}
                            {" "}
                          </div>
                          {" "}
                        </React.Fragment>))}
                        {" "}
                      </div>
                      {" "}
                    </div>
                    {" "}
                  </>)}
                  {" "}
                </div>
              </div>
            </>)}
            {V.isStats && (<>
              <div data-screen-label="03 Statistics" style={{display: "flex", flexDirection: "column", gap: "16px"}}>
                {" "}
                <div>
                  {" "}
                  <button onClick={V.goBackFromStats} style={{height: "28px", display: "inline-flex", alignItems: "center", gap: "6px", border: "none", background: "transparent", padding: "0 4px 0 0", color: "var(--muted)", fontSize: "14px", lineHeight: "20px", fontWeight: "500", cursor: "pointer", borderRadius: "6px"}} className="hv32">
                    {" "}
                    <svg width="16" height="16" viewBox="0 0 24 24" style={{flex: "none", fill: "currentColor"}}>
                      <use href="#i-back" />
                    </svg>
                    {"Back "}
                  </button>
                  {" "}
                  <div style={{marginTop: "12px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap"}}>
                    {" "}
                    <div>
                      {" "}
                      <div style={{display: "flex", alignItems: "center", gap: "12px"}}>
                        {" "}
                        <h1 style={{margin: "0", fontSize: "24px", lineHeight: "32px", fontWeight: "600"}}>
                          {"Statistics"}
                        </h1>
                        {" "}
                        <span style={{display: "inline-flex", alignItems: "center", gap: "8px", height: "24px", padding: "1px 10px", borderRadius: "999px", border: `1px solid ${V.cur.b.bd}`, background: V.cur.b.bg, color: V.cur.b.tx, fontSize: "14px", lineHeight: "20px", fontWeight: "500", whiteSpace: "nowrap"}}>
                          <span style={{width: "6px", height: "6px", borderRadius: "50%", background: V.cur.b.dot}} />
                          {I(V.cur.status)}
                        </span>
                        {" "}
                      </div>
                      {" "}
                      <div style={{marginTop: "4px", display: "flex", alignItems: "center", gap: "8px"}}>
                        <span style={{color: "var(--muted)"}}>
                          {"Assessment:"}
                        </span>
                        <span style={{fontWeight: "500"}}>
                          {I(V.cur.name)}
                        </span>
                      </div>
                      {" "}
                    </div>
                    {" "}
                    <div style={{display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap"}}>
                      {" "}
                      <div style={{display: "flex", alignItems: "center", gap: "6px"}}>
                        {" "}
                        <span style={{color: "var(--muted)"}}>
                          {"Live stats until:"}
                        </span>
                        <span style={{fontWeight: "500"}}>
                          {"14 November, 12:00 AM"}
                        </span>
                        {" "}
                        <button aria-label="Candidates are still taking this assessment." data-tip="Candidates are still taking this assessment." style={{width: "24px", height: "24px", borderRadius: "6px", border: "none", background: "transparent", color: "var(--muted)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: "0"}} className="hv33">
                          {" "}
                          <svg width="16" height="16" viewBox="0 0 24 24" style={{flex: "none", fill: "currentColor"}}>
                            <use href="#i-info" />
                          </svg>
                          {" "}
                        </button>
                        {" "}
                      </div>
                      {" "}
                      <button onClick={V.download} style={{display: "inline-flex", alignItems: "center", gap: "8px", height: "40px", padding: "0 16px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--colors-background-bg-primary)", color: "var(--ink)", fontSize: "14px", lineHeight: "20px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap"}} className="hv34">
                        {" "}
                        <svg width="20" height="20" viewBox="-1.333 -1.333 26.667 26.667" style={{flex: "none", fill: "currentColor"}}>
                          <use href="#i-download" x="0" y="0" width="24" height="24" />
                        </svg>
                        {"Download Results "}
                      </button>
                      {" "}
                    </div>
                    {" "}
                  </div>
                  {" "}
                </div>
                {" "}
                <div style={{display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: "16px"}}>
                  {" "}
                  {(V.kpis || []).map((k, k$i) => (<React.Fragment key={k$i}>
                    {" "}
                    <div style={{padding: "16px", borderRadius: "12px", border: "1px solid var(--border)", background: "var(--colors-background-bg-primary)", display: "flex", alignItems: "center", gap: "12px", color: "var(--ink)"}}>
                      {" "}
                      <span style={{width: "44px", height: "44px", borderRadius: "50%", background: k.c.bg, color: k.c.tx, display: "flex", alignItems: "center", justifyContent: "center", flex: "none"}}>
                        <svg width="20" height="20" viewBox="-1.333 -1.333 26.667 26.667" style={{flex: "none", fill: "currentColor"}}>
                          <use href={k.icon} x="0" y="0" width="24" height="24" />
                        </svg>
                      </span>
                      {" "}
                      <span style={{display: "flex", flexDirection: "column"}}>
                        {" "}
                        <span style={{fontWeight: "500", color: "var(--muted)"}}>
                          {I(k.label)}
                        </span>
                        {" "}
                        <span style={{fontSize: "24px", lineHeight: "32px", fontWeight: "600", fontVariantNumeric: "proportional-nums"}}>
                          {I(k.value)}
                          {k.suffix && (<>
                            <span style={{fontSize: "14px", lineHeight: "20px", fontWeight: "500", color: "var(--muted)"}}>
                              {" "}{I(k.suffix)}
                            </span>
                          </>)}
                        </span>
                        {" "}
                      </span>
                      {" "}
                    </div>
                    {" "}
                  </React.Fragment>))}
                  {" "}
                </div>
                {" "}
                <div style={{border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden"}}>
                  {" "}
                  <div style={{padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap"}}>
                    {" "}
                    <div style={{display: "flex", alignItems: "center", gap: "8px"}}>
                      <span style={{fontSize: "18px", lineHeight: "28px", fontWeight: "600"}}>
                        {"Candidate Analysis"}
                      </span>
                      <span style={{fontSize: "12px", lineHeight: "18px", padding: "0 8px", borderRadius: "999px", border: "1px solid var(--border)", color: "var(--muted)", fontWeight: "500"}}>
                        {"150"}
                      </span>
                    </div>
                    {" "}
                    <div style={{display: "flex", gap: "12px"}}>
                      {" "}
                      <label style={{position: "relative", width: "240px", height: "40px", display: "block"}}>
                        {" "}
                        <span style={{position: "absolute", left: "12px", top: "10px", color: "var(--muted)", display: "flex"}}>
                          <svg width="20" height="20" viewBox="-1.333 -1.333 26.667 26.667" style={{flex: "none", fill: "currentColor"}}>
                            <use href="#i-search" x="0" y="0" width="24" height="24" />
                          </svg>
                        </span>
                        {" "}
                        <input placeholder="Search by name, phone or email" value={V.candSearch} onChange={V.onCandSearch} style={{width: "100%", height: "40px", borderRadius: "8px", border: "1px solid var(--border)", padding: "0 12px 0 40px", fontSize: "14px", lineHeight: "20px", outline: "none", background: "var(--colors-background-bg-primary)"}} />
                        {" "}
                      </label>
                      {" "}
                      <div data-menu="cand" style={{position: "relative"}}>
                        {" "}
                        <button onClick={V.toggleCandMenu} style={{width: "150px", height: "40px", borderRadius: "10px", border: "none", background: "var(--colors-background-bg-primary)", boxShadow: "inset 0 0 0 1px var(--border), 0px 1px 2px 0px var(--colors-effects-shadows-shadow-xs)", padding: "0 12px 0 14px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", fontSize: "14px", lineHeight: "20px", fontWeight: "500", cursor: "pointer", color: "var(--ink)"}} className="hv35">
                          {" "}
                          <span>
                            {I(V.candLabel)}
                          </span>
                          {" "}
                          <svg width="16" height="16" viewBox="0 0 24 24" style={{flex: "none", fill: "currentColor", color: "var(--muted)"}}>
                            <use href="#i-down" />
                          </svg>
                          {" "}
                        </button>
                        {" "}
                        {V.candMenuOpen && (<>
                          {" "}
                          <div style={{position: "absolute", top: "calc(100% + 6px)", right: "0", width: "200px", background: "var(--colors-background-bg-primary)", border: "1px solid var(--border)", borderRadius: "10px", padding: "4px 0", boxShadow: "0px 12px 16px -4px var(--colors-effects-shadows-shadow-lg-01), 0px 4px 6px -2px var(--colors-effects-shadows-shadow-lg-02), 0px 2px 2px -1px var(--colors-effects-shadows-shadow-lg-03)", zIndex: "40", animation: "fin .12s ease"}}>
                            {" "}
                            {(V.candOptions || []).map((o, o$i) => (<React.Fragment key={o$i}>
                              {" "}
                              <button onClick={o.pick} style={{width: "calc(100% - 8px)", margin: "0 4px", height: "40px", borderRadius: "8px", border: "none", background: o.bg, padding: "8px 10px 8px 8px", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", lineHeight: "20px", fontWeight: "500", color: "var(--ink)", cursor: "pointer", textAlign: "left"}} className="hv36">
                                {" "}
                                <span style={{flex: "1"}}>
                                  {I(o.label)}
                                </span>
                                {" "}
                                <span style={{width: "16px", display: "flex", color: "var(--brand)"}}>
                                  {o.selected && (<>
                                    <svg width="16" height="16" viewBox="0 0 24 24" style={{flex: "none", fill: "currentColor"}}>
                                      <use href="#i-check" />
                                    </svg>
                                  </>)}
                                </span>
                                {" "}
                              </button>
                              {" "}
                            </React.Fragment>))}
                            {" "}
                          </div>
                          {" "}
                        </>)}
                        {" "}
                      </div>
                      {" "}
                    </div>
                    {" "}
                  </div>
                  {" "}
                  <div style={{display: "grid", gridTemplateColumns: "2fr 1.3fr 1.2fr 1.1fr 96px", height: "43px", background: "var(--subtle)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", fontSize: "12px", lineHeight: "18px", fontWeight: "500", color: "var(--muted)"}}>
                    {" "}
                    <div style={{padding: "12px 20px"}}>
                      {"Candidate"}
                    </div>
                    <div style={{padding: "12px 20px"}}>
                      {"Invited On"}
                    </div>
                    <div style={{padding: "12px 20px"}}>
                      {"Score"}
                    </div>
                    <div style={{padding: "12px 20px"}}>
                      {"Status"}
                    </div>
                    <div style={{padding: "12px 20px", textAlign: "center"}}>
                      {"Actions"}
                    </div>
                    {" "}
                  </div>
                  {" "}
                  {(V.candidates || []).map((c, c$i) => (<React.Fragment key={c$i}>
                    {" "}
                    <div style={{display: "grid", gridTemplateColumns: "2fr 1.3fr 1.2fr 1.1fr 96px", height: "64px", alignItems: "center", borderTop: c.divider}} className="hv37">
                      {" "}
                      <div style={{padding: "0 20px", display: "flex", alignItems: "center", gap: "12px", minWidth: "0"}}>
                        {" "}
                        <span style={{width: "36px", height: "36px", borderRadius: "50%", background: "var(--subtle)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", lineHeight: "16px", fontWeight: "600", color: "var(--muted)", flex: "none"}}>
                          {I(c.initials)}
                        </span>
                        {" "}
                        <span style={{display: "flex", flexDirection: "column", minWidth: "0"}}>
                          <span style={{fontWeight: "500"}}>
                            {I(c.name)}
                          </span>
                          <span style={{color: "var(--muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>
                            {I(c.email)}
                          </span>
                        </span>
                        {" "}
                      </div>
                      {" "}
                      <div style={{padding: "0 20px", whiteSpace: "nowrap"}}>
                        {I(c.invited)}
                      </div>
                      {" "}
                      <div style={{padding: "0 20px", display: "flex", alignItems: "center", gap: "10px"}}>
                        {" "}
                        {c.hasScore && (<>
                          {" "}
                          <span style={{width: "72px", height: "6px", borderRadius: "999px", background: "var(--hover)", overflow: "hidden", flex: "none"}}>
                            <span style={{display: "block", height: "100%", width: c.barW, background: "var(--accent)", borderRadius: "999px"}} />
                          </span>
                          {" "}
                        </>)}
                        {" "}
                        <span style={{color: c.scoreColor}}>
                          {I(c.scoreText)}
                        </span>
                        {" "}
                      </div>
                      {" "}
                      <div style={{padding: "0 20px", display: "flex"}}>
                        {" "}
                        <span style={{display: "inline-flex", alignItems: "center", gap: "8px", height: "24px", padding: "1px 10px", borderRadius: "999px", border: `1px solid ${c.b.bd}`, background: c.b.bg, color: c.b.tx, fontSize: "14px", lineHeight: "20px", fontWeight: "500", whiteSpace: "nowrap"}}>
                          <span style={{width: "6px", height: "6px", borderRadius: "50%", background: c.b.dot, flex: "none"}} />
                          {I(c.status)}
                        </span>
                        {" "}
                      </div>
                      {" "}
                      <div style={{padding: "0 20px", display: "flex", justifyContent: "center"}}>
                        {" "}
                        <button aria-label="View candidate details" data-tip="View candidate details" style={{width: "36px", height: "36px", borderRadius: "8px", border: "none", background: "transparent", color: "var(--muted)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"}} className="hv38">
                          <svg width="20" height="20" viewBox="-1.333 -1.333 26.667 26.667" style={{flex: "none", fill: "currentColor"}}>
                            <use href="#i-right" x="0" y="0" width="24" height="24" />
                          </svg>
                        </button>
                        {" "}
                      </div>
                      {" "}
                    </div>
                    {" "}
                  </React.Fragment>))}
                  {" "}
                  {V.noCandidates && (<>
                    <div style={{height: "128px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)"}}>
                      {"No candidates with this status on this page."}
                    </div>
                  </>)}
                  {" "}
                  <div style={{minHeight: "65px", padding: "12px 20px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px"}}>
                    {" "}
                    <button onClick={V.candPrev} style={{display: "inline-flex", alignItems: "center", gap: "8px", height: "40px", padding: "0 16px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--colors-background-bg-primary)", color: "var(--ink)", fontSize: "14px", lineHeight: "20px", fontWeight: "600", cursor: "pointer"}} className="hv39">
                      <svg width="20" height="20" viewBox="-1.333 -1.333 26.667 26.667" style={{flex: "none", fill: "currentColor"}}>
                        <use href="#i-left" x="0" y="0" width="24" height="24" />
                      </svg>
                      {"Previous"}
                    </button>
                    {" "}
                    <div style={{display: "flex", gap: "2px"}}>
                      {" "}
                      {(V.candPages || []).map((p, p$i) => (<React.Fragment key={p$i}>
                        {" "}
                        <button onClick={p.go} disabled={p.gap} style={{width: "40px", height: "40px", borderRadius: "8px", border: "none", background: p.bg, fontSize: "14px", lineHeight: "20px", fontWeight: p.weight, color: p.color, cursor: "pointer"}} className="hv40">
                          {I(p.label)}
                        </button>
                        {" "}
                      </React.Fragment>))}
                      {" "}
                    </div>
                    {" "}
                    <button onClick={V.candNext} style={{display: "inline-flex", alignItems: "center", gap: "8px", height: "40px", padding: "0 16px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--colors-background-bg-primary)", color: "var(--ink)", fontSize: "14px", lineHeight: "20px", fontWeight: "600", cursor: "pointer"}} className="hv41">
                      {"Next"}
                      <svg width="20" height="20" viewBox="-1.333 -1.333 26.667 26.667" style={{flex: "none", fill: "currentColor"}}>
                        <use href="#i-right" x="0" y="0" width="24" height="24" />
                      </svg>
                    </button>
                    {" "}
                  </div>
                  {" "}
                </div>
              </div>
            </>)}
          </div>
        </main>
      </div>
      {V.drawer && (<>
        {" "}
        <div onClick={V.closeDrawer} style={{position: "fixed", inset: "0", background: "color-mix(in srgb, var(--colors-background-bg-overlay) 50%, transparent)", zIndex: "80", animation: "fin .15s ease"}} />
        {" "}
        <div role="dialog" aria-label="Invite Candidates" data-screen-label="04 Invite Candidates" style={{position: "fixed", top: "16px", right: "16px", bottom: "16px", width: "760px", maxWidth: "calc(100% - 32px)", background: "var(--colors-background-bg-primary)", border: "1px solid var(--border)", borderRadius: "16px", overflow: "hidden", zIndex: "81", display: "flex", flexDirection: "column", animation: "din .2s ease"}}>
          {" "}
          <div style={{padding: "20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "12px"}}>
            {" "}
            <span style={{width: "40px", height: "40px", borderRadius: "50%", background: "var(--tint)", color: "var(--tint-ink)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none"}}>
              <svg width="20" height="20" viewBox="-1.333 -1.333 26.667 26.667" style={{flex: "none", fill: "currentColor"}}>
                <use href="#i-user-plus" x="0" y="0" width="24" height="24" />
              </svg>
            </span>
            {" "}
            <div style={{flex: "1", minWidth: "0"}}>
              <div style={{fontSize: "18px", lineHeight: "28px", fontWeight: "600"}}>
                {"Invite Candidates"}
              </div>
              <div style={{color: "var(--muted)"}}>
                {I(V.cur.name)}
              </div>
            </div>
            {" "}
            <button aria-label="Close" data-tip="Close" data-tip-side="bottom" onClick={V.closeDrawer} style={{width: "40px", height: "40px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--colors-background-bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"}} className="hv42">
              <svg width="20" height="20" viewBox="-1.333 -1.333 26.667 26.667" style={{flex: "none", fill: "currentColor"}}>
                <use href="#i-x" x="0" y="0" width="24" height="24" />
              </svg>
            </button>
            {" "}
          </div>
          {" "}
          <div style={{flex: "1", overflow: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "16px"}}>
            {" "}
            <div style={{display: "inline-flex", alignSelf: "flex-start", border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden"}}>
              {" "}
              <button onClick={V.setSingle} style={{height: "40px", padding: "0 16px", border: "none", background: V.singleBg, fontSize: "14px", lineHeight: "20px", fontWeight: "600", cursor: "pointer", color: "var(--ink)"}}>
                {"Single Invite"}
              </button>
              {" "}
              <button onClick={V.setBulk} style={{height: "40px", padding: "0 16px", border: "none", borderLeft: "1px solid var(--border)", background: V.bulkBg, fontSize: "14px", lineHeight: "20px", fontWeight: "600", cursor: "pointer", color: "var(--ink)"}}>
                {"Bulk Invite"}
              </button>
              {" "}
            </div>
            {" "}
            {V.isSingle && (<>
              {" "}
              <div style={{display: "flex", flexDirection: "column", gap: "6px"}}>
                {" "}
                <span style={{fontWeight: "500"}}>
                  {"Invite by"}
                </span>
                {" "}
                <div data-menu="inv" style={{position: "relative", width: "220px", alignSelf: "flex-start"}}>
                  {" "}
                  <button onClick={V.toggle_inv} aria-haspopup="listbox" style={{width: "220px", height: V.invH, borderRadius: "10px", border: "none", background: "var(--colors-background-bg-primary)", boxShadow: "inset 0 0 0 1px var(--border), 0px 1px 2px 0px var(--colors-effects-shadows-shadow-xs)", padding: "0 12px 0 14px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", fontSize: "14px", lineHeight: "20px", fontWeight: "500", cursor: "pointer", color: "var(--ink)"}} className="hv43">
                    <span>
                      {I(V.label_inv)}
                    </span>
                    <svg width="16" height="16" viewBox="0 0 24 24" style={{flex: "none", fill: "currentColor", color: "var(--muted)"}}>
                      <use href="#i-down" />
                    </svg>
                  </button>
                  {" "}
                  {V.open_inv && (<>
                    {" "}
                    <div role="listbox" style={{position: "absolute", top: "calc(100% + 6px)", left: "0", width: "100%", minWidth: "max-content", background: "var(--colors-background-bg-primary)", border: "1px solid var(--border)", borderRadius: "10px", padding: "4px 0", boxShadow: "0px 12px 16px -4px var(--colors-effects-shadows-shadow-lg-01), 0px 4px 6px -2px var(--colors-effects-shadows-shadow-lg-02), 0px 2px 2px -1px var(--colors-effects-shadows-shadow-lg-03)", zIndex: "90", animation: "fin .12s ease"}}>
                      {" "}
                      {(V.opts_inv || []).map((o, o$i) => (<React.Fragment key={o$i}>
                        {" "}
                        <button role="option" onClick={o.pick} style={{width: "calc(100% - 8px)", margin: "0 4px", height: "40px", borderRadius: "8px", border: "none", background: o.bg, padding: "8px 10px 8px 8px", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", lineHeight: "20px", fontWeight: "500", color: "var(--ink)", cursor: "pointer", textAlign: "left", whiteSpace: "nowrap"}} className="hv44">
                          <span style={{flex: "1"}}>
                            {I(o.label)}
                          </span>
                          <span style={{width: "16px", display: "flex", color: "var(--brand)"}}>
                            {o.selected && (<>
                              <svg width="16" height="16" viewBox="0 0 24 24" style={{flex: "none", fill: "currentColor"}}>
                                <use href="#i-check" />
                              </svg>
                            </>)}
                          </span>
                        </button>
                        {" "}
                      </React.Fragment>))}
                      {" "}
                    </div>
                    {" "}
                  </>)}
                  {" "}
                </div>
                {" "}
              </div>
              {" "}
              <div style={{display: "flex", flexDirection: "column", gap: "6px"}}>
                {" "}
                <div style={{display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr)) 40px", gap: "12px", fontWeight: "500"}}>
                  <span>
                    {"Name"}
                  </span>
                  <span>
                    {"Phone Number"}
                  </span>
                  <span>
                    {"Email Id"}
                  </span>
                  <span />
                </div>
                {" "}
                <div style={{display: "flex", flexDirection: "column", gap: "12px"}}>
                  {" "}
                  {(V.inviteRows || []).map((v, v$i) => (<React.Fragment key={v$i}>
                    {" "}
                    <div style={{display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr)) 40px", gap: "12px", alignItems: "center"}}>
                      {" "}
                      <input aria-label="Name" placeholder="Enter name" value={v.name} onChange={v.onname} style={{height: "40px", borderRadius: "8px", border: "1px solid var(--border)", padding: "0 12px", fontSize: "14px", lineHeight: "20px", minWidth: "0", width: "100%"}} />
                      {" "}
                      <input aria-label="Phone Number" placeholder="Enter phone number" value={v.phone} onChange={v.onphone} style={{height: "40px", borderRadius: "8px", border: "1px solid var(--border)", padding: "0 12px", fontSize: "14px", lineHeight: "20px", minWidth: "0", width: "100%"}} />
                      {" "}
                      <input aria-label="Email Id" placeholder="Enter email" value={v.email} onChange={v.onemail} style={{height: "40px", borderRadius: "8px", border: "1px solid var(--border)", padding: "0 12px", fontSize: "14px", lineHeight: "20px", minWidth: "0", width: "100%"}} />
                      {" "}
                      {v.removable && (<>
                        {" "}
                        <button aria-label="Remove row" data-tip="Remove row" onClick={v.remove} style={{width: "40px", height: "40px", borderRadius: "8px", border: "none", background: "transparent", color: "var(--muted)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: "0"}} className="hv45">
                          <svg width="20" height="20" viewBox="-1.333 -1.333 26.667 26.667" style={{flex: "none", fill: "currentColor"}}>
                            <use href="#i-x" x="0" y="0" width="24" height="24" />
                          </svg>
                        </button>
                        {" "}
                      </>)}
                      {" "}
                    </div>
                    {" "}
                  </React.Fragment>))}
                  {" "}
                </div>
                {" "}
              </div>
              {" "}
              <button onClick={V.addInviteRow} style={{alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: "6px", padding: "0", border: "none", borderRadius: "4px", background: "transparent", color: "var(--colors-text-text-brand-secondary-700)", fontSize: "14px", lineHeight: "20px", fontWeight: "600", cursor: "pointer"}} className="hv46">
                <svg width="16" height="16" viewBox="0 0 24 24" style={{flex: "none", fill: "currentColor"}}>
                  <use href="#i-plus" />
                </svg>
                {"Add More"}
              </button>
              {" "}
            </>)}
            {" "}
            {V.isBulk && (<>
              {" "}
              <div style={{border: "1px dashed var(--border)", borderRadius: "12px", padding: "32px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", textAlign: "center", background: "var(--subtle)"}}>
                {" "}
                <span style={{width: "44px", height: "44px", borderRadius: "50%", background: "var(--colors-background-bg-primary)", border: "1px solid var(--border)", color: "var(--muted)", display: "flex", alignItems: "center", justifyContent: "center"}}>
                  <svg width="20" height="20" viewBox="-1.333 -1.333 26.667 26.667" style={{flex: "none", fill: "currentColor"}}>
                    <use href="#i-upload" x="0" y="0" width="24" height="24" />
                  </svg>
                </span>
                {" "}
                <div>
                  <div style={{fontWeight: "600"}}>
                    {"Upload a CSV file"}
                  </div>
                  <div style={{color: "var(--muted)"}}>
                    {"Columns: name, phone number, email id"}
                  </div>
                </div>
                {" "}
                <button style={{display: "inline-flex", alignItems: "center", gap: "8px", height: "40px", padding: "0 16px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--colors-background-bg-primary)", color: "var(--ink)", fontSize: "14px", lineHeight: "20px", fontWeight: "600", cursor: "pointer"}} className="hv47">
                  {"Choose File"}
                </button>
                {" "}
              </div>
              {" "}
            </>)}
            {" "}
          </div>
          {" "}
          <div style={{padding: "16px 20px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end", gap: "12px"}}>
            {" "}
            <button onClick={V.closeDrawer} style={{height: "40px", padding: "0 16px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--colors-background-bg-primary)", color: "var(--ink)", fontSize: "14px", lineHeight: "20px", fontWeight: "600", cursor: "pointer"}} className="hv48">
              {"Cancel"}
            </button>
            {" "}
            <button onClick={V.sendInvite} style={{height: "40px", padding: "0 16px", borderRadius: "8px", border: "1px solid var(--brand)", background: "var(--brand)", color: "var(--colors-text-text-primary-on-brand)", fontSize: "14px", lineHeight: "20px", fontWeight: "600", cursor: "pointer"}} className="hv49">
              {"Send Invite"}
            </button>
            {" "}
          </div>
          {" "}
        </div>
      </>)}
      {V.gtip && (<>
        {" "}
        <div role="tooltip" style={{position: "fixed", left: V.gtip.left, top: V.gtip.top, transform: V.gtip.transform, background: "var(--tip)", color: "var(--colors-text-text-white)", boxShadow: "0px 12px 16px -4px var(--colors-effects-shadows-shadow-lg-01), 0px 4px 6px -2px var(--colors-effects-shadows-shadow-lg-02), 0px 2px 2px -1px var(--colors-effects-shadows-shadow-lg-03)", fontSize: "12px", lineHeight: "18px", fontWeight: "600", padding: "8px 12px", borderRadius: "8px", whiteSpace: "nowrap", pointerEvents: "none", zIndex: "120"}}>
          {I(V.gtip.text)}
          <span style={{position: "absolute", left: V.gtip.al, top: V.gtip.at, bottom: V.gtip.ab, marginLeft: V.gtip.ml, marginTop: V.gtip.mt, width: "8px", height: "8px", background: "var(--tip)", transform: "rotate(45deg)"}} />
        </div>
      </>)}
      {V.toast && (<>
        {" "}
        <div role="status" style={{position: "fixed", left: "50%", bottom: "24px", transform: "translateX(-50%)", background: "var(--tip)", color: "var(--colors-text-text-white)", boxShadow: "0px 12px 16px -4px var(--colors-effects-shadows-shadow-lg-01), 0px 4px 6px -2px var(--colors-effects-shadows-shadow-lg-02), 0px 2px 2px -1px var(--colors-effects-shadows-shadow-lg-03)", fontSize: "14px", lineHeight: "20px", fontWeight: "600", padding: "10px 16px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px", zIndex: "100", animation: "tin .2s ease", whiteSpace: "nowrap"}}>
          {" "}
          <svg width="16" height="16" viewBox="0 0 24 24" style={{flex: "none", fill: "currentColor"}}>
            <use href="#i-check" />
          </svg>
          {I(V.toast)}{" "}
        </div>
      </>)}
    </>
  );
};

Component.defaultProps = { theme: 'Orange + Graphite', startScreen: 'list', sidebarCollapsed: false };

export default Component;
