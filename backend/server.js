const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());

const generateRandomData = () => {
    const randomNames = ["Olivia", "Liam", "Aria", "Noah", "Aditi", "Aarav", "Sofia", "Ethan", "Priya", "Kabir",
  "Emily", "Lucas", "Mia", "Isaac", "Rhea", "Vihaan", "Isabella", "Caleb", "Zara", "Dhruv",
  "Chloe", "Benjamin", "Saanvi", "Nathan", "Aryan", "Emma", "Jackson", "Leah", "Aarushi", "Elijah",
  "Lily", "Ayaan", "Ava", "Mason", "Kiran", "Sophia", "Logan", "Anaya", "Muhammad", "Gabriella",
  "Aarav", "Aaron", "Scarlett", "Dylan", "Sanjay", "Maya", "Oliver", "Tara", "Ethan", "Siddharth",
  "Ryan", "Nisha", "Victoria", "Harsha", "Amelia", "Aditya", "Penelope", "Rajan", "Hannah", "Arya",
  "Grace", "Zayan", "Harper", "Reyansh", "Charlotte", "Akshay", "Ellie", "Sahil", "Abigail", "Arnav",
  "Eleanor", "Ishan", "Mila", "Surya", "Eliana", "Aryav", "Nora", "Parth", "Hazel", "Vivaan",
  "Paisley", "Anirudh", "Stella", "Devesh", "Layla", "Rohan", "Lila", "Pranav", "Violet", "Nikhil",
  "Madison", "Aman", "Bella", "Kunal", "Iris", "Shaurya", "Freya", "Harsh", "Chloe", "Ameya",
  "Samara", "Jayant", "Evelyn", "Ritesh", "Piper", "Harini", "Aurora", "Nithin", "Lily", "Omkar",
  "Alina", "Shlok", "Sadie", "Vishal", "Clara", "Mihir", "Ruby", "Rajiv", "Daisy", "Aarush",
  "Poppy", "Keshav", "Juniper", "Adarsh", "Willow", "Bhavya", "Skylar", "Yash", "Ivy", "Krish",
  "Bella", "Samarth", "Flora", "Dhyan", "Brynn", "Aniket", "Evie", "Arhaan", "Lucia", "Harith",
  "Amara", "Kartik", "Harper", "Ayan", "Olivia", "Eshan", "Hannah", "Neil", "Zoey", "Om",
  "Clara", "Aadarsh", "Mia", "Rahul", "Isla", "Karthik", "Emma", "Devan", "Ivy", "Sahas",
  "Dahlia", "Advik", "Alice", "Sanket", "Sophie", "Vishnu", "Ellie", "Rajat", "Grace", "Soham",
  "Chloe", "Dheeraj", "Freya", "Manish", "Hazel", "Chirag", "Talia", "Arjun", "Clara", "Harshit",
  "Maisie", "Ishaan", "Layla", "Vedant", "Lilly", "Aryaman", "Flora", "Neel", "Brooklyn", "Rishi",
  "Harper", "Tejas", "Callie", "Tanmay", "Penelope", "Ravi", "Amara", "Akash", "Savannah", "Vihaan"];

  const data = [];
  for(let i=0; i < 10000; i++) {
    data.push({
        id: i + 1,
        name: randomNames[Math.floor(Math.random() * randomNames.length)],
        age: Math.floor(Math.random() * 85) + 1,
        rank: Math.floor(Math.random() * 500) + 1,
        // present: Math.random() < 0.5,
        // address: "south mada street koyambedu",
        percentage: parseFloat((Math.random() * 100).toFixed(2))
    });
  }
  return data;
}

app.get("/data", (req, res) => {
    const data = generateRandomData();
    res.json(data);
})

app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`)
})