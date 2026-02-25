import pandas as pd

def answer_question(df: pd.DataFrame, question: str) -> str:
    q = question.lower().strip()

    # Simple conversational responses
    greetings = ["hi", "hello", "hey", "good morning", "good afternoon", "good evening"]
    thanks = ["thanks", "thank you", "thx"]
    how_are_you = ["how are you", "how's it going", "how do you do"]
    bye_words = ["bye", "goodbye", "see you"]

    if any(g in q for g in greetings):
        return "Hello! You can ask me questions about clicks, revenue, spend, impressions, or averages."

    if any(t in q for t in thanks):
        return "You're welcome! Feel free to ask more questions about your data."

    if any(h in q for h in how_are_you):
        return "I'm just a bot, but I'm here to help you analyze your data. Ask me anything!"

    if any(b in q for b in bye_words):
        return "Goodbye! Come back anytime for more data insights."

    # Check if dataframe is empty or None
    if df is None or df.empty:
        return "No data loaded. Please upload a CSV file first."

    # Helper to calculate averages safely
    def safe_avg(col):
        if col in df.columns:
            return df[col].mean()
        return None

    # Respond to various keywords
    if "average" in q or "mean" in q:
        # Try to detect which column user wants average for
        columns = ["clicks", "revenue", "spend", "impressions"]
        for col in columns:
            if col in q:
                avg_val = safe_avg(col)
                if avg_val is not None:
                    return f"The average {col} is {avg_val:.2f}."
                else:
                    return f"Sorry, no data found for '{col}'."
        # If no column explicitly mentioned
        return ("Please specify which metric you want the average for. "
                "Try: clicks, revenue, spend, or impressions.")

    if "total" in q or "sum" in q:
        columns = ["clicks", "revenue", "spend", "impressions"]
        for col in columns:
            if col in q:
                if col in df.columns:
                    total_val = df[col].sum()
                    return f"The total {col} is {total_val}."
                else:
                    return f"Sorry, no data found for '{col}'."
        return "Please specify which metric you want the total for."

    if "clicks" in q:
        if "total" in q or "sum" in q:
            total_clicks = df["clicks"].sum() if "clicks" in df.columns else None
            return f"Total clicks: {total_clicks}" if total_clicks is not None else "Clicks data not found."
        elif "average" in q or "mean" in q:
            avg_clicks = safe_avg("clicks")
            return f"Average clicks: {avg_clicks:.2f}" if avg_clicks is not None else "Clicks data not found."
        else:
            return f"Clicks info - total: {df['clicks'].sum() if 'clicks' in df.columns else 'N/A'}, average: {safe_avg('clicks'):.2f}."

    if "revenue" in q:
        if "total" in q or "sum" in q:
            total_rev = df["revenue"].sum() if "revenue" in df.columns else None
            return f"Total revenue: {total_rev}" if total_rev is not None else "Revenue data not found."
        elif "average" in q or "mean" in q:
            avg_rev = safe_avg("revenue")
            return f"Average revenue: {avg_rev:.2f}" if avg_rev is not None else "Revenue data not found."
        else:
            return f"Revenue info - total: {df['revenue'].sum() if 'revenue' in df.columns else 'N/A'}, average: {safe_avg('revenue'):.2f}."

    if "spend" in q:
        if "total" in q or "sum" in q:
            total_spend = df["spend"].sum() if "spend" in df.columns else None
            return f"Total spend: {total_spend}" if total_spend is not None else "Spend data not found."
        elif "average" in q or "mean" in q:
            avg_spend = safe_avg("spend")
            return f"Average spend: {avg_spend:.2f}" if avg_spend is not None else "Spend data not found."
        else:
            return f"Spend info - total: {df['spend'].sum() if 'spend' in df.columns else 'N/A'}, average: {safe_avg('spend'):.2f}."

    if "impressions" in q:
        if "total" in q or "sum" in q:
            total_imp = df["impressions"].sum() if "impressions" in df.columns else None
            return f"Total impressions: {total_imp}" if total_imp is not None else "Impressions data not found."
        elif "average" in q or "mean" in q:
            avg_imp = safe_avg("impressions")
            return f"Average impressions: {avg_imp:.2f}" if avg_imp is not None else "Impressions data not found."
        else:
            return f"Impressions info - total: {df['impressions'].sum() if 'impressions' in df.columns else 'N/A'}, average: {safe_avg('impressions'):.2f}."

    if "campaign" in q:
        if "list" in q or "types" in q or "different" in q or "kinds" in q:
            if "campaign" in df.columns:
                campaigns = df["campaign"].unique()
                return "Campaign types: " + ", ".join(campaigns)
            else:
                return "No campaign data found."
        if "total revenue" in q or "revenue by campaign" in q:
            if "campaign" in df.columns and "revenue" in df.columns:
                rev_by_camp = df.groupby("campaign")["revenue"].sum()
                response = "Revenue by campaign:\n"
                for camp, rev in rev_by_camp.items():
                    response += f"- {camp}: {rev}\n"
                return response.strip()
            else:
                return "Campaign or revenue data not found."

    # If no match found
    return ("Sorry, I didn't understand your question. "
            "Please ask about clicks, revenue, spend, impressions, campaigns, or averages.")
