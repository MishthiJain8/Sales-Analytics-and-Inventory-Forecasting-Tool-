import streamlit as st
import pandas as pd
import sqlite3
import matplotlib.pyplot as plt
from datetime import datetime
from qa_logic import answer_question  # Your QA logic here

# --- Initialize DB connection and table ---
conn = sqlite3.connect('chat_history.db', check_same_thread=False)
c = conn.cursor()
c.execute('''
CREATE TABLE IF NOT EXISTS chat (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT,
    question TEXT,
    answer TEXT
)
''')
conn.commit()

def load_chat():
    c.execute("SELECT timestamp, question, answer FROM chat ORDER BY id ASC")
    return c.fetchall()

def save_chat(question, answer):
    c.execute("INSERT INTO chat (timestamp, question, answer) VALUES (?, ?, ?)",
              (datetime.now().strftime("%Y-%m-%d %H:%M:%S"), question, answer))
    conn.commit()

st.set_page_config(page_title="Ask My Data", layout="wide")
st.title("🧠 Ask-My-Data: Marketing Q&A + Visual Explorer")

uploaded_file = st.file_uploader("📁 Upload your marketing CSV", type=["csv"])

if "df" not in st.session_state:
    st.session_state.df = None

if uploaded_file:
    st.session_state.df = pd.read_csv(uploaded_file)

if st.session_state.df is not None:
    df = st.session_state.df

    st.write("### 🧾 Dataset Overview")
    st.write(f"**Rows:** {df.shape[0]} | **Columns:** {df.shape[1]}")
    st.dataframe(pd.DataFrame(df.dtypes, columns=["Data Type"]).reset_index().rename(columns={"index": "Column"}))

    st.write("### 📊 Summary Statistics")
    st.dataframe(df.describe())

    st.write("### 🔍 Data Preview (Top 10 Rows)")
    st.dataframe(df.head(10))

    # --- Graph 1 ---
    if "campaign" in df.columns and "revenue" in df.columns:
        st.write("### 💰 Revenue by Campaign")
        revenue_by_campaign = df.groupby("campaign")["revenue"].sum().sort_values(ascending=False)
        fig1, ax1 = plt.subplots()
        revenue_by_campaign.plot(kind='bar', ax=ax1)
        ax1.set_ylabel("Total Revenue")
        ax1.set_xlabel("Campaign")
        st.pyplot(fig1)
    else:
        st.info("No 'campaign' or 'revenue' column for graph.")

    # --- Graph 2 ---
    if "date" in df.columns and "clicks" in df.columns:
        st.write("### 📈 Clicks Over Time")
        try:
            df['date'] = pd.to_datetime(df['date'])
            clicks_over_time = df.groupby('date')['clicks'].sum()
            fig2, ax2 = plt.subplots()
            clicks_over_time.plot(kind='line', ax=ax2)
            ax2.set_ylabel("Clicks")
            ax2.set_xlabel("Date")
            st.pyplot(fig2)
        except Exception as e:
            st.warning(f"Could not plot clicks over time: {e}")

    # --- Graph 3 ---
    if "channel" in df.columns and "spend" in df.columns:
        st.write("### 🧾 Spend by Channel")
        spend_by_channel = df.groupby("channel")["spend"].sum()
        fig3, ax3 = plt.subplots()
        spend_by_channel.plot(kind='pie', autopct='%1.1f%%', ax=ax3)
        ax3.set_ylabel("")
        st.pyplot(fig3)

# Sidebar for previous questions & answers
with st.sidebar:
    st.header("💬 Previous Questions")
    chat_history = load_chat()
    for timestamp, q, a in reversed(chat_history):  # latest first
        st.markdown(f"🕐 *{timestamp}*")
        st.markdown(f"**You:** {q}")
        st.markdown(f"**Bot:** {a}")
        st.markdown("---")

st.subheader("💬 Ask Your Data a Question")

def process_question():
    if st.session_state.df is None:
        st.warning("Please upload a CSV first before asking questions.")
        return

    question = st.session_state.user_question.strip()
    if question == "":
        st.warning("Please enter a question.")
        return

    answer = answer_question(st.session_state.df, question)
    save_chat(question, answer)

    if "chat_messages" not in st.session_state:
        st.session_state.chat_messages = []

    st.session_state.chat_messages.append(("You", question))
    st.session_state.chat_messages.append(("Bot", answer))

    st.session_state.user_question = ""  # Clear input

with st.form(key="ask_form"):
    user_question = st.text_input("Type your question here and press Enter", key="user_question")
    submitted = st.form_submit_button("Ask", on_click=process_question)

if "chat_messages" in st.session_state and st.session_state.chat_messages:
    for sender, msg in st.session_state.chat_messages:
        if sender == "You":
            st.markdown(f"🧍 **{sender}:** {msg}")
        else:
            st.markdown(f"🤖 **{sender}:** {msg}")
