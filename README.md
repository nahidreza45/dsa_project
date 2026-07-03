# BrainQuest: The Ultimate Knowledge Arena

🎮 **[Play the Live Game Here!](https://nahidreza45.github.io/dsa_project/)**

Welcome to **BrainQuest**, an interactive, gamified quiz platform built specifically to demonstrate the practical application of Data Structures and Algorithms (DSA) in modern web development.

This project goes beyond theoretical implementations by integrating core DSA concepts directly into the architecture, state management, and interactive mini-games of a fully functioning web application.

---

## 🚀 Features
- **Dynamic Quiz Engine**: Answer questions across varying subjects, preventing repetitions using probabilistic data structures.
- **Global Leaderboard**: View and search player scores utilizing efficient sorting and searching algorithms.
- **Pathfinder Challenge (Mini-Game)**: An interactive graph-based puzzle where players must manually find the shortest path before the game verifies it using graph algorithms.
- **Modern Glassmorphic UI**: Beautiful, highly responsive user interface with interactive animations.

---

## 🧠 Data Structures Used & Why

### 1. Graph (Adjacency List)
* **Where it's used:** The **Pathfinder Challenge** mini-game.
* **Why it's used:** A Graph is the perfect structure to represent networks like cities, routers, or map waypoints. In our mini-game, nodes represent points (A to F) and edges represent paths with given weights. An adjacency list was chosen over an adjacency matrix because our graph is relatively sparse, making it much more memory-efficient and faster to iterate over neighbors during pathfinding.

### 2. Binary Search Tree (BST)
* **Where it's used:** Storing player scores for the **Global Leaderboard**.
* **Why it's used:** A BST allows for dynamic insertion of new player scores while keeping the data relatively ordered. It provides an efficient structure for retrieving the data to be flattened and displayed on the leaderboard, ensuring we don't have to constantly allocate new contiguous memory for every single player added (unlike standard arrays).

### 3. Trie (Prefix Tree)
* **Where it's used:** The **Search Player** autocomplete feature on the Leaderboard.
* **Why it's used:** A Trie is exceptionally fast at prefix-matching (`O(M)` time complexity, where `M` is the length of the prefix). As the user types a name in the search box, the Trie instantly traverses its nodes to suggest matching player names without having to scan the entire database of players, making the UI highly responsive.

### 4. Bloom Filter
* **Where it's used:** Preventing repeated questions during the **Quiz Engine** loop.
* **Why it's used:** A Bloom Filter is a highly space-efficient probabilistic data structure. Instead of keeping a massive array or hash set of every single question ID ever asked, the Bloom Filter uses multiple hash functions to set bits in a small bit-array. It can tell us with 100% certainty if a question has *never* been asked, saving enormous amounts of memory as the question bank scales.

### 5. Hash Map (Dictionary/Map)
* **Where it's used:** The **Performance Tracking System** (tracking player weakness).
* **Why it's used:** Hash Maps provide `O(1)` average time complexity for lookups and insertions. As the player answers questions, their correct/incorrect attempts per subject category are rapidly updated and retrieved using the category name as the key.

---

## ⚙️ Algorithms Used & Why

### 1. Dijkstra's Algorithm
* **Where it's used:** Level 1 of the **Pathfinder Challenge**.
* **Why it's used:** After the player submits their manual route, the game must verify if it is truly the shortest path. Dijkstra's is the industry-standard greedy algorithm for finding the shortest path in a graph with **strictly positive edge weights**. It guarantees the absolute optimal route to grade the player against.

### 2. Bellman-Ford Algorithm
* **Where it's used:** Level 2 of the **Pathfinder Challenge** (Negative Edge scenario).
* **Why it's used:** In Level 2, a "wormhole" (negative edge weight) is introduced. Dijkstra's algorithm fails when negative weights exist because its greedy approach assumes paths only get longer. Bellman-Ford is specifically used here because it iteratively relaxes all edges `V-1` times, allowing it to correctly calculate the shortest path even when negative weights are present.

### 3. Quick Sort
* **Where it's used:** Sorting the Leaderboard for **Top Scores**.
* **Why it's used:** Quick Sort is a highly efficient divide-and-conquer algorithm with an average time complexity of `O(n log n)`. It is used to instantly sort the massive list of players from highest to lowest score. It was chosen for its excellent average-case performance and in-place sorting capabilities (low memory overhead).

### 4. Bubble Sort
* **Where it's used:** Sorting the Leaderboard for **Lowest Scores**.
* **Why it's used:** Bubble Sort `O(n^2)` is implemented here strictly for educational contrast. By having a button for Quick Sort and a button for Bubble Sort, the project demonstrates multiple sorting paradigms. While Bubble Sort is generally inefficient for large datasets, it is easy to implement and visually understandable when tracing algorithms.

### 5. Binary Search
* **Where it's used:** Finding a specific player's exact score on the Leaderboard.
* **Why it's used:** Once the leaderboard is sorted, scanning it linearly `O(n)` to find a player is inefficient. Binary Search divides the search space in half with every step, reducing the time complexity to `O(log n)`. This allows instant retrieval of player data even if the leaderboard scales to millions of users.

---

## 🛠️ Tech Stack
- **Frontend Core**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: Modern Glassmorphism UI, Flexbox layout, Custom CSS Animations
- **Graphics**: Inline SVG for dynamic graph rendering

## 📝 How to Run
1. Download or clone the repository.
2. Open `index.html` in any modern web browser (Google Chrome, Firefox, Safari).
3. No server or build process is required! The entire DSA engine runs natively in your browser's JavaScript environment.
