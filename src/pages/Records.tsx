import { useState, useEffect } from "react";
import { 
  CheckCircle, XCircle, MapPin, MonitorPlay, 
  BarChart3, UserCheck, Globe, ListChecks, Calendar
} from "lucide-react";
import PortalLayout from "../components/PortalLayout";

export default function Records() {
  return (
    <PortalLayout>
      {(user) => <RecordsContent user={user} />}
    </PortalLayout>
  );
}

function RecordsContent({ user }: { user: any }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // State to handle which analytic detail we are currently viewing
  const [activeFilter, setActiveFilter] = useState<'all' | 'registered' | 'attended' | 'online' | 'onsite' | 'nil'>('all');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND}/api/records/${user.unique_code}`)
      .then(res => res.json())
      .then(resData => {
        setData(resData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user.unique_code]);

  if (loading || !data) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-church-purple border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // 1. EXTRACT DYNAMIC COLUMNS (Ignoring ID, unique_code, etc.)
  // This naturally filters out "Upcoming" events because they don't have columns yet.
  const dynamicPrefixes = Object.keys(data.registered || {})
    .filter(key => key.endsWith('_reg'))
    .map(key => key.replace('_reg', ''));

  // 2. BUILD ANALYTIC DATA ARRAY
  const processedEvents = dynamicPrefixes.map(prefix => {
    // Match the prefix back to the event details from the events table
    const eventMeta = data.events.find((e: any) => e.abbrev.replace(/[^a-zA-Z0-9_]/g, '') === prefix) || { 
      event_name: prefix, 
      event_date: new Date(), 
      location: 'Unknown' 
    };

    const methodRaw = data.methods[`${prefix}_method`];
    
    return {
      prefix,
      ...eventMeta,
      isRegistered: data.registered[`${prefix}_reg`] === 'Yes',
      isAttended: data.attended[`${prefix}_atend`] === 'Yes',
      method: methodRaw && methodRaw !== 'nil' ? methodRaw.toLowerCase() : 'nil'
    };
  });

  // 3. CALCULATE KPIs
  const totalPrograms = processedEvents.length;
  const totalRegistered = processedEvents.filter(e => e.isRegistered).length;
  const totalAttended = processedEvents.filter(e => e.isAttended).length;
  
  const totalOnline = processedEvents.filter(e => e.method === 'online').length;
  const totalOnsite = processedEvents.filter(e => e.method === 'onsite').length;
  const totalNil = processedEvents.filter(e => e.method === 'nil').length;

  // 4. FILTER FOR DETAILED VIEW
  const filteredEvents = processedEvents.filter(e => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'registered') return e.isRegistered;
    if (activeFilter === 'attended') return e.isAttended;
    if (activeFilter === 'online') return e.method === 'online';
    if (activeFilter === 'onsite') return e.method === 'onsite';
    if (activeFilter === 'nil') return e.method === 'nil';
    return true;
  });

  return (
    <div className="p-6 md:p-10 transition-all max-w-7xl mx-auto w-full pb-20">
      <div className="mb-8">
        <h2 className="text-3xl font-serif text-church-purple mb-2">Analytics & Records</h2>
        <p className="text-sm text-gray-500">Overview of your participation in past and current events.</p>
      </div>

      {/* KPI DASHBOARD SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        {/* KPI: Registered vs Total */}
        <div 
          onClick={() => setActiveFilter(activeFilter === 'registered' ? 'all' : 'registered')}
          className={`bg-white rounded-2xl p-6 shadow-md border cursor-pointer transition-all hover:shadow-lg ${activeFilter === 'registered' ? 'border-church-gold ring-2 ring-church-gold/20' : 'border-gray-100'}`}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <ListChecks size={24} className="text-church-purple" />
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded">Registrations</span>
          </div>
          <div className="flex items-end gap-2">
            <h3 className="text-4xl font-serif text-church-purple">{totalRegistered}</h3>
            <p className="text-sm text-gray-500 font-medium mb-1">/ {totalPrograms} Total</p>
          </div>
        </div>

        {/* KPI: Attended vs Registered */}
        <div 
          onClick={() => setActiveFilter(activeFilter === 'attended' ? 'all' : 'attended')}
          className={`bg-white rounded-2xl p-6 shadow-md border cursor-pointer transition-all hover:shadow-lg ${activeFilter === 'attended' ? 'border-church-gold ring-2 ring-church-gold/20' : 'border-gray-100'}`}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <UserCheck size={24} className="text-green-600" />
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded">Attendance</span>
          </div>
          <div className="flex items-end gap-2">
            <h3 className="text-4xl font-serif text-church-purple">{totalAttended}</h3>
            <p className="text-sm text-gray-500 font-medium mb-1">/ {totalRegistered} Registered</p>
          </div>
        </div>

        {/* KPI: Attendance Methods */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-orange-50 rounded-lg">
              <BarChart3 size={24} className="text-orange-500" />
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded">Methods</span>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mt-2">
            <div onClick={() => setActiveFilter(activeFilter === 'online' ? 'all' : 'online')} className={`text-center p-2 rounded-lg cursor-pointer transition-colors ${activeFilter === 'online' ? 'bg-church-purple/10' : 'hover:bg-gray-50'}`}>
              <MonitorPlay size={16} className="mx-auto text-church-purple mb-1" />
              <p className="text-xl font-bold text-church-purple">{totalOnline}</p>
              <p className="text-[9px] uppercase font-bold text-gray-400">Online</p>
            </div>
            <div onClick={() => setActiveFilter(activeFilter === 'onsite' ? 'all' : 'onsite')} className={`text-center p-2 rounded-lg cursor-pointer transition-colors ${activeFilter === 'onsite' ? 'bg-church-gold/20' : 'hover:bg-gray-50'}`}>
              <MapPin size={16} className="mx-auto text-church-gold mb-1" />
              <p className="text-xl font-bold text-church-purple">{totalOnsite}</p>
              <p className="text-[9px] uppercase font-bold text-gray-400">Onsite</p>
            </div>
            <div onClick={() => setActiveFilter(activeFilter === 'nil' ? 'all' : 'nil')} className={`text-center p-2 rounded-lg cursor-pointer transition-colors ${activeFilter === 'nil' ? 'bg-gray-200' : 'hover:bg-gray-50'}`}>
              <Globe size={16} className="mx-auto text-gray-400 mb-1" />
              <p className="text-xl font-bold text-gray-600">{totalNil}</p>
              <p className="text-[9px] uppercase font-bold text-gray-400">Nil</p>
            </div>
          </div>
        </div>

      </div>

      {/* DETAILED VIEW SECTION */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-serif text-church-purple">
            {activeFilter === 'all' && 'All Event Records'}
            {activeFilter === 'registered' && 'Registered Events'}
            {activeFilter === 'attended' && 'Attended Events'}
            {activeFilter === 'online' && 'Online Attendances'}
            {activeFilter === 'onsite' && 'Onsite Attendances'}
            {activeFilter === 'nil' && 'Unspecified Methods'}
          </h3>
          <button 
            onClick={() => setActiveFilter('all')}
            className={`text-xs font-bold uppercase tracking-widest ${activeFilter === 'all' ? 'text-gray-400 cursor-default' : 'text-church-gold hover:underline'}`}
          >
            Clear Filters
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((evt: any, index: number) => (
          <div key={evt.prefix || index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <h4 className="font-serif text-lg text-church-purple leading-tight mb-3">{evt.event_name}</h4>
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
                  <Calendar size={14} className="text-church-gold" />
                  <span>{new Date(evt.event_date).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-50">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Registered</span>
                  {evt.isRegistered ? <CheckCircle size={18} className="text-green-500" /> : <XCircle size={18} className="text-red-400" />}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Attended</span>
                  {evt.isAttended ? <CheckCircle size={18} className="text-green-500" /> : <XCircle size={18} className="text-red-400" />}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Method</span>
                  <div className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded ${evt.method === 'online' ? 'bg-church-purple/10 text-church-purple' : evt.method === 'onsite' ? 'bg-church-gold/20 text-church-gold' : 'bg-gray-100 text-gray-500'}`}>
                    {evt.method === 'online' ? <MonitorPlay size={14} /> : evt.method === 'onsite' ? <MapPin size={14} /> : <Globe size={14} />}
                    <span className="capitalize">{evt.method}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredEvents.length === 0 && (
            <div className="col-span-full bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center">
              <p className="text-gray-500">No records found for this filter.</p>
              <button onClick={() => setActiveFilter('all')} className="mt-4 text-xs font-bold text-church-purple uppercase hover:underline">
                View All Records
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}