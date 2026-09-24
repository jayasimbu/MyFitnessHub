
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  DollarSign, 
  MessageSquare, 
  LogOut, 
  Loader2, 
  Search, 
  Shield, 
  UserCircle, 
  ExternalLink, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  ChevronRight,
  X,
  CreditCard,
  Target,
  AlertTriangle
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface Subscription {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  membership_plan: string;
  total_paid: number;
  street_address: string;
  city: string;
  zip_code: string;
  created_at: string;
  subscription_status: string;
}

interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
}

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

// Fix: Cast motion.div to any to resolve type errors
const MotionDiv = motion.div as any;

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'members' | 'users' | 'messages'>('members');
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [stats, setStats] = useState({ revenue: 0, members: 0, users: 0, leads: 0 });
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    checkAuthAndFetch();
  }, []);

  const checkAuthAndFetch = async ( ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Strict Authorization Check
      if (!user) {
        onNavigate('admin-login');
        return;
      }

      // 1. Domain Check
      const isDomainAdmin = user.email?.toLowerCase().includes('admin') || user.email?.toLowerCase().includes('myfitnesshub');
      
      // 2. Metadata/Role Check (Assume "admin" role is set in user_metadata for this mock)
      const hasAdminRole = user.app_metadata?.role === 'admin' || user.user_metadata?.is_admin === true;

      if (!isDomainAdmin && !hasAdminRole) {
        setAuthError(true);
        setTimeout(() => onNavigate('home'), 3000);
        return;
      }

      setIsAuthorized(true);
      await fetchData();
    } catch (error) {
      console.error('Auth check error:', error);
      onNavigate('admin-login');
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    // Bug Fix: Removed duplicate setLoading(true) here — checkAuthAndFetch
    // already sets loading=true at start and loading=false in its finally block.
    // Calling it again here caused a double-spinner flicker.
    try {
      const { data: subData } = await supabase.from('gym_subscriptions').select('*').order('created_at', { ascending: false });
      const { data: profileData } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      const { data: msgData } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });

      if (subData) setSubscriptions(subData as Subscription[]);
      if (profileData) setUsers(profileData as UserProfile[]);
      if (msgData) setMessages(msgData as ContactMessage[]);

      const totalRevenue = subData?.reduce((acc, curr) => acc + (curr.total_paid || 0), 0) || 0;
      setStats({
        revenue: totalRevenue,
        members: subData?.length || 0,
        users: profileData?.length || 0,
        leads: msgData?.length || 0
      });
    } catch (error) {
      console.error('Admin Fetch Error:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onNavigate('home');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 flex-col gap-4">
        <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
        <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest animate-pulse">Establishing Secure Uplink...</p>
      </div>
    );
  }

  if (authError) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 flex-col gap-6 text-center px-6">
            <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20 text-red-500 animate-bounce">
                <AlertTriangle size={48} />
            </div>
            <div>
                <h1 className="text-3xl font-heading font-bold text-white mb-2 uppercase tracking-tighter">Access <span className="text-red-500">Denied</span></h1>
                <p className="text-zinc-400 max-w-sm">System signature mismatch. Your account does not have clearance for the Command Hub. Returning to safety...</p>
            </div>
        </div>
    );
  }

  return (
    <section className="min-h-screen bg-zinc-950 text-white selection:bg-red-500/30">
        {/* Header */}
        <div className="bg-zinc-900/50 backdrop-blur-md border-b border-zinc-800 p-4 sticky top-0 z-40">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center gap-3 text-red-500">
                    <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center border border-red-500/20">
                        <Shield className="w-6 h-6" />
                    </div>
                    <h1 className="text-xl font-heading font-bold tracking-tight">HUB<span className="text-white"> COMMAND</span></h1>
                </div>
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">System Status</span>
                        <span className="text-[10px] text-lime-500 font-bold flex items-center gap-1"><div className="w-1.5 h-1.5 bg-lime-500 rounded-full animate-pulse"></div> OPERATIONAL</span>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-zinc-800 hover:bg-red-600 px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all duration-300 shadow-lg"
                    >
                        <LogOut className="w-3.5 h-3.5" /> Logout
                    </button>
                </div>
            </div>
        </div>

        <div className="container mx-auto p-4 md:p-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                {[
                    { label: 'Total Revenue', value: formatCurrency(stats.revenue), icon: DollarSign, color: 'text-lime-400', bg: 'bg-lime-500/5' },
                    { label: 'Subscribed Members', value: stats.members, icon: Users, color: 'text-red-500', bg: 'bg-red-500/5' },
                    { label: 'Registered Logins', value: stats.users, icon: UserCircle, color: 'text-cyan-400', bg: 'bg-cyan-500/5' },
                    { label: 'Contact Leads', value: stats.leads, icon: MessageSquare, color: 'text-purple-400', bg: 'bg-purple-500/5' }
                ].map((stat, i) => (
                    <MotionDiv 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`p-6 rounded-2xl border border-zinc-800 ${stat.bg} relative overflow-hidden group`}
                    >
                        <div className="relative z-10">
                            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                            <h3 className={`text-3xl font-bold ${stat.color}`}>{stat.value}</h3>
                        </div>
                        <stat.icon size={80} className={`absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all duration-500 ${stat.color}`} />
                    </MotionDiv>
                ))}
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6 bg-zinc-900/30 p-4 rounded-2xl border border-zinc-800">
                <div className="flex gap-2 p-1 bg-zinc-950 rounded-xl border border-zinc-800">
                    {[
                        { id: 'members', label: 'Memberships', icon: CreditCard },
                        { id: 'users', label: 'Login Profiles', icon: Users },
                        { id: 'messages', label: 'Contact Leads', icon: Mail }
                    ].map((tab) => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)} 
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase transition-all duration-300 ${activeTab === tab.id ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-zinc-500 hover:text-white hover:bg-zinc-900'}`}
                        >
                            <tab.icon className="w-3.5 h-3.5" />
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input 
                        type="text" 
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)} 
                        placeholder={`Search ${activeTab}...`} 
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all placeholder:text-zinc-700" 
                    />
                </div>
            </div>

            {/* Data Tables */}
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
                <AnimatePresence mode="wait">
                    {activeTab === 'members' && (
                        <MotionDiv key="members" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-zinc-950/50 text-zinc-500 text-[10px] font-bold uppercase border-b border-zinc-800">
                                    <tr>
                                        <th className="p-5">Subscriber Info</th>
                                        <th className="p-5">Membership</th>
                                        <th className="p-5">Investment</th>
                                        <th className="p-5">Status</th>
                                        <th className="p-5">Registered</th>
                                        <th className="p-5 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800">
                                    {subscriptions.filter(s => `${s.first_name} ${s.last_name} ${s.email}`.toLowerCase().includes(searchQuery.toLowerCase())).map((sub) => (
                                        <tr key={sub.id} className="hover:bg-zinc-800/30 transition-colors group">
                                            <td className="p-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 bg-zinc-800 rounded-full flex items-center justify-center text-red-500 font-bold text-xs">{sub.first_name[0]}{sub.last_name[0]}</div>
                                                    <div>
                                                        <div className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">{sub.first_name} {sub.last_name}</div>
                                                        <div className="text-xs text-zinc-500">{sub.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-2.5 py-1 rounded text-[10px] font-bold uppercase">{sub.membership_plan}</span>
                                            </td>
                                            <td className="p-5 font-mono text-lime-400 text-sm">{formatCurrency(sub.total_paid)}</td>
                                            <td className="p-5">
                                                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full border ${sub.subscription_status === 'active' ? 'bg-lime-500/10 text-lime-500 border-lime-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                                                    {sub.subscription_status || 'Active'}
                                                </span>
                                            </td>
                                            <td className="p-5 text-xs text-zinc-500">{formatDate(sub.created_at)}</td>
                                            <td className="p-5 text-right">
                                                <button onClick={() => setSelectedItem({ type: 'member', data: sub })} className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-all">
                                                    <ChevronRight size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </MotionDiv>
                    )}

                    {activeTab === 'users' && (
                        <MotionDiv key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-zinc-950/50 text-zinc-500 text-[10px] font-bold uppercase border-b border-zinc-800">
                                    <tr>
                                        <th className="p-5">Login Identity</th>
                                        <th className="p-5">Email Address</th>
                                        <th className="p-5">Security ID</th>
                                        <th className="p-5">Created At</th>
                                        <th className="p-5 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800">
                                    {users.filter(u => u.email.toLowerCase().includes(searchQuery.toLowerCase())).map((user) => (
                                        <tr key={user.id} className="hover:bg-zinc-800/30 transition-colors group">
                                            <td className="p-5 font-bold text-sm text-white">{user.first_name} {user.last_name}</td>
                                            <td className="p-5 text-cyan-400 text-sm">{user.email}</td>
                                            <td className="p-5 text-xs font-mono text-zinc-600">{user.id}</td>
                                            <td className="p-5 text-xs text-zinc-500">{formatDate(user.created_at)}</td>
                                            <td className="p-5 text-right">
                                                <button onClick={() => setSelectedItem({ type: 'user', data: user })} className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-all">
                                                    <ChevronRight size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </MotionDiv>
                    )}

                    {activeTab === 'messages' && (
                        <MotionDiv key="messages" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-zinc-950/50 text-zinc-500 text-[10px] font-bold uppercase border-b border-zinc-800">
                                    <tr>
                                        <th className="p-5">Lead Name</th>
                                        <th className="p-5">Contact Details</th>
                                        <th className="p-5">Snippet</th>
                                        <th className="p-5">Received</th>
                                        <th className="p-5 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800">
                                    {messages.filter(m => m.email.toLowerCase().includes(searchQuery.toLowerCase()) || m.name.toLowerCase().includes(searchQuery.toLowerCase())).map((msg) => (
                                        <tr key={msg.id} className="hover:bg-zinc-800/30 transition-colors group">
                                            <td className="p-5 font-bold text-sm text-white">{msg.name}</td>
                                            <td className="p-5">
                                                <div className="text-xs text-purple-400 font-bold mb-0.5">{msg.email}</div>
                                                <div className="text-[10px] text-zinc-600">{msg.phone || 'No phone provided'}</div>
                                            </td>
                                            <td className="p-5 text-xs text-zinc-400 line-clamp-1 max-w-[200px] mt-4 italic">"{msg.message}"</td>
                                            <td className="p-5 text-xs text-zinc-500">{formatDate(msg.created_at)}</td>
                                            <td className="p-5 text-right">
                                                <button onClick={() => setSelectedItem({ type: 'message', data: msg })} className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-all">
                                                    <ChevronRight size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </MotionDiv>
                    )}
                </AnimatePresence>
            </div>
        </div>

        {/* Detailed Side Panel */}
        <AnimatePresence>
            {selectedItem && (
                <>
                    <MotionDiv 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedItem(null)}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                    />
                    <MotionDiv 
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-zinc-900 border-l border-zinc-800 shadow-2xl z-[101] overflow-y-auto"
                    >
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-10">
                                <h2 className="text-xl font-heading font-bold uppercase tracking-tight">Record <span className="text-red-500">Details</span></h2>
                                <button onClick={() => setSelectedItem(null)} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-500 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            {selectedItem.type === 'member' && (
                                <div className="space-y-8">
                                    <div className="flex items-center gap-4 p-6 bg-zinc-950 rounded-2xl border border-zinc-800">
                                        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 font-bold text-2xl">
                                            {selectedItem.data.first_name[0]}{selectedItem.data.last_name[0]}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold">{selectedItem.data.first_name} {selectedItem.data.last_name}</h3>
                                            <span className="text-xs text-lime-400 font-bold uppercase tracking-widest">{selectedItem.data.membership_plan} MEMBER</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <DetailItem icon={Mail} label="Email Address" value={selectedItem.data.email} copyable />
                                        <DetailItem icon={Phone} label="Contact Phone" value={selectedItem.data.phone_number || 'Not provided'} copyable />
                                        <DetailItem icon={MapPin} label="Service Address" value={`${selectedItem.data.street_address}, ${selectedItem.data.city}, ${selectedItem.data.zip_code}`} />
                                        <DetailItem icon={DollarSign} label="Total Paid (All-Time)" value={formatCurrency(selectedItem.data.total_paid)} />
                                        <DetailItem icon={Calendar} label="Registration Date" value={formatDate(selectedItem.data.created_at)} />
                                        <DetailItem icon={Clock} label="System Status" value={selectedItem.data.subscription_status || 'Active'} highlight />
                                    </div>

                                    <div className="pt-6 border-t border-zinc-800">
                                        <h4 className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-4">Membership Actions</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button className="py-3 bg-zinc-800 text-white text-xs font-bold uppercase rounded-lg hover:bg-zinc-700 transition-colors">Edit Plan</button>
                                            <button className="py-3 bg-red-600/10 text-red-500 text-xs font-bold uppercase rounded-lg border border-red-500/20 hover:bg-red-600 hover:text-white transition-all">Revoke Access</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {selectedItem.type === 'user' && (
                                <div className="space-y-8">
                                    <div className="flex items-center gap-4 p-6 bg-zinc-950 rounded-2xl border border-zinc-800">
                                        <UserCircle size={48} className="text-cyan-400" />
                                        <div>
                                            <h3 className="text-xl font-bold">{selectedItem.data.first_name} {selectedItem.data.last_name}</h3>
                                            <span className="text-xs text-cyan-400 font-bold uppercase tracking-widest">Authentication Profile</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        <DetailItem icon={Mail} label="Login Email" value={selectedItem.data.email} copyable />
                                        {/* Fixed: Use 'DetailItem' instead of 'Shield' as a container component */}
                                        <DetailItem icon={Shield} label="Security UUID" value={selectedItem.data.id} />
                                        <DetailItem icon={Clock} label="Account Created" value={formatDate(selectedItem.data.created_at)} />
                                    </div>
                                </div>
                            )}

                            {selectedItem.type === 'message' && (
                                <div className="space-y-8">
                                     <div className="flex items-center gap-4 p-6 bg-zinc-950 rounded-2xl border border-zinc-800">
                                        <MessageSquare size={48} className="text-purple-400" />
                                        <div>
                                            <h3 className="text-xl font-bold">{selectedItem.data.name}</h3>
                                            <span className="text-xs text-purple-400 font-bold uppercase tracking-widest">Inbound Enquiry</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        <DetailItem icon={Mail} label="Contact Email" value={selectedItem.data.email} copyable />
                                        <DetailItem icon={Phone} label="Contact Phone" value={selectedItem.data.phone || 'Not provided'} copyable />
                                        <DetailItem icon={Clock} label="Message Received" value={formatDate(selectedItem.data.created_at)} />
                                    </div>
                                    <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800">
                                        <h4 className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-3 flex items-center gap-2">
                                            <Target className="w-3 h-3" /> Enquiry Content
                                        </h4>
                                        <p className="text-sm text-zinc-300 italic leading-relaxed whitespace-pre-wrap">"{selectedItem.data.message}"</p>
                                    </div>
                                    <button className="w-full py-4 bg-purple-600 text-white font-bold uppercase tracking-widest rounded-xl hover:bg-purple-500 transition-all shadow-lg shadow-purple-600/20">
                                        Reply via Email
                                    </button>
                                </div>
                            )}
                        </div>
                    </MotionDiv>
                </>
            )}
        </AnimatePresence>
    </section>
  );
};

const DetailItem = ({ icon: Icon, label, value, copyable, highlight }: any) => (
    <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 group hover:border-zinc-700 transition-colors">
        <div className="flex justify-between items-start mb-1">
            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest flex items-center gap-1.5">
                <Icon size={12} /> {label}
            </span>
            {copyable && <button onClick={() => navigator.clipboard.writeText(value)} className="text-zinc-600 hover:text-white transition-colors"><ExternalLink size={10} /></button>}
        </div>
        <p className={`text-sm break-all font-medium ${highlight ? 'text-red-500' : 'text-zinc-200'}`}>{value}</p>
    </div>
);

export default AdminDashboard;
