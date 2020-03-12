const express = require("express");

const shortid = require("shortid");

const server = express();

let users = [];

server.listen(4000, () => {
    console.log('***Server listeing on port 4000***');
});

server.use(express.json());

// gets blank users array from index
server.get("/api/users", (req, res) => {
    res.status(200).json(users);
});

server.post("/api/users", (req, res) => {
    const userInfo = req.body;

    userInfo.id = shortid.generate();

    users.push(userInfo);
    
    if (userInfo && userInfo.id) {
        res.status(201).json({ success: true, message: 'user created' });
    } else if (!userInfo) {
        res.status(400).json({ success: false, errorMessage: 'Please provide name and bio for the user.' });
    } else {
        res.status(500).json({ success: false, errorMessage: 'There was an error while saving the user to the database' });
    }
});

server.delete("/api/users/:id", (req, res) => {
    const { id } = req.params;

    const deleted = users.find(user => user.id === id);

    if (deleted) {
        users = users.filter(user => user.id !== id);

        res.status(200).json(deleted);
    } 
        else if (!deleted) {
        users = users.filter(user => user.id !== id);
 
        res.status(404).json({ success: false, message: 'user id not found' });
    } 
      else {
        res.status(500).json({ success: false, errorMessage: 'user could not be deleted' });
    }
});

server.patch("/api/users/:id", (req, res) => {
    const { id } = req.params;
    const changes = req.body;

    let found = users.find(user => user.id === id);

    if (found) {
        Object.assign(found, changes);
        res.status(200).json(found);
    } else if (!found) {
        res.status(404).json({ success: false, message: 'user id not found' });
    } else if (!changes) {
        res.status(400).json({ success: false, message: 'Please provide name and bio for the user'})
    }
      else {
        res.status(500).json({ success: false, errorMessage: 'The user info could not be modified'})
    }
});

server.get("/api/users/:id", (req, res) => {
    const { id } = req.params;

    const found = users.find(user => user.id === id);

    if (found) {
        res.status(200).json(found);
    } else {
        res.status(404).json({ success: false, message: 'user id not found'});
    }
});