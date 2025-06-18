"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const rewardTypes = ["All", "Cashback", "Points"];

export default function Home() {
  const [form, setForm] = useState({
    income: "",
    creditScore: "",
    fuel: "",
    travel: "",
    groceries: "",
    dining: "",
    rewardType: "All",
  });
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setShowResults(false);
    setCards([]);
    try {
      let query = supabase
        .from("credit_cards")
        .select("*")
        .lte("min_income", Number(form.income) * 12)
        .lte("min_credit_score", Number(form.creditScore));
      if (form.rewardType !== "All") {
        query = query.filter("reward_type", "ilike", form.rewardType);
      }
      const { data, error } = await query;
      if (error) throw error;
      setCards(data || []);
      setShowResults(true);
    } catch (err: any) {
      setError(err.message || "Failed to fetch cards");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      income: "",
      creditScore: "",
      fuel: "",
      travel: "",
      groceries: "",
      dining: "",
      rewardType: "All",
    });
    setShowResults(false);
    setCards([]);
    setError("");
  };

  const calculateCashback = (card: any) => {
    const fuel = Number(form.fuel) * (Number(card.fuel_reward_rate) / 100);
    const travel =
      Number(form.travel) * (Number(card.travel_reward_rate) / 100);
    const groceries =
      Number(form.groceries) * (Number(card.groceries_reward_rate) / 100);
    const dining =
      Number(form.dining) * (Number(card.dining_reward_rate) / 100);
    const total = fuel + travel + groceries + dining;
    return {
      fuel,
      travel,
      groceries,
      dining,
      total,
      yearly: total * 12,
    };
  };

  const debugFetchAll = async () => {
    const { data, error } = await supabase.from("credit_cards").select("*");
    if (error) {
      alert("Error: " + error.message);
    } else {
      alert(JSON.stringify(data, null, 2));
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8 bg-white rounded-lg shadow p-6 md:p-10 items-start">
        {/* Form Section */}
        <div className="w-full md:w-7/12 border-r border-gray-200 pr-0 md:pr-8 flex flex-col justify-start md:sticky md:top-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h1 className="text-3xl font-bold mb-6 text-center md:text-left text-blue-700">
              Credit Card Recommender
            </h1>
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Monthly Income (₹)
              </label>
              <input
                type="number"
                name="income"
                value={form.income}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-blue-900"
                min="0"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Credit Score
              </label>
              <input
                type="number"
                name="creditScore"
                value={form.creditScore}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-blue-900"
                min="0"
                max="900"
              />
            </div>
            {/* Cashback Categories in 2x2 grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Monthly Fuel Spend (₹)
                </label>
                <input
                  type="number"
                  name="fuel"
                  value={form.fuel}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-blue-900"
                  min="0"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Monthly Travel Spend (₹)
                </label>
                <input
                  type="number"
                  name="travel"
                  value={form.travel}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-blue-900"
                  min="0"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Monthly Groceries Spend (₹)
                </label>
                <input
                  type="number"
                  name="groceries"
                  value={form.groceries}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-blue-900"
                  min="0"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Monthly Dining Spend (₹)
                </label>
                <input
                  type="number"
                  name="dining"
                  value={form.dining}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-blue-900"
                  min="0"
                />
              </div>
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Preferred Reward Type
              </label>
              <select
                name="rewardType"
                value={form.rewardType}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-blue-900">
                {rewardTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
              {loading ? "Loading..." : "Get Recommendations"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="w-full mt-2 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 transition">
              Reset
            </button>
          </form>
        </div>
        {/* Recommendations Section */}
        <div className="w-full md:w-5/12 flex flex-col">
          <h2 className="text-2xl font-bold mb-4 text-center md:text-left text-green-700">
            Recommended Cards
          </h2>
          {showResults ? (
            cards.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                No cards found matching your criteria.
              </div>
            ) : (
              <div className="space-y-6">
                {cards.slice(0, 5).map((card) => {
                  const cashback = calculateCashback(card);
                  return (
                    <div
                      key={card.id}
                      className="border rounded-lg bg-white shadow-sm hover:shadow-md transition flex flex-col overflow-hidden w-full max-w-2xl mx-auto md:max-w-full">
                      {/* Card Image at Top */}
                      <div
                        className="w-full h-36 bg-gray-100 flex items-center justify-center overflow-hidden"
                        style={{ height: "180px" }}>
                        <img
                          src={card.image_url}
                          alt={card.name}
                          className="object-contain h-full w-full"
                        />
                      </div>
                      {/* Card Content */}
                      <div className="flex-1 flex flex-col p-4">
                        <div className="font-bold text-lg text-blue-800 mb-1">
                          {card.name}
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          {card.issuer}
                        </div>
                        <div className="flex flex-wrap gap-4 mb-3">
                          <div className="bg-blue-50 border border-blue-200 rounded px-3 py-1 text-xs text-blue-900 font-semibold">
                            Monthly Rewards: ₹{cashback.total.toFixed(2)}
                          </div>
                          <div className="bg-green-50 border border-green-200 rounded px-3 py-1 text-xs text-green-900 font-semibold">
                            Annual Rewards: ₹{cashback.yearly.toFixed(2)}
                          </div>
                          <div className="bg-yellow-50 border border-yellow-200 rounded px-3 py-1 text-xs text-yellow-900 font-semibold">
                            Annual Fee: ₹{card.annual_fee}
                          </div>
                        </div>
                      
                        <div className="mb-3">
                          <div className="font-semibold text-green-700 mb-1">
                            Perks
                          </div>
                          <ul className="list-disc ml-5 text-xs text-gray-700">
                            {card.special_perks?.map(
                              (perk: string, idx: number) => (
                                <li key={idx}>{perk}</li>
                              )
                            )}
                          </ul>
                        </div>
                        <div className="mb-3">
                          <div className="font-semibold text-gray-700 mb-1">
                            Why this card?
                          </div>
                          <ul className = "text-black list-disc ml-5 space-y-1 text-xs">
                            <li>
                              You satisfy the income criteria of{" "}
                              <span className="font-bold">
                                ₹{card.min_income.toLocaleString()}
                              </span>{" "}
                              (your monthly: ₹
                              {Number(form.income).toLocaleString()} × 12 = ₹
                              {(Number(form.income) * 12).toLocaleString()})
                            </li>
                            <li>
                              You satisfy the credit score criteria of{" "}
                              <span className="font-bold">
                                {card.min_credit_score ?? "N/A"}
                              </span>{" "}
                              (your score: {form.creditScore})
                            </li>
                          </ul>
                        </div>
                        <div className="mt-auto pt-2">
                          <a
                            href={card.apply_link}
                            className="block w-full text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-semibold"
                            target="_blank"
                            rel="noopener noreferrer">
                            Apply Now
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            <div className="text-center text-gray-400 mt-8">
              Fill the form and get your best card recommendations!
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
