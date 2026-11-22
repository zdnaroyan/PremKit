import { ClubModel } from "../models/clubModel.js";

export const ClubController = {
    async getAll(req, res) {
        try {
            const clubs = await ClubModel.getAll();
            res.json(clubs);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async getById(req, res) {
        try {
            const club = await ClubModel.getById(req.params.id);
            res.json(club);
        } catch (err) {
            res.status(404).json({ error: err.message });
        }
    },

    async create(req, res) {
        try {
            const club = await ClubModel.create(req.body);
            res.status(201).json(club);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async update(req, res) {
        try {
            const club = await ClubModel.update(req.params.id, req.body);
            res.json(club);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async remove(req, res) {
        try {
            const result = await ClubModel.remove(req.params.id);
            res.json(result);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },
};