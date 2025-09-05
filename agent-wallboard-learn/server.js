const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

let agents = [
   {
    code: "A001",        // รหัส Agent
    name: "Pakin",         // เติมคิดเอง
    status: "Available",       // เติมคิดเอง  
    loginTime: new Date()
   },
   {
    code: "A002",        // รหัส Agent
    name: "Alex",         // เติมคิดเอง
    status: "Wrap up",       // เติมคิดเอง  
    loginTime: new Date()
   },
   {
    code: "A003",        // รหัส Agent
    name: "Jeny",         // เติมคิดเอง
    status: "Active",       // เติมคิดเอง  
    loginTime: new Date()
   },
];

app.use(express.json());
app.use(cors());

//URL: http://localhost:3001/api/agents/A001/status
app.patch('/api/agents/:code/status', (req, res) => {
    // Step 1
    const agentCode = req.params.code; // เติม

    // Step 2
    const newStatus = req.body.status; // เติม
    
    console.log('Agent Code:', agentCode);
    console.log('New Status:', newStatus);
    //console.log(`[${new Date().toISOString()}] Agent ${agentCode}: ${oldStatus} → ${newStatus}`);

    // Step 3
    const agent = agents.find(a => a.code === agentCode);
    
    console.log('found agent:', agent);

    // Step 4
    if (!agent) {
        return res.status(404).json({
            success: false,
            error: "Agent not found"
        });
    }

     // Step 5
    const validStatuses = ["Available", "Active", "Wrap Up", "Not Ready", "Offline"];
    if (!validStatuses.includes(newStatus)) {
        return res.status(400).json({
            success: false,
            error: "Invalid status",
            validStatuses: validStatuses
        });
    }  
    
    // Step 6
    const oldStatus = agent.status;

    // Step 7
    agent.status = newStatus;
    agent.lastStatusChange = new Date();
    
    console.log('current agent :', agent);

    // Step 8
    res.json({
        success: true,
        message: `Agent ${agentCode} status changed from ${oldStatus} to ${newStatus}`,
        data: agent
    });


});


app.get('/api/agents', (req, res) => {
   
    res.json({
        success: true,     // เติม true/false
        data: agents,        // เติม agents หรือไม่?
        count: agents.length,       // เติมจำนวน agents
        timestamp: new Date().toISOString()    // เติมเวลาปัจจุบัน
    });

});

app.get('/api/agents/count', (req, res) => {
   
    res.json({
        success: true,     // เติม true/false
        count: agents.length,       // เติมจำนวน agents
        timestamp: new Date().toISOString()    // เติมเวลาปัจจุบัน
    });

});


app.get('/', (req, res) => {
    res.send(`Hello Agent Wallboard!`);
});

app.get('/hello', (req, res) => {
    res.send(`Hello สวัสดี!`);
});

app.get('/health', (req, res) => {
    res.send({ 
        status: 'OK', 
        timestamp: new Date().toISOString() 
    });
});

// Agent Login API
app.post('/api/agents/:code/login', (req, res) => {
    const agentCode = req.params.code;
    const { name } = req.body;

    let agent = agents.find(a => a.code === agentCode);

    if (!agent) {
        agent = {
            code: agentCode,
            name: name || `Agent-${agentCode}`,
            status: "Available",
            loginTime: new Date()
        };
        agents.push(agent);
    } else {
        agent.name = name || agent.name;
        agent.status = "Available";
        agent.loginTime = new Date();
    }

    res.json({
        success: true,
        message: `Agent ${agentCode} logged in successfully`,
        data: agent
    });
});

// Agent Logout API
app.post('/api/agents/:code/logout', (req, res) => {
    const agentCode = req.params.code;
    const agent = agents.find(a => a.code === agentCode);

    if (!agent) {
        return res.status(404).json({
            success: false,
            error: "Agent not found"
        });
    }

    agent.status = "Offline";
    delete agent.loginTime;

    res.json({
        success: true,
        message: `Agent ${agentCode} logged out successfully`,
        data: agent
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});