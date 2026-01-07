const STORAGE_KEY = 'visatrack_trips_v1';

export function listTrips(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(!raw) return [];
  try{ return JSON.parse(raw);}catch(e){console.error(e); return [];}
}

function persist(trips){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
}

export function generateId(){
  return Date.now().toString(36) + Math.random().toString(36).slice(2,8);
}

export function saveTrip(trip){
  const trips = listTrips();
  if(!trip.id){
    trip.id = generateId();
    trips.push(trip);
  } else {
    const idx = trips.findIndex(t=>t.id===trip.id);
    if(idx>=0) trips[idx] = trip; else trips.push(trip);
  }
  persist(trips);
  return trip.id;
}

export function getTrip(id){
  const trips = listTrips();
  return trips.find(t=>t.id===id) || null;
}

export function deleteTrip(id){
  let trips = listTrips();
  trips = trips.filter(t=>t.id!==id);
  persist(trips);
}

export function clearAll(){
  localStorage.removeItem(STORAGE_KEY);
}
