import { JerseyModel } from "../models/jerseyModel.js";

export const JerseyController = {
    async getAll(req, res) {
        try {
            const jerseys = await JerseyModel.getAll();
            res.json(jerseys);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async getById(req, res) {
        try {
            const jersey = await JerseyModel.getById(req.params.id);
            res.json(jersey);
        } catch (err) {
            res.status(404).json({ error: err.message });
        }
    },

    async create(req, res) {
        try {
            const jersey = await JerseyModel.create(req.body);
            res.status(201).json(jersey);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async update(req, res) {
        try {
            const jersey = await JerseyModel.update(req.params.id, req.body);
            res.json(jersey);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async remove(req, res) {
        try {
            const result = await JerseyModel.remove(req.params.id);
            res.json(result);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },
};