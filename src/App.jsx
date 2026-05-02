import { useState, useEffect, useCallback } from "react";
import SplashScreen from "./SplashScreen";
import { HomeIcon, CalendarIcon, MealIcon, WorkoutIcon, SettingsIcon } from "./Icons";

// ===================== CONSTANTS =====================
const EXERCISE_MENU = {
  "胸": ["ベンチプレス", "インクラインベンチプレス", "ダンベルフライ", "ケーブルクロスオーバー", "ディップス"],
  "背中": ["デッドリフト", "ラットプルダウン", "ベントオーバーロウ", "チンニング", "シーテッドロウ"],
  "脚": ["スクワット", "レッグプレス", "ルーマニアンデッドリフト", "レッグカール", "カーフレイズ"],
  "肩": ["ショルダープレス", "サイドレイズ", "フロントレイズ", "フェイスプル", "アップライトロウ"],
  "腕": ["バーベルカール", "ダンベルカール", "トライセプスプレスダウン", "ハンマーカール", "スカルクラッシャー"],
  "体幹": ["プランク", "クランチ", "レッグレイズ", "ロシアンツイスト", "ケーブルウッドチョップ"],
};

const CATEGORY_COLORS = {
  "胸": "#FF5500", "背中": "#3B82F6", "脚": "#F59E0B",
  "肩": "#8B5CF6", "腕": "#10B981", "体幹": "#EC4899",
};

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];
const MONTHS = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
const todayStr = () => new Date().toISOString().slice(0, 10);

const GOAL_EXERCISES = {
  "減量":   [["体幹","プランク"],["脚","スクワット"],["体幹","クランチ"]],
  "筋肥大": [["胸","ベンチプレス"],["背中","デッドリフト"],["脚","レッグプレス"]],
  "維持":   [["肩","ショルダープレス"],["腕","バーベルカール"],["背中","ラットプルダウン"]],
};

// ===================== STORAGE =====================
function store(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }
function load(key, def) { try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : def; } catch { return def; } }

const defaultProfile = { name: "", age: "", height: "", weight: "", goal: "筋肥大", weeklyTarget: 3 };
const defaultDay = () => ({
  exercises: [],
  meals: {
    朝: { items: "", protein: "", fat: "", calories: "" },
    昼: { items: "", protein: "", fat: "", calories: "" },
    夜: { items: "", protein: "", fat: "", calories: "" },
  }
});

// ===================== GLOBAL STYLES =====================
const G = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #F5F4F0; font-family: 'Noto Sans JP', sans-serif; }
  input, textarea, select { font-family: 'Noto Sans JP', sans-serif; }
  input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
  button { font-family: 'Noto Sans JP', sans-serif; }
  @keyframes tabIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .tab-in { animation: tabIn 0.25s ease forwards; }
`;

const sectionLabel = {
  fontSize: 11, fontWeight: 700, color: "#999",
  letterSpacing: 2, textTransform: "uppercase", marginBottom: 10,
};

// ===================== HOME =====================
function HomeTab({ onNavigate }) {
  const profile = load("kintan:profile", defaultProfile);
  const d = new Date();
  const hour = d.getHours();
  const greeting = hour < 12 ? "おはようございます" : hour < 18 ? "こんにちは" : "お疲れ様です";
  const displayName = profile.name || "トレーニーさん";
  const goal = profile.goal || "筋肥大";
  const recommended = GOAL_EXERCISES[goal] || GOAL_EXERCISES["筋肥大"];

  const weekCount = [0,1,2,3,4,5,6].filter(i => {
    const dd = new Date(); dd.setDate(dd.getDate() - i);
    const ds = dd.toISOString().slice(0,10);
    const data = load(`kintan:${ds}`, null);
    return data && data.exercises && data.exercises.length > 0;
  }).length;

  return (
    <div className="tab-in" style={{ padding: "24px 16px", paddingBottom: 100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: "#999", marginBottom: 2 }}>{greeting} 👋</div>
        <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: -1 }}>{displayName}</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
        <div style={{ background: "#FF5500", borderRadius: 16, padding: 16, color: "#fff" }}>
          <div style={{ fontSize: 11, opacity: 0.8, marginBottom: 4, letterSpacing: 1 }}>今週のトレ</div>
          <div style={{ fontSize: 36, fontWeight: 900, lineHeight: 1 }}>{weekCount}</div>
          <div style={{ fontSize: 11, opacity: 0.7, marginTop: 4 }}>/ {profile.weeklyTarget}日 目標</div>
        </div>
        <div style={{ background: "#1A1A1A", borderRadius: 16, padding: 16, color: "#fff" }}>
          <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 4, letterSpacing: 1 }}>目標</div>
          <div style={{ fontSize: 22, fontWeight: 900, lineHeight: 1.2 }}>{goal}</div>
          <div style={{ fontSize: 11, opacity: 0.5, marginTop: 4 }}>
            {profile.weight ? `${profile.weight}kg` : "体重未設定"}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ fontWeight: 900, fontSize: 16 }}>🎯 今日のおすすめ</div>
          <button onClick={() => onNavigate("workout")} style={{
            border: "none", background: "none", color: "#FF5500",
            fontSize: 12, fontWeight: 700, cursor: "pointer"
          }}>記録する →</button>
        </div>
        {recommended.map(([cat, name], i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "14px 16px",
            display: "flex", alignItems: "center", gap: 12, marginBottom: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            borderLeft: `4px solid ${CATEGORY_COLORS[cat]}` }}>
            <div style={{ fontSize: 20 }}>{i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{name}</div>
              <div style={{ fontSize: 11, color: CATEGORY_COLORS[cat], marginTop: 2 }}>{cat}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ fontWeight: 900, fontSize: 16, marginBottom: 12 }}>⚡ クイックアクション</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[
          { label: "食事を記録", icon: "🍽️", tab: "meals", bg: "#FFF8F0" },
          { label: "カレンダー", icon: "📅", tab: "calendar", bg: "#F0F4FF" },
        ].map(a => (
          <button key={a.tab} onClick={() => onNavigate(a.tab)} style={{
            background: a.bg, borderRadius: 14, padding: "18px 16px",
            border: "none", cursor: "pointer", textAlign: "left",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{a.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#333" }}>{a.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ===================== CALENDAR =====================
function CalendarTab({ onSelectDate, selectedDate }) {
  const [viewDate, setViewDate] = useState(new Date());
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  const today = new Date();

  return (
    <div className="tab-in" style={{ padding: "20px 16px", paddingBottom: 100 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <button onClick={() => setViewDate(new Date(year, month - 1, 1))}
          style={{ border: "1px solid #E5E5E5", borderRadius: 10, background: "#fff",
            width: 36, height: 36, cursor: "pointer", fontSize: 18 }}>‹</button>
        <span style={{ fontWeight: 700, fontSize: 18 }}>{year}年 {MONTHS[month]}</span>
        <button onClick={() => setViewDate(new Date(year, month + 1, 1))}
          style={{ border: "1px solid #E5E5E5", borderRadius: 10, background: "#fff",
            width: 36, height: 36, cursor: "pointer", fontSize: 18 }}>›</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 8 }}>
        {["日","月","火","水","木","金","土"].map((d,i) => (
          <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 700,
            color: i===0?"#EF4444":i===6?"#3B82F6":"#999", padding: "4px 0" }}>{d}</div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 20 }}>
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const dateStr = `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
          const isToday = d===today.getDate() && month===today.getMonth() && year===today.getFullYear();
          const isSelected = dateStr === selectedDate;
          const dow = (firstDay + d - 1) % 7;
          const hasData = !!localStorage.getItem(`kintan:${dateStr}`);
          return (
            <button key={i} onClick={() => onSelectDate(dateStr)} style={{
              borderRadius: 10, border: "none", padding: "10px 0", cursor: "pointer", position: "relative",
              background: isSelected?"#FF5500":isToday?"#FFF0EB":"#fff",
              color: isSelected?"#fff":dow===0?"#EF4444":dow===6?"#3B82F6":"#1A1A1A",
              fontWeight: isToday||isSelected?700:400, fontSize: 14,
              boxShadow: isSelected?"0 2px 8px rgba(255,85,0,0.3)":"0 1px 3px rgba(0,0,0,0.06)",
            }}>
              {d}
              {hasData && <div style={{ position:"absolute", bottom:3, left:"50%", transform:"translateX(-50%)",
                width:4, height:4, borderRadius:"50%", background:isSelected?"#fff":"#FF5500" }} />}
            </button>
          );
        })}
      </div>

      {selectedDate && <DateDetail dateStr={selectedDate} />}
    </div>
  );
}

function DateDetail({ dateStr }) {
  const data = load(`kintan:${dateStr}`, null);
  const d = new Date(dateStr);
  const label = `${d.getMonth()+1}月${d.getDate()}日 (${WEEKDAYS[d.getDay()]})`;
  if (!data) return (
    <div style={{ background: "#fff", borderRadius: 16, padding: 20, textAlign: "center",
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
      <div style={{ fontSize: 13, color: "#999" }}>{label} の記録はありません</div>
    </div>
  );
  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>{label}</div>
      {data.exercises?.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={sectionLabel}>💪 筋トレ</div>
          {data.exercises.map((ex, i) => (
            <div key={i} style={{ fontSize: 13, color: "#444", padding: "6px 0",
              borderBottom: "1px solid #F5F4F0", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width:8,height:8,borderRadius:"50%",background:CATEGORY_COLORS[ex.category]||"#ccc" }} />
              {ex.name}
              <span style={{ marginLeft:"auto", color:"#999", fontSize:12 }}>{ex.sets?.length||0}セット</span>
            </div>
          ))}
        </div>
      )}
      {data.meals && Object.entries(data.meals).map(([meal, info]) =>
        info.items ? (
          <div key={meal} style={{ marginBottom: 10 }}>
            <div style={sectionLabel}>{meal==="朝"?"🌅":meal==="昼"?"☀️":"🌙"} {meal}食</div>
            <div style={{ fontSize: 13, color: "#444" }}>{info.items}</div>
            {(info.protein||info.calories) && (
              <div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>
                {info.protein&&`P:${info.protein}g `}{info.fat&&`F:${info.fat}g `}{info.calories&&`${info.calories}kcal`}
              </div>
            )}
          </div>
        ) : null
      )}
    </div>
  );
}

// ===================== MEALS =====================
function MealsTab({ dateStr }) {
  const [meals, setMeals] = useState(() => load(`kintan:${dateStr}`, defaultDay()).meals);
  const [activeM, setActiveM] = useState("朝");

  useEffect(() => {
    setMeals(load(`kintan:${dateStr}`, defaultDay()).meals);
  }, [dateStr]);

  const update = (mealKey, field, val) => {
    const next = { ...meals, [mealKey]: { ...meals[mealKey], [field]: val } };
    setMeals(next);
    const d = load(`kintan:${dateStr}`, defaultDay());
    store(`kintan:${dateStr}`, { ...d, meals: next });
  };

  const d = new Date(dateStr);

  return (
    <div className="tab-in" style={{ padding: "20px 16px", paddingBottom: 100 }}>
      <div style={{ fontWeight: 900, fontSize: 22, marginBottom: 4 }}>🍽️ 食事記録</div>
      <div style={{ fontSize: 13, color: "#999", marginBottom: 20 }}>
        {d.getMonth()+1}月{d.getDate()}日
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[["朝","🌅"],["昼","☀️"],["夜","🌙"]].map(([m, icon]) => (
          <button key={m} onClick={() => setActiveM(m)} style={{
            flex: 1, padding: "10px 0", borderRadius: 12, border: "none", cursor: "pointer",
            background: activeM===m?"#FF5500":"#fff",
            color: activeM===m?"#fff":"#555",
            fontWeight: 700, fontSize: 14,
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)", transition: "all 0.15s",
          }}>{icon} {m}食</button>
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: 16, padding: 20,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: 16 }}>
        <div style={sectionLabel}>食べたもの</div>
        <textarea value={meals[activeM].items} onChange={e => update(activeM,"items",e.target.value)}
          placeholder={`${activeM}食に食べたものを入力...`}
          style={{ width:"100%", border:"1px solid #E5E5E5", borderRadius:10, padding:"12px",
            fontSize:14, resize:"none", height:100, outline:"none", lineHeight:1.6, marginBottom:16 }} />
        <div style={sectionLabel}>栄養情報</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[
            { key:"protein", label:"タンパク質", unit:"g", color:"#10B981" },
            { key:"fat",     label:"脂質",       unit:"g", color:"#F59E0B" },
            { key:"calories",label:"カロリー",   unit:"kcal", color:"#FF5500" },
          ].map(f => (
            <div key={f.key} style={{ background:"#F9F9F7", borderRadius:10, padding:"10px 12px" }}>
              <div style={{ fontSize:10, color:"#999", letterSpacing:1, marginBottom:4 }}>{f.label}</div>
              <input type="number" placeholder="0" value={meals[activeM][f.key]}
                onChange={e => update(activeM, f.key, e.target.value)}
                style={{ border:"none", background:"transparent", width:"100%",
                  fontSize:20, fontWeight:700, color:f.color, outline:"none" }} />
              <div style={{ fontSize:10, color:"#ccc" }}>{f.unit}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background:"#fff", borderRadius:16, padding:20, boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
        <div style={sectionLabel}>📊 本日の合計</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
          {[
            { key:"protein", label:"タンパク質", unit:"g", color:"#10B981" },
            { key:"fat",     label:"脂質",       unit:"g", color:"#F59E0B" },
            { key:"calories",label:"カロリー",   unit:"kcal", color:"#FF5500" },
          ].map(f => {
            const total = Object.values(meals).reduce((s,m) => s+(parseFloat(m[f.key])||0), 0);
            return (
              <div key={f.key} style={{ textAlign:"center", background:"#F9F9F7", borderRadius:10, padding:12 }}>
                <div style={{ fontSize:10, color:"#999", marginBottom:4 }}>{f.label}</div>
                <div style={{ fontSize:22, fontWeight:900, color:f.color }}>{total}</div>
                <div style={{ fontSize:10, color:"#ccc" }}>{f.unit}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ===================== WORKOUT =====================
function WorkoutTab({ dateStr }) {
  const [exercises, setExercises] = useState(() => load(`kintan:${dateStr}`, defaultDay()).exercises || []);
  const [activeCategory, setActiveCategory] = useState("胸");
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    setExercises(load(`kintan:${dateStr}`, defaultDay()).exercises || []);
  }, [dateStr]);

  const persist = (exs) => {
    setExercises(exs);
    const d = load(`kintan:${dateStr}`, defaultDay());
    store(`kintan:${dateStr}`, { ...d, exercises: exs });
  };

  const doAnalyze = async () => {
    if (!exercises.length) { alert("種目を追加してください"); return; }
    setAnalyzing(true); setAnalysis(null);
    const summary = exercises.map(ex => {
      const s = ex.sets.map((s,i)=>`${i+1}セット:${s.weight||"?"}kg×${s.reps||"?"}回`).join(", ");
      return `【${ex.category}】${ex.name}: ${s||"種目のみ"}`;
    }).join("\n");
    const prompt = `プロトレーナーとして分析してください。\n${summary}\n\n以下JSONのみ返してください:\n{"strength":"良かった点2文","next_target":"改善点2文","nutrition_advice":"栄養アドバイス2文"}`;
    try {
      const res = await fetch("/api/analyze", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:800, messages:[{role:"user",content:prompt}] }),
      });
      const data = await res.json();
      const text = data.content?.find(c=>c.type==="text")?.text||"{}";
      setAnalysis(JSON.parse(text.replace(/```json|```/g,"").trim()));
    } catch { setAnalysis({ strength:"エラーが発生しました", next_target:"再試行してください", nutrition_advice:"" }); }
    setAnalyzing(false);
  };

  const d = new Date(dateStr);

  return (
    <div className="tab-in" style={{ padding:"20px 16px", paddingBottom:100 }}>
      <div style={{ fontWeight:900, fontSize:22, marginBottom:4 }}>💪 筋トレ記録</div>
      <div style={{ fontSize:13, color:"#999", marginBottom:20 }}>{d.getMonth()+1}月{d.getDate()}日</div>

      <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:4, marginBottom:16 }}>
        {Object.keys(EXERCISE_MENU).map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} style={{
            flexShrink:0, padding:"6px 14px", borderRadius:20, border:"none", cursor:"pointer",
            background: activeCategory===cat ? CATEGORY_COLORS[cat] : "#fff",
            color: activeCategory===cat ? "#fff" : CATEGORY_COLORS[cat],
            fontWeight:700, fontSize:12, boxShadow:"0 1px 4px rgba(0,0,0,0.08)",
            outline:`2px solid ${activeCategory===cat ? CATEGORY_COLORS[cat] : "transparent"}`,
          }}>{cat}</button>
        ))}
      </div>

      <div style={{ background:"#fff", borderRadius:16, overflow:"hidden",
        boxShadow:"0 2px 12px rgba(0,0,0,0.06)", marginBottom:20 }}>
        {EXERCISE_MENU[activeCategory].map((name, i) => {
          const added = exercises.some(e => e.name === name);
          return (
            <div key={name} onClick={() => !added && persist([...exercises,{name,category:activeCategory,sets:[]}])} style={{
              display:"flex", alignItems:"center", gap:12, padding:"14px 16px",
              borderBottom: i<EXERCISE_MENU[activeCategory].length-1?"1px solid #F5F4F0":"none",
              cursor: added?"default":"pointer", opacity: added?0.5:1,
            }}>
              <div style={{ width:10,height:10,borderRadius:"50%",background:CATEGORY_COLORS[activeCategory],flexShrink:0 }} />
              <span style={{ fontSize:14, flex:1 }}>{name}</span>
              {added
                ? <span style={{ fontSize:11, color:"#ccc" }}>追加済み</span>
                : <span style={{ fontSize:20, color:CATEGORY_COLORS[activeCategory], lineHeight:1 }}>+</span>}
            </div>
          );
        })}
      </div>

      {exercises.length > 0 && (
        <div style={{ marginBottom:20 }}>
          <div style={sectionLabel}>今日のメニュー</div>
          {exercises.map((ex, i) => (
            <ExerciseCard key={i} exercise={ex} color={CATEGORY_COLORS[ex.category]}
              onUpdate={val => { const e=[...exercises]; e[i]=val; persist(e); }}
              onRemove={() => persist(exercises.filter((_,idx)=>idx!==i))} />
          ))}
        </div>
      )}

      {exercises.length > 0 && (
        <button onClick={doAnalyze} disabled={analyzing} style={{
          width:"100%", padding:16, borderRadius:14, border:"none",
          background: analyzing?"#E5E5E5":"linear-gradient(135deg,#FF5500,#FF8C00)",
          color: analyzing?"#999":"#fff", fontSize:14, fontWeight:900,
          cursor: analyzing?"not-allowed":"pointer", letterSpacing:2,
          boxShadow: analyzing?"none":"0 4px 16px rgba(255,85,0,0.3)",
        }}>
          {analyzing ? "⚡ 分析中..." : "⚡ AIで今日を総括する"}
        </button>
      )}

      {analysis && (
        <div style={{ marginTop:16, background:"#fff", borderRadius:16, padding:20,
          boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
          {[
            { key:"strength",         label:"✅ 良かったところ",   color:"#10B981" },
            { key:"next_target",      label:"🎯 次回のターゲット", color:"#FF5500" },
            { key:"nutrition_advice", label:"🥦 栄養アドバイス",   color:"#F59E0B" },
          ].filter(s=>analysis[s.key]).map((s,i,arr) => (
            <div key={s.key}>
              <div style={{ fontSize:11, fontWeight:700, color:s.color, letterSpacing:1, marginBottom:6 }}>{s.label}</div>
              <p style={{ fontSize:13, lineHeight:1.7, color:"#444", marginBottom:i<arr.length-1?16:0 }}>{analysis[s.key]}</p>
              {i<arr.length-1 && <div style={{ height:1, background:"#F5F4F0", marginBottom:16 }} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ExerciseCard({ exercise, color, onUpdate, onRemove }) {
  const addSet = () => onUpdate({ ...exercise, sets:[...exercise.sets,{weight:"",reps:"",sets:"1"}] });
  const updateSet = (i,val) => { const s=[...exercise.sets]; s[i]=val; onUpdate({...exercise,sets:s}); };
  const removeSet = (i) => onUpdate({ ...exercise, sets:exercise.sets.filter((_,idx)=>idx!==i) });

  return (
    <div style={{ background:"#fff", borderRadius:14, padding:16, marginBottom:10,
      borderLeft:`4px solid ${color}`, boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:8,height:8,borderRadius:"50%",background:color }} />
          <span style={{ fontWeight:700, fontSize:14 }}>{exercise.name}</span>
          <span style={{ fontSize:11, color:"#ccc" }}>{exercise.category}</span>
        </div>
        <button onClick={onRemove} style={{ border:"none",background:"none",color:"#ccc",cursor:"pointer",fontSize:16 }}>✕</button>
      </div>

      {exercise.sets.length > 0 && (
        <div style={{ display:"grid", gridTemplateColumns:"20px 1fr 1fr 1fr 20px", gap:6, marginBottom:6 }}>
          {["#","kg","rep","set",""].map((h,i) => (
            <div key={i} style={{ fontSize:10, color:"#ccc", textAlign:"center" }}>{h}</div>
          ))}
        </div>
      )}

      {exercise.sets.map((set,i) => (
        <div key={i} style={{ display:"grid", gridTemplateColumns:"20px 1fr 1fr 1fr 20px", gap:6, marginBottom:4 }}>
          <div style={{ fontSize:11,color:"#ccc",textAlign:"center",paddingTop:7 }}>{i+1}</div>
          {["weight","reps","sets"].map(field => (
            <input key={field} type="number"
              placeholder={field==="weight"?"重量":field==="reps"?"回数":"set数"}
              value={set[field]}
              onChange={e => updateSet(i,{...set,[field]:e.target.value})}
              style={{ border:"1px solid #E5E5E5",borderRadius:8,padding:"6px",
                textAlign:"center",fontSize:13,outline:"none",background:"#F9F9F7" }} />
          ))}
          <button onClick={()=>removeSet(i)} style={{ border:"none",background:"none",color:"#ddd",cursor:"pointer",fontSize:14 }}>×</button>
        </div>
      ))}

      <button onClick={addSet} style={{ width:"100%",marginTop:8,padding:"7px",border:"1px dashed #E5E5E5",
        borderRadius:8,background:"none",color:"#ccc",cursor:"pointer",fontSize:12 }}>
        ＋ セット追加
      </button>
    </div>
  );
}

// ===================== SETTINGS =====================
function SettingsTab() {
  const [profile, setProfile] = useState(() => load("kintan:profile", defaultProfile));
  const [saved, setSaved] = useState(false);
  const update = (key,val) => setProfile(p=>({...p,[key]:val}));
  const save = () => { store("kintan:profile", profile); setSaved(true); setTimeout(()=>setSaved(false),2000); };

  return (
    <div className="tab-in" style={{ padding:"20px 16px", paddingBottom:100 }}>
      <div style={{ fontWeight:900, fontSize:22, marginBottom:4 }}>⚙️ 設定</div>
      <div style={{ fontSize:13, color:"#999", marginBottom:24 }}>プロフィールと目標</div>

      <div style={{ background:"#fff", borderRadius:16, overflow:"hidden",
        boxShadow:"0 2px 12px rgba(0,0,0,0.06)", marginBottom:16 }}>
        <div style={{ padding:"14px 16px", borderBottom:"1px solid #F5F4F0",
          fontSize:11, fontWeight:700, color:"#999", letterSpacing:2 }}>PROFILE</div>
        {[
          { key:"name",   label:"名前",  placeholder:"山田 太郎", type:"text" },
          { key:"age",    label:"年齢",  placeholder:"25",        type:"number", unit:"歳" },
          { key:"height", label:"身長",  placeholder:"170",       type:"number", unit:"cm" },
          { key:"weight", label:"体重",  placeholder:"70",        type:"number", unit:"kg" },
        ].map((f,i,arr) => (
          <div key={f.key} style={{ display:"flex", alignItems:"center", padding:"14px 16px",
            borderBottom:i<arr.length-1?"1px solid #F5F4F0":"none" }}>
            <span style={{ fontSize:14,color:"#555",width:60 }}>{f.label}</span>
            <input type={f.type} placeholder={f.placeholder} value={profile[f.key]}
              onChange={e=>update(f.key,e.target.value)}
              style={{ flex:1,border:"none",outline:"none",fontSize:14,
                fontWeight:600,textAlign:"right",background:"transparent" }} />
            {f.unit && <span style={{ fontSize:12,color:"#ccc",marginLeft:4 }}>{f.unit}</span>}
          </div>
        ))}
      </div>

      <div style={{ background:"#fff", borderRadius:16, overflow:"hidden",
        boxShadow:"0 2px 12px rgba(0,0,0,0.06)", marginBottom:16 }}>
        <div style={{ padding:"14px 16px", borderBottom:"1px solid #F5F4F0",
          fontSize:11, fontWeight:700, color:"#999", letterSpacing:2 }}>GOAL</div>
        <div style={{ padding:"14px 16px", borderBottom:"1px solid #F5F4F0" }}>
          <div style={{ fontSize:14,color:"#555",marginBottom:12 }}>トレーニング目標</div>
          <div style={{ display:"flex", gap:8 }}>
            {["減量","筋肥大","維持"].map(g => (
              <button key={g} onClick={()=>update("goal",g)} style={{
                flex:1, padding:"10px 0", borderRadius:10, border:"none", cursor:"pointer",
                background:profile.goal===g?"#FF5500":"#F5F4F0",
                color:profile.goal===g?"#fff":"#555",
                fontWeight:700, fontSize:13, transition:"all 0.15s",
              }}>{g}</button>
            ))}
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", padding:"14px 16px" }}>
          <span style={{ fontSize:14,color:"#555",flex:1 }}>週トレ目標</span>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <button onClick={()=>update("weeklyTarget",Math.max(1,profile.weeklyTarget-1))}
              style={{ width:32,height:32,borderRadius:"50%",border:"1px solid #E5E5E5",
                background:"#F5F4F0",cursor:"pointer",fontSize:18 }}>−</button>
            <span style={{ fontWeight:900,fontSize:22,width:24,textAlign:"center" }}>{profile.weeklyTarget}</span>
            <button onClick={()=>update("weeklyTarget",Math.min(7,profile.weeklyTarget+1))}
              style={{ width:32,height:32,borderRadius:"50%",border:"1px solid #E5E5E5",
                background:"#F5F4F0",cursor:"pointer",fontSize:18 }}>+</button>
            <span style={{ fontSize:12,color:"#ccc" }}>日/週</span>
          </div>
        </div>
      </div>

      <button onClick={save} style={{
        width:"100%", padding:16, borderRadius:14, border:"none",
        background:saved?"#10B981":"#1A1A1A",
        color:"#fff", fontSize:14, fontWeight:900, cursor:"pointer",
        transition:"background 0.3s", letterSpacing:2,
      }}>
        {saved ? "✓ 保存しました" : "保存する"}
      </button>
    </div>
  );
}

// ===================== BOTTOM NAV =====================
const NAV_ITEMS = [
  { key:"home",     Icon: HomeIcon,     label:"ホーム" },
  { key:"calendar", Icon: CalendarIcon, label:"カレンダー" },
  { key:"meals",    Icon: MealIcon,     label:"食事" },
  { key:"workout",  Icon: WorkoutIcon,  label:"筋トレ" },
  { key:"settings", Icon: SettingsIcon, label:"設定" },
];

// ===================== MAIN APP =====================
export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [selectedDate, setSelectedDate] = useState(todayStr());

  if (showSplash) return <SplashScreen onFinish={() => setShowSplash(false)} />;

  return (
    <>
      <style>{G}</style>
      <div style={{ maxWidth:480, margin:"0 auto", minHeight:"100vh", background:"#F5F4F0", position:"relative" }}>

        {/* Header */}
        <div style={{ background:"#fff", padding:"16px 20px 12px",
          borderBottom:"1px solid #F0EDE8", position:"sticky", top:0, zIndex:50 }}>
          <div style={{ fontWeight:900, fontSize:22, letterSpacing:-1,
            background:"linear-gradient(135deg,#FF5500,#FF8C00)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            KINTAN 💪
          </div>
          <div style={{ fontSize:11, color:"#ccc", letterSpacing:2, marginTop:1 }}>
            {NAV_ITEMS.find(n=>n.key===activeTab)?.label.toUpperCase()}
          </div>
        </div>

        {/* Content */}
        <div>
          {activeTab==="home"     && <HomeTab onNavigate={setActiveTab} />}
          {activeTab==="calendar" && <CalendarTab onSelectDate={setSelectedDate} selectedDate={selectedDate} />}
          {activeTab==="meals"    && <MealsTab dateStr={selectedDate} />}
          {activeTab==="workout"  && <WorkoutTab dateStr={selectedDate} />}
          {activeTab==="settings" && <SettingsTab />}
        </div>

        {/* Bottom Nav */}
        <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
          width:"100%", maxWidth:480, background:"#fff",
          borderTop:"1px solid #F0EDE8", display:"flex",
          padding:"8px 0 8px", zIndex:100,
          boxShadow:"0 -4px 20px rgba(0,0,0,0.06)" }}>
          {NAV_ITEMS.map(item => (
            <button key={item.key} onClick={() => setActiveTab(item.key)} style={{
              flex:1, border:"none", background:"none", cursor:"pointer",
              display:"flex", flexDirection:"column", alignItems:"center", gap:2, padding:"4px 0",
            }}>
              <item.Icon size={26} color={activeTab === item.key ? "#FF5500" : "#ccc"} />
              <span style={{ fontSize:10, fontWeight:activeTab===item.key?700:400,
                color:activeTab===item.key?"#FF5500":"#ccc" }}>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
