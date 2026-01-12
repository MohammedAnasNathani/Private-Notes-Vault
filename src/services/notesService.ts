import { supabase } from '../lib/supabase';
import type { Note } from '../types';

export const notesService = {
    async getNotes(): Promise<Note[]> {
        const { data, error } = await supabase
            .from('notes')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    async getNote(id: string): Promise<Note | null> {
        const { data, error } = await supabase
            .from('notes')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    async createNote(title: string, content: string): Promise<Note> {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('notes')
            .insert([{ title, content, user_id: user.id }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async updateNote(id: string, title: string, content: string): Promise<Note> {
        const { data, error } = await supabase
            .from('notes')
            .update({ title, content })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async deleteNote(id: string): Promise<void> {
        const { error } = await supabase
            .from('notes')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },
};
