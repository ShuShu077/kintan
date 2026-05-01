import { useState, useEffect, useCallback } from "react";

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
  "胸": "#FF5500", "背中": "#00C4FF", "脚": "#FFD600",
  "肩": "#B14AFF", "腕": "#00FF88", "体幹": "#FF3D7F",
};

const todayStr = () => new Date().toISOString().slice(0, 10);

// ===================== STORAGE HELPERS (localStorage) =====================
function loadDay(dateStr) {
  try {
    const raw = localStorage.getItem(`kintan:${dateStr}`);
    return raw ? JSON.parse(raw) : { exercises: [], nutrition: { protein: "", fat: "", calories: "" } };
  } catch {
    return { exercises: [], nutrition: { protein: "", fat: "", calories: "" } };
  }
}
function saveDay(dateStr, data) {
  try { localStorage.setItem(`kintan:${dateStr}`, JSON.stringify(data)); } catch {}
}

// ===================== STYLES =====================
const styles = {
  app: {
    minHeight: "100vh",
    background: "#0A0A0A",
    color: "#F0EDE8",
    fontFamily: "'Noto Sans JP', 'Helvetica Neue', sans-serif",
    backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,85,0,0.04) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(255,85,0,0.04) 40px)`,
  },
  header: {
    borderBottom: "2px solid #FF5500",
    padding: "16px 24px",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    background: "rgba(10,10,10,0.95)",
    position: "sticky", top: 0, zIndex: 100,
  },
  logo: {
    fontSize: "28px", fontWeight: 900, letterSpacing: "-1px",
    background: "linear-gradient(135deg, #FF5500 0%, #FFD600 100%)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
  },
  tagline: { fontSize: "10px", color: "#888", letterSpacing: "3px", textTransform: "uppercase" },
  main: { maxWidth: "720px", margin: "0 auto", padding: "24px 16px", display: "flex", flexDirection: "column", gap: "20px" },
  dateBar: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    background: "#141414", border: "1px solid #222", borderRadius: "12px", padding: "12px 16px",
  },
  dateBtn: {
    background: "transparent", border: "1px solid #333", borderRadius: "8px", color: "#888",
    padding: "6px 14px", cursor: "pointer", fontSize: "18px", transition: "all 0.15s",
  },
  dateDisplay: { textAlign: "center" },
  dateMain: { fontSize: "22px", fontWeight: 700, letterSpacing: "-0.5px" },
  dateWeekday: { fontSize: "11px", color: "#FF5500", letterSpacing: "2px", textTransform: "uppercase" },
  card: {
    background: "#141414", border: "1px solid #222", borderRadius: "16px", overflow: "hidden",
  },
  cardHeader: {
    padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between",
    borderBottom: "1px solid #1A1A1A",
  },
  cardTitle: { fontSize: "13px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: "#888" },
  cardBody: { padding: "16px 20px" },
  nutritionGrid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" },
  nutriBox: {
    background: "#0D0D0D", borderRadius: "12px", padding: "12px 14px",
    border: "1px solid #1E1E1E", display: "flex", flexDirection: "column", gap: "6px",
  },
  nutriLabel: { fontSize: "10px", color: "#666", letterSpacing: "2px", textTransform: "uppercase" },
  nutriInput: {
    background: "transparent", border: "none", outline: "none",
    color: "#F0EDE8", fontSize: "24px", fontWeight: 700, width: "100%",
    letterSpacing: "-1px",
  },
  nutriUnit: { fontSize: "11px", color: "#444" },
  catGrid: { display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" },
  catBtn: (color, active) => ({
    padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: 700,
    cursor: "pointer", transition: "all 0.15s",
    background: active ? color : "transparent",
    border: `1px solid ${color}`,
    color: active ? "#0A0A0A" : color,
    letterSpacing: "1px",
  }),
  exList: { display: "flex", flexDirection: "column", gap: "8px" },
  exItem: (color) => ({
    display: "flex", alignItems: "center", gap: "10px",
    background: "#0D0D0D", borderRadius: "10px", padding: "10px 14px",
    border: `1px solid ${color}22`, cursor: "pointer",
    transition: "all 0.15s",
  }),
  exDot: (color) => ({
    width: "8px", height: "8px", borderRadius: "50%", background: color, flexShrink: 0,
  }),
  exName: { fontSize: "13px", fontWeight: 600, flex: 1 },
  selectedList: { display: "flex", flexDirection: "column", gap: "10px" },
  selectedItem: (color) => ({
    background: `${color}11`, border: `1px solid ${color}33`,
    borderRadius: "12px", padding: "12px 16px",
    borderLeft: `3px solid ${color}`,
  }),
  selectedHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" },
  selectedName: { fontSize: "13px", fontWeight: 700 },
  removeBtn: {
    background: "transparent", border: "none", color: "#444",
    cursor: "pointer", fontSize: "16px", padding: "0",
  },
  setGrid: { display: "grid", gridTemplateColumns: "auto 1fr 1fr 1fr auto", gap: "6px", alignItems: "center" },
  setLabel: { fontSize: "11px", color: "#555", width: "24px", textAlign: "center", fontWeight: 700 },
  setInput: {
    background: "#0A0A0A", border: "1px solid #222", borderRadius: "6px",
    color: "#F0EDE8", fontSize: "13px", padding: "5px 8px", textAlign: "center",
    outline: "none", width: "100%",
  },
  setHeaderLabel: { fontSize: "10px", color: "#444", textAlign: "center", letterSpacing: "1px" },
  addSetBtn: {
    background: "transparent", border: "1px dashed #333", borderRadius: "8px",
    color: "#555", cursor: "pointer", padding: "6px", fontSize: "13px",
    marginTop: "6px", width: "100%", transition: "all 0.15s",
  },
  analyzeBtn: (loading) => ({
    width: "100%", padding: "16px", borderRadius: "12px",
    background: loading ? "#1A1A1A" : "linear-gradient(135deg, #FF5500 0%, #FFD600 100%)",
    border: "none", cursor: loading ? "not-allowed" : "pointer",
    color: loading ? "#555" : "#0A0A0A", fontSize: "14px", fontWeight: 900,
    letterSpacing: "3px", textTransform: "uppercase", transition: "all 0.2s",
  }),
  analysisBox: {
    background: "#0D0D0D", border: "1px solid #1E1E1E", borderRadius: "12px",
    padding: "16px", marginTop: "16px",
  },
  analysisSection: { marginBottom: "14px" },
  analysisSectionTitle: (color) => ({
    fontSize: "11px", fontWeight: 700, letterSpacing: "2px", color,
    textTransform: "uppercase", marginBottom: "8px",
    display: "flex", alignItems: "center", gap: "6px",
  }),
  analysisText: { fontSize: "13px", lineHeight: 1.7, color: "#C0BDB8" },
};

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

// ===================== COMPONENTS =====================

function NutritionCard({ nutrition, onChange }) {
  const fields = [
    { key: "protein", label: "タンパク質", unit: "g", color: "#00FF88" },
    { key: "fat", label: "脂質", unit: "g", color: "#FFD600" },
    { key: "calories", label: "カロリー", unit: "kcal", color: "#FF5500" },
  ];
  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <span style={styles.cardTitle}>🥩 栄養摂取</span>
      </div>
      <div style={styles.cardBody}>
        <div style={styles.nutritionGrid}>
          {fields.map(f => (
            <div key={f.key} style={styles.nutriBox}>
              <span style={styles.nutriLabel}>{f.label}</span>
              <input
                style={{ ...styles.nutriInput, color: f.color }}
                type="number" placeholder="0" value={nutrition[f.key]}
                onChange={e => onChange({ ...nutrition, [f.key]: e.target.value })}
              />
              <span style={styles.nutriUnit}>{f.unit}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ExerciseSet({ set, idx, onChange, onRemove }) {
  return (
    <div style={styles.setGrid}>
      <span style={styles.setLabel}>{idx + 1}</span>
      <input style={styles.setInput} type="number" placeholder="重量" value={set.weight}
        onChange={e => onChange({ ...set, weight: e.target.value })} />
      <input style={styles.setInput} type="number" placeholder="回数" value={set.reps}
        onChange={e => onChange({ ...set, reps: e.target.value })} />
      <input style={styles.setInput} type="number" placeholder="セット" value={set.sets}
        onChange={e => onChange({ ...set, sets: e.target.value })} />
      <button style={styles.removeBtn} onClick={onRemove}>×</button>
    </div>
  );
}

function SelectedExercise({ exercise, color, onUpdate, onRemove }) {
  const addSet = () => onUpdate({ ...exercise, sets: [...exercise.sets, { weight: "", reps: "", sets: "1" }] });
  const updateSet = (i, val) => {
    const sets = [...exercise.sets];
    sets[i] = val;
    onUpdate({ ...exercise, sets });
  };
  const removeSet = (i) => {
    const sets = exercise.sets.filter((_, idx) => idx !== i);
    onUpdate({ ...exercise, sets });
  };

  return (
    <div style={styles.selectedItem(color)}>
      <div style={styles.selectedHeader}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={styles.exDot(color)} />
          <span style={styles.selectedName}>{exercise.name}</span>
          <span style={{ fontSize: "10px", color: "#555", letterSpacing: "1px" }}>{exercise.category}</span>
        </div>
        <button style={styles.removeBtn} onClick={onRemove}>✕</button>
      </div>
      {exercise.sets.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr 1fr auto", gap: "6px", marginBottom: "6px" }}>
          <span style={styles.setHeaderLabel}>#</span>
          <span style={styles.setHeaderLabel}>kg</span>
          <span style={styles.setHeaderLabel}>rep</span>
          <span style={styles.setHeaderLabel}>set</span>
          <span />
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        {exercise.sets.map((set, i) => (
          <ExerciseSet key={i} set={set} idx={i}
            onChange={val => updateSet(i, val)}
            onRemove={() => removeSet(i)} />
        ))}
      </div>
      <button style={styles.addSetBtn} onClick={addSet}>＋ セット追加</button>
    </div>
  );
}

function WorkoutCard({ exercises, onAdd, onUpdate, onRemove }) {
  const [activeCategory, setActiveCategory] = useState("胸");

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <span style={styles.cardTitle}>💪 トレーニングメニュー</span>
        <span style={{ fontSize: "12px", color: "#555" }}>{exercises.length}種目</span>
      </div>
      <div style={styles.cardBody}>
        <div style={styles.catGrid}>
          {Object.keys(EXERCISE_MENU).map(cat => (
            <button key={cat} style={styles.catBtn(CATEGORY_COLORS[cat], activeCategory === cat)}
              onClick={() => setActiveCategory(cat)}>
              {cat}
            </button>
          ))}
        </div>
        <div style={styles.exList}>
          {EXERCISE_MENU[activeCategory].map(name => {
            const alreadyAdded = exercises.some(e => e.name === name);
            return (
              <div key={name}
                style={{ ...styles.exItem(CATEGORY_COLORS[activeCategory]), opacity: alreadyAdded ? 0.4 : 1 }}
                onClick={() => !alreadyAdded && onAdd(name, activeCategory)}>
                <div style={styles.exDot(CATEGORY_COLORS[activeCategory])} />
                <span style={styles.exName}>{name}</span>
                {alreadyAdded
                  ? <span style={{ fontSize: "11px", color: "#444" }}>追加済み</span>
                  : <span style={{ fontSize: "18px", color: CATEGORY_COLORS[activeCategory], opacity: 0.6 }}>＋</span>}
              </div>
            );
          })}
        </div>
        {exercises.length > 0 && (
          <>
            <div style={{ height: "1px", background: "#1A1A1A", margin: "20px 0" }} />
            <div style={{ fontSize: "11px", color: "#555", letterSpacing: "2px", marginBottom: "12px", textTransform: "uppercase" }}>
              今日のメニュー
            </div>
            <div style={styles.selectedList}>
              {exercises.map((ex, i) => (
                <SelectedExercise key={i} exercise={ex}
                  color={CATEGORY_COLORS[ex.category]}
                  onUpdate={val => onUpdate(i, val)}
                  onRemove={() => onRemove(i)} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function AnalysisCard({ exercises, nutrition, dateStr }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const analyze = async () => {
    if (exercises.length === 0) { alert("トレーニングメニューを追加してください"); return; }
    setLoading(true); setResult(null);

    const menuSummary = exercises.map(ex => {
      const setsStr = ex.sets.map((s, i) => `第${i+1}セット: ${s.weight||"?"}kg × ${s.reps||"?"}回 × ${s.sets||1}セット`).join(", ");
      return `【${ex.category}】${ex.name}: ${setsStr || "種目のみ記録"}`;
    }).join("\n");

    const nutriStr = [
      nutrition.protein ? `タンパク質 ${nutrition.protein}g` : null,
      nutrition.fat ? `脂質 ${nutrition.fat}g` : null,
      nutrition.calories ? `カロリー ${nutrition.calories}kcal` : null,
    ].filter(Boolean).join("、");

    const prompt = `あなたはプロのフィジカルトレーナーです。以下の筋トレ記録を分析し、簡潔にフィードバックしてください。

【日付】${dateStr}
【トレーニング記録】
${menuSummary}
${nutriStr ? `【栄養摂取】${nutriStr}` : ""}

以下の3点をそれぞれ2〜3文で答えてください：
1. 今日の良かったポイント（strength）
2. 次回意識して鍛えるべき点・改善ポイント（next_target）
3. 栄養面のアドバイス（nutrition_advice）${!nutriStr ? "（記録なし。筋トレ内容から推奨量を提案）" : ""}

必ずJSON形式のみで返してください。マークダウンや説明文は不要です。
{"strength":"...","next_target":"...","nutrition_advice":"..."}`;

    try {
      // VercelにデプロイしたAPIエンドポイントを使用
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      const text = data.content?.find(c => c.type === "text")?.text || "{}";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
    } catch (e) {
      setResult({ strength: "分析中にエラーが発生しました。", next_target: "しばらくしてから再試行してください。", nutrition_advice: "" });
    }
    setLoading(false);
  };

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <span style={styles.cardTitle}>🤖 AI 総括</span>
        {result && <span style={{ fontSize: "10px", color: "#555" }}>Claude分析済み</span>}
      </div>
      <div style={styles.cardBody}>
        <button style={styles.analyzeBtn(loading)} onClick={analyze} disabled={loading}>
          {loading ? "⚡ 分析中..." : "⚡ 今日のトレを分析する"}
        </button>
        {result && (
          <div style={styles.analysisBox}>
            <div style={styles.analysisSection}>
              <div style={styles.analysisSectionTitle("#00FF88")}>
                <span>▲</span> 良かったところ
              </div>
              <p style={styles.analysisText}>{result.strength}</p>
            </div>
            <div style={{ height: "1px", background: "#1A1A1A", margin: "12px 0" }} />
            <div style={styles.analysisSection}>
              <div style={styles.analysisSectionTitle("#FF5500")}>
                <span>▶</span> 次回のターゲット
              </div>
              <p style={styles.analysisText}>{result.next_target}</p>
            </div>
            {result.nutrition_advice && (
              <>
                <div style={{ height: "1px", background: "#1A1A1A", margin: "12px 0" }} />
                <div style={styles.analysisSection}>
                  <div style={styles.analysisSectionTitle("#FFD600")}>
                    <span>●</span> 栄養アドバイス
                  </div>
                  <p style={{ ...styles.analysisText, marginBottom: 0 }}>{result.nutrition_advice}</p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ===================== MAIN APP =====================
export default function App() {
  const [currentDate, setCurrentDate] = useState(todayStr());
  const [dayData, setDayData] = useState({ exercises: [], nutrition: { protein: "", fat: "", calories: "" } });

  useEffect(() => {
    setDayData(loadDay(currentDate));
  }, [currentDate]);

  const persist = useCallback((data) => {
    setDayData(data);
    saveDay(currentDate, data);
  }, [currentDate]);

  const changeDate = (delta) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + delta);
    setCurrentDate(d.toISOString().slice(0, 10));
  };

  const addExercise = (name, category) => {
    persist({ ...dayData, exercises: [...dayData.exercises, { name, category, sets: [] }] });
  };
  const updateExercise = (i, val) => {
    const exercises = [...dayData.exercises]; exercises[i] = val;
    persist({ ...dayData, exercises });
  };
  const removeExercise = (i) => {
    persist({ ...dayData, exercises: dayData.exercises.filter((_, idx) => idx !== i) });
  };
  const updateNutrition = (nutrition) => persist({ ...dayData, nutrition });

  const d = new Date(currentDate);
  const isToday = currentDate === todayStr();
  const formattedDate = `${d.getMonth() + 1}月${d.getDate()}日`;
  const weekday = WEEKDAYS[d.getDay()];

  return (
    <div style={styles.app}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;600;700;900&display=swap" rel="stylesheet" />
      <header style={styles.header}>
        <div>
          <div style={styles.logo}>KINTAN</div>
          <div style={styles.tagline}>筋トレ計測アプリ</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "11px", color: "#444", letterSpacing: "2px" }}>POWERED BY</div>
          <div style={{ fontSize: "11px", color: "#FF5500", letterSpacing: "1px", fontWeight: 700 }}>CLAUDE AI</div>
        </div>
      </header>
      <main style={styles.main}>
        <div style={styles.dateBar}>
          <button style={styles.dateBtn} onClick={() => changeDate(-1)}>‹</button>
          <div style={styles.dateDisplay}>
            <div style={styles.dateMain}>
              {formattedDate} <span style={{ fontSize: "16px", color: "#888" }}>({weekday})</span>
            </div>
            {isToday && <div style={styles.dateWeekday}>Today</div>}
          </div>
          <button style={{ ...styles.dateBtn, opacity: isToday ? 0.3 : 1 }}
            onClick={() => !isToday && changeDate(1)} disabled={isToday}>›</button>
        </div>
        <NutritionCard nutrition={dayData.nutrition} onChange={updateNutrition} />
        <WorkoutCard
          exercises={dayData.exercises}
          onAdd={addExercise}
          onUpdate={updateExercise}
          onRemove={removeExercise}
        />
        <AnalysisCard
          exercises={dayData.exercises}
          nutrition={dayData.nutrition}
          dateStr={`${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} (${weekday})`}
        />
        <div style={{ height: "40px" }} />
      </main>
    </div>
  );
}
