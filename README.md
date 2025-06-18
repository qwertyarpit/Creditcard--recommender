# Credit Card Recommender

A web-based,credit card recommendation system that helps users to find the best-fit Indian credit cards based on their preferences.

---

##  Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/qwertyarpit/Creditcard--recommender.git
   cd credit-card-recommender
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Supabase**

   - Create a `.env.local` file in the root of the project with your Supabase credentials:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

   The app will be live at [http://localhost:3000](http://localhost:3000)

5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

---

##  Agent Flow & Prompt Design

### Agent Flow (Form-based)

1. **User fills out a form** with the following fields:
   - Monthly income
   - Credit score
   - Monthly spend on: fuel, travel, groceries, dining
   - Preferred reward type (Cashback or Points)
2. **On submit:**
   - The app queries the Supabase database for cards
   
      - For each eligible card, the app calculates:
     - Monthly and yearly cashback 
   - The top 5 cards are displayed 
  
3. **User can reset the form** to get new recommendations.




##  Tech Stack

- Next.js (App Router, TypeScript)
- Tailwind CSS
- Supabase (Postgres DB)

---

 📄 License

MIT
