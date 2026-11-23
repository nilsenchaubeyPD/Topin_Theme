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
      this.setState({gtip:{text:el.getAttribute('data-tip'), side:el.getAttribute('data-tip-side') || 'top', l:r.left, t:r.top, b:r.bottom, ri:r.right, cx:r.left + r.width / 2, cy:r.top + r.height / 2}});
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
    const themeSwitch = [['Orange + Graphite','#F97316'],['Indigo','#6366F1'],['Forest','#10B981']].map(([name,dot]) => { const on = (s.themeSel || 'Orange + Graphite') === name; return {name, dot, bg: on ? '#FFFFFF' : 'transparent', fg: on ? '#18181B' : '#FFFFFF', pick: () => set({themeSel:name})}; });
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

    const tabs = [['basic','Basic Details'],['sections','Sections Details',4],['advanced','Advanced Options']].map(([k, label, count]) => ({label, count, color: s.tab === k ? 'var(--ink)' : 'var(--muted)', line: s.tab === k ? 'var(--accent)' : 'transparent', pick: () => set({tab:k})}));

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
      ? {text:g.text, left:Math.min(g.cx, window.innerWidth - 60) + 'px', top:(g.b + 8) + 'px', transform:'translateX(-50%)', al:'50%', at:'-4px', ab:'auto', ml:'-4px', mt:'0px'}
      : {text:g.text, left:g.cx + 'px', top:(g.t - 8) + 'px', transform:'translate(-50%,-100%)', al:'50%', at:'auto', ab:'-4px', ml:'-4px', mt:'0px'};
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
        <symbol id="i-home" viewBox="0 0 24 24">
          <path d="M 8.018 0.497 L 7.404 -0.292 L 8.018 0.497 Z M 8.739 0.035 L 8.477 -0.93 L 8.739 0.035 Z M 9.982 0.497 L 10.596 -0.292 L 10.596 -0.292 L 9.982 0.497 Z M 9.261 0.035 L 9.523 -0.93 L 9.261 0.035 Z M 1.092 18.515 L 1.546 17.624 L 1.092 18.515 Z M 0.218 17.641 L 1.109 17.187 L 0.218 17.641 Z M 17.782 17.641 L 16.891 17.187 L 17.782 17.641 Z M 16.908 18.515 L 16.454 17.624 L 16.908 18.515 Z M 17.926 7.172 L 16.963 7.442 L 17.926 7.172 Z M 16.765 5.772 L 16.151 6.562 L 16.151 6.562 L 16.765 5.772 Z M 17.608 6.522 L 16.804 7.117 L 16.804 7.117 L 17.608 6.522 Z M 0.074 7.172 L 1.037 7.442 L 0.074 7.172 Z M 1.235 5.772 L 0.621 4.983 L 1.235 5.772 Z M 0.392 6.522 L 1.196 7.117 L 1.196 7.117 L 0.392 6.522 Z M 17 8.298 L 17 15.533 L 19 15.533 L 19 8.298 L 17 8.298 Z M 14.8 17.733 L 3.2 17.733 L 3.2 19.733 L 14.8 19.733 L 14.8 17.733 Z M 1 15.533 L 1 8.298 L -1 8.298 L -1 15.533 L 1 15.533 Z M 1.849 6.562 L 8.632 1.287 L 7.404 -0.292 L 0.621 4.983 L 1.849 6.562 Z M 9.368 1.287 L 16.151 6.562 L 17.379 4.983 L 10.596 -0.292 L 9.368 1.287 Z M 8.632 1.287 C 8.819 1.141 8.918 1.065 8.993 1.015 C 9.057 0.971 9.048 0.987 9 1 L 8.477 -0.93 C 8.042 -0.813 7.682 -0.509 7.404 -0.292 L 8.632 1.287 Z M 10.596 -0.292 C 10.318 -0.509 9.958 -0.813 9.523 -0.93 L 9 1 C 8.952 0.987 8.943 0.971 9.007 1.015 C 9.082 1.065 9.181 1.141 9.368 1.287 L 10.596 -0.292 Z M 9 1 L 9 1 L 9.523 -0.93 C 9.18 -1.023 8.82 -1.023 8.477 -0.93 L 9 1 Z M 3.2 17.733 C 2.623 17.733 2.251 17.732 1.968 17.709 C 1.696 17.687 1.595 17.649 1.546 17.624 L 0.638 19.406 C 1.016 19.599 1.41 19.67 1.805 19.703 C 2.189 19.734 2.656 19.733 3.2 19.733 L 3.2 17.733 Z M -1 15.533 C -1 16.077 -1.001 16.544 -0.969 16.928 C -0.937 17.324 -0.866 17.717 -0.673 18.095 L 1.109 17.187 C 1.084 17.138 1.046 17.037 1.024 16.765 C 1.001 16.482 1 16.11 1 15.533 L -1 15.533 Z M 1.546 17.624 C 1.358 17.528 1.205 17.375 1.109 17.187 L -0.673 18.095 C -0.385 18.66 0.074 19.119 0.638 19.406 L 1.546 17.624 Z M 17 15.533 C 17 16.11 16.999 16.482 16.976 16.765 C 16.954 17.037 16.916 17.138 16.891 17.187 L 18.673 18.095 C 18.866 17.717 18.937 17.324 18.969 16.928 C 19.001 16.544 19 16.077 19 15.533 L 17 15.533 Z M 14.8 19.733 C 15.344 19.733 15.811 19.734 16.195 19.703 C 16.59 19.67 16.984 19.599 17.362 19.406 L 16.454 17.624 C 16.405 17.649 16.304 17.687 16.032 17.709 C 15.749 17.732 15.377 17.733 14.8 17.733 L 14.8 19.733 Z M 16.891 17.187 C 16.795 17.375 16.642 17.528 16.454 17.624 L 17.362 19.406 C 17.926 19.119 18.385 18.66 18.673 18.095 L 16.891 17.187 Z M 19 8.298 C 19 7.78 19.009 7.33 18.889 6.903 L 16.963 7.442 C 16.991 7.543 17 7.667 17 8.298 L 19 8.298 Z M 16.151 6.562 C 16.649 6.949 16.741 7.032 16.804 7.117 L 18.412 5.927 C 18.148 5.57 17.787 5.301 17.379 4.983 L 16.151 6.562 Z M 18.889 6.903 C 18.791 6.551 18.629 6.221 18.412 5.927 L 16.804 7.117 C 16.876 7.214 16.93 7.325 16.963 7.442 L 18.889 6.903 Z M 1 8.298 C 1 7.667 1.009 7.543 1.037 7.442 L -0.889 6.903 C -1.009 7.33 -1 7.78 -1 8.298 L 1 8.298 Z M 0.621 4.983 C 0.213 5.301 -0.148 5.57 -0.412 5.927 L 1.196 7.117 C 1.259 7.032 1.351 6.949 1.849 6.562 L 0.621 4.983 Z M 1.037 7.442 C 1.07 7.325 1.124 7.214 1.196 7.117 L -0.412 5.927 C -0.629 6.221 -0.791 6.551 -0.889 6.903 L 1.037 7.442 Z" fill="currentColor" fillRule="nonzero" transform="matrix(1 0 0 1 3 2.267)" />
        </symbol>
        <symbol id="i-dash" viewBox="0 0 24 24">
          <path d="M 0.546 6.891 L 1 6 L 1 6 L 0.546 6.891 Z M 0.109 6.454 L 1 6 L 1 6 L 0.109 6.454 Z M 6.891 6.454 L 6 6 L 6 6 L 6.891 6.454 Z M 6.454 6.891 L 6 6 L 6 6 L 6.454 6.891 Z M 6.454 0.109 L 6 1 L 6 1 L 6.454 0.109 Z M 6.891 0.546 L 6 1 L 6 1 L 6.891 0.546 Z M 0.546 0.109 L 0.092 -0.782 L 0.092 -0.782 L 0.546 0.109 Z M 0.109 0.546 L -0.782 0.092 L -0.782 0.092 L 0.109 0.546 Z M 11.546 6.891 L 12 6 L 12 6 L 11.546 6.891 Z M 11.109 6.454 L 12 6 L 12 6 L 11.109 6.454 Z M 17.891 6.454 L 17 6 L 17 6 L 17.891 6.454 Z M 17.454 6.891 L 17 6 L 17 6 L 17.454 6.891 Z M 17.454 0.109 L 17 1 L 17 1 L 17.454 0.109 Z M 17.891 0.546 L 17 1 L 17 1 L 17.891 0.546 Z M 11.546 0.109 L 11.092 -0.782 L 11.092 -0.782 L 11.546 0.109 Z M 11.109 0.546 L 10.218 0.092 L 10.218 0.092 L 11.109 0.546 Z M 11.546 17.891 L 12 17 L 12 17 L 11.546 17.891 Z M 11.109 17.454 L 12 17 L 12 17 L 11.109 17.454 Z M 17.891 17.454 L 17 17 L 17 17 L 17.891 17.454 Z M 17.454 17.891 L 17 17 L 17 17 L 17.454 17.891 Z M 17.454 11.109 L 17 12 L 17 12 L 17.454 11.109 Z M 17.891 11.546 L 17 12 L 17 12 L 17.891 11.546 Z M 11.546 11.109 L 11.092 10.218 L 11.092 10.218 L 11.546 11.109 Z M 11.109 11.546 L 10.218 11.092 L 10.218 11.092 L 11.109 11.546 Z M 0.546 17.891 L 1 17 L 1 17 L 0.546 17.891 Z M 0.109 17.454 L 1 17 L 1 17 L 0.109 17.454 Z M 6.891 17.454 L 6 17 L 6 17 L 6.891 17.454 Z M 6.454 17.891 L 6 17 L 6 17 L 6.454 17.891 Z M 6.454 11.109 L 6 12 L 6 12 L 6.454 11.109 Z M 6.891 11.546 L 6 12 L 6 12 L 6.891 11.546 Z M 0.546 11.109 L 0.092 10.218 L 0.092 10.218 L 0.546 11.109 Z M 0.109 11.546 L -0.782 11.092 L -0.782 11.092 L 0.109 11.546 Z M 1.6 1 L 5.4 1 L 5.4 -1 L 1.6 -1 L 1.6 1 Z M 6 1.6 L 6 5.4 L 8 5.4 L 8 1.6 L 6 1.6 Z M 5.4 6 L 1.6 6 L 1.6 8 L 5.4 8 L 5.4 6 Z M 1 5.4 L 1 1.6 L -1 1.6 L -1 5.4 L 1 5.4 Z M 1.6 6 C 1.303 6 1.141 5.999 1.025 5.99 C 0.92 5.981 0.942 5.971 1 6 L 0.092 7.782 C 0.363 7.92 0.633 7.964 0.862 7.983 C 1.079 8.001 1.336 8 1.6 8 L 1.6 6 Z M -1 5.4 C -1 5.664 -1.001 5.921 -0.983 6.138 C -0.964 6.367 -0.92 6.637 -0.782 6.908 L 1 6 C 1.029 6.058 1.019 6.08 1.01 5.975 C 1.001 5.859 1 5.697 1 5.4 L -1 5.4 Z M 1 6 L 1 6 L -0.782 6.908 C -0.59 7.284 -0.284 7.59 0.092 7.782 L 1 6 Z M 6 5.4 C 6 5.697 5.999 5.859 5.99 5.975 C 5.981 6.08 5.971 6.058 6 6 L 7.782 6.908 C 7.92 6.637 7.964 6.367 7.983 6.138 C 8.001 5.921 8 5.664 8 5.4 L 6 5.4 Z M 5.4 8 C 5.664 8 5.921 8.001 6.138 7.983 C 6.367 7.964 6.637 7.92 6.908 7.782 L 6 6 C 6.058 5.971 6.08 5.981 5.975 5.99 C 5.859 5.999 5.697 6 5.4 6 L 5.4 8 Z M 6 6 L 6 6 L 6.908 7.782 C 7.284 7.59 7.59 7.284 7.782 6.908 L 6 6 Z M 5.4 1 C 5.697 1 5.859 1.001 5.975 1.01 C 6.08 1.019 6.058 1.029 6 1 L 6.908 -0.782 C 6.637 -0.92 6.367 -0.964 6.138 -0.983 C 5.921 -1.001 5.664 -1 5.4 -1 L 5.4 1 Z M 8 1.6 C 8 1.336 8.001 1.079 7.983 0.862 C 7.964 0.633 7.92 0.363 7.782 0.092 L 6 1 C 5.971 0.942 5.981 0.92 5.99 1.025 C 5.999 1.141 6 1.303 6 1.6 L 8 1.6 Z M 6 1 L 6 1 L 7.782 0.092 C 7.59 -0.284 7.284 -0.59 6.908 -0.782 L 6 1 Z M 1.6 -1 C 1.336 -1 1.079 -1.001 0.862 -0.983 C 0.633 -0.964 0.363 -0.92 0.092 -0.782 L 1 1 C 0.942 1.029 0.92 1.019 1.025 1.01 C 1.141 1.001 1.303 1 1.6 1 L 1.6 -1 Z M 1 1.6 C 1 1.303 1.001 1.141 1.01 1.025 C 1.019 0.92 1.029 0.942 1 1 L -0.782 0.092 C -0.92 0.363 -0.964 0.633 -0.983 0.862 C -1.001 1.079 -1 1.336 -1 1.6 L 1 1.6 Z M 0.092 -0.782 C -0.284 -0.59 -0.59 -0.284 -0.782 0.092 L 1 1 L 1 1 L 0.092 -0.782 Z M 12.6 1 L 16.4 1 L 16.4 -1 L 12.6 -1 L 12.6 1 Z M 17 1.6 L 17 5.4 L 19 5.4 L 19 1.6 L 17 1.6 Z M 16.4 6 L 12.6 6 L 12.6 8 L 16.4 8 L 16.4 6 Z M 12 5.4 L 12 1.6 L 10 1.6 L 10 5.4 L 12 5.4 Z M 12.6 6 C 12.303 6 12.141 5.999 12.025 5.99 C 11.92 5.981 11.942 5.971 12 6 L 11.092 7.782 C 11.363 7.92 11.633 7.964 11.862 7.983 C 12.079 8.001 12.336 8 12.6 8 L 12.6 6 Z M 10 5.4 C 10 5.664 9.999 5.921 10.017 6.138 C 10.036 6.367 10.08 6.637 10.218 6.908 L 12 6 C 12.029 6.058 12.019 6.08 12.01 5.975 C 12.001 5.859 12 5.697 12 5.4 L 10 5.4 Z M 12 6 L 12 6 L 10.218 6.908 C 10.41 7.284 10.716 7.59 11.092 7.782 L 12 6 Z M 17 5.4 C 17 5.697 16.999 5.859 16.99 5.975 C 16.981 6.08 16.971 6.058 17 6 L 18.782 6.908 C 18.92 6.637 18.964 6.367 18.983 6.138 C 19.001 5.921 19 5.664 19 5.4 L 17 5.4 Z M 16.4 8 C 16.664 8 16.921 8.001 17.138 7.983 C 17.367 7.964 17.637 7.92 17.908 7.782 L 17 6 C 17.058 5.971 17.08 5.981 16.975 5.99 C 16.859 5.999 16.697 6 16.4 6 L 16.4 8 Z M 17 6 L 17 6 L 17.908 7.782 C 18.284 7.59 18.59 7.284 18.782 6.908 L 17 6 Z M 16.4 1 C 16.697 1 16.859 1.001 16.975 1.01 C 17.08 1.019 17.058 1.029 17 1 L 17.908 -0.782 C 17.637 -0.92 17.367 -0.964 17.138 -0.983 C 16.921 -1.001 16.664 -1 16.4 -1 L 16.4 1 Z M 19 1.6 C 19 1.336 19.001 1.079 18.983 0.862 C 18.964 0.633 18.92 0.363 18.782 0.092 L 17 1 C 16.971 0.942 16.981 0.92 16.99 1.025 C 16.999 1.141 17 1.303 17 1.6 L 19 1.6 Z M 17 1 L 17 1 L 18.782 0.092 C 18.59 -0.284 18.284 -0.59 17.908 -0.782 L 17 1 Z M 12.6 -1 C 12.336 -1 12.079 -1.001 11.862 -0.983 C 11.633 -0.964 11.363 -0.92 11.092 -0.782 L 12 1 C 11.942 1.029 11.92 1.019 12.025 1.01 C 12.141 1.001 12.303 1 12.6 1 L 12.6 -1 Z M 12 1.6 C 12 1.303 12.001 1.141 12.01 1.025 C 12.019 0.92 12.029 0.942 12 1 L 10.218 0.092 C 10.08 0.363 10.036 0.633 10.017 0.862 C 9.999 1.079 10 1.336 10 1.6 L 12 1.6 Z M 11.092 -0.782 C 10.716 -0.59 10.41 -0.284 10.218 0.092 L 12 1 L 12 1 L 11.092 -0.782 Z M 12.6 12 L 16.4 12 L 16.4 10 L 12.6 10 L 12.6 12 Z M 17 12.6 L 17 16.4 L 19 16.4 L 19 12.6 L 17 12.6 Z M 16.4 17 L 12.6 17 L 12.6 19 L 16.4 19 L 16.4 17 Z M 12 16.4 L 12 12.6 L 10 12.6 L 10 16.4 L 12 16.4 Z M 12.6 17 C 12.303 17 12.141 16.999 12.025 16.99 C 11.92 16.981 11.942 16.971 12 17 L 11.092 18.782 C 11.363 18.92 11.633 18.964 11.862 18.983 C 12.079 19.001 12.336 19 12.6 19 L 12.6 17 Z M 10 16.4 C 10 16.664 9.999 16.921 10.017 17.138 C 10.036 17.367 10.08 17.637 10.218 17.908 L 12 17 C 12.029 17.058 12.019 17.08 12.01 16.975 C 12.001 16.859 12 16.697 12 16.4 L 10 16.4 Z M 12 17 L 12 17 L 10.218 17.908 C 10.41 18.284 10.716 18.59 11.092 18.782 L 12 17 Z M 17 16.4 C 17 16.697 16.999 16.859 16.99 16.975 C 16.981 17.08 16.971 17.058 17 17 L 18.782 17.908 C 18.92 17.637 18.964 17.367 18.983 17.138 C 19.001 16.921 19 16.664 19 16.4 L 17 16.4 Z M 16.4 19 C 16.664 19 16.921 19.001 17.138 18.983 C 17.367 18.964 17.637 18.92 17.908 18.782 L 17 17 C 17.058 16.971 17.08 16.981 16.975 16.99 C 16.859 16.999 16.697 17 16.4 17 L 16.4 19 Z M 17 17 L 17 17 L 17.908 18.782 C 18.284 18.59 18.59 18.284 18.782 17.908 L 17 17 Z M 16.4 12 C 16.697 12 16.859 12.001 16.975 12.01 C 17.08 12.019 17.058 12.029 17 12 L 17.908 10.218 C 17.637 10.08 17.367 10.036 17.138 10.017 C 16.921 9.999 16.664 10 16.4 10 L 16.4 12 Z M 19 12.6 C 19 12.336 19.001 12.079 18.983 11.862 C 18.964 11.633 18.92 11.363 18.782 11.092 L 17 12 C 16.971 11.942 16.981 11.92 16.99 12.025 C 16.999 12.141 17 12.303 17 12.6 L 19 12.6 Z M 17 12 L 17 12 L 18.782 11.092 C 18.59 10.716 18.284 10.41 17.908 10.218 L 17 12 Z M 12.6 10 C 12.336 10 12.079 9.999 11.862 10.017 C 11.633 10.036 11.363 10.08 11.092 10.218 L 12 12 C 11.942 12.029 11.92 12.019 12.025 12.01 C 12.141 12.001 12.303 12 12.6 12 L 12.6 10 Z M 12 12.6 C 12 12.303 12.001 12.141 12.01 12.025 C 12.019 11.92 12.029 11.942 12 12 L 10.218 11.092 C 10.08 11.363 10.036 11.633 10.017 11.862 C 9.999 12.079 10 12.336 10 12.6 L 12 12.6 Z M 11.092 10.218 C 10.716 10.41 10.41 10.716 10.218 11.092 L 12 12 L 12 12 L 11.092 10.218 Z M 1.6 12 L 5.4 12 L 5.4 10 L 1.6 10 L 1.6 12 Z M 6 12.6 L 6 16.4 L 8 16.4 L 8 12.6 L 6 12.6 Z M 5.4 17 L 1.6 17 L 1.6 19 L 5.4 19 L 5.4 17 Z M 1 16.4 L 1 12.6 L -1 12.6 L -1 16.4 L 1 16.4 Z M 1.6 17 C 1.303 17 1.141 16.999 1.025 16.99 C 0.92 16.981 0.942 16.971 1 17 L 0.092 18.782 C 0.363 18.92 0.633 18.964 0.862 18.983 C 1.079 19.001 1.336 19 1.6 19 L 1.6 17 Z M -1 16.4 C -1 16.664 -1.001 16.921 -0.983 17.138 C -0.964 17.367 -0.92 17.637 -0.782 17.908 L 1 17 C 1.029 17.058 1.019 17.08 1.01 16.975 C 1.001 16.859 1 16.697 1 16.4 L -1 16.4 Z M 1 17 L 1 17 L -0.782 17.908 C -0.59 18.284 -0.284 18.59 0.092 18.782 L 1 17 Z M 6 16.4 C 6 16.697 5.999 16.859 5.99 16.975 C 5.981 17.08 5.971 17.058 6 17 L 7.782 17.908 C 7.92 17.637 7.964 17.367 7.983 17.138 C 8.001 16.921 8 16.664 8 16.4 L 6 16.4 Z M 5.4 19 C 5.664 19 5.921 19.001 6.138 18.983 C 6.367 18.964 6.637 18.92 6.908 18.782 L 6 17 C 6.058 16.971 6.08 16.981 5.975 16.99 C 5.859 16.999 5.697 17 5.4 17 L 5.4 19 Z M 6 17 L 6 17 L 6.908 18.782 C 7.284 18.59 7.59 18.284 7.782 17.908 L 6 17 Z M 5.4 12 C 5.697 12 5.859 12.001 5.975 12.01 C 6.08 12.019 6.058 12.029 6 12 L 6.908 10.218 C 6.637 10.08 6.367 10.036 6.138 10.017 C 5.921 9.999 5.664 10 5.4 10 L 5.4 12 Z M 8 12.6 C 8 12.336 8.001 12.079 7.983 11.862 C 7.964 11.633 7.92 11.363 7.782 11.092 L 6 12 C 5.971 11.942 5.981 11.92 5.99 12.025 C 5.999 12.141 6 12.303 6 12.6 L 8 12.6 Z M 6 12 L 6 12 L 7.782 11.092 C 7.59 10.716 7.284 10.41 6.908 10.218 L 6 12 Z M 1.6 10 C 1.336 10 1.079 9.999 0.862 10.017 C 0.633 10.036 0.363 10.08 0.092 10.218 L 1 12 C 0.942 12.029 0.92 12.019 1.025 12.01 C 1.141 12.001 1.303 12 1.6 12 L 1.6 10 Z M 1 12.6 C 1 12.303 1.001 12.141 1.01 12.025 C 1.019 11.92 1.029 11.942 1 12 L -0.782 11.092 C -0.92 11.363 -0.964 11.633 -0.983 11.862 C -1.001 12.079 -1 12.336 -1 12.6 L 1 12.6 Z M 0.092 10.218 C -0.284 10.41 -0.59 10.716 -0.782 11.092 L 1 12 L 1 12 L 0.092 10.218 Z" fill="currentColor" fillRule="nonzero" transform="matrix(1 0 0 1 3 3)" />
        </symbol>
        <symbol id="i-msg" viewBox="0 0 24 24">
          <path d="M 4 15 L 5 15 C 5 14.448 4.552 14 4 14 L 4 15 Z M 0.102 12.776 L 1.068 12.518 L 0.102 12.776 Z M 2.224 14.898 L 2.482 13.932 L 2.224 14.898 Z M 9.449 15.061 L 9.248 14.082 L 9.449 15.061 Z M 7.685 16.052 L 7.061 15.271 L 7.685 16.052 Z M 8.687 15.328 L 8.233 14.438 L 8.687 15.328 Z M 4.501 18.46 L 4.502 19.46 L 4.501 18.46 Z M 4.109 18.272 L 4.891 17.648 L 4.891 17.648 L 4.109 18.272 Z M 17.673 13.362 L 18.564 13.816 L 17.673 13.362 Z M 16.362 14.673 L 16.816 15.564 L 16.362 14.673 Z M 16.362 0.327 L 16.816 -0.564 L 16.362 0.327 Z M 17.673 1.638 L 18.564 1.184 L 17.673 1.638 Z M 1.638 0.327 L 1.184 -0.564 L 1.638 0.327 Z M 0.327 1.638 L -0.564 1.184 L 0.327 1.638 Z M 6.057 4.67 C 5.873 5.191 6.147 5.762 6.668 5.946 C 7.189 6.129 7.76 5.855 7.943 5.334 L 6.057 4.67 Z M 11.369 5.752 L 10.369 5.75 L 10.369 5.752 L 11.369 5.752 Z M 8.805 7.051 C 8.281 7.226 7.998 7.792 8.172 8.316 C 8.347 8.84 8.913 9.123 9.437 8.949 L 8.805 7.051 Z M 9.15 10 C 8.598 10 8.15 10.448 8.15 11 C 8.15 11.552 8.598 12 9.15 12 L 9.15 10 Z M 9.16 12 C 9.712 12 10.16 11.552 10.16 11 C 10.16 10.448 9.712 10 9.16 10 L 9.16 12 Z M 4.8 1 L 13.2 1 L 13.2 -1 L 4.8 -1 L 4.8 1 Z M 17 4.8 L 17 10.2 L 19 10.2 L 19 4.8 L 17 4.8 Z M 13.2 14 L 10.684 14 L 10.684 16 L 13.2 16 L 13.2 14 Z M 7.061 15.271 L 4.675 17.179 L 5.924 18.741 L 8.31 16.833 L 7.061 15.271 Z M 1 11 L 1 4.8 L -1 4.8 L -1 11 L 1 11 Z M 5 17.336 L 5 15 L 3 15 L 3 17.336 L 5 17.336 Z M -1 11 C -1 11.866 -1.009 12.495 -0.864 13.035 L 1.068 12.518 C 1.009 12.295 1 11.994 1 11 L -1 11 Z M 4 14 C 3.006 14 2.705 13.991 2.482 13.932 L 1.965 15.864 C 2.505 16.009 3.134 16 4 16 L 4 14 Z M -0.864 13.035 C -0.494 14.416 0.584 15.494 1.965 15.864 L 2.482 13.932 C 1.792 13.747 1.253 13.208 1.068 12.518 L -0.864 13.035 Z M 10.684 14 C 10.1 14 9.669 13.995 9.248 14.082 L 9.65 16.041 C 9.826 16.005 10.02 16 10.684 16 L 10.684 14 Z M 8.31 16.833 C 8.828 16.418 8.982 16.301 9.142 16.219 L 8.233 14.438 C 7.85 14.633 7.517 14.906 7.061 15.271 L 8.31 16.833 Z M 9.248 14.082 C 8.895 14.154 8.553 14.274 8.233 14.438 L 9.142 16.219 C 9.303 16.137 9.474 16.077 9.65 16.041 L 9.248 14.082 Z M 4.675 17.179 C 4.569 17.264 4.485 17.331 4.412 17.387 C 4.339 17.444 4.291 17.479 4.258 17.501 C 4.224 17.523 4.228 17.517 4.26 17.504 C 4.297 17.489 4.381 17.46 4.499 17.46 L 4.502 19.46 C 4.899 19.459 5.204 19.273 5.361 19.169 C 5.534 19.055 5.732 18.895 5.924 18.741 L 4.675 17.179 Z M 3 17.336 C 3 17.582 2.999 17.836 3.018 18.043 C 3.035 18.23 3.08 18.585 3.328 18.895 L 4.891 17.648 C 4.965 17.74 4.995 17.824 5.006 17.862 C 5.016 17.895 5.013 17.903 5.01 17.862 C 5.006 17.823 5.003 17.763 5.002 17.671 C 5 17.579 5 17.471 5 17.336 L 3 17.336 Z M 4.499 17.46 C 4.652 17.46 4.796 17.529 4.891 17.648 L 3.328 18.895 C 3.613 19.252 4.045 19.46 4.502 19.46 L 4.499 17.46 Z M 17 10.2 C 17 11.057 16.999 11.639 16.962 12.089 C 16.927 12.527 16.862 12.752 16.782 12.908 L 18.564 13.816 C 18.811 13.331 18.91 12.814 18.956 12.252 C 19.001 11.701 19 11.024 19 10.2 L 17 10.2 Z M 13.2 16 C 14.024 16 14.701 16.001 15.252 15.956 C 15.814 15.91 16.331 15.811 16.816 15.564 L 15.908 13.782 C 15.752 13.862 15.527 13.927 15.089 13.962 C 14.639 13.999 14.057 14 13.2 14 L 13.2 16 Z M 16.782 12.908 C 16.59 13.284 16.284 13.59 15.908 13.782 L 16.816 15.564 C 17.569 15.181 18.181 14.569 18.564 13.816 L 16.782 12.908 Z M 13.2 1 C 14.057 1 14.639 1.001 15.089 1.038 C 15.527 1.073 15.752 1.138 15.908 1.218 L 16.816 -0.564 C 16.331 -0.811 15.814 -0.91 15.252 -0.956 C 14.701 -1.001 14.024 -1 13.2 -1 L 13.2 1 Z M 19 4.8 C 19 3.976 19.001 3.299 18.956 2.748 C 18.91 2.186 18.811 1.669 18.564 1.184 L 16.782 2.092 C 16.862 2.248 16.927 2.473 16.962 2.911 C 16.999 3.361 17 3.943 17 4.8 L 19 4.8 Z M 15.908 1.218 C 16.284 1.41 16.59 1.716 16.782 2.092 L 18.564 1.184 C 18.181 0.431 17.569 -0.181 16.816 -0.564 L 15.908 1.218 Z M 4.8 -1 C 3.976 -1 3.299 -1.001 2.748 -0.956 C 2.186 -0.91 1.669 -0.811 1.184 -0.564 L 2.092 1.218 C 2.248 1.138 2.473 1.073 2.911 1.038 C 3.361 1.001 3.943 1 4.8 1 L 4.8 -1 Z M 1 4.8 C 1 3.943 1.001 3.361 1.038 2.911 C 1.073 2.473 1.138 2.248 1.218 2.092 L -0.564 1.184 C -0.811 1.669 -0.91 2.186 -0.956 2.748 C -1.001 3.299 -1 3.976 -1 4.8 L 1 4.8 Z M 1.184 -0.564 C 0.431 -0.181 -0.181 0.431 -0.564 1.184 L 1.218 2.092 C 1.41 1.716 1.716 1.41 2.092 1.218 L 1.184 -0.564 Z M 7.943 5.334 C 8.041 5.056 8.234 4.821 8.488 4.672 L 7.475 2.948 C 6.814 3.337 6.311 3.947 6.057 4.67 L 7.943 5.334 Z M 8.488 4.672 C 8.743 4.523 9.041 4.468 9.332 4.518 L 9.67 2.547 C 8.914 2.417 8.136 2.559 7.475 2.948 L 8.488 4.672 Z M 9.332 4.518 C 9.623 4.568 9.886 4.719 10.076 4.944 L 11.606 3.656 C 11.112 3.07 10.426 2.676 9.67 2.547 L 9.332 4.518 Z M 10.076 4.944 C 10.266 5.17 10.37 5.455 10.369 5.75 L 12.369 5.753 C 12.37 4.986 12.1 4.243 11.606 3.656 L 10.076 4.944 Z M 10.369 5.752 C 10.369 5.97 10.192 6.271 9.69 6.606 C 9.47 6.753 9.242 6.867 9.066 6.946 C 8.979 6.984 8.908 7.013 8.862 7.03 C 8.838 7.039 8.821 7.045 8.811 7.049 C 8.806 7.051 8.803 7.052 8.802 7.052 C 8.801 7.052 8.801 7.052 8.802 7.052 C 8.802 7.052 8.802 7.052 8.803 7.052 C 8.803 7.052 8.803 7.052 8.804 7.052 C 8.804 7.052 8.804 7.052 8.804 7.051 C 8.804 7.051 8.805 7.051 9.121 8 C 9.437 8.949 9.437 8.949 9.438 8.948 C 9.438 8.948 9.438 8.948 9.438 8.948 C 9.439 8.948 9.439 8.948 9.44 8.948 C 9.441 8.947 9.442 8.947 9.443 8.947 C 9.446 8.946 9.449 8.945 9.453 8.943 C 9.46 8.941 9.47 8.938 9.481 8.933 C 9.504 8.925 9.535 8.914 9.574 8.899 C 9.65 8.87 9.754 8.828 9.878 8.773 C 10.124 8.664 10.458 8.498 10.8 8.27 C 11.422 7.855 12.369 7.032 12.369 5.752 L 10.369 5.752 Z M 9.15 12 L 9.16 12 L 9.16 10 L 9.15 10 L 9.15 12 Z" fill="currentColor" fillRule="nonzero" transform="matrix(1 0 0 1 3 3)" />
        </symbol>
        <symbol id="i-users" viewBox="0 0 24 24">
          <path d="M 19 18 C 19 18.552 19.448 19 20 19 C 20.552 19 21 18.552 21 18 L 19 18 Z M 17.249 11.158 C 16.714 11.02 16.169 11.342 16.032 11.877 C 15.894 12.412 16.216 12.957 16.751 13.094 L 17.249 11.158 Z M 13.875 -0.636 C 13.363 -0.843 12.78 -0.596 12.573 -0.084 C 12.366 0.427 12.613 1.01 13.125 1.218 L 13.875 -0.636 Z M 13.125 6.782 C 12.613 6.99 12.366 7.573 12.573 8.084 C 12.78 8.596 13.363 8.843 13.875 8.636 L 13.125 6.782 Z M 12.531 12.304 L 12.913 11.381 L 12.913 11.381 L 12.531 12.304 Z M 14 18 C 14 18.552 14.448 19 15 19 C 15.552 19 16 18.552 16 18 L 14 18 Z M 14.696 14.469 L 15.619 14.087 L 15.619 14.087 L 14.696 14.469 Z M 2.469 12.304 L 2.087 11.381 L 2.087 11.381 L 2.469 12.304 Z M -1 18 C -1 18.552 -0.552 19 0 19 C 0.552 19 1 18.552 1 18 L -1 18 Z M 0.304 14.469 L -0.619 14.087 L -0.619 14.087 L 0.304 14.469 Z M 19 16 L 19 18 L 21 18 L 21 16 L 19 16 Z M 16.751 13.094 C 18.045 13.428 19 14.603 19 16 L 21 16 C 21 13.669 19.406 11.713 17.249 11.158 L 16.751 13.094 Z M 13.125 1.218 C 14.226 1.663 15 2.743 15 4 L 17 4 C 17 1.9 15.706 0.105 13.875 -0.636 L 13.125 1.218 Z M 15 4 C 15 5.257 14.226 6.337 13.125 6.782 L 13.875 8.636 C 15.706 7.895 17 6.1 17 4 L 15 4 Z M 6 13 L 9 13 L 9 11 L 6 11 L 6 13 Z M 9 13 C 9.946 13 10.605 13.001 11.121 13.036 C 11.627 13.07 11.923 13.135 12.148 13.228 L 12.913 11.381 C 12.404 11.169 11.865 11.082 11.257 11.04 C 10.657 10.999 9.918 11 9 11 L 9 13 Z M 16 18 C 16 17.082 16.001 16.343 15.96 15.743 C 15.918 15.135 15.831 14.596 15.619 14.087 L 13.772 14.852 C 13.865 15.077 13.93 15.373 13.964 15.879 C 13.999 16.395 14 17.054 14 18 L 16 18 Z M 12.148 13.228 C 12.883 13.533 13.467 14.117 13.772 14.852 L 15.619 14.087 C 15.112 12.861 14.139 11.888 12.913 11.381 L 12.148 13.228 Z M 6 11 C 5.082 11 4.343 10.999 3.743 11.04 C 3.135 11.082 2.596 11.169 2.087 11.381 L 2.852 13.228 C 3.077 13.135 3.373 13.07 3.879 13.036 C 4.395 13.001 5.054 13 6 13 L 6 11 Z M 1 18 C 1 17.054 1.001 16.395 1.036 15.879 C 1.07 15.373 1.135 15.077 1.228 14.852 L -0.619 14.087 C -0.831 14.596 -0.918 15.135 -0.96 15.743 C -1.001 16.343 -1 17.082 -1 18 L 1 18 Z M 2.087 11.381 C 0.861 11.888 -0.112 12.861 -0.619 14.087 L 1.228 14.852 C 1.533 14.117 2.117 13.533 2.852 13.228 L 2.087 11.381 Z M 10.5 4 C 10.5 5.657 9.157 7 7.5 7 L 7.5 9 C 10.261 9 12.5 6.761 12.5 4 L 10.5 4 Z M 7.5 7 C 5.843 7 4.5 5.657 4.5 4 L 2.5 4 C 2.5 6.761 4.739 9 7.5 9 L 7.5 7 Z M 4.5 4 C 4.5 2.343 5.843 1 7.5 1 L 7.5 -1 C 4.739 -1 2.5 1.239 2.5 4 L 4.5 4 Z M 7.5 1 C 9.157 1 10.5 2.343 10.5 4 L 12.5 4 C 12.5 1.239 10.261 -1 7.5 -1 L 7.5 1 Z" fill="currentColor" fillRule="nonzero" transform="matrix(1 0 0 1 2 3)" />
        </symbol>
        <symbol id="i-apps" viewBox="0 0 24 24">
          <path d="M 10.5 4 L 9.5 4 C 9.5 4.552 9.948 5 10.5 5 L 10.5 4 Z M 16 8.5 L 15 8.5 C 15 9.052 15.448 9.5 16 9.5 L 16 8.5 Z M 16 13.5 L 16 12.5 C 15.448 12.5 15 12.948 15 13.5 L 16 13.5 Z M 10.5 20 L 9.5 20 C 9.5 20.552 9.948 21 10.5 21 L 10.5 20 Z M 6 20 L 6 21 C 6.552 21 7 20.552 7 20 L 6 20 Z M 0 13.5 L 0 12.5 C -0.552 12.5 -1 12.948 -1 13.5 L 0 13.5 Z M 0 8.5 L -1 8.5 C -1 9.052 -0.552 9.5 0 9.5 L 0 8.5 Z M 5.5 4 L 5.5 5 C 6.052 5 6.5 4.552 6.5 4 L 5.5 4 Z M 0.228 5.852 L 1.152 6.235 L 1.152 6.235 L 0.228 5.852 Z M 1.852 4.228 L 2.235 5.152 L 2.235 5.152 L 1.852 4.228 Z M 1.638 19.673 L 1.184 20.564 L 1.638 19.673 Z M 0.327 18.362 L -0.564 18.816 L 0.327 18.362 Z M 15.673 18.362 L 16.564 18.816 L 15.673 18.362 Z M 14.362 19.673 L 14.816 20.564 L 14.362 19.673 Z M 14.148 4.228 L 13.765 5.152 L 13.765 5.152 L 14.148 4.228 Z M 15.772 5.852 L 14.848 6.235 L 14.848 6.235 L 15.772 5.852 Z M 11.5 4 L 11.5 2.5 L 9.5 2.5 L 9.5 4 L 11.5 4 Z M 11.5 3 L 10.5 3 L 10.5 5 L 11.5 5 L 11.5 3 Z M 17.5 7.5 L 16 7.5 L 16 9.5 L 17.5 9.5 L 17.5 7.5 Z M 16 14.5 L 17.5 14.5 L 17.5 12.5 L 16 12.5 L 16 14.5 Z M 17 15.2 L 17 13.5 L 15 13.5 L 15 15.2 L 17 15.2 Z M 10.5 21 L 11.2 21 L 11.2 19 L 10.5 19 L 10.5 21 Z M 9.5 18.25 L 9.5 20 L 11.5 20 L 11.5 18.25 L 9.5 18.25 Z M 7 20 L 7 18.25 L 5 18.25 L 5 20 L 7 20 Z M 4.8 21 L 6 21 L 6 19 L 4.8 19 L 4.8 21 Z M -1 13.5 L -1 15.2 L 1 15.2 L 1 13.5 L -1 13.5 Z M 1.5 12.5 L 0 12.5 L 0 14.5 L 1.5 14.5 L 1.5 12.5 Z M 0 9.5 L 1.5 9.5 L 1.5 7.5 L 0 7.5 L 0 9.5 Z M 5.5 3 L 4.5 3 L 4.5 5 L 5.5 5 L 5.5 3 Z M 4.5 2.5 L 4.5 4 L 6.5 4 L 6.5 2.5 L 4.5 2.5 Z M 1 8.5 C 1 7.787 1.001 7.303 1.026 6.927 C 1.051 6.559 1.097 6.368 1.152 6.235 L -0.696 5.469 C -0.869 5.887 -0.937 6.321 -0.969 6.79 C -1.001 7.251 -1 7.815 -1 8.5 L 1 8.5 Z M 4.5 3 C 3.815 3 3.251 2.999 2.79 3.031 C 2.321 3.063 1.887 3.131 1.469 3.304 L 2.235 5.152 C 2.368 5.097 2.559 5.051 2.927 5.026 C 3.303 5.001 3.787 5 4.5 5 L 4.5 3 Z M 1.152 6.235 C 1.355 5.745 1.745 5.355 2.235 5.152 L 1.469 3.304 C 0.489 3.71 -0.29 4.489 -0.696 5.469 L 1.152 6.235 Z M 1.5 14.5 C 3.433 14.5 5 12.933 5 11 L 3 11 C 3 11.828 2.328 12.5 1.5 12.5 L 1.5 14.5 Z M 4.8 19 C 3.943 19 3.361 18.999 2.911 18.962 C 2.473 18.927 2.248 18.862 2.092 18.782 L 1.184 20.564 C 1.669 20.811 2.186 20.91 2.748 20.956 C 3.299 21.001 3.976 21 4.8 21 L 4.8 19 Z M -1 15.2 C -1 16.024 -1.001 16.701 -0.956 17.252 C -0.91 17.814 -0.811 18.331 -0.564 18.816 L 1.218 17.908 C 1.138 17.752 1.073 17.527 1.038 17.089 C 1.001 16.639 1 16.057 1 15.2 L -1 15.2 Z M 2.092 18.782 C 1.716 18.59 1.41 18.284 1.218 17.908 L -0.564 18.816 C -0.181 19.569 0.431 20.181 1.184 20.564 L 2.092 18.782 Z M 11.5 18.25 C 11.5 16.455 10.045 15 8.25 15 L 8.25 17 C 8.94 17 9.5 17.56 9.5 18.25 L 11.5 18.25 Z M 15 15.2 C 15 16.057 14.999 16.639 14.962 17.089 C 14.927 17.527 14.862 17.752 14.782 17.908 L 16.564 18.816 C 16.811 18.331 16.91 17.814 16.956 17.252 C 17.001 16.701 17 16.024 17 15.2 L 15 15.2 Z M 11.2 21 C 12.024 21 12.701 21.001 13.252 20.956 C 13.814 20.91 14.331 20.811 14.816 20.564 L 13.908 18.782 C 13.752 18.862 13.527 18.927 13.089 18.962 C 12.639 18.999 12.057 19 11.2 19 L 11.2 21 Z M 14.782 17.908 C 14.59 18.284 14.284 18.59 13.908 18.782 L 14.816 20.564 C 15.569 20.181 16.181 19.569 16.564 18.816 L 14.782 17.908 Z M 11.5 5 C 12.213 5 12.697 5.001 13.073 5.026 C 13.441 5.051 13.632 5.097 13.765 5.152 L 14.531 3.304 C 14.113 3.131 13.679 3.063 13.21 3.031 C 12.749 2.999 12.185 3 11.5 3 L 11.5 5 Z M 17 8.5 C 17 7.815 17.001 7.251 16.969 6.79 C 16.937 6.321 16.869 5.887 16.696 5.469 L 14.848 6.235 C 14.903 6.368 14.949 6.559 14.974 6.927 C 14.999 7.303 15 7.787 15 8.5 L 17 8.5 Z M 13.765 5.152 C 14.255 5.355 14.645 5.745 14.848 6.235 L 16.696 5.469 C 16.29 4.489 15.511 3.71 14.531 3.304 L 13.765 5.152 Z M 19 11 C 19 11.828 18.328 12.5 17.5 12.5 L 17.5 14.5 C 19.433 14.5 21 12.933 21 11 L 19 11 Z M 8 -1 C 6.067 -1 4.5 0.567 4.5 2.5 L 6.5 2.5 C 6.5 1.672 7.172 1 8 1 L 8 -1 Z M 5 11 C 5 9.067 3.433 7.5 1.5 7.5 L 1.5 9.5 C 2.328 9.5 3 10.172 3 11 L 5 11 Z M 17.5 9.5 C 18.328 9.5 19 10.172 19 11 L 21 11 C 21 9.067 19.433 7.5 17.5 7.5 L 17.5 9.5 Z M 8.25 15 C 6.455 15 5 16.455 5 18.25 L 7 18.25 C 7 17.56 7.56 17 8.25 17 L 8.25 15 Z M 8 1 C 8.828 1 9.5 1.672 9.5 2.5 L 11.5 2.5 C 11.5 0.567 9.933 -1 8 -1 L 8 1 Z" fill="currentColor" fillRule="nonzero" transform="matrix(1 0 0 1 2 2)" />
        </symbol>
        <symbol id="i-help" viewBox="0 0 24 24">
          <path d="M 6.147 6.668 C 5.963 7.189 6.237 7.76 6.758 7.943 C 7.279 8.127 7.85 7.853 8.033 7.332 L 6.147 6.668 Z M 12.92 8 L 11.92 7.999 L 11.92 8 L 12.92 8 Z M 9.604 10.051 C 9.08 10.226 8.797 10.792 8.971 11.316 C 9.146 11.84 9.712 12.123 10.236 11.949 L 9.604 10.051 Z M 10 14 C 9.448 14 9 14.448 9 15 C 9 15.552 9.448 16 10 16 L 10 14 Z M 10.01 16 C 10.562 16 11.01 15.552 11.01 15 C 11.01 14.448 10.562 14 10.01 14 L 10.01 16 Z M 19 10 C 19 14.971 14.971 19 10 19 L 10 21 C 16.075 21 21 16.075 21 10 L 19 10 Z M 10 19 C 5.029 19 1 14.971 1 10 L -1 10 C -1 16.075 3.925 21 10 21 L 10 19 Z M 1 10 C 1 5.029 5.029 1 10 1 L 10 -1 C 3.925 -1 -1 3.925 -1 10 L 1 10 Z M 10 1 C 14.971 1 19 5.029 19 10 L 21 10 C 21 3.925 16.075 -1 10 -1 L 10 1 Z M 8.033 7.332 C 8.19 6.886 8.499 6.511 8.907 6.271 L 7.893 4.547 C 7.079 5.026 6.46 5.777 6.147 6.668 L 8.033 7.332 Z M 8.907 6.271 C 9.314 6.032 9.793 5.944 10.258 6.024 L 10.596 4.053 C 9.665 3.893 8.708 4.068 7.893 4.547 L 8.907 6.271 Z M 10.258 6.024 C 10.724 6.104 11.146 6.346 11.45 6.708 L 12.98 5.42 C 12.372 4.697 11.527 4.213 10.596 4.053 L 10.258 6.024 Z M 11.45 6.708 C 11.754 7.069 11.921 7.526 11.92 7.999 L 13.92 8.001 C 13.921 7.057 13.588 6.142 12.98 5.42 L 11.45 6.708 Z M 11.92 8 C 11.92 8.469 11.555 8.958 10.865 9.418 C 10.551 9.628 10.229 9.789 9.983 9.899 C 9.861 9.953 9.76 9.993 9.693 10.019 C 9.659 10.031 9.634 10.041 9.619 10.046 C 9.611 10.049 9.606 10.051 9.603 10.051 C 9.602 10.052 9.601 10.052 9.601 10.052 C 9.601 10.052 9.602 10.052 9.602 10.052 C 9.602 10.052 9.603 10.052 9.603 10.052 C 9.603 10.052 9.603 10.052 9.603 10.051 C 9.604 10.051 9.604 10.051 9.92 11 C 10.236 11.949 10.237 11.949 10.237 11.948 C 10.237 11.948 10.237 11.948 10.237 11.948 C 10.238 11.948 10.238 11.948 10.239 11.948 C 10.24 11.947 10.241 11.947 10.243 11.946 C 10.246 11.945 10.25 11.944 10.254 11.943 C 10.263 11.94 10.274 11.936 10.289 11.93 C 10.317 11.92 10.357 11.906 10.405 11.888 C 10.502 11.851 10.636 11.797 10.795 11.726 C 11.111 11.586 11.539 11.372 11.975 11.082 C 12.785 10.542 13.92 9.531 13.92 8 L 11.92 8 Z M 10 16 L 10.01 16 L 10.01 14 L 10 14 L 10 16 Z" fill="currentColor" fillRule="nonzero" transform="matrix(1 0 0 1 2 2)" />
        </symbol>
        <symbol id="i-sidebar" viewBox="0 0 24 24">
          <path d="M 7 0 C 7 -0.552 6.552 -1 6 -1 C 5.448 -1 5 -0.552 5 0 L 7 0 Z M 5 18 C 5 18.552 5.448 19 6 19 C 6.552 19 7 18.552 7 18 L 5 18 Z M 1.638 17.673 L 1.184 18.564 L 1.184 18.564 L 1.638 17.673 Z M 0.327 16.362 L 1.218 15.908 L 1.218 15.908 L 0.327 16.362 Z M 17.673 16.362 L 16.782 15.908 L 16.782 15.908 L 17.673 16.362 Z M 16.362 17.673 L 15.908 16.782 L 15.908 16.782 L 16.362 17.673 Z M 16.362 0.327 L 15.908 1.218 L 15.908 1.218 L 16.362 0.327 Z M 17.673 1.638 L 18.564 1.184 L 18.564 1.184 L 17.673 1.638 Z M 1.638 0.327 L 2.092 1.218 L 2.092 1.218 L 1.638 0.327 Z M 0.327 1.638 L 1.218 2.092 L 1.218 2.092 L 0.327 1.638 Z M 5 0 L 5 18 L 7 18 L 7 0 L 5 0 Z M 4.8 1 L 13.2 1 L 13.2 -1 L 4.8 -1 L 4.8 1 Z M 17 4.8 L 17 13.2 L 19 13.2 L 19 4.8 L 17 4.8 Z M 13.2 17 L 4.8 17 L 4.8 19 L 13.2 19 L 13.2 17 Z M 1 13.2 L 1 4.8 L -1 4.8 L -1 13.2 L 1 13.2 Z M 4.8 17 C 3.943 17 3.361 16.999 2.911 16.962 C 2.473 16.927 2.248 16.862 2.092 16.782 L 1.184 18.564 C 1.669 18.811 2.186 18.91 2.748 18.956 C 3.299 19.001 3.976 19 4.8 19 L 4.8 17 Z M -1 13.2 C -1 14.024 -1.001 14.701 -0.956 15.252 C -0.91 15.814 -0.811 16.331 -0.564 16.816 L 1.218 15.908 C 1.138 15.752 1.073 15.527 1.038 15.089 C 1.001 14.639 1 14.057 1 13.2 L -1 13.2 Z M 2.092 16.782 C 1.716 16.59 1.41 16.284 1.218 15.908 L -0.564 16.816 C -0.181 17.569 0.431 18.181 1.184 18.564 L 2.092 16.782 Z M 17 13.2 C 17 14.057 16.999 14.639 16.962 15.089 C 16.927 15.527 16.862 15.752 16.782 15.908 L 18.564 16.816 C 18.811 16.331 18.91 15.814 18.956 15.252 C 19.001 14.701 19 14.024 19 13.2 L 17 13.2 Z M 13.2 19 C 14.024 19 14.701 19.001 15.252 18.956 C 15.814 18.91 16.331 18.811 16.816 18.564 L 15.908 16.782 C 15.752 16.862 15.527 16.927 15.089 16.962 C 14.639 16.999 14.057 17 13.2 17 L 13.2 19 Z M 16.782 15.908 C 16.59 16.284 16.284 16.59 15.908 16.782 L 16.816 18.564 C 17.569 18.181 18.181 17.569 18.564 16.816 L 16.782 15.908 Z M 13.2 1 C 14.057 1 14.639 1.001 15.089 1.038 C 15.527 1.073 15.752 1.138 15.908 1.218 L 16.816 -0.564 C 16.331 -0.811 15.814 -0.91 15.252 -0.956 C 14.701 -1.001 14.024 -1 13.2 -1 L 13.2 1 Z M 19 4.8 C 19 3.976 19.001 3.299 18.956 2.748 C 18.91 2.186 18.811 1.669 18.564 1.184 L 16.782 2.092 C 16.862 2.248 16.927 2.473 16.962 2.911 C 16.999 3.361 17 3.943 17 4.8 L 19 4.8 Z M 15.908 1.218 C 16.284 1.41 16.59 1.716 16.782 2.092 L 18.564 1.184 C 18.181 0.431 17.569 -0.181 16.816 -0.564 L 15.908 1.218 Z M 4.8 -1 C 3.976 -1 3.299 -1.001 2.748 -0.956 C 2.186 -0.91 1.669 -0.811 1.184 -0.564 L 2.092 1.218 C 2.248 1.138 2.473 1.073 2.911 1.038 C 3.361 1.001 3.943 1 4.8 1 L 4.8 -1 Z M 1 4.8 C 1 3.943 1.001 3.361 1.038 2.911 C 1.073 2.473 1.138 2.248 1.218 2.092 L -0.564 1.184 C -0.811 1.669 -0.91 2.186 -0.956 2.748 C -1.001 3.299 -1 3.976 -1 4.8 L 1 4.8 Z M 1.184 -0.564 C 0.431 -0.181 -0.181 0.431 -0.564 1.184 L 1.218 2.092 C 1.41 1.716 1.716 1.41 2.092 1.218 L 1.184 -0.564 Z" fill="currentColor" fillRule="nonzero" transform="matrix(1 0 0 1 3 3)" />
        </symbol>
        <symbol id="i-search" viewBox="0 0 24 24">
          <path d="M 17.293 18.707 C 17.683 19.098 18.317 19.098 18.707 18.707 C 19.098 18.317 19.098 17.683 18.707 17.293 L 17.293 18.707 Z M 15.207 13.793 C 14.817 13.402 14.184 13.402 13.793 13.793 C 13.402 14.183 13.402 14.817 13.793 15.207 L 15.207 13.793 Z M 18.707 17.293 L 15.207 13.793 L 13.793 15.207 L 17.293 18.707 L 18.707 17.293 Z M 16 8.5 C 16 12.642 12.642 16 8.5 16 L 8.5 18 C 13.747 18 18 13.747 18 8.5 L 16 8.5 Z M 8.5 16 C 4.358 16 1 12.642 1 8.5 L -1 8.5 C -1 13.747 3.253 18 8.5 18 L 8.5 16 Z M 1 8.5 C 1 4.358 4.358 1 8.5 1 L 8.5 -1 C 3.253 -1 -1 3.253 -1 8.5 L 1 8.5 Z M 8.5 1 C 12.642 1 16 4.358 16 8.5 L 18 8.5 C 18 3.253 13.747 -1 8.5 -1 L 8.5 1 Z" fill="currentColor" fillRule="nonzero" transform="matrix(1 0 0 1 3 3)" />
        </symbol>
        <symbol id="i-coin" viewBox="0 0 24 24">
          <path d="M 13.805 12.947 C 13.258 13.02 12.873 13.523 12.947 14.07 C 13.02 14.618 13.523 15.002 14.07 14.929 L 13.805 12.947 Z M 5.071 5.93 C 4.998 6.477 5.382 6.98 5.93 7.053 C 6.477 7.127 6.98 6.742 7.053 6.195 L 5.071 5.93 Z M 14.07 14.929 C 17.983 14.405 21 11.056 21 7 L 19 7 C 19 10.04 16.738 12.554 13.805 12.947 L 14.07 14.929 Z M 21 7 C 21 2.582 17.418 -1 13 -1 L 13 1 C 16.314 1 19 3.686 19 7 L 21 7 Z M 13 -1 C 8.944 -1 5.595 2.017 5.071 5.93 L 7.053 6.195 C 7.446 3.262 9.96 1 13 1 L 13 -1 Z M 13 13 C 13 16.314 10.314 19 7 19 L 7 21 C 11.418 21 15 17.418 15 13 L 13 13 Z M 7 19 C 3.686 19 1 16.314 1 13 L -1 13 C -1 17.418 2.582 21 7 21 L 7 19 Z M 1 13 C 1 9.686 3.686 7 7 7 L 7 5 C 2.582 5 -1 8.582 -1 13 L 1 13 Z M 7 7 C 10.314 7 13 9.686 13 13 L 15 13 C 15 8.582 11.418 5 7 5 L 7 7 Z" fill="currentColor" fillRule="nonzero" transform="matrix(1 0 0 1 2 2)" />
        </symbol>
        <symbol id="i-user" viewBox="0 0 24 24">
          <path d="M 13.161 12.672 L 13.451 11.715 L 13.451 11.715 L 13.161 12.672 Z M 15 18 C 15 18.552 15.448 19 16 19 C 16.552 19 17 18.552 17 18 L 15 18 Z M 15.828 15.339 L 16.785 15.049 L 16.785 15.049 L 15.828 15.339 Z M 2.839 12.672 L 3.129 13.629 L 2.839 12.672 Z M -1 18 C -1 18.552 -0.552 19 0 19 C 0.552 19 1 18.552 1 18 L -1 18 Z M 0.172 15.339 L 1.129 15.629 L 0.172 15.339 Z M 5.5 13.5 L 10.5 13.5 L 10.5 11.5 L 5.5 11.5 L 5.5 13.5 Z M 10.5 13.5 C 11.968 13.5 12.481 13.511 12.871 13.629 L 13.451 11.715 C 12.706 11.489 11.823 11.5 10.5 11.5 L 10.5 13.5 Z M 17 18 C 17 16.677 17.011 15.794 16.785 15.049 L 14.871 15.629 C 14.989 16.019 15 16.532 15 18 L 17 18 Z M 12.871 13.629 C 13.83 13.92 14.58 14.67 14.871 15.629 L 16.785 15.049 C 16.3 13.451 15.049 12.2 13.451 11.715 L 12.871 13.629 Z M 5.5 11.5 C 4.177 11.5 3.294 11.489 2.549 11.715 L 3.129 13.629 C 3.519 13.511 4.032 13.5 5.5 13.5 L 5.5 11.5 Z M 1 18 C 1 16.532 1.011 16.019 1.129 15.629 L -0.785 15.049 C -1.011 15.794 -1 16.677 -1 18 L 1 18 Z M 2.549 11.715 C 0.951 12.2 -0.3 13.451 -0.785 15.049 L 1.129 15.629 C 1.42 14.67 2.17 13.92 3.129 13.629 L 2.549 11.715 Z M 11.5 4.5 C 11.5 6.433 9.933 8 8 8 L 8 10 C 11.038 10 13.5 7.538 13.5 4.5 L 11.5 4.5 Z M 8 8 C 6.067 8 4.5 6.433 4.5 4.5 L 2.5 4.5 C 2.5 7.538 4.962 10 8 10 L 8 8 Z M 4.5 4.5 C 4.5 2.567 6.067 1 8 1 L 8 -1 C 4.962 -1 2.5 1.462 2.5 4.5 L 4.5 4.5 Z M 8 1 C 9.933 1 11.5 2.567 11.5 4.5 L 13.5 4.5 C 13.5 1.462 11.038 -1 8 -1 L 8 1 Z" fill="currentColor" fillRule="nonzero" transform="matrix(1 0 0 1 4 3)" />
        </symbol>
        <symbol id="i-sparkles" viewBox="0 0 24 24">
          <path d="M 1.5 20 C 1.5 20.552 1.948 21 2.5 21 C 3.052 21 3.5 20.552 3.5 20 L 1.5 20 Z M 3.5 15 C 3.5 14.448 3.052 14 2.5 14 C 1.948 14 1.5 14.448 1.5 15 L 3.5 15 Z M 1.5 5 C 1.5 5.552 1.948 6 2.5 6 C 3.052 6 3.5 5.552 3.5 5 L 1.5 5 Z M 3.5 0 C 3.5 -0.552 3.052 -1 2.5 -1 C 1.948 -1 1.5 -0.552 1.5 0 L 3.5 0 Z M 0 1.5 C -0.552 1.5 -1 1.948 -1 2.5 C -1 3.052 -0.552 3.5 0 3.5 L 0 1.5 Z M 5 3.5 C 5.552 3.5 6 3.052 6 2.5 C 6 1.948 5.552 1.5 5 1.5 L 5 3.5 Z M 0 16.5 C -0.552 16.5 -1 16.948 -1 17.5 C -1 18.052 -0.552 18.5 0 18.5 L 0 16.5 Z M 5 18.5 C 5.552 18.5 6 18.052 6 17.5 C 6 16.948 5.552 16.5 5 16.5 L 5 18.5 Z M 11 1 L 11.933 0.641 C 11.785 0.255 11.414 0 11 0 C 10.586 0 10.215 0.255 10.067 0.641 L 11 1 Z M 20 10 L 20.359 10.933 C 20.745 10.785 21 10.414 21 10 C 21 9.586 20.745 9.215 20.359 9.067 L 20 10 Z M 11 19 L 10.067 19.359 C 10.215 19.745 10.586 20 11 20 C 11.414 20 11.785 19.745 11.933 19.359 L 11 19 Z M 2 10 L 1.641 9.067 C 1.255 9.215 1 9.586 1 10 C 1 10.414 1.255 10.785 1.641 10.933 L 2 10 Z M 15.491 11.734 L 15.132 10.801 L 15.132 10.801 L 15.491 11.734 Z M 14.083 12.376 L 13.503 11.561 L 14.083 12.376 Z M 12.734 14.491 L 11.801 14.132 L 11.801 14.132 L 12.734 14.491 Z M 13.376 13.083 L 12.561 12.503 L 13.376 13.083 Z M 12.734 5.509 L 11.801 5.868 L 11.801 5.868 L 12.734 5.509 Z M 13.376 6.917 L 12.561 7.497 L 13.376 6.917 Z M 15.491 8.266 L 15.85 7.332 L 15.85 7.332 L 15.491 8.266 Z M 14.083 7.624 L 13.503 8.439 L 13.503 8.439 L 14.083 7.624 Z M 6.509 8.266 L 6.15 7.332 L 6.15 7.332 L 6.509 8.266 Z M 7.917 7.624 L 7.338 6.809 L 7.917 7.624 Z M 9.266 5.509 L 8.332 5.15 L 9.266 5.509 Z M 8.624 6.917 L 9.439 7.497 L 9.439 7.497 L 8.624 6.917 Z M 9.266 14.491 L 8.332 14.85 L 8.332 14.85 L 9.266 14.491 Z M 8.624 13.083 L 9.439 12.503 L 8.624 13.083 Z M 6.509 11.734 L 6.868 10.801 L 6.868 10.801 L 6.509 11.734 Z M 7.917 12.376 L 8.497 11.561 L 8.497 11.561 L 7.917 12.376 Z M 3.5 20 L 3.5 15 L 1.5 15 L 1.5 20 L 3.5 20 Z M 3.5 5 L 3.5 0 L 1.5 0 L 1.5 5 L 3.5 5 Z M 0 3.5 L 5 3.5 L 5 1.5 L 0 1.5 L 0 3.5 Z M 0 18.5 L 5 18.5 L 5 16.5 L 0 16.5 L 0 18.5 Z M 11.933 18.641 L 10.199 14.132 L 8.332 14.85 L 10.067 19.359 L 11.933 18.641 Z M 6.868 10.801 L 2.359 9.067 L 1.641 10.933 L 6.15 12.668 L 6.868 10.801 Z M 2.359 10.933 L 6.868 9.199 L 6.15 7.332 L 1.641 9.067 L 2.359 10.933 Z M 10.199 5.868 L 11.933 1.359 L 10.067 0.641 L 8.332 5.15 L 10.199 5.868 Z M 10.067 1.359 L 11.801 5.868 L 13.668 5.15 L 11.933 0.641 L 10.067 1.359 Z M 15.132 9.199 L 19.641 10.933 L 20.359 9.067 L 15.85 7.332 L 15.132 9.199 Z M 19.641 9.067 L 15.132 10.801 L 15.85 12.668 L 20.359 10.933 L 19.641 9.067 Z M 11.801 14.132 L 10.067 18.641 L 11.933 19.359 L 13.668 14.85 L 11.801 14.132 Z M 15.132 10.801 C 14.447 11.064 13.939 11.252 13.503 11.561 L 14.662 13.191 C 14.844 13.062 15.069 12.968 15.85 12.668 L 15.132 10.801 Z M 13.668 14.85 C 13.968 14.069 14.062 13.844 14.191 13.662 L 12.561 12.503 C 12.252 12.939 12.064 13.447 11.801 14.132 L 13.668 14.85 Z M 13.503 11.561 C 13.139 11.821 12.821 12.139 12.561 12.503 L 14.191 13.662 C 14.321 13.48 14.48 13.321 14.662 13.191 L 13.503 11.561 Z M 11.801 5.868 C 12.064 6.553 12.252 7.061 12.561 7.497 L 14.191 6.338 C 14.062 6.156 13.968 5.931 13.668 5.15 L 11.801 5.868 Z M 15.85 7.332 C 15.069 7.032 14.844 6.938 14.662 6.809 L 13.503 8.439 C 13.939 8.748 14.447 8.936 15.132 9.199 L 15.85 7.332 Z M 12.561 7.497 C 12.821 7.861 13.139 8.179 13.503 8.439 L 14.662 6.809 C 14.48 6.679 14.321 6.52 14.191 6.338 L 12.561 7.497 Z M 6.868 9.199 C 7.553 8.936 8.061 8.748 8.497 8.439 L 7.338 6.809 C 7.156 6.938 6.931 7.032 6.15 7.332 L 6.868 9.199 Z M 8.332 5.15 C 8.032 5.931 7.938 6.156 7.809 6.338 L 9.439 7.497 C 9.748 7.061 9.936 6.553 10.199 5.868 L 8.332 5.15 Z M 8.497 8.439 C 8.861 8.179 9.179 7.861 9.439 7.497 L 7.809 6.338 C 7.679 6.52 7.52 6.679 7.338 6.809 L 8.497 8.439 Z M 10.199 14.132 C 9.936 13.447 9.748 12.939 9.439 12.503 L 7.809 13.662 C 7.938 13.844 8.032 14.069 8.332 14.85 L 10.199 14.132 Z M 6.15 12.668 C 6.931 12.968 7.156 13.062 7.338 13.191 L 8.497 11.561 C 8.061 11.252 7.553 11.064 6.868 10.801 L 6.15 12.668 Z M 9.439 12.503 C 9.179 12.139 8.861 11.821 8.497 11.561 L 7.338 13.191 C 7.52 13.321 7.679 13.48 7.809 13.662 L 9.439 12.503 Z" fill="currentColor" fillRule="nonzero" transform="matrix(1 0 0 1 2 2)" />
        </symbol>
        <symbol id="i-plus" viewBox="0 0 24 24">
          <path d="M 8 0 C 8 -0.552 7.552 -1 7 -1 C 6.448 -1 6 -0.552 6 0 L 8 0 Z M 6 14 C 6 14.552 6.448 15 7 15 C 7.552 15 8 14.552 8 14 L 6 14 Z M 0 6 C -0.552 6 -1 6.448 -1 7 C -1 7.552 -0.552 8 0 8 L 0 6 Z M 14 8 C 14.552 8 15 7.552 15 7 C 15 6.448 14.552 6 14 6 L 14 8 Z M 6 0 L 6 14 L 8 14 L 8 0 L 6 0 Z M 0 8 L 14 8 L 14 6 L 0 6 L 0 8 Z" fill="currentColor" fillRule="nonzero" transform="matrix(1 0 0 1 5 5)" />
        </symbol>
        <symbol id="i-down" viewBox="0 0 24 24">
          <path d="M 0.707 -0.707 C 0.317 -1.098 -0.317 -1.098 -0.707 -0.707 C -1.098 -0.317 -1.098 0.317 -0.707 0.707 L 0.707 -0.707 Z M 6 6 L 5.293 6.707 C 5.683 7.098 6.317 7.098 6.707 6.707 L 6 6 Z M 12.707 0.707 C 13.098 0.317 13.098 -0.317 12.707 -0.707 C 12.317 -1.098 11.683 -1.098 11.293 -0.707 L 12.707 0.707 Z M -0.707 0.707 L 5.293 6.707 L 6.707 5.293 L 0.707 -0.707 L -0.707 0.707 Z M 6.707 6.707 L 12.707 0.707 L 11.293 -0.707 L 5.293 5.293 L 6.707 6.707 Z" fill="currentColor" fillRule="nonzero" transform="matrix(1 0 0 1 6 9)" />
        </symbol>
        <symbol id="i-up" viewBox="0 0 24 24">
          <path d="M 11.293 6.707 C 11.683 7.098 12.317 7.098 12.707 6.707 C 13.098 6.317 13.098 5.683 12.707 5.293 L 11.293 6.707 Z M 6 0 L 6.707 -0.707 C 6.317 -1.098 5.683 -1.098 5.293 -0.707 L 6 0 Z M -0.707 5.293 C -1.098 5.683 -1.098 6.317 -0.707 6.707 C -0.317 7.098 0.317 7.098 0.707 6.707 L -0.707 5.293 Z M 12.707 5.293 L 6.707 -0.707 L 5.293 0.707 L 11.293 6.707 L 12.707 5.293 Z M 5.293 -0.707 L -0.707 5.293 L 0.707 6.707 L 6.707 0.707 L 5.293 -0.707 Z" fill="currentColor" fillRule="nonzero" transform="matrix(1 0 0 1 6 9)" />
        </symbol>
        <symbol id="i-right" viewBox="0 0 24 24">
          <path d="M -0.707 11.293 C -1.098 11.683 -1.098 12.317 -0.707 12.707 C -0.317 13.098 0.317 13.098 0.707 12.707 L -0.707 11.293 Z M 6 6 L 6.707 6.707 C 7.098 6.317 7.098 5.683 6.707 5.293 L 6 6 Z M 0.707 -0.707 C 0.317 -1.098 -0.317 -1.098 -0.707 -0.707 C -1.098 -0.317 -1.098 0.317 -0.707 0.707 L 0.707 -0.707 Z M 0.707 12.707 L 6.707 6.707 L 5.293 5.293 L -0.707 11.293 L 0.707 12.707 Z M 6.707 5.293 L 0.707 -0.707 L -0.707 0.707 L 5.293 6.707 L 6.707 5.293 Z" fill="currentColor" fillRule="nonzero" transform="matrix(1 0 0 1 9 6)" />
        </symbol>
        <symbol id="i-left" viewBox="0 0 24 24">
          <path d="M 5.293 12.707 C 5.683 13.098 6.317 13.098 6.707 12.707 C 7.098 12.317 7.098 11.683 6.707 11.293 L 5.293 12.707 Z M 0 6 L -0.707 5.293 C -1.098 5.683 -1.098 6.317 -0.707 6.707 L 0 6 Z M 6.707 0.707 C 7.098 0.317 7.098 -0.317 6.707 -0.707 C 6.317 -1.098 5.683 -1.098 5.293 -0.707 L 6.707 0.707 Z M 6.707 11.293 L 0.707 5.293 L -0.707 6.707 L 5.293 12.707 L 6.707 11.293 Z M 0.707 6.707 L 6.707 0.707 L 5.293 -0.707 L -0.707 5.293 L 0.707 6.707 Z" fill="currentColor" fillRule="nonzero" transform="matrix(1 0 0 1 9 6)" />
        </symbol>
        <symbol id="i-first" viewBox="0 0 24 24">
          <path d="M 11.293 10.707 C 11.683 11.098 12.317 11.098 12.707 10.707 C 13.098 10.317 13.098 9.683 12.707 9.293 L 11.293 10.707 Z M 7 5 L 6.293 4.293 C 5.902 4.683 5.902 5.317 6.293 5.707 L 7 5 Z M 12.707 0.707 C 13.098 0.317 13.098 -0.317 12.707 -0.707 C 12.317 -1.098 11.683 -1.098 11.293 -0.707 L 12.707 0.707 Z M 4.293 10.707 C 4.683 11.098 5.317 11.098 5.707 10.707 C 6.098 10.317 6.098 9.683 5.707 9.293 L 4.293 10.707 Z M 0 5 L -0.707 4.293 C -1.098 4.683 -1.098 5.317 -0.707 5.707 L 0 5 Z M 5.707 0.707 C 6.098 0.317 6.098 -0.317 5.707 -0.707 C 5.317 -1.098 4.683 -1.098 4.293 -0.707 L 5.707 0.707 Z M 12.707 9.293 L 7.707 4.293 L 6.293 5.707 L 11.293 10.707 L 12.707 9.293 Z M 7.707 5.707 L 12.707 0.707 L 11.293 -0.707 L 6.293 4.293 L 7.707 5.707 Z M 5.707 9.293 L 0.707 4.293 L -0.707 5.707 L 4.293 10.707 L 5.707 9.293 Z M 0.707 5.707 L 5.707 0.707 L 4.293 -0.707 L -0.707 4.293 L 0.707 5.707 Z" fill="currentColor" fillRule="nonzero" transform="matrix(1 0 0 1 6 7)" />
        </symbol>
        <symbol id="i-last" viewBox="0 0 24 24">
          <path d="M -0.707 9.293 C -1.098 9.683 -1.098 10.317 -0.707 10.707 C -0.317 11.098 0.317 11.098 0.707 10.707 L -0.707 9.293 Z M 5 5 L 5.707 5.707 C 6.098 5.317 6.098 4.683 5.707 4.293 L 5 5 Z M 0.707 -0.707 C 0.317 -1.098 -0.317 -1.098 -0.707 -0.707 C -1.098 -0.317 -1.098 0.317 -0.707 0.707 L 0.707 -0.707 Z M 6.293 9.293 C 5.902 9.683 5.902 10.317 6.293 10.707 C 6.683 11.098 7.317 11.098 7.707 10.707 L 6.293 9.293 Z M 12 5 L 12.707 5.707 C 13.098 5.317 13.098 4.683 12.707 4.293 L 12 5 Z M 7.707 -0.707 C 7.317 -1.098 6.683 -1.098 6.293 -0.707 C 5.902 -0.317 5.902 0.317 6.293 0.707 L 7.707 -0.707 Z M 0.707 10.707 L 5.707 5.707 L 4.293 4.293 L -0.707 9.293 L 0.707 10.707 Z M 5.707 4.293 L 0.707 -0.707 L -0.707 0.707 L 4.293 5.707 L 5.707 4.293 Z M 7.707 10.707 L 12.707 5.707 L 11.293 4.293 L 6.293 9.293 L 7.707 10.707 Z M 12.707 4.293 L 7.707 -0.707 L 6.293 0.707 L 11.293 5.707 L 12.707 4.293 Z" fill="currentColor" fillRule="nonzero" transform="matrix(1 0 0 1 6 7)" />
        </symbol>
        <symbol id="i-selector" viewBox="0 0 24 24">
          <path d="M 0.707 10.293 C 0.317 9.902 -0.317 9.902 -0.707 10.293 C -1.098 10.683 -1.098 11.317 -0.707 11.707 L 0.707 10.293 Z M 5 16 L 4.293 16.707 C 4.683 17.098 5.317 17.098 5.707 16.707 L 5 16 Z M 10.707 11.707 C 11.098 11.317 11.098 10.683 10.707 10.293 C 10.317 9.902 9.683 9.902 9.293 10.293 L 10.707 11.707 Z M -0.707 4.293 C -1.098 4.683 -1.098 5.317 -0.707 5.707 C -0.317 6.098 0.317 6.098 0.707 5.707 L -0.707 4.293 Z M 5 0 L 5.707 -0.707 C 5.317 -1.098 4.683 -1.098 4.293 -0.707 L 5 0 Z M 9.293 5.707 C 9.683 6.098 10.317 6.098 10.707 5.707 C 11.098 5.317 11.098 4.683 10.707 4.293 L 9.293 5.707 Z M -0.707 11.707 L 4.293 16.707 L 5.707 15.293 L 0.707 10.293 L -0.707 11.707 Z M 5.707 16.707 L 10.707 11.707 L 9.293 10.293 L 4.293 15.293 L 5.707 16.707 Z M 0.707 5.707 L 5.707 0.707 L 4.293 -0.707 L -0.707 4.293 L 0.707 5.707 Z M 4.293 0.707 L 9.293 5.707 L 10.707 4.293 L 5.707 -0.707 L 4.293 0.707 Z" fill="currentColor" fillRule="nonzero" transform="matrix(1 0 0 1 7 4)" />
        </symbol>
        <symbol id="i-refresh" viewBox="0 0 24 24">
          <path d="M 15.366 2.638 L 16.074 1.931 L 16.074 1.931 L 15.366 2.638 Z M 19 7 L 19 8 C 19.552 8 20 7.552 20 7 L 19 7 Z M 18.609 11.777 C 18.762 11.247 18.456 10.692 17.925 10.539 C 17.395 10.386 16.841 10.692 16.687 11.223 L 18.609 11.777 Z M 20 1 C 20 0.448 19.552 0 19 0 C 18.448 0 18 0.448 18 1 L 20 1 Z M 13 6 C 12.448 6 12 6.448 12 7 C 12 7.552 12.448 8 13 8 L 13 6 Z M -1 9 C -1 14.523 3.477 19 9 19 L 9 17 C 4.582 17 1 13.418 1 9 L -1 9 Z M 9 -1 C 3.477 -1 -1 3.477 -1 9 L 1 9 C 1 4.582 4.582 1 9 1 L 9 -1 Z M 16.074 1.931 C 14.265 0.121 11.762 -1 9 -1 L 9 1 C 11.21 1 13.21 1.895 14.659 3.345 L 16.074 1.931 Z M 14.659 3.345 C 15.432 4.119 16.312 5.173 17.011 6.053 C 17.358 6.489 17.654 6.875 17.864 7.152 C 17.969 7.29 18.052 7.401 18.109 7.477 C 18.137 7.515 18.159 7.544 18.173 7.563 C 18.18 7.573 18.185 7.58 18.189 7.585 C 18.191 7.588 18.192 7.589 18.193 7.59 C 18.193 7.591 18.194 7.591 18.194 7.592 C 18.194 7.592 18.194 7.592 18.194 7.592 C 18.194 7.592 18.194 7.592 18.194 7.592 C 18.194 7.592 18.194 7.592 19 7 C 19.806 6.408 19.806 6.408 19.806 6.408 C 19.806 6.408 19.806 6.408 19.806 6.408 C 19.806 6.408 19.806 6.408 19.806 6.407 C 19.805 6.407 19.805 6.406 19.804 6.406 C 19.803 6.404 19.801 6.402 19.799 6.399 C 19.795 6.393 19.789 6.385 19.781 6.375 C 19.765 6.353 19.742 6.322 19.713 6.282 C 19.653 6.202 19.567 6.087 19.458 5.944 C 19.241 5.657 18.935 5.259 18.577 4.808 C 17.866 3.914 16.929 2.788 16.074 1.931 L 14.659 3.345 Z M 9 19 C 13.56 19 17.405 15.948 18.609 11.777 L 16.687 11.223 C 15.724 14.56 12.646 17 9 17 L 9 19 Z M 18 1 L 18 7 L 20 7 L 20 1 L 18 1 Z M 19 6 L 13 6 L 13 8 L 19 8 L 19 6 Z" fill="currentColor" fillRule="nonzero" transform="matrix(1 0 0 1 2 3)" />
        </symbol>
        <symbol id="i-check" viewBox="0 0 24 24">
          <path d="M 16.707 0.707 C 17.098 0.317 17.098 -0.317 16.707 -0.707 C 16.317 -1.098 15.683 -1.098 15.293 -0.707 L 16.707 0.707 Z M 5 11 L 4.293 11.707 C 4.683 12.098 5.317 12.098 5.707 11.707 L 5 11 Z M 0.707 5.293 C 0.317 4.902 -0.317 4.902 -0.707 5.293 C -1.098 5.683 -1.098 6.317 -0.707 6.707 L 0.707 5.293 Z M 15.293 -0.707 L 4.293 10.293 L 5.707 11.707 L 16.707 0.707 L 15.293 -0.707 Z M 5.707 10.293 L 0.707 5.293 L -0.707 6.707 L 4.293 11.707 L 5.707 10.293 Z" fill="currentColor" fillRule="nonzero" transform="matrix(1 0 0 1 4 6)" />
        </symbol>
        <symbol id="i-chart" viewBox="0 0 24 24">
          <path d="M 6 5 C 6.552 5 7 4.552 7 4 C 7 3.448 6.552 3 6 3 L 6 5 Z M 0.546 17.891 L 1 17 L 1 17 L 0.546 17.891 Z M 0.109 17.454 L -0.782 17.908 L -0.782 17.908 L 0.109 17.454 Z M 0.546 4.109 L 1 5 L 1 5 L 0.546 4.109 Z M 0.109 4.546 L -0.782 4.092 L -0.782 4.092 L 0.109 4.546 Z M 12 7 C 11.448 7 11 7.448 11 8 C 11 8.552 11.448 9 12 9 L 12 7 Z M 17.891 17.454 L 18.782 17.908 L 18.782 17.908 L 17.891 17.454 Z M 17.454 17.891 L 17 17 L 17 17 L 17.454 17.891 Z M 17.454 8.109 L 17.908 7.218 L 17.908 7.218 L 17.454 8.109 Z M 17.891 8.546 L 17 9 L 17 9 L 17.891 8.546 Z M 10.4 0 L 10.4 1 L 10.4 0 Z M 11.454 0.109 L 11.908 -0.782 L 11.454 0.109 Z M 12 1.6 L 11 1.6 L 11 1.6 L 12 1.6 Z M 11.891 0.546 L 11 1 L 11.891 0.546 Z M 7.6 0 L 7.6 -1 L 7.6 0 Z M 6.546 0.109 L 6.092 -0.782 L 6.092 -0.782 L 6.546 0.109 Z M 6 1.6 L 7 1.6 L 7 1.6 L 6 1.6 Z M 6.109 0.546 L 7 1 L 6.109 0.546 Z M 1.6 5 L 6 5 L 6 3 L 1.6 3 L 1.6 5 Z M 6 17 L 1.6 17 L 1.6 19 L 6 19 L 6 17 Z M 1 16.4 L 1 5.6 L -1 5.6 L -1 16.4 L 1 16.4 Z M 1.6 17 C 1.303 17 1.141 16.999 1.025 16.99 C 0.92 16.981 0.942 16.971 1 17 L 0.092 18.782 C 0.363 18.92 0.633 18.964 0.862 18.983 C 1.079 19.001 1.336 19 1.6 19 L 1.6 17 Z M -1 16.4 C -1 16.664 -1.001 16.921 -0.983 17.138 C -0.964 17.367 -0.92 17.637 -0.782 17.908 L 1 17 C 1.029 17.058 1.019 17.08 1.01 16.975 C 1.001 16.859 1 16.697 1 16.4 L -1 16.4 Z M 1 17 L 1 17 L -0.782 17.908 C -0.59 18.284 -0.284 18.59 0.092 18.782 L 1 17 Z M 1.6 3 C 1.336 3 1.079 2.999 0.862 3.017 C 0.633 3.036 0.363 3.08 0.092 3.218 L 1 5 C 0.942 5.029 0.92 5.019 1.025 5.01 C 1.141 5.001 1.303 5 1.6 5 L 1.6 3 Z M 1 5.6 C 1 5.303 1.001 5.141 1.01 5.025 C 1.019 4.92 1.029 4.942 1 5 L -0.782 4.092 C -0.92 4.363 -0.964 4.633 -0.983 4.862 C -1.001 5.079 -1 5.336 -1 5.6 L 1 5.6 Z M 0.092 3.218 C -0.284 3.41 -0.59 3.716 -0.782 4.092 L 1 5 L 1 5 L 0.092 3.218 Z M 12 9 L 16.4 9 L 16.4 7 L 12 7 L 12 9 Z M 17 9.6 L 17 16.4 L 19 16.4 L 19 9.6 L 17 9.6 Z M 16.4 17 L 12 17 L 12 19 L 16.4 19 L 16.4 17 Z M 17 16.4 C 17 16.697 16.999 16.859 16.99 16.975 C 16.981 17.08 16.971 17.058 17 17 L 18.782 17.908 C 18.92 17.637 18.964 17.367 18.983 17.138 C 19.001 16.921 19 16.664 19 16.4 L 17 16.4 Z M 16.4 19 C 16.664 19 16.921 19.001 17.138 18.983 C 17.367 18.964 17.637 18.92 17.908 18.782 L 17 17 C 17.058 16.971 17.08 16.981 16.975 16.99 C 16.859 16.999 16.697 17 16.4 17 L 16.4 19 Z M 17 17 L 17 17 L 17.908 18.782 C 18.284 18.59 18.59 18.284 18.782 17.908 L 17 17 Z M 16.4 9 C 16.697 9 16.859 9.001 16.975 9.01 C 17.08 9.019 17.058 9.029 17 9 L 17.908 7.218 C 17.637 7.08 17.367 7.036 17.138 7.017 C 16.921 6.999 16.664 7 16.4 7 L 16.4 9 Z M 19 9.6 C 19 9.336 19.001 9.079 18.983 8.862 C 18.964 8.633 18.92 8.363 18.782 8.092 L 17 9 C 16.971 8.942 16.981 8.92 16.99 9.025 C 16.999 9.141 17 9.303 17 9.6 L 19 9.6 Z M 17 9 L 17 9 L 18.782 8.092 C 18.59 7.716 18.284 7.41 17.908 7.218 L 17 9 Z M 7.6 1 L 10.4 1 L 10.4 -1 L 7.6 -1 L 7.6 1 Z M 11 1.6 L 11 18 L 13 18 L 13 1.6 L 11 1.6 Z M 12 17 L 6 17 L 6 19 L 12 19 L 12 17 Z M 7 18 L 7 1.6 L 5 1.6 L 5 18 L 7 18 Z M 10.4 1 C 10.697 1 10.859 1.001 10.975 1.01 C 11.08 1.019 11.058 1.029 11 1 L 11.908 -0.782 C 11.637 -0.92 11.367 -0.964 11.138 -0.983 C 10.921 -1.001 10.664 -1 10.4 -1 L 10.4 1 Z M 13 1.6 C 13 1.336 13.001 1.079 12.983 0.862 C 12.964 0.633 12.92 0.363 12.782 0.092 L 11 1 C 10.971 0.942 10.981 0.92 10.99 1.025 C 10.999 1.141 11 1.303 11 1.6 L 13 1.6 Z M 11 1 L 11 1 L 12.782 0.092 C 12.59 -0.284 12.284 -0.59 11.908 -0.782 L 11 1 Z M 7.6 -1 C 7.336 -1 7.079 -1.001 6.862 -0.983 C 6.633 -0.964 6.363 -0.92 6.092 -0.782 L 7 1 C 6.942 1.029 6.92 1.019 7.025 1.01 C 7.141 1.001 7.303 1 7.6 1 L 7.6 -1 Z M 7 1.6 C 7 1.303 7.001 1.141 7.01 1.025 C 7.019 0.92 7.029 0.942 7 1 L 5.218 0.092 C 5.08 0.363 5.036 0.633 5.017 0.862 C 4.999 1.079 5 1.336 5 1.6 L 7 1.6 Z M 6.092 -0.782 C 5.716 -0.59 5.41 -0.284 5.218 0.092 L 7 1 L 7 1 L 6.092 -0.782 Z" fill="currentColor" fillRule="nonzero" transform="matrix(1 0 0 1 3 3)" />
        </symbol>
        <symbol id="i-copy" viewBox="0 0 24 24">
          <path d="M 3 14 C 3.552 14 4 13.552 4 13 C 4 12.448 3.552 12 3 12 L 3 14 Z M 1.235 12.848 L 0.852 13.772 L 0.852 13.772 L 1.235 12.848 Z M 0.152 11.765 L -0.772 12.148 L -0.772 12.148 L 0.152 11.765 Z M 1.092 0.218 L 0.638 -0.673 L 0.638 -0.673 L 1.092 0.218 Z M 0.218 1.092 L -0.673 0.638 L -0.673 0.638 L 0.218 1.092 Z M 11.765 0.152 L 12.148 -0.772 L 12.148 -0.772 L 11.765 0.152 Z M 12 3 C 12 3.552 12.448 4 13 4 C 13.552 4 14 3.552 14 3 L 12 3 Z M 12.848 1.235 L 13.772 0.852 L 13.772 0.852 L 12.848 1.235 Z M 8.092 19.782 L 8.546 18.891 L 8.092 19.782 Z M 7.218 18.908 L 8.109 18.454 L 7.218 18.908 Z M 19.782 18.908 L 18.891 18.454 L 19.782 18.908 Z M 18.908 19.782 L 18.454 18.891 L 18.908 19.782 Z M 18.908 7.218 L 18.454 8.109 L 18.908 7.218 Z M 19.782 8.092 L 18.891 8.546 L 19.782 8.092 Z M 8.092 7.218 L 8.546 8.109 L 8.092 7.218 Z M 7.218 8.092 L 8.109 8.546 L 7.218 8.092 Z M 10 -1 L 3.2 -1 L 3.2 1 L 10 1 L 10 -1 Z M -1 3.2 L -1 10 L 1 10 L 1 3.2 L -1 3.2 Z M 3 12 C 2.52 12 2.211 11.999 1.974 11.983 C 1.746 11.968 1.659 11.941 1.617 11.924 L 0.852 13.772 C 1.178 13.907 1.508 13.956 1.838 13.979 C 2.158 14.001 2.548 14 3 14 L 3 12 Z M -1 10 C -1 10.452 -1.001 10.842 -0.979 11.162 C -0.956 11.492 -0.907 11.822 -0.772 12.148 L 1.076 11.383 C 1.059 11.341 1.032 11.254 1.017 11.026 C 1.001 10.789 1 10.48 1 10 L -1 10 Z M 1.617 11.924 C 1.372 11.822 1.178 11.628 1.076 11.383 L -0.772 12.148 C -0.467 12.883 0.117 13.467 0.852 13.772 L 1.617 11.924 Z M 3.2 -1 C 2.656 -1 2.189 -1.001 1.805 -0.969 C 1.41 -0.937 1.016 -0.866 0.638 -0.673 L 1.546 1.109 C 1.595 1.084 1.696 1.046 1.968 1.024 C 2.251 1.001 2.623 1 3.2 1 L 3.2 -1 Z M 1 3.2 C 1 2.623 1.001 2.251 1.024 1.968 C 1.046 1.696 1.084 1.595 1.109 1.546 L -0.673 0.638 C -0.866 1.016 -0.937 1.41 -0.969 1.805 C -1.001 2.189 -1 2.656 -1 3.2 L 1 3.2 Z M 0.638 -0.673 C 0.074 -0.385 -0.385 0.074 -0.673 0.638 L 1.109 1.546 C 1.205 1.358 1.358 1.205 1.546 1.109 L 0.638 -0.673 Z M 10 1 C 10.48 1 10.789 1.001 11.026 1.017 C 11.254 1.032 11.341 1.059 11.383 1.076 L 12.148 -0.772 C 11.822 -0.907 11.492 -0.956 11.162 -0.979 C 10.842 -1.001 10.452 -1 10 -1 L 10 1 Z M 14 3 C 14 2.548 14.001 2.158 13.979 1.838 C 13.956 1.508 13.907 1.178 13.772 0.852 L 11.924 1.617 C 11.941 1.659 11.968 1.746 11.983 1.974 C 11.999 2.211 12 2.52 12 3 L 14 3 Z M 11.383 1.076 C 11.628 1.178 11.822 1.372 11.924 1.617 L 13.772 0.852 C 13.467 0.117 12.883 -0.467 12.148 -0.772 L 11.383 1.076 Z M 10.2 8 L 16.8 8 L 16.8 6 L 10.2 6 L 10.2 8 Z M 19 10.2 L 19 16.8 L 21 16.8 L 21 10.2 L 19 10.2 Z M 16.8 19 L 10.2 19 L 10.2 21 L 16.8 21 L 16.8 19 Z M 8 16.8 L 8 10.2 L 6 10.2 L 6 16.8 L 8 16.8 Z M 10.2 19 C 9.623 19 9.251 18.999 8.968 18.976 C 8.696 18.954 8.595 18.916 8.546 18.891 L 7.638 20.673 C 8.016 20.866 8.41 20.937 8.805 20.969 C 9.189 21.001 9.656 21 10.2 21 L 10.2 19 Z M 6 16.8 C 6 17.344 5.999 17.811 6.031 18.195 C 6.063 18.59 6.134 18.984 6.327 19.362 L 8.109 18.454 C 8.084 18.405 8.046 18.304 8.024 18.032 C 8.001 17.749 8 17.377 8 16.8 L 6 16.8 Z M 8.546 18.891 C 8.358 18.795 8.205 18.642 8.109 18.454 L 6.327 19.362 C 6.615 19.926 7.074 20.385 7.638 20.673 L 8.546 18.891 Z M 19 16.8 C 19 17.377 18.999 17.749 18.976 18.032 C 18.954 18.304 18.916 18.405 18.891 18.454 L 20.673 19.362 C 20.866 18.984 20.937 18.59 20.969 18.195 C 21.001 17.811 21 17.344 21 16.8 L 19 16.8 Z M 16.8 21 C 17.344 21 17.811 21.001 18.195 20.969 C 18.59 20.937 18.984 20.866 19.362 20.673 L 18.454 18.891 C 18.405 18.916 18.304 18.954 18.032 18.976 C 17.749 18.999 17.377 19 16.8 19 L 16.8 21 Z M 18.891 18.454 C 18.795 18.642 18.642 18.795 18.454 18.891 L 19.362 20.673 C 19.926 20.385 20.385 19.926 20.673 19.362 L 18.891 18.454 Z M 16.8 8 C 17.377 8 17.749 8.001 18.032 8.024 C 18.304 8.046 18.405 8.084 18.454 8.109 L 19.362 6.327 C 18.984 6.134 18.59 6.063 18.195 6.031 C 17.811 5.999 17.344 6 16.8 6 L 16.8 8 Z M 21 10.2 C 21 9.656 21.001 9.189 20.969 8.805 C 20.937 8.41 20.866 8.016 20.673 7.638 L 18.891 8.546 C 18.916 8.595 18.954 8.696 18.976 8.968 C 18.999 9.251 19 9.623 19 10.2 L 21 10.2 Z M 18.454 8.109 C 18.642 8.205 18.795 8.358 18.891 8.546 L 20.673 7.638 C 20.385 7.074 19.926 6.615 19.362 6.327 L 18.454 8.109 Z M 10.2 6 C 9.656 6 9.189 5.999 8.805 6.031 C 8.41 6.063 8.016 6.134 7.638 6.327 L 8.546 8.109 C 8.595 8.084 8.696 8.046 8.968 8.024 C 9.251 8.001 9.623 8 10.2 8 L 10.2 6 Z M 8 10.2 C 8 9.623 8.001 9.251 8.024 8.968 C 8.046 8.696 8.084 8.595 8.109 8.546 L 6.327 7.638 C 6.134 8.016 6.063 8.41 6.031 8.805 C 5.999 9.189 6 9.656 6 10.2 L 8 10.2 Z M 7.638 6.327 C 7.074 6.615 6.615 7.074 6.327 7.638 L 8.109 8.546 C 8.205 8.358 8.358 8.205 8.546 8.109 L 7.638 6.327 Z" fill="currentColor" fillRule="nonzero" transform="matrix(1 0 0 1 2 2)" />
        </symbol>
        <symbol id="i-back" viewBox="0 0 24 24">
          <path d="M 14 8 C 14.552 8 15 7.552 15 7 C 15 6.448 14.552 6 14 6 L 14 8 Z M 0 7 L -0.707 6.293 C -1.098 6.683 -1.098 7.317 -0.707 7.707 L 0 7 Z M 6.293 14.707 C 6.683 15.098 7.317 15.098 7.707 14.707 C 8.098 14.317 8.098 13.683 7.707 13.293 L 6.293 14.707 Z M 7.707 0.707 C 8.098 0.317 8.098 -0.317 7.707 -0.707 C 7.317 -1.098 6.683 -1.098 6.293 -0.707 L 7.707 0.707 Z M 14 6 L 0 6 L 0 8 L 14 8 L 14 6 Z M 7.707 13.293 L 0.707 6.293 L -0.707 7.707 L 6.293 14.707 L 7.707 13.293 Z M 0.707 7.707 L 7.707 0.707 L 6.293 -0.707 L -0.707 6.293 L 0.707 7.707 Z" fill="currentColor" fillRule="nonzero" transform="matrix(1 0 0 1 5 5)" />
        </symbol>
        <symbol id="i-stack" viewBox="0 0 24 24">
          <path d="M 0.447 9.047 C -0.047 8.8 -0.647 9 -0.894 9.494 C -1.141 9.988 -0.941 10.588 -0.447 10.835 L 0.447 9.047 Z M 20.447 10.835 C 20.941 10.588 21.141 9.988 20.894 9.494 C 20.647 9 20.047 8.8 19.553 9.047 L 20.447 10.835 Z M 9.908 14.873 L 9.723 15.856 L 9.908 14.873 Z M 10.092 14.873 L 10.277 15.856 L 10.092 14.873 Z M 0.447 14.047 C -0.047 13.8 -0.647 14 -0.894 14.494 C -1.141 14.988 -0.941 15.588 -0.447 15.835 L 0.447 14.047 Z M 20.447 15.835 C 20.941 15.588 21.141 14.988 20.894 14.494 C 20.647 14 20.047 13.8 19.553 14.047 L 20.447 15.835 Z M 9.642 19.762 L 9.195 20.657 L 9.195 20.657 L 9.642 19.762 Z M 9.908 19.873 L 9.723 20.856 L 9.908 19.873 Z M 10.358 19.762 L 10.805 20.657 L 10.805 20.657 L 10.358 19.762 Z M 10.092 19.873 L 10.277 20.856 L 10.092 19.873 Z M 0 4.941 L -0.447 4.047 C -0.786 4.216 -1 4.562 -1 4.941 C -1 5.32 -0.786 5.666 -0.447 5.835 L 0 4.941 Z M 20 4.941 L 20.447 5.835 C 20.786 5.666 21 5.32 21 4.941 C 21 4.562 20.786 4.216 20.447 4.047 L 20 4.941 Z M 9.908 9.873 L 9.723 10.856 L 9.908 9.873 Z M 10.092 9.873 L 10.277 10.856 L 10.092 9.873 Z M 9.642 0.12 L 10.089 1.014 L 9.642 0.12 Z M 9.908 0.009 L 9.723 -0.974 L 9.908 0.009 Z M 10.358 0.12 L 9.911 1.014 L 10.358 0.12 Z M 10.092 0.009 L 10.277 -0.974 L 10.092 0.009 Z M -0.447 10.835 L 9.195 15.657 L 10.089 13.868 L 0.447 9.047 L -0.447 10.835 Z M 10.805 15.657 L 20.447 10.835 L 19.553 9.047 L 9.911 13.868 L 10.805 15.657 Z M 9.195 15.657 C 9.274 15.696 9.485 15.811 9.723 15.856 L 10.092 13.891 C 10.107 13.893 10.122 13.897 10.135 13.9 C 10.149 13.904 10.16 13.907 10.17 13.91 C 10.188 13.917 10.199 13.921 10.197 13.921 C 10.197 13.92 10.194 13.919 10.189 13.917 C 10.184 13.914 10.177 13.911 10.167 13.906 C 10.158 13.902 10.147 13.896 10.134 13.89 C 10.12 13.883 10.106 13.876 10.089 13.868 L 9.195 15.657 Z M 9.911 13.868 C 9.894 13.876 9.88 13.883 9.866 13.89 C 9.853 13.896 9.842 13.902 9.833 13.906 C 9.823 13.911 9.816 13.914 9.811 13.917 C 9.806 13.919 9.803 13.92 9.803 13.921 C 9.801 13.921 9.812 13.917 9.83 13.91 C 9.84 13.907 9.851 13.904 9.865 13.9 C 9.878 13.897 9.893 13.893 9.908 13.891 L 10.277 15.856 C 10.515 15.811 10.726 15.696 10.805 15.657 L 9.911 13.868 Z M 9.723 15.856 C 9.906 15.891 10.094 15.891 10.277 15.856 L 9.908 13.891 C 9.969 13.879 10.031 13.879 10.092 13.891 L 9.723 15.856 Z M -0.447 15.835 L 9.195 20.657 L 10.089 18.868 L 0.447 14.047 L -0.447 15.835 Z M 10.805 20.657 L 20.447 15.835 L 19.553 14.047 L 9.911 18.868 L 10.805 20.657 Z M 9.195 20.657 C 9.274 20.696 9.485 20.811 9.723 20.856 L 10.092 18.891 C 10.107 18.893 10.122 18.897 10.135 18.9 C 10.149 18.904 10.16 18.907 10.17 18.91 C 10.188 18.917 10.199 18.921 10.197 18.921 C 10.197 18.92 10.194 18.919 10.189 18.917 C 10.184 18.914 10.177 18.911 10.167 18.906 C 10.158 18.902 10.147 18.896 10.134 18.89 C 10.12 18.883 10.106 18.876 10.089 18.868 L 9.195 20.657 Z M 9.911 18.868 C 9.894 18.876 9.88 18.883 9.866 18.89 C 9.853 18.896 9.842 18.902 9.833 18.906 C 9.823 18.911 9.816 18.914 9.811 18.917 C 9.806 18.919 9.803 18.92 9.803 18.921 C 9.801 18.921 9.812 18.917 9.83 18.91 C 9.84 18.907 9.851 18.904 9.865 18.9 C 9.878 18.897 9.893 18.893 9.908 18.891 L 10.277 20.856 C 10.515 20.811 10.726 20.696 10.805 20.657 L 9.911 18.868 Z M 9.723 20.856 C 9.906 20.891 10.094 20.891 10.277 20.856 L 9.908 18.891 C 9.969 18.879 10.031 18.879 10.092 18.891 L 9.723 20.856 Z M 9.195 -0.775 L -0.447 4.047 L 0.447 5.835 L 10.089 1.014 L 9.195 -0.775 Z M -0.447 5.835 L 9.195 10.657 L 10.089 8.868 L 0.447 4.047 L -0.447 5.835 Z M 10.805 10.657 L 20.447 5.835 L 19.553 4.047 L 9.911 8.868 L 10.805 10.657 Z M 20.447 4.047 L 10.805 -0.775 L 9.911 1.014 L 19.553 5.835 L 20.447 4.047 Z M 9.195 10.657 C 9.274 10.696 9.485 10.811 9.723 10.856 L 10.092 8.891 C 10.107 8.893 10.122 8.897 10.135 8.9 C 10.149 8.904 10.16 8.907 10.17 8.91 C 10.188 8.917 10.199 8.921 10.197 8.921 C 10.197 8.92 10.194 8.919 10.189 8.917 C 10.184 8.914 10.177 8.911 10.167 8.906 C 10.158 8.902 10.147 8.896 10.134 8.89 C 10.12 8.883 10.106 8.876 10.089 8.868 L 9.195 10.657 Z M 9.911 8.868 C 9.894 8.876 9.88 8.883 9.866 8.89 C 9.853 8.896 9.842 8.902 9.833 8.906 C 9.823 8.911 9.816 8.914 9.811 8.917 C 9.806 8.919 9.803 8.92 9.803 8.921 C 9.801 8.921 9.812 8.917 9.83 8.91 C 9.84 8.907 9.851 8.904 9.865 8.9 C 9.878 8.897 9.893 8.893 9.908 8.891 L 10.277 10.856 C 10.515 10.811 10.726 10.696 10.805 10.657 L 9.911 8.868 Z M 9.723 10.856 C 9.906 10.891 10.094 10.891 10.277 10.856 L 9.908 8.891 C 9.969 8.879 10.031 8.879 10.092 8.891 L 9.723 10.856 Z M 10.089 1.014 C 10.106 1.006 10.12 0.999 10.134 0.992 C 10.147 0.986 10.158 0.98 10.167 0.976 C 10.177 0.971 10.184 0.968 10.189 0.965 C 10.194 0.963 10.197 0.962 10.197 0.961 C 10.199 0.961 10.188 0.965 10.17 0.972 C 10.16 0.975 10.149 0.978 10.135 0.982 C 10.122 0.985 10.107 0.989 10.092 0.991 L 9.723 -0.974 C 9.485 -0.929 9.274 -0.814 9.195 -0.775 L 10.089 1.014 Z M 10.805 -0.775 C 10.726 -0.814 10.515 -0.929 10.277 -0.974 L 9.908 0.991 C 9.893 0.989 9.878 0.985 9.865 0.982 C 9.851 0.978 9.84 0.975 9.83 0.972 C 9.812 0.965 9.801 0.961 9.803 0.961 C 9.803 0.962 9.806 0.963 9.811 0.965 C 9.816 0.968 9.823 0.971 9.833 0.976 C 9.842 0.98 9.853 0.986 9.866 0.992 C 9.88 0.999 9.894 1.006 9.911 1.014 L 10.805 -0.775 Z M 10.092 0.991 C 10.031 1.003 9.969 1.003 9.908 0.991 L 10.277 -0.974 C 10.094 -1.009 9.906 -1.009 9.723 -0.974 L 10.092 0.991 Z" fill="currentColor" fillRule="nonzero" transform="matrix(1 0 0 1 2 2.059)" />
        </symbol>
        <symbol id="i-clock" viewBox="0 0 24 24">
          <path d="M 11 4 C 11 3.448 10.552 3 10 3 C 9.448 3 9 3.448 9 4 L 11 4 Z M 10 10 L 9 10 C 9 10.379 9.214 10.725 9.553 10.894 L 10 10 Z M 13.553 12.894 C 14.047 13.141 14.647 12.941 14.894 12.447 C 15.141 11.953 14.941 11.353 14.447 11.106 L 13.553 12.894 Z M 19 10 C 19 14.971 14.971 19 10 19 L 10 21 C 16.075 21 21 16.075 21 10 L 19 10 Z M 10 19 C 5.029 19 1 14.971 1 10 L -1 10 C -1 16.075 3.925 21 10 21 L 10 19 Z M 1 10 C 1 5.029 5.029 1 10 1 L 10 -1 C 3.925 -1 -1 3.925 -1 10 L 1 10 Z M 10 1 C 14.971 1 19 5.029 19 10 L 21 10 C 21 3.925 16.075 -1 10 -1 L 10 1 Z M 9 4 L 9 10 L 11 10 L 11 4 L 9 4 Z M 9.553 10.894 L 13.553 12.894 L 14.447 11.106 L 10.447 9.106 L 9.553 10.894 Z" fill="currentColor" fillRule="nonzero" transform="matrix(1 0 0 1 2 2)" />
        </symbol>
        <symbol id="i-trophy" viewBox="0 0 24 24">
          <path d="M 15.342 0.06 L 15.684 -0.879 L 15.342 0.06 Z M 15.94 0.658 L 16.879 0.316 L 15.94 0.658 Z M 4.658 0.06 L 4.316 -0.879 L 4.658 0.06 Z M 4.06 0.658 L 3.121 0.316 L 4.06 0.658 Z M 16 1 C 15.448 1 15 1.448 15 2 C 15 2.552 15.448 3 16 3 L 16 1 Z M 19.898 5.776 L 20.864 6.035 L 20.864 6.035 L 19.898 5.776 Z M 16 7 C 15.448 7 15 7.448 15 8 C 15 8.552 15.448 9 16 9 L 16 7 Z M 17.776 7.898 L 18.035 8.864 L 18.035 8.864 L 17.776 7.898 Z M 19.383 2.076 L 19.765 1.152 L 19.765 1.152 L 19.383 2.076 Z M 19.924 2.617 L 20.848 2.235 L 20.848 2.235 L 19.924 2.617 Z M 4 3 C 4.552 3 5 2.552 5 2 C 5 1.448 4.552 1 4 1 L 4 3 Z M 0.102 5.776 L 1.068 5.518 L 1.068 5.518 L 0.102 5.776 Z M 4 9 C 4.552 9 5 8.552 5 8 C 5 7.448 4.552 7 4 7 L 4 9 Z M 2.224 7.898 L 1.965 8.864 L 1.965 8.864 L 2.224 7.898 Z M 0.617 2.076 L 0.235 1.152 L 0.235 1.152 L 0.617 2.076 Z M 0.076 2.617 L -0.848 2.235 L -0.848 2.235 L 0.076 2.617 Z M 9 16 C 9 16.552 9.448 17 10 17 C 10.552 17 11 16.552 11 16 L 9 16 Z M 5.444 1 L 14.556 1 L 14.556 -1 L 5.444 -1 L 5.444 1 Z M 15 1.444 L 15 7 L 17 7 L 17 1.444 L 15 1.444 Z M 5 7 L 5 1.444 L 3 1.444 L 3 7 L 5 7 Z M 10 12 C 7.239 12 5 9.761 5 7 L 3 7 C 3 10.866 6.134 14 10 14 L 10 12 Z M 15 7 C 15 9.761 12.761 12 10 12 L 10 14 C 13.866 14 17 10.866 17 7 L 15 7 Z M 14.556 1 C 14.775 1 14.894 1 14.981 1.006 C 15.06 1.011 15.046 1.017 15 1 L 15.684 -0.879 C 15.311 -1.015 14.882 -1 14.556 -1 L 14.556 1 Z M 17 1.444 C 17 1.118 17.015 0.689 16.879 0.316 L 15 1 C 14.983 0.954 14.989 0.94 14.994 1.019 C 15 1.106 15 1.225 15 1.444 L 17 1.444 Z M 15 1 L 15 1 L 16.879 0.316 C 16.677 -0.24 16.24 -0.677 15.684 -0.879 L 15 1 Z M 5.444 -1 C 5.118 -1 4.689 -1.015 4.316 -0.879 L 5 1 C 4.954 1.017 4.94 1.011 5.019 1.006 C 5.106 1 5.225 1 5.444 1 L 5.444 -1 Z M 5 1.444 C 5 1.225 5 1.106 5.006 1.019 C 5.011 0.94 5.017 0.954 5 1 L 3.121 0.316 C 2.985 0.689 3 1.118 3 1.444 L 5 1.444 Z M 4.316 -0.879 C 3.76 -0.677 3.323 -0.24 3.121 0.316 L 5 1 L 5 1 L 4.316 -0.879 Z M 8.556 17 L 11.444 17 L 11.444 15 L 8.556 15 L 8.556 17 Z M 14.556 19 L 5.444 19 L 5.444 21 L 14.556 21 L 14.556 19 Z M 5.444 19 C 5.751 19 6 19.249 6 19.556 L 4 19.556 C 4 20.353 4.647 21 5.444 21 L 5.444 19 Z M 14 19.556 C 14 19.249 14.249 19 14.556 19 L 14.556 21 C 15.353 21 16 20.353 16 19.556 L 14 19.556 Z M 11.444 17 C 12.856 17 14 18.144 14 19.556 L 16 19.556 C 16 17.04 13.96 15 11.444 15 L 11.444 17 Z M 8.556 15 C 6.04 15 4 17.04 4 19.556 L 6 19.556 C 6 18.144 7.144 17 8.556 17 L 8.556 15 Z M 16 3 L 18.5 3 L 18.5 1 L 16 1 L 16 3 Z M 19 3.5 L 19 4 L 21 4 L 21 3.5 L 19 3.5 Z M 19 4 C 19 4.994 18.991 5.295 18.932 5.518 L 20.864 6.035 C 21.009 5.495 21 4.866 21 4 L 19 4 Z M 16 9 C 16.866 9 17.495 9.009 18.035 8.864 L 17.518 6.932 C 17.295 6.991 16.994 7 16 7 L 16 9 Z M 18.932 5.518 C 18.747 6.208 18.208 6.747 17.518 6.932 L 18.035 8.864 C 19.416 8.494 20.494 7.416 20.864 6.035 L 18.932 5.518 Z M 18.5 3 C 18.747 3 18.882 3.001 18.979 3.007 C 19.068 3.013 19.05 3.021 19 3 L 19.765 1.152 C 19.531 1.055 19.306 1.025 19.115 1.012 C 18.934 0.999 18.719 1 18.5 1 L 18.5 3 Z M 21 3.5 C 21 3.281 21.001 3.066 20.988 2.885 C 20.975 2.694 20.945 2.469 20.848 2.235 L 19 3 C 18.979 2.95 18.987 2.932 18.993 3.021 C 18.999 3.118 19 3.253 19 3.5 L 21 3.5 Z M 19 3 L 19 3 L 20.848 2.235 C 20.645 1.745 20.255 1.355 19.765 1.152 L 19 3 Z M 4 1 L 1.5 1 L 1.5 3 L 4 3 L 4 1 Z M -1 3.5 L -1 4 L 1 4 L 1 3.5 L -1 3.5 Z M -1 4 C -1 4.866 -1.009 5.495 -0.864 6.035 L 1.068 5.518 C 1.009 5.295 1 4.994 1 4 L -1 4 Z M 4 7 C 3.006 7 2.705 6.991 2.482 6.932 L 1.965 8.864 C 2.505 9.009 3.134 9 4 9 L 4 7 Z M -0.864 6.035 C -0.494 7.416 0.584 8.494 1.965 8.864 L 2.482 6.932 C 1.792 6.747 1.253 6.208 1.068 5.518 L -0.864 6.035 Z M 1.5 1 C 1.281 1 1.066 0.999 0.885 1.012 C 0.694 1.025 0.469 1.055 0.235 1.152 L 1 3 C 0.95 3.021 0.932 3.013 1.021 3.007 C 1.118 3.001 1.253 3 1.5 3 L 1.5 1 Z M 1 3.5 C 1 3.253 1.001 3.118 1.007 3.021 C 1.013 2.932 1.021 2.95 1 3 L -0.848 2.235 C -0.945 2.469 -0.975 2.694 -0.988 2.885 C -1.001 3.066 -1 3.281 -1 3.5 L 1 3.5 Z M 0.235 1.152 C -0.255 1.355 -0.645 1.745 -0.848 2.235 L 1 3 L 1 3 L 0.235 1.152 Z M 9 13 L 9 16 L 11 16 L 11 13 L 9 13 Z" fill="currentColor" fillRule="nonzero" transform="matrix(1 0 0 1 2 2)" />
        </symbol>
        <symbol id="i-pencil" viewBox="0 0 24 24">
          <path d="M 0 19.328 L -0.994 19.218 C -1.027 19.52 -0.922 19.821 -0.707 20.036 C -0.492 20.25 -0.191 20.356 0.11 20.322 L 0 19.328 Z M 5.294 18.035 L 4.587 17.328 L 5.294 18.035 Z M 4.683 18.588 L 5.233 19.423 L 4.683 18.588 Z M 3.384 18.952 L 3.495 19.946 L 3.495 19.946 L 3.384 18.952 Z M 4.198 18.821 L 3.89 17.87 L 4.198 18.821 Z M 1.294 14.035 L 0.587 13.328 L 0.587 13.328 L 1.294 14.035 Z M 0.741 14.646 L -0.094 14.095 L 0.741 14.646 Z M 0.376 15.944 L 1.37 16.054 L 1.37 16.054 L 0.376 15.944 Z M 0.508 15.131 L 1.459 15.439 L 0.508 15.131 Z M 18.5 4.828 L 19.207 5.536 L 18.5 4.828 Z M 14.5 0.828 L 15.207 1.536 L 15.207 1.536 L 14.5 0.828 Z M 2.001 14.742 L 15.207 1.536 L 13.793 0.121 L 0.587 13.328 L 2.001 14.742 Z M 17.793 4.121 L 4.587 17.328 L 6.001 18.742 L 19.207 5.536 L 17.793 4.121 Z M 3.274 17.959 L -0.11 18.335 L 0.11 20.322 L 3.495 19.946 L 3.274 17.959 Z M 0.994 19.439 L 1.37 16.054 L -0.618 15.834 L -0.994 19.218 L 0.994 19.439 Z M 4.587 17.328 C 4.264 17.65 4.198 17.71 4.132 17.753 L 5.233 19.423 C 5.507 19.242 5.735 19.008 6.001 18.742 L 4.587 17.328 Z M 3.495 19.946 C 3.868 19.905 4.194 19.873 4.506 19.772 L 3.89 17.87 C 3.816 17.894 3.727 17.908 3.274 17.959 L 3.495 19.946 Z M 4.132 17.753 C 4.057 17.803 3.976 17.842 3.89 17.87 L 4.506 19.772 C 4.763 19.689 5.008 19.571 5.233 19.423 L 4.132 17.753 Z M 0.587 13.328 C 0.321 13.593 0.086 13.821 -0.094 14.095 L 1.575 15.196 C 1.618 15.131 1.678 15.064 2.001 14.742 L 0.587 13.328 Z M 1.37 16.054 C 1.42 15.601 1.435 15.513 1.459 15.439 L -0.444 14.823 C -0.545 15.135 -0.576 15.46 -0.618 15.834 L 1.37 16.054 Z M -0.094 14.095 C -0.243 14.321 -0.361 14.565 -0.444 14.823 L 1.459 15.439 C 1.487 15.353 1.526 15.271 1.575 15.196 L -0.094 14.095 Z M 17.793 1.536 C 18.507 2.25 18.507 3.407 17.793 4.121 L 19.207 5.536 C 20.702 4.04 20.702 1.616 19.207 0.121 L 17.793 1.536 Z M 19.207 0.121 C 17.712 -1.374 15.288 -1.374 13.793 0.121 L 15.207 1.536 C 15.921 0.821 17.079 0.821 17.793 1.536 L 19.207 0.121 Z" fill="currentColor" fillRule="nonzero" transform="matrix(1 0 0 1 2.500 2.172)" />
        </symbol>
        <symbol id="i-user-plus" viewBox="0 0 24 24">
          <path d="M 10 13.5 C 10.552 13.5 11 13.052 11 12.5 C 11 11.948 10.552 11.5 10 11.5 L 10 13.5 Z M 2.839 12.672 L 3.129 13.629 L 2.839 12.672 Z M -1 18 C -1 18.552 -0.552 19 0 19 C 0.552 19 1 18.552 1 18 L -1 18 Z M 0.172 15.339 L 1.129 15.629 L 0.172 15.339 Z M 16 18 C 16 18.552 16.448 19 17 19 C 17.552 19 18 18.552 18 18 L 16 18 Z M 18 12 C 18 11.448 17.552 11 17 11 C 16.448 11 16 11.448 16 12 L 18 12 Z M 14 14 C 13.448 14 13 14.448 13 15 C 13 15.552 13.448 16 14 16 L 14 14 Z M 20 16 C 20.552 16 21 15.552 21 15 C 21 14.448 20.552 14 20 14 L 20 16 Z M 5.5 13.5 L 10 13.5 L 10 11.5 L 5.5 11.5 L 5.5 13.5 Z M 5.5 11.5 C 4.177 11.5 3.294 11.489 2.549 11.715 L 3.129 13.629 C 3.519 13.511 4.032 13.5 5.5 13.5 L 5.5 11.5 Z M 1 18 C 1 16.532 1.011 16.019 1.129 15.629 L -0.785 15.049 C -1.011 15.794 -1 16.677 -1 18 L 1 18 Z M 2.549 11.715 C 0.951 12.2 -0.3 13.451 -0.785 15.049 L 1.129 15.629 C 1.42 14.67 2.17 13.92 3.129 13.629 L 2.549 11.715 Z M 11.5 4.5 C 11.5 6.433 9.933 8 8 8 L 8 10 C 11.038 10 13.5 7.538 13.5 4.5 L 11.5 4.5 Z M 8 8 C 6.067 8 4.5 6.433 4.5 4.5 L 2.5 4.5 C 2.5 7.538 4.962 10 8 10 L 8 8 Z M 4.5 4.5 C 4.5 2.567 6.067 1 8 1 L 8 -1 C 4.962 -1 2.5 1.462 2.5 4.5 L 4.5 4.5 Z M 8 1 C 9.933 1 11.5 2.567 11.5 4.5 L 13.5 4.5 C 13.5 1.462 11.038 -1 8 -1 L 8 1 Z M 18 18 L 18 12 L 16 12 L 16 18 L 18 18 Z M 14 16 L 20 16 L 20 14 L 14 14 L 14 16 Z" fill="currentColor" fillRule="nonzero" transform="matrix(1 0 0 1 2 3)" />
        </symbol>
        <symbol id="i-user-share" viewBox="0 0 24 24">
          <path d="M 16.293 17.293 C 15.902 17.683 15.902 18.317 16.293 18.707 C 16.683 19.098 17.317 19.098 17.707 18.707 L 16.293 17.293 Z M 20 15 L 20.707 15.707 C 21.098 15.317 21.098 14.683 20.707 14.293 L 20 15 Z M 17.707 11.293 C 17.317 10.902 16.683 10.902 16.293 11.293 C 15.902 11.683 15.902 12.317 16.293 12.707 L 17.707 11.293 Z M 14 14 C 13.448 14 13 14.448 13 15 C 13 15.552 13.448 16 14 16 L 14 14 Z M 10 13.5 C 10.552 13.5 11 13.052 11 12.5 C 11 11.948 10.552 11.5 10 11.5 L 10 13.5 Z M 2.839 12.672 L 3.129 13.629 L 2.839 12.672 Z M -1 18 C -1 18.552 -0.552 19 0 19 C 0.552 19 1 18.552 1 18 L -1 18 Z M 0.172 15.339 L 1.129 15.629 L 0.172 15.339 Z M 17.707 18.707 L 20.707 15.707 L 19.293 14.293 L 16.293 17.293 L 17.707 18.707 Z M 20.707 14.293 L 17.707 11.293 L 16.293 12.707 L 19.293 15.707 L 20.707 14.293 Z M 14 16 L 20 16 L 20 14 L 14 14 L 14 16 Z M 5.5 13.5 L 10 13.5 L 10 11.5 L 5.5 11.5 L 5.5 13.5 Z M 5.5 11.5 C 4.177 11.5 3.294 11.489 2.549 11.715 L 3.129 13.629 C 3.519 13.511 4.032 13.5 5.5 13.5 L 5.5 11.5 Z M 1 18 C 1 16.532 1.011 16.019 1.129 15.629 L -0.785 15.049 C -1.011 15.794 -1 16.677 -1 18 L 1 18 Z M 2.549 11.715 C 0.951 12.2 -0.3 13.451 -0.785 15.049 L 1.129 15.629 C 1.42 14.67 2.17 13.92 3.129 13.629 L 2.549 11.715 Z M 11.5 4.5 C 11.5 6.433 9.933 8 8 8 L 8 10 C 11.038 10 13.5 7.538 13.5 4.5 L 11.5 4.5 Z M 8 8 C 6.067 8 4.5 6.433 4.5 4.5 L 2.5 4.5 C 2.5 7.538 4.962 10 8 10 L 8 8 Z M 4.5 4.5 C 4.5 2.567 6.067 1 8 1 L 8 -1 C 4.962 -1 2.5 1.462 2.5 4.5 L 4.5 4.5 Z M 8 1 C 9.933 1 11.5 2.567 11.5 4.5 L 13.5 4.5 C 13.5 1.462 11.038 -1 8 -1 L 8 1 Z" fill="currentColor" fillRule="nonzero" transform="matrix(1 0 0 1 2 3)" />
        </symbol>
        <symbol id="i-user-check" viewBox="0 0 24 24">
          <path d="M 10 13.5 C 10.552 13.5 11 13.052 11 12.5 C 11 11.948 10.552 11.5 10 11.5 L 10 13.5 Z M 2.839 12.672 L 3.129 13.629 L 2.839 12.672 Z M -1 18 C -1 18.552 -0.552 19 0 19 C 0.552 19 1 18.552 1 18 L -1 18 Z M 0.172 15.339 L 1.129 15.629 L 0.172 15.339 Z M 14.707 14.293 C 14.317 13.902 13.683 13.902 13.293 14.293 C 12.902 14.683 12.902 15.317 13.293 15.707 L 14.707 14.293 Z M 16 17 L 15.293 17.707 C 15.683 18.098 16.317 18.098 16.707 17.707 L 16 17 Z M 20.707 13.707 C 21.098 13.317 21.098 12.683 20.707 12.293 C 20.317 11.902 19.683 11.902 19.293 12.293 L 20.707 13.707 Z M 5.5 13.5 L 10 13.5 L 10 11.5 L 5.5 11.5 L 5.5 13.5 Z M 5.5 11.5 C 4.177 11.5 3.294 11.489 2.549 11.715 L 3.129 13.629 C 3.519 13.511 4.032 13.5 5.5 13.5 L 5.5 11.5 Z M 1 18 C 1 16.532 1.011 16.019 1.129 15.629 L -0.785 15.049 C -1.011 15.794 -1 16.677 -1 18 L 1 18 Z M 2.549 11.715 C 0.951 12.2 -0.3 13.451 -0.785 15.049 L 1.129 15.629 C 1.42 14.67 2.17 13.92 3.129 13.629 L 2.549 11.715 Z M 11.5 4.5 C 11.5 6.433 9.933 8 8 8 L 8 10 C 11.038 10 13.5 7.538 13.5 4.5 L 11.5 4.5 Z M 8 8 C 6.067 8 4.5 6.433 4.5 4.5 L 2.5 4.5 C 2.5 7.538 4.962 10 8 10 L 8 8 Z M 4.5 4.5 C 4.5 2.567 6.067 1 8 1 L 8 -1 C 4.962 -1 2.5 1.462 2.5 4.5 L 4.5 4.5 Z M 8 1 C 9.933 1 11.5 2.567 11.5 4.5 L 13.5 4.5 C 13.5 1.462 11.038 -1 8 -1 L 8 1 Z M 13.293 15.707 L 15.293 17.707 L 16.707 16.293 L 14.707 14.293 L 13.293 15.707 Z M 16.707 17.707 L 20.707 13.707 L 19.293 12.293 L 15.293 16.293 L 16.707 17.707 Z" fill="currentColor" fillRule="nonzero" transform="matrix(1 0 0 1 2 3)" />
        </symbol>
        <symbol id="i-user-x" viewBox="0 0 24 24">
          <path d="M 15.207 12.293 C 14.817 11.902 14.183 11.902 13.793 12.293 C 13.402 12.683 13.402 13.317 13.793 13.707 L 15.207 12.293 Z M 18.793 18.707 C 19.183 19.098 19.817 19.098 20.207 18.707 C 20.598 18.317 20.598 17.683 20.207 17.293 L 18.793 18.707 Z M 20.207 13.707 C 20.598 13.317 20.598 12.683 20.207 12.293 C 19.817 11.902 19.183 11.902 18.793 12.293 L 20.207 13.707 Z M 13.793 17.293 C 13.402 17.683 13.402 18.317 13.793 18.707 C 14.183 19.098 14.817 19.098 15.207 18.707 L 13.793 17.293 Z M 10 13.5 C 10.552 13.5 11 13.052 11 12.5 C 11 11.948 10.552 11.5 10 11.5 L 10 13.5 Z M 2.839 12.672 L 3.129 13.629 L 2.839 12.672 Z M -1 18 C -1 18.552 -0.552 19 0 19 C 0.552 19 1 18.552 1 18 L -1 18 Z M 0.172 15.339 L 1.129 15.629 L 0.172 15.339 Z M 13.793 13.707 L 18.793 18.707 L 20.207 17.293 L 15.207 12.293 L 13.793 13.707 Z M 18.793 12.293 L 13.793 17.293 L 15.207 18.707 L 20.207 13.707 L 18.793 12.293 Z M 5.5 13.5 L 10 13.5 L 10 11.5 L 5.5 11.5 L 5.5 13.5 Z M 5.5 11.5 C 4.177 11.5 3.294 11.489 2.549 11.715 L 3.129 13.629 C 3.519 13.511 4.032 13.5 5.5 13.5 L 5.5 11.5 Z M 1 18 C 1 16.532 1.011 16.019 1.129 15.629 L -0.785 15.049 C -1.011 15.794 -1 16.677 -1 18 L 1 18 Z M 2.549 11.715 C 0.951 12.2 -0.3 13.451 -0.785 15.049 L 1.129 15.629 C 1.42 14.67 2.17 13.92 3.129 13.629 L 2.549 11.715 Z M 11.5 4.5 C 11.5 6.433 9.933 8 8 8 L 8 10 C 11.038 10 13.5 7.538 13.5 4.5 L 11.5 4.5 Z M 8 8 C 6.067 8 4.5 6.433 4.5 4.5 L 2.5 4.5 C 2.5 7.538 4.962 10 8 10 L 8 8 Z M 4.5 4.5 C 4.5 2.567 6.067 1 8 1 L 8 -1 C 4.962 -1 2.5 1.462 2.5 4.5 L 4.5 4.5 Z M 8 1 C 9.933 1 11.5 2.567 11.5 4.5 L 13.5 4.5 C 13.5 1.462 11.038 -1 8 -1 L 8 1 Z" fill="currentColor" fillRule="nonzero" transform="matrix(1 0 0 1 2 3)" />
        </symbol>
        <symbol id="i-clip" viewBox="0 0 24 24">
          <path d="M 15.898 4.224 L 16.864 3.965 L 16.864 3.965 L 15.898 4.224 Z M 12 1 C 11.448 1 11 1.448 11 2 C 11 2.552 11.448 3 12 3 L 12 1 Z M 13.776 2.102 L 13.518 3.068 L 13.518 3.068 L 13.776 2.102 Z M 14.362 19.673 L 14.816 20.564 L 14.816 20.564 L 14.362 19.673 Z M 15.673 18.362 L 14.782 17.908 L 14.782 17.908 L 15.673 18.362 Z M 0.327 18.362 L 1.218 17.908 L 1.218 17.908 L 0.327 18.362 Z M 1.638 19.673 L 1.184 20.564 L 1.184 20.564 L 1.638 19.673 Z M 4 3 C 4.552 3 5 2.552 5 2 C 5 1.448 4.552 1 4 1 L 4 3 Z M 2.224 2.102 L 2.482 3.068 L 2.482 3.068 L 2.224 2.102 Z M 0.102 4.224 L 1.068 4.482 L 1.068 4.482 L 0.102 4.224 Z M 4.546 3.891 L 5 3 L 4.546 3.891 Z M 4.109 3.454 L 5 3 L 4.109 3.454 Z M 11.891 3.454 L 11 3 L 11.891 3.454 Z M 11.454 3.891 L 11 3 L 11.454 3.891 Z M 11.454 0.109 L 11 1 L 11.454 0.109 Z M 11.891 0.546 L 11 1 L 11.891 0.546 Z M 4.546 0.109 L 5 1 L 4.546 0.109 Z M 4.109 0.546 L 5 1 L 4.109 0.546 Z M 5.707 12.293 C 5.317 11.902 4.683 11.902 4.293 12.293 C 3.902 12.683 3.902 13.317 4.293 13.707 L 5.707 12.293 Z M 7 15 L 6.293 15.707 C 6.683 16.098 7.317 16.098 7.707 15.707 L 7 15 Z M 12.207 11.207 C 12.598 10.817 12.598 10.183 12.207 9.793 C 11.817 9.402 11.183 9.402 10.793 9.793 L 12.207 11.207 Z M 1 15.2 L 1 6 L -1 6 L -1 15.2 L 1 15.2 Z M 11.2 19 L 4.8 19 L 4.8 21 L 11.2 21 L 11.2 19 Z M 15 6 L 15 15.2 L 17 15.2 L 17 6 L 15 6 Z M 17 6 C 17 5.134 17.009 4.505 16.864 3.965 L 14.932 4.482 C 14.991 4.705 15 5.006 15 6 L 17 6 Z M 12 3 C 12.994 3 13.295 3.009 13.518 3.068 L 14.035 1.136 C 13.495 0.991 12.866 1 12 1 L 12 3 Z M 16.864 3.965 C 16.494 2.584 15.416 1.506 14.035 1.136 L 13.518 3.068 C 14.208 3.253 14.747 3.792 14.932 4.482 L 16.864 3.965 Z M 11.2 21 C 12.024 21 12.701 21.001 13.252 20.956 C 13.814 20.91 14.331 20.811 14.816 20.564 L 13.908 18.782 C 13.752 18.862 13.527 18.927 13.089 18.962 C 12.639 18.999 12.057 19 11.2 19 L 11.2 21 Z M 15 15.2 C 15 16.057 14.999 16.639 14.962 17.089 C 14.927 17.527 14.862 17.752 14.782 17.908 L 16.564 18.816 C 16.811 18.331 16.91 17.814 16.956 17.252 C 17.001 16.701 17 16.024 17 15.2 L 15 15.2 Z M 14.816 20.564 C 15.569 20.181 16.181 19.569 16.564 18.816 L 14.782 17.908 C 14.59 18.284 14.284 18.59 13.908 18.782 L 14.816 20.564 Z M -1 15.2 C -1 16.024 -1.001 16.701 -0.956 17.252 C -0.91 17.814 -0.811 18.331 -0.564 18.816 L 1.218 17.908 C 1.138 17.752 1.073 17.527 1.038 17.089 C 1.001 16.639 1 16.057 1 15.2 L -1 15.2 Z M 4.8 19 C 3.943 19 3.361 18.999 2.911 18.962 C 2.473 18.927 2.248 18.862 2.092 18.782 L 1.184 20.564 C 1.669 20.811 2.186 20.91 2.748 20.956 C 3.299 21.001 3.976 21 4.8 21 L 4.8 19 Z M -0.564 18.816 C -0.181 19.569 0.431 20.181 1.184 20.564 L 2.092 18.782 C 1.716 18.59 1.41 18.284 1.218 17.908 L -0.564 18.816 Z M 4 1 C 3.134 1 2.505 0.991 1.965 1.136 L 2.482 3.068 C 2.705 3.009 3.006 3 4 3 L 4 1 Z M 1 6 C 1 5.006 1.009 4.705 1.068 4.482 L -0.864 3.965 C -1.009 4.505 -1 5.134 -1 6 L 1 6 Z M 1.965 1.136 C 0.584 1.506 -0.494 2.584 -0.864 3.965 L 1.068 4.482 C 1.253 3.792 1.792 3.253 2.482 3.068 L 1.965 1.136 Z M 5.6 1 L 10.4 1 L 10.4 -1 L 5.6 -1 L 5.6 1 Z M 11 1.6 L 11 2.4 L 13 2.4 L 13 1.6 L 11 1.6 Z M 10.4 3 L 5.6 3 L 5.6 5 L 10.4 5 L 10.4 3 Z M 5 2.4 L 5 1.6 L 3 1.6 L 3 2.4 L 5 2.4 Z M 5.6 3 C 5.303 3 5.141 2.999 5.025 2.99 C 4.92 2.981 4.942 2.971 5 3 L 4.092 4.782 C 4.363 4.92 4.633 4.964 4.862 4.983 C 5.079 5.001 5.336 5 5.6 5 L 5.6 3 Z M 3 2.4 C 3 2.664 2.999 2.921 3.017 3.138 C 3.036 3.367 3.08 3.637 3.218 3.908 L 5 3 C 5.029 3.058 5.019 3.08 5.01 2.975 C 5.001 2.859 5 2.697 5 2.4 L 3 2.4 Z M 5 3 L 5 3 L 3.218 3.908 C 3.41 4.284 3.716 4.59 4.092 4.782 L 5 3 Z M 11 2.4 C 11 2.697 10.999 2.859 10.99 2.975 C 10.981 3.08 10.971 3.058 11 3 L 12.782 3.908 C 12.92 3.637 12.964 3.367 12.983 3.138 C 13.001 2.921 13 2.664 13 2.4 L 11 2.4 Z M 10.4 5 C 10.664 5 10.921 5.001 11.138 4.983 C 11.367 4.964 11.637 4.92 11.908 4.782 L 11 3 C 11.058 2.971 11.08 2.981 10.975 2.99 C 10.859 2.999 10.697 3 10.4 3 L 10.4 5 Z M 11 3 L 11 3 L 11.908 4.782 C 12.284 4.59 12.59 4.284 12.782 3.908 L 11 3 Z M 10.4 1 C 10.697 1 10.859 1.001 10.975 1.01 C 11.08 1.019 11.058 1.029 11 1 L 11.908 -0.782 C 11.637 -0.92 11.367 -0.964 11.138 -0.983 C 10.921 -1.001 10.664 -1 10.4 -1 L 10.4 1 Z M 13 1.6 C 13 1.336 13.001 1.079 12.983 0.862 C 12.964 0.633 12.92 0.363 12.782 0.092 L 11 1 C 10.971 0.942 10.981 0.92 10.99 1.025 C 10.999 1.141 11 1.303 11 1.6 L 13 1.6 Z M 11 1 L 11 1 L 12.782 0.092 C 12.59 -0.284 12.284 -0.59 11.908 -0.782 L 11 1 Z M 5.6 -1 C 5.336 -1 5.079 -1.001 4.862 -0.983 C 4.633 -0.964 4.363 -0.92 4.092 -0.782 L 5 1 C 4.942 1.029 4.92 1.019 5.025 1.01 C 5.141 1.001 5.303 1 5.6 1 L 5.6 -1 Z M 5 1.6 C 5 1.303 5.001 1.141 5.01 1.025 C 5.019 0.92 5.029 0.942 5 1 L 3.218 0.092 C 3.08 0.363 3.036 0.633 3.017 0.862 C 2.999 1.079 3 1.336 3 1.6 L 5 1.6 Z M 4.092 -0.782 C 3.716 -0.59 3.41 -0.284 3.218 0.092 L 5 1 L 5 1 L 4.092 -0.782 Z M 4.293 13.707 L 6.293 15.707 L 7.707 14.293 L 5.707 12.293 L 4.293 13.707 Z M 7.707 15.707 L 12.207 11.207 L 10.793 9.793 L 6.293 14.293 L 7.707 15.707 Z" fill="currentColor" fillRule="nonzero" transform="matrix(1 0 0 1 4 2)" />
        </symbol>
        <symbol id="i-lock" viewBox="0 0 24 24">
          <path d="M 12 7 C 12 7.552 12.448 8 13 8 C 13.552 8 14 7.552 14 7 L 12 7 Z M 2 7 C 2 7.552 2.448 8 3 8 C 3.552 8 4 7.552 4 7 L 2 7 Z M 9 11.5 C 9 10.948 8.552 10.5 8 10.5 C 7.448 10.5 7 10.948 7 11.5 L 9 11.5 Z M 7 13.5 C 7 14.052 7.448 14.5 8 14.5 C 8.552 14.5 9 14.052 9 13.5 L 7 13.5 Z M 1.638 17.673 L 1.184 18.564 L 1.638 17.673 Z M 0.327 16.362 L -0.564 16.816 L 0.327 16.362 Z M 15.673 16.362 L 16.564 16.816 L 15.673 16.362 Z M 14.362 17.673 L 14.816 18.564 L 14.362 17.673 Z M 14.362 7.327 L 14.816 6.436 L 14.362 7.327 Z M 15.673 8.638 L 16.564 8.184 L 15.673 8.638 Z M 1.638 7.327 L 1.184 6.436 L 1.638 7.327 Z M 0.327 8.638 L -0.564 8.184 L 0.327 8.638 Z M 12 5 L 12 7 L 14 7 L 14 5 L 12 5 Z M 4 7 L 4 5 L 2 5 L 2 7 L 4 7 Z M 8 1 C 10.209 1 12 2.791 12 5 L 14 5 C 14 1.686 11.314 -1 8 -1 L 8 1 Z M 8 -1 C 4.686 -1 2 1.686 2 5 L 4 5 C 4 2.791 5.791 1 8 1 L 8 -1 Z M 7 11.5 L 7 13.5 L 9 13.5 L 9 11.5 L 7 11.5 Z M 4.8 8 L 11.2 8 L 11.2 6 L 4.8 6 L 4.8 8 Z M 15 11.8 L 15 13.2 L 17 13.2 L 17 11.8 L 15 11.8 Z M 11.2 17 L 4.8 17 L 4.8 19 L 11.2 19 L 11.2 17 Z M 1 13.2 L 1 11.8 L -1 11.8 L -1 13.2 L 1 13.2 Z M 4.8 17 C 3.943 17 3.361 16.999 2.911 16.962 C 2.473 16.927 2.248 16.862 2.092 16.782 L 1.184 18.564 C 1.669 18.811 2.186 18.91 2.748 18.956 C 3.299 19.001 3.976 19 4.8 19 L 4.8 17 Z M -1 13.2 C -1 14.024 -1.001 14.701 -0.956 15.252 C -0.91 15.814 -0.811 16.331 -0.564 16.816 L 1.218 15.908 C 1.138 15.752 1.073 15.527 1.038 15.089 C 1.001 14.639 1 14.057 1 13.2 L -1 13.2 Z M 2.092 16.782 C 1.716 16.59 1.41 16.284 1.218 15.908 L -0.564 16.816 C -0.181 17.569 0.431 18.181 1.184 18.564 L 2.092 16.782 Z M 15 13.2 C 15 14.057 14.999 14.639 14.962 15.089 C 14.927 15.527 14.862 15.752 14.782 15.908 L 16.564 16.816 C 16.811 16.331 16.91 15.814 16.956 15.252 C 17.001 14.701 17 14.024 17 13.2 L 15 13.2 Z M 11.2 19 C 12.024 19 12.701 19.001 13.252 18.956 C 13.814 18.91 14.331 18.811 14.816 18.564 L 13.908 16.782 C 13.752 16.862 13.527 16.927 13.089 16.962 C 12.639 16.999 12.057 17 11.2 17 L 11.2 19 Z M 14.782 15.908 C 14.59 16.284 14.284 16.59 13.908 16.782 L 14.816 18.564 C 15.569 18.181 16.181 17.569 16.564 16.816 L 14.782 15.908 Z M 11.2 8 C 12.057 8 12.639 8.001 13.089 8.038 C 13.527 8.073 13.752 8.138 13.908 8.218 L 14.816 6.436 C 14.331 6.189 13.814 6.09 13.252 6.044 C 12.701 5.999 12.024 6 11.2 6 L 11.2 8 Z M 17 11.8 C 17 10.976 17.001 10.299 16.956 9.748 C 16.91 9.186 16.811 8.669 16.564 8.184 L 14.782 9.092 C 14.862 9.248 14.927 9.473 14.962 9.911 C 14.999 10.361 15 10.943 15 11.8 L 17 11.8 Z M 13.908 8.218 C 14.284 8.41 14.59 8.716 14.782 9.092 L 16.564 8.184 C 16.181 7.431 15.569 6.819 14.816 6.436 L 13.908 8.218 Z M 4.8 6 C 3.976 6 3.299 5.999 2.748 6.044 C 2.186 6.09 1.669 6.189 1.184 6.436 L 2.092 8.218 C 2.248 8.138 2.473 8.073 2.911 8.038 C 3.361 8.001 3.943 8 4.8 8 L 4.8 6 Z M 1 11.8 C 1 10.943 1.001 10.361 1.038 9.911 C 1.073 9.473 1.138 9.248 1.218 9.092 L -0.564 8.184 C -0.811 8.669 -0.91 9.186 -0.956 9.748 C -1.001 10.299 -1 10.976 -1 11.8 L 1 11.8 Z M 1.184 6.436 C 0.431 6.819 -0.181 7.431 -0.564 8.184 L 1.218 9.092 C 1.41 8.716 1.716 8.41 2.092 8.218 L 1.184 6.436 Z" fill="currentColor" fillRule="nonzero" transform="matrix(1 0 0 1 4 3)" />
        </symbol>
        <symbol id="i-shield" viewBox="0 0 24 24">
          <path d="M 5.707 8.725 C 5.317 8.334 4.683 8.334 4.293 8.725 C 3.902 9.115 3.902 9.749 4.293 10.139 L 5.707 8.725 Z M 7 11.432 L 6.293 12.139 C 6.683 12.53 7.317 12.53 7.707 12.139 L 7 11.432 Z M 12.207 7.639 C 12.598 7.249 12.598 6.615 12.207 6.225 C 11.817 5.834 11.183 5.834 10.793 6.225 L 12.207 7.639 Z M 2.076 2.153 L 1.725 1.217 L 2.076 2.153 Z M 0.678 2.818 L 0.016 2.067 L 0.678 2.818 Z M 0.131 3.607 L 1.065 3.962 L 0.131 3.607 Z M 8.562 0.143 L 8.211 1.079 L 8.211 1.079 L 8.562 0.143 Z M 8.143 0.01 L 8 1 L 8.143 0.01 Z M 7.438 0.143 L 7.789 1.079 L 7.789 1.079 L 7.438 0.143 Z M 7.857 0.01 L 8 1 L 7.857 0.01 Z M 15.869 3.607 L 14.935 3.962 L 15.869 3.607 Z M 13.924 2.153 L 14.275 1.217 L 13.924 2.153 Z M 15.322 2.818 L 15.984 2.067 L 15.322 2.818 Z M 8.698 19.547 L 9.202 20.411 L 8.698 19.547 Z M 8.21 19.774 L 8.419 20.752 L 8.21 19.774 Z M 7.302 19.547 L 7.806 18.683 L 7.806 18.683 L 7.302 19.547 Z M 7.79 19.774 L 7.581 20.752 L 7.79 19.774 Z M 4.293 10.139 L 6.293 12.139 L 7.707 10.725 L 5.707 8.725 L 4.293 10.139 Z M 7.707 12.139 L 12.207 7.639 L 10.793 6.225 L 6.293 10.725 L 7.707 12.139 Z M 9.202 20.411 C 10.214 19.82 12.128 18.589 13.801 16.846 C 15.463 15.115 17 12.759 17 9.932 L 15 9.932 C 15 12.014 13.86 13.896 12.358 15.461 C 10.867 17.015 9.13 18.137 8.194 18.683 L 9.202 20.411 Z M 17 9.932 L 17 5.15 L 15 5.15 L 15 9.932 L 17 9.932 Z M 14.275 1.217 L 8.913 -0.794 L 8.211 1.079 L 13.572 3.09 L 14.275 1.217 Z M 7.087 -0.794 L 1.725 1.217 L 2.428 3.09 L 7.789 1.079 L 7.087 -0.794 Z M -1 5.15 L -1 9.932 L 1 9.932 L 1 5.15 L -1 5.15 Z M -1 9.932 C -1 12.759 0.537 15.115 2.199 16.846 C 3.872 18.589 5.786 19.82 6.798 20.411 L 7.806 18.683 C 6.87 18.137 5.133 17.015 3.642 15.461 C 2.14 13.896 1 12.014 1 9.932 L -1 9.932 Z M 1.725 1.217 C 1.053 1.469 0.464 1.673 0.016 2.067 L 1.339 3.568 C 1.443 3.476 1.602 3.399 2.428 3.09 L 1.725 1.217 Z M 1 5.15 C 1 4.268 1.016 4.093 1.065 3.962 L -0.804 3.251 C -1.016 3.808 -1 4.432 -1 5.15 L 1 5.15 Z M 0.016 2.067 C -0.349 2.389 -0.631 2.796 -0.804 3.251 L 1.065 3.962 C 1.123 3.811 1.217 3.675 1.339 3.568 L 0.016 2.067 Z M 8.913 -0.794 C 8.745 -0.857 8.525 -0.945 8.286 -0.979 L 8 1 C 7.977 0.997 7.97 0.993 8.003 1.003 C 8.044 1.017 8.099 1.037 8.211 1.079 L 8.913 -0.794 Z M 7.789 1.079 C 7.901 1.037 7.956 1.017 7.997 1.003 C 8.03 0.993 8.023 0.997 8 1 L 7.714 -0.979 C 7.475 -0.945 7.255 -0.857 7.087 -0.794 L 7.789 1.079 Z M 8.286 -0.979 C 8.096 -1.007 7.904 -1.007 7.714 -0.979 L 8 1 L 8 1 L 8.286 -0.979 Z M 17 5.15 C 17 4.432 17.016 3.808 16.804 3.251 L 14.935 3.962 C 14.984 4.093 15 4.268 15 5.15 L 17 5.15 Z M 13.572 3.09 C 14.398 3.399 14.557 3.476 14.661 3.568 L 15.984 2.067 C 15.536 1.673 14.947 1.469 14.275 1.217 L 13.572 3.09 Z M 16.804 3.251 C 16.631 2.796 16.349 2.389 15.984 2.067 L 14.661 3.568 C 14.783 3.675 14.877 3.811 14.935 3.962 L 16.804 3.251 Z M 8.194 18.683 C 8.137 18.716 8.096 18.741 8.06 18.761 C 8.025 18.781 8.004 18.791 7.991 18.797 C 7.98 18.803 7.979 18.803 7.985 18.801 C 7.991 18.799 7.997 18.797 8 18.796 L 8.419 20.752 C 8.76 20.679 9.012 20.521 9.202 20.411 L 8.194 18.683 Z M 6.798 20.411 C 6.988 20.521 7.24 20.679 7.581 20.752 L 8 18.796 C 8.003 18.797 8.009 18.799 8.015 18.801 C 8.021 18.803 8.02 18.803 8.009 18.797 C 7.996 18.791 7.975 18.781 7.94 18.761 C 7.904 18.741 7.863 18.716 7.806 18.683 L 6.798 20.411 Z M 8 18.796 C 8.009 18.794 8.015 18.794 8.017 18.793 C 8.02 18.793 8.02 18.793 8.019 18.793 C 8.016 18.793 8.009 18.794 8 18.794 C 7.991 18.794 7.984 18.793 7.981 18.793 C 7.98 18.793 7.98 18.793 7.983 18.793 C 7.985 18.794 7.991 18.794 8 18.796 L 7.581 20.752 C 7.84 20.808 8.16 20.808 8.419 20.752 L 8 18.796 Z" fill="currentColor" fillRule="nonzero" transform="matrix(1 0 0 1 4 2.068)" />
        </symbol>
        <symbol id="i-ext" viewBox="0 0 24 24">
          <path d="M 17 6 C 17 6.552 17.448 7 18 7 C 18.552 7 19 6.552 19 6 L 17 6 Z M 18 0 L 19 0 C 19 -0.552 18.552 -1 18 -1 L 18 0 Z M 12 -1 C 11.448 -1 11 -0.552 11 0 C 11 0.552 11.448 1 12 1 L 12 -1 Z M 9.293 7.293 C 8.902 7.683 8.902 8.317 9.293 8.707 C 9.683 9.098 10.317 9.098 10.707 8.707 L 9.293 7.293 Z M 7 3 C 7.552 3 8 2.552 8 2 C 8 1.448 7.552 1 7 1 L 7 3 Z M 17 11 C 17 10.448 16.552 10 16 10 C 15.448 10 15 10.448 15 11 L 17 11 Z M 1.638 17.673 L 2.092 16.782 L 2.092 16.782 L 1.638 17.673 Z M 0.327 16.362 L -0.564 16.816 L -0.564 16.816 L 0.327 16.362 Z M 14.362 17.673 L 13.908 16.782 L 13.908 16.782 L 14.362 17.673 Z M 15.673 16.362 L 14.782 15.908 L 14.782 15.908 L 15.673 16.362 Z M 0.327 3.638 L 1.218 4.092 L 1.218 4.092 L 0.327 3.638 Z M 1.638 2.327 L 2.092 3.218 L 2.092 3.218 L 1.638 2.327 Z M 19 6 L 19 0 L 17 0 L 17 6 L 19 6 Z M 18 -1 L 12 -1 L 12 1 L 18 1 L 18 -1 Z M 17.293 -0.707 L 9.293 7.293 L 10.707 8.707 L 18.707 0.707 L 17.293 -0.707 Z M 11.2 17 L 4.8 17 L 4.8 19 L 11.2 19 L 11.2 17 Z M 1 13.2 L 1 6.8 L -1 6.8 L -1 13.2 L 1 13.2 Z M 7 1 L 4.8 1 L 4.8 3 L 7 3 L 7 1 Z M 17 13.2 L 17 11 L 15 11 L 15 13.2 L 17 13.2 Z M 4.8 17 C 3.943 17 3.361 16.999 2.911 16.962 C 2.473 16.927 2.248 16.862 2.092 16.782 L 1.184 18.564 C 1.669 18.811 2.186 18.91 2.748 18.956 C 3.299 19.001 3.976 19 4.8 19 L 4.8 17 Z M -1 13.2 C -1 14.024 -1.001 14.701 -0.956 15.252 C -0.91 15.814 -0.811 16.331 -0.564 16.816 L 1.218 15.908 C 1.138 15.752 1.073 15.527 1.038 15.089 C 1.001 14.639 1 14.057 1 13.2 L -1 13.2 Z M 2.092 16.782 C 1.716 16.59 1.41 16.284 1.218 15.908 L -0.564 16.816 C -0.181 17.569 0.431 18.181 1.184 18.564 L 2.092 16.782 Z M 11.2 19 C 12.024 19 12.701 19.001 13.252 18.956 C 13.814 18.91 14.331 18.811 14.816 18.564 L 13.908 16.782 C 13.752 16.862 13.527 16.927 13.089 16.962 C 12.639 16.999 12.057 17 11.2 17 L 11.2 19 Z M 15 13.2 C 15 14.057 14.999 14.639 14.962 15.089 C 14.927 15.527 14.862 15.752 14.782 15.908 L 16.564 16.816 C 16.811 16.331 16.91 15.814 16.956 15.252 C 17.001 14.701 17 14.024 17 13.2 L 15 13.2 Z M 14.816 18.564 C 15.569 18.181 16.181 17.569 16.564 16.816 L 14.782 15.908 C 14.59 16.284 14.284 16.59 13.908 16.782 L 14.816 18.564 Z M 1 6.8 C 1 5.943 1.001 5.361 1.038 4.911 C 1.073 4.473 1.138 4.248 1.218 4.092 L -0.564 3.184 C -0.811 3.669 -0.91 4.186 -0.956 4.748 C -1.001 5.299 -1 5.976 -1 6.8 L 1 6.8 Z M 4.8 1 C 3.976 1 3.299 0.999 2.748 1.044 C 2.186 1.09 1.669 1.189 1.184 1.436 L 2.092 3.218 C 2.248 3.138 2.473 3.073 2.911 3.038 C 3.361 3.001 3.943 3 4.8 3 L 4.8 1 Z M 1.218 4.092 C 1.41 3.716 1.716 3.41 2.092 3.218 L 1.184 1.436 C 0.431 1.819 -0.181 2.431 -0.564 3.184 L 1.218 4.092 Z" fill="currentColor" fillRule="nonzero" transform="matrix(1 0 0 1 3 3)" />
        </symbol>
        <symbol id="i-download" viewBox="0 0 24 24">
          <path d="M 19 12 C 19 11.448 18.552 11 18 11 C 17.448 11 17 11.448 17 12 L 19 12 Z M 1 12 C 1 11.448 0.552 11 0 11 C -0.552 11 -1 11.448 -1 12 L 1 12 Z M 1.638 17.673 L 2.092 16.782 L 2.092 16.782 L 1.638 17.673 Z M 0.327 16.362 L 1.218 15.908 L 1.218 15.908 L 0.327 16.362 Z M 16.362 17.673 L 15.908 16.782 L 15.908 16.782 L 16.362 17.673 Z M 17.673 16.362 L 18.564 16.816 L 18.564 16.816 L 17.673 16.362 Z M 14.707 7.707 C 15.098 7.317 15.098 6.683 14.707 6.293 C 14.317 5.902 13.683 5.902 13.293 6.293 L 14.707 7.707 Z M 9 12 L 8.293 12.707 C 8.683 13.098 9.317 13.098 9.707 12.707 L 9 12 Z M 4.707 6.293 C 4.317 5.902 3.683 5.902 3.293 6.293 C 2.902 6.683 2.902 7.317 3.293 7.707 L 4.707 6.293 Z M 10 0 C 10 -0.552 9.552 -1 9 -1 C 8.448 -1 8 -0.552 8 0 L 10 0 Z M 13.2 17 L 4.8 17 L 4.8 19 L 13.2 19 L 13.2 17 Z M 17 12 L 17 13.2 L 19 13.2 L 19 12 L 17 12 Z M 1 13.2 L 1 12 L -1 12 L -1 13.2 L 1 13.2 Z M 4.8 17 C 3.943 17 3.361 16.999 2.911 16.962 C 2.473 16.927 2.248 16.862 2.092 16.782 L 1.184 18.564 C 1.669 18.811 2.186 18.91 2.748 18.956 C 3.299 19.001 3.976 19 4.8 19 L 4.8 17 Z M -1 13.2 C -1 14.024 -1.001 14.701 -0.956 15.252 C -0.91 15.814 -0.811 16.331 -0.564 16.816 L 1.218 15.908 C 1.138 15.752 1.073 15.527 1.038 15.089 C 1.001 14.639 1 14.057 1 13.2 L -1 13.2 Z M 2.092 16.782 C 1.716 16.59 1.41 16.284 1.218 15.908 L -0.564 16.816 C -0.181 17.569 0.431 18.181 1.184 18.564 L 2.092 16.782 Z M 13.2 19 C 14.024 19 14.701 19.001 15.252 18.956 C 15.814 18.91 16.331 18.811 16.816 18.564 L 15.908 16.782 C 15.752 16.862 15.527 16.927 15.089 16.962 C 14.639 16.999 14.057 17 13.2 17 L 13.2 19 Z M 17 13.2 C 17 14.057 16.999 14.639 16.962 15.089 C 16.927 15.527 16.862 15.752 16.782 15.908 L 18.564 16.816 C 18.811 16.331 18.91 15.814 18.956 15.252 C 19.001 14.701 19 14.024 19 13.2 L 17 13.2 Z M 16.816 18.564 C 17.569 18.181 18.181 17.569 18.564 16.816 L 16.782 15.908 C 16.59 16.284 16.284 16.59 15.908 16.782 L 16.816 18.564 Z M 13.293 6.293 L 8.293 11.293 L 9.707 12.707 L 14.707 7.707 L 13.293 6.293 Z M 9.707 11.293 L 4.707 6.293 L 3.293 7.707 L 8.293 12.707 L 9.707 11.293 Z M 8 0 L 8 12 L 10 12 L 10 0 L 8 0 Z" fill="currentColor" fillRule="nonzero" transform="matrix(1 0 0 1 3 3)" />
        </symbol>
        <symbol id="i-info" viewBox="0 0 24 24">
          <path d="M 9 14 C 9 14.552 9.448 15 10 15 C 10.552 15 11 14.552 11 14 L 9 14 Z M 11 10 C 11 9.448 10.552 9 10 9 C 9.448 9 9 9.448 9 10 L 11 10 Z M 10 5 C 9.448 5 9 5.448 9 6 C 9 6.552 9.448 7 10 7 L 10 5 Z M 10.01 7 C 10.562 7 11.01 6.552 11.01 6 C 11.01 5.448 10.562 5 10.01 5 L 10.01 7 Z M 19 10 C 19 14.971 14.971 19 10 19 L 10 21 C 16.075 21 21 16.075 21 10 L 19 10 Z M 10 19 C 5.029 19 1 14.971 1 10 L -1 10 C -1 16.075 3.925 21 10 21 L 10 19 Z M 1 10 C 1 5.029 5.029 1 10 1 L 10 -1 C 3.925 -1 -1 3.925 -1 10 L 1 10 Z M 10 1 C 14.971 1 19 5.029 19 10 L 21 10 C 21 3.925 16.075 -1 10 -1 L 10 1 Z M 11 14 L 11 10 L 9 10 L 9 14 L 11 14 Z M 10 7 L 10.01 7 L 10.01 5 L 10 5 L 10 7 Z" fill="currentColor" fillRule="nonzero" transform="matrix(1 0 0 1 2 2)" />
        </symbol>
        <symbol id="i-target" viewBox="0 0 24 24">
          <path d="M 17 0 L 17.894 -0.447 C 17.751 -0.735 17.477 -0.936 17.16 -0.987 C 16.843 -1.039 16.52 -0.934 16.293 -0.707 L 17 0 Z M 14 3 L 13.293 2.293 C 13.105 2.48 13 2.735 13 3 L 14 3 Z M 17 6 L 17 7 C 17.265 7 17.52 6.895 17.707 6.707 L 17 6 Z M 20 3 L 20.707 3.707 C 20.934 3.48 21.039 3.157 20.987 2.84 C 20.936 2.523 20.735 2.249 20.447 2.106 L 20 3 Z M 18 2 L 17.106 2.447 C 17.202 2.641 17.359 2.798 17.553 2.894 L 18 2 Z M 9.293 9.293 C 8.902 9.683 8.902 10.317 9.293 10.707 C 9.683 11.098 10.317 11.098 10.707 10.707 L 9.293 9.293 Z M 21 10 C 21 9.448 20.552 9 20 9 C 19.448 9 19 9.448 19 10 L 21 10 Z M 10 1 C 10.552 1 11 0.552 11 0 C 11 -0.552 10.552 -1 10 -1 L 10 1 Z M 16 10 C 16 9.448 15.552 9 15 9 C 14.448 9 14 9.448 14 10 L 16 10 Z M 10 6 C 10.552 6 11 5.552 11 5 C 11 4.448 10.552 4 10 4 L 10 6 Z M 16.293 -0.707 L 13.293 2.293 L 14.707 3.707 L 17.707 0.707 L 16.293 -0.707 Z M 13 3 L 13 6 L 15 6 L 15 3 L 13 3 Z M 14 7 L 17 7 L 17 5 L 14 5 L 14 7 Z M 17.707 6.707 L 20.707 3.707 L 19.293 2.293 L 16.293 5.293 L 17.707 6.707 Z M 20.447 2.106 L 18.447 1.106 L 17.553 2.894 L 19.553 3.894 L 20.447 2.106 Z M 18.894 1.553 L 17.894 -0.447 L 16.106 0.447 L 17.106 2.447 L 18.894 1.553 Z M 13.293 5.293 L 9.293 9.293 L 10.707 10.707 L 14.707 6.707 L 13.293 5.293 Z M 19 10 C 19 14.971 14.971 19 10 19 L 10 21 C 16.075 21 21 16.075 21 10 L 19 10 Z M 10 19 C 5.029 19 1 14.971 1 10 L -1 10 C -1 16.075 3.925 21 10 21 L 10 19 Z M 1 10 C 1 5.029 5.029 1 10 1 L 10 -1 C 3.925 -1 -1 3.925 -1 10 L 1 10 Z M 14 10 C 14 12.209 12.209 14 10 14 L 10 16 C 13.314 16 16 13.314 16 10 L 14 10 Z M 10 14 C 7.791 14 6 12.209 6 10 L 4 10 C 4 13.314 6.686 16 10 16 L 10 14 Z M 6 10 C 6 7.791 7.791 6 10 6 L 10 4 C 6.686 4 4 6.686 4 10 L 6 10 Z" fill="currentColor" fillRule="nonzero" transform="matrix(1 0 0 1 2 2)" />
        </symbol>
        <symbol id="i-x" viewBox="0 0 24 24">
          <path d="M 12.707 0.707 C 13.098 0.317 13.098 -0.317 12.707 -0.707 C 12.317 -1.098 11.683 -1.098 11.293 -0.707 L 12.707 0.707 Z M -0.707 11.293 C -1.098 11.683 -1.098 12.317 -0.707 12.707 C -0.317 13.098 0.317 13.098 0.707 12.707 L -0.707 11.293 Z M 0.707 -0.707 C 0.317 -1.098 -0.317 -1.098 -0.707 -0.707 C -1.098 -0.317 -1.098 0.317 -0.707 0.707 L 0.707 -0.707 Z M 11.293 12.707 C 11.683 13.098 12.317 13.098 12.707 12.707 C 13.098 12.317 13.098 11.683 12.707 11.293 L 11.293 12.707 Z M 11.293 -0.707 L -0.707 11.293 L 0.707 12.707 L 12.707 0.707 L 11.293 -0.707 Z M -0.707 0.707 L 11.293 12.707 L 12.707 11.293 L 0.707 -0.707 L -0.707 0.707 Z" fill="currentColor" fillRule="nonzero" transform="matrix(1 0 0 1 6 6)" />
        </symbol>
        <symbol id="i-upload" viewBox="0 0 24 24">
          <path d="M 5.293 12.293 C 4.902 12.683 4.902 13.317 5.293 13.707 C 5.683 14.098 6.317 14.098 6.707 13.707 L 5.293 12.293 Z M 10 9 L 10.707 8.293 C 10.317 7.902 9.683 7.902 9.293 8.293 L 10 9 Z M 13.293 13.707 C 13.683 14.098 14.317 14.098 14.707 13.707 C 15.098 13.317 15.098 12.683 14.707 12.293 L 13.293 13.707 Z M 9 18 C 9 18.552 9.448 19 10 19 C 10.552 19 11 18.552 11 18 L 9 18 Z M 13.966 3.698 L 14.828 3.19 L 14.828 3.19 L 13.966 3.698 Z M 17.363 12.972 C 16.937 13.323 16.877 13.954 17.229 14.38 C 17.581 14.805 18.211 14.866 18.637 14.514 L 17.363 12.972 Z M 1.479 13.499 C 1.868 13.891 2.502 13.892 2.893 13.502 C 3.284 13.112 3.285 12.479 2.895 12.088 L 1.479 13.499 Z M 6.707 13.707 L 10.707 9.707 L 9.293 8.293 L 5.293 12.293 L 6.707 13.707 Z M 9.293 9.707 L 13.293 13.707 L 14.707 12.293 L 10.707 8.293 L 9.293 9.707 Z M 9 9 L 9 18 L 11 18 L 11 9 L 9 9 Z M 1 7.5 C 1 3.91 3.91 1 7.5 1 L 7.5 -1 C 2.806 -1 -1 2.806 -1 7.5 L 1 7.5 Z M 7.5 1 C 9.886 1 11.973 2.285 13.105 4.205 L 14.828 3.19 C 13.351 0.685 10.623 -1 7.5 -1 L 7.5 1 Z M 14.5 5 C 16.985 5 19 7.015 19 9.5 L 21 9.5 C 21 5.91 18.09 3 14.5 3 L 14.5 5 Z M 19 9.5 C 19 10.897 18.365 12.145 17.363 12.972 L 18.637 14.514 C 20.078 13.323 21 11.519 21 9.5 L 19 9.5 Z M 2.895 12.088 C 1.723 10.911 1 9.291 1 7.5 L -1 7.5 C -1 9.841 -0.052 11.963 1.479 13.499 L 2.895 12.088 Z M 13.105 4.205 C 13.4 4.706 13.936 5 14.5 5 L 14.5 3 C 14.627 3 14.754 3.066 14.828 3.19 L 13.105 4.205 Z" fill="currentColor" fillRule="nonzero" transform="matrix(1 0 0 1 2 3)" />
        </symbol>
        <symbol id="i-cal" viewBox="0 0 24 24">
          <path d="M 18 9 C 18.552 9 19 8.552 19 8 C 19 7.448 18.552 7 18 7 L 18 9 Z M 0 7 C -0.552 7 -1 7.448 -1 8 C -1 8.552 -0.552 9 0 9 L 0 7 Z M 1.638 19.673 L 1.184 20.564 L 1.638 19.673 Z M 0.327 18.362 L -0.564 18.816 L 0.327 18.362 Z M 17.673 18.362 L 18.564 18.816 L 17.673 18.362 Z M 16.362 19.673 L 16.816 20.564 L 16.362 19.673 Z M 16.362 2.327 L 16.816 1.436 L 16.362 2.327 Z M 17.673 3.638 L 18.564 3.184 L 17.673 3.638 Z M 1.638 2.327 L 1.184 1.436 L 1.638 2.327 Z M 0.327 3.638 L -0.564 3.184 L 0.327 3.638 Z M 14 0 C 14 -0.552 13.552 -1 13 -1 C 12.448 -1 12 -0.552 12 0 L 14 0 Z M 12 4 C 12 4.552 12.448 5 13 5 C 13.552 5 14 4.552 14 4 L 12 4 Z M 6 0 C 6 -0.552 5.552 -1 5 -1 C 4.448 -1 4 -0.552 4 0 L 6 0 Z M 4 4 C 4 4.552 4.448 5 5 5 C 5.552 5 6 4.552 6 4 L 4 4 Z M 18 7 L 0 7 L 0 9 L 18 9 L 18 7 Z M 4.8 3 L 13.2 3 L 13.2 1 L 4.8 1 L 4.8 3 Z M 17 6.8 L 17 15.2 L 19 15.2 L 19 6.8 L 17 6.8 Z M 13.2 19 L 4.8 19 L 4.8 21 L 13.2 21 L 13.2 19 Z M 1 15.2 L 1 6.8 L -1 6.8 L -1 15.2 L 1 15.2 Z M 4.8 19 C 3.943 19 3.361 18.999 2.911 18.962 C 2.473 18.927 2.248 18.862 2.092 18.782 L 1.184 20.564 C 1.669 20.811 2.186 20.91 2.748 20.956 C 3.299 21.001 3.976 21 4.8 21 L 4.8 19 Z M -1 15.2 C -1 16.024 -1.001 16.701 -0.956 17.252 C -0.91 17.814 -0.811 18.331 -0.564 18.816 L 1.218 17.908 C 1.138 17.752 1.073 17.527 1.038 17.089 C 1.001 16.639 1 16.057 1 15.2 L -1 15.2 Z M 2.092 18.782 C 1.716 18.59 1.41 18.284 1.218 17.908 L -0.564 18.816 C -0.181 19.569 0.431 20.181 1.184 20.564 L 2.092 18.782 Z M 17 15.2 C 17 16.057 16.999 16.639 16.962 17.089 C 16.927 17.527 16.862 17.752 16.782 17.908 L 18.564 18.816 C 18.811 18.331 18.91 17.814 18.956 17.252 C 19.001 16.701 19 16.024 19 15.2 L 17 15.2 Z M 13.2 21 C 14.024 21 14.701 21.001 15.252 20.956 C 15.814 20.91 16.331 20.811 16.816 20.564 L 15.908 18.782 C 15.752 18.862 15.527 18.927 15.089 18.962 C 14.639 18.999 14.057 19 13.2 19 L 13.2 21 Z M 16.782 17.908 C 16.59 18.284 16.284 18.59 15.908 18.782 L 16.816 20.564 C 17.569 20.181 18.181 19.569 18.564 18.816 L 16.782 17.908 Z M 13.2 3 C 14.057 3 14.639 3.001 15.089 3.038 C 15.527 3.073 15.752 3.138 15.908 3.218 L 16.816 1.436 C 16.331 1.189 15.814 1.09 15.252 1.044 C 14.701 0.999 14.024 1 13.2 1 L 13.2 3 Z M 19 6.8 C 19 5.976 19.001 5.299 18.956 4.748 C 18.91 4.186 18.811 3.669 18.564 3.184 L 16.782 4.092 C 16.862 4.248 16.927 4.473 16.962 4.911 C 16.999 5.361 17 5.943 17 6.8 L 19 6.8 Z M 15.908 3.218 C 16.284 3.41 16.59 3.716 16.782 4.092 L 18.564 3.184 C 18.181 2.431 17.569 1.819 16.816 1.436 L 15.908 3.218 Z M 4.8 1 C 3.976 1 3.299 0.999 2.748 1.044 C 2.186 1.09 1.669 1.189 1.184 1.436 L 2.092 3.218 C 2.248 3.138 2.473 3.073 2.911 3.038 C 3.361 3.001 3.943 3 4.8 3 L 4.8 1 Z M 1 6.8 C 1 5.943 1.001 5.361 1.038 4.911 C 1.073 4.473 1.138 4.248 1.218 4.092 L -0.564 3.184 C -0.811 3.669 -0.91 4.186 -0.956 4.748 C -1.001 5.299 -1 5.976 -1 6.8 L 1 6.8 Z M 1.184 1.436 C 0.431 1.819 -0.181 2.431 -0.564 3.184 L 1.218 4.092 C 1.41 3.716 1.716 3.41 2.092 3.218 L 1.184 1.436 Z M 12 0 L 12 4 L 14 4 L 14 0 L 12 0 Z M 4 0 L 4 4 L 6 4 L 6 0 L 4 0 Z" fill="currentColor" fillRule="nonzero" transform="matrix(1 0 0 1 3 2)" />
        </symbol>
        <symbol id="i-dash-s" viewBox="0 0 24 24">
          <path d="M 2.568 0 C 3.856 0 5.147 0 6.432 0 C 6.684 0 6.93 0 7.138 0.017 C 7.367 0.036 7.637 0.08 7.908 0.218 C 8.284 0.41 8.59 0.716 8.782 1.092 C 8.92 1.363 8.964 1.633 8.983 1.862 C 9 2.07 9 2.316 9 2.568 L 9 6.432 C 9 6.684 9 6.93 8.983 7.138 C 8.964 7.367 8.92 7.637 8.782 7.908 C 8.59 8.284 8.284 8.59 7.908 8.782 C 7.637 8.92 7.367 8.964 7.138 8.983 C 6.93 9 6.684 9 6.432 9 L 2.568 9 C 2.316 9 2.07 9 1.862 8.983 C 1.633 8.964 1.363 8.92 1.092 8.782 C 0.716 8.59 0.41 8.284 0.218 7.908 C 0.08 7.637 0.036 7.367 0.017 7.138 C 0 6.93 0 6.684 0 6.432 C 0 6.421 0 6.411 0 6.4 L 0 2.6 C 0 2.589 0 2.579 0 2.568 C 0 2.316 0 2.07 0.017 1.862 C 0.036 1.633 0.08 1.363 0.218 1.092 C 0.41 0.716 0.716 0.41 1.092 0.218 C 1.363 0.08 1.633 0.036 1.862 0.017 C 2.07 0 2.316 0 2.568 0 Z" fill="currentColor" fillRule="evenodd" transform="matrix(1 0 0 1 2 2)" />
          <path d="M 2.568 11 C 3.856 11 5.147 11 6.432 11 C 6.684 11 6.93 11 7.138 11.017 C 7.367 11.036 7.637 11.08 7.908 11.218 C 8.284 11.41 8.59 11.716 8.782 12.092 C 8.92 12.363 8.964 12.633 8.983 12.862 C 9 13.07 9 13.316 9 13.568 L 9 17.432 C 9 17.684 9 17.93 8.983 18.138 C 8.964 18.367 8.92 18.637 8.782 18.908 C 8.59 19.284 8.284 19.59 7.908 19.782 C 7.637 19.92 7.367 19.964 7.138 19.983 C 6.93 20 6.684 20 6.432 20 L 2.568 20 C 2.316 20 2.07 20 1.862 19.983 C 1.633 19.964 1.363 19.92 1.092 19.782 C 0.716 19.59 0.41 19.284 0.218 18.908 C 0.08 18.637 0.036 18.367 0.017 18.138 C 0 17.93 0 17.684 0 17.432 C 0 17.421 0 17.411 0 17.4 L 0 13.6 C 0 13.589 0 13.579 0 13.568 C 0 13.316 0 13.07 0.017 12.862 C 0.036 12.633 0.08 12.363 0.218 12.092 C 0.41 11.716 0.716 11.41 1.092 11.218 C 1.363 11.08 1.633 11.036 1.862 11.017 C 2.07 11 2.316 11 2.568 11 Z" fill="currentColor" fillRule="evenodd" transform="matrix(1 0 0 1 2 2)" />
          <path d="M 13.568 0 C 14.856 0 16.147 0 17.432 0 C 17.684 0 17.93 0 18.138 0.017 C 18.367 0.036 18.637 0.08 18.908 0.218 C 19.284 0.41 19.59 0.716 19.782 1.092 C 19.92 1.363 19.964 1.633 19.983 1.862 C 20 2.07 20 2.316 20 2.568 L 20 6.432 C 20 6.684 20 6.93 19.983 7.138 C 19.964 7.367 19.92 7.637 19.782 7.908 C 19.59 8.284 19.284 8.59 18.908 8.782 C 18.637 8.92 18.367 8.964 18.138 8.983 C 17.93 9 17.684 9 17.432 9 L 13.568 9 C 13.316 9 13.07 9 12.862 8.983 C 12.633 8.964 12.363 8.92 12.092 8.782 C 11.716 8.59 11.41 8.284 11.218 7.908 C 11.08 7.637 11.036 7.367 11.017 7.138 C 11 6.93 11 6.684 11 6.432 C 11 6.421 11 6.411 11 6.4 L 11 2.6 C 11 2.589 11 2.579 11 2.568 C 11 2.316 11 2.07 11.017 1.862 C 11.036 1.633 11.08 1.363 11.218 1.092 C 11.41 0.716 11.716 0.41 12.092 0.218 C 12.363 0.08 12.633 0.036 12.862 0.017 C 13.07 0 13.316 0 13.568 0 Z" fill="currentColor" fillRule="evenodd" transform="matrix(1 0 0 1 2 2)" />
          <path d="M 13.568 11 C 14.856 11 16.147 11 17.432 11 C 17.684 11 17.93 11 18.138 11.017 C 18.367 11.036 18.637 11.08 18.908 11.218 C 19.284 11.41 19.59 11.716 19.782 12.092 C 19.92 12.363 19.964 12.633 19.983 12.862 C 20 13.07 20 13.316 20 13.568 L 20 17.432 C 20 17.684 20 17.93 19.983 18.138 C 19.964 18.367 19.92 18.637 19.782 18.908 C 19.59 19.284 19.284 19.59 18.908 19.782 C 18.637 19.92 18.367 19.964 18.138 19.983 C 17.93 20 17.684 20 17.432 20 L 13.568 20 C 13.316 20 13.07 20 12.862 19.983 C 12.633 19.964 12.363 19.92 12.092 19.782 C 11.716 19.59 11.41 19.284 11.218 18.908 C 11.08 18.637 11.036 18.367 11.017 18.138 C 11 17.93 11 17.684 11 17.432 C 11 17.421 11 17.411 11 17.4 L 11 13.6 C 11 13.589 11 13.579 11 13.568 C 11 13.316 11 13.07 11.017 12.862 C 11.036 12.633 11.08 12.363 11.218 12.092 C 11.41 11.716 11.716 11.41 12.092 11.218 C 12.363 11.08 12.633 11.036 12.862 11.017 C 13.07 11 13.316 11 13.568 11 Z" fill="currentColor" fillRule="evenodd" transform="matrix(1 0 0 1 2 2)" />
        </symbol>
        <symbol id="i-users-s" viewBox="0 0 24 24">
          <path d="M 17.036 12.877 C 17.173 12.342 17.718 12.02 18.253 12.158 C 20.41 12.713 22.004 14.669 22.004 17 L 22.004 19 C 22.004 19.552 21.556 20 21.004 20 C 20.452 20 20.004 19.552 20.004 19 L 20.004 17 C 20.004 15.603 19.049 14.428 17.755 14.094 C 17.22 13.957 16.898 13.412 17.036 12.877 Z" fill="currentColor" fillRule="evenodd" transform="matrix(1 0 0 1 0.996 2)" />
          <path d="M 13.577 0.916 C 13.784 0.404 14.367 0.157 14.879 0.364 C 16.71 1.105 18.004 2.9 18.004 5 C 18.004 7.1 16.71 8.895 14.879 9.636 C 14.367 9.843 13.784 9.596 13.577 9.084 C 13.37 8.573 13.617 7.99 14.129 7.782 C 15.23 7.337 16.004 6.257 16.004 5 C 16.004 3.743 15.23 2.663 14.129 2.218 C 13.617 2.01 13.37 1.427 13.577 0.916 Z" fill="currentColor" fillRule="evenodd" transform="matrix(1 0 0 1 0.996 2)" />
          <path d="M 6.183 12 C 7.73 12 9.278 12 10.825 12 C 11.916 12 12.66 11.999 13.298 12.17 C 15.023 12.633 16.371 13.98 16.834 15.706 C 17.064 16.565 16.997 17.484 17.004 18.364 C 17.005 18.471 17.007 18.687 16.953 18.888 C 16.814 19.406 16.41 19.81 15.892 19.949 C 15.691 20.003 15.475 20.001 15.368 20 C 10.793 19.964 6.215 19.964 1.64 20 C 1.533 20.001 1.317 20.003 1.116 19.949 C 0.598 19.81 0.194 19.406 0.055 18.888 C 0.001 18.687 0.003 18.471 0.004 18.364 C 0.011 17.486 -0.056 16.564 0.174 15.706 C 0.637 13.98 1.984 12.633 3.71 12.17 C 4.348 11.999 5.092 12 6.183 12 Z" fill="currentColor" fillRule="evenodd" transform="matrix(1 0 0 1 0.996 2)" />
          <path d="M 3.504 5 C 3.504 2.239 5.743 0 8.504 0 C 11.265 0 13.504 2.239 13.504 5 C 13.504 7.761 11.265 10 8.504 10 C 5.743 10 3.504 7.761 3.504 5 Z" fill="currentColor" fillRule="evenodd" transform="matrix(1 0 0 1 0.996 2)" />
        </symbol>
        <symbol id="i-apps-s" viewBox="0 0 24 24">
          <path d="M 5.5 3.5 C 5.5 1.567 7.067 0 9 0 C 10.933 0 12.5 1.567 12.5 3.5 L 12.5 4 L 12.534 4 C 13.204 4 13.757 4 14.21 4.031 C 14.679 4.063 15.113 4.131 15.531 4.304 C 16.511 4.71 17.29 5.489 17.696 6.469 C 17.869 6.887 17.937 7.321 17.969 7.79 C 17.984 8.004 17.991 8.24 17.995 8.5 L 18.5 8.5 C 20.433 8.5 22 10.067 22 12 C 22 13.933 20.433 15.5 18.5 15.5 L 18 15.5 L 18 16.241 C 18 17.046 18 17.711 17.956 18.252 C 17.91 18.814 17.811 19.331 17.564 19.816 C 17.181 20.569 16.569 21.181 15.816 21.564 C 15.331 21.811 14.814 21.91 14.252 21.956 C 13.711 22 13.046 22 12.241 22 L 11.5 22 C 10.948 22 10.5 21.552 10.5 21 L 10.5 19.25 C 10.5 18.56 9.94 18 9.25 18 C 8.56 18 8 18.56 8 19.25 L 8 21 C 8 21.552 7.552 22 7 22 L 5.759 22 C 4.954 22 4.289 22 3.748 21.956 C 3.186 21.91 2.669 21.811 2.184 21.564 C 1.431 21.181 0.819 20.569 0.436 19.816 C 0.189 19.331 0.09 18.814 0.044 18.252 C 0 17.711 0 17.046 0 16.241 L 0 14.5 C 0 13.948 0.448 13.5 1 13.5 L 2.5 13.5 C 3.328 13.5 4 12.828 4 12 C 4 11.172 3.328 10.5 2.5 10.5 L 1 10.5 C 0.448 10.5 0 10.052 0 9.5 L 0 9.466 C 0 8.796 0 8.243 0.031 7.79 C 0.063 7.321 0.131 6.887 0.304 6.469 C 0.71 5.489 1.489 4.71 2.469 4.304 C 2.887 4.131 3.321 4.063 3.79 4.031 C 4.243 4 4.796 4 5.466 4 L 5.5 4 L 5.5 3.5 Z" fill="currentColor" fillRule="evenodd" transform="matrix(1 0 0 1 1 1)" />
        </symbol>
        <symbol id="i-msg-s" viewBox="0 0 24 24">
          <path d="M 14.241 0 L 5.759 0 C 4.954 0 4.289 0 3.748 0.044 C 3.186 0.09 2.669 0.189 2.184 0.436 C 1.431 0.819 0.82 1.431 0.436 2.184 C 0.189 2.669 0.09 3.186 0.044 3.748 C 0 4.289 0 4.954 0 5.759 L 0 12.138 C 0 12.933 -0.001 13.524 0.136 14.035 C 0.506 15.416 1.584 16.494 2.965 16.864 C 3.272 16.946 3.608 16.979 4 16.992 L 4 18.371 C 4 18.606 4 18.846 4.018 19.043 C 4.035 19.23 4.08 19.585 4.328 19.895 C 4.613 20.252 5.045 20.46 5.502 20.46 C 5.899 20.459 6.204 20.273 6.361 20.169 C 6.526 20.06 6.713 19.91 6.897 19.763 L 9.31 17.833 C 9.829 17.418 9.983 17.301 10.143 17.219 C 10.303 17.137 10.474 17.077 10.65 17.041 C 10.826 17.005 11.02 17 11.684 17 L 14.241 17 C 15.046 17 15.711 17 16.252 16.956 C 16.814 16.91 17.331 16.811 17.816 16.564 C 18.569 16.181 19.181 15.569 19.564 14.816 C 19.811 14.331 19.91 13.814 19.956 13.252 C 20 12.711 20 12.046 20 11.241 L 20 5.759 C 20 4.954 20 4.289 19.956 3.748 C 19.91 3.186 19.811 2.669 19.564 2.184 C 19.181 1.431 18.569 0.819 17.816 0.436 C 17.331 0.189 16.814 0.09 16.252 0.044 C 15.711 0 15.046 0 14.241 0 Z M 9.489 5.672 C 9.743 5.523 10.042 5.468 10.332 5.518 C 10.623 5.568 10.886 5.719 11.076 5.944 C 11.266 6.17 11.37 6.455 11.37 6.75 L 11.37 6.752 C 11.37 6.97 11.192 7.271 10.691 7.606 C 10.47 7.753 10.243 7.867 10.066 7.946 C 9.98 7.984 9.909 8.013 9.862 8.03 C 9.838 8.039 9.821 8.045 9.811 8.049 L 9.802 8.052 L 9.804 8.052 C 9.281 8.227 8.998 8.793 9.173 9.316 C 9.345 9.835 9.922 10.12 10.439 9.948 C 10.484 9.933 10.529 9.916 10.574 9.899 C 10.65 9.87 10.755 9.828 10.879 9.773 C 11.124 9.664 11.458 9.498 11.8 9.27 C 12.422 8.855 13.369 8.032 13.37 6.752 C 13.37 5.985 13.1 5.243 12.606 4.656 C 12.112 4.07 11.426 3.676 10.67 3.547 C 9.914 3.417 9.137 3.559 8.475 3.948 C 7.814 4.337 7.312 4.947 7.057 5.67 C 6.874 6.191 7.147 6.762 7.668 6.946 C 8.189 7.129 8.76 6.855 8.944 6.334 C 9.041 6.056 9.235 5.821 9.489 5.672 Z M 10.15 11 C 9.598 11 9.15 11.448 9.15 12 C 9.15 12.552 9.598 13 10.15 13 L 10.16 13 C 10.712 13 11.16 12.552 11.16 12 C 11.16 11.448 10.712 11 10.16 11 L 10.15 11 Z" fill="currentColor" fillRule="evenodd" transform="matrix(1 0 0 1 2 2)" />
        </symbol>
      </svg>
      <div style={{position: "fixed", left: "50%", bottom: "16px", transform: "translateX(-50%)", zIndex: "2000", display: "flex", gap: "4px", padding: "4px", borderRadius: "12px", background: "#18181B", boxShadow: "0 8px 24px rgba(0,0,0,.2)"}}>
        {" "}
        {(V.themeSwitch || []).map((t, t$i) => (<React.Fragment key={t$i}>
          {" "}
          <button onClick={t.pick} style={{height: "32px", padding: "0 12px", borderRadius: "8px", border: "none", fontSize: "13px", fontWeight: "600", cursor: "pointer", background: t.bg, color: t.fg, display: "flex", alignItems: "center", gap: "8px"}} className="hv1">
            <span style={{width: "12px", height: "12px", borderRadius: "50%", background: t.dot}} />
            {I(t.name)}
          </button>
          {" "}
        </React.Fragment>))}
      </div>
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
              <button aria-label={V.sideTip} data-tip={V.sideTip} data-tip-side={V.sideTipSide} onClick={V.toggleSide} style={{width: "40px", height: "40px", borderRadius: "8px", border: "none", background: "transparent", color: "var(--muted)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flex: "none"}} className="hv2">
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
            <button aria-label="Expand sidebar" data-tip="Expand sidebar" data-tip-side="right" onClick={V.toggleSide} style={{marginTop: "12px", width: "44px", height: "44px", border: "none", borderRadius: "10px", background: "transparent", color: "var(--muted)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"}} className="hv3">
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
                <button aria-current={n.current} onClick={n.onClick} onMouseEnter={n.enter} onMouseLeave={V.tipOff} aria-label={n.label} style={{width: V.itemW, height: "44px", borderRadius: "10px", padding: `0 ${V.itemPad}`, display: "flex", alignItems: "center", justifyContent: V.itemJustify, gap: "12px", border: "none", background: n.bg, color: n.color, fontSize: "14px", lineHeight: "20px", fontWeight: n.weight, cursor: "pointer", textAlign: "left", whiteSpace: "nowrap", "--hv4-0": n.hoverBg}} className="hv4">
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
                  <span style={{position: "absolute", left: "calc(100% + 10px)", top: "50%", transform: "translateY(-50%)", background: "var(--tip)", color: "var(--colors-text-text-white)", boxShadow: "0px 10px 15px 0px rgba(64,70,104,0.1), 0px 4px 6px 0px rgba(64,70,104,0.05)", fontSize: "12px", lineHeight: "18px", fontWeight: "600", padding: "8px 12px", borderRadius: "8px", whiteSpace: "nowrap", pointerEvents: "none", zIndex: "60"}}>
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
            <div style={{padding: "12px", borderRadius: "12px", border: "1px solid var(--border)", background: "var(--colors-background-bg-primary)", display: "flex", flexDirection: "column", gap: "8px"}}>
              {" "}
              <div style={{display: "flex", alignItems: "center", gap: "6px", color: "var(--muted)"}}>
                {" "}
                <svg width="16" height="16" viewBox="0 0 24 24" style={{flex: "none", fill: "currentColor", color: "var(--colors-foreground-fg-brand-primary-600)"}}>
                  <use href="#i-coin" />
                </svg>
                {" "}
                <span style={{fontSize: "12px", lineHeight: "18px", fontWeight: "500"}}>
                  {"Credits left"}
                </span>
                {" "}
              </div>
              {" "}
              <div style={{display: "flex", alignItems: "baseline", gap: "4px"}}>
                {" "}
                <span style={{fontSize: "24px", lineHeight: "32px", fontWeight: "600", color: "var(--ink)", fontVariantNumeric: "proportional-nums"}}>
                  {"1,148"}
                </span>
                {" "}
                <span style={{fontSize: "14px", lineHeight: "20px", fontWeight: "500", color: "var(--muted)"}}>
                  {"/ 2,000"}
                </span>
                {" "}
              </div>
              {" "}
              <div role="progressbar" aria-label="Credits left" aria-valuenow="57" aria-valuemin="0" aria-valuemax="100" style={{height: "8px", borderRadius: "999px", background: "var(--colors-background-bg-quaternary)", overflow: "hidden"}}>
                <div style={{width: "57%", height: "100%", borderRadius: "999px", background: "var(--component-colors-components-progressbars-brand)"}} />
              </div>
              {" "}
              <span style={{fontSize: "12px", lineHeight: "18px", color: "var(--muted)"}}>
                {"57% of your plan remaining"}
              </span>
              {" "}
            </div>
            {" "}
          </>)}
          {" "}
          {V.collapsed && (<>
            {" "}
            <div style={{display: "flex", justifyContent: "center", position: "relative"}} onMouseEnter={V.tipCredits} onMouseLeave={V.tipOff}>
              {" "}
              <span style={{width: "32px", height: "32px", borderRadius: "50%", background: "var(--tint)", color: "var(--tint-ink)", display: "flex", alignItems: "center", justifyContent: "center"}}>
                {" "}
                <svg width="16" height="16" viewBox="0 0 24 24" style={{flex: "none", fill: "currentColor"}}>
                  <use href="#i-coin" />
                </svg>
                {" "}
              </span>
              {" "}
              {V.creditsTip && (<>
                <span style={{position: "absolute", left: "calc(100% + 10px)", top: "50%", transform: "translateY(-50%)", background: "var(--tip)", color: "var(--colors-text-text-white)", boxShadow: "0px 10px 15px 0px rgba(64,70,104,0.1), 0px 4px 6px 0px rgba(64,70,104,0.05)", fontSize: "12px", lineHeight: "18px", fontWeight: "600", padding: "8px 12px", borderRadius: "8px", whiteSpace: "nowrap", pointerEvents: "none", zIndex: "60"}}>
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
                <button onMouseEnter={n.enter} onMouseLeave={V.tipOff} aria-label={n.label} style={{width: V.itemW, height: "44px", borderRadius: "10px", padding: `0 ${V.itemPad}`, display: "flex", alignItems: "center", justifyContent: V.itemJustify, gap: "12px", border: "none", background: "transparent", color: "var(--ink)", fontSize: "14px", lineHeight: "20px", fontWeight: "500", cursor: "pointer", textAlign: "left"}} className="hv5">
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
                  <span style={{position: "absolute", left: "calc(100% + 10px)", top: "50%", transform: "translateY(-50%)", background: "var(--tip)", color: "var(--colors-text-text-white)", boxShadow: "0px 10px 15px 0px rgba(64,70,104,0.1), 0px 4px 6px 0px rgba(64,70,104,0.05)", fontSize: "12px", lineHeight: "18px", fontWeight: "600", padding: "8px 12px", borderRadius: "8px", whiteSpace: "nowrap", pointerEvents: "none", zIndex: "60"}}>
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
                    <button style={{display: "inline-flex", alignItems: "center", gap: "8px", height: "40px", padding: "0 16px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--colors-background-bg-primary)", color: "var(--ink)", fontSize: "14px", lineHeight: "20px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap"}} className="hv6">
                      {" "}
                      <svg width="20" height="20" viewBox="-1.333 -1.333 26.667 26.667" style={{flex: "none", fill: "currentColor", color: "var(--colors-foreground-fg-brand-primary-600)"}}>
                        <use href="#i-sparkles" x="0" y="0" width="24" height="24" />
                      </svg>
                      {"Create Assessment using AI "}
                    </button>
                    {" "}
                    <button style={{display: "inline-flex", alignItems: "center", gap: "8px", height: "40px", padding: "0 16px", borderRadius: "8px", border: "1px solid var(--brand)", background: "var(--brand)", color: "var(--colors-text-text-primary-on-brand)", fontSize: "14px", lineHeight: "20px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap"}} className="hv7">
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
                      <button onClick={V.toggleStatusMenu} aria-haspopup="listbox" style={{width: "168px", height: "40px", borderRadius: "10px", border: "none", background: "var(--colors-background-bg-primary)", boxShadow: "inset 0 0 0 1px var(--border), 0 1px 2px rgba(16,24,40,.04)", padding: "0 12px 0 14px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", fontSize: "14px", lineHeight: "20px", fontWeight: "500", cursor: "pointer", color: "var(--ink)"}} className="hv8">
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
                        <div role="listbox" style={{position: "absolute", top: "calc(100% + 6px)", right: "0", width: "240px", background: "var(--colors-background-bg-primary)", border: "1px solid var(--border)", borderRadius: "10px", padding: "4px 0", boxShadow: "0 1px 2px rgba(16,24,40,.04), 0 12px 32px -6px rgba(16,24,40,.14)", zIndex: "40", animation: "fin .12s ease"}}>
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
                              <button role="option" onClick={o.pick} style={{width: "calc(100% - 8px)", margin: "0 4px", height: "40px", borderRadius: "8px", border: "none", background: o.bg, padding: `8px 10px 8px ${o.padL}`, display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", lineHeight: "20px", fontWeight: "500", color: "var(--ink)", cursor: "pointer", textAlign: "left"}} className="hv9">
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
                    <button onClick={V.toggleCreatedBy} style={{height: "40px", borderRadius: "10px", border: "none", background: "var(--colors-background-bg-primary)", boxShadow: "inset 0 0 0 1px var(--border), 0 1px 2px rgba(16,24,40,.04)", padding: "0 12px 0 14px", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", lineHeight: "20px", fontWeight: "500", cursor: "pointer", color: "var(--ink)", whiteSpace: "nowrap"}} className="hv10">
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
                    <button aria-label="Refresh assessments" data-tip="Refresh assessments" onClick={V.refresh} style={{width: "40px", height: "40px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--colors-background-bg-primary)", color: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"}} className="hv11">
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
                          <div role="button" tabIndex="0" onClick={r.open} onKeyDown={r.key} style={{display: "grid", gridTemplateColumns: "minmax(0,299fr) minmax(0,177fr) minmax(0,176fr) minmax(0,177fr) minmax(0,84fr) minmax(0,148fr)", height: "64px", alignItems: "center", borderTop: r.divider, cursor: "pointer", background: "var(--colors-background-bg-primary)"}} className="hv12">
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
                                <button aria-label="View Statistics" onClick={r.stats} onMouseEnter={r.enterS} onMouseLeave={V.tipOff} onFocus={r.enterS} onBlur={V.tipOff} style={{width: "36px", height: "36px", borderRadius: "8px", border: "none", background: "transparent", color: "var(--muted)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"}} className="hv13">
                                  {" "}
                                  <svg width="20" height="20" viewBox="-1.333 -1.333 26.667 26.667" style={{flex: "none", fill: "currentColor"}}>
                                    <use href="#i-chart" x="0" y="0" width="24" height="24" />
                                  </svg>
                                  {" "}
                                </button>
                                {" "}
                                {r.statsTip && (<>
                                  <span style={{position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)", background: "var(--tip)", color: "var(--colors-text-text-white)", boxShadow: "0px 10px 15px 0px rgba(64,70,104,0.1), 0px 4px 6px 0px rgba(64,70,104,0.05)", fontSize: "12px", lineHeight: "18px", fontWeight: "600", padding: "8px 12px", borderRadius: "8px", whiteSpace: "nowrap", pointerEvents: "none", zIndex: "30"}}>
                                    {"View Statistics"}
                                    <span style={{position: "absolute", bottom: "-4px", left: "50%", width: "8px", height: "8px", background: "var(--tip)", transform: "translateX(-50%) rotate(45deg)"}} />
                                  </span>
                                </>)}
                                {" "}
                              </div>
                              {" "}
                              <div style={{position: "relative", display: "flex"}}>
                                {" "}
                                <button aria-label="Clone Assessment" onClick={r.clone} onMouseEnter={r.enterC} onMouseLeave={V.tipOff} onFocus={r.enterC} onBlur={V.tipOff} style={{width: "36px", height: "36px", borderRadius: "8px", border: "none", background: "transparent", color: "var(--muted)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"}} className="hv14">
                                  {" "}
                                  <svg width="20" height="20" viewBox="-1.333 -1.333 26.667 26.667" style={{flex: "none", fill: "currentColor"}}>
                                    <use href="#i-copy" x="0" y="0" width="24" height="24" />
                                  </svg>
                                  {" "}
                                </button>
                                {" "}
                                {r.cloneTip && (<>
                                  <span style={{position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)", background: "var(--tip)", color: "var(--colors-text-text-white)", boxShadow: "0px 10px 15px 0px rgba(64,70,104,0.1), 0px 4px 6px 0px rgba(64,70,104,0.05)", fontSize: "12px", lineHeight: "18px", fontWeight: "600", padding: "8px 12px", borderRadius: "8px", whiteSpace: "nowrap", pointerEvents: "none", zIndex: "30"}}>
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
                            <button onClick={V.toggle_rows} aria-haspopup="listbox" style={{width: "80px", height: V.rowsH, borderRadius: "10px", border: "none", background: "var(--colors-background-bg-primary)", boxShadow: "inset 0 0 0 1px var(--border), 0 1px 2px rgba(16,24,40,.04)", padding: "0 12px 0 14px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", fontSize: "14px", lineHeight: "20px", fontWeight: "500", cursor: "pointer", color: "var(--ink)"}} className="hv15">
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
                              <div role="listbox" style={{position: "absolute", bottom: "calc(100% + 6px)", left: "0", width: "100%", minWidth: "max-content", background: "var(--colors-background-bg-primary)", border: "1px solid var(--border)", borderRadius: "10px", padding: "4px 0", boxShadow: "0 1px 2px rgba(16,24,40,.04), 0 12px 32px -6px rgba(16,24,40,.14)", zIndex: "90", animation: "fin .12s ease"}}>
                                {" "}
                                {(V.opts_rows || []).map((o, o$i) => (<React.Fragment key={o$i}>
                                  {" "}
                                  <button role="option" onClick={o.pick} style={{width: "calc(100% - 8px)", margin: "0 4px", height: "40px", borderRadius: "8px", border: "none", background: o.bg, padding: "8px 10px 8px 8px", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", lineHeight: "20px", fontWeight: "500", color: "var(--ink)", cursor: "pointer", textAlign: "left", whiteSpace: "nowrap"}} className="hv16">
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
                          <button aria-label="First page" data-tip="First page" onClick={V.firstPage} style={{width: "40px", height: "40px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--colors-background-bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"}} className="hv17">
                            <svg width="20" height="20" viewBox="-1.333 -1.333 26.667 26.667" style={{flex: "none", fill: "currentColor"}}>
                              <use href="#i-first" x="0" y="0" width="24" height="24" />
                            </svg>
                          </button>
                          {" "}
                          <button aria-label="Previous page" data-tip="Previous page" onClick={V.prevPage} style={{width: "40px", height: "40px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--colors-background-bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"}} className="hv18">
                            <svg width="20" height="20" viewBox="-1.333 -1.333 26.667 26.667" style={{flex: "none", fill: "currentColor"}}>
                              <use href="#i-left" x="0" y="0" width="24" height="24" />
                            </svg>
                          </button>
                          {" "}
                          <div style={{display: "flex", gap: "2px"}}>
                            {" "}
                            {(V.pages || []).map((p, p$i) => (<React.Fragment key={p$i}>
                              {" "}
                              <button onClick={p.go} disabled={p.gap} style={{width: "40px", height: "40px", borderRadius: "8px", border: "none", background: p.bg, fontSize: "14px", lineHeight: "20px", fontWeight: p.weight, color: p.color, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"}} className="hv19">
                                {I(p.label)}
                              </button>
                              {" "}
                            </React.Fragment>))}
                            {" "}
                          </div>
                          {" "}
                          <button aria-label="Next page" data-tip="Next page" onClick={V.nextPage} style={{width: "40px", height: "40px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--colors-background-bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"}} className="hv20">
                            <svg width="20" height="20" viewBox="-1.333 -1.333 26.667 26.667" style={{flex: "none", fill: "currentColor"}}>
                              <use href="#i-right" x="0" y="0" width="24" height="24" />
                            </svg>
                          </button>
                          {" "}
                          <button aria-label="Last page" data-tip="Last page" onClick={V.lastPage} style={{width: "40px", height: "40px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--colors-background-bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"}} className="hv21">
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
                  <button onClick={V.goList} style={{height: "28px", display: "inline-flex", alignItems: "center", gap: "6px", border: "none", background: "transparent", padding: "0 4px 0 0", color: "var(--muted)", fontSize: "14px", lineHeight: "20px", fontWeight: "500", cursor: "pointer", borderRadius: "6px"}} className="hv22">
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
                          <button aria-label="Edit End Date" data-tip="Edit End Date" style={{width: "28px", height: "28px", borderRadius: "8px", border: "none", background: "transparent", color: "var(--muted)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"}} className="hv23">
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
                      <button onClick={V.cloneCur} style={{display: "inline-flex", alignItems: "center", gap: "8px", height: "40px", padding: "0 10px", borderRadius: "8px", border: "none", background: "transparent", color: "var(--colors-text-text-brand-secondary-700)", fontSize: "14px", lineHeight: "20px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap"}} className="hv24">
                        {" "}
                        <svg width="20" height="20" viewBox="-1.333 -1.333 26.667 26.667" style={{flex: "none", fill: "currentColor"}}>
                          <use href="#i-copy" x="0" y="0" width="24" height="24" />
                        </svg>
                        {"Clone Assessment "}
                      </button>
                      {" "}
                      <button onClick={V.goStats} style={{display: "inline-flex", alignItems: "center", gap: "8px", height: "40px", padding: "0 16px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--colors-background-bg-primary)", color: "var(--ink)", fontSize: "14px", lineHeight: "20px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap"}} className="hv25">
                        {" "}
                        <svg width="20" height="20" viewBox="-1.333 -1.333 26.667 26.667" style={{flex: "none", fill: "currentColor"}}>
                          <use href="#i-chart" x="0" y="0" width="24" height="24" />
                        </svg>
                        {"View Statistics "}
                      </button>
                      {" "}
                      <button onClick={V.openDrawer} style={{display: "inline-flex", alignItems: "center", gap: "8px", height: "40px", padding: "0 16px", borderRadius: "8px", border: "1px solid var(--brand)", background: "var(--brand)", color: "var(--colors-text-text-primary-on-brand)", fontSize: "14px", lineHeight: "20px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap"}} className="hv26">
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
                      <button role="tab" onClick={t.pick} style={{display: "flex", alignItems: "center", gap: "8px", padding: "0 2px 12px", border: "none", background: "transparent", fontSize: "14px", lineHeight: "20px", fontWeight: "600", color: t.color, boxShadow: `inset 0 -2px 0 ${t.line}`, marginBottom: "-1px", cursor: "pointer", borderRadius: "4px 4px 0 0"}} className="hv27">
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
                        <button style={{display: "inline-flex", alignItems: "center", gap: "8px", height: "40px", padding: "0 10px", borderRadius: "8px", border: "none", background: "transparent", color: "var(--colors-text-text-brand-secondary-700)", fontSize: "14px", lineHeight: "20px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap"}} className="hv28">
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
                          <button onClick={a.pick} style={{height: "36px", borderRadius: "8px", border: "none", padding: "0 10px", textAlign: "left", background: a.bg, fontSize: "14px", lineHeight: "20px", fontWeight: a.weight, color: a.color, cursor: "pointer"}} className="hv29">
                            {I(a.label)}
                          </button>
                          {" "}
                        </React.Fragment>))}
                        {" "}
                      </div>
                      {" "}
                      <div style={{flex: "1", minWidth: "0"}}>
                        {" "}
                        <div style={{display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", paddingBottom: "16px", borderBottom: "1px solid var(--border)"}}>
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
                            <span style={{position: "absolute", top: "2px", left: V.master.knob, width: "16px", height: "16px", borderRadius: "50%", background: "var(--colors-background-bg-primary)", boxShadow: "0 1px 2px rgba(0,0,0,.2)", transition: "left .15s", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand)"}}>
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
                        <div style={{display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: "12px", margin: "16px 0 8px"}}>
                          {" "}
                          {(V.templates || []).map((p, p$i) => (<React.Fragment key={p$i}>
                            {" "}
                            <button onClick={p.pick} style={{textAlign: "left", padding: "12px 16px", borderRadius: "10px", border: `1px ${p.borderStyle} ${p.borderColor}`, background: p.bg, cursor: "pointer", display: "flex", flexDirection: "column"}} className="hv30">
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
                          <div style={{padding: "12px 0", borderBottom: "1px solid var(--border)"}}>
                            {" "}
                            <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", minHeight: "20px"}}>
                              {" "}
                              <span style={{fontWeight: "500", color: t.labelColor}}>
                                {I(t.label)}
                              </span>
                              {" "}
                              <button role="switch" aria-label={t.label} onClick={t.toggle} disabled={t.disabled} style={{position: "relative", width: "36px", height: "20px", borderRadius: "999px", border: "none", padding: "0", background: t.track, cursor: "pointer", flex: "none", opacity: t.op, transition: "background .15s"}}>
                                {" "}
                                <span style={{position: "absolute", top: "2px", left: t.knob, width: "16px", height: "16px", borderRadius: "50%", background: "var(--colors-background-bg-primary)", boxShadow: "0 1px 2px rgba(0,0,0,.2)", transition: "left .15s", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand)"}}>
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
                              <div style={{marginTop: "12px", paddingLeft: "16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px"}}>
                                {" "}
                                <span>
                                  {I(t.subLabel)}
                                </span>
                                {" "}
                                <button role="switch" aria-label={t.subLabel} onClick={t.subToggle} style={{position: "relative", width: "36px", height: "20px", borderRadius: "999px", border: "none", padding: "0", background: t.subTrack, cursor: "pointer", flex: "none", opacity: t.subOp, transition: "background .15s"}}>
                                  {" "}
                                  <span style={{position: "absolute", top: "2px", left: t.subKnob, width: "16px", height: "16px", borderRadius: "50%", background: "var(--colors-background-bg-primary)", boxShadow: "0 1px 2px rgba(0,0,0,.2)", transition: "left .15s", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand)"}}>
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
                              <div style={{marginTop: "12px", paddingLeft: "16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px"}}>
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
                                    <button aria-label="Increase" onClick={V.warnUp} style={{flex: "1", width: "24px", border: "none", background: "var(--colors-background-bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--muted)", padding: "0"}} className="hv31">
                                      <svg width="12" height="12" viewBox="0 0 24 24" style={{fill: "currentColor"}}>
                                        <use href="#i-up" />
                                      </svg>
                                    </button>
                                    {" "}
                                    <button aria-label="Decrease" onClick={V.warnDown} style={{flex: "1", width: "24px", border: "none", borderTop: "1px solid var(--border)", background: "var(--colors-background-bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--muted)", padding: "0"}} className="hv32">
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
                  <button onClick={V.goBackFromStats} style={{height: "28px", display: "inline-flex", alignItems: "center", gap: "6px", border: "none", background: "transparent", padding: "0 4px 0 0", color: "var(--muted)", fontSize: "14px", lineHeight: "20px", fontWeight: "500", cursor: "pointer", borderRadius: "6px"}} className="hv33">
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
                        <button aria-label="Candidates are still taking this assessment." data-tip="Candidates are still taking this assessment." style={{width: "24px", height: "24px", borderRadius: "6px", border: "none", background: "transparent", color: "var(--muted)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: "0"}} className="hv34">
                          {" "}
                          <svg width="16" height="16" viewBox="0 0 24 24" style={{flex: "none", fill: "currentColor"}}>
                            <use href="#i-info" />
                          </svg>
                          {" "}
                        </button>
                        {" "}
                      </div>
                      {" "}
                      <button onClick={V.download} style={{display: "inline-flex", alignItems: "center", gap: "8px", height: "40px", padding: "0 16px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--colors-background-bg-primary)", color: "var(--ink)", fontSize: "14px", lineHeight: "20px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap"}} className="hv35">
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
                        <button onClick={V.toggleCandMenu} style={{width: "150px", height: "40px", borderRadius: "10px", border: "none", background: "var(--colors-background-bg-primary)", boxShadow: "inset 0 0 0 1px var(--border), 0 1px 2px rgba(16,24,40,.04)", padding: "0 12px 0 14px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", fontSize: "14px", lineHeight: "20px", fontWeight: "500", cursor: "pointer", color: "var(--ink)"}} className="hv36">
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
                          <div style={{position: "absolute", top: "calc(100% + 6px)", right: "0", width: "200px", background: "var(--colors-background-bg-primary)", border: "1px solid var(--border)", borderRadius: "10px", padding: "4px 0", boxShadow: "0 1px 2px rgba(16,24,40,.04), 0 12px 32px -6px rgba(16,24,40,.14)", zIndex: "40", animation: "fin .12s ease"}}>
                            {" "}
                            {(V.candOptions || []).map((o, o$i) => (<React.Fragment key={o$i}>
                              {" "}
                              <button onClick={o.pick} style={{width: "calc(100% - 8px)", margin: "0 4px", height: "40px", borderRadius: "8px", border: "none", background: o.bg, padding: "8px 10px 8px 8px", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", lineHeight: "20px", fontWeight: "500", color: "var(--ink)", cursor: "pointer", textAlign: "left"}} className="hv37">
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
                  <div style={{display: "grid", gridTemplateColumns: "72px 2fr 1.3fr 1.2fr 1.1fr 72px", height: "43px", background: "var(--subtle)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", fontSize: "12px", lineHeight: "18px", fontWeight: "500", color: "var(--muted)"}}>
                    {" "}
                    <div style={{padding: "12px 20px"}}>
                      {"S.No"}
                    </div>
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
                    <div style={{padding: "12px 20px"}}>
                      {"Actions"}
                    </div>
                    {" "}
                  </div>
                  {" "}
                  {(V.candidates || []).map((c, c$i) => (<React.Fragment key={c$i}>
                    {" "}
                    <div style={{display: "grid", gridTemplateColumns: "72px 2fr 1.3fr 1.2fr 1.1fr 72px", height: "64px", alignItems: "center", borderTop: c.divider}} className="hv38">
                      {" "}
                      <div style={{padding: "0 20px", color: "var(--muted)"}}>
                        {I(c.sno)}
                      </div>
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
                      <div style={{padding: "0 20px", display: "flex"}}>
                        {" "}
                        <button aria-label="View candidate details" data-tip="View candidate details" style={{width: "36px", height: "36px", borderRadius: "8px", border: "none", background: "transparent", color: "var(--muted)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"}} className="hv39">
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
                    <button onClick={V.candPrev} style={{display: "inline-flex", alignItems: "center", gap: "8px", height: "40px", padding: "0 16px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--colors-background-bg-primary)", color: "var(--ink)", fontSize: "14px", lineHeight: "20px", fontWeight: "600", cursor: "pointer"}} className="hv40">
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
                        <button onClick={p.go} disabled={p.gap} style={{width: "40px", height: "40px", borderRadius: "8px", border: "none", background: p.bg, fontSize: "14px", lineHeight: "20px", fontWeight: p.weight, color: p.color, cursor: "pointer"}} className="hv41">
                          {I(p.label)}
                        </button>
                        {" "}
                      </React.Fragment>))}
                      {" "}
                    </div>
                    {" "}
                    <button onClick={V.candNext} style={{display: "inline-flex", alignItems: "center", gap: "8px", height: "40px", padding: "0 16px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--colors-background-bg-primary)", color: "var(--ink)", fontSize: "14px", lineHeight: "20px", fontWeight: "600", cursor: "pointer"}} className="hv42">
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
            <button aria-label="Close" data-tip="Close" data-tip-side="bottom" onClick={V.closeDrawer} style={{width: "40px", height: "40px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--colors-background-bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"}} className="hv43">
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
                  <button onClick={V.toggle_inv} aria-haspopup="listbox" style={{width: "220px", height: V.invH, borderRadius: "10px", border: "none", background: "var(--colors-background-bg-primary)", boxShadow: "inset 0 0 0 1px var(--border), 0 1px 2px rgba(16,24,40,.04)", padding: "0 12px 0 14px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", fontSize: "14px", lineHeight: "20px", fontWeight: "500", cursor: "pointer", color: "var(--ink)"}} className="hv44">
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
                    <div role="listbox" style={{position: "absolute", top: "calc(100% + 6px)", left: "0", width: "100%", minWidth: "max-content", background: "var(--colors-background-bg-primary)", border: "1px solid var(--border)", borderRadius: "10px", padding: "4px 0", boxShadow: "0 1px 2px rgba(16,24,40,.04), 0 12px 32px -6px rgba(16,24,40,.14)", zIndex: "90", animation: "fin .12s ease"}}>
                      {" "}
                      {(V.opts_inv || []).map((o, o$i) => (<React.Fragment key={o$i}>
                        {" "}
                        <button role="option" onClick={o.pick} style={{width: "calc(100% - 8px)", margin: "0 4px", height: "40px", borderRadius: "8px", border: "none", background: o.bg, padding: "8px 10px 8px 8px", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", lineHeight: "20px", fontWeight: "500", color: "var(--ink)", cursor: "pointer", textAlign: "left", whiteSpace: "nowrap"}} className="hv45">
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
                        <button aria-label="Remove row" data-tip="Remove row" onClick={v.remove} style={{width: "40px", height: "40px", borderRadius: "8px", border: "none", background: "transparent", color: "var(--muted)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: "0"}} className="hv46">
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
              <button onClick={V.addInviteRow} style={{alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: "6px", padding: "0", border: "none", borderRadius: "4px", background: "transparent", color: "var(--colors-text-text-brand-secondary-700)", fontSize: "14px", lineHeight: "20px", fontWeight: "600", cursor: "pointer"}} className="hv47">
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
                <button style={{display: "inline-flex", alignItems: "center", gap: "8px", height: "40px", padding: "0 16px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--colors-background-bg-primary)", color: "var(--ink)", fontSize: "14px", lineHeight: "20px", fontWeight: "600", cursor: "pointer"}} className="hv48">
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
            <button onClick={V.closeDrawer} style={{height: "40px", padding: "0 16px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--colors-background-bg-primary)", color: "var(--ink)", fontSize: "14px", lineHeight: "20px", fontWeight: "600", cursor: "pointer"}} className="hv49">
              {"Cancel"}
            </button>
            {" "}
            <button onClick={V.sendInvite} style={{height: "40px", padding: "0 16px", borderRadius: "8px", border: "1px solid var(--brand)", background: "var(--brand)", color: "var(--colors-text-text-primary-on-brand)", fontSize: "14px", lineHeight: "20px", fontWeight: "600", cursor: "pointer"}} className="hv50">
              {"Send Invite"}
            </button>
            {" "}
          </div>
          {" "}
        </div>
      </>)}
      {V.gtip && (<>
        {" "}
        <div role="tooltip" style={{position: "fixed", left: V.gtip.left, top: V.gtip.top, transform: V.gtip.transform, background: "var(--tip)", color: "var(--colors-text-text-white)", boxShadow: "0px 10px 15px 0px rgba(64,70,104,0.1), 0px 4px 6px 0px rgba(64,70,104,0.05)", fontSize: "12px", lineHeight: "18px", fontWeight: "600", padding: "8px 12px", borderRadius: "8px", whiteSpace: "nowrap", pointerEvents: "none", zIndex: "120"}}>
          {I(V.gtip.text)}
          <span style={{position: "absolute", left: V.gtip.al, top: V.gtip.at, bottom: V.gtip.ab, marginLeft: V.gtip.ml, marginTop: V.gtip.mt, width: "8px", height: "8px", background: "var(--tip)", transform: "rotate(45deg)"}} />
        </div>
      </>)}
      {V.toast && (<>
        {" "}
        <div role="status" style={{position: "fixed", left: "50%", bottom: "24px", transform: "translateX(-50%)", background: "var(--tip)", color: "var(--colors-text-text-white)", boxShadow: "0px 10px 15px 0px rgba(64,70,104,0.1), 0px 4px 6px 0px rgba(64,70,104,0.05)", fontSize: "14px", lineHeight: "20px", fontWeight: "600", padding: "10px 16px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px", zIndex: "100", animation: "tin .2s ease", whiteSpace: "nowrap"}}>
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
