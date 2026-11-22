import { supabase } from "../config/supabaseClient.js";

export const JerseyModel = {
    async getAll() {
        const { data, error } = await supabase
            .from("jerseys")
            .select("*, clubs ( id, name, nickname, stadium, primary_color, logo_url )")
            .order("season", { ascending: true });
        if (error) throw error;
        return data;
    },

    async getById(id) {
        const { data, error } = await supabase
            .from("jerseys")
            .select("*, clubs ( * )")
            .eq("id", id)
            .single();
        if (error) throw error;
        return data;
    },

    async create(payload) {
        const { data, error } = await supabase
            .from("jerseys")
            .insert([payload])
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async update(id, payload) {
        const { data, error } = await supabase
            .from("jerseys")
            .update(payload)
            .eq("id", id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async remove(id) {
        const { error } = await supabase.from("jerseys").delete().eq("id", id);
        if (error) throw error;
        return { message: "Jersey deleted successfully" };
    },
};