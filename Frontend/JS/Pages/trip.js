import { saveTrip, getTrip, listTrips } from "../Services/tripService.js";

(function(){
  const destinationsEl = document.getElementById('destinations');
  const addBtn = document.getElementById('addDestination');
  const saveBtn = document.getElementById('saveTrip');
  const nameInput = document.getElementById('tripName');
  const feasibilityEl = document.querySelector('.feasibility ul');

  // Helper: parse query param
  function qp(name){
    const params = new URLSearchParams(location.search);
    return params.get(name);
  }

  // Simple add clone of first card
  addBtn.addEventListener('click', ()=>{
    const template = destinationsEl.querySelector('.country-card');
    const clone = template.cloneNode(true);
    // default values clean-up
    clone.querySelector('.entry').value = '';
    clone.querySelector('.exit').value = '';
    // make country title editable for easier demo
    const title = clone.querySelector('.country-title');
    title.setAttribute('contenteditable','true');
    destinationsEl.appendChild(clone);
    attachCardListeners(clone);
    updateFeasibility();
  });

  function createCustomDropdown(select){
    if(!select) return;
    // avoid double initialization
    if(select._custom) return;
    select._custom = true;
    const wrapper = document.createElement('div'); wrapper.className = 'custom-dropdown';
    const trigger = document.createElement('button'); trigger.type='button'; trigger.className='custom-trigger';
    const label = document.createElement('span'); label.className='label'; label.textContent = select.value || select.options[0].textContent;
    const caret = document.createElement('span'); caret.className='caret'; caret.textContent='▾';
    trigger.appendChild(label); trigger.appendChild(caret);
    const menu = document.createElement('ul'); menu.className='custom-menu'; menu.style.display='none';
    Array.from(select.options).forEach(opt=>{
      const li = document.createElement('li'); li.textContent = opt.textContent; if(opt.selected) li.classList.add('selected');
      li.addEventListener('click', ()=>{
        select.value = opt.value;
        label.textContent = opt.textContent;
        Array.from(menu.querySelectorAll('li')).forEach(n=>n.classList.remove('selected'));
        li.classList.add('selected');
        menu.style.display='none';
        trigger.setAttribute('aria-expanded','false');
        // trigger native change handlers
        select.dispatchEvent(new Event('change', { bubbles: true }));
      });
      menu.appendChild(li);
    });
    wrapper.appendChild(trigger); wrapper.appendChild(menu);
    select.parentNode.insertBefore(wrapper, select);
    wrapper.appendChild(select);

    // events
    trigger.addEventListener('click', ()=>{
      const showing = menu.style.display === 'block';
      menu.style.display = showing ? 'none' : 'block';
      trigger.setAttribute('aria-expanded', !showing);
    });

    // close on outside click
    document.addEventListener('click', (ev)=>{
      if(!wrapper.contains(ev.target)){
        menu.style.display = 'none';
        trigger.setAttribute('aria-expanded','false');
      }
    });
  }

  function attachCardListeners(card){
    card.querySelector('.add-btn').addEventListener('click', ()=>{
      // add another similar card after this
      const clone = card.cloneNode(true);
      clone.querySelector('.entry').value = '';
      clone.querySelector('.exit').value = '';
      const title = clone.querySelector('.country-title');
      title.setAttribute('contenteditable','true');
      card.after(clone);
      attachCardListeners(clone);
      // initialize custom select for cloned card
      const sel = clone.querySelector('.purpose-select');
      if(sel) createCustomDropdown(sel);
      updateFeasibility();
    });
    card.querySelector('.remove-btn').addEventListener('click', ()=>{
      if(document.querySelectorAll('.country-card').length>1){
        card.remove();
        updateFeasibility();
      }
    });
    // update feasibility when dates change
    const entry = card.querySelector('.entry');
    const exit = card.querySelector('.exit');
    entry.addEventListener('change', updateFeasibility);
    exit.addEventListener('change', updateFeasibility);
    const sel = card.querySelector('.country-select');
    if(sel){
      sel.addEventListener('change', ()=>{
        const img = card.querySelector('.flag-img');
        const opt = sel.selectedOptions[0];
        const src = opt.getAttribute('data-flag');
        if(img && src) img.src = src;
        const title = card.querySelector('.country-title');
        if(title) title.innerText = opt.value;
      });
    }

    // initialize custom dropdown for the purpose select if present
    const purposeSel = card.querySelector('.purpose-select');
    if(purposeSel) createCustomDropdown(purposeSel);
  }

  // Attach to initial card
  attachCardListeners(destinationsEl.querySelector('.country-card'));

  function getFormTrip(){
    const trip = { name: nameInput.value || 'Untitled Trip', destinations: [] };
    const cards = destinationsEl.querySelectorAll('.country-card');
    cards.forEach(c=>{
      const country = c.querySelector('.country-title').innerText.trim();
      const entry = c.querySelector('.entry').value;
      const exit = c.querySelector('.exit').value;
      const purposeEl = c.querySelector('.purpose-select');
      const purpose = purposeEl ? purposeEl.value : (c.querySelector('select') ? c.querySelector('select').value : 'Tourism');
      const visa = c.querySelector('.visa-pill').innerText.trim();
      const days = c.querySelector('.days').innerText.trim();
      trip.destinations.push({ country, entry, exit, purpose, visa, days });
    });
    // if editing existing trip, preserve id
    const existingId = qp('id');
    if(existingId) trip.id = existingId;
    return trip;
  }

  function validateTrip(trip){
    if(!trip.name) return 'Provide a trip name.';
    if(!trip.destinations.length) return 'Add at least one destination.';
    for(const d of trip.destinations){
      if(!d.entry || !d.exit) return 'Every destination must have entry and exit dates.';
      if(d.entry> d.exit) return 'Entry date must be before or equal to exit date.';
    }
    return null;
  }

  function computeFeasibility(trip){
    // timeline conflict: sort by entry and check overlap
    const dests = trip.destinations.map(d=>({ ...d, entryDate: new Date(d.entry), exitDate: new Date(d.exit) }));
    dests.sort((a,b)=>a.entryDate - b.entryDate);
    let conflict = false;
    for(let i=1;i<dests.length;i++){
      if(dests[i].entryDate <= dests[i-1].exitDate) conflict = true;
    }
    // visa cost estimate: naive: if visa contains 'Free' => 0 else 60 each
    let totalCost = 0;
    for(const d of trip.destinations){
      if(!/visa[- ]?free/i.test(d.visa)) totalCost += 60; // placeholder
    }
    const allVisaOk = true; // for now assume true
    return { allVisaOk, conflict, totalCost };
  }

  function updateFeasibility(){
    const trip = getFormTrip();
    const res = computeFeasibility(trip);
    feasibilityEl.innerHTML = '';
    const li1 = document.createElement('li'); li1.textContent = res.allVisaOk? 'All Visa requirements can be met':'Some visa requirements need attention';
    const li2 = document.createElement('li'); li2.textContent = res.conflict? 'Timeline conflict detected':'No timeline conflict detected';
    const li3 = document.createElement('li'); li3.textContent = `Estimated total Visa cost: $${res.totalCost}`;
    feasibilityEl.append(li1, li2, li3);
  }

  // Save
  saveBtn.addEventListener('click', ()=>{
    const trip = getFormTrip();
    const err = validateTrip(trip);
    if(err){ alert(err); return; }
    const id = saveTrip(trip);
    alert('Trip saved.');
    // redirect to trips list or update URL
    location.href = `trips.html`;
  });

  // If editing, load trip
  function loadIfEditing(){
    const id = qp('id');
    if(!id) return;
    const trip = getTrip(id);
    if(!trip) return;
    nameInput.value = trip.name || '';
    // clear existing cards then create per destination
    destinationsEl.innerHTML = '';
    trip.destinations.forEach(d=>{
      const card = createCardFromData(d);
      destinationsEl.appendChild(card);
      attachCardListeners(card);
    });
    updateFeasibility();
  }

  function createCardFromData(d){
    const template = document.querySelector('.country-card');
    const clone = template.cloneNode(true);
    clone.querySelector('.country-title').setAttribute('contenteditable','true');
    clone.querySelector('.country-title').innerText = d.country || '';
    clone.querySelector('.entry').value = d.entry || '';
    clone.querySelector('.exit').value = d.exit || '';
    const purposeSel = clone.querySelector('.purpose-select');
    if(purposeSel) purposeSel.value = d.purpose || 'Tourism';
    else if(clone.querySelector('select')) clone.querySelector('select').value = d.purpose || 'Tourism';
    clone.querySelector('.visa-pill').innerText = d.visa || '• Visa-Free';
    clone.querySelector('.days').innerText = d.days || '';
    // set flag select to match country if possible
    const sel = clone.querySelector('.country-select');
    if(sel){
      for(const opt of sel.options){
        if((d.country||'').toLowerCase().includes(opt.value.toLowerCase())){ opt.selected = true; break; }
      }
      const img = clone.querySelector('.flag-img');
      img.src = sel.selectedOptions[0].getAttribute('data-flag');
    }
    // initialize custom dropdown if present
    const psel = clone.querySelector('.purpose-select');
    if(psel) createCustomDropdown(psel);
    return clone;
  }

  // initial feasibility update
  updateFeasibility();
  loadIfEditing();

  // also initialize custom dropdowns on load for existing cards
  (function initCustoms(){
    document.querySelectorAll('.purpose-select').forEach(sel=>createCustomDropdown(sel));
  })();

  // Mobile hamburger menu behavior
  (function initMobileMenu(){
    const hamburgers = document.querySelectorAll('.hamburger');
    hamburgers.forEach(btn=>{
      // find the navigation reliably
      const container = btn.closest('.topbar-inner') || document.querySelector('.topbar-inner');
      const nav = (container && container.querySelector('.top-nav')) || document.querySelector('.top-nav');
      if(!nav) return;

      // helper to open/close with positioning
      function setOpen(open){
        if(open){
          // position menu using button coordinates so it's always visible
          const rect = btn.getBoundingClientRect();
          // read max width from CSS variable --mobile-menu-max-w (fallback to 260)
          const cssVal = getComputedStyle(document.documentElement).getPropertyValue('--mobile-menu-max-w') || '260px';
          const cssMax = parseInt(cssVal, 10) || 260;
          // compute suitable width (match CSS min(var(--mobile-menu-max-w),85vw))
          const maxW = Math.min(cssMax, Math.floor(window.innerWidth * 0.85));
          nav.style.position = 'absolute';
          nav.style.width = maxW + 'px';
          // place menu so its right edge aligns with button's right edge where possible
          let left = Math.round(rect.right - maxW);
          const minMargin = 8; // keep a small margin from viewport edge
          if(left < minMargin) left = minMargin;
          // ensure it doesn't overflow on the right
          if(left + maxW > window.innerWidth - minMargin) left = window.innerWidth - maxW - minMargin;
          nav.style.left = left + 'px';
          nav.style.top = (rect.bottom + window.scrollY + 8) + 'px';
          nav.style.right = 'auto';
          nav.style.zIndex = '1202';
          nav.classList.add('open');
          nav.style.display = 'flex';
          // trigger visual animation state
          requestAnimationFrame(()=>{ nav.style.opacity = '1'; nav.style.transform = 'translateY(0)'; });
          btn.setAttribute('aria-expanded','true');
        } else {
          nav.classList.remove('open');
          nav.style.opacity = '0';
          nav.style.transform = 'translateY(-6px)';
          // after animation hide display
          setTimeout(()=>{ if(!nav.classList.contains('open')) nav.style.display = 'none'; }, 160);
          btn.setAttribute('aria-expanded','false');
        }
      }

      btn.addEventListener('click', (e)=>{
        e.stopPropagation();
        const isOpen = nav.classList.contains('open');
        setOpen(!isOpen);
      });

      // close on outside click
      document.addEventListener('click', (ev)=>{
        if(!nav.classList.contains('open')) return;
        if(!btn.contains(ev.target) && !nav.contains(ev.target)){
          setOpen(false);
        }
      });

      // close on Escape key
      document.addEventListener('keydown', (ev)=>{
        if(ev.key === 'Escape' && nav.classList.contains('open')){
          setOpen(false);
        }
      });

      // close when a nav link is clicked
      nav.querySelectorAll('.nav-link').forEach(link=>{
        link.addEventListener('click', ()=>{
          setOpen(false);
        });
      });

      // close/adjust on scroll or resize so it stays attached
      window.addEventListener('scroll', ()=>{ if(nav.classList.contains('open')) setOpen(false); });
      window.addEventListener('resize', ()=>{ if(nav.classList.contains('open')) setOpen(false); });
    });
  })();

})();