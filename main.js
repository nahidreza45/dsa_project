// ==========================================
// DATA STRUCTURES
// ==========================================

// 1. STACK (For Undo/History Feature)
class Stack {
    constructor() { this.items = []; }
    push(element) { this.items.push(element); }
    pop() { return this.isEmpty() ? null : this.items.pop(); }
    isEmpty() { return this.items.length === 0; }
    size() { return this.items.length; }
    clear() { this.items = []; }
}

// 2. PRIORITY QUEUE (Min/Max Heap based on Score)
class PriorityQueue {
    constructor(comparator = (a, b) => a > b) {
        this.heap = [];
        this.comparator = comparator;
    }
    size() { return this.heap.length; }
    isEmpty() { return this.size() === 0; }
    clear() { this.heap = []; }
    
    parent(i) { return Math.floor((i - 1) / 2); }
    leftChild(i) { return 2 * i + 1; }
    rightChild(i) { return 2 * i + 2; }
    
    swap(i, j) {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }
    
    enqueue(item) {
        this.heap.push(item);
        this.heapifyUp(this.heap.length - 1);
    }
    
    dequeue() {
        if (this.isEmpty()) return null;
        if (this.size() === 1) return this.heap.pop();
        
        let root = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.heapifyDown(0);
        return root;
    }
    
    heapifyUp(i) {
        while (i > 0 && this.comparator(this.heap[i], this.heap[this.parent(i)])) {
            this.swap(i, this.parent(i));
            i = this.parent(i);
        }
    }
    
    heapifyDown(i) {
        let maxIndex = i;
        let left = this.leftChild(i);
        let right = this.rightChild(i);
        
        if (left < this.size() && this.comparator(this.heap[left], this.heap[maxIndex])) {
            maxIndex = left;
        }
        if (right < this.size() && this.comparator(this.heap[right], this.heap[maxIndex])) {
            maxIndex = right;
        }
        if (i !== maxIndex) {
            this.swap(i, maxIndex);
            this.heapifyDown(maxIndex);
        }
    }
}

// 3. BINARY SEARCH TREE (For storing high scores)
class BSTNode {
    constructor(player, score) {
        this.player = player;
        this.score = score;
        this.left = null;
        this.right = null;
    }
}
class BST {
    constructor() { this.root = null; }
    insert(player, score) {
        const newNode = new BSTNode(player, score);
        if (this.root === null) this.root = newNode;
        else this.insertNode(this.root, newNode);
    }
    insertNode(node, newNode) {
        if (newNode.score < node.score) {
            if (node.left === null) node.left = newNode;
            else this.insertNode(node.left, newNode);
        } else {
            if (node.right === null) node.right = newNode;
            else this.insertNode(node.right, newNode);
        }
    }
    toArray() {
        let result = [];
        this.inOrderTraverse(this.root, result);
        return result.reverse();
    }
    inOrderTraverse(node, result) {
        if (node !== null) {
            this.inOrderTraverse(node.left, result);
            result.push({ player: node.player, score: node.score });
            this.inOrderTraverse(node.right, result);
        }
    }
}

// 4. GRAPH (For City Tour)
class Graph {
    constructor() {
        this.vertices = [];
        this.adjacencyList = new Map();
        this.edges = [];
    }
    addVertex(v) {
        this.vertices.push(v);
        this.adjacencyList.set(v, []);
    }
    addEdge(v, w, weight) {
        this.adjacencyList.get(v).push({ node: w, weight: weight });
        this.edges.push({ u: v, v: w, weight: weight });
    }
}

// 5. HASH TABLE (Categorized Question Database)
class HashTable {
    constructor(size = 50) {
        this.buckets = new Array(size);
        this.size = size;
    }
    hash(key) {
        let hashValue = 0;
        for (let i = 0; i < key.length; i++) {
            hashValue = (hashValue + key.charCodeAt(i) * 23) % this.size;
        }
        return hashValue;
    }
    set(key, value) {
        let index = this.hash(key);
        if (!this.buckets[index]) {
            this.buckets[index] = [];
        }
        // If category exists, append
        let bucket = this.buckets[index];
        let found = bucket.find(item => item[0] === key);
        if (found) {
            found[1].push(...value);
        } else {
            bucket.push([key, value]);
        }
    }
    get(key) {
        let index = this.hash(key);
        let bucket = this.buckets[index];
        if (bucket) {
            let found = bucket.find(item => item[0] === key);
            if (found) return found[1];
        }
        return [];
    }
}

// 6. TRIE (Prefix Tree for Autocomplete)
class TrieNode {
    constructor() {
        this.children = {};
        this.isEndOfWord = false;
    }
}
class Trie {
    constructor() {
        this.root = new TrieNode();
    }
    insert(word) {
        let current = this.root;
        for (let i = 0; i < word.length; i++) {
            let char = word[i].toLowerCase();
            if (!current.children[char]) {
                current.children[char] = new TrieNode();
            }
            current = current.children[char];
        }
        current.isEndOfWord = true;
    }
    searchPrefix(prefix) {
        let current = this.root;
        for (let i = 0; i < prefix.length; i++) {
            let char = prefix[i].toLowerCase();
            if (!current.children[char]) return [];
            current = current.children[char];
        }
        let words = [];
        this.findWords(current, prefix.toLowerCase(), words);
        return words;
    }
    findWords(node, currentWord, words) {
        if (node.isEndOfWord) words.push(currentWord);
        for (let char in node.children) {
            this.findWords(node.children[char], currentWord + char, words);
        }
    }
}

// 7. BLOOM FILTER (Probabilistic Data Structure to prevent repeated questions)
class BloomFilter {
    constructor(size = 1000) {
        this.size = size;
        this.bitArray = new Array(this.size).fill(false);
    }
    hash1(string) {
        let hash = 0;
        for (let i = 0; i < string.length; i++) hash = (hash + string.charCodeAt(i) * 31) % this.size;
        return hash;
    }
    hash2(string) {
        let hash = 0;
        for (let i = 0; i < string.length; i++) hash = (hash + string.charCodeAt(i) * 17) % this.size;
        return hash;
    }
    add(string) {
        this.bitArray[this.hash1(string)] = true;
        this.bitArray[this.hash2(string)] = true;
    }
    mightContain(string) {
        return this.bitArray[this.hash1(string)] && this.bitArray[this.hash2(string)];
    }
}

// 8. HASH MAP (For Performance/Weakness Tracking)
class PerformanceTracker {
    constructor() {
        this.stats = new Map();
    }
    record(subTopic, isCorrect) {
        if (!this.stats.has(subTopic)) {
            this.stats.set(subTopic, { attempts: 0, correct: 0 });
        }
        let data = this.stats.get(subTopic);
        data.attempts += 1;
        if (isCorrect) data.correct += 1;
    }
    getWeakPoints() {
        let weak = [];
        this.stats.forEach((data, topic) => {
            if (data.attempts > 0) {
                let accuracy = data.correct / data.attempts;
                if (accuracy < 0.5) weak.push(topic);
            }
        });
        return weak;
    }
}

// ==========================================
// ALGORITHMS
// ==========================================

function quickSort(arr, key = 'score', descending = true) {
    if (arr.length <= 1) return arr;
    let pivot = arr[arr.length - 1];
    let left = [];
    let right = [];
    for (let i = 0; i < arr.length - 1; i++) {
        let compare = arr[i][key] < pivot[key];
        if (descending) compare = arr[i][key] > pivot[key];
        
        if (compare) left.push(arr[i]);
        else right.push(arr[i]);
    }
    return [...quickSort(left, key, descending), pivot, ...quickSort(right, key, descending)];
}

function bubbleSort(arr, key = 'score', descending = true) {
    let n = arr.length;
    let swapped;
    let result = [...arr];
    do {
        swapped = false;
        for (let i = 0; i < n - 1; i++) {
            let condition = result[i][key] < result[i + 1][key];
            if (!descending) condition = result[i][key] > result[i + 1][key];
            
            if (condition) {
                let temp = result[i];
                result[i] = result[i + 1];
                result[i + 1] = temp;
                swapped = true;
            }
        }
        n--;
    } while (swapped);
    return result;
}

function binarySearch(arr, targetName) {
    let sortedArr = quickSort(arr, 'player', false); 
    let left = 0;
    let right = sortedArr.length - 1;
    targetName = targetName.toLowerCase();
    
    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        let midName = sortedArr[mid].player.toLowerCase();
        
        if (midName === targetName) return [sortedArr[mid]];
        if (midName < targetName) left = mid + 1;
        else right = mid - 1;
    }
    return arr.filter(item => item.player.toLowerCase().includes(targetName));
}

function dijkstra(graph, startNode) {
    let distances = {};
    let prev = {};
    let pq = []; 
    
    graph.vertices.forEach(v => {
        distances[v] = Infinity;
        prev[v] = null;
    });
    distances[startNode] = 0;
    pq.push({ node: startNode, dist: 0 });
    
    while (pq.length > 0) {
        pq.sort((a, b) => a.dist - b.dist);
        let current = pq.shift().node;
        
        let neighbors = graph.adjacencyList.get(current);
        neighbors.forEach(neighbor => {
            let alt = distances[current] + neighbor.weight;
            if (alt < distances[neighbor.node]) {
                distances[neighbor.node] = alt;
                prev[neighbor.node] = current;
                pq.push({ node: neighbor.node, dist: alt });
            }
        });
    }
    return { distances, prev };
}

function bellmanFord(graph, startNode) {
    let distances = {};
    let prev = {};
    
    graph.vertices.forEach(v => {
        distances[v] = Infinity;
        prev[v] = null;
    });
    distances[startNode] = 0;
    
    for (let i = 0; i < graph.vertices.length - 1; i++) {
        graph.edges.forEach(edge => {
            if (distances[edge.u] + edge.weight < distances[edge.v]) {
                distances[edge.v] = distances[edge.u] + edge.weight;
                prev[edge.v] = edge.u;
            }
        });
    }
    
    let hasNegativeCycle = false;
    graph.edges.forEach(edge => {
        if (distances[edge.u] + edge.weight < distances[edge.v]) {
            hasNegativeCycle = true;
        }
    });
    
    return { distances, prev, hasNegativeCycle };
}


// ==========================================
// GAME DATA & STATE
// ==========================================

const questionDB = new HashTable();

// Huge Base of Bangladesh GK Questions with Difficulty (1 to 10)
questionDB.set("GK", [
    { diff: 1, q: "What is the capital of Bangladesh?", options: ["Dhaka", "Sylhet", "Chittagong", "Rajshahi"], a: "Dhaka" },
    { diff: 1, q: "What is the national flower of Bangladesh?", options: ["Rose", "Water Lily", "Sunflower", "Tulip"], a: "Water Lily" },
    { diff: 1, q: "What is the national fruit of Bangladesh?", options: ["Mango", "Jackfruit", "Banana", "Pineapple"], a: "Jackfruit" },
    { diff: 1, q: "What is the national fish of Bangladesh?", options: ["Hilsa", "Rui", "Katla", "Pangas"], a: "Hilsa" },
    { diff: 1, q: "Which continent is Bangladesh located in?", options: ["Asia", "Europe", "Africa", "South America"], a: "Asia" },
    
    { diff: 2, q: "Which river is the longest in Bangladesh?", options: ["Padma", "Meghna", "Jamuna", "Surma"], a: "Surma" },
    { diff: 2, q: "What is the national animal of Bangladesh?", options: ["Royal Bengal Tiger", "Elephant", "Deer", "Leopard"], a: "Royal Bengal Tiger" },
    { diff: 2, q: "What is the national bird of Bangladesh?", options: ["Magpie Robin (Doyel)", "Crow", "Parrot", "Pigeon"], a: "Magpie Robin (Doyel)" },
    { diff: 2, q: "How many seasons are there in Bangladesh?", options: ["Four", "Five", "Six", "Three"], a: "Six" },
    { diff: 2, q: "What is the primary religion in Bangladesh?", options: ["Islam", "Hinduism", "Buddhism", "Christianity"], a: "Islam" },

    { diff: 3, q: "When did Bangladesh become independent?", options: ["1971", "1952", "1947", "1969"], a: "1971" },
    { diff: 3, q: "Which division is known for tea gardens?", options: ["Dhaka", "Sylhet", "Khulna", "Barisal"], a: "Sylhet" },
    { diff: 3, q: "What is the international calling code for Bangladesh?", options: ["+91", "+880", "+92", "+94"], a: "+880" },
    { diff: 3, q: "What colors are on the flag of Bangladesh?", options: ["Green and Red", "Red and White", "Green and White", "Blue and Red"], a: "Green and Red" },
    { diff: 3, q: "Which month is the Independence Day of Bangladesh?", options: ["March", "December", "February", "August"], a: "March" },

    { diff: 4, q: "Who is the national poet of Bangladesh?", options: ["Kazi Nazrul Islam", "Rabindranath Tagore", "Jasimuddin", "Lalon Shah"], a: "Kazi Nazrul Islam" },
    { diff: 4, q: "Which mangrove forest is the largest in the world?", options: ["Sundarbans", "Amazon", "Congo", "Daintree"], a: "Sundarbans" },
    { diff: 4, q: "Who is the founder of Bangladesh?", options: ["Sheikh Mujibur Rahman", "Ziaur Rahman", "A. K. Fazlul Huq", "Maulana Bhashani"], a: "Sheikh Mujibur Rahman" },
    { diff: 4, q: "What is the official language of Bangladesh?", options: ["Bengali", "English", "Urdu", "Hindi"], a: "Bengali" },
    { diff: 4, q: "Which river divides Dhaka and Keraniganj?", options: ["Buriganga", "Turag", "Balu", "Shitalakshya"], a: "Buriganga" },

    { diff: 5, q: "What is the highest peak in Bangladesh?", options: ["Keokradong", "Saka Haphong", "Tajingdong", "Chimbuk"], a: "Saka Haphong" },
    { diff: 5, q: "Who was the first President of Bangladesh?", options: ["Sheikh Mujibur Rahman", "Ziaur Rahman", "Syed Nazrul Islam", "Tajuddin Ahmad"], a: "Sheikh Mujibur Rahman" },
    { diff: 5, q: "What is the major export product of Bangladesh?", options: ["RMG (Garments)", "Jute", "Tea", "Leather"], a: "RMG (Garments)" },
    { diff: 5, q: "Which sector contributes most to Bangladesh GDP?", options: ["Agriculture", "Services", "Industry", "Remittance"], a: "Services" },
    { diff: 5, q: "Who designed the national flag of Bangladesh?", options: ["Quamrul Hassan", "Shilpacharya Zainul Abedin", "Hamidur Rahman", "Nitun Kundu"], a: "Quamrul Hassan" },

    { diff: 6, q: "In which year did the Language Movement take place?", options: ["1952", "1971", "1947", "1969"], a: "1952" },
    { diff: 6, q: "Which is the largest division of Bangladesh by area?", options: ["Chittagong", "Dhaka", "Rajshahi", "Khulna"], a: "Chittagong" },
    { diff: 6, q: "What is the name of the national parliament of Bangladesh?", options: ["Jatiya Sangsad", "Lok Sabha", "Majlis", "Senate"], a: "Jatiya Sangsad" },
    { diff: 6, q: "Who was the first Prime Minister of Bangladesh?", options: ["Tajuddin Ahmad", "Sheikh Mujibur Rahman", "Captain Mansur Ali", "Khondaker Mostaq Ahmad"], a: "Tajuddin Ahmad" },
    { diff: 6, q: "Which country recognized Bangladesh first?", options: ["Bhutan", "India", "Soviet Union", "USA"], a: "Bhutan" },

    { diff: 7, q: "What is the currency of Bangladesh?", options: ["Taka", "Rupee", "Rupiah", "Dinar"], a: "Taka" },
    { diff: 7, q: "Who composed the national anthem of Bangladesh?", options: ["Rabindranath Tagore", "Kazi Nazrul Islam", "Lalon Fakir", "Jibanananda Das"], a: "Rabindranath Tagore" },
    { diff: 7, q: "Who designed the Jatiya Sangsad Bhaban?", options: ["Louis I. Kahn", "Muzharul Islam", "F.R. Khan", "Tadao Ando"], a: "Louis I. Kahn" },
    { diff: 7, q: "Which river is known as the 'Sorrow of Bengal'?", options: ["Teesta", "Brahmaputra", "Padma", "Karnaphuli"], a: "Teesta" },
    { diff: 7, q: "In which district is the Somapura Mahavihara located?", options: ["Naogaon", "Bogra", "Comilla", "Rajshahi"], a: "Naogaon" },

    { diff: 8, q: "How many districts are there in Bangladesh?", options: ["64", "68", "72", "58"], a: "64" },
    { diff: 8, q: "Which beach in Bangladesh is the longest natural sea beach?", options: ["Cox's Bazar", "Kuakata", "Patenga", "Inani"], a: "Cox's Bazar" },
    { diff: 8, q: "What was the previous name of Bangladesh before 1971?", options: ["East Pakistan", "Bengal", "East Bengal", "Vanga"], a: "East Pakistan" },
    { diff: 8, q: "Who was the commander-in-chief of the Mukti Bahini?", options: ["M. A. G. Osmani", "Ziaur Rahman", "Khaled Mosharraf", "K. M. Shafiullah"], a: "M. A. G. Osmani" },
    { diff: 8, q: "Which is the smallest district of Bangladesh?", options: ["Narayanganj", "Meherpur", "Feni", "Munshiganj"], a: "Narayanganj" },

    { diff: 9, q: "What is the main seaport of Bangladesh?", options: ["Chittagong Port", "Mongla Port", "Payra Port", "Matarbari Port"], a: "Chittagong Port" },
    { diff: 9, q: "Which Bangladeshi received the Nobel Peace Prize?", options: ["Dr. Muhammad Yunus", "Fazle Hasan Abed", "Sheikh Hasina", "Dr. Kamal Hossain"], a: "Dr. Muhammad Yunus" },
    { diff: 9, q: "What was the code name for the Pakistani military operation on 25 March 1971?", options: ["Operation Searchlight", "Operation Gibraltar", "Operation Chengiz Khan", "Operation Barisal"], a: "Operation Searchlight" },
    { diff: 9, q: "How many sectors was Bangladesh divided into during the Liberation War?", options: ["11", "9", "7", "14"], a: "11" },
    { diff: 9, q: "Where is the Bangladesh Navy headquarters located?", options: ["Dhaka", "Chittagong", "Khulna", "Patuakhali"], a: "Dhaka" },

    { diff: 10, q: "When did Bangladesh become a member of the UN?", options: ["1974", "1972", "1971", "1975"], a: "1974" },
    { diff: 10, q: "Which article of the constitution declares the state language?", options: ["Article 3", "Article 8", "Article 12", "Article 5"], a: "Article 3" },
    { diff: 10, q: "Which Bir Sreshtho died first in the Liberation War?", options: ["Munshi Abdur Rouf", "Mostafa Kamal", "Nur Mohammad Sheikh", "Matiur Rahman"], a: "Mostafa Kamal" },
    { diff: 10, q: "How many members are there in the Jatiya Sangsad including reserved seats?", options: ["350", "300", "345", "330"], a: "350" },
    { diff: 10, q: "Who was the first female Vice Chancellor of a public university in Bangladesh?", options: ["Farzana Islam", "Shirin Sharmin Chaudhury", "Nishat Mazumder", "Begum Rokeya"], a: "Farzana Islam" },
    { diff: 10, q: "Which UNESCO World Heritage site is located in Bagerhat?", options: ["Sixty Dome Mosque", "Somapura Mahavihara", "Sundarbans", "Lalbagh Fort"], a: "Sixty Dome Mosque" }
]);

questionDB.get("GK").forEach(q => q.subTopic = "Bangladesh History & Geo");

// HSC Physics
questionDB.set("Physics", [
    { diff: 4, q: "Which of the following is a scalar quantity?", options: ["Work", "Velocity", "Force", "Displacement"], a: "Work", subTopic: "Vectors" },
    { diff: 5, q: "The cross product of two parallel vectors is:", options: ["Zero vector", "Unit vector", "One", "Infinity"], a: "Zero vector", subTopic: "Vectors" },
    { diff: 6, q: "Newton's second law of motion gives the measure of:", options: ["Force", "Momentum", "Acceleration", "Inertia"], a: "Force", subTopic: "Newtonian Mechanics" },
    { diff: 7, q: "What is the escape velocity from Earth?", options: ["11.2 km/s", "9.8 m/s", "3.0 x 10^8 m/s", "11.2 m/s"], a: "11.2 km/s", subTopic: "Gravitation" },
    { diff: 8, q: "In an adiabatic process, which of the following is constant?", options: ["Heat (Q)", "Temperature (T)", "Volume (V)", "Pressure (P)"], a: "Heat (Q)", subTopic: "Thermodynamics" },
    { diff: 9, q: "Which thermodynamic law defines temperature?", options: ["Zeroth Law", "First Law", "Second Law", "Third Law"], a: "Zeroth Law", subTopic: "Thermodynamics" },
    { diff: 7, q: "The SI unit of magnetic flux is:", options: ["Weber", "Tesla", "Henry", "Farad"], a: "Weber", subTopic: "Electromagnetism" },
    { diff: 8, q: "Lenz's law is a consequence of the law of conservation of:", options: ["Energy", "Charge", "Momentum", "Mass"], a: "Energy", subTopic: "Electromagnetism" },
    { diff: 9, q: "In a p-n junction diode, the depletion layer is created by:", options: ["Diffusion", "Drift", "Ionization", "Recombination"], a: "Diffusion", subTopic: "Semiconductors" },
    { diff: 10, q: "According to Bohr's model, angular momentum of an electron is quantized as:", options: ["nh/2π", "nh/π", "nπ/h", "2π/nh"], a: "nh/2π", subTopic: "Modern Physics" }
]);

// HSC Chemistry
questionDB.set("Chemistry", [
    { diff: 4, q: "What is the oxidation number of O in H2O2?", options: ["-1", "-2", "+1", "+2"], a: "-1", subTopic: "Quantitative Chemistry" },
    { diff: 5, q: "Which rule states that electrons fill orbitals of lowest energy first?", options: ["Aufbau Principle", "Hund's Rule", "Pauli Exclusion Principle", "Bohr's Postulate"], a: "Aufbau Principle", subTopic: "Atomic Structure" },
    { diff: 6, q: "Which bond is found in an N2 molecule?", options: ["Triple bond", "Double bond", "Single bond", "Ionic bond"], a: "Triple bond", subTopic: "Chemical Bonding" },
    { diff: 7, q: "What is the shape of a water (H2O) molecule?", options: ["V-shaped (Bent)", "Linear", "Tetrahedral", "Trigonal Planar"], a: "V-shaped (Bent)", subTopic: "Chemical Bonding" },
    { diff: 8, q: "In the Haber process for ammonia, the catalyst used is:", options: ["Iron (Fe)", "Vanadium(V) oxide", "Platinum (Pt)", "Nickel (Ni)"], a: "Iron (Fe)", subTopic: "Chemical Kinetics" },
    { diff: 8, q: "Which gas law states that V is proportional to T at constant P?", options: ["Charles's Law", "Boyle's Law", "Avogadro's Law", "Dalton's Law"], a: "Charles's Law", subTopic: "Environmental Chemistry" },
    { diff: 9, q: "What is the general formula for Alkanes?", options: ["CnH2n+2", "CnH2n", "CnH2n-2", "CnH2n+1"], a: "CnH2n+2", subTopic: "Organic Chemistry" },
    { diff: 9, q: "Which reaction converts Benzene to Nitrobenzene?", options: ["Electrophilic Substitution", "Nucleophilic Addition", "Elimination", "Free Radical Substitution"], a: "Electrophilic Substitution", subTopic: "Organic Chemistry" },
    { diff: 10, q: "Which reagent is used in Tollen's test for aldehydes?", options: ["Ammoniacal Silver Nitrate", "Copper(II) Sulfate", "Potassium Dichromate", "Bromine Water"], a: "Ammoniacal Silver Nitrate", subTopic: "Organic Chemistry" },
    { diff: 10, q: "The pH of a 0.01M HCl solution is:", options: ["2", "1", "3", "12"], a: "2", subTopic: "Acid-Base Equilibria" }
]);

function generateMathQuestion(difficultyLevel) {
    // Difficulty from 1 to 10
    let ops = ['+', '-'];
    if (difficultyLevel > 3) ops.push('*');
    if (difficultyLevel > 7) ops.push('/');
    
    let op = ops[Math.floor(Math.random() * ops.length)];
    let maxNum = difficultyLevel * 10;
    
    let n1 = Math.floor(Math.random() * maxNum) + 1;
    let n2 = Math.floor(Math.random() * maxNum) + 1;
    
    if (op === '-' && n1 < n2) { let temp = n1; n1 = n2; n2 = temp; }
    if (op === '/') { n1 = n1 * n2; } // Ensure clean division
    
    let q = `${n1} ${op} ${n2}`;
    let a = eval(q);
    
    let options = new Set();
    options.add(a);
    while(options.size < 4) {
        let diff = Math.floor(Math.random() * (difficultyLevel * 2)) - difficultyLevel;
        if(diff !== 0 && a+diff >= 0) options.add(a + diff);
        else options.add(a + Math.floor(Math.random() * 10) + 1);
    }
    
    let optArray = Array.from(options).map(String).sort(() => Math.random() - 0.5);
    return { diff: difficultyLevel, q: q + " = ?", options: optArray, a: a.toString(), subTopic: "Arithmetic" };
}

let scoreBST = new BST();
let nameTrie = new Trie();

// Seed dummy data and update Trie
const initialScores = [
    {name: "Nahid", s: 500}, {name: "Sumaiya", s: 450}, 
    {name: "Ayon", s: 400}, {name: "Shakib", s: 380},
    {name: "Mehedi", s: 330}, {name: "Rafiq", s: 310},
    {name: "Anika", s: 300}, {name: "Arif", s: 290},
    {name: "Mim", s: 275}, {name: "Tamim", s: 260},
    {name: "Nusrat", s: 220}, {name: "Rifat", s: 210},
    {name: "Farhan", s: 205}, {name: "Jamil", s: 190},
    {name: "Shafiq", s: 175}, {name: "Nabil", s: 150},
    {name: "Mitu", s: 140}, {name: "Sajid", s: 135},
    {name: "Karim", s: 120}, {name: "Arafat", s: 115},
    {name: "Fahim", s: 110}, {name: "Nafisa", s: 95},
    {name: "Zerin", s: 90}, {name: "Tahsan", s: 85},
    {name: "Sadia", s: 80}, {name: "Tariq", s: 60},
    {name: "Riya", s: 50}, {name: "Rahim", s: 45},
    {name: "Hasan", s: 20}, {name: "Mahmud", s: 10}
];
initialScores.forEach(i => {
    scoreBST.insert(i.name, i.s);
    nameTrie.insert(i.name);
});

// Dynamic Priority Queue (Heap) based on Score
let questionPQ = null;
let seenQuestionsFilter = new BloomFilter(); // Tracks asked questions
let performanceTracker = new PerformanceTracker(); // Tracks weak points
let historyStack = new Stack();
let score = 0;
let time = 30;
let timerInterval;
let currentQuestion = null;
let gameMode = 'quick';
let isWormholeUnlocked = false;
let activeCategories = ['Math', 'GK', 'Physics', 'Chemistry'];

let pfGraph = new Graph();
let pfNodes = [];
let pfLevel = 1; // 1 = Dijkstra, 2 = Bellman-Ford
let pfPlayerPath = [];
let pfStartNode = '';
let pfTargetNode = '';

// ==========================================
// UI AND LOGIC
// ==========================================

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active-screen'));
    document.getElementById(id).classList.add('active-screen');
}

function goHome() {
    clearInterval(timerInterval);
    showScreen('main-menu');
}

function openCategorySelect() {
    document.getElementById('category-modal').classList.add('active');
}

function closeCategorySelect() {
    document.getElementById('category-modal').classList.remove('active');
}

function startQuickPlayWithCategories() {
    let checkboxes = document.querySelectorAll('.subject-checkbox');
    activeCategories = [];
    checkboxes.forEach(cb => {
        if(cb.checked) activeCategories.push(cb.value);
    });
    
    if (activeCategories.length === 0) {
        alert("Please select at least one subject!");
        return;
    }
    
    closeCategorySelect();
    startGame('quick');
}

function openLeaderboard() {
    showScreen('leaderboard-screen');
    sortLeaderboard('quick');
}

function openPathfinder() {
    showScreen('pathfinder-screen');
    generateGraphLevel(1);
}

// Trie Autocomplete logic
function handleSearchInput() {
    let input = document.getElementById('search-input').value;
    let list = document.getElementById('autocomplete-list');
    list.innerHTML = '';
    
    if (input.length > 0) {
        let suggestions = nameTrie.searchPrefix(input);
        suggestions.forEach(s => {
            let div = document.createElement('div');
            // capitalize first letter for display
            div.innerText = s.charAt(0).toUpperCase() + s.slice(1); 
            div.onclick = function() {
                document.getElementById('search-input').value = this.innerText;
                list.innerHTML = '';
                searchLeaderboard();
            };
            list.appendChild(div);
        });
    }
}

// Leaderboard Logic
function renderLeaderboardList(arr) {
    const list = document.getElementById('leaderboard-list');
    list.innerHTML = '';
    arr.forEach((item, index) => {
        list.innerHTML += `
            <div class="lb-item">
                <span>#${index+1} ${item.player}</span>
                <span>${item.score} pts</span>
            </div>
        `;
    });
}

function sortLeaderboard(algo) {
    document.getElementById('btn-quick').classList.remove('active-toggle');
    document.getElementById('btn-bubble').classList.remove('active-toggle');
    document.getElementById('btn-'+algo).classList.add('active-toggle');
    
    let data = scoreBST.toArray();
    let sorted = algo === 'quick' ? quickSort(data, 'score', true) : bubbleSort(data, 'score', false);
    renderLeaderboardList(sorted);
}

function searchLeaderboard() {
    let input = document.getElementById('search-input').value;
    document.getElementById('autocomplete-list').innerHTML = ''; // close suggestions
    if (!input) {
        sortLeaderboard('quick');
        return;
    }
    let data = scoreBST.toArray();
    let result = binarySearch(data, input);
    renderLeaderboardList(result);
}


// ==========================================
// PATHFINDER CHALLENGE LOGIC
// ==========================================
function generateGraphLevel(level) {
    pfLevel = level;
    pfGraph = new Graph();
    pfPlayerPath = [];
    document.getElementById('player-route-display').innerText = 'None';
    document.getElementById('player-cost-display').innerText = '0';
    document.getElementById('pathfinder-feedback').innerText = '';
    
    pfNodes = [
        { id: 'A', x: 10, y: 50 },
        { id: 'B', x: 40, y: 20 },
        { id: 'C', x: 40, y: 80 },
        { id: 'D', x: 70, y: 20 },
        { id: 'E', x: 70, y: 80 },
        { id: 'F', x: 90, y: 50 }
    ];
    pfNodes.forEach(n => pfGraph.addVertex(n.id));
    
    pfStartNode = 'A';
    pfTargetNode = 'F';
    
    // Define base connections (Directed Acyclic Graph so no negative cycles possible)
    let connections = [
        ['A', 'B'], ['A', 'C'],
        ['B', 'C'], ['B', 'D'],
        ['C', 'D'], ['C', 'E'],
        ['D', 'E'], ['D', 'F'],
        ['E', 'F']
    ];
    
    if (level === 1) {
        document.getElementById('pathfinder-subtitle').innerText = "Level 1: Find Shortest Path from A to F (Move Left → Right)";
        connections.forEach(conn => {
            let weight = Math.floor(Math.random() * 8) + 2; // Random weight 2-9
            pfGraph.addEdge(conn[0], conn[1], weight);
        });
    } else {
        document.getElementById('pathfinder-subtitle').innerText = "Level 2: Negative Edge! Find Path from A to F (Move Left → Right)";
        
        // Pick one random edge to be the negative "Wormhole"
        let negativeEdgeIndex = Math.floor(Math.random() * connections.length);
        
        connections.forEach((conn, index) => {
            if (index === negativeEdgeIndex) {
                let negWeight = -1 * (Math.floor(Math.random() * 4) + 1); // Random negative weight -1 to -4
                pfGraph.addEdge(conn[0], conn[1], negWeight);
            } else {
                let weight = Math.floor(Math.random() * 8) + 2; // Random weight 2-9
                pfGraph.addEdge(conn[0], conn[1], weight);
            }
        });
    }
    
    renderGraphVisuals();
    pfPlayerPath.push('A'); // Automatically start at A
    updatePlayerPathUI();
}

function renderGraphVisuals() {
    const nodeContainer = document.getElementById('graph-nodes-container');
    const svgEdges = document.getElementById('graph-edges');
    nodeContainer.innerHTML = '';
    svgEdges.innerHTML = '';
    
    // Draw Edges
    pfGraph.edges.forEach(edge => {
        let n1 = pfNodes.find(n => n.id === edge.u);
        let n2 = pfNodes.find(n => n.id === edge.v);
        
        let line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('id', 'edge-' + edge.u + '-' + edge.v);
        line.setAttribute('class', 'graph-edge-line');
        line.setAttribute('data-negative', edge.weight < 0 ? 'true' : 'false');
        line.setAttribute('x1', n1.x + '%');
        line.setAttribute('y1', n1.y + '%');
        line.setAttribute('x2', n2.x + '%');
        line.setAttribute('y2', n2.y + '%');
        line.setAttribute('stroke', edge.weight < 0 ? 'var(--accent-color)' : 'rgba(255,255,255,0.3)');
        line.setAttribute('stroke-width', edge.weight < 0 ? '4' : '2');
        line.style.transition = "0.3s";
        svgEdges.appendChild(line);
        
        let text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', ((n1.x + n2.x) / 2) + '%');
        text.setAttribute('y', ((n1.y + n2.y) / 2) - 2 + '%');
        text.setAttribute('class', 'edge-label');
        text.textContent = edge.weight;
        svgEdges.appendChild(text);
    });
    
    // Draw Nodes
    pfNodes.forEach(n => {
        let nodeDiv = document.createElement('div');
        nodeDiv.className = 'graph-node';
        nodeDiv.id = 'node-' + n.id;
        nodeDiv.style.left = n.x + '%';
        nodeDiv.style.top = n.y + '%';
        nodeDiv.innerText = n.id;
        nodeDiv.onclick = () => onNodeClick(n.id);
        nodeContainer.appendChild(nodeDiv);
    });
}

function onNodeClick(nodeId) {
    let lastNode = pfPlayerPath[pfPlayerPath.length - 1];
    
    if (pfPlayerPath.includes(nodeId)) {
        alert("You cannot revisit nodes!");
        return;
    }
    
    let isConnected = pfGraph.edges.some(e => e.u === lastNode && e.v === nodeId);
    if (!isConnected) {
        alert("Invalid move! You can only move along directed edges (Left → Right).");
        return;
    }
    
    pfPlayerPath.push(nodeId);
    updatePlayerPathUI();
}

function updatePlayerPathUI() {
    let cost = 0;
    
    // Reset edge colors
    document.querySelectorAll('.graph-edge-line').forEach(el => {
        let isNegative = el.getAttribute('data-negative') === 'true';
        el.setAttribute('stroke', isNegative ? 'var(--accent-color)' : 'rgba(255,255,255,0.3)');
    });
    
    for(let i = 0; i < pfPlayerPath.length - 1; i++) {
        let u = pfPlayerPath[i];
        let v = pfPlayerPath[i+1];
        let edge = pfGraph.edges.find(e => e.u === u && e.v === v);
        if (edge) cost += edge.weight;
        
        let line = document.getElementById('edge-' + u + '-' + v);
        if (line) line.setAttribute('stroke', 'var(--secondary-color)');
    }
    
    document.getElementById('player-route-display').innerText = pfPlayerPath.join(' → ');
    document.getElementById('player-cost-display').innerText = cost;
    
    document.querySelectorAll('.graph-node').forEach(el => el.classList.remove('selected', 'correct'));
    pfPlayerPath.forEach(id => {
        document.getElementById('node-' + id).classList.add('selected');
    });
}

function resetPlayerPath() {
    pfPlayerPath = [pfStartNode];
    updatePlayerPathUI();
    document.getElementById('pathfinder-feedback').innerText = '';
}

function submitPlayerPath() {
    if (pfPlayerPath[pfPlayerPath.length - 1] !== pfTargetNode) {
        alert("Your route must end at node " + pfTargetNode + "!");
        return;
    }
    
    let result = pfLevel === 1 ? dijkstra(pfGraph, pfStartNode) : bellmanFord(pfGraph, pfStartNode);
    let algoName = pfLevel === 1 ? "Dijkstra" : "Bellman-Ford";
    
    let trueCost = result.distances[pfTargetNode];
    let truePath = [];
    let curr = pfTargetNode;
    while (curr !== null) {
        truePath.unshift(curr);
        curr = result.prev[curr];
    }
    
    let playerCost = parseInt(document.getElementById('player-cost-display').innerText);
    let fb = document.getElementById('pathfinder-feedback');
    
    if (playerCost === trueCost) {
        fb.innerHTML = `<span class="pop">SUCCESS!</span> ${algoName} confirms cost is ${trueCost}. You earned 50 Points!`;
        score += 50;
        
        setTimeout(() => {
            if(pfLevel === 1) {
                alert("Awesome! Let's try Level 2 with a Negative Edge!");
                generateGraphLevel(2);
            } else {
                alert("You've mastered the Pathfinder Minigame!");
                goHome();
            }
        }, 3000);
    } else {
        fb.innerHTML = `<span class="shake">FAILED!</span> Your cost: ${playerCost}. ${algoName} found shorter cost: ${trueCost}. Path: ${truePath.join(' → ')}`;
        
        // Highlight correct path in UI
        document.querySelectorAll('.graph-node').forEach(el => el.classList.remove('selected', 'correct'));
        truePath.forEach(id => document.getElementById('node-' + id).classList.add('correct'));
        
        document.querySelectorAll('.graph-edge-line').forEach(el => {
            let isNegative = el.getAttribute('data-negative') === 'true';
            el.setAttribute('stroke', isNegative ? 'var(--accent-color)' : 'rgba(255,255,255,0.3)');
        });
        
        for(let i = 0; i < truePath.length - 1; i++) {
            let u = truePath[i];
            let v = truePath[i+1];
            let line = document.getElementById('edge-' + u + '-' + v);
            if (line) line.setAttribute('stroke', '#00b894');
        }
    }
}

// Game Core Logic
function startGame(mode) {
    gameMode = mode;
    score = 0;
    time = mode === 'city' ? 60 : 30;
    historyStack.clear();
    seenQuestionsFilter = new BloomFilter(); // Reset filter for new game
    performanceTracker = new PerformanceTracker(); // Reset tracking
    
    updateHUD();
    loadNextQuestion();
    showScreen('game-screen');
    
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        time--;
        updateHUD();
        if (time <= 0) {
            endGame();
        }
    }, 1000);
}

function fillPriorityQueue() {
    let targetDiff = Math.min(10, Math.floor(score / 20) + 1);
    
    questionPQ = new PriorityQueue((a, b) => {
        if (score < 50) return a.diff < b.diff; // Min-Heap
        else return a.diff > b.diff; // Max-Heap
    });
    
    let availableQuestions = [];
    activeCategories.forEach(cat => {
        if (cat === 'Math') return;
        let bank = questionDB.get(cat);
        if (bank && bank.length > 0) availableQuestions.push(...bank.map(q => ({...q, cat: cat})));
    });
    
    let added = 0;
    let attempts = 0;
    while(added < 10 && attempts < 50) {
        attempts++;
        
        let randCat = activeCategories[Math.floor(Math.random() * activeCategories.length)];
        
        if (randCat === 'Math') {
            let mDiff = Math.max(1, Math.min(10, targetDiff + Math.floor(Math.random()*3 - 1)));
            let mathQ = generateMathQuestion(mDiff);
            if (!seenQuestionsFilter.mightContain(mathQ.q)) {
                questionPQ.enqueue({ ...mathQ, cat: 'Math' });
                seenQuestionsFilter.add(mathQ.q);
                added++;
            }
        } else {
            let specificBank = availableQuestions.filter(q => q.cat === randCat);
            if (specificBank.length > 0) {
                let picked = specificBank[Math.floor(Math.random() * specificBank.length)];
                if (!seenQuestionsFilter.mightContain(picked.q)) {
                    questionPQ.enqueue(picked);
                    seenQuestionsFilter.add(picked.q);
                    added++;
                }
            }
        }
    }
}

function loadNextQuestion() {
    if (!questionPQ || questionPQ.isEmpty()) fillPriorityQueue();
    currentQuestion = questionPQ.dequeue();
    
    document.getElementById('q-category').innerText = currentQuestion.cat;
    document.getElementById('diff-display').innerText = currentQuestion.diff;
    
    let qText = currentQuestion.q;
    if (gameMode === 'city') {
        qText = `(Route: ${currentPath[routeIndex-1]} &rarr; ${currentPath[routeIndex]}) ` + qText;
    }
    document.getElementById('question-text').innerText = qText;
    
    let optContainer = document.getElementById('options-container');
    optContainer.innerHTML = '';
    
    currentQuestion.options.forEach(opt => {
        let btn = document.createElement('button');
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(opt, btn);
        optContainer.appendChild(btn);
    });
}

function checkAnswer(selectedOpt, btnElement) {
    let isCorrect = selectedOpt === currentQuestion.a;
    let fb = document.getElementById('feedback-msg');
    
    historyStack.push({
        score: score,
        time: time,
        question: currentQuestion
    });
    
    performanceTracker.record(currentQuestion.subTopic, isCorrect);
    
    if (isCorrect) {
        fb.innerText = "CORRECT!";
        fb.className = "feedback pop";
        score += 10;
        time += 3;
        btnElement.style.background = "#00b894";
    } else {
        fb.innerText = "WRONG!";
        fb.className = "feedback shake";
        score -= 5;
        btnElement.style.background = "#d63031";
    }
    
    setTimeout(() => { fb.innerText = ""; }, 500);
    updateHUD();
    
    setTimeout(() => {
        if (gameMode === 'city' && isCorrect) {
            routeIndex++;
            if (routeIndex >= currentPath.length) {
                alert(`You reached ${targetCity}! Travel Complete! Bonus 50 Points.`);
                score += 50;
                currentCity = targetCity;
                endGame();
                return;
            }
        }
        loadNextQuestion();
    }, 600);
}

function useUndo() {
    if (historyStack.isEmpty()) {
        alert("Stack is empty! Cannot undo.");
        return;
    }
    
    let prevState = historyStack.pop();
    score = prevState.score;
    time = prevState.time;
    currentQuestion = prevState.question;
    
    document.getElementById('q-category').innerText = currentQuestion.cat;
    document.getElementById('diff-display').innerText = currentQuestion.diff;
    document.getElementById('question-text').innerText = currentQuestion.q + " (Undone)";
    
    let optContainer = document.getElementById('options-container');
    optContainer.innerHTML = '';
    currentQuestion.options.forEach(opt => {
        let btn = document.createElement('button');
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(opt, btn);
        optContainer.appendChild(btn);
    });
    
    if (gameMode === 'city') {
        if(routeIndex > 1) routeIndex--;
    }
    
    updateHUD();
}

function updateHUD() {
    document.getElementById('score-display').innerText = score;
    document.getElementById('time-display').innerText = time;
    document.getElementById('stack-count').innerText = `(${historyStack.size()})`;
    document.getElementById('time-display').style.color = time < 10 ? '#ff7675' : 'white';
}

function quitGame() {
    endGame();
}

function endGame() {
    clearInterval(timerInterval);
    document.getElementById('game-over-modal').classList.add('active');
    document.getElementById('go-score').innerText = score;
    
    let weakPoints = performanceTracker.getWeakPoints();
    let fbElement = document.getElementById('performance-feedback');
    if (weakPoints.length > 0) {
        fbElement.innerText = `Feedback: You need to study more on: ${weakPoints.join(', ')}.`;
    } else if (score > 0) {
        fbElement.innerText = "Feedback: Great job! You have no major weak points!";
    } else {
        fbElement.innerText = "Feedback: Keep practicing to improve your skills!";
    }
}

function saveScore() {
    let name = document.getElementById('player-name').value;
    if (!name) name = "Unknown";
    
    scoreBST.insert(name, score);
    nameTrie.insert(name); // Add to Trie for future autocomplete
    
    document.getElementById('game-over-modal').classList.remove('active');
    openLeaderboard();
}