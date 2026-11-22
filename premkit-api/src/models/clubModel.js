import { supabase } from "../config/supabaseClient.js";

export const ClubModel = {
    async getAll() {
        const { data, error } = await supabase
            .from("clubs")
            .select("*, jerseys ( id, title, season, kit_type, manufacturer, image_url )")
            .order("name", { ascending: true });
        if (error) throw error;
        return data;
    },

    async getById(id) {
        const { data, error } = await supabase
            .from("clubs")
            .select("*, jerseys ( * )")
            .eq("id", id)
            .single();
        if (error) throw error;
        return data;
    },

    async create(payload) {
        const { data, error } = await supabase
            .from("clubs")
            .insert([payload])
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async update(id, payload) {
        const { data, error } = await supabase
            .from("clubs")
            .update(payload)
            .eq("id", id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async remove(id) {
        const { error } = await supabase.from("clubs").delete().eq("id", id);
        if (error) throw error;
        return { message: "Club deleted successfully" };
    },
};