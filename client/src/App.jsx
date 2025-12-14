import { useState, useEffect, useContext } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext, AuthProvider } from "./AuthContext";

const API = "http://localhost:5000";


const Hero = () => (
  <div style={{
    backgroundImage: "linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url('https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1975&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
    height: "85vh", backgroundSize: "cover", backgroundPosition: "center",
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "white", textAlign: "center"
  }}>
    <h1 style={{ 
      fontFamily: "'Archivo Black', sans-serif", 
      fontSize: "6rem", 
      fontWeight: "700",      
      marginBottom: "0.5rem", 
      textShadow: "0 10px 30px rgba(0,0,0,0.5)", 
      letterSpacing: "12px",           
      textTransform: "uppercase",
      lineHeight: "1",
      marginTop: "-50px",
      marginLeft: "12px" 
    }}>
      FitHub
    </h1>
    <p style={{ fontSize: "1.5rem", color: "#ccc", marginBottom: "2rem" }}>Plan Your Strength</p>
    <a href="#feed" 
   style={{ 
     padding: "15px 40px", 
     border: "2px solid #e67e22", 
     color: "white", 
     textDecoration: "none", 
     fontWeight: "bold",
     backgroundColor: "transparent", 
     transition: "all 0.3s ease"
   }}
   onMouseOver={(e) => {
     e.target.style.backgroundColor = "#e67e22";
     e.target.style.color = "black";
   }}
   onMouseOut={(e) => {
     e.target.style.backgroundColor = "transparent";
     e.target.style.color = "white";
   }}
>
  EXPLORE PLANS
</a>
  </div>
);

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  return (
    <nav>
      <Link to="/" className="brand" style={{ fontSize: "1.5rem", color: "#e67e22" }}>FitHub</Link>
      <div className="nav-group">
        <Link to="/" className="nav-link">HOME</Link>
        {user ? (
          <>
            {user.role === "TRAINER" && <Link to="/create" className="nav-link" style={{ color: "#e67e22" }}>DASHBOARD</Link>}
            <span className="nav-link" onClick={logout} style={{ cursor: "pointer" }}>LOGOUT</span>
          </>
        ) : <Link to="/login" className="nav-link">LOGIN</Link>}
      </div>
    </nav>
  );
};

const Feed = () => {
  const [plans, setPlans] = useState([]);
  const [following, setFollowing] = useState([]);
  const [activeTab, setActiveTab] = useState("discover");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const plansRes = await axios.get(`${API}/plans`);
        setPlans(plansRes.data);
        if (user) {
          const userRes = await axios.get(`${API}/users/${user.id}`);
          setFollowing(userRes.data.following || []);
        }
      } catch (err) { console.error(err); }
    };
    fetchData();
  }, [user]);

  const handleFollow = async (trainerId) => {
    if (!user) return alert("Please Login to follow");
    try {
      await axios.put(`${API}/users/${trainerId}/follow`, { userId: user.id });
      
      if (following.includes(trainerId)) {
        setFollowing(following.filter(id => id !== trainerId));
      } else {
        setFollowing([...following, trainerId]);
      }
    } catch (err) { alert("Error following"); }
  };

  const filteredPlans = activeTab === "my-trainers" 
    ? plans.filter(plan => {
        const tId = plan.trainer?._id || plan.trainer || plan.trainerId;
        return following.includes(tId);
      })
    : plans;

  return (
    <>
      <Hero />
      
      <div style={{ display: "flex", justifyContent: "center", gap: "40px", marginTop: "3rem", marginBottom: "1rem" }}>
        <button 
          onClick={() => setActiveTab("discover")}
          style={{
            background: "none",
            border: "none",
            fontSize: "1.2rem",
            fontWeight: activeTab === "discover" ? "900" : "400",
            color: activeTab === "discover" ? "#e67e22" : "#666",
            cursor: "pointer",
            borderBottom: activeTab === "discover" ? "2px solid #e67e22" : "2px solid transparent",
            paddingBottom: "5px",
            fontFamily: "'Archivo Black', sans-serif",
            textTransform: "uppercase",
            letterSpacing: "1px"
          }}
        >
          Discover
        </button>

        <button 
          onClick={() => setActiveTab("my-trainers")}
          style={{
            background: "none",
            border: "none",
            fontSize: "1.2rem",
            fontWeight: activeTab === "my-trainers" ? "900" : "400",
            color: activeTab === "my-trainers" ? "#e67e22" : "#666",
            cursor: "pointer",
            borderBottom: activeTab === "my-trainers" ? "2px solid #e67e22" : "2px solid transparent",
            paddingBottom: "5px",
            fontFamily: "'Archivo Black', sans-serif",
            textTransform: "uppercase",
            letterSpacing: "1px"
          }}
        >
          My Trainers
        </button>
      </div>

      <div id="feed" className="grid">
        {filteredPlans.length > 0 ? (
          filteredPlans.map((plan) => {
            const trainerId = plan.trainer?._id || plan.trainer || plan.trainerId;
            const trainerName = plan.trainer?.name || "Unknown Trainer";
            const isFollowing = following.includes(trainerId);
            const isMe = user?.id === trainerId;

            return (
              <div key={plan._id} className="card">
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"start"}}>
                   <h3 style={{ color: "#ffffffff", fontSize: "1.4rem" }}>{plan.title}</h3>
                   
                   {trainerId && !isMe && (
                     <button onClick={() => handleFollow(trainerId)}
                      style={{ 
                        padding: "5px 12px", 
                        fontSize: "0.8rem", 
                        fontWeight: "bold",
                        border: "1px solid #e67e22", 
                        background: isFollowing ? "#e67e22" : "transparent", 
                        color: isFollowing ? "black" : "#e67e22",
                        cursor: "pointer",
                        marginLeft: "10px",
                        whiteSpace: "nowrap",
                        minWidth: "fit-content"
                      }}>
                       {isFollowing ? "FOLLOWING" : "FOLLOW +"}
                     </button>
                   )}
                </div>
                <p style={{ color: "#666", margin: "0.5rem 0", fontSize:"0.9rem" }}>TRAINER: {trainerName}</p>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "auto" }}>
                  <span style={{ fontSize: "0.9rem", color: "#888" }}>{plan.duration}</span>
                  <span style={{ fontWeight: "bold", fontSize: "1.1rem" }}>₹{plan.price}</span>
                </div>
                <Link to={`/plan/${plan._id}`} style={{ marginTop: "1.5rem" }}><button style={{ width: "100%" }}>VIEW PLAN</button></Link>
              </div>
            );
          })
        ) : (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "4rem", color: "#666" }}>
            <h3>Nothing here yet.</h3>
            {activeTab === "my-trainers" && <p>Go to "Discover" to find someone to follow!</p>}
          </div>
        )}
      </div>
    </>
  );
};

const PlanDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [plan, setPlan] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const fetchPlanAndAccess = async () => {
      try {
        const planRes = await axios.get(`${API}/plans/${id}`);
        setPlan(planRes.data);

        if (user) {
            const userRes = await axios.get(`${API}/users/${user.id}`);
            const myPurchases = userRes.data.purchasedPlans || [];

            const trainerId = planRes.data.trainer?._id || planRes.data.trainer || planRes.data.trainerId;
            const isOwner = user.id === trainerId;
            const isSubscribed = myPurchases.includes(id);

            if (isOwner || isSubscribed) {
                setHasAccess(true);
            }
        }
      } catch (err) { console.error(err); }
    };
    fetchPlanAndAccess();
  }, [id, user]);

  const handleSubscribe = async () => {
    if (!user) return window.location.href = "/login";
    try { 
      await axios.post(`${API}/plans/${id}/subscribe`, { userId: user.id }); 
      alert("Payment Successful!");
      window.location.reload(); 
    }
    catch (err) { alert("Payment failed"); }
  };

  if (!plan) return <div style={{ padding: "4rem", textAlign: "center" }}>Loading...</div>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "4rem 2rem" }}>
      <h1 style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>{plan.title}</h1>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h2 style={{ color: "#e67e22" }}>₹{plan.price}</h2>
        <span style={{ color: "#888", fontSize: "1.2rem" }}>{plan.duration}</span>
      </div>
      <p style={{ fontSize: "1.2rem", lineHeight: "1.6", color: "#ccc", marginBottom: "3rem" }}>{plan.shortDescription}</p>

      {hasAccess ? (
        <div className="locked-box">
          <h3 style={{color: "#2ecc71", marginBottom: "1rem"}}>Access Granted ✅</h3>
          
          <h4 style={{marginTop: "2rem", color: "#e67e22"}}>💪 Workout Routine</h4>
          {plan.workoutPlan?.[0]?.exercises.map((ex, i) => (
             <div key={i} style={{padding: "10px", borderBottom: "1px solid #333"}}>{ex}</div>
          ))}

          <h4 style={{marginTop: "2rem", color: "#e67e22"}}>🥗 Diet Plan</h4>
          {plan.dietPlan?.[0]?.meals.map((meal, i) => (
             <div key={i} style={{padding: "10px", borderBottom: "1px solid #333"}}>{meal}</div>
          ))}
        </div>
      ) : (
        <button onClick={handleSubscribe} style={{ marginTop: "3rem", width: "100%", padding: "1.5rem" }}>
          UNLOCK FULL PLAN (₹{plan.price})
        </button>
      )}
    </div>
  );
};

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "", name: "", role: "USER" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const route = isLogin ? "/auth/login" : "/auth/signup";
    try {
      const res = await axios.post(`${API}${route}`, form);
      login(res.data);
      navigate("/");
    } catch (err) { alert("Authentication failed"); }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "5rem auto", padding: "2rem" }}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>{isLogin ? "Welcome Back" : "Join The Club"}</h1>
      <form onSubmit={handleSubmit}>
        {!isLogin && <input placeholder="FULL NAME" onChange={e => setForm({...form, name: e.target.value})} />}
        <input type="email" placeholder="EMAIL" onChange={e => setForm({...form, email: e.target.value})} />
        <input type="password" placeholder="PASSWORD" onChange={e => setForm({...form, password: e.target.value})} />
        {!isLogin && <select onChange={e => setForm({...form, role: e.target.value})}><option value="USER">TRAINEE</option><option value="TRAINER">TRAINER</option></select>}
        <button type="submit" style={{ width: "100%", marginTop: "1rem" }}>{isLogin ? "ENTER" : "REGISTER"}</button>
      </form>
      <p onClick={() => setIsLogin(!isLogin)} style={{ textAlign: "center", marginTop: "1.5rem", color: "#666", cursor: "pointer" }}>{isLogin ? "Create account" : "Login instead"}</p>
    </div>
  );
};

const CreatePlan = () => {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({ title: "", price: "", duration: "", shortDescription: "", workoutText: "", dietText: "" });
  const [myPlans, setMyPlans] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    if(user) fetchMyPlans();
  }, [user]);

  const fetchMyPlans = async () => {
    try {
        const res = await axios.get(`${API}/plans`);
        const mine = res.data.filter(p => {
            const tId = p.trainer?._id || p.trainer || p.trainerId;
            return tId === user.id;
        });
        setMyPlans(mine);
    } catch(err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.price) return alert("Please fill details");

    const workoutArray = form.workoutText.split('\n').filter(line => line.trim() !== "");
    const dietArray = form.dietText.split('\n').filter(line => line.trim() !== "");

    const payload = {
      title: form.title,
      price: form.price,
      duration: form.duration,
      shortDescription: form.shortDescription,
      trainer: user.id,   
      trainerId: user.id, 
      workoutPlan: [{ day: 1, exercises: workoutArray }],
      dietPlan: [{ day: 1, meals: dietArray }]
    };

    try {
      if(isEditing) {
          await axios.put(`${API}/plans/${editId}`, payload);
          alert("Updated!");
          setIsEditing(false);
          setEditId(null);
      } else {
          await axios.post(`${API}/plans`, payload);
          alert("Published!");
      }
      setForm({ title: "", price: "", duration: "", shortDescription: "", workoutText: "", dietText: "" });
      fetchMyPlans();
    } catch (err) { alert("Error saving plan"); }
  };

  const handleDelete = async (id) => {
    if(confirm("Delete this plan?")) {
      await axios.delete(`${API}/plans/${id}`);
      fetchMyPlans();
    }
  };

  const handleEdit = (plan) => {
      setIsEditing(true);
      setEditId(plan._id);
      const workoutTxt = plan.workoutPlan?.[0]?.exercises.join('\n') || "";
      const dietTxt = plan.dietPlan?.[0]?.meals.join('\n') || "";
      
      setForm({
          title: plan.title,
          price: plan.price,
          duration: plan.duration,
          shortDescription: plan.shortDescription,
          workoutText: workoutTxt,
          dietText: dietTxt
      });
      window.scrollTo(0,0);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "4rem auto", padding: "2rem" }}>
      <h1 style={{ marginBottom: "2rem" }}>{isEditing ? "Edit Plan" : "New Training Plan"}</h1>
      <form onSubmit={handleSubmit} style={{marginBottom: "4rem"}}>
        <input placeholder="PLAN TITLE" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
        <div style={{ display: "flex", gap: "1rem" }}>
          <input type="number" placeholder="PRICE (₹)" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
          <input placeholder="DURATION" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} />
        </div>
        <textarea placeholder="PUBLIC PREVIEW (Short Desc)" rows="3" value={form.shortDescription} onChange={e => setForm({...form, shortDescription: e.target.value})} />
        
        <p style={{marginTop: "1rem", color: "#e67e22", fontSize: "0.9rem"}}>WORKOUT PLAN (One Exercise per line)</p>
        <textarea placeholder="Squats&#10;Bench Press&#10;Deadlift" rows="5" style={{borderColor: "#444"}} 
          value={form.workoutText} onChange={e => setForm({...form, workoutText: e.target.value})} />

        <p style={{marginTop: "1rem", color: "#2ecc71", fontSize: "0.9rem"}}>DIET PLAN (One Meal per line)</p>
        <textarea placeholder="Oats & Banana&#10;Chicken Rice&#10;Protein Shake" rows="5" style={{borderColor: "#444"}} 
          value={form.dietText} onChange={e => setForm({...form, dietText: e.target.value})} />
        
        <button type="submit" style={{ width: "100%", marginTop: "1rem" }}>{isEditing ? "UPDATE PLAN" : "PUBLISH PLAN"}</button>
        {isEditing && <button type="button" onClick={() => {setIsEditing(false); setForm({ title: "", price: "", duration: "", shortDescription: "", workoutText: "", dietText: "" })}} style={{marginTop:"10px", background:"#333"}}>CANCEL</button>}
      </form>

      <h2 style={{borderTop: "1px solid #333", paddingTop: "2rem", marginBottom: "2rem"}}>Your Active Plans</h2>
      {myPlans.map(plan => (
        <div key={plan._id} className="card" style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
          <div><h3 style={{color: "#e67e22"}}>{plan.title}</h3><p style={{fontSize: "0.9rem", color: "#888"}}>₹{plan.price}</p></div>
          <div style={{display:"flex", gap:"10px"}}>
             <button onClick={() => handleEdit(plan)} style={{borderColor: "#f1c40f", color: "#f1c40f", fontSize: "0.8rem", padding: "8px 15px"}}>EDIT</button>
             <button onClick={() => handleDelete(plan._id)} style={{borderColor: "#e74c3c", color: "#e74c3c", fontSize: "0.8rem", padding: "8px 15px"}}>DELETE</button>
          </div>
        </div>
      ))}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/login" element={<Login />} />
          <Route path="/plan/:id" element={<PlanDetails />} />
          <Route path="/create" element={<CreatePlan />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;