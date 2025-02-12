// script.js

// Array to hold processes
let processes = [];

// Process constructor
class Process {
    constructor(id, arrivalTime, burstTime, priority = 0) {
        this.id = id;
        this.arrivalTime = arrivalTime;
        this.burstTime = burstTime;
        this.priority = priority;
        this.remainingTime = burstTime;
        this.waitingTime = 0;
        this.turnaroundTime = 0;
    }
}

// Function to add process
function addProcess() {
    const arrivalTime = parseInt(document.getElementById('arrivalTime').value);
    const burstTime = parseInt(document.getElementById('burstTime').value);
    const priority = parseInt(document.getElementById('priority').value) || 0;
    const id = processes.length + 1;
    processes.push(new Process(id, arrivalTime, burstTime, priority));
    alert(`Process ${id} added!`);
}

// Function to run scheduler based on selected algorithm
function runScheduler(algorithm) {
    switch (algorithm) {
        case 'fcfs':
            fcfsScheduling();
            break;
        case 'sjf':
            sjfScheduling();
            break;
        case 'srtf':
            srtfScheduling();
            break;
        case 'rr':
            roundRobinScheduling();
            break;
    }
    displayResults();
}

// FCFS Algorithm
function fcfsScheduling() {
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
    let currentTime = 0;

    processes.forEach((process) => {
        if (currentTime < process.arrivalTime) {
            currentTime = process.arrivalTime;
        }
        process.waitingTime = currentTime - process.arrivalTime;
        currentTime += process.burstTime;
        process.turnaroundTime = process.waitingTime + process.burstTime;
    });
}

// SJF Algorithm (Non-preemptive)
function sjfScheduling() {
    let currentTime = 0;
    const completed = [];

    while (completed.length < processes.length) {
        const availableProcesses = processes.filter(p => p.arrivalTime <= currentTime && !completed.includes(p));
        if (availableProcesses.length > 0) {
            const shortestProcess = availableProcesses.reduce((prev, curr) => prev.burstTime < curr.burstTime ? prev : curr);
            shortestProcess.waitingTime = currentTime - shortestProcess.arrivalTime;
            currentTime += shortestProcess.burstTime;
            shortestProcess.turnaroundTime = shortestProcess.waitingTime + shortestProcess.burstTime;
            completed.push(shortestProcess);
        } else {
            currentTime++;
        }
    }
}

// SRTF Algorithm (Preemptive SJF)
function srtfScheduling() {
    let currentTime = 0;
    const completed = [];
    let ongoingProcess = null;

    while (completed.length < processes.length) {
        const availableProcesses = processes.filter(p => p.arrivalTime <= currentTime && !completed.includes(p));
        
        if (availableProcesses.length > 0) {
            ongoingProcess = availableProcesses.reduce((prev, curr) => prev.remainingTime < curr.remainingTime ? prev : curr);
            ongoingProcess.remainingTime--;
            if (ongoingProcess.remainingTime === 0) {
                ongoingProcess.turnaroundTime = currentTime - ongoingProcess.arrivalTime + 1;
                ongoingProcess.waitingTime = ongoingProcess.turnaroundTime - ongoingProcess.burstTime;
                completed.push(ongoingProcess);
            }
        }
        currentTime++;
    }
}

// Round Robin Algorithm
function roundRobinScheduling() {
    const timeQuantum = parseInt(document.getElementById('timeQuantum').value);
    let currentTime = 0;
    const queue = [...processes];
    
    while (queue.length > 0) {
        const process = queue.shift();
        if (process.arrivalTime <= currentTime) {
            if (process.remainingTime > timeQuantum) {
                currentTime += timeQuantum;
                process.remainingTime -= timeQuantum;
                queue.push(process);
            } else {
                currentTime += process.remainingTime;
                process.remainingTime = 0;
                process.turnaroundTime = currentTime - process.arrivalTime;
                process.waitingTime = process.turnaroundTime - process.burstTime;
            }
        } else {
            queue.push(process);
            currentTime++;
        }
    }
}

// Function to display results in table
function displayResults() {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    processes.forEach(process => {
        const row = `<tr>
            <td>${process.id}</td>
            <td>${process.arrivalTime}</td>
            <td>${process.burstTime}</td>
            <td>${process.waitingTime}</td>
            <td>${process.turnaroundTime}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}
